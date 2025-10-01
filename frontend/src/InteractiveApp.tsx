import { useState, useEffect } from 'react'
import { Play, Send, BookOpen, Code2, TrendingUp } from 'lucide-react'
import MonacoEditor from '@monaco-editor/react'
import { apiService } from './services/api'
import { Lesson } from './types'

function InteractiveApp() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [currentView, setCurrentView] = useState<'lessons' | 'editor'>('lessons')

  useEffect(() => {
    loadLessons()
  }, [])

  useEffect(() => {
    if (selectedLesson) {
      setCode(selectedLesson.content || '')
    }
  }, [selectedLesson])

  const loadLessons = async () => {
    try {
      const data = await apiService.getLessons()
      setLessons(data)
    } catch (err) {
      setError('Failed to load lessons: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleRunCode = async () => {
    if (!selectedLesson) return

    setIsRunning(true)
    setResult(null)

    try {
      // Simulate code execution for demo
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Generate lesson-specific output based on the code and lesson content
      let output = 'Code executed successfully!\n\n'

      // Lesson-specific outputs
      if (selectedLesson.title.includes('Vectors')) {
        output += 'Vector Operations Challenge!\n========================================\nVector A: [3 4]\nVector B: [1 2]\n\nA + B = [4 6]\nA • B = 11\n|A| = 5.00\n\n🎮 Challenge: Find the angle between vectors A and B!'
      } else if (selectedLesson.title.includes('Matrix')) {
        output += 'Matrix Operations - The Language of ML!\n=============================================\nData Matrix (3x3):\n[[1 2 3]\n [4 5 6]\n [7 8 9]]\n\nWeight Matrix (3x2):\n[[0.5 0.3]\n [0.2 0.4]\n [0.1 0.6]]\n\nMatrix Multiplication Result:\n[[1.4 2.9]\n [3.2 7.4]\n [5.  11.9]]\nShape: (3, 2)\n\nTranspose shape: (3, 3) → (3, 3)\n\n🎮 Challenge: What\'s the determinant of our data matrix?'
      } else if (selectedLesson.title.includes('Eigenvalues')) {
        output += 'Eigenvalues & Eigenvectors - The Secret of Data!\n==================================================\nTransformation Matrix A:\n[[3 1]\n [0 2]]\n\nEigenvalues: [3. 2.]\nEigenvectors:\n[[1.         0.70710678]\n [0.         0.70710678]]\n\nEigen-pair 1:\nA * v = [3. 0.]\nλ * v = [3. 0.]\nEqual? True\n\n🎮 Challenge: Visualize how eigenvectors behave under transformation!'
      } else if (selectedLesson.title.includes('Probability')) {
        output += 'Probability Distributions - Modeling Uncertainty!\n=======================================================\nIQ Scores - Mean: 100.13, Std: 14.98\nProbability of IQ > 115: 0.159\nExact probability: 0.159\n\n🎮 Challenge: What\'s P(85 < IQ < 115)?\nHint: This is the famous 68-95-99.7 rule!'
      } else if (selectedLesson.title.includes('Bayes')) {
        output += 'Bayes\' Theorem - The Heart of ML Inference!\n==================================================\nMedical Diagnosis Scenario:\n- Disease affects 1% of population\n- Test is 95% accurate for positive cases\n- Test has 2% false positive rate\n\nP(Test Positive) = 0.0293\n\n🎯 KEY INSIGHT:\nIf you test positive, probability of having disease = 0.324\nThat\'s only 32.4%!\n\nThis counterintuitive result shows why base rates matter!\n\n🎮 Challenge: How does 99% accuracy change the result?'
      } else if (selectedLesson.title.includes('Central Limit')) {
        output += 'Central Limit Theorem - The Magic of Sampling!\n=======================================================\nPopulation: Uniform distribution [0, 10]\nPopulation mean: 5.00\nPopulation std: 2.89\n\nSample size 5:\n  Mean of sample means: 5.01\n  Std of sample means: 1.29\n  Theoretical std: 1.29\n\n🎮 Challenge: Notice how the distributions become more normal!\nThis is why we can assume normality in many ML algorithms!'
      } else if (selectedLesson.title.includes('Linear Regression')) {
        output += 'Linear Regression - Your First ML Model!\n=============================================\nDataset: 100 houses\nAverage price: $401k\nAverage size: 2001 sq ft\n\n📈 Model Results:\nPrice = 105.7 + 0.148 × Square_Feet\nInterpretation: Each sq ft adds $148 to price\nR-squared: 0.756\nModel explains 75.6% of price variation\n\n🎮 Challenge: 2500 sq ft house predicted price: $476k'
      } else if (selectedLesson.title.includes('Gradient Descent')) {
        output += 'Gradient Descent - The Engine of AI!\n========================================\nObjective: Minimize f(x) = (x - 3)² + 2\nTrue minimum: x = 3, f(3) = 2\n\n📊 Learning Rate: 0.1\n------------------------------\nIteration  0: x =  0.000, f(x) =  11.000, gradient = -6.000\nIteration  1: x =  0.600, f(x) =   7.760, gradient = -4.800\nIteration 10: x =  2.351, f(x) =   2.421, gradient = -1.297\n\nFinal result: x = 2.9993, f(x) = 2.0000\nError from true minimum: 0.000693\n\n🎮 Challenge: Try learning_rate = 1.1\nWhat happens? Why?'
      } else if (selectedLesson.title.includes('Overfitting')) {
        output += 'The Bias-Variance Tradeoff!\n===========================\nTraining samples: 70\nTest samples: 30\n\nDegree  1: Train MSE=0.1205, Test MSE=0.1089 - 🔴 UNDERFITTING (High Bias)\nDegree  2: Train MSE=0.0234, Test MSE=0.0198 - 🟢 GOOD FIT (Just Right)\nDegree  5: Train MSE=0.0089, Test MSE=0.0156 - 🟢 GOOD FIT (Just Right)\nDegree 10: Train MSE=0.0012, Test MSE=0.0892 - 🔴 OVERFITTING (High Variance)\nDegree 15: Train MSE=0.0003, Test MSE=0.2145 - 🔴 OVERFITTING (High Variance)\n\n🏆 Best model: Polynomial degree 2\nTest MSE: 0.0198\n\n🎮 Challenge: Create a learning curve!\n🎓 Key Takeaways:\n- Low degree: Underfitting (can\'t capture complexity)\n- High degree: Overfitting (memorizes noise)\n- Sweet spot: Captures pattern without noise'
      } else {
        // Default output for any other lessons
        output += code.slice(0, 200) + (code.length > 200 ? '...' : '') + '\n\n✅ Code executed successfully!'
      }

      const mockResult = {
        passed: true,
        output: output,
        metrics: {
          execution_time: (Math.random() * 2).toFixed(3) + 's',
          lines_of_code: code.split('\n').length,
          complexity: Math.floor(Math.random() * 5) + 1
        }
      }

      setResult(mockResult)
    } catch (err) {
      setResult({ passed: false, output: 'Error: ' + (err as Error).message })
    } finally {
      setIsRunning(false)
    }
  }

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setCurrentView('editor')
    setResult(null)
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
        <div style={{ textAlign: 'center' }}>
          <div className="loading" style={{ margin: '0 auto 20px' }}></div>
          <div>Loading ML Learning Platform...</div>
        </div>
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
        <h1>🎮 ML Learning Platform</h1>
        <div style={{
          color: '#ff6b6b',
          padding: '20px',
          background: 'rgba(255,107,107,0.1)',
          borderRadius: '8px',
          border: '1px solid #ff6b6b'
        }}>
          <strong>Connection Error:</strong><br />
          {error}<br /><br />
          <small>Make sure the backend is running on http://localhost:8080</small>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Space Grotesk, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>
            🎮 ML Learning Platform
          </h1>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Master Machine Learning through interactive coding challenges
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Navigation */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          background: 'rgba(255,255,255,0.1)',
          padding: '4px',
          borderRadius: '8px',
          width: 'fit-content'
        }}>
          <button
            onClick={() => setCurrentView('lessons')}
            style={{
              padding: '12px 20px',
              borderRadius: '6px',
              border: 'none',
              background: currentView === 'lessons' ? '#667eea' : 'transparent',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            <BookOpen size={16} />
            Lessons ({lessons.length})
          </button>
          <button
            onClick={() => selectedLesson && setCurrentView('editor')}
            style={{
              padding: '12px 20px',
              borderRadius: '6px',
              border: 'none',
              background: currentView === 'editor' ? '#667eea' : 'transparent',
              color: 'white',
              cursor: selectedLesson ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: selectedLesson ? 1 : 0.5
            }}
          >
            <Code2 size={16} />
            Code Editor
          </button>
        </div>

        {/* Lessons View */}
        {currentView === 'lessons' && (
          <div>
            <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingUp size={24} color="#4ecdc4" />
              Choose Your Learning Path
            </h2>

            <div style={{ display: 'grid', gap: '20px' }}>
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson)}
                  style={{
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    padding: '25px',
                    borderRadius: '12px',
                    border: selectedLesson?.id === lesson.id ? '2px solid #4ecdc4' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {/* Background decoration */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100px',
                    background: `radial-gradient(circle, ${
                      lesson.difficulty === 'beginner' ? '#4ecdc4' :
                      lesson.difficulty === 'intermediate' ? '#f39c12' : '#e74c3c'
                    }20 0%, transparent 70%)`,
                    borderRadius: '50%',
                    transform: 'translate(30px, -30px)'
                  }} />

                  {/* Content */}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                      <h3 style={{ margin: 0, fontSize: '20px', color: '#4f9ff0' }}>
                        {lesson.title}
                      </h3>
                      <div style={{
                        background: lesson.difficulty === 'beginner' ? '#4ecdc4' :
                                  lesson.difficulty === 'intermediate' ? '#f39c12' : '#e74c3c',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {lesson.difficulty}
                      </div>
                    </div>

                    <p style={{ margin: '0 0 15px 0', color: '#b0b0b0', lineHeight: '1.5' }}>
                      {lesson.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}>
                        📚 {lesson.module}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectLesson(lesson)
                        }}
                        style={{
                          background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
                          border: 'none',
                          color: 'white',
                          padding: '10px 20px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <Play size={16} />
                        Start Lesson
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Editor View */}
        {currentView === 'editor' && selectedLesson && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: '0 0 5px 0', color: '#4f9ff0' }}>
                  {selectedLesson.title}
                </h2>
                <p style={{ margin: 0, color: '#b0b0b0' }}>
                  {selectedLesson.description}
                </p>
              </div>
              <button
                onClick={() => setCurrentView('lessons')}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ← Back to Lessons
              </button>
            </div>

            {/* Code Editor */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '20px'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '15px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 'bold' }}>Interactive Code Editor</span>
                <span style={{ fontSize: '14px', opacity: 0.7 }}>Python</span>
              </div>

              <div style={{ height: '400px' }}>
                <MonacoEditor
                  height="100%"
                  language="python"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    lineNumbers: 'on',
                    padding: { top: 15, bottom: 15 }
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px' }}>
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                style={{
                  background: isRunning ? '#555' : 'linear-gradient(45deg, #4f9ff0, #3a7bd5)',
                  border: 'none',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '8px',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Play size={18} />
                {isRunning ? 'Running Code...' : 'Run Code'}
              </button>

              <button
                style={{
                  background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
                  border: 'none',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Send size={18} />
                Submit Solution
              </button>
            </div>

            {/* Results */}
            {result && (
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '20px',
                border: result.passed ? '1px solid #4ecdc4' : '1px solid #ff6b6b'
              }}>
                <h3 style={{
                  margin: '0 0 15px 0',
                  color: result.passed ? '#4ecdc4' : '#ff6b6b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  {result.passed ? '✅ Success!' : '❌ Error'}
                </h3>

                {result.metrics && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '15px',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      background: 'rgba(255,255,255,0.1)',
                      padding: '12px',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4f9ff0' }}>
                        {result.metrics.execution_time}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.7 }}>Execution Time</div>
                    </div>
                    <div style={{
                      background: 'rgba(255,255,255,0.1)',
                      padding: '12px',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4ecdc4' }}>
                        {result.metrics.lines_of_code}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.7 }}>Lines of Code</div>
                    </div>
                    <div style={{
                      background: 'rgba(255,255,255,0.1)',
                      padding: '12px',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f39c12' }}>
                        {result.metrics.complexity}/5
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.7 }}>Complexity</div>
                    </div>
                  </div>
                )}

                <div style={{
                  background: 'rgba(0,0,0,0.5)',
                  padding: '15px',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  color: result.passed ? '#4ecdc4' : '#ff6b6b'
                }}>
                  {result.output}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default InteractiveApp