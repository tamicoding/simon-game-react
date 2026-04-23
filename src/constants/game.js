export const BUTTON_COLORS = ["green", "red", "yellow", "blue"];

export const COLOR_KEYS = {
  1: "green",
  2: "red",
  3: "yellow",
  4: "blue",
  q: "green",
  w: "red",
  a: "yellow",
  s: "blue",
};

export const GAME_STATUS = {
  IDLE: "idle",
  PLAYING: "playing",
  OVER: "over",
};

export const DIFFICULTY_LEVELS = {
  easy: {
    id: "easy",
    flashDurationMs: 260,
    roundDelayMs: 1050,
    startDelayMs: 420,
    stepIntervalMs: 980,
  },
  normal: {
    id: "normal",
    flashDurationMs: 220,
    roundDelayMs: 900,
    startDelayMs: 320,
    stepIntervalMs: 760,
  },
  hard: {
    id: "hard",
    flashDurationMs: 160,
    roundDelayMs: 620,
    startDelayMs: 220,
    stepIntervalMs: 520,
  },
};
