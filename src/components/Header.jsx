import { GAME_STATUS } from "../constants/game";

export default function Header({ copy, highScore, status, level }) {
  const statusMessage =
    status === GAME_STATUS.PLAYING ? copy.statusPlaying(level) : null;

  return (
    <header className="hero">
      <p className="eyebrow">{copy.eyebrow}</p>

      <h1 id="level-title" className="title">
        Simon
      </h1>

      <p className="subtitle">{copy.subtitle}</p>

      <div className="status-row">
        {statusMessage && (
          <p className="status" aria-live="polite" aria-atomic="true">
            {statusMessage}
          </p>
        )}

        <p className="high-score" aria-live="polite" aria-atomic="true">
          {copy.highScore(highScore)}
        </p>
      </div>
    </header>
  );
}
