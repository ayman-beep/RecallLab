import type { Concept, WeekModule } from '../../types'

export const week: WeekModule = {
  week: 4,
  title: 'Tidy Data and Research Questions',
  subtitle: 'Structuring datasets and framing questions that can be answered',
  description:
    'Apply the three tidy-data rules, identify observational units and variables, recognise messy layouts, and classify analytical questions as descriptive, diagnostic, predictive or prescriptive.',
  learningObjectives: [
    'State the three rules of tidy data and apply them to a messy dataset.',
    'Identify the observational unit and the variables in a table.',
    'Recognise common ways datasets are messy and how to reshape them.',
    'Classify questions as descriptive, diagnostic, predictive or prescriptive and match them to appropriate goals.',
  ],
  topics: ['Tidy data', 'Observational units', 'Messy data', 'Question types'],
  estimatedMinutes: 32,
  accent: '#fbbf24',
}

export const concepts: Concept[] = [
  {
    id: 'w4-tidy-data',
    week: 4,
    topic: 'Tidy data',
    title: 'Tidy data rules',
    definition:
      'A tidy dataset has each variable as a column, each observation as a row and each observational unit as a table.',
    keyFacts: [
      'Each variable forms a column',
      'Each observation forms a row',
      'Each observational unit forms a table',
    ],
    example:
      'Cases (country, year, cases) is tidy. The same data with one column per year is not, because the variable "year" is spread across columns.',
    explanation:
      'Tidy is a structural convention that makes downstream operations predictable: filtering, grouping and joining all assume one variable per column. It is not a claim about cleanliness of values.',
    hint: 'Complete all three rules of the tidy-data convention.',
    related: ['w4-observational-unit', 'w4-messy-data', 'w3-structured-data'],
    difficulty: 'intro',
    drill: {
      mode: 'cloze',
      prompt: 'Complete the three rules of tidy data.',
      template:
        'Each ___ forms a column, each ___ forms a row, and each observational ___ forms a table.',
      blanks: [{ answers: ['variable'] }, { answers: ['observation'] }, { answers: ['unit'] }],
    },
  },
  {
    id: 'w4-observational-unit',
    week: 4,
    topic: 'Observational units',
    title: 'Observational unit',
    definition:
      'The individual entity that a single row describes — for example one customer, one order or one store-day.',
    keyFacts: [
      'Answers "what does one row mean?"',
      'Determines the correct grain of the table',
      'Mixing units in one table breaks tidy rules',
    ],
    example:
      'In a store-day table, each row is one store on one date; aggregating orders into the same row without declaring the grain creates double counting.',
    explanation:
      'Identify the unit before any aggregation. Most "wrong number" bugs are really grain bugs: rows describe different units than the analysis assumes.',
    hint: 'Two words: the entity that one row represents.',
    related: ['w4-tidy-data', 'w4-messy-data', 'w7-joins-keys'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What is the entity that a single row of a table represents called?',
      answers: ['Observational unit', 'Unit of observation', 'Observation unit'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w4-messy-data',
    week: 4,
    topic: 'Messy data',
    title: 'Messy data',
    definition:
      'Data whose layout violates tidy rules — for example one column holding several variables, values hidden in column headers, or multiple observational units in one table.',
    keyFacts: [
      'Common forms: wide layouts, merged cells, header-encoded values',
      'Tidy verbs fix it: pivot longer/wider, split columns, separate tables',
      'Messy is about structure; dirty is about values',
    ],
    example:
      'Columns q1_sales, q2_sales, q3_sales encode a quarter variable in the header; pivoting longer yields quarter and sales columns.',
    explanation:
      'Distinguish messy (wrong shape) from dirty (wrong values such as duplicates or typos). They require different fixes and different weeks in this course.',
    hint: 'Select every statement that describes a genuinely messy layout.',
    related: ['w4-tidy-data', 'w5-missing-data', 'w7-encoding'],
    difficulty: 'core',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every situation that violates the tidy-data rules.',
      options: [
        { id: 'a', label: 'One column stores "country_year" as a single combined value', correct: true },
        { id: 'b', label: 'Quarter is encoded in three separate sales columns', correct: true },
        { id: 'c', label: 'A numeric column contains one missing value', correct: false },
        { id: 'd', label: 'Two different observational units share one table', correct: true },
        { id: 'e', label: 'A column contains values with inconsistent capitalisation', correct: false },
      ],
    },
  },
  {
    id: 'w4-wide-long',
    week: 4,
    topic: 'Messy data',
    title: 'Wide vs long format',
    definition:
      'Wide format spreads one variable across columns (revenue_2023, revenue_2024); long format stores it as rows (year, revenue). Long is tidy when year and revenue are separate variables.',
    keyFacts: [
      'Long = one row per observation of the unit-variable combination',
      'Wide is often convenient for humans, long for software',
      'Reshape with pivot_longer / pivot_wider or melt / cast',
    ],
    example:
      'Wide: one row per store with a column per month. Long: one row per store-month.',
    explanation:
      'Neither format is universally better; tidy depends on which of them keeps one variable per column for your analysis grain.',
    hint: 'Two words — the format where a variable is spread across many columns.',
    related: ['w4-tidy-data', 'w4-messy-data', 'w8-boxplot'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What format spreads a variable such as year across multiple columns instead of storing it in one column with more rows?',
      answers: ['Wide format', 'Wide'],
      placeholder: 'Type the format…',
    },
  },
  {
    id: 'w4-descriptive',
    week: 4,
    topic: 'Question types',
    title: 'Descriptive question',
    definition:
      'A question that summarises what happened or what the data currently shows, without claiming causes or predictions.',
    keyFacts: [
      'Answers: what, how many, how often',
      'Typically answered with aggregation and visualisation',
      'No causal claim is implied',
    ],
    example:
      '"How many orders were returned last quarter, and in which regions?" is descriptive.',
    explanation:
      'Descriptive work is the foundation of analytics. It becomes inadequate only when the decision needs explanation or forecasting.',
    hint: 'The question type that summarises what happened without explaining why or predicting.',
    related: ['w4-diagnostic', 'w4-predictive', 'w4-question-types'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'Which type of analytical question summarises what happened or what the data shows, without explaining why?',
      answers: ['Descriptive', 'Descriptive question', 'Descriptive analytics'],
      placeholder: 'Type the question type…',
    },
  },
  {
    id: 'w4-diagnostic',
    week: 4,
    topic: 'Question types',
    title: 'Diagnostic question',
    definition:
      'A question that asks why something happened, investigating drivers, relationships and causes behind an observed pattern.',
    keyFacts: [
      'Answers: why, what caused it',
      'Uses segmentation, correlation and controlled comparisons',
      'Careful: evidence of association is not proof of causation',
    ],
    example:
      '"Why did returns spike in the northern region in June?" is diagnostic.',
    explanation:
      'Diagnostic analysis moves from observation to explanation. It requires comparing groups and ruling out confounders rather than asserting a story.',
    hint: 'The question type that asks why an observed pattern occurred.',
    related: ['w4-descriptive', 'w9-correlation-causation', 'w4-question-types'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which type of question investigates why an observed pattern occurred by examining drivers and relationships?',
      answers: ['Diagnostic', 'Diagnostic question', 'Diagnostic analytics'],
      placeholder: 'Type the question type…',
    },
  },
  {
    id: 'w4-predictive',
    week: 4,
    topic: 'Question types',
    title: 'Predictive question',
    definition:
      'A question that asks what will happen for new or future cases, answered with statistical or machine-learning models trained on past data.',
    keyFacts: [
      'Answers: what is likely to happen',
      'Relies on generalisation, not memorisation',
      'Outputs a prediction with some error or uncertainty',
    ],
    example:
      '"Which current subscribers are most likely to cancel next month?" is predictive.',
    explanation:
      'Prediction optimises for accuracy on unseen cases, which is why train/test separation matters. It still does not explain causes.',
    hint: 'The question type answered by training a model to estimate future or unseen outcomes.',
    related: ['w4-prescriptive', 'w10-supervised-learning', 'w10-generalization'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which type of question asks what is likely to happen for new or future cases, answered by a trained model?',
      answers: ['Predictive', 'Predictive question', 'Predictive analytics'],
      placeholder: 'Type the question type…',
    },
  },
  {
    id: 'w4-prescriptive',
    week: 4,
    topic: 'Question types',
    title: 'Prescriptive question',
    definition:
      'A question that asks what action should be taken, combining predictions with objectives, constraints and trade-offs to recommend a decision.',
    keyFacts: [
      'Answers: what should we do',
      'Adds optimisation or decision rules on top of prediction',
      'Must state the objective and the constraints explicitly',
    ],
    example:
      '"Which 500 customers should receive the retention discount to maximise saved revenue within budget?" is prescriptive.',
    explanation:
      'Prescriptive work is decision-focused. A prediction alone is not a recommendation — the objective and constraints have to be defined.',
    hint: 'The question type that recommends an action under constraints.',
    related: ['w4-predictive', 'w14-recommendations', 'w4-question-types'],
    difficulty: 'advanced',
    drill: {
      mode: 'short',
      prompt:
        'Which type of question recommends the best action given an objective and constraints?',
      answers: ['Prescriptive', 'Prescriptive question', 'Prescriptive analytics'],
      placeholder: 'Type the question type…',
    },
  },
  {
    id: 'w4-question-types',
    week: 4,
    topic: 'Question types',
    title: 'Matching questions to goals',
    definition:
      'The four question types form a ladder: describe what happened, diagnose why, predict what will happen, prescribe what to do. The goal determines which is appropriate.',
    keyFacts: [
      'Descriptive and diagnostic use observed data',
      'Predictive requires a target and enough historical examples',
      'Prescriptive requires a decision space and objective function',
    ],
    example:
      'A team unsure whether churn is rising needs descriptive work first; recommending discounts needs a prescriptive analysis.',
    explanation:
      'Choosing a sophisticated type when a simple one is needed wastes effort and risks unsupported conclusions. Establish the goal, then pick the type.',
    hint: 'Assign each business question to the question type that answers it.',
    related: ['w4-descriptive', 'w4-diagnostic', 'w4-predictive', 'w4-prescriptive'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'assign',
      prompt: 'Assign each question to its analytical type.',
      categories: [
        { id: 'desc', label: 'Descriptive' },
        { id: 'diag', label: 'Diagnostic' },
        { id: 'pred', label: 'Predictive' },
        { id: 'presc', label: 'Prescriptive' },
      ],
      items: [
        { id: 'a', label: 'How many returns did we process last month?', categoryId: 'desc' },
        { id: 'b', label: 'Why did returns rise in the north region?', categoryId: 'diag' },
        { id: 'c', label: 'Which orders are likely to be returned next week?', categoryId: 'pred' },
        { id: 'd', label: 'Which intervention best reduces returns within our budget?', categoryId: 'presc' },
      ],
    },
  },
  {
    id: 'w4-misconception-questions',
    week: 4,
    topic: 'Question types',
    title: 'Question-type misconceptions',
    definition:
      'Common errors: calling a prediction a cause, treating a descriptive count as a forecast, or labelling a recommendation as a prediction.',
    keyFacts: [
      'Prediction ≠ causation',
      'Describing history is not forecasting',
      'A recommendation requires an explicit objective',
    ],
    example:
      'A churn model that flags at-risk users says nothing about whether a discount would retain them.',
    explanation:
      'Each misconception inflates what the analysis can support. Matching claims to question type prevents over-claiming to stakeholders.',
    hint: 'Select the statements that are correct about these question types.',
    related: ['w4-prescriptive', 'w9-correlation-causation', 'w14-model-limits'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every statement that is TRUE.',
      options: [
        { id: 'a', label: 'A predictive model can rank at-risk customers without explaining why they churn', correct: true },
        { id: 'b', label: 'A descriptive count is automatically a forecast', correct: false },
        { id: 'c', label: 'Prescriptive analysis must state its objective and constraints', correct: true },
        { id: 'd', label: 'Diagnostic questions are answered by prediction alone', correct: false },
        { id: 'e', label: 'Choosing a question type should follow from the decision goal', correct: true },
      ],
    },
  },
]
