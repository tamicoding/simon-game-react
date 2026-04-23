import { useCallback, useEffect, useRef, useState } from "react";
import {
  BUTTON_COLORS,
  COLOR_KEYS,
  DIFFICULTY_LEVELS,
  GAME_STATUS,
} from "../constants/game";

const HIGH_SCORE_STORAGE_KEY = "simon-game-high-score";
const SOUND_ENABLED_STORAGE_KEY = "simon-game-sound-enabled";
const DIFFICULTY_STORAGE_KEY = "simon-game-difficulty";
const LEADERBOARD_STORAGE_KEY = "simon-game-leaderboard";

function getRandomColor() {
  return BUTTON_COLORS[Math.floor(Math.random() * BUTTON_COLORS.length)];
}

function getStoredNumber(key) {
  const storedValue = window.localStorage.getItem(key);

  if (!storedValue) {
    return 0;
  }

  const parsedValue = Number(storedValue);

  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : 0;
}

function getStoredBoolean(key, fallbackValue = true) {
  const storedValue = window.localStorage.getItem(key);

  if (storedValue === null) {
    return fallbackValue;
  }

  return storedValue === "true";
}

function getStoredValue(key, fallbackValue) {
  return window.localStorage.getItem(key) ?? fallbackValue;
}

function getStoredLeaderboard() {
  const storedValue = window.localStorage.getItem(LEADERBOARD_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(storedValue);

    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

export function useSimonGame() {
  const [status, setStatus] = useState(GAME_STATUS.IDLE);
  const [level, setLevel] = useState(0);
  const [highScore, setHighScore] = useState(() => getStoredNumber(HIGH_SCORE_STORAGE_KEY));
  const [difficulty, setDifficulty] = useState(() =>
    getStoredValue(DIFFICULTY_STORAGE_KEY, DIFFICULTY_LEVELS.normal.id),
  );
  const [leaderboard, setLeaderboard] = useState(() => getStoredLeaderboard());
  const [soundEnabled, setSoundEnabled] = useState(() =>
    getStoredBoolean(SOUND_ENABLED_STORAGE_KEY, true),
  );
  const [gamePattern, setGamePattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [pressed, setPressed] = useState(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);

  const audioCacheRef = useRef({});
  const pulseIdRef = useRef(0);
  const timeoutsRef = useRef([]);
  const currentSettings = DIFFICULTY_LEVELS[difficulty] ?? DIFFICULTY_LEVELS.normal;

  const started = status === GAME_STATUS.PLAYING;

  function scheduleTimeout(callback, delay) {
    const timeoutId = window.setTimeout(callback, delay);
    timeoutsRef.current.push(timeoutId);
    return timeoutId;
  }

  function clearScheduledTimeouts() {
    timeoutsRef.current.forEach(window.clearTimeout);
    timeoutsRef.current = [];
  }

  function persistHighScore(nextHighScore) {
    setHighScore(nextHighScore);
    window.localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(nextHighScore));
  }

  const resetGameState = useCallback((nextStatus = GAME_STATUS.IDLE) => {
    clearScheduledTimeouts();
    setPressed(null);
    setStatus(nextStatus);
    setLevel(0);
    setGamePattern([]);
    setUserPattern([]);
    setIsPlayingSequence(false);
  }, []);

  function persistLeaderboard(nextEntry) {
    setLeaderboard((currentLeaderboard) => {
      const nextLeaderboard = [...currentLeaderboard, nextEntry]
        .sort((firstEntry, secondEntry) => {
          if (secondEntry.score !== firstEntry.score) {
            return secondEntry.score - firstEntry.score;
          }

          return secondEntry.timestamp - firstEntry.timestamp;
        })
        .slice(0, 5);

      window.localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(nextLeaderboard));
      return nextLeaderboard;
    });
  }

  const playSound = useCallback((sound) => {
    if (!soundEnabled) {
      return;
    }

    const cachedAudio =
      audioCacheRef.current[sound] ?? new Audio(`/sounds/${sound}.mp3`);

    audioCacheRef.current[sound] = cachedAudio;
    cachedAudio.currentTime = 0;
    void cachedAudio.play().catch(() => {});
  }, [soundEnabled]);

  const flash = useCallback((color) => {
    const nextPulseId = pulseIdRef.current + 1;
    pulseIdRef.current = nextPulseId;

    setPressed(null);

    scheduleTimeout(() => {
      setPressed({ color, pulseId: nextPulseId });
      playSound(color);

      scheduleTimeout(() => {
        setPressed((current) =>
          current?.pulseId === nextPulseId ? null : current,
        );
      }, currentSettings.flashDurationMs);
    }, 20);
  }, [currentSettings.flashDurationMs, playSound]);

  const addStep = useCallback(() => {
    const nextColor = getRandomColor();

    setIsPlayingSequence(true);
    setGamePattern((currentPattern) => [...currentPattern, nextColor]);
    setUserPattern([]);
    setLevel((currentLevel) => {
      const nextLevel = currentLevel + 1;

      if (nextLevel > highScore) {
        persistHighScore(nextLevel);
      }

      return nextLevel;
    });
  }, [highScore]);

  const startGame = useCallback(() => {
    clearScheduledTimeouts();
    setPressed(null);
    setStatus(GAME_STATUS.PLAYING);
    setLevel(0);
    setGamePattern([]);
    setUserPattern([]);
    setIsPlayingSequence(false);

    scheduleTimeout(addStep, currentSettings.startDelayMs);
  }, [addStep, currentSettings.startDelayMs]);

  const gameOver = useCallback((reachedLevel) => {
    resetGameState(GAME_STATUS.OVER);
    setLevel(reachedLevel);
    playSound("wrong");

    if (reachedLevel > 0) {
      persistLeaderboard({
        difficulty,
        score: reachedLevel,
        timestamp: Date.now(),
      });
    }

    document.body.classList.add("game-over");
    scheduleTimeout(() => document.body.classList.remove("game-over"), 200);
  }, [difficulty, playSound, resetGameState]);

  const handlePadClick = useCallback((color) => {
    if (!started || isPlayingSequence) {
      return;
    }

    flash(color);

    setUserPattern((currentUserPattern) => {
      const nextUserPattern = [...currentUserPattern, color];
      const currentIndex = nextUserPattern.length - 1;

      if (nextUserPattern[currentIndex] !== gamePattern[currentIndex]) {
        gameOver(level);
        return [];
      }

      if (nextUserPattern.length === gamePattern.length) {
        scheduleTimeout(addStep, currentSettings.roundDelayMs);
      }

      return nextUserPattern;
    });
  }, [
    addStep,
    currentSettings.roundDelayMs,
    flash,
    gameOver,
    gamePattern,
    isPlayingSequence,
    level,
    started,
  ]);

  const handleColorKeyPress = useCallback((key) => {
    const mappedColor = COLOR_KEYS[key.toLowerCase()];

    if (!mappedColor) {
      return false;
    }

    handlePadClick(mappedColor);
    return true;
  }, [handlePadClick]);

  useEffect(() => {
    if (!started || gamePattern.length === 0) {
      return undefined;
    }

    gamePattern.forEach((color, index) => {
      scheduleTimeout(() => {
        flash(color);

        if (index === gamePattern.length - 1) {
          scheduleTimeout(
            () => setIsPlayingSequence(false),
            currentSettings.flashDurationMs + 100,
          );
        }
      }, currentSettings.stepIntervalMs * index);
    });

    return undefined;
  }, [currentSettings.flashDurationMs, currentSettings.stepIntervalMs, flash, gamePattern, started]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (started && handleColorKeyPress(event.key)) {
        return;
      }

      if (!started) {
        startGame();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleColorKeyPress, startGame, started]);

  useEffect(() => {
    return () => {
      clearScheduledTimeouts();
      document.body.classList.remove("game-over");
    };
  }, []);

  function toggleSound() {
    setSoundEnabled((currentValue) => {
      const nextValue = !currentValue;

      window.localStorage.setItem(SOUND_ENABLED_STORAGE_KEY, String(nextValue));
      return nextValue;
    });
  }

  function changeDifficulty(nextDifficulty) {
    if (!DIFFICULTY_LEVELS[nextDifficulty] || nextDifficulty === difficulty) {
      return;
    }

    window.localStorage.setItem(DIFFICULTY_STORAGE_KEY, nextDifficulty);
    setDifficulty(nextDifficulty);
    resetGameState(GAME_STATUS.IDLE);
  }

  return {
    changeDifficulty,
    difficulty,
    handlePadClick,
    highScore,
    isPlayingSequence,
    level,
    leaderboard,
    pressed,
    sequenceLength: gamePattern.length,
    soundEnabled,
    startGame,
    started,
    status,
    toggleSound,
    userPatternLength: userPattern.length,
  };
}
