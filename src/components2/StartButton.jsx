export default function StartButton({ status, onStart }) {
  return (
    <button onClick={onStart} className="start-btn">
      {status === "playing" ? "Restart" : "Start"}
    </button>
  );
}