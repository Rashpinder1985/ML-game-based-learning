import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface GameState {
  hearts: number
  streak: number
  xp: number
  level: number
  badges: string[]
  streakMultiplier: number
}

interface GameMechanicsProps {
  onCorrectAnswer: (xpGained: number) => void
  onIncorrectAnswer: () => void
  onStreakBreak: () => void
  ref?: React.Ref<any>
}

export const GameMechanics = React.forwardRef<any, GameMechanicsProps>(({
  onCorrectAnswer,
  onIncorrectAnswer,
  onStreakBreak
}, ref) => {
  const [gameState, setGameState] = useState<GameState>({
    hearts: 3,
    streak: 0,
    xp: 0,
    level: 1,
    badges: [],
    streakMultiplier: 1
  })

  const [showReward, setShowReward] = useState<string | null>(null)
  const [showHeartLoss, setShowHeartLoss] = useState(false)

  // Calculate level from XP
  const calculateLevel = (xp: number): number => {
    return Math.floor(xp / 1000) + 1
  }

  // Handle correct answer
  const handleCorrectAnswer = () => {
    setGameState(prev => {
      const newStreak = prev.streak + 1
      let newMultiplier = 1

      // Streak bonuses
      if (newStreak >= 10) newMultiplier = 3
      else if (newStreak >= 5) newMultiplier = 2
      else if (newStreak >= 3) newMultiplier = 1.5

      const baseXP = 25
      const xpGained = Math.floor(baseXP * newMultiplier)
      const newXP = prev.xp + xpGained
      const newLevel = calculateLevel(newXP)

      // Show reward animation
      if (newStreak === 3) setShowReward('🔥 Streak Started!')
      else if (newStreak === 5) setShowReward('⚡ Hot Streak!')
      else if (newStreak === 10) setShowReward('🌟 LEGENDARY STREAK!')
      else if (newLevel > prev.level) setShowReward(`📈 LEVEL UP! Level ${newLevel}`)

      onCorrectAnswer(xpGained)

      return {
        ...prev,
        streak: newStreak,
        xp: newXP,
        level: newLevel,
        streakMultiplier: newMultiplier
      }
    })
  }

  // Handle incorrect answer
  const handleIncorrectAnswer = () => {
    setGameState(prev => {
      const newHearts = prev.hearts - 1

      if (prev.streak > 0) {
        setShowReward('💔 Streak Broken!')
        onStreakBreak()
      }

      setShowHeartLoss(true)
      onIncorrectAnswer()

      return {
        ...prev,
        hearts: newHearts,
        streak: 0,
        streakMultiplier: 1
      }
    })
  }

  // Auto-hide rewards after 3 seconds
  useEffect(() => {
    if (showReward) {
      const timer = setTimeout(() => setShowReward(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [showReward])

  // Auto-hide heart loss after 2 seconds
  useEffect(() => {
    if (showHeartLoss) {
      const timer = setTimeout(() => setShowHeartLoss(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [showHeartLoss])

  // Game over when hearts reach 0
  const isGameOver = gameState.hearts <= 0

  // Expose methods via ref
  React.useImperativeHandle(ref, () => ({
    handleCorrectAnswer,
    handleIncorrectAnswer
  }))

  return (
    <div className="game-mechanics">
      {/* Top Status Bar */}
      <div className="status-bar">
        {/* Hearts */}
        <div className="hearts">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`heart ${i < gameState.hearts ? 'full' : 'empty'}`}
              animate={showHeartLoss && i === gameState.hearts ?
                { scale: [1, 1.5, 0] } : { scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {i < gameState.hearts ? '❤️' : '🖤'}
            </motion.div>
          ))}
        </div>

        {/* XP and Level */}
        <div className="xp-info">
          <div className="level">Level {gameState.level}</div>
          <div className="xp-bar">
            <div
              className="xp-fill"
              style={{
                width: `${(gameState.xp % 1000) / 10}%`
              }}
            />
            <span className="xp-text">{gameState.xp} XP</span>
          </div>
        </div>

        {/* Streak */}
        <div className="streak-info">
          <div className="streak-counter">
            🔥 {gameState.streak}
            {gameState.streakMultiplier > 1 && (
              <span className="multiplier">×{gameState.streakMultiplier}</span>
            )}
          </div>
        </div>
      </div>

      {/* Reward Animations */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            className="reward-popup"
            initial={{ opacity: 0, y: -50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.5 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            {showReward}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Screen */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            className="game-over-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="game-over-content">
              <h2>💀 Game Over</h2>
              <p>No hearts remaining!</p>
              <button
                className="retry-button"
                onClick={() => setGameState({
                  hearts: 3,
                  streak: 0,
                  xp: gameState.xp,
                  level: gameState.level,
                  badges: gameState.badges,
                  streakMultiplier: 1
                })}
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <style jsx>{`
        .game-mechanics {
          position: relative;
        }

        .status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 12px;
          margin-bottom: 20px;
          backdrop-filter: blur(10px);
        }

        .hearts {
          display: flex;
          gap: 5px;
        }

        .heart {
          font-size: 24px;
          transition: all 0.3s ease;
        }

        .heart.empty {
          opacity: 0.3;
        }

        .xp-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .level {
          color: #ffd700;
          font-weight: bold;
          font-size: 14px;
        }

        .xp-bar {
          position: relative;
          width: 200px;
          height: 20px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          overflow: hidden;
        }

        .xp-fill {
          height: 100%;
          background: linear-gradient(90deg, #4f9ff0, #667eea);
          transition: width 0.5s ease;
          border-radius: 10px;
        }

        .xp-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
          font-weight: bold;
          color: white;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        }

        .streak-info {
          display: flex;
          align-items: center;
        }

        .streak-counter {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 18px;
          font-weight: bold;
          color: #ff6b6b;
        }

        .multiplier {
          background: #ff6b6b;
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 12px;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .reward-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 20px 40px;
          border-radius: 15px;
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          z-index: 1000;
        }

        .game-over-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .game-over-content {
          background: #1a1a1a;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          color: white;
        }

        .game-over-content h2 {
          margin: 0 0 20px 0;
          font-size: 36px;
        }

        .game-over-content p {
          margin: 0 0 30px 0;
          font-size: 18px;
          opacity: 0.8;
        }

        .retry-button {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .retry-button:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
})

GameMechanics.displayName = 'GameMechanics'

export default GameMechanics