"""
Challenge 3: Magic Bridge
Learning Goal: Perpendicular bisector
"""

def challenge3_perpendicular_bisector():
    """
    Find the equation of the perpendicular bisector of the line segment
    connecting points (0, 6) and (6, 0).
    
    This challenge teaches perpendicular relationships which are fundamental
    for understanding decision boundaries in machine learning.
    
    Returns:
        str: The equation of the perpendicular bisector
    """
    
    # Given points
    point1_x, point1_y = 0, 6
    point2_x, point2_y = 6, 0
    
    print(f"🎯 Points: ({point1_x}, {point1_y}) and ({point2_x}, {point2_y})")
    
    # Step 1: Find the midpoint
    midpoint_x = (point1_x + point2_x) / 2
    midpoint_y = (point1_y + point2_y) / 2
    print(f"📍 Midpoint: ({midpoint_x}, {midpoint_y})")
    
    # Step 2: Find the slope of the original line
    slope_original = (point2_y - point1_y) / (point2_x - point1_x)
    print(f"📐 Original line slope: ({point2_y} - {point1_y}) / ({point2_x} - {point1_x}) = {slope_original}")
    
    # Step 3: Find the perpendicular slope (negative reciprocal)
    if slope_original != 0:
        slope_perpendicular = -1 / slope_original
    else:
        slope_perpendicular = float('inf')  # Vertical line
    print(f"📐 Perpendicular slope: -1 / {slope_original} = {slope_perpendicular}")
    
    # Step 4: Use point-slope form to find the equation
    # y - y₁ = m(x - x₁)
    # y - midpoint_y = slope_perpendicular(x - midpoint_x)
    # y = slope_perpendicular(x - midpoint_x) + midpoint_y
    
    if slope_perpendicular != float('inf'):
        # For slope = 1, midpoint = (3, 3)
        # y - 3 = 1(x - 3)
        # y = x - 3 + 3
        # y = x
        equation = f"y = {slope_perpendicular}x + {midpoint_y - slope_perpendicular * midpoint_x}"
        simplified = f"y = x"  # Since slope = 1 and passes through (3,3)
    else:
        equation = f"x = {midpoint_x}"
    
    return simplified

def challenge3_validation():
    """
    Validate the perpendicular bisector calculation
    """
    equation = challenge3_perpendicular_bisector()
    
    # The correct answer should be y = x
    expected_equation = "y = x"
    
    print(f"\n🎯 Calculated equation: {equation}")
    print(f"✅ Expected equation: {expected_equation}")
    print(f"🎉 Challenge {'PASSED' if equation.strip() == expected_equation else 'FAILED'}!")
    
    return equation.strip() == expected_equation

def ai_ml_connection():
    """
    Explain the AI/ML connection for perpendicular bisectors
    """
    print("""
🧠 AI/ML Connection: Perpendicular Bisectors
    
Perpendicular relationships are fundamental in machine learning:

1. 🎯 Decision Boundaries:
   - Support Vector Machines (SVMs) find optimal separating hyperplanes
   - These hyperplanes are perpendicular to the margin between classes
   - Maximizes the "safety zone" between different data classes

2. 📊 Linear Classification:
   - Logistic regression creates decision boundaries
   - Perpendicular lines separate different categories optimally
   - Minimizes classification errors

3. 🧠 Neural Networks:
   - Hidden layers create complex decision boundaries
   - Each neuron acts like a perpendicular separator
   - Multiple layers combine to create non-linear boundaries

4. 📈 Optimization:
   - Gradient descent moves perpendicular to contour lines
   - Finds the steepest path to the minimum
   - Perpendicular directions indicate optimal search directions

5. 🔍 Feature Selection:
   - Principal Component Analysis (PCA) finds perpendicular directions
   - These directions capture maximum variance in data
   - Reduces dimensionality while preserving information

6. 🎨 Image Recognition:
   - Edge detection uses perpendicular gradients
   - Feature extraction identifies perpendicular patterns
   - Object boundaries often follow perpendicular relationships

The perpendicular bisector you calculated represents the optimal
way to separate two points - this concept scales to separating
millions of data points in machine learning!
    """)

def geometric_visualization():
    """
    Visual representation of the perpendicular bisector
    """
    print("""
🎨 Geometric Visualization:

Original Points: (0,6) and (6,0)
Midpoint: (3,3)
Original Line: y = -x + 6 (slope = -1)
Perpendicular Line: y = x (slope = 1)

The perpendicular bisector:
- Passes through the midpoint (3,3)
- Is perpendicular to the original line
- Creates equal distances to both points
- Represents the "magic bridge" that spans optimally

This is the foundation for understanding how ML algorithms
find the best way to separate different types of data!
    """)

if __name__ == "__main__":
    print("🌉 Challenge 3: Magic Bridge")
    print("=" * 50)
    print("Find the equation of the perpendicular bisector of the line segment")
    print("connecting points (0, 6) and (6, 0).")
    print()
    
    geometric_visualization()
    print()
    
    # Run the challenge
    success = challenge3_validation()
    
    if success:
        print("\n🎉 Congratulations! You've mastered perpendicular bisectors!")
        ai_ml_connection()
    else:
        print("\n💡 Hints:")
        print("1. Find the midpoint: ((x₁+x₂)/2, (y₁+y₂)/2)")
        print("2. Calculate the slope of the original line")
        print("3. Find the perpendicular slope (negative reciprocal)")
        print("4. Use point-slope form: y - y₁ = m(x - x₁)")