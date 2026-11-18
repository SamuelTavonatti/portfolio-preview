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
      { value: 'PWA', label: { it: 'Mobile-first', en: 'Mobile-first' } },
      { value: '100%', label: { it: 'Zero paywall', en: 'Zero paywall' } },
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
]
