"""
Challenge 4: Roads & Waypoints
Learning Goal: Line intersections and intercepts
"""

def challenge4_line_intersection():
    """
    Find the intersection point of two roads:
    Road 1: y = 3x
    Road 2: y = 2x + 3
    
    This challenge teaches line intersections which are fundamental for
    understanding optimization and finding solutions in machine learning.
    
    Returns:
        tuple: (x, y) coordinates of the intersection point
    """
    
    print("🛤️ Road 1: y = 3x")
    print("🛤️ Road 2: y = 2x + 3")
    print()
    
    # To find intersection, set the equations equal:
    # 3x = 2x + 3
    # 3x - 2x = 3
    # x = 3
    
    x_intersection = 3
    print(f"📐 Solving: 3x = 2x + 3")
    print(f"📐 Simplifying: 3x - 2x = 3")
    print(f"📐 Solution: x = {x_intersection}")
    
    # Find y-coordinate by substituting x into either equation
    y_intersection = 3 * x_intersection  # Using y = 3x
    print(f"📐 Substituting x = {x_intersection} into y = 3x")
    print(f"📐 y = 3 × {x_intersection} = {y_intersection}")
    
    # Verify with second equation
    y_verify = 2 * x_intersection + 3
    print(f"📐 Verification: y = 2 × {x_intersection} + 3 = {y_verify}")
    
    return (x_intersection, y_intersection)

def challenge4_intercepts():
    """
    Find the x and y intercepts for both lines
    """
    print("\n🎯 Finding Intercepts:")
    
    # Road 1: y = 3x
    print("\n🛤️ Road 1: y = 3x")
    print("   x-intercept: Set y = 0 → 0 = 3x → x = 0 → (0, 0)")
    print("   y-intercept: Set x = 0 → y = 3(0) = 0 → (0, 0)")
    
    # Road 2: y = 2x + 3
    print("\n🛤️ Road 2: y = 2x + 3")
    print("   x-intercept: Set y = 0 → 0 = 2x + 3 → x = -1.5 → (-1.5, 0)")
    print("   y-intercept: Set x = 0 → y = 2(0) + 3 = 3 → (0, 3)")
    
    return {
        'road1': {'x_intercept': (0, 0), 'y_intercept': (0, 0)},
        'road2': {'x_intercept': (-1.5, 0), 'y_intercept': (0, 3)}
    }

def challenge4_validation():
    """
    Validate the line intersection calculation
    """
    intersection = challenge4_line_intersection()
    intercepts = challenge4_intercepts()
    
    # The correct intersection should be (3, 9)
    expected_intersection = (3, 9)
    
    print(f"\n🎯 Calculated intersection: {intersection}")
    print(f"✅ Expected intersection: {expected_intersection}")
    print(f"🎉 Challenge {'PASSED' if intersection == expected_intersection else 'FAILED'}!")
    
    return intersection == expected_intersection

def ai_ml_connection():
    """
    Explain the AI/ML connection for line intersections
    """
    print("""
🧠 AI/ML Connection: Line Intersections
    
Line intersections are fundamental in machine learning:

1. 🎯 Optimization Problems:
   - Finding optimal solutions where multiple constraints meet
   - Linear programming uses intersection points for optimal solutions
   - Gradient descent finds intersections of gradient vectors

2. 📊 Classification Boundaries:
   - Decision boundaries often intersect to create complex regions
   - Support Vector Machines find optimal intersection points
   - Multiple classifiers combined at intersection points

3. 🧠 Neural Networks:
   - Activation functions create intersections between linear regions
   - Each neuron creates decision boundaries that intersect
   - Complex patterns emerge from simple linear intersections

4. 📈 Regression Analysis:
   - Multiple regression lines intersect at optimal predictions
   - Ensemble methods combine predictions at intersection points
   - Feature interactions create intersection effects

5. 🔍 Constraint Satisfaction:
   - Finding solutions that satisfy multiple constraints
   - Optimization algorithms search for feasible intersection points
   - Resource allocation problems solved at intersection points

6. 📊 Data Analysis:
   - Finding common patterns where different trends intersect
   - Anomaly detection identifies points outside normal intersections
   - Clustering finds intersection points of similar data groups

The intersection you calculated represents finding the optimal
point where two different systems meet - this is exactly what
ML algorithms do when combining multiple sources of information!
    """)

def road_visualization():
    """
    Visual representation of the roads and their intersection
    """
    print("""
🎨 Road Network Visualization:

Road 1 (y = 3x): Passes through origin, steep upward slope
Road 2 (y = 2x + 3): Starts at (0,3), moderate upward slope

Intersection Point: (3, 9)
- Both roads meet at this magical waypoint
- Travelers can switch between roads here
- Represents optimal decision point

Intercepts:
- Road 1: Both x and y intercepts at (0,0)
- Road 2: x-intercept at (-1.5,0), y-intercept at (0,3)

This intersection represents finding the optimal solution
where two different approaches meet in machine learning!
    """)

if __name__ == "__main__":
    print("🛤️ Challenge 4: Roads & Waypoints")
    print("=" * 50)
    print("Find the intersection point of two magical roads:")
    print("Road 1: y = 3x")
    print("Road 2: y = 2x + 3")
    print()
    
    road_visualization()
    print()
    
    # Run the challenge
    success = challenge4_validation()
    
    if success:
        print("\n🎉 Congratulations! You've mastered line intersections!")
        ai_ml_connection()
    else:
        print("\n💡 Hints:")
        print("1. Set the equations equal: 3x = 2x + 3")
        print("2. Solve for x")
        print("3. Substitute x back into either equation to find y")
        print("4. Verify by checking both equations give the same y-value")