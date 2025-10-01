import React, { useEffect, useRef, useState } from 'react'

interface Point {
  x: number
  y: number
  label?: string
  color?: string
}

interface Line {
  start: Point
  end: Point
  color?: string
  style?: 'solid' | 'dashed' | 'dotted'
  label?: string
}

interface InteractiveGraphProps {
  width?: number
  height?: number
  points?: Point[]
  lines?: Line[]
  onPointClick?: (point: Point) => void
  showGrid?: boolean
  xRange?: [number, number]
  yRange?: [number, number]
  title?: string
}

export const InteractiveGraph: React.FC<InteractiveGraphProps> = ({
  width = 400,
  height = 400,
  points = [],
  lines = [],
  onPointClick,
  showGrid = true,
  xRange = [-5, 5],
  yRange = [-5, 5],
  title
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null)

  const coordinateToPixel = (x: number, y: number): [number, number] => {
    const pixelX = ((x - xRange[0]) / (xRange[1] - xRange[0])) * width
    const pixelY = ((yRange[1] - y) / (yRange[1] - yRange[0])) * height
    return [pixelX, pixelY]
  }

  const drawGraph = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 0.5

      // Vertical grid lines
      for (let x = Math.ceil(xRange[0]); x <= xRange[1]; x++) {
        if (x === 0) continue // Skip center line
        const [pixelX] = coordinateToPixel(x, 0)
        ctx.beginPath()
        ctx.moveTo(pixelX, 0)
        ctx.lineTo(pixelX, height)
        ctx.stroke()
      }

      // Horizontal grid lines
      for (let y = Math.ceil(yRange[0]); y <= yRange[1]; y++) {
        if (y === 0) continue // Skip center line
        const [, pixelY] = coordinateToPixel(0, y)
        ctx.beginPath()
        ctx.moveTo(0, pixelY)
        ctx.lineTo(width, pixelY)
        ctx.stroke()
      }
    }

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.lineWidth = 2

    // X-axis
    const [, yAxisPixel] = coordinateToPixel(0, 0)
    ctx.beginPath()
    ctx.moveTo(0, yAxisPixel)
    ctx.lineTo(width, yAxisPixel)
    ctx.stroke()

    // Y-axis
    const [xAxisPixel] = coordinateToPixel(0, 0)
    ctx.beginPath()
    ctx.moveTo(xAxisPixel, 0)
    ctx.lineTo(xAxisPixel, height)
    ctx.stroke()

    // Draw axis labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'

    // X-axis labels
    for (let x = Math.ceil(xRange[0]); x <= xRange[1]; x++) {
      if (x === 0) continue
      const [pixelX] = coordinateToPixel(x, 0)
      ctx.fillText(x.toString(), pixelX, yAxisPixel + 15)
    }

    // Y-axis labels
    ctx.textAlign = 'right'
    for (let y = Math.ceil(yRange[0]); y <= yRange[1]; y++) {
      if (y === 0) continue
      const [, pixelY] = coordinateToPixel(0, y)
      ctx.fillText(y.toString(), xAxisPixel - 5, pixelY + 4)
    }

    // Draw lines
    lines.forEach(line => {
      const [startX, startY] = coordinateToPixel(line.start.x, line.start.y)
      const [endX, endY] = coordinateToPixel(line.end.x, line.end.y)

      ctx.strokeStyle = line.color || '#4f9ff0'
      ctx.lineWidth = 3

      if (line.style === 'dashed') {
        ctx.setLineDash([10, 5])
      } else if (line.style === 'dotted') {
        ctx.setLineDash([2, 5])
      } else {
        ctx.setLineDash([])
      }

      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.stroke()

      // Draw line label
      if (line.label) {
        const midX = (startX + endX) / 2
        const midY = (startY + endY) / 2
        ctx.fillStyle = line.color || '#4f9ff0'
        ctx.font = 'bold 12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(line.label, midX, midY - 10)
      }
    })

    // Draw points
    points.forEach(point => {
      const [pixelX, pixelY] = coordinateToPixel(point.x, point.y)

      // Point circle
      ctx.fillStyle = point.color || '#ff6b6b'
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(pixelX, pixelY, hoveredPoint === point ? 8 : 6, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()

      // Point label
      if (point.label) {
        ctx.fillStyle = 'white'
        ctx.font = 'bold 12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(point.label, pixelX, pixelY - 15)
      }

      // Coordinates on hover
      if (hoveredPoint === point) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
        ctx.fillRect(pixelX - 25, pixelY + 10, 50, 20)
        ctx.fillStyle = 'white'
        ctx.font = '10px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(`(${point.x.toFixed(1)}, ${point.y.toFixed(1)})`, pixelX, pixelY + 23)
      }
    })

    // Reset line dash
    ctx.setLineDash([])
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const clickX = event.clientX - rect.left
    const clickY = event.clientY - rect.top

    // Check if click is near any point
    points.forEach(point => {
      const [pixelX, pixelY] = coordinateToPixel(point.x, point.y)
      const distance = Math.sqrt((clickX - pixelX) ** 2 + (clickY - pixelY) ** 2)

      if (distance < 15 && onPointClick) {
        onPointClick(point)
      }
    })
  }

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top

    let foundHoveredPoint = null
    points.forEach(point => {
      const [pixelX, pixelY] = coordinateToPixel(point.x, point.y)
      const distance = Math.sqrt((mouseX - pixelX) ** 2 + (mouseY - pixelY) ** 2)

      if (distance < 15) {
        foundHoveredPoint = point
      }
    })

    setHoveredPoint(foundHoveredPoint)
  }

  useEffect(() => {
    drawGraph()
  }, [points, lines, hoveredPoint, showGrid, xRange, yRange, width, height])

  return (
    <div className="interactive-graph">
      {title && <h4 className="graph-title">{title}</h4>}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={() => setHoveredPoint(null)}
        className="graph-canvas"
      />
      <div className="graph-controls">
        <div className="coordinate-display">
          {hoveredPoint ? (
            <span>Hovering: ({hoveredPoint.x.toFixed(2)}, {hoveredPoint.y.toFixed(2)})</span>
          ) : (
            <span>Hover over points for coordinates</span>
          )}
        </div>
      </div>

      <style>{`
        .interactive-graph {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .graph-title {
          color: #4f9ff0;
          margin: 0 0 15px 0;
          font-size: 18px;
          text-align: center;
        }

        .graph-canvas {
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          cursor: crosshair;
          background: rgba(0, 0, 0, 0.5);
        }

        .graph-canvas:hover {
          border-color: #4f9ff0;
        }

        .graph-controls {
          margin-top: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .coordinate-display {
          background: rgba(255, 255, 255, 0.1);
          padding: 5px 15px;
          border-radius: 15px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </div>
  )
}

export default InteractiveGraph
