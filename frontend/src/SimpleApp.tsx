import { useState, useEffect } from 'react'
import { apiService } from './services/api'
import { Lesson } from './types'

function SimpleApp() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadLessons()
  }, [])

  const loadLessons = async () => {
    try {
      console.log('Loading lessons...')
      const data = await apiService.getLessons()
      console.log('Lessons loaded:', data)
      setLessons(data)
    } catch (err) {
      console.error('Failed to load lessons:', err)
      setError('Failed to load lessons: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
        minHeight: '100vh',
        color: 'white',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
        minHeight: '100vh',
        color: 'white',
        padding: '20px'
      }}>
        <h1>ML Learning Platform</h1>
        <div style={{ color: '#ff6b6b', padding: '20px', background: 'rgba(255,107,107,0.1)', borderRadius: '8px' }}>
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
      minHeight: '100vh',
      color: 'white',
      padding: '20px'
    }}>
      <h1 style={{ marginBottom: '30px' }}>🎮 ML Learning Platform</h1>

      <div style={{ marginBottom: '20px' }}>
        <strong>Lessons loaded: {lessons.length}</strong>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', color: '#4f9ff0' }}>
              {lesson.title}
            </h3>
            <p style={{ margin: '0 0 15px 0', color: '#b0b0b0' }}>
              {lesson.description}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{
                background: '#667eea',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {lesson.difficulty}
              </span>
              <span style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {lesson.module}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SimpleApp