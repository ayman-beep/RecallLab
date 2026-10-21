import type { Concept, WeekModule } from '../../types'

export const week: WeekModule = {
  week: 8,
  title: 'Exploratory Data Analysis and Descriptive Statistics',
  subtitle: 'Central tendency, dispersion, distribution shape and plots',
  description:
    'Use EDA to understand data before modelling: summarise central tendency and dispersion, reason about sensitivity to outliers, read skewness from histograms and box plots, and choose visualisations that match variable types.',
  learningObjectives: [
    'Explain the purpose of exploratory data analysis.',
    'Compute and interpret mean, median, mode, range, variance, standard deviation and IQR.',
    'Predict how outliers and skew affect each summary statistic.',
    'Read histograms, box plots and scatter plots correctly and choose the right plot for a variable pair.',
  ],
  topics: ['EDA purpose', 'Central tendency', 'Dispersion', 'Distribution shape', 'Plots'],
  estimatedMinutes: 40,
  accent: '#60a5fa',
}

export const concepts: Concept[] = [
  {
    id: 'w8-eda-purpose',
    week: 8,
    topic: 'EDA purpose',
    title: 'Purpose of EDA',
    definition:
      'Exploratory Data Analysis uses summaries and visualisations to understand distributions, relationships, anomalies and data-quality problems before committing to a model.',
    keyFacts: [
      'Reveals structure that summary tables hide',
      'Detects quality issues early',
      'Guides feature engineering and model selection',
    ],
    example:
      'A scatter plot reveals two distinct clusters that a single regression line would blur into one misleading trend.',
    explanation:
      'EDA is investigative, not confirmatory. It generates hypotheses and exposes problems; it does not test them formally.',
    hint: 'Three words: the investigative stage before modelling, abbreviated EDA.',
    related: ['w1-eda-stage', 'w8-histogram', 'w9-chart-matching'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'What is the investigative analysis stage, before modelling, that uses summaries and plots to reveal distributions, relationships and anomalies?',
      answers: ['Exploratory Data Analysis', 'EDA'],
      placeholder: 'Type the stage…',
    },
  },
  {
    id: 'w8-central-tendency',
    week: 8,
    topic: 'Central tendency',
    title: 'Central tendency',
    definition:
      'A family of summary statistics describing the typical or middle value of a distribution: mean, median and mode.',
    keyFacts: [
      'Mean: arithmetic average, uses every value',
      'Median: middle value when ordered, robust',
      'Mode: most frequent value, works for categories',
    ],
    example:
      'Salaries of 100 employees have a mean above the median because a few executives pull the mean upward.',
    explanation:
      'Reporting a single measure of centre hides the choice being made. Which one is appropriate depends on skew and variable type.',
    hint: 'Two words for the family of statistics that describe a typical value.',
    related: ['w8-mean-median', 'w8-mode', 'w8-skewness'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'What term describes the family of statistics — mean, median and mode — that summarise the typical value of a distribution?',
      answers: ['Central tendency', 'Measure of central tendency', 'Measures of central tendency'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w8-mean-median',
    week: 8,
    topic: 'Central tendency',
    title: 'Mean vs median',
    definition:
      'The mean is the arithmetic average and is pulled toward extreme values; the median is the middle ordered value and is resistant to outliers and skew.',
    keyFacts: [
      'Skewed data → median describes the typical case better',
      'Symmetric data → mean and median nearly agree',
      'Mean is mathematically convenient for further modelling',
    ],
    example:
      'House prices with a few mansions: report the median for a "typical" home; report the mean for total market value.',
    explanation:
      'The right question is what "typical" should mean for the decision. Both statistics are valid; they answer different questions.',
    hint: 'Complete the sentence: which average resists extreme values?',
    related: ['w8-central-tendency', 'w8-skewness', 'w5-mean-median-imputation'],
    difficulty: 'core',
    drill: {
      mode: 'cloze',
      prompt: 'Complete the comparison of the two averages.',
      template:
        'The ___ is pulled upward by extreme values, while the ___ is the middle value and resists outliers.',
      blanks: [{ answers: ['mean'] }, { answers: ['median'] }],
    },
  },
  {
    id: 'w8-mode',
    week: 8,
    topic: 'Central tendency',
    title: 'Mode',
    definition:
      'The most frequently occurring value in a dataset; the only measure of central tendency that applies to nominal categorical data.',
    keyFacts: [
      'Applies to any variable type, including nominal',
      'A dataset can be bimodal or multimodal',
      'Ignores magnitude, so it can be far from the centre',
    ],
    example:
      'The modal support channel is "chat" — a statement that mean and median cannot make for a categorical variable.',
    explanation:
      'For numeric data the mode is often uninformative with continuous measurements; for categories it is the natural summary.',
    hint: 'One word: the most frequently occurring value.',
    related: ['w8-central-tendency', 'w3-nominal-ordinal', 'w5-mean-median-imputation'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt: 'What is the most frequently occurring value in a dataset called?',
      answers: ['Mode'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w8-dispersion',
    week: 8,
    topic: 'Dispersion',
    title: 'Dispersion',
    definition:
      'The spread of values around the centre, described by range, variance, standard deviation and interquartile range.',
    keyFacts: [
      'Same mean can hide completely different spreads',
      'Variance and SD are in squared / original units respectively',
      'IQR describes the middle 50% and is outlier-resistant',
    ],
    example:
      'Two delivery routes both average 30 minutes, but one ranges 28–32 and the other 10–90: the service experience is not equivalent.',
    explanation:
      'Centre without spread is an incomplete description. This is why reports pair a mean with a standard deviation or an IQR.',
    hint: 'One word for the spread of values around the centre.',
    related: ['w8-variance', 'w8-iqr', 'w8-standard-deviation'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'What term describes statistics such as range, variance and IQR that quantify the spread of values?',
      answers: ['Dispersion', 'Measures of dispersion', 'Spread', 'Variability'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w8-variance',
    week: 8,
    topic: 'Dispersion',
    title: 'Variance',
    definition:
      'The average squared deviation of values from the mean, expressed in squared units of the variable.',
    keyFacts: [
      'Squares deviations so signs cancel and large deviations dominate',
      'Squared units make direct interpretation hard',
      'Sample variance divides by n − 1',
    ],
    example:
      'A variance of 400 for delivery times means the standard deviation is 20 minutes — the interpretable version.',
    explanation:
      'Variance is the mathematical foundation; standard deviation is the reporting unit. Squaring is why outliers have outsized influence.',
    hint: 'One word: the average squared deviation from the mean.',
    related: ['w8-standard-deviation', 'w8-dispersion', 'w7-zscore'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which measure of spread is the average squared deviation from the mean?',
      answers: ['Variance'],
      placeholder: 'Type the measure…',
    },
  },
  {
    id: 'w8-standard-deviation',
    week: 8,
    topic: 'Dispersion',
    title: 'Standard deviation',
    definition:
      'The square root of the variance, expressing typical deviation from the mean in the original units of the variable.',
    keyFacts: [
      'Same units as the data — directly interpretable',
      'Sensitive to outliers because it derives from variance',
      'Basis of the z-score and many confidence intervals',
    ],
    example:
      'Order value has a mean of $60 and SD of $12; a $100 order is more than three standard deviations above the mean.',
    explanation:
      'SD answers "how far from average is typical?" in units you can explain to a stakeholder.',
    hint: 'Two words: the square root of variance, in the original units.',
    related: ['w8-variance', 'w8-dispersion', 'w9-hypothesis-testing'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which measure of spread is the square root of the variance and is expressed in the original units?',
      answers: ['Standard deviation', 'Standard Deviation', 'SD'],
      placeholder: 'Type the measure…',
    },
  },
  {
    id: 'w8-iqr',
    week: 8,
    topic: 'Dispersion',
    title: 'Interquartile range',
    definition:
      'The range of the middle 50% of values: IQR = Q3 − Q1, where Q1 and Q3 are the 25th and 75th percentiles.',
    keyFacts: [
      'Resistant to outliers — uses quartiles only',
      'Defines the box in a box plot and the 1.5 × IQR fences',
      'Ignores the tails entirely',
    ],
    example:
      'House prices with Q1 = 300k and Q3 = 450k give an IQR of 150k, unaffected by a single 10M mansion.',
    explanation:
      'IQR is the robust companion to the median. Its blind spot is precisely that it ignores extreme values, which may matter.',
    hint: 'Three letters: Q3 minus Q1, the middle 50% of the data.',
    related: ['w8-dispersion', 'w5-iqr-rule', 'w8-boxplot'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which measure of spread is defined as the third quartile minus the first quartile?',
      answers: ['Interquartile range', 'IQR'],
      placeholder: 'Type the measure…',
    },
  },
  {
    id: 'w8-outlier-sensitivity',
    week: 8,
    topic: 'Dispersion',
    title: 'Sensitivity to outliers',
    definition:
      'Mean, range, variance and standard deviation react strongly to extreme values; median, IQR and mode do not.',
    keyFacts: [
      'One typo can shift the mean and inflate the SD',
      'Median and IQR are called robust statistics',
      'Choose summaries that match the data quality you have',
    ],
    example:
      'A salary entry of 9,000,000 instead of 90,000 raises the mean by an order of magnitude while leaving the median unchanged.',
    explanation:
      'Robustness is the reason skewed or dirty numeric data is reported with median and IQR rather than mean and SD.',
    hint: 'Select the statistics that resist outliers, and the ones that do not.',
    related: ['w8-mean-median', 'w8-iqr', 'w5-outlier'],
    difficulty: 'core',
    drill: {
      mode: 'categorize',
      variant: 'assign',
      prompt: 'Assign each statistic to how it behaves with extreme values.',
      categories: [
        { id: 'sensitive', label: 'Sensitive to outliers' },
        { id: 'robust', label: 'Robust to outliers' },
      ],
      items: [
        { id: 'a', label: 'Mean', categoryId: 'sensitive' },
        { id: 'b', label: 'Standard deviation', categoryId: 'sensitive' },
        { id: 'c', label: 'Median', categoryId: 'robust' },
        { id: 'd', label: 'Interquartile range', categoryId: 'robust' },
      ],
    },
  },
  {
    id: 'w8-skewness',
    week: 8,
    topic: 'Distribution shape',
    title: 'Skewness',
    definition:
      'Asymmetry of a distribution: in a right-skewed (positive) distribution the mean exceeds the median and a long tail extends right; left-skewed is the mirror image.',
    keyFacts: [
      'Right skew: mean > median',
      'Left skew: mean < median',
      'Income and order values are typically right-skewed',
    ],
    example:
      'Income data with many earners near 40k and a long tail beyond 500k is right-skewed; the mean sits above the median.',
    explanation:
      'Comparing mean to median is the fastest skew test. It also tells you which summary to report.',
    hint: 'One word for asymmetry in a distribution.',
    related: ['w8-mean-median', 'w8-histogram', 'w8-boxplot'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What term describes the asymmetry of a distribution where the mean exceeds the median and a long tail extends to the right?',
      answers: ['Skewness', 'Right skew', 'Positive skew', 'Skew', 'Skewed'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w8-histogram',
    week: 8,
    topic: 'Plots',
    title: 'Histogram',
    definition:
      'A plot that bins a single quantitative variable and displays counts or density per bin, revealing shape, centre, spread and modality.',
    keyFacts: [
      'Bin width changes the apparent shape',
      'Reveals skew, modes, gaps and extreme values',
      'For one quantitative variable only',
    ],
    example:
      'A 20-bin histogram of delivery times shows a right skew and an unexpected second peak around 90 minutes.',
    explanation:
      'Histograms answer "what is the shape of this variable?". They do not show relationships between variables.',
    hint: 'One word: the binned bar plot of a single quantitative variable.',
    related: ['w8-skewness', 'w8-boxplot', 'w9-chart-matching'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'Which plot bins a single quantitative variable and shows the number of observations per bin?',
      answers: ['Histogram'],
      placeholder: 'Type the plot…',
    },
  },
  {
    id: 'w8-boxplot',
    week: 8,
    topic: 'Plots',
    title: 'Box plot',
    definition:
      'A plot showing median, quartiles and whiskers (to 1.5 × IQR) with points beyond them plotted as outliers, ideal for comparing a quantitative variable across categories.',
    keyFacts: [
      'Displays median, Q1, Q3, whiskers and flagged outliers',
      'Great for side-by-side group comparison',
      'Hides multimodality — a histogram may reveal it',
    ],
    example:
      'Box plots of order value per channel show that mobile has a lower median but a much wider spread.',
    explanation:
      'Box plots compress a distribution into five numbers. Use them for group comparison, and a histogram when shape matters.',
    hint: 'Two words: the quartile box with whiskers and outlier points.',
    related: ['w8-iqr', 'w8-histogram', 'w9-chart-matching'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which plot shows the median, quartiles, whiskers at 1.5 × IQR and flags outliers, and compares groups side by side?',
      answers: ['Box plot', 'Boxplot', 'Box-and-whisker plot', 'Box and whisker plot'],
      placeholder: 'Type the plot…',
    },
  },
  {
    id: 'w8-scatter',
    week: 8,
    topic: 'Plots',
    title: 'Scatter plot',
    definition:
      'A plot of one quantitative variable against another, showing the direction, strength and form of the relationship and revealing clusters or outliers.',
    keyFacts: [
      'Two quantitative variables required',
      'Shows non-linear patterns a correlation coefficient would miss',
      'Overplotting hides density in large datasets',
    ],
    example:
      'Plotting marketing spend against revenue shows a positive curve that flattens at high spend — evidence of diminishing returns.',
    explanation:
      'Scatter plots are the default check before any correlation or regression. Anscombe\'s quartet shows identical statistics with radically different shapes.',
    hint: 'Two words: the plot of two quantitative variables against each other.',
    related: ['w9-correlation-causation', 'w10-linear-regression', 'w9-chart-matching'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'Which plot displays two quantitative variables against each other to reveal the form of their relationship?',
      answers: ['Scatter plot', 'Scatterplot', 'Scatter graph'],
      placeholder: 'Type the plot…',
    },
  },
  {
    id: 'w8-chart-choice',
    week: 8,
    topic: 'Plots',
    title: 'Choosing visualisations',
    definition:
      'Match the plot to the variable types: histogram for one quantitative variable, bar chart for category counts, box plot for quantitative-by-category, scatter for quantitative-by-quantitative.',
    keyFacts: [
      'Quantitative alone → histogram',
      'Categorical frequency → bar chart',
      'Quantitative across categories → box or violin plot',
      'Two quantitative → scatter',
    ],
    example:
      'Average order value (quantitative) by channel (categorical) calls for a box plot, not a pie chart.',
    explanation:
      'Charts encode types: the wrong chart forces misleading comparisons. Choose by variable type first, then by the question asked.',
    hint: 'Assign each question to the plot type that answers it.',
    related: ['w8-histogram', 'w8-boxplot', 'w8-scatter', 'w9-chart-matching'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'assign',
      prompt: 'Assign each question to the plot type that answers it best.',
      categories: [
        { id: 'hist', label: 'Histogram' },
        { id: 'bar', label: 'Bar chart' },
        { id: 'box', label: 'Box plot' },
        { id: 'scatter', label: 'Scatter plot' },
      ],
      items: [
        { id: 'a', label: 'What is the shape of order values?', categoryId: 'hist' },
        { id: 'b', label: 'How many orders per payment method?', categoryId: 'bar' },
        { id: 'c', label: 'Is delivery time different across regions?', categoryId: 'box' },
        { id: 'd', label: 'Is spend related to revenue?', categoryId: 'scatter' },
      ],
    },
  },
]
