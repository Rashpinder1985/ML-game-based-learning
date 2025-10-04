"""
Challenge 1: Journey Between Towns
Learning Goal: Distance calculation without formulas
"""

def challenge1_distance_calculation():
    """
    Calculate the distance between Mathville (3, 4) and Calmville (0, 0)
    
    This challenge introduces the concept of distance calculation which forms
    the foundation of similarity measures in machine learning.
    
    Returns:
        float: The distance between the two towns
    """
    
    # Starting point: Mathville at coordinates (3, 4)
    mathville_x, mathville_y = 3, 4
    
    # Destination: Calmville at coordinates (0, 0)
    calmville_x, calmville_y = 0, 0
    
    # Calculate horizontal distance
    horizontal_distance = mathville_x - calmville_x  # 3 - 0 = 3
    
    # Calculate vertical distance  
    vertical_distance = mathville_y - calmville_y    # 4 - 0 = 4
    
    # Use Pythagorean theorem: distance = √(horizontal² + vertical²)
    distance = (horizontal_distance**2 + vertical_distance**2)**0.5
    
    return distance

def challenge1_validation():
    """
    Validate the distance calculation
    """
    distance = challenge1_distance_calculation()
    
    # The correct answer should be √(3² + 4²) = √(9 + 16) = √25 = 5
    expected_distance = 5.0
    
    print(f"🎯 Calculated distance: {distance}")
    print(f"✅ Expected distance: {expected_distance}")
    print(f"🎉 Challenge {'PASSED' if abs(distance - expected_distance) < 0.01 else 'FAILED'}!")
    
    return abs(distance - expected_distance) < 0.01

def ai_ml_connection():
    """
    Explain the AI/ML connection for distance calculations
    """
    print("""
🧠 AI/ML Connection: Distance Calculations
    
Distance calculations are fundamental in machine learning:

1. 📏 Similarity Measures: 
   - K-Nearest Neighbors (KNN) uses distance to find similar data points
   - Clustering algorithms group points based on distance

2. 🎯 Recommendation Systems:
   - Calculate "distance" between user preferences
   - Find users with similar tastes

3. 📊 Data Preprocessing:
   - Normalize features using distance-based scaling
   - Detect outliers using distance from cluster centers

4. 🎨 Image Recognition:
   - Compare pixel values using distance metrics
   - Face recognition uses facial feature distances

5. 🔍 Search Engines:
   - Rank documents by "distance" from search query
   - Semantic similarity uses vector distance

The distance formula you just used becomes the foundation for
understanding how ML algorithms measure "closeness" between data points!
    """)

if __name__ == "__main__":
    print("🗺️ Challenge 1: Journey Between Towns")
    print("=" * 50)
    print("Calculate the distance between Mathville (3, 4) and Calmville (0, 0)")
    print()
    
    # Run the challenge
    success = challenge1_validation()
    
    if success:
        print("\n🎉 Congratulations! You've mastered distance calculation!")
        ai_ml_connection()
    else:
        print("\n💡 Hint: Use the Pythagorean theorem: a² + b² = c²")