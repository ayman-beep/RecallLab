import type { Concept, WeekModule } from '../../types'

export const week: WeekModule = {
  week: 12,
  title: 'Neural Networks and Deep Learning',
  subtitle: 'Layers, activations, loss and how networks learn',
  description:
    'Build a mental model of a neural network: input, hidden and output layers; weights, biases and forward propagation; ReLU, sigmoid and softmax activations; loss functions, backpropagation and gradient descent; learning rates, training dynamics and regularisation.',
  learningObjectives: [
    'Describe the components of a feed-forward neural network.',
    'Explain forward propagation and the role of weights, biases and activation functions.',
    'Choose an appropriate activation for hidden and output layers.',
    'Explain backpropagation and gradient descent, and how learning rate and regularisation affect training.',
  ],
  topics: ['Architecture', 'Forward propagation', 'Activations', 'Loss and backprop', 'Optimisation', 'Regularisation'],
  estimatedMinutes: 44,
  accent: '#818cf8',
}

export const concepts: Concept[] = [
  {
    id: 'w12-layers',
    week: 12,
    topic: 'Architecture',
    title: 'Input, hidden and output layers',
    definition:
      'A feed-forward network has an input layer (the features), one or more hidden layers that transform the representation, and an output layer that produces the prediction.',
    keyFacts: [
      'Input layer size = number of features',
      'Hidden layers learn intermediate representations',
      'Output layer size/shape depends on the task',
      'Depth = number of hidden layers',
    ],
    example:
      'A 30-feature churn model with layers 30 → 16 → 8 → 1 has two hidden layers and a single probability output.',
    explanation:
      'Hidden layers are where representation learning happens — each layer composes the previous layer’s features into more abstract ones.',
    hint: 'Complete the sentence naming the three layer types.',
    related: ['w12-neuron', 'w12-forward-prop', 'w1-deep-learning'],
    difficulty: 'intro',
    drill: {
      mode: 'cloze',
      prompt: 'Complete the description of network architecture.',
      template:
        'Features enter through the ___ layer, transformations happen in ___ layers, and the prediction is produced by the ___ layer.',
      blanks: [
        { answers: ['input'] },
        { answers: ['hidden'] },
        { answers: ['output'] },
      ],
    },
  },
  {
    id: 'w12-neuron',
    week: 12,
    topic: 'Architecture',
    title: 'Weights and biases',
    definition:
      'Each connection has a weight scaling its input, and each neuron has a bias shifting its activation — together they form the parameters learned during training.',
    keyFacts: [
      'Weight = importance of an incoming connection',
      'Bias = offset that shifts the activation threshold',
      'Parameters = all weights + all biases',
    ],
    example:
      'A neuron computes w₁x₁ + w₂x₂ + b; training adjusts w₁, w₂ and b to reduce the loss.',
    explanation:
      'Weights determine the strength and sign of each input’s influence; the bias lets the neuron fire even when all inputs are zero.',
    hint: 'Two words: the learned scaling factors on connections and the offset per neuron.',
    related: ['w12-forward-prop', 'w12-gradient-descent', 'w10-linear-regression'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What is the learned offset added to the weighted sum inside each neuron called?',
      answers: ['Bias'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w12-forward-prop',
    week: 12,
    topic: 'Forward propagation',
    title: 'Forward propagation',
    definition:
      'The pass through the network from inputs to output where each layer computes a weighted sum of its inputs plus a bias and applies an activation function.',
    keyFacts: [
      'Data flows input → output only',
      'Produces the prediction used to compute loss',
      'No parameter updates happen during the forward pass',
    ],
    example:
      'Input features are multiplied by layer-1 weights, passed through ReLU, then combined by layer 2 to produce the output probability.',
    explanation:
      'Forward propagation is inference inside training: it produces ŷ, which the loss then compares with y before gradients flow back.',
    hint: 'Two words: the input-to-output computation that produces a prediction.',
    related: ['w12-backprop', 'w12-layers', 'w12-activation'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What is the process of computing a network’s prediction by passing inputs forward through the layers called?',
      answers: ['Forward propagation', 'Forward pass', 'Forwardpropagation'],
      placeholder: 'Type the process…',
    },
  },
  {
    id: 'w12-activation',
    week: 12,
    topic: 'Activations',
    title: 'Activation function',
    definition:
      'A non-linear function applied to a neuron’s weighted sum, enabling the network to model non-linear relationships.',
    keyFacts: [
      'Without non-linearity, stacked layers collapse into one linear function',
      'Common choices: ReLU, sigmoid, tanh, softmax',
      'Choice depends on layer position and task',
    ],
    example:
      'Two stacked linear layers with no activation are algebraically equivalent to a single linear layer.',
    explanation:
      'The non-linearity is the entire reason depth helps. Removing it removes the network’s expressive power.',
    hint: 'Two words: the non-linear function applied after the weighted sum.',
    related: ['w12-relu', 'w12-sigmoid', 'w12-softmax'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What kind of function is applied to a neuron’s weighted sum to let networks model non-linear relationships?',
      answers: ['Activation function', 'Activation', 'Non-linear activation'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w12-relu',
    week: 12,
    topic: 'Activations',
    title: 'ReLU',
    definition:
      'The Rectified Linear Unit, f(x) = max(0, x): it passes positive values unchanged and outputs zero for negatives, and is the default activation in hidden layers.',
    keyFacts: [
      'Cheap to compute and helps gradients flow',
      'Outputs are unbounded above',
      'Can suffer "dying ReLU" when units output zero permanently',
    ],
    example:
      'A hidden neuron receiving −1.4 outputs 0, while one receiving 2.7 outputs 2.7 unchanged.',
    explanation:
      'ReLU dominates deep hidden layers because it avoids sigmoid saturation and is fast. Its limitation is unbounded output, so it is not used for probabilities.',
    hint: 'Four letters: max(0, x), the standard hidden-layer activation.',
    related: ['w12-sigmoid', 'w12-softmax', 'w12-activation'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which activation function outputs max(0, x) and is the usual default for hidden layers?',
      answers: ['ReLU', 'Rectified Linear Unit', 'Rectified linear unit'],
      placeholder: 'Type the activation…',
    },
  },
  {
    id: 'w12-sigmoid',
    week: 12,
    topic: 'Activations',
    title: 'Sigmoid',
    definition:
      'A function mapping any real value into (0, 1): σ(x) = 1 / (1 + e⁻ˣ), used for binary output probabilities.',
    keyFacts: [
      'Squashes to (0, 1) — interpretable as a probability',
      'Saturates at the extremes, shrinking gradients',
      'Common in the output layer of binary classifiers',
    ],
    example:
      'A binary spam classifier ends with a sigmoid, outputting 0.93 for "spam".',
    explanation:
      'Sigmoid’s bounded range suits binary probabilities but slows deep hidden layers through saturation — hence ReLU there.',
    hint: 'The S-shaped activation used for binary probability outputs.',
    related: ['w12-softmax', 'w12-relu', 'w12-output-choice'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which S-shaped activation maps values into (0, 1) and is used for binary probability outputs?',
      answers: ['Sigmoid', 'Sigmoid function', 'Logistic function', 'Logistic'],
      placeholder: 'Type the activation…',
    },
  },
  {
    id: 'w12-softmax',
    week: 12,
    topic: 'Activations',
    title: 'Softmax',
    definition:
      'A function converting a vector of raw scores into a probability distribution over classes that sums to 1, used for multi-class outputs.',
    keyFacts: [
      'Outputs are non-negative and sum to exactly 1',
      'Used for mutually exclusive multi-class classification',
      'Uses cross-entropy loss in training',
    ],
    example:
      'Scores [2.0, 1.0, 0.1] become roughly [0.66, 0.24, 0.10], a distribution over three classes.',
    explanation:
      'Softmax generalises sigmoid to many mutually exclusive classes. For multi-label problems, independent sigmoids are used instead.',
    hint: 'One word: the activation that turns scores into a probability distribution over classes.',
    related: ['w12-sigmoid', 'w12-output-choice', 'w13-confusion-matrix'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which activation converts a vector of scores into a probability distribution over mutually exclusive classes that sums to one?',
      answers: ['Softmax', 'Softmax function'],
      placeholder: 'Type the activation…',
    },
  },
  {
    id: 'w12-output-choice',
    week: 12,
    topic: 'Activations',
    title: 'Choosing activations',
    definition:
      'Hidden layers: ReLU (or a variant). Binary output: sigmoid. Multi-class output: softmax. Regression output: linear (no activation).',
    keyFacts: [
      'Output activation follows the target type',
      'Regression outputs stay unbounded',
      'Hidden activation is about optimisation, not probability',
    ],
    example:
      'Predicting a price uses a linear output; predicting one of five product categories uses softmax.',
    explanation:
      'Two different questions: what shape must the output take (probabilities or a number), and what trains fastest in hidden layers.',
    hint: 'Assign each task to the activation that suits its output layer.',
    related: ['w12-relu', 'w12-sigmoid', 'w12-softmax'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'assign',
      prompt: 'Assign each output requirement to the correct activation.',
      categories: [
        { id: 'relu', label: 'ReLU' },
        { id: 'sigmoid', label: 'Sigmoid' },
        { id: 'softmax', label: 'Softmax' },
        { id: 'linear', label: 'Linear (none)' },
      ],
      items: [
        { id: 'a', label: 'Hidden layer of a deep network', categoryId: 'relu' },
        { id: 'b', label: 'Binary churn probability', categoryId: 'sigmoid' },
        { id: 'c', label: 'One of six product classes', categoryId: 'softmax' },
        { id: 'd', label: 'Predicted delivery time in minutes', categoryId: 'linear' },
      ],
    },
  },
  {
    id: 'w12-loss',
    week: 12,
    topic: 'Loss and backprop',
    title: 'Loss function',
    definition:
      'A function that quantifies the error between predictions and true targets and provides the objective the optimiser minimises.',
    keyFacts: [
      'Regression: MSE or MAE',
      'Binary classification: binary cross-entropy',
      'Multi-class: categorical cross-entropy',
      'The loss defines what "better" means',
    ],
    example:
      'Binary cross-entropy heavily penalises confident wrong predictions, e.g. predicting 0.02 for a true positive.',
    explanation:
      'The loss must match the task. Minimising MSE on class labels is technically possible but statistically wrong for probabilities.',
    hint: 'Two words: the function that measures prediction error and defines the training objective.',
    related: ['w10-mse', 'w12-gradient-descent', 'w12-backprop'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What is the function that measures the error between predictions and targets and defines the training objective called?',
      answers: ['Loss function', 'Cost function', 'Objective function'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w12-backprop',
    week: 12,
    topic: 'Loss and backprop',
    title: 'Backpropagation',
    definition:
      'The algorithm that computes the gradient of the loss with respect to every weight by applying the chain rule backwards from the output layer.',
    keyFacts: [
      'Uses the chain rule of calculus',
      'Computes gradients layer by layer, output → input',
      'Efficient: one backward pass yields all parameter gradients',
    ],
    example:
      'After a forward pass produces a large loss, backprop assigns larger gradients to the weights that contributed most to the error.',
    explanation:
      'Backpropagation computes gradients; gradient descent uses them. Confusing the two is a standard exam trap.',
    hint: 'One word: the backward chain-rule pass that computes gradients.',
    related: ['w12-gradient-descent', 'w12-forward-prop', 'w12-learning-rate'],
    difficulty: 'advanced',
    drill: {
      mode: 'short',
      prompt:
        'Which algorithm computes the gradient of the loss with respect to each weight by applying the chain rule backwards through the network?',
      answers: ['Backpropagation', 'Backprop', 'Back-propagation'],
      placeholder: 'Type the algorithm…',
    },
  },
  {
    id: 'w12-gradient-descent',
    week: 12,
    topic: 'Optimisation',
    title: 'Gradient descent',
    definition:
      'An iterative optimisation method that updates parameters in the direction opposite to the gradient of the loss, reducing error step by step.',
    keyFacts: [
      'Update rule: w ← w − η ∂L/∂w',
      'Full-batch, mini-batch or stochastic variants',
      'Following the negative gradient reduces the loss locally',
    ],
    example:
      'With learning rate 0.01, a weight moves slightly against its gradient on every mini-batch.',
    explanation:
      'Gradient descent is the update rule; backpropagation supplies the gradients. Together they are how networks learn.',
    hint: 'Two words: the iterative update that steps against the loss gradient.',
    related: ['w12-backprop', 'w12-learning-rate', 'w10-ols'],
    difficulty: 'advanced',
    drill: {
      mode: 'short',
      prompt:
        'Which optimisation method updates parameters by stepping in the direction opposite to the loss gradient?',
      answers: ['Gradient descent', 'Gradient Descent', 'SGD'],
      placeholder: 'Type the method…',
    },
  },
  {
    id: 'w12-learning-rate',
    week: 12,
    topic: 'Optimisation',
    title: 'Learning rate',
    definition:
      'The step size η applied to gradients during parameter updates; too large causes divergence or oscillation, too small makes training slow or stuck.',
    keyFacts: [
      'Controls how far each update moves',
      'Too high → unstable loss, overshooting minima',
      'Too low → very slow convergence',
      'Schedules and adaptive optimisers (Adam) tune it over time',
    ],
    example:
      'A loss that jumps between 0.7 and 4.1 every epoch is the classic symptom of a learning rate that is too high.',
    explanation:
      'The learning rate is the most consequential training hyperparameter. Diagnosing it from the loss curve is a core practical skill.',
    hint: 'Two words: the step size multiplying the gradient in an update.',
    related: ['w12-gradient-descent', 'w12-training', 'w12-backprop'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What hyperparameter sets the step size applied to the gradient during each parameter update?',
      answers: ['Learning rate', 'Learning rate (eta)', 'Step size'],
      placeholder: 'Type the hyperparameter…',
    },
  },
  {
    id: 'w12-training',
    week: 12,
    topic: 'Optimisation',
    title: 'Training and generalisation',
    definition:
      'Training minimises loss on training data; generalisation is performance on unseen data. Networks train by alternating forward passes, loss computation, backpropagation and parameter updates across epochs.',
    keyFacts: [
      'Epoch = one full pass over the training set',
      'Mini-batch = subset used for one update',
      'Validation loss detects overfitting during training',
      'Diverging train/validation curves signal overfitting',
    ],
    example:
      'Training loss falls to 0.05 while validation loss rises after epoch 12 — the model is overfitting and should have stopped earlier.',
    explanation:
      'Monitoring both curves is how you choose when to stop, how much to regularise and whether the learning rate is sane.',
    hint: 'What do we call one complete pass of the training data?',
    related: ['w12-learning-rate', 'w12-regularization', 'w11-overfitting'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What is one complete pass of the entire training dataset through the network called?',
      answers: ['Epoch'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w12-regularization',
    week: 12,
    topic: 'Regularisation',
    title: 'Regularisation',
    definition:
      'Techniques that constrain model complexity to reduce overfitting: weight decay (L1/L2), dropout, early stopping, data augmentation and smaller architectures.',
    keyFacts: [
      'Dropout randomly deactivates units during training',
      'L2 weight decay penalises large weights',
      'Early stopping halts when validation loss worsens',
      'More data is often the strongest regulariser',
    ],
    example:
      'Adding dropout 0.3 to a dense layer lowers validation loss even though training loss rises slightly.',
    explanation:
      'Regularisation deliberately trades training fit for generalisation — the same logic as pruning a decision tree.',
    hint: 'One word for techniques such as dropout and weight decay that constrain complexity.',
    related: ['w11-pruning', 'w12-training', 'w12-regularization-check'],
    difficulty: 'advanced',
    drill: {
      mode: 'short',
      prompt:
        'What general term covers techniques such as dropout, weight decay and early stopping that reduce overfitting?',
      answers: ['Regularization', 'Regularisation', 'Regularizers'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w12-regularization-check',
    week: 12,
    topic: 'Regularisation',
    title: 'Diagnosing training problems',
    definition:
      'High training AND validation loss → underfitting/capacity issue. Low training loss but high validation loss → overfitting. Unstable loss → learning rate too high.',
    keyFacts: [
      'Both high → add capacity or better features',
      'Train low / validation high → regularise or simplify',
      'Oscillating loss → lower the learning rate',
    ],
    example:
      'Training accuracy 99%, validation accuracy 62% is overfitting, not a data-quality mystery.',
    explanation:
      'Read the pair of curves together. A single number cannot distinguish underfitting from overfitting.',
    hint: 'Select every statement that correctly diagnoses a training pathology.',
    related: ['w12-training', 'w12-regularization', 'w11-overfitting'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every statement that is TRUE about training diagnostics.',
      options: [
        { id: 'a', label: 'Very low training loss with high validation loss indicates overfitting', correct: true },
        { id: 'b', label: 'A loss that oscillates wildly suggests the learning rate is too high', correct: true },
        { id: 'c', label: 'High loss on both train and validation means overfitting', correct: false },
        { id: 'd', label: 'Early stopping monitors validation loss to decide when to stop', correct: true },
        { id: 'e', label: 'Backpropagation updates weights directly without gradients', correct: false },
      ],
    },
  },
]
