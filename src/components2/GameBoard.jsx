import Pad from "./Pad";

const colors = ["green", "red", "yellow", "blue"];

export default function GameBoard({ pressed, onPadClick }) {
  return (
    <div className="container">
      <div className="row">
        <Pad color="green" pressed={pressed} onClick={onPadClick} />
        <Pad color="red" pressed={pressed} onClick={onPadClick} />
      </div>

      <div className="row">
        <Pad color="yellow" pressed={pressed} onClick={onPadClick} />
        <Pad color="blue" pressed={pressed} onClick={onPadClick} />
      </div>
    </div>
  );
}