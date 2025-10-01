import React from 'react'
import QuestInterface from './components/QuestInterface'
import AuthGate from './components/AuthGate'

function Module0Demo() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <header style={{
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{
          margin: '0',
          fontSize: '32px',
          background: 'linear-gradient(135deg, #4f9ff0, #667eea)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          ⚔️ Module 0: Mathematical Adventures
        </h1>
        <p style={{
          margin: '10px 0 0 0',
          opacity: 0.8,
          fontSize: '18px'
        }}>
          Story-Driven Game World • Boot.dev Style Learning • AI/ML Foundations
        </p>
      </header>

      <main>
        <AuthGate>
          <QuestInterface />
        </AuthGate>
      </main>

      <footer style={{
        padding: '20px',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.05)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        marginTop: '40px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          flexWrap: 'wrap'
        }}>
          <div>
            <h4 style={{ margin: '0 0 10px 0', color: '#4f9ff0' }}>🎮 Game Features</h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '14px' }}>
              <li>❤️ Hearts system (lose on mistakes)</li>
              <li>🔥 Streak multipliers</li>
              <li>⭐ XP and leveling</li>
              <li>🏆 Achievement badges</li>
            </ul>
          </div>
          <div>
            <h4 style={{ margin: '0 0 10px 0', color: '#667eea' }}>📚 Learning Path</h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '14px' }}>
              <li>🗺️ Distance & coordinates</li>
              <li>⚔️ Vector angles</li>
              <li>🌉 Perpendicular bisectors</li>
              <li>🏔️ Quadratic functions</li>
              <li>🌌 3D planes & hyperplanes</li>
            </ul>
          </div>
          <div>
            <h4 style={{ margin: '0 0 10px 0', color: '#ff6b6b' }}>🤖 AI/ML Connections</h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '14px' }}>
              <li>📏 Distance → Similarity measures</li>
              <li>📐 Angles → Cosine similarity</li>
              <li>📊 Lines → Decision boundaries</li>
              <li>🎯 Vertices → Optimization minima</li>
              <li>🌍 Planes → Support vector margins</li>
            </ul>
          </div>
        </div>
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'rgba(79, 159, 240, 0.1)',
          borderRadius: '10px',
          fontSize: '14px'
        }}>
          <strong>🧙‍♂️ Mathematical Wisdom:</strong> Each quest builds intuition for machine learning concepts.
          Master the fundamentals through story and play before diving into algorithms!
        </div>
      </footer>
    </div>
  )
}

export default Module0Demo
