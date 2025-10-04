import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sword, Calculator, Lightbulb } from 'lucide-react'

interface Challenge2Props {
  challengeId: number
  onComplete: (challengeId: number, bonusXP?: number) => void
  onFail: () => void
  hearts: number
  streak: number
}

const Challenge2: React.FC<Challenge2Props> = ({ challengeId, onComplete, onFail }) => {
  const [answer, setAnswer] = useState('')
  const [hints, setHints] = useState(0)
  const [showHint, setShowHint] = useState(false)

  // Vector u = <3, -2>, Vector v = <-1, 5>
  // Angle = arccos((u·v)/(|u||v|))
  // u·v = 3(-1) + (-2)(5) = -3 - 10 = -13
  // |u| = √(3² + (-2)²) = √(9 + 4) = √13
  // |v| = √((-1)² + 5²) = √(1 + 25) = √26
  // cos(θ) = -13 / (√13 × √26) = -13 / √338 ≈ -0.707
  // θ ≈ 135°
  const correctAnswer = '135'
  const tolerance = 5

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
    "Use the dot product formula: u·v = u₁v₁ + u₂v₂",
    "Calculate magnitudes: |u| = √(u₁² + u₂²), |v| = √(v₁² + v₂²)",
    "The angle formula is: θ = arccos((u·v)/(|u||v|))"
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
        border: '2px solid rgba(255, 107, 107, 0.3)'
      }}
    >
      {/* Narrative Header */}
      <div style={{
        background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '25px',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
          ⚔️ Vector Duel
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
          Two mighty vectors clash in the arena! Vector u = ⟨3, -2⟩ challenges Vector v = ⟨-1, 5⟩. 
          Calculate the angle between their forces to determine the victor!
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
          background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          ⚔️
        </div>
        <div>
          <div style={{ fontWeight: 'bold', color: '#ff6b6b', marginBottom: '5px' }}>
            Vector Combat Master
          </div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>
            "The angle between vectors determines their battle efficiency! In AI, understanding vector angles 
            is crucial for similarity measures, clustering, and neural network weight optimization."
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
          <Sword size={24} color="#ff6b6b" />
          <h3 style={{ margin: 0, color: '#ff6b6b' }}>Challenge</h3>
        </div>
        
        <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
          Find the angle (in degrees) between vector u = ⟨3, -2⟩ and vector v = ⟨-1, 5⟩.
        </p>

        {/* Visual Vector Representation */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '15px', fontWeight: 'bold' }}>Vector Battle Arena</div>
          <div style={{
            position: 'relative',
            width: '300px',
            height: '200px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '8px',
            margin: '0 auto',
            border: '2px solid rgba(255,255,255,0.2)'
          }}>
            {/* Grid lines */}
            {Array.from({ length: 7 }, (_, i) => (
              <div key={`h-${i}`} style={{
                position: 'absolute',
                top: `${i * 33.33}%`,
                left: 0,
                right: 0,
                height: '1px',
                background: 'rgba(255,255,255,0.1)'
              }} />
            ))}
            {Array.from({ length: 7 }, (_, i) => (
              <div key={`v-${i}`} style={{
                position: 'absolute',
                left: `${i * 16.66}%`,
                top: 0,
                bottom: 0,
                width: '1px',
                background: 'rgba(255,255,255,0.1)'
              }} />
            ))}
            
            {/* Vector u = <3, -2> */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '90px',
              height: '60px',
              border: '3px solid #4f9ff0',
              borderRight: 'none',
              borderBottom: 'none',
              transformOrigin: '0 0'
            }} />
            <div style={{
              position: 'absolute',
              left: 'calc(50% + 90px)',
              top: 'calc(50% - 60px)',
              color: '#4f9ff0',
              fontWeight: 'bold',
              fontSize: '12px'
            }}>
              u = ⟨3, -2⟩
            </div>
            
            {/* Vector v = <-1, 5> */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '30px',
              height: '150px',
              border: '3px solid #ff6b6b',
              borderRight: 'none',
              borderBottom: 'none',
              transformOrigin: '0 0',
              transform: 'rotate(180deg)'
            }} />
            <div style={{
              position: 'absolute',
              left: 'calc(50% - 30px)',
              top: 'calc(50% - 150px)',
              color: '#ff6b6b',
              fontWeight: 'bold',
              fontSize: '12px'
            }}>
              v = ⟨-1, 5⟩
            </div>
            
            {/* Origin */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '8px',
              height: '8px',
              background: '#ffd700',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }} />
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
            Angle = 
          </label>
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter angle"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid #ff6b6b',
              borderRadius: '8px',
              padding: '12px',
              color: 'white',
              fontSize: '16px',
              width: '120px',
              textAlign: 'center'
            }}
          />
          <span style={{ fontSize: '14px', opacity: 0.7 }}>degrees</span>
          <button
            onClick={handleSubmit}
            disabled={!answer}
            style={{
              background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
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
        background: 'rgba(255, 107, 107, 0.1)',
        borderRadius: '8px',
        padding: '15px',
        border: '1px solid #ff6b6b'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '8px'
        }}>
          <Calculator size={20} color="#ff6b6b" />
          <span style={{ fontWeight: 'bold', color: '#ff6b6b' }}>AI/ML Connection</span>
        </div>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
          Vector angles are fundamental in machine learning! Cosine similarity uses the angle between vectors to measure 
          how similar two data points are. This is used in recommendation systems, text analysis, and clustering algorithms.
        </p>
      </div>
    </motion.div>
  )
}

export default Challenge2