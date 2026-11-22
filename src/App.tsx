import { useCallback, useEffect, useState } from 'react';
import { CaseStudySheet } from './components/CaseStudySheet';
import { ContactSection } from './components/ContactSection';
import { EditorialHero } from './components/EditorialHero';
import { ExperienceSection } from './components/ExperienceSection';
import { Footer } from './components/Footer';
import { LegalModal } from './components/LegalModal';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsMatrixSection } from './components/SkillsMatrixSection';
import { TopNav } from './components/TopNav';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CASE_STUDIES, UI_COPY } from './data/content';
import { useReducedMotion } from './hooks/useReducedMotion';
import type { CaseStudy, LegalTab } from './types/portfolio';

function PortfolioContent() {
  const { locale, isTransitioning } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [notFoundSlug, setNotFoundSlug] = useState<string | null>(null);
  const [activeLegalTab, setActiveLegalTab] = useState<LegalTab | null>(null);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#case/')) {
        const slug = decodeURIComponent(hash.slice('#case/'.length)).trim();
        const found = CASE_STUDIES.find((item) => item.slug === slug);
        if (found) {
          setSelectedStudy(found);
          setNotFoundSlug(null);
        } else if (slug) {
          setSelectedStudy(null);
          setNotFoundSlug(slug);
        }
      } else {
        setSelectedStudy(null);
        setNotFoundSlug(null);
      }
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const handleOpenCaseStudy = useCallback((study: CaseStudy) => {
    setSelectedStudy(study);
    setNotFoundSlug(null);
    if (window.location.hash !== `#case/${study.slug}`) {
      window.history.pushState(null, '', `#case/${study.slug}`);
    }
  }, []);

  const handleCloseCaseStudy = useCallback(() => {
    setSelectedStudy(null);
    setNotFoundSlug(null);
    if (window.location.hash.startsWith('#case/')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  const handleOpenLegal = useCallback((tab: LegalTab) => {
    setActiveLegalTab(tab);
  }, []);

  const handleCloseLegal = useCallback(() => {
    setActiveLegalTab(null);
  }, []);

  return (
    <div id="top" className="min-h-screen overflow-x-clip bg-[#07080B] text-[#F5F5F7]">
      <a href="#main-content" className="skip-link">
        {UI_COPY.skipToContent[locale]}
      </a>

      <TopNav />

      <div
        className="transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          opacity: !prefersReducedMotion && isTransitioning ? 0.3 : 1,
        }}
      >
        <main id="main-content">
          <EditorialHero />
          <ProjectsSection onSelectCaseStudy={handleOpenCaseStudy} />
          <SkillsMatrixSection />
          <ExperienceSection onSelectCaseStudy={handleOpenCaseStudy} />
          <ContactSection onOpenLegal={handleOpenLegal} />
        </main>

        <Footer onOpenLegal={handleOpenLegal} />
      </div>

      <CaseStudySheet
        study={selectedStudy}
        notFoundSlug={notFoundSlug}
        onClose={handleCloseCaseStudy}
        onSelectStudy={handleOpenCaseStudy}
      />

      <LegalModal
        activeTab={activeLegalTab}
        onChangeTab={setActiveLegalTab}
        onClose={handleCloseLegal}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <PortfolioContent />
    </LanguageProvider>
  );
}
