import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Calculator, Lightbulb } from 'lucide-react'

interface Challenge3Props {
  challengeId: number
  onComplete: (challengeId: number, bonusXP?: number) => void
  onFail: () => void
  hearts: number
  streak: number
}

const Challenge3: React.FC<Challenge3Props> = ({ challengeId, onComplete, onFail }) => {
  const [answer, setAnswer] = useState('')
  const [hints, setHints] = useState(0)
  const [showHint, setShowHint] = useState(false)

  // Points: (0, 6) and (6, 0)
  // Midpoint: ((0+6)/2, (6+0)/2) = (3, 3)
  // Slope of line: (0-6)/(6-0) = -6/6 = -1
  // Perpendicular slope: 1 (negative reciprocal)
  // Equation: y - 3 = 1(x - 3) => y = x
  const correctAnswer = 'y = x'

  const handleSubmit = () => {
    const normalizedAnswer = answer.toLowerCase().replace(/\s/g, '')
    const normalizedCorrect = correctAnswer.toLowerCase().replace(/\s/g, '')
    
    if (normalizedAnswer === normalizedCorrect || 
        normalizedAnswer === 'x' || 
        normalizedAnswer === 'y=x' ||
        normalizedAnswer.includes('y=x')) {
      const bonusXP = hints === 0 ? 50 : hints === 1 ? 25 : 0
      onComplete(challengeId, bonusXP)
    } else {
      onFail()
    }
  }

  const hintsList = [
    "Find the midpoint of the two points first: ((x₁+x₂)/2, (y₁+y₂)/2)",
    "Calculate the slope of the original line, then find its negative reciprocal",
    "Use point-slope form: y - y₁ = m(x - x₁) with the midpoint and perpendicular slope"
  ]

  useEffect(() => {
    if (hints > 0) {
      setShowHint(true)
      setTimeout(() => setShowHint(false), 4000)
    }
  }, [hints])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '30px',
        border: '2px solid rgba(78, 205, 196, 0.3)'
      }}
    >
      {/* Narrative Header */}
      <div style={{
        background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '25px',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
          🌉 Magic Bridge
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
          A magical bridge spans between two mystical towers at (0, 6) and (6, 0). 
          The bridge follows the perpendicular bisector - find its equation to cross safely!
        </p>
      </div>

      {/* Character Introduction */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '25px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          🧙‍♀️
        </div>
        <div>
          <div style={{ fontWeight: 'bold', color: '#4ecdc4', marginBottom: '5px' }}>
            Bridge Keeper
          </div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>
            "The magic bridge follows the perpendicular bisector! In AI, understanding perpendicular relationships 
            helps with decision boundaries and separating different classes of data."
          </div>
        </div>
      </div>

      {/* Challenge Content */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '25px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <Shield size={24} color="#4ecdc4" />
          <h3 style={{ margin: 0, color: '#4ecdc4' }}>Challenge</h3>
        </div>
        
        <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
          Find the equation of the perpendicular bisector of the line segment connecting points (0, 6) and (6, 0).
        </p>

        {/* Visual Grid */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '15px', fontWeight: 'bold' }}>Mystical Towers</div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '2px',
            maxWidth: '350px',
            margin: '0 auto'
          }}>
            {Array.from({ length: 49 }, (_, i) => {
              const x = i % 7
              const y = Math.floor(i / 7)
              const isTower1 = x === 0 && y === 6
              const isTower2 = x === 6 && y === 0
              const isMidpoint = x === 3 && y === 3
              
              return (
                <div
                  key={i}
                  style={{
                    width: '35px',
                    height: '35px',
                    background: isTower1 || isTower2
                      ? '#4ecdc4' 
                      : isMidpoint
                      ? '#ffd700'
                      : 'rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: isTower1 || isTower2 ? 'white' : isMidpoint ? '#333' : 'rgba(255,255,255,0.5)'
                  }}
                >
                  {isTower1 && '🏰'}
                  {isTower2 && '🏰'}
                  {isMidpoint && '⭐'}
                  {!isTower1 && !isTower2 && !isMidpoint && `${x},${y}`}
                </div>
              )
            })}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '10px' }}>
            🏰 = Towers, ⭐ = Midpoint
          </div>
        </div>

        {/* Input Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          justifyContent: 'center'
        }}>
          <label style={{ fontWeight: 'bold' }}>
            Bridge Equation: 
          </label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="e.g., y = x"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid #4ecdc4',
              borderRadius: '8px',
              padding: '12px',
              color: 'white',
              fontSize: '16px',
              width: '150px',
              textAlign: 'center'
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!answer}
            style={{
              background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: answer ? 'pointer' : 'not-allowed',
              opacity: answer ? 1 : 0.5
            }}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Hints Section */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '10px'
        }}>
          <Lightbulb size={20} color="#ffd700" />
          <span style={{ fontWeight: 'bold', color: '#ffd700' }}>Hints ({hints}/3)</span>
        </div>
        
        <button
          onClick={() => setHints(hints + 1)}
          disabled={hints >= 3}
          style={{
            background: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid #ffd700',
            borderRadius: '6px',
            padding: '8px 16px',
            color: '#ffd700',
            fontSize: '14px',
            cursor: hints >= 3 ? 'not-allowed' : 'pointer',
            opacity: hints >= 3 ? 0.5 : 1
          }}
        >
          {hints >= 3 ? 'No more hints' : 'Get Hint'}
        </button>

        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '10px',
              padding: '10px',
              background: 'rgba(255, 215, 0, 0.1)',
              borderRadius: '6px',
              border: '1px solid #ffd700'
            }}
          >
            {hintsList[hints - 1]}
          </motion.div>
        )}
      </div>

      {/* Learning Connection */}
      <div style={{
        background: 'rgba(78, 205, 196, 0.1)',
        borderRadius: '8px',
        padding: '15px',
        border: '1px solid #4ecdc4'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '8px'
        }}>
          <Calculator size={20} color="#4ecdc4" />
          <span style={{ fontWeight: 'bold', color: '#4ecdc4' }}>AI/ML Connection</span>
        </div>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
          Perpendicular bisectors are fundamental in creating decision boundaries in machine learning! 
          Support Vector Machines use similar concepts to find the optimal separating hyperplane between different classes of data.
        </p>
      </div>
    </motion.div>
  )
}

export default Challenge3