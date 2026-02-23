import { useEffect, useState } from "react";

const buttonColors = ["green", "red", "yellow", "blue"];

export default function App() {
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState(0);

  const [gamePattern, setGamePattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);

  const [pressed, setPressed] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [status, setStatus] = useState("idle"); 

  function playSound(color) {
    const audio = new Audio(`/sounds/${color}.mp3`);
    audio.play();
  }

  function flash(color) {
    setPressed(color);
    playSound(color);
    setTimeout(() => setPressed(null), 150);
  }

  function startGame() {
    setStatus("playing");
    setStarted(true);

    setLevel(0);
    setGamePattern([]);
    setUserPattern([]);

    setTimeout(() => addStep(), 200);
  }

  function addStep() {
    const randomColor = buttonColors[Math.floor(Math.random() * buttonColors.length)];
    setGamePattern((prev) => [...prev, randomColor]);
    setUserPattern([]);
    setLevel((prev) => prev + 1);
  }

  function gameOver() {
    setStatus("over");
    playSound("wrong");

    setStarted(false);
    setGamePattern([]);
    setUserPattern([]);

    document.body.classList.add("game-over");
    setTimeout(() => document.body.classList.remove("game-over"), 200);
  }

  useEffect(() => {
    if (!started) return;
    if (gamePattern.length === 0) return;

    setIsPlaying(true);

    gamePattern.forEach((color, i) => {
      setTimeout(() => {
        flash(color);

        if (i === gamePattern.length - 1) {
          setTimeout(() => setIsPlaying(false), 250);
        }
      }, 600 * i);
    });
  }, [gamePattern, started]);

  useEffect(() => {
    function handleKeyDown() {
      if (!started) startGame();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [started]);

  function handleClick(color) {
    if (!started) return;
    if (isPlaying) return;

    flash(color);

    setUserPattern((prev) => {
      const nextUser = [...prev, color];
      const index = nextUser.length - 1;

      if (nextUser[index] !== gamePattern[index]) {
        gameOver();
        return [];
      }

      if (nextUser.length === gamePattern.length) {
        setTimeout(() => addStep(), 700);
      }

      return nextUser;
    });
  }

  return (
    <div className="app">
      <div className="bg-decor"></div>

      <main className="main">
        <h1 id="level-title" className="title">Simon Game</h1>

        <p className="status">
          {status === "idle" && "Press Start (or any key) to begin"}
          {status === "playing" && `Level ${level}`}
          {status === "over" && `Game Over — you reached level ${level}`}
        </p>

        <div style={{display:'flex',justifyContent:'center',marginBottom:24}}>
          <button onClick={startGame} className="start-btn">
            {status === "playing" ? "Restart" : "Start"}
          </button>
        </div>

        <div className="container">
          <div className="row">
            <div className={`btn green ${pressed === "green" ? "pressed" : ""}`} onClick={() => handleClick("green")}></div>
            <div className={`btn red ${pressed === "red" ? "pressed" : ""}`} onClick={() => handleClick("red")}></div>
          </div>

          <div className="row">
            <div className={`btn yellow ${pressed === "yellow" ? "pressed" : ""}`} onClick={() => handleClick("yellow")}></div>
            <div className={`btn blue ${pressed === "blue" ? "pressed" : ""}`} onClick={() => handleClick("blue")}></div>
          </div>
        </div>

        <p className="tip">Tip: wait for the sequence to finish 👀</p>
      </main>

      <footer className="footer">Made with ❤️ by Tamiris Reis</footer>
    </div>
  );
}
