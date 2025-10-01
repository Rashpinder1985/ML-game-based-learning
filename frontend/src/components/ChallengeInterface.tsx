import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'

interface Challenge {
  id: string
  type: 'distance' | 'angle' | 'coordinate' | 'equation' | 'calculation'
  question: string
  correctAnswer: number | string
  tolerance?: number
  hints: string[]
  explanation?: string
}

interface ChallengeInterfaceProps {
  challenge: Challenge
  onCorrectAnswer: (reward: { xp: number, message: string }) => void
  onIncorrectAnswer: (feedback: string) => void
}

export const ChallengeInterface: React.FC<ChallengeInterfaceProps> = ({
  challenge,
  onCorrectAnswer,
  onIncorrectAnswer
}) => {
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [currentHintIndex, setCurrentHintIndex] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [lastFeedback, setLastFeedback] = useState('')
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | ''>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const checkAnswer = () => {
    // Don't allow more than 3 attempts
    if (attempts >= 3) {
      return
    }

    const userInput = userAnswer.trim()
    if (!userInput) {
      onIncorrectAnswer('Please enter an answer')
      return
    }

    const userValue = parseFloat(userInput)
    const correctValue = typeof challenge.correctAnswer === 'number' ?
      challenge.correctAnswer : parseFloat(challenge.correctAnswer.toString())

    const tolerance = challenge.tolerance || 0.1

    // Check if input is a valid number
    if (isNaN(userValue)) {
      setAttempts(prev => prev + 1)
      onIncorrectAnswer('🤔 Please enter a valid number')

      if (attempts + 1 >= 2 && !showHint) {
        setShowHint(true)
      }
      return
    }

    const isCorrect = Math.abs(userValue - correctValue) <= tolerance

    if (isCorrect) {
      // Calculate XP based on attempts (fewer attempts = more XP)
      const baseXP = 50
      const attemptsMultiplier = Math.max(1, 3 - attempts)
      const xpGained = baseXP * attemptsMultiplier

      const message = attempts === 0 ? '🎯 Perfect First Try!' :
                     attempts === 1 ? '⭐ Great Job!' : '👍 Correct!'

      setLastFeedback(message)
      setFeedbackType('success')

      onCorrectAnswer({
        xp: xpGained,
        message: message
      })

      setShowExplanation(true)
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)

      // Provide specific feedback based on how close they were
      const difference = Math.abs(userValue - correctValue)
      let feedback = ''

      if (difference <= tolerance * 2) {
        feedback = '🔥 Very close! Try adjusting your answer slightly.'
      } else if (difference <= tolerance * 5) {
        feedback = '📏 Getting warmer! Check your calculations.'
      } else {
        feedback = '🎯 Not quite right. Try a different approach.'
      }

      // Add attempt info to feedback
      if (newAttempts >= 3) {
        feedback += ` You've used all 3 attempts. The correct answer was ${correctValue}.`
        setShowExplanation(true)
      } else {
        feedback += ` (Attempt ${newAttempts}/3)`
      }

      setLastFeedback(feedback)
      setFeedbackType('error')

      onIncorrectAnswer(feedback)

      // Show hint after 2 attempts
      if (newAttempts >= 2 && !showHint) {
        setShowHint(true)
      }
    }
  }

  const getNextHint = () => {
    if (currentHintIndex < challenge.hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer()
    }
  }

  return (
    <div className="challenge-interface">
      <div className="challenge-question">
        <h3>🎯 Challenge</h3>
        <p>{challenge.question}</p>
      </div>

      <div className="input-section">
        <div className="input-group">
          <input
            ref={inputRef}
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your answer..."
            className="challenge-input"
            disabled={showExplanation || attempts >= 3}
          />
          <button
            onClick={checkAnswer}
            disabled={!userAnswer.trim() || showExplanation || attempts >= 3}
            className="submit-button"
          >
            Submit
          </button>
        </div>

        {attempts > 0 && (
          <div className="attempt-counter">
            Attempts: {attempts}/3
          </div>
        )}

        {lastFeedback && (
          <motion.div
            className={`feedback-display ${feedbackType}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {lastFeedback}
          </motion.div>
        )}
      </div>

      {/* Hints Section */}
      {showHint && (
        <motion.div
          className="hint-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="hint-header">
            <span>💡 Hint {currentHintIndex + 1}/{challenge.hints.length}</span>
            {currentHintIndex < challenge.hints.length - 1 && (
              <button onClick={getNextHint} className="next-hint-btn">
                Next Hint
              </button>
            )}
          </div>
          <p className="hint-text">{challenge.hints[currentHintIndex]}</p>
        </motion.div>
      )}

      {/* Explanation Section */}
      {showExplanation && challenge.explanation && (
        <motion.div
          className="explanation-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h4>📚 Explanation</h4>
          <p>{challenge.explanation}</p>
          <div className="answer-display">
            <strong>Correct Answer: {challenge.correctAnswer}</strong>
          </div>
        </motion.div>
      )}

      {/* Challenge Types Specific UI */}
      {challenge.type === 'coordinate' && (
        <div className="coordinate-helper">
          <p>💡 Remember: Coordinates are written as (x, y)</p>
        </div>
      )}

      {challenge.type === 'angle' && (
        <div className="angle-helper">
          <p>💡 Enter angle in degrees (e.g., 45.5)</p>
        </div>
      )}

      {challenge.type === 'distance' && (
        <div className="distance-helper">
          <p>💡 Distance is always positive</p>
        </div>
      )}

      <style>{`
        .challenge-interface {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          padding: 25px;
          margin: 20px 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .challenge-question h3 {
          margin: 0 0 15px 0;
          color: #4f9ff0;
          font-size: 20px;
        }

        .challenge-question p {
          font-size: 16px;
          line-height: 1.6;
          margin: 0 0 20px 0;
        }

        .input-section {
          margin: 20px 0;
        }

        .input-group {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .challenge-input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .challenge-input:focus {
          outline: none;
          border-color: #4f9ff0;
          box-shadow: 0 0 10px rgba(79, 159, 240, 0.3);
        }

        .challenge-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .submit-button {
          background: linear-gradient(135deg, #4f9ff0, #667eea);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 100px;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(79, 159, 240, 0.4);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .attempt-counter {
          margin-top: 10px;
          font-size: 14px;
          color: #ff9800;
          font-weight: bold;
        }

        .feedback-display {
          margin-top: 15px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
        }

        .feedback-display.success {
          background: rgba(76, 175, 80, 0.15);
          border: 1px solid rgba(76, 175, 80, 0.3);
          color: #4CAF50;
        }

        .feedback-display.error {
          background: rgba(244, 67, 54, 0.15);
          border: 1px solid rgba(244, 67, 54, 0.3);
          color: #f44336;
        }

        .hint-section {
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 10px;
          padding: 15px;
          margin: 15px 0;
        }

        .hint-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .hint-header span {
          color: #ffc107;
          font-weight: bold;
        }

        .next-hint-btn {
          background: #ffc107;
          color: #000;
          border: none;
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .next-hint-btn:hover {
          background: #ffb300;
          transform: translateY(-1px);
        }

        .hint-text {
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
        }

        .explanation-section {
          background: rgba(76, 175, 80, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.3);
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
        }

        .explanation-section h4 {
          margin: 0 0 15px 0;
          color: #4caf50;
        }

        .answer-display {
          background: rgba(76, 175, 80, 0.2);
          padding: 10px;
          border-radius: 5px;
          margin-top: 15px;
          text-align: center;
        }

        .coordinate-helper,
        .angle-helper,
        .distance-helper {
          background: rgba(103, 126, 234, 0.1);
          border: 1px solid rgba(103, 126, 234, 0.3);
          border-radius: 8px;
          padding: 10px;
          margin: 10px 0;
          font-size: 14px;
        }

        .coordinate-helper p,
        .angle-helper p,
        .distance-helper p {
          margin: 0;
          color: #667eea;
        }
      `}</style>
    </div>
  )
}

export default ChallengeInterface
