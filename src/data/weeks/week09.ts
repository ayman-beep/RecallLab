import type { Concept, WeekModule } from '../../types'

export const week: WeekModule = {
  week: 9,
  title: 'Visualization and Hypothesis Testing',
  subtitle: 'Charts that fit the data and tests that fit the claim',
  description:
    'Choose chart types that match variable types, then reason about hypotheses: null and alternative hypotheses, the significance level, the correct interpretation of p-values, Type I and Type II errors, and the difference between statistical and practical significance.',
  learningObjectives: [
    'Select a chart type from the variable types and the question.',
    'Write a null and alternative hypothesis for a scenario.',
    'Interpret a p-value and the significance level correctly.',
    'Distinguish Type I from Type II errors and statistical from practical significance.',
  ],
  topics: ['Chart selection', 'Hypotheses', 'p-values', 'Error types', 'Causation'],
  estimatedMinutes: 40,
  accent: '#c084fc',
}

export const concepts: Concept[] = [
  {
    id: 'w9-chart-matching',
    week: 9,
    topic: 'Chart selection',
    title: 'Chart type for variable types',
    definition:
      'Scatter plots compare two quantitative variables, box plots compare a quantitative variable across categories, histograms show one distribution, and bar charts show category frequencies.',
    keyFacts: [
      'Two quantitative → scatter',
      'Categorical vs quantitative → box plot',
      'Distribution shape → histogram',
      'Category counts → bar chart',
    ],
    example:
      'Conversion rate (quantitative) by landing-page variant (categorical) is best shown with a box plot or bar chart, not a scatter plot.',
    explanation:
      'Charts encode variable types. Choosing a scatter plot for a categorical axis produces meaningless geometry.',
    hint: 'Which chart compares a quantitative variable across categories?',
    related: ['w8-chart-choice', 'w8-boxplot', 'w9-visualization-mistakes'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which chart type compares the distribution of a quantitative variable across the levels of a categorical variable?',
      answers: ['Box plot', 'Boxplot', 'Box-and-whisker plot'],
      placeholder: 'Type the chart type…',
    },
  },
  {
    id: 'w9-hypothesis-testing',
    week: 9,
    topic: 'Hypotheses',
    title: 'Hypothesis testing',
    definition:
      'A formal procedure that evaluates whether observed data are compatible with a stated null hypothesis, by computing how probable the observed result (or something more extreme) would be if the null were true.',
    keyFacts: [
      'Starts from a null hypothesis of no effect',
      'Produces a test statistic and a p-value',
      'Never proves the alternative hypothesis',
    ],
    example:
      'Testing whether a new checkout raises conversion: H₀ says the difference is zero, and the test asks how unusual the observed lift would be under H₀.',
    explanation:
      'The logic is indirect: assume no effect, then ask whether the data would be surprising. Failing to reject is not evidence of no effect.',
    hint: 'Two words: the procedure that evaluates data against a null hypothesis.',
    related: ['w9-null-hypothesis', 'w9-pvalue', 'w9-alpha'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What procedure evaluates how compatible observed data are with a stated null hypothesis of no effect?',
      answers: ['Hypothesis testing', 'Statistical hypothesis testing', 'Significance testing'],
      placeholder: 'Type the procedure…',
    },
  },
  {
    id: 'w9-null-hypothesis',
    week: 9,
    topic: 'Hypotheses',
    title: 'Null hypothesis',
    definition:
      'The default claim that there is no effect, no difference or no relationship; the hypothesis a significance test attempts to reject.',
    keyFacts: [
      'Notation: H₀',
      'Represents no change from the status quo',
      'Rejection happens when data would be very unlikely under H₀',
    ],
    example:
      'H₀: the new checkout page has the same conversion rate as the old one.',
    explanation:
      'The null is the straw man the test tries to knock down. A test can fail to reject it, but never proves it true.',
    hint: 'Two words: the "no effect" hypothesis, denoted H₀.',
    related: ['w9-alternative-hypothesis', 'w9-pvalue', 'w9-hypothesis-testing'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'What is the hypothesis stating that there is no effect or no difference, which a significance test tries to reject?',
      answers: ['Null hypothesis', 'Null hypothesis (H0)', 'H0', 'H₀'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w9-alternative-hypothesis',
    week: 9,
    topic: 'Hypotheses',
    title: 'Alternative hypothesis',
    definition:
      'The claim that there is an effect, a difference or a relationship — the complement of the null hypothesis, denoted H₁ or Hₐ.',
    keyFacts: [
      'Can be one-sided or two-sided',
      'Rejecting H₀ supports H₁ provisionally',
      'The direction must be specified before seeing the data',
    ],
    example:
      'H₁: the new checkout page has a different conversion rate from the old one (two-sided).',
    explanation:
      'Choosing a one-sided alternative after looking at the data inflates Type I error; the direction is a design decision, not a post-hoc one.',
    hint: 'Two words: the effect hypothesis, denoted H₁.',
    related: ['w9-null-hypothesis', 'w9-alpha', 'w9-type1-error'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What is the hypothesis that asserts an effect or difference exists, denoted H₁?',
      answers: ['Alternative hypothesis', 'Alternative hypothesis (H1)', 'H1', 'H₁'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w9-alpha',
    week: 9,
    topic: 'Hypotheses',
    title: 'Significance level (alpha)',
    definition:
      'The pre-specified probability of rejecting a true null hypothesis — the threshold for a statistically significant result, conventionally 0.05.',
    keyFacts: [
      'α = P(reject H₀ | H₀ true) = Type I error rate',
      'Chosen before data collection',
      'Lower α requires stronger evidence to reject',
    ],
    example:
      'With α = 0.01 a test needs p < 0.01 to reject; the same data significant at 0.05 may not be at 0.01.',
    explanation:
      'Alpha is a policy about false positives, not a property of the data. Multiple comparisons inflate the effective alpha unless corrected.',
    hint: 'The Greek letter naming the threshold probability of a false positive.',
    related: ['w9-pvalue', 'w9-type1-error', 'w9-hypothesis-testing'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What is the pre-specified probability of rejecting a true null hypothesis called (conventionally 0.05)?',
      answers: ['Significance level', 'Alpha', 'Significance level alpha', 'α'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w9-pvalue',
    week: 9,
    topic: 'p-values',
    title: 'p-value',
    definition:
      'The probability of observing a test statistic at least as extreme as the observed one, assuming the null hypothesis is true.',
    keyFacts: [
      'A statement about data given H₀ — not about H₀ given the data',
      'Small p-value → the data are unlikely under H₀',
      'Not the probability that H₀ is true',
    ],
    example:
      'p = 0.03 means that if there were truly no effect, a result this extreme would occur about 3% of the time.',
    explanation:
      'The conditional direction is the whole point: P(data | H₀) is not P(H₀ | data). Reversing it is the most common statistical error in practice.',
    hint: 'Complete the sentence describing what the p-value is the probability of.',
    related: ['w9-alpha', 'w9-pvalue-misconception', 'w9-hypothesis-testing'],
    difficulty: 'advanced',
    drill: {
      mode: 'cloze',
      prompt: 'State precisely what a p-value measures.',
      template:
        'A p-value is the probability of observing a test statistic at least as ___ as the observed one, assuming the ___ hypothesis is true.',
      blanks: [{ answers: ['extreme'] }, { answers: ['null'] }],
    },
  },
  {
    id: 'w9-pvalue-misconception',
    week: 9,
    topic: 'p-values',
    title: 'p-value misconceptions',
    definition:
      'A p-value is not the probability the null is true, not the probability of a false positive, and not a measure of effect size.',
    keyFacts: [
      'p = 0.04 does not mean a 4% chance H₀ is true',
      'Statistical significance ≠ importance',
      'p-values depend on sample size',
    ],
    example:
      'With 2 million users, a 0.01% conversion lift can produce p < 0.001 while being commercially irrelevant.',
    explanation:
      'Large samples make trivial effects significant; small samples hide real ones. Always report effect size and uncertainty alongside p.',
    hint: 'Select only the statements that interpret p-values correctly.',
    related: ['w9-pvalue', 'w9-stat-practical', 'w9-alpha'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every statement that is a CORRECT interpretation of a p-value.',
      options: [
        { id: 'a', label: 'It is the probability of a result at least as extreme, assuming H₀ is true', correct: true },
        { id: 'b', label: 'It is the probability that H₀ is true', correct: false },
        { id: 'c', label: 'It says nothing directly about the size of the effect', correct: true },
        { id: 'd', label: 'A small p-value proves the alternative hypothesis is true', correct: false },
        { id: 'e', label: 'It can be made smaller by collecting far more data', correct: true },
      ],
    },
  },
  {
    id: 'w9-type1-error',
    week: 9,
    topic: 'Error types',
    title: 'Type I error',
    definition:
      'Rejecting a true null hypothesis — reporting an effect that does not exist, a false positive.',
    keyFacts: [
      'Probability controlled by the significance level α',
      'Costly when the intervention is expensive or harmful',
      'Reduced by lower α, at the cost of more Type II errors',
    ],
    example:
      'Concluding a new pricing page improves conversion when the observed lift was random noise.',
    explanation:
      'Type I error is the false alarm. Its rate is chosen deliberately through α.',
    hint: 'The error in the table that means "false positive".',
    related: ['w9-type2-error', 'w9-alpha', 'w9-stat-practical'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What is the error called when you reject a true null hypothesis, reporting an effect that does not exist?',
      answers: ['Type I error', 'Type 1 error', 'Type I error (false positive)', 'False positive'],
      placeholder: 'Type the error…',
    },
  },
  {
    id: 'w9-type2-error',
    week: 9,
    topic: 'Error types',
    title: 'Type II error',
    definition:
      'Failing to reject a false null hypothesis — missing a real effect, a false negative.',
    keyFacts: [
      'Probability denoted β; power = 1 − β',
      'Increased by small samples and by low α',
      'Costly when a genuinely useful effect is discarded',
    ],
    example:
      'A real 5% conversion lift is declared non-significant because the test only had 200 users per variant.',
    explanation:
      'Type II error is the missed opportunity. Power analysis before the experiment is how you avoid it.',
    hint: 'The error in the table that means "false negative".',
    related: ['w9-type1-error', 'w9-pvalue', 'w9-hypothesis-testing'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What is the error called when you fail to reject a false null hypothesis, missing a real effect?',
      answers: ['Type II error', 'Type 2 error', 'Type II error (false negative)', 'False negative'],
      placeholder: 'Type the error…',
    },
  },
  {
    id: 'w9-error-types',
    week: 9,
    topic: 'Error types',
    title: 'Type I vs Type II',
    definition:
      'Type I: rejecting H₀ when it is true (false positive). Type II: failing to reject H₀ when it is false (false negative).',
    keyFacts: [
      'Lower α ⇒ fewer Type I, more Type II',
      'Larger samples ⇒ fewer Type II errors at fixed α',
      'The two errors trade off against each other',
    ],
    example:
      'A spam filter tuned to almost never mark real mail as spam (low Type I) lets more spam through (higher Type II).',
    explanation:
      'Framing the trade-off in business terms is the practical skill: which error is more expensive here?',
    hint: 'Assign each outcome to the error type it represents.',
    related: ['w9-type1-error', 'w9-type2-error', 'w9-alpha'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'assign',
      prompt: 'Assign each outcome to the error type it represents.',
      categories: [
        { id: 'one', label: 'Type I error' },
        { id: 'two', label: 'Type II error' },
      ],
      items: [
        { id: 'a', label: 'Launching a feature that actually has no effect', categoryId: 'one' },
        { id: 'b', label: 'Stopping a genuinely effective campaign as a failure', categoryId: 'two' },
        { id: 'c', label: 'Declaring a difference significant when it is noise', categoryId: 'one' },
        { id: 'd', label: 'Concluding "no evidence of uplift" when uplift is real', categoryId: 'two' },
      ],
    },
  },
  {
    id: 'w9-stat-practical',
    week: 9,
    topic: 'Causation',
    title: 'Statistical vs practical significance',
    definition:
      'Statistical significance means the result is unlikely under the null; practical significance means the effect is large enough to matter for a decision.',
    keyFacts: [
      'Huge samples make trivial effects significant',
      'Report effect size and confidence intervals',
      'Decisions depend on cost, scale and risk',
    ],
    example:
      'A 0.02-point lift in a 5-point rating with p < 0.001 is statistically significant but commercially negligible.',
    explanation:
      'Significance answers "is it real?"; practical significance answers "does it matter?". Stakeholders need the second.',
    hint: 'Two words for "the effect is large enough to matter for a decision".',
    related: ['w9-pvalue-misconception', 'w14-model-limits', 'w9-type2-error'],
    difficulty: 'advanced',
    drill: {
      mode: 'short',
      prompt:
        'What term describes an effect that is large enough to matter for a decision, regardless of p-values?',
      answers: ['Practical significance', 'Practical significance (business significance)', 'Business significance'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w9-correlation-causation',
    week: 9,
    topic: 'Causation',
    title: 'Correlation vs causation',
    definition:
      'Correlation measures the strength of a linear association between two variables; causation means one variable produces a change in the other. Association alone cannot establish causation.',
    keyFacts: [
      'Confounders can create spurious correlation',
      'Reverse causality is possible',
      'Causal claims need design: randomisation or a credible identification strategy',
    ],
    example:
      'Ice-cream sales correlate with drowning rates, but heat drives both — ice cream does not cause drowning.',
    explanation:
      'The correlation coefficient is symmetric and design-blind. Causal inference requires assumptions about how data were generated.',
    hint: 'Two words joined by "vs": what association cannot establish.',
    related: ['w4-diagnostic', 'w8-scatter', 'w14-responsible-data'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What is the principle stating that an observed association between two variables does not by itself establish that one causes the other?',
      answers: ['Correlation vs causation', 'Correlation does not imply causation', 'Correlation is not causation', 'Correlation vs. causation'],
      placeholder: 'Type the principle…',
    },
  },
  {
    id: 'w9-visualization-mistakes',
    week: 9,
    topic: 'Chart selection',
    title: 'Visualization mistakes',
    definition:
      'Common errors: truncated axes exaggerating differences, pie charts with many slices, 3D effects, dual axes implying causality, and colour misuse including encoding meaning by colour alone.',
    keyFacts: [
      'Truncated y-axis exaggerates small changes',
      'Pie charts fail beyond a few slices',
      'Dual axes create false causal readings',
      'Redundant encoding aids accessibility',
    ],
    example:
      'A bar chart starting at 95% makes a 1-point difference look like a doubling, distorting the decision.',
    explanation:
      'Charts are arguments. Every axis choice either supports honest comparison or manufactures an impression.',
    hint: 'Select the practices that genuinely mislead readers.',
    related: ['w8-chart-choice', 'w14-data-storytelling', 'w9-stat-practical'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every practice that makes a chart misleading.',
      options: [
        { id: 'a', label: 'Truncating the y-axis on a bar chart to exaggerate a small difference', correct: true },
        { id: 'b', label: 'Labelling axes with units', correct: false },
        { id: 'c', label: 'Using a pie chart with 14 slices', correct: true },
        { id: 'd', label: 'Showing two unrelated series on dual y-axes to imply causation', correct: true },
        { id: 'e', label: 'Ordering categories by value so comparison is easier', correct: false },
      ],
    },
  },
]
