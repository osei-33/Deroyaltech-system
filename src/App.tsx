import React, { useState, useEffect } from 'react';
import { SiteProvider, useSite } from './context/SiteContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { HomePage } from './components/pages/HomePage.tsx';
import { ServicesPage } from './components/pages/ServicesPage.tsx';
import { WorkflowPage } from './components/pages/WorkflowPage.tsx';
import { ProjectsPage } from './components/pages/ProjectsPage.tsx';
import { HardwarePage } from './components/pages/HardwarePage.tsx';
import { EstimatorPage } from './components/pages/EstimatorPage.tsx';
import { ContactPage } from './components/pages/ContactPage.tsx';
import { KnowledgeBasePage } from './components/pages/KnowledgeBasePage.tsx';
import { TrackProjectPage } from './components/pages/TrackProjectPage.tsx';
import { ConsultationPage } from './components/pages/ConsultationPage.tsx';
import { ClientHubPage } from './components/pages/ClientHubPage.tsx';
import { AdminInquiriesPage } from './components/pages/AdminInquiriesPage.tsx';
import { DocumentVerificationPage } from './components/pages/DocumentVerificationPage.tsx';
import { VideoTheaterModal } from './components/VideoTheaterModal.tsx';
import { CaseStudyModal } from './components/CaseStudyModal.tsx';
import { HardwareQuoteDrawer } from './components/HardwareQuoteDrawer.tsx';
import { AdminPortalModal } from './components/AdminPortalModal.tsx';
import { ClientAuthModal } from './components/ClientAuthModal.tsx';
import { Footer } from './components/Footer.tsx';
import { LiveSupportWidget } from './components/chat/LiveSupportWidget.tsx';
import { ServiceRequestModal } from './components/services/ServiceRequestModal.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';
import { ScrollToTopButton } from './components/common/ScrollToTopButton.tsx';
import { VisitorAnnouncementModal } from './components/common/VisitorAnnouncementModal.tsx';
import { MetaTagManager } from './components/common/MetaTagManager.tsx';
import { useInactivityLogout } from './hooks/useInactivityLogout.ts';
import { CaseStudy, HardwareProduct, QuoteItem, CompletedProject } from './types/index.ts';
import { ShieldAlert, X } from 'lucide-react';

function AppContent() {
  const { 
    formatPrice, 
    config, 
    currentPage, 
    navigateTo,
    isAuthModalOpen, 
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    authRedirectTarget
  } = useSite();

  const { inactivityNotice, dismissNotice } = useInactivityLogout();

  // Dual-Theme: Dark Mode by default for sleek modern tech aesthetic
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('drt_theme');
      return stored ? stored === 'dark' : true;
    }
    return true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('drt_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('drt_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Modals & Drawers state
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [selectedVideoProject, setSelectedVideoProject] = useState<CompletedProject | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isQuoteDrawerOpen, setIsQuoteDrawerOpen] = useState<boolean>(false);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);

  // Hardware Cart Operations
  const handleAddToCart = (product: HardwareProduct) => {
    setQuoteItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setQuoteItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveQuoteItem = (productId: string) => {
    setQuoteItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setQuoteItems([]);
  };

  const handleProceedFromQuoteToConsultation = () => {
    setIsQuoteDrawerOpen(false);
    navigateTo('consultation');
  };

  const handleApplyEstimatorScope = (_configSummary: string) => {
    navigateTo('consultation');
  };

  const totalQuoteItemsCount = quoteItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200 flex flex-col justify-between pb-16 lg:pb-0">
      {/* Dynamic SEO Meta Tag Manager */}
      <MetaTagManager />

      <div>
        {/* 3-Zone Top Navigation Bar */}
        <Navbar
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          openConsultation={() => navigateTo('consultation')}
          quoteItemCount={totalQuoteItemsCount}
          openQuoteDrawer={() => setIsQuoteDrawerOpen(true)}
          openAdmin={() => setIsAdminOpen(true)}
        />

        {/* Dynamic Multi-Page Content Router */}
        <main>
          {currentPage === 'home' && (
            <HomePage
              openConsultation={() => navigateTo('consultation')}
              onOpenVideoProject={(project) => setSelectedVideoProject(project)}
            />
          )}

          {currentPage === 'services' && (
            <ServicesPage
              openConsultation={() => navigateTo('consultation')}
            />
          )}

          {currentPage === 'workflow' && (
            <WorkflowPage
              openConsultation={() => navigateTo('consultation')}
            />
          )}

          {currentPage === 'projects' && (
            <ProjectsPage
              onOpenVideo={(project) => setSelectedVideoProject(project)}
              openConsultation={() => navigateTo('consultation')}
            />
          )}

          {currentPage === 'hardware' && (
            <HardwarePage
              onAddToCart={handleAddToCart}
              openQuoteDrawer={() => setIsQuoteDrawerOpen(true)}
              quoteItemCount={totalQuoteItemsCount}
              openConsultation={() => navigateTo('consultation')}
            />
          )}

          {currentPage === 'estimator' && (
            <EstimatorPage
              onApplyScopeToBrief={handleApplyEstimatorScope}
            />
          )}

          {currentPage === 'contact' && (
            <ContactPage />
          )}

          {currentPage === 'knowledge' && (
            <KnowledgeBasePage />
          )}

          {(currentPage === 'tracker' || currentPage === 'consultation') && (
            <ClientHubPage initialTab={currentPage === 'consultation' ? 'consultation' : 'tracker'} />
          )}

          {currentPage === 'inquiries' && (
            <AdminInquiriesPage />
          )}

          {currentPage === 'verify' && (
            <DocumentVerificationPage />
          )}
        </main>
      </div>

      {/* Corporate Footer with Social Channels & Multi-page Directory */}
      <Footer
        openConsultation={() => navigateTo('consultation')}
        openAdmin={() => setIsAdminOpen(true)}
      />

      {/* Client Registration & Authentication Gating Modal */}
      <ClientAuthModal />

      {/* MP4 Video Overview Theater Modal */}
      <VideoTheaterModal
        project={selectedVideoProject}
        onClose={() => setSelectedVideoProject(null)}
      />

      {/* Case Study Deep Dive Modal */}
      <CaseStudyModal
        caseStudy={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
        openConsultation={() => {
          setSelectedCaseStudy(null);
          navigateTo('consultation');
        }}
      />

      {/* Hardware RFQ Cart Drawer (GH₵) */}
      <HardwareQuoteDrawer
        isOpen={isQuoteDrawerOpen}
        onClose={() => setIsQuoteDrawerOpen(false)}
        items={quoteItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveQuoteItem}
        onClearCart={handleClearCart}
        onProceedToConsultation={handleProceedFromQuoteToConsultation}
      />

      {/* No-Code Administration & CMS Portal Modal */}
      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Real-time Customer Live Chat Support Widget */}
      <LiveSupportWidget />

      {/* Floating Scroll to Top Quick Navigation Button */}
      <ScrollToTopButton />

      {/* Visitor Announcement Pop-up Modal */}
      <VisitorAnnouncementModal />

      {/* Service Request & Order Modal */}
      <ServiceRequestModal />

      {/* Thumb-Zone Ergonomic Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        openConsultation={() => navigateTo('consultation')}
        quoteItemCount={totalQuoteItemsCount}
        openQuoteDrawer={() => setIsQuoteDrawerOpen(true)}
        openAdmin={() => setIsAdminOpen(true)}
      />

      {/* Inactivity Logout Notice Toast */}
      {inactivityNotice && (
        <div className="fixed bottom-6 left-6 z-50 max-w-md p-4 bg-amber-950 text-amber-200 rounded-2xl shadow-2xl border border-amber-700 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs leading-relaxed">
            <span className="font-bold block text-white mb-0.5">Session Timed Out</span>
            <span>{inactivityNotice}</span>
          </div>
          <button
            type="button"
            onClick={dismissNotice}
            className="p-1 rounded text-amber-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <SiteProvider>
      <AppContent />
    </SiteProvider>
  );
}
