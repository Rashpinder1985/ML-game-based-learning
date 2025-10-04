import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Trophy, Zap, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Challenge1 from './challenges/Challenge1'
import Challenge2 from './challenges/Challenge2'
import Challenge3 from './challenges/Challenge3'
import Challenge4 from './challenges/Challenge4'
import Challenge5 from './challenges/Challenge5'
import Challenge6 from './challenges/Challenge6'
import Challenge7 from './challenges/Challenge7'
import Challenge8 from './challenges/Challenge8'
import Challenge9 from './challenges/Challenge9'
import Challenge10 from './challenges/Challenge10'
import GameStats from './GameStats'
import Toast from './Toast'

interface GameState {
  currentChallenge: number
  hearts: number
  streak: number
  xp: number
  level: number
  badges: string[]
  completedChallenges: Set<number>
  maxStreak: number
}

const INITIAL_STATE: GameState = {
  currentChallenge: 1,
  hearts: 3,
  streak: 0,
  xp: 0,
  level: 1,
  badges: [],
  completedChallenges: new Set(),
  maxStreak: 0
}

const challenges = [
  { id: 1, title: "Journey Between Towns", component: Challenge1, xp: 100 },
  { id: 2, title: "Vector Duel", component: Challenge2, xp: 150 },
  { id: 3, title: "Magic Bridge", component: Challenge3, xp: 200 },
  { id: 4, title: "Roads & Waypoints", component: Challenge4, xp: 175 },
  { id: 5, title: "Valley of Curves", component: Challenge5, xp: 225 },
  { id: 6, title: "Duel of Lines", component: Challenge6, xp: 200 },
  { id: 7, title: "Tower Watch", component: Challenge7, xp: 150 },
  { id: 8, title: "Triangle Forge", component: Challenge8, xp: 250 },
  { id: 9, title: "Circle Rune", component: Challenge9, xp: 200 },
  { id: 10, title: "Portals of Planes", component: Challenge10, xp: 300 }
]

const Module0Game: React.FC = () => {
  const { user, refreshUser } = useAuth()
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showStats, setShowStats] = useState(true)

  // Load game state from user data or localStorage
  useEffect(() => {
    const loadGameState = () => {
      if (user) {
        // Load from user's game stats
        const userStats = user.game_stats || {}
        const savedState = localStorage.getItem(`module0_gameState_${user.id}`)
        
        if (savedState) {
          const parsed = JSON.parse(savedState)
          setGameState({
            currentChallenge: parsed.currentChallenge || 1,
            hearts: userStats.hearts || 3,
            streak: userStats.current_streak || 0,
            xp: user.total_xp || 0,
            level: user.current_level || 1,
            badges: user.badges || [],
            completedChallenges: new Set(parsed.completedChallenges || []),
            maxStreak: userStats.max_streak || 0
          })
        } else {
          // Initialize from user data
          setGameState({
            currentChallenge: 1,
            hearts: userStats.hearts || 3,
            streak: userStats.current_streak || 0,
            xp: user.total_xp || 0,
            level: user.current_level || 1,
            badges: user.badges || [],
            completedChallenges: new Set(),
            maxStreak: userStats.max_streak || 0
          })
        }
      }
    }

    loadGameState()
  }, [user])

  // Save game state to localStorage and update user
  const saveGameState = useCallback(async (newState: GameState) => {
    if (!user) return

    // Save to localStorage
    localStorage.setItem(`module0_gameState_${user.id}`, JSON.stringify({
      currentChallenge: newState.currentChallenge,
      completedChallenges: [...newState.completedChallenges]
    }))

    // Update user stats via API
    try {
      const token = localStorage.getItem('access_token')
      await fetch('http://localhost:8000/api/v1/module0/challenge-complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          xp_earned: newState.xp - (gameState.xp || 0),
          hearts_remaining: newState.hearts,
          current_streak: newState.streak,
          challenge_id: gameState.currentChallenge,
          completed: newState.completedChallenges.has(gameState.currentChallenge),
          time_to_complete: Math.random() * 10, // Placeholder
          hints_used: 0 // Placeholder
        })
      })

      // Refresh user data
      await refreshUser()
    } catch (error) {
      console.error('Failed to update game progress:', error)
    }
  }, [user, gameState, refreshUser])

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const addXP = useCallback((amount: number, source?: string) => {
    setGameState(prev => {
      const newXP = prev.xp + amount
      const newLevel = Math.floor(newXP / 100) + 1
      const leveledUp = newLevel > prev.level

      if (leveledUp) {
        showToast(`🎉 Level Up! You're now level ${newLevel}!`, 'success')
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel
      }
    })
  }, [showToast])

  const completeChallenge = useCallback(async (challengeId: number, success: boolean) => {
    if (!success) {
      setGameState(prev => ({
        ...prev,
        hearts: Math.max(0, prev.hearts - 1)
      }))
      showToast('💔 Challenge failed! You lost a heart.', 'error')
      return
    }

    const challenge = challenges.find(c => c.id === challengeId)
    if (!challenge) return

    setGameState(prev => {
      const newCompleted = new Set(prev.completedChallenges)
      newCompleted.add(challengeId)
      
      const streakMultiplier = Math.floor(prev.streak / 3) + 1
      const bonusXP = challenge.xp * (streakMultiplier - 1)
      const totalXP = challenge.xp + bonusXP
      
      const newXP = prev.xp + totalXP
      const newLevel = Math.floor(newXP / 100) + 1
      const leveledUp = newLevel > prev.level

      const newStreak = prev.streak + 1
      const newMaxStreak = Math.max(prev.maxStreak, newStreak)

      // Determine next challenge
      const nextChallenge = Math.min(challengeId + 1, 10)

      if (leveledUp) {
        showToast(`🎉 Level Up! You're now level ${newLevel}!`, 'success')
      }

      if (streakMultiplier > 1) {
        showToast(`🔥 ${streakMultiplier}x Streak Bonus! +${bonusXP} XP`, 'success')
      }

      const newState = {
        ...prev,
        currentChallenge: nextChallenge,
        hearts: Math.min(3, prev.hearts + 1), // Restore heart on success
        streak: newStreak,
        maxStreak: newMaxStreak,
        xp: newXP,
        level: newLevel,
        completedChallenges: newCompleted
      }

      // Save state
      saveGameState(newState)

      return newState
    })

    showToast(`✅ Challenge ${challengeId} completed! +${challenge.xp} XP`, 'success')
  }, [saveGameState, showToast])

  const unlockChallenge = useCallback(async (challengeId: number) => {
    try {
      const token = localStorage.getItem('access_token')
      await fetch(`http://localhost:8000/api/v1/module0/unlock-challenge/${challengeId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
    } catch (error) {
      console.error('Failed to unlock challenge:', error)
    }
  }, [])

  const resetGame = useCallback(() => {
    if (window.confirm('Are you sure you want to reset your progress? This cannot be undone!')) {
      setGameState(INITIAL_STATE)
      if (user) {
        localStorage.removeItem(`module0_gameState_${user.id}`)
      }
      showToast('Game reset successfully', 'success')
    }
  }, [user, showToast])

  const currentChallengeData = challenges.find(c => c.id === gameState.currentChallenge)
  const CurrentChallengeComponent = currentChallengeData?.component || Challenge1

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Please log in to play Module 0</h1>
          <p>You need to be authenticated to track your progress.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="bg-black bg-opacity-30 backdrop-blur-sm border-b border-white border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">🧙‍♂️ Module 0: Math Adventure</h1>
                <p className="text-sm opacity-80">Master mathematics through epic quests</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowStats(!showStats)}
                className="p-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors"
              >
                <Trophy size={20} />
              </button>
              <div className="text-right">
                <p className="text-sm opacity-80">{user.full_name}</p>
                <p className="text-xs opacity-60">Level {gameState.level}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Game Stats Sidebar */}
          {showStats && (
            <div className="lg:col-span-1">
              <GameStats
                xp={gameState.xp}
                level={gameState.level}
                hearts={gameState.hearts}
                streak={gameState.streak}
                maxStreak={gameState.maxStreak}
                badges={gameState.badges}
                completedChallenges={gameState.completedChallenges.size}
                totalChallenges={challenges.length}
                onReset={resetGame}
              />
            </div>
          )}

          {/* Main Game Area */}
          <div className={showStats ? "lg:col-span-3" : "lg:col-span-4"}>
            <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-xl border border-white border-opacity-20 p-6">
              {/* Challenge Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      Challenge {gameState.currentChallenge}: {currentChallengeData?.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm opacity-80">
                      <span>🎯 {currentChallengeData?.xp} XP</span>
                      <span>🔥 {gameState.streak} streak</span>
                      <span>❤️ {gameState.hearts} hearts</span>
                    </div>
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="text-right">
                    <div className="text-sm opacity-80 mb-1">
                      Progress: {gameState.completedChallenges.size}/{challenges.length}
                    </div>
                    <div className="w-32 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                        style={{ width: `${(gameState.completedChallenges.size / challenges.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Challenge Component */}
              <div className="min-h-[400px]">
                <CurrentChallengeComponent
                  challengeId={gameState.currentChallenge}
                  onComplete={(success) => completeChallenge(gameState.currentChallenge, success)}
                  onUnlock={unlockChallenge}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.5, transition: { duration: 0.2 } }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Toast message={toast.message} type={toast.type} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Module0Game