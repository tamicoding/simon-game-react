import { useRef } from "react";
import Pad from "./Pad";
import { BUTTON_COLORS } from "../constants/game";

const GRID_POSITIONS = [
  { row: 0, column: 0 },
  { row: 0, column: 1 },
  { row: 1, column: 0 },
  { row: 1, column: 1 },
];

export default function GameBoard({ copy, disabled, pressed, onPadClick }) {
  const padRefs = useRef([]);

  function moveFocus(currentIndex, direction) {
    const currentPosition = GRID_POSITIONS[currentIndex];

    if (!currentPosition) {
      return;
    }

    const nextIndex = GRID_POSITIONS.findIndex((position) => {
      if (direction === "ArrowRight") {
        return (
          position.row === currentPosition.row &&
          position.column === Math.min(currentPosition.column + 1, 1)
        );
      }

      if (direction === "ArrowLeft") {
        return (
          position.row === currentPosition.row &&
          position.column === Math.max(currentPosition.column - 1, 0)
        );
      }

      if (direction === "ArrowDown") {
        return (
          position.column === currentPosition.column &&
          position.row === Math.min(currentPosition.row + 1, 1)
        );
      }

      if (direction === "ArrowUp") {
        return (
          position.column === currentPosition.column &&
          position.row === Math.max(currentPosition.row - 1, 0)
        );
      }

      return false;
    });

    if (nextIndex >= 0) {
      padRefs.current[nextIndex]?.focus();
    }
  }

  return (
    <div
      className="container"
      role="group"
      aria-label={copy.boardLabel}
      aria-describedby="board-instructions"
    >
      <div className="row">
        {BUTTON_COLORS.slice(0, 2).map((color) => (
          <Pad
            key={color}
            color={color}
            disabled={disabled}
            inputHint={copy.colorHints[color]}
            pressed={pressed}
            ref={(element) => {
              padRefs.current[BUTTON_COLORS.indexOf(color)] = element;
            }}
            onArrowNavigate={moveFocus}
            onClick={onPadClick}
          />
        ))}
      </div>

      <div className="row">
        {BUTTON_COLORS.slice(2).map((color) => (
          <Pad
            key={color}
            color={color}
            disabled={disabled}
            inputHint={copy.colorHints[color]}
            pressed={pressed}
            ref={(element) => {
              padRefs.current[BUTTON_COLORS.indexOf(color)] = element;
            }}
            onArrowNavigate={moveFocus}
            onClick={onPadClick}
          />
        ))}
      </div>

      <p id="board-instructions" className="sr-only">
        {copy.boardInstructions}
      </p>
    </div>
  );
}
