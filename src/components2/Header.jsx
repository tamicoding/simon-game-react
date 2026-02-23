export default function Header({ status, level }) {
  return (
    <>
      <h1 id="level-title" className="title">Simon Game</h1>

      <p className="status">
        {status === "idle" && "Press Start (or any key) to begin"}
        {status === "playing" && `Level ${level}`}
        {status === "over" && `Game Over — you reached level ${level}`}
      </p>
    </>
  );
}