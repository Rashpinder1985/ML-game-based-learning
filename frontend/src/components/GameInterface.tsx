import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Zap, Target, TrendingUp, Award, Code, PlayCircle } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  xp: number
}

interface GameStats {
  level: number
  currentXP: number
  xpToNext: number
  totalXP: number
  lessonsCompleted: number
  streak: number
  accuracy: number
}

interface GameInterfaceProps {
  userId: string
  onLevelUp?: (newLevel: number) => void
}

export interface GameInterfaceHandle {
  completeLesson: (lessonTitle: string, accuracy?: number) => void
  addXP: (xpAmount: number, reason?: string) => void
}

export const GameInterface = forwardRef<GameInterfaceHandle, GameInterfaceProps>(({ 
  userId,
  onLevelUp
}, ref) => {
  const [gameStats, setGameStats] = useState<GameStats>({
    level: 1,
    currentXP: 0,
    xpToNext: 100,
    totalXP: 0,
    lessonsCompleted: 0,
    streak: 0,
    accuracy: 0
  })

  const [achievements] = useState<Achievement[]>([
    {
      id: 'first_lesson',
      title: 'First Steps',
      description: 'Complete your first ML lesson',
      icon: <PlayCircle size={24} />,
      unlocked: false,
      xp: 50
    },
    {
      id: 'linear_master',
      title: 'Linear Legend',
      description: 'Master linear regression concepts',
      icon: <TrendingUp size={24} />,
      unlocked: false,
      xp: 100
    },
    {
      id: 'polynomial_pro',
      title: 'Polynomial Pro',
      description: 'Complete polynomial regression lessons',
      icon: <Target size={24} />,
      unlocked: false,
      xp: 150
    },
    {
      id: 'bias_variance_expert',
      title: 'Bias-Variance Expert',
      description: 'Understand the bias-variance tradeoff',
      icon: <Award size={24} />,
      unlocked: false,
      xp: 200
    },
    {
      id: 'code_ninja',
      title: 'Code Ninja',
      description: 'Write perfect code 5 times in a row',
      icon: <Code size={24} />,
      unlocked: false,
      xp: 120
    },
    {
      id: 'streak_master',
      title: 'Streak Master',
      description: 'Maintain a 7-day learning streak',
      icon: <Zap size={24} />,
      unlocked: false,
      xp: 300
    }
  ])

  const [recentNotification, setRecentNotification] = useState<string | null>(null)

  useEffect(() => {
    // Load game stats from localStorage
    const savedStats = localStorage.getItem(`gameStats_${userId}`)
    if (savedStats) {
      try {
        setGameStats(JSON.parse(savedStats))
      } catch (e) {
        console.error('Failed to load game stats:', e)
      }
    }
  }, [userId])

  const calculateLevel = (xp: number): number => {
    return Math.floor(xp / 100) + 1
  }

  const calculateXPToNext = (currentXP: number): number => {
    const currentLevel = calculateLevel(currentXP)
    return currentLevel * 100 - currentXP
  }

  const addXP = (xpAmount: number, reason: string = 'Lesson completed') => {
    setGameStats(prev => {
      const newTotalXP = prev.totalXP + xpAmount
      const newLevel = calculateLevel(newTotalXP)
      const newXPToNext = calculateXPToNext(newTotalXP)

      const newStats = {
        ...prev,
        currentXP: newTotalXP % 100,
        totalXP: newTotalXP,
        xpToNext: newXPToNext,
        level: newLevel
      }

      // Check for level up
      if (newLevel > prev.level && onLevelUp) {
        onLevelUp(newLevel)
        showNotification(`🎉 Level Up! You're now level ${newLevel}!`)
      } else {
        showNotification(`+${xpAmount} XP - ${reason}`)
      }

      // Save to localStorage
      try {
        localStorage.setItem(`gameStats_${userId}`, JSON.stringify(newStats))
      } catch (e) {
        console.error('Failed to save game stats:', e)
      }

      return newStats
    })
  }

  const completeLesson = (lessonTitle: string, accuracy: number = 100) => {
    let xpGained = 50 // Base XP for completing a lesson

    // Bonus XP for high accuracy
    if (accuracy >= 90) xpGained += 20
    if (accuracy === 100) xpGained += 10

    // Bonus XP for specific lesson types
    if (lessonTitle.toLowerCase().includes('linear')) xpGained += 25
    if (lessonTitle.toLowerCase().includes('polynomial')) xpGained += 35
    if (lessonTitle.toLowerCase().includes('bias')) xpGained += 50

    addXP(xpGained, `${lessonTitle} (${accuracy}% accuracy)`)

    setGameStats(prev => ({
      ...prev,
      lessonsCompleted: prev.lessonsCompleted + 1,
      accuracy: Math.round((prev.accuracy * prev.lessonsCompleted + accuracy) / (prev.lessonsCompleted + 1))
    }))
  }

  const showNotification = (message: string) => {
    setRecentNotification(message)
    setTimeout(() => setRecentNotification(null), 3000)
  }

  // Expose methods through ref
  useImperativeHandle(ref, () => ({
    completeLesson,
    addXP
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="game-interface"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        borderRadius: '12px',
        color: 'white',
        marginBottom: '20px'
      }}
    >
      {/* Level and XP Display */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '8px 15px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Star size={20} fill="gold" color="gold" />
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Level {gameStats.level}</span>
          </div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>
            {gameStats.currentXP} / {gameStats.level * 100} XP
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{gameStats.lessonsCompleted}</div>
            <div style={{ opacity: 0.8 }}>Lessons</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{gameStats.accuracy}%</div>
            <div style={{ opacity: 0.8 }}>Accuracy</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{gameStats.streak}</div>
            <div style={{ opacity: 0.8 }}>Streak</div>
          </div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div style={{
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '10px',
        height: '8px',
        marginBottom: '15px',
        overflow: 'hidden'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(gameStats.currentXP / (gameStats.level * 100)) * 100}%` }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #4ecdc4, #44a08d)',
            borderRadius: '10px'
          }}
        />
      </div>

      {/* Achievement Showcase */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {achievements.slice(0, 6).map((achievement) => (
          <motion.div
            key={achievement.id}
            whileHover={{ scale: 1.05 }}
            style={{
              background: achievement.unlocked
                ? 'rgba(78, 205, 196, 0.2)'
                : 'rgba(255,255,255,0.1)',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              minWidth: '80px',
              opacity: achievement.unlocked ? 1 : 0.5,
              border: achievement.unlocked ? '1px solid #4ecdc4' : '1px solid transparent'
            }}
          >
            {achievement.icon}
            <div style={{ fontSize: '10px', textAlign: 'center' }}>
              {achievement.title}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Notification */}
      <AnimatePresence>
        {recentNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              background: '#4ecdc4',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '6px',
              fontWeight: 'bold',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            {recentNotification}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

GameInterface.displayName = 'GameInterface'

export default GameInterface
