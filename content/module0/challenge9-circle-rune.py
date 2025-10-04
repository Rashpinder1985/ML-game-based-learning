"""
Challenge 9: Circle Rune
Learning Goal: Parametric equations
"""

import math

def challenge9_unit_circle():
    """Trace unit circle with parametric equations x = cos(t), y = sin(t)"""
    print("🔮 Unit Circle: x = cos(t), y = sin(t)")
    
    # Key points on unit circle
    points = [
        (0, "t = 0"),
        (math.pi/2, "t = π/2"), 
        (math.pi, "t = π"),
        (3*math.pi/2, "t = 3π/2"),
        (2*math.pi, "t = 2π")
    ]
    
    for t, description in points:
        x = math.cos(t)
        y = math.sin(t)
        print(f"   {description}: ({x:.3f}, {y:.3f})")
    
    return points

def ai_ml_connection():
    """AI/ML connection for parametric equations"""
    print("""
🧠 AI/ML Connection: Parametric Equations
    
Parametric functions model trajectories in ML:
- Time series data follows parametric curves
- Neural network training paths are parametric
- Optimization trajectories use parametric forms
- Signal processing relies on parametric models
    """)

if __name__ == "__main__":
    print("🔮 Challenge 9: Circle Rune")
    points = challenge9_unit_circle()
    ai_ml_connection()