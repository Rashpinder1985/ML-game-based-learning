import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ScatterChart, Scatter, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

interface DataPoint {
  x: number
  y: number
  predicted?: number
}

interface DataVisualizationProps {
  lessonId: number
  lessonTitle: string
  onVisualizationComplete: (data: any) => void
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({
  lessonId,
  lessonTitle,
  onVisualizationComplete
}) => {
  const [data, setData] = useState<DataPoint[]>([])
  const [predictions, setPredictions] = useState<DataPoint[]>([])
  const [polynomialDegree, setPolynomialDegree] = useState(1)
  const [isInteractive, setIsInteractive] = useState(false)
  const [modelMetrics, setModelMetrics] = useState<any>(null)

  useEffect(() => {
    generateData()
  }, [lessonId])

  const generateData = () => {
    const points: DataPoint[] = []

    // Generate different data based on lesson type
    if (lessonTitle.toLowerCase().includes('linear')) {
      // Linear regression data
      for (let i = 0; i < 50; i++) {
        const x = (i / 50) * 10
        const y = 2.5 * x + 1.2 + (Math.random() - 0.5) * 3
        points.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) })
      }
    } else if (lessonTitle.toLowerCase().includes('polynomial')) {
      // Polynomial regression data
      for (let i = 0; i < 50; i++) {
        const x = (i / 50) * 4 - 2 // Range from -2 to 2
        const y = 0.5 * x**3 - 2 * x**2 + x + 1 + (Math.random() - 0.5) * 1.5
        points.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) })
      }
    } else {
      // Default sine wave data
      for (let i = 0; i < 50; i++) {
        const x = (i / 50) * 2 * Math.PI
        const y = Math.sin(x) + (Math.random() - 0.5) * 0.5
        points.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) })
      }
    }

    setData(points)
  }

  const generatePredictions = (degree: number) => {
    if (data.length === 0) return

    // Simple polynomial regression simulation
    const sortedData = [...data].sort((a, b) => a.x - b.x)
    const predictionPoints: DataPoint[] = []

    sortedData.forEach(point => {
      let predicted = 0

      if (degree === 1) {
        // Linear fit approximation
        const slope = lessonTitle.toLowerCase().includes('linear') ? 2.5 : 1
        const intercept = lessonTitle.toLowerCase().includes('linear') ? 1.2 : 0
        predicted = slope * point.x + intercept
      } else if (degree === 2) {
        // Quadratic fit
        predicted = 0.1 * point.x**2 + 0.5 * point.x + 1
      } else if (degree === 3) {
        // Cubic fit (closer to actual polynomial data)
        predicted = 0.5 * point.x**3 - 2 * point.x**2 + point.x + 1
      } else {
        // Higher degree - might overfit
        predicted = 0.1 * point.x**4 + 0.5 * point.x**3 - 2 * point.x**2 + point.x + 1
      }

      predictionPoints.push({
        x: point.x,
        y: point.y,
        predicted: parseFloat(predicted.toFixed(2))
      })
    })

    setPredictions(predictionPoints)

    // Calculate metrics
    const mse = predictionPoints.reduce((sum, point) =>
      sum + Math.pow(point.y - (point.predicted || 0), 2), 0) / predictionPoints.length

    const yMean = predictionPoints.reduce((sum, point) => sum + point.y, 0) / predictionPoints.length
    const ssTot = predictionPoints.reduce((sum, point) => sum + Math.pow(point.y - yMean, 2), 0)
    const ssRes = predictionPoints.reduce((sum, point) =>
      sum + Math.pow(point.y - (point.predicted || 0), 2), 0)
    const r2 = 1 - (ssRes / ssTot)

    const metrics = {
      mse: parseFloat(mse.toFixed(4)),
      r2: parseFloat(r2.toFixed(4)),
      degree
    }

    setModelMetrics(metrics)
    onVisualizationComplete(metrics)
  }

  const handleDegreeChange = (newDegree: number) => {
    setPolynomialDegree(newDegree)
    generatePredictions(newDegree)
  }

  const chartData = predictions.length > 0 ? predictions : data

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="data-visualization"
      style={{ padding: '20px', background: '#1a1a2e', borderRadius: '12px', color: 'white' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#4f9ff0' }}>Interactive Data Visualization</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px' }}>Polynomial Degree:</label>
          <select
            value={polynomialDegree}
            onChange={(e) => handleDegreeChange(parseInt(e.target.value))}
            style={{
              padding: '5px 10px',
              borderRadius: '6px',
              border: 'none',
              background: '#16213e',
              color: 'white'
            }}
          >
            {[1, 2, 3, 4, 5, 6].map(degree => (
              <option key={degree} value={degree}>Degree {degree}</option>
            ))}
          </select>
          <button
            onClick={() => generatePredictions(polynomialDegree)}
            style={{
              padding: '5px 15px',
              borderRadius: '6px',
              border: 'none',
              background: '#4f9ff0',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Fit Model
          </button>
        </div>
      </div>

      <div style={{ height: '400px', marginBottom: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis
              dataKey="x"
              type="number"
              domain={['dataMin', 'dataMax']}
              stroke="#888"
            />
            <YAxis
              dataKey="y"
              type="number"
              domain={['dataMin', 'dataMax']}
              stroke="#888"
            />
            <Tooltip
              formatter={(value: any, name: string) => [
                parseFloat(value).toFixed(2),
                name === 'y' ? 'Actual' : name === 'predicted' ? 'Predicted' : name
              ]}
              contentStyle={{
                backgroundColor: '#16213e',
                border: '1px solid #4f9ff0',
                borderRadius: '6px'
              }}
            />
            <Scatter
              dataKey="y"
              fill="#4f9ff0"
              name="Training Data"
              opacity={0.7}
            />
            {predictions.length > 0 && (
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#ff6b6b"
                strokeWidth={2}
                dot={false}
                name="Model Predictions"
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {modelMetrics && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '15px',
            padding: '15px',
            background: '#16213e',
            borderRadius: '8px'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4f9ff0' }}>
              {modelMetrics.degree}
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>Polynomial Degree</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff6b6b' }}>
              {modelMetrics.mse}
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>Mean Squared Error</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4ecdc4' }}>
              {modelMetrics.r2}
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>R² Score</div>
          </div>
        </motion.div>
      )}

      <div style={{ marginTop: '15px', fontSize: '14px', color: '#888', lineHeight: '1.4' }}>
        <p><strong>🎮 Game Tip:</strong> Try different polynomial degrees and observe how the model fits the data!</p>
        <p>• <strong>Degree 1 (Linear):</strong> Simple but may underfit complex data</p>
        <p>• <strong>Degree 2-3:</strong> Good balance for most problems</p>
        <p>• <strong>Degree 4+:</strong> May overfit - watch for very high R² but poor generalization</p>
      </div>
    </motion.div>
  )
}

export default DataVisualization