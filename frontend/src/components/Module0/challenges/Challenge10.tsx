import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface Challenge10Props {
  challengeId: number
  onComplete: (challengeId: number, bonusXP?: number) => void
  onFail: () => void
  hearts: number
  streak: number
}

const Challenge10: React.FC<Challenge10Props> = ({ challengeId, onComplete, onFail }) => {
  const [answer, setAnswer] = useState('')
  
  const handleSubmit = () => {
    // Placeholder logic
    if (answer.toLowerCase().includes('plane') || answer.toLowerCase().includes('angle')) {
      onComplete(challengeId, 0)
    } else {
      onFail()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '30px',
        border: '2px solid rgba(0, 255, 255, 0.3)'
      }}
    >
      <div style={{
        background: 'linear-gradient(45deg, #00ffff, #00ced1)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '25px',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
          🌀 Portals of Planes
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
          Master the 3D realm! Analyze planes 2x - 3y + z = 6 and x + 4y - 2z = 8!
        </p>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your answer"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '2px solid #00ffff',
            borderRadius: '8px',
            padding: '12px',
            color: 'white',
            fontSize: '16px',
            width: '200px',
            marginRight: '10px'
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!answer}
          style={{
            background: 'linear-gradient(45deg, #00ffff, #00ced1)',
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
    </motion.div>
  )
}

export default Challenge10