"""
Challenge 6: Duel of Lines
Learning Goal: Angle between lines
"""

import math

def challenge6_angle_between_lines():
    """
    Calculate the angle between two lines:
    Line 1: y = 2x + 3
    Line 2: y = -3x + 2
    
    This challenge teaches angular relationships between lines which help
    understand decision boundaries in machine learning.
    
    Returns:
        float: The angle between the lines in degrees
    """
    
    print("⚔️ Line 1: y = 2x + 3 (slope = 2)")
    print("⚔️ Line 2: y = -3x + 2 (slope = -3)")
    print()
    
    # Get slopes from the equations
    slope1 = 2
    slope2 = -3
    
    print(f"📐 Slope of Line 1 (m₁): {slope1}")
    print(f"📐 Slope of Line 2 (m₂): {slope2}")
    
    # Formula for angle between lines: tan(θ) = |(m₁ - m₂)/(1 + m₁m₂)|
    numerator = abs(slope1 - slope2)
    denominator = abs(1 + slope1 * slope2)
    tan_theta = numerator / denominator
    
    print(f"\n📐 Calculating angle:")
    print(f"   tan(θ) = |(m₁ - m₂)/(1 + m₁m₂)|")
    print(f"   tan(θ) = |({slope1} - {slope2})/(1 + {slope1} × {slope2})|")
    print(f"   tan(θ) = |{slope1 - slope2}|/|{1 + slope1 * slope2}|")
    print(f"   tan(θ) = {numerator}/{denominator} = {tan_theta:.3f}")
    
    # Find the angle using arctangent
    theta_radians = math.atan(tan_theta)
    theta_degrees = math.degrees(theta_radians)
    
    print(f"\n📐 Angle calculation:")
    print(f"   θ = arctan({tan_theta:.3f}) = {theta_radians:.3f} radians")
    print(f"   θ = {theta_degrees:.1f}°")
    
    return theta_degrees

def challenge6_validation():
    """
    Validate the angle calculation
    """
    angle = challenge6_angle_between_lines()
    
    # Expected angle is approximately 45° (since tan(45°) = 1)
    expected_angle = 45.0
    tolerance = 5.0  # Allow 5° tolerance
    
    print(f"\n🎯 Calculated angle: {angle:.1f}°")
    print(f"✅ Expected angle: {expected_angle}°")
    print(f"🎉 Challenge {'PASSED' if abs(angle - expected_angle) <= tolerance else 'FAILED'}!")
    
    return abs(angle - expected_angle) <= tolerance

def ai_ml_connection():
    """
    Explain the AI/ML connection for angles between lines
    """
    print("""
🧠 AI/ML Connection: Angles Between Lines
    
Angular relationships between lines are fundamental in machine learning:

1. 🎯 Decision Boundaries:
   - Different classification algorithms create lines at various angles
   - The angle between boundaries affects classification accuracy
   - Optimal boundaries often have specific angular relationships

2. 📊 Feature Relationships:
   - Angles between feature vectors indicate correlation
   - Orthogonal features (90° angle) are independent
   - Parallel features (0° angle) are perfectly correlated

3. 🧠 Neural Networks:
   - Weight vectors create decision boundaries at different angles
   - Learning adjusts angles to minimize classification errors
   - Multiple layers create complex angular relationships

4. 📈 Gradient Descent:
   - Gradient vectors point in the direction of steepest ascent
   - Angle between gradients and search direction affects convergence
   - Optimization algorithms adjust search angles for efficiency

5. 🔍 Principal Component Analysis:
   - PCA finds orthogonal directions (90° angles) in data
   - These directions capture maximum variance
   - Angular relationships reveal data structure

6. 📊 Clustering:
   - Cluster centroids can be viewed as lines/vectors
   - Angles between centroids indicate cluster relationships
   - Hierarchical clustering uses angular distance measures

The angle you calculated represents understanding how different
decision-making processes relate to each other in ML algorithms!
    """)

def line_visualization():
    """
    Visual representation of the lines and their angle
    """
    print("""
🎨 Line Duel Visualization:

Line 1: y = 2x + 3
- Steep upward slope (slope = 2)
- Passes through (0, 3)
- Points northeast direction

Line 2: y = -3x + 2  
- Steep downward slope (slope = -3)
- Passes through (0, 2)
- Points northwest direction

Angle Between Lines:
- The acute angle where the lines meet
- Represents how "different" their directions are
- Important for understanding decision boundaries

This angular relationship represents how different
classification methods approach the same problem!
    """)

if __name__ == "__main__":
    print("⚔️ Challenge 6: Duel of Lines")
    print("=" * 50)
    print("Calculate the angle between two lines:")
    print("Line 1: y = 2x + 3")
    print("Line 2: y = -3x + 2")
    print()
    
    line_visualization()
    print()
    
    # Run the challenge
    success = challenge6_validation()
    
    if success:
        print("\n🎉 Congratulations! You've mastered angles between lines!")
        ai_ml_connection()
    else:
        print("\n💡 Hints:")
        print("1. Extract slopes from the line equations")
        print("2. Use formula: tan(θ) = |(m₁ - m₂)/(1 + m₁m₂)|")
        print("3. Calculate θ = arctan(tan(θ))")
        print("4. Convert from radians to degrees")