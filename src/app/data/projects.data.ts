import { Project } from './types';

/**
 * The twelve entries, in the order the design's index runs: the thesis is 01 and gets the
 * block on the home page, 02–12 fill the index list. Every one of them also has its own
 * detail route.
 *
 * `lead` is the one line under the title on the detail page and must stay short — it is set
 * at display size. `description` is the body copy below it: one short paragraph, or two for
 * the thesis, which earns the extra room.
 *
 * Plate counts are not stored here — they come from plates.generated.ts, which
 * `npm run plates` rewrites from what is actually on disk.
 */
export const projects: Project[] = [
  {
    id: 'shelvio',
    number: '01',
    titleLines: ['Shelvio'],
    tag: 'thesis',
    lead: 'Films, series, books — and a recommender that argues its case.',
    description: [
      'A web system for keeping one history of everything you watch and read, and turning it ' +
        'into recommendations that explain themselves. It runs as five services in three ' +
        'languages behind a single ASP.NET Core gateway, each owning its own store — two ' +
        'PostgreSQL databases, Redis for caching, RabbitMQ for events.',
      'Recommendations come from grouping the library into taste tiers and prompting GPT-4o ' +
        'mini, then discarding anything already tracked or a sequel to something owned. Every ' +
        'pick has to name specific titles from your own library as its reasoning. Results cache ' +
        'for twelve hours and are capped at three a day, which keeps cost and availability ' +
        'bounded.',
    ],
    specs: [
      { label: 'SERVICES', value: '5 behind one API gateway' },
      {
        label: 'STACK',
        value: 'C# · Node.js · Python · PostgreSQL ×2 · Redis · RabbitMQ · GPT-4o mini',
      },
      { label: 'GATEWAY', value: 'ASP.NET Core with YARP — one door, central JWT' },
      { label: 'PICKS', value: 'Taste tiers in, validated picks out — each names titles you own' },
      { label: 'RUN', value: 'docker compose up' },
      {
        label: 'SOURCE',
        links: [{ label: 'github.com/velimirovic/shelvio', href: 'https://github.com/velimirovic/shelvio' }],
      },
    ],
    captions: [
      'Search across films, series and books in one query',
      'Title detail with status, rating and related titles',
      'Personal statistics built from the tracking service',
      'Generated recommendations, each naming titles from your own library',
    ],
  },
  {
    id: 'tourflo',
    number: '02',
    titleLines: ['TourFlo'],
    tag: '7 microservices',
    lead: 'Seven services, five runtimes, one compose file.',
    description: [
      'Tourism platform built as seven independently deployable services for the ' +
        'Service-Oriented Architecture course, talking over REST and gRPC behind a Go API ' +
        'gateway. Auth in ASP.NET Core, tours and purchases in Spring Boot, the blog in Node.js ' +
        'on MongoDB, the social graph in Go on Neo4j — all brought up with one Docker Compose ' +
        'file.',
    ],
    specs: [
      { label: 'SERVICES', value: '7, each deployable on its own' },
      { label: 'STACK', value: 'Go · C# · Java · Node.js · Angular 18' },
      { label: 'TALKS', value: 'REST and gRPC through a Go gateway' },
      { label: 'STORES', value: 'PostgreSQL · MongoDB · Neo4j' },
      {
        label: 'SOURCE',
        links: [
          { label: 'github.com/velimirovic/soa-tourism-app', href: 'https://github.com/velimirovic/soa-tourism-app' },
        ],
      },
    ],
    captions: [
      'Tour catalogue served through the gateway',
      'Tour detail with checkpoints',
      'Blog service, backed by MongoDB',
      'Social graph from the followers service',
      'Cart and checkout',
    ],
  },
  {
    id: 'travel-vista',
    number: '03',
    titleLines: ['Travel', 'Vista'],
    tag: 'live GPS',
    lead: 'Guides and tourists on the same map, live.',
    description: [
      'Platform for planning and executing tourist tours: authors build them from checkpoints, ' +
        'tourists walk them with their position tracked live over SignalR on Leaflet maps, and ' +
        'progress is rewarded with ranks and achievements. Built as a modular monolith with Clean ' +
        'Architecture — deliberately the opposite choice to TourFlo.',
    ],
    specs: [
      { label: 'TRACKING', value: 'SignalR positions drawn on Leaflet maps' },
      { label: 'STACK', value: 'ASP.NET Core 8 · Angular 16 · PostgreSQL' },
      { label: 'SHAPE', value: 'Modular monolith, Clean Architecture' },
      { label: 'ROLE', value: 'Team project — backend and front end' },
      {
        label: 'SOURCE',
        links: [
          { label: 'frontend', href: 'https://github.com/kzi-nastava/psw-fe-ra-2025-group-3' },
          { label: 'backend', href: 'https://github.com/kzi-nastava/psw-be-ra-2025-group-3' },
        ],
      },
    ],
    captions: [
      'Tour execution with live position on the map',
      'Author tools for building a tour from checkpoints',
      'Gamification — ranks, achievements and rewards',
      'Mobile views',
    ],
  },
  {
    id: 'event-day',
    number: '04',
    titleLines: ['Event', 'Day'],
    tag: 'conference PWA',
    lead: 'A conference app that works when the venue Wi-Fi does not.',
    description: [
      'Progressive web app for a conference. Attendees browse the agenda, bookmark sessions ' +
        'with conflict detection, vote in live Q&A and ask a Claude-powered assistant about ' +
        'speakers and the venue. Installable and offline-capable, because it was built for a room ' +
        'full of people on bad conference Wi-Fi.',
    ],
    specs: [
      { label: 'OFFLINE', value: 'Installable PWA, usable with no connection' },
      { label: 'STACK', value: 'React 18 · Express · SQLite · Claude API' },
      { label: 'DOES', value: 'Agenda, bookmarks with conflict detection, live Q&A' },
      { label: 'ASSISTANT', value: 'Answers on schedule, speakers and venue' },
      {
        label: 'SOURCE',
        links: [
          { label: 'github.com/velimirovic/event-day-app', href: 'https://github.com/velimirovic/event-day-app' },
        ],
      },
    ],
    captions: ['Agenda, speakers and the personal schedule', 'Networking cards and venue navigation'],
  },
  {
    id: 'jutjubic',
    number: '05',
    titleLines: ['Jutjubic'],
    tag: 'geo-tagged video',
    lead: 'Video with a location, and numbers to prove what gets watched.',
    description: [
      'Video platform where location is a first-class dimension: uploads are tied to a place ' +
        'and browsed on a Leaflet map with cached tiles. A scheduled ETL pipeline scores what is ' +
        'actually being watched, and Prometheus and Grafana track the whole thing on custom ' +
        'metrics.',
    ],
    specs: [
      { label: 'MAPS', value: 'Leaflet with cached tiles' },
      { label: 'STACK', value: 'Spring Boot · Angular 16 · PostgreSQL' },
      { label: 'MEASURES', value: 'Scheduled ETL, weighted popularity scoring' },
      { label: 'WATCHES', value: 'Prometheus and Grafana on custom metrics' },
      {
        label: 'SOURCE',
        links: [
          { label: 'frontend', href: 'https://github.com/velimirovic/isa-frontend' },
          { label: 'backend', href: 'https://github.com/velimirovic/isa-backend' },
        ],
      },
    ],
    captions: [
      'Videos placed on the map',
      'Video detail and playback',
      'Upload with location',
      'Popularity dashboard from the ETL output',
    ],
  },
  {
    id: 'teodity-market',
    number: '06',
    titleLines: ['Teodity', 'Market'],
    tag: 'live auctions',
    lead: 'One catalogue, two ways to sell.',
    description: [
      'Marketplace where the same catalogue carries both fixed-price listings and live ' +
        'auctions, with role-based access for buyers, sellers and admins. Auctions were the half ' +
        'worth building — they force you to think about bid deadlines, notification timing, and ' +
        'two bids landing in the same second.',
    ],
    specs: [
      { label: 'SELLS', value: 'Fixed price and live auctions side by side' },
      { label: 'STACK', value: 'React 19 · Node.js · Express · Leaflet' },
      { label: 'ROLES', value: 'Buyer, seller, admin' },
      { label: 'NOTIFIES', value: 'Email on bids and outcomes' },
      {
        label: 'SOURCE',
        links: [
          { label: 'github.com/velimirovic/teodity-market', href: 'https://github.com/velimirovic/teodity-market' },
        ],
      },
    ],
    captions: ['Catalogue and search', 'Listing detail with bidding', 'Seller inventory', 'Listings on the map'],
  },
  {
    id: 'booking-app',
    number: '07',
    titleLines: ['Booking', 'App'],
    tag: 'WPF desktop',
    lead: 'Four roles, one desktop app, and a DI container I wrote myself.',
    description: [
      'Desktop app for accommodation and tour reservations with four user roles, live tour ' +
        'progress tracking and generated PDF reports. Built on MVVM over .NET 8 and WPF, with a ' +
        'dependency injection container written from scratch rather than installed.',
    ],
    specs: [
      { label: 'BUILT', value: 'Dependency injection container written from scratch' },
      { label: 'STACK', value: 'C# .NET 8 · WPF · MVVM' },
      { label: 'ROLES', value: 'Guests, owners, guides, tourists' },
      { label: 'REPORTS', value: 'Generated PDFs, monthly and yearly statistics' },
      {
        label: 'SOURCE',
        links: [{ label: 'github.com/velimirovic/booking-app', href: 'https://github.com/velimirovic/booking-app' }],
      },
    ],
    captions: ['Accommodation search', 'Owner dashboard', 'Live tour tracking', 'Statistics and reports'],
  },
  {
    id: 'brb',
    number: '08',
    titleLines: ['Be Real', 'Bro'],
    tag: 'party game',
    lead: 'The only thing here that people who are not developers actually use.',
    description: [
      'Party card game for friends: honest questions and dares drawn from themed decks loaded ' +
        'from JSON, with one skip per game and special one-time cards. Reactive state through ' +
        'RxJS. Mobile-first, because the only context it is ever used in is one phone passed ' +
        'around a table.',
    ],
    specs: [
      { label: 'PLAYS', value: 'Shuffled decks, one skip per game, one-time cards' },
      { label: 'STACK', value: 'Angular 18 · TypeScript · RxJS' },
      { label: 'MADE FOR', value: 'One phone, passed around a table' },
      {
        label: 'LIVE',
        links: [{ label: 'velimirovic.github.io/brb', href: 'https://velimirovic.github.io/brb/' }],
      },
      {
        label: 'SOURCE',
        links: [{ label: 'github.com/velimirovic/brb', href: 'https://github.com/velimirovic/brb' }],
      },
    ],
    captions: ['Start, a question card and a challenge card'],
  },
  {
    id: 'unity-3d',
    number: '09',
    titleLines: ['Unity 3D', 'Runner'],
    tag: 'Unity 6',
    lead: 'Collisions knock the character down, and it gets back up.',
    description: [
      'Third-person game set in an old sea port, built in Unity 6. A physics-based controller ' +
        'handles walking, running, jumping and crouching, speed pickups run on a timer HUD, and ' +
        'hard impacts make the character stumble and recover on its own. Mostly a tuning exercise ' +
        'rather than a coding one.',
    ],
    specs: [
      { label: 'PHYSICS', value: 'Rigidbody impacts, stumble and recovery' },
      { label: 'STACK', value: 'Unity 6 · C#' },
      { label: 'DOES', value: 'Walk, run, jump, crouch, speed pickups' },
      { label: 'COURSE', value: 'Visual Programming and Animation' },
      {
        label: 'SOURCE',
        links: [{ label: 'github.com/velimirovic/unity-3d', href: 'https://github.com/velimirovic/unity-3d' }],
      },
    ],
    captions: ['The old sea port level', 'Speed pickup with the active timer', 'Push physics on loose objects'],
  },
  {
    id: 'unity-2d',
    number: '10',
    titleLines: ['Unity 2D', 'Platformer'],
    tag: 'Unity 6',
    lead: 'A knight, patrolling enemies, and a potion that lets you fly.',
    description: [
      'Pixel-art action platformer in Unity 6. A knight fights through levels of patrolling and ' +
        'flying enemies, moving platform traps and projectile towers, with a sprint on cooldown ' +
        'and a potion that grants timed flight. Enemy AI here is about legibility more than ' +
        'intelligence.',
    ],
    specs: [
      { label: 'ENEMIES', value: 'Ground patrols, flyers, projectile towers' },
      { label: 'STACK', value: 'Unity 6 · C# · Input System' },
      { label: 'DOES', value: 'Sprint with cooldown, flight power-up, health bar' },
      { label: 'COURSE', value: 'Visual Programming and Animation' },
      {
        label: 'SOURCE',
        links: [{ label: 'github.com/velimirovic/unity-2d', href: 'https://github.com/velimirovic/unity-2d' }],
      },
    ],
    captions: ['Pixel art level with patrolling enemies', 'Flight power-up on its timer', 'Trap tower and health bar'],
  },
  {
    id: 'elevator-3d',
    number: '11',
    titleLines: ['Elevator', '3D'],
    tag: 'OpenGL / C++',
    lead: 'No engine. Camera, lighting and picking written by hand.',
    description: [
      'First-person simulator of an eight-floor building, written in C++ against raw OpenGL 3.3 ' +
        'with no engine underneath. Phong shading with nine point lights, a mouse-look camera, ' +
        'and a control panel operated by raycasting against 3D buttons. The camera matrix and the ' +
        'picking maths are hand-written.',
    ],
    specs: [
      { label: 'RENDERS', value: 'Phong shading, nine point lights' },
      { label: 'STACK', value: 'C++ · OpenGL 3.3 · GLFW · GLM · Assimp' },
      { label: 'INTERACTS', value: 'Raycast against 3D buttons across eight floors' },
      { label: 'COURSE', value: 'Computer Graphics' },
      {
        label: 'SOURCE',
        links: [
          {
            label: 'github.com/velimirovic/elevator-simulator-3d',
            href: 'https://github.com/velimirovic/elevator-simulator-3d',
          },
        ],
      },
    ],
    captions: ['First-person view of the lit interior', 'The control panel, picked by raycast'],
  },
  {
    id: 'elevator-2d',
    number: '12',
    titleLines: ['Elevator', '2D'],
    tag: 'OpenGL / C++',
    lead: 'Request queue, door animation, and a font renderer built from nothing.',
    description: [
      'Two-dimensional version of the same building: an elevator serving a request queue, ' +
        'animated doors, and a person walking through a six-frame sprite cycle. It also carries a ' +
        'font rendering system built from nothing, because drawing one character of text is a ' +
        'real problem when nothing does it for you.',
    ],
    specs: [
      { label: 'RENDERS', value: 'Sprite animation, six-frame walk cycle' },
      { label: 'STACK', value: 'C++ · OpenGL 3.3 · GLFW' },
      { label: 'BUILT', value: 'Custom font rendering system' },
      { label: 'COURSE', value: 'Computer Graphics' },
      {
        label: 'SOURCE',
        links: [
          {
            label: 'github.com/velimirovic/elevator-simulator-2d',
            href: 'https://github.com/velimirovic/elevator-simulator-2d',
          },
        ],
      },
    ],
    captions: ['The eight-floor shaft with the request queue', 'Doors opening as a person walks in'],
  },
];

/**
 * The thesis, which the home page treats differently from the rest. Looked up by id rather
 * than by position so reordering the list fails loudly instead of silently promoting
 * whatever ended up first.
 */
export const thesis: Project = (() => {
  const found = projects.find((project) => project.id === 'shelvio');
  if (!found) throw new Error('Expected a project with id "shelvio"');
  return found;
})();

/** Everything below the thesis, in index order. */
export const indexProjects = projects.slice(1);

export const projectById = (id: string): Project | undefined =>
  projects.find((project) => project.id === id);
