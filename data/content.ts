// Everything the site says lives here (French in content.fr.ts), so updating the portfolio never means digging through
// components. Facts come from the README and CV: never add a number or claim here that can't be backed up.

export const links = {
  github: 'https://github.com/Hero-Sphinx',
  linkedin: 'https://www.linkedin.com/in/abdullahi-salami-4a8788218/',
  email: 'salamiabdullah6@gmail.com',
}

export type ProjectArt = 'calendar' | 'pizza' | 'routes' | 'flight'

export interface ProjectMeta {
  id: string
  name: string
  stack: string[]
  repo: string
  live?: string
  /** A real screenshot of a public page; projects without one get generated art. */
  shot?: string
  art?: ProjectArt
  accent: string
}

export const projectMeta: ProjectMeta[] = [
  {
    id: 'seebawayh',
    name: 'Daaru-s-Seebawayh',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'FastAPI', 'Gemini', 'Docker'],
    repo: 'https://github.com/Hero-Sphinx/Daaru-s-Seebawayh',
    live: 'https://daaru-s-seebawayh.vercel.app',
    shot: '/shots/seebawayh.png',
    accent: '#34d399',
  },
  {
    id: 'robodoc',
    name: 'RoboDoc',
    stack: ['React', 'Node.js', 'MySQL', 'Prisma', 'Gemini', 'Twilio', 'Socket.io'],
    repo: 'https://github.com/Hero-Sphinx/RoboDoc',
    live: 'https://robodoc-hhpp.vercel.app',
    shot: '/shots/robodoc.png',
    accent: '#38bdf8',
  },
  {
    id: 'outlineowl',
    name: 'OutlineOwl',
    stack: ['React', 'Vite', 'Express', 'Gemini', 'Google Calendar API', 'Twilio'],
    repo: 'https://github.com/Hero-Sphinx/OutlineOwl',
    live: 'https://outlineowl.vercel.app',
    art: 'calendar',
    accent: '#a78bfa',
  },
  {
    id: 'pizza',
    name: 'Pizza Ordering Platform',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'Tailwind', 'Vitest'],
    repo: 'https://github.com/Hero-Sphinx/Pizza-Ordering-Platform',
    art: 'pizza',
    accent: '#fbbf24',
  },
  {
    id: 'sunnahflix',
    name: 'SunnahFlix',
    stack: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'JSON'],
    repo: 'https://github.com/Hero-Sphinx/SunnahFlix',
    shot: '/shots/sunnahflix.png',
    accent: '#d4a017',
  },
  {
    id: 'ptfms',
    name: 'Transit Fleet Manager',
    stack: ['Java', 'JSP', 'Servlets', 'MySQL', 'JUnit'],
    repo: 'https://github.com/Hero-Sphinx/Transit_Project',
    art: 'routes',
    accent: '#f97316',
  },
  {
    id: 'flight',
    name: 'Flight App',
    stack: ['Flutter', 'Dart', 'SQLite'],
    repo: 'https://github.com/Hero-Sphinx/Flight-App',
    art: 'flight',
    accent: '#22d3ee',
  },
]

export const en = {
  meta: {
    title: 'Abdullahi — Full-Stack Developer',
    description:
      'Full-stack developer building fast, tested software, with a focus on MedTech, AI and neurotechnology.',
  },
  nav: { about: 'About', research: 'Research', projects: 'Projects', experience: 'Experience', skills: 'Skills', contact: 'Contact', menu: 'Menu', language: 'Passer au français', languageShort: 'FR' },
  hero: {
    greeting: "Hey, I'm",
    name: 'Abdullahi',
    roles: ['Full-Stack Developer', 'MedTech & AI Builder', 'Aspiring Neurotechnologist'],
    tagline:
      'I build fast, tested, mobile-first software, from rigorous backends to sophisticated frontends, with a focus on technology that helps people heal and learn.',
    cta: 'See my work →',
    stats: { projects: 'featured projects', live: 'live demos', tests: 'tests on one app' },
    scroll: 'Scroll to About',
  },
  motto: {
    line: 'I turn code into coffee, bugs into learning moments.',
    driven: 'My code is driven by the',
    words: ['Heart', 'Hustle', 'Passion', 'Purpose'],
  },
  figures: [
    { title: 'The brain', note: 'where I am heading' },
    { title: 'The eye', note: 'optical prosthetics research' },
    { title: 'The pulse', note: 'real-time vitals in RoboDoc' },
    { title: 'The helix', note: 'years of building, strand by strand' },
    { title: 'The network', note: 'tools that work together' },
    { title: 'The brain', note: 'let’s build' },
  ],
  about: {
    eyebrow: 'About me',
    title: ['Software that helps people ', 'heal and learn', '.'],
    lead: "I'm a full-stack developer who doesn't stop until a problem is solved: research, questions, open source, whatever it takes. I've built for restaurants, clinics and learners, and I'm working toward neurotechnology, where software meets the brain.",
    educationTitle: 'Education',
    languagesTitle: 'Languages I speak',
    pillars: [
      { title: 'Full-stack web', text: 'Next.js, TypeScript, React and Node.js on PostgreSQL, shipped behind CI gates with 280+ unit tests on a single project.' },
      { title: 'Java systems', text: 'Spring Boot, JSP/Servlets and classic design patterns (Singleton, Builder, DAO, Front Controller), tested with JUnit.' },
      { title: 'MedTech', text: 'Built RoboDoc, an AI patient-triage system with real-time vital-sign alerts and bilingual (EN/FR) clinical assessments.' },
      { title: 'Neurotechnology', text: 'Researching optical prosthetics, including cortical approaches that target the visual cortex (V1), alongside Data Science & AI studies.' },
    ],
    education: [
      { school: 'Algoma University', credential: 'BCS (Honours), Data Science & AI', dates: 'In progress' },
      { school: 'Algonquin College', credential: 'Diploma, Computer Programming', dates: 'Graduated Dec 2025' },
    ],
    languages: ['English', 'Arabic', 'French', 'Yoruba', 'Pidgin'],
  },
  research: {
    eyebrow: 'Research',
    title: ['What does ', 'artificial sight', ' look like?'],
    lead: "I'm writing a research paper on optical prosthetics, including cortical approaches that target the visual cortex (V1). Each electrode can produce a dot of light called a phosphene. Move the slider to see how the number of electrodes changes what a person could make out.",
    original: 'Original scene',
    perceived: 'Simulated phosphene view',
    electrodes: 'Electrodes',
    scenes: { face: 'Face', door: 'Doorway', letter: 'Letter' },
    sceneLabel: 'Choose a scene',
    disclaimer: 'A simplified illustration, not a clinical model. Real phosphenes differ from person to person.',
  },
  triage: {
    eyebrow: 'Try it',
    title: ['When seconds count, ', 'skip the AI', '.'],
    lead: "RoboDoc's key idea, in miniature. AI assessment runs in the background so intake never freezes, but critical vitals bypass the AI and alert staff straight away. Push the vitals into danger and watch the route change.",
    heartRate: 'Heart rate',
    oxygen: 'Blood oxygen',
    bpm: 'bpm',
    status: { stable: 'Stable', critical: 'Critical' },
    steps: {
      intake: 'Vitals received',
      check: 'Safety check',
      ai: 'Gemini assessment in a background worker',
      accepted: 'Intake answers 202 Accepted at once',
      sms: 'Twilio SMS alert',
      live: 'Socket.io update to staff',
    },
    routes: { normal: 'Normal route', urgent: 'Urgent route, AI bypassed' },
    disclaimer: 'A simulation with demo thresholds, not medical software. In the real system, alerts go out in under 45 ms.',
    caseStudy: 'Read the RoboDoc case study →',
  },
  outline: {
    eyebrow: 'Try it',
    title: ['From course outline to ', 'calendar', ' in one click.'],
    lead: 'OutlineOwl’s core idea, in miniature. Deadlines hide inside every course outline, so it finds them and shows what each one covers, your Area of Concentration. Use the sample, or paste your own.',
    inputLabel: 'Course outline',
    action: 'Find my deadlines',
    hint: 'Your deadlines will land here.',
    empty: 'No dates found. Try a line like “Essay due October 15”.',
    found: 'Deadlines found:',
    untitled: 'Deadline',
    focus: 'Area of Concentration:',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    sample: `CS 101: Introduction to Programming (sample outline)
Week 3 quiz: September 19 (covers variables and loops)
Assignment 1 due September 26 (topics: functions)
Midterm exam: October 17 (covers Chapters 1 to 5)
Project proposal due Oct 31
Assignment 2 due November 14 (topics: arrays and recursion)
Final project due December 5 (covers all units)`,
    disclaimer: 'A simplified version that reads text in your browser, so nothing you type leaves this page. The real OutlineOwl reads PDF outlines, uses AI to work out each Area of Concentration and adds study tips, then syncs to Google Calendar.',
    caseStudy: 'Read the OutlineOwl case study →',
  },
  projects: {
    eyebrow: 'Selected work',
    title: ['Projects with ', 'live demos', '.'],
    lead: 'Real products, not tutorials: tested, deployed and built to solve a real problem. Click through and try them.',
    live: 'Live',
    liveDemo: 'Live demo ↗',
    source: 'Source code',
    caseStudy: 'Case study',
    screenshot: 'Screenshot of',
  },
  caseStudy: {
    back: '← All projects',
    problem: 'The problem',
    flow: 'How it works',
    decisions: 'Key decisions',
    results: 'What it delivered',
    stack: 'Built with',
    next: 'Next project →',
  },
  projectText: {
    seebawayh: {
      blurb: 'AI-assisted Arabic grammar & Qur’an learning platform.',
      highlights: [
        'Rule-based grammar (I’rab) engine plus a self-hosted NLP microservice',
        '77,000+ word-by-word translations imported with re-runnable pipelines',
        '280+ unit tests and security rules enforced in CI before every deploy',
      ],
      problem: 'Learners of Qur’anic Arabic need grammar they can trust. A language model’s best guess isn’t good enough when every case ending matters, so the analysis had to be precise and the AI kept to the jobs it does well.',
      flow: ['Arabic text', 'Rule-based parser', 'CAMeL Tools service', 'PostgreSQL corpus', 'Learner'],
      decisions: [
        { title: 'Rules before AI', text: 'A deterministic I’rab engine and a self-hosted CAMeL Tools microservice (FastAPI, Docker) handle case endings, roots and syntactic roles, prioritising grammatical precision over LLM estimation.' },
        { title: 'Gemini with a safety net', text: 'Gemini writes chapter summaries, quizzes and OCR output, with automatic retries on 429/503 and database caching to protect free-tier quotas.' },
        { title: 'Data you can re-run', text: 'The Qur’anic Arabic Corpus and word-by-word translations load through transactional, re-runnable batch scripts with dual-source validation.' },
        { title: 'Security enforced by tests', text: 'Custom CI suites verify route authentication, Zod validation and the client/server boundary before anything reaches production.' },
      ],
      results: ['77,000+ word-by-word translations', '280+ unit tests gating every deploy', 'PDF reader with word-level grammar inspection', 'Spaced-repetition vocabulary practice (SM-2/Leitner)'],
    },
    robodoc: {
      blurb: 'AI patient triage that helps hospitals see the most urgent cases first.',
      highlights: [
        'Gemini calls moved to background workers so intake never freezes',
        'Critical vitals bypass AI: Twilio SMS alerts and Socket.io updates in under 45 ms',
        'Bilingual (English/French) clinical assessments',
      ],
      problem: 'I’ve waited more than 8 hours in hospitals, with too few doctors for everyone there. When everybody shares one line, people with less urgent problems can hold up those in real danger. I built RoboDoc to ease that queue: each patient gets a preliminary assessment backed by medical APIs, the doctor gets the report, and the most urgent cases come first.',
      flow: ['Patient intake', 'Safety check', 'Alert or background AI', 'Doctor dashboard', 'Doctor’s note'],
      decisions: [
        { title: 'Urgency, not arrival order', text: 'Patients start their own assessment and can check their queue position, so less urgent cases don’t hold up high-emergency ones and doctors can focus on who needs them most.' },
        { title: 'A safety path with no AI', text: 'When acute vital thresholds are crossed, the case turns red and bypasses AI. The doctor gets a Twilio text with the patient’s name, Medical ID, symptoms and location in the hospital, and Socket.io updates go out in under 45 ms.' },
        { title: 'One record for doctor and patient', text: 'The doctor sees the vitals and the patient’s own account of what’s wrong, then leaves a note. Both can print or download it, with a jsPDF layout engine keeping AI notes separate from physician records and JWT access control isolating Medical IDs.' },
        { title: 'Non-blocking AI', text: 'Gemini calls run in background worker threads, so intake stations answer 202 Accepted straight away during cloud latency.' },
        { title: 'Care in the patient’s language', text: 'Lightweight language profiling adds targeted English or French prompts, so assessments come back in the patient’s own language.' },
        { title: 'The hardest part', text: 'Getting Twilio alerts and Socket.io updates working together, and keeping the database in sync with the AI even when the AI wasn’t responding.' },
      ],
      results: ['Patients prioritised by urgency', 'Critical alerts in under 45 ms', 'Doctor’s notes patients can print or download', 'Bilingual EN/FR assessments', 'Built solo, end to end'],
    },
    outlineowl: {
      blurb: 'Turns course outlines into a synced study calendar.',
      highlights: [
        'Parses unstructured PDF outlines and extracts every deadline',
        'Gemini names the Area of Concentration for each test or assignment, with study tips',
        'Pushes dates to Google Calendar (OAuth) with Twilio SMS reminders',
        'Health-checked backend monitored for uptime',
      ],
      problem: 'Every course hides its deadlines in a differently formatted PDF. Students copy them out by hand, or miss them.',
      flow: ['Course outline PDF', 'Gemini parsing', 'Areas of Concentration', 'Google Calendar', 'SMS reminders'],
      decisions: [
        { title: 'Parse the messy input', text: 'An automated pipeline reads unstructured PDFs and extracts high-priority dates and deadlines for scheduling.' },
        { title: 'Tell students where to focus', text: 'For each test or assignment, Gemini identifies the Area of Concentration, the main topic or unit it covers, and writes a short study guide, so students know where to concentrate.' },
        { title: 'Meet students where they look', text: 'Google Calendar OAuth and Twilio SMS push the extracted schedule straight to the student.' },
        { title: 'Watch it in production', text: 'A /health endpoint tracked by UptimeRobot keeps the service monitored.' },
      ],
      results: ['Deadlines extracted from unstructured PDFs', 'Area of Concentration and study tips for each assessment', 'Automatic calendar sync', 'SMS reminders'],
    },
    pizza: {
      blurb: 'Full-stack ordering platform for pizza restaurants, with a live kitchen board.',
      highlights: [
        'Menu and combo builder with live prices, pickup or delivery',
        'Server re-prices every order; the browser never sends prices',
        'Own auth (argon2id, lockout), rate limits and 97 tests in CI',
      ],
      problem: 'A pizza restaurant runs on two screens: customers ordering and staff working the kitchen. I built this platform as a personal project to handle both properly, from a live-priced menu to the board the kitchen works from.',
      flow: ['Customer order', 'Server re-pricing', 'PostgreSQL', 'Live kitchen board'],
      decisions: [
        { title: 'Never trust the browser', text: 'Every order is re-priced on the server from fresh menu data, enforcing hours, delivery area, deal rules and sold-out items, with idempotency keys against double orders.' },
        { title: 'A console staff can run', text: 'Role-based admin with a live kitchen board, new-order chime, printable tickets, sold-out switches and owner settings.' },
        { title: 'Security by design', text: 'Own authentication with argon2id, hashed sessions and lockout after 5 failed logins, plus Postgres-backed rate limits and CSP nonces.' },
        { title: 'Safe schema changes', text: 'A 17-table PostgreSQL schema with idempotent migrations that CI applies, re-applies and drift-checks.' },
      ],
      results: ['Complete ordering flow for pickup and delivery', '97 Vitest tests in CI', '17-table PostgreSQL schema', 'Live kitchen order board'],
    },
    sunnahflix: {
      blurb: 'A streaming-style library of Islamic knowledge, free for everyone.',
      highlights: [
        'Qur’an recitations, lectures and downloadable books in one place',
        'Content loads from JSON, so the library grows without touching the pages',
        'Book search with category and author filters',
      ],
      problem: 'Islamic knowledge should be easy to reach and engaging to explore. I built SunnahFlix as a personal project to give recitations, lectures and books one home, organised like a streaming service and free for anyone.',
      flow: ['JSON library', 'Loaded in the browser', 'Scrolling rows and grids', 'Watch or download'],
      decisions: [
        { title: 'Data, not hard-coded pages', text: 'Recitations, lectures and books live in JSON files that JavaScript loads into the page, so new content is a data change.' },
        { title: 'Browse like a streaming service', text: 'Scrolling rows of categories and embedded videos make a large library feel familiar and easy to explore.' },
        { title: 'Find a book fast', text: 'Search works alongside category and author filters, and books can be downloaded as PDFs.' },
        { title: 'Plain web technology', text: 'Built with HTML, CSS, JavaScript and Bootstrap, with no framework or build step.' },
      ],
      results: ['Recitations, lectures and books in one place', 'Search and filters for books', 'Free for everyone'],
    },
    ptfms: {
      blurb: 'Public transit fleet management system (PTFMS).',
      highlights: [
        '3-tier web app for vehicles, routes, status and reports',
        'Role-based access for managers and operators',
        'Design patterns throughout, validated with JUnit',
      ],
      problem: 'Transit managers and operators need one place to log vehicles, manage routes, monitor status and report on maintenance, with different access for each role.',
      flow: ['JSP views', 'Servlets', 'DAO layer', 'MySQL'],
      decisions: [
        { title: 'Three clear tiers', text: 'Presentation, logic and data stay separate, using Singleton, Builder, DAO and Front Controller patterns.' },
        { title: 'Role-based access', text: 'Managers and operators get different privilege levels.' },
        { title: 'Tested with JUnit', text: 'JUnit tests validate functionality and reliability as the system grows.' },
      ],
      results: ['Vehicle, route and status tracking', 'Maintenance reports', 'Role-based access control', 'JUnit test coverage'],
    },
    flight: {
      blurb: 'Cross-platform Flutter app for airline operations.',
      highlights: [
        'Manage airplanes, flights, customers and reservations',
        'On-device SQLite storage',
        'Built in Android Studio',
      ],
      problem: 'Airline operations involve linked records: airplanes, flights, customers and reservations. The app had to manage them all on a phone, without depending on a server.',
      flow: ['Flutter UI', 'Dart logic', 'On-device SQLite'],
      decisions: [
        { title: 'One codebase', text: 'Built with Flutter and Dart so the same app runs across platforms.' },
        { title: 'Local-first storage', text: 'Records live in an on-device SQLite database.' },
      ],
      results: ['Cross-platform mobile app', 'Airplane, flight, customer and reservation management', 'On-device SQLite storage'],
    },
  },
  experience: {
    eyebrow: 'Experience',
    title: ['Building since ', '2020', '.'],
    lead: 'From client websites to leading a team, plus support roles that taught me to debug under pressure.',
    roles: [
      { company: 'Yakoyo African Delicacy', title: 'Full-Stack Developer', dates: 'Aug 2024 – Present', text: 'Node.js and PostgreSQL backend with secure APIs for real-time orders, a mobile-first React UI and an admin order dashboard.' },
      { company: 'Concentrix (Volkswagen & Audi Canada)', title: 'Technical Support Agent & Advisor', dates: 'May 2026 – Aug 2026', text: 'Diagnosed enterprise software issues, escalated recurring bugs and documented resolution workflows under strict SLAs.' },
      { company: 'Minerva Innovations (Lady Labyrinth)', title: 'Software Developer (Project Lead)', dates: 'Sept 2025 – Dec 2025', text: 'Led a team of 4: core architecture and backend logic, Agile roadmap in ZenHub, Definition of Done and CI/CD quality gates.' },
      { company: 'Alorica (Best Buy)', title: 'Technical Support Agent', dates: 'Sept 2023 – Feb 2024', text: 'Resolved 30+ support tickets a day with a 95% first-call resolution rate.' },
      { company: 'TmT Gallery', title: 'Full-Stack Developer', dates: 'Mar 2020 – Jul 2023', text: 'Built and maintained 10+ client websites with designers and product managers, from UI to database.' },
    ],
  },
  skills: {
    eyebrow: 'Toolbox',
    title: ['What I ', 'build with', '.'],
    lead: 'This site itself is built with Vue 3, Nuxt and three.js. The rest is what my projects run on.',
    groups: [
      { name: 'Languages', items: ['Java', 'TypeScript', 'JavaScript', 'Python', 'C#', 'C++', 'Dart', 'Assembly', 'SQL'] },
      { name: 'Frontend', items: ['React', 'Next.js', 'Vue 3 & Nuxt', 'HTML5', 'CSS3', 'Tailwind CSS', 'Vite'] },
      { name: 'Backend', items: ['Node.js', 'Express', 'FastAPI', 'Spring Boot', '.NET', 'REST APIs', 'Socket.io', 'Prisma', 'Zod'] },
      { name: 'Data', items: ['PostgreSQL', 'MySQL', 'SQL Server', 'MongoDB', 'SQLite', 'Supabase', 'Neon'] },
      { name: 'DevOps & Testing', items: ['Docker', 'GitHub Actions', 'Vercel', 'AWS', 'Git', 'Linux', 'Vitest', 'JUnit'] },
      { name: 'AI & Data', items: ['Machine learning', 'Deep learning', 'NLP', 'Google Gemini', 'LLM integration'] },
      { name: 'Mobile', items: ['Flutter', 'Android Studio'] },
    ],
  },
  contact: {
    eyebrow: 'Contact',
    title: ["Let's build something that ", 'matters', '.'],
    lead: 'Open to junior, intern and full-stack roles in Canada, the US, the UK and the Middle East (GCC): remote, hybrid or in person. Reach me by email or on LinkedIn.',
    email: 'Email me',
    linkedin: 'Message me on LinkedIn',
    builtWith: 'Built with Vue 3, Nuxt & three.js',
  },
}

export type Content = typeof en
