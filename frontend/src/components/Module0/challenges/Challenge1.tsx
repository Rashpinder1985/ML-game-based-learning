import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Calculator, Lightbulb } from 'lucide-react'

interface Challenge1Props {
  challengeId: number
  onComplete: (challengeId: number, bonusXP?: number) => void
  onFail: () => void
  hearts: number
  streak: number
}

const Challenge1: React.FC<Challenge1Props> = ({ challengeId, onComplete, onFail }) => {
  const [answer, setAnswer] = useState('')
  const [hints, setHints] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const correctAnswer = '7.07' // √50 ≈ 7.07
  const tolerance = 0.1

  const handleSubmit = () => {
    const numAnswer = parseFloat(answer)
    if (Math.abs(numAnswer - parseFloat(correctAnswer)) <= tolerance) {
      const bonusXP = hints === 0 ? 50 : hints === 1 ? 25 : 0
      onComplete(challengeId, bonusXP)
    } else {
      onFail()
    }
  }

  const hintsList = [
    "Think about the Pythagorean theorem: a² + b² = c²",
    "The distance formula is √[(x₂-x₁)² + (y₂-y₁)²]",
    "For points (3,4) and (-3,-2): √[(-3-3)² + (-2-4)²] = √[36 + 36] = √72 ≈ 8.49"
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
        border: '2px solid rgba(79, 159, 240, 0.3)'
      }}
    >
      {/* Narrative Header */}
      <div style={{
        background: 'linear-gradient(45deg, #4f9ff0, #3a7bd5)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '25px',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
          🗺️ Journey Between Towns
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
          You're a merchant traveling from the bustling town of Mathville (3, 4) to the peaceful village of Calmville (0, 0). 
          Find the shortest distance to plan your journey!
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
          🧙‍♂️
        </div>
        <div>
          <div style={{ fontWeight: 'bold', color: '#4ecdc4', marginBottom: '5px' }}>
            Master Cartographer
          </div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>
            "Ah, a fellow traveler! To find the shortest path between towns, you'll need to calculate the direct distance. 
            This skill will be crucial when you encounter vector spaces and similarity measures in your AI journey!"
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
          <MapPin size={24} color="#4f9ff0" />
          <h3 style={{ margin: 0, color: '#4f9ff0' }}>Challenge</h3>
        </div>
        
        <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
          Calculate the distance between Mathville at coordinates (3, 4) and Calmville at coordinates (0, 0).
        </p>

        {/* Visual Grid */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '15px', fontWeight: 'bold' }}>Coordinate Map</div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '2px',
            maxWidth: '300px',
            margin: '0 auto'
          }}>
            {Array.from({ length: 25 }, (_, i) => {
              const x = i % 5 - 2
              const y = Math.floor(i / 5) - 2
              const isMathville = x === 3 && y === 4
              const isCalmville = x === 0 && y === 0
              
              return (
                <div
                  key={i}
                  style={{
                    width: '40px',
                    height: '40px',
                    background: isMathville 
                      ? '#4f9ff0' 
                      : isCalmville 
                      ? '#4ecdc4' 
                      : 'rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: isMathville || isCalmville ? 'white' : 'rgba(255,255,255,0.5)'
                  }}
                >
                  {isMathville && 'M'}
                  {isCalmville && 'C'}
                  {!isMathville && !isCalmville && `${x},${y}`}
                </div>
              )
            })}
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
            Distance = 
          </label>
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter distance"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid #4f9ff0',
              borderRadius: '8px',
              padding: '12px',
              color: 'white',
              fontSize: '16px',
              width: '120px',
              textAlign: 'center'
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!answer}
            style={{
              background: 'linear-gradient(45deg, #4f9ff0, #3a7bd5)',
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
          Distance calculations form the foundation of similarity measures in machine learning. 
          When comparing data points, clustering algorithms, or measuring how "similar" two vectors are, 
          you'll use variations of this distance formula!
        </p>
      </div>
    </motion.div>
  )
}

export default Challenge1