import { useState, useEffect, useRef } from 'react';
import { Keyboard, RotateCcw, Trophy, Timer, Target, Zap, TrendingUp, AlertCircle } from 'lucide-react';

const TEXT_SETS = {
  beginner: {
    name: 'Beginner',
    description: 'Simple words and phrases',
    texts: [
      "The quick brown fox jumps over the lazy dog.",
      "Hello world! Welcome to coding.",
      "React makes building user interfaces easy.",
      "JavaScript is a powerful programming language.",
      "Practice makes perfect in typing speed.",
      "Web development is creative and fun.",
      "Code with passion and purpose.",
      "Learning never stops for developers."
    ]
  },
  intermediate: {
    name: 'Intermediate',
    description: 'Programming terms and concepts',
    texts: [
      "const handleSubmit = async (event) => { event.preventDefault(); }",
      "import React, { useState, useEffect } from 'react';",
      "function fibonacci(n) { return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2); }",
      "The component lifecycle methods include componentDidMount and componentWillUnmount.",
      "API endpoints should be RESTful and follow HTTP status code conventions.",
      "Git version control helps developers collaborate on projects efficiently.",
      "Responsive design ensures websites work across different screen sizes.",
      "Database normalization reduces redundancy and improves data integrity."
    ]
  },
  advanced: {
    name: 'Advanced',
    description: 'Complex code and technical content',
    texts: [
      "useEffect(() => { const subscription = observable.subscribe(data => setData(data)); return () => subscription.unsubscribe(); }, []);",
      "interface ApiResponse<T> { data: T; status: number; message?: string; }",
      "The microservices architecture pattern promotes loose coupling between services.",
      "Implementing OAuth 2.0 authentication requires careful handling of tokens and refresh mechanisms.",
      "Kubernetes orchestrates containerized applications across distributed computing clusters.",
      "Machine learning algorithms like neural networks require extensive training datasets.",
      "Blockchain technology uses cryptographic hashing to ensure transaction immutability.",
      "WebAssembly enables near-native performance for web applications through bytecode compilation."
    ]
  }
};

const GAME_MODES = {
  time: { name: 'Time Challenge', duration: 60, description: 'Type as much as possible in 60 seconds' },
  accuracy: { name: 'Accuracy Test', duration: 120, description: 'Focus on precision over speed' },
  endurance: { name: 'Endurance Mode', duration: 180, description: 'Long-form typing challenge' }
};

const TypingGame = () => {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'finished'
  const [difficulty, setDifficulty] = useState('beginner');
  const [gameMode, setGameMode] = useState('time');
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [bestScores, setBestScores] = useState({});
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Initialize game
  const startGame = () => {
    const texts = TEXT_SETS[difficulty].texts;
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    
    setCurrentText(randomText);
    setUserInput('');
    setCurrentIndex(0);
    setErrors(0);
    setTotalCharsTyped(0);
    setWpm(0);
    setAccuracy(100);
    setCurrentStreak(0);
    setIsComplete(false);
    setTimeLeft(GAME_MODES[gameMode].duration);
    setGameState('playing');
    
    // Focus input and start timer
    setTimeout(() => {
      inputRef.current?.focus();
      setStartTime(Date.now());
      
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 100);
  };

  // Handle typing
  const handleInputChange = (e) => {
    if (gameState !== 'playing') return;
    
    const value = e.target.value;
    const newIndex = value.length;
    
    // Prevent typing beyond text length
    if (newIndex > currentText.length) return;
    
    setUserInput(value);
    setCurrentIndex(newIndex);
    setTotalCharsTyped(prev => prev + 1);
    
    // Check for errors
    let errorCount = 0;
    let correctStreak = 0;
    let maxStreakInText = 0;
    let currentStreakInText = 0;
    
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== currentText[i]) {
        errorCount++;
        currentStreakInText = 0;
      } else {
        currentStreakInText++;
        maxStreakInText = Math.max(maxStreakInText, currentStreakInText);
      }
    }
    
    setErrors(errorCount);
    setCurrentStreak(currentStreakInText);
    setMaxStreak(prev => Math.max(prev, maxStreakInText));
    
    // Calculate WPM and accuracy
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    const wordsTyped = value.trim().split(' ').length;
    const currentWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    const currentAccuracy = value.length > 0 ? Math.round(((value.length - errorCount) / value.length) * 100) : 100;
    
    setWpm(currentWpm);
    setAccuracy(currentAccuracy);
    
    // Check if text is complete
    if (value === currentText) {
      setIsComplete(true);
      finishGame();
    }
  };

  // Finish game
  const finishGame = () => {
    clearInterval(timerRef.current);
    setGameState('finished');
    
    // Update best scores
    const scoreKey = `${difficulty}-${gameMode}`;
    const currentScore = gameMode === 'accuracy' ? accuracy : wpm;
    setBestScores(prev => ({
      ...prev,
      [scoreKey]: prev[scoreKey] ? Math.max(prev[scoreKey], currentScore) : currentScore
    }));
  };

  // Reset game
  const resetGame = () => {
    clearInterval(timerRef.current);
    setGameState('menu');
  };

  // Get character styling
  const getCharStyle = (index) => {
    if (index < userInput.length) {
      return userInput[index] === currentText[index] 
        ? 'bg-green-500/30 text-green-400' 
        : 'bg-red-500/30 text-red-400';
    } else if (index === currentIndex) {
      return 'bg-blue-500/50 animate-pulse';
    }
    return 'text-gray-400';
  };

  // Get performance rating
  const getPerformanceRating = () => {
    if (gameMode === 'accuracy') {
      if (accuracy >= 98) return { text: 'Perfect!', color: 'text-green-400', icon: '🔥' };
      if (accuracy >= 95) return { text: 'Excellent!', color: 'text-blue-400', icon: '⭐' };
      if (accuracy >= 90) return { text: 'Great!', color: 'text-yellow-400', icon: '👍' };
      if (accuracy >= 80) return { text: 'Good!', color: 'text-orange-400', icon: '👌' };
      return { text: 'Keep practicing!', color: 'text-red-400', icon: '💪' };
    } else {
      if (wpm >= 80) return { text: 'Lightning Fast!', color: 'text-green-400', icon: '⚡' };
      if (wpm >= 60) return { text: 'Very Fast!', color: 'text-blue-400', icon: '🚀' };
      if (wpm >= 40) return { text: 'Fast!', color: 'text-yellow-400', icon: '⭐' };
      if (wpm >= 25) return { text: 'Average', color: 'text-orange-400', icon: '👍' };
      return { text: 'Keep practicing!', color: 'text-red-400', icon: '💪' };
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <div className="text-center p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <Keyboard className="mx-auto mb-4 text-green-400" size={48} />
          <h3 className="text-3xl font-bold mb-2 text-white">Typing Speed Challenge</h3>
          <p className="text-gray-400">Test your typing speed and accuracy with different challenges!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Difficulty Selection */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">Choose Difficulty</h4>
            <div className="space-y-3">
              {Object.entries(TEXT_SETS).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setDifficulty(key)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    difficulty === key 
                      ? 'border-green-500 bg-green-500/20' 
                      : 'border-gray-600 bg-gray-800/50 hover:border-green-400'
                  }`}
                >
                  <div className="font-bold text-white">{config.name}</div>
                  <div className="text-sm text-gray-400">{config.description}</div>
                  {bestScores[`${key}-${gameMode}`] && (
                    <div className="text-xs text-yellow-400 mt-1">
                      Best: {bestScores[`${key}-${gameMode}`]}{gameMode === 'accuracy' ? '%' : ' WPM'}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Game Mode Selection */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">Choose Mode</h4>
            <div className="space-y-3">
              {Object.entries(GAME_MODES).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setGameMode(key)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    gameMode === key 
                      ? 'border-blue-500 bg-blue-500/20' 
                      : 'border-gray-600 bg-gray-800/50 hover:border-blue-400'
                  }`}
                >
                  <div className="font-bold text-white">{config.name}</div>
                  <div className="text-sm text-gray-400">{config.description}</div>
                  <div className="text-xs text-blue-400">{config.duration}s duration</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={startGame}
          className="mt-8 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-lg font-semibold text-white transition-all duration-300 text-lg"
        >
          Start Typing Challenge
        </button>
      </div>
    );
  }

  // Playing Screen
  if (gameState === 'playing') {
    const progress = (currentIndex / currentText.length) * 100;
    
    return (
      <div className="p-8 max-w-4xl mx-auto">
        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <Timer className="mx-auto mb-1 text-blue-400" size={20} />
            <div className="text-xs text-gray-400">Time Left</div>
            <div className={`font-bold ${timeLeft < 20 ? 'text-red-400' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <Zap className="mx-auto mb-1 text-yellow-400" size={20} />
            <div className="text-xs text-gray-400">WPM</div>
            <div className="font-bold text-white">{wpm}</div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <Target className="mx-auto mb-1 text-green-400" size={20} />
            <div className="text-xs text-gray-400">Accuracy</div>
            <div className={`font-bold ${accuracy < 80 ? 'text-red-400' : 'text-white'}`}>
              {accuracy}%
            </div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <TrendingUp className="mx-auto mb-1 text-purple-400" size={20} />
            <div className="text-xs text-gray-400">Streak</div>
            <div className="font-bold text-white">{currentStreak}</div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <AlertCircle className="mx-auto mb-1 text-red-400" size={20} />
            <div className="text-xs text-gray-400">Errors</div>
            <div className="font-bold text-white">{errors}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-400 mt-1 text-center">
            {currentIndex} / {currentText.length} characters ({Math.round(progress)}%)
          </div>
        </div>

        {/* Text Display */}
        <div className="bg-gray-900/50 p-6 rounded-xl mb-6 border border-gray-700">
          <div className="text-lg leading-relaxed font-mono">
            {currentText.split('').map((char, index) => (
              <span key={index} className={getCharStyle(index)}>
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="mb-6">
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg text-white text-lg font-mono resize-none focus:outline-none focus:border-blue-500 transition-colors"
            rows="4"
            placeholder="Start typing the text above..."
            disabled={isComplete}
          />
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <RotateCcw size={20} />
            Reset
          </button>
          {isComplete && (
            <button
              onClick={startGame}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Play Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // Results Screen
  const rating = getPerformanceRating();
  const timeSpent = GAME_MODES[gameMode].duration - timeLeft;
  
  return (
    <div className="text-center p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Trophy className="mx-auto mb-4 text-yellow-400" size={64} />
        <h3 className="text-3xl font-bold mb-2 text-white">Challenge Complete! 🎉</h3>
        <p className="text-gray-400">Here's how you performed:</p>
      </div>

      {/* Results */}
      <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <div className="text-3xl font-bold text-white">{wpm}</div>
            <div className="text-sm text-gray-400">WPM</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{accuracy}%</div>
            <div className="text-sm text-gray-400">Accuracy</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{maxStreak}</div>
            <div className="text-sm text-gray-400">Max Streak</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{errors}</div>
            <div className="text-sm text-gray-400">Total Errors</div>
          </div>
        </div>
        
        <div className={`text-xl font-bold ${rating.color} mb-2`}>
          {rating.icon} {rating.text}
        </div>
        
        <div className="text-sm text-gray-400">
          Completed {currentIndex} characters in {formatTime(timeSpent)}
        </div>
        
        {isComplete && (
          <div className="text-green-400 font-semibold mt-2">
            🎯 Perfect completion bonus!
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={startGame}
          className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-semibold"
        >
          Try Again ({TEXT_SETS[difficulty].name} - {GAME_MODES[gameMode].name})
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

export default TypingGame;