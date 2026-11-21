export const projects = [
  {
    slug: 'voltrep',
    status: 'active',
    featured: true,
    year: '2025 – 2026',
    category: 'Product Design & Front-End',
    coverImage: {
      src: `${import.meta.env.BASE_URL}assets/voltrep-cover.webp`,
      alt: {
        it: 'Identità visiva e interfaccia VoltRep — Mark barbell/pulse, Workout ticker e grafici Progress',
        en: 'VoltRep brand identity and app interface — Barbell/pulse mark, Workout ticker, and Progress charts',
      },
    },
    links: {
      live: 'https://voltrep-app.web.app/',
    },
    metrics: [
      { value: '0 €', label: { it: 'Accesso gratuito', en: 'Free access' } },
      { value: '60 FPS', label: { it: 'Target fluidità UI', en: 'Target UI fluidity' } },
      { value: 'Firestore', label: { it: 'Database Firebase', en: 'Firebase database' } },
      { value: 'AA', label: { it: 'Target contrasto WCAG', en: 'WCAG contrast target' } },
    ],
    gallery: [
      {
        src: `${import.meta.env.BASE_URL}projects/voltrep/gallery-screens.webp`,
        caption: {
          it: 'Interfaccia VoltRep App: vista Workout con selettore Sets × Reps (5×5, 8 reps) e Weight Ticker (+550 lb), affiancata alla vista Progress con curve settimanali e istogrammi di volume.',
          en: 'VoltRep App interface: Workout view with Sets × Reps logger (5×5, 8 reps) and Weight Ticker (+550 lb), paired with the Progress view featuring weekly volume curves and histograms.',
        },
      },
      {
        src: `${import.meta.env.BASE_URL}projects/voltrep/brand-identity-sheet.webp`,
        caption: {
          it: 'Tavola di Brand Identity VoltRep: logotipo con icona bilanciere/impulso elettrico, palette cromatica (#0A0F1D, #1A1F2D, #00F5D4, #FFB800) e gerarchia tipografica.',
          en: 'VoltRep Brand Identity sheet: barbell/electric-pulse logotype, color system (#0A0F1D, #1A1F2D, #00F5D4, #FFB800), and typography hierarchy.',
        },
      },
    ],
    content: {
      it: {
        title: 'VoltRep',
        outcomeHeadline: 'Tracciamento dei carichi in palestra senza frizioni né paywall.',
        tldr: 'Nata da cinque anni di allenamento costante in diverse palestre: applicazione web PWA-ready per registrare serie, ripetizioni, Weight Ticker e curve di progressione senza sovraccarico visivo né abbonamenti tra una serie e l’altra.',
        problem:
          'Le app fitness tradizionali risultano spesso sovraccariche di funzioni superflue, flussi macchinosi tra una serie e l’altra o bloccano il tracciamento storico dietro abbonamenti mensili. In palestra, tra un set e il recupero, l’utente ha bisogno di velocità di input e chiarezza immediata.',
        objectives: [
          'Progettare una vista Workout immediata con righe Sets × Reps (es. 5×5, 8 reps), Weight Ticker istantaneo e pulsante rapido (+) nella thumb-zone.',
          'Affiancare una vista Progress chiara con grafici lineari di andamento settimanale e istogrammi di volume in verde-ciano elettrico (#00F5D4).',
          'Garantire un’esperienza mobile-first fluida (PWA-ready) completamente gratuita e priva di barriere.',
        ],
        designChoices: [
          'Sistema cromatico scuro nativo su superfici tonali (#0A0F1D e #1A1F2D) con accenti ad alta visibilità Electric Teal (#00F5D4) e Amber Gold (#FFB800) per ridurre l’affaticamento visivo sotto le luci indoor.',
          'Identità visiva fondata sul marchio VoltRep con simbolo bilanciere e impulso elettrico integrato, abbinata a tipografia Bold Sans-Serif per gli header e Monospace/Light per i dati numerici.',
          'Gerarchia informativa orientata all’azione: scheda Workout attiva, Weight Ticker e tab di navigazione rapida sempre raggiungibili con un solo pollice.',
        ],
        techArchitecture: {
          stack: ['UI/UX Design', 'Brand Identity', 'Front-End Web', 'PWA', 'Firebase Hosting'],
          details:
            'Sviluppata come Web Application progressiva ospitata su Firebase Hosting (voltrep-app.web.app), con gestione strutturata dei dati di allenamento, calcolo automatico del tonnellaggio per sessione e meta-tag SEO/Open Graph completi.',
        },
        results: [
          'Prodotto live e utilizzabile gratuitamente su desktop e smartphone senza installazioni obbligatorie.',
          'Flusso di registrazione serie (Workout) e analisi storica (Progress) ottimizzato per l’uso reale durante i tempi di recupero.',
          'Consolidamento pratico delle competenze di Brand Identity, Interaction Design, ergonomia cognitiva e sviluppo front-end.',
        ],
      },
      en: {
        title: 'VoltRep',
        outcomeHeadline: 'Frictionless gym load tracking with zero paywalls.',
        tldr: 'Born from five years of consistent strength training across different gyms: a PWA-ready web app to log sets, reps, Weight Ticker, and progression charts without visual clutter or paywalls between sets.',
        problem:
          'Traditional fitness apps often suffer from cluttered interfaces, slow input flows between sets, or lock historical tracking behind recurring paywalls. On the gym floor, users need speed and immediate visual clarity.',
        objectives: [
          'Design an immediate Workout view with structured Sets × Reps rows (e.g., 5×5, 8 reps), live Weight Ticker, and a quick-add (+) thumb-zone action.',
          'Pair a dedicated Progress view featuring weekly trend curves and volume bar charts highlighted in electric teal (#00F5D4).',
          'Deliver a fast, mobile-first PWA-ready experience completely free of charge.',
        ],
        designChoices: [
          'Native dark tonal surfaces (#0A0F1D and #1A1F2D) paired with high-visibility Electric Teal (#00F5D4) and Amber Gold (#FFB800) accents to reduce eye strain under indoor gym lighting.',
          'Distinctive brand identity built around the VoltRep barbell-pulse mark, combining Bold Sans-Serif headlines with Monospace/Light captions for tabular metrics.',
          'Action-first hierarchy keeping the active Workout logger, Weight Ticker, and bottom navigation bar accessible with one thumb.',
        ],
        techArchitecture: {
          stack: ['UI/UX Design', 'Brand Identity', 'Front-End Web', 'PWA', 'Firebase Hosting'],
          details:
            'Built as a progressive web application deployed on Firebase Hosting (voltrep-app.web.app), featuring structured workout data management, automatic tonnage calculation, and complete SEO/Open Graph metadata.',
        },
        results: [
          'Live product accessible for free on mobile and desktop with zero mandatory app-store friction.',
          'Workout logging and Progress analytics tailored for real-world usage between rest intervals.',
          'Hands-on validation of Brand Identity, interaction design, cognitive ergonomics, and front-end engineering.',
        ],
      },
    },
  },
  {
    slug: 'esu',
    status: 'active',
    featured: true,
    year: '2025',
    category: 'HCI & Interaction Design',
    coverImage: {
      src: `${import.meta.env.BASE_URL}projects/esu/cover.webp`,
      alt: {
        it: 'ESU (Sensor Exercise You) — Ecosistema hardware ESU-Box, ESU-Move, ESU-Rug e app mobile',
        en: 'ESU (Sensor Exercise You) — ESU-Box, ESU-Move, ESU-Rug hardware ecosystem and mobile app',
      },
    },
    links: {
      figma: 'https://www.figma.com/design/ySnTXOt5Qn8G0F5f0bsBy3/ESU?node-id=0-1&p=f&t=bueqQ8fIMVIzhgCO-0',
    },
    metrics: [
      { value: 'IPM', label: { it: 'Interazione Persona-Macchina', en: 'Human-Computer Interaction' } },
      { value: '3 Unità', label: { it: 'ESU-Box · Move · Rug', en: 'ESU-Box · Move · Rug' } },
      { value: 'UniTN', label: { it: 'Università di Trento (DiPSCo)', en: 'University of Trento (DiPSCo)' } },
      { value: 'Figma', label: { it: 'Prototipo Interattivo', en: 'Interactive Prototype' } },
    ],
    gallery: [
      {
        src: `${import.meta.env.BASE_URL}projects/esu/gallery-screens.webp`,
        caption: {
          it: 'Viste principali dell’applicazione ESU: dashboard ESU-Box con indicatori circolari e stato dispositivi (ESU Rug, ESU Move), guida Workout interattiva con feedback posturale e schermata Daily Fitness Challenges.',
          en: 'Core ESU mobile app views: ESU-Box dashboard with circular telemetry gauges and connected device status (ESU Rug, ESU Move), interactive Workout motion guide, and Daily Fitness Challenges.',
        },
      },
      {
        src: `${import.meta.env.BASE_URL}projects/esu/gallery-hardware.webp`,
        caption: {
          it: 'Ecosistema di prodotto ESU-Line (Sensor Exercise You): unità centrale ottica ESU-Box, fasce sensore indossabili ESU-Move e tappetino sensibile alla pressione ESU-Rug con sincronizzazione rapida.',
          en: 'ESU-Line product ecosystem (Sensor Exercise You): ESU-Box optical base unit, ESU-Move wearable sensor bands, and ESU-Rug pressure-sensing mat with seamless compatibility.',
        },
      },
      {
        src: `${import.meta.env.BASE_URL}projects/esu/brand-identity-sheet.webp`,
        caption: {
          it: 'Tavola di Brand Identity ESU — Sensor Exercise You: logotipo atleta/bilanciere, palette cromatica calda (#FF9933, #FFCC66, #333333, White), tipografia Avenir Next e architettura hardware-software.',
          en: 'ESU — Sensor Exercise You Brand Identity sheet: athlete/barbell logotype, warm high-energy palette (#FF9933, #FFCC66, #333333, White), Avenir Next typography, and hardware-software ecosystem.',
        },
      },
      {
        src: `${import.meta.env.BASE_URL}projects/esu/gallery-hud.webp`,
        caption: {
          it: 'Flussi di telemetria ad alta leggibilità e feedback in tempo reale su ripetizioni, serie e battito cardiaco progettati su Figma.',
          en: 'High-legibility telemetry flows and real-time rep, set, and heart-rate feedback designed in Figma.',
        },
      },
    ],
    content: {
      it: {
        title: 'ESU — Interazione Persona-Macchina',
        outcomeHeadline: 'Ecosistema hardware-software "Sensor Exercise You" per l’allenamento guidato da sensori.',
        tldr: 'Progetto per il corso di Interazione Persona-Macchina (UniTN, DiPSCo — L-20): progettazione dell’identità visiva, dell’ecosistema hardware connesso (ESU-Box, ESU-Move, ESU-Rug) e dei flussi applicativi mobile (Box, Workout, Challenges e Battle Mode) per guidare l’utente durante l’esercizio fisico senza attrito cognitivo.',
        problem:
          'Durante l’allenamento domestico o in palestra con sensori IoT, la configurazione di più periferiche fisiche e la lettura del feedback motorio in tempo reale generano spesso confusione, errori di posizionamento e abbandono. L’utente necessita di un ecosistema coeso in cui hardware e interfaccia parlino lo stesso linguaggio visivo.',
        objectives: [
          'Definire un ecosistema di prodotto integrato (ESU-Line) composto dalla base ottica ESU-Box, i sensori indossabili ESU-Move e il tappetino interattivo ESU-Rug.',
          'Progettare la vista centrale ESU-Box per monitorare con un colpo d’occhio indicatori circolari di performance, grafico temporale dell’attività e stato di connessione delle periferiche.',
          'Accompagnare l’esecuzione motoria con la vista Workout (feedback visivo vettoriale sul movimento e progressione "Next set...") e motivare la costanza tramite Daily Fitness Challenges.',
          'Garantire leggibilità immediata a distanza di braccio grazie a touch target ampi (>= 48px) e contrasto cromatico netto.',
        ],
        designChoices: [
          'Palette "Clean High-Energy": superfici antracite/ossidiana (#333333 e #0B0D12) abbinate ad accenti arancio caldo (#FF9933), ambra (#FFCC66) e bianco puro per massimizzare la gerarchia percettiva durante lo sforzo.',
          'Identità ESU ("Sensor Exercise You") espressa da un marchio circolare atleta-bilanciere e tipografia geometrica (Avenir Next) ad alta leggibilità per headline, body e metriche.',
          'Architettura di navigazione inferiore chiara (Box, Monitoraggio, IA, Social) che separa la gestione dell’hardware dalla guida all’allenamento e dalle sfide giornaliere.',
        ],
        techArchitecture: {
          stack: ['Human-Computer Interaction (HCI)', 'Brand & Product Ecosystem', 'Figma Prototyping', 'IoT Sensor UX', 'Cognitive Ergonomics'],
          details:
            'Progettazione completa su Figma dell’identità di marca ESU, della linea hardware coordinata (ESU-Box, ESU-Move, ESU-Rug) e dei flussi interattivi ad alta fedeltà per il corso universitario di Interazione Persona-Macchina (UniTN DiPSCo, L-20).',
        },
        results: [
          'Ecosistema hardware-software coerente che unisce identità di brand, ergonomia fisica dei sensori e chiarezza dell’interfaccia mobile.',
          'Oltre 30 schermate e flussi interattivi su Figma che coprono pairing dei dispositivi, guida posturale Workout, sfide giornaliere e modalità competitiva.',
          'Prototipo completo e ispezionabile direttamente su Figma.',
        ],
      },
      en: {
        title: 'ESU — Human-Computer Interaction',
        outcomeHeadline: '"Sensor Exercise You" hardware-software ecosystem for sensor-guided training.',
        tldr: 'Academic project for the Human-Computer Interaction course (UniTN, DiPSCo — L-20): end-to-end design of the brand identity, connected hardware ecosystem (ESU-Box, ESU-Move, ESU-Rug), and mobile app flows (Box, Workout, Challenges, and Battle Mode) to guide physical exercise with zero cognitive friction.',
        problem:
          'When training with multi-sensor IoT equipment at home or in the gym, pairing multiple hardware peripherals and interpreting real-time motion feedback often causes confusion and drop-off. Users need a unified ecosystem where physical hardware and digital UI share an immediate visual language.',
        objectives: [
          'Define an integrated hardware product line (ESU-Line) combining the ESU-Box optical base station, ESU-Move wearable straps, and the ESU-Rug pressure-sensing mat.',
          'Design the central ESU-Box dashboard to surface circular performance gauges, activity timeline bars, and live peripheral connectivity at a glance.',
          'Guide exercise execution through the Workout view (vector motion trajectory cues and "Next set..." progression) while sustaining engagement via Daily Fitness Challenges.',
          'Ensure arm’s-length readability through oversized touch targets (>= 48px) and high-contrast visual hierarchy.',
        ],
        designChoices: [
          '"Clean High-Energy" color system: dark charcoal/obsidian surfaces (#333333 and #0B0D12) paired with warm orange (#FF9933), amber gold (#FFCC66), and crisp white accents for instant perceptual discrimination.',
          'ESU ("Sensor Exercise You") brand mark featuring an athlete-barbell emblem paired with clean geometric typography (Avenir Next) across headlines, body copy, and telemetry.',
          'Structured bottom navigation (Box, Monitoring, AI, Social) cleanly separating hardware management from active workout guidance and daily missions.',
        ],
        techArchitecture: {
          stack: ['Human-Computer Interaction (HCI)', 'Brand & Product Ecosystem', 'Figma Prototyping', 'IoT Sensor UX', 'Cognitive Ergonomics'],
          details:
            'Comprehensive brand identity, hardware ecosystem conceptualization (ESU-Box, ESU-Move, ESU-Rug), and high-fidelity interactive prototyping in Figma for the university HCI course at UniTN (DiPSCo, L-20).',
        },
        results: [
          'Cohesive hardware-software ecosystem bridging brand identity, physical sensor ergonomics, and mobile interface clarity.',
          '30+ high-fidelity screens and interactive flows in Figma covering device pairing, real-time Workout guidance, Daily Challenges, and multiplayer modes.',
          'Fully inspectable interactive prototype accessible directly in Figma.',
        ],
      },
    },
  },
  {
    slug: 'trentino-marketing-cms',
    status: 'active',
    featured: true,
    year: 'Ago – Ott 2026',
    category: 'CMS Architecture & Content UX',
    coverImage: {
      src: `${import.meta.env.BASE_URL}assets/trentino-cms-cover.svg`,
      alt: {
        it: 'Diagramma architettura CMS Pimcore e flussi eventi — Trentino Marketing',
        en: 'Pimcore CMS architecture and event flow diagram — Trentino Marketing',
      },
    },
    links: {},
    metrics: [
      { value: '3', label: { it: 'Grandi eventi', en: 'Major events' } },
      { value: 'Pimcore', label: { it: 'CMS Enterprise', en: 'Enterprise CMS' } },
      { value: '0', label: { it: '404 residui su audit', en: 'Unresolved 404s' } },
    ],
    content: {
      it: {
        title: 'Trentino Marketing — Architettura CMS & Event UX',
        outcomeHeadline: 'Qualità informativa e flussi di navigazione su piattaforma enterprise.',
        tldr: 'Tirocinio curriculare (Ago – Ott 2026) focalizzato sull’amministrazione di Pimcore CMS, ottimizzazione dell’interlinking editoriale, bonifica errori 404 e accuratezza logistica/geografica per grandi eventi territoriali.',
        problem:
          'I portali turistici ed evento ad alto traffico accumulano nel tempo link interrotti (404), percorsi editoriali disconnessi e informazioni logistiche frammentate, compromettendo la fiducia dell’utente e la fruibilità sul territorio.',
        objectives: [
          'Ripristinare l’integrità dei percorsi di navigazione attraverso audit sistematici e bonifica degli errori 404.',
          'Strutturare articoli editoriali con interlinking strategico per guidare il visitatore tra contenuti correlati.',
          'Mantenere aggiornate sedi, coordinate e geolocalizzazione per eventi ad alta affluenza.',
        ],
        designChoices: [
          'Progettazione dell’interlinking basata sull’intento di navigazione del visitatore (scoperta → dettaglio logistico → partecipazione).',
          'Standardizzazione dei campi informativi su Pimcore CMS per garantire coerenza visiva tra schede evento diverse.',
          'Verifica incrociata tra dato digitale (geolocalizzazione/orari) e realtà operativa sul campo.',
        ],
        techArchitecture: {
          stack: ['Pimcore CMS', 'Information Architecture', '404 QA Auditing', 'DAM Workflows', 'Adobe Suite'],
          details:
            'Operatività quotidiana su piattaforma enterprise Pimcore e flussi DAM, affiancata da presidio organizzativo sul territorio durante I Suoni delle Dolomiti, TrentoDoc Festival e Il Festival dello Sport di Trento.',
        },
        results: [
          'Bonifica dei percorsi interrotti e miglioramento della coerenza di navigazione tra le sezioni editoriali.',
          'Aggiornamento puntuale della geolocalizzazione e dei dettagli logistici per tre eventi di rilievo nazionale.',
          'Allineamento diretto tra team editoriale, esigenze operative sul campo e struttura digitale.',
        ],
      },
      en: {
        title: 'Trentino Marketing — CMS Architecture & Event UX',
        outcomeHeadline: 'Information quality and navigation flows on an enterprise platform.',
        tldr: 'Curricular internship (Aug – Oct 2026) focused on Pimcore CMS administration, strategic editorial interlinking, 404 error auditing, and venue geolocation accuracy for flagship regional events.',
        problem:
          'High-traffic tourism and event portals gradually accumulate broken links (404s), disconnected editorial paths, and fragmented logistics data, degrading user trust and on-site usability.',
        objectives: [
          'Restore navigation integrity through systematic 404 auditing and link resolution.',
          'Craft editorial articles with strategic interlinking to guide visitors across related experiences.',
          'Keep venue details and geolocation accurate for high-attendance public events.',
        ],
        designChoices: [
          'Interlinking architecture aligned with visitor intent (discovery → logistics → attendance).',
          'Consistent structured content modeling inside Pimcore CMS across diverse event pages.',
          'Cross-verification between digital coordinates and real-world venue operations.',
        ],
        techArchitecture: {
          stack: ['Pimcore CMS', 'Information Architecture', '404 QA Auditing', 'DAM Workflows', 'Adobe Suite'],
          details:
            'Daily operations inside enterprise Pimcore CMS and DAM pipelines, paired with on-site logistical coordination for I Suoni delle Dolomiti, TrentoDoc Festival, and Il Festival dello Sport di Trento.',
        },
        results: [
          'Resolved broken navigation paths and strengthened editorial content discoverability.',
          'Maintained accurate geolocation and visitor logistics across three major regional events.',
          'Bridged digital content operations with on-site event execution.',
        ],
      },
    },
  },
]
