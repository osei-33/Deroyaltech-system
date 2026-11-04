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
import { VideoTheaterModal } from './components/VideoTheaterModal.tsx';
import { CaseStudyModal } from './components/CaseStudyModal.tsx';
import { HardwareQuoteDrawer } from './components/HardwareQuoteDrawer.tsx';
import { ConsultationModal } from './components/ConsultationModal.tsx';
import { AdminPortalModal } from './components/AdminPortalModal.tsx';
import { ClientAuthModal } from './components/ClientAuthModal.tsx';
import { Footer } from './components/Footer.tsx';
import { LiveSupportWidget } from './components/chat/LiveSupportWidget.tsx';
import { ProjectTrackerModal } from './components/tracker/ProjectTrackerModal.tsx';
import { ServiceRequestModal } from './components/services/ServiceRequestModal.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';
import { CaseStudy, HardwareProduct, QuoteItem, CompletedProject } from './types/index.ts';

function AppContent() {
  const { 
    formatPrice, 
    config, 
    currentPage, 
    isAuthModalOpen, 
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    authRedirectTarget
  } = useSite();

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
  const [isConsultationOpen, setIsConsultationOpen] = useState<boolean>(false);
  const [consultationScope, setConsultationScope] = useState<string>('');
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
    const total = quoteItems.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
    const itemList = quoteItems.map(item => `${item.quantity}x ${item.product.name} (${item.product.sku})`).join(', ');
    const scopeString = `Hardware RFQ: ${itemList} | Total Est: ${formatPrice(total)}`;
    setConsultationScope(scopeString);
    setIsConsultationOpen(true);
  };

  const handleApplyEstimatorScope = (configSummary: string) => {
    setConsultationScope(configSummary);
    setIsConsultationOpen(true);
  };

  const totalQuoteItemsCount = quoteItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200 flex flex-col justify-between pb-16 lg:pb-0">
      <div>
        {/* 3-Zone Top Navigation Bar */}
        <Navbar
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          openConsultation={() => {
            setConsultationScope('');
            setIsConsultationOpen(true);
          }}
          quoteItemCount={totalQuoteItemsCount}
          openQuoteDrawer={() => setIsQuoteDrawerOpen(true)}
          openAdmin={() => setIsAdminOpen(true)}
        />

        {/* Dynamic Multi-Page Content Router */}
        <main>
          {currentPage === 'home' && (
            <HomePage
              openConsultation={(scope) => {
                setConsultationScope(scope || '');
                setIsConsultationOpen(true);
              }}
              onOpenVideoProject={(project) => setSelectedVideoProject(project)}
            />
          )}

          {currentPage === 'services' && (
            <ServicesPage
              openConsultation={(scope) => {
                setConsultationScope(scope || '');
                setIsConsultationOpen(true);
              }}
            />
          )}

          {currentPage === 'workflow' && (
            <WorkflowPage
              openConsultation={(scope) => {
                setConsultationScope(scope || '');
                setIsConsultationOpen(true);
              }}
            />
          )}

          {currentPage === 'projects' && (
            <ProjectsPage
              onOpenVideo={(project) => setSelectedVideoProject(project)}
              openConsultation={(scope) => {
                setConsultationScope(scope || '');
                setIsConsultationOpen(true);
              }}
            />
          )}

          {currentPage === 'hardware' && (
            <HardwarePage
              onAddToCart={handleAddToCart}
              openQuoteDrawer={() => setIsQuoteDrawerOpen(true)}
              quoteItemCount={totalQuoteItemsCount}
              openConsultation={(scope) => {
                setConsultationScope(scope || '');
                setIsConsultationOpen(true);
              }}
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
        </main>
      </div>

      {/* Corporate Footer with Social Channels & Multi-page Directory */}
      <Footer
        openConsultation={() => {
          setConsultationScope('');
          setIsConsultationOpen(true);
        }}
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
          if (selectedCaseStudy) {
            setConsultationScope(`Interested in architecture similar to: ${selectedCaseStudy.title} (${selectedCaseStudy.client})`);
          }
          setIsConsultationOpen(true);
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

      {/* Discovery Call & Project Brief Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => {
          setIsConsultationOpen(false);
          setConsultationScope('');
        }}
        prefilledScope={consultationScope}
      />

      {/* No-Code Administration & CMS Portal Modal */}
      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Real-time Customer Live Chat Support Widget */}
      <LiveSupportWidget />

      {/* Project Status Tracker Modal */}
      <ProjectTrackerModal />

      {/* Service Request & Order Modal */}
      <ServiceRequestModal />

      {/* Thumb-Zone Ergonomic Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        openConsultation={() => {
          setConsultationScope('');
          setIsConsultationOpen(true);
        }}
        quoteItemCount={totalQuoteItemsCount}
        openQuoteDrawer={() => setIsQuoteDrawerOpen(true)}
        openAdmin={() => setIsAdminOpen(true)}
      />
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
