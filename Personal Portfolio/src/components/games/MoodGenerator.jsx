import { useState, useEffect } from 'react';
import { Palette, RotateCcw, Heart, TrendingUp, Sparkles, Clock, Coffee, Brain, Zap } from 'lucide-react';

const MOOD_CATEGORIES = {
  energy: {
    name: 'Energy Level',
    icon: Zap,
    moods: [
      { label: "Hyper Coder", emoji: "⚡", description: "Lightning fast code ninja mode!", tips: ["Perfect for tackling complex algorithms", "Great time for refactoring"], energy: 95 },
      { label: "Energized Dev", emoji: "🚀", description: "Ready to launch into any project!", tips: ["Start that new feature you've been planning", "Good for learning new technologies"], energy: 85 },
      { label: "Steady Worker", emoji: "🔧", description: "Consistent and reliable productivity.", tips: ["Focus on documentation", "Perfect for code reviews"], energy: 70 },
      { label: "Low Battery", emoji: "🔋", description: "Running on reserve power.", tips: ["Stick to simple bug fixes", "Maybe time for a coffee break"], energy: 30 },
      { label: "Sleep Mode", emoji: "😴", description: "System needs recharging soon.", tips: ["Light tasks only", "Consider calling it a day"], energy: 15 }
    ]
  },
  focus: {
    name: 'Focus Mode',
    icon: Brain,
    moods: [
      { label: "Laser Focus", emoji: "🎯", description: "Unbreakable concentration achieved!", tips: ["Tackle the hardest problems", "Turn off all notifications"], energy: 90 },
      { label: "Deep Think", emoji: "🧠", description: "Processing complex thoughts...", tips: ["Perfect for architecture planning", "Good for system design"], energy: 80 },
      { label: "Scattered Mind", emoji: "🌪️", description: "Thoughts are everywhere at once.", tips: ["Break tasks into smaller chunks", "Use the Pomodoro technique"], energy: 45 },
      { label: "Distracted Dev", emoji: "🐿️", description: "Squirrel! Wait, what were we coding?", tips: ["Close social media tabs", "Find a quiet workspace"], energy: 35 }
    ]
  },
  creativity: {
    name: 'Creative Flow',
    icon: Sparkles,
    moods: [
      { label: "Creative Genius", emoji: "💡", description: "Ideas flowing like a waterfall!", tips: ["Start that side project", "Brainstorm new features"], energy: 95 },
      { label: "Innovation Mode", emoji: "🎨", description: "Painting code with artistic flair.", tips: ["Experiment with new patterns", "Redesign that old UI"], energy: 85 },
      { label: "Builder Spirit", emoji: "🔨", description: "Ready to construct digital masterpieces.", tips: ["Perfect for prototyping", "Try a new framework"], energy: 75 },
      { label: "Maintenance Mode", emoji: "🔧", description: "Steady improvements and fixes.", tips: ["Optimize existing code", "Update dependencies"], energy: 60 },
      { label: "Creative Block", emoji: "🧱", description: "The well of ideas has run dry.", tips: ["Read some tech blogs", "Take a walk to refresh"], energy: 25 }
    ]
  },
  social: {
    name: 'Team Vibe',
    icon: Heart,
    moods: [
      { label: "Team Player", emoji: "🤝", description: "Ready to collaborate and share knowledge!", tips: ["Great time for pair programming", "Help teammates with code reviews"], energy: 80 },
      { label: "Mentor Mode", emoji: "👨‍🏫", description: "Sharing wisdom with the dev community.", tips: ["Answer questions on Stack Overflow", "Write technical documentation"], energy: 75 },
      { label: "Solo Warrior", emoji: "🥷", description: "Flying solo on this coding mission.", tips: ["Focus on personal projects", "Deep dive into challenging problems"], energy: 70 },
      { label: "Meeting Survivor", emoji: "🏃‍♂️", description: "Just escaped from meeting hell.", tips: ["Need quiet time to decompress", "Catch up on actual coding work"], energy: 40 },
      { label: "Hermit Coder", emoji: "🏠", description: "Do not disturb - coding in progress.", tips: ["Perfect for heads-down development", "Mute all notifications"], energy: 65 }
    ]
  }
};

const TIME_BASED_MODIFIERS = {
  morning: { multiplier: 1.2, bonus: "Morning Fresh Bonus!" },
  afternoon: { multiplier: 1.0, bonus: "Peak Performance Time!" },
  evening: { multiplier: 0.9, bonus: "Evening Wind-down Mode" },
  latenight: { multiplier: 0.7, bonus: "Night Owl Special!" }
};

const MoodGenerator = () => {
  const [gameState, setGameState] = useState('home'); // 'home', 'generating', 'result', 'history'
  const [currentMood, setCurrentMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('random');
  const [isGenerating, setIsGenerating] = useState(false);
  const [personalityScore, setPersonalityScore] = useState({
    energy: 50,
    focus: 50,
    creativity: 50,
    social: 50
  });
  const [dailyStreak, setDailyStreak] = useState(1);
  const [totalMoods, setTotalMoods] = useState(0);

  // Get current time context
  const getCurrentTimeContext = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'latenight';
  };

  // Generate mood with AI-like logic
  const generateMood = async (category = 'random') => {
    setIsGenerating(true);
    setGameState('generating');
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let selectedCategory;
    let moodPool;
    
    if (category === 'random') {
      const categories = Object.keys(MOOD_CATEGORIES);
      selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    } else {
      selectedCategory = category;
    }
    
    moodPool = MOOD_CATEGORIES[selectedCategory].moods;
    
    // Add some "AI intelligence" based on time and history
    const timeContext = getCurrentTimeContext();
    const timeModifier = TIME_BASED_MODIFIERS[timeContext];
    
    // Bias towards higher energy in morning, lower in evening
    let weightedMoods = moodPool.map(mood => ({
      ...mood,
      weight: mood.energy * timeModifier.multiplier + Math.random() * 20
    }));
    
    // Sort by weight and add some randomness
    weightedMoods.sort((a, b) => b.weight - a.weight);
    const topMoods = weightedMoods.slice(0, 3);
    const selectedMood = topMoods[Math.floor(Math.random() * topMoods.length)];
    
    // Add metadata
    const moodWithMetadata = {
      ...selectedMood,
      category: selectedCategory,
      timeContext,
      timeBonus: timeModifier.bonus,
      timestamp: new Date(),
      id: Date.now()
    };
    
    setCurrentMood(moodWithMetadata);
    setMoodHistory(prev => [moodWithMetadata, ...prev].slice(0, 10));
    setTotalMoods(prev => prev + 1);
    
    // Update personality score
    setPersonalityScore(prev => ({
      ...prev,
      [selectedCategory]: Math.min(100, prev[selectedCategory] + Math.random() * 10)
    }));
    
    setIsGenerating(false);
    setGameState('result');
  };

  // Get compatibility with teammates
  const getTeamCompatibility = () => {
    if (!currentMood) return null;
    
    const compatibleMoods = {
      "Team Player": ["Mentor Mode", "Creative Genius", "Innovation Mode"],
      "Mentor Mode": ["Team Player", "Builder Spirit", "Deep Think"],
      "Solo Warrior": ["Laser Focus", "Creative Genius", "Hermit Coder"],
      "Creative Genius": ["Innovation Mode", "Team Player", "Builder Spirit"],
      "Hyper Coder": ["Energized Dev", "Laser Focus", "Innovation Mode"]
    };
    
    return compatibleMoods[currentMood.label] || ["Fellow Coders", "Understanding Devs"];
  };

  // Get mood insights
  const getMoodInsights = () => {
    if (!currentMood) return [];
    
    const insights = [
      `Your ${currentMood.category} level is at ${currentMood.energy}%`,
      `This mood is perfect for ${currentMood.tips[0].toLowerCase()}`,
      `Time context: ${currentMood.timeBonus}`,
      `Productivity prediction: ${currentMood.energy > 70 ? 'High' : currentMood.energy > 40 ? 'Medium' : 'Low'}`
    ];
    
    return insights;
  };

  const resetAll = () => {
    setGameState('home');
    setCurrentMood(null);
    setSelectedCategory('random');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Home Screen
  if (gameState === 'home') {
    return (
      <div className="text-center p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <Palette className="mx-auto mb-4 text-pink-400" size={48} />
          <h3 className="text-3xl font-bold mb-2 text-white">AI Dev Mood Generator</h3>
          <p className="text-gray-400">Discover your perfect developer mood for maximum productivity!</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <TrendingUp className="mx-auto mb-2 text-blue-400" size={24} />
            <div className="text-xl font-bold text-white">{totalMoods}</div>
            <div className="text-xs text-gray-400">Moods Generated</div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <Zap className="mx-auto mb-2 text-yellow-400" size={24} />
            <div className="text-xl font-bold text-white">{dailyStreak}</div>
            <div className="text-xs text-gray-400">Daily Streak</div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <Brain className="mx-auto mb-2 text-purple-400" size={24} />
            <div className="text-xl font-bold text-white">{Math.round(Object.values(personalityScore).reduce((a, b) => a + b) / 4)}</div>
            <div className="text-xs text-gray-400">AI Score</div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <Clock className="mx-auto mb-2 text-green-400" size={24} />
            <div className="text-xl font-bold text-white">{getCurrentTimeContext()}</div>
            <div className="text-xs text-gray-400">Current Vibe</div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-white mb-4">Choose Your Mood Category</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedCategory('random')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedCategory === 'random' 
                  ? 'border-pink-500 bg-pink-500/20' 
                  : 'border-gray-600 bg-gray-800/50 hover:border-pink-400'
              }`}
            >
              <Sparkles className="mx-auto mb-2 text-pink-400" size={24} />
              <div className="text-sm font-semibold text-white">Surprise Me!</div>
              <div className="text-xs text-gray-400">AI will choose</div>
            </button>
            {Object.entries(MOOD_CATEGORIES).map(([key, category]) => {
              const Icon = category.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCategory === key 
                      ? 'border-blue-500 bg-blue-500/20' 
                      : 'border-gray-600 bg-gray-800/50 hover:border-blue-400'
                  }`}
                >
                  <Icon className="mx-auto mb-2 text-blue-400" size={24} />
                  <div className="text-sm font-semibold text-white">{category.name}</div>
                  <div className="text-xs text-gray-400">{category.moods.length} moods</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => generateMood(selectedCategory)}
            className="w-full px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 rounded-lg font-semibold text-white transition-all duration-300 text-lg flex items-center justify-center gap-2"
          >
            <Sparkles size={24} />
            Generate My Dev Mood
          </button>
          
          {moodHistory.length > 0 && (
            <button
              onClick={() => setGameState('history')}
              className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Clock size={20} />
              View Mood History ({moodHistory.length})
            </button>
          )}
        </div>
      </div>
    );
  }

  // Generating Screen
  if (gameState === 'generating') {
    return (
      <div className="text-center p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="relative">
            <Sparkles className="mx-auto mb-4 text-pink-400 animate-spin" size={64} />
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-white">AI is analyzing your vibe...</h3>
          <p className="text-gray-400">Processing cosmic developer energy patterns</p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Currently analyzing:</div>
            <div className="space-y-2">
              <div className="text-blue-400">⚡ Current time context: {getCurrentTimeContext()}</div>
              <div className="text-green-400">🧠 Personality patterns</div>
              <div className="text-purple-400">📊 Historical mood data</div>
              <div className="text-yellow-400">🎯 Optimal productivity match</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result Screen
  if (gameState === 'result') {
    const insights = getMoodInsights();
    const compatibility = getTeamCompatibility();
    
    return (
      <div className="text-center p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="relative mb-6">
            <div className="text-8xl mb-4 animate-bounce">{currentMood.emoji}</div>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          </div>
          <h3 className="text-3xl font-bold mb-2 text-white">{currentMood.label}</h3>
          <p className="text-gray-400 text-lg mb-4">{currentMood.description}</p>
          <div className="text-sm text-blue-400 bg-blue-500/10 rounded-full px-4 py-2 inline-block">
            {currentMood.timeBonus}
          </div>
        </div>

        {/* Energy Level */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Energy Level</h4>
            <div className="text-xl font-bold text-white">{currentMood.energy}%</div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                currentMood.energy > 70 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                currentMood.energy > 40 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                'bg-gradient-to-r from-red-400 to-pink-500'
              }`}
              style={{ width: `${currentMood.energy}%` }}
            ></div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="text-purple-400" size={20} />
            AI Insights
          </h4>
          <div className="space-y-2">
            {insights.map((insight, index) => (
              <div key={index} className="text-gray-300 text-left">• {insight}</div>
            ))}
          </div>
        </div>

        {/* Productivity Tips */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
          <h4 className="text-lg font-semibold text-white mb-4">🎯 Productivity Tips</h4>
          <div className="space-y-2">
            {currentMood.tips.map((tip, index) => (
              <div key={index} className="text-gray-300 text-left">• {tip}</div>
            ))}
          </div>
        </div>

        {/* Team Compatibility */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Heart className="text-red-400" size={20} />
            Team Compatibility
          </h4>
          <div className="text-gray-300">
            Works great with: {compatibility.join(', ')}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => generateMood(selectedCategory)}
            className="w-full px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 rounded-lg transition-colors font-semibold"
          >
            Generate Another Mood
          </button>
          <button
            onClick={resetAll}
            className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // History Screen
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Clock className="text-blue-400" size={28} />
          Mood History
        </h3>
        <button
          onClick={() => setGameState('home')}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {moodHistory.map((mood, index) => (
          <div key={mood.id} className="bg-gray-800/50 rounded-lg p-4 flex items-center gap-4">
            <div className="text-3xl">{mood.emoji}</div>
            <div className="flex-1">
              <div className="font-semibold text-white">{mood.label}</div>
              <div className="text-sm text-gray-400">
                {formatTime(mood.timestamp)} • {mood.category} • {mood.energy}% energy
              </div>
            </div>
            <div className="text-sm text-blue-400">{mood.timeBonus.split(' ')[0]}</div>
          </div>
        ))}
      </div>

      {moodHistory.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="mx-auto mb-4 text-gray-600" size={48} />
          <p className="text-gray-400">No mood history yet. Generate your first mood!</p>
        </div>
      )}
    </div>
  );
};

export default MoodGenerator;