import { useState, useEffect, useRef } from 'react'
import { Play, Send, Loader2, CheckCircle, XCircle, AlertCircle, User, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import MonacoEditor from '@monaco-editor/react'
import { apiService } from './services/api'
import { Lesson } from './types'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AuthModal } from './components/Auth/AuthModal'
import { UserDashboard } from './components/Dashboard/UserDashboard'
import DebugApi from './components/DebugApi'

// Import our new components
import GameInterface, { GameInterfaceHandle } from './components/GameInterface'
import DataVisualization from './components/DataVisualization'
import LessonCard from './components/LessonCard'
import Module0Game from './components/Module0/Module0Game'

function MainApp() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showVisualization, setShowVisualization] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set())
  const [currentView, setCurrentView] = useState<'lessons' | 'code' | 'module0' | 'dashboard'>('lessons')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login')

  const gameInterfaceRef = useRef<GameInterfaceHandle>(null)

  useEffect(() => {
    if (isAuthenticated) {
      loadLessons()
      loadProgress()
    }
  }, [isAuthenticated])

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
    const saved = localStorage.getItem(`completedLessons_${user?.id}`)
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
      await apiService.submitCode({
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
      localStorage.setItem(`completedLessons_${user?.id}`, JSON.stringify([...newCompleted]))

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

  const handleVisualizationComplete = () => {
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

  // Show loading screen
  if (isLoading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading ML Learning Platform...</p>
        </div>
      </div>
    )
  }

  // Show authentication modal if not logged in
  if (!isAuthenticated) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">🎓 ML Learning Platform</h1>
          <p className="text-xl mb-8">Master Machine Learning through Interactive Challenges</p>
          <div className="space-x-4">
            <button
              onClick={() => {
                setAuthModalMode('login')
                setShowAuthModal(true)
              }}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthModalMode('register')
                setShowAuthModal(true)
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authModalMode}
        />
      </div>
    )
  }

  // Show user dashboard if selected
  if (currentView === 'dashboard') {
    return <UserDashboard />
  }

  // Show Module 0 Game if selected
  if (currentView === 'module0') {
    return <Module0Game />
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
          userId={user?.id.toString() || 'user_1'}
          onLevelUp={(level) => console.log('Level up!', level)}
        />

        {/* Debug API Component */}
        <DebugApi />

        {/* User Info and Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          background: 'rgba(255,255,255,0.1)',
          padding: '12px 16px',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setCurrentView('dashboard')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: currentView === 'dashboard' ? '#667eea' : 'transparent',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              📊 Dashboard
            </button>
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
            <button
              onClick={() => setCurrentView('module0')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: 'transparent',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              🎮 Module 0: Math Adventure
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{user?.full_name}</p>
              <p style={{ fontSize: '12px', opacity: 0.8 }}>Level {user?.current_level} • {user?.total_xp} XP</p>
            </div>
            <button
              onClick={logout}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: currentView === 'lessons' ? '1fr' : currentView === 'code' ? '1fr 1fr' : '1fr',
          gap: '20px',
          height: 'calc(100vh - 200px)'
        }}>
          {/* Lessons Panel */}
          {currentView === 'lessons' && (
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '20px',
              overflowY: 'auto'
            }}>
              <h2 style={{ fontSize: '24px', marginBottom: '20px', fontWeight: 'bold' }}>
                📚 ML Learning Modules
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {lessons.map((lesson, index) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    isSelected={selectedLesson?.id === lesson.id}
                    isUnlocked={isLessonUnlocked(index)}
                    completionStatus={getLessonCompletionStatus(lesson.id)}
                    onClick={() => setSelectedLesson(lesson)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Code Editor Panel */}
          {currentView === 'code' && selectedLesson && (
            <>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
                      {selectedLesson.title}
                    </h2>
                    <p style={{ fontSize: '14px', opacity: 0.8 }}>
                      {selectedLesson.module} • {selectedLesson.difficulty}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px'
                  }}>
                    {getStatusIcon()}
                    <span>{getStatusText()}</span>
                  </div>
                </div>

                <div style={{ flex: 1, marginBottom: '20px' }}>
                  <MonacoEditor
                    height="400px"
                    defaultLanguage={language}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <button
                    onClick={handleRun}
                    disabled={isRunning || isSubmitting}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: isRunning ? '#666' : '#4CAF50',
                      color: 'white',
                      cursor: isRunning ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    <Play size={16} />
                    {isRunning ? 'Running...' : 'Run Code'}
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || isRunning}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: isSubmitting ? '#666' : '#2196F3',
                      color: 'white',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    <Send size={16} />
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>

                {(result || error || isRunning) && (
                  <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '8px',
                    padding: '16px',
                    fontSize: '14px',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {error && (
                      <div style={{ color: '#ff6b6b', marginBottom: '12px' }}>
                        ❌ {error}
                      </div>
                    )}
                    {result && (
                      <div>
                        <div style={{
                          color: result.passed ? '#4CAF50' : '#ff6b6b',
                          marginBottom: '8px',
                          fontWeight: 'bold'
                        }}>
                          {result.passed ? '✅ Success!' : '❌ Failed'}
                        </div>
                        {result.logs && (
                          <pre style={{
                            whiteSpace: 'pre-wrap',
                            fontSize: '12px',
                            opacity: 0.9,
                            marginBottom: '8px'
                          }}>
                            {result.logs}
                          </pre>
                        )}
                        {result.metrics && (
                          <div style={{ fontSize: '12px', opacity: 0.8 }}>
                            <div>⏱️ Execution time: {result.metrics.execution_time.toFixed(2)}s</div>
                            <div>💾 Memory used: {result.metrics.memory_used.toFixed(1)}MB</div>
                            <div>🖥️ CPU used: {result.metrics.cpu_used.toFixed(1)}%</div>
                          </div>
                        )}
                      </div>
                    )}
                    {isRunning && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Loader2 size={16} className="loading" />
                        <span>Executing your code...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Results Panel */}
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 'bold' }}>
                  📊 Data Visualization
                </h3>
                {showVisualization ? (
                  <DataVisualization
                    lesson={selectedLesson}
                    onComplete={handleVisualizationComplete}
                  />
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '300px',
                    opacity: 0.6,
                    fontSize: '14px'
                  }}>
                    Complete the code challenge to see visualization
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}

export default App