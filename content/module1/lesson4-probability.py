# Lesson 4: Probability and Distributions
# The mathematical foundation of uncertainty in machine learning

import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

# Probability basics
# Probability measures uncertainty: P(event) = favorable outcomes / total outcomes

# Example: Coin flips
def simulate_coin_flips(n_flips):
    """Simulate coin flips and calculate probability of heads"""
    flips = np.random.choice(['H', 'T'], size=n_flips)
    prob_heads = np.sum(flips == 'H') / n_flips
    return prob_heads, flips

# Law of Large Numbers
flip_counts = [10, 100, 1000, 10000]
for n in flip_counts:
    prob, _ = simulate_coin_flips(n)
    print(f"With {n:5d} flips: P(Heads) = {prob:.3f}")

print("\nAs n increases, probability approaches 0.5 (theoretical value)")

# Probability distributions in ML
print("\n" + "="*50)
print("PROBABILITY DISTRIBUTIONS IN ML")
print("="*50)

# 1. Normal (Gaussian) Distribution - most important in ML
mu, sigma = 0, 1  # mean and standard deviation
normal_data = np.random.normal(mu, sigma, 1000)

print(f"\nNormal Distribution (μ={mu}, σ={sigma}):")
print(f"Sample mean: {np.mean(normal_data):.3f}")
print(f"Sample std: {np.std(normal_data):.3f}")

# 2. Bernoulli Distribution - for binary outcomes
p = 0.3  # probability of success
bernoulli_data = np.random.binomial(1, p, 1000)
print(f"\nBernoulli Distribution (p={p}):")
print(f"Success rate: {np.mean(bernoulli_data):.3f}")

# 3. Uniform Distribution - all outcomes equally likely
uniform_data = np.random.uniform(0, 1, 1000)
print(f"\nUniform Distribution [0,1]:")
print(f"Mean: {np.mean(uniform_data):.3f} (should be ~0.5)")

# Central concepts for ML:

# 1. Expected Value (Mean)
def expected_value_demo():
    """Demonstrate expected value with dice rolls"""
    dice_outcomes = np.arange(1, 7)  # 1,2,3,4,5,6
    probabilities = np.ones(6) / 6   # Equal probability

    expected_val = np.sum(dice_outcomes * probabilities)
    print(f"\nDice Expected Value: {expected_val:.2f}")

    # Simulate many rolls
    simulated_rolls = np.random.choice(dice_outcomes, 10000)
    simulated_mean = np.mean(simulated_rolls)
    print(f"Simulated average: {simulated_mean:.2f}")

expected_value_demo()

# 2. Variance and Standard Deviation
def variance_demo():
    """Show how variance measures spread"""
    low_var_data = np.random.normal(0, 0.5, 1000)   # Low variance
    high_var_data = np.random.normal(0, 2.0, 1000)  # High variance

    print(f"\nVariance Comparison:")
    print(f"Low variance data:  std = {np.std(low_var_data):.2f}")
    print(f"High variance data: std = {np.std(high_var_data):.2f}")

    return low_var_data, high_var_data

low_var, high_var = variance_demo()

# 3. Conditional Probability - foundation of Naive Bayes
def conditional_probability_demo():
    """Email spam classification example"""
    # P(Spam | contains "free")
    total_emails = 1000
    spam_emails = 300
    free_in_spam = 250
    free_in_ham = 50

    p_spam = spam_emails / total_emails
    p_free_given_spam = free_in_spam / spam_emails
    p_free_given_ham = free_in_ham / (total_emails - spam_emails)
    p_free = (free_in_spam + free_in_ham) / total_emails

    print(f"\nEmail Classification Example:")
    print(f"P(Spam) = {p_spam:.3f}")
    print(f"P('free' | Spam) = {p_free_given_spam:.3f}")
    print(f"P('free' | Ham) = {p_free_given_ham:.3f}")

    # Bayes' theorem: P(Spam | 'free') = P('free' | Spam) * P(Spam) / P('free')
    p_spam_given_free = (p_free_given_spam * p_spam) / p_free
    print(f"P(Spam | 'free') = {p_spam_given_free:.3f}")

conditional_probability_demo()

# Applications in Machine Learning:
print(f"\n" + "="*50)
print("ML APPLICATIONS")
print("="*50)

print("""
1. Gaussian Naive Bayes: Assumes features follow normal distribution
2. Logistic Regression: Uses probability to make predictions
3. Neural Networks: Dropout uses Bernoulli distribution
4. Bayesian Methods: Built entirely on probability theory
5. Uncertainty Quantification: Measuring prediction confidence
6. Maximum Likelihood Estimation: Finding best model parameters
""")

# Simple probability-based classifier
def simple_classifier():
    """Classify based on probability thresholds"""
    # Generate synthetic data
    class_0 = np.random.normal(2, 1, 500)
    class_1 = np.random.normal(5, 1, 500)

    # New data point
    new_point = 3.5

    # Calculate probability of belonging to each class
    prob_class_0 = stats.norm.pdf(new_point, loc=2, scale=1)
    prob_class_1 = stats.norm.pdf(new_point, loc=5, scale=1)

    print(f"\nClassifying point {new_point}:")
    print(f"P(point | Class 0) = {prob_class_0:.4f}")
    print(f"P(point | Class 1) = {prob_class_1:.4f}")

    if prob_class_0 > prob_class_1:
        print("Prediction: Class 0")
    else:
        print("Prediction: Class 1")

simple_classifier()