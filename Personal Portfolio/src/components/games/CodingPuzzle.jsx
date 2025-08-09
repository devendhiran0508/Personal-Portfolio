import { useState, useEffect, useRef } from 'react';
import { Code, Brain, Trophy, Timer, Target, Zap, RotateCcw, Play, BookOpen, TrendingUp, Award, CheckCircle, XCircle, Lightbulb, Star } from 'lucide-react';

const DIFFICULTY_LEVELS = {
  beginner: {
    name: 'Beginner',
    description: 'Basic JavaScript concepts',
    color: 'text-green-400',
    timeLimit: 30,
    pointsMultiplier: 1
  },
  intermediate: {
    name: 'Intermediate',
    description: 'Advanced JS and web concepts',
    color: 'text-yellow-400',
    timeLimit: 25,
    pointsMultiplier: 2
  },
  expert: {
    name: 'Expert',
    description: 'Complex algorithms and patterns',
    color: 'text-red-400',
    timeLimit: 20,
    pointsMultiplier: 3
  }
};

const QUESTION_BANK = {
  beginner: [
    {
      id: 1,
      code: "console.log(typeof null);",
      question: "What will this output?",
      options: ["object", "null", "undefined", "string"],
      answer: "object",
      explanation: "In JavaScript, typeof null returns 'object' due to a historical bug that's kept for backward compatibility."
    },
    {
      id: 2,
      code: "console.log(2 + '2');",
      question: "What's the result?",
      options: ["4", "22", "NaN", "TypeError"],
      answer: "22",
      explanation: "JavaScript performs type coercion. The number 2 is converted to a string and concatenated with '2'."
    },
    {
      id: 3,
      code: "console.log([] + []);",
      question: "What does this evaluate to?",
      options: ["[]", "[[]]", "''", "undefined"],
      answer: "''",
      explanation: "Empty arrays are converted to empty strings when used with the + operator, resulting in an empty string."
    },
    {
      id: 4,
      code: "console.log(0.1 + 0.2 === 0.3);",
      question: "What's the output?",
      options: ["true", "false", "NaN", "TypeError"],
      answer: "false",
      explanation: "Due to floating-point precision issues, 0.1 + 0.2 equals 0.30000000000000004, not exactly 0.3."
    },
    {
      id: 5,
      code: "console.log(!!false);",
      question: "What will this log?",
      options: ["true", "false", "undefined", "0"],
      answer: "false",
      explanation: "The double negation (!!) converts a value to boolean. !false is true, and !true is false."
    }
  ],
  intermediate: [
    {
      id: 6,
      code: `function test() {
  console.log(this);
}
test();`,
      question: "In non-strict mode, what does 'this' refer to?",
      options: ["undefined", "window/global object", "test function", "null"],
      answer: "window/global object",
      explanation: "In non-strict mode, 'this' in a regular function call refers to the global object (window in browsers)."
    },
    {
      id: 7,
      code: `const arr = [1, 2, 3];
arr[10] = 99;
console.log(arr.length);`,
      question: "What's the array length?",
      options: ["4", "10", "11", "3"],
      answer: "11",
      explanation: "Setting an element at index 10 makes the array length 11, with undefined values for indices 3-9."
    },
    {
      id: 8,
      code: `console.log(
  (function(){ return typeof arguments; })()
);`,
      question: "What's the output?",
      options: ["object", "array", "function", "undefined"],
      answer: "object",
      explanation: "The 'arguments' object is an array-like object, so typeof returns 'object'."
    },
    {
      id: 9,
      code: `let a = { x: 1 };
let b = a;
b.x = 2;
console.log(a.x);`,
      question: "What's the value of a.x?",
      options: ["1", "2", "undefined", "ReferenceError"],
      answer: "2",
      explanation: "Objects are passed by reference. Both 'a' and 'b' point to the same object, so modifying b.x also changes a.x."
    },
    {
      id: 10,
      code: `console.log([1, 2, 3].map(parseInt));`,
      question: "What's the result?",
      options: ["[1, 2, 3]", "[1, NaN, NaN]", "[1, 0, 1]", "[NaN, NaN, NaN]"],
      answer: "[1, NaN, NaN]",
      explanation: "map passes (value, index) to parseInt. parseInt('2', 1) and parseInt('3', 2) are invalid for their respective bases."
    }
  ],
  expert: [
    {
      id: 11,
      code: `console.log(
  (![]+[])[+[]]+(![]+[])[+!+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]
);`,
      question: "What does this cryptic code output?",
      options: ["fail", "true", "false", "undefined"],
      answer: "fail",
      explanation: "This is JSF*ck encoding that spells 'fail' using only []()!+ characters through type coercion."
    },
    {
      id: 12,
      code: `const obj = {
  a: function() { return this; },
  b: () => this,
  c() { return this; }
};
console.log(obj.a() === obj.b());`,
      question: "What's the result?",
      options: ["true", "false", "TypeError", "ReferenceError"],
      answer: "false",
      explanation: "obj.a() and obj.c() return obj, but obj.b() (arrow function) returns the global 'this' or undefined in strict mode."
    },
    {
      id: 13,
      code: `function* gen() {
  yield 1;
  yield 2;
  return 3;
}
const g = gen();
console.log([...g]);`,
      question: "What's in the array?",
      options: ["[1, 2, 3]", "[1, 2]", "[3]", "[]"],
      answer: "[1, 2]",
      explanation: "Spread operator only includes yielded values, not the returned value from a generator function."
    },
    {
      id: 14,
      code: `console.log(
  new Date(2023, 1, 29).getMonth()
);`,
      question: "What month number is returned?",
      options: ["1", "2", "3", "0"],
      answer: "2",
      explanation: "Feb 29, 2023 doesn't exist, so JavaScript adjusts to March 1st, 2023. getMonth() returns 2 (March is index 2)."
    },
    {
      id: 15,
      code: `const promise = new Promise(resolve => {
  console.log(1);
  resolve();
  console.log(2);
});
console.log(3);`,
      question: "What's the output order?",
      options: ["1, 2, 3", "3, 1, 2", "1, 3, 2", "3, 2, 1"],
      answer: "1, 2, 3",
      explanation: "Promise executor runs synchronously. Even after resolve(), the rest of the executor continues before console.log(3)."
    }
  ]
};

const CodingPuzzle = () => {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'finished'
  const [difficulty, setDifficulty] = useState('beginner');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [bestScores, setBestScores] = useState({});
  const [lifelines, setLifelines] = useState({ hint: 2, skip: 1, time: 1 });
  const [usedLifelines, setUsedLifelines] = useState([]);
  const [questionOrder, setQuestionOrder] = useState([]);
  
  const timerRef = useRef(null);
  const questions = QUESTION_BANK[difficulty];
  const currentQuestion = questionOrder.length > 0 ? questions.find(q => q.id === questionOrder[currentQuestionIndex]) : null;

  // Initialize game
  const startGame = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestionOrder(shuffled.map(q => q.id));
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setSelected(null);
    setFeedback('');
    setShowExplanation(false);
    setLifelines({ hint: 2, skip: 1, time: 1 });
    setUsedLifelines([]);
    setTimeLeft(DIFFICULTY_LEVELS[difficulty].timeLimit);
    setGameState('playing');
    
    startTimer();
  };

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    if (gameState === 'playing' && !selected) {
      setFeedback('⏰ Time\'s up!');
      setStreak(0);
      setTimeout(nextQuestion, 2000);
    }
  };

  const handleSelect = (option) => {
    if (selected || gameState !== 'playing') return;
    
    clearInterval(timerRef.current);
    setSelected(option);
    
    const isCorrect = option === currentQuestion.answer;
    const timeBonus = Math.floor(timeLeft / 2);
    const streakBonus = streak * 10;
    const basePoints = 100 * DIFFICULTY_LEVELS[difficulty].pointsMultiplier;
    
    if (isCorrect) {
      const points = basePoints + timeBonus + streakBonus;
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(max => Math.max(max, newStreak));
        return newStreak;
      });
      setFeedback(`🎉 Correct! +${points} points`);
    } else {
      setStreak(0);
      setFeedback('❌ Incorrect!');
    }
    
    setQuestionsAnswered(prev => prev + 1);
    setShowExplanation(true);
    
    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex >= questionOrder.length - 1) {
      finishGame();
      return;
    }
    
    setCurrentQuestionIndex(prev => prev + 1);
    setSelected(null);
    setFeedback('');
    setShowExplanation(false);
    setTimeLeft(DIFFICULTY_LEVELS[difficulty].timeLimit);
    startTimer();
  };

  const finishGame = () => {
    clearInterval(timerRef.current);
    setGameState('finished');
    
    // Update best scores
    setBestScores(prev => ({
      ...prev,
      [difficulty]: Math.max(prev[difficulty] || 0, score)
    }));
  };

  const resetGame = () => {
    clearInterval(timerRef.current);
    setGameState('menu');
  };

  // Lifelines
  const useHint = () => {
    if (lifelines.hint <= 0 || selected) return;
    
    setLifelines(prev => ({ ...prev, hint: prev.hint - 1 }));
    setUsedLifelines(prev => [...prev, 'hint']);
    
    // Remove one wrong answer
    const wrongOptions = currentQuestion.options.filter(opt => opt !== currentQuestion.answer);
    const optionToRemove = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    
    // Visual feedback for removed option
    const buttons = document.querySelectorAll('.option-button');
    buttons.forEach(btn => {
      if (btn.textContent === optionToRemove) {
        btn.style.opacity = '0.3';
        btn.style.pointerEvents = 'none';
      }
    });
  };

  const skipQuestion = () => {
    if (lifelines.skip <= 0 || selected) return;
    
    setLifelines(prev => ({ ...prev, skip: prev.skip - 1 }));
    setUsedLifelines(prev => [...prev, 'skip']);
    clearInterval(timerRef.current);
    nextQuestion();
  };

  const addTime = () => {
    if (lifelines.time <= 0 || selected) return;
    
    setLifelines(prev => ({ ...prev, time: prev.time - 1 }));
    setUsedLifelines(prev => [...prev, 'time']);
    setTimeLeft(prev => prev + 15);
  };

  const getPerformanceRating = () => {
    const accuracy = questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0;
    
    if (accuracy >= 90 && maxStreak >= 5) return { text: 'Code Master!', color: 'text-purple-400', icon: '👑' };
    if (accuracy >= 80) return { text: 'Senior Developer!', color: 'text-green-400', icon: '🏆' };
    if (accuracy >= 70) return { text: 'Mid-Level Coder!', color: 'text-blue-400', icon: '⭐' };
    if (accuracy >= 50) return { text: 'Junior Developer!', color: 'text-yellow-400', icon: '👍' };
    return { text: 'Coding Rookie', color: 'text-gray-400', icon: '🌱' };
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
          <Code className="mx-auto mb-4 text-blue-400 animate-pulse" size={64} />
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Code Puzzle Challenge
          </h1>
          <p className="text-gray-400 text-lg">Test your JavaScript knowledge with interactive coding puzzles!</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {Object.entries(DIFFICULTY_LEVELS).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setDifficulty(key)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                difficulty === key 
                  ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20' 
                  : 'border-gray-600 bg-gray-800/50 hover:border-blue-400'
              }`}
            >
              <Brain className={`mx-auto mb-3 ${config.color}`} size={32} />
              <div className={`font-bold text-lg ${config.color}`}>{config.name}</div>
              <div className="text-sm text-gray-400 mt-2">{config.description}</div>
              <div className="text-xs text-blue-300 mt-1">
                {config.timeLimit}s per question • {config.pointsMultiplier}x points
              </div>
              {bestScores[key] && (
                <div className="text-xs text-yellow-400 mt-2 flex items-center justify-center gap-1">
                  <Trophy size={12} />
                  Best: {bestScores[key]} points
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mb-8 p-6 bg-gray-800/30 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center gap-2">
            <Lightbulb size={20} />
            Lifelines Available
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-yellow-400 font-bold">💡 Hint</div>
              <div className="text-gray-400">Remove wrong answer (2x)</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold">⏭️ Skip</div>
              <div className="text-gray-400">Skip question (1x)</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold">⏰ Time</div>
              <div className="text-gray-400">Add 15 seconds (1x)</div>
            </div>
          </div>
        </div>

        <button
          onClick={startGame}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold text-white transition-all duration-300 text-xl transform hover:scale-105 shadow-lg shadow-blue-500/25 flex items-center gap-3 mx-auto"
        >
          <Play size={24} />
          Start Code Challenge!
        </button>
      </div>
    );
  }

  // Playing Screen
  if (gameState === 'playing' && currentQuestion) {
    const progress = ((currentQuestionIndex + 1) / questionOrder.length) * 100;
    
    return (
      <div className="p-6 max-w-4xl mx-auto">
        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <Timer className="mx-auto mb-1 text-blue-400" size={20} />
            <div className="text-xs text-gray-400">Time Left</div>
            <div className={`font-bold ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {timeLeft}s
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
            <div className="font-bold text-white">
              {questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 100}%
            </div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <TrendingUp className="mx-auto mb-1 text-purple-400" size={20} />
            <div className="text-xs text-gray-400">Streak</div>
            <div className="font-bold text-white">{streak}</div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <BookOpen className="mx-auto mb-1 text-orange-400" size={20} />
            <div className="text-xs text-gray-400">Progress</div>
            <div className="font-bold text-white">{currentQuestionIndex + 1}/10</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-400 mt-1 text-center">
            Question {currentQuestionIndex + 1} of 10
          </div>
        </div>

        {/* Lifelines */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={useHint}
            disabled={lifelines.hint <= 0 || selected}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              lifelines.hint > 0 && !selected
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Lightbulb size={16} />
            Hint ({lifelines.hint})
          </button>
          <button
            onClick={skipQuestion}
            disabled={lifelines.skip <= 0 || selected}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              lifelines.skip > 0 && !selected
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Star size={16} />
            Skip ({lifelines.skip})
          </button>
          <button
            onClick={addTime}
            disabled={lifelines.time <= 0 || selected}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              lifelines.time > 0 && !selected
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Timer size={16} />
            +15s ({lifelines.time})
          </button>
        </div>

        {/* Question */}
        <div className="bg-gray-900/50 p-6 rounded-xl mb-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">{currentQuestion.question}</h3>
          <pre className="bg-gray-800 p-4 rounded-lg text-sm text-green-400 font-mono overflow-x-auto mb-4 border">
            {currentQuestion.code}
          </pre>
          
          <div className="grid gap-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`option-button w-full text-left px-4 py-3 rounded-lg transition-all duration-200 border-2 ${
                  selected === option
                    ? option === currentQuestion.answer
                      ? 'bg-green-600 border-green-400 text-white'
                      : 'bg-red-600 border-red-400 text-white'
                    : selected
                    ? option === currentQuestion.answer
                      ? 'bg-green-600 border-green-400 text-white'
                      : 'bg-gray-700 border-gray-600 text-gray-300'
                    : 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500'
                }`}
              >
                <span className="font-mono text-lg">{option}</span>
                {selected && option === currentQuestion.answer && (
                  <CheckCircle className="inline ml-2 text-green-400" size={20} />
                )}
                {selected && selected === option && option !== currentQuestion.answer && (
                  <XCircle className="inline ml-2 text-red-400" size={20} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="text-center mb-4">
            <div className="text-xl font-bold mb-2">{feedback}</div>
            {showExplanation && (
              <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
                <div className="text-blue-300 text-sm">
                  <strong>Explanation:</strong> {currentQuestion.explanation}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Streak indicator */}
        {streak >= 3 && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full font-bold animate-pulse">
              🔥 {streak} Question Streak! 🔥
            </div>
          </div>
        )}

        <div className="flex justify-center">
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
  const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;
  
  return (
    <div className="text-center p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <Award className="mx-auto mb-4 text-yellow-400 animate-bounce" size={80} />
        <h2 className="text-4xl font-bold mb-2 text-white">Challenge Complete! 🎉</h2>
        <p className="text-gray-400 text-lg">Here's your coding performance:</p>
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
            <div className="text-4xl font-bold text-blue-400">{correctAnswers}/10</div>
            <div className="text-sm text-gray-400">Correct</div>
          </div>
        </div>
        
        <div className={`text-2xl font-bold ${rating.color} mb-4`}>
          {rating.icon} {rating.text}
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
          <div>Difficulty: {DIFFICULTY_LEVELS[difficulty].name}</div>
          <div>Questions Answered: {questionsAnswered}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={startGame}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all duration-300 font-bold text-lg transform hover:scale-105"
        >
          Try Again ({DIFFICULTY_LEVELS[difficulty].name})
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

export default CodingPuzzle;