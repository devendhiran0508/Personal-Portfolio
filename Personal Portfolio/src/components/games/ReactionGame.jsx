import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Timer, RotateCcw, Trophy } from 'lucide-react';

const ReactionGame = () => {
  const [gameState, setGameState] = useState('waiting'); // waiting, ready, click, result
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [attempts, setAttempts] = useState([]);
  const [bestTime, setBestTime] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Load best time from localStorage
    const saved = localStorage.getItem('reactionGame_bestTime');
    if (saved) setBestTime(parseInt(saved));
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startGame = () => {
    setGameState('ready');
    const delay = Math.random() * 4000 + 1000; // 1-5 seconds
    
    timeoutRef.current = setTimeout(() => {
      setStartTime(Date.now());
      setGameState('click');
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'ready') {
      // Clicked too early
      setGameState('waiting');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }
    
    if (gameState === 'click') {
      const endTime = Date.now();
      const reaction = endTime - startTime;
      setReactionTime(reaction);
      setAttempts(prev => [...prev, reaction]);
      setGameState('result');

      // Update best time
      if (!bestTime || reaction < bestTime) {
        setBestTime(reaction);
        localStorage.setItem('reactionGame_bestTime', reaction.toString());
      }
    }
  };

  const reset = () => {
    setGameState('waiting');
    setReactionTime(0);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const getReactionRating = (time) => {
    if (time < 200) return { rating: 'Lightning Fast! ⚡', color: 'text-yellow-400' };
    if (time < 250) return { rating: 'Excellent! 🔥', color: 'text-green-400' };
    if (time < 300) return { rating: 'Good! 👍', color: 'text-blue-400' };
    if (time < 400) return { rating: 'Average 📊', color: 'text-gray-400' };
    return { rating: 'Need Practice 😅', color: 'text-red-400' };
  };

  const averageTime = attempts.length > 0 
    ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
    : 0;

  return (
    <div className="p-8 h-full flex flex-col items-center justify-center text-white">
      <div className="max-w-2xl w-full text-center">
        {/* Header */}
        <div className="mb-8">
          <Timer className="mx-auto mb-4 text-blue-400" size={48} />
          <h3 className="text-3xl font-bold mb-2">🔢 Reaction Time Tester</h3>
          <p className="text-gray-400">
            Test your reflexes! Click when the screen turns green.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Best Time</div>
            <div className="text-xl font-bold text-yellow-400">
              {bestTime ? `${bestTime}ms` : '--'}
            </div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Average</div>
            <div className="text-xl font-bold text-blue-400">
              {averageTime ? `${averageTime}ms` : '--'}
            </div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Attempts</div>
            <div className="text-xl font-bold text-purple-400">
              {attempts.length}
            </div>
          </div>
        </div>

        {/* Game Area */}
        <motion.div
          className={`relative w-full h-80 rounded-2xl cursor-pointer mb-6 border-4 transition-all duration-300 ${
            gameState === 'waiting' 
              ? 'bg-gray-800 border-gray-600' 
            : gameState === 'ready'
              ? 'bg-red-600 border-red-400'
            : gameState === 'click'
              ? 'bg-green-500 border-green-300'
              : 'bg-gray-800 border-gray-600'
          }`}
          onClick={handleClick}
          whileHover={{ scale: gameState === 'waiting' ? 1.02 : 1 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-center p-8">
            {gameState === 'waiting' && (
              <div>
                <h4 className="text-2xl font-bold mb-4">Ready to test your reflexes?</h4>
                <p className="text-gray-300 mb-6">
                  Click anywhere to start. Wait for green, then click as fast as you can!
                </p>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    startGame();
                  }}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Game
                </motion.button>
              </div>
            )}
            
            {gameState === 'ready' && (
              <div>
                <h4 className="text-3xl font-bold mb-4">Wait for GREEN...</h4>
                <p className="text-red-200">Don't click yet! Wait for the color to change.</p>
              </div>
            )}
            
            {gameState === 'click' && (
              <div>
                <h4 className="text-4xl font-bold mb-4">CLICK NOW!</h4>
                <p className="text-green-200">Click as fast as you can!</p>
              </div>
            )}
            
            {gameState === 'result' && (
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mb-6"
                >
                  <Trophy className="mx-auto mb-4 text-yellow-400" size={64} />
                  <h4 className="text-4xl font-bold mb-2">{reactionTime}ms</h4>
                  <p className={`text-xl font-semibold ${getReactionRating(reactionTime).color}`}>
                    {getReactionRating(reactionTime).rating}
                  </p>
                </motion.div>
                
                <div className="flex gap-4 justify-center">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      startGame();
                    }}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Try Again
                  </motion.button>
                  
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      reset();
                    }}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw size={16} />
                    Reset
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Attempts */}
        {attempts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/30 p-6 rounded-xl"
          >
            <h4 className="text-lg font-semibold mb-4">Recent Attempts</h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {attempts.slice(-10).map((time, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    time === bestTime 
                      ? 'bg-yellow-600 text-yellow-100' 
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {time}ms
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReactionGame;