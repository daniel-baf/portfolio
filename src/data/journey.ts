// Fuente de verdad de la historia: cada capitulo es una etapa real de la
// trayectoria de Daniel. De aqui se derivan los beats de la presentacion 3D
// (src/data/presentation.ts) y el timeline del CV (src/data/portfolio.ts).
// Snapshot curado a partir de GitHub (daniel-baf personal + VantumST agregado).

export type SceneKey =
  | 'intro'
  | 'compile'
  | 'datastructures'
  | 'web'
  | 'lowlevel'
  | 'oracle'
  | 'network'
  | 'cloud'
  | 'ai'
  | 'outro';

export interface JourneyMetric {
  value: string;
  label: string;
}

export interface JourneyLink {
  label: string;
  href: string;
}

// Burbuja de logro que aparece flotando al activarse el capitulo.
// `tag` es la etiqueta corta (PR, DEPLOY, REVIEW...) y `text` el logro.
export interface JourneyHighlight {
  tag: string;
  text: string;
}

export interface JourneyChapter {
  id: string;
  years: string; // display, e.g. "2021 - 2022"
  yearStart: number; // para orden / anclaje cronologico
  title: string; // headline (primary)
  subtitle: string; // secondary
  narrative: string; // prosa larga, reutilizable en el CV
  stack: string[]; // tags de tecnologia
  scene: SceneKey;
  weight: number; // dwell de scroll (1 = una pantalla)
  highlights?: JourneyHighlight[]; // burbujas de logros que "venden"
  metrics?: JourneyMetric[];
  links?: JourneyLink[];
  cta?: { label: string; href: string };
}

export const journey: JourneyChapter[] = [
  {
    id: 'intro',
    years: '',
    yearStart: 2020,
    title: 'HOLA',
    subtitle: 'soy Daniel · backend engineer · Guatemala',
    narrative:
      'Daniel Eduardo Bautista Fuentes. Esta es la historia de como pase de los primeros programas en la universidad a construir sistemas en produccion.',
    stack: [],
    scene: 'intro',
    weight: 1.2,
    highlights: [
      { tag: 'PRs', text: '140 pull requests' },
      { tag: 'REVIEWS', text: '~98 code reviews' },
      { tag: 'COMMITS', text: '681+ commits' },
    ],
  },
  {
    id: 'compile',
    years: '2020',
    yearStart: 2020,
    title: 'FIRST COMPILE',
    subtitle: 'los primeros programas · C# · Java',
    narrative:
      'Mis primeros repositorios: un simulador de compilador en C# y un resolvedor de sistemas de ecuaciones en Java. El inicio como estudiante de ciencias y sistemas en CUNOC, USAC.',
    stack: ['C#', 'Java', 'Algoritmos'],
    scene: 'compile',
    weight: 1.1,
    highlights: [
      { tag: 'BUILD', text: 'Simulador de compilador en C#' },
      { tag: 'CODE', text: 'Resolucion de sistemas en Java' },
    ],
    metrics: [{ value: '2020', label: 'primer commit' }],
  },
  {
    id: 'datastructures',
    years: '2021 - 2022',
    yearStart: 2021,
    title: 'ESTRUCTURAS',
    subtitle: 'AVL · grafos · juegos · Java pesado',
    narrative:
      'La etapa de estructuras de datos: arboles AVL, grafos, lenguajes graficos, juegos como HorseRaces y GameOf15, un sistema de control de mobiliario y una app de revistas. Aqui solidifique algoritmos y POO.',
    stack: ['Java', 'AVL Trees', 'Grafos', 'POO', 'C++'],
    scene: 'datastructures',
    weight: 1.3,
    highlights: [
      { tag: 'BUILD', text: 'Arboles AVL y grafos desde cero' },
      { tag: 'CODE', text: '6+ proyectos: juegos y motores' },
      { tag: 'OPT', text: 'Estructuras eficientes en memoria' },
    ],
    metrics: [{ value: '6+', label: 'proyectos academicos' }],
  },
  {
    id: 'web',
    years: '2022',
    yearStart: 2022,
    title: 'LA WEB',
    subtitle: 'Angular · TypeScript · primer compilador web',
    narrative:
      'Mi salto a la web: un compilador construido con Angular con analisis lexico, sintactico y generacion de codigo. El primer contacto serio con TypeScript y el frontend.',
    stack: ['TypeScript', 'Angular', 'Compiladores'],
    scene: 'web',
    weight: 1.1,
    highlights: [
      { tag: 'BUILD', text: 'Compilador web en Angular' },
      { tag: 'CODE', text: 'Analisis lexico + sintactico + codegen' },
    ],
    links: [{ label: 'web-compiler', href: 'https://github.com/daniel-baf/web-compiler' }],
  },
  {
    id: 'lowlevel',
    years: '2023',
    yearStart: 2023,
    title: 'BAJO NIVEL',
    subtitle: 'Assembly · arquitectura del computador',
    narrative:
      'Bajando hasta el metal: programas en ensamblador para Arquitectura del Computador 1, conversores de sistemas numericos y fundamentos de como funciona la maquina por dentro.',
    stack: ['Assembly', 'x86', 'Python'],
    scene: 'lowlevel',
    weight: 1.1,
    highlights: [
      { tag: 'OPT', text: 'Optimizacion a nivel de registros' },
      { tag: 'CODE', text: 'Ensamblador x86 + conversores numericos' },
    ],
  },
  {
    id: 'oracle',
    years: '2024',
    yearStart: 2024,
    title: 'BACKEND',
    subtitle: 'Oracle ONE · Java · APIs · datos',
    narrative:
      'Entrenamiento backend estructurado con el programa Oracle Next Education (ONE): desafios y aplicaciones Java, diseno de APIs e integracion con bases de datos para sistemas empresariales.',
    stack: ['Java', 'REST APIs', 'SQL', 'Oracle ONE'],
    scene: 'oracle',
    weight: 1.1,
    highlights: [
      { tag: 'API', text: 'Diseno de APIs REST' },
      { tag: 'DATA', text: 'Integracion con bases de datos' },
    ],
    links: [{ label: 'ONE-G7', href: 'https://github.com/daniel-baf/ONE-G7-daniel-baf' }],
  },
  {
    id: 'network',
    years: '2025',
    yearStart: 2025,
    title: 'LIDERAZGO',
    subtitle: 'project lead · freelance · entrega end-to-end',
    narrative:
      'Coordinacion de equipo, gestion de tickets y evaluacion tecnica de talento. En paralelo, freelance: sistema de calculo de vigas estructurales para ingenieria civil, ERP para ONG, autenticacion JWT/CORS y mas, con entrega directa al cliente.',
    stack: ['Python', 'Django', 'JWT', 'JavaScript', 'Project Lead'],
    scene: 'network',
    weight: 1.3,
    highlights: [
      { tag: 'LEAD', text: 'Lidere entrega end-to-end' },
      { tag: 'REVIEW', text: 'Evaluacion tecnica de talento' },
      { tag: 'SHIP', text: 'ERP para ONG + calculo estructural' },
    ],
    metrics: [{ value: '2 anos', label: 'experiencia profesional' }],
  },
  {
    id: 'cloud',
    years: '2025 - presente',
    yearStart: 2025,
    title: 'PRODUCCION',
    subtitle: 'VantumST · GCP · Docker · CI/CD',
    narrative:
      'Backend engineer en VantumST: 13 proyectos privados en produccion desde finales de 2025, con stack JavaScript, TypeScript, Python y PHP. Responsabilidad sobre infraestructura cloud (GCP), contenedores y automatizacion de despliegues.',
    stack: ['GCP', 'Docker', 'CI/CD', 'TypeScript', 'Python', 'PHP'],
    scene: 'cloud',
    weight: 1.5,
    highlights: [
      { tag: 'PRs', text: '94 PRs en produccion · 79 merged' },
      { tag: 'REVIEW', text: '84 code reviews' },
      { tag: 'DEPLOY', text: 'Automatice despliegues en GCP' },
      { tag: 'INFRA', text: 'Docker + pipelines CI/CD' },
      { tag: 'SCALE', text: '13 proyectos en produccion' },
    ],
    metrics: [
      { value: '13', label: 'proyectos en produccion' },
      { value: 'GCP', label: 'infraestructura cloud' },
    ],
  },
  {
    id: 'ai',
    years: '2026',
    yearStart: 2026,
    title: 'ERA IA',
    subtitle: 'engram · agentes · Go · AI-assisted dev',
    narrative:
      'Desarrollo asistido por IA: engram, un sistema de memoria persistente para agentes de codigo en Go/SQLite, flujos de trabajo con MCPs y LLMs, y este mismo portfolio 3D. Tecnologia aplicada con criterio.',
    stack: ['Go', 'SQLite', 'MCP', 'LLMs', 'Three.js'],
    scene: 'ai',
    weight: 1.4,
    highlights: [
      { tag: 'AI', text: 'engram: memoria para agentes de IA' },
      { tag: 'BUILD', text: 'Go + SQLite + servidor MCP' },
      { tag: 'FLOW', text: 'Workflows con LLMs' },
    ],
    metrics: [{ value: 'AI', label: 'workflows asistidos' }],
  },
  {
    id: 'outro',
    years: '',
    yearStart: 2026,
    title: 'GRACIAS',
    subtitle: 'por recorrer la historia',
    narrative: 'Gracias por llegar hasta aqui. Si tienes un proyecto, hablemos.',
    stack: [],
    scene: 'outro',
    weight: 1,
    cta: { label: 'VER CV', href: '/cv' },
  },
];
