import type { Concept, WeekModule } from '../../types'

export const week: WeekModule = {
  week: 14,
  title: 'Project Presentation and Capstone Synthesis',
  subtitle: 'End-to-end reasoning, storytelling and responsible delivery',
  description:
    'Synthesise the whole course: connect business questions to data and evaluation, defend analytical choices, communicate findings through data storytelling, explain performance and uncertainty, address ethical and responsible use, and close with limitations, recommendations and future work.',
  learningObjectives: [
    'Trace a complete project from business question to deployment and monitoring.',
    'Defend an analytical approach against plausible alternatives.',
    'Present findings with appropriate visualisations, uncertainty and limitations.',
    'Identify ethical risks and describe responsible data practice.',
  ],
  topics: ['Lifecycle synthesis', 'Approach selection', 'Data storytelling', 'Ethics', 'Cumulative review'],
  estimatedMinutes: 45,
  accent: '#e879f9',
}

export const concepts: Concept[] = [
  {
    id: 'w14-lifecycle-synthesis',
    week: 14,
    topic: 'Lifecycle synthesis',
    title: 'End-to-end project reasoning',
    definition:
      'A capstone project justifies each lifecycle stage in sequence — business objective, data source and quality, cleaning decisions, EDA, features, model, evaluation metric, communication and deployment plan.',
    keyFacts: [
      'Every stage should trace back to the business question',
      'Evaluation metrics are chosen from the cost of errors',
      'Deployment includes monitoring and retraining plans',
    ],
    example:
      'A churn project justifies recall as its metric (retention budget is limited but missing a churner is expensive), then defines the monthly scoring cadence and drift checks.',
    explanation:
      'Examiners reward traceability: each decision should be defensible from the business objective rather than from preference.',
    hint: 'Complete the capstone chain from business objective to monitoring.',
    related: ['w1-data-science-lifecycle', 'w13-metric-choice', 'w14-recommendations'],
    difficulty: 'advanced',
    drill: {
      mode: 'cloze',
      prompt: 'Complete the capstone reasoning chain.',
      template:
        'A defensible project links the business objective to data quality, then to features and model, chooses an ___ metric from the cost of errors, and finishes with a deployment and ___ plan.',
      blanks: [{ answers: ['evaluation', 'performance'] }, { answers: ['monitoring', 'maintenance'] }],
    },
  },
  {
    id: 'w14-business-to-data',
    week: 14,
    topic: 'Approach selection',
    title: 'From business question to measurable target',
    definition:
      'Translating a business goal into a precisely defined target, population, time window and unit of analysis — before any modelling begins.',
    keyFacts: [
      'Define the target operationally (what counts as churn, over what window)',
      'Define the prediction point and the observation window',
      'Define the population and the unit of analysis',
    ],
    example:
      '"Reduce churn" becomes: "predict, 30 days before renewal, the probability that a monthly consumer subscriber cancels within 60 days".',
    explanation:
      'Ambiguity here propagates into every downstream number. The operational definition is the contract between business and analysis.',
    hint: 'What must be operationally defined before modelling: the target, population and time window.',
    related: ['w4-observational-unit', 'w4-question-types', 'w13-metric-choice'],
    difficulty: 'advanced',
    drill: {
      mode: 'short',
      prompt:
        'What must be defined operationally — alongside the population and time window — before a modelling project starts?',
      answers: ['Target', 'Target variable', 'Outcome', 'The target'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w14-approach-selection',
    week: 14,
    topic: 'Approach selection',
    title: 'Selecting and defending an approach',
    definition:
      'Choosing among descriptive analysis, statistical testing, supervised models, unsupervised segmentation or prescriptive optimisation based on the question, data availability and decision context.',
    keyFacts: [
      'Start with the simplest method that answers the question',
      'Interpretability requirements can rule out complex models',
      'Data volume and label availability constrain options',
      'Defend the choice on requirements, not on novelty',
    ],
    example:
      'For a regulator-facing credit decision, a shallow tree or logistic regression may be preferred over a gradient-boosted model despite lower accuracy.',
    explanation:
      'Approach selection is a requirements problem: interpretability, latency, data volume, labelling cost and risk tolerance all constrain the answer.',
    hint: 'Select the factors that should drive a defensible method choice.',
    related: ['w10-paradigms', 'w11-pros-cons', 'w14-responsible-data'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every legitimate reason to choose a simpler model over a more accurate one.',
      options: [
        { id: 'a', label: 'Regulatory requirements demand explainable decisions', correct: true },
        { id: 'b', label: 'The team cannot maintain a complex model in production', correct: true },
        { id: 'c', label: 'The simpler model sounds less impressive in a presentation', correct: false },
        { id: 'd', label: 'Only a small labelled dataset is available', correct: true },
        { id: 'e', label: 'Stakeholders need to audit each decision', correct: true },
      ],
    },
  },
  {
    id: 'w14-data-storytelling',
    week: 14,
    topic: 'Data storytelling',
    title: 'Data storytelling',
    definition:
      'Structuring findings as a narrative — context, evidence, interpretation, recommendation — so that a decision-maker can act on the analysis.',
    keyFacts: [
      'Lead with the answer, then the evidence',
      'One message per visual',
      'Avoid jargon; quantify impact in business units',
      'State uncertainty and limitations explicitly',
    ],
    example:
      'A deck opens with "Switching the checkout flow would add ~4k orders per month (±900)", then shows the experiment, the caveats and the rollout plan.',
    explanation:
      'Storytelling is not decoration: it is the delivery mechanism for a decision. If the audience cannot act, the analysis has not landed.',
    hint: 'Two words: presenting findings as context–evidence–recommendation.',
    related: ['w9-visualization-mistakes', 'w14-presentation-viz', 'w13-communicating'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What practice presents analysis as a structured narrative of context, evidence, interpretation and recommendation?',
      answers: ['Data storytelling', 'Storytelling'],
      placeholder: 'Type the practice…',
    },
  },
  {
    id: 'w14-presentation-viz',
    week: 14,
    topic: 'Data storytelling',
    title: 'Visualisation for stakeholders',
    definition:
      'Choosing presentation visuals for clarity and decision support: one message per chart, annotated key points, honest axes and no more precision than the audience needs.',
    keyFacts: [
      'Simplify: fewer categories, direct labels, no 3D',
      'Annotate the insight instead of expecting interpretation',
      'Show uncertainty ranges where decisions depend on them',
      'Match chart type to the comparison being made',
    ],
    example:
      'A single annotated line chart with the intervention date marked communicates the experiment outcome better than a dense dashboard.',
    explanation:
      'Presentation charts optimise for comprehension, not for completeness. Detail belongs in an appendix.',
    hint: 'Select every choice that improves a stakeholder-facing chart.',
    related: ['w9-chart-matching', 'w9-visualization-mistakes', 'w14-data-storytelling'],
    difficulty: 'core',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every practice that improves a stakeholder-facing chart.',
      options: [
        { id: 'a', label: 'Annotating the key point directly on the chart', correct: true },
        { id: 'b', label: 'Adding a third dimension for visual depth', correct: false },
        { id: 'c', label: 'Keeping the axis honest and labelling units', correct: true },
        { id: 'd', label: 'Limiting each chart to one message', correct: true },
        { id: 'e', label: 'Showing 40 categories so nothing is omitted', correct: false },
      ],
    },
  },
  {
    id: 'w14-model-limits',
    week: 14,
    topic: 'Data storytelling',
    title: 'Explaining performance and uncertainty',
    definition:
      'Reporting model performance with per-class error rates, confidence intervals or ranges, and a plain-language statement of what the uncertainty means for the decision.',
    keyFacts: [
      'Give a range, not a false-precision point estimate',
      'Explain the base rate alongside the metric',
      'Say what would change the conclusion',
    ],
    example:
      '"Expected lift is 4,000 orders per month, with a plausible range of 3,100–4,900; the decision holds unless the effect is below 2,000."',
    explanation:
      'Uncertainty is decision-relevant information. Hiding it transfers risk silently to the stakeholder.',
    hint: 'Two words: the range around an estimate that the audience needs to hear.',
    related: ['w13-communicating', 'w9-stat-practical', 'w9-type2-error'],
    difficulty: 'advanced',
    drill: {
      mode: 'short',
      prompt:
        'What should accompany a point estimate so that decision-makers understand how precise it really is?',
      answers: ['Confidence interval', 'Uncertainty', 'Confidence intervals', 'Uncertainty range', 'Interval'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w14-responsible-data',
    week: 14,
    topic: 'Ethics',
    title: 'Responsible data use',
    definition:
      'Using data lawfully and ethically: lawful basis and consent, minimisation of personal data, privacy protection, fairness across groups, transparency and accountability for outcomes.',
    keyFacts: [
      'Collect and retain only what the question requires',
      'Check performance and harms across subgroups',
      'Document intended use and known limitations',
      'Provide a route to contest automated decisions',
    ],
    example:
      'A hiring model must be audited for disparate impact across demographic groups before it is used to screen applicants.',
    explanation:
      'Ethics is not only compliance: a model can be legal and still cause harm through proxy variables and feedback loops.',
    hint: 'Select every practice that belongs to responsible data use.',
    related: ['w14-bias-sources', 'w14-approach-selection', 'w3-provenance'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every practice that belongs to responsible data use.',
      options: [
        { id: 'a', label: 'Collecting only the personal data the question requires', correct: true },
        { id: 'b', label: 'Evaluating model performance across demographic subgroups', correct: true },
        { id: 'c', label: 'Publishing individual-level records to maximise transparency', correct: false },
        { id: 'd', label: 'Documenting intended use and known limitations', correct: true },
        { id: 'e', label: 'Assuming a proxy variable is harmless because the protected attribute was removed', correct: false },
      ],
    },
  },
  {
    id: 'w14-bias-sources',
    week: 14,
    topic: 'Ethics',
    title: 'Sources of bias',
    definition:
      'Bias enters through sampling, measurement, labelling and historical decisions, and can persist through proxy variables that encode protected attributes.',
    keyFacts: [
      'Historical bias: the data reflect past discriminatory decisions',
      'Sampling bias: some groups are under-represented',
      'Label bias: human labels encode subjective judgements',
      'Proxy variables can reintroduce protected information',
    ],
    example:
      'A model trained on past hiring decisions learns the biases of those decisions, even without a gender column.',
    explanation:
      'Removing a protected attribute does not remove bias. The training data itself carries the pattern.',
    hint: 'Which kind of bias arises when training data reflect past discriminatory decisions?',
    related: ['w14-responsible-data', 'w3-provenance', 'w5-cleaning-tradeoffs'],
    difficulty: 'advanced',
    drill: {
      mode: 'short',
      prompt:
        'What term describes bias that enters a model because the training data reflect past discriminatory decisions?',
      answers: ['Historical bias', 'Label bias', 'Sampling bias', 'Bias', 'Algorithmic bias'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w14-recommendations',
    week: 14,
    topic: 'Ethics',
    title: 'Limitations, recommendations and future work',
    definition:
      'A closing section that states what the analysis does not establish, what action follows from it, and what evidence would strengthen the next iteration.',
    keyFacts: [
      'Limitations are scoped: data, method, population, time',
      'Recommendations are concrete, owned and measurable',
      'Future work names the specific additional data or design needed',
    ],
    example:
      '"Limitation: no enterprise accounts. Recommendation: pilot on consumer renewals next quarter. Future work: instrument the cancellation flow to capture reasons."',
    explanation:
      'This section converts analysis into an accountable next step. Vague hand-waving ("more data would help") is a red flag.',
    hint: 'Select the hallmarks of a strong closing section.',
    related: ['w13-communicating', 'w14-lifecycle-synthesis', 'w4-prescriptive'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every hallmark of a strong limitations-and-recommendations section.',
      options: [
        { id: 'a', label: 'Stating which populations and time periods were not evaluated', correct: true },
        { id: 'b', label: 'Recommending a concrete next experiment with an owner', correct: true },
        { id: 'c', label: 'Claiming the results generalise everywhere to look confident', correct: false },
        { id: 'd', label: 'Naming the specific data that would reduce uncertainty next', correct: true },
        { id: 'e', label: 'Omitting limitations because they undermine the headline', correct: false },
      ],
    },
  },
  {
    id: 'w14-cumulative-concepts',
    week: 14,
    topic: 'Cumulative review',
    title: 'Cumulative review: concepts',
    definition:
      'A final pass over the course’s load-bearing distinctions: AI/ML/DL/DS, structure/type/scale, tidy rules, missingness mechanisms, scaling and encoding, impurity measures, and precision vs recall.',
    keyFacts: [
      'Definitions must survive without prompts',
      'Each distinction has a canonical counter-example',
      'Confusing two adjacent terms is the main failure mode',
    ],
    example:
      'Distinguishing MAR from MNAR decides whether imputation is defensible; mislabelling it invalidates the whole analysis.',
    explanation:
      'Cumulative questions mix weeks deliberately. Identify which distinction each option turns on.',
    hint: 'Select only the statements that are true across the whole course.',
    related: ['w1-ai-ml-dl-ds', 'w5-mnar', 'w7-one-hot', 'w13-recall'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every statement that is TRUE across the whole course.',
      options: [
        { id: 'a', label: 'Z-score standardization produces mean 0 and standard deviation 1', correct: true },
        { id: 'b', label: 'Information gain is the impurity reduction of a split', correct: true },
        { id: 'c', label: 'Recall is TP / (TP + FP)', correct: false },
        { id: 'd', label: 'A correctly answered Box 5 review stays in Box 5 for another 30 days', correct: true },
        { id: 'e', label: 'Label encoding is the safest choice for nominal variables in linear models', correct: false },
      ],
    },
  },
  {
    id: 'w14-cumulative-pipeline',
    week: 14,
    topic: 'Cumulative review',
    title: 'Cumulative review: the pipeline',
    definition:
      'Put every stage in order and attach the right safeguard to each: split before transformations, fit preprocessing on train only, evaluate with metrics matched to error costs, and monitor after deployment.',
    keyFacts: [
      'Split → fit → transform → train → evaluate',
      'Leakage invalidates evaluation silently',
      'Deployment requires monitoring for drift',
    ],
    example:
      'A pipeline that imputes, scales and encodes inside the training fold — then applies the fitted transformers to test — cannot leak.',
    explanation:
      'The pipeline order is the single most examined practical sequence in the course. Each arrow is a place where projects break.',
    hint: 'Assign each stage of the pipeline to its correct position.',
    related: ['w7-fit-transform', 'w10-generalization', 'w14-lifecycle-synthesis'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'assign',
      prompt: 'Assign each action to the pipeline stage where it belongs.',
      categories: [
        { id: 'before', label: 'Before modelling' },
        { id: 'training', label: 'During training' },
        { id: 'after', label: 'After deployment' },
      ],
      items: [
        { id: 'a', label: 'Split the data into train and test', categoryId: 'before' },
        { id: 'b', label: 'Fit the scaler on the training set', categoryId: 'training' },
        { id: 'c', label: 'Monitor prediction drift and retrain', categoryId: 'after' },
        { id: 'd', label: 'Define the evaluation metric from error costs', categoryId: 'before' },
      ],
    },
  },
]
