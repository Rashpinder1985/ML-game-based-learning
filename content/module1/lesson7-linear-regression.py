# Lesson 7: Linear Regression - Your First ML Algorithm
# From mathematical foundations to practical implementation

import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

print("LINEAR REGRESSION FROM SCRATCH")
print("="*35)

# Generate synthetic data
np.random.seed(42)
n_samples = 100
X = np.linspace(0, 10, n_samples).reshape(-1, 1)
true_slope = 2.5
true_intercept = 1.0
noise = np.random.normal(0, 1, n_samples)
y = true_slope * X.ravel() + true_intercept + noise

print(f"Generated data:")
print(f"  Samples: {n_samples}")
print(f"  True slope: {true_slope}")
print(f"  True intercept: {true_intercept}")
print(f"  Noise level: {np.std(noise):.2f}")

# The mathematical foundation
print(f"\nMATHEMATICAL FOUNDATION")
print("-" * 25)
print("""
Linear regression finds the best line: y = mx + b

Goal: Minimize Sum of Squared Errors (SSE)
SSE = Σ(y_actual - y_predicted)²

Solution using calculus (Normal Equation):
slope = Σ(x-x̄)(y-ȳ) / Σ(x-x̄)²
intercept = ȳ - slope * x̄
""")

# Manual implementation
def linear_regression_manual(X, y):
    """Implement linear regression from scratch"""
    X_flat = X.ravel()

    # Calculate means
    x_mean = np.mean(X_flat)
    y_mean = np.mean(y)

    # Calculate slope and intercept
    numerator = np.sum((X_flat - x_mean) * (y - y_mean))
    denominator = np.sum((X_flat - x_mean) ** 2)
    slope = numerator / denominator
    intercept = y_mean - slope * x_mean

    return slope, intercept

# Fit our manual model
manual_slope, manual_intercept = linear_regression_manual(X, y)

print(f"\nMANUAL IMPLEMENTATION RESULTS:")
print(f"  Estimated slope: {manual_slope:.3f} (true: {true_slope})")
print(f"  Estimated intercept: {manual_intercept:.3f} (true: {true_intercept})")

# Matrix formulation: θ = (X'X)^(-1)X'y
print(f"\nMATRIX FORMULATION")
print("-" * 20)

# Add intercept column to X
X_matrix = np.column_stack([np.ones(len(X)), X.ravel()])
print(f"Design matrix X shape: {X_matrix.shape}")

# Normal equation
theta = np.linalg.inv(X_matrix.T @ X_matrix) @ X_matrix.T @ y
matrix_intercept, matrix_slope = theta

print(f"Matrix solution:")
print(f"  θ = [intercept, slope] = [{matrix_intercept:.3f}, {matrix_slope:.3f}]")

# Predictions and evaluation
y_pred_manual = manual_slope * X.ravel() + manual_intercept
mse_manual = np.mean((y - y_pred_manual) ** 2)
r2_manual = 1 - np.sum((y - y_pred_manual) ** 2) / np.sum((y - np.mean(y)) ** 2)

print(f"\nMODEL EVALUATION:")
print(f"  MSE: {mse_manual:.3f}")
print(f"  R²: {r2_manual:.3f}")
print(f"  RMSE: {np.sqrt(mse_manual):.3f}")

print(f"\n" + "="*50)
print("POLYNOMIAL REGRESSION")
print("="*50)

# Generate non-linear data
X_poly = np.linspace(0, 4, 100).reshape(-1, 1)
y_poly = 0.5 * X_poly.ravel()**3 - 2 * X_poly.ravel()**2 + 3 * X_poly.ravel() + 1
y_poly += np.random.normal(0, 2, len(X_poly))

print(f"Generated polynomial data with cubic relationship")

# Fit polynomial models of different degrees
degrees = [1, 2, 3, 4, 5]
results = {}

for degree in degrees:
    # Transform features
    poly_features = PolynomialFeatures(degree=degree)
    X_poly_transformed = poly_features.fit_transform(X_poly)

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_poly_transformed, y_poly, test_size=0.3, random_state=42
    )

    # Fit model
    model = LinearRegression()
    model.fit(X_train, y_train)

    # Evaluate
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)

    train_mse = mean_squared_error(y_train, y_pred_train)
    test_mse = mean_squared_error(y_test, y_pred_test)
    train_r2 = r2_score(y_train, y_pred_train)
    test_r2 = r2_score(y_test, y_pred_test)

    results[degree] = {
        'train_mse': train_mse,
        'test_mse': test_mse,
        'train_r2': train_r2,
        'test_r2': test_r2,
        'n_features': X_poly_transformed.shape[1]
    }

    print(f"\nDegree {degree} (features: {X_poly_transformed.shape[1]}):")
    print(f"  Train MSE: {train_mse:.2f}, R²: {train_r2:.3f}")
    print(f"  Test MSE:  {test_mse:.2f}, R²: {test_r2:.3f}")

# Find best model
best_degree = min(results.keys(), key=lambda d: results[d]['test_mse'])
print(f"\nBest model: Degree {best_degree} (lowest test MSE)")

print(f"\n" + "="*50)
print("BIAS-VARIANCE ANALYSIS")
print("="*50)

def bias_variance_analysis():
    """Demonstrate bias-variance tradeoff with polynomial regression"""

    # True function
    def true_function(x):
        return 0.5 * x**2 + 0.1 * x + 0.2

    X_true = np.linspace(0, 2, 50).reshape(-1, 1)
    y_true = true_function(X_true.ravel())

    degrees = [1, 3, 15]  # Underfit, good fit, overfit
    n_experiments = 100

    for degree in degrees:
        predictions_all = []

        for _ in range(n_experiments):
            # Generate noisy training data
            X_train = np.linspace(0, 2, 20).reshape(-1, 1)
            y_train = true_function(X_train.ravel()) + np.random.normal(0, 0.1, 20)

            # Fit model
            poly_features = PolynomialFeatures(degree=degree)
            X_train_poly = poly_features.fit_transform(X_train)
            X_test_poly = poly_features.fit_transform(X_true)

            model = LinearRegression()
            model.fit(X_train_poly, y_train)

            # Predict on test points
            y_pred = model.predict(X_test_poly)
            predictions_all.append(y_pred)

        predictions_all = np.array(predictions_all)

        # Calculate bias and variance
        mean_prediction = np.mean(predictions_all, axis=0)
        bias_squared = np.mean((mean_prediction - y_true) ** 2)
        variance = np.mean(np.var(predictions_all, axis=0))
        noise = 0.1 ** 2  # Known noise level

        total_error = bias_squared + variance + noise

        print(f"\nPolynomial degree {degree}:")
        print(f"  Bias²: {bias_squared:.4f}")
        print(f"  Variance: {variance:.4f}")
        print(f"  Noise: {noise:.4f}")
        print(f"  Total Error: {total_error:.4f}")

        # Interpretation
        if degree == 1:
            print("  → High bias (underfitting)")
        elif degree == 3:
            print("  → Good balance")
        else:
            print("  → High variance (overfitting)")

bias_variance_analysis()

print(f"\n" + "="*50)
print("REGULARIZATION TECHNIQUES")
print("="*50)

from sklearn.linear_model import Ridge, Lasso

# Generate data with many features (some irrelevant)
np.random.seed(42)
n_samples, n_features = 100, 50
X_reg = np.random.randn(n_samples, n_features)

# Only first 5 features are truly relevant
true_coefficients = np.zeros(n_features)
true_coefficients[:5] = [2, -1, 0.5, -0.5, 1.5]

y_reg = X_reg @ true_coefficients + np.random.normal(0, 0.1, n_samples)

X_train, X_test, y_train, y_test = train_test_split(X_reg, y_reg, test_size=0.3, random_state=42)

# Compare different regularization methods
models = {
    'Linear Regression': LinearRegression(),
    'Ridge (L2)': Ridge(alpha=1.0),
    'Lasso (L1)': Lasso(alpha=0.1)
}

print(f"Dataset: {n_samples} samples, {n_features} features")
print(f"True non-zero coefficients: {np.sum(true_coefficients != 0)}")

for name, model in models.items():
    model.fit(X_train, y_train)

    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)

    # Count non-zero coefficients
    if hasattr(model, 'coef_'):
        n_nonzero = np.sum(np.abs(model.coef_) > 1e-5)
    else:
        n_nonzero = n_features

    print(f"\n{name}:")
    print(f"  Train R²: {train_score:.3f}")
    print(f"  Test R²: {test_score:.3f}")
    print(f"  Non-zero coefficients: {n_nonzero}")

    if name == 'Lasso (L1)':
        print("  → Feature selection (some coefficients = 0)")
    elif name == 'Ridge (L2)':
        print("  → Shrinks coefficients toward 0")

print(f"\n" + "="*50)
print("KEY CONCEPTS SUMMARY")
print("="*50)

print("""
1. LINEAR REGRESSION FUNDAMENTALS
   • y = mx + b (simple) or y = Xθ + ε (matrix form)
   • Minimizes sum of squared errors
   • Closed-form solution via normal equation

2. POLYNOMIAL REGRESSION
   • Still linear in parameters!
   • Creates polynomial features: x, x², x³, ...
   • Can fit complex non-linear relationships

3. BIAS-VARIANCE TRADEOFF
   • Underfitting: High bias, low variance
   • Overfitting: Low bias, high variance
   • Goal: Find the sweet spot

4. REGULARIZATION
   • Ridge (L2): Shrinks coefficients
   • Lasso (L1): Feature selection
   • Prevents overfitting with many features

5. MODEL EVALUATION
   • R²: Proportion of variance explained
   • MSE: Mean squared error
   • Always use separate test set!

Linear regression is simple but powerful - it's the foundation
for understanding more complex ML algorithms!
""")