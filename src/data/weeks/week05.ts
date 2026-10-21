import type { Concept, WeekModule } from '../../types'

export const week: WeekModule = {
  week: 5,
  title: 'Data Processing and Cleaning Foundations',
  subtitle: 'Missingness, outliers, duplicates and data quality',
  description:
    'Handle missing data with the MCAR/MAR/MNAR framework, choose between deletion and imputation, detect outliers and duplicates, repair inconsistent formats, and reason about data quality dimensions and the trade-offs of cleaning decisions.',
  learningObjectives: [
    'Distinguish MCAR, MAR and MNAR and explain why the mechanism changes the fix.',
    'Compare deletion and imputation strategies, including their biases.',
    'Detect outliers and duplicates without automatically deleting them.',
    'Name data quality dimensions and articulate the trade-offs of cleaning decisions.',
  ],
  topics: ['Missingness', 'Imputation', 'Outliers', 'Duplicates', 'Data quality'],
  estimatedMinutes: 42,
  accent: '#f87171',
}

export const concepts: Concept[] = [
  {
    id: 'w5-missing-data',
    week: 5,
    topic: 'Missingness',
    title: 'Missing data',
    definition:
      'Absent values in a dataset, which may be recorded explicitly (null, NA, NaN) or hidden as sentinel values such as -1, 999 or "unknown".',
    keyFacts: [
      'Inspect how missingness is encoded before counting it',
      'The mechanism determines which repairs are valid',
      'Missingness itself can be informative',
    ],
    example:
      'A sensor writes -1 when offline; treating -1 as a temperature of -1 °C corrupts every summary statistic.',
    explanation:
      'First translate sentinel codes to explicit nulls, then analyse the pattern. Cleaning a statistic before understanding the mechanism produces confident nonsense.',
    hint: 'Two-word term for absent values, whether explicit nulls or disguised sentinels.',
    related: ['w5-mcar', 'w5-deletion', 'w5-imputation'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'What term describes values that are absent from a dataset, whether stored as nulls or disguised as sentinel codes?',
      answers: ['Missing data', 'Missingness', 'Missing values'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w5-mcar',
    week: 5,
    topic: 'Missingness',
    title: 'MCAR',
    definition:
      'Missing Completely At Random: the probability of a value being missing is unrelated to any variable, observed or unobserved.',
    keyFacts: [
      'Missingness independent of the data',
      'Complete-case analysis is unbiased for the estimand (though less efficient)',
      'Rare in practice; usually a simplifying assumption',
    ],
    example:
      'A lab technician drops a random 2% of sample tubes; which tubes are lost is unrelated to the measured values.',
    explanation:
      'MCAR is the strongest and least realistic assumption. It licenses deletion without bias, which is exactly why it must be tested rather than assumed.',
    hint: 'Four letters: missingness unrelated to any observed or unobserved value.',
    related: ['w5-mar', 'w5-mnar', 'w5-deletion'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which missingness mechanism means the probability of a value being missing is unrelated to any variable, observed or unobserved?',
      answers: ['MCAR', 'Missing Completely At Random'],
      placeholder: 'Type the mechanism…',
    },
  },
  {
    id: 'w5-mar',
    week: 5,
    topic: 'Missingness',
    title: 'MAR',
    definition:
      'Missing At Random: missingness can depend on observed variables, but not on the unobserved value itself once those variables are taken into account.',
    keyFacts: [
      'Depends only on observed information',
      'Multiple imputation and model-based methods are valid here',
      'Deletion can bias estimates because missingness correlates with observed data',
    ],
    example:
      'Income is more often missing for younger respondents — age is observed, so missingness is explainable from the data.',
    explanation:
      'The name is misleading: MAR does not mean random, it means conditionally explainable. It is the assumption most imputation methods rely on.',
    hint: 'Three letters: missingness explained by observed variables only.',
    related: ['w5-mcar', 'w5-mnar', 'w5-imputation'],
    difficulty: 'advanced',
    drill: {
      mode: 'short',
      prompt:
        'Which mechanism applies when missingness depends on observed variables but not on the unobserved value itself?',
      answers: ['MAR', 'Missing At Random'],
      placeholder: 'Type the mechanism…',
    },
  },
  {
    id: 'w5-mnar',
    week: 5,
    topic: 'Missingness',
    title: 'MNAR',
    definition:
      'Missing Not At Random: the probability of missingness depends on the missing value itself, so it cannot be recovered from observed data alone.',
    keyFacts: [
      'Dangerous: standard imputation is biased',
      'Requires sensitivity analysis or explicit modelling of the mechanism',
      'Common with sensitive questions (income, weight) and self-selection',
    ],
    example:
      'High earners decline to report salary, so the observed incomes understate the true mean no matter how they are imputed.',
    explanation:
      'MNAR cannot be fixed by a cleverer imputer, because the information needed is absent. The honest response is to state the limitation and test sensitivity.',
    hint: 'Four letters: missingness depends on the unobserved value itself.',
    related: ['w5-mar', 'w5-mcar', 'w14-model-limits'],
    difficulty: 'advanced',
    drill: {
      mode: 'short',
      prompt:
        'Which missingness mechanism means the probability of missingness depends on the missing value itself?',
      answers: ['MNAR', 'Missing Not At Random'],
      placeholder: 'Type the mechanism…',
    },
  },
  {
    id: 'w5-mechanism-categorize',
    week: 5,
    topic: 'Missingness',
    title: 'Classifying missingness scenarios',
    definition:
      'Diagnose the mechanism from the story: unrelated to anything (MCAR), explained by observed variables (MAR), or driven by the hidden value itself (MNAR).',
    keyFacts: [
      'Mechanism is a claim about the data-generating process',
      'It can rarely be proven from the data alone',
      'Sensitivity analysis is the practical safeguard for MNAR',
    ],
    example:
      'Equipment randomly failing = MCAR; younger customers skipping an optional field = MAR; wealthy customers refusing income questions = MNAR.',
    explanation:
      'Classify by asking what predicts missingness. If the predictor is unobserved and is the value itself, imputation cannot rescue the estimate.',
    hint: 'Assign each scenario to the mechanism it illustrates.',
    related: ['w5-mcar', 'w5-mar', 'w5-mnar'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'assign',
      prompt: 'Assign each scenario to the missingness mechanism it illustrates.',
      categories: [
        { id: 'mcar', label: 'MCAR' },
        { id: 'mar', label: 'MAR' },
        { id: 'mnar', label: 'MNAR' },
      ],
      items: [
        { id: 'a', label: 'A random 2% of lab samples are dropped in transit', categoryId: 'mcar' },
        { id: 'b', label: 'Income is missing mainly for younger respondents whose age is recorded', categoryId: 'mar' },
        { id: 'c', label: 'The highest earners refuse to state their salary', categoryId: 'mnar' },
      ],
    },
  },
  {
    id: 'w5-deletion',
    week: 5,
    topic: 'Missingness',
    title: 'Deletion',
    definition:
      'Handling missing data by removing affected rows (listwise) or columns, which is simple but can bias results and discard information.',
    keyFacts: [
      'Listwise deletion drops any row with a missing value',
      'Column deletion loses an entire variable',
      'Only unbiased under MCAR; costly when missingness is common',
    ],
    example:
      'Dropping every row with any missing survey answer removes 40% of respondents, systematically excluding a subgroup.',
    explanation:
      'Deletion is defensible when missingness is rare and MCAR. Otherwise it silently changes the population being analysed.',
    hint: 'One word for the strategy that removes rows or columns with missing values.',
    related: ['w5-imputation', 'w5-mcar', 'w5-cleaning-tradeoffs'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What strategy handles missing data by removing the affected rows or columns entirely?',
      answers: ['Deletion', 'Listwise deletion', 'Dropping'],
      placeholder: 'Type the strategy…',
    },
  },
  {
    id: 'w5-imputation',
    week: 5,
    topic: 'Missingness',
    title: 'Imputation',
    definition:
      'Filling missing values with estimated replacements — a constant, a summary statistic or a model-based prediction — to retain rows and reduce bias.',
    keyFacts: [
      'Preserves sample size at the cost of introducing assumptions',
      'Simple imputation understates variance',
      'Model-based and multiple imputation propagate uncertainty better',
    ],
    example:
      'Filling missing income with the median by age bracket keeps the sample while respecting the MAR structure.',
    explanation:
      'Imputation does not create information; it makes assumptions explicit. The variance understatement of single-value imputation is the key caveat.',
    hint: 'One word for replacing missing values with estimated ones.',
    related: ['w5-deletion', 'w5-mean-median-imputation', 'w5-mar'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What term describes replacing missing values with estimated substitutes rather than removing the row?',
      answers: ['Imputation'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w5-mean-median-imputation',
    week: 5,
    topic: 'Imputation',
    title: 'Mean / median / mode imputation',
    definition:
      'Replacing missing values with a column summary: the mean for roughly symmetric numeric data, the median for skewed numeric data, and the mode for categorical data.',
    keyFacts: [
      'Mean is distorted by outliers and skew',
      'Median is robust to outliers',
      'Mode is the only sensible summary for categories',
      'All three shrink variance and can distort correlations',
    ],
    example:
      'With a heavily right-skewed income column, median imputation keeps replacements plausible; the mean would invent high earners.',
    explanation:
      'Match the summary to the distribution and type. Mean-imputing a skewed column invents values far from the bulk of the data.',
    hint: 'Complete each rule: symmetric → mean, skewed → ?, categorical → ?.',
    related: ['w5-imputation', 'w8-mean-median', 'w8-skewness'],
    difficulty: 'core',
    drill: {
      mode: 'cloze',
      prompt: 'Complete the imputation guidance.',
      template:
        'For a skewed numeric column impute the ___, while for a categorical column impute the ___.',
      blanks: [{ answers: ['median'] }, { answers: ['mode'] }],
    },
  },
  {
    id: 'w5-outlier',
    week: 5,
    topic: 'Outliers',
    title: 'Outliers',
    definition:
      'Observations that lie unusually far from the rest of the distribution, which may be genuine extreme values, data-entry errors or measurement faults.',
    keyFacts: [
      'Detect with box plots, z-scores or the IQR rule',
      'IQR rule: outside 1.5 × IQR below Q1 or above Q3',
      'Never delete automatically — investigate the cause first',
    ],
    example:
      'A delivery distance of 12,000 km is likely a units error; a genuinely extreme enterprise order is a real outlier worth keeping.',
    explanation:
      'Outlier handling is a judgement call documented in the analysis. Removing real extremes can bias the model precisely where the business cares most.',
    hint: 'One word for observations lying unusually far from the rest of the distribution.',
    related: ['w5-iqr-rule', 'w8-dispersion', 'w8-boxplot'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What term describes observations that lie unusually far from the rest of the distribution?',
      answers: ['Outlier', 'Outliers'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w5-iqr-rule',
    week: 5,
    topic: 'Outliers',
    title: 'IQR rule',
    definition:
      'A common outlier rule flagging values below Q1 − 1.5 × IQR or above Q3 + 1.5 × IQR, where IQR = Q3 − Q1.',
    keyFacts: [
      'Robust: quartiles resist extreme values',
      'Produces the whiskers of a box plot',
      'A flag, not a verdict',
    ],
    example:
      'With Q1 = 20 and Q3 = 50, IQR = 30, so values above 95 or below −25 are flagged for review.',
    explanation:
      'The multiplier 1.5 is a convention, not a law. The rule flags candidates for inspection; deleting them requires a reason.',
    hint: 'Three letters: quartile-based spread used by the 1.5× rule and box-plot whiskers.',
    related: ['w5-outlier', 'w8-iqr', 'w8-boxplot'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which quartile-based measure of spread is multiplied by 1.5 to flag outliers and draw box-plot whiskers?',
      answers: ['IQR', 'Interquartile range'],
      placeholder: 'Type the measure…',
    },
  },
  {
    id: 'w5-duplicates',
    week: 5,
    topic: 'Data quality',
    title: 'Duplicate records',
    definition:
      'Multiple rows describing the same real-world observation, caused by repeated ingestion, retries or fuzzy keys — they inflate counts and distort aggregates.',
    keyFacts: [
      'Exact duplicates are easy to detect with equality',
      'Near-duplicates need normalisation or fuzzy matching',
      'Deduplicate on a defined key before aggregating',
    ],
    example:
      'A retried API load inserts each order twice; case counts double until rows are deduplicated by order_id.',
    explanation:
      'The hard part is defining identity — which columns make two rows "the same". Choosing a business key prevents silent double counting.',
    hint: 'Two words for rows that describe the same real-world observation.',
    related: ['w5-inconsistent-formats', 'w5-data-quality', 'w4-observational-unit'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What do we call rows that describe the same real-world observation and therefore inflate counts?',
      answers: ['Duplicate records', 'Duplicates', 'Duplicate rows'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w5-inconsistent-formats',
    week: 5,
    topic: 'Data quality',
    title: 'Inconsistent formats and invalid values',
    definition:
      'Values that are technically present but unusable: mixed date formats, inconsistent capitalisation and units, impossible values, or categories spelled several ways.',
    keyFacts: [
      'Standardise units, casing and date formats',
      'Validate against allowed ranges and category sets',
      'Aggressive normalisation can merge genuinely different categories',
    ],
    example:
      'The same country appears as "US", "U.S.A." and "usa", splitting one segment into three in every group-by.',
    explanation:
      'Standardisation needs a documented mapping table, otherwise results depend on whoever cleans next. Range checks catch invalid values such as negative ages.',
    hint: 'Two words: values that are present but unusable because they are mixed-format or out of range.',
    related: ['w5-duplicates', 'w7-inconsistent-categories', 'w5-data-quality'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What term describes values that are present but unusable because formats, units or allowed ranges are inconsistent?',
      answers: ['Inconsistent formats', 'Data inconsistencies', 'Invalid values', 'Inconsistent data'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w5-data-quality',
    week: 5,
    topic: 'Data quality',
    title: 'Data quality dimensions',
    definition:
      'The properties used to judge fitness for use: accuracy, completeness, consistency, timeliness, validity and uniqueness.',
    keyFacts: [
      'Accuracy: values match reality',
      'Completeness: required values are present',
      'Consistency: values agree across sources',
      'Timeliness: data is current enough for the decision',
    ],
    example:
      'A customer table can be complete but inaccurate (wrong phone numbers) or accurate but not timely (updated yearly).',
    explanation:
      'Quality is multidimensional and purpose-relative: the same dataset can be fit for a trend report and unfit for billing.',
    hint: 'Select the dimensions that are conventionally used to assess data quality.',
    related: ['w5-inconsistent-formats', 'w3-provenance', 'w5-cleaning-tradeoffs'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every dimension commonly used to assess data quality.',
      options: [
        { id: 'a', label: 'Accuracy', correct: true },
        { id: 'b', label: 'Completeness', correct: true },
        { id: 'c', label: 'Timeliness', correct: true },
        { id: 'd', label: 'Colour scheme', correct: false },
        { id: 'e', label: 'Consistency', correct: true },
        { id: 'f', label: 'Alphabetical ordering', correct: false },
      ],
    },
  },
  {
    id: 'w5-cleaning-tradeoffs',
    week: 5,
    topic: 'Data quality',
    title: 'Cleaning trade-offs',
    definition:
      'Every cleaning decision exchanges one risk for another: dropping rows loses information, imputing adds assumptions, and trimming outliers can remove the very signal of interest.',
    keyFacts: [
      'Document every cleaning decision and its justification',
      'Quantify impact: how many rows, how much shift in estimates',
      'Cleaning choices must be reproducible',
    ],
    example:
      'Winsorising the top 1% of order values stabilises a mean but hides large enterprise deals that drive revenue.',
    explanation:
      'There is no assumption-free cleaning. The professional standard is transparency plus sensitivity checks, not a single "correct" method.',
    hint: 'Select the statements that correctly describe cleaning trade-offs.',
    related: ['w5-deletion', 'w5-outlier', 'w14-presentation-limitations'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every statement that is TRUE about cleaning decisions.',
      options: [
        { id: 'a', label: 'Removing outliers can delete genuine and important observations', correct: true },
        { id: 'b', label: 'Dropping rows always improves accuracy', correct: false },
        { id: 'c', label: 'Cleaning decisions should be documented and reproducible', correct: true },
        { id: 'd', label: 'Simple imputation tends to understate variance', correct: true },
        { id: 'e', label: 'There is exactly one objectively correct cleaning method per dataset', correct: false },
      ],
    },
  },
]
