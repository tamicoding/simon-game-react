import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

class MockAudio {
  constructor(src) {
    this.src = src;
    this.currentTime = 0;
  }

  play() {
    return Promise.resolve();
  }
}

globalThis.Audio = MockAudio;

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();
});
