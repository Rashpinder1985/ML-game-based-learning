import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameMechanics from './GameMechanics'
import ChallengeInterface from './ChallengeInterface'
import InteractiveGraph from './InteractiveGraph'

interface Quest {
  id: string
  title: string
  description: string
  story: string
  challenges: Challenge[]
  graphData?: {
    points: Array<{x: number, y: number, label?: string, color?: string}>
    lines?: Array<{start: {x: number, y: number}, end: {x: number, y: number}, color?: string, style?: 'solid' | 'dashed' | 'dotted', label?: string}>
  }
  rewards: {
    xp: number
    badges: string[]
  }
}

interface Challenge {
  id: string
  type: 'distance' | 'angle' | 'coordinate' | 'equation' | 'calculation'
  question: string
  correctAnswer: number | string
  tolerance?: number
  hints: string[]
  explanation?: string
}

// Sample quest data for Module 0
const sampleQuests: Quest[] = [
  {
    id: 'twin-towns',
    title: 'The Journey Begins: Twin Towns',
    description: '🗺️ Plot your path between distant towns and discover the power of distance',
    story: `Welcome to the Realm of Numbers, brave adventurer!

Two ancient towns lie hidden in this mathematical realm. Your quest begins by finding the shortest path between them.

Town of Mystral sits at coordinates (2, 5)
Town of Zenith rests at coordinates (8, 1)

Without using any distance formulas, estimate how far apart these towns are by counting grid squares!`,
    challenges: [
      {
        id: 'estimate-distance',
        type: 'distance',
        question: 'How many units apart are the Twin Towns? (Count grid squares like walking on city blocks)',
        correctAnswer: 10,
        tolerance: 1,
        hints: [
          'Think Manhattan distance: |x₂-x₁| + |y₂-y₁|',
          'From (2,5) to (8,1): How far East + How far South?',
          'East: 8-2 = 6 units, South: 5-1 = 4 units, Total: 6+4 = 10'
        ],
        explanation: 'The Manhattan distance between (2,5) and (8,1) is |8-2| + |5-1| = 6 + 4 = 10 units. This is like walking on city blocks!'
      }
    ],
    graphData: {
      points: [
        { x: 2, y: 5, label: '🏰 Mystral', color: '#4f9ff0' },
        { x: 8, y: 1, label: '🏰 Zenith', color: '#ff6b6b' }
      ],
      lines: [
        { start: { x: 2, y: 5 }, end: { x: 8, y: 1 }, color: '#4CAF50', style: 'dashed', label: 'Your Path' }
      ]
    },
    rewards: {
      xp: 50,
      badges: ['🗺️ Explorer']
    }
  },
  {
    id: 'vector-duel',
    title: 'Vector Duel: Angle of Warriors',
    description: '⚔️ Face off against vector warriors and master the angle between forces',
    story: `Two magical warriors challenge you to a duel of angles!

Warrior Crimson wields the force vector u = ⟨3, -2⟩
Warrior Azure commands the vector v = ⟨-1, 5⟩

To proceed, you must find the angle between their powers using the ancient formula:
cos(θ) = (u · v) / (|u| × |v|)`,
    challenges: [
      {
        id: 'calculate-angle',
        type: 'angle',
        question: 'What is the angle between the warrior vectors (in degrees)?',
        correctAnswer: 135,
        tolerance: 1,
        hints: [
          'First calculate the dot product: u·v = (3)(-1) + (-2)(5) = -3 - 10 = -13',
          'Then find magnitudes: |u| = √(3² + (-2)²) = √13 ≈ 3.606, |v| = √((-1)² + 5²) = √26 ≈ 5.099',
          'cos(θ) = -13 / (√13 × √26) = -13 / √338 ≈ -0.707, θ = arccos(-0.707) ≈ 135°'
        ],
        explanation: 'The dot product is -13, magnitudes are √13 and √26, so cos(θ) = -13/(√13×√26) ≈ -0.707, giving θ ≈ 135°'
      }
    ],
    graphData: {
      points: [
        { x: 0, y: 0, label: '⚔️ Arena Center', color: '#FFD700' },
        { x: 3, y: -2, label: 'Crimson End', color: '#FF0000' },
        { x: -1, y: 5, label: 'Azure End', color: '#0000FF' }
      ],
      lines: [
        { start: { x: 0, y: 0 }, end: { x: 3, y: -2 }, color: '#FF0000', label: '⚔️ Crimson' },
        { start: { x: 0, y: 0 }, end: { x: -1, y: 5 }, color: '#0000FF', label: '🛡️ Azure' }
      ]
    },
    rewards: {
      xp: 75,
      badges: ['⚔️ Vector Warrior', '📐 Angle Master']
    }
  },
  {
    id: 'magic-bridge',
    title: 'The Magic Bridge: Perpendicular Bisector',
    description: '🌉 Build the mystical bridge that perfectly balances two sacred stones',
    story: `Ancient stones block your path - only the perfect bridge can unite them!

The Ancient Prophecy speaks:
"Two Sacred Stones of Power rest in the realm..."
"Stone of Light at coordinates (0, 6)"
"Stone of Shadow at coordinates (6, 0)"
"Only the Bridge of Perfect Balance can unite their power."

The bridge must be the perpendicular bisector - equidistant from both stones. Find the slope of this mystical bridge!`,
    challenges: [
      {
        id: 'bridge-slope',
        type: 'calculation',
        question: 'What is the slope of the perpendicular bisector between (0,6) and (6,0)?',
        correctAnswer: 1,
        tolerance: 0.1,
        hints: [
          'First find the slope of the line connecting the stones: slope = (0-6)/(6-0) = -1',
          'Perpendicular lines have slopes that multiply to -1',
          'If original slope = -1, then perpendicular slope = -1/(-1) = 1'
        ],
        explanation: 'The connecting line has slope -1, so the perpendicular bisector has slope 1 (negative reciprocal).'
      }
    ],
    graphData: {
      points: [
        { x: 0, y: 6, label: '💎 Light', color: '#FFD700' },
        { x: 6, y: 0, label: '🖤 Shadow', color: '#8B008B' },
        { x: 3, y: 3, label: '⭐ Bridge Center', color: '#4CAF50' }
      ],
      lines: [
        { start: { x: 0, y: 6 }, end: { x: 6, y: 0 }, color: '#FF0000', style: 'dashed', label: 'Stone Connection' },
        { start: { x: 1, y: 2 }, end: { x: 5, y: 6 }, color: '#0000FF', label: '🌉 Magic Bridge' }
      ]
    },
    rewards: {
      xp: 100,
      badges: ['🌉 Bridge Builder', '⚖️ Balance Master']
    }
  },
  {
    id: 'roads-waypoints',
    title: 'Roads & Waypoints: Linear Paths',
    description: '🛣️ Navigate the mystical roads and discover where paths cross the realm',
    story: `Ancient roads crisscross the realm - master their secrets!

The Road Master's Challenge:
"Two great roads traverse our realm..."
"The Royal Road: y = 3x"
"The Merchant's Path: y = 2x + 3"

Find where the Royal Road crosses the East-West border (y = 0)!`,
    challenges: [
      {
        id: 'royal-road-intercept',
        type: 'coordinate',
        question: 'At what x-coordinate does the Royal Road (y = 3x) cross the x-axis (y = 0)?',
        correctAnswer: 0,
        tolerance: 0.1,
        hints: [
          'Set y = 0 in the equation y = 3x',
          '0 = 3x means x must equal 0',
          'The Royal Road passes through the origin (0,0)'
        ],
        explanation: 'When y = 0, we get 0 = 3x, so x = 0. The Royal Road crosses the x-axis at (0,0).'
      }
    ],
    graphData: {
      points: [
        { x: 0, y: 0, label: '👑 Royal Crossing', color: '#FFD700' },
        { x: -1.5, y: 0, label: '🏪 Merchant Crossing', color: '#8B4513' },
        { x: 3, y: 9, label: '⭐ Great Crossroads', color: '#FF6B6B' }
      ],
      lines: [
        { start: { x: -2, y: -6 }, end: { x: 4, y: 12 }, color: '#FFD700', label: '👑 Royal Road: y = 3x' },
        { start: { x: -2, y: -1 }, end: { x: 4, y: 11 }, color: '#8B4513', label: '🏪 Merchant Path: y = 2x + 3' }
      ]
    },
    rewards: {
      xp: 125,
      badges: ['🛣️ Pathfinder', '🗺️ Navigator']
    }
  },
  {
    id: 'valley-curves',
    title: 'Valley of Curves: The Quadratic Quest',
    description: '🏔️ Venture into the Valley of Curves and find the magical vertex of power',
    story: `A mystical parabola guards the valley - find its secrets!

The Valley Guardian speaks:
"A magical curve protects this valley..."
"Its equation: f(x) = x² - 4x + 3"
"Find the vertex of power to proceed!"

The vertex represents the lowest point of this upward-opening parabola.`,
    challenges: [
      {
        id: 'find-vertex-x',
        type: 'coordinate',
        question: 'What is the x-coordinate of the vertex of f(x) = x² - 4x + 3?',
        correctAnswer: 2,
        tolerance: 0.1,
        hints: [
          'For f(x) = ax² + bx + c, vertex x-coordinate = -b/(2a)',
          'Here a = 1, b = -4, so x = -(-4)/(2×1) = 4/2 = 2',
          'The vertex is at the axis of symmetry of the parabola'
        ],
        explanation: 'Using the vertex formula x = -b/(2a) with a=1, b=-4: x = -(-4)/(2×1) = 2'
      }
    ],
    graphData: {
      points: [
        { x: 2, y: -1, label: '⭐ Vertex of Power', color: '#FF0000' },
        { x: 1, y: 0, label: '🚪 Entry Gate', color: '#0000FF' },
        { x: 3, y: 0, label: '🚪 Exit Gate', color: '#0000FF' }
      ],
      lines: []
    },
    rewards: {
      xp: 150,
      badges: ['🏔️ Valley Master', '📐 Vertex Finder']
    }
  },
  {
    id: 'duel-of-lines',
    title: 'Duel of Lines: Angle Warriors',
    description: '⚔️ Two mighty line warriors clash - calculate the angle between their battle stances',
    story: `Two line warriors meet in epic combat - find the angle between them!

The Arena Master announces:
"Behold! Two legendary line warriors enter the arena!"
"Warrior Crimson: y = 2x + 3"
"Warrior Azure: y = -3x + 2"

Use the formula: tan(θ) = |(m₁ - m₂) / (1 + m₁m₂)|`,
    challenges: [
      {
        id: 'line-angle',
        type: 'angle',
        question: 'What is the acute angle between y = 2x + 3 and y = -3x + 2 (in degrees)?',
        correctAnswer: 45,
        tolerance: 1,
        hints: [
          'Slopes are m₁ = 2 and m₂ = -3',
          'tan(θ) = |m₁ - m₂| / |1 + m₁m₂| = |2 - (-3)| / |1 + (2)(-3)| = |5| / |1 - 6| = 5/5 = 1',
          'If tan(θ) = 1, then θ = arctan(1) = 45°'
        ],
        explanation: 'Using the angle formula: tan(θ) = |2-(-3)|/|1+(2)(-3)| = 5/|-5| = 1, so θ = 45°'
      }
    ],
    graphData: {
      points: [
        { x: -0.2, y: 2.6, label: '⭐ Battle Point', color: '#FFD700' }
      ],
      lines: [
        { start: { x: -2, y: -1 }, end: { x: 2, y: 7 }, color: '#FF0000', label: '⚔️ Crimson: y = 2x + 3' },
        { start: { x: -1, y: 5 }, end: { x: 2, y: -4 }, color: '#0000FF', label: '🛡️ Azure: y = -3x + 2' }
      ]
    },
    rewards: {
      xp: 175,
      badges: ['⚔️ Angle Warrior', '📐 Battle Master']
    }
  },
  {
    id: 'tower-watch',
    title: 'Tower Watch: Angle of Depression',
    description: '🏰 Stand atop the ancient watchtower and master the angle of sight',
    story: `From the ancient watchtower, calculate the angle of depression to distant targets!

The Tower Guardian's Challenge:
"Brave adventurer, you stand atop our ancient watchtower..."
"Height: 30 meters above the realm"
"A mysterious object lies 50 meters away on the ground"

Find the angle you must look down to see the target.`,
    challenges: [
      {
        id: 'depression-angle',
        type: 'angle',
        question: 'What is the angle of depression from 30m high tower to object 50m away (in degrees)?',
        correctAnswer: 31,
        tolerance: 1,
        hints: [
          'This is a right triangle: opposite = 30m (height), adjacent = 50m (distance)',
          'Use tan(θ) = opposite/adjacent = 30/50 = 0.6',
          'θ = arctan(0.6) ≈ 31°'
        ],
        explanation: 'tan(θ) = height/distance = 30/50 = 0.6, so θ = arctan(0.6) ≈ 31°'
      }
    ],
    graphData: {
      points: [
        { x: 0, y: 30, label: '🏰 Tower Top', color: '#8B4513' },
        { x: 50, y: 0, label: '🎯 Target', color: '#FF0000' }
      ],
      lines: [
        { start: { x: 0, y: 0 }, end: { x: 0, y: 30 }, color: '#8B4513', label: '🏰 Tower' },
        { start: { x: 0, y: 30 }, end: { x: 50, y: 0 }, color: '#FFD700', style: 'dashed', label: '👁️ Line of Sight' }
      ]
    },
    rewards: {
      xp: 200,
      badges: ['🏰 Tower Guardian', '📐 Angle Scout']
    }
  },
  {
    id: 'triangle-forge',
    title: 'Triangle Forge: Sacred Geometry',
    description: '🔥 In the mystical forge, craft the perfect triangle and find its center of balance',
    story: `The ancient forge awaits - create the sacred 3-4-5 triangle and find its centroid!

The Forge Master speaks:
"Forge the legendary 3-4-5 triangle of power..."
"Vertices at: Origin (0,0), Point Alpha (3,0), Point Beta (0,4)"

Find the x-coordinate of the centroid (center of balance).`,
    challenges: [
      {
        id: 'triangle-centroid-x',
        type: 'coordinate',
        question: 'What is the x-coordinate of the centroid of triangle with vertices (0,0), (3,0), (0,4)?',
        correctAnswer: 1,
        tolerance: 0.1,
        hints: [
          'Centroid x-coordinate = (x₁ + x₂ + x₃) / 3',
          'With vertices (0,0), (3,0), (0,4): x-coordinate = (0 + 3 + 0) / 3',
          'Centroid x = 3/3 = 1'
        ],
        explanation: 'Centroid x-coordinate = (0 + 3 + 0)/3 = 3/3 = 1'
      }
    ],
    graphData: {
      points: [
        { x: 0, y: 0, label: '⭐ Origin', color: '#000000' },
        { x: 3, y: 0, label: '🔵 Alpha', color: '#0000FF' },
        { x: 0, y: 4, label: '🟢 Beta', color: '#00FF00' },
        { x: 1, y: 4/3, label: '⭐ Centroid', color: '#FFD700' }
      ],
      lines: [
        { start: { x: 0, y: 0 }, end: { x: 3, y: 0 }, color: '#FF0000', label: 'Base = 3' },
        { start: { x: 0, y: 0 }, end: { x: 0, y: 4 }, color: '#FF0000', label: 'Height = 4' },
        { start: { x: 3, y: 0 }, end: { x: 0, y: 4 }, color: '#FF0000', label: 'Hypotenuse = 5' }
      ]
    },
    rewards: {
      xp: 225,
      badges: ['🔥 Forge Master', '📐 Sacred Geometry']
    }
  },
  {
    id: 'circle-rune',
    title: 'Circle Rune: The Parametric Portal',
    description: '⭕ Trace the mystical unit circle and unlock the secrets of parametric motion',
    story: `Trace the ancient unit circle using parametric magic!

The Circle Sage whispers:
"Behold the most perfect of all shapes..."
"The Unit Circle of radius 1, centered at the origin"
"Parametric equations: x = cos(t), y = sin(t)"

At what value of parameter t does the point reach coordinates (0, 1)?`,
    challenges: [
      {
        id: 'circle-parameter',
        type: 'angle',
        question: 'At what value of t (in degrees) does (cos(t), sin(t)) = (0, 1)?',
        correctAnswer: 90,
        tolerance: 1,
        hints: [
          'We need cos(t) = 0 and sin(t) = 1',
          'cos(90°) = 0 and sin(90°) = 1',
          'This corresponds to the "North" point on the unit circle'
        ],
        explanation: 'At t = 90°, cos(90°) = 0 and sin(90°) = 1, giving the point (0, 1)'
      }
    ],
    graphData: {
      points: [
        { x: 0, y: 0, label: '⊕ Center', color: '#000000' },
        { x: 1, y: 0, label: 'East (0°)', color: '#FF0000' },
        { x: 0, y: 1, label: 'North (90°)', color: '#00FF00' },
        { x: -1, y: 0, label: 'West (180°)', color: '#FFA500' },
        { x: 0, y: -1, label: 'South (270°)', color: '#800080' }
      ],
      lines: []
    },
    rewards: {
      xp: 250,
      badges: ['⭕ Circle Master', '🌀 Parametric Sage']
    }
  },
  {
    id: 'portals-planes',
    title: 'Portals of Planes: The 3D Finale',
    description: '🌌 Master the mystical planes in 3D space and calculate the ultimate dihedral angle',
    story: `Enter the realm of 3D space where mystical planes intersect!

The Dimensional Oracle speaks:
"Two mystical planes await your analysis:"
"Portal Alpha: 2x - 3y + z = 6"
"Portal Beta: x + 4y - 2z = 8"

Find the angle between these planes using their normal vectors. The angle between planes equals the angle between their normal vectors.`,
    challenges: [
      {
        id: 'dihedral-angle',
        type: 'angle',
        question: 'What is the angle between planes 2x-3y+z=6 and x+4y-2z=8 (in degrees)?',
        correctAnswer: 73,
        tolerance: 2,
        hints: [
          'Normal vectors: n₁ = (2,-3,1) and n₂ = (1,4,-2)',
          'Dot product: n₁·n₂ = (2)(1) + (-3)(4) + (1)(-2) = 2 - 12 - 2 = -12',
          'Magnitudes: |n₁| = √(4+9+1) = √14, |n₂| = √(1+16+4) = √21',
          'cos(θ) = |n₁·n₂|/(|n₁||n₂|) = 12/(√14×√21) ≈ 0.70, θ ≈ 73°'
        ],
        explanation: 'Using normal vectors (2,-3,1) and (1,4,-2): cos(θ) = |dot product|/(product of magnitudes) ≈ 0.70, giving θ ≈ 73°'
      }
    ],
    graphData: {
      points: [
        { x: 0, y: 0, label: '🌌 Origin', color: '#000000' },
        { x: 2, y: -3, label: '📐 Normal₁', color: '#FF0000' },
        { x: 1, y: 4, label: '📐 Normal₂', color: '#0000FF' }
      ],
      lines: [
        { start: { x: 0, y: 0 }, end: { x: 2, y: -3 }, color: '#FF0000', label: 'n₁ = (2,-3,1)' },
        { start: { x: 0, y: 0 }, end: { x: 1, y: 4 }, color: '#0000FF', label: 'n₂ = (1,4,-2)' }
      ]
    },
    rewards: {
      xp: 300,
      badges: ['🌌 Dimension Master', '🎓 3D Sage', '👑 Mathematical Champion']
    }
  }
]

export const QuestInterface: React.FC = () => {
  const [currentQuestIndex, setCurrentQuestIndex] = useState(0)
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0)
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set())
  const [totalXP, setTotalXP] = useState(0)
  const [collectedBadges, setCollectedBadges] = useState<string[]>([])
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [showFailureAnimation, setShowFailureAnimation] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const currentQuest = sampleQuests[currentQuestIndex]
  const currentChallenge = currentQuest?.challenges[currentChallengeIndex]
  const isQuestComplete = currentChallenge && completedChallenges.has(currentChallenge.id)

  // Create refs for game mechanics integration
  const gameMechanicsRef = React.useRef<any>(null)

  const handleCorrectAnswer = (reward: { xp: number, message: string }) => {
    if (!currentChallenge) return

    // Mark challenge as complete
    setCompletedChallenges(prev => new Set(prev).add(currentChallenge.id))
    setTotalXP(prev => prev + reward.xp)

    // Show success feedback
    setFeedbackMessage(reward.message)
    setShowSuccessAnimation(true)

    // Trigger game mechanics correct answer
    if (gameMechanicsRef.current?.handleCorrectAnswer) {
      gameMechanicsRef.current.handleCorrectAnswer()
    }

    setTimeout(() => {
      setShowSuccessAnimation(false)
      setFeedbackMessage('')
    }, 3000)

    // Check if quest is complete
    const allChallengesComplete = currentQuest.challenges.every(challenge =>
      completedChallenges.has(challenge.id) || challenge.id === currentChallenge.id
    )

    if (allChallengesComplete) {
      // Award quest rewards
      setTotalXP(prev => prev + currentQuest.rewards.xp)
      setCollectedBadges(prev => [...prev, ...currentQuest.rewards.badges])

      // Move to next quest after delay
      setTimeout(() => {
        if (currentQuestIndex < sampleQuests.length - 1) {
          setCurrentQuestIndex(prev => prev + 1)
          setCurrentChallengeIndex(0)
        }
      }, 2000)
    } else if (currentChallengeIndex < currentQuest.challenges.length - 1) {
      // Move to next challenge
      setTimeout(() => {
        setCurrentChallengeIndex(prev => prev + 1)
      }, 1500)
    }
  }

  const handleIncorrectAnswer = (feedback: string) => {
    // Show failure feedback
    setFeedbackMessage(feedback)
    setShowFailureAnimation(true)

    // Trigger game mechanics incorrect answer
    if (gameMechanicsRef.current?.handleIncorrectAnswer) {
      gameMechanicsRef.current.handleIncorrectAnswer()
    }

    setTimeout(() => {
      setShowFailureAnimation(false)
      setFeedbackMessage('')
    }, 3000)
  }

  if (!currentQuest) {
    return (
      <div className="quest-complete">
        <motion.div
          className="completion-message"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          <h1>🎉 All Quests Complete!</h1>
          <p>You've mastered the Mathematical Realm!</p>
          <div className="final-stats">
            <div>Total XP: {totalXP}</div>
            <div>Badges: {collectedBadges.join(' ')}</div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="quest-interface">
      {/* Game Mechanics Bar */}
      <GameMechanics
        ref={gameMechanicsRef}
        onCorrectAnswer={(xp) => console.log(`+${xp} XP`)}
        onIncorrectAnswer={() => console.log('Heart lost')}
        onStreakBreak={() => console.log('Streak broken')}
      />

      {/* Quest Progress */}
      <div className="quest-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((currentQuestIndex + (completedChallenges.size / currentQuest.challenges.length)) / sampleQuests.length) * 100}%`
            }}
          />
        </div>
        <span>Quest {currentQuestIndex + 1} of {sampleQuests.length}</span>
      </div>

      {/* Main Quest Content */}
      <motion.div
        className="quest-content"
        key={currentQuestIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Quest Header */}
        <div className="quest-header">
          <h1>{currentQuest.title}</h1>
          <p className="quest-description">{currentQuest.description}</p>
        </div>

        {/* Story Section */}
        <div className="story-section">
          <h3>📖 The Tale Unfolds</h3>
          <div className="story-text">
            {currentQuest.story.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>

        {/* Interactive Graph */}
        {currentQuest.graphData && (
          <InteractiveGraph
            width={500}
            height={400}
            points={currentQuest.graphData.points}
            lines={currentQuest.graphData.lines}
            title="🗺️ Realm Map"
            xRange={[-2, 10]}
            yRange={[-2, 8]}
          />
        )}

        {/* Current Challenge */}
        {currentChallenge && !isQuestComplete && (
          <ChallengeInterface
            challenge={currentChallenge}
            onCorrectAnswer={handleCorrectAnswer}
            onIncorrectAnswer={handleIncorrectAnswer}
          />
        )}

        {/* Feedback Animations */}
        <AnimatePresence>
          {showSuccessAnimation && (
            <motion.div
              className="success-overlay"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5 }}
            >
              {feedbackMessage || '⭐ Challenge Complete! ⭐'}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showFailureAnimation && (
            <motion.div
              className="failure-overlay"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5 }}
            >
              {feedbackMessage || '❌ Try Again!'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quest Complete */}
        {isQuestComplete && (
          <motion.div
            className="quest-complete-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>🏆 Quest Complete!</h3>
            <div className="rewards">
              <p>Rewards Earned:</p>
              <div>+{currentQuest.rewards.xp} XP</div>
              <div>{currentQuest.rewards.badges.join(' ')}</div>
            </div>
          </motion.div>
        )}
      </motion.div>

      <style>{`
        .quest-interface {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }

        .quest-progress {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 10px 20px;
          margin: 20px 0;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4f9ff0, #667eea);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .quest-content {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 30px;
          margin: 20px 0;
        }

        .quest-header h1 {
          margin: 0 0 10px 0;
          color: #4f9ff0;
          font-size: 28px;
        }

        .quest-description {
          font-size: 18px;
          color: #b0b0b0;
          margin: 0 0 30px 0;
        }

        .story-section {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 15px;
          padding: 25px;
          margin: 25px 0;
          border-left: 4px solid #667eea;
        }

        .story-section h3 {
          margin: 0 0 15px 0;
          color: #667eea;
        }

        .story-text p {
          line-height: 1.6;
          margin: 0 0 15px 0;
        }

        .story-text p:last-child {
          margin-bottom: 0;
        }

        .success-overlay {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
          padding: 30px 50px;
          border-radius: 20px;
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }

        .failure-overlay {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #f44336, #d32f2f);
          color: white;
          padding: 30px 50px;
          border-radius: 20px;
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          z-index: 1000;
          max-width: 400px;
        }

        .quest-complete-section {
          background: rgba(76, 175, 80, 0.1);
          border: 2px solid rgba(76, 175, 80, 0.3);
          border-radius: 15px;
          padding: 25px;
          text-align: center;
          margin: 25px 0;
        }

        .quest-complete-section h3 {
          margin: 0 0 20px 0;
          color: #4CAF50;
          font-size: 24px;
        }

        .rewards {
          font-size: 16px;
        }

        .rewards div {
          margin: 10px 0;
          font-weight: bold;
        }

        .quest-complete {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
        }

        .completion-message {
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 50px;
        }

        .completion-message h1 {
          margin: 0 0 20px 0;
          color: #4f9ff0;
          font-size: 36px;
        }

        .final-stats {
          margin-top: 30px;
          font-size: 18px;
        }

        .final-stats div {
          margin: 10px 0;
        }
      `}</style>
    </div>
  )
}

export default QuestInterface
