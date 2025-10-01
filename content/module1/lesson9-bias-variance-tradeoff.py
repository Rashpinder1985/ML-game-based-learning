# Lesson 9: Bias-Variance Tradeoff - The Fundamental ML Challenge
# Understanding the core tradeoff in machine learning model selection

import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error

print("THE BIAS-VARIANCE TRADEOFF")
print("="*30)

print("""
Every ML model faces a fundamental tradeoff:

BIAS: Error from oversimplified assumptions
• High bias = underfitting
• Model is too simple to capture true pattern
• Example: Linear model for non-linear data

VARIANCE: Error from sensitivity to small fluctuations
• High variance = overfitting
• Model memorizes training noise
• Example: Very deep tree on small dataset

IRREDUCIBLE ERROR: Inherent noise in data
• Cannot be reduced by any model
• Represents fundamental uncertainty

Total Error = Bias² + Variance + Irreducible Error
""")

print("="*50)
print("BIAS-VARIANCE DECOMPOSITION EXPERIMENT")
print("="*50)

def true_function(x):
    """The true underlying function we're trying to learn"""
    return 1.5 * x**2 + 0.5 * x + 0.2 * np.sin(15 * x)

def generate_dataset(n_samples=50, noise_std=0.3, x_range=(0, 1)):
    """Generate training data with noise"""
    np.random.seed(None)  # Different seed each time
    X = np.random.uniform(x_range[0], x_range[1], n_samples)
    y = true_function(X) + np.random.normal(0, noise_std, n_samples)
    return X.reshape(-1, 1), y

def bias_variance_analysis(model, model_name, n_experiments=100):
    """Analyze bias and variance of a model"""

    # Test points where we'll evaluate predictions
    X_test = np.linspace(0, 1, 50).reshape(-1, 1)
    y_test_true = true_function(X_test.ravel())

    # Store predictions from multiple experiments
    predictions = []

    print(f"\nAnalyzing {model_name}...")
    print(f"Running {n_experiments} experiments...")

    for experiment in range(n_experiments):
        # Generate new training data
        X_train, y_train = generate_dataset()

        # Clone and fit model
        model_copy = type(model)(**model.get_params()) if hasattr(model, 'get_params') else type(model)()

        try:
            model_copy.fit(X_train, y_train)
            y_pred = model_copy.predict(X_test)
            predictions.append(y_pred)
        except:
            # Handle cases where model fails to fit
            predictions.append(np.full(len(X_test), np.mean(y_train)))

        if (experiment + 1) % 25 == 0:
            print(f"  Completed {experiment + 1}/{n_experiments} experiments")

    predictions = np.array(predictions)

    # Calculate bias and variance
    mean_prediction = np.mean(predictions, axis=0)
    bias_squared = np.mean((mean_prediction - y_test_true) ** 2)
    variance = np.mean(np.var(predictions, axis=0))

    # Estimate noise (irreducible error)
    noise = 0.3 ** 2  # We know the true noise level

    total_error = bias_squared + variance + noise

    return {
        'model_name': model_name,
        'bias_squared': bias_squared,
        'variance': variance,
        'noise': noise,
        'total_error': total_error,
        'predictions': predictions,
        'mean_prediction': mean_prediction
    }

# Test different models
models_to_test = [
    (LinearRegression(), "Linear Regression"),
    (PolynomialFeatures(2), "Polynomial Degree 2"),
    (PolynomialFeatures(8), "Polynomial Degree 8"),
    (DecisionTreeRegressor(max_depth=3, random_state=42), "Decision Tree (depth=3)"),
    (DecisionTreeRegressor(random_state=42), "Decision Tree (unlimited)"),
    (RandomForestRegressor(n_estimators=10, random_state=42), "Random Forest"),
]

results = []

# Special handling for polynomial features
for model, name in models_to_test:
    if isinstance(model, PolynomialFeatures):
        degree = model.degree

        def polynomial_model_fit(X_train, y_train, X_test, degree=degree):
            poly_features = PolynomialFeatures(degree=degree)
            X_train_poly = poly_features.fit_transform(X_train)
            X_test_poly = poly_features.transform(X_test)

            reg = LinearRegression()
            reg.fit(X_train_poly, y_train)
            return reg.predict(X_test_poly)

        # Custom analysis for polynomial models
        X_test = np.linspace(0, 1, 50).reshape(-1, 1)
        y_test_true = true_function(X_test.ravel())
        predictions = []

        for experiment in range(100):
            X_train, y_train = generate_dataset()
            try:
                y_pred = polynomial_model_fit(X_train, y_train, X_test, degree)
                predictions.append(y_pred)
            except:
                predictions.append(np.full(len(X_test), np.mean(y_train)))

        predictions = np.array(predictions)
        mean_prediction = np.mean(predictions, axis=0)
        bias_squared = np.mean((mean_prediction - y_test_true) ** 2)
        variance = np.mean(np.var(predictions, axis=0))
        noise = 0.3 ** 2
        total_error = bias_squared + variance + noise

        result = {
            'model_name': name,
            'bias_squared': bias_squared,
            'variance': variance,
            'noise': noise,
            'total_error': total_error
        }
        results.append(result)
    else:
        result = bias_variance_analysis(model, name)
        results.append(result)

# Display results
print(f"\n" + "="*70)
print("BIAS-VARIANCE DECOMPOSITION RESULTS")
print("="*70)
print(f"{'Model':<25} {'Bias²':<8} {'Variance':<10} {'Noise':<8} {'Total':<8}")
print("-" * 70)

for result in results:
    print(f"{result['model_name']:<25} {result['bias_squared']:<8.4f} "
          f"{result['variance']:<10.4f} {result['noise']:<8.4f} "
          f"{result['total_error']:<8.4f}")

print(f"\n" + "="*50)
print("INTERPRETING THE RESULTS")
print("="*50)

# Find best and worst models
best_model = min(results, key=lambda x: x['total_error'])
worst_model = max(results, key=lambda x: x['total_error'])

print(f"\nBest performing model: {best_model['model_name']}")
print(f"  Total Error: {best_model['total_error']:.4f}")
print(f"  Breakdown: Bias²={best_model['bias_squared']:.4f}, "
      f"Variance={best_model['variance']:.4f}, Noise={best_model['noise']:.4f}")

print(f"\nWorst performing model: {worst_model['model_name']}")
print(f"  Total Error: {worst_model['total_error']:.4f}")
print(f"  Breakdown: Bias²={worst_model['bias_squared']:.4f}, "
      f"Variance={worst_model['variance']:.4f}, Noise={worst_model['noise']:.4f}")

# Categorize models
high_bias_models = [r for r in results if r['bias_squared'] > 0.1]
high_variance_models = [r for r in results if r['variance'] > 0.05]

if high_bias_models:
    print(f"\nHigh Bias (Underfitting) Models:")
    for model in high_bias_models:
        print(f"  - {model['model_name']}: Bias² = {model['bias_squared']:.4f}")
    print("  → These models are too simple to capture the true pattern")

if high_variance_models:
    print(f"\nHigh Variance (Overfitting) Models:")
    for model in high_variance_models:
        print(f"  - {model['model_name']}: Variance = {model['variance']:.4f}")
    print("  → These models are too sensitive to training data noise")

print(f"\n" + "="*50)
print("REGULARIZATION EFFECTS")
print("="*50)

def regularization_analysis():
    """Show how regularization affects bias-variance tradeoff"""

    # Generate polynomial features dataset
    X_train_orig, y_train_orig = generate_dataset(n_samples=30)
    X_test = np.linspace(0, 1, 50).reshape(-1, 1)
    y_test_true = true_function(X_test.ravel())

    # Test different regularization strengths
    alphas = [0, 0.01, 0.1, 1.0, 10.0]
    degree = 8  # High degree polynomial

    print(f"Regularization Analysis (Polynomial degree {degree})")
    print(f"{'Alpha':<8} {'Bias²':<8} {'Variance':<10} {'Total Error':<12}")
    print("-" * 45)

    for alpha in alphas:
        predictions = []

        for experiment in range(100):
            X_train, y_train = generate_dataset(n_samples=30)

            # Create polynomial features
            poly = PolynomialFeatures(degree=degree)
            X_train_poly = poly.fit_transform(X_train)
            X_test_poly = poly.transform(X_test)

            # Fit Ridge regression
            if alpha == 0:
                model = LinearRegression()
            else:
                model = Ridge(alpha=alpha)

            try:
                model.fit(X_train_poly, y_train)
                y_pred = model.predict(X_test_poly)
                predictions.append(y_pred)
            except:
                predictions.append(np.full(len(X_test), np.mean(y_train)))

        predictions = np.array(predictions)
        mean_prediction = np.mean(predictions, axis=0)
        bias_squared = np.mean((mean_prediction - y_test_true) ** 2)
        variance = np.mean(np.var(predictions, axis=0))
        total_error = bias_squared + variance + 0.3**2

        print(f"{alpha:<8} {bias_squared:<8.4f} {variance:<10.4f} {total_error:<12.4f}")

regularization_analysis()

print(f"\n" + "="*50)
print("PRACTICAL IMPLICATIONS")
print("="*50)

def practical_guidelines():
    """Provide practical guidance for model selection"""

    print("""
🎯 DIAGNOSING YOUR MODEL:

HIGH BIAS (Underfitting) Signs:
• Poor performance on training data
• Poor performance on validation data
• Training and validation errors are similar
• Model predictions look too simple/smooth

Solutions:
• Increase model complexity
• Add more features
• Reduce regularization
• Use ensemble methods

HIGH VARIANCE (Overfitting) Signs:
• Excellent performance on training data
• Poor performance on validation data
• Large gap between training and validation error
• Model predictions are erratic/jagged

Solutions:
• Simplify the model
• Get more training data
• Increase regularization
• Use cross-validation
• Feature selection

🎯 CHOOSING THE RIGHT MODEL COMPLEXITY:

1. Start Simple: Begin with simple models
2. Gradually Increase: Add complexity incrementally
3. Use Validation: Always use separate validation data
4. Cross-Validate: Use k-fold cross-validation
5. Plot Learning Curves: Visualize bias-variance

🎯 THE SWEET SPOT:

The best model minimizes TOTAL ERROR, not just bias or variance.
Sometimes a bit more bias is worth much less variance!
""")

practical_guidelines()

print(f"\n" + "="*50)
print("LEARNING CURVES ANALYSIS")
print("="*50)

def generate_learning_curves():
    """Generate learning curves to diagnose bias-variance"""

    # Generate a larger dataset
    np.random.seed(42)
    X_large = np.random.uniform(0, 1, 500).reshape(-1, 1)
    y_large = true_function(X_large.ravel()) + np.random.normal(0, 0.3, 500)

    # Split into train and validation
    X_train_full, X_val, y_train_full, y_val = train_test_split(
        X_large, y_large, test_size=0.3, random_state=42
    )

    # Different training set sizes
    train_sizes = [10, 20, 50, 100, 200, len(X_train_full)]

    models_to_test = [
        (LinearRegression(), "Linear (High Bias)"),
        (DecisionTreeRegressor(max_depth=3, random_state=42), "Tree depth=3 (Balanced)"),
        (DecisionTreeRegressor(random_state=42), "Tree unlimited (High Variance)")
    ]

    print("Learning Curves Analysis:")
    print("-" * 50)

    for model, name in models_to_test:
        print(f"\n{name}:")
        print(f"{'Size':<6} {'Train MSE':<12} {'Val MSE':<12} {'Gap':<12}")
        print("-" * 50)

        for size in train_sizes:
            X_train = X_train_full[:size]
            y_train = y_train_full[:size]

            model_copy = type(model)(**model.get_params()) if hasattr(model, 'get_params') else type(model)()
            model_copy.fit(X_train, y_train)

            train_pred = model_copy.predict(X_train)
            val_pred = model_copy.predict(X_val)

            train_mse = mean_squared_error(y_train, train_pred)
            val_mse = mean_squared_error(y_val, val_pred)
            gap = val_mse - train_mse

            print(f"{size:<6} {train_mse:<12.4f} {val_mse:<12.4f} {gap:<12.4f}")

generate_learning_curves()

print(f"\n" + "="*50)
print("KEY TAKEAWAYS")
print("="*50)

print("""
🎯 THE FUNDAMENTAL TRADEOFF:
• You cannot reduce bias and variance simultaneously
• The best model balances both for minimum total error
• More data helps reduce variance but not bias

🎯 MODEL SELECTION STRATEGY:
1. Start with simple models (high bias, low variance)
2. Gradually increase complexity
3. Use validation data to find the sweet spot
4. Consider regularization to control variance

🎯 DIAGNOSTIC TOOLS:
• Learning curves: Plot training vs validation error
• Cross-validation: Get robust estimates
• Bias-variance decomposition: Understand error sources

🎯 REAL-WORLD IMPLICATIONS:
• Deep learning: Very low bias but needs lots of data
• Linear models: Higher bias but work with less data
• Ensemble methods: Often achieve good bias-variance balance
• Regularization: Explicit bias-variance control

🎯 REMEMBER:
"All models are wrong, but some are useful"
The goal is not perfect accuracy, but useful predictions!

The bias-variance tradeoff is the heart of ML model selection.
Understanding it will make you a better machine learning practitioner!
""")