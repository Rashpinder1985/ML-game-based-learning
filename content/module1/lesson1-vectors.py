# Lesson 1: Introduction to Vectors
# Linear algebra forms the foundation of machine learning

import numpy as np
import matplotlib.pyplot as plt

# What are vectors?
# A vector is a quantity with both magnitude and direction
# In ML, we use vectors to represent features of data points

# Creating vectors in Python
vector_a = np.array([3, 4])
vector_b = np.array([1, 2])

print("Vector A:", vector_a)
print("Vector B:", vector_b)

# Vector operations
# Addition
vector_sum = vector_a + vector_b
print("\nVector Addition:")
print(f"{vector_a} + {vector_b} = {vector_sum}")

# Scalar multiplication
scalar = 2
scaled_vector = scalar * vector_a
print(f"\nScalar Multiplication:")
print(f"{scalar} * {vector_a} = {scaled_vector}")

# Dot product - crucial for ML algorithms
dot_product = np.dot(vector_a, vector_b)
print(f"\nDot Product:")
print(f"{vector_a} · {vector_b} = {dot_product}")

# Vector magnitude (length)
magnitude_a = np.linalg.norm(vector_a)
print(f"\nMagnitude of Vector A: {magnitude_a:.2f}")

# In machine learning context:
# - Each data sample can be represented as a vector
# - Features are the components of the vector
# - Similarity between samples can be measured using dot products

# Example: Representing a house as a vector
# Features: [square_feet, bedrooms, bathrooms, age]
house1 = np.array([2000, 3, 2, 5])
house2 = np.array([1500, 2, 1, 10])

print(f"\nHouse 1 features: {house1}")
print(f"House 2 features: {house2}")

# Similarity measure (dot product)
similarity = np.dot(house1, house2)
print(f"Similarity score: {similarity}")