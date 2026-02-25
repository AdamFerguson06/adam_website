export const sectionContent = {
  about: {
    label: 'About',
    title: 'About Me',
    description: 'I\'m a full-stack analytics leader turned entrepreneur, currently running Falcon Media, a digital marketing agency I co-founded. I\'ve built data warehouses from scratch at multiple startups, led initiatives from $0 to $50k in daily profit, and now handle everything from sales to SEM as a founder. I thrive when the work requires wearing many hats.',
    longDescription: `I started my career at EverQuote as a Quantitative Analyst, where I spent 2.5 years growing into a Senior Quantitative Analyst. I led data analytics for a new business unit that grew to 30% of the company's total revenue within a year.

From there, I moved through a series of progressively senior analytics roles: building star schema and data vault models at Koalafi, establishing the original data warehouse architecture at Unstoppable Domains, and engineering the analytics infrastructure at O Positiv, where I developed LTV prediction models that improved forecast precision by 75%.

In late 2024, I returned to EverQuote as a consultant to lead data engineering, analytics, and product management for a new initiative. I built the data architecture from scratch, set up all data reporting, developed SEM campaigns, and helped grow the initiative from $0 to $50k in daily profit.

That experience pushed me to build something of my own. In 2025, I co-founded Falcon Media, a full-stack digital marketing agency. As Co-Founder, I handle: legal, contracts, sales, account management, finances, landing pages, SEM, and analytics.

What defines me is a willingness to do whatever a project requires, even when it's outside my "scope." I've leaned into AI tools to accelerate this approach, using them to quickly get up to speed on unfamiliar domains. If something needs to get done, I figure it out.`,
    linkText: 'LinkedIn',
    linkHref: 'https://www.linkedin.com/in/adam-g-ferguson/',
  },
  projects: {
    label: 'Projects',
    title: 'My Projects',
    description: 'Projects I\'ve built and shipped across data infrastructure, web products, and growth.',
    companies: [
      {
        name: 'Falcon Media',
        role: 'Co-Founder, CEO',
        period: '2025 - Present',
        projects: [
          {
            title: 'Lead Gen Website Portfolio',
            description: 'Five revenue-generating websites across insurance, personal loans, and banking verticals. Actively driving lead volume with full FTC compliance baked in from day one.',
            skills: ['React', 'AI-Assisted Development', 'Web Development', 'Compliance'],
            links: [
              { label: 'quotefii.com', url: 'https://quotefii.com' },
              { label: 'loanmatchpartners.com', url: 'https://loanmatchpartners.com' },
              { label: 'loancomparisongroup.com', url: 'https://loancomparisongroup.com' },
              { label: 'brightpointpartners.com', url: 'https://brightpointpartners.com' },
              { label: 'checking.brightpointpartners.com', url: 'https://checking.brightpointpartners.com' },
            ],
          },
          {
            title: 'Data Pipeline & Warehouse',
            description: 'Full-stack attribution system tracking every lead from click to revenue. AWS Lambda event capture, PostgreSQL storage, and reverse ETL to Google Ads for offline conversion optimization.',
            skills: ['Python', 'SQL', 'AWS Lambda', 'ETL/ELT', 'Data Warehousing'],
          },
          {
            title: 'Automated P&L Reporting',
            description: 'Daily profit reports delivered to Slack each morning with charts and brand-level breakdowns. Zero manual work required.',
            skills: ['Python', 'SQL', 'Data Visualization', 'Automation', 'Slack API'],
          },
          {
            title: 'Google Ads Campaigns',
            description: 'Profitably managing five-figure monthly ad spend across auto insurance, personal loans, and healthcare. One of few agencies certified for pharmaceutical advertising on Google.',
            skills: ['Google Ads', 'SEM', 'Campaign Optimization', 'Analytics'],
          },
          {
            title: 'Partnership & Sales',
            description: '5+ revenue-share partnerships sourced through cold outreach. All contract negotiations handled directly.',
            skills: ['Business Development', 'Sales', 'Contract Negotiation'],
          },
        ],
      },
      {
        name: 'EverQuote',
        role: 'Consultant',
        period: '2024 - 2025',
        projects: [
          {
            title: 'Data Architecture',
            description: 'Designed the data architecture from scratch for a new business initiative, including warehousing, reporting pipelines, and analytics infrastructure that supported scaling to $50k/day in profit.',
            skills: ['SQL', 'Data Warehousing', 'ETL/ELT', 'Data Analytics'],
          },
          {
            title: 'Growth Initiative',
            description: 'Owned the full analytics-to-optimization loop for a new initiative that scaled from $0 to $50k in daily profit: data engineering, reporting, SEM campaigns, and product decisions.',
            skills: ['SEM', 'Google Ads', 'Analytics', 'Product Management'],
          },
        ],
      },
      {
        name: 'O Positiv',
        role: 'Senior Manager, Data & Analytics',
        period: '2023 - 2024',
        projects: [
          {
            title: 'Analytics Data Warehouse',
            description: 'Designed and built O Positiv\'s first data warehouse from scratch. Star schema architecture on Snowflake with Fivetran ingestion, Airflow orchestration, and DBT transformations.',
            skills: ['SQL', 'DBT', 'Snowflake', 'Data Warehousing', 'ETL/ELT'],
          },
          {
            title: 'LTV Prediction Models',
            description: 'Built customer lifetime value prediction models across multiple methodologies. Improved 12- and 24-month forecast precision by 75%, directly informing acquisition spend decisions.',
            skills: ['Python', 'Data Science', 'Forecasting', 'Analytics'],
          },
          {
            title: 'Marketing Acquisition Dashboards',
            description: 'Built the company\'s first unified CAC and CPA dashboards, giving marketing real-time visibility into acquisition costs. Reduced weekly ad performance analysis by 8 hours.',
            skills: ['Data Visualization', 'SQL', 'Marketing Analytics', 'Business Intelligence'],
          },
          {
            title: 'A/B Testing Framework',
            description: 'Built a reusable statistical testing framework for the marketing team, automating significance calculations and result reporting. Cut per-test analysis time by 4 hours.',
            skills: ['Python', 'A/B Testing', 'Data Science', 'Automation'],
          },
        ],
      },
      {
        name: 'Koalafi',
        role: 'Manager of Sales Analytics',
        period: '2021 - 2022',
        projects: [
          {
            title: 'Star Schema & Data Vault Models',
            description: 'Designed star schema and data vault models in partnership with data engineering, built on Snowflake with DBT transformations and GitLab version control.',
            skills: ['SQL', 'DBT', 'Snowflake', 'Data Warehousing'],
          },
          {
            title: 'C-Suite Sales Analytics',
            description: 'Owned weekly sales analytics for C-suite leadership, covering pipeline velocity, conversion rates, and revenue forecasts that informed go-to-market strategy.',
            skills: ['Data Visualization', 'Business Intelligence', 'Analytics'],
          },
          {
            title: 'Automated Reporting Dashboards',
            description: 'Automated the weekly sales reporting workflow with Python pipelines feeding into Tableau dashboards. Saved 4 hours per week of manual reporting.',
            skills: ['Python', 'Tableau', 'Automation', 'Data Visualization'],
          },
          {
            title: 'Revenue Forecasting',
            description: 'Built the 2022 annual revenue forecast and monthly commission payout models, used for financial planning and sales compensation across the organization.',
            skills: ['SQL', 'Excel', 'Forecasting', 'Financial Modeling'],
          },
        ],
      },
      {
        name: 'EverQuote',
        role: 'Sr. Quantitative Analyst',
        period: '2018 - 2020',
        projects: [
          {
            title: 'New Business Unit Analytics',
            description: 'Built the analytics infrastructure and drove data-informed decisions for a new business unit from launch. The unit grew to 30% of EverQuote\'s total revenue within its first 12 months.',
            skills: ['SQL', 'Data Analytics', 'Business Intelligence'],
          },
          {
            title: 'Multi-Arm Bandit A/B Testing',
            description: 'Implemented data science model to automate A/B testing. Improved daily profit by 20% and reduced manual test monitoring by 5 hours per week.',
            skills: ['Python', 'Data Science', 'A/B Testing', 'Automation'],
          },
        ],
      },
    ],
  },
  contact: {
    label: 'Contact',
    title: 'Get in Touch',
    description: 'I\'m always happy to connect. Whether it\'s about a role, a consulting opportunity, or a Falcon Media partnership, feel free to reach out.',
    contactInfo: {
      calendar: 'https://calendly.com/adam-falconmedia/30min',
      businessEmail: 'adam@falconmedia.group',
      personalEmail: 'adam.ferguson06@gmail.com',
    },
    linkText: 'Schedule a Meeting with Me',
    linkHref: 'https://calendly.com/adam-falconmedia/30min',
  },
  misc: {
    label: 'Misc',
    title: 'Miscellaneous',
    description: 'A collection of experiments, side projects, and other creative endeavors that don\'t fit neatly into other categories.',
    miscProjects: [
      {
        name: 'Catan Board Setup',
        description: 'Built on Christmas Eve because I got tired of arguing over whether the board was set up fairly. 50 pre-generated, rules-compliant layouts. Just hit shuffle and start playing.',
        siteUrl: 'https://catanboardsetup.com/',
        siteLabel: 'CatanBoardSetup.com',
        repoUrl: 'https://github.com/AdamFerguson06/catan-board-setup',
      },
    ],
  },
  xg: {
    label: 'xG',
    title: 'xG Analytics',
    description: 'Dive into expected goals (xG) analysis and football statistics. Data-driven insights into the beautiful game.',
    linkText: 'View xG Stats',
    linkHref: '#xg',
  },
};
