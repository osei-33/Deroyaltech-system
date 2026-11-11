import React, { useState } from 'react';
import { 
  Home, 
  Layers, 
  ShoppingBag, 
  Activity, 
  BookOpen, 
  Menu, 
  X, 
  Calculator, 
  Workflow, 
  Film, 
  PhoneCall, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Settings, 
  User, 
  ArrowRight,
  Inbox
} from 'lucide-react';
import { useSite } from '../context/SiteContext.tsx';
import { PageId } from '../types/index.ts';

interface MobileBottomNavProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  openConsultation: () => void;
  quoteItemCount: number;
  openQuoteDrawer: () => void;
  openAdmin: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  darkMode,
  toggleDarkMode,
  openConsultation,
  quoteItemCount,
  openQuoteDrawer,
  openAdmin
}) => {
  const { 
    currentPage, 
    navigateTo, 
    setIsTrackerModalOpen, 
    clientUser,
    setIsAuthModalOpen,
    setAuthModalTab
  } = useSite();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const handleNav = (page: PageId) => {
    navigateTo(page);
    setIsMoreMenuOpen(false);
  };

  const isAdminUser = clientUser && clientUser.isAdmin === true;

  return (
    <>
      {/* Mobile Bottom Navigation Bar (Visible only on < lg screens) */}
      <nav 
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 transition-colors shadow-lg"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)' }}
      >
        <div className="grid grid-cols-5 items-center h-14 px-1 max-w-md mx-auto">
          {/* 1. Home */}
          <button
            type="button"
            onClick={() => handleNav('home')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] py-1 transition-all active:scale-95 ${
              currentPage === 'home' && !isMoreMenuOpen
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">Home</span>
            {currentPage === 'home' && !isMoreMenuOpen && (
              <span className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />
            )}
          </button>

          {/* 2. Services */}
          <button
            type="button"
            onClick={() => handleNav('services')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] py-1 transition-all active:scale-95 ${
              currentPage === 'services' && !isMoreMenuOpen
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">Services</span>
            {currentPage === 'services' && !isMoreMenuOpen && (
              <span className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />
            )}
          </button>

          {/* 3. Hardware Store + Cart Badge */}
          <button
            type="button"
            onClick={() => handleNav('hardware')}
            className={`relative flex flex-col items-center justify-center h-full min-h-[44px] py-1 transition-all active:scale-95 ${
              currentPage === 'hardware' && !isMoreMenuOpen
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {quoteItemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono shadow-sm">
                  {quoteItemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Store</span>
            {currentPage === 'hardware' && !isMoreMenuOpen && (
              <span className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />
            )}
          </button>

          {/* 4. Track Project (Direct Page Route) */}
          <button
            type="button"
            onClick={() => handleNav('tracker')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] py-1 transition-all active:scale-95 ${
              currentPage === 'tracker' && !isMoreMenuOpen
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            <div className="relative">
              <Activity className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-semibold">Hub & Track</span>
            {(currentPage === 'tracker' || currentPage === 'consultation') && !isMoreMenuOpen && (
              <span className="w-1 h-1 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-0.5" />
            )}
          </button>

          {/* 5. More Hub */}
          <button
            type="button"
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] py-1 transition-all active:scale-95 ${
              isMoreMenuOpen || ['knowledge', 'workflow', 'projects', 'estimator', 'contact'].includes(currentPage)
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {isMoreMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span className="text-[10px] tracking-tight mt-0.5">{isMoreMenuOpen ? 'Close' : 'Hub'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile "Hub" Bottom Drawer Action Sheet */}
      {isMoreMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150 flex flex-col justify-end"
          onClick={() => setIsMoreMenuOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 shadow-2xl p-5 pb-24 max-h-[82vh] overflow-y-auto animate-in slide-in-from-bottom-6 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle indicator */}
            <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                DeRoyalTech Mobile Hub
              </span>
              <button 
                onClick={toggleDarkMode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => handleNav('consultation')}
                className="p-3 rounded-2xl bg-blue-600 text-white font-semibold text-xs flex flex-col items-start gap-1 shadow-md shadow-blue-600/20 active:scale-[0.98] transition-transform"
              >
                <PhoneCall className="w-4 h-4" />
                <span className="text-sm font-bold">Book Brief</span>
                <span className="text-[11px] text-blue-100">Schedule Discovery</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  openQuoteDrawer();
                }}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs flex flex-col items-start gap-1 border border-slate-200 dark:border-slate-700 active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center justify-between w-full">
                  <ShoppingBag className="w-4 h-4 text-blue-500" />
                  {quoteItemCount > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-blue-600 text-white rounded-full">
                      {quoteItemCount}
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold">Quote Cart</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Review Equipment</span>
              </button>
            </div>

            {/* Destination List */}
            <div className="space-y-1 mb-4">
              <button
                type="button"
                onClick={() => handleNav('knowledge')}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors text-xs font-semibold ${
                  currentPage === 'knowledge'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-sky-500" />
                  <div>
                    <span className="block text-sm font-bold">Knowledge Base (FAQ)</span>
                    <span className="text-[11px] text-slate-400 font-normal">Self-service solutions and onboarding guides</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNav('estimator')}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors text-xs font-semibold ${
                  currentPage === 'estimator'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calculator className="w-4 h-4 text-emerald-500" />
                  <div>
                    <span className="block text-sm font-bold">Scope & Cost Estimator</span>
                    <span className="text-[11px] text-slate-400 font-normal">Interactive budget calculator (GH₵)</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNav('workflow')}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors text-xs font-semibold ${
                  currentPage === 'workflow'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Workflow className="w-4 h-4 text-indigo-500" />
                  <div>
                    <span className="block text-sm font-bold">Workflow Hub</span>
                    <span className="text-[11px] text-slate-400 font-normal">Hardware & CRM pipeline simulator</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNav('projects')}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors text-xs font-semibold ${
                  currentPage === 'projects'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Film className="w-4 h-4 text-orange-500" />
                  <div>
                    <span className="block text-sm font-bold">Projects & MP4 Videos</span>
                    <span className="text-[11px] text-slate-400 font-normal">Case studies and video walk-throughs</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleNav('contact')}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors text-xs font-semibold ${
                  currentPage === 'contact'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-blue-500" />
                  <div>
                    <span className="block text-sm font-bold">Contact Hub & Offices</span>
                    <span className="text-[11px] text-slate-400 font-normal">Accra Airport City & Spintex standby lines</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Client Account & Admin Portal Controls */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              {!clientUser ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    setAuthModalTab('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 rounded-xl border border-blue-200 dark:border-blue-800"
                >
                  <User className="w-4 h-4" />
                  <span>Client Register / Sign In</span>
                </button>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{clientUser.fullName}</span>
                      <span className="text-[10px] text-slate-400">{clientUser.company}</span>
                    </div>
                  </div>
                </div>
              )}

              {isAdminUser && (
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => handleNav('inquiries')}
                    className="w-full flex items-center justify-center gap-2 p-3 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800 rounded-xl"
                  >
                    <Inbox className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>View All Client Inquiries</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      openAdmin();
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3 text-xs font-bold text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/40 border border-orange-300 dark:border-orange-800 rounded-xl"
                  >
                    <Settings className="w-4 h-4 text-orange-600" />
                    <span>Open Admin Console</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
