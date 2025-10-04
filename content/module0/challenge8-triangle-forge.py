"""
Challenge 8: Triangle Forge
Learning Goal: Centroid calculation
"""

def challenge8_centroid():
    """Find centroid of triangle with vertices (0,0), (3,0), (0,4)"""
    # Triangle vertices
    A = (0, 0)
    B = (3, 0) 
    C = (0, 4)
    
    # Centroid = ((x1+x2+x3)/3, (y1+y2+y3)/3)
    centroid_x = (A[0] + B[0] + C[0]) / 3
    centroid_y = (A[1] + B[1] + C[1]) / 3
    
    print(f"🔺 Triangle vertices: {A}, {B}, {C}")
    print(f"📍 Centroid: ({centroid_x}, {centroid_y})")
    
    return (centroid_x, centroid_y)

def ai_ml_connection():
    """AI/ML connection for centroids"""
    print("""
🧠 AI/ML Connection: Centroids
    
Centroids relate to machine learning:
- K-means clustering finds cluster centroids
- Centroids represent average data points
- Distance from centroid measures data similarity
- Used in unsupervised learning algorithms
    """)

if __name__ == "__main__":
    print("🔺 Challenge 8: Triangle Forge")
    centroid = challenge8_centroid()
    expected = (1, 4/3)  # (1, 1.33...)
    print(f"🎯 Result: {centroid} (Expected: {expected})")
    ai_ml_connection()