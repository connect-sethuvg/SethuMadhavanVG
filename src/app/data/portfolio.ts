/**
 * All portfolio content lives here. Edit this file to update the site;
 * components only render what they find in it.
 */

export type FilterKey = 'all' | 'net' | 'angular' | 'react' | 'ai' | 'web';

export interface LinkItem {
  label: string;
  url: string;
}

export type ProjectVisual =
  | {
      kind: 'pipeline';
      steps: { title: string; detail: string }[];
      race: { label: string; value: string; speed: 'slow' | 'fast' }[];
    }
  | { kind: 'list'; url: string; rows: { initials: string; name: string; meta: string }[] }
  | { kind: 'cards'; url: string; cards: { title: string; detail: string }[] }
  | {
      kind: 'table';
      url: string;
      head: string[];
      rows: { cells: string[]; low?: boolean }[];
    };

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  /** Labels shown on the collapsed row. */
  tags: string[];
  /** Keys used by the filter buttons and the stack keyboard. */
  filterTags: string[];
  paragraphs: string[];
  bullets: string[];
  callout?: { strong: string; text: string };
  links: LinkItem[];
  visual: ProjectVisual;
}

export interface StackKey {
  label: string;
  filter: FilterKey;
  note: string;
  wide?: boolean;
}

export interface Role {
  title: string;
  company: string;
  period: string;
  projectLine?: string;
  log?: { area: string; text: string }[];
  gauges?: { value: string; label: string }[];
  note?: string;
  featured?: boolean;
}

export const PROFILE = {
  firstName: 'Sethu',
  lastName: 'Madhavan V G',
  fullName: 'Sethu Madhavan V G',
  location: 'Palakkad, Kerala',
  timeZone: 'Asia/Kolkata',
  email: 'sethuvalanchery@gmail.com',
  linkedin: { handle: 'in/sethuvg', url: 'https://www.linkedin.com/in/sethuvg' },
  github: { handle: 'connect-sethuvg', url: 'https://github.com/connect-sethuvg' },
  resumeUrl: 'https://drive.google.com/drive/folders/1DG_LqYGWjcDL8krPv3WavTyjV5yKLewB',
  edition: 'Portfolio, edition 2026',
  typedRoles: [
    'checkout systems',
    'event-driven services',
    'Angular modules',
    'local LLM pipelines',
    'Flutter apps',
  ],
  status: [
    { label: 'Status', value: 'Open to new roles', live: true },
    { label: 'Day job', value: '.NET Developer, Recharge India, since Jun 2025' },
    { label: 'Shipping', value: 'DDMP microservices for Ooredoo Qatar' },
    { label: 'Runs on', value: 'Docker, AKS, Azure Service Bus' },
    { label: 'Speaks', value: 'English, Malayalam, Hindi, Tamil' },
  ],
  uptime: '2+ yrs',
  whoami:
    'Sethu Madhavan V G. .NET developer at Recharge India, building DDMP microservices for Ooredoo Qatar. Palakkad, Kerala.',
};

export const MARQUEE = [
  'C#', 'ASP.NET Core', 'Microservices', 'Entity Framework Core', 'LINQ', 'Azure SQL',
  'Angular', 'TypeScript', 'Docker', 'AKS', 'Azure Service Bus', 'Application Insights',
  'KQL', 'Flutter', 'Python', 'Ollama',
];

export const ABOUT = {
  heading: 'Microservices by day, automation by night',
  kicker: 'A short read before the projects',
  leadBefore: 'I build the parts of a product people rarely see and always depend on. At Recharge India I develop the ',
  leadMark: 'Checkout, Commission and Product Catalogue microservices',
  leadAfter:
    " of DDMP, a distributor management SaaS for Ooredoo Qatar's distributor and merchant network. Off the clock I automate my own chores with local language models and build small front ends to see the data come alive.",
  stats: [
    { value: 2, title: 'Years shipping', text: 'REST APIs in ASP.NET Core and EF Core' },
    { value: 30, title: 'Seconds per invoice', text: 'down from 10 to 15 minutes of manual work' },
    { value: 3, title: 'Microservices owned', text: 'Checkout, Commission and Product Catalogue' },
  ],
  facts: [
    'Hierarchy-based RBAC',
    'Server-side pagination',
    'Repository and unit of work',
    'Root-cause analysis with KQL',
    'Docker on AKS',
    'Privacy-first local AI',
  ],
};

export const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'net', label: '.NET' },
  { key: 'angular', label: 'Angular' },
  { key: 'react', label: 'React' },
  { key: 'ai', label: 'AI and Python' },
  { key: 'web', label: 'HTML' },
];

/** Which project tags each filter button matches. */
export const FILTER_MATCH: Record<Exclude<FilterKey, 'all'>, string[]> = {
  net: ['net'],
  angular: ['angular'],
  react: ['react'],
  ai: ['ai', 'python'],
  web: ['web'],
};

export const PROJECTS: Project[] = [
  {
    id: 'invoice',
    title: 'LLM Auto Invoice Processor',
    subtitle: 'A fully local pipeline that reads, stamps, files and logs supplier invoices',
    tags: ['Python', 'Ollama', 'Graph API'],
    filterTags: ['ai', 'python'],
    paragraphs: [
      'An accounts team was spending 10 to 15 minutes on every invoice: copy the next number from Excel, stamp it on the PDF, type the vendor and amount, upload to SharePoint, paste the link back. This script does all of it in about 30 seconds.',
    ],
    bullets: [
      'OCR with pdfplumber for digital PDFs, Tesseract or EasyOCR for scans',
      'qwen2.5:7b on Ollama turns raw text into validated JSON with Pydantic',
      'PyMuPDF stamps the invoice number, Microsoft Graph files it in SharePoint',
      'Dry-run and batch-folder modes, rotating logs, unit tests',
    ],
    callout: { strong: 'No cloud AI.', text: 'Invoice data never leaves the machine.' },
    links: [{ label: 'View the code', url: 'https://github.com/connect-sethuvg/llmAutoInvoice-processor-' }],
    visual: {
      kind: 'pipeline',
      steps: [
        { title: 'OCR', detail: 'pdfplumber, Tesseract, EasyOCR' },
        { title: 'Field extraction', detail: 'Local LLM returns vendor, amount, date as JSON' },
        { title: 'PDF stamp', detail: 'INV number overlaid on page one' },
        { title: 'SharePoint upload', detail: 'Graph API, Creditors folder' },
        { title: 'Excel row', detail: 'All fields plus the file link' },
      ],
      race: [
        { label: 'By hand', value: '~12 min', speed: 'slow' },
        { label: 'With script', value: '~30 s', speed: 'fast' },
      ],
    },
  },
  {
    id: 'contacts',
    title: 'Contact Manager',
    subtitle: 'ASP.NET backend with a separate Angular 21 front end',
    tags: ['C#', 'Angular', 'TypeScript'],
    filterTags: ['net', 'angular'],
    paragraphs: [
      'A full stack contact book split the way production apps are: a C# API in one repository and an Angular client in another. It is the latest thing on the workbench, updated September 2026.',
    ],
    bullets: [
      'REST API in C# with ASP.NET',
      'Angular 21 client generated with the CLI, tested with Vitest',
      'Clean split between API contract and UI',
    ],
    links: [
      { label: 'Backend code', url: 'https://github.com/connect-sethuvg/contactapp' },
      { label: 'Frontend code', url: 'https://github.com/connect-sethuvg/ContactFrontend' },
    ],
    visual: {
      kind: 'list',
      url: 'localhost:4200/contacts',
      rows: [
        { initials: 'AN', name: 'Anjali Nair', meta: 'Kochi' },
        { initials: 'RM', name: 'Rahul Menon', meta: 'Thrissur' },
        { initials: 'FK', name: 'Fathima K', meta: 'Palakkad' },
      ],
    },
  },
  {
    id: 'sonet',
    title: 'Kia Sonet 2026 Showroom',
    subtitle: 'A React microsite for variants, Kerala on-road prices and comparisons',
    tags: ['React', 'TypeScript', 'Vite'],
    filterTags: ['react', 'web'],
    paragraphs: [
      'Buying a compact SUV in Kerala means juggling brochure PDFs and dealer quotes. This digital showroom lays out every Sonet variant with on-road pricing for the state and side-by-side comparison.',
    ],
    bullets: [
      'React and TypeScript, built with Vite',
      'GitHub Actions builds and deploys to GitHub Pages on every push',
      'It is live, so you can try it now',
    ],
    links: [
      { label: 'Open the live site', url: 'https://connect-sethuvg.github.io/sonnetDetails/' },
      { label: 'View the code', url: 'https://github.com/connect-sethuvg/sonnetDetails' },
    ],
    visual: {
      kind: 'cards',
      url: 'connect-sethuvg.github.io/sonnetDetails',
      cards: [
        { title: 'HTE', detail: 'Petrol MT' },
        { title: 'HTK+', detail: 'Turbo iMT' },
        { title: 'GTX+', detail: 'Diesel AT' },
      ],
    },
  },
  {
    id: 'property',
    title: 'Kerala Property',
    subtitle: 'A property listing application built in Angular',
    tags: ['Angular', 'TypeScript'],
    filterTags: ['angular'],
    paragraphs: [
      'A listing front end for homes and plots across Kerala, built to practise component structure, routing and list filtering in Angular.',
    ],
    bullets: ['Angular 21 with standalone components', 'Listing cards and detail views', 'Vitest for unit tests'],
    links: [{ label: 'View the code', url: 'https://github.com/connect-sethuvg/keralaproperty' }],
    visual: {
      kind: 'cards',
      url: 'keralaproperty/listings',
      cards: [
        { title: '3 BHK villa', detail: 'Palakkad' },
        { title: '12 cent plot', detail: 'Thrissur' },
        { title: '2 BHK flat', detail: 'Kochi' },
      ],
    },
  },
  {
    id: 'vasthra',
    title: 'VAsthra Inventory',
    subtitle: 'A lightweight stock tracker for a clothing store',
    tags: ['HTML', 'CSS', 'JavaScript'],
    filterTags: ['web'],
    paragraphs: [
      'An inventory screen for a textile shop that needs to know what is on the shelf without buying an ERP. Plain HTML, CSS and JavaScript, so it runs on any counter PC.',
    ],
    bullets: ['No build step and no server needed', 'Stock list with low-stock flags'],
    links: [{ label: 'View the code', url: 'https://github.com/connect-sethuvg/VAsthra_Inventory' }],
    visual: {
      kind: 'table',
      url: 'vasthra/inventory',
      head: ['Item', 'Size', 'Qty'],
      rows: [
        { cells: ['Kasavu saree', 'Free', '24'] },
        { cells: ['Cotton kurta', 'M', '3'], low: true },
        { cells: ['Mundu, double', 'Free', '41'] },
      ],
    },
  },
];

export const STACK_GROUPS: { name: string; keys: StackKey[] }[] = [
  {
    name: 'Backend',
    keys: [
      { label: 'C#', filter: 'net', note: 'Checkout, Commission and Product Catalogue microservices for DDMP, plus the Contact Manager API.' },
      { label: 'ASP.NET Core', filter: 'net', note: 'Daily driver. Web APIs for a telecom distributor SaaS serving Ooredoo Qatar.', wide: true },
      { label: 'EF Core', filter: 'net', note: 'Server-side pagination, filtering and migrations over large transaction tables.' },
      { label: 'LINQ', filter: 'net', note: 'Query projection that trims payloads before they leave the database.' },
      { label: 'SQL Server', filter: 'net', note: 'Azure SQL in production and T-SQL for ad-hoc business reports.' },
      { label: 'Swagger', filter: 'net', note: 'Every checkout API is documented in OpenAPI and tested in Postman.' },
    ],
  },
  {
    name: 'Cloud and ops',
    keys: [
      { label: 'Azure', filter: 'net', note: 'Monitor, Application Insights and Log Analytics for production support.', wide: true },
      { label: 'Docker', filter: 'net', note: 'Containerised services, pushed through Azure Container Registry.' },
      { label: 'AKS', filter: 'net', note: 'Where the DDMP microservices run.' },
      { label: 'Service Bus', filter: 'net', note: 'Event-driven messaging between microservices.', wide: true },
      { label: 'KQL', filter: 'net', note: 'Querying logs and exceptions to find the root cause of production defects.' },
    ],
  },
  {
    name: 'Frontend and mobile',
    keys: [
      { label: 'Angular', filter: 'angular', note: 'Checkout and catalogue modules at work, Kerala Property and the Contact Manager client.', wide: true },
      { label: 'TypeScript', filter: 'react', note: 'Every web front end here, from Angular apps to the Sonet showroom.' },
      { label: 'React', filter: 'react', note: 'The Kia Sonet 2026 showroom, deployed to GitHub Pages.' },
      { label: 'HTML/CSS', filter: 'web', note: 'VAsthra Inventory, with no build step at all.' },
      { label: 'Flutter', filter: 'web', note: 'A student management app at Softloom with Bloc, Provider and Firebase.' },
    ],
  },
  {
    name: 'AI and tooling',
    keys: [
      { label: 'Python', filter: 'ai', note: 'The invoice pipeline: OCR, PDF stamping, Excel and SharePoint.' },
      { label: 'Ollama', filter: 'ai', note: 'Runs qwen2.5:7b locally so invoice data stays on the machine.' },
      { label: 'Git', filter: 'all', note: 'Every project on this page.', wide: true },
    ],
  },
];

export const STACK_SUMMARY =
  'C#, ASP.NET Core, EF Core, LINQ, SQL Server, Angular, TypeScript, Docker, AKS, Azure Service Bus, KQL, Flutter, Python. Press any key on the left for details.';

export const ROLES: Role[] = [
  {
    title: 'Junior Software Developer (.NET)',
    company: 'Recharge India Pvt Ltd',
    period: 'Jun 2025 to now',
    projectLine: 'DDMP, a distributor management SaaS. Client: Ooredoo Qatar',
    featured: true,
    log: [
      { area: 'Build', text: 'Checkout, Commission and Product Catalogue microservices in C# and ASP.NET Core Web API' },
      { area: 'Design', text: 'REST APIs for checkout hierarchy and transaction tracking, documented in Swagger and tested in Postman' },
      { area: 'Validate', text: 'End-to-end checkout flow with business rules across the distributor and merchant hierarchy' },
      { area: 'Secure', text: 'Hierarchy-based RBAC so each user sees and does only what their position allows' },
      { area: 'Speed up', text: 'Server-side pagination and filtering with EF Core and LINQ, async queries and projection on Azure SQL' },
      { area: 'Structure', text: 'Layered architecture, dependency injection, repository and unit of work, EF Core migrations' },
      { area: 'Connect', text: 'Azure Service Bus for event-driven messaging between services, APIs wired into Angular modules' },
      { area: 'Ship', text: 'Docker images through Azure Container Registry to Azure Kubernetes Service' },
      { area: 'Operate', text: 'Azure Monitor, App Insights and KQL in Log Analytics for root-cause analysis; SQL for ad-hoc business reports' },
    ],
  },
  {
    title: 'Flutter Developer Intern, part time',
    company: 'Softloom Technology, Ernakulam',
    period: 'May to Dec 2024',
    projectLine: 'Student Management System, built alongside a full-time role',
    gauges: [
      { value: '30%', label: 'faster UI rendering' },
      { value: '40%', label: 'fewer crashes' },
      { value: '25%', label: 'less duplicate code' },
    ],
    note: 'Flutter app with feature-based structure, responsive forms and REST integration. State with Provider, Bloc, Cubit and GetX; Firebase for auth, real-time data and storage.',
  },
  {
    title: 'Customer Service Associate',
    company: 'Sutherland Global Services',
    period: 'Jun 2022 to Mar 2025',
    note: "Handled high volumes of customer queries to quality and turnaround targets, kept clean case notes for smooth handovers, and learned software development in parallel. It is where I learned to read a problem from the user's side first.",
  },
];

export const EDUCATION = [
  {
    title: 'B.Tech, Computer Science and Engineering',
    text: 'MEA Engineering College, Malappuram. APJ Abdul Kalam Technological University (KTU)',
  },
  { title: 'Languages', text: 'English, Malayalam, Hindi and Tamil' },
  {
    title: 'Working style',
    text: 'Small pull requests, logs before guesses, and a dry-run flag on anything that writes data',
  },
];
