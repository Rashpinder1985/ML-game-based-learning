# Lesson 8: Gradient Descent - The Optimization Engine of ML
# Understanding how machines learn through iterative improvement

import numpy as np
import matplotlib.pyplot as plt

print("GRADIENT DESCENT FUNDAMENTALS")
print("="*35)

# What is gradient descent?
print("""
Gradient Descent is an optimization algorithm that:
1. Starts with random parameters
2. Calculates how wrong the predictions are (loss)
3. Computes the gradient (slope) of the loss
4. Takes a step in the opposite direction
5. Repeats until convergence

Mathematical intuition:
- Gradient points uphill (steepest increase)
- We want to go downhill (minimize loss)
- So we move opposite to the gradient
""")

# Simple 1D example: minimize f(x) = (x-3)²
def simple_function(x):
    return (x - 3) ** 2

def simple_gradient(x):
    return 2 * (x - 3)

print(f"\nSIMPLE EXAMPLE: Minimize f(x) = (x-3)²")
print("Minimum should be at x = 3")

# Gradient descent implementation
x = 0.0  # Starting point
learning_rate = 0.1
history = [x]

print(f"\nGradient Descent Steps:")
print(f"{'Step':>4} {'x':>8} {'f(x)':>8} {'gradient':>10}")
print("-" * 35)

for step in range(10):
    grad = simple_gradient(x)
    x = x - learning_rate * grad  # Update rule
    history.append(x)

    print(f"{step+1:4d} {x:8.3f} {simple_function(x):8.3f} {grad:10.3f}")

print(f"\nFinal result: x = {x:.3f} (true minimum: 3.0)")

print(f"\n" + "="*50)
print("GRADIENT DESCENT FOR LINEAR REGRESSION")
print("="*50)

# Generate sample data
np.random.seed(42)
n_samples = 100
X = np.random.randn(n_samples, 1)
y = 2.5 * X.ravel() + 1.0 + 0.5 * np.random.randn(n_samples)  # y = 2.5x + 1 + noise

print(f"Dataset: {n_samples} samples")
print(f"True parameters: slope=2.5, intercept=1.0")

# Cost function: Mean Squared Error
def compute_cost(X, y, theta):
    m = len(y)
    predictions = X @ theta
    cost = (1 / (2 * m)) * np.sum((predictions - y) ** 2)
    return cost

# Gradient computation
def compute_gradient(X, y, theta):
    m = len(y)
    predictions = X @ theta
    gradient = (1 / m) * X.T @ (predictions - y)
    return gradient

# Prepare data (add intercept term)
X_with_intercept = np.column_stack([np.ones(len(X)), X.ravel()])

# Initialize parameters
theta = np.random.randn(2)  # [intercept, slope]
learning_rate = 0.01
n_iterations = 1000

# Track progress
cost_history = []
theta_history = [theta.copy()]

print(f"\nInitial parameters: intercept={theta[0]:.3f}, slope={theta[1]:.3f}")
print(f"Initial cost: {compute_cost(X_with_intercept, y, theta):.3f}")

# Gradient descent loop
for i in range(n_iterations):
    cost = compute_cost(X_with_intercept, y, theta)
    gradient = compute_gradient(X_with_intercept, y, theta)

    theta = theta - learning_rate * gradient

    cost_history.append(cost)
    theta_history.append(theta.copy())

    if i % 100 == 0:
        print(f"Iteration {i:4d}: Cost = {cost:.6f}, θ = [{theta[0]:.3f}, {theta[1]:.3f}]")

print(f"\nFinal parameters: intercept={theta[0]:.3f}, slope={theta[1]:.3f}")
print(f"Final cost: {cost_history[-1]:.6f}")

# Compare with analytical solution
X_matrix = X_with_intercept
theta_analytical = np.linalg.inv(X_matrix.T @ X_matrix) @ X_matrix.T @ y
print(f"Analytical solution: intercept={theta_analytical[0]:.3f}, slope={theta_analytical[1]:.3f}")

print(f"\n" + "="*50)
print("DIFFERENT TYPES OF GRADIENT DESCENT")
print("="*50)

def compare_gradient_descent_types():
    """Compare batch, stochastic, and mini-batch gradient descent"""

    # Generate larger dataset
    np.random.seed(42)
    n_samples = 1000
    X_large = np.random.randn(n_samples, 1)
    y_large = 3 * X_large.ravel() + 2 + 0.3 * np.random.randn(n_samples)
    X_large_with_intercept = np.column_stack([np.ones(len(X_large)), X_large.ravel()])

    print(f"Dataset size: {n_samples} samples")

    # 1. Batch Gradient Descent
    def batch_gd(X, y, learning_rate=0.01, n_iterations=100):
        theta = np.random.randn(2)
        costs = []

        for i in range(n_iterations):
            cost = compute_cost(X, y, theta)
            gradient = compute_gradient(X, y, theta)
            theta = theta - learning_rate * gradient
            costs.append(cost)

        return theta, costs

    # 2. Stochastic Gradient Descent
    def stochastic_gd(X, y, learning_rate=0.01, n_epochs=10):
        theta = np.random.randn(2)
        costs = []
        m = len(y)

        for epoch in range(n_epochs):
            # Shuffle data
            indices = np.random.permutation(m)
            X_shuffled = X[indices]
            y_shuffled = y[indices]

            for i in range(m):
                xi = X_shuffled[i:i+1]
                yi = y_shuffled[i:i+1]

                cost = compute_cost(xi, yi, theta)
                gradient = compute_gradient(xi, yi, theta)
                theta = theta - learning_rate * gradient

                if i % 100 == 0:  # Record cost periodically
                    full_cost = compute_cost(X, y, theta)
                    costs.append(full_cost)

        return theta, costs

    # 3. Mini-batch Gradient Descent
    def mini_batch_gd(X, y, learning_rate=0.01, n_epochs=10, batch_size=32):
        theta = np.random.randn(2)
        costs = []
        m = len(y)

        for epoch in range(n_epochs):
            # Shuffle data
            indices = np.random.permutation(m)
            X_shuffled = X[indices]
            y_shuffled = y[indices]

            for i in range(0, m, batch_size):
                end_idx = min(i + batch_size, m)
                X_batch = X_shuffled[i:end_idx]
                y_batch = y_shuffled[i:end_idx]

                cost = compute_cost(X_batch, y_batch, theta)
                gradient = compute_gradient(X_batch, y_batch, theta)
                theta = theta - learning_rate * gradient

                if i % (batch_size * 10) == 0:  # Record cost periodically
                    full_cost = compute_cost(X, y, theta)
                    costs.append(full_cost)

        return theta, costs

    # Run all three methods
    theta_batch, costs_batch = batch_gd(X_large_with_intercept, y_large)
    theta_sgd, costs_sgd = stochastic_gd(X_large_with_intercept, y_large)
    theta_mini, costs_mini = mini_batch_gd(X_large_with_intercept, y_large)

    print(f"\nResults comparison:")
    print(f"Batch GD:      θ = [{theta_batch[0]:.3f}, {theta_batch[1]:.3f}]")
    print(f"Stochastic GD: θ = [{theta_sgd[0]:.3f}, {theta_sgd[1]:.3f}]")
    print(f"Mini-batch GD: θ = [{theta_mini[0]:.3f}, {theta_mini[1]:.3f}]")

    print(f"\nCharacteristics:")
    print(f"Batch GD:      Smooth convergence, slow for large datasets")
    print(f"Stochastic GD: Noisy but fast, good for online learning")
    print(f"Mini-batch GD: Good balance, most commonly used")

compare_gradient_descent_types()

print(f"\n" + "="*50)
print("LEARNING RATE EFFECTS")
print("="*50)

def learning_rate_comparison():
    """Show effect of different learning rates"""

    learning_rates = [0.001, 0.01, 0.1, 0.5]

    for lr in learning_rates:
        theta = np.array([0.0, 0.0])  # Reset parameters
        costs = []

        for i in range(100):
            cost = compute_cost(X_with_intercept, y, theta)
            gradient = compute_gradient(X_with_intercept, y, theta)
            theta = theta - lr * gradient
            costs.append(cost)

            # Check for divergence
            if cost > 100:
                print(f"LR = {lr:5.3f}: DIVERGED at iteration {i}")
                break
        else:
            final_cost = costs[-1]
            print(f"LR = {lr:5.3f}: Final cost = {final_cost:.6f}, θ = [{theta[0]:.3f}, {theta[1]:.3f}]")

    print(f"\nLearning Rate Guidelines:")
    print(f"• Too small: Slow convergence")
    print(f"• Too large: Oscillation or divergence")
    print(f"• Just right: Smooth, fast convergence")

learning_rate_comparison()

print(f"\n" + "="*50)
print("ADVANCED OPTIMIZATION TECHNIQUES")
print("="*50)

def momentum_gradient_descent():
    """Implement gradient descent with momentum"""

    print("GRADIENT DESCENT WITH MOMENTUM")
    print("-" * 35)

    theta = np.array([0.0, 0.0])
    velocity = np.array([0.0, 0.0])
    learning_rate = 0.01
    momentum = 0.9
    costs = []

    for i in range(200):
        cost = compute_cost(X_with_intercept, y, theta)
        gradient = compute_gradient(X_with_intercept, y, theta)

        # Momentum update
        velocity = momentum * velocity - learning_rate * gradient
        theta = theta + velocity

        costs.append(cost)

        if i % 50 == 0:
            print(f"Iteration {i:3d}: Cost = {cost:.6f}")

    print(f"Final: θ = [{theta[0]:.3f}, {theta[1]:.3f}]")
    print(f"Momentum helps accelerate convergence and reduces oscillations")

momentum_gradient_descent()

print(f"\n" + "="*50)
print("FEATURE SCALING IMPORTANCE")
print("="*50)

def demonstrate_feature_scaling():
    """Show why feature scaling matters for gradient descent"""

    # Create data with very different scales
    np.random.seed(42)
    n_samples = 100

    # Feature 1: Small scale (0-1)
    X1 = np.random.uniform(0, 1, n_samples)

    # Feature 2: Large scale (1000-2000)
    X2 = np.random.uniform(1000, 2000, n_samples)

    # Target variable
    y_scaled = 2 * X1 + 0.001 * X2 + np.random.normal(0, 0.1, n_samples)

    # Prepare features
    X_unscaled = np.column_stack([np.ones(n_samples), X1, X2])
    X_scaled = np.column_stack([
        np.ones(n_samples),
        (X1 - np.mean(X1)) / np.std(X1),  # Standardize X1
        (X2 - np.mean(X2)) / np.std(X2)   # Standardize X2
    ])

    print(f"Feature ranges:")
    print(f"X1: [{np.min(X1):.3f}, {np.max(X1):.3f}]")
    print(f"X2: [{np.min(X2):.3f}, {np.max(X2):.3f}]")

    # Compare convergence
    def run_gd(X, y, name, learning_rate=0.01, n_iterations=1000):
        theta = np.random.randn(3)
        costs = []

        for i in range(n_iterations):
            cost = compute_cost(X, y, theta)
            gradient = compute_gradient(X, y, theta)
            theta = theta - learning_rate * gradient
            costs.append(cost)

        return theta, costs

    # Without scaling
    try:
        theta_unscaled, costs_unscaled = run_gd(X_unscaled, y_scaled, "Unscaled", 0.0001)
        print(f"\nWithout scaling (LR=0.0001): Final cost = {costs_unscaled[-1]:.6f}")
    except:
        print(f"\nWithout scaling: DIVERGED (features have very different scales)")

    # With scaling
    theta_scaled, costs_scaled = run_gd(X_scaled, y_scaled, "Scaled", 0.01)
    print(f"With scaling (LR=0.01): Final cost = {costs_scaled[-1]:.6f}")

    print(f"\nFeature scaling makes gradient descent:")
    print(f"• Converge faster")
    print(f"• More stable")
    print(f"• Less sensitive to learning rate choice")

demonstrate_feature_scaling()

print(f"\n" + "="*50)
print("KEY TAKEAWAYS")
print("="*50)

print("""
1. GRADIENT DESCENT IS THE WORKHORSE OF ML
   • Used in linear regression, neural networks, deep learning
   • Iterative optimization: start random, improve gradually

2. THREE MAIN VARIANTS
   • Batch: Uses all data, stable but slow
   • Stochastic: Uses one sample, fast but noisy
   • Mini-batch: Best of both worlds

3. HYPERPARAMETERS MATTER
   • Learning rate: Too small = slow, too large = divergence
   • Momentum: Helps acceleration and stability
   • Batch size: Affects convergence and memory usage

4. PREPROCESSING IS CRUCIAL
   • Feature scaling prevents convergence issues
   • Different scales can break gradient descent

5. BEYOND BASIC GD
   • Adam, RMSprop, AdaGrad: Adaptive learning rates
   • Used in modern deep learning frameworks

Gradient descent is how machines learn - by taking small
steps toward better solutions!
""")