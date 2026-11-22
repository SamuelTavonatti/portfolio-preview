import type { Locale } from '../types/portfolio';

function escapePdfText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E]/g, (ch) => {
      const map: Record<string, string> = {
        'à': 'a',
        'è': 'e',
        'é': 'e',
        'ì': 'i',
        'ò': 'o',
        'ù': 'u',
        '—': '-',
        '–': '-',
        '•': '-',
        '·': '-',
        '’': "'",
        '€': 'EUR',
      };
      return map[ch] ?? ' ';
    });
}

interface PdfLine {
  text: string;
  size: number;
  bold?: boolean;
  gapBefore?: number;
  color?: [number, number, number];
}

function buildExecutiveCvPdf(locale: Locale): Blob {
  const isIt = locale === 'it';

  const lines: PdfLine[] = [
    { text: 'SAMUEL TAVONATTI', size: 22, bold: true, color: [0.06, 0.08, 0.14] },
    {
      text: isIt
        ? 'UX/UI Designer & Front-End Developer | Trento, Italia'
        : 'UX/UI Designer & Front-End Developer | Trento, Italy',
      size: 11,
      bold: true,
      gapBefore: 4,
      color: [0.52, 0.41, 0.25],
    },
    {
      text: 'samuel.tavonatti05@gmail.com  |  linkedin.com/in/samuel-tavonatti  |  github.com/samueltavonatti',
      size: 9,
      gapBefore: 4,
      color: [0.35, 0.36, 0.38],
    },

    { text: isIt ? 'PROFILO' : 'PROFILE', size: 11, bold: true, gapBefore: 16, color: [0.52, 0.41, 0.25] },
    {
      text: isIt
        ? 'Progetto interfacce ad alta ergonomia cognitiva e architetture web veloci, accessibili e a costo zero.'
        : 'I design high-cognitive-ergonomics interfaces and fast, accessible, zero-cost web architectures.',
      size: 9.5,
      gapBefore: 5,
    },
    {
      text: isIt
        ? 'Formazione interdisciplinare in psicologia cognitiva, HCI e sviluppo front-end moderno (Vue, React, TypeScript).'
        : 'Interdisciplinary background bridging cognitive psychology, HCI research, and modern front-end engineering.',
      size: 9.5,
      gapBefore: 3,
    },

    { text: isIt ? 'PROGETTI SELEZIONATI' : 'SELECTED PROJECTS', size: 11, bold: true, gapBefore: 14, color: [0.52, 0.41, 0.25] },
    { text: 'VoltRep  -  Product Design & Front-End (https://voltrep-app.web.app/)', size: 10, bold: true, gapBefore: 6 },
    {
      text: isIt
        ? '- Web app mobile-first per workout tracking: architettura a 0 EUR, Firestore real-time, flussi a basso attrito.'
        : '- Mobile-first workout tracker: 0 EUR infrastructure, real-time Firestore sync, low-friction session flows.',
      size: 9.2,
      gapBefore: 3,
    },
    { text: 'ESU  -  HCI University Project (Universita di Trento, DiPSCo)', size: 10, bold: true, gapBefore: 7 },
    {
      text: isIt
        ? '- Ricerca Double Diamond, ergonomia cognitiva, prototipazione su Figma e validazione di usabilita.'
        : '- Double Diamond research, cognitive ergonomics, Figma prototyping, and usability validation.',
      size: 9.2,
      gapBefore: 3,
    },
    { text: 'Trentino Marketing  -  Digital & Editorial Architecture (visittrentino.info)', size: 10, bold: true, gapBefore: 7 },
    {
      text: isIt
        ? '- Gestione contenuti multilingua (6 lingue) su Pimcore CMS, audit GA4/SEO e QA architettura informativa.'
        : '- Multilingual content architecture (6 languages) on Pimcore CMS, GA4/SEO reporting, and IA QA.',
      size: 9.2,
      gapBefore: 3,
    },

    { text: isIt ? 'ESPERIENZA & FORMAZIONE' : 'EXPERIENCE & EDUCATION', size: 11, bold: true, gapBefore: 14, color: [0.52, 0.41, 0.25] },
    {
      text: isIt
        ? 'Trentino Marketing s.r.l. - Tirocinio Curriculare Area Content (419h, Ago - Ott 2026)'
        : 'Trentino Marketing s.r.l. - Curricular Internship, Content Area (419h, Aug - Oct 2026)',
      size: 10,
      bold: true,
      gapBefore: 6,
    },
    {
      text: isIt
        ? '- Gestione Pimcore CMS per visittrentino.info, coordinamento 6 lingue, report GA4/SEO e supporto operativo eventi:'
        : '- Pimcore CMS management for visittrentino.info, 6-language coordination, GA4/SEO reports, and field operations:',
      size: 9.2,
      gapBefore: 3,
    },
    {
      text: '  I Suoni delle Dolomiti, Trentodoc Festival, Il Festival dello Sport.',
      size: 9.2,
      gapBefore: 2,
    },
    {
      text: isIt
        ? 'Universita di Trento (DiPSCo) - Laurea Triennale in Interfacce e Tecnologie della Comunicazione (L-20)'
        : 'University of Trento (DiPSCo) - B.Sc. in Interfaces and Communication Technologies (L-20)',
      size: 10,
      bold: true,
      gapBefore: 7,
    },
    {
      text: isIt
        ? '- Psicologia cognitiva, Human-Computer Interaction, design di interfacce e sviluppo web.'
        : '- Cognitive psychology, Human-Computer Interaction, interface design, and web technologies.',
      size: 9.2,
      gapBefore: 3,
    },
    {
      text: isIt
        ? 'Hospitality & Logistica (Ristorazione & Rifugio Alpino) - Operativita sul campo'
        : 'Hospitality & Logistics (Restaurant & Mountain Refuge) - Field Operations',
      size: 10,
      bold: true,
      gapBefore: 7,
    },
    {
      text: isIt
        ? '- Affidabilita operativa, gestione dei picchi di carico e lavoro di squadra sotto pressione.'
        : '- Operational reliability, peak-load execution, and clear teamwork under pressure.',
      size: 9.2,
      gapBefore: 3,
    },

    { text: isIt ? 'COMPETENZE & STACK' : 'SKILLS & STACK', size: 11, bold: true, gapBefore: 14, color: [0.52, 0.41, 0.25] },
    {
      text: 'UX/UI & Research: Figma, Design Systems, Double Diamond, Cognitive Ergonomics, Wireframing, Usability Testing',
      size: 9.2,
      gapBefore: 5,
    },
    {
      text: 'Front-End & Motion: Vue.js, React, TypeScript, Tailwind CSS, CSS/SVG Motion, Firebase / Firestore',
      size: 9.2,
      gapBefore: 4,
    },
    {
      text: 'Content, SEO & Digital: Pimcore CMS, Google Analytics 4 (GA4), SEO Optimization, Multilingual & Digital Workflows',
      size: 9.2,
      gapBefore: 4,
    },
  ];

  // Assemble clean PDF content stream (A4: 595 x 842 pt)
  let y = 788;
  const cmds: string[] = [];

  for (const line of lines) {
    y -= line.gapBefore ?? 0;
    const [r, g, b] = line.color ?? [0.12, 0.14, 0.18];
    const fontKey = line.bold ? '/F2' : '/F1';
    cmds.push('BT');
    cmds.push(`${r.toFixed(2)} ${g.toFixed(2)} ${b.toFixed(2)} rg`);
    cmds.push(`${fontKey} ${line.size} Tf`);
    cmds.push(`48 ${y.toFixed(1)} Td`);
    cmds.push(`(${escapePdfText(line.text)}) Tj`);
    cmds.push('ET');
    y -= line.size * 1.38;
  }

  // Subtle horizontal divider rule beneath header
  cmds.push('0.85 0.88 0.92 RG');
  cmds.push('0.8 w');
  cmds.push('48 728 m 547 728 l S');

  const streamContent = cmds.join('\n');

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];

  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
}

export function downloadExecutiveCvPdf(locale: Locale): void {
  const blob = buildExecutiveCvPdf(locale);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download =
    locale === 'it'
      ? 'Samuel_Tavonatti_CV_IT.pdf'
      : 'Samuel_Tavonatti_CV_EN.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}
