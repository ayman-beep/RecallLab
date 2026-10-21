import type { Concept, WeekModule } from '../../types'

export const week: WeekModule = {
  week: 3,
  title: 'Types of Data, Datatypes and Acquisition',
  subtitle: 'Structure, measurement scales and where data comes from',
  description:
    'Learn how data differs from information; how structured, semi-structured and unstructured data are shaped; how variables are measured; and how public datasets, databases, APIs and scraping produce data you can trust.',
  learningObjectives: [
    'Separate data structure (structured/semi-structured/unstructured) from data type and measurement scale.',
    'Classify variables as quantitative or qualitative, discrete or continuous, nominal or ordinal.',
    'Apply the nominal, ordinal, interval and ratio measurement scales correctly.',
    'Evaluate data sources such as public datasets, databases, REST APIs and scraped web pages for reliability and provenance.',
  ],
  topics: [
    'Data vs information',
    'Data structures',
    'Measurement scales',
    'Acquisition',
    'Provenance',
  ],
  estimatedMinutes: 40,
  accent: '#a78bfa',
}

export const concepts: Concept[] = [
  {
    id: 'w3-data-vs-information',
    week: 3,
    topic: 'Data vs information',
    title: 'Data vs information',
    definition:
      'Data are raw, unprocessed symbols or observations; information is data that has been processed and contextualised so it can support interpretation.',
    keyFacts: [
      'Data: recorded observations without interpretation',
      'Information: data plus context and interpretation',
      '"42" is data; "42 returns per 100 orders, twice the average" is information',
    ],
    example:
      'A log row with timestamp 14:03 and amount 0.79 is data; a dashboard stating "conversion peaked at 14:00" is information.',
    explanation:
      'The distinction is about processing and context, not storage format. Information is derived from data and carries meaning for a decision.',
    hint: 'Complete the sentence: raw observations versus processed, contextualised output.',
    related: ['w3-structured-data', 'w4-research-questions', 'w14-data-storytelling'],
    difficulty: 'intro',
    drill: {
      mode: 'cloze',
      prompt: 'Complete the distinction between the two terms.',
      template:
        'Raw, unprocessed observations are called ___, while processed and contextualised output that supports interpretation is called ___.',
      blanks: [{ answers: ['data'] }, { answers: ['information'] }],
    },
  },
  {
    id: 'w3-structured-data',
    week: 3,
    topic: 'Data structures',
    title: 'Structured data',
    definition:
      'Data organised into a predefined schema of rows and columns (or records with fixed fields), such as CSV files and relational tables.',
    keyFacts: [
      'Fixed schema defined in advance',
      'Easy to query with SQL and load into dataframes',
      'Typical sources: CSV files, SQL tables, spreadsheets',
    ],
    example:
      'A sales table with columns order_id, date, customer_id and amount is structured.',
    explanation:
      'Structure is about schema and organisation, not about whether values are numbers. Structured data can hold text columns, as long as each row follows the same fields.',
    hint: 'The term for data with a predefined tabular schema (CSV, SQL tables).',
    related: ['w3-semi-structured-data', 'w3-unstructured-data', 'w4-tidy-data'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'What term describes data that follows a predefined schema of rows and columns, as in CSV files and SQL tables?',
      answers: ['Structured data'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w3-semi-structured-data',
    week: 3,
    topic: 'Data structures',
    title: 'Semi-structured data',
    definition:
      'Data that carries self-describing tags or keys but does not obey a rigid table schema, such as JSON and XML documents.',
    keyFacts: [
      'Keys/tags describe the values inside the record',
      'Flexible: records may have different fields',
      'Examples: JSON API responses, XML, log records',
    ],
    example:
      'A JSON order object with nested line items and an optional coupon key is semi-structured: hierarchical and self-describing, but not tabular.',
    explanation:
      'The tags are the defining feature. Semi-structured data sits between rigid tables and raw text, and usually needs flattening before modelling.',
    hint: 'The term for self-describing records such as JSON and XML documents.',
    related: ['w3-structured-data', 'w3-unstructured-data', 'w3-rest-api'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'What term describes self-describing data with keys or tags, such as JSON and XML records, that has no rigid table schema?',
      answers: ['Semi-structured data', 'Semistructured data'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w3-unstructured-data',
    week: 3,
    topic: 'Data structures',
    title: 'Unstructured data',
    definition:
      'Data with no predefined schema or field structure, such as free text, images, audio and video, which must be processed into features before analysis.',
    keyFacts: [
      'No inherent tabular organisation',
      'Requires extraction: NLP, embeddings, image feature extraction',
      'Typically the majority of data an organisation holds',
    ],
    example:
      'A folder of customer-support call recordings contains no schema; you must transcribe and encode the audio before you can count complaint topics.',
    explanation:
      'Unstructured does not mean "useless" — it means there is no schema to query directly. The effort moves into feature extraction.',
    hint: 'The term for data such as raw text, images and audio that has no predefined schema.',
    related: ['w3-structured-data', 'w3-semi-structured-data', 'w1-feature-engineering'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'What term describes data such as free text, images and audio that has no predefined schema or field structure?',
      answers: ['Unstructured data'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w3-format-categorize',
    week: 3,
    topic: 'Data structures',
    title: 'Data formats and structure',
    definition:
      'CSV and SQL tables are structured; JSON and XML are semi-structured; free text, images, audio and video are unstructured.',
    keyFacts: [
      'Format implies structure, not measurement scale',
      'Graph data is its own relationship-first model',
      'The same content can be re-expressed in another structure',
    ],
    example:
      'The same customer record could be a CSV row (structured), a JSON document (semi-structured) or a paragraph in a complaint email (unstructured).',
    explanation:
      'Classifying formats is a common exam item. Remember JSON/XML are semi-structured because their tags are present but their shape varies per record.',
    hint: 'Assign each format to the structure it represents.',
    related: ['w3-structured-data', 'w3-graph-data'],
    difficulty: 'core',
    drill: {
      mode: 'categorize',
      variant: 'assign',
      prompt: 'Assign each data format to its structure category.',
      categories: [
        { id: 'structured', label: 'Structured' },
        { id: 'semi', label: 'Semi-structured' },
        { id: 'unstructured', label: 'Unstructured' },
      ],
      items: [
        { id: 'a', label: 'CSV table', categoryId: 'structured' },
        { id: 'b', label: 'SQL relational table', categoryId: 'structured' },
        { id: 'c', label: 'JSON API response', categoryId: 'semi' },
        { id: 'd', label: 'XML document', categoryId: 'semi' },
        { id: 'e', label: 'Recorded customer call', categoryId: 'unstructured' },
        { id: 'f', label: 'Product photograph', categoryId: 'unstructured' },
      ],
    },
  },
  {
    id: 'w3-graph-data',
    week: 3,
    topic: 'Data structures',
    title: 'Graph data',
    definition:
      'A data model made of nodes (entities) connected by edges (relationships), used when the relationships themselves are the primary information.',
    keyFacts: [
      'Nodes = entities such as people or accounts',
      'Edges = relationships, often with direction and weight',
      'Ideal for networks: fraud rings, social graphs, supply chains',
    ],
    example:
      'In transaction fraud detection, accounts are nodes and transfers are edges; a dense cluster of transfers signals a fraud ring.',
    explanation:
      'A graph is not unstructured — it is highly structured, but around relationships rather than rows. Converting it to a flat table loses connectivity information.',
    hint: 'Complete the sentence about the node-and-edge model.',
    related: ['w3-format-categorize', 'w3-structured-data', 'w10-supervised-learning'],
    difficulty: 'core',
    drill: {
      mode: 'cloze',
      prompt: 'Complete the description of the relationship-first data model.',
      template:
        'In graph data, entities are represented as ___ and their relationships are represented as ___.',
      blanks: [{ answers: ['nodes', 'vertices'] }, { answers: ['edges', 'links'] }],
    },
  },
  {
    id: 'w3-quantitative-qualitative',
    week: 3,
    topic: 'Measurement scales',
    title: 'Quantitative vs qualitative',
    definition:
      'Quantitative variables are measured numerically and support arithmetic (age, revenue); qualitative (categorical) variables describe membership of a group (country, plan type).',
    keyFacts: [
      'Quantitative → numbers with meaningful magnitude',
      'Qualitative → categories or labels, even if coded as numbers',
      'Coding categories as integers does not make them quantitative',
    ],
    example:
      'Response code 3 for "neutral" is qualitative: averaging 1–5 codes is interpretable only under strong assumptions.',
    explanation:
      'The question to ask is whether differences and ratios are meaningful. Zip codes stored as numbers are labels, not quantities.',
    hint: 'Two terms: numeric measurement versus categorical membership.',
    related: ['w3-nominal-ordinal', 'w8-central-tendency', 'w9-chart-matching'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'What term describes variables that express group membership or category labels rather than measurable magnitude?',
      answers: ['Qualitative', 'Qualitative variable', 'Categorical', 'Categorical variable'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w3-discrete-continuous',
    week: 3,
    topic: 'Measurement scales',
    title: 'Discrete vs continuous',
    definition:
      'Discrete quantitative variables take countable values with gaps (number of children); continuous variables can take any value in an interval, limited only by measurement precision (height, time).',
    keyFacts: [
      'Discrete: countable, often integers',
      'Continuous: measured on a continuum',
      'A rounded continuous measurement is still continuous in nature',
    ],
    example:
      'Items per order is discrete; delivery time in minutes is continuous, even if recorded to the nearest minute.',
    explanation:
      'Recording precision does not change the underlying variable type. Ask whether intermediate values are meaningful in principle.',
    hint: 'Select every variable that is discrete.',
    related: ['w3-quantitative-qualitative', 'w8-histogram', 'w8-dispersion'],
    difficulty: 'core',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every variable that is DISCRETE.',
      options: [
        { id: 'a', label: 'Number of children in a household', correct: true },
        { id: 'b', label: 'Number of support tickets opened', correct: true },
        { id: 'c', label: 'Body temperature in Celsius', correct: false },
        { id: 'd', label: 'Delivery time in minutes', correct: false },
        { id: 'e', label: 'Revenue in dollars', correct: false },
      ],
    },
  },
  {
    id: 'w3-nominal-ordinal',
    week: 3,
    topic: 'Measurement scales',
    title: 'Nominal vs ordinal',
    definition:
      'Nominal categories have no order (country, colour); ordinal categories have a meaningful order but no consistent distance between levels (small < medium < large, satisfaction ratings).',
    keyFacts: [
      'Nominal: labels only, no ranking',
      'Ordinal: ranking exists, spacing is not guaranteed equal',
      'Medians are meaningful for ordinal data; means are questionable',
    ],
    example:
      'T-shirt size is ordinal because ordering matters; product colour is nominal because no colour is "higher".',
    explanation:
      'The decisive test is whether reordering the labels changes meaning. Ordinal adds order; it does not add equal intervals.',
    hint: 'Assign each example to the scale it uses: labels-only versus ranked labels.',
    related: ['w3-quantitative-qualitative', 'w3-measurement-scales', 'w8-central-tendency'],
    difficulty: 'core',
    drill: {
      mode: 'categorize',
      variant: 'assign',
      prompt: 'Assign each variable to its measurement scale.',
      categories: [
        { id: 'nominal', label: 'Nominal' },
        { id: 'ordinal', label: 'Ordinal' },
      ],
      items: [
        { id: 'a', label: 'Blood type', categoryId: 'nominal' },
        { id: 'b', label: 'Country of residence', categoryId: 'nominal' },
        { id: 'c', label: 'Satisfaction: poor / fair / good', categoryId: 'ordinal' },
        { id: 'd', label: 'Education level: high school < bachelor < master', categoryId: 'ordinal' },
      ],
    },
  },
  {
    id: 'w3-measurement-scales',
    week: 3,
    topic: 'Measurement scales',
    title: 'Interval vs ratio',
    definition:
      'Interval scales have equal distances between values but an arbitrary zero (Celsius, IQ scores); ratio scales have equal distances plus a true zero, so ratios are meaningful (height, income, age).',
    keyFacts: [
      'Interval: differences meaningful, ratios not',
      'Ratio: differences AND ratios meaningful',
      '20°C is not twice as warm as 10°C; 20 kg is twice 10 kg',
    ],
    example:
      'Temperature in Celsius is interval; temperature in Kelvin is ratio because 0 K means no thermal energy.',
    explanation:
      'The presence of a true zero is the single test. Without it, "twice as much" is meaningless even though differences are well defined.',
    hint: 'Interval or ratio: decide whether a true zero exists.',
    related: ['w3-nominal-ordinal', 'w8-mean-median', 'w9-chart-matching'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'assign',
      prompt: 'Assign each variable to the scale it uses.',
      categories: [
        { id: 'nominal', label: 'Nominal' },
        { id: 'ordinal', label: 'Ordinal' },
        { id: 'interval', label: 'Interval' },
        { id: 'ratio', label: 'Ratio' },
      ],
      items: [
        { id: 'a', label: 'Payment method', categoryId: 'nominal' },
        { id: 'b', label: 'Customer rating 1–5 stars', categoryId: 'ordinal' },
        { id: 'c', label: 'Temperature in degrees Celsius', categoryId: 'interval' },
        { id: 'd', label: 'Annual income in dollars', categoryId: 'ratio' },
      ],
    },
  },
  {
    id: 'w3-binary',
    week: 3,
    topic: 'Measurement scales',
    title: 'Binary variables',
    definition:
      'A categorical variable with exactly two possible values, such as churned/retained or fraudulent/legitimate.',
    keyFacts: [
      'Two mutually exclusive categories',
      'Can be encoded as 0/1 for modelling',
      'Often the target variable in classification',
    ],
    example:
      '"Subscribed" with values yes/no becomes 1/0 for a logistic regression.',
    explanation:
      'Binary is a special case of categorical — nominally measured, even when encoded as numbers. It is not an interval scale.',
    hint: 'One word: a categorical variable with exactly two values.',
    related: ['w3-nominal-ordinal', 'w10-classification', 'w13-confusion-matrix'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'What is a categorical variable with exactly two possible values called?',
      answers: ['Binary variable', 'Binary', 'Dichotomous variable', 'Dichotomous'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w3-public-datasets',
    week: 3,
    topic: 'Acquisition',
    title: 'Public datasets',
    definition:
      'Freely available datasets published by governments, research groups or platforms, which are convenient but must still be assessed for coverage, licensing and collection method.',
    keyFacts: [
      'Fast starting point with no collection cost',
      'Licence and attribution requirements vary',
      'Collection method and vintage often undocumented',
    ],
    example:
      'A census open-data portal provides demographic counts by district, licensed for reuse with attribution.',
    explanation:
      'Convenience is not validity. Public data may be aggregated, outdated or collected for another purpose — all of which limit what questions it can answer.',
    hint: 'Two words for freely available datasets from agencies, research groups or platforms.',
    related: ['w3-provenance', 'w3-rest-api', 'w2-kaggle'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'What term describes freely available datasets published by governments, researchers or platforms for reuse?',
      answers: ['Public datasets', 'Open data', 'Open datasets'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w3-rest-api',
    week: 3,
    topic: 'Acquisition',
    title: 'REST API',
    definition:
      'A structured web interface that exposes data over HTTP endpoints, typically returning JSON, and is accessed programmatically with authentication and rate limits.',
    keyFacts: [
      'Endpoints + parameters replace manual browsing',
      'Returns JSON or XML, usually paginated',
      'Access controlled by keys, quotas and rate limits',
    ],
    example:
      'A script calls /v1/orders?since=2025-01-01 with an API key, paginating through results into a dataframe.',
    explanation:
      'APIs are the preferred automated source: stable schema, documented access and reproducibility. Scraping is the fallback when no API exists.',
    hint: 'Three letters + API: the HTTP interface returning JSON that scripts call for data.',
    related: ['w3-web-scraping', 'w3-provenance', 'w2-python'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What kind of structured HTTP interface returns JSON from endpoints and is called programmatically with authentication and rate limits?',
      answers: ['REST API', 'API', 'RESTful API'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w3-web-scraping',
    week: 3,
    topic: 'Acquisition',
    title: 'Web scraping',
    definition:
      'Programmatically extracting data from web pages by parsing their HTML, used when no API is available.',
    keyFacts: [
      'Brittle: layout changes break parsers',
      'Must respect terms of service, robots.txt and copyright',
      'Often needs cleaning after extraction',
    ],
    example:
      'A script parses listing pages to collect prices nightly, then stores each row with the retrieval date.',
    explanation:
      'Scraping is a legitimate last resort. The exam-relevant risks are legality, fragility and the missing metadata that an API would have provided.',
    hint: 'Two words: extracting data from HTML pages when no API exists.',
    related: ['w3-rest-api', 'w3-provenance', 'w5-inconsistent-formats'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What technique extracts data by parsing HTML from web pages when no API is available?',
      answers: ['Web scraping', 'Scraping'],
      placeholder: 'Type the technique…',
    },
  },
  {
    id: 'w3-provenance',
    week: 3,
    topic: 'Provenance',
    title: 'Data provenance',
    definition:
      'The documented origin and processing history of data — who collected it, when, how, and what transformations it has undergone.',
    keyFacts: [
      'Supports reproducibility and audit',
      'Reveals bias from collection method',
      'Includes licensing and permission records',
    ],
    example:
      'A provenance record shows a sales extract came from a partner feed, excluded refunds, and was last refreshed three months ago.',
    explanation:
      'Without provenance you cannot judge fitness for purpose or defend a conclusion. It is also how you answer "may we legally use this?".',
    hint: 'One word naming the documented origin and history of a dataset.',
    related: ['w3-public-datasets', 'w3-rest-api', 'w5-data-quality'],
    difficulty: 'advanced',
    drill: {
      mode: 'short',
      prompt:
        'What term describes the documented origin, collection method and processing history of a dataset?',
      answers: ['Data provenance', 'Provenance', 'Data lineage', 'Lineage'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w3-misconception-structure',
    week: 3,
    topic: 'Data structures',
    title: 'Structure vs type vs scale',
    definition:
      'Structure describes how data is organised (structured/semi-structured/unstructured); type describes the sort of variable (quantitative/qualitative, discrete/continuous); scale describes measurement level (nominal/ordinal/interval/ratio).',
    keyFacts: [
      'Three different questions with three different vocabularies',
      'A structured table can hold nominal, ordinal, interval or ratio columns',
      'Structure ≠ measurement scale',
    ],
    example:
      'A tidy CSV (structured) can contain a nominal column (country), an ordinal column (satisfaction) and a ratio column (revenue).',
    explanation:
      'Mixing the vocabularies is the commonest error in this week. Structure is about layout; type and scale are about the variable.',
    hint: 'Select the statements that keep structure, type and scale correctly separated.',
    related: ['w3-structured-data', 'w3-measurement-scales', 'w4-tidy-data'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every statement that is TRUE.',
      options: [
        { id: 'a', label: 'Structure and measurement scale are the same property', correct: false },
        { id: 'b', label: 'A structured table can contain columns of different measurement scales', correct: true },
        { id: 'c', label: 'Coding a nominal variable as 1, 2, 3 makes it quantitative', correct: false },
        { id: 'd', label: 'Interval scales lack a true zero, so ratios are not meaningful', correct: true },
        { id: 'e', label: 'Discrete variables can be qualitative', correct: false },
      ],
    },
  },
]
