import { useState, useEffect, useRef } from 'react';
import { Brain, RotateCcw, Trophy, Timer, Star, Zap, Target } from 'lucide-react';

const DIFFICULTY_LEVELS = {
  easy: { 
    name: 'Easy', 
    pairs: 6, 
    timeBonus: 100,
    icons: ["💻", "⚙️", "🔧", "📦", "🚀", "💡"]
  },
  medium: { 
    name: 'Medium', 
    pairs: 8, 
    timeBonus: 150,
    icons: ["💻", "⚙️", "🔧", "📦", "🚀", "💡", "🎯", "⭐"]
  },
  hard: { 
    name: 'Hard', 
    pairs: 12, 
    timeBonus: 200,
    icons: ["💻", "⚙️", "🔧", "📦", "🚀", "💡", "🎯", "⭐", "🔥", "💎", "🎮", "🏆"]
  }
};

const MemoryGame = () => {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'won', 'lost'
  const [difficulty, setDifficulty] = useState('easy');
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [bestScores, setBestScores] = useState({
    easy: null,
    medium: null,
    hard: null
  });
  const [showingPairs, setShowingPairs] = useState([]);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  
  const timerRef = useRef(null);
  const flipTimeoutRef = useRef(null);

  // Initialize game
  const initializeGame = (level) => {
    const config = DIFFICULTY_LEVELS[level];
    const gameIcons = [...config.icons, ...config.icons];
    const shuffled = gameIcons.sort(() => Math.random() - 0.5);
    
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setScore(0);
    setStreak(0);
    setShowingPairs([]);
    setTimeLeft(level === 'easy' ? 90 : level === 'medium' ? 120 : 150);
    setGameState('playing');
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameState('lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle card click
  const handleCardClick = (index) => {
    if (
      gameState !== 'playing' ||
      flipped.length === 2 || 
      flipped.includes(index) || 
      matched.includes(index)
    ) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [i1, i2] = newFlipped;
      
      if (cards[i1] === cards[i2]) {
        // Match found!
        const newMatched = [...matched, i1, i2];
        setMatched(newMatched);
        setShowingPairs([i1, i2]);
        
        // Calculate score
        const timeBonus = Math.floor(timeLeft / 10) * DIFFICULTY_LEVELS[difficulty].timeBonus;
        const streakBonus = (streak + 1) * 50;
        const matchScore = 100 + timeBonus + streakBonus;
        setScore(prev => prev + matchScore);
        setStreak(prev => {
          const newStreak = prev + 1;
          setMaxStreak(current => Math.max(current, newStreak));
          return newStreak;
        });
        
        // Clear showing pairs after animation
        setTimeout(() => {
          setShowingPairs([]);
        }, 800);
        
        // Check if game won
        if (newMatched.length === cards.length) {
          clearInterval(timerRef.current);
          setGameState('won');
          
          // Update best score
          const finalScore = score + matchScore + (timeLeft * 10);
          setBestScores(prev => ({
            ...prev,
            [difficulty]: prev[difficulty] ? Math.max(prev[difficulty], finalScore) : finalScore
          }));
        }
        
        setFlipped([]);
      } else {
        // No match
        setStreak(0);
        flipTimeoutRef.current = setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  // Reset game
  const resetGame = () => {
    clearInterval(timerRef.current);
    clearTimeout(flipTimeoutRef.current);
    setGameState('menu');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(flipTimeoutRef.current);
    };
  }, []);

  // Get card styling
  const getCardStyle = (index) => {
    const isFlipped = flipped.includes(index) || matched.includes(index);
    const isMatched = matched.includes(index);
    const isShowing = showingPairs.includes(index);
    
    let baseStyle = "w-16 h-16 flex items-center justify-center rounded-lg text-2xl cursor-pointer transition-all duration-300 transform ";
    
    if (isMatched) {
      baseStyle += isShowing 
        ? "bg-green-500 scale-110 shadow-lg shadow-green-500/50 " 
        : "bg-green-600 ";
    } else if (isFlipped) {
      baseStyle += "bg-blue-600 scale-105 ";
    } else {
      baseStyle += "bg-gray-700 hover:bg-gray-600 hover:scale-105 ";
    }
    
    return baseStyle;
  };

  // Get performance rating
  const getPerformanceRating = () => {
    const efficiency = matched.length / Math.max(moves, 1);
    if (efficiency > 0.8) return { text: 'Perfect!', color: 'text-green-400', icon: '🔥' };
    if (efficiency > 0.6) return { text: 'Excellent!', color: 'text-blue-400', icon: '⭐' };
    if (efficiency > 0.4) return { text: 'Good!', color: 'text-yellow-400', icon: '👍' };
    return { text: 'Keep practicing!', color: 'text-orange-400', icon: '💪' };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <div className="text-center p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <Brain className="mx-auto mb-4 text-purple-400" size={48} />
          <h3 className="text-3xl font-bold mb-2 text-white">Memory Flip Challenge</h3>
          <p className="text-gray-400">Match pairs of cards to test your memory and win points!</p>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">Choose Difficulty</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(DIFFICULTY_LEVELS).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => initializeGame(key)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    difficulty === key 
                      ? 'border-purple-500 bg-purple-500/20' 
                      : 'border-gray-600 bg-gray-800/50 hover:border-purple-400'
                  }`}
                >
                  <div className="text-lg font-bold text-white">{config.name}</div>
                  <div className="text-sm text-gray-400">{config.pairs} pairs</div>
                  <div className="text-xs text-purple-400">+{config.timeBonus} time bonus</div>
                  {bestScores[key] && (
                    <div className="text-xs text-yellow-400 mt-1">
                      Best: {bestScores[key]}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  if (gameState === 'playing') {
    const gridCols = difficulty === 'easy' ? 'grid-cols-3' : difficulty === 'medium' ? 'grid-cols-4' : 'grid-cols-4';
    
    return (
      <div className="text-center p-8 max-w-2xl mx-auto">
        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <Timer className="mx-auto mb-1 text-blue-400" size={20} />
            <div className="text-sm text-gray-400">Time</div>
            <div className={`font-bold ${timeLeft < 20 ? 'text-red-400' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <Target className="mx-auto mb-1 text-green-400" size={20} />
            <div className="text-sm text-gray-400">Score</div>
            <div className="font-bold text-white">{score.toLocaleString()}</div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <Zap className="mx-auto mb-1 text-yellow-400" size={20} />
            <div className="text-sm text-gray-400">Streak</div>
            <div className="font-bold text-white">{streak}</div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <Star className="mx-auto mb-1 text-purple-400" size={20} />
            <div className="text-sm text-gray-400">Moves</div>
            <div className="font-bold text-white">{moves}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(matched.length / cards.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {matched.length / 2} / {cards.length / 2} pairs found
          </div>
        </div>

        {/* Game Grid */}
        <div className={`grid ${gridCols} gap-3 max-w-md mx-auto mb-6`}>
          {cards.map((icon, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(index)}
              className={getCardStyle(index)}
            >
              {(flipped.includes(index) || matched.includes(index)) ? icon : "❔"}
            </div>
          ))}
        </div>

        <button
          onClick={resetGame}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 mx-auto"
        >
          <RotateCcw size={20} />
          Reset Game
        </button>
      </div>
    );
  }

  // Win/Loss Screen
  const isWon = gameState === 'won';
  const rating = getPerformanceRating();
  const finalScore = isWon ? score + (timeLeft * 10) : score;

  return (
    <div className="text-center p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        {isWon ? (
          <Trophy className="mx-auto mb-4 text-yellow-400" size={64} />
        ) : (
          <Timer className="mx-auto mb-4 text-red-400" size={64} />
        )}
        <h3 className="text-3xl font-bold mb-2 text-white">
          {isWon ? 'Congratulations! 🎉' : 'Time\'s Up! ⏰'}
        </h3>
        <p className="text-gray-400">
          {isWon ? 'You completed the memory challenge!' : 'Better luck next time!'}
        </p>
      </div>

      {/* Results */}
      <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <div className="text-2xl font-bold text-white">{finalScore.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Final Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{moves}</div>
            <div className="text-sm text-gray-400">Total Moves</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{maxStreak}</div>
            <div className="text-sm text-gray-400">Max Streak</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{matched.length / 2}</div>
            <div className="text-sm text-gray-400">Pairs Found</div>
          </div>
        </div>
        
        <div className={`text-lg font-bold ${rating.color} mb-2`}>
          {rating.icon} {rating.text}
        </div>
        
        {isWon && (
          <div className="text-sm text-green-400">
            Time bonus: +{timeLeft * 10} points
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => initializeGame(difficulty)}
          className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-semibold"
        >
          Play Again ({DIFFICULTY_LEVELS[difficulty].name})
        </button>
        <button
          onClick={resetGame}
          className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} />
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default MemoryGame;