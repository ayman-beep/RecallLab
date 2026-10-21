import type { Concept, WeekModule } from '../../types'

export const week: WeekModule = {
  week: 13,
  title: 'Model Evaluation and Project Communication',
  subtitle: 'Confusion matrices, precision, recall and honest reporting',
  description:
    'Evaluate classifiers properly: read a confusion matrix, compute accuracy, precision, recall and F1, interpret ROC curves and AUC, handle class imbalance, and communicate model limitations in language stakeholders can act on.',
  learningObjectives: [
    'Build and read a confusion matrix for a binary classifier.',
    'Compute accuracy, precision, recall and F1 from counts.',
    'Choose a primary metric that matches the cost of each error type.',
    'Explain what ROC-AUC measures and why accuracy fails under class imbalance.',
  ],
  topics: ['Confusion matrix', 'Precision and recall', 'ROC-AUC', 'Metric selection', 'Communication'],
  estimatedMinutes: 42,
  accent: '#f59e0b',
}

export const concepts: Concept[] = [
  {
    id: 'w13-confusion-matrix',
    week: 13,
    topic: 'Confusion matrix',
    title: 'Confusion matrix',
    definition:
      'A table cross-tabulating predicted versus actual classes, whose four cells count true positives, true negatives, false positives and false negatives.',
    keyFacts: [
      '2×2 for binary classification',
      'Every classification metric derives from these four counts',
      'Rows vs columns conventions must be stated',
    ],
    example:
      'Of 1,000 transactions, 40 predicted fraud: 30 truly fraud (TP), 10 legitimate (FP); 20 frauds were missed (FN) and 940 legitimate were correctly cleared (TN).',
    explanation:
      'Always build the matrix before quoting a metric. It reveals which error type dominates, which no single score can show.',
    hint: 'Complete the sentence naming the table that cross-tabulates predictions against actual classes.',
    related: ['w13-tp-tn-fp-fn', 'w13-precision', 'w13-recall'],
    difficulty: 'core',
    drill: {
      mode: 'cloze',
      prompt: 'Complete the description of the evaluation table.',
      template:
        'A ___ matrix cross-tabulates predicted and actual classes, and for binary classification it has ___ cells.',
      blanks: [{ answers: ['confusion'] }, { answers: ['four', '4'] }],
    },
  },
  {
    id: 'w13-tp-tn-fp-fn',
    week: 13,
    topic: 'Confusion matrix',
    title: 'True/false positives and negatives',
    definition:
      'True positive: correctly predicted positive. True negative: correctly predicted negative. False positive: predicted positive but actually negative. False negative: predicted negative but actually positive.',
    keyFacts: [
      'False positive = Type I error (false alarm)',
      'False negative = Type II error (miss)',
      'The cost of FP and FN usually differs sharply',
    ],
    example:
      'In cancer screening, a false negative (missed disease) is far more costly than a false positive (extra test).',
    explanation:
      'Naming errors in business terms — "blocked good customer" vs "missed fraud" — is what makes metric choice meaningful.',
    hint: 'Which cell counts cases predicted negative that are actually positive?',
    related: ['w13-confusion-matrix', 'w9-type1-error', 'w13-metric-choice'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What do we call a case that the model predicts as negative but that is actually positive?',
      answers: ['False negative', 'False negative (FN)', 'FN'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w13-accuracy',
    week: 13,
    topic: 'Precision and recall',
    title: 'Accuracy',
    definition:
      'The proportion of all predictions that are correct: (TP + TN) / (TP + TN + FP + FN).',
    keyFacts: [
      'Intuitive but misleading under class imbalance',
      'A 99%-negative dataset gives 99% accuracy by predicting all negative',
      'Useful only with balanced classes or alongside other metrics',
    ],
    example:
      'A fraud model predicting "never fraud" achieves 99.5% accuracy while catching zero frauds.',
    explanation:
      'Accuracy weights both error types equally and ignores prevalence — exactly the wrong assumptions in most imbalanced problems.',
    hint: 'The metric that divides correct predictions by all predictions.',
    related: ['w13-accuracy-limits', 'w13-precision', 'w13-class-imbalance'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'Which metric is the number of correct predictions divided by the total number of predictions?',
      answers: ['Accuracy'],
      placeholder: 'Type the metric…',
    },
  },
  {
    id: 'w13-precision',
    week: 13,
    topic: 'Precision and recall',
    title: 'Precision',
    definition:
      'Of all cases the model predicted positive, the proportion that truly are positive: TP / (TP + FP).',
    keyFacts: [
      'High precision = few false alarms',
      'Important when acting on a positive prediction is costly',
      'Can be raised by predicting positive only when very confident',
    ],
    example:
      'A spam filter with 98% precision almost never marks legitimate mail as spam.',
    explanation:
      'Precision answers "how trustworthy is a positive prediction?" — the question that matters when a false positive has a real cost.',
    hint: 'TP / (TP + FP): the share of predicted positives that are correct.',
    related: ['w13-recall', 'w13-f1', 'w13-metric-choice'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which metric is TP / (TP + FP), the share of predicted positives that are actually positive?',
      answers: ['Precision', 'Positive predictive value'],
      placeholder: 'Type the metric…',
    },
  },
  {
    id: 'w13-recall',
    week: 13,
    topic: 'Precision and recall',
    title: 'Recall',
    definition:
      'Of all cases that are truly positive, the proportion the model identified: TP / (TP + FN).',
    keyFacts: [
      'High recall = few missed positives',
      'Also called sensitivity or true positive rate',
      'Raised by lowering the decision threshold, which usually costs precision',
    ],
    example:
      'A disease screening test with 95% recall finds nearly all true cases, at the cost of many false alarms.',
    explanation:
      'Recall answers "how many real cases did we catch?" — the question that matters when missing a case is dangerous.',
    hint: 'TP / (TP + FN): the share of actual positives that were found.',
    related: ['w13-precision', 'w13-f1', 'w13-threshold'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which metric is TP / (TP + FN), the share of actual positives that the model correctly identified?',
      answers: ['Recall', 'Sensitivity', 'True positive rate'],
      placeholder: 'Type the metric…',
    },
  },
  {
    id: 'w13-f1',
    week: 13,
    topic: 'Precision and recall',
    title: 'F1-score',
    definition:
      'The harmonic mean of precision and recall: 2 × (precision × recall) / (precision + recall), balancing the two.',
    keyFacts: [
      'Ranges 0–1; high only when both precision and recall are high',
      'Harmonic mean punishes a very low component',
      'Assumes equal importance of precision and recall',
    ],
    example:
      'Precision 0.8 and recall 0.4 give F1 ≈ 0.53 — much lower than the arithmetic mean of 0.6.',
    explanation:
      'F1 is the go-to single number when both error types matter and classes are imbalanced, but it hides which component is weak.',
    hint: 'Which score is the harmonic mean of precision and recall?',
    related: ['w13-precision', 'w13-recall', 'w13-metric-choice'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which metric is the harmonic mean of precision and recall?',
      answers: ['F1-score', 'F1 score', 'F1', 'F-measure'],
      placeholder: 'Type the metric…',
    },
  },
  {
    id: 'w13-precision-recall-tradeoff',
    week: 13,
    topic: 'Precision and recall',
    title: 'Precision–recall trade-off',
    definition:
      'Lowering the decision threshold catches more positives (higher recall) but flags more false positives (lower precision); raising it does the reverse.',
    keyFacts: [
      'Threshold movement trades one metric against the other',
      'The right balance depends on the relative cost of errors',
      'Precision–recall curves summarise the trade-off',
    ],
    example:
      'Fraud review teams can either block more transactions (higher recall, more customer friction) or fewer (higher precision, more fraud losses).',
    explanation:
      'There is no free lunch: the threshold encodes a business judgement about which error is worse.',
    hint: 'Complete what happens to each metric when the threshold is lowered.',
    related: ['w13-threshold', 'w13-precision', 'w13-recall'],
    difficulty: 'advanced',
    drill: {
      mode: 'cloze',
      prompt: 'Complete the effect of lowering the decision threshold.',
      template:
        'Lowering the classification threshold increases ___ and typically decreases ___.',
      blanks: [{ answers: ['recall'] }, { answers: ['precision'] }],
    },
  },
  {
    id: 'w13-metric-choice',
    week: 13,
    topic: 'Metric selection',
    title: 'Choosing an evaluation metric',
    definition:
      'Select the metric from the cost of each error: recall when misses are dangerous, precision when false alarms are expensive, F1 when both matter, MAE/RMSE for regression.',
    keyFacts: [
      'Screening and safety → prioritise recall',
      'Costly interventions → prioritise precision',
      'Balanced cost, imbalanced data → F1 or PR-AUC',
      'Never choose the metric after seeing the results',
    ],
    example:
      'A retention team can contact only 500 customers, so precision at that budget matters more than overall recall.',
    explanation:
      'Metric choice is a decision-theoretic judgement, not a technical default. Fix it before modelling.',
    hint: 'Assign each scenario to the metric that should be optimised.',
    related: ['w13-precision', 'w13-recall', 'w13-class-imbalance'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'assign',
      prompt: 'Assign each scenario to the metric to prioritise.',
      categories: [
        { id: 'recall', label: 'Prioritise recall' },
        { id: 'precision', label: 'Prioritise precision' },
        { id: 'reg', label: 'Use a regression metric' },
      ],
      items: [
        { id: 'a', label: 'Cancer screening where a miss is dangerous', categoryId: 'recall' },
        { id: 'b', label: 'Automatically blocking transactions with no human review', categoryId: 'precision' },
        { id: 'c', label: 'Predicting next month’s revenue', categoryId: 'reg' },
        { id: 'd', label: 'Sending an expensive gift to predicted high-value customers', categoryId: 'precision' },
      ],
    },
  },
  {
    id: 'w13-class-imbalance',
    week: 13,
    topic: 'Metric selection',
    title: 'Class imbalance',
    definition:
      'A dataset in which one class greatly outnumbers another, making accuracy misleading and requiring careful metric, threshold and sampling choices.',
    keyFacts: [
      'Medical fraud and churn datasets are typically imbalanced',
      'Use precision, recall, F1 or PR-AUC instead of accuracy',
      'Remedies: class weights, resampling, threshold tuning',
      'Never resample before the train/test split',
    ],
    example:
      'With 0.5% fraud, a constant "not fraud" predictor achieves 99.5% accuracy and zero utility.',
    explanation:
      'Imbalance distorts both training and evaluation. The fix has two parts: choose imbalance-aware metrics and prevent the model ignoring the minority class.',
    hint: 'Select every statement that is TRUE about highly imbalanced classes.',
    related: ['w13-accuracy-limits', 'w13-recall', 'w7-data-leakage'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every statement that is TRUE about class imbalance.',
      options: [
        { id: 'a', label: 'Accuracy can look excellent while the minority class is never predicted', correct: true },
        { id: 'b', label: 'Precision, recall and PR-AUC are more informative than accuracy', correct: true },
        { id: 'c', label: 'Resampling should be applied before splitting into train and test', correct: false },
        { id: 'd', label: 'Class weights can stop the model ignoring the minority class', correct: true },
        { id: 'e', label: 'A balanced test set is required for an honest evaluation of the original problem', correct: false },
      ],
    },
  },
  {
    id: 'w13-accuracy-limits',
    week: 13,
    topic: 'Metric selection',
    title: 'Limits of accuracy',
    definition:
      'Accuracy collapses the confusion matrix into one number, hiding which class the model fails on and giving a falsely reassuring picture under imbalance.',
    keyFacts: [
      'Ignores prevalence of the positive class',
      'Two models with equal accuracy can have very different error profiles',
      'Report the confusion matrix alongside any headline metric',
    ],
    example:
      'Model A: 90% accuracy, all frauds missed. Model B: 88% accuracy, 80% of frauds caught. B is the better business model.',
    explanation:
      'Accuracy is a summary, not an evaluation. The matrix is the evidence.',
    hint: 'Why can high accuracy still mean a useless classifier?',
    related: ['w13-accuracy', 'w13-class-imbalance', 'w13-tp-tn-fp-fn'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which single number hides per-class error patterns and becomes misleading when classes are imbalanced?',
      answers: ['Accuracy'],
      placeholder: 'Type the metric…',
    },
  },
  {
    id: 'w13-roc-auc',
    week: 13,
    topic: 'ROC-AUC',
    title: 'ROC curve and AUC',
    definition:
      'The ROC curve plots true positive rate against false positive rate across all thresholds; AUC is the area under it, interpretable as the probability that a random positive is scored above a random negative.',
    keyFacts: [
      'AUC 0.5 = random, 1.0 = perfect ranking',
      'Threshold-independent measure of ranking quality',
      'Less informative under extreme imbalance than PR-AUC',
    ],
    example:
      'AUC 0.82 means that for 82% of random positive/negative pairs, the positive receives the higher score.',
    explanation:
      'ROC-AUC measures ranking, not calibration or business utility. A model can rank well yet sit at a poor operating threshold.',
    hint: 'Three letters: the area under the true-positive vs false-positive curve.',
    related: ['w13-threshold', 'w13-class-imbalance', 'w9-type1-error'],
    difficulty: 'advanced',
    drill: {
      mode: 'short',
      prompt:
        'What measure is the area under the curve plotting true positive rate against false positive rate across thresholds?',
      answers: ['ROC-AUC', 'Area under the ROC curve', 'AUC', 'ROC AUC'],
      placeholder: 'Type the measure…',
    },
  },
  {
    id: 'w13-threshold',
    week: 13,
    topic: 'ROC-AUC',
    title: 'Decision threshold',
    definition:
      'The probability cut-off converting a model score into a class prediction; moving it changes the precision/recall balance without retraining.',
    keyFacts: [
      'Default 0.5 is arbitrary, not optimal',
      'Tune on validation data using the business cost of errors',
      'Threshold choice is a deployment decision',
    ],
    example:
      'For fraud review with limited analyst capacity, raising the threshold to 0.8 concentrates effort on the highest-risk cases.',
    explanation:
      'Many "model improvement" requests are really threshold decisions. Separating the two avoids retraining for nothing.',
    hint: 'Two words: the probability cut-off that turns a score into a class.',
    related: ['w13-precision-recall-tradeoff', 'w13-roc-auc', 'w13-metric-choice'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What do we call the probability cut-off that converts a model score into a class prediction?',
      answers: ['Decision threshold', 'Threshold', 'Classification threshold', 'Cut-off', 'Cutoff'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w13-communicating',
    week: 13,
    topic: 'Communication',
    title: 'Communicating model limitations',
    definition:
      'Stating clearly what a model can and cannot support: its error rates per class, the population it was trained on, the assumptions it depends on, and the decisions it should not inform.',
    keyFacts: [
      'Lead with the decision, then the evidence',
      'Quantify error in business units, not just metrics',
      'State scope limits: time period, segments, data coverage',
      'Distinguish prediction from causal claims',
    ],
    example:
      '"This model catches 80% of churners and flags 2 false alarms per true case; it was trained on consumer accounts and is not validated for enterprise."',
    explanation:
      'Limitations are part of the deliverable, not an apology. Stakeholders need the boundary conditions to use the model safely.',
    hint: 'Select every statement that is good practice when reporting a model.',
    related: ['w14-model-limits', 'w9-stat-practical', 'w14-data-storytelling'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every statement that reflects good communication practice.',
      options: [
        { id: 'a', label: 'Reporting error rates for each class rather than one overall accuracy', correct: true },
        { id: 'b', label: 'Stating which populations and time periods the model was validated on', correct: true },
        { id: 'c', label: 'Presenting a prediction as proof of a causal relationship', correct: false },
        { id: 'd', label: 'Translating false positives into business cost', correct: true },
        { id: 'e', label: 'Omitting limitations so stakeholders are not confused', correct: false },
      ],
    },
  },
]
