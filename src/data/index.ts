import type { Tab, Article, Project } from '@/types';

export const TABS: Tab[] = [
  { id: 1, label: 'Articles',    path: '/' },
  { id: 2, label: 'My Projects', path: '/projects' },
  { id: 3, label: 'About',       path: '/about' },
  { id: 4, label: 'Skills',      path: '/skills' },
  { id: 5, label: 'Talks',       path: '/contact' },
];

export const ARTICLES: Article[] = [
  {
    id: '1',
    slug: 'optimizing-microservices-architecture-best-practices-and-pitfalls',
    date: '14th June 2024',
    title: 'Optimizing Microservices Architecture: Best Practices and Pitfalls',
    comments: 2,
    category: 'Microservices',
    author: 'Shakil Ilham',
    wordCount: 2452,
    content: [
      [
        {
          text: 'In modern system development, effective monitoring and logging are crucial for maintaining reliability and performance. Monitoring provides real-time insights into the system\'s health, helping developers and operators detect and address issues before they impact users. By utilizing various monitoring tools and techniques, teams can track metrics such as system load, response times, and error rates. These metrics offer valuable data for diagnosing performance bottlenecks and ensuring that the system operates within desired parameters.',
        },
      ],
      [
        { text: 'Logging complements ' },
        {
          text: 'monitoring by providing detailed records',
          href: 'https://en.wikipedia.org/wiki/Log_management',
        },
        {
          text: ' of system events and errors. Comprehensive logging allows developers to trace the sequence of events leading up to an issue, which is essential for debugging and understanding system behavior. It\'s important to implement a consistent logging strategy that captures relevant information without overwhelming the system with excessive data. Properly structured logs, including timestamped entries and contextual information, enable more effective analysis and troubleshooting.',
        },
      ],
      [
        {
          text: 'Integrating monitoring and logging systems into a unified approach can enhance overall system reliability. For instance, setting up alerts based on specific log patterns or monitoring thresholds can enable proactive issue resolution. Additionally, combining log data with monitoring metrics provides a holistic view of system health, making it easier to identify and address potential issues.',
        },
      ],
      [
        {
          text: 'Microservices architecture introduces unique challenges around service discovery, load balancing, and fault tolerance. Each service must be independently deployable and scalable, requiring careful design of inter-service communication patterns. Circuit breakers, bulkheads, and retry logic become essential patterns for building resilient distributed systems.',
        },
      ],
      [
        {
          text: 'Ultimately, the success of a microservices architecture depends on organizational alignment as much as technical decisions. Teams must establish clear ownership boundaries, shared standards for APIs and observability, and invest in tooling that reduces operational overhead. When done right, microservices enable rapid iteration and independent scaling — but the hidden costs of coordination should never be underestimated.',
        },
      ],
    ],
  },
  {
    id: '2',
    slug: 'implementing-ci-cd-pipelines-strategies-for-seamless-deployment',
    date: '24th June 2024',
    title: 'Implementing CI/CD Pipelines: Strategies for Seamless Deployment',
    comments: 3,
    category: 'DevOps',
    author: 'Shakil Ilham',
    wordCount: 1876,
    content: [
      [
        {
          text: 'Continuous Integration and Continuous Deployment pipelines are the backbone of modern software delivery. A well-designed CI/CD pipeline automates the path from code commit to production, reducing manual errors and enabling teams to ship features with confidence. The foundation is a fast, reliable build process that gives developers immediate feedback on every change.',
        },
      ],
      [
        { text: 'Effective pipelines are built around ' },
        {
          text: 'trunk-based development',
          href: 'https://trunkbaseddevelopment.com/',
        },
        {
          text: ' and short-lived feature branches. Long-running branches accumulate merge debt and undermine the core promise of continuous integration. Keeping branches small and merging frequently forces teams to decompose work into releasable increments.',
        },
      ],
      [
        {
          text: 'Testing strategy is the heart of any CI/CD pipeline. A balanced test pyramid — many fast unit tests, a modest suite of integration tests, and a small number of end-to-end tests — keeps the pipeline green and fast. Flaky tests are pipeline debt; investing in test reliability pays dividends in developer trust and deployment frequency.',
        },
      ],
      [
        {
          text: 'Blue-green deployments and canary releases decouple deployment from release, allowing teams to validate changes in production with minimal blast radius. Feature flags extend this capability to the application layer, enabling gradual rollouts and instant rollbacks without redeployment.',
        },
      ],
    ],
  },
  {
    id: '3',
    slug: 'understanding-containerization-docker-and-kubernetes-explained',
    date: '24th June 2024',
    title: 'Understanding Containerization: Docker and Kubernetes Explained',
    comments: 42,
    category: 'Containers',
    author: 'Shakil Ilham',
    wordCount: 2105,
    content: [
      [
        {
          text: 'Containerization has fundamentally changed how software is packaged and deployed. By bundling an application with its runtime dependencies into a portable image, containers eliminate the classic "works on my machine" problem. Docker popularized this model, providing a simple interface for building, sharing, and running containers across environments.',
        },
      ],
      [
        { text: 'Kubernetes builds on top of containers to provide ' },
        {
          text: 'orchestration at scale',
          href: 'https://kubernetes.io/docs/concepts/overview/',
        },
        {
          text: '. It handles scheduling containers across a cluster of nodes, managing health checks, rolling updates, and service discovery automatically. While its learning curve is steep, the operational leverage it provides for large-scale systems is unmatched.',
        },
      ],
      [
        {
          text: 'Resource requests and limits are a critical but often neglected aspect of Kubernetes operations. Without proper resource budgeting, a noisy-neighbor workload can starve other services of CPU or memory. Vertical and horizontal pod autoscalers help match resource allocation to actual demand, but they require accurate baseline metrics to function effectively.',
        },
      ],
      [
        {
          text: 'The ecosystem around Kubernetes — Helm for packaging, Istio for service mesh, Prometheus and Grafana for observability — has matured rapidly. However, platform teams should resist adding every tool available. Each component added to the stack increases operational complexity. Start minimal, add only what problems demand.',
        },
      ],
    ],
  },
  {
    id: '4',
    slug: 'scalable-database-design-techniques-for-high-performance-systems',
    date: '24th June 2024',
    title: 'Scalable Database Design: Techniques for High-Performance Systems',
    comments: 0,
    category: 'Database',
    author: 'Shakil Ilham',
    wordCount: 1990,
    content: [
      [
        {
          text: 'Designing a database for scale requires thinking beyond the happy path. Read-heavy workloads call for replication and caching strategies; write-heavy workloads demand careful partitioning and careful consideration of consistency guarantees. The choice between relational and non-relational storage should be driven by access patterns, not fashion.',
        },
      ],
      [
        { text: 'Indexing is the single highest-leverage optimization available to most applications. A missing index on a frequently queried column can turn ' },
        {
          text: 'a millisecond query into a full table scan',
          href: 'https://use-the-index-luke.com/',
        },
        {
          text: ' that takes seconds. Equally, over-indexing slows writes and wastes storage. Query plans should be reviewed regularly as data volumes and access patterns evolve.',
        },
      ],
      [
        {
          text: 'Horizontal sharding distributes data across multiple database nodes, enabling write throughput to scale with the number of shards. However, queries that span shards become expensive cross-shard joins. A well-chosen shard key — one that distributes load evenly and aligns with common query patterns — is the difference between a sharded system that scales and one that merely shifts the bottleneck.',
        },
      ],
      [
        {
          text: 'Connection pooling, read replicas, and materialized views are often underutilized tools in the scalability toolkit. Before reaching for a distributed database, these simpler techniques applied thoughtfully can take a system surprisingly far with far less operational complexity.',
        },
      ],
    ],
  },
  {
    id: '5',
    slug: 'effective-monitoring-and-logging-for-system-reliability',
    date: '24th June 2024',
    title: 'Effective Monitoring and Logging for System Reliability',
    comments: 7,
    category: 'DevOps',
    author: 'Shakil Ilham',
    wordCount: 1654,
    content: [
      [
        {
          text: 'Observability is the property of a system that allows you to understand its internal state from its external outputs. The three pillars — metrics, logs, and traces — each answer different questions. Metrics tell you something is wrong; logs tell you what happened; traces tell you where it happened across service boundaries.',
        },
      ],
      [
        { text: 'The ' },
        {
          text: 'RED method',
          href: 'https://grafana.com/blog/2018/08/02/the-red-method-how-to-instrument-your-services/',
        },
        {
          text: ' — Rate, Errors, and Duration — provides a minimal but highly effective monitoring framework for any service. Instrumenting every service with these three signals creates a consistent operational baseline that makes anomalies immediately visible without drowning the team in noise.',
        },
      ],
      [
        {
          text: 'Structured logging transforms logs from opaque strings into queryable data. Emitting JSON with consistent field names — service name, trace ID, severity, timestamp — enables log aggregation systems to index and filter at scale. Ad-hoc grep is no longer viable when logs are distributed across dozens of services and hundreds of instances.',
        },
      ],
      [
        {
          text: 'Alerting strategy deserves as much design attention as the systems being monitored. Alert on symptoms, not causes. Page only for conditions that require immediate human action. Every alert that fires should have a clear runbook. Alert fatigue is as dangerous as no alerting at all — on-call engineers who ignore alerts are unsupervised systems.',
        },
      ],
    ],
  },
  {
    id: '6',
    slug: 'implementing-ci-cd-pipelines-strategies-for-seamless-deployment-2',
    date: '24th June 2024',
    title: 'Implementing CI/CD Pipelines: Strategies for Seamless Deployment',
    comments: 3,
    category: 'DevOps',
    author: 'Shakil Ilham',
    wordCount: 1876,
    content: [
      [{ text: 'A practical guide to building robust deployment pipelines that reduce toil and increase confidence when shipping software to production.' }],
    ],
  },
  {
    id: '7',
    slug: 'understanding-containerization-docker-and-kubernetes-explained-2',
    date: '24th June 2024',
    title: 'Understanding Containerization: Docker and Kubernetes Explained',
    comments: 42,
    category: 'Containers',
    author: 'Shakil Ilham',
    wordCount: 2105,
    content: [
      [{ text: 'A deep dive into container fundamentals and how Kubernetes orchestrates them at scale in production environments.' }],
    ],
  },
  {
    id: '8',
    slug: 'scalable-database-design-techniques-for-high-performance-systems-2',
    date: '24th June 2024',
    title: 'Scalable Database Design: Techniques for High-Performance Systems',
    comments: 0,
    category: 'Database',
    author: 'Shakil Ilham',
    wordCount: 1990,
    content: [
      [{ text: 'Practical techniques for designing databases that remain performant as data volumes and query complexity grow.' }],
    ],
  },
  {
    id: '9',
    slug: 'effective-monitoring-and-logging-for-system-reliability-2',
    date: '24th June 2024',
    title: 'Effective Monitoring and Logging for System Reliability',
    comments: 7,
    category: 'DevOps',
    author: 'Shakil Ilham',
    wordCount: 1654,
    content: [
      [{ text: 'How to instrument distributed systems so that failures surface quickly and root-cause analysis does not require archaeology.' }],
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    slug: 'terminal-portfolio',
    date: '24th June 2024',
    title: 'Project title goes here',
    technology: 'React, Next.js, Go, SQLite',
    excerpt: 'The excerpt for the project, some brief details. It can say something about the client, what I did, etc. Fill in a few words to look like it\'s about four lines.',
    image: '/ascii-art-text.png',
  },
  {
    id: '2',
    slug: 'portfolio-cms',
    date: '24th June 2024',
    title: 'Some portfolio title for the project',
    technology: 'HTML, CSS, JS',
    excerpt: 'A clean, fast content management system built to manage portfolio entries with a minimal interface and zero dependencies.',
  },
  {
    id: '3',
    slug: 'client-work-dashboard',
    date: '24th June 2024',
    title: 'Another title, maybe some client work',
    technology: 'Go',
    excerpt: 'Backend dashboard built for a client with a focus on performance and simplicity. Handles high read throughput with minimal infrastructure.',
  },
  {
    id: '4',
    slug: 'pet-project-app',
    date: '24th June 2024',
    title: 'This one was just for a pet project',
    technology: 'React',
    excerpt: 'A personal experiment exploring React state patterns and component composition. Spun up over a weekend to scratch an itch.',
  },
  {
    id: '5',
    slug: 'figma-design-system',
    date: '24th June 2024',
    title: "I have designed this but it didn't sell",
    technology: 'Figma',
    excerpt: 'A full design system prototype built in Figma covering typography, spacing, color, and component variants for a B2B SaaS product.',
  },
  {
    id: '6',
    slug: 'three-js-experiment',
    date: '24th June 2024',
    title: 'Experimenting with Three.js',
    technology: 'Three.js',
    excerpt: 'An interactive 3D scene built with Three.js to explore shader programming, lighting models, and real-time rendering in the browser.',
  },
  {
    id: '7',
    slug: 'solar-system-3d',
    date: '24th June 2024',
    title: 'Solar system in 3D on the web',
    technology: 'Three.js',
    excerpt: 'A physically inspired 3D solar system simulation with orbital mechanics, planet textures, and interactive camera controls. Built entirely in WebGL via Three.js.',
  },
  {
    id: '8',
    slug: 'portfolio-v1',
    date: '24th June 2024',
    title: 'Some portfolio title for the project',
    technology: 'HTML, CSS, JS',
    excerpt: 'The first iteration of a personal portfolio site. Static HTML with hand-written CSS — no build tooling, no frameworks.',
  },
  {
    id: '9',
    slug: 'go-api-client',
    date: '24th June 2024',
    title: 'Another title, maybe some client work',
    technology: 'Go',
    excerpt: 'A lightweight REST API client library written in Go for internal tooling. Focused on ergonomics, retries, and structured error handling.',
  },
  {
    id: '10',
    slug: 'react-state-experiment',
    date: '24th June 2024',
    title: 'This one was just for a pet project',
    technology: 'React',
    excerpt: 'Exploring context, reducers, and derived state patterns in React without any external state management library.',
  },
  {
    id: '11',
    slug: 'product-design-concept',
    date: '24th June 2024',
    title: "I have designed this but it didn't sell",
    technology: 'Figma',
    excerpt: 'Product design concept for a mobile-first B2C app. Includes user flows, wireframes, and a high-fidelity prototype.',
  },
  {
    id: '12',
    slug: 'three-js-shader-demo',
    date: '24th June 2024',
    title: 'Experimenting with Three.js',
    technology: 'Three.js',
    excerpt: 'Custom GLSL fragment shaders applied to procedurally generated geometry, exploring noise functions and post-processing effects.',
  },
  {
    id: '13',
    slug: 'solar-system-3d-v2',
    date: '24th June 2024',
    title: 'Solar system in 3D on the web',
    technology: 'Three.js',
    excerpt: 'Second iteration of the solar system demo with improved orbital accuracy, atmospheric glow effects, and a minimap.',
  },
];
