import { useState, useEffect, useRef } from 'react'
import { Play, Send, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import MonacoEditor from '@monaco-editor/react'
import { apiService } from './services/api'
import { Lesson } from './types'

// Import our new components
import GameInterface, { GameInterfaceHandle } from './components/GameInterface'
import DataVisualization from './components/DataVisualization'
import LessonCard from './components/LessonCard'

function App() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [userId] = useState('user_' + Math.random().toString(36).substring(2, 9))
  const [showVisualization, setShowVisualization] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set())
  const [currentView, setCurrentView] = useState<'lessons' | 'code'>('lessons')

  const gameInterfaceRef = useRef<GameInterfaceHandle>(null)

  useEffect(() => {
    loadLessons()
    loadProgress()
  }, [])

  useEffect(() => {
    if (selectedLesson) {
      setCode(selectedLesson.content || '')
      // Show visualization for ML lessons
      setShowVisualization(
        selectedLesson.title.toLowerCase().includes('regression') ||
        selectedLesson.title.toLowerCase().includes('bias') ||
        selectedLesson.module.toLowerCase().includes('ml')
      )
    }
  }, [selectedLesson])

  const loadLessons = async () => {
    try {
      const data = await apiService.getLessons()
      setLessons(data)
      if (data.length > 0) {
        setSelectedLesson(data[0])
      }
    } catch (err) {
      setError('Failed to load lessons')
    }
  }

  const loadProgress = () => {
    // Load from localStorage for demo
    const saved = localStorage.getItem(`completedLessons_${userId}`)
    if (saved) {
      setCompletedLessons(new Set(JSON.parse(saved)))
    }
  }

  const handleRun = async () => {
    if (!selectedLesson) return

    setIsRunning(true)
    setError(null)
    setResult(null)

    try {
      const submission = await apiService.submitCode({
        lesson_id: selectedLesson.id,
        code,
        language
      })

      // Simulate execution for demo (since runner service might not be available)
      setTimeout(() => {
        const mockResult = {
          passed: true,
          logs: `Output from your code:\\n\\n${code.includes('print') ? 'Code executed successfully!' : 'No output'}`,
          metrics: {
            execution_time: Math.random() * 2,
            return_code: 0,
            memory_used: Math.random() * 100,
            cpu_used: Math.random() * 50
          }
        }

        setResult(mockResult)
        setIsRunning(false)
      }, 2000)

    } catch (err) {
      setError('Failed to run code')
      setIsRunning(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedLesson) return

    setIsSubmitting(true)
    setError(null)

    try {
      await apiService.submitCode({
        lesson_id: selectedLesson.id,
        code,
        language
      })

      // Mark lesson as completed
      const newCompleted = new Set(completedLessons)
      newCompleted.add(selectedLesson.id)
      setCompletedLessons(newCompleted)

      // Save progress
      localStorage.setItem(`completedLessons_${userId}`, JSON.stringify([...newCompleted]))

      // Award XP through game interface
      if (gameInterfaceRef.current) {
        gameInterfaceRef.current.completeLesson(selectedLesson.title, 95)
      }

      setResult({ passed: true, logs: '✅ Lesson completed! Great work!' })
    } catch (err) {
      setError('Failed to submit code')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVisualizationComplete = (data: any) => {
    if (gameInterfaceRef.current) {
      gameInterfaceRef.current.addXP(25, 'Data visualization mastery')
    }
  }

  const isLessonUnlocked = (lessonIndex: number): boolean => {
    // First lesson is always unlocked
    if (lessonIndex === 0) return true

    // Check if previous lesson is completed
    const previousLesson = lessons[lessonIndex - 1]
    return previousLesson ? completedLessons.has(previousLesson.id) : false
  }

  const getLessonCompletionStatus = (lessonId: number): 'not-started' | 'in-progress' | 'completed' => {
    if (completedLessons.has(lessonId)) return 'completed'
    if (selectedLesson?.id === lessonId) return 'in-progress'
    return 'not-started'
  }

  const getStatusIcon = () => {
    if (isRunning || isSubmitting) {
      return <Loader2 className="loading" />
    }
    if (result) {
      return result.passed ? (
        <CheckCircle className="status-passed" />
      ) : (
        <XCircle className="status-failed" />
      )
    }
    return <AlertCircle className="status-running" />
  }

  const getStatusText = () => {
    if (isRunning) return 'Running...'
    if (isSubmitting) return 'Submitting...'
    if (result) return result.passed ? 'Passed' : 'Failed'
    return 'Ready'
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        {/* Game Interface Header */}
        <GameInterface
          ref={gameInterfaceRef}
          userId={userId}
          onLevelUp={(level) => console.log('Level up!', level)}
          onAchievementUnlocked={(achievement) => console.log('Achievement!', achievement)}
        />

        {/* Navigation */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          background: 'rgba(255,255,255,0.1)',
          padding: '4px',
          borderRadius: '8px',
          width: 'fit-content'
        }}>
          <button
            onClick={() => setCurrentView('lessons')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: currentView === 'lessons' ? '#667eea' : 'transparent',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            📚 Lessons
          </button>
          <button
            onClick={() => setCurrentView('code')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: currentView === 'code' ? '#667eea' : 'transparent',
              color: 'white',
              cursor: 'pointer',
              opacity: !selectedLesson ? 0.5 : 1
            }}
            disabled={!selectedLesson}
          >
            💻 Code Editor
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: currentView === 'lessons' ? '1fr' : '1fr 1fr', gap: '20px' }}>
          {/* Lessons Panel */}
          <AnimatePresence mode="wait">
            {currentView === 'lessons' ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ margin: 0 }}>🎯 ML Learning Journey</h2>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>
                    {completedLessons.size} / {lessons.length} completed
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '0' }}>
                  {lessons.map((lesson, index) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      isSelected={selectedLesson?.id === lesson.id}
                      isUnlocked={isLessonUnlocked(index)}
                      completionStatus={getLessonCompletionStatus(lesson.id)}
                      onClick={() => {
                        setSelectedLesson(lesson)
                        setCurrentView('code')
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Code Editor Panel */
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {selectedLesson && (
                  <>
                    <div style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '20px'
                    }}>
                      <h3 style={{ margin: '0 0 10px 0', color: '#4f9ff0' }}>{selectedLesson.title}</h3>
                      <p style={{ margin: '0 0 15px 0', color: '#b0b0b0', lineHeight: '1.4' }}>
                        {selectedLesson.description}
                      </p>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <span style={{
                          background: '#667eea',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          {selectedLesson.difficulty}
                        </span>
                        <span style={{
                          background: 'rgba(255,255,255,0.1)',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          {selectedLesson.module}
                        </span>
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px 20px',
                        background: 'rgba(255,255,255,0.1)'
                      }}>
                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Code Editor</span>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            border: 'none',
                            background: '#16213e',
                            color: 'white'
                          }}
                        >
                          <option value="python">Python</option>
                          <option value="javascript">JavaScript</option>
                          <option value="java">Java</option>
                        </select>
                      </div>
                      <div style={{ height: '400px' }}>
                        <MonacoEditor
                          height="100%"
                          language={language}
                          value={code}
                          onChange={(value) => setCode(value || '')}
                          theme="vs-dark"
                          options={{
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            fontSize: 14,
                            lineNumbers: 'on',
                            roundedSelection: false,
                            padding: { top: 15, bottom: 15 }
                          }}
                        />
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '10px',
                      margin: '20px 0',
                      justifyContent: 'center'
                    }}>
                      <button
                        onClick={handleRun}
                        disabled={isRunning || isSubmitting}
                        style={{
                          padding: '12px 24px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'linear-gradient(45deg, #4f9ff0, #3a7bd5)',
                          color: 'white',
                          cursor: isRunning ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '16px',
                          fontWeight: 'bold'
                        }}
                      >
                        <Play size={16} />
                        {isRunning ? 'Running...' : 'Run Code'}
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isRunning || isSubmitting}
                        style={{
                          padding: '12px 24px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
                          color: 'white',
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '16px',
                          fontWeight: 'bold'
                        }}
                      >
                        <Send size={16} />
                        {isSubmitting ? 'Submitting...' : 'Submit Solution'}
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results/Visualization Panel */}
          {currentView === 'code' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Data Visualization */}
              {showVisualization && selectedLesson && (
                <div style={{ marginBottom: '20px' }}>
                  <DataVisualization
                    lessonId={selectedLesson.id}
                    lessonTitle={selectedLesson.title}
                    onVisualizationComplete={handleVisualizationComplete}
                  />
                </div>
              )}

              {/* Results Panel */}
              {(result || error || isRunning || isSubmitting) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    padding: '20px'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '15px'
                  }}>
                    {getStatusIcon()}
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      {getStatusText()}
                    </span>
                  </div>

                  {error && (
                    <div style={{
                      background: 'rgba(231, 76, 60, 0.2)',
                      border: '1px solid #e74c3c',
                      borderRadius: '8px',
                      padding: '15px',
                      color: '#ff6b6b'
                    }}>
                      {error}
                    </div>
                  )}

                  {result && (
                    <>
                      {result.metrics && (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: '15px',
                          marginBottom: '15px'
                        }}>
                          {Object.entries(result.metrics).map(([key, value]) => (
                            <div key={key} style={{
                              background: 'rgba(255,255,255,0.1)',
                              padding: '12px',
                              borderRadius: '8px',
                              textAlign: 'center'
                            }}>
                              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4f9ff0' }}>
                                {typeof value === 'number' ? value.toFixed(2) : String(value)}
                              </div>
                              <div style={{ fontSize: '12px', color: '#888' }}>
                                {key.replace(/_/g, ' ').toUpperCase()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {result.logs && (
                        <div style={{
                          background: 'rgba(0,0,0,0.5)',
                          borderRadius: '8px',
                          padding: '15px',
                          fontFamily: 'monospace',
                          fontSize: '14px',
                          whiteSpace: 'pre-wrap',
                          color: '#4ecdc4'
                        }}>
                          {result.logs}
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App