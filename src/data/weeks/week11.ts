import type { Concept, WeekModule } from '../../types'

export const week: WeekModule = {
  week: 11,
  title: 'Decision Tree Theory',
  subtitle: 'Splitting rules, impurity, depth and pruning',
  description:
    'Understand how decision trees partition feature space: root and leaf nodes, recursive partitioning, Gini impurity, entropy and information gain, then why trees overfit and how depth limits and pruning restore generalisation.',
  learningObjectives: [
    'Label the parts of a decision tree and follow a prediction path.',
    'Compute and interpret Gini impurity, entropy and information gain.',
    'Explain how tree depth controls bias and variance.',
    'Describe pruning and evaluate the interpretability trade-off of trees.',
  ],
  topics: ['Tree anatomy', 'Impurity and gain', 'Overfitting', 'Pruning', 'Interpretability'],
  estimatedMinutes: 38,
  accent: '#fb923c',
}

export const concepts: Concept[] = [
  {
    id: 'w11-tree-anatomy',
    week: 11,
    topic: 'Tree anatomy',
    title: 'Root, internal and leaf nodes',
    definition:
      'The root node holds the first split over all data; internal nodes apply further splits; leaf (terminal) nodes make the prediction.',
    keyFacts: [
      'Root = first split, contains every training row',
      'Internal nodes = decision points on one feature',
      'Leaf nodes = terminal predictions',
      'Branches = the outcomes of a split',
    ],
    example:
      'Root: "spend > 100?" → internal: "tenure < 6 months?" → leaves: "churn" / "retain".',
    explanation:
      'Every prediction is a path from root to leaf. Confusing root with leaf is the classic anatomy error.',
    hint: 'Complete the tree anatomy sentence with the first split node and the terminal nodes.',
    related: ['w11-splitting', 'w11-pruning', 'w10-classification'],
    difficulty: 'intro',
    drill: {
      mode: 'cloze',
      prompt: 'Complete the description of tree anatomy.',
      template:
        'The first split over all the data happens at the ___ node, while predictions are stored in the ___ nodes.',
      blanks: [{ answers: ['root'] }, { answers: ['leaf', 'leaves', 'terminal'] }],
    },
  },
  {
    id: 'w11-splitting',
    week: 11,
    topic: 'Tree anatomy',
    title: 'Splitting rule',
    definition:
      'A condition on one feature (such as age ≤ 30 or plan = "basic") that divides the current node’s observations into child groups.',
    keyFacts: [
      'One feature per split in a standard tree',
      'Chosen to maximise purity improvement',
      'Thresholds can be reused at different depths',
    ],
    example:
      'A split at tenure ≤ 5 months separates two groups with very different churn rates.',
    explanation:
      'Trees are piecewise-constant: each split carves the feature space into rectangles with a single prediction each.',
    hint: 'Two words: the condition on one feature that divides a node.',
    related: ['w11-tree-anatomy', 'w11-information-gain', 'w11-recursive'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What do we call the condition on a single feature that divides a node into child groups?',
      answers: ['Splitting rule', 'Split', 'Splitting criterion', 'Decision rule'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w11-recursive',
    week: 11,
    topic: 'Tree anatomy',
    title: 'Recursive partitioning',
    definition:
      'The procedure that repeatedly splits nodes into purer subsets, recursively, until a stopping rule is met.',
    keyFacts: [
      'Greedy: each split optimises locally',
      'Stopping rules: max depth, min samples, purity threshold',
      'Greedy choices are not globally optimal',
    ],
    example:
      'After splitting on spend, each child is split again on the best remaining feature, continuing until leaves are pure or a depth limit is reached.',
    explanation:
      'Recursion is why trees can model interactions, and greedy splitting is why they can miss a better global structure.',
    hint: 'Two words: the repeated splitting process that builds the tree.',
    related: ['w11-splitting', 'w11-depth', 'w11-pruning'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What is the repeated, greedy process of splitting nodes into purer subsets called?',
      answers: ['Recursive partitioning', 'Recursive splitting', 'Recursive binary splitting'],
      placeholder: 'Type the process…',
    },
  },
  {
    id: 'w11-gini',
    week: 11,
    topic: 'Impurity and gain',
    title: 'Gini impurity',
    definition:
      'A measure of node impurity: 1 − Σ pᵢ², where pᵢ is the proportion of each class in the node. It is 0 when the node is pure and highest when classes are evenly mixed.',
    keyFacts: [
      '0 = perfectly pure node',
      '0.5 = maximum impurity for a balanced binary split',
      'Cheaper to compute than entropy because it avoids logarithms',
    ],
    example:
      'A node with 9 positives and 1 negative has Gini = 1 − (0.9² + 0.1²) = 0.18.',
    explanation:
      'Gini measures mixing. The best split is the one that reduces the weighted impurity of the children the most.',
    hint: 'One word (a name): the impurity measure 1 − Σp².',
    related: ['w11-entropy', 'w11-information-gain', 'w11-split-selection'],
    difficulty: 'advanced',
    drill: {
      mode: 'short',
      prompt:
        'Which node-impurity measure equals 1 − Σ pᵢ², and is 0 for a pure node?',
      answers: ['Gini impurity', 'Gini index', 'Gini'],
      placeholder: 'Type the measure…',
    },
  },
  {
    id: 'w11-entropy',
    week: 11,
    topic: 'Impurity and gain',
    title: 'Entropy',
    definition:
      'A measure of uncertainty or disorder in a node: −Σ pᵢ log₂ pᵢ, equal to 0 for a pure node and 1 for an evenly split binary node.',
    keyFacts: [
      '0 = pure, 1 = maximum for binary classes',
      'Uses logarithms, hence slightly costlier than Gini',
      'Basis of information gain',
    ],
    example:
      'A 50/50 node has entropy 1; a 100/0 node has entropy 0.',
    explanation:
      'Entropy and Gini usually select similar splits; entropy has a stronger penalty for mixed nodes and an information-theoretic interpretation.',
    hint: 'One word: −Σ p log₂ p, the uncertainty of a node.',
    related: ['w11-gini', 'w11-information-gain', 'w11-split-selection'],
    difficulty: 'advanced',
    drill: {
      mode: 'short',
      prompt:
        'Which impurity measure is defined as −Σ pᵢ log₂ pᵢ and equals 1 for a perfectly mixed binary node?',
      answers: ['Entropy', 'Shannon entropy'],
      placeholder: 'Type the measure…',
    },
  },
  {
    id: 'w11-information-gain',
    week: 11,
    topic: 'Impurity and gain',
    title: 'Information gain',
    definition:
      'The reduction in impurity achieved by a split: parent impurity minus the weighted average impurity of the children.',
    keyFacts: [
      'Gain = impurity(parent) − Σ (n_child / n) × impurity(child)',
      'The split with the highest gain is chosen',
      'Identical concept with Gini or entropy as the impurity measure',
    ],
    example:
      'Parent entropy 0.94 → children entropies 0.0 and 0.72 with weights 0.5/0.5 gives a gain of 0.58.',
    explanation:
      'Gain makes the greedy choice explicit: evaluate candidate splits, keep the one that removes the most impurity now.',
    hint: 'Two words: impurity before the split minus impurity after it.',
    related: ['w11-entropy', 'w11-gini', 'w11-split-selection'],
    difficulty: 'advanced',
    drill: {
      mode: 'short',
      prompt:
        'What is the reduction in impurity produced by a split called?',
      answers: ['Information gain', 'Information Gain', 'IG'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w11-split-selection',
    week: 11,
    topic: 'Impurity and gain',
    title: 'Split selection',
    definition:
      'At each node, every candidate feature and threshold is scored by its impurity reduction, and the highest-scoring split is applied.',
    keyFacts: [
      'Greedy, one-step-ahead objective',
      'Scales as features × candidate thresholds',
      'Different criteria (Gini, entropy) rarely change accuracy much',
    ],
    example:
      'With 20 features and 100 thresholds each, the algorithm evaluates ~2,000 splits and keeps the best at that node.',
    explanation:
      'The objective is local purity, not global accuracy — the reason single trees can be unstable and benefit from ensembles.',
    hint: 'Which impurity criterion drives the choice of split at each node?',
    related: ['w11-information-gain', 'w11-recursive', 'w11-overfitting'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'At each node, trees choose the split that maximises which quantity?',
      answers: ['Information gain', 'Impurity reduction', 'Gini gain'],
      placeholder: 'Type the quantity…',
    },
  },
  {
    id: 'w11-overfitting',
    week: 11,
    topic: 'Overfitting',
    title: 'Overfitting',
    definition:
      'Fitting training data so closely that noise is learned as signal, producing excellent training performance and poor generalisation to new data.',
    keyFacts: [
      'Deep, unpruned trees memorise training rows',
      'Symptoms: near-perfect training score, weak validation score',
      'Fixes: depth limits, minimum leaf size, pruning, ensembling',
    ],
    example:
      'A tree grown to full depth achieves 100% training accuracy and 71% on holdout data — it learned individual customers, not patterns.',
    explanation:
      'Trees overfit easily because they can keep splitting until every leaf is pure. Complexity control is what makes them useful.',
    hint: 'One word: fitting noise so training performance exceeds generalisation.',
    related: ['w11-underfitting', 'w11-depth', 'w11-pruning'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What is it called when a model learns noise in the training data and performs poorly on unseen data?',
      answers: ['Overfitting', 'Over-fitting'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w11-underfitting',
    week: 11,
    topic: 'Overfitting',
    title: 'Underfitting',
    definition:
      'A model too simple to capture the underlying structure, performing poorly on both training and validation data.',
    keyFacts: [
      'High bias, low variance',
      'Caused by excessive constraints such as max depth 1',
      'Fixes: allow more depth, add informative features',
    ],
    example:
      'A single-split tree (a decision stump) on a strongly interacting problem misses nearly all structure.',
    explanation:
      'Underfitting and overfitting are the two failure directions of complexity; the right depth sits between them.',
    hint: 'One word: a model too simple to capture the signal, failing on both train and test.',
    related: ['w11-overfitting', 'w11-depth', 'w10-generalization'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What is it called when a model is too simple to capture the structure and performs poorly on both training and test data?',
      answers: ['Underfitting', 'Under-fitting'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w11-depth',
    week: 11,
    topic: 'Overfitting',
    title: 'Tree depth and complexity',
    definition:
      'Depth (and minimum samples per leaf) controls model complexity: shallow trees underfit, deep trees overfit, and the best depth is chosen on validation data.',
    keyFacts: [
      'max_depth is a direct complexity control',
      'min_samples_leaf controls minimum evidence per prediction',
      'Tune on validation folds, never on the test set',
    ],
    example:
      'Validation accuracy rises from depth 1 to 4 and falls after depth 7, indicating the overfitting region.',
    explanation:
      'Depth is a hyperparameter, so it must be selected by held-out performance rather than training accuracy.',
    hint: 'The hyperparameter (two words) that directly limits how deep a tree can grow.',
    related: ['w11-overfitting', 'w11-pruning', 'w11-underfitting'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which hyperparameter directly limits how many levels a decision tree can grow to?',
      answers: ['Maximum depth', 'Max depth', 'Tree depth', 'max_depth'],
      placeholder: 'Type the hyperparameter…',
    },
  },
  {
    id: 'w11-pruning',
    week: 11,
    topic: 'Pruning',
    title: 'Pruning',
    definition:
      'Removing branches that add little predictive value — before growth (pre-pruning) or after full growth (post-pruning) — to reduce variance and improve generalisation.',
    keyFacts: [
      'Pre-pruning: stop early using depth or sample limits',
      'Post-pruning: grow fully, then cut back using validation performance',
      'Cost-complexity pruning penalises number of leaves',
    ],
    example:
      'A fully grown tree is cut back to the subtree with the best validation accuracy, losing nothing on holdout data.',
    explanation:
      'Pruning trades a little training fit for stability on new data — the practical antidote to tree overfitting.',
    hint: 'One word for cutting back branches that do not improve generalisation.',
    related: ['w11-overfitting', 'w11-depth', 'w11-pros-cons'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What is the process of removing tree branches that add little predictive value in order to improve generalisation?',
      answers: ['Pruning', 'Tree pruning'],
      placeholder: 'Type the process…',
    },
  },
  {
    id: 'w11-pros-cons',
    week: 11,
    topic: 'Interpretability',
    title: 'Tree advantages and limitations',
    definition:
      'Trees are interpretable, need little preprocessing and capture non-linearities and interactions; but single trees are unstable, prone to overfitting and biased toward features with many levels.',
    keyFacts: [
      'No scaling or one-hot encoding required',
      'Handles mixed feature types and interactions naturally',
      'Small data changes can produce very different trees',
      'Ensembles (random forests, boosting) fix instability at the cost of interpretability',
    ],
    example:
      'A credit team uses a shallow tree because the rules are explainable to regulators, accepting lower accuracy than a gradient-boosted model.',
    explanation:
      'Interpretability is the main reason trees survive in regulated settings; instability is the main reason single trees rarely win benchmarks.',
    hint: 'Select every statement that is TRUE about decision trees.',
    related: ['w11-pruning', 'w10-linear-regression', 'w14-responsible-data'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every statement that is TRUE about decision trees.',
      options: [
        { id: 'a', label: 'They require feature scaling to work correctly', correct: false },
        { id: 'b', label: 'They can capture non-linear relationships and interactions', correct: true },
        { id: 'c', label: 'Single trees can be unstable to small changes in the data', correct: true },
        { id: 'd', label: 'Deep unpruned trees commonly overfit', correct: true },
        { id: 'e', label: 'They are always more accurate than linear regression', correct: false },
      ],
    },
  },
]
