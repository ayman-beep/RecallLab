import type { Concept, WeekModule } from '../../types'

export const week: WeekModule = {
  week: 1,
  title: 'Introduction to Data Science and the AI Ecosystem',
  subtitle: 'Where data science sits next to AI, ML and DL',
  description:
    'Define data science as a multidisciplinary problem-solving field, separate it from artificial intelligence, machine learning and deep learning, walk the data science lifecycle, and learn what each data role actually delivers.',
  learningObjectives: [
    'Define data science and explain why it is multidisciplinary.',
    'Distinguish AI, machine learning, deep learning and data science.',
    'Name and order the stages of the data science lifecycle.',
    'Match data analyst, data scientist, ML engineer and data engineer to their responsibilities and deliverables.',
  ],
  topics: ['AI ecosystem', 'Data science lifecycle', 'Data roles', 'Tools and deliverables'],
  estimatedMinutes: 35,
  accent: '#34d399',
}

export const concepts: Concept[] = [
  {
    id: 'w1-data-science-definition',
    week: 1,
    topic: 'AI ecosystem',
    title: 'Data Science',
    definition:
      'A multidisciplinary field that extracts insight from structured and unstructured data using scientific methods, statistics, computing and domain knowledge.',
    keyFacts: [
      'Combines statistics, computing and domain expertise',
      'Works with both structured and unstructured data',
      'Follows a scientific, iterative process rather than a single algorithm',
    ],
    example:
      'A retailer joins point-of-sale records with customer reviews (unstructured text) to forecast demand and reduce stockouts.',
    explanation:
      'Data science is defined by its process and breadth, not by one tool. The word "scientific" matters: hypotheses, measurement and validation are part of the definition, which is why it is not simply "programming with data".',
    hint: 'Two words. It names the whole discipline that sits at the intersection of statistics, computing and domain knowledge.',
    related: ['w1-ai-definition', 'w1-machine-learning', 'w1-data-science-lifecycle'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'Which discipline extracts insights from structured and unstructured data by combining scientific methods, statistics, computing and domain knowledge?',
      answers: ['Data Science', 'Data science (DS)'],
      placeholder: 'Type the discipline…',
    },
  },
  {
    id: 'w1-ai-definition',
    week: 1,
    topic: 'AI ecosystem',
    title: 'Artificial Intelligence',
    definition:
      'The broad field of building computer systems that perform tasks normally requiring human intelligence, such as perceiving, reasoning, learning and deciding.',
    keyFacts: [
      'Umbrella term covering ML, DL and rule-based systems',
      'Includes symbolic and expert-system approaches that do not learn from data',
      'Goal-oriented: performing tasks associated with human intelligence',
    ],
    example:
      'A chess engine that uses hand-written evaluation rules is AI, even though it may not learn from data.',
    explanation:
      'AI is the widest circle in the ecosystem. Not every AI system learns — a rule-based expert system counts as AI but not as machine learning. That is why "AI" and "ML" are not synonyms.',
    hint: 'The umbrella term, two words, abbreviated AI.',
    related: ['w1-machine-learning', 'w1-deep-learning', 'w1-ai-ml-dl-ds'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'What is the broad field of systems designed to perform tasks normally associated with human intelligence?',
      answers: ['Artificial Intelligence', 'AI'],
      placeholder: 'Type the field…',
    },
  },
  {
    id: 'w1-machine-learning',
    week: 1,
    topic: 'AI ecosystem',
    title: 'Machine Learning',
    definition:
      'A subfield of AI in which systems learn patterns from data instead of relying exclusively on explicitly programmed rules.',
    keyFacts: [
      'Learns a mapping from data rather than being hand-coded',
      'Performance improves with relevant training examples',
      'Subset of AI and the parent of deep learning',
    ],
    example:
      'A spam filter trained on thousands of labelled emails learns which word patterns predict spam, instead of a developer writing rules for every spam phrase.',
    explanation:
      'The defining shift is from rules written by humans to patterns estimated from data. ML still lives inside AI, so all ML is AI, but not all AI is ML.',
    hint: 'It is the AI subfield whose defining feature is learning patterns from data.',
    related: ['w1-ai-definition', 'w1-deep-learning', 'w10-supervised-learning'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'Which AI subfield learns patterns from data rather than relying exclusively on explicitly programmed rules?',
      answers: ['Machine Learning', 'ML'],
      placeholder: 'Type the subfield…',
    },
  },
  {
    id: 'w1-deep-learning',
    week: 1,
    topic: 'AI ecosystem',
    title: 'Deep Learning',
    definition:
      'A subset of machine learning that uses multilayer artificial neural networks to learn complex, hierarchical patterns from data.',
    keyFacts: [
      'Uses neural networks with many layers',
      'Learns features automatically, reducing manual feature engineering',
      'Needs large datasets and substantial compute',
    ],
    example:
      'An image classifier whose early layers detect edges, middle layers detect shapes and later layers detect objects such as faces.',
    explanation:
      'Deep learning is *inside* machine learning, which is inside AI. Its distinguishing feature is depth — multiple hidden layers — not simply "being advanced".',
    hint: 'Two words: the machine-learning subset built on multilayer neural networks.',
    related: ['w1-machine-learning', 'w12-neural-network', 'w1-ai-ml-dl-ds'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt: 'Which field uses multi-layer neural networks to learn complex patterns?',
      answers: ['Deep Learning', 'DL'],
      placeholder: 'Type the field…',
    },
  },
  {
    id: 'w1-ai-ml-dl-ds',
    week: 1,
    topic: 'AI ecosystem',
    title: 'AI vs ML vs DL vs DS',
    definition:
      'AI is the broad field of intelligent systems; ML is the subset that learns from data; DL is the subset of ML using deep neural networks; DS is the end-to-end problem-solving process combining statistics, computing and domain knowledge.',
    keyFacts: [
      'AI ⊃ ML ⊃ DL (nested subsets)',
      'Data science is a process, not a subset of AI',
      'Data science often *uses* ML as one tool among many',
    ],
    example:
      'A fraud team uses data science (framing the question, cleaning transactions, evaluating results) and applies an ML model, possibly a deep neural network, as one step.',
    explanation:
      'The trap is treating the four as a hierarchy of difficulty. AI, ML and DL are nested technical fields; data science is a broader workflow that borrows from statistics and can succeed without any ML at all.',
    hint: 'Match each description to the field it belongs to: broad intelligence, learning from data, multilayer networks, end-to-end process.',
    related: ['w1-ai-definition', 'w1-machine-learning', 'w1-deep-learning'],
    difficulty: 'core',
    drill: {
      mode: 'categorize',
      variant: 'assign',
      prompt: 'Assign each description to the field it defines.',
      categories: [
        { id: 'ai', label: 'AI' },
        { id: 'ml', label: 'ML' },
        { id: 'dl', label: 'DL' },
        { id: 'ds', label: 'DS' },
      ],
      items: [
        { id: 'a', label: 'Systems that perform tasks associated with human intelligence', categoryId: 'ai' },
        { id: 'b', label: 'Learns patterns from data instead of explicit rules', categoryId: 'ml' },
        { id: 'c', label: 'Multilayer neural networks learning hierarchical features', categoryId: 'dl' },
        { id: 'd', label: 'End-to-end process using statistics, computing and domain knowledge', categoryId: 'ds' },
      ],
    },
  },
  {
    id: 'w1-data-science-lifecycle',
    week: 1,
    topic: 'Data science lifecycle',
    title: 'Data Science Lifecycle',
    definition:
      'The iterative sequence of stages a data project passes through: business understanding, data collection, cleaning and preparation, exploratory data analysis, feature engineering, modelling, evaluation, visualization/communication and deployment.',
    keyFacts: [
      'Starts with the business question, not the data',
      'Iterative: evaluation often sends you back to cleaning or features',
      'Deployment is a stage, not the end of the process',
    ],
    example:
      'A churn project defines "churn" with stakeholders, pulls subscription logs, imputes missing cancellation reasons, explores survival curves, builds features, fits a model, evaluates recall and ships scores to the CRM.',
    explanation:
      'Two common errors: starting with data or algorithms, and skipping business understanding. The lifecycle is cyclic — insight at the evaluation stage frequently restarts the loop.',
    hint: 'Think of the nine-stage pipeline that begins with the business and ends with a deployed, communicated result.',
    related: ['w1-eda-stage', 'w2-workflow', 'w14-lifecycle-synthesis'],
    difficulty: 'intro',
    drill: {
      mode: 'cloze',
      prompt: 'Complete the lifecycle with its first and last stage.',
      template:
        'The data science lifecycle begins with ___ understanding and ends with ___ of the model or insight.',
      blanks: [{ answers: ['business'] }, { answers: ['deployment', 'deploying'] }],
    },
  },
  {
    id: 'w1-eda-stage',
    week: 1,
    topic: 'Data science lifecycle',
    title: 'Exploratory Data Analysis stage',
    definition:
      'The lifecycle stage that summarises and visualises data to understand distributions, relationships and anomalies before modelling.',
    keyFacts: [
      'Uses summary statistics and plots',
      'Surfaces data quality problems and surprising structure',
      'Informs feature engineering and model choice',
    ],
    example:
      'Plotting revenue by month reveals a structural break during a system outage, which must be handled before any forecast is trusted.',
    explanation:
      'EDA comes after cleaning and before modelling. It is not a formality: it is where you find that the target leaks information or that a subgroup is missing entirely.',
    hint: 'Three words, abbreviated EDA. It summarises and visualises before modelling.',
    related: ['w1-data-science-lifecycle', 'w8-eda-purpose'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which lifecycle stage summarises and visualises data to reveal distributions, relationships and anomalies before modelling?',
      answers: ['Exploratory Data Analysis', 'EDA', 'Exploratory analysis'],
      placeholder: 'Type the stage…',
    },
  },
  {
    id: 'w1-feature-engineering',
    week: 1,
    topic: 'Data science lifecycle',
    title: 'Feature Engineering',
    definition:
      'Creating, transforming and selecting input variables (features) so that a model can capture the relevant signal in the data.',
    keyFacts: [
      'Turns domain knowledge into model inputs',
      'Includes encoding, scaling, aggregation and derived ratios',
      'Often improves performance more than switching algorithms',
    ],
    example:
      'From raw transaction timestamps, derive "days since last purchase", "average basket size" and "weekend ratio".',
    explanation:
      'Feature engineering happens before modelling and must respect train/test separation: a feature computed with future or test data leaks information and inflates measured performance.',
    hint: 'Two words: the stage that builds and selects model input variables.',
    related: ['w1-data-science-lifecycle', 'w7-feature-scaling', 'w7-data-leakage'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which lifecycle stage creates and selects input variables so a model can capture relevant signal?',
      answers: ['Feature Engineering', 'Feature engineering'],
      placeholder: 'Type the stage…',
    },
  },
  {
    id: 'w1-role-data-analyst',
    week: 1,
    topic: 'Data roles',
    title: 'Data Analyst',
    definition:
      'The role focused on querying, summarising and visualising existing data to answer business questions through reports and dashboards.',
    keyFacts: [
      'Primary deliverables: dashboards, reports, ad-hoc analyses',
      'Heavy use of SQL, spreadsheets, BI tools and descriptive statistics',
      'Answers "what happened and why" for stakeholders',
    ],
    example:
      'A retail analyst builds a weekly sales dashboard and investigates why returns spiked in one region.',
    explanation:
      'Analysts work mostly with data that already exists. They rarely build production models; the output is a decision-support artefact.',
    hint: 'Two words. The role whose main deliverables are dashboards and reports.',
    related: ['w1-role-data-scientist', 'w1-role-ml-engineer', 'w1-role-data-engineer'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'Which role primarily produces dashboards, reports and ad-hoc analyses that answer business questions from existing data?',
      answers: ['Data Analyst', 'Data analyst', 'Analyst'],
      placeholder: 'Type the role…',
    },
  },
  {
    id: 'w1-role-data-scientist',
    week: 1,
    topic: 'Data roles',
    title: 'Data Scientist',
    definition:
      'The role that frames business problems as analytical problems, applies statistics and machine learning, and communicates evidence-based recommendations.',
    keyFacts: [
      'Deliverables: experiments, models, analyses and recommendations',
      'Combines statistics, programming and domain reasoning',
      'Owns the question, not just the model',
    ],
    example:
      'A data scientist designs an A/B test for a pricing page, reports the effect size with uncertainty, and recommends a rollout decision.',
    explanation:
      'The distinctive contribution is problem framing plus statistical judgement — deciding what to measure is as important as fitting the model.',
    hint: 'Two words. The role that frames the question and applies statistics and ML end to end.',
    related: ['w1-role-data-analyst', 'w1-role-ml-engineer', 'w1-role-data-engineer'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'Which role frames business problems as analytical problems, applies statistics and machine learning, and communicates evidence-based recommendations?',
      answers: ['Data Scientist', 'Data scientist'],
      placeholder: 'Type the role…',
    },
  },
  {
    id: 'w1-role-ml-engineer',
    week: 1,
    topic: 'Data roles',
    title: 'ML Engineer',
    definition:
      'The role that builds, serves, monitors and maintains machine-learning systems in production.',
    keyFacts: [
      'Deliverables: model services, pipelines, monitoring, retraining',
      'Focus on software engineering, latency, reliability and scaling',
      'Cares about drift and long-term model health',
    ],
    example:
      'An ML engineer wraps a fraud model in a low-latency API, adds feature pipelines and alerts when prediction drift exceeds a threshold.',
    explanation:
      'The training notebook is a small part of the job. ML engineers own everything needed to keep a model reliable at scale, which is why software engineering skills dominate.',
    hint: 'The role that puts models into production and keeps them healthy.',
    related: ['w1-role-data-scientist', 'w1-role-data-engineer', 'w13-class-imbalance'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'Which role builds, deploys and monitors machine-learning models as reliable production services?',
      answers: ['ML Engineer', 'Machine Learning Engineer', 'MLOps Engineer'],
      placeholder: 'Type the role…',
    },
  },
  {
    id: 'w1-role-data-engineer',
    week: 1,
    topic: 'Data roles',
    title: 'Data Engineer',
    definition:
      'The role that builds and maintains the infrastructure, pipelines and storage that make reliable data available to others.',
    keyFacts: [
      'Deliverables: ingestion pipelines, warehouses, data quality monitors',
      'Owns reliability, schema design and storage cost',
      'Makes downstream analysis possible and reproducible',
    ],
    example:
      'A data engineer builds an hourly ETL job that loads order events into a warehouse with schema validation and retry logic.',
    explanation:
      'Data engineers move and model data; they do not usually interpret it for business decisions. Without their pipelines, analysts and scientists have nothing trustworthy to query.',
    hint: 'The role that owns pipelines, storage and data infrastructure.',
    related: ['w1-role-data-analyst', 'w1-role-ml-engineer', 'w2-git-github'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'Which role builds and maintains ingestion pipelines, storage and data infrastructure so that others can use reliable data?',
      answers: ['Data Engineer', 'Data engineer'],
      placeholder: 'Type the role…',
    },
  },
  {
    id: 'w1-role-deliverables',
    week: 1,
    topic: 'Data roles',
    title: 'Role deliverables',
    definition:
      'Each data role is best distinguished by what it hands over: dashboards (analyst), analyses and models (scientist), production services (ML engineer), pipelines and warehouses (data engineer).',
    keyFacts: [
      'Deliverables reveal the real boundary between roles',
      'Roles overlap in small teams but the deliverables stay distinct',
    ],
    example:
      'The analyst ships a dashboard; the scientist ships a validated model with recommendations; the ML engineer ships the endpoint; the data engineer ships the pipeline feeding all three.',
    explanation:
      'Judging by tools is unreliable because everyone uses Python and SQL. Judging by deliverable is reliable.',
    hint: 'Match each artefact to the role that owns it.',
    related: ['w1-role-data-analyst', 'w1-role-data-scientist', 'w1-role-ml-engineer', 'w1-role-data-engineer'],
    difficulty: 'core',
    drill: {
      mode: 'categorize',
      variant: 'assign',
      prompt: 'Assign each deliverable to the role that owns it.',
      categories: [
        { id: 'analyst', label: 'Data Analyst' },
        { id: 'scientist', label: 'Data Scientist' },
        { id: 'ml', label: 'ML Engineer' },
        { id: 'engineer', label: 'Data Engineer' },
      ],
      items: [
        { id: 'a', label: 'Weekly KPI dashboard', categoryId: 'analyst' },
        { id: 'b', label: 'A/B test with confidence intervals and a recommendation', categoryId: 'scientist' },
        { id: 'c', label: 'Low-latency prediction endpoint with drift alerts', categoryId: 'ml' },
        { id: 'd', label: 'Hourly ETL job loading validated events into a warehouse', categoryId: 'engineer' },
      ],
    },
  },
  {
    id: 'w1-misconception-ai',
    week: 1,
    topic: 'AI ecosystem',
    title: 'AI misconceptions',
    definition:
      'Common errors: equating AI with ML, assuming deep learning always beats simpler models, and treating data science as a synonym for machine learning.',
    keyFacts: [
      'Rule-based systems can be AI without learning',
      'Deep learning is not automatically better with small tabular datasets',
      'Data science includes plenty of non-ML work',
    ],
    example:
      'A logistic regression on 900 rows often outperforms and out-explains a neural network, despite the network being "deeper".',
    explanation:
      'Each claim collapses a distinction the course cares about: breadth (AI), mechanism (learning), architecture (depth) and process (data science).',
    hint: 'Select every statement that is actually true about these fields.',
    related: ['w1-ai-definition', 'w1-machine-learning', 'w11-overfitting'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every statement that is TRUE.',
      options: [
        { id: 'a', label: 'All machine learning is a form of AI', correct: true },
        { id: 'b', label: 'AI and machine learning are the same thing', correct: false },
        { id: 'c', label: 'Deep learning is a subset of machine learning', correct: true },
        { id: 'd', label: 'Data science always requires a neural network', correct: false },
        { id: 'e', label: 'A rule-based expert system can be AI without learning from data', correct: true },
      ],
    },
  },
]
