import { forwardRef } from "react";
import { BUTTON_COLORS } from "../constants/game";

const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

const Pad = forwardRef(function Pad(
  { color, disabled, inputHint, pressed, onArrowNavigate, onClick },
  ref,
) {
  const colorIndex = BUTTON_COLORS.indexOf(color);

  function handleKeyDown(event) {
    if (!ARROW_KEYS.includes(event.key)) {
      return;
    }

    event.preventDefault();
    onArrowNavigate(colorIndex, event.key);
  }

  return (
    <button
      ref={ref}
      type="button"
      className={`btn ${color} ${pressed?.color === color ? "pressed" : ""}`}
      aria-label={inputHint}
      aria-keyshortcuts={inputHint}
      disabled={disabled}
      onClick={() => onClick(color)}
      onKeyDown={handleKeyDown}
    />
  );
});

export default Pad;
