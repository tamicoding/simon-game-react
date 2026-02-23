import { useEffect, useState } from "react";
import Header from "./components2/Header";
import GameBoard from "./components2/GameBoard";
import Footer from "./components2/Footer";
import StartButton from "./components2/StartButton";

const buttonColors = ["green", "red", "yellow", "blue"];

export default function App() {
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState(0);

  const [gamePattern, setGamePattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);

  const [pressed, setPressed] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [status, setStatus] = useState("idle"); // idle | playing | over

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
    const randomColor =
      buttonColors[Math.floor(Math.random() * buttonColors.length)];

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

  // toca a sequência inteira quando mudar
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

  // iniciar com tecla
  useEffect(() => {
    function handleKeyDown() {
      if (!started) startGame();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [started]);

  function handlePadClick(color) {
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
      <div className="bg-decor" />

      <main className="main">
        <Header status={status} level={level} />

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
  <StartButton status={status} onStart={startGame} />
</div>

        <GameBoard pressed={pressed} onPadClick={handlePadClick} />

        <p className="tip">Tip: wait for the sequence to finish 👀</p>
      </main>

      <Footer />
    </div>
  );
}