import { useState } from "react";
import Header from "./components/Header";
import GameBoard from "./components/GameBoard";
import Footer from "./components/Footer";
import StartButton from "./components/StartButton";
import { DIFFICULTY_LEVELS, GAME_STATUS } from "./constants/game";
import { useSimonGame } from "./hooks/useSimonGame";

const copyByLanguage = {
  en: {
    eyebrow: "Memory • Rhythm • Focus",
    subtitle: "A fast-paced memory game with arcade energy.",
    statusIdle: "Press Start or any key to begin.",
    statusPlaying: (level) => `Level ${level}`,
    statusOver: (level) => `Game over. You reached level ${level}.`,
    gameOverTitle: "Game over",
    scoreLabel: "Score",
    highScore: (score) => `Best ${score}`,
    difficultyLabel: "Mode",
    difficulties: {
      easy: "Easy",
      normal: "Normal",
      hard: "Hard",
    },
    leaderboardTitle: "Local leaderboard",
    leaderboardEmpty: "Play a few runs to build your top 5.",
    leaderboardEntry: (index, score, mode) => `${index}. ${score} pts • ${mode}`,
    start: "Start",
    restart: "Restart",
    restartHint: "Missed the pattern? Press Start to try again.",
    soundOn: "Sound on",
    soundOff: "Sound off",
    soundToggle: "Toggle sound",
    keyboardHints: "Keyboard: Q W A S or 1 2 3 4 to trigger the colors.",
    phaseIdle: "Ready to start",
    phaseWatching: "Watching sequence",
    phasePlaying: "Your turn",
    phaseOver: "Round over",
    phaseIdleText: "Start a run and the board will generate the first signal.",
    phaseWatchingText: "Stay sharp and memorize the exact order before touching a pad.",
    phasePlayingText: (current, total) => `Repeat the pattern: ${current} of ${total} inputs entered.`,
    phaseOverText: "You can restart immediately and chase a higher score.",
    tipWatching: "Watch the sequence carefully before clicking.",
    tipWaiting: "Tip: wait for the sequence to finish before repeating it.",
    boardLabel: "Simon game board",
    boardInstructions:
      "Use Tab to enter the board. Then use the arrow keys to move between the colored pads and press Enter or Space to activate one.",
    colorHints: {
      green: "Green pad. Top left.",
      red: "Red pad. Top right.",
      yellow: "Yellow pad. Bottom left.",
      blue: "Blue pad. Bottom right.",
    },
    footer: "Made with love by Tamiris Reis",
    languageLabel: "PT",
    languageCurrent: "EN",
  },
  pt: {
    eyebrow: "Memoria • Ritmo • Foco",
    subtitle: "Um jogo de memoria rapido com energia de arcade.",
    statusIdle: "Clique em Start ou pressione qualquer tecla para comecar.",
    statusPlaying: (level) => `Nivel ${level}`,
    statusOver: (level) => `Fim de jogo. Voce chegou ao nivel ${level}.`,
    gameOverTitle: "Fim de jogo",
    scoreLabel: "Pontuacao",
    highScore: (score) => `Recorde ${score}`,
    difficultyLabel: "Modo",
    difficulties: {
      easy: "Facil",
      normal: "Normal",
      hard: "Dificil",
    },
    leaderboardTitle: "Ranking local",
    leaderboardEmpty: "Jogue algumas partidas para montar o top 5.",
    leaderboardEntry: (index, score, mode) => `${index}. ${score} pts • ${mode}`,
    start: "Iniciar",
    restart: "Reiniciar",
    restartHint: "Errou a sequencia? Clique em Start para tentar de novo.",
    soundOn: "Som ligado",
    soundOff: "Som desligado",
    soundToggle: "Alternar som",
    keyboardHints: "Teclado: Q W A S ou 1 2 3 4 para ativar as cores.",
    phaseIdle: "Pronto para jogar",
    phaseWatching: "Observando sequencia",
    phasePlaying: "Sua vez",
    phaseOver: "Rodada encerrada",
    phaseIdleText: "Inicie o jogo e o tabuleiro vai gerar o primeiro sinal.",
    phaseWatchingText: "Preste atencao e memorize a ordem exata antes de tocar em um bloco.",
    phasePlayingText: (current, total) => `Repita a sequencia: ${current} de ${total} entradas feitas.`,
    phaseOverText: "Voce pode reiniciar na hora e tentar bater o recorde.",
    tipWatching: "Observe a sequencia com cuidado antes de clicar.",
    tipWaiting: "Dica: espere a sequencia terminar antes de repetir.",
    boardLabel: "Tabuleiro do jogo Simon",
    boardInstructions:
      "Use Tab para entrar no tabuleiro. Depois use as setas para navegar entre os blocos coloridos e pressione Enter ou Espaco para ativar um deles.",
    colorHints: {
      green: "Bloco verde. Superior esquerdo.",
      red: "Bloco vermelho. Superior direito.",
      yellow: "Bloco amarelo. Inferior esquerdo.",
      blue: "Bloco azul. Inferior direito.",
    },
    footer: "Feito com carinho por Tamiris Reis",
    languageLabel: "EN",
    languageCurrent: "PT",
  },
};

export default function App() {
  const [language, setLanguage] = useState("en");
  const {
    changeDifficulty,
    difficulty,
    handlePadClick,
    highScore,
    isPlayingSequence,
    level,
    leaderboard,
    pressed,
    sequenceLength,
    soundEnabled,
    startGame,
    started,
    status,
    toggleSound,
    userPatternLength,
  } = useSimonGame();
  const copy = copyByLanguage[language];

  const phase =
    status === GAME_STATUS.OVER
      ? "over"
      : !started
        ? "idle"
        : isPlayingSequence
          ? "watching"
          : "playing";

  const phaseTitle =
    phase === "over"
      ? copy.phaseOver
      : phase === "idle"
        ? copy.phaseIdle
        : phase === "watching"
          ? copy.phaseWatching
          : copy.phasePlaying;

  const phaseText =
    phase === "over"
      ? copy.phaseOverText
      : phase === "idle"
        ? copy.phaseIdleText
        : phase === "watching"
          ? copy.phaseWatchingText
          : copy.phasePlayingText(userPatternLength, sequenceLength);

  const progressRatio =
    sequenceLength > 0 && phase === "playing" ? (userPatternLength / sequenceLength) * 100 : 0;
  const difficultyOptions = Object.keys(DIFFICULTY_LEVELS);

  function toggleLanguage() {
    setLanguage((current) => (current === "en" ? "pt" : "en"));
  }

  return (
    <div className="app">
      <div className="bg-decor" />

      <main className="main">
        <div className="topbar">
          <div className="mode-switch" aria-label={copy.difficultyLabel} role="group">
            {difficultyOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`mode-chip ${difficulty === option ? "is-active" : ""}`}
                onClick={() => changeDifficulty(option)}
              >
                {copy.difficulties[option]}
              </button>
            ))}
          </div>

          <div className="topbar-secondary">
            <button
              type="button"
              className="toggle-pill"
              onClick={toggleSound}
              aria-pressed={soundEnabled}
              aria-label={copy.soundToggle}
            >
              <span className={`toggle-pill__chip ${soundEnabled ? "is-active" : ""}`}>
                {soundEnabled ? copy.soundOn : copy.soundOff}
              </span>
            </button>

            <button
              type="button"
              className="language-switch"
              onClick={toggleLanguage}
              aria-label={`Switch language to ${copy.languageLabel}`}
            >
              <span className="language-chip is-active">{copy.languageCurrent}</span>
              <span className="language-chip">{copy.languageLabel}</span>
            </button>
          </div>
        </div>

        <Header copy={copy} highScore={highScore} status={status} level={level} />

        <section className="game-stage">
          {status !== GAME_STATUS.OVER ? (
            <section
              key={phase}
              className={`game-feedback is-${phase}`}
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="phase-pill">{phaseTitle}</div>
              <p className="phase-text">{phaseText}</p>
              <div className="progress-track" aria-hidden="true">
                <span
                  className="progress-fill"
                  style={{ width: `${progressRatio}%` }}
                />
              </div>
            </section>
          ) : (
            <section className="game-over-card" aria-live="polite" aria-atomic="true">
              <p className="game-over-card__eyebrow">{copy.gameOverTitle}</p>
              <p className="game-over-card__label">{copy.scoreLabel}</p>
              <p className="game-over-card__score">{level}</p>
              <p className="game-over-card__text">{copy.restartHint}</p>
            </section>
          )}

          <div
            className={`board-shell ${status === GAME_STATUS.OVER ? "is-over" : ""} ${
              phase === "watching" ? "is-watching" : ""
            } ${phase === "playing" ? "is-playing" : ""}`}
          >
            <GameBoard
              copy={copy}
              disabled={isPlayingSequence}
              pressed={pressed}
              onPadClick={handlePadClick}
            />
          </div>

          <div className="actions actions--below-board">
            <StartButton copy={copy} status={status} onStart={startGame} />
          </div>

          {status === GAME_STATUS.IDLE && (
            <p className="start-hint" aria-live="polite" aria-atomic="true">
              {copy.statusIdle}
            </p>
          )}

          <p className="tip" aria-live="polite" aria-atomic="true">
            {isPlayingSequence
              ? copy.tipWatching
              : copy.tipWaiting}
          </p>

          <p className="keyboard-hint">{copy.keyboardHints}</p>
        </section>

        <section className="leaderboard" aria-labelledby="leaderboard-title">
          <div className="leaderboard__header">
            <p className="leaderboard__label">{copy.leaderboardTitle}</p>
            <p className="leaderboard__mode">
              {copy.difficultyLabel}: {copy.difficulties[difficulty]}
            </p>
          </div>

          {leaderboard.length === 0 ? (
            <div className="leaderboard__empty-state">
              <p className="leaderboard__empty-kicker">TOP 5</p>
              <p className="leaderboard__empty">{copy.leaderboardEmpty}</p>
            </div>
          ) : (
            <ol id="leaderboard-title" className="leaderboard__list">
              {leaderboard.map((entry, index) => (
                <li
                  key={`${entry.timestamp}-${entry.score}`}
                  className={`leaderboard__item ${index === 0 ? "is-top" : ""}`}
                >
                  <span>{copy.leaderboardEntry(index + 1, entry.score, copy.difficulties[entry.difficulty])}</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </main>

      <Footer copy={copy} />
    </div>
  );
}
