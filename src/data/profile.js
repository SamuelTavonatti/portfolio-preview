export const profileData = {
  name: 'Samuel Tavonatti',
  location: 'Trento, IT',
  email: 'samuel.tavonatti05@gmail.com',
  links: {
    github: 'https://github.com/SamuelTavonatti',
    linkedin: 'https://www.linkedin.com/in/samuel-tavonatti-b18a09391/',
    instagram: 'https://www.instagram.com/samuel.tavonatti/',
  },
  hero: {
    it: {
      badge: 'Disponibile per collaborazioni & stage',
      title: 'Interfacce essenziali. Zero rumore.',
      titleLines: [
        'Interfacce essenziali.',
        'Zero rumore.',
      ],
      subtitle:
        'Samuel Tavonatti — Studente ITC (UniTrento) & UI/UX Designer. Progetto prodotti digitali fondati sull’ergonomia cognitiva, sistemi visivi puliti e sviluppo front-end ad alte prestazioni.',
      ctaPrimary: 'Esplora i Case Study',
      ctaSecondary: 'Contattami',
    },
    en: {
      badge: 'Open to collaborations & internships',
      title: 'Essential interfaces. Zero noise.',
      titleLines: [
        'Essential interfaces.',
        'Zero noise.',
      ],
      subtitle:
        'Samuel Tavonatti — ITC Student (UniTrento) & UI/UX Designer. Crafting digital products grounded in cognitive ergonomics, clean visual systems, and high-performance front-end engineering.',
      ctaPrimary: 'Explore Case Studies',
      ctaSecondary: 'Get in Touch',
    },
  },
  highlights: [
    { value: 'L-20', label: { it: 'Interfacce & Comunicazione', en: 'Interfaces & Comm. BSc' } },
    { value: 'Figma', label: { it: 'Prototipazione & UI', en: 'Prototyping & UI' } },
    { value: 'Pimcore', label: { it: 'CMS Enterprise', en: 'Enterprise CMS' } },
  ],
  about: {
    it: {
      lead: 'Progetto interfacce che riducono la frizione cognitiva tra persona e sistema.',
      paragraphs: [
        'Studio Interfacce e Tecnologie della Comunicazione presso il Dipartimento di Psicologia e Scienze Cognitive (DiPSCo) dell’Università di Trento. Questo percorso unisce psicologia cognitiva, interaction design e tecnologie web.',
        'Ho applicato queste competenze sul campo durante il tirocinio presso Trentino Marketing (agosto – ottobre 2026), gestendo flussi editoriali su CMS enterprise (Pimcore), architetture di interlinking, bonifica di errori 404 e accuratezza dei dati per grandi eventi come I Suoni delle Dolomiti, TrentoDoc Festival e Il Festival dello Sport.',
        'Uso quotidianamente Figma, HTML/CSS/JavaScript e la suite Adobe per trasformare requisiti complessi in interfacce chiare, accessibili e facili da implementare con i team di sviluppo.',
      ],
    },
    en: {
      lead: 'I design interfaces that reduce cognitive friction between people and systems.',
      paragraphs: [
        'I study Interfaces and Communication Technologies at the Department of Psychology and Cognitive Science (DiPSCo), University of Trento — a program combining cognitive ergonomics, interaction design, and web engineering.',
        'I applied these principles in the field during my internship at Trentino Marketing (August – October 2026), managing enterprise CMS workflows (Pimcore), strategic interlinking, 404 link auditing, and logistics data for flagship events like I Suoni delle Dolomiti, TrentoDoc Festival, and Il Festival dello Sport.',
        'I work daily with Figma, HTML/CSS/JavaScript, and Adobe Creative Cloud to turn complex requirements into clear, accessible interfaces ready for engineering handoff.',
      ],
    },
  },
  skills: [
    {
      icon: 'layers',
      it: {
        title: 'UI/UX Design & Ergonomia Cognitiva',
        desc: 'Architettura dell’informazione, wireframing, prototipazione interattiva su Figma, design thinking e test di usabilità orientati alla riduzione del carico cognitivo.',
        context: 'UniTrento (DiPSCo) • VoltRep',
      },
      en: {
        title: 'UI/UX Design & Cognitive Ergonomics',
        desc: 'Information architecture, wireframing, interactive Figma prototyping, design thinking, and usability testing aimed at reducing cognitive load.',
        context: 'UniTrento (DiPSCo) • VoltRep',
      },
    },
    {
      icon: 'code',
      it: {
        title: 'Front-End & Prototyping Handoff',
        desc: 'Sviluppo di interfacce web con HTML, CSS, JavaScript e Vue.js; dialogo tecnico efficace con gli sviluppatori per garantire fedeltà visiva e performance.',
        context: 'Portfolio • VoltRep Web App',
      },
      en: {
        title: 'Front-End & Prototyping Handoff',
        desc: 'Web interface implementation with HTML, CSS, JavaScript, and Vue.js; smooth collaboration with engineers for visual fidelity and performance.',
        context: 'Portfolio • VoltRep Web App',
      },
    },
    {
      icon: 'database',
      it: {
        title: 'CMS Enterprise, Content Flow & QA',
        desc: 'Amministrazione Pimcore CMS, progettazione di flussi di navigazione tramite interlinking strategico, monitoraggio errori 404 e gestione asset DAM.',
        context: 'Trentino Marketing',
      },
      en: {
        title: 'Enterprise CMS, Content Flow & QA',
        desc: 'Pimcore CMS administration, navigation flow design via strategic interlinking, 404 auditing, and DAM asset workflows.',
        context: 'Trentino Marketing',
      },
    },
  ],
  education: [
    {
      institution: { it: 'Università degli Studi di Trento', en: 'University of Trento' },
      period: '2024 — Presente',
      periodEn: '2024 — Present',
      degree: {
        it: 'Laurea in Interfacce e Tecnologie della Comunicazione (L-20)',
        en: 'BSc in Interfaces and Communication Technologies (L-20)',
      },
      detail: {
        it: 'Dipartimento di Psicologia e Scienze Cognitive (DiPSCo) — Focus su UX, HCI e sistemi digitali.',
        en: 'Department of Psychology and Cognitive Science (DiPSCo) — Focus on UX, HCI, and digital systems.',
      },
      logo: `${import.meta.env.BASE_URL}logounitn.png`,
    },
  ],
  certifications: [
    {
      title: 'Public Speaking & Leadership',
      issuer: 'School of Innovation — UniTrento',
    },
    {
      title: 'Cambridge English B2 First',
      issuer: 'Cambridge Assessment (2023)',
    },
  ],
}
