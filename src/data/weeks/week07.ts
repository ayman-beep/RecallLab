import type { Concept, WeekModule } from '../../types'

export const week: WeekModule = {
  week: 7,
  title: 'Data Transformation and Advanced Cleaning',
  subtitle: 'Scaling, encoding, joining and leakage-free preprocessing',
  description:
    'Scale numeric features with min-max or z-score, encode categorical variables with label or one-hot encoding, join tables on keys, align schemas, and keep preprocessing leakage-free across the train/test boundary.',
  learningObjectives: [
    'Choose between min-max normalization and z-score standardization and state the effect of each.',
    'Choose between label encoding and one-hot encoding for nominal and ordinal variables.',
    'Join datasets on keys and predict how join type changes row counts.',
    'Explain data leakage and fit preprocessing only on training data.',
  ],
  topics: ['Feature scaling', 'Encoding', 'Joins and keys', 'Data leakage'],
  estimatedMinutes: 38,
  accent: '#f472b6',
}

export const concepts: Concept[] = [
  {
    id: 'w7-feature-scaling',
    week: 7,
    topic: 'Feature scaling',
    title: 'Feature scaling',
    definition:
      'Transforming numeric features onto a comparable range or distribution so that no variable dominates a distance-based or gradient-based model purely because of its units.',
    keyFacts: [
      'Purpose: comparability, not accuracy by itself',
      'Needed for k-NN, k-means, SVMs, PCA and gradient descent',
      'Not needed for decision trees and random forests',
    ],
    example:
      'Income (0–200,000) and age (18–90) feed a k-NN model; without scaling, income completely dominates the distance metric.',
    explanation:
      'Scaling changes units, not information. Tree models split on thresholds and are invariant to monotone rescaling, which is why they skip it.',
    hint: 'Two words: putting numeric features on comparable ranges before distance-based modelling.',
    related: ['w7-min-max', 'w7-zscore', 'w10-linear-regression'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What preprocessing step puts numeric features on a comparable range or distribution so units do not dominate a model?',
      answers: ['Feature scaling', 'Scaling', 'Normalization'],
      placeholder: 'Type the step…',
    },
  },
  {
    id: 'w7-min-max',
    week: 7,
    topic: 'Feature scaling',
    title: 'Min-max normalization',
    definition:
      'Rescaling each value to the interval [0, 1] using (x − min) / (max − min), preserving relative distances but not the shape of the distribution.',
    keyFacts: [
      'Bounded output: exactly 0 to 1',
      'Extremely sensitive to outliers — min and max are extremes',
      'Preserves the original distribution shape',
    ],
    example:
      'Ages 18–90 map to 0–1; adding one 250-year-old typo compresses every real value into a narrow band near 0.',
    explanation:
      'Bounded output is the selling point and the weakness. Use min-max when a fixed range matters and outliers are controlled.',
    hint: 'Two words, with hyphens in the formula name: scaling to exactly 0–1.',
    related: ['w7-zscore', 'w7-feature-scaling', 'w5-outlier'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which scaling method maps values to exactly the interval [0, 1] using (x − min) / (max − min)?',
      answers: ['Min-max normalization', 'Min-max scaling', 'Min max normalization', 'Minmax normalization'],
      placeholder: 'Type the method…',
    },
  },
  {
    id: 'w7-zscore',
    week: 7,
    topic: 'Feature scaling',
    title: 'Z-score standardization',
    definition:
      'Transforming values to (x − mean) / standard deviation so the feature has mean 0 and standard deviation 1, without bounding the range.',
    keyFacts: [
      'Centres on 0 with unit variance',
      'Values are unbounded (can exceed ±3)',
      'Less distorted by extreme values than min-max, though not immune',
    ],
    example:
      'Standardised income values of −1.8 and +2.4 keep their relative position and are directly comparable with standardised age.',
    explanation:
      'Z-scores express "how many standard deviations from the mean". Choose it when the model assumes roughly centred, unit-variance inputs.',
    hint: 'Two words: subtraction of the mean then division by the standard deviation.',
    related: ['w7-min-max', 'w8-standard-deviation', 'w12-gradient-descent'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which transformation subtracts the mean and divides by the standard deviation to give mean 0 and SD 1?',
      answers: ['Z-score standardization', 'Z-score', 'Standardization', 'Z score standardization'],
      placeholder: 'Type the method…',
    },
  },
  {
    id: 'w7-scaling-choice',
    week: 7,
    topic: 'Feature scaling',
    title: 'Choosing a scaler',
    definition:
      'Min-max gives a bounded range but is outlier-sensitive; z-score gives mean 0 / SD 1 and handles outliers better while remaining unbounded. Neither is universally correct.',
    keyFacts: [
      'Bounded output → min-max',
      'Centred, unit-variance input → z-score',
      'Both must be fitted on training data only',
    ],
    example:
      'For a neural network trained with gradient descent on features with different units, z-score is the safer default; for an image-like bounded signal, min-max is natural.',
    explanation:
      'The decision is driven by output range requirements and outlier sensitivity — not by which method sounds more advanced.',
    hint: 'Select the true statements about choosing between the two scalers.',
    related: ['w7-min-max', 'w7-zscore', 'w7-data-leakage'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every statement that is TRUE about scaling.',
      options: [
        { id: 'a', label: 'Min-max scaling is highly sensitive to outliers', correct: true },
        { id: 'b', label: 'Z-score standardization is bounded between -1 and 1', correct: false },
        { id: 'c', label: 'Scalers must be fitted on the training data only', correct: true },
        { id: 'd', label: 'Decision trees require feature scaling to work', correct: false },
        { id: 'e', label: 'Scaling changes the units, not the information content', correct: true },
      ],
    },
  },
  {
    id: 'w7-one-hot',
    week: 7,
    topic: 'Encoding',
    title: 'One-hot encoding',
    definition:
      'Representing a nominal variable as one binary column per category, with a 1 in the matching column, so no artificial ordering is introduced.',
    keyFacts: [
      'No implied order — safe for nominal variables',
      'Increases dimensionality (k new columns)',
      'High-cardinality features become sparse and unwieldy',
    ],
    example:
      'Payment method {card, cash, transfer} becomes three 0/1 columns; card is not "less than" cash.',
    explanation:
      'One-hot solves the false-ordering problem of label encoding at the cost of width and sparsity. Drop one column only if a linear model would be collinear.',
    hint: 'Two words (hyphenated): expanding each category into its own 0/1 column.',
    related: ['w7-label-encoding', 'w7-encoding-choice', 'w3-nominal-ordinal'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which encoding creates one binary column per category so that no artificial ordering is implied?',
      answers: ['One-hot encoding', 'One hot encoding', 'OneHot encoding', 'Dummy encoding'],
      placeholder: 'Type the encoding…',
    },
  },
  {
    id: 'w7-label-encoding',
    week: 7,
    topic: 'Encoding',
    title: 'Label encoding',
    definition:
      'Mapping each category to a distinct integer, which is compact and preserves order but introduces a false numeric ordering for nominal variables.',
    keyFacts: [
      'One column, integers 0..k−1',
      'Appropriate for ordinal categories and tree-based models',
      'Risky for nominal data in linear or distance-based models',
    ],
    example:
      'Size {small, medium, large} → {0, 1, 2} is sensible because order is real; {red, green, blue} → {0, 1, 2} is not.',
    explanation:
      'The deciding question is whether order exists in the variable, not whether the model tolerates integers.',
    hint: 'Two words: mapping categories to integer codes.',
    related: ['w7-one-hot', 'w7-encoding-choice', 'w3-nominal-ordinal'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which encoding maps each category to a distinct integer and therefore implies an ordering?',
      answers: ['Label encoding', 'LabelEncoding', 'Ordinal encoding', 'Integer encoding'],
      placeholder: 'Type the encoding…',
    },
  },
  {
    id: 'w7-encoding-choice',
    week: 7,
    topic: 'Encoding',
    title: 'Choosing an encoding',
    definition:
      'Ordinal categories can use label/ordinal encoding because the order is real; nominal categories should use one-hot encoding (or target/embeddings for high cardinality).',
    keyFacts: [
      'Nominal → one-hot to avoid false order',
      'Ordinal → integers reflecting the true order',
      'High cardinality → hashing, target encoding or embeddings',
    ],
    example:
      'Education level → ordinal codes; city → one-hot if few, else target encoding with leakage-safe cross-fitting.',
    explanation:
      'Match the encoding to the measurement scale first, then to model type and cardinality.',
    hint: 'Assign each feature to the encoding it needs.',
    related: ['w7-one-hot', 'w7-label-encoding', 'w3-measurement-scales'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'assign',
      prompt: 'Assign each feature to the encoding that suits it best.',
      categories: [
        { id: 'onehot', label: 'One-hot encoding' },
        { id: 'ordinal', label: 'Label / ordinal encoding' },
      ],
      items: [
        { id: 'a', label: 'Country of birth (no natural order)', categoryId: 'onehot' },
        { id: 'b', label: 'Customer tier: bronze < silver < gold', categoryId: 'ordinal' },
        { id: 'c', label: 'Preferred payment method', categoryId: 'onehot' },
        { id: 'd', label: 'Risk band: low < medium < high', categoryId: 'ordinal' },
      ],
    },
  },
  {
    id: 'w7-joins',
    week: 7,
    topic: 'Joins and keys',
    title: 'Joining datasets',
    definition:
      'Combining two tables on a shared key: inner keeps matching rows only, left keeps all left rows, right keeps all right rows, and outer keeps all rows from both.',
    keyFacts: [
      'Join type determines which unmatched rows survive',
      'Many-to-many joins can multiply row counts',
      'Always verify row count and key uniqueness after joining',
    ],
    example:
      'A left join from orders to customers keeps every order, filling nulls for customers missing from the reference table.',
    explanation:
      'Joins fail silently: a duplicated key on the right multiplies rows and inflates every downstream aggregate. Validate the key first.',
    hint: 'Complete the sentence with the join types.',
    related: ['w7-keys', 'w7-schema-alignment', 'w4-observational-unit'],
    difficulty: 'core',
    drill: {
      mode: 'cloze',
      prompt: 'Complete the description of join behaviour.',
      template:
        'An ___ join keeps only rows with a match in both tables, while a ___ join keeps every row from the left table regardless of a match.',
      blanks: [{ answers: ['inner'] }, { answers: ['left', 'left outer'] }],
    },
  },
  {
    id: 'w7-keys',
    week: 7,
    topic: 'Joins and keys',
    title: 'Primary and foreign keys',
    definition:
      'A primary key uniquely identifies each row in a table; a foreign key is a column in another table that references a primary key, expressing a relationship.',
    keyFacts: [
      'Primary key: unique and non-null',
      'Foreign key: may repeat and may be null',
      'Keys define the grain and enable relational joins',
    ],
    example:
      'customers.customer_id is a primary key; orders.customer_id is a foreign key referencing it, many orders per customer.',
    explanation:
      'The one-to-many structure is expressed by key placement. Duplicate primary keys signal a grain problem, not a join problem.',
    hint: 'Two words: the column that uniquely identifies rows in a table.',
    related: ['w7-joins', 'w3-graph-data', 'w4-observational-unit'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What do we call the column that uniquely identifies each row of a table?',
      answers: ['Primary key', 'Primary key (PK)'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w7-schema-alignment',
    week: 7,
    topic: 'Joins and keys',
    title: 'Schema alignment',
    definition:
      'Harmonising column names, data types, units, category spellings and key formats across sources before combining them.',
    keyFacts: [
      'Mismatched units silently double or scale values',
      'Key formats differ: leading zeros, casing, padding',
      'Align categories before the join, not after',
    ],
    example:
      'One source stores dates as DD/MM/YYYY and another as ISO; joining without alignment misfires for most of the month.',
    explanation:
      'Most join surprises are schema problems. Alignment is cheap before the join and expensive afterwards.',
    hint: 'Two words: making column names, types, units and keys consistent across sources.',
    related: ['w7-joins', 'w5-inconsistent-formats', 'w7-inconsistent-categories'],
    difficulty: 'advanced',
    drill: {
      mode: 'short',
      prompt:
        'What process harmonises column names, data types, units and key formats before tables are combined?',
      answers: ['Schema alignment', 'Schema harmonisation', 'Schema harmonization', 'Data alignment'],
      placeholder: 'Type the process…',
    },
  },
  {
    id: 'w7-inconsistent-categories',
    week: 7,
    topic: 'Encoding',
    title: 'Handling inconsistent categories',
    definition:
      'Mapping variant spellings, capitalisations and legacy codes of the same category to one canonical value using an explicit, documented mapping.',
    keyFacts: [
      'Fuzzy merging risks combining genuinely distinct categories',
      'Keep the mapping table in version control',
      'Recount category frequencies after normalising',
    ],
    example:
      '{"MY", "Malaysia", "malaysia "} collapse into "Malaysia"; {"MY" as Myanmar} would be an error to merge blindly.',
    explanation:
      'Canonicalisation is a modelling decision. Documenting the mapping makes it reproducible and reviewable.',
    hint: 'Two words: the mapping that turns variant spellings into one canonical value.',
    related: ['w5-inconsistent-formats', 'w7-schema-alignment', 'w7-encoding-choice'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What kind of explicit mapping turns variant spellings of the same category into one canonical value?',
      answers: ['Category mapping', 'Canonical mapping', 'Canonicalisation', 'Canonicalization', 'Value mapping'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w7-data-leakage',
    week: 7,
    topic: 'Data leakage',
    title: 'Data leakage',
    definition:
      'Information from outside the training data — often from the test set or the future — influencing model training or preprocessing, producing performance that does not hold in production.',
    keyFacts: [
      'Fit scalers, imputers and encoders on training data only',
      'Target leakage uses a feature that encodes the outcome',
      'Symptoms: suspiciously high validation scores that collapse in production',
    ],
    example:
      'Computing the mean income over the full dataset and using it to fill missing values leaks test-set information into training.',
    explanation:
      'Leakage is the single most damaging preprocessing bug because it is invisible at evaluation time. The rule: split first, then fit transformers on train only.',
    hint: 'Two words for information from test data or the future contaminating training.',
    related: ['w7-fit-transform', 'w7-train-test', 'w10-generalization'],
    difficulty: 'advanced',
    drill: {
      mode: 'short',
      prompt:
        'What is it called when information from the test set or the future influences model training or preprocessing?',
      answers: ['Data leakage', 'Leakage', 'Target leakage'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w7-train-test',
    week: 7,
    topic: 'Data leakage',
    title: 'Train/test separation',
    definition:
      'Holding out a portion of the data, untouched during preprocessing, feature selection and training, so that final performance reflects generalisation to unseen cases.',
    keyFacts: [
      'Split before any fitted transformation',
      'The test set is used once for the final estimate',
      'Cross-validation inside the training set guides model choices',
    ],
    example:
      'An 80/20 split is made first; the scaler is fitted on the 80% and both parts are transformed with those parameters.',
    explanation:
      'The ordering is what matters: split → fit on train → transform both. Reversing it invalidates the estimate.',
    hint: 'Two words: the holdout procedure that measures generalisation to unseen cases.',
    related: ['w7-data-leakage', 'w7-fit-transform', 'w10-generalization'],
    difficulty: 'advanced',
    drill: {
      mode: 'short',
      prompt:
        'What procedure holds out part of the data, untouched by training, to estimate performance on unseen cases?',
      answers: ['Train/test split', 'Train test split', 'Holdout', 'Hold-out', 'Holdout split'],
      placeholder: 'Type the procedure…',
    },
  },
  {
    id: 'w7-fit-transform',
    week: 7,
    topic: 'Data leakage',
    title: 'Fit vs transform',
    definition:
      'Fitting learns transformation parameters (min, max, mean, standard deviation, categories) from data; transforming applies those learned parameters. Fit only on training data, then transform train and test.',
    keyFacts: [
      'fit → learn parameters; transform → apply them',
      'fit_transform on the training set only',
      'Test data must be transformed with the training parameters',
    ],
    example:
      'StandardScaler.fit(X_train) learns μ and σ; .transform(X_test) applies them so the test set never influences scaling.',
    explanation:
      'Understanding fit/transform is the practical cure for leakage. Any step that "learns" from data must see only the training portion.',
    hint: 'Select the statements that keep preprocessing leakage-free.',
    related: ['w7-data-leakage', 'w7-train-test', 'w2-code-review'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every statement that is TRUE about leakage-free preprocessing.',
      options: [
        { id: 'a', label: 'A scaler should be fitted only on the training set', correct: true },
        { id: 'b', label: 'The test set should be transformed using parameters learned on the training set', correct: true },
        { id: 'c', label: 'Fitting an imputer on all data improves the honesty of the evaluation', correct: false },
        { id: 'd', label: 'Features derived from the target variable are a form of leakage', correct: true },
        { id: 'e', label: 'Leakage usually shows up as suspiciously good test scores', correct: true },
      ],
    },
  },
]
