import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, X, Trophy, Timer, 
  Brain, Keyboard, Palette, Target, 
  Code,Crown
} from 'lucide-react';

// Import game components (you'll create these as separate files)
import ReactionGame from './games/ReactionGame';
import MemoryGame from './games/MemoryGame';
import TypingGame from './games/TypingGame';
import MoodGenerator from './games/MoodGenerator';
// import WhackABug from './games/WhackABug';
import CodingPuzzle from './games/CodingPuzzle';

// Placeholder game components for demonstration
// const ReactionGame = () => (
//   <div className="text-center p-8">
//     <Timer className="mx-auto mb-4 text-blue-400" size={48} />
//     <h3 className="text-xl font-bold mb-4">Reaction Time Tester</h3>
//     <p className="text-gray-400 mb-6">Test your reflexes! Click when the screen turns green.</p>
//     <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
//       Start Test
//     </button>
//   </div>
// );

// const MemoryGame = () => (
//   <div className="text-center p-8">
//     <Brain className="mx-auto mb-4 text-purple-400" size={48} />
//     <h3 className="text-xl font-bold mb-4">Memory Flip Game</h3>
//     <p className="text-gray-400 mb-6">Match pairs of cards to test your memory!</p>
//     <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-6">
//       {[...Array(6)].map((_, i) => (
//         <div key={i} className="w-16 h-16 bg-gray-700 rounded-lg"></div>
//       ))}
//     </div>
//   </div>
// );

// const TypingGame = () => (
//   <div className="text-center p-8">
//     <Keyboard className="mx-auto mb-4 text-green-400" size={48} />
//     <h3 className="text-xl font-bold mb-4">Typing Speed Test</h3>
//     <p className="text-gray-400 mb-6">How fast can you type? Test your WPM!</p>
//     <div className="bg-gray-800 p-4 rounded-lg mb-4 text-left">
//       <p className="text-sm">Type this text as fast as you can...</p>
//     </div>
//     <button className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
//       Start Typing
//     </button>
//   </div>
// );

// const MoodGenerator = () => (
//   <div className="text-center p-8">
//     <Palette className="mx-auto mb-4 text-pink-400" size={48} />
//     <h3 className="text-xl font-bold mb-4">AI Mood Generator</h3>
//     <p className="text-gray-400 mb-6">Discover your dev mood today!</p>
//     <div className="bg-gray-800 p-6 rounded-lg mb-6">
//       <div className="text-4xl mb-2">😎</div>
//       <p className="text-lg font-semibold">Debugging Ninja</p>
//       <p className="text-sm text-gray-400">Ready to squash bugs all day!</p>
//     </div>
//     <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors">
//       Generate Mood
//     </button>
//   </div>
// );

const WhackABug = () => (
  <div className="text-center p-8">
    <Target className="mx-auto mb-4 text-red-400" size={48} />
    <h3 className="text-xl font-bold mb-4">Whack-a-Bug</h3>
    <p className="text-gray-400 mb-6">Squash the bugs as fast as you can!</p>
    <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-6">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="w-16 h-16 bg-gray-700 hover:bg-red-600 rounded-lg cursor-pointer transition-colors"></div>
      ))}
    </div>
    <button className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
      Start Game
    </button>
  </div>
);

// const CodingPuzzle = () => (
//   <div className="text-center p-8">
//     <Code className="mx-auto mb-4 text-yellow-400" size={48} />
//     <h3 className="text-xl font-bold mb-4">JS Coding Puzzle</h3>
//     <p className="text-gray-400 mb-6">Guess the output of this code!</p>
//     <div className="bg-gray-800 p-4 rounded-lg mb-6 text-left">
//       <pre className="text-sm text-green-400">
// {`console.log(0.1 + 0.2 === 0.3);
// // What will this output?`}
//       </pre>
//     </div>
//     <div className="space-y-2">
//       <button className="block w-full p-3 bg-gray-700 hover:bg-yellow-600 rounded-lg transition-colors">
//         A) true
//       </button>
//       <button className="block w-full p-3 bg-gray-700 hover:bg-yellow-600 rounded-lg transition-colors">
//         B) false
//       </button>
//       <button className="block w-full p-3 bg-gray-700 hover:bg-yellow-600 rounded-lg transition-colors">
//         C) undefined
//       </button>
//     </div>
//   </div>
// );

const DevFunZone = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeGame, setActiveGame] = useState('reaction');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const games = [
    { id: 'reaction', name: 'Reaction Time', icon: Timer, component: ReactionGame, color: 'blue' },
    { id: 'memory', name: 'Memory Flip', icon: Brain, component: MemoryGame, color: 'purple' },
    { id: 'typing', name: 'Typing Speed', icon: Keyboard, component: TypingGame, color: 'green' },
    { id: 'mood', name: 'Mood Generator', icon: Palette, component: MoodGenerator, color: 'pink' },
    { id: 'whack', name: 'Whack-a-Bug', icon: Target, component: WhackABug, color: 'red' },
    { id: 'puzzle', name: 'Code Puzzle', icon: Code, component: CodingPuzzle, color: 'yellow' }
  ];

  const ActiveGameComponent = games.find(g => g.id === activeGame)?.component || ReactionGame;
  
  useEffect(() => {
    if (isModalOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // Store scroll position
      document.body.setAttribute('data-scroll-y', scrollY.toString());
    } else {
      // Restore scroll position
      const scrollY = document.body.getAttribute('data-scroll-y');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
      }
      
      document.body.removeAttribute('data-scroll-y');
    }

    // Cleanup function
    return () => {
      if (isModalOpen) {
        const scrollY = document.body.getAttribute('data-scroll-y');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY));
        }
        document.body.removeAttribute('data-scroll-y');
      }
    };
  }, [isModalOpen]);

  const mockLeaderboard = [
    { game: 'Reaction Time', score: '245ms', player: 'CodeNinja' },
    { game: 'Memory Flip', score: '12s', player: 'DevMaster' },
    { game: 'Typing Speed', score: '85 WPM', player: 'FastFingers' },
    { game: 'Whack-a-Bug', score: '1250 pts', player: 'BugSlayer' },
    { game: 'Code Puzzle', score: '3/3', player: 'JSGuru' }
  ];

  // Handle modal close
  const handleCloseModal = (e) => {
    e?.stopPropagation();
    setIsModalOpen(false);
  };

  // Handle button click with proper event handling
  const handleOpenModal = (e) => {
    e?.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Play Games Button */}
      <motion.button
        onClick={handleOpenModal}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold text-white transition-all duration-300 flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Gamepad2 size={20} />
        Play Games
      </motion.button>

      {/* Game Modal - Using React Portal equivalent by rendering at root level */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            style={{ 
              zIndex: 99999,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-gray-700/50 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                    <Gamepad2 className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">🎮 Dev Fun Zone</h2>
                    <p className="text-gray-400 text-sm">Choose your game and have fun!</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLeaderboard(!showLeaderboard);
                    }}
                    className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-gray-800 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Crown size={20} />
                  </motion.button>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="flex h-[70vh]">
                {/* Game Tabs Sidebar */}
                <div className="w-80 bg-gray-900/50 p-6 overflow-y-auto">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Trophy className="text-yellow-400" size={20} />
                    Games
                  </h3>
                  
                  <div className="space-y-3">
                    {games.map((game) => {
                      const Icon = game.icon;
                      const isActive = activeGame === game.id;
                      
                      return (
                        <motion.button
                          key={game.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveGame(game.id);
                          }}
                          className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                            isActive 
                              ? 'bg-opacity-20 border border-opacity-50 text-white' 
                              : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white border border-transparent'
                          }`}
                          style={{
                            backgroundColor: isActive ? `${game.color === 'blue' ? 'rgb(37 99 235)' : 
                              game.color === 'purple' ? 'rgb(147 51 234)' : 
                              game.color === 'green' ? 'rgb(34 197 94)' : 
                              game.color === 'pink' ? 'rgb(236 72 153)' : 
                              game.color === 'red' ? 'rgb(239 68 68)' : 
                              'rgb(234 179 8)'}/0.2` : undefined,
                            borderColor: isActive ? `${game.color === 'blue' ? 'rgb(37 99 235)' : 
                              game.color === 'purple' ? 'rgb(147 51 234)' : 
                              game.color === 'green' ? 'rgb(34 197 94)' : 
                              game.color === 'pink' ? 'rgb(236 72 153)' : 
                              game.color === 'red' ? 'rgb(239 68 68)' : 
                              'rgb(234 179 8)'}/0.5` : undefined
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className={`p-2 rounded-lg ${
                                isActive ? 'text-white' : 'bg-gray-700 text-white'
                              }`}
                              style={{
                                backgroundColor: isActive ? `${game.color === 'blue' ? 'rgb(37 99 235)' : 
                                  game.color === 'purple' ? 'rgb(147 51 234)' : 
                                  game.color === 'green' ? 'rgb(34 197 94)' : 
                                  game.color === 'pink' ? 'rgb(236 72 153)' : 
                                  game.color === 'red' ? 'rgb(239 68 68)' : 
                                  'rgb(234 179 8)'}` : undefined
                              }}
                            >
                              <Icon size={20} />
                            </div>
                            <div>
                              <div className="font-semibold">{game.name}</div>
                              <div className="text-xs text-gray-400">
                                {game.id === 'reaction' && '🔢 Test reflexes'}
                                {game.id === 'memory' && '🧠 Match pairs'}
                                {game.id === 'typing' && '⌨️ Speed test'}
                                {game.id === 'mood' && '🎨 Random moods'}
                                {game.id === 'whack' && '🎯 Click targets'}
                                {game.id === 'puzzle' && '🏁 Guess output'}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Game Content Area */}
                <div className="flex-1 relative">
                  {showLeaderboard ? (
                    <motion.div
                      className="p-8 h-full overflow-y-auto"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <Crown className="text-yellow-400" size={32} />
                        <h3 className="text-2xl font-bold text-white">Leaderboard</h3>
                      </div>
                      
                      <div className="space-y-4">
                        {mockLeaderboard.map((entry, index) => (
                          <motion.div
                            key={index}
                            className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                  index === 0 ? 'bg-yellow-500 text-black' :
                                  index === 1 ? 'bg-gray-400 text-black' :
                                  index === 2 ? 'bg-amber-600 text-black' :
                                  'bg-gray-600 text-white'
                                }`}>
                                  {index + 1}
                                </div>
                                <div>
                                  <div className="font-semibold text-white">{entry.player}</div>
                                  <div className="text-sm text-gray-400">{entry.game}</div>
                                </div>
                              </div>
                              <div className="text-lg font-bold text-green-400">{entry.score}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="h-full overflow-y-auto"
                      key={activeGame}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ActiveGameComponent />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DevFunZone;