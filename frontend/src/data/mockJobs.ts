import { Job } from '../types';

export const INITIAL_JOBS_CATALOG: Job[] = [
  {
    id: 'job-openai-backend',
    source: 'direct',
    external_id: 'oai-001',
    url: 'https://openai.com/careers',
    title: 'Software Engineer Intern - Systems & Backend',
    company: 'OpenAI',
    company_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    location: 'San Francisco, CA / Remote',
    is_remote: true,
    employment_type: 'Full-time Intern',
    seniority: 'intern',
    salary_min: 95000,
    salary_max: 130000,
    currency: '$',
    description: `OpenAI's mission is to ensure that artificial general intelligence benefits all of humanity. As a Software Engineer Intern on our Systems & Infrastructure team, you will build the scalable backend and retrieval services powering ChatGPT and developer APIs.

What you will build:
• Architect high-throughput backend APIs using modern Python, FastAPI, and asynchronous request queues.
• Build low-latency retrieval pipelines over millions of vectorized documents using PostgreSQL and vector indexing.
• Design streaming endpoints (Server-Sent Events) with strict reliability and sub-100ms response targets.
• Write robust automated unit and integration tests.

Requirements:
• Strong coding skills in Python, C++, or Go.
• Familiarity with relational databases (PostgreSQL) and vector databases.
• Passion for building reliable backend systems and developer-facing APIs.`,
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis', 'REST APIs', 'Git'],
    posted_at: '2026-03-24T10:00:00Z',
    role_family: 'backend',
  },
  {
    id: 'job-scale-ai',
    source: 'arbeitnow',
    external_id: 'scale-ai-401',
    url: 'https://scale.com/careers',
    title: 'Junior Full Stack Engineer (AI Applications)',
    company: 'Scale AI',
    company_logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80',
    location: 'Remote',
    is_remote: true,
    employment_type: 'Full-time',
    seniority: 'junior',
    salary_min: 105000,
    salary_max: 135000,
    currency: '$',
    description: `Scale AI powers the foundational models of tomorrow. Our Generative AI applications team builds the interactive annotation interfaces and model-evaluation dashboards used by top enterprises.

Responsibilities:
• Develop high-performance web applications using React, TypeScript, Next.js, and Tailwind CSS.
• Connect frontend interfaces to Python and Node.js microservices with real-time streaming endpoints.
• Build real-time model evaluation queues with human-in-the-loop review queues.

Requirements:
• 1-2 years experience with TypeScript, React, Node.js, and modern CSS.
• Experience connecting to RESTful APIs and databases (PostgreSQL or MongoDB).`,
    skills: ['TypeScript', 'React', 'Node.js', 'Express.js', 'Python', 'Tailwind CSS', 'REST APIs', 'PostgreSQL'],
    posted_at: '2026-03-22T14:30:00Z',
    role_family: 'fullstack',
  },
  {
    id: 'job-supabase-vector',
    source: 'remotive',
    external_id: 'rem-supabase-502',
    url: 'https://supabase.com/careers',
    title: 'Backend & Database Engineer',
    company: 'Supabase',
    company_logo: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=128&auto=format&fit=crop&q=80',
    location: 'Remote Worldwide',
    is_remote: true,
    employment_type: 'Full-time',
    seniority: 'junior',
    salary_min: 110000,
    salary_max: 145000,
    currency: '$',
    description: `Supabase is an open source platform providing a dedicated PostgreSQL database, authentication, instant APIs, and vector embeddings for modern developers.

What you will do:
• Build backend APIs and extensions around PostgreSQL, pgvector, and PostgREST.
• Write automated integration tests verifying database migration and connection pooling performance.
• Optimize SQL queries, indexes, and caching strategies.

Qualifications:
• Solid understanding of relational database internals, SQL optimization, and ACID transactions.
• Proficiency in Python, TypeScript, or Go with Docker containerization knowledge.`,
    skills: ['PostgreSQL', 'SQL', 'Python', 'TypeScript', 'Docker', 'Redis', 'Git'],
    posted_at: '2026-03-25T08:00:00Z',
    role_family: 'backend',
  },
  {
    id: 'job-anthropic-systems',
    source: 'direct',
    external_id: 'ant-601',
    url: 'https://www.anthropic.com/careers',
    title: 'AI Systems Engineer Intern',
    company: 'Anthropic',
    company_logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=128&auto=format&fit=crop&q=80',
    location: 'San Francisco, CA / Remote',
    is_remote: true,
    employment_type: 'Full-time Intern',
    seniority: 'intern',
    salary_min: 100000,
    salary_max: 135000,
    currency: '$',
    description: `Anthropic is an AI safety and research company that builds reliable, interpretable, and steerable AI systems like Claude.

What you will do:
• Build reliable distributed systems and evaluation harnesses for frontier AI models.
• Implement real-time monitoring and benchmark suites measuring model capabilities and hallucination rates.
• Work with high-performance Python and Rust backend services.

Qualifications:
• Strong programming fundamentals in Python.
• Experience with databases, containerization (Docker), and asynchronous processing.`,
    skills: ['Python', 'Docker', 'FastAPI', 'PostgreSQL', 'PyTorch', 'Linux', 'Git'],
    posted_at: '2026-03-23T11:00:00Z',
    role_family: 'ml_ai',
  },
  {
    id: 'job-vercel-frontend',
    source: 'arbeitnow',
    external_id: 'arb-vercel-603',
    url: 'https://vercel.com/careers',
    title: 'Frontend Systems Engineer',
    company: 'Vercel',
    company_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    location: 'Remote',
    is_remote: true,
    employment_type: 'Full-time',
    seniority: 'junior',
    salary_min: 115000,
    salary_max: 150000,
    currency: '$',
    description: `Vercel gives developers the framework and platform to build the fastest web applications. The Frontend Systems team builds open-source primitives for streaming chat, reactive UI components, and developer tooling.

Responsibilities:
• Build ergonomic React components and streaming hooks for modern web interfaces.
• Maintain documentation, examples, and interactive playground widgets.
• Optimize bundle sizes and render latency on high-frequency UI updates.

Qualifications:
• Strong mastery of modern TypeScript, React, and Next.js.
• Passion for developer experience and clean component architecture.`,
    skills: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'HTML', 'CSS', 'JavaScript'],
    posted_at: '2026-03-24T18:00:00Z',
    role_family: 'frontend',
  },
  {
    id: 'job-stripe-devplatform',
    source: 'direct',
    external_id: 'str-701',
    url: 'https://stripe.com/jobs',
    title: 'Software Engineer - Developer Platform',
    company: 'Stripe',
    company_logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&auto=format&fit=crop&q=80',
    location: 'Seattle, WA / Remote',
    is_remote: true,
    employment_type: 'Full-time',
    seniority: 'junior',
    salary_min: 130000,
    salary_max: 165000,
    currency: '$',
    description: `Stripe is an economic infrastructure platform for the internet. Millions of businesses—from the world's largest enterprises to ambitious startups—use Stripe to accept payments and manage financial operations.

What you'll do:
• Build high-availability payment APIs with strict idempotency and sub-100ms latency guarantees.
• Work with distributed storage systems, relational databases, and asynchronous task queues.
• Write comprehensive integration test suites and stress-test failure modes.

Qualifications:
• Strong computer science fundamentals (data structures, concurrency, databases).
• Experience building APIs in Python, Java, or TypeScript.`,
    skills: ['Python', 'PostgreSQL', 'Docker', 'REST APIs', 'SQL', 'Git'],
    posted_at: '2026-03-21T09:00:00Z',
    role_family: 'backend',
  },
  {
    id: 'job-datadog-observability',
    source: 'remotive',
    external_id: 'dd-801',
    url: 'https://www.datadoghq.com/careers',
    title: 'Distributed Systems & Platform Engineer',
    company: 'Datadog',
    company_logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=128&auto=format&fit=crop&q=80',
    location: 'New York, NY / Remote',
    is_remote: true,
    employment_type: 'Full-time',
    seniority: 'junior',
    salary_min: 125000,
    salary_max: 160000,
    currency: '$',
    description: `Datadog is the monitoring and security platform for cloud applications. We bring together end-to-end traces, metrics, and logs to make applications, infrastructure, and third-party services observable.

Responsibilities:
• Scale backend ingestion pipelines receiving trillions of telemetry datapoints per day.
• Implement distributed caching, partition strategies, and Kubernetes deployment charts.
• Write reliable automated tests and monitor system performance dashboards.`,
    skills: ['Python', 'Go', 'Docker', 'Kubernetes', 'Linux', 'SQL', 'Git'],
    posted_at: '2026-03-20T11:15:00Z',
    role_family: 'backend',
  },
];
