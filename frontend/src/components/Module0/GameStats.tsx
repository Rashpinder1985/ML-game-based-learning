import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Zap, Star, Award, RefreshCcw, Trophy } from 'lucide-react'

interface GameStatsProps {
  xp: number
  level: number
  hearts: number
  streak: number
  maxStreak: number
  badges: string[]
  completedChallenges: number
  totalChallenges: number
  onReset: () => void
}

const GameStats: React.FC<GameStatsProps> = ({
  xp,
  level,
  hearts,
  streak,
  maxStreak,
  badges,
  completedChallenges,
  totalChallenges,
  onReset
}) => {
  const completionPercentage = totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black bg-opacity-30 backdrop-blur-sm rounded-xl border border-white border-opacity-20 p-6 flex flex-col gap-6"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Trophy size={18} /> Player Stats
          </h2>
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-xs uppercase tracking-wide bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors text-white px-3 py-1.5 rounded-md"
          >
            <RefreshCcw size={14} /> Reset
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-indigo-200 mb-1">
              <Star size={16} /> Level
            </div>
            <div className="text-2xl font-bold text-white">{level}</div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-indigo-200 mb-1">
              <Award size={16} /> XP
            </div>
            <div className="text-2xl font-bold text-white">{xp}</div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-indigo-200 mb-1">
              <Heart size={16} /> Hearts
            </div>
            <div className="text-2xl font-bold text-white">{hearts}/3</div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-indigo-200 mb-1">
              <Zap size={16} /> Streak
            </div>
            <div className="text-2xl font-bold text-white">{streak}</div>
            <div className="text-xs text-indigo-200">Best: {maxStreak}</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-indigo-200 mb-2 uppercase tracking-wide">Progress</h3>
        <div className="bg-white bg-opacity-10 rounded-lg p-4">
          <div className="flex justify-between items-center text-sm text-white mb-2">
            <span>Challenges Completed</span>
            <span>{completedChallenges}/{totalChallenges}</span>
          </div>
          <div className="w-full h-2 bg-black bg-opacity-30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="text-xs text-indigo-200 mt-2">{completionPercentage}% complete</div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-indigo-200 mb-2 uppercase tracking-wide">Badges</h3>
        {badges.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="text-xs px-3 py-1 rounded-full bg-white bg-opacity-10 text-white border border-white border-opacity-20"
              >
                {badge}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-indigo-200">No badges earned yet. Keep going!</p>
        )}
      </div>
    </motion.div>
  )
}

export default GameStats
