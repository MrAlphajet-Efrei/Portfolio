export type Lang = 'fr' | 'en';
export type NodeId = 'eu' | 'llm';

export interface Stat {
  v: string;
  l: string;
}

export interface EarlyItem {
  y: string;
  org: string;
  role: string;
  note: string;
}

export interface Region {
  name: string;
  items: string[];
}

export interface ExperienceNode {
  tag: string;
  title: string;
  context: string;
  role: string;
  flow: string[];
  infra: string;
  ach: string[];
  stack: string[];
  stats: Stat[];
}

export interface Strings {
  ui: {
    menu: string;
    close: string;
    diveTo: string;
    read: string;
    readOff: string;
    readTag: string;
    contact: string;
    navRead: string;
    navDive: string;
    hintsFine: [string, string];
    hintsTouch: [string, string];
    inspect: string;
  };
  pre: { steps: string[]; skip: string };
  b0: { tag: string; title: string; body: string; scroll: string };
  b1: { tag: string; title: string; body: string; next: string };
  b2: { tag: string; title: string; body: string; cta: string; next: string };
  b3: { tag: string; title: string; body: string; status: string; cta: string; next: string };
  core: {
    detected: string;
    insufficient: string;
    instruction: string;
    instructionTouch: string;
    button: string;
    auto: string;
    online: string;
    scrollHint: string;
    approach: string;
  };
  id: {
    tag: string;
    name: string;
    title: string;
    pitch: string;
    sub: string;
    specsTitle: string;
  };
  contact: { tag: string; title: string; body: string; foot: string };
  early: EarlyItem[];
  vieStats: Stat[];
  menu: string[];
  regions: Region[];
  nodes: Record<NodeId, ExperienceNode>;
  labels: Record<NodeId, string>;
}

export interface ContactLink {
  pin: string;
  label: string;
  href: string;
}

/** Camera depth of the core layer (must match MAXD in circuit-engine.js). */
export const MAX_DEPTH = 3.85;

export const CONTACT_LINKS: ContactLink[] = [
  { pin: 'PIN 1', label: 'yannick.yanat@efrei.net', href: 'mailto:yannick.yanat@efrei.net' },
  { pin: 'PIN 2', label: 'LinkedIn', href: 'https://linkedin.com/in/yannick-yanat' },
  { pin: 'PIN 3', label: 'yannickyanat.com', href: 'https://yannickyanat.com' },
];

export const STRINGS: Record<Lang, Strings> = {
  fr: {
    ui: {
      menu: 'menu',
      close: 'fermer',
      diveTo: 'dive to layer',
      read: 'Datasheet — lecture directe',
      readOff: 'Reprendre la plongée',
      readTag: 'datasheet mode — lecture directe',
      contact: 'contact',
      navRead: 'datasheet',
      navDive: 'circuit',
      hintsFine: ['tirer — dévier les pistes', 'maintenir — surge'],
      hintsTouch: ['toucher — impulsion', 'maintenir — surge'],
      inspect: '[ inspecter ]',
    },
    pre: {
      steps: ['POST — power-on self test…', 'routing power grid…', 'calibrating clocks…', 'system map ready.'],
      skip: 'cliquer pour passer',
    },
    b0: {
      tag: 'system map — powered down',
      title: "Un système s'éveille",
      body: 'Vous survolez un monde-circuit : chaque strate est une époque, chaque composant une expérience. Au cœur, le processeur.',
      scroll: 'scrollez pour plonger',
    },
    b1: {
      tag: 'layer 01 — periphery · early experience',
      title: 'Les premiers composants',
      body: 'Zones peu alimentées, signaux rares. La formation grave les fondations, les premières expériences posent les premiers composants.',
      next: 'layer 02 — bus principal',
    },
    b2: {
      tag: 'layer 02 — main bus · intensive training',
      title: 'Le courant se stabilise',
      body: "Deux ans de V.I.E à Bruxelles, dans une institution européenne. Back Java/Python, front, CI/CD : refonte d'une application critique déployée dans toute l'Union.",
      cta: 'ouvrir EU-CORE',
      next: 'layer 03 — zone de puissance',
    },
    b3: {
      tag: 'layer 03 — power zone · deploy',
      title: 'Pleine puissance',
      body: "Amaris Consulting, 2026. Owner de A à Z d'une application d'analyse augmentée par LLM, en production dans le transport maritime.",
      status: 'status : production',
      cta: 'ouvrir LLM-ENGINE',
      next: 'descendre au core',
    },
    core: {
      detected: 'core detected',
      insufficient: 'puissance insuffisante',
      instruction: "Maintenez le clic n'importe où pour alimenter le cœur",
      instructionTouch: "Maintenez le doigt appuyé n'importe où pour alimenter le cœur",
      button: 'auto-power',
      auto: "sans action de votre part, l'alimentation démarre toute seule",
      online: 'system online — core 100%',
      scrollHint: 'scroll — fiche technique',
      approach: "scrollez jusqu'au cœur",
    },
    id: {
      tag: 'core identity',
      name: 'Yannick Yanat',
      title: 'AI Software Engineer',
      pitch: "J'intègre l'intelligence artificielle au cœur des produits — du besoin métier jusqu'à la production.",
      sub: "3 ans + d'expérience · Python · LLM · DevOps",
      specsTitle: 'processor datasheet — fiche technique',
    },
    contact: {
      tag: 'interface — 3 pins',
      title: 'Interfacez-vous',
      body: "Le système est en production — et continue d'apprendre. Connectons-nous.",
      foot: '© 2026 Yannick Yanat — system online',
    },
    early: [
      { y: '2017 – 2023', org: 'EFREI Paris', role: "Diplôme d'ingénieur", note: "le système s'assemble" },
      { y: '2021', org: 'UHDP', role: 'Développeur web', note: 'nouvelles pistes' },
      { y: '2021 – 2022', org: 'Société Générale', role: 'Ingénieur logiciel', note: 'le signal se stabilise' },
      { y: '2023', org: 'BNP Paribas AM', role: 'Ingénieur DevOps', note: 'montée en fréquence' },
    ],
    vieStats: [
      { v: '500 M+', l: 'devices enregistrés' },
      { v: '27', l: 'États membres' },
    ],
    menu: [
      "Surface — vue d'ensemble",
      'Layer 01 — périphérie',
      'Layer 02 — bus principal',
      'Layer 03 — zone de puissance',
      'Core — le cœur',
    ],
    regions: [
      { name: 'IA & LLM', items: ['LangChain', 'OpenAI', 'pipelines LLM', 'fiabilisation'] },
      { name: 'Back-end', items: ['Python', 'Java', 'API', 'SQL Server'] },
      { name: 'Front', items: ['TypeScript', 'interfaces web', 'intégration API'] },
      { name: 'DevOps & Cloud', items: ['Azure', 'Terraform', 'Docker', 'Kubernetes', 'CI/CD Azure DevOps'] },
    ],
    nodes: {
      eu: {
        tag: 'component U-204 · EU-CORE — layer 02',
        title: "Refonte d'une application critique européenne",
        context:
          "Institution européenne, Bruxelles — V.I.E de 2 ans (2024 – 2026). Une application critique utilisée dans toute l'Union.",
        role: 'Rôle : ingénieur full-stack — back Java/Python, front, CI/CD.',
        flow: ['Utilisateurs UE', 'Application critique refondue', 'Déployée dans 27 États membres'],
        infra: 'run — CI/CD · qualité · stabilité en production',
        ach: [
          "Refonte complète d'une application critique, déployée dans les 27 États membres.",
          "Plus de 500 millions de devices enregistrés — une audience à l'échelle de l'Union.",
          'Industrialisation du delivery : CI/CD, qualité, fiabilité en production.',
        ],
        stack: ['Java', 'Python', 'Front', 'CI/CD'],
        stats: [
          { v: '500 M+', l: 'devices enregistrés' },
          { v: '27', l: 'États membres' },
          { v: '2 ans', l: 'V.I.E — Bruxelles' },
        ],
      },
      llm: {
        tag: 'component U-401 · LLM-ENGINE — layer 03 · signature',
        title: 'Analyse augmentée par LLM, en production',
        context:
          "Amaris Consulting — transport maritime (2026 – présent). Une application d'analyse augmentée par LLM, en production.",
        role: 'Rôle : owner de A à Z — conception, développement, infra, déploiement, run.',
        flow: ['Requête utilisateur', 'API Python', 'LLM — LangChain · OpenAI', 'Réponse fiabilisée'],
        infra: 'infra — Azure · Kubernetes · Docker · Terraform · CI/CD Azure DevOps',
        ach: [
          'Conception et développement complets : API Python, front TypeScript.',
          'Pipeline LLM fiabilisé avec LangChain et OpenAI — des réponses exploitables métier.',
          'Infrastructure as code et déploiement : Terraform, Azure, Docker, Kubernetes, CI/CD.',
        ],
        stack: ['Python', 'TypeScript', 'LangChain', 'OpenAI', 'Azure', 'Terraform', 'Docker', 'Kubernetes', 'Azure DevOps'],
        stats: [
          { v: 'A → Z', l: 'owner du produit' },
          { v: 'prod', l: 'en production' },
          { v: 'LLM', l: 'au cœur du produit' },
        ],
      },
    },
    labels: { eu: 'EU-CORE', llm: 'LLM-ENGINE' },
  },
  en: {
    ui: {
      menu: 'menu',
      close: 'close',
      diveTo: 'dive to layer',
      read: 'Datasheet — direct reading',
      readOff: 'Resume the dive',
      readTag: 'datasheet mode — direct reading',
      contact: 'contact',
      navRead: 'datasheet',
      navDive: 'circuit',
      hintsFine: ['drag — bend the traces', 'hold — surge'],
      hintsTouch: ['tap — pulse', 'hold — surge'],
      inspect: '[ inspect ]',
    },
    pre: {
      steps: ['POST — power-on self test…', 'routing power grid…', 'calibrating clocks…', 'system map ready.'],
      skip: 'click to skip',
    },
    b0: {
      tag: 'system map — powered down',
      title: 'A system awakens',
      body: 'You are flying over a circuit-world: each stratum is an era, each component an experience. At the heart, the processor.',
      scroll: 'scroll to dive',
    },
    b1: {
      tag: 'layer 01 — periphery · early experience',
      title: 'The first components',
      body: 'Barely-powered zones, scarce signals. Education etches the foundations; the first experiences place the first components.',
      next: 'layer 02 — main bus',
    },
    b2: {
      tag: 'layer 02 — main bus · intensive training',
      title: 'The current stabilizes',
      body: 'Two years on a V.I.E assignment in Brussels, inside a European institution. Java/Python back end, front end, CI/CD: rebuilding a critical application deployed across the whole Union.',
      cta: 'open EU-CORE',
      next: 'layer 03 — power zone',
    },
    b3: {
      tag: 'layer 03 — power zone · deploy',
      title: 'Full power',
      body: 'Amaris Consulting, 2026. End-to-end owner of an LLM-augmented analysis application, in production in maritime transport.',
      status: 'status: production',
      cta: 'open LLM-ENGINE',
      next: 'descend to the core',
    },
    core: {
      detected: 'core detected',
      insufficient: 'insufficient power',
      instruction: 'Click and hold anywhere to power the core',
      instructionTouch: 'Press and hold anywhere to power the core',
      button: 'auto-power',
      auto: 'no action needed — power starts on its own',
      online: 'system online — core 100%',
      scrollHint: 'scroll — datasheet',
      approach: 'scroll down to the core',
    },
    id: {
      tag: 'core identity',
      name: 'Yannick Yanat',
      title: 'AI Software Engineer',
      pitch: 'I build artificial intelligence into the core of products — from business need to production.',
      sub: '3+ years of experience · Python · LLM · DevOps',
      specsTitle: 'processor datasheet',
    },
    contact: {
      tag: 'interface — 3 pins',
      title: 'Interface with me',
      body: "The system is in production — and still learning. Let's connect.",
      foot: '© 2026 Yannick Yanat — system online',
    },
    early: [
      { y: '2017 – 2023', org: 'EFREI Paris', role: "Master's degree in engineering", note: 'the system assembles' },
      { y: '2021', org: 'UHDP', role: 'Web Developer', note: 'new traces' },
      { y: '2021 – 2022', org: 'Société Générale', role: 'Software Engineer', note: 'the signal stabilizes' },
      { y: '2023', org: 'BNP Paribas AM', role: 'DevOps Engineer', note: 'frequency rising' },
    ],
    vieStats: [
      { v: '500M+', l: 'registered devices' },
      { v: '27', l: 'member states' },
    ],
    menu: [
      'Surface — overview',
      'Layer 01 — periphery',
      'Layer 02 — main bus',
      'Layer 03 — power zone',
      'Core — the heart',
    ],
    regions: [
      { name: 'AI & LLM', items: ['LangChain', 'OpenAI', 'LLM pipelines', 'response reliability'] },
      { name: 'Back end', items: ['Python', 'Java', 'APIs', 'SQL Server'] },
      { name: 'Front end', items: ['TypeScript', 'web interfaces', 'API integration'] },
      { name: 'DevOps & Cloud', items: ['Azure', 'Terraform', 'Docker', 'Kubernetes', 'Azure DevOps CI/CD'] },
    ],
    nodes: {
      eu: {
        tag: 'component U-204 · EU-CORE — layer 02',
        title: 'Rebuilding a critical European application',
        context:
          'European institution, Brussels — 2-year V.I.E assignment (2024 – 2026). A critical application used across the whole Union.',
        role: 'Role: full-stack engineer — Java/Python back end, front end, CI/CD.',
        flow: ['EU users', 'Rebuilt critical application', 'Deployed to 27 member states'],
        infra: 'run — CI/CD · quality · stability in production',
        ach: [
          'Complete rebuild of a critical application, deployed to all 27 member states.',
          'Over 500 million registered devices — an audience at Union scale.',
          'Industrialized delivery: CI/CD, quality, reliability in production.',
        ],
        stack: ['Java', 'Python', 'Front end', 'CI/CD'],
        stats: [
          { v: '500M+', l: 'registered devices' },
          { v: '27', l: 'member states' },
          { v: '2 yrs', l: 'V.I.E — Brussels' },
        ],
      },
      llm: {
        tag: 'component U-401 · LLM-ENGINE — layer 03 · signature',
        title: 'LLM-augmented analysis, in production',
        context:
          'Amaris Consulting — maritime transport (2026 – present). An LLM-augmented analysis application, running in production.',
        role: 'Role: end-to-end owner — design, development, infrastructure, deployment, run.',
        flow: ['User request', 'Python API', 'LLM — LangChain · OpenAI', 'Reliable answer'],
        infra: 'infra — Azure · Kubernetes · Docker · Terraform · Azure DevOps CI/CD',
        ach: [
          'Full design and development: Python API, TypeScript front end.',
          'Hardened LLM pipeline with LangChain and OpenAI — business-ready answers.',
          'Infrastructure as code and deployment: Terraform, Azure, Docker, Kubernetes, CI/CD.',
        ],
        stack: ['Python', 'TypeScript', 'LangChain', 'OpenAI', 'Azure', 'Terraform', 'Docker', 'Kubernetes', 'Azure DevOps'],
        stats: [
          { v: 'A → Z', l: 'product owner' },
          { v: 'prod', l: 'in production' },
          { v: 'LLM', l: 'at the core' },
        ],
      },
    },
    labels: { eu: 'EU-CORE', llm: 'LLM-ENGINE' },
  },
};
