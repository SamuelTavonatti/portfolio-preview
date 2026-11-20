export const projects = [
  {
    slug: 'voltrep',
    status: 'active',
    featured: true,
    year: '2026',
    category: 'Product Design & Front-End',
    coverImage: {
      src: `${import.meta.env.BASE_URL}assets/voltrep-cover.webp`,
      alt: {
        it: 'Anteprima dell’interfaccia VoltRep — Diario allenamento e schede palestra',
        en: 'VoltRep interface preview — Workout log and gym routine tracker',
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
    content: {
      it: {
        title: 'VoltRep',
        outcomeHeadline: 'Tracciamento dei carichi in palestra senza frizioni né paywall.',
        tldr: 'Applicazione web PWA-ready per la gestione di schede d’allenamento, diario dei carichi, calcolo del tonnellaggio e mappa muscolare anatomica, progettata per ridurre il carico cognitivo durante la sessione in sala pesi.',
        problem:
          'Le app fitness tradizionali risultano spesso sovraccariche di funzioni superflue, flussi macchinosi tra una serie e l’altra o bloccano il tracciamento storico dietro abbonamenti mensili. In palestra, tra un set e il recupero, l’utente ha bisogno di velocità di input e chiarezza immediata.',
        objectives: [
          'Progettare un flusso di registrazione di carichi, ripetizioni e recuperi completabile in pochi tap.',
          'Integrare una libreria esercizi con mappa muscolare anatomica per guidare la creazione delle schede.',
          'Garantire un’esperienza mobile-first fluida (PWA-ready) completamente gratuita e priva di barriere.',
        ],
        designChoices: [
          'Tema scuro nativo (#090a0d) per ridurre l’affaticamento visivo e migliorare la leggibilità in ambienti indoor.',
          'Gerarchia informativa orientata all’azione: scheda attiva, serie corrente e storico del sovraccarico progressivo sempre in primo piano.',
          'Architettura di navigazione piatta per passare dal diario giornaliero alla mappa anatomica senza menu profondi.',
        ],
        techArchitecture: {
          stack: ['UI/UX Design', 'Front-End Web', 'PWA', 'Firebase Hosting', 'Data Management'],
          details:
            'Sviluppata come Web Application progressiva ospitata su Firebase Hosting (voltrep-app.web.app), con gestione strutturata dei dati di allenamento, calcolo automatico del tonnellaggio per sessione e meta-tag SEO/Open Graph completi.',
        },
        results: [
          'Prodotto live e utilizzabile gratuitamente su desktop e smartphone senza installazioni obbligatorie.',
          'Flusso di registrazione serie ottimizzato per l’uso reale durante i tempi di recupero.',
          'Consolidamento pratico delle competenze di Interaction Design, ergonomia cognitiva e sviluppo front-end.',
        ],
      },
      en: {
        title: 'VoltRep',
        outcomeHeadline: 'Frictionless gym load tracking with zero paywalls.',
        tldr: 'PWA-ready web application for custom workout routines, load logging, tonnage calculation, and an anatomical muscle map — designed to minimize cognitive load during training sessions.',
        problem:
          'Traditional fitness apps often suffer from cluttered interfaces, slow input flows between sets, or lock historical tracking behind recurring paywalls. On the gym floor, users need speed and immediate visual clarity.',
        objectives: [
          'Design a load, rep, and rest-timer logging flow operable in minimal taps.',
          'Integrate an exercise library paired with an anatomical muscle map for routine planning.',
          'Deliver a fast, mobile-first PWA-ready experience completely free of charge.',
        ],
        designChoices: [
          'Native dark UI (#090a0d) to reduce eye strain and preserve contrast in indoor gym lighting.',
          'Action-first visual hierarchy keeping the active routine, current set, and progressive overload history upfront.',
          'Flat navigation architecture to switch seamlessly between daily logs and anatomical muscle groups.',
        ],
        techArchitecture: {
          stack: ['UI/UX Design', 'Front-End Web', 'PWA', 'Firebase Hosting', 'Data Management'],
          details:
            'Built as a progressive web application deployed on Firebase Hosting (voltrep-app.web.app), featuring structured workout data management, automatic tonnage calculation, and complete SEO/Open Graph metadata.',
        },
        results: [
          'Live product accessible for free on mobile and desktop with zero mandatory app-store friction.',
          'Set logging flow tailored for real-world usage between rest intervals.',
          'Hands-on validation of interaction design, cognitive ergonomics, and front-end engineering.',
        ],
      },
    },
  },
  {
    slug: 'trentino-marketing-cms',
    status: 'active',
    featured: true,
    year: '2026',
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
  {
    slug: 'esu',
    status: 'active',
    featured: true,
    year: '2025',
    category: 'HCI & Interaction Design',
    coverImage: {
      src: `${import.meta.env.BASE_URL}projects/esu/cover.webp`,
      alt: {
        it: 'Interfaccia e architettura flussi ESU — Progetto Human-Computer Interaction per fitness IoT',
        en: 'ESU interface and user flows architecture — Human-Computer Interaction project for IoT fitness',
      },
    },
    links: {
      figma: 'https://www.figma.com/design/ySnTXOt5Qn8G0F5f0bsBy3/ESU?node-id=0-1&p=f&t=bueqQ8fIMVIzhgCO-0',
    },
    metrics: [
      { value: 'IPM', label: { it: 'Interazione Persona-Macchina', en: 'Human-Computer Interaction' } },
      { value: 'UniTN', label: { it: 'Università di Trento (DiPSCo)', en: 'University of Trento (DiPSCo)' } },
      { value: 'Dual-Mode', label: { it: 'Solo Workout & Battle Mode', en: 'Solo Workout & Battle Mode' } },
      { value: 'Figma', label: { it: 'Prototipo Interattivo', en: 'Interactive Prototype' } },
    ],
    gallery: [
      {
        src: `${import.meta.env.BASE_URL}projects/esu/gallery-hud.webp`,
        caption: {
          it: 'HUD di gara e telemetria live: frequenza cardiaca (BPM), conteggio serie, cadenza ripetizioni e intensità relativa a confronto.',
          en: 'Race HUD & real-time telemetry: heart rate (BPM), set counter, rep cadence, and head-to-head intensity comparison.',
        },
      },
      {
        src: `${import.meta.env.BASE_URL}projects/esu/gallery-anatomy.webp`,
        caption: {
          it: 'Mappa anatomica di attivazione muscolare a colpo d’occhio e grafico di sovraccarico progressivo cumulativo per sessione.',
          en: 'Glanceable anatomical muscle recruitment map and cumulative session overload progression curves.',
        },
      },
      {
        src: `${import.meta.env.BASE_URL}projects/esu/gallery-battle.webp`,
        caption: {
          it: 'Modalità competitiva Battle Mode: ricerca avversario tramite radar, classifica punteggi in tempo reale e inviti amici.',
          en: 'Competitive Battle Mode: opponent radar matchmaking, real-time leaderboard scores, and friend challenges.',
        },
      },
      {
        src: `${import.meta.env.BASE_URL}projects/esu/gallery-pairing.webp`,
        caption: {
          it: 'Flusso di associazione sensori Bluetooth IoT (smart band, kettlebell telemetry) con fallback numerico a 6 cifre.',
          en: 'IoT Bluetooth sensor pairing pipeline (smart bands, kettlebell sensors) with 6-digit numeric code fallback.',
        },
      },
    ],
    content: {
      it: {
        title: 'ESU — Smart Fitness & Battle Interface',
        outcomeHeadline: 'Ergonomia cognitiva, telemetria in tempo reale e gamification competitiva per dispositivi fitness IoT.',
        tldr: 'Progetto accademico per il corso di Interazione Persona-Macchina (UniTN, DiPSCo — L-20) focalizzato sulla progettazione end-to-end di un ecosistema di interfaccia per hardware fitness connesso: accoppiamento sensori Bluetooth, HUD di gara ad alta visibilità durante lo sforzo fisico e modalità Battle Mode per sfide tra atleti in tempo reale.',
        problem:
          'Durante l’allenamento ad alta intensità, la precisione motoria dell’atleta cala drasticamente a causa di sudore, affanno e movimento rapido degli occhi (saccadi). Le tradizionali interfacce fitness, concepite come dense tabelle da smartphone, causano continui errori di tap e sovraccarico cognitivo nel momento in cui l’utente ha bisogno di massima leggibilità e reattività istantanea.',
        objectives: [
          'Progettare touch target sovradimensionati (>= 48px) basati sulla Legge di Fitts per resistere al tremolio motorio in fase di sforzo fisico.',
          'Sviluppare un flusso rapido di associazione per sensori Bluetooth (smart band, kettlebell telemetry, cardiofrequenzimetro) con fallback a codice numerico a 6 cifre.',
          'Creare un HUD di telemetria in tempo reale leggibile a distanza di braccio con feedback cromatico immediato su battiti (BPM), serie, ripetizioni e intensità relativa.',
          'Integrare una modalità competitiva Battle Mode con radar di ricerca avversario e sincronizzazione punteggi punto a punto.',
        ],
        designChoices: [
          'Palette a contrasto elevato: fondo Midnight Obsidian (#0B0D12) accoppiato a un arancione fluorescente dinamico (#FF6600) per garantire la massima discriminazione percettiva anche sotto luci al neon da palestra o all’aperto.',
          'Geometria poligonale ergonomica: bottoni e container sagomati con profili sfaccettati che guidano visivamente la presa del pollice nella thumb-zone.',
          'Mappa muscolare anatomica a colpo d’occhio: feedback visivo immediato sui distretti attivati e grafico del sovraccarico cumulativo per sessione.',
          'Separazione architetturale netta tra modalità Personale (diario, progressi, guida esercizi) e Battle Mode (sfida, inviti amici, radar avversario).',
        ],
        techArchitecture: {
          stack: ['Figma Prototyping', 'Human-Computer Interaction (HCI)', 'Cognitive Ergonomics', 'IoT Telemetry Flows', 'Design System Architecture'],
          details:
            'Progettazione completa del design system, componenti atomici, stati interattivi e prototipazione avanzata dei micro-flussi su Figma per il corso universitario di Interazione Persona-Macchina (UniTN DiPSCo, L-20).',
        },
        results: [
          'Validazione accademica positiva con lode per l’applicazione rigorosa dei principi di ergonomia cognitiva e usabilità d’interfaccia.',
          'Architettura d’interazione completa: oltre 30 schermate ad alta fedeltà che coprono onboarding, pairing hardware, HUD di gara e post-workout analytics.',
          'Prototipo interattivo e ispezionabile direttamente su Figma senza barriere.',
        ],
      },
      en: {
        title: 'ESU — Smart Fitness & Battle Interface',
        outcomeHeadline: 'Cognitive ergonomics, real-time telemetry, and competitive gamification for IoT smart fitness devices.',
        tldr: 'Academic interaction design project for the Human-Computer Interaction course (UniTN, DiPSCo — L-20) focused on designing an end-to-end interface ecosystem for connected fitness hardware: Bluetooth sensor pairing, high-exertion telemetry HUD, and a real-time multiplayer Battle Mode.',
        problem:
          'During high-intensity training, athletic motor accuracy degrades significantly due to sweat, exhaustion, and rapid eye saccades. Conventional fitness interfaces, structured like dense smartphone data tables, trigger frequent mis-taps and severe cognitive overload when athletes need instantaneous visual clarity.',
        objectives: [
          'Design oversized touch zones (>= 48px) governed by Fitts’s Law to tolerate motor tremors and physical exertion.',
          'Architect a frictionless pairing pipeline for Bluetooth sensors (smart band, kettlebell telemetry, heart rate straps) with 6-digit numeric fallback.',
          'Deliver an arm’s-length readable telemetry HUD with instant color-coded feedback on BPM, sets, rep cadence, and relative intensity.',
          'Introduce a competitive Battle Mode featuring peer matchmaking radar and synchronized telemetry challenges.',
        ],
        designChoices: [
          'High-contrast visual system: Midnight Obsidian (#0B0D12) paired with high-energy Electric Orange (#FF6600) ensuring peak perceptual discrimination under harsh gym lighting.',
          'Ergonomic polygonal geometry: tactile faceted containers that direct thumb placement toward primary action zones in the thumb-zone.',
          'Instant anatomical body map: glanceable visual feedback on recruited muscle groups and cumulative overload curves.',
          'Strict architectural partition between Personal Training (logs, technique guides, volume charts) and Battle Mode (radar matchmaking, friend challenges).',
        ],
        techArchitecture: {
          stack: ['Figma Prototyping', 'Human-Computer Interaction (HCI)', 'Cognitive Ergonomics', 'IoT Telemetry Flows', 'Design System Architecture'],
          details:
            'End-to-end design system creation, atomic components, interactive states, and micro-flow prototyping inside Figma for the university HCI course at UniTN (DiPSCo, L-20).',
        },
        results: [
          'Academic distinction for rigorous application of cognitive ergonomics and human-centered design principles.',
          'Comprehensive interface architecture: 30+ high-fidelity frames spanning onboarding, hardware pairing, race HUD, and post-workout analytics.',
          'Fully inspectable interactive prototype accessible directly in Figma.',
        ],
      },
    },
  },
]
