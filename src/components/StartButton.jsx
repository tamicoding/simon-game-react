import { GAME_STATUS } from "../constants/game";

export default function StartButton({ copy, status, onStart }) {
  const isIdle = status !== GAME_STATUS.PLAYING;

  return (
    <button
      type="button"
      onClick={onStart}
      className={`start-btn ${isIdle ? "is-idle" : ""}`}
    >
      {status === GAME_STATUS.PLAYING ? copy.restart : copy.start}
    </button>
  );
}
