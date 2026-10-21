import type { Concept, WeekModule } from '../../types'

export const week: WeekModule = {
  week: 10,
  title: 'Machine Learning Paradigms and Linear Regression',
  subtitle: 'Supervised, unsupervised and reinforcement learning; fitting a line',
  description:
    'Map the three learning paradigms, distinguish regression from classification, and understand linear regression in depth: the line of best fit, ordinary least squares, mean squared error, residuals, assumptions and generalisation.',
  learningObjectives: [
    'Distinguish supervised, unsupervised and reinforcement learning.',
    'Identify features and targets and decide whether a task is regression or classification.',
    'Explain how ordinary least squares fits a line and how MSE scores it.',
    'State the assumptions behind linear regression and what residuals reveal.',
  ],
  topics: ['Learning paradigms', 'Features and targets', 'Linear regression', 'Residuals', 'Generalisation'],
  estimatedMinutes: 42,
  accent: '#4ade80',
}

export const concepts: Concept[] = [
  {
    id: 'w10-supervised-learning',
    week: 10,
    topic: 'Learning paradigms',
    title: 'Supervised learning',
    definition:
      'Learning a mapping from input features to a known target value using labelled examples, so the model can predict the target for new inputs.',
    keyFacts: [
      'Requires labelled training data',
      'Two main tasks: regression and classification',
      'Performance is measured against held-out labels',
    ],
    example:
      'Predicting house prices from size, location and age using 50,000 past sales with known prices.',
    explanation:
      'The defining feature is the label: supervision comes from having the right answer during training.',
    hint: 'Two words: the paradigm that learns from labelled examples.',
    related: ['w10-unsupervised-learning', 'w10-labeled-data', 'w10-regression'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'Which learning paradigm trains a model on labelled examples to map features to a known target?',
      answers: ['Supervised learning', 'Supervised Learning'],
      placeholder: 'Type the paradigm…',
    },
  },
  {
    id: 'w10-unsupervised-learning',
    week: 10,
    topic: 'Learning paradigms',
    title: 'Unsupervised learning',
    definition:
      'Finding structure in unlabelled data, such as clusters, associations or lower-dimensional representations, without a target variable.',
    keyFacts: [
      'No labels and no target',
      'Examples: k-means clustering, PCA, association rules',
      'Evaluation is indirect — there is no ground truth target',
    ],
    example:
      'Segmenting customers into behaviour groups from usage patterns alone, with no predefined segment labels.',
    explanation:
      'Without labels, success is judged by interpretability and usefulness rather than accuracy against a known answer.',
    hint: 'Two words: the paradigm that looks for structure in unlabelled data.',
    related: ['w10-supervised-learning', 'w10-paradigms', 'w8-eda-purpose'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'Which learning paradigm finds structure such as clusters or components in data with no target labels?',
      answers: ['Unsupervised learning', 'Unsupervised Learning'],
      placeholder: 'Type the paradigm…',
    },
  },
  {
    id: 'w10-reinforcement-learning',
    week: 10,
    topic: 'Learning paradigms',
    title: 'Reinforcement learning',
    definition:
      'Learning a policy of actions by interacting with an environment and maximising cumulative reward through trial, error and delayed feedback.',
    keyFacts: [
      'Agent, environment, actions, states, rewards',
      'Feedback is a reward signal, not a correct label',
      'Exploration vs exploitation trade-off',
    ],
    example:
      'A recommendation agent learns which content to show by observing engagement rewards over many sessions.',
    explanation:
      'The distinguishing feature is sequential decision-making with delayed reward — neither labels nor static structure.',
    hint: 'Two words: learning actions from reward signals in an environment.',
    related: ['w10-supervised-learning', 'w10-unsupervised-learning', 'w10-paradigms'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which paradigm learns a policy of actions by maximising cumulative reward through interaction with an environment?',
      answers: ['Reinforcement learning', 'Reinforcement Learning', 'RL'],
      placeholder: 'Type the paradigm…',
    },
  },
  {
    id: 'w10-paradigms',
    week: 10,
    topic: 'Learning paradigms',
    title: 'Choosing a paradigm',
    definition:
      'Labelled target → supervised; no target, structure wanted → unsupervised; sequential decisions with reward → reinforcement.',
    keyFacts: [
      'Ask first: is there a target column?',
      'Second: is the decision sequential?',
      'Hybrid approaches exist (e.g. RL with supervised components)',
    ],
    example:
      'Fraud detection with past confirmed frauds is supervised; anomaly detection without labels is unsupervised.',
    explanation:
      'Paradigm follows from the data and the decision structure, not from which algorithm is fashionable.',
    hint: 'Assign each scenario to its learning paradigm.',
    related: ['w10-supervised-learning', 'w10-unsupervised-learning', 'w10-reinforcement-learning'],
    difficulty: 'core',
    drill: {
      mode: 'categorize',
      variant: 'assign',
      prompt: 'Assign each scenario to its learning paradigm.',
      categories: [
        { id: 'sup', label: 'Supervised' },
        { id: 'unsup', label: 'Unsupervised' },
        { id: 'rl', label: 'Reinforcement' },
      ],
      items: [
        { id: 'a', label: 'Predict churn from labelled historical churners', categoryId: 'sup' },
        { id: 'b', label: 'Group customers by usage patterns with no labels', categoryId: 'unsup' },
        { id: 'c', label: 'Learn bidding actions from ad-auction rewards', categoryId: 'rl' },
      ],
    },
  },
  {
    id: 'w10-labeled-data',
    week: 10,
    topic: 'Features and targets',
    title: 'Labeled vs unlabeled data',
    definition:
      'Labeled data pairs each input with the correct output; unlabeled data contains inputs only.',
    keyFacts: [
      'Labels are expensive to obtain (annotation, waiting for outcomes)',
      'Supervised learning requires labels',
      'Semi-supervised and self-supervised methods mix both',
    ],
    example:
      'Scans with radiologist-confirmed diagnoses are labelled; a folder of unread scans is unlabelled.',
    explanation:
      'Label scarcity is usually the practical bottleneck in applied ML, which shapes which paradigms are feasible.',
    hint: 'Two words: data that includes the correct output for each example.',
    related: ['w10-supervised-learning', 'w10-features-target', 'w13-class-imbalance'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'What term describes data in which every input example is paired with its correct output value?',
      answers: ['Labeled data', 'Labelled data', 'Labeled dataset'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w10-features-target',
    week: 10,
    topic: 'Features and targets',
    title: 'Features and target',
    definition:
      'Features are the input variables used for prediction (X); the target is the variable being predicted (y), also called the label or dependent variable.',
    keyFacts: [
      'Features = independent variables (X)',
      'Target = dependent variable (y)',
      'Target leakage = a feature that encodes the target',
    ],
    example:
      'Predicting price (y) from size, rooms and location (X) — using the final sale price as a feature would be target leakage.',
    explanation:
      'Naming the target first clarifies the whole project: everything else is either a feature or must be excluded.',
    hint: 'Two words for the predicted variable, also called the dependent variable.',
    related: ['w10-labeled-data', 'w10-linear-regression', 'w7-data-leakage'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'What is the variable a supervised model is trained to predict called?',
      answers: ['Target', 'Target variable', 'Label', 'Dependent variable'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w10-regression',
    week: 10,
    topic: 'Features and targets',
    title: 'Regression',
    definition:
      'A supervised task whose target is continuous — predicting a quantity such as price, demand or duration.',
    keyFacts: [
      'Continuous target',
      'Evaluated with MAE, MSE, RMSE or R²',
      'Output is a magnitude, not a class',
    ],
    example:
      'Predicting next month’s revenue for each store is a regression task.',
    explanation:
      'The target type determines the task and therefore the loss function and evaluation metrics.',
    hint: 'One word: supervised prediction of a continuous quantity.',
    related: ['w10-classification', 'w10-linear-regression', 'w13-confusion-matrix'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'What kind of supervised task predicts a continuous numeric target such as price or demand?',
      answers: ['Regression'],
      placeholder: 'Type the task…',
    },
  },
  {
    id: 'w10-classification',
    week: 10,
    topic: 'Features and targets',
    title: 'Classification',
    definition:
      'A supervised task whose target is a discrete class label, such as fraud/not fraud or one of several categories.',
    keyFacts: [
      'Discrete target (binary or multiclass)',
      'Evaluated with accuracy, precision, recall, F1 and ROC-AUC',
      'Output is a class or a class probability',
    ],
    example:
      'Predicting whether a transaction is fraudulent is binary classification.',
    explanation:
      'If the target is a category — even if encoded as numbers — the task is classification, and accuracy-style metrics apply.',
    hint: 'One word: supervised prediction of a discrete class label.',
    related: ['w10-regression', 'w13-confusion-matrix', 'w3-binary'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'What kind of supervised task predicts a discrete class label rather than a quantity?',
      answers: ['Classification'],
      placeholder: 'Type the task…',
    },
  },
  {
    id: 'w10-reg-vs-class',
    week: 10,
    topic: 'Features and targets',
    title: 'Regression vs classification',
    definition:
      'Regression predicts continuous quantities; classification predicts discrete labels. The target type determines the task, loss and evaluation metrics.',
    keyFacts: [
      'Continuous → regression (MSE, MAE)',
      'Categorical → classification (accuracy, precision, recall)',
      'Coding classes as integers does not make it regression',
    ],
    example:
      'Predicting a star rating 1–5 is arguably ordinal; predicting review text sentiment as positive/negative is classification.',
    explanation:
      'The most common error is treating encoded class indices as a continuous quantity and regressing on them.',
    hint: 'Assign each task to regression or classification.',
    related: ['w10-regression', 'w10-classification', 'w13-accuracy'],
    difficulty: 'core',
    drill: {
      mode: 'categorize',
      variant: 'assign',
      prompt: 'Assign each prediction task to its type.',
      categories: [
        { id: 'reg', label: 'Regression' },
        { id: 'cls', label: 'Classification' },
      ],
      items: [
        { id: 'a', label: 'Predict next week’s units sold', categoryId: 'reg' },
        { id: 'b', label: 'Predict whether a customer churns', categoryId: 'cls' },
        { id: 'c', label: 'Predict delivery time in minutes', categoryId: 'reg' },
        { id: 'd', label: 'Predict the product category of a listing', categoryId: 'cls' },
      ],
    },
  },
  {
    id: 'w10-linear-regression',
    week: 10,
    topic: 'Linear regression',
    title: 'Linear regression',
    definition:
      'A supervised model that predicts a continuous target as a weighted sum of input features plus an intercept — geometrically, the line (or hyperplane) of best fit.',
    keyFacts: [
      'Model: ŷ = β₀ + β₁x₁ + … + βₙxₙ',
      'Coefficients express the change in y per unit change in x, holding others fixed',
      'Interpretable but limited to additive linear relationships',
    ],
    example:
      'Price = 20,000 + 150 × size_sqm − 3,000 × age_years explains price as an additive function of the features.',
    explanation:
      'The model is interpretable because each coefficient has a units-based meaning — a major reason it remains the baseline in practice.',
    hint: 'Two words: the model that fits a weighted sum of features to a continuous target.',
    related: ['w10-ols', 'w10-residuals', 'w10-assumptions'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which model predicts a continuous target as a weighted sum of features plus an intercept, producing the line of best fit?',
      answers: ['Linear regression', 'Simple linear regression', 'Multiple linear regression'],
      placeholder: 'Type the model…',
    },
  },
  {
    id: 'w10-ols',
    week: 10,
    topic: 'Linear regression',
    title: 'Ordinary Least Squares',
    definition:
      'The fitting method that chooses coefficients minimising the sum of squared residuals between observed and predicted values.',
    keyFacts: [
      'Loss = Σ(yᵢ − ŷᵢ)²',
      'Squaring penalises large errors more than small ones',
      'Has a closed-form solution for standard linear regression',
    ],
    example:
      'Among all possible lines through the scatter of size vs price, OLS selects the one whose squared vertical distances to the points are smallest.',
    explanation:
      'OLS is the estimation rule; linear regression is the model family. Squared loss is what makes large misses expensive.',
    hint: 'Three words (abbreviated OLS): minimises the sum of squared residuals.',
    related: ['w10-linear-regression', 'w10-mse', 'w10-residuals'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which fitting method chooses the coefficients that minimise the sum of squared residuals?',
      answers: ['Ordinary Least Squares', 'OLS', 'Least squares'],
      placeholder: 'Type the method…',
    },
  },
  {
    id: 'w10-mse',
    week: 10,
    topic: 'Linear regression',
    title: 'Mean Squared Error',
    definition:
      'The average of squared prediction errors, a regression loss and evaluation metric that penalises large errors heavily.',
    keyFacts: [
      'MSE = (1/n) Σ(yᵢ − ŷᵢ)²',
      'Same units squared as the target',
      'Sensitive to outliers; RMSE takes the square root for interpretability',
    ],
    example:
      'An MSE of 900 for daily demand implies an RMSE of 30 units, meaning typical misses are around 30 units.',
    explanation:
      'Squaring means a single large error can dominate the metric, which is desirable only when big misses really are much worse.',
    hint: 'Three letters: the average squared prediction error.',
    related: ['w10-ols', 'w10-residuals', 'w10-assumptions'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which regression metric averages the squared difference between actual and predicted values?',
      answers: ['Mean Squared Error', 'MSE'],
      placeholder: 'Type the metric…',
    },
  },
  {
    id: 'w10-residuals',
    week: 10,
    topic: 'Linear regression',
    title: 'Residuals',
    definition:
      'The difference between an observed value and the model prediction for that observation (y − ŷ); their pattern diagnoses whether the model is appropriate.',
    keyFacts: [
      'Residual plots should show no structure',
      'Curvature suggests a non-linear relationship',
      'Funnel shape suggests non-constant variance',
    ],
    example:
      'Residuals that fan out as predictions grow indicate heteroscedasticity, which invalidates standard error estimates.',
    explanation:
      'Residuals are the model’s leftovers — the signal it failed to capture. Their structure is more informative than a single R².',
    hint: 'One word: the difference between an observed value and its prediction.',
    related: ['w10-assumptions', 'w10-ols', 'w10-mse'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What is the difference between an observed value and the model’s prediction for that observation called?',
      answers: ['Residual', 'Residuals', 'Error term'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w10-assumptions',
    week: 10,
    topic: 'Linear regression',
    title: 'Regression assumptions',
    definition:
      'Linear regression relies on linearity, independence of observations, constant error variance (homoscedasticity), normally distributed residuals for inference, and limited multicollinearity.',
    keyFacts: [
      'Linearity in the parameters',
      'Independent errors, no autocorrelation',
      'Homoscedastic residuals',
      'Multicollinearity inflates coefficient variance',
    ],
    example:
      'Predicting price with both floor area in m² and floor area in ft² creates perfect collinearity and unstable coefficients.',
    explanation:
      'Predictions can be decent even when assumptions fail, but coefficient interpretation and confidence intervals become unreliable.',
    hint: 'Select the assumptions that belong to linear regression.',
    related: ['w10-residuals', 'w10-linear-regression', 'w14-model-limits'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every assumption that belongs to linear regression.',
      options: [
        { id: 'a', label: 'The relationship is linear in the parameters', correct: true },
        { id: 'b', label: 'Residual variance is constant across fitted values', correct: true },
        { id: 'c', label: 'The target must be a categorical label', correct: false },
        { id: 'd', label: 'Features are free of severe multicollinearity', correct: true },
        { id: 'e', label: 'Observations must be dependent on each other', correct: false },
      ],
    },
  },
  {
    id: 'w10-generalization',
    week: 10,
    topic: 'Generalisation',
    title: 'Generalisation',
    definition:
      'A model’s ability to perform well on new, unseen data drawn from the same distribution as the training data — the actual goal of supervised learning.',
    keyFacts: [
      'Measured on held-out data, never on training data',
      'Overfitting fits noise; underfitting misses signal',
      'Distribution shift breaks generalisation even for good models',
    ],
    example:
      'A demand model tuned on pre-pandemic data fails after a structural shift, despite excellent historical accuracy.',
    explanation:
      'The train/test split exists to estimate generalisation. Any decision made using the test set erodes that estimate.',
    hint: 'One word: performing well on new, unseen data.',
    related: ['w7-train-test', 'w11-overfitting', 'w13-evaluation-selection'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What term describes a model’s ability to perform well on new, unseen data?',
      answers: ['Generalization', 'Generalisation', 'Generalizability', 'Generalisability'],
      placeholder: 'Type the term…',
    },
  },
]
