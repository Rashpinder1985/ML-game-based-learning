# Lesson 3: Eigenvalues and Eigenvectors
# Understanding the "DNA" of matrices - crucial for PCA and many ML algorithms

import numpy as np
import matplotlib.pyplot as plt

# What are eigenvalues and eigenvectors?
# For a matrix A, if A*v = λ*v, then:
# v is an eigenvector and λ is the corresponding eigenvalue
# This means the matrix only stretches the vector, doesn't rotate it

# Simple 2x2 matrix example
A = np.array([[3, 1],
              [1, 3]])

print("Matrix A:")
print(A)

# Calculate eigenvalues and eigenvectors
eigenvalues, eigenvectors = np.linalg.eig(A)

print(f"\nEigenvalues: {eigenvalues}")
print(f"Eigenvectors:")
print(eigenvectors)

# Verification: A * v = λ * v
for i in range(len(eigenvalues)):
    v = eigenvectors[:, i]
    lambda_val = eigenvalues[i]

    left_side = np.dot(A, v)
    right_side = lambda_val * v

    print(f"\nEigenvector {i+1}: {v}")
    print(f"A * v = {left_side}")
    print(f"λ * v = {right_side}")
    print(f"Equal? {np.allclose(left_side, right_side)}")

# Why eigenvalues matter in ML:
# 1. Principal Component Analysis (PCA) - dimensionality reduction
# 2. Understanding data variance
# 3. Matrix decomposition
# 4. Stability of algorithms

# PCA example with 2D data
np.random.seed(42)
# Generate correlated data
mean = [0, 0]
cov = [[2, 1.5], [1.5, 2]]  # Covariance matrix
data = np.random.multivariate_normal(mean, cov, 100)

print(f"\nData shape: {data.shape}")
print(f"First 5 data points:")
print(data[:5])

# Calculate covariance matrix of the data
data_cov = np.cov(data.T)
print(f"\nData covariance matrix:")
print(data_cov)

# Find principal components (eigenvectors of covariance matrix)
pca_eigenvalues, pca_eigenvectors = np.linalg.eig(data_cov)

# Sort by eigenvalues (largest first)
idx = np.argsort(pca_eigenvalues)[::-1]
pca_eigenvalues = pca_eigenvalues[idx]
pca_eigenvectors = pca_eigenvectors[:, idx]

print(f"\nPCA Eigenvalues (variance explained): {pca_eigenvalues}")
print(f"PCA Eigenvectors (principal components):")
print(pca_eigenvectors)

# The first principal component explains most variance
total_variance = np.sum(pca_eigenvalues)
variance_explained = pca_eigenvalues / total_variance

print(f"\nVariance explained by each component:")
for i, var in enumerate(variance_explained):
    print(f"PC{i+1}: {var:.2%}")

# Project data onto first principal component
first_pc = pca_eigenvectors[:, 0]
projected_data = np.dot(data, first_pc)

print(f"\nOriginal data had 2 dimensions")
print(f"Projected data has 1 dimension: {projected_data.shape}")
print(f"We retained {variance_explained[0]:.1%} of the variance!")

# This is the foundation of dimensionality reduction in ML