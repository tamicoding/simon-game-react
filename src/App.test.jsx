import { act } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

async function advanceTime(ms) {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
}

function getStartButton() {
  return screen.getByRole("button", { name: /start|restart|iniciar|reiniciar/i });
}

function getPad(name) {
  return screen.getByRole("button", { name });
}

async function startAndWaitForPlayerTurn() {
  fireEvent.click(getStartButton());
  await advanceTime(200);
  await advanceTime(200);
  await advanceTime(400);
  await advanceTime(400);
  expect(getPad("Green pad. Top left.")).toBeEnabled();
}

async function finishSuccessfulRound() {
  fireEvent.click(getPad("Green pad. Top left."));
  await advanceTime(900);
  await advanceTime(500);
  await advanceTime(1500);
}

describe("App", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("starts a new game and shows the first level", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    render(<App />);

    await startAndWaitForPlayerTurn();

    expect(screen.getByText("Level 1")).toBeInTheDocument();
    expect(screen.getByText("Best 1")).toBeInTheDocument();
  });

  it("advances to the next level after the player repeats the pattern correctly", async () => {
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.3);

    render(<App />);

    await startAndWaitForPlayerTurn();

    await finishSuccessfulRound();

    expect(screen.getByText("Level 2")).toBeInTheDocument();
    expect(screen.getByText("Best 2")).toBeInTheDocument();
  });

  it("shows game over when the player presses the wrong pad", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    render(<App />);

    await startAndWaitForPlayerTurn();

    fireEvent.click(getPad("Red pad. Top right."));
    await advanceTime(250);

    expect(
      screen.getByText("Game over. You reached level 1."),
    ).toBeInTheDocument();
    expect(screen.getByText("Best 1")).toBeInTheDocument();
  });

  it("restarts the game from level one when the player clicks restart", async () => {
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.3)
      .mockReturnValueOnce(0.6);

    render(<App />);

    await startAndWaitForPlayerTurn();

    await finishSuccessfulRound();

    fireEvent.click(getStartButton());
    await advanceTime(200);
    await advanceTime(200);
    await advanceTime(400);
    await advanceTime(400);

    expect(screen.getByText("Level 1")).toBeInTheDocument();
    expect(screen.getByText("Best 2")).toBeInTheDocument();
  });
});
