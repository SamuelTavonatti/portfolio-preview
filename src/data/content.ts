import type { CaseStudy, ExperienceItem, ShowreelBeat } from '../types/portfolio';
import voltrepShowcaseImg from '../assets/images/voltrep_showcase_1795212554319.jpg';
import esuHciShowcaseImg from '../assets/images/esu_hci_showcase_1795212554315.jpg';
import trentinoEditorialImg from '../assets/images/trentino_editorial_showcase_1795212554848.jpg';
import passionGymSportsImg from '../assets/images/passion_gym_sports_1795215016737.jpg';
import voltrepUiWorkoutImg from '../assets/images/voltrep_ui_workout_1795215371951.jpg';
import voltrepUiProgressImg from '../assets/images/voltrep_ui_progress_1795215372601.jpg';
import esuHardwareEcosystemImg from '../assets/images/esu_hardware_ecosystem_1795215372118.jpg';
import esuUiWorkoutImg from '../assets/images/esu_ui_workout_1795215372407.jpg';
import trentinoEventsEditorialImg from '../assets/images/trentino_events_editorial_1795215370471.jpg';
import trentodocFestivalImg from '../assets/images/trentodoc_festival_trento_1795215767625.jpg';
import festivalSportImg from '../assets/images/festival_dello_sport_trento_1795215768244.jpg';

export const CONTACT_INFO = {
  email: 'samuel.tavonatti05@gmail.com',
  linkedin: 'https://www.linkedin.com/in/samuel-tavonatti/',
  github: 'https://github.com/samueltavonatti',
  instagram: 'https://www.instagram.com/samuel.tavonatti/',
  location: {
    it: 'Trento, Italia',
    en: 'Trento, Italy',
  },
} as const;

const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '') + '/';

export const BRAND_ASSETS = {
  trentinoColorLogo: `${baseUrl}assets/aistudio/image_1ffbca05.png`,
  trentinoMonoLogo: `${baseUrl}assets/aistudio/image_e034a02f.png`,
} as const;

export const STUDIO_ASSETS = {
  voltrep: voltrepShowcaseImg,
  esuHci: esuHciShowcaseImg,
  trentino: trentinoEditorialImg,
  craft: passionGymSportsImg,
  voltrepWorkout: voltrepUiWorkoutImg,
  voltrepProgress: voltrepUiProgressImg,
  esuHardware: esuHardwareEcosystemImg,
  esuWorkout: esuUiWorkoutImg,
  trentinoSuoni: trentinoEventsEditorialImg,
  trentinoTrentodoc: trentodocFestivalImg,
  trentinoSport: festivalSportImg,
} as const;

export const UI_COPY = {
  meta: {
    title: {
      it: 'Samuel Tavonatti — UX/UI Designer',
      en: 'Samuel Tavonatti — UX/UI Designer',
    },
    description: {
      it: 'Portfolio personale di Samuel Tavonatti, UX/UI Designer con competenze front-end e motion design. Progetti: VoltRep, ESU HCI, Trentino Marketing.',
      en: 'Personal portfolio of Samuel Tavonatti, UX/UI Designer with front-end engineering and motion craft fluency. Projects: VoltRep, ESU HCI, Trentino Marketing.',
    },
  },
  skipToContent: {
    it: 'Vai al contenuto principale',
    en: 'Skip to main content',
  },
  nav: {
    chapters: { it: 'Capitoli', en: 'Chapters' },
    projects: { it: 'Progetti', en: 'Projects' },
    craft: { it: 'Approccio', en: 'Craft' },
    experience: { it: 'Percorso', en: 'Experience' },
    contact: { it: 'Contatti', en: 'Contact' },
    cta: { it: 'Scrivimi', en: 'Get in touch' },
    openMenu: { it: 'Apri menu di navigazione', en: 'Open navigation menu' },
    closeMenu: { it: 'Chiudi menu di navigazione', en: 'Close navigation menu' },
  },
  hero: {
    roleLine: {
      it: 'UX/UI Designer · Front-end & Motion · Trento',
      en: 'UX/UI Designer · Front-end & Motion · Trento',
    },
    headline: {
      it: 'Interfacce calme, leggibili e costruite per ridurre l’attrito.',
      en: 'Calm, legible interfaces engineered to reduce mental friction.',
    },
    lead: {
      it: 'Progetto sistemi visivi, flussi d’interazione e componenti web in cui gerarchia, ritmo spaziale e feedback guadagnano ogni pixel — senza rumore superfluo.',
      en: 'I design visual systems, interaction flows, and web components where hierarchy, spatial pacing, and tactile feedback earn every pixel — without visual noise.',
    },
    primaryCta: {
      it: 'Esplora i progetti',
      en: 'Explore projects',
    },
    secondaryCta: {
      it: 'Contattami',
      en: 'Contact me',
    },
    pillars: [
      {
        label: { it: 'Formazione', en: 'Education' },
        value: {
          it: 'DiPSCo · Università di Trento (L-20)',
          en: 'DiPSCo · University of Trento (L-20)',
        },
      },
      {
        label: { it: 'Esperienza sul campo', en: 'Field Experience' },
        value: {
          it: 'Trentino Marketing s.r.l. · Area Content',
          en: 'Trentino Marketing s.r.l. · Content Area',
        },
      },
      {
        label: { it: 'Prodotto indipendente', en: 'Independent Product' },
        value: {
          it: 'VoltRep · 5 anni di pratica in palestra',
          en: 'VoltRep · 5 years of gym training',
        },
      },
      {
        label: { it: 'Disciplina tecnica', en: 'Technical Craft' },
        value: {
          it: 'UX/UI, HCI, Front-end & Motion Design',
          en: 'UX/UI, HCI, Front-end & Motion Design',
        },
      },
    ],
  },
  showreel: {
    ariaLabel: {
      it: 'Showreel interattivo di approccio progettuale',
      en: 'Interactive design approach showreel',
    },
    play: { it: 'Riproduci sequenza', en: 'Play sequence' },
    pause: { it: 'Metti in pausa sequenza', en: 'Pause sequence' },
    replay: { it: 'Ricomincia sequenza', en: 'Replay sequence' },
    pausedBadge: { it: 'In pausa', en: 'Paused' },
    reducedMotionNote: {
      it: 'Movimento ridotto attivo · seleziona uno step',
      en: 'Reduced motion active · select any step',
    },
    beat01: {
      eyebrow: { it: '01 · Principio guida', en: '01 · Guiding Principle' },
      title: {
        it: 'Ogni elemento riduce il carico cognitivo.',
        en: 'Every element reduces cognitive load.',
      },
      note: {
        it: 'Spazio negativo generoso e gerarchia immediata.',
        en: 'Generous negative space and immediate hierarchy.',
      },
    },
    beat02: {
      eyebrow: { it: '02 · Struttura cognitiva', en: '02 · Cognitive Structure' },
      title: {
        it: 'Architettura coerente, contrasto verificato.',
        en: 'Coherent architecture, verified contrast.',
      },
      tokens: [
        { k: { it: 'Griglia', en: 'Grid' }, v: '8 px' },
        { k: { it: 'Contrasto', en: 'Contrast' }, v: 'AA 6.0:1' },
        { k: { it: 'Target touch', en: 'Touch target' }, v: '44 px+' },
      ],
    },
    beat03: {
      eyebrow: { it: '03 · Prodotto e interazione', en: '03 · Product & Interaction' },
      exercise: { it: 'Panca Piana', en: 'Bench Press' },
      setLabel: { it: 'Serie 3 di 4', en: 'Set 3 of 4' },
      loadLabel: { it: 'Carico', en: 'Load' },
      repsLabel: { it: 'Ripetizioni', en: 'Reps' },
      restLabel: { it: 'Recupero', en: 'Rest timer' },
      logged: { it: 'Serie registrata · zero attrito', en: 'Set logged · zero friction' },
    },
    beat04: {
      eyebrow: { it: '04 · Sintesi silenziosa', en: '04 · Calm Resolution' },
      title: {
        it: 'Design di prodotto con rigore front-end.',
        en: 'Product design with front-end rigor.',
      },
      caption: {
        it: 'Chiarezza visiva, micro-interazioni misurate e accessibilità reale.',
        en: 'Visual clarity, measured micro-interactions, and real accessibility.',
      },
    },
  },
  projects: {
    sectionNumber: '01.',
    heading: { it: 'Progetti selezionati', en: 'Selected work' },
    subtitle: {
      it: 'Tre casi studio reali tra prodotto digitale indipendente, ricerca HCI universitaria e architettura editoriale su CMS.',
      en: 'Three grounded case studies spanning independent web product design, university HCI research, and enterprise CMS content architecture.',
    },
    filters: {
      all: { it: 'Tutti', en: 'All' },
      product: { it: 'Prodotto', en: 'Product' },
      hci: { it: 'HCI', en: 'HCI' },
      content: { it: 'Contenuti & CMS', en: 'Content & CMS' },
    },
    readCaseStudy: { it: 'Apri caso studio', en: 'Open case study' },
    visitLive: { it: 'Apri app', en: 'Visit live app' },
    emptyTitle: {
      it: 'Nessun progetto in questa categoria.',
      en: 'No projects match this filter.',
    },
    emptyReset: { it: 'Mostra tutti i progetti', en: 'Show all projects' },
    sheet: {
      close: { it: 'Chiudi caso studio', en: 'Close case study' },
      role: { it: 'Ruolo', en: 'Role' },
      context: { it: 'Contesto', en: 'Context' },
      year: { it: 'Anno', en: 'Year' },
      deliverables: { it: 'Ambiti chiave', en: 'Key focus areas' },
      galleryLabel: {
        it: 'Galleria schermate e dettagli visivi',
        en: 'Project Screens & Visual Gallery',
      },
      galleryHint: {
        it: 'Clicca su qualsiasi immagine per ingrandirla',
        en: 'Click any image to inspect full-size',
      },
      brandIdentityLabel: {
        it: 'Identità Visiva Ufficiale · Marchio Territoriale',
        en: 'Official Visual Identity · Territorial Brand',
      },
      takeawayLabel: { it: 'Sintesi progettuale', en: 'Design takeaway' },
      previous: { it: 'Progetto precedente', en: 'Previous project' },
      next: { it: 'Progetto successivo', en: 'Next project' },
      notFound: {
        it: 'Caso studio non trovato.',
        en: 'Case study not found.',
      },
      backToList: { it: 'Torna ai progetti', en: 'Back to projects' },
    },
  },
  craft: {
    sectionNumber: '02.',
    heading: {
      it: 'Passione per lo sport, la palestra e la disciplina progettuale',
      en: 'Passion for sport, bodybuilding & disciplined craft',
    },
    intro: {
      it: 'Lo sport fa parte della mia quotidianità in ogni sua forma — con una dedizione particolare al fitness, al bodybuilding e a cinque anni di allenamento costante in palestra che hanno plasmato direttamente il modo in cui è nato VoltRep.',
      en: 'Sport is part of my everyday life in every form — with a deep dedication to fitness, bodybuilding, and five years of consistent gym training across different facilities that directly shaped how VoltRep was conceived.',
    },
    body1: {
      it: 'Attraversare palestre diverse, allenarsi seriamente tra carichi progressivi e fatica reale e confrontare decine di app di workout mette subito a nudo ogni difetto di interfaccia: schermate sovraffollate, flussi rigidi, micro-testi illeggibili o paywall nel mezzo della sessione spezzano la concentrazione.',
      en: 'Training across different gyms, chasing progressive overload under real physical fatigue, and comparing countless workout apps immediately exposes every UX flaw: cluttered layouts, rigid workflows, illegible micro-labels, or paywalls mid-session break focus.',
    },
    body2: {
      it: 'La stessa disciplina atletica — costanza, tecnica pulita e attenzione ai dettagli — guida ogni mia scelta di design: conoscere a fondo il contesto d’uso reale permette di eliminare il superfluo e progettare interfacce calme, reattive e rispettose dell’attenzione.',
      en: 'That same athletic discipline — consistency, clean execution, and respect for detail — guides my design craft: deep familiarity with the real context reveals what to strip away so interfaces stay calm, responsive, and focused.',
    },
    principles: [
      {
        title: { it: 'Gerarchia a basso sforzo', en: 'Low-effort hierarchy' },
        desc: {
          it: 'Un solo punto focale per schermata, spaziatura ariosa e tipografia leggibile anche in condizioni non ideali.',
          en: 'One clear focal point per frame, generous breathing room, and legible typography even under non-ideal conditions.',
        },
      },
      {
        title: { it: 'Movimento con uno scopo', en: 'Purposeful motion' },
        desc: {
          it: 'Transizioni brevi e curve naturali che chiariscono continuità e stato, rispettando sempre prefers-reduced-motion.',
          en: 'Crisp, naturally eased transitions that clarify spatial continuity and feedback while honoring prefers-reduced-motion.',
        },
      },
      {
        title: { it: 'Ponti tra design e codice', en: 'Design-to-code fidelity' },
        desc: {
          it: 'Prototipare e costruire direttamente nel browser garantisce stati reali, accessibilità da tastiera e coerenza responsiva.',
          en: 'Prototyping and building directly in the browser ensures authentic interaction states, keyboard accessibility, and responsive discipline.',
        },
      },
    ],
  },
  experience: {
    sectionNumber: '03.',
    heading: { it: 'Formazione ed esperienza', en: 'Education & experience' },
    subtitle: {
      it: 'Un percorso che unisce psicologia cognitiva, interazione persona-macchina, operatività editoriale su CMS e contatto diretto con le persone.',
      en: 'A path bridging cognitive psychology, human-computer interaction, real CMS editorial operations, and hands-on field work.',
    },
  },
  contact: {
    sectionNumber: { it: '05 / CONTATTI', en: '05 / CONTACT' },
    heading: { it: 'Parliamone', en: 'Let’s talk' },
    subtitle: {
      it: 'Disponibile per collaborazioni, opportunità junior UX/UI, product design e sviluppo front-end.',
      en: 'Open to collaborations, UX/UI roles, product design opportunities, and front-end craft.',
    },
    directEmailLabel: { it: 'Email diretta', en: 'Direct email' },
    copyEmail: { it: 'Copia', en: 'Copy' },
    copiedEmail: { it: 'Copiata', en: 'Copied' },
    socialLabel: { it: 'Profili esterni', en: 'External profiles' },
    privacyNote: {
      it: 'Nessun tracker di terze parti: il modulo prepara il messaggio localmente nel tuo browser senza memorizzarlo su server esterni.',
      en: 'Zero third-party trackers: this form prepares your message locally in your browser without sending data to external analytics or third-party processors.',
    },
    form: {
      nameLabel: { it: 'Nome e cognome', en: 'Full name' },
      namePlaceholder: { it: 'Es. Marco Rossi', en: 'e.g. Alex Morgan' },
      emailLabel: { it: 'Indirizzo email', en: 'Email address' },
      emailPlaceholder: { it: 'nome@azienda.it', en: 'name@company.com' },
      subjectLabel: { it: 'Oggetto', en: 'Subject' },
      subjectPlaceholder: {
        it: 'Collaborazione UX/UI o richiesta informazioni',
        en: 'UX/UI collaboration or inquiry',
      },
      messageLabel: { it: 'Messaggio', en: 'Message' },
      messagePlaceholder: {
        it: 'Raccontami brevemente il contesto, gli obiettivi o il ruolo.',
        en: 'Share a brief overview of the context, goals, or role.',
      },
      privacyPrefix: {
        it: 'Ho letto e accetto la ',
        en: 'I have read and accept the ',
      },
      privacyLink: { it: 'Privacy Policy', en: 'Privacy Policy' },
      privacySuffix: {
        it: ' per la gestione della mia richiesta di contatto.',
        en: ' for handling my contact inquiry.',
      },
      submit: { it: 'Invia Messaggio →', en: 'Send Message →' },
      submitting: { it: 'Verifica in corso…', en: 'Validating…' },
      successTitle: {
        it: 'Messaggio pronto per l’invio',
        en: 'Message ready to send',
      },
      successBody: {
        it: 'Tutti i campi sono validi e sanitizzati. Puoi aprire subito il tuo client email precompilato oppure copiare il testo completo.',
        en: 'All fields are validated and sanitized. Open your pre-addressed email client directly or copy the formatted message below.',
      },
      openMailClient: { it: 'Apri client email', en: 'Open email client' },
      copyFormatted: { it: 'Copia messaggio', en: 'Copy message' },
      copiedFormatted: { it: 'Messaggio copiato', en: 'Message copied' },
      resetForm: { it: 'Scrivi un altro messaggio', en: 'Write another message' },
      errors: {
        nameRequired: { it: 'Inserisci il tuo nome.', en: 'Please enter your name.' },
        nameTooLong: {
          it: 'Il nome può contenere al massimo 80 caratteri.',
          en: 'Name must be 80 characters or fewer.',
        },
        emailRequired: {
          it: 'Inserisci un indirizzo email.',
          en: 'Please enter your email address.',
        },
        emailInvalid: {
          it: 'Inserisci un indirizzo email valido.',
          en: 'Please enter a valid email address.',
        },
        emailTooLong: {
          it: 'L’email può contenere al massimo 120 caratteri.',
          en: 'Email must be 120 characters or fewer.',
        },
        subjectRequired: {
          it: 'Inserisci un oggetto breve.',
          en: 'Please provide a brief subject.',
        },
        subjectTooLong: {
          it: 'L’oggetto può contenere al massimo 120 caratteri.',
          en: 'Subject must be 120 characters or fewer.',
        },
        messageRequired: {
          it: 'Scrivi un breve messaggio (almeno 12 caratteri).',
          en: 'Please write a short message (at least 12 characters).',
        },
        messageTooLong: {
          it: 'Il messaggio può contenere al massimo 1500 caratteri.',
          en: 'Message must be 1500 characters or fewer.',
        },
        privacyRequired: {
          it: 'Conferma di aver letto la Privacy Policy prima di continuare.',
          en: 'Please confirm that you have read the Privacy Policy before continuing.',
        },
      },
    },
  },
  footer: {
    rights: {
      it: 'Samuel Tavonatti. Tutti i diritti riservati.',
      en: 'Samuel Tavonatti. All rights reserved.',
    },
    privacy: { it: 'Privacy Policy', en: 'Privacy Policy' },
    cookies: { it: 'Cookie Policy', en: 'Cookie Policy' },
    terms: { it: 'Termini d’Uso', en: 'Terms of Use' },
  },
  legal: {
    modalTitle: { it: 'Informative legali e privacy', en: 'Legal & privacy notices' },
    close: { it: 'Chiudi finestra legale', en: 'Close legal dialog' },
    tabs: {
      privacy: { it: 'Privacy Policy', en: 'Privacy Policy' },
      cookies: { it: 'Cookie Policy', en: 'Cookie Policy' },
      terms: { it: 'Termini d’Uso', en: 'Terms of Use' },
    },
    updated: {
      it: 'Ultimo aggiornamento: Novembre 2026',
      en: 'Last updated: November 2026',
    },
    content: {
      privacy: {
        it: [
          {
            heading: 'Titolare del trattamento',
            body: 'Il presente sito portfolio personale è gestito da Samuel Tavonatti (Trento, Italia). Per qualsiasi richiesta relativa alla protezione dei dati personali puoi scrivere a samuel.tavonatti05@gmail.com.',
          },
          {
            heading: 'Assenza di tracciamento e raccolta automatica',
            body: 'Questo sito non utilizza script di tracciamento di terze parti, pixel pubblicitari, sistemi di profilazione o servizi di analytics comportamentali. La navigazione non comporta la trasmissione di dati personali a piattaforme terze.',
          },
          {
            heading: 'Modulo di contatto e comunicazioni email',
            body: 'Il modulo di contatto esegue validazione e formattazione esclusivamente in locale nel browser dell’utente e prepara un collegamento mailto: verso il client email scelto dall’utente. I dati inviati volontariamente via email vengono trattati unicamente per rispondere alla richiesta ricevuta (art. 6, par. 1, lett. b e a del GDPR) e non vengono ceduti a terzi.',
          },
          {
            heading: 'Diritti dell’interessato (GDPR)',
            body: 'Ai sensi del Regolamento (UE) 2016/679 (GDPR), puoi richiedere in qualsiasi momento l’accesso, la rettifica, la cancellazione o la limitazione del trattamento dei dati eventualmente inviati via email, scrivendo a samuel.tavonatti05@gmail.com.',
          },
        ],
        en: [
          {
            heading: 'Data Controller',
            body: 'This personal portfolio website is operated by Samuel Tavonatti (Trento, Italy). For any inquiry regarding personal data protection, please write to samuel.tavonatti05@gmail.com.',
          },
          {
            heading: 'Zero Tracking & Automated Profiling',
            body: 'This website runs with zero third-party tracking scripts, zero advertising pixels, zero behavioral analytics, and zero cross-site profiling. Browsing this portfolio does not transmit personal data to third-party platforms.',
          },
          {
            heading: 'Contact Form & Email Communications',
            body: 'The contact form validates and formats your inquiry strictly locally inside your browser and prepares a mailto: handoff for your preferred email client. Any personal data you voluntarily send via email is used solely to reply to your inquiry (GDPR Art. 6(1)(a)-(b)) and is never shared with third parties.',
          },
          {
            heading: 'Your GDPR Rights',
            body: 'Under Regulation (EU) 2016/679 (GDPR), you may request access, rectification, erasure, or restriction of any personal data you have sent by email at any time by contacting samuel.tavonatti05@gmail.com.',
          },
        ],
      },
      cookies: {
        it: [
          {
            heading: 'Nessun cookie di tracciamento o profilazione',
            body: 'Questo sito non installa alcun cookie di profilazione, cookie pubblicitario o cookie analitico di terze parti. Non viene pertanto richiesto alcun banner di consenso per cookie non tecnici.',
          },
          {
            heading: 'Preferenza locale della lingua (localStorage)',
            body: 'Per ricordare la lingua selezionata (Italiano o Inglese), il sito salva esclusivamente una chiave tecnica nel localStorage del browser denominata "st_lang" (valore "it" oppure "en"). Tale informazione resta interamente sul tuo dispositivo, non ha finalità di tracciamento e può essere rimossa in qualsiasi momento dalle impostazioni del browser.',
          },
          {
            heading: 'Collegamenti a risorse esterne',
            body: 'Il portfolio include collegamenti esterni (ad esempio VoltRep, LinkedIn, GitHub). Quando scegli di visitare tali siti esterni, si applicano le rispettive informative privacy e cookie.',
          },
        ],
        en: [
          {
            heading: 'Zero Advertising or Analytics Cookies',
            body: 'This website sets zero tracking cookies, zero advertising cookies, and zero third-party analytics cookies. Because no non-essential cookies are placed, no intrusive cookie-tracking consent banner is required.',
          },
          {
            heading: 'Local Language Preference (localStorage)',
            body: 'To remember your selected language (Italian or English), the site stores a single strictly functional entry in your browser’s localStorage under the key "st_lang" ("it" or "en"). This preference stays exclusively on your device, cannot track you across websites, and can be cleared anytime in browser settings.',
          },
          {
            heading: 'External Links',
            body: 'This portfolio links to external destinations (such as VoltRep, LinkedIn, and GitHub). Once you navigate to an external website, that destination’s own privacy and cookie policies apply.',
          },
        ],
      },
      terms: {
        it: [
          {
            heading: 'Scopo del sito',
            body: 'Questo sito ha finalità esclusivamente informative e di presentazione professionale del lavoro, della formazione e dei progetti di Samuel Tavonatti.',
          },
          {
            heading: 'Proprietà intellettuale',
            body: 'I testi, la struttura visiva, i casi studio originali e gli elementi progettuali realizzati dall’autore sono protetti dalle norme sul diritto d’autore. I marchi, nomi di eventi ed enti citati (come Università di Trento, Trentino Marketing s.r.l., I Suoni delle Dolomiti, TrentoDoc Festival, Festival dello Sport) appartengono ai rispettivi titolari e sono citati a puro scopo descrittivo delle esperienze reali svolte.',
          },
          {
            heading: 'Collegamenti esterni e responsabilità',
            body: 'I link esterni vengono aperti in sicurezza (rel="noopener noreferrer"). L’autore non controlla né assume responsabilità per contenuti o disponibilità di siti web di terze parti.',
          },
        ],
        en: [
          {
            heading: 'Purpose of This Website',
            body: 'This website serves strictly as a personal professional portfolio presenting the design work, academic background, and real projects of Samuel Tavonatti.',
          },
          {
            heading: 'Intellectual Property & Trademarks',
            body: 'Original copy, visual architecture, and case study presentations authored for this site remain the intellectual property of Samuel Tavonatti. Mentioned institutions, organizations, and events (including University of Trento, Trentino Marketing s.r.l., I Suoni delle Dolomiti, TrentoDoc Festival, and Festival dello Sport) belong to their respective owners and are referenced strictly to document factual experience.',
          },
          {
            heading: 'External Links & Liability',
            body: 'External links open safely with rel="noopener noreferrer". The author has no control over and assumes no responsibility for the content or availability of third-party websites.',
          },
        ],
      },
    },
  },
} as const;

export const SHOWREEL_BEATS: ShowreelBeat[] = [
  {
    id: 0,
    code: '01',
    label: { it: 'Samuel Tavonatti', en: 'Samuel Tavonatti' },
    headline: {
      it: 'Samuel Tavonatti',
      en: 'Samuel Tavonatti',
    },
    caption: {
      it: 'Interfacce calme, ricerca e sviluppo front-end da Trento.',
      en: 'Calm interfaces, research, and front-end craft from Trento.',
    },
    durationMs: 6000,
  },
  {
    id: 1,
    code: '02',
    label: { it: 'UX UI Designer', en: 'UX UI Designer' },
    headline: {
      it: 'UX UI Designer',
      en: 'UX UI Designer',
    },
    caption: {
      it: 'Sistemi visivi, gerarchia leggibile e micro-interazioni misurate.',
      en: 'Visual systems, clear hierarchy, and measured micro-interactions.',
    },
    durationMs: 6000,
  },
  {
    id: 2,
    code: '03',
    label: { it: 'UX Research', en: 'UX Research' },
    headline: {
      it: 'UX Research',
      en: 'UX Research',
    },
    caption: {
      it: 'Ergonomia cognitiva, flussi lineari e validazione sul campo.',
      en: 'Cognitive ergonomics, linear flows, and real-world validation.',
    },
    durationMs: 6000,
  },
  {
    id: 3,
    code: '04',
    label: { it: 'AI Creative', en: 'AI Creative' },
    headline: {
      it: 'AI Creative',
      en: 'AI Creative',
    },
    caption: {
      it: 'Direzione visiva generativa e prototipazione interattiva.',
      en: 'Generative visual direction and interactive prototyping.',
    },
    durationMs: 6000,
  },
  {
    id: 4,
    code: '05',
    label: { it: 'Web Developer', en: 'Web Developer' },
    headline: {
      it: 'Web Developer',
      en: 'Web Developer',
    },
    caption: {
      it: 'Architettura React e TypeScript accessibile e fluida a 60 FPS.',
      en: 'Accessible, fluid React and TypeScript architecture at 60 FPS.',
    },
    durationMs: 6000,
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'voltrep',
    slug: 'voltrep',
    category: 'product',
    categoryLabel: { it: 'Prodotto Web', en: 'Web Product' },
    year: '2025 – 2026',
    role: {
      it: 'Ideazione, UX/UI Design & Sviluppo Front-end',
      en: 'Concept, UX/UI Design & Front-end Engineering',
    },
    organization: {
      it: 'Progetto indipendente',
      en: 'Independent Product',
    },
    liveUrl: 'https://voltrep-app.web.app',
    liveLabel: { it: 'Visita VoltRep', en: 'Open VoltRep' },
    image: STUDIO_ASSETS.voltrep,
    brandMark: 'voltrep',
    imageAlt: {
      it: 'Marchio VoltRep su sfondo minimalista in acciaio scuro e ardesia grafite.',
      en: 'VoltRep brand mark over dark machined steel and architectural graphite stone.',
    },
    gallery: [
      {
        id: 'voltrep-workout-screen',
        src: STUDIO_ASSETS.voltrepWorkout,
        aspect: 'landscape',
        alt: {
          it: 'Interfaccia mobile VoltRep per la registrazione rapida delle serie in palestra (Panca Piana, carico, ripetizioni e pulsante Log Set).',
          en: 'VoltRep mobile interface for rapid mid-workout set logging (Bench Press load, reps, rest timer, and Log Set action).',
        },
        caption: {
          it: 'Flusso attivo in sessione — gerarchia pulita per registrare serie, carico e recupero con un solo tocco.',
          en: 'Active workout flow — clean hierarchy built for single-tap set, load, and rest logging.',
        },
      },
      {
        id: 'voltrep-progress-screen',
        src: STUDIO_ASSETS.voltrepProgress,
        aspect: 'landscape',
        alt: {
          it: 'Schermate di analisi della progressione di forza di VoltRep su smartphone e tablet con grafici in turchese e ambra su fondo navy scuro.',
          en: 'VoltRep strength progression analytics across mobile and tablet with turquoise and amber charts on dark navy surfaces.',
        },
        caption: {
          it: 'Progressione di forza — grafici chiari di volume e carichi nel tempo su smartphone e tablet.',
          en: 'Strength progression — scannable volume and load trends across mobile and tablet views.',
        },
      },
    ],
    fallbackLabel: 'VoltRep · Web App',
    title: {
      it: 'VoltRep',
      en: 'VoltRep',
    },
    subtitle: {
      it: 'Web app gratuita per il tracciamento dell’allenamento e della progressione di forza, progettata attorno a sessioni reali in palestra.',
      en: 'Free workout and strength-progression web application built around real training sessions in the gym.',
    },
    summary: {
      it: 'Nata da cinque anni di allenamento costante in diverse palestre: registra carichi, ripetizioni e recuperi senza sovraccarico visivo né paywall tra una serie e l’altra.',
      en: 'Born from five years of consistent strength training across different gyms: fast load, rep, and rest logging without visual clutter or mid-session paywalls.',
    },
    deliverables: {
      it: [
        'Ricerca sul campo e analisi competitiva',
        'Architettura informativa e flussi in sessione',
        'Design system leggibile ad alto contrasto',
        'Implementazione web responsiva e gratuita',
      ],
      en: [
        'Firsthand domain research & competitive audit',
        'Information architecture & mid-session flows',
        'High-contrast scannable design system',
        'Responsive, free web implementation',
      ],
    },
    sections: [
      {
        title: { it: 'Origine e contesto reale', en: 'Origin & Real-World Context' },
        body: {
          it: 'VoltRep non nasce da un esercizio teorico, ma da cinque anni di allenamento costante con i pesi, allenandomi in palestre diverse e testando numerose app di workout. Molte soluzioni esistenti finiscono per ostacolare proprio il momento chiave della sessione: gerarchie affollate, percorsi rigidi per modificare un esercizio al volo o paywall che interrompono il tracciamento della progressione.',
          en: 'VoltRep grew directly out of five years of consistent strength training, visiting different gyms, and testing numerous workout apps firsthand. Many existing tools get in the way during the exact moment that matters most: crowded screens, rigid templates when equipment is busy, or paywalls interrupting progression tracking.',
        },
      },
      {
        title: { it: 'Obiettivo di progetto', en: 'Design Objective' },
        body: {
          it: 'Progettare un’applicazione web gratuita, rapida e mentalmente leggera che si adatti al ritmo reale dell’allenamento, riducendo al minimo i tocchi necessari tra una serie e la successiva.',
          en: 'Design a free, fast, mentally light web application that matches the cadence of a real workout, minimizing taps and visual scanning between sets.',
        },
        points: {
          it: [
            'Inserimento immediato di carico, ripetizioni e tempo di recupero con figure tabellari stabili.',
            'Gerarchia scansionabile a colpo d’occhio anche sotto fatica fisica.',
            'Flessibilità nella gestione degli esercizi quando una postazione in palestra è occupata.',
            'Accesso completamente gratuito, senza finestre promozionali o blocchi durante la sessione.',
          ],
          en: [
            'Rapid entry of load, reps, and rest intervals with steady tabular numerals.',
            'At-a-glance scannable hierarchy legible even under physical fatigue.',
            'Flexible exercise adjustments when a rack or bench is occupied.',
            'Completely free access with zero promotional interruptions or mid-workout locks.',
          ],
        },
      },
      {
        title: { it: 'Decisioni di interfaccia ed esecuzione', en: 'Interface Decisions & Execution' },
        body: {
          it: 'Ogni schermata limita le azioni concorrenti a favore del dato primario: la serie corrente e il riferimento alla progressione precedente. I controlli interattivi adottano target confortevoli per l’uso con una mano, contrasto netto e feedback immediato per confermare la registrazione senza distrazioni.',
          en: 'Each screen strips away competing chrome to prioritize the active set and previous progression reference. Controls use generous one-handed touch targets, crisp contrast, and immediate confirmation feedback so logging never pulls attention away from training.',
        },
      },
    ],
    takeaway: {
      it: 'La familiarità autentica con il dominio permette di distinguere ciò che sembra utile sulla carta da ciò che funziona davvero durante l’uso reale.',
      en: 'Authentic domain familiarity separates features that look impressive on paper from interactions that genuinely hold up during real use.',
    },
  },
  {
    id: 'esu-hci',
    slug: 'esu-hci',
    category: 'hci',
    categoryLabel: { it: 'Ricerca & HCI', en: 'Research & HCI' },
    year: '2025',
    role: {
      it: 'UX/UI Design, Architettura Flussi & Stati di Interazione',
      en: 'UX/UI Design, User Flows & Interaction States',
    },
    organization: {
      it: 'Università di Trento · DiPSCo · Interazione Persona-Macchina',
      en: 'University of Trento · DiPSCo · Human-Computer Interaction',
    },
    image: STUDIO_ASSETS.esuHci,
    brandMark: 'esu',
    imageAlt: {
      it: 'Logo ESU Sensor Exercise You su sfondo architettonico grafite a moduli in vetro satinato.',
      en: 'ESU Sensor Exercise You emblem over dark graphite frosted glass architecture.',
    },
    gallery: [
      {
        id: 'esu-hardware',
        src: STUDIO_ASSETS.esuHardware,
        aspect: 'landscape',
        alt: {
          it: 'Ecosistema hardware smart fitness ESU-Line: sensore ESU-Box, fascia indossabile ESU-Move e tappetino sensorizzato ESU-Rug su superficie scura.',
          en: 'ESU-Line smart fitness hardware ecosystem: ESU-Box sensor hub, ESU-Move wearable strap, and ESU-Rug pressure mat on dark matte stone.',
        },
        caption: {
          it: 'Ecosistema hardware ESU-Line — integrazione fisica tra ESU-Box, fascia ESU-Move e tappetino ESU-Rug.',
          en: 'ESU-Line hardware ecosystem — physical pairing across ESU-Box, ESU-Move strap, and ESU-Rug sensor mat.',
        },
      },
      {
        id: 'esu-mobile-ui',
        src: STUDIO_ASSETS.esuWorkout,
        aspect: 'landscape',
        alt: {
          it: 'Interfaccia mobile ESU in modalità scura con anelli di attività, grafici settimanali e accenti arancio-ambra ad alta leggibilità.',
          en: 'ESU dark-mode mobile app interface featuring circular activity rings and weekly telemetry bars in warm orange and amber.',
        },
        caption: {
          it: 'Interfaccia mobile ESU — telemetria immediata, anelli di progresso e stati di sessione ad alto contrasto.',
          en: 'ESU mobile interface — scannable telemetry rings, weekly activity bars, and crisp dark-mode states.',
        },
      },
    ],
    fallbackLabel: 'ESU · Sensor Exercise You',
    title: {
      it: 'ESU — Interazione Persona-Macchina',
      en: 'ESU — Human-Computer Interaction',
    },
    subtitle: {
      it: 'Progetto universitario di Human-Computer Interaction incentrato su struttura dell’interfaccia, stati interattivi e chiarezza dei flussi per un concept dedicato alla vita studentesca.',
      en: 'University HCI course project focused on interface structure, interaction states, user flows, and visual clarity for a student and campus-oriented app concept.',
    },
    summary: {
      it: 'Analisi dello spazio del problema, progettazione dei flussi utente e definizione rigorosa degli stati di interfaccia per rendere immediati i servizi quotidiani degli studenti.',
      en: 'Structured problem framing, user flow design, and explicit interaction state architecture to clarify everyday student and campus services.',
    },
    deliverables: {
      it: [
        'Definizione dello spazio del problema e casi d’uso',
        'Mappatura dei flussi utente end-to-end',
        'Architettura delle schermate e gerarchia visiva',
        'Specifica degli stati di interazione e feedback',
      ],
      en: [
        'Problem space framing & core student use cases',
        'End-to-end user flow mapping',
        'Screen architecture & visual hierarchy',
        'Interaction state & feedback specification',
      ],
    },
    sections: [
      {
        title: { it: 'Spazio del problema', en: 'Problem Space' },
        body: {
          it: 'I servizi digitali rivolti alla comunità universitaria soffrono spesso di frammentazione: informazioni operative, prenotazioni e aggiornamenti convivono in strutture dense e poco prevedibili. Nel corso di Interazione Persona-Macchina (DiPSCo, Università di Trento), l’obiettivo è stato progettare un concept applicativo chiaro, coerente e a basso sforzo cognitivo.',
          en: 'Digital services aimed at university students often suffer from fragmentation, with essential information, bookings, and updates buried inside dense, inconsistent navigation. Within the Human-Computer Interaction course at DiPSCo (University of Trento), the goal was to structure a clear, coherent, low-friction student app concept.',
        },
      },
      {
        title: { it: 'Architettura e flussi utente', en: 'Architecture & User Flows' },
        body: {
          it: 'Il lavoro si è concentrato sulla scomposizione dei compiti frequenti in percorsi lineari e riconoscibili, riducendo le scelte simultanee in ogni schermata e garantendo sempre orientamento su posizione attuale, passo successivo e possibilità di tornare indietro.',
          en: 'The design broke frequent student tasks into linear, recognizable paths—minimizing simultaneous choices per screen while keeping current context, next steps, and safe reversal clear at every point.',
        },
        points: {
          it: [
            'Separazione netta tra navigazione primaria e azioni contestuali di schermata.',
            'Coerenza terminologica e di layout tra tutte le sezioni del concept.',
            'Copertura esplicita degli stati di caricamento, stato vuoto, conferma ed errore.',
            'Attenzione alla leggibilità tipografica e al contrasto per l’uso rapido in mobilità.',
          ],
          en: [
            'Clear separation between primary navigation and contextual screen actions.',
            'Consistent terminology and layout grammar across every view of the concept.',
            'Explicit design of loading, empty, confirmation, and error recovery states.',
            'Strong typographic legibility and contrast tailored to quick on-the-go campus use.',
          ],
        },
      },
      {
        title: { it: 'Decisioni di interazione', en: 'Interaction Decisions' },
        body: {
          it: 'Piuttosto che aggiungere funzioni accessorie, il progetto ha privilegiato la chiarezza degli stati e la prevedibilità dei controlli: ogni azione comunica con precisione il proprio esito e impedisce ambiguità nei passaggi critici, applicando concretamente i principi di ergonomia cognitiva studiati nel percorso L-20.',
          en: 'Rather than piling on secondary features, the project prioritized explicit states and predictable controls: every action communicates its outcome clearly and avoids ambiguity at critical steps, translating cognitive ergonomics principles from the L-20 curriculum directly into interface structure.',
        },
      },
    ],
    takeaway: {
      it: 'Un’interfaccia davvero chiara si misura nella qualità dei suoi stati di transizione, nei messaggi di errore comprensibili e nell’assenza di ambiguità nei flussi quotidiani.',
      en: 'Genuine interface clarity is measured by transition states, understandable error recovery, and the absence of ambiguity across everyday flows.',
    },
  },
  {
    id: 'trentino-marketing',
    slug: 'trentino-marketing',
    category: 'content',
    categoryLabel: { it: 'CMS & Event UX', en: 'CMS & Event UX' },
    year: 'Ago – Ott 2026',
    role: {
      it: 'Tirocinio Curriculare — Area Content',
      en: 'Curricular Internship — Content Area',
    },
    organization: {
      it: 'Trentino Marketing s.r.l. · Trento',
      en: 'Trentino Marketing s.r.l. · Trento',
    },
    image: STUDIO_ASSETS.trentino,
    brandMark: 'trentino',
    imageAlt: {
      it: 'Paesaggio alpino delle Dolomiti all’ora blu con il marchio Trentino, a rappresentare i progetti CMS ed eventi con Trentino Marketing.',
      en: 'Blue-hour Dolomites alpine landscape paired with the Trentino brand mark, representing CMS and event UX work with Trentino Marketing.',
    },
    gallery: [
      {
        id: 'trentino-suoni-dolomiti',
        src: STUDIO_ASSETS.trentinoSuoni,
        aspect: 'landscape',
        label: {
          it: 'I Suoni delle Dolomiti',
          en: 'I Suoni delle Dolomiti',
        },
        alt: {
          it: 'Concerto acustico all’aperto su un prato alpino sotto le vette delle Dolomiti al tramonto, nello spirito de I Suoni delle Dolomiti.',
          en: 'Open-air acoustic cello concert on an alpine meadow beneath the Dolomites peaks at dusk, evoking I Suoni delle Dolomiti.',
        },
        caption: {
          it: 'Festival musicale in alta quota tra anfiteatri naturali UNESCO (Catinaccio, Latemar, Dolomiti di Brenta, Pale di San Martino), raggiungibili a piedi lungo i sentieri alpini.',
          en: 'High-altitude music festival set across UNESCO natural amphitheaters (Catinaccio, Latemar, Brenta Dolomites, Pale di San Martino), reached on foot via mountain trails.',
        },
      },
      {
        id: 'trentino-trentodoc-festival',
        src: STUDIO_ASSETS.trentinoTrentodoc,
        aspect: 'landscape',
        label: {
          it: 'Trentodoc Festival',
          en: 'Trentodoc Festival',
        },
        alt: {
          it: 'Due calici di bollicine di montagna metodo classico su una balaustra in pietra nel cortile storico illuminato di un palazzo rinascimentale di Trento al crepuscolo.',
          en: 'Two crystal flutes of mountain metodo classico sparkling wine resting on a stone balustrade inside a twilight Renaissance palazzo courtyard in Trento.',
        },
        caption: {
          it: 'Le bollicine di montagna animano i palazzi storici di Trento — dal Castello del Buonconsiglio a Palazzo Geremia e Palazzo Roccabruna — tra degustazioni e incontri culturali.',
          en: 'Mountain metodo classico sparkling wines across Trento’s historic palazzi — including Castello del Buonconsiglio, Palazzo Geremia, and Palazzo Roccabruna — with tastings and talks.',
        },
      },
      {
        id: 'trentino-festival-sport',
        src: STUDIO_ASSETS.trentinoSport,
        aspect: 'landscape',
        label: {
          it: 'Il Festival dello Sport',
          en: 'Il Festival dello Sport',
        },
        alt: {
          it: 'Piazza Duomo a Trento all’ora blu con il palco all’aperto de Il Festival dello Sport illuminato in blu alpino e rosa magenta davanti al pubblico seduto.',
          en: 'Piazza Duomo in Trento at twilight with an open-air sports festival talk stage illuminated in alpine blue and sporty magenta-pink before an attentive crowd.',
        },
        caption: {
          it: 'Organizzato da La Gazzetta dello Sport e Trentino Marketing, trasforma Piazza Duomo e i teatri cittadini in un palcoscenico diffuso di campioni, talk dal vivo e sport.',
          en: 'Organized by La Gazzetta dello Sport and Trentino Marketing, turning Piazza Duomo and historic theaters into a city-wide stage for live talks, champions, and sport.',
        },
      },
    ],
    brandShowcase: {
      type: 'territorial-identity',
      colorSrc: BRAND_ASSETS.trentinoColorLogo,
      monoSrc: BRAND_ASSETS.trentinoMonoLogo,
      alt: {
        it: 'Marchio territoriale ufficiale Trentino con farfalla e logotipo nelle varianti istituzionali a colori e monocromatica blu.',
        en: 'Official Trentino territorial brand mark featuring the butterfly icon and wordmark in full-color and monochrome blue institutional variants.',
      },
      title: {
        it: 'Marchio Territoriale Trentino — Architettura & Manuale d’Uso',
        en: 'Trentino Territorial Brand — Architecture & Usage Guidelines',
      },
      overview: {
        it: 'Il sistema visivo di Trentino Marketing coordina la promozione turistica, culturale e digitale della Provincia Autonoma di Trento — dal portale Visittrentino.info all’app Mio Trentino fino ai grandi eventi territoriali.',
        en: 'Trentino Marketing’s visual system unifies tourism, cultural, and digital communication for the Autonomous Province of Trento — spanning Visittrentino.info, the Mio Trentino ecosystem, and flagship events.',
      },
      swatches: [
        {
          name: { it: 'Verde Trentino', en: 'Trentino Green' },
          hex: '#00A871',
          role: { it: 'Natura & sostenibilità', en: 'Nature & sustainability' },
        },
        {
          name: { it: 'Verde Bosco', en: 'Forest Green' },
          hex: '#016B2D',
          role: { it: 'Foreste & profondità alpina', en: 'Forests & alpine depth' },
        },
        {
          name: { it: 'Verde Alpino', en: 'Alpine Meadow' },
          hex: '#C0D127',
          role: { it: 'Pascoli & vitalità', en: 'Meadows & vitality' },
        },
        {
          name: { it: 'Blu Dolomiti', en: 'Dolomites Blue' },
          hex: '#00529B',
          role: { it: 'Laghi, cielo & variante mono', en: 'Lakes, sky & institutional mono' },
        },
        {
          name: { it: 'Bianco Puro', en: 'Pure White' },
          hex: '#FFFFFF',
          role: { it: 'Neve, aria & negativo su scuro', en: 'Snow, air & dark knockout' },
        },
      ],
      principles: [
        {
          label: { it: 'Farfalla territoriale', en: 'Territorial butterfly' },
          detail: {
            it: 'Ideata originariamente da Massimo Dolcini sul finire degli anni ’80 e ridisegnata in tratto leggero da Giancarlo D’Orsi: le ali evocano la silhouette geografica del Trentino e la leggerezza dell’ambiente alpino.',
            en: 'Originally conceived by Massimo Dolcini in the late 1980s and restyled in its clean outline by Giancarlo D’Orsi: the wings echo the geographic shape of Trentino and the lightness of its alpine environment.',
          },
        },
        {
          label: { it: 'Logotipo & profilo alpino', en: 'Wordmark & mountain ridge' },
          detail: {
            it: 'Le lettere di altezza variabile richiamano i manifesti storici anni ’40 di Franz J. Lenhart, suggerendo l’andamento dinamico delle cime dolomitiche e la vivacità culturale del territorio.',
            en: 'The dynamic, varying letter heights draw inspiration from 1940s promotional posters by Franz J. Lenhart, recalling the jagged Dolomite skyline and cultural vitality of the region.',
          },
        },
        {
          label: { it: 'Manuale d’uso & digitale', en: 'Guidelines & digital governance' },
          detail: {
            it: 'Aree di rispetto rigorose attorno al marchio, versioni positive/negative ad alto contrasto su fotografia e coerenza tipografica tra pagine Pimcore CMS, Visittrentino.info e segnaletica eventi.',
            en: 'Strict clear-space protection around the mark, high-contrast positive and knockout photography overlays, and typographic consistency across Pimcore CMS pages, Visittrentino.info, and event touchpoints.',
          },
        },
      ],
    },
    fallbackLabel: 'Trentino Marketing · CMS & Event UX',
    title: {
      it: 'Trentino Marketing — CMS & Event UX',
      en: 'Trentino Marketing — CMS & Event UX',
    },
    subtitle: {
      it: 'Flussi editoriali su Pimcore CMS, igiene dell’architettura informativa, verifiche di qualità e touchpoint digitali e sul campo legati ai grandi eventi provinciali.',
      en: 'Pimcore CMS editorial workflows, information architecture hygiene, quality assurance checks, and digital/on-site context around major provincial events.',
    },
    summary: {
      it: 'Esperienza operativa reale all’interno dell’Area Content: strutturazione pagine su Pimcore, controllo link ed errori, e supporto al contesto digitale e on-site di manifestazioni di rilievo.',
      en: 'Real-world operational work inside the Content Area: Pimcore page structuring, navigation and link QA hygiene, and digital/on-site context around flagship provincial events.',
    },
    deliverables: {
      it: [
        'Strutturazione pagine e contenuti su Pimcore CMS',
        'Igiene della navigazione e dell’interlinking',
        'Controllo qualità su link rotti e anomalie di pagina',
        'Contesto digitale e on-site per grandi eventi',
      ],
      en: [
        'Pimcore CMS content & page structuring',
        'Navigation & internal interlinking hygiene',
        'Link integrity & page-error QA verification',
        'Digital & on-site context for major events',
      ],
    },
    sections: [
      {
        title: { it: 'Contesto organizzativo', en: 'Organizational Context' },
        body: {
          it: 'Tra agosto e ottobre 2026 ho svolto il tirocinio curriculare presso Trentino Marketing s.r.l. (Trento) nell’Area Content, lavorando a stretto contatto con i flussi reali di pubblicazione e manutenzione di un ecosistema editoriale territoriale ampio e ad alta visibilità.',
          en: 'From August to October 2026, I completed my curricular internship at Trentino Marketing s.r.l. (Trento) in the Content Area, working directly inside the publishing and maintenance workflows of a large, high-visibility territorial digital ecosystem.',
        },
      },
      {
        title: { it: 'Pimcore CMS, architettura e rigore QA', en: 'Pimcore CMS, IA & QA Rigor' },
        body: {
          it: 'Su piattaforme editoriali complesse l’esperienza utente dipende tanto dalla qualità della struttura informativa quanto dall’interfaccia visiva. Il lavoro quotidiano ha riguardato la costruzione coerente delle pagine su Pimcore, la cura dell’interlinking interno e controlli sistematici per prevenire errori di navigazione.',
          en: 'On large editorial platforms, user experience depends just as much on information architecture hygiene as on visual polish. Day-to-day work centered on consistent Pimcore page composition, internal interlinking clarity, and systematic QA checks to catch broken links and page anomalies.',
        },
        points: {
          it: [
            'Composizione e aggiornamento di strutture di pagina e moduli editoriali su Pimcore CMS.',
            'Verifica dell’architettura informativa, dei percorsi di navigazione e dei collegamenti interni.',
            'Controlli di qualità puntuali su link, coerenza dei contenuti e anomalie di visualizzazione.',
          ],
          en: [
            'Building and updating structured editorial pages and content modules inside Pimcore CMS.',
            'Reviewing information architecture, navigation pathways, and internal interlinking hygiene.',
            'Methodical quality checks on link integrity, content consistency, and page-level errors.',
          ],
        },
      },
      {
        title: { it: 'Touchpoint digitali e contesto eventi', en: 'Digital & On-Site Event Context' },
        body: {
          it: 'L’attività editoriale si è intrecciata con il contesto digitale e sul campo di tre manifestazioni centrali per il territorio: I Suoni delle Dolomiti, TrentoDoc Festival e Festival dello Sport. Osservare come i visitatori passano dalle informazioni online all’esperienza fisica rafforza la sensibilità verso chiarezza, tempismo e orientamento.',
          en: 'Editorial operations connected directly with the digital and on-site context of three flagship provincial events: I Suoni delle Dolomiti, TrentoDoc Festival, and Festival dello Sport. Seeing how visitors move from online discovery to physical attendance deepens sensitivity to clarity, timing, and wayfinding.',
        },
      },
    ],
    takeaway: {
      it: 'La qualità UX nei sistemi reali passa anche dalla disciplina silenziosa: contenuti ben strutturati, collegamenti affidabili e attenzione rigorosa ai dettagli prima della pubblicazione.',
      en: 'Real-world UX quality lives in quiet operational discipline: structured content, dependable interlinking, and thorough pre-publish verification.',
    },
  },
];

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: 'trentino-marketing',
    period: { it: 'Ago – Ott 2026 · 419h', en: 'Aug – Oct 2026 · 419h' },
    organization: 'Trentino Marketing s.r.l.',
    location: 'Trento',
    role: {
      it: 'Tirocinio Curriculare — Area Content & Web',
      en: 'Curricular Internship — Content & Web Area',
    },
    type: { it: 'Tirocinio Curriculare', en: 'Curricular Internship' },
    summary: {
      it: 'Gestione web su Pimcore CMS per visittrentino.info, coordinamento contenuti in 6 lingue, reportistica GA4/SEO e supporto operativo sul campo per I Suoni delle Dolomiti, Trentodoc Festival e Festival dello Sport.',
      en: 'Pimcore CMS web management for visittrentino.info, 6-language content coordination, GA4/SEO performance reporting, and field operations at I Suoni delle Dolomiti, Trentodoc Festival, and Festival dello Sport.',
    },
    focusAreas: {
      it: [
        '419h · visittrentino.info',
        'Pimcore CMS · 6 Lingue',
        'Report GA4 & SEO',
        'I Suoni delle Dolomiti',
        'Trentodoc Festival',
        'Festival dello Sport',
      ],
      en: [
        '419h · visittrentino.info',
        'Pimcore CMS · 6 Languages',
        'GA4 & SEO Reports',
        'I Suoni delle Dolomiti',
        'Trentodoc Festival',
        'Festival dello Sport',
      ],
    },
  },
  {
    id: 'unitn-dipsco',
    period: { it: 'Corso di Laurea Triennale', en: 'Bachelor’s Degree Program' },
    organization: 'Università di Trento — DiPSCo',
    location: 'Rovereto / Trento',
    role: {
      it: 'Interfacce e Tecnologie della Comunicazione (L-20)',
      en: 'Interfaces and Communication Technologies (L-20)',
    },
    type: { it: 'Formazione accademica', en: 'Education' },
    summary: {
      it: 'Percorso interdisciplinare presso il Dipartimento di Psicologia e Scienze Cognitive (DiPSCo) che integra psicologia cognitiva, interazione persona-macchina (HCI), design delle interfacce e tecnologie web.',
      en: 'Interdisciplinary degree at the Department of Psychology and Cognitive Science (DiPSCo) combining cognitive psychology, human-computer interaction (HCI), interface design, and web technologies.',
    },
    focusAreas: {
      it: [
        'Psicologia cognitiva',
        'Human-Computer Interaction',
        'Interface Design',
        'Tecnologie Web',
      ],
      en: [
        'Cognitive Psychology',
        'Human-Computer Interaction',
        'Interface Design',
        'Web Technologies',
      ],
    },
  },
  {
    id: 'hospitality-operations',
    period: { it: 'Esperienza Operativa', en: 'Hands-On Experience' },
    organization: 'Ristorazione & Rifugio Alpino',
    location: 'Trentino',
    role: {
      it: 'Hospitality, Logistica & Operazioni sul Campo',
      en: 'Hospitality, Logistics & Field Operations',
    },
    type: { it: 'Affidabilità operativa', en: 'Operational Reliability' },
    summary: {
      it: 'Ruoli operativi in ristorazione e rifugio alpino ad alto flusso: affidabilità concreta, gestione lucida dei picchi di lavoro e coordinamento di squadra sotto pressione.',
      en: 'Hands-on hospitality and logistics roles across restaurant and alpine refuge environments: proven operational reliability, calm execution during peak load, and teamwork under pressure.',
    },
    focusAreas: {
      it: [
        'Affidabilità operativa',
        'Teamwork sotto pressione',
        'Logistica & ritmi elevati',
        'Empatia verso l’utente',
      ],
      en: [
        'Operational reliability',
        'Teamwork under pressure',
        'High-tempo logistics',
        'Real-world empathy',
      ],
    },
  },
];
