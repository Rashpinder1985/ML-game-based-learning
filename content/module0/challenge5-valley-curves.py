"""
Challenge 5: Valley of Curves
Learning Goal: Parabola analysis (vertex, axis, roots)
"""

import math

def challenge5_parabola_analysis():
    """
    Analyze the parabola f(x) = x² - 4x + 3
    Find: vertex, axis of symmetry, and roots
    
    This challenge teaches quadratic analysis which is fundamental for
    understanding optimization and finding minima in machine learning.
    
    Returns:
        dict: Analysis results including vertex, axis, and roots
    """
    
    print("🌊 Analyzing parabola: f(x) = x² - 4x + 3")
    print()
    
    # Standard form: f(x) = ax² + bx + c
    a, b, c = 1, -4, 3
    print(f"📐 Coefficients: a = {a}, b = {b}, c = {c}")
    
    # Find vertex using formula: x = -b/(2a)
    vertex_x = -b / (2 * a)
    vertex_y = a * vertex_x**2 + b * vertex_x + c
    print(f"\n📍 Vertex:")
    print(f"   x = -b/(2a) = -({b})/(2×{a}) = {vertex_x}")
    print(f"   y = f({vertex_x}) = ({vertex_x})² - 4({vertex_x}) + 3 = {vertex_y}")
    
    # Axis of symmetry: x = vertex_x
    axis_of_symmetry = vertex_x
    print(f"\n📐 Axis of symmetry: x = {axis_of_symmetry}")
    
    # Find roots using quadratic formula: x = (-b ± √(b²-4ac))/(2a)
    discriminant = b**2 - 4 * a * c
    print(f"\n🌱 Roots (using quadratic formula):")
    print(f"   Discriminant: b² - 4ac = ({b})² - 4({a})({c}) = {discriminant}")
    
    if discriminant >= 0:
        root1 = (-b + math.sqrt(discriminant)) / (2 * a)
        root2 = (-b - math.sqrt(discriminant)) / (2 * a)
        print(f"   Root 1: x = (-{b} + √{discriminant})/(2×{a}) = {root1}")
        print(f"   Root 2: x = (-{b} - √{discriminant})/(2×{a}) = {root2}")
        roots = [root1, root2]
    else:
        print(f"   No real roots (discriminant < 0)")
        roots = []
    
    # Additional analysis
    direction = "upward" if a > 0 else "downward"
    print(f"\n📈 Parabola opens: {direction} (since a = {a} > 0)")
    
    return {
        'vertex': (vertex_x, vertex_y),
        'axis_of_symmetry': axis_of_symmetry,
        'roots': roots,
        'direction': direction,
        'discriminant': discriminant
    }

def challenge5_validation():
    """
    Validate the parabola analysis
    """
    analysis = challenge5_parabola_analysis()
    
    # Expected results
    expected_vertex = (2, -1)
    expected_axis = 2
    expected_roots = [1, 3]
    
    print(f"\n🎯 Results:")
    print(f"   Vertex: {analysis['vertex']}")
    print(f"   Axis of symmetry: x = {analysis['axis_of_symmetry']}")
    print(f"   Roots: {analysis['roots']}")
    
    print(f"\n✅ Expected:")
    print(f"   Vertex: {expected_vertex}")
    print(f"   Axis of symmetry: x = {expected_axis}")
    print(f"   Roots: {expected_roots}")
    
    # Check if results are correct (with small tolerance)
    vertex_correct = abs(analysis['vertex'][0] - expected_vertex[0]) < 0.01 and \
                    abs(analysis['vertex'][1] - expected_vertex[1]) < 0.01
    axis_correct = abs(analysis['axis_of_symmetry'] - expected_axis) < 0.01
    roots_correct = len(analysis['roots']) == 2 and \
                   abs(analysis['roots'][0] - expected_roots[0]) < 0.01 and \
                   abs(analysis['roots'][1] - expected_roots[1]) < 0.01
    
    success = vertex_correct and axis_correct and roots_correct
    print(f"\n🎉 Challenge {'PASSED' if success else 'FAILED'}!")
    
    return success

def ai_ml_connection():
    """
    Explain the AI/ML connection for parabola analysis
    """
    print("""
🧠 AI/ML Connection: Parabola Analysis
    
Quadratic functions and parabola analysis are fundamental in machine learning:

1. 🎯 Optimization Problems:
   - Gradient descent follows parabolic paths to find minima
   - Cost functions often have quadratic shapes
   - Finding the vertex helps locate optimal parameters

2. 📊 Loss Functions:
   - Mean Squared Error (MSE) creates parabolic loss landscapes
   - The vertex represents the minimum error point
   - Understanding parabola shape helps optimize learning

3. 🧠 Neural Networks:
   - Activation functions create parabolic regions
   - Weight updates follow quadratic optimization paths
   - Backpropagation uses parabolic approximations

4. 📈 Regression Analysis:
   - Quadratic regression models use parabolic curves
   - Polynomial features create parabolic relationships
   - Feature interactions form parabolic patterns

5. 🔍 Support Vector Machines:
   - Kernel functions create parabolic decision boundaries
   - The margin optimization follows parabolic constraints
   - Quadratic programming solves SVM optimization

6. 📊 Data Preprocessing:
   - Polynomial feature expansion creates parabolic relationships
   - Feature scaling affects parabola shape
   - Outlier detection uses parabolic distance measures

The parabola you analyzed represents the fundamental shape
of optimization in machine learning - finding the vertex
is like finding the optimal solution!
    """)

def parabola_visualization():
    """
    Visual representation of the parabola
    """
    print("""
🎨 Parabola Visualization:

f(x) = x² - 4x + 3

Key Points:
- Vertex: (2, -1) - the lowest point
- Axis of symmetry: x = 2 - vertical line through vertex
- Roots: x = 1 and x = 3 - where parabola crosses x-axis
- Opens upward - minimum point at vertex

Shape Analysis:
- The parabola is U-shaped opening upward
- The vertex (2, -1) is the minimum point
- The axis x = 2 divides the parabola into two symmetric halves
- The roots (1,0) and (3,0) show where the function equals zero

This parabolic shape represents the fundamental optimization
landscape in machine learning algorithms!
    """)

if __name__ == "__main__":
    print("🌊 Challenge 5: Valley of Curves")
    print("=" * 50)
    print("Analyze the parabola f(x) = x² - 4x + 3")
    print("Find: vertex, axis of symmetry, and roots")
    print()
    
    parabola_visualization()
    print()
    
    # Run the challenge
    success = challenge5_validation()
    
    if success:
        print("\n🎉 Congratulations! You've mastered parabola analysis!")
        ai_ml_connection()
    else:
        print("\n💡 Hints:")
        print("1. Vertex: x = -b/(2a), then find y = f(x)")
        print("2. Axis of symmetry: x = vertex_x")
        print("3. Roots: Use quadratic formula x = (-b ± √(b²-4ac))/(2a)")
        print("4. Direction: Upward if a > 0, downward if a < 0")