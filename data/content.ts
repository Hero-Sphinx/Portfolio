// Everything the site says lives here, so updating the portfolio never means digging through components.

export const links = {
  github: 'https://github.com/Hero-Sphinx',
  linkedin: 'https://www.linkedin.com/in/abdullahi-salami-4a8788218/',
}

export const hero = {
  name: 'Abdullahi',
  roles: ['Full-Stack Developer', 'MedTech & AI Builder', 'Aspiring Neurotechnologist'],
  tagline:
    'I build fast, tested, mobile-first software, from Java and Node.js backends to React frontends, with a focus on technology that helps people heal and learn.',
}

export interface Pillar {
  icon: string
  title: string
  text: string
}

export const pillars: Pillar[] = [
  {
    icon: '⚡',
    title: 'Full-stack web',
    text: 'Next.js, TypeScript, React and Node.js on PostgreSQL, shipped behind CI gates with 280+ unit tests on a single project.',
  },
  {
    icon: '☕',
    title: 'Java systems',
    text: 'Spring Boot, JSP/Servlets and classic design patterns (Singleton, Builder, DAO, Front Controller), tested with JUnit.',
  },
  {
    icon: '🩺',
    title: 'MedTech',
    text: 'Built RoboDoc, an AI patient-triage system with real-time vital-sign alerts and bilingual (EN/FR) clinical assessments.',
  },
  {
    icon: '🧠',
    title: 'Neurotechnology',
    text: 'Researching optical prosthetics, including cortical approaches that target the visual cortex (V1), alongside Data Science & AI studies.',
  },
]

export interface Project {
  id: string
  name: string
  blurb: string
  highlights: string[]
  stack: string[]
  repo: string
  live?: string
  shot?: string
  accent: string
}

export const projects: Project[] = [
  {
    id: 'seebawayh',
    name: 'Daaru-s-Seebawayh',
    blurb: 'AI-assisted Arabic grammar & Qur’an learning platform.',
    highlights: [
      'Rule-based grammar (I’rab) engine plus a self-hosted NLP microservice',
      '77,000+ word-by-word translations imported with re-runnable pipelines',
      '280+ unit tests and security rules enforced in CI before every deploy',
    ],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'FastAPI', 'Gemini', 'Docker'],
    repo: 'https://github.com/Hero-Sphinx/Daaru-s-Seebawayh',
    live: 'https://daaru-s-seebawayh.vercel.app',
    shot: '/shots/seebawayh.png',
    accent: '#34d399',
  },
  {
    id: 'robodoc',
    name: 'RoboDoc',
    blurb: 'AI-driven patient triage for emergency intake.',
    highlights: [
      'Gemini calls moved to background workers so intake never freezes',
      'Critical vitals bypass AI: Twilio SMS alerts and Socket.io updates in under 45 ms',
      'Bilingual (English/French) clinical assessments',
    ],
    stack: ['React', 'Node.js', 'MySQL', 'Prisma', 'Gemini', 'Socket.io'],
    repo: 'https://github.com/Hero-Sphinx/RoboDoc',
    live: 'https://robodoc-hhpp.vercel.app',
    accent: '#38bdf8',
  },
  {
    id: 'outlineowl',
    name: 'OutlineOwl',
    blurb: 'Turns course outlines into a synced study calendar.',
    highlights: [
      'Parses unstructured PDF outlines and extracts every deadline',
      'Pushes dates to Google Calendar (OAuth) with Twilio SMS reminders',
      'Health-checked backend monitored for uptime',
    ],
    stack: ['React', 'Vite', 'Express', 'Google Calendar API', 'Twilio'],
    repo: 'https://github.com/Hero-Sphinx/OutlineOwl',
    live: 'https://outlineowl.vercel.app',
    shot: '/shots/outlineowl.png',
    accent: '#a78bfa',
  },
  {
    id: 'pizza',
    name: '786 Pizza & Wings',
    blurb: 'Online ordering platform with a live kitchen board.',
    highlights: [
      'Menu and combo builder with live prices, pickup or delivery',
      'Server re-prices every order; the browser never sends prices',
      'Own auth (argon2id, lockout), rate limits and 55 tests in CI',
    ],
    stack: ['Next.js', 'TypeScript', 'Prisma', 'Tailwind', 'Vitest'],
    repo: 'https://github.com/Hero-Sphinx/786-Pizza-Wings',
    accent: '#fbbf24',
  },
  {
    id: 'ptfms',
    name: 'Transit Fleet Manager',
    blurb: 'Public transit fleet management system (PTFMS).',
    highlights: [
      '3-tier web app for vehicles, routes, status and reports',
      'Role-based access for managers and operators',
      'Design patterns throughout, validated with JUnit',
    ],
    stack: ['Java', 'JSP', 'Servlets', 'MySQL', 'JUnit'],
    repo: 'https://github.com/Hero-Sphinx/Transit_Project',
    accent: '#f97316',
  },
  {
    id: 'flight',
    name: 'Flight App',
    blurb: 'Cross-platform Flutter app for airline operations.',
    highlights: [
      'Manage airplanes, flights, customers and reservations',
      'On-device SQLite storage',
      'Built in Android Studio',
    ],
    stack: ['Flutter', 'Dart', 'SQLite'],
    repo: 'https://github.com/Hero-Sphinx/Flight-App',
    accent: '#22d3ee',
  },
]

export interface Role {
  company: string
  title: string
  dates: string
  text: string
}

export const experience: Role[] = [
  {
    company: 'Yakoyo African Delicacy',
    title: 'Full-Stack Developer',
    dates: 'Aug 2024 – Present',
    text: 'Node.js and PostgreSQL backend with secure APIs for real-time orders, a mobile-first React UI and an admin order dashboard.',
  },
  {
    company: 'Concentrix (Volkswagen & Audi Canada)',
    title: 'Technical Support Agent & Advisor',
    dates: 'May 2026 – Aug 2026',
    text: 'Diagnosed enterprise software issues, escalated recurring bugs and documented resolution workflows under strict SLAs.',
  },
  {
    company: 'Minerva Innovations (Lady Labyrinth)',
    title: 'Software Developer (Project Lead)',
    dates: 'Sept 2025 – Dec 2025',
    text: 'Led a team of 4: core architecture and backend logic, Agile roadmap in ZenHub, Definition of Done and CI/CD quality gates.',
  },
  {
    company: 'Alorica (Best Buy)',
    title: 'Technical Support Agent',
    dates: 'Sept 2023 – Feb 2024',
    text: 'Resolved 30+ support tickets a day with a 95% first-call resolution rate.',
  },
  {
    company: 'TmT Gallery',
    title: 'Full-Stack Developer',
    dates: 'Mar 2020 – Jul 2023',
    text: 'Built and maintained 10+ client websites with designers and product managers, from UI to database.',
  },
]

export const education = [
  { school: 'Algoma University', credential: 'BCS (Honours), Data Science & AI', dates: 'In progress' },
  { school: 'Algonquin College', credential: 'Diploma, Computer Programming', dates: 'Graduated Dec 2025' },
]

export const skills: Record<string, string[]> = {
  Languages: ['Java', 'TypeScript', 'JavaScript', 'Python', 'C#', 'C++', 'Dart', 'Assembly', 'SQL'],
  Frontend: ['React', 'Next.js', 'Vue 3 & Nuxt', 'HTML5', 'CSS3', 'Tailwind CSS', 'Vite'],
  Backend: ['Node.js', 'Express', 'FastAPI', 'Spring Boot', '.NET', 'REST APIs', 'Socket.io', 'Prisma', 'Zod'],
  Data: ['PostgreSQL', 'MySQL', 'SQL Server', 'MongoDB', 'SQLite', 'Supabase', 'Neon'],
  'DevOps & Testing': ['Docker', 'GitHub Actions', 'Vercel', 'AWS', 'Git', 'Linux', 'Vitest', 'JUnit'],
  'AI & Data': ['Machine learning', 'Deep learning', 'NLP', 'Google Gemini', 'LLM integration'],
  Mobile: ['Flutter', 'Android Studio'],
}

export const spokenLanguages = ['English', 'Arabic', 'French', 'Yoruba', 'Pidgin']
