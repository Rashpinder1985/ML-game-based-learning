import React from 'react'
import { motion } from 'framer-motion'
import { Play, CheckCircle, Lock, Clock, TrendingUp, Target, Award, Code } from 'lucide-react'
import { Lesson } from '../types'

interface LessonCardProps {
  lesson: Lesson
  isSelected: boolean
  isUnlocked: boolean
  completionStatus: 'not-started' | 'in-progress' | 'completed'
  accuracy?: number
  timeSpent?: number
  onClick: () => void
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  isSelected,
  isUnlocked,
  completionStatus,
  accuracy,
  timeSpent,
  onClick
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return '#4ecdc4'
      case 'intermediate': return '#f39c12'
      case 'advanced': return '#e74c3c'
      default: return '#95a5a6'
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return <Code size={16} />
      case 'intermediate': return <TrendingUp size={16} />
      case 'advanced': return <Award size={16} />
      default: return <Target size={16} />
    }
  }

  const getStatusIcon = () => {
    if (!isUnlocked) return <Lock size={20} color="#95a5a6" />

    switch (completionStatus) {
      case 'completed':
        return <CheckCircle size={20} color="#4ecdc4" />
      case 'in-progress':
        return <Play size={20} color="#f39c12" />
      default:
        return <Play size={20} color="#3498db" />
    }
  }

  const getXPValue = () => {
    let baseXP = 50
    if (lesson.difficulty === 'intermediate') baseXP = 75
    if (lesson.difficulty === 'advanced') baseXP = 100

    if (lesson.title.toLowerCase().includes('linear')) baseXP += 25
    if (lesson.title.toLowerCase().includes('polynomial')) baseXP += 35
    if (lesson.title.toLowerCase().includes('bias')) baseXP += 50

    return baseXP
  }

  return (
    <motion.div
      whileHover={{ scale: isUnlocked ? 1.02 : 1, y: isUnlocked ? -2 : 0 }}
      whileTap={{ scale: isUnlocked ? 0.98 : 1 }}
      onClick={isUnlocked ? onClick : undefined}
      style={{
        background: isSelected
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : isUnlocked
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
          : 'linear-gradient(135deg, #2c2c2c 0%, #3a3a3a 100%)',
        border: isSelected ? '2px solid #4ecdc4' : '2px solid transparent',
        borderRadius: '12px',
        padding: '20px',
        margin: '10px 0',
        cursor: isUnlocked ? 'pointer' : 'not-allowed',
        position: 'relative',
        overflow: 'hidden',
        opacity: isUnlocked ? 1 : 0.6,
        color: 'white'
      }}
    >
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: `radial-gradient(circle, ${getDifficultyColor(lesson.difficulty)}20 0%, transparent 70%)`,
        borderRadius: '50%',
        transform: 'translate(30px, -30px)'
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1 }}>
          {getStatusIcon()}
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 'bold',
            color: isUnlocked ? 'white' : '#95a5a6'
          }}>
            {lesson.title}
          </h3>
        </div>

        <div style={{
          background: getDifficultyColor(lesson.difficulty),
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {getDifficultyIcon(lesson.difficulty)}
          {lesson.difficulty.toUpperCase()}
        </div>
      </div>

      {/* Description */}
      <p style={{
        margin: '0 0 16px 0',
        fontSize: '14px',
        color: isUnlocked ? '#b0b0b0' : '#777',
        lineHeight: '1.4'
      }}>
        {lesson.description}
      </p>

      {/* Module Badge */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '12px',
        display: 'inline-block',
        marginBottom: '12px',
        color: isUnlocked ? '#e0e0e0' : '#888'
      }}>
        📚 {lesson.module}
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '12px'
      }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {/* XP Value */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
            <span style={{ color: '#f39c12' }}>⭐</span>
            <span>{getXPValue()} XP</span>
          </div>

          {/* Completion Stats */}
          {completionStatus === 'completed' && (
            <>
              {accuracy && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                  <Target size={12} color="#4ecdc4" />
                  <span>{accuracy}%</span>
                </div>
              )}
              {timeSpent && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                  <Clock size={12} color="#95a5a6" />
                  <span>{Math.round(timeSpent / 60)}m</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Progress Indicator */}
        {completionStatus === 'in-progress' && (
          <div style={{
            width: '40px',
            height: '4px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '60%' }}
              style={{
                height: '100%',
                background: '#f39c12',
                borderRadius: '2px'
              }}
            />
          </div>
        )}
      </div>

      {/* Unlock Requirements */}
      {!isUnlocked && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.8)',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          textAlign: 'center',
          color: '#f39c12'
        }}>
          🔒 Complete previous lessons to unlock
        </div>
      )}
    </motion.div>
  )
}

export default LessonCard