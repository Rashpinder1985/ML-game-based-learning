import React from 'react'
import { motion } from 'framer-motion'
import { X, Trophy, Zap, Heart, Star, Target } from 'lucide-react'

interface GameStatsProps {
  gameState: {
    currentChallenge: number
    hearts: number
    streak: number
    xp: number
    level: number
    badges: string[]
    completedChallenges: Set<number>
    maxStreak: number
  }
  challenges: Array<{ id: number; title: string; xp: number }>
  onClose: () => void
}

const GameStats: React.FC<GameStatsProps> = ({ gameState, challenges, onClose }) => {
  const completionPercentage = (gameState.completedChallenges.size / challenges.length) * 100
  const totalPossibleXP = challenges.reduce((sum, challenge) => sum + challenge.xp, 0)
  const earnedXP = challenges
    .filter(challenge => gameState.completedChallenges.has(challenge.id))
    .reduce((sum, challenge) => sum + challenge.xp, 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          padding: '30px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          border: '2px solid #4f9ff0'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{ margin: 0, color: '#4f9ff0', fontSize: '24px' }}>
            📊 Adventure Statistics
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Level */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <Star size={32} color="#ffd700" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffd700' }}>
              {gameState.level}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.7 }}>Level</div>
          </div>

          {/* XP */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <Target size={32} color="#4f9ff0" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4f9ff0' }}>
              {gameState.xp}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.7 }}>Experience</div>
          </div>

          {/* Hearts */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <Heart size={32} color="#ff6b6b" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff6b6b' }}>
              {gameState.hearts}/3
            </div>
            <div style={{ fontSize: '14px', opacity: 0.7 }}>Hearts</div>
          </div>

          {/* Max Streak */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <Zap size={32} color="#ffd700" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffd700' }}>
              {gameState.maxStreak}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.7 }}>Best Streak</div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#4ecdc4' }}>🎯 Progress</h3>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px'
            }}>
              <span>Challenges Completed</span>
              <span>{gameState.completedChallenges.size}/{challenges.length}</span>
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '4px',
              height: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
                height: '100%',
                width: `${completionPercentage}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px',
              fontSize: '14px',
              opacity: 0.7
            }}>
              <span>XP Earned</span>
              <span>{earnedXP}/{totalPossibleXP}</span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#4ecdc4' }}>🏆 Badges</h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            {gameState.badges.length > 0 ? (
              gameState.badges.map((badge, index) => (
                <div
                  key={index}
                  style={{
                    background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                    color: '#333',
                    padding: '8px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  {badge === 'streak-master' && '⚡ Streak Master'}
                  {badge === 'completionist' && '🎯 Completionist'}
                  {badge === 'math-wizard' && '🧙‍♂️ Math Wizard'}
                  {badge === 'vector-master' && '📐 Vector Master'}
                  {badge === 'geometry-legend' && '📏 Geometry Legend'}
                </div>
              ))
            ) : (
              <div style={{ opacity: 0.5, fontStyle: 'italic' }}>
                No badges earned yet. Keep adventuring!
              </div>
            )}
          </div>
        </div>

        {/* Challenge List */}
        <div>
          <h3 style={{ margin: '0 0 15px 0', color: '#4ecdc4' }}>🗺️ Challenge Map</h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                style={{
                  background: gameState.completedChallenges.has(challenge.id)
                    ? 'rgba(78, 205, 196, 0.1)'
                    : challenge.id === gameState.currentChallenge
                    ? 'rgba(79, 159, 240, 0.1)'
                    : 'rgba(255,255,255,0.05)',
                  border: gameState.completedChallenges.has(challenge.id)
                    ? '1px solid #4ecdc4'
                    : challenge.id === gameState.currentChallenge
                    ? '1px solid #4f9ff0'
                    : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {gameState.completedChallenges.has(challenge.id) ? (
                    <Trophy size={16} color="#4ecdc4" />
                  ) : challenge.id === gameState.currentChallenge ? (
                    <Target size={16} color="#4f9ff0" />
                  ) : (
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.3)'
                    }} />
                  )}
                  <span style={{
                    opacity: challenge.id > gameState.currentChallenge ? 0.5 : 1
                  }}>
                    {challenge.title}
                  </span>
                </div>
                <span style={{
                  fontSize: '12px',
                  opacity: 0.7
                }}>
                  +{challenge.xp} XP
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default GameStats