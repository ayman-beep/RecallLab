import type { Concept, WeekModule } from '../../types'

export const week: WeekModule = {
  week: 2,
  title: 'Data Science Tools and Collaboration',
  subtitle: 'Languages, environments, version control and shared workflows',
  description:
    'Work with the standard toolchain of a data team: Python and R, IDEs and notebooks, Git and GitHub, cloud notebooks such as Colab, and Kaggle as a benchmarking and dataset hub.',
  learningObjectives: [
    'Choose between Python and R for a given context.',
    'Distinguish IDEs from notebooks and identify when each is appropriate.',
    'Explain version history, branches, merges, pull requests and code review.',
    'Describe a realistic workflow using Kaggle, Colab, GitHub and a local IDE.',
  ],
  topics: ['Languages', 'Environments', 'Version control', 'Cloud notebooks', 'Kaggle', 'Workflow'],
  estimatedMinutes: 30,
  accent: '#38bdf8',
}

export const concepts: Concept[] = [
  {
    id: 'w2-python',
    week: 2,
    topic: 'Languages',
    title: 'Python for data science',
    definition:
      'A general-purpose programming language whose data ecosystem (pandas, NumPy, scikit-learn, PyTorch) makes it the most common choice for end-to-end data work and ML engineering.',
    keyFacts: [
      'Strong for integration, production code and machine learning',
      'General-purpose: the same language serves scripting, APIs and pipelines',
      'Ecosystem spans data wrangling, modelling and deep learning',
    ],
    example:
      'The same Python codebase cleans data with pandas, trains a scikit-learn model and serves it through a FastAPI endpoint.',
    explanation:
      'Python wins on breadth and production integration. That is a different strength from R, which is designed around statistical analysis first.',
    hint: 'The general-purpose language whose ecosystem spans pandas, scikit-learn and PyTorch.',
    related: ['w2-r', 'w2-ide', 'w1-role-ml-engineer'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'Which general-purpose language dominates end-to-end data work and ML engineering thanks to pandas, scikit-learn and PyTorch?',
      answers: ['Python'],
      placeholder: 'Type the language…',
    },
  },
  {
    id: 'w2-r',
    week: 2,
    topic: 'Languages',
    title: 'R for statistics',
    definition:
      'A language and environment designed primarily for statistical computing and graphics, with strong support for hypothesis testing, modelling and publication-quality visualisation.',
    keyFacts: [
      'Built for statistics and visualisation first',
      'Rich packages: tidyverse, ggplot2, caret',
      'Common in academia, biostatistics and research teams',
    ],
    example:
      'An epidemiologist fits a mixed-effects model and renders a ggplot2 figure directly for a journal submission.',
    explanation:
      'R is not "the statistics version of Python" in a derogatory sense — it is purpose-built for statistical reasoning, which makes it faster for exploratory modelling and reporting.',
    hint: 'The language purpose-built for statistical computing and graphics (tidyverse, ggplot2).',
    related: ['w2-python', 'w8-central-tendency', 'w9-hypothesis-testing'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'Which language is purpose-built for statistical computing and graphics, with tidyverse and ggplot2 as its flagship packages?',
      answers: ['R', 'R language'],
      placeholder: 'Type the language…',
    },
  },
  {
    id: 'w2-python-vs-r',
    week: 2,
    topic: 'Languages',
    title: 'Python vs R',
    definition:
      'Python is general-purpose with strong production and ML integration; R is statistics-first with exceptional reporting and visualisation tooling. Both are valid; the choice depends on team and goal.',
    keyFacts: [
      'Python: production, integration, ML engineering',
      'R: statistical analysis, research reporting, visualisation',
      'Mixing both in one team creates maintenance overhead',
    ],
    example:
      'A product team standardises on Python for shared services; a biostatistics group standardises on R for analysis and reporting.',
    explanation:
      'The exam-relevant point is not which is better but which criteria to use: ecosystem fit, team skills, deployment target and existing infrastructure.',
    hint: 'Select every statement that is a fair comparison between the two.',
    related: ['w2-python', 'w2-r'],
    difficulty: 'core',
    drill: {
      mode: 'categorize',
      variant: 'multi',
      prompt: 'Select every statement that is a fair, accurate comparison.',
      options: [
        { id: 'a', label: 'R was designed around statistical computing and graphics', correct: true },
        { id: 'b', label: 'Python is general-purpose and integrates well with production services', correct: true },
        { id: 'c', label: 'R cannot produce visualisations', correct: false },
        { id: 'd', label: 'Python can only be used for statistics, never for engineering', correct: false },
        { id: 'e', label: 'Team skills and deployment target are legitimate selection criteria', correct: true },
      ],
    },
  },
  {
    id: 'w2-ide',
    week: 2,
    topic: 'Environments',
    title: 'IDE',
    definition:
      'An Integrated Development Environment: a single application bundling a code editor, debugger, terminal, project explorer and tooling integrations.',
    keyFacts: [
      'Integrated: editor + debugger + terminal + linting',
      'Best for maintainable, multi-file projects',
      'Examples: VS Code, PyCharm, RStudio',
    ],
    example:
      'In VS Code you set a breakpoint in a data-cleaning function, inspect a DataFrame mid-run and rely on type hints for errors before execution.',
    explanation:
      'The word "integrated" is the definition. A notebook is interactive but is not an IDE because debugging, refactoring and project structure are secondary.',
    hint: 'Three-letter acronym for the editor + debugger + terminal bundle.',
    related: ['w2-vscode', 'w2-jupyter', 'w2-colab'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'What do we call an application that bundles a code editor, debugger, terminal and tooling into one environment?',
      answers: ['IDE', 'Integrated Development Environment'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w2-jupyter',
    week: 2,
    topic: 'Environments',
    title: 'Jupyter notebook',
    definition:
      'An interactive document format mixing executable code cells, their outputs, and narrative text — well suited to exploration and explanation.',
    keyFacts: [
      'Cell-based, stateful execution',
      'Intermixes code, output and prose',
      'Order-of-execution can create hidden state bugs',
    ],
    example:
      'An analysis notebook plots revenue, then reads a CSV, then fits a model — readable as a story, but fragile if cells are run out of order.',
    explanation:
      'Notebooks optimise for narrative exploration; scripts and modules optimise for reproducibility. That trade-off is the key exam point.',
    hint: 'The cell-based notebook format that mixes code, output and prose.',
    related: ['w2-ide', 'w2-colab', 'w2-kaggle'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'Which interactive document format mixes executable code cells, their outputs, and narrative text?',
      answers: ['Jupyter Notebook', 'Jupyter', 'Jupyter notebook (.ipynb)'],
      placeholder: 'Type the format…',
    },
  },
  {
    id: 'w2-vscode',
    week: 2,
    topic: 'Environments',
    title: 'VS Code',
    definition:
      'A free, extensible code editor that functions as a lightweight IDE through extensions, including first-class Jupyter notebook support.',
    keyFacts: [
      'Editor-first with an extension ecosystem',
      'Supports Python, R, notebooks and Git in one window',
      'Common local development environment for data teams',
    ],
    example:
      'You edit project modules in the editor, open a .ipynb for exploration, and use the built-in Git panel to commit — without switching tools.',
    explanation:
      'VS Code blurs the line between editor and IDE, which is why teams can keep exploratory notebooks and production modules in one project.',
    hint: 'The extensible editor (shortened name) that handles notebooks and Git in one window.',
    related: ['w2-ide', 'w2-jupyter', 'w2-git'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'Which free, extensible code editor becomes a full IDE through extensions and supports Jupyter notebooks natively?',
      answers: ['Visual Studio Code', 'VS Code', 'VSCode'],
      placeholder: 'Type the tool…',
    },
  },
  {
    id: 'w2-git',
    week: 2,
    topic: 'Version control',
    title: 'Git',
    definition:
      'A distributed version control system that records snapshots (commits) of a project, enabling history, branching, merging and rollback.',
    keyFacts: [
      'Distributed: every clone holds the full history',
      'Commits are snapshots with messages and authorship',
      'Runs locally; it does not require a hosting service',
    ],
    example:
      'Before rewriting a cleaning function, you commit the working version so you can diff, review and revert if the refactor breaks results.',
    explanation:
      'Git is the version control *system*. GitHub is a hosting platform for Git repositories. Confusing the two is the most common exam error in this week.',
    hint: 'The distributed version control system itself (not the hosting site).',
    related: ['w2-github', 'w2-branch', 'w2-pull-request'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which distributed version control system records snapshots of a project and supports branching, merging and rollback?',
      answers: ['Git'],
      placeholder: 'Type the tool…',
    },
  },
  {
    id: 'w2-github',
    week: 2,
    topic: 'Version control',
    title: 'GitHub',
    definition:
      'A cloud platform for hosting Git repositories that adds collaboration features such as pull requests, issues, code review and CI integration.',
    keyFacts: [
      'Hosts remote copies of Git repositories',
      'Adds review, issue tracking and automation',
      'Not a version control system itself',
    ],
    example:
      'A teammate pushes a branch to GitHub and opens a pull request so reviewers can comment line by line before merging.',
    explanation:
      'Git tracks versions locally; GitHub adds shared hosting and social/collaboration workflows. You can use Git without GitHub, but GitHub without Git makes no sense.',
    hint: 'The hosting and collaboration platform built around Git repositories.',
    related: ['w2-git', 'w2-pull-request', 'w2-code-review'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'Which cloud platform hosts Git repositories and adds pull requests, issues and code review?',
      answers: ['GitHub'],
      placeholder: 'Type the platform…',
    },
  },
  {
    id: 'w2-branch',
    week: 2,
    topic: 'Version control',
    title: 'Branch',
    definition:
      'A movable pointer to a line of commits that lets you develop work in isolation from the main line until it is ready to merge.',
    keyFacts: [
      'Isolates work in progress from stable code',
      'Cheap and fast in Git, so branches are used per feature or fix',
      'Merging integrates a branch back into another',
    ],
    example:
      'You create a feature branch to try a new feature-encoding strategy without destabilising the shared main branch.',
    explanation:
      'A branch is a pointer, not a copy of the project, which is why creating one is instant. Isolation is the purpose; merging is the way back.',
    hint: 'One word for an isolated line of development in Git.',
    related: ['w2-git', 'w2-merge', 'w2-pull-request'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What Git concept is a movable pointer to a line of commits that isolates work in progress from the main line?',
      answers: ['Branch', 'A branch', 'Git branch'],
      placeholder: 'Type the concept…',
    },
  },
  {
    id: 'w2-merge',
    week: 2,
    topic: 'Version control',
    title: 'Merge',
    definition:
      'The operation that integrates the commits of one branch into another, combining their histories.',
    keyFacts: [
      'Fast-forward when histories have not diverged',
      'Produces conflicts when the same lines changed differently',
      'Conflicts are resolved manually, then committed',
    ],
    example:
      'Merging a completed feature branch into main replays its commits and, if a colleague edited the same function, raises a conflict for review.',
    explanation:
      'A merge conflict is normal collaboration, not an error. Git cannot decide which version is correct, so a human resolves it.',
    hint: 'The Git operation that combines branches — and the source of conflicts.',
    related: ['w2-branch', 'w2-conflict', 'w2-pull-request'],
    difficulty: 'core',
    drill: {
      mode: 'cloze',
      prompt: 'Complete the sentence about integrating branches.',
      template:
        'Integrating the commits of one branch into another is called a ___, and when both branches changed the same lines git reports a ___.',
      blanks: [{ answers: ['merge'] }, { answers: ['conflict', 'merge conflict'] }],
    },
  },
  {
    id: 'w2-conflict',
    week: 2,
    topic: 'Version control',
    title: 'Merge conflict',
    definition:
      'A state where two branches changed the same lines and Git cannot choose automatically, so a developer must resolve the difference manually.',
    keyFacts: [
      'Caused by overlapping edits, not by a broken repository',
      'Resolution is a human decision about intent',
      'Smaller, frequent merges reduce conflict size',
    ],
    example:
      'Two analysts edit the same expression in a cleaning script; the merge marks both versions and the team keeps an agreed combination.',
    explanation:
      'Conflicts are a coordination signal. Frequent small merges keep them cheap; long-lived branches make them expensive and risky.',
    hint: 'Two words: what Git raises when overlapping edits cannot be combined automatically.',
    related: ['w2-merge', 'w2-branch', 'w2-code-review'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What is raised when two branches edit the same lines and Git cannot merge them automatically?',
      answers: ['Merge conflict', 'Conflict'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w2-pull-request',
    week: 2,
    topic: 'Version control',
    title: 'Pull request',
    definition:
      'A request to merge a branch into another that also serves as a review surface, showing the diff, discussion, automated checks and approval history.',
    keyFacts: [
      'Combines review, discussion and merge in one place',
      'Runs CI checks before the merge is allowed',
      'Creates an auditable record of why a change landed',
    ],
    example:
      'A pull request shows a 40-line diff, a failing unit test, two reviewer comments and finally an approval and merge.',
    explanation:
      'The value is not the merge itself — it is the review gate and the recorded rationale. It is the standard collaboration unit in data teams.',
    hint: 'Two words: the review-and-merge request opened on GitHub.',
    related: ['w2-github', 'w2-code-review', 'w2-branch'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What GitHub workflow unit requests merging a branch and doubles as the code-review surface?',
      answers: ['Pull request', 'PR', 'Pull request (PR)'],
      placeholder: 'Type the term…',
    },
  },
  {
    id: 'w2-code-review',
    week: 2,
    topic: 'Version control',
    title: 'Code review',
    definition:
      'A systematic examination of proposed changes by someone other than the author, aimed at correctness, clarity, reproducibility and maintainability.',
    keyFacts: [
      'Catches errors before they reach the main branch',
      'Spreads context and conventions across the team',
      'Applies to data pipelines and analysis code, not just software',
    ],
    example:
      'A reviewer notices that a scaler was fitted before the train/test split — a leakage bug that would have inflated reported accuracy.',
    explanation:
      'In data work, review protects reproducibility as much as syntax. A model that cannot be re-run is not a result.',
    hint: 'Two words: the practice of having a teammate examine your diff before merge.',
    related: ['w2-pull-request', 'w7-data-leakage', 'w14-presentation-limitations'],
    difficulty: 'core',
    drill: {
      mode: 'short',
      prompt:
        'What practice has a teammate examine a proposed diff for correctness, clarity and reproducibility before it merges?',
      answers: ['Code review', 'Peer review'],
      placeholder: 'Type the practice…',
    },
  },
  {
    id: 'w2-colab',
    week: 2,
    topic: 'Cloud notebooks',
    title: 'Google Colab',
    definition:
      'A hosted notebook environment that runs Python in the browser with free access to GPUs/TPUs, removing local setup and enabling quick sharing.',
    keyFacts: [
      'Zero-install, browser-based execution',
      'Ephemeral runtime; files vanish unless saved to Drive or Git',
      'Great for prototyping and teaching, weaker for production work',
    ],
    example:
      'A study group shares a Colab notebook that trains a small image model on a free GPU in minutes.',
    explanation:
      'The ephemeral runtime is the main caveat: reproducibility requires pinning versions and persisting data, not just sharing the notebook link.',
    hint: 'The hosted browser notebook from Google with free GPU access and an ephemeral runtime.',
    related: ['w2-jupyter', 'w2-kaggle', 'w2-workflow'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'Which hosted browser notebook offers zero-install Python with free GPU access but an ephemeral runtime?',
      answers: ['Google Colab', 'Colab', 'Google Colaboratory'],
      placeholder: 'Type the service…',
    },
  },
  {
    id: 'w2-kaggle',
    week: 2,
    topic: 'Kaggle',
    title: 'Kaggle',
    definition:
      'A data-science platform offering public datasets, community notebooks and competitive leaderboards used for practice and benchmarking.',
    keyFacts: [
      'Datasets for exploration and practice',
      'Competitions with leaderboards for benchmarking',
      'Public notebooks for learning shared techniques',
    ],
    example:
      'You download a public churn dataset, study top public notebooks, then submit a submission file to see where you rank.',
    explanation:
      'Kaggle is best understood as an exploration and benchmarking environment. Leaderboard scores are not proof that a model generalises to a real business process.',
    hint: 'The platform with public datasets, competition leaderboards and shared notebooks.',
    related: ['w2-colab', 'w2-workflow', 'w13-accuracy-limits'],
    difficulty: 'intro',
    drill: {
      mode: 'short',
      prompt:
        'Which platform offers public datasets, community notebooks and competition leaderboards for benchmarking?',
      answers: ['Kaggle'],
      placeholder: 'Type the platform…',
    },
  },
  {
    id: 'w2-workflow',
    week: 2,
    topic: 'Workflow',
    title: 'End-to-end tool workflow',
    definition:
      'A typical collaboration loop: explore data on Kaggle, prototype in a cloud notebook such as Colab, collaborate and version through GitHub, then finalise and deploy with a local IDE and scripts.',
    keyFacts: [
      'Exploration and prototyping are fast and disposable',
      'Production code moves into versioned modules',
      'Each tool has a clear, different job',
    ],
    example:
      'A team prototypes a demand model in Colab, opens a pull request to move the cleaned pipeline into a VS Code project, then deploys it.',
    explanation:
      'The workflow separates throwaway exploration from maintained code. Moving from notebook to module is where reproducibility and review become possible.',
    hint: 'Match each stage of the workflow to the tool that best serves it.',
    related: ['w2-colab', 'w2-github', 'w2-vscode', 'w2-kaggle'],
    difficulty: 'advanced',
    drill: {
      mode: 'categorize',
      variant: 'assign',
      prompt: 'Assign each workflow stage to the most appropriate tool.',
      categories: [
        { id: 'kaggle', label: 'Kaggle' },
        { id: 'colab', label: 'Colab' },
        { id: 'github', label: 'GitHub' },
        { id: 'vscode', label: 'VS Code' },
      ],
      items: [
        { id: 'a', label: 'Find a public dataset and compare against a benchmark', categoryId: 'kaggle' },
        { id: 'b', label: 'Prototype quickly on a free GPU with no setup', categoryId: 'colab' },
        { id: 'c', label: 'Review a teammate diff and merge a feature branch', categoryId: 'github' },
        { id: 'd', label: 'Refactor notebooks into modules and debug locally', categoryId: 'vscode' },
      ],
    },
  },
]
