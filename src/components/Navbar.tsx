import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ShoppingBag,
  ArrowRight,
  Settings,
  Lock,
  LogOut,
  User,
  ShieldCheck,
  Clock,
  ShieldAlert,
  Activity,
  Search
} from 'lucide-react';
import { useSite } from '../context/SiteContext.tsx';
import { PageId } from '../types/index.ts';
import { GlobalSearchModal } from './common/GlobalSearchModal.tsx';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  openConsultation: () => void;
  quoteItemCount: number;
  openQuoteDrawer: () => void;
  openAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  toggleDarkMode,
  openConsultation,
  quoteItemCount,
  openQuoteDrawer,
  openAdmin
}) => {
  const { 
    config, 
    currentPage, 
    navigateTo, 
    clientUser, 
    logoutClient, 
    setIsAuthModalOpen, 
    setAuthModalTab,
    setIsTrackerModalOpen
  } = useSite();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isApproved = clientUser && clientUser.status === 'approved' && clientUser.isVerified;
  const isPending = clientUser && clientUser.status === 'pending';
  const isAdminUser = clientUser && clientUser.isAdmin === true;

  const navLinks: { label: string; page: PageId; gated?: boolean }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Services', page: 'services', gated: true },
    { label: 'Workflow', page: 'workflow', gated: true },
    { label: 'Projects', page: 'projects', gated: true },
    { label: 'Hardware (GH₵)', page: 'hardware', gated: true },
    { label: 'Estimator', page: 'estimator', gated: true },
    { label: 'Knowledge Base', page: 'knowledge' },
    { label: 'Project Hub & Consultation', page: 'tracker' },
    ...(isAdminUser ? [{ label: 'Inquiries', page: 'inquiries' as PageId }] : []),
    { label: 'Contact', page: 'contact', gated: true },
  ];

  const handleNavClick = (page: PageId) => {
    navigateTo(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Resized compact, ultra-modern navigation bar: h-14 (56px) */}
        <div className="flex items-center justify-between gap-3 h-14">
          {/* Zone 1: Brand logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 shrink-0 py-1 group text-left"
          >
            <img
              src={config.logoUrl}
              alt="DeRoyalTech - Innovate · Build · Grow"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </button>

          {/* Zone 2: Navigation links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page || (link.page === 'tracker' && (currentPage === 'tracker' || currentPage === 'consultation'));
              const isGatedAndNotApproved = link.gated && !isApproved;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.page)}
                  className={`flex items-center gap-1.5 py-1 px-2.5 rounded-md transition-colors whitespace-nowrap shrink-0 text-xs ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-bold'
                      : 'hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <span>{link.label}</span>
                  {isGatedAndNotApproved && (
                    <span title="Client Registration & Approval Required">
                      <Lock className="w-3 h-3 text-slate-400" />
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions & Auth */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Logged in User Badge & Log Out Option with Resized Prominent Verified Badge */}
            {clientUser ? (
              <div className="flex items-center gap-2 pl-2.5 pr-1.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm text-xs">
                {isApproved ? (
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black flex items-center justify-center text-sm shadow-md border-2 border-emerald-400">
                      {clientUser.fullName.charAt(0)}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-sm" title="Verified Partner">
                      <ShieldCheck className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  </div>
                ) : (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs shadow">
                    <Clock className="w-4 h-4" />
                  </div>
                )}

                <div className="hidden sm:block text-left leading-tight">
                  <span className="font-bold text-slate-900 dark:text-white block truncate max-w-[130px] text-xs">
                    {clientUser.fullName}
                  </span>
                  {isApproved ? (
                    <span className="inline-flex items-center gap-1.5 mt-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-100 shrink-0 stroke-[2.5]" />
                      <span>Verified Partner</span>
                    </span>
                  ) : isPending ? (
                    <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      <span>Pending Approval</span>
                    </span>
                  ) : null}
                </div>

                {/* Explicit Log Out Option */}
                <button
                  onClick={logoutClient}
                  title="Sign Out of Client Portal"
                  aria-label="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Log Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthModalTab('register');
                  setIsAuthModalOpen(true);
                }}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-md transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Client Register</span>
              </button>
            )}

            {/* Admin Console Trigger - HIDDEN from clients unless approved admin! */}
            {isAdminUser && (
              <button
                onClick={openAdmin}
                aria-label="Open Admin Console"
                title="Admin Portal - Manage Website & Systems"
                className="px-2.5 py-1 text-xs font-semibold text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/40 hover:bg-orange-200 border border-orange-300 dark:border-orange-800 rounded-md flex items-center gap-1 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-orange-600 animate-spin-slow" />
                <span className="hidden xl:inline">Admin CMS</span>
              </button>
            )}

            {/* Global Search Bar Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              title="Global Search across Services, Team, Hardware & Letters (Ctrl+K)"
              aria-label="Open Global Search"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 min-h-[36px]"
            >
              <Search className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden xl:inline">Search...</span>
              <kbd className="hidden xl:inline font-mono text-[9px] text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-800">⌘K</kbd>
            </button>

            {/* Hardware Quote Drawer Trigger */}
            <button
              onClick={openQuoteDrawer}
              aria-label="View Hardware Quote Cart"
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ShoppingBag className="w-5 h-5 sm:w-4 sm:h-4" />
              {quoteItemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-blue-600 text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                  {quoteItemCount}
                </span>
              )}
            </button>

            {/* Dark / Light Mode Switch */}
            <button
              onClick={toggleDarkMode}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {darkMode ? <Sun className="w-5 h-5 sm:w-4 sm:h-4" /> : <Moon className="w-5 h-5 sm:w-4 sm:h-4" />}
            </button>

            {/* Unified Project Hub & Consultation Action */}
            <button
              onClick={() => handleNavClick('tracker')}
              title="Track Milestone Status or Book Architecture Consultation"
              aria-label="Project Hub and Consultation"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <Activity className="w-3.5 h-3.5 text-blue-200" />
              <span>Project Hub & Consultation</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = currentPage === link.page;
            const isGatedAndNotApproved = link.gated && !isApproved;
            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.page)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md text-left ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <span>{link.label}</span>
                {isGatedAndNotApproved && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                    <Lock className="w-3 h-3" /> Client Only
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {!clientUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalTab('register');
                  setIsAuthModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Client Register & Sign In</span>
              </button>
            ) : (
              <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{clientUser.fullName}</span>
                  {isApproved ? (
                    <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-100 shrink-0 stroke-[2.5]" />
                      <span>Verified Partner ({clientUser.company})</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-500 font-medium">
                      Pending Admin Approval
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    logoutClient();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/40 rounded border border-red-200 dark:border-red-900 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            )}

            {/* Admin CMS option for Mobile - ONLY if admin */}
            {isAdminUser && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-orange-800 dark:text-orange-200 bg-orange-100 dark:bg-orange-950/40 border border-orange-300 dark:border-orange-800 rounded-lg"
              >
                <Settings className="w-4 h-4 text-orange-500" />
                <span>Admin CMS Portal</span>
              </button>
            )}

            {/* Unified Project Hub & Consultation in Mobile Drawer */}
            <button
              onClick={() => handleNavClick('tracker')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
            >
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-200" />
                <span>Project Hub & Consultation</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Search Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Search Platform (Ctrl+K)</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Global Unified Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
};
