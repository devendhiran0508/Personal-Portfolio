import { useState, useEffect, useRef } from 'react';
import { Bug, Trophy, Timer, Target, Zap, RotateCcw, Play, Settings, TrendingUp, Award } from 'lucide-react';

const DIFFICULTY_LEVELS = {
  easy: {
    name: 'Easy',
    description: 'Slow bugs, long display time',
    bugSpeed: 1500,
    displayTime: 2000,
    color: 'text-green-400'
  },
  medium: {
    name: 'Medium', 
    description: 'Moderate speed bugs',
    bugSpeed: 1000,
    displayTime: 1500,
    color: 'text-yellow-400'
  },
  hard: {
    name: 'Hard',
    description: 'Fast bugs, quick reflexes needed',
    bugSpeed: 700,
    displayTime: 1000,
    color: 'text-red-400'
  },
  insane: {
    name: 'Insane',
    description: 'Lightning fast bugs!',
    bugSpeed: 400,
    displayTime: 600,
    color: 'text-purple-400'
  }
};

const GAME_MODES = {
  classic: { name: 'Classic', duration: 60, description: 'Traditional whack-a-bug' },
  survival: { name: 'Survival', duration: 90, description: 'Increasingly difficult bugs' },
  precision: { name: 'Precision', duration: 45, description: 'Fewer bugs, higher accuracy needed' }
};

const BUG_EMOJIS = ['🐞', '🦗', '🕷️', '🐛', '🦟', '🐜', '🪲', '🪳'];

const WhackABug = () => {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'finished', 'settings'
  const [difficulty, setDifficulty] = useState('medium');
  const [gameMode, setGameMode] = useState('classic');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [activeBugs, setActiveBugs] = useState(new Set());
  const [missedBugs, setMissedBugs] = useState(0);
  const [totalBugs, setTotalBugs] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [bestScores, setBestScores] = useState({});
  const [hitEffect, setHitEffect] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gridSize, setGridSize] = useState(9);
  const [specialBug, setSpecialBug] = useState(null);
  
  const timerRef = useRef(null);
  const bugTimerRef = useRef(null);
  const effectTimeoutRef = useRef(null);

  // Initialize game
  const startGame = () => {
    const config = DIFFICULTY_LEVELS[difficulty];
    const mode = GAME_MODES[gameMode];
    
    setScore(0);
    setMissedBugs(0);
    setTotalBugs(0);
    setStreak(0);
    setMultiplier(1);
    setActiveBugs(new Set());
    setSpecialBug(null);
    setTimeLeft(mode.duration);
    setGameState('playing');
    
    // Start game timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Start bug spawning
    spawnBugs();
  };

  // Spawn bugs based on difficulty
  const spawnBugs = () => {
    const config = DIFFICULTY_LEVELS[difficulty];
    let currentSpeed = config.bugSpeed;
    
    const spawnLoop = () => {
      if (gameState !== 'playing') return;
      
      // Spawn regular bug
      const availableSlots = Array.from({length: gridSize}, (_, i) => i)
        .filter(i => !activeBugs.has(i));
      
      if (availableSlots.length > 0) {
        const randomSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
        
        setActiveBugs(prev => new Set([...prev, randomSlot]));
        setTotalBugs(prev => prev + 1);
        
        // Special bug chance (10%)
        if (Math.random() < 0.1) {
          setSpecialBug(randomSlot);
        }
        
        // Remove bug after display time
        setTimeout(() => {
          setActiveBugs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(randomSlot)) {
              newSet.delete(randomSlot);
              setMissedBugs(missed => missed + 1);
              setStreak(0);
              setMultiplier(1);
            }
            return newSet;
          });
          
          setSpecialBug(prev => prev === randomSlot ? null : prev);
        }, config.displayTime);
      }
      
      // Increase difficulty in survival mode
      if (gameMode === 'survival' && totalBugs > 0 && totalBugs % 10 === 0) {
        currentSpeed = Math.max(200, currentSpeed - 50);
      }
      
      bugTimerRef.current = setTimeout(spawnLoop, currentSpeed);
    };
    
    spawnLoop();
  };

  // Handle bug click
  const handleBugClick = (index) => {
    if (!activeBugs.has(index) || gameState !== 'playing') return;
    
    setActiveBugs(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
    
    const isSpecial = specialBug === index;
    const points = isSpecial ? 10 * multiplier : 1 * multiplier;
    
    setScore(prev => prev + points);
    setStreak(prev => {
      const newStreak = prev + 1;
      setMaxStreak(max => Math.max(max, newStreak));
      
      // Update multiplier based on streak
      if (newStreak >= 15) setMultiplier(4);
      else if (newStreak >= 10) setMultiplier(3);
      else if (newStreak >= 5) setMultiplier(2);
      
      return newStreak;
    });
    
    if (isSpecial) {
      setSpecialBug(null);
    }
    
    // Show hit effect
    setHitEffect({ index, points, isSpecial });
    clearTimeout(effectTimeoutRef.current);
    effectTimeoutRef.current = setTimeout(() => setHitEffect(null), 800);
    
    // Play sound effect (visual feedback only)
    if (soundEnabled) {
      // In a real app, you'd play an audio file here
    }
  };

  // Finish game
  const finishGame = () => {
    clearInterval(timerRef.current);
    clearTimeout(bugTimerRef.current);
    setGameState('finished');
    
    // Update best scores
    const scoreKey = `${difficulty}-${gameMode}`;
    setBestScores(prev => ({
      ...prev,
      [scoreKey]: Math.max(prev[scoreKey] || 0, score)
    }));
  };

  // Reset to menu
  const resetGame = () => {
    clearInterval(timerRef.current);
    clearTimeout(bugTimerRef.current);
    clearTimeout(effectTimeoutRef.current);
    setGameState('menu');
    setActiveBugs(new Set());
    setHitEffect(null);
  };

  // Get performance rating
  const getPerformanceRating = () => {
    const accuracy = totalBugs > 0 ? ((totalBugs - missedBugs) / totalBugs) * 100 : 0;
    
    if (score >= 200) return { text: 'Bug Exterminator!', color: 'text-purple-400', icon: '👑' };
    if (score >= 150) return { text: 'Bug Hunter Pro!', color: 'text-green-400', icon: '🏆' };
    if (score >= 100) return { text: 'Bug Squasher!', color: 'text-blue-400', icon: '⭐' };
    if (score >= 50) return { text: 'Bug Catcher!', color: 'text-yellow-400', icon: '👍' };
    return { text: 'Bug Apprentice', color: 'text-gray-400', icon: '🌱' };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(bugTimerRef.current);
      clearTimeout(effectTimeoutRef.current);
    };
  }, []);

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <div className="text-center p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <Bug className="mx-auto mb-4 text-green-400 animate-bounce" size={64} />
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Whack-A-Bug
          </h1>
          <p className="text-gray-400 text-lg">Squash the bugs before they escape!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Difficulty Selection */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center justify-center gap-2">
              <Target size={24} />
              Difficulty Level
            </h3>
            <div className="space-y-3">
              {Object.entries(DIFFICULTY_LEVELS).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setDifficulty(key)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left transform hover:scale-105 ${
                    difficulty === key 
                      ? 'border-green-500 bg-green-500/20 shadow-lg shadow-green-500/20' 
                      : 'border-gray-600 bg-gray-800/50 hover:border-green-400'
                  }`}
                >
                  <div className={`font-bold ${config.color}`}>{config.name}</div>
                  <div className="text-sm text-gray-400">{config.description}</div>
                  {bestScores[`${key}-${gameMode}`] && (
                    <div className="text-xs text-yellow-400 mt-1 flex items-center gap-1">
                      <Trophy size={12} />
                      Best: {bestScores[`${key}-${gameMode}`]} points
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Game Mode Selection */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center justify-center gap-2">
              <Zap size={24} />
              Game Mode
            </h3>
            <div className="space-y-3">
              {Object.entries(GAME_MODES).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setGameMode(key)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left transform hover:scale-105 ${
                    gameMode === key 
                      ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20' 
                      : 'border-gray-600 bg-gray-800/50 hover:border-blue-400'
                  }`}
                >
                  <div className="font-bold text-blue-400">{config.name}</div>
                  <div className="text-sm text-gray-400">{config.description}</div>
                  <div className="text-xs text-blue-300">{config.duration}s duration</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="mb-8 p-4 bg-gray-800/30 rounded-xl">
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center justify-center gap-2">
            <Settings size={20} />
            Game Settings
          </h4>
          <div className="flex items-center justify-center gap-6">
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="rounded"
              />
              Sound Effects
            </label>
            <div className="flex items-center gap-2 text-gray-300">
              <span>Grid Size:</span>
              <select
                value={gridSize}
                onChange={(e) => setGridSize(Number(e.target.value))}
                className="bg-gray-700 text-white rounded px-2 py-1"
              >
                <option value={9}>3x3</option>
                <option value={16}>4x4</option>
                <option value={25}>5x5</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={startGame}
          className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl font-bold text-white transition-all duration-300 text-xl transform hover:scale-105 shadow-lg shadow-green-500/25 flex items-center gap-3 mx-auto"
        >
          <Play size={24} />
          Start Bug Hunt!
        </button>
      </div>
    );
  }

  // Playing Screen
  if (gameState === 'playing') {
    const accuracy = totalBugs > 0 ? Math.round(((totalBugs - missedBugs) / totalBugs) * 100) : 100;
    const gridCols = Math.sqrt(gridSize);
    
    return (
      <div className="p-6 max-w-4xl mx-auto">
        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <Timer className="mx-auto mb-1 text-blue-400" size={20} />
            <div className="text-xs text-gray-400">Time</div>
            <div className={`font-bold ${timeLeft < 20 ? 'text-red-400' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <Trophy className="mx-auto mb-1 text-yellow-400" size={20} />
            <div className="text-xs text-gray-400">Score</div>
            <div className="font-bold text-white">{score}</div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <Target className="mx-auto mb-1 text-green-400" size={20} />
            <div className="text-xs text-gray-400">Accuracy</div>
            <div className={`font-bold ${accuracy < 70 ? 'text-red-400' : 'text-white'}`}>
              {accuracy}%
            </div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <TrendingUp className="mx-auto mb-1 text-purple-400" size={20} />
            <div className="text-xs text-gray-400">Streak</div>
            <div className="font-bold text-white">{streak}</div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <Zap className="mx-auto mb-1 text-orange-400" size={20} />
            <div className="text-xs text-gray-400">Multiplier</div>
            <div className="font-bold text-white">x{multiplier}</div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <Award className="mx-auto mb-1 text-red-400" size={20} />
            <div className="text-xs text-gray-400">Missed</div>
            <div className="font-bold text-white">{missedBugs}</div>
          </div>
        </div>

        {/* Game Grid */}
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 mb-6 relative">
          <div 
            className="grid gap-3 max-w-lg mx-auto"
            style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
          >
            {Array.from({length: gridSize}, (_, i) => {
              const isActive = activeBugs.has(i);
              const isSpecial = specialBug === i;
              const showEffect = hitEffect?.index === i;
              
              return (
                <button
                  key={i}
                  onClick={() => handleBugClick(i)}
                  className={`aspect-square rounded-xl border-2 transition-all duration-200 transform relative overflow-hidden ${
                    isActive
                      ? isSpecial
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400 shadow-lg shadow-purple-500/50 animate-pulse'
                        : 'bg-gradient-to-br from-green-600 to-emerald-600 border-green-400 shadow-lg shadow-green-500/30'
                      : 'bg-gray-800 border-gray-600 hover:border-gray-500'
                  } ${isActive ? 'hover:scale-110' : 'hover:scale-105'}`}
                >
                  {isActive && (
                    <div className="text-2xl animate-bounce">
                      {isSpecial ? '🌟' : BUG_EMOJIS[i % BUG_EMOJIS.length]}
                    </div>
                  )}
                  
                  {showEffect && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className={`text-lg font-bold animate-ping ${hitEffect.isSpecial ? 'text-purple-300' : 'text-green-300'}`}>
                        +{hitEffect.points}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Combo indicator */}
          {streak >= 5 && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full font-bold animate-pulse">
              🔥 {streak} COMBO!
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 font-semibold"
          >
            <RotateCcw size={20} />
            Quit Game
          </button>
        </div>
      </div>
    );
  }

  // Results Screen
  const rating = getPerformanceRating();
  const accuracy = totalBugs > 0 ? Math.round(((totalBugs - missedBugs) / totalBugs) * 100) : 0;
  
  return (
    <div className="text-center p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Trophy className="mx-auto mb-4 text-yellow-400 animate-bounce" size={80} />
        <h2 className="text-4xl font-bold mb-2 text-white">Bug Hunt Complete! 🎉</h2>
        <p className="text-gray-400 text-lg">Here's your extermination report:</p>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-8 mb-8 border border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div>
            <div className="text-4xl font-bold text-yellow-400">{score}</div>
            <div className="text-sm text-gray-400">Final Score</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-400">{accuracy}%</div>
            <div className="text-sm text-gray-400">Accuracy</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400">{maxStreak}</div>
            <div className="text-sm text-gray-400">Best Streak</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-400">{totalBugs - missedBugs}</div>
            <div className="text-sm text-gray-400">Bugs Caught</div>
          </div>
        </div>
        
        <div className={`text-2xl font-bold ${rating.color} mb-4`}>
          {rating.icon} {rating.text}
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
          <div>Total Bugs Spawned: {totalBugs}</div>
          <div>Bugs Missed: {missedBugs}</div>
          <div>Difficulty: {DIFFICULTY_LEVELS[difficulty].name}</div>
          <div>Mode: {GAME_MODES[gameMode].name}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={startGame}
          className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl transition-all duration-300 font-bold text-lg transform hover:scale-105"
        >
          Hunt Again ({DIFFICULTY_LEVELS[difficulty].name} - {GAME_MODES[gameMode].name})
        </button>
        <button
          onClick={resetGame}
          className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold"
        >
          <RotateCcw size={20} />
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default WhackABug;