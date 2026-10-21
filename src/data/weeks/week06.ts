import type { Concept, WeekModule } from '../../types'

export const week: WeekModule = {
  week: 6,
  title: 'Midterm Assessment Review',
  subtitle: 'Cumulative active recall for Weeks 1–5',
  description:
    'A mixed-format review of everything covered so far: the AI ecosystem and lifecycle, tools and collaboration, data structures and measurement scales, tidy data and question types, and cleaning foundations. Nothing here introduces new material.',
  learningObjectives: [
    'Retrieve core definitions from Weeks 1–5 without prompts.',
    'Apply the distinctions between AI/ML/DL/DS and between structure, type and scale.',
    'Diagnose cleaning and missingness scenarios.',
    'Sit a practice assessment that mixes all five weeks and score it end to end.',
  ],
  topics: ['Mixed recall', 'Scenario diagnosis', 'Terminology', 'Misconception checks'],
  estimatedMinutes: 45,
  accent: '#22d3ee',
}

export const concepts: Concept[] = [
  {
    id: 'w6-review-lifecycle',
    week: 6,
    topic: 'Mixed recall',
    title: 'Lifecycle recall',
    definition:
      'Business understanding → data collection → cleaning and preparation → exploratory data analysis → feature engineering → modelling → evaluation → visualisation and communication → deployment.',
    keyFacts: [
      'Starts from the business question',
      'Iterative rather than linear',
      'Feature engineering precedes modelling; evaluation follows it',
    ],
    example:
      'Evaluation reveals leakage, so the team returns to cleaning and feature engineering before re-modelling — the loop in action.',
    explanation:
      'Order matters for the midterm. Business understanding is first and deployment is last; cleaning precedes EDA, and EDA precedes feature engineering.',
    hint: 'Complete the stage names: collection, cleaning, EDA, feature engineering, modelling, evaluation.',
    related: ['w1-data-science-lifecycle', 'w1-feature-engineering', 'w1-eda-stage'],
    difficulty: 'core',
    drill: {
      mode: 'cloze',
      prompt: 'Fill in the missing lifecycle stages.',
      template:
        'After data collection comes ___ and preparation, then exploratory data analysis, then ___ engineering, and finally modelling and evaluation before deployment.',
      blanks: [{ answers: ['cleaning', 'data cleaning'] }, { answers: ['feature'] }],
    },
  },
  {
    id: 'w6-review-roles',
    week: 6,
    topic: 'Scenario diagnosis',
    title: 'Role scenario recall',
    definition:
      'Deliverables identify roles: dashboards (analyst), experiments and recommendations (scientist), production model services (ML engineer), pipelines and warehouses (data engineer).',
    keyFacts: [
      'Ask what the person hands over',
      'Tools overlap; deliverables do not',
    ],
    example:
      '"Keeps the nightly ingestion job green and the warehouse schema valid" is clearly data engineering.',
    explanation:
      'Scenario questions always describe an activity. Map the activity to the artefact it produces, then to the role.',
    hint: 'Assign each activity to the role that owns it.',
    related: ['w1-role-data-analyst', 'w1-role-data-scientist', 'w1-role-ml-engineer', 'w1-role-data-engineer'],
    difficulty: 'core',
    drill: {
      mode: 'categorize',
      variant: 'assign',
      prompt: 'Assign each activity to the role that owns it.',
      categories: [
        { id: 'analyst', label: 'Data Analyst' },
        { id: 'scientist', label: 'Data Scientist' },
        { id: 'ml', label: 'ML Engineer' },
        { id: 'engineer', label: 'Data Engineer' },
      ],
      items: [
        { id: 'a', label: 'Builds a self-service dashboard on the warehouse', categoryId: 'analyst' },
        { id: 'b', label: 'Designs an experiment and reports the effect with uncertainty', categoryId: 'scientist' },
        { id: 'c', label: 'Adds monitoring for prediction drift in production', categoryId: 'ml' },
        { id: 'd', label: 'Maintains the nightly ingestion job and schema validation', categoryId: 'engineer' },
      ],
    },
  },
  {
    id: 'w6-review-ai-ecosystem',
    week: 6,
    topic: 'Mixed recall',
    title: 'AI ecosystem recall',
    definition:
      'AI ⊃ ML ⊃ DL as nested technical fields; data science is a broader process that frequently uses ML but is not a subset of it.',
    keyFacts: [
      'Not all AI learns from data',
      'DL is distinguished by multilayer networks',
      'DS is defined by its process and  multidisciplinary scope',
    ],
    example:
      'A rule-based scheduler is AI; a decision tree is ML; a CNN is DL; an experiment-driven churn analysis is DS.',
    explanation:
      'Midterm favourites: "is DS a subset of AI?" (no) and "does AI require learning?" (no).',
    hint: 'Which field is the broadest — the one whose systems need not learn from data?',
    related: ['w1-ai-definition', 'w1-machine-learning', 'w1-deep-learning'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which of AI, ML, DL and DS is the broadest field of systems performing tasks associated with human intelligence?',
      answers: ['AI', 'Artificial Intelligence'],
      placeholder: 'Type one of AI / ML / DL / DS…',
    },
  },
  {
    id: 'w6-review-structures',
    week: 6,
    topic: 'Scenario diagnosis',
    title: 'Data structure recall',
    definition:
      'Structured = fixed schema (CSV, SQL); semi-structured = self-describing keys (JSON, XML); unstructured = no schema (text, image, audio, video).',
    keyFacts: [
      'Tags imply semi-structured',
      'Graph data is structured around relationships',
      'Structure is independent of measurement scale',
    ],
    example:
      'An API returns nested JSON with optional keys — semi-structured, requiring flattening before modelling.',
    explanation:
      'If a format has keys but variable shape, it is semi-structured. If it has neither, unstructured. If it has a fixed column set, structured.',
    hint: 'Assign each item to structured, semi-structured or unstructured.',
    related: ['w3-structured-data', 'w3-semi-structured-data', 'w3-unstructured-data'],
    difficulty: 'core',
    drill: {
      mode: 'categorize',
      variant: 'assign',
      prompt: 'Assign each item to its data structure category.',
      categories: [
        { id: 'structured', label: 'Structured' },
        { id: 'semi', label: 'Semi-structured' },
        { id: 'unstructured', label: 'Unstructured' },
      ],
      items: [
        { id: 'a', label: 'Warehouse fact table', categoryId: 'structured' },
        { id: 'b', label: 'XML invoice', categoryId: 'semi' },
        { id: 'c', label: 'Podcast audio file', categoryId: 'unstructured' },
        { id: 'd', label: 'JSON event payload', categoryId: 'semi' },
      ],
    },
  },
  {
    id: 'w6-review-scales',
    week: 6,
    topic: 'Mixed recall',
    title: 'Measurement scale recall',
    definition:
      'Nominal = labels; ordinal = ordered labels; interval = equal distances, arbitrary zero; ratio = equal distances plus true zero.',
    keyFacts: [
      'True zero is the interval/ratio boundary',
      'Means are questionable for nominal and ordinal data',
      'Coding categories numerically does not upgrade the scale',
    ],
    example:
      'Star ratings are ordinal; Celsius is interval; delivery time in minutes is ratio.',
    explanation:
      'Identify whether order and a true zero exist — two binary questions resolve all four scales.',
    hint: 'Assign each variable to nominal, ordinal, interval or ratio.',
    related: ['w3-measurement-scales', 'w3-nominal-ordinal', 'w3-quantitative-qualitative'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'assign',
      prompt: 'Assign each variable to its measurement scale.',
      categories: [
        { id: 'nominal', label: 'Nominal' },
        { id: 'ordinal', label: 'Ordinal' },
        { id: 'interval', label: 'Interval' },
        { id: 'ratio', label: 'Ratio' },
      ],
      items: [
        { id: 'a', label: 'Subscription plan name', categoryId: 'nominal' },
        { id: 'b', label: 'Service rating: poor / ok / great', categoryId: 'ordinal' },
        { id: 'c', label: 'Year of birth recorded as calendar year', categoryId: 'interval' },
        { id: 'd', label: 'Monthly spend in dollars', categoryId: 'ratio' },
      ],
    },
  },
  {
    id: 'w6-review-tidy',
    week: 6,
    topic: 'Mixed recall',
    title: 'Tidy data recall',
    definition:
      'Variables in columns, observations in rows, observational units in tables — with one clearly identified unit of observation per table.',
    keyFacts: [
      'Messy = wrong shape; dirty = wrong values',
      'Wide layouts encode a variable in headers',
      'Grain errors cause double counting',
    ],
    example:
      'A table with one row per store-month and a column per product is messy; a table with store, month, product and sales is tidy.',
    explanation:
      'Check the grain first, then the columns. Most "wrong totals" trace back to an undeclared observational unit.',
    hint: 'Select every statement that correctly describes tidy-data practice.',
    related: ['w4-tidy-data', 'w4-observational-unit', 'w4-wide-long'],
    difficulty: 'core',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every statement that is TRUE.',
      options: [
        { id: 'a', label: 'In tidy data each variable occupies one column', correct: true },
        { id: 'b', label: 'One row can safely mix two different observational units', correct: false },
        { id: 'c', label: 'Encoding a variable in column headers produces a messy layout', correct: true },
        { id: 'd', label: 'Tidy data guarantees the values are correct', correct: false },
        { id: 'e', label: 'Long format is tidy when year is a variable', correct: true },
      ],
    },
  },
  {
    id: 'w6-review-missing',
    week: 6,
    topic: 'Scenario diagnosis',
    title: 'Missingness scenario recall',
    definition:
      'MCAR: unrelated. MAR: explained by observed variables. MNAR: driven by the hidden value itself.',
    keyFacts: [
      'Only MCAR makes deletion unbiased',
      'MAR supports model-based imputation',
      'MNAR needs sensitivity analysis, not a fancier imputer',
    ],
    example:
      'A sensor that fails when the reading exceeds its range is MNAR — the most extreme values are the ones missing.',
    explanation:
      'The sensor example is the classic MNAR trap: nothing observed predicts the failure except the unobserved extreme value itself.',
    hint: 'Assign each scenario to MCAR, MAR or MNAR.',
    related: ['w5-mcar', 'w5-mar', 'w5-mnar'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'assign',
      prompt: 'Assign each scenario to its missingness mechanism.',
      categories: [
        { id: 'mcar', label: 'MCAR' },
        { id: 'mar', label: 'MAR' },
        { id: 'mnar', label: 'MNAR' },
      ],
      items: [
        { id: 'a', label: 'A random subset of survey forms is lost in the post', categoryId: 'mcar' },
        { id: 'b', label: 'Churn reason is missing more often for month-to-month customers, which is recorded', categoryId: 'mar' },
        { id: 'c', label: 'A sensor stops recording only when the reading exceeds its range', categoryId: 'mnar' },
      ],
    },
  },
  {
    id: 'w6-review-cleaning',
    week: 6,
    topic: 'Scenario diagnosis',
    title: 'Cleaning scenario recall',
    definition:
      'Match the symptom to the fix: duplicate rows → deduplicate on a business key; disguised nulls → convert sentinels to nulls; mixed categories → documented mapping; extreme values → investigate before deciding.',
    keyFacts: [
      'Diagnose the cause before applying a fix',
      'Document every cleaning rule',
      'Never delete outliers by reflex',
    ],
    example:
      '"US", "U.S.A." and "usa" in one column is an inconsistent-category problem, not a missing-data problem.',
    explanation:
      'Scenario items are graded on the diagnosis. Choosing the right vocabulary is what the midterm tests.',
    hint: 'Which problem class do several spellings of the same category represent?',
    related: ['w5-inconsistent-formats', 'w5-duplicates', 'w5-outlier'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'A country column contains "US", "U.S.A." and "usa". What class of data-quality problem is this?',
      answers: ['Inconsistent categories', 'Inconsistent formats', 'Inconsistent data', 'Inconsistent values'],
      placeholder: 'Name the problem class…',
    },
  },
  {
    id: 'w6-review-questiontypes',
    week: 6,
    topic: 'Mixed recall',
    title: 'Question type recall',
    definition:
      'Descriptive (what happened), diagnostic (why), predictive (what next), prescriptive (what should we do under constraints).',
    keyFacts: [
      'Prediction is not explanation',
      'Prescriptive work defines an objective',
      'Match the question type to the decision goal',
    ],
    example:
      '"Which 200 customers should get the offer?" adds an objective and a constraint to a prediction: prescriptive.',
    explanation:
      'If a question implies choosing an action subject to limits, it is prescriptive — even when a predictive model feeds it.',
    hint: 'Assign each question to its analytical type.',
    related: ['w4-descriptive', 'w4-diagnostic', 'w4-predictive', 'w4-prescriptive'],
    difficulty: 'core',
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
        { id: 'a', label: 'What was the average basket size last quarter?', categoryId: 'desc' },
        { id: 'b', label: 'Why did basket size fall in the south?', categoryId: 'diag' },
        { id: 'c', label: 'Which customers will spend less next month?', categoryId: 'pred' },
        { id: 'd', label: 'Which 200 customers should receive the offer within budget?', categoryId: 'presc' },
      ],
    },
  },
  {
    id: 'w6-misconceptions',
    week: 6,
    topic: 'Misconception checks',
    title: 'Weeks 1–5 misconception check',
    definition:
      'The most common midterm traps: AI = ML, DS is a subset of AI, JSON is unstructured, ordinal is interval, mean-impute everything, and deleting all outliers.',
    keyFacts: [
      'Nested fields vs process field',
      'Semi-structured ≠ unstructured',
      'Ordinal has order but not equal spacing',
      'Imputation choice depends on distribution and type',
    ],
    example:
      'Averaging a 1–5 satisfaction code treats ordinal data as interval and inflates the apparent precision of the result.',
    explanation:
      'Each trap collapses a distinction the course tests explicitly. Naming the distinction is the safest way to answer.',
    hint: 'Select only the statements that survive scrutiny.',
    related: ['w1-misconception-ai', 'w3-misconception-structure', 'w5-cleaning-tradeoffs'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every statement that is TRUE.',
      options: [
        { id: 'a', label: 'JSON is a semi-structured format because its keys are self-describing', correct: true },
        { id: 'b', label: 'Data science is a subset of machine learning', correct: false },
        { id: 'c', label: 'Ordinal data has a meaningful order but not necessarily equal spacing', correct: true },
        { id: 'd', label: 'Mean imputation is appropriate for any column regardless of skew', correct: false },
        { id: 'e', label: 'MNAR cannot be fixed by imputation alone', correct: true },
      ],
    },
  },
  {
    id: 'w6-practice-assessment',
    week: 6,
    topic: 'Practice assessment',
    title: 'Practice assessment: choose the best answer',
    definition:
      'A scenario-based check requiring you to combine structure, grain, missingness and question type in one judgement.',
    keyFacts: [
      'Read the full scenario before deciding',
      'One option is always a plausible but over-claimed answer',
    ],
    example:
      'A team wants to know which customers will churn and what discount to offer. The prediction answers the first half; the recommendation needs an objective and constraints.',
    explanation:
      'Composite scenarios reward identifying which sub-question each option really addresses.',
    hint: 'Select the statements that are methodologically sound.',
    related: ['w1-data-science-lifecycle', 'w4-prescriptive', 'w5-mar'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt:
        'A team must predict which customers will churn and then decide who receives a retention discount. Select every statement that is TRUE.',
      options: [
        { id: 'a', label: 'The churn prediction part is a predictive question', correct: true },
        { id: 'b', label: 'Choosing discount recipients within budget is prescriptive', correct: true },
        { id: 'c', label: 'A churn prediction alone proves the discount will work', correct: false },
        { id: 'd', label: 'Deleting rows with missing churn labels is unbiased under MAR', correct: false },
        { id: 'e', label: 'The observational unit must be defined before aggregating churn rates', correct: true },
      ],
    },
  },
]
