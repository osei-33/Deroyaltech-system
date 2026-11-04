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
  Activity
} from 'lucide-react';
import { useSite } from '../context/SiteContext.tsx';
import { PageId } from '../types/index.ts';

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

  const navLinks: { label: string; page: PageId; gated?: boolean }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Services', page: 'services', gated: true },
    { label: 'Workflow Hub', page: 'workflow', gated: true },
    { label: 'Projects & MP4', page: 'projects', gated: true },
    { label: 'Hardware Store (GH₵)', page: 'hardware', gated: true },
    { label: 'Estimator', page: 'estimator', gated: true },
    { label: 'Knowledge Base', page: 'knowledge' },
    { label: 'Contact Hub', page: 'contact', gated: true },
  ];

  const isApproved = clientUser && clientUser.status === 'approved' && clientUser.isVerified;
  const isPending = clientUser && clientUser.status === 'pending';
  const isAdminUser = clientUser && clientUser.isAdmin === true;

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
              const isActive = currentPage === link.page;
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
            {/* Logged in User Badge & Log Out Option */}
            {clientUser ? (
              <div className="flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                {isApproved ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shadow-sm">
                    {clientUser.fullName.charAt(0)}
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[10px]">
                    <Clock className="w-3 h-3" />
                  </div>
                )}

                <div className="hidden sm:block text-left text-[11px] leading-tight">
                  <span className="font-semibold text-slate-900 dark:text-white block truncate max-w-[110px]">
                    {clientUser.fullName}
                  </span>
                  {isApproved ? (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Partner</span>
                    </span>
                  ) : isPending ? (
                    <span className="text-[10px] text-amber-500 font-medium">
                      Pending Approval
                    </span>
                  ) : null}
                </div>

                {/* Explicit Log Out Option */}
                <button
                  onClick={logoutClient}
                  title="Sign Out of Client Portal"
                  aria-label="Sign Out"
                  className="p-1 text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 text-[11px] font-medium"
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

            {/* Track Project Status Trigger */}
            <button
              onClick={() => setIsTrackerModalOpen(true)}
              title="Track Project Status with Project ID"
              aria-label="Track Project Status"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 rounded-md transition-colors whitespace-nowrap"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Track Project</span>
            </button>

            {/* Consultation CTA */}
            <button
              onClick={openConsultation}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <span>Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
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

            {/* Track Project in Mobile Drawer */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsTrackerModalOpen(true);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Track Project (By ID)</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openConsultation();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-slate-900 dark:bg-slate-800 rounded-lg"
            >
              <span>Schedule Architecture Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
