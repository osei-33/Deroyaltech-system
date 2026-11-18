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
import { PriceNegotiationModal } from './components/common/PriceNegotiationModal.tsx';
import { ClientServiceNotificationModal } from './components/common/ClientServiceNotificationModal.tsx';
import { GlobalNotificationToaster } from './components/common/GlobalNotificationToaster.tsx';
import { useInactivityLogout } from './hooks/useInactivityLogout.ts';
import { CaseStudy, HardwareProduct, QuoteItem, CompletedProject } from './types/index.ts';
import { ShieldAlert, X, Clock, RotateCcw } from 'lucide-react';

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

  const {
    inactivityNotice,
    dismissNotice,
    isWarningVisible,
    secondsRemaining,
    warningTotalSeconds,
    stayLoggedIn
  } = useInactivityLogout();

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

      {/* Commercial Price Negotiation Modal */}
      <PriceNegotiationModal />

      {/* Client Service Notification Modal */}
      <ClientServiceNotificationModal />

      {/* Global Real-Time Web & In-App Notification Toasts */}
      <GlobalNotificationToaster />

      {/* Thumb-Zone Ergonomic Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        openConsultation={() => navigateTo('consultation')}
        quoteItemCount={totalQuoteItemsCount}
        openQuoteDrawer={() => setIsQuoteDrawerOpen(true)}
        openAdmin={() => setIsAdminOpen(true)}
      />

      {/* Live Inactivity Countdown Warning Toast */}
      {isWarningVisible && (
        <div
          role="alertdialog"
          aria-live="assertive"
          aria-labelledby="inactivity-countdown-title"
          className="fixed bottom-20 lg:bottom-6 left-4 right-4 sm:right-auto sm:left-6 z-50 sm:w-[400px] p-4 bg-slate-950/95 backdrop-blur-md text-slate-100 rounded-2xl shadow-2xl border border-amber-500/60 space-y-3 animate-in fade-in slide-in-from-bottom-3"
        >
          <div className="flex items-start gap-3">
            {/* Circular Visual SVG Countdown Ring */}
            <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44" aria-hidden="true">
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  className="text-slate-800"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 18}
                  strokeDashoffset={
                    2 * Math.PI * 18 * (1 - Math.max(0, Math.min(1, secondsRemaining / warningTotalSeconds)))
                  }
                  className={`transition-all duration-500 ${
                    secondsRemaining <= 15 ? 'text-red-500' : 'text-amber-400'
                  }`}
                />
              </svg>
              <span
                className={`absolute font-mono text-xs font-extrabold ${
                  secondsRemaining <= 15 ? 'text-red-400 animate-pulse' : 'text-amber-300'
                }`}
              >
                {secondsRemaining}s
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <Clock
                  className={`w-3.5 h-3.5 shrink-0 ${
                    secondsRemaining <= 15 ? 'text-red-400' : 'text-amber-400'
                  }`}
                />
                <span id="inactivity-countdown-title" className="text-xs font-bold text-white">
                  Session Expiring Soon
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                You will be automatically signed out in{' '}
                <strong
                  className={`font-mono ${
                    secondsRemaining <= 15 ? 'text-red-400' : 'text-amber-300'
                  }`}
                >
                  {secondsRemaining} second{secondsRemaining === 1 ? '' : 's'}
                </strong>{' '}
                due to inactivity.
              </p>
            </div>
          </div>

          {/* Linear Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                secondsRemaining <= 15
                  ? 'bg-gradient-to-r from-red-600 to-rose-400'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400'
              }`}
              style={{
                width: `${Math.max(0, Math.min(100, (secondsRemaining / warningTotalSeconds) * 100))}%`
              }}
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={stayLoggedIn}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Stay Logged In</span>
            </button>
          </div>
        </div>
      )}

      {/* Inactivity Logout Notice Toast */}
      {inactivityNotice && (
        <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 sm:right-auto sm:left-6 z-50 max-w-md p-4 bg-amber-950 text-amber-200 rounded-2xl shadow-2xl border border-amber-700 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs leading-relaxed">
            <span className="font-bold block text-white mb-0.5">Session Timed Out</span>
            <span>{inactivityNotice}</span>
          </div>
          <button
            type="button"
            onClick={dismissNotice}
            aria-label="Dismiss session timeout notice"
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
