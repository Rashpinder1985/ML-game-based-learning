# Lesson 2: Matrices - The Building Blocks of ML
# Matrices are fundamental to understanding how ML algorithms work

import numpy as np

# What are matrices?
# A matrix is a rectangular array of numbers arranged in rows and columns
# In ML, matrices represent datasets and transformations

# Creating matrices
matrix_A = np.array([[1, 2, 3],
                    [4, 5, 6]])
matrix_B = np.array([[7, 8],
                    [9, 10],
                    [11, 12]])

print("Matrix A (2x3):")
print(matrix_A)
print("\nMatrix B (3x2):")
print(matrix_B)

# Matrix dimensions
print(f"\nMatrix A shape: {matrix_A.shape}")
print(f"Matrix B shape: {matrix_B.shape}")

# Matrix multiplication - core of neural networks
result = np.dot(matrix_A, matrix_B)
print(f"\nMatrix Multiplication A × B:")
print(result)

# Identity matrix - like the number 1 for matrices
identity = np.eye(3)
print(f"\n3x3 Identity Matrix:")
print(identity)

# Matrix transpose - flipping rows and columns
transpose_A = matrix_A.T
print(f"\nTranspose of Matrix A:")
print(transpose_A)

# Real ML example: Dataset as a matrix
# Each row is a sample, each column is a feature
dataset = np.array([
    [1400, 2, 1, 8],    # House 1: sqft, bedrooms, bathrooms, age
    [1600, 3, 2, 5],    # House 2
    [1200, 2, 1, 12],   # House 3
    [2000, 4, 3, 2],    # House 4
    [1800, 3, 2, 7]     # House 5
])

print(f"\nDataset Matrix (5 houses × 4 features):")
print(dataset)
print(f"Dataset shape: {dataset.shape}")

# Feature extraction
square_feet = dataset[:, 0]  # First column
bedrooms = dataset[:, 1]     # Second column

print(f"\nSquare feet of all houses: {square_feet}")
print(f"Bedrooms in all houses: {bedrooms}")

# Matrix operations in ML:
# 1. Data storage and manipulation
# 2. Linear transformations
# 3. Weight matrices in neural networks
# 4. Computing predictions: y = X × w (features × weights)

# Simple prediction example
weights = np.array([0.1, 50000, 25000, -500])  # Price per: sqft, bedroom, bathroom, -age
predictions = np.dot(dataset, weights)

print(f"\nPredicted house prices:")
for i, price in enumerate(predictions):
    print(f"House {i+1}: ${price:,.2f}")