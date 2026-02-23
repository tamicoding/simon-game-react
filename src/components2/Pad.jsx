export default function Pad({ color, pressed, onClick }) {
  return (
    <div
      className={`btn ${color} ${pressed === color ? "pressed" : ""}`}
      onClick={() => onClick(color)}
    />
  );
}