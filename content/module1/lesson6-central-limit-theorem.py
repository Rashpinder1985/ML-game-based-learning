# Lesson 6: Central Limit Theorem - Why Normal Distribution Rules ML
# Understanding why many ML methods assume normality

import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

# Central Limit Theorem (CLT):
# The sampling distribution of sample means approaches normal distribution
# as sample size increases, regardless of the population distribution

print("CENTRAL LIMIT THEOREM DEMONSTRATION")
print("="*45)

def demonstrate_clt():
    """Show CLT with different population distributions"""

    n_samples = 1000
    sample_sizes = [1, 5, 10, 30, 100]

    # Different population distributions
    distributions = {
        'Uniform': lambda size: np.random.uniform(0, 10, size),
        'Exponential': lambda size: np.random.exponential(2, size),
        'Binomial': lambda size: np.random.binomial(20, 0.3, size)
    }

    for dist_name, dist_func in distributions.items():
        print(f"\n{dist_name} Distribution:")
        print("-" * (len(dist_name) + 15))

        # Population parameters
        population = dist_func(10000)
        pop_mean = np.mean(population)
        pop_std = np.std(population)

        print(f"Population mean: {pop_mean:.2f}")
        print(f"Population std: {pop_std:.2f}")

        for sample_size in sample_sizes:
            # Generate many sample means
            sample_means = []
            for _ in range(n_samples):
                sample = dist_func(sample_size)
                sample_means.append(np.mean(sample))

            sample_means = np.array(sample_means)

            # Check normality with Shapiro-Wilk test (for smaller samples)
            if len(sample_means) <= 5000:
                _, p_value = stats.shapiro(sample_means[:100])  # Test subset
                is_normal = p_value > 0.05
            else:
                is_normal = True  # Assume normal for large samples

            # Expected standard error
            expected_se = pop_std / np.sqrt(sample_size)
            actual_se = np.std(sample_means)

            print(f"  n={sample_size:3d}: mean={np.mean(sample_means):.2f}, "
                  f"SE={actual_se:.2f} (expected: {expected_se:.2f}), "
                  f"Normal: {'Yes' if is_normal else 'No'}")

demonstrate_clt()

print("\n" + "="*50)
print("WHY CLT MATTERS IN MACHINE LEARNING")
print("="*50)

def ml_applications_of_clt():
    """Show practical ML applications of CLT"""

    # 1. Confidence Intervals for Model Performance
    print("\n1. MODEL PERFORMANCE CONFIDENCE INTERVALS")
    print("-" * 40)

    # Simulate model accuracy across multiple runs
    true_accuracy = 0.85
    n_runs = 100
    test_set_size = 1000

    accuracies = []
    for _ in range(n_runs):
        # Simulate test predictions (Bernoulli trials)
        correct_predictions = np.random.binomial(test_set_size, true_accuracy)
        accuracy = correct_predictions / test_set_size
        accuracies.append(accuracy)

    accuracies = np.array(accuracies)
    mean_accuracy = np.mean(accuracies)
    std_accuracy = np.std(accuracies)

    # 95% confidence interval
    ci_lower = mean_accuracy - 1.96 * std_accuracy
    ci_upper = mean_accuracy + 1.96 * std_accuracy

    print(f"True accuracy: {true_accuracy:.3f}")
    print(f"Estimated accuracy: {mean_accuracy:.3f} ± {std_accuracy:.3f}")
    print(f"95% CI: [{ci_lower:.3f}, {ci_upper:.3f}]")

    # 2. Bootstrap Sampling
    print("\n2. BOOTSTRAP CONFIDENCE INTERVALS")
    print("-" * 35)

    # Original dataset
    np.random.seed(42)
    dataset = np.random.exponential(5, 200)  # Non-normal data
    original_mean = np.mean(dataset)

    # Bootstrap resampling
    n_bootstrap = 1000
    bootstrap_means = []

    for _ in range(n_bootstrap):
        # Sample with replacement
        bootstrap_sample = np.random.choice(dataset, size=len(dataset), replace=True)
        bootstrap_means.append(np.mean(bootstrap_sample))

    bootstrap_means = np.array(bootstrap_means)

    # Bootstrap confidence interval
    ci_lower = np.percentile(bootstrap_means, 2.5)
    ci_upper = np.percentile(bootstrap_means, 97.5)

    print(f"Original dataset mean: {original_mean:.2f}")
    print(f"Bootstrap mean: {np.mean(bootstrap_means):.2f}")
    print(f"Bootstrap 95% CI: [{ci_lower:.2f}, {ci_upper:.2f}]")

    # Check if bootstrap means are approximately normal
    _, p_value = stats.normaltest(bootstrap_means)
    print(f"Bootstrap means normality test p-value: {p_value:.4f}")
    print(f"Approximately normal: {'Yes' if p_value > 0.05 else 'No'}")

ml_applications_of_clt()

print("\n" + "="*50)
print("SAMPLING DISTRIBUTIONS")
print("="*50)

def sampling_distribution_demo():
    """Demonstrate different sampling scenarios"""

    # Sample size effect on sampling distribution
    population = np.random.gamma(2, 2, 10000)  # Skewed population
    pop_mean = np.mean(population)
    pop_std = np.std(population)

    print(f"Population (Gamma distribution):")
    print(f"  Mean: {pop_mean:.2f}")
    print(f"  Std: {pop_std:.2f}")
    print(f"  Skewness: {stats.skew(population):.2f}")

    sample_sizes = [5, 15, 30, 50, 100]

    for n in sample_sizes:
        # Generate sampling distribution
        sample_means = []
        for _ in range(1000):
            sample = np.random.choice(population, size=n, replace=False)
            sample_means.append(np.mean(sample))

        sample_means = np.array(sample_means)

        # Theoretical vs actual standard error
        theoretical_se = pop_std / np.sqrt(n)
        actual_se = np.std(sample_means)

        # Measure normality
        skewness = stats.skew(sample_means)

        print(f"\nSample size n={n}:")
        print(f"  Sampling distribution mean: {np.mean(sample_means):.2f}")
        print(f"  Standard error: {actual_se:.3f} (theory: {theoretical_se:.3f})")
        print(f"  Skewness: {skewness:.3f} (closer to 0 = more normal)")

sampling_distribution_demo()

print("\n" + "="*50)
print("HYPOTHESIS TESTING FOUNDATIONS")
print("="*50)

def hypothesis_testing_example():
    """Show how CLT enables hypothesis testing"""

    # A/B test scenario: Does new algorithm improve accuracy?
    # H0: μ_new = μ_old (no improvement)
    # H1: μ_new > μ_old (improvement)

    np.random.seed(123)

    # Old algorithm performance
    old_accuracy = 0.75
    new_accuracy = 0.78  # True improvement (unknown in practice)

    n_tests = 50  # Number of test runs

    # Generate test results
    old_results = np.random.binomial(100, old_accuracy, n_tests) / 100
    new_results = np.random.binomial(100, new_accuracy, n_tests) / 100

    old_mean = np.mean(old_results)
    new_mean = np.mean(new_results)
    old_se = np.std(old_results) / np.sqrt(n_tests)
    new_se = np.std(new_results) / np.sqrt(n_tests)

    print(f"A/B Test Results (n={n_tests} each):")
    print(f"Old algorithm: {old_mean:.3f} ± {old_se:.3f}")
    print(f"New algorithm: {new_mean:.3f} ± {new_se:.3f}")

    # Two-sample t-test (assumes normality due to CLT)
    t_stat, p_value = stats.ttest_ind(new_results, old_results)

    print(f"\nHypothesis Test:")
    print(f"t-statistic: {t_stat:.3f}")
    print(f"p-value: {p_value:.4f}")

    alpha = 0.05
    if p_value < alpha:
        print(f"Result: Reject H0 (p < {alpha})")
        print("Conclusion: New algorithm is significantly better!")
    else:
        print(f"Result: Fail to reject H0 (p >= {alpha})")
        print("Conclusion: No significant improvement detected")

    # Effect size (Cohen's d)
    pooled_std = np.sqrt(((n_tests-1)*np.var(old_results) + (n_tests-1)*np.var(new_results)) / (2*n_tests-2))
    cohens_d = (new_mean - old_mean) / pooled_std

    print(f"Effect size (Cohen's d): {cohens_d:.3f}")
    if abs(cohens_d) < 0.2:
        effect_interpretation = "small"
    elif abs(cohens_d) < 0.5:
        effect_interpretation = "medium"
    else:
        effect_interpretation = "large"

    print(f"Effect size interpretation: {effect_interpretation}")

hypothesis_testing_example()

print("\n" + "="*50)
print("KEY TAKEAWAYS FOR ML")
print("="*50)

print("""
1. FOUNDATION OF STATISTICAL INFERENCE
   - Confidence intervals for model metrics
   - Hypothesis testing for model comparison
   - A/B testing for ML system improvements

2. BOOTSTRAP METHODS
   - Estimate uncertainty without assumptions
   - Model performance confidence intervals
   - Feature importance uncertainty

3. NORMAL APPROXIMATIONS
   - Many ML algorithms assume normality
   - Maximum likelihood estimation
   - Gradient descent convergence analysis

4. SAMPLE SIZE PLANNING
   - Determine how much data you need
   - Power analysis for experiments
   - Statistical significance in results

5. WHY n ≥ 30 IS OFTEN SUFFICIENT
   - CLT typically kicks in around n=30
   - Basis for many "rules of thumb" in ML
   - Justifies normal approximations

Remember: CLT is why we can use normal distributions
even when the underlying data isn't normal!
""")