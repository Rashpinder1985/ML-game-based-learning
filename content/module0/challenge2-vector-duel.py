"""
Challenge 2: Vector Duel
Learning Goal: Angle between vectors
"""

import math

def challenge2_vector_angle():
    """
    Find the angle between vector u = ⟨3, -2⟩ and vector v = ⟨-1, 5⟩
    
    This challenge teaches vector mathematics which is fundamental for
    understanding similarity measures in machine learning.
    
    Returns:
        float: The angle between the vectors in degrees
    """
    
    # Vector u = ⟨3, -2⟩
    u_x, u_y = 3, -2
    
    # Vector v = ⟨-1, 5⟩
    v_x, v_y = -1, 5
    
    # Calculate dot product: u·v = u₁v₁ + u₂v₂
    dot_product = u_x * v_x + u_y * v_y
    print(f"📐 Dot product (u·v): {u_x} × {v_x} + {u_y} × {v_y} = {dot_product}")
    
    # Calculate magnitude of vector u: |u| = √(u₁² + u₂²)
    magnitude_u = math.sqrt(u_x**2 + u_y**2)
    print(f"📏 Magnitude of u: √({u_x}² + {u_y}²) = √({u_x**2} + {u_y**2}) = {magnitude_u:.2f}")
    
    # Calculate magnitude of vector v: |v| = √(v₁² + v₂²)
    magnitude_v = math.sqrt(v_x**2 + v_y**2)
    print(f"📏 Magnitude of v: √({v_x}² + {v_y}²) = √({v_x**2} + {v_y**2}) = {magnitude_v:.2f}")
    
    # Calculate cosine of angle: cos(θ) = (u·v) / (|u||v|)
    cos_theta = dot_product / (magnitude_u * magnitude_v)
    print(f"📐 Cosine of angle: {dot_product:.2f} / ({magnitude_u:.2f} × {magnitude_v:.2f}) = {cos_theta:.3f}")
    
    # Calculate angle in degrees: θ = arccos(cos(θ))
    angle_radians = math.acos(cos_theta)
    angle_degrees = math.degrees(angle_radians)
    
    return angle_degrees

def challenge2_validation():
    """
    Validate the vector angle calculation
    """
    angle = challenge2_vector_angle()
    
    # The correct answer should be approximately 135°
    expected_angle = 135.0
    tolerance = 5.0  # Allow 5° tolerance
    
    print(f"\n🎯 Calculated angle: {angle:.1f}°")
    print(f"✅ Expected angle: {expected_angle}°")
    print(f"🎉 Challenge {'PASSED' if abs(angle - expected_angle) <= tolerance else 'FAILED'}!")
    
    return abs(angle - expected_angle) <= tolerance

def ai_ml_connection():
    """
    Explain the AI/ML connection for vector angles
    """
    print("""
🧠 AI/ML Connection: Vector Angles
    
Vector angles are fundamental in machine learning:

1. 📊 Cosine Similarity:
   - Measures similarity between documents in text analysis
   - Used in recommendation systems to find similar users/items
   - Formula: cos(θ) = (A·B) / (|A||B|)

2. 🎯 Clustering Algorithms:
   - K-means uses distance and angle to group similar data points
   - Hierarchical clustering measures vector relationships

3. 🧠 Neural Networks:
   - Weight vectors determine how neurons respond
   - Angle between weight vectors affects learning

4. 🔍 Search Engines:
   - Rank search results by angle between query and document vectors
   - Semantic search uses vector similarity

5. 📱 Recommendation Systems:
   - Netflix, Spotify use vector angles to find similar content
   - User preference vectors compared using angles

6. 🖼️ Computer Vision:
   - Image features represented as vectors
   - Object recognition uses vector angle comparisons

The angle you calculated is the foundation for understanding how
ML algorithms measure similarity between data points!
    """)

def vector_visualization():
    """
    Visual representation of the vectors
    """
    print("""
🎨 Vector Visualization:

Vector u = ⟨3, -2⟩:
   From origin (0,0) to point (3,-2)
   Points right 3 units, down 2 units

Vector v = ⟨-1, 5⟩:
   From origin (0,0) to point (-1,5)
   Points left 1 unit, up 5 units

The angle between them is the angle at the origin (0,0)
where the two vectors meet. This angle tells us how
"similar" or "different" the directions are.
    """)

if __name__ == "__main__":
    print("⚔️ Challenge 2: Vector Duel")
    print("=" * 50)
    print("Find the angle between vector u = ⟨3, -2⟩ and vector v = ⟨-1, 5⟩")
    print()
    
    vector_visualization()
    print()
    
    # Run the challenge
    success = challenge2_validation()
    
    if success:
        print("\n🎉 Congratulations! You've mastered vector angles!")
        ai_ml_connection()
    else:
        print("\n💡 Hints:")
        print("1. Use the dot product formula: u·v = u₁v₁ + u₂v₂")
        print("2. Calculate magnitudes: |u| = √(u₁² + u₂²)")
        print("3. Use angle formula: θ = arccos((u·v)/(|u||v|))")