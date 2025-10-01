# Lesson 5: Bayes' Theorem - The Heart of ML Inference
# Understanding how to update beliefs with evidence

import numpy as np
from collections import Counter

# Bayes' Theorem: P(A|B) = P(B|A) * P(A) / P(B)
# In ML: P(Class|Features) = P(Features|Class) * P(Class) / P(Features)

print("BAYES' THEOREM FUNDAMENTALS")
print("="*40)

# Classic Medical Test Example
def medical_test_example():
    """Disease diagnosis with Bayes' theorem"""

    # Prior knowledge
    disease_rate = 0.001  # 0.1% of population has disease
    test_sensitivity = 0.95  # 95% chance of positive if disease present
    test_specificity = 0.99  # 99% chance of negative if no disease

    print(f"Disease prevalence: {disease_rate:.1%}")
    print(f"Test sensitivity: {test_sensitivity:.1%}")
    print(f"Test specificity: {test_specificity:.1%}")

    # Calculate P(Positive Test)
    p_positive = (test_sensitivity * disease_rate +
                  (1 - test_specificity) * (1 - disease_rate))

    # Bayes' theorem: P(Disease | Positive Test)
    p_disease_given_positive = (test_sensitivity * disease_rate) / p_positive

    print(f"\nIf test is positive:")
    print(f"P(Disease | Positive) = {p_disease_given_positive:.1%}")
    print(f"Surprising? Most positive tests are false positives!")

    return p_disease_given_positive

medical_test_example()

print("\n" + "="*50)
print("NAIVE BAYES CLASSIFIER")
print("="*50)

# Naive Bayes for Text Classification
def naive_bayes_text_classifier():
    """Email spam classification using Naive Bayes"""

    # Training data
    spam_emails = [
        "free money win lottery",
        "click here free offer",
        "win big money now",
        "free download click now"
    ]

    ham_emails = [
        "meeting tomorrow at office",
        "project deadline next week",
        "lunch with team today",
        "review the quarterly report"
    ]

    # Build vocabulary and word counts
    spam_words = []
    ham_words = []

    for email in spam_emails:
        spam_words.extend(email.split())

    for email in ham_emails:
        ham_words.extend(email.split())

    spam_word_count = Counter(spam_words)
    ham_word_count = Counter(ham_words)

    vocab = set(spam_words + ham_words)

    print(f"Training data:")
    print(f"Spam emails: {len(spam_emails)}")
    print(f"Ham emails: {len(ham_emails)}")
    print(f"Vocabulary size: {len(vocab)}")

    # Prior probabilities
    total_emails = len(spam_emails) + len(ham_emails)
    p_spam = len(spam_emails) / total_emails
    p_ham = len(ham_emails) / total_emails

    print(f"\nPrior probabilities:")
    print(f"P(Spam) = {p_spam:.2f}")
    print(f"P(Ham) = {p_ham:.2f}")

    # Likelihood calculation with Laplace smoothing
    def get_word_probability(word, word_count, total_words, vocab_size):
        return (word_count.get(word, 0) + 1) / (total_words + vocab_size)

    spam_total = len(spam_words)
    ham_total = len(ham_words)
    vocab_size = len(vocab)

    # Test new email
    test_email = "free meeting click"
    test_words = test_email.split()

    print(f"\nClassifying: '{test_email}'")

    # Calculate log probabilities (to avoid underflow)
    log_p_spam = np.log(p_spam)
    log_p_ham = np.log(p_ham)

    print(f"\nWord probabilities:")
    for word in test_words:
        p_word_spam = get_word_probability(word, spam_word_count, spam_total, vocab_size)
        p_word_ham = get_word_probability(word, ham_word_count, ham_total, vocab_size)

        log_p_spam += np.log(p_word_spam)
        log_p_ham += np.log(p_word_ham)

        print(f"  '{word}': P(word|Spam)={p_word_spam:.3f}, P(word|Ham)={p_word_ham:.3f}")

    # Make prediction
    if log_p_spam > log_p_ham:
        prediction = "SPAM"
        confidence = np.exp(log_p_spam) / (np.exp(log_p_spam) + np.exp(log_p_ham))
    else:
        prediction = "HAM"
        confidence = np.exp(log_p_ham) / (np.exp(log_p_spam) + np.exp(log_p_ham))

    print(f"\nPrediction: {prediction}")
    print(f"Confidence: {confidence:.1%}")

naive_bayes_text_classifier()

print("\n" + "="*50)
print("BAYESIAN UPDATING")
print("="*50)

def bayesian_updating_example():
    """Show how beliefs update with new evidence"""

    # Coin flip example: Is the coin fair?
    # Hypothesis: Coin is biased toward heads (p > 0.5)

    # Prior belief: 50% chance coin is biased
    prior_biased = 0.5

    # Observe some coin flips
    observations = ['H', 'H', 'T', 'H', 'H', 'H', 'T', 'H']

    print("Coin Bias Detection with Bayesian Updating")
    print(f"Prior belief coin is biased: {prior_biased:.1%}")

    current_belief = prior_biased

    for i, flip in enumerate(observations):
        heads_so_far = sum(1 for f in observations[:i+1] if f == 'H')
        total_flips = i + 1

        # Likelihood of observing this sequence
        # P(sequence | fair coin) vs P(sequence | biased coin)
        if flip == 'H':
            likelihood_fair = 0.5
            likelihood_biased = 0.7  # Assume biased coin has 70% heads probability
        else:
            likelihood_fair = 0.5
            likelihood_biased = 0.3

        # Update belief using Bayes' theorem
        # P(biased | data) ∝ P(data | biased) * P(biased)
        numerator = likelihood_biased * current_belief
        denominator = likelihood_biased * current_belief + likelihood_fair * (1 - current_belief)

        current_belief = numerator / denominator

        print(f"Flip {i+1}: {flip} | Heads: {heads_so_far}/{total_flips} | P(Biased): {current_belief:.1%}")

bayesian_updating_example()

print("\n" + "="*50)
print("KEY ML APPLICATIONS")
print("="*50)

print("""
1. NAIVE BAYES CLASSIFIER
   - Text classification (spam detection)
   - Sentiment analysis
   - Medical diagnosis

2. BAYESIAN INFERENCE
   - Parameter estimation
   - Uncertainty quantification
   - A/B testing analysis

3. BAYESIAN NEURAL NETWORKS
   - Uncertainty in deep learning
   - Avoiding overfitting

4. GAUSSIAN PROCESSES
   - Regression with uncertainty
   - Hyperparameter optimization

5. MARKOV CHAIN MONTE CARLO (MCMC)
   - Sampling from complex distributions
   - Bayesian model fitting

The key insight: Bayes' theorem provides a principled way to
combine prior knowledge with observed evidence.
""")