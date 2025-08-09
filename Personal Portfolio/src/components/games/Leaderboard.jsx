// Leaderboard.jsx
import { useEffect, useState } from "react";

const Leaderboard = () => {
  const [scores, setScores] = useState({});

  useEffect(() => {
    const updatedScores = {
      Click: localStorage.getItem("clickGameHighScore") || 0,
      Reaction: localStorage.getItem("reactionGameScore") || 0,
      Typing: localStorage.getItem("typingGameWPM") || 0,
      Whack: localStorage.getItem("whackScore") || 0
    };
    setScores(updatedScores);
  }, []);

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-bold mb-2 text-white">Leaderboard</h3>
      <ul className="text-sm text-white space-y-1">
        {Object.entries(scores).map(([name, value]) => (
          <li key={name} className="bg-neutral-700 p-2 rounded-lg flex justify-between">
            <span>{name} Game</span>
            <span className="font-semibold">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
