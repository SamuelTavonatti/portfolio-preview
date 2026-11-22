export type Locale = 'it' | 'en';

export type CaseStudyCategory = 'all' | 'product' | 'hci' | 'content';

export type LegalTab = 'privacy' | 'cookies' | 'terms';

export interface LocalizedText {
  it: string;
  en: string;
}

export interface CaseStudySection {
  title: LocalizedText;
  body: LocalizedText;
  points?: {
    it: string[];
    en: string[];
  };
}

export type BrandMarkVariant = 'voltrep' | 'esu' | 'trentino';

export interface CaseStudyGalleryItem {
  id: string;
  src: string;
  label?: LocalizedText;
  alt: LocalizedText;
  caption: LocalizedText;
  aspect?: 'landscape' | 'poster';
}

export interface BrandSwatch {
  name: LocalizedText;
  hex: string;
  role: LocalizedText;
}

export interface BrandShowcase {
  type: 'territorial-identity';
  colorSrc: string;
  monoSrc: string;
  alt: LocalizedText;
  title: LocalizedText;
  overview: LocalizedText;
  swatches: BrandSwatch[];
  principles: {
    label: LocalizedText;
    detail: LocalizedText;
  }[];
}

export interface CaseStudy {
  id: string;
  slug: string;
  category: Exclude<CaseStudyCategory, 'all'>;
  categoryLabel: LocalizedText;
  year: string;
  role: LocalizedText;
  organization: LocalizedText;
  liveUrl?: string;
  liveLabel?: LocalizedText;
  image: string;
  imageAlt: LocalizedText;
  brandMark: BrandMarkVariant;
  gallery: CaseStudyGalleryItem[];
  brandShowcase?: BrandShowcase;
  fallbackLabel: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  summary: LocalizedText;
  deliverables: {
    it: string[];
    en: string[];
  };
  sections: CaseStudySection[];
  takeaway: LocalizedText;
}

export interface ExperienceItem {
  id: string;
  period: LocalizedText;
  organization: string;
  location: string;
  role: LocalizedText;
  type: LocalizedText;
  summary: LocalizedText;
  focusAreas: {
    it: string[];
    en: string[];
  };
}

export interface ShowreelBeat {
  id: number;
  code: string;
  label: LocalizedText;
  headline: LocalizedText;
  caption: LocalizedText;
  durationMs: number;
}

export interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  privacyAccepted: boolean;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  privacyAccepted?: string;
}
