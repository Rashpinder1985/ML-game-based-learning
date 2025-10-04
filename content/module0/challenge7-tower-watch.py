"""
Challenge 7: Tower Watch
Learning Goal: Angle of depression
"""

import math

def challenge7_angle_of_depression():
    """Calculate angle of depression from 30m tower to object 50m away"""
    height = 30  # meters
    distance = 50  # meters
    
    # Angle of depression = arctan(height/distance)
    angle_radians = math.atan(height / distance)
    angle_degrees = math.degrees(angle_radians)
    
    print(f"🏰 Tower height: {height}m")
    print(f"📍 Horizontal distance: {distance}m")
    print(f"📐 Angle of depression: arctan({height}/{distance}) = {angle_degrees:.1f}°")
    
    return angle_degrees

def ai_ml_connection():
    """AI/ML connection for trigonometric concepts"""
    print("""
🧠 AI/ML Connection: Trigonometry
    
Trigonometric concepts apply to neural networks:
- Activation functions use sine/cosine transformations
- Fourier transforms analyze signal patterns
- Rotation matrices transform feature spaces
- Angular relationships in high-dimensional spaces
    """)

if __name__ == "__main__":
    print("🏰 Challenge 7: Tower Watch")
    angle = challenge7_angle_of_depression()
    expected = 30.96  # approximately 31°
    print(f"🎯 Result: {angle:.1f}° (Expected: ~{expected:.1f}°)")
    ai_ml_connection()