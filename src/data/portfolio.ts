import { journey } from './journey';

// Adapta los capitulos de la historia (fuente de verdad) al shape que espera
// TimelineSection.astro ({ date, role, company, desc }). Se omiten intro/outro
// porque son bookends narrativos, no etapas de carrera.
const careerItemsFromJourney = journey
  .filter((chapter) => chapter.id !== 'intro' && chapter.id !== 'outro')
  .map((chapter) => ({
    date: chapter.years.toUpperCase(),
    role: chapter.title,
    company: chapter.stack.slice(0, 4).join(' · ') || 'Guatemala',
    desc: chapter.narrative,
  }))
  .reverse(); // mas reciente primero, como el resto del CV

export const portfolioData = {
  navLinks: [
    { href: '#about', id: 'nav-about', label: 'about' },
    { href: '#career', id: 'nav-career', label: 'career' },
    { href: '#studies', id: 'nav-studies', label: 'studies' },
    { href: '#skills', id: 'nav-skills', label: 'skills' },
    { href: '#projects', id: 'nav-projects', label: 'projects' },
    { href: '#hobbies', id: 'nav-hobbies', label: 'hobbies' },
    { href: '#contact', id: 'nav-contact', label: 'contact' },
  ],
  hero: {
    tag: 'Backend engineer · cloud track · futurist computing',
    name: 'Daniel Bautista',
    summary:
      'Desarrollo backend, automatizacion e infraestructura con foco en sistemas confiables. Tengo 2 anos de experiencia profesional y me he estado especializando en GCP mientras sigo fortaleciendo mi base en arquitectura y cloud.',
    metrics: [
      { value: '2 anos', label: 'experiencia profesional' },
      { value: 'GCP', label: 'especializacion en progreso' },
      { value: 'Backend', label: 'Python · Java · APIs · CI/CD' },
    ],
  },
  about: {
    sectionLabel: '// 01 > about.exe',
    sectionTitle: 'SOBRE MI',
    paragraphs: [
      'Soy Daniel Eduardo Bautista Fuentes, un dev guatemalteco enfocado en construir sistemas que escalen y se mantengan bien. Mi experiencia profesional es de 2 anos, y el resto de mi crecimiento ha venido de estudio, practica constante y proyectos reales.',
      'Me especializo en backend e infraestructura: desde APIs y pipelines de CI/CD hasta despliegues automatizados en cloud, pasando por ERPs y herramientas de calculo para ingenieria civil. Actualmente he estado profundizando especialmente en GCP.',
      'Me interesa la tecnologia aplicada con criterio: automatizacion, arquitectura, cloud y herramientas que resuelvan problemas reales. Disfruto explorar nuevas IAs, refinar procesos y seguir fortaleciendo mi base como ingeniero.',
    ],
    tags: ['Python', 'Java', 'TypeScript', 'Docker', 'CI/CD', 'GCP', 'REST APIs', 'SQL', 'Angular', 'Assembly', 'Linux', 'Git'],
  },
  career: {
    sectionLabel: '// 02 > career.log',
    sectionTitle: 'TRAYECTORIA',
    // Derivado de src/data/journey.ts para mantener coherencia con la historia 3D.
    items: careerItemsFromJourney,
  },
  studies: {
    sectionLabel: '// 03 > education.db',
    sectionTitle: 'ESTUDIOS',
    items: [
      {
        date: '2023 → PRESENTE',
        role: 'INGENIERIA EN INFORMATICA Y SISTEMAS',
        company: 'Universidad Rafael Landivar (URL) · Guatemala',
        desc: 'Enfoque en arquitectura de software, sistemas distribuidos, bases de datos avanzadas y proyectos integradores. Desarrollo del ERP para ONG como proyecto de donacion universitaria.',
      },
      {
        date: '2019 → 2023',
        role: 'INGENIERIA EN CIENCIAS Y SISTEMAS',
        company: 'Universidad San Carlos de Guatemala (USAC) · CUNOC',
        desc: 'Fundamentos de ciencias de la computacion: arquitectura de computadoras, lenguaje ensamblador, estructuras de datos, compiladores, analisis de algoritmos y desarrollo de software.',
      },
    ],
  },
  skills: {
    sectionLabel: '// 04 > skills.json',
    sectionTitle: 'HABILIDADES',
    items: [
      { label: 'BE', name: 'Backend Dev', meta: 'Java · Python · Node.js · REST APIs', level: 88 },
      { label: 'CL', name: 'Cloud & Infra', meta: 'GCP · Docker · CI/CD · Cloud Deployments', level: 82 },
      { label: 'AU', name: 'Automatizacion', meta: 'Scripting · GitHub Actions · Pipelines', level: 80 },
      { label: 'DB', name: 'Bases de Datos', meta: 'PostgreSQL · MySQL · SQLite', level: 85 },
      { label: 'PL', name: 'Project Lead', meta: 'Gestion de equipos · Tickets · Evaluacion', level: 78 },
      { label: 'AI', name: 'AI-Assisted Dev', meta: 'MCPs · Copilot · LLM Workflows', level: 90 },
    ],
  },
  projects: {
    sectionLabel: '// 05 > projects.git',
    sectionTitle: 'PROYECTOS',
    cta: { href: 'https://github.com/daniel-baf', id: 'cta-github', label: '↗ Ver todos en GitHub' },
    items: [
      {
        code: 'PY',
        lang: 'Python / Ingenieria',
        name: 'CALCULO DE VIGAS ESTRUCTURALES',
        desc: 'Sistema para ingenieros civiles que calcula vigas con cargas gravitacionales, flexiones y momentos. Proyecto freelance en desarrollo activo.',
        href: 'https://github.com/daniel-baf/calculo-vigas-estructurales',
        demo: 'https://daniel-baf.github.io/calculo-vigas-estructurales/',
        id: 'proj-vigas',
      },
      {
        code: 'ERP',
        lang: 'Full Stack / ERP',
        name: 'ERP PARA ONG',
        desc: 'Sistema de gestion para ONG: pedidos, productos, clientes y reportes. Donacion universitaria URL. Modulos de inventario, facturacion y analitica.',
        href: 'https://github.com/daniel-baf/ERP-progra-web-url',
        id: 'proj-erp',
      },
      {
        code: 'WEB',
        lang: 'TypeScript / Angular',
        name: 'WEB COMPILER',
        desc: 'Compilador web construido con Angular: analisis lexico, sintactico y generacion de codigo. Proyecto academico.',
        href: 'https://github.com/daniel-baf/web-compiler',
        id: 'proj-compiler',
      },
      {
        code: 'JVM',
        lang: 'Java / Oracle ONE',
        name: 'ORACLE ONE - G7',
        desc: 'Proyecto completo del programa Oracle Next Education: desafios, retos y aplicaciones Java agrupados en un unico repositorio.',
        href: 'https://github.com/daniel-baf/ONE-G7-daniel-baf',
        id: 'proj-oracle',
      },
      {
        code: 'ASM',
        lang: 'Assembly / x86',
        name: 'ARQUITECTURA 1 - ASM',
        desc: 'Coleccion de programas escritos en lenguaje ensamblador para el curso de Arquitectura del Computador 1 en USAC.',
        href: 'https://github.com/daniel-baf/arqui-1-assembler',
        id: 'proj-asm',
      },
      {
        code: 'CLI',
        lang: 'Python / Utils',
        name: 'SYSTEM NUMBER CONVERTER',
        desc: 'Conversor de sistemas numericos (binario, octal, hexadecimal, decimal) con interfaz CLI limpia. Licencia: The Unlicense.',
        href: 'https://github.com/daniel-baf/SystemNumberConverter',
        id: 'proj-converter',
      },
    ],
  },
  hobbies: {
    sectionLabel: '// 06 > hobbies.txt',
    sectionTitle: 'AFICIONES',
    items: [
      { label: 'play', name: 'Gaming' },
      { label: 'build', name: 'Backend Dev' },
      { label: 'ship', name: 'Infra & Cloud' },
      { label: 'learn', name: 'AI & MCPs' },
      { label: 'linux', name: 'Linux' },
      { label: 'read', name: 'Tech Reading' },
    ],
  },
  contact: {
    sectionLabel: '// 07 > contact.sh',
    sectionTitle: 'CONTACTO',
    intro: '$ echo "Tienes un proyecto? Hablemos."',
    email: 'danibaufu@gmail.com',
    note: 'Disponible para proyectos freelance, consultoria de infraestructura y colaboraciones en proyectos open source.',
    links: [
      { href: 'https://github.com/daniel-baf', id: 'social-github', label: 'GitHub', external: true },
      { href: 'https://twitter.com/Daniel_Bafue', id: 'social-twitter', label: 'Twitter / X', external: true },
      { href: 'mailto:danibaufu@gmail.com', id: 'social-email', label: 'Email', external: false },
    ],
  },
  footer: {
    copy: '</ daniel-baf > · Built with code, criterio y terminal · Guatemala 2026',
    links: [
      { href: 'https://github.com/daniel-baf', label: 'GitHub' },
      { href: 'https://linkedin.com/in/daniel-bautista-46bb69267', label: 'LinkedIn' },
      { href: 'https://twitter.com/daniel_bafue', label: 'X / Twitter' },
      { href: 'https://programacioncondaniel.blogspot.com/', label: 'Blog' },
      { href: 'https://instagram.com/daniel_bafue', label: 'Instagram' },
      { href: 'https://discord.gg/tVm7gp8zW9', label: 'Discord' },
    ],
  },
};
