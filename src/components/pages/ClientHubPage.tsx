import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Search, 
  Send, 
  ShieldCheck, 
  UserCheck, 
  Phone, 
  Mail, 
  Building, 
  MessageSquare,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Cpu,
  AlertCircle
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { ConsultationPage } from './ConsultationPage.tsx';
import { TrackProjectPage } from './TrackProjectPage.tsx';
import { ProjectWebNotificationManager } from '../tracker/ProjectWebNotificationManager.tsx';

interface ClientHubPageProps {
  initialTab?: 'consultation' | 'tracker';
}

export const ClientHubPage: React.FC<ClientHubPageProps> = ({ initialTab }) => {
  const { currentPage, navigateTo, trackerSearchId } = useSite();
  const [activeTab, setActiveTab] = useState<'consultation' | 'tracker'>(() => {
    if (initialTab) return initialTab;
    if (currentPage === 'tracker' || trackerSearchId) return 'tracker';
    return 'consultation';
  });

  useEffect(() => {
    if (currentPage === 'tracker') {
      setActiveTab('tracker');
    } else if (currentPage === 'consultation') {
      setActiveTab('consultation');
    }
  }, [currentPage]);

  const handleTabSwitch = (tab: 'consultation' | 'tracker') => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen pb-16 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      {/* Unified Client Services & Project Hub Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white pt-14 pb-12 sm:pt-16 sm:pb-14 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unified Client Engagement & Operations Desk</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Client Project Hub & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Architecture Consultation
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            Schedule an executive architecture discovery session with our lead engineers in Accra, or verify real-time sprint milestones and hardware telemetry for your active project.
          </p>

          {/* Unified Two-in-One Segmented Switcher */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-xl backdrop-blur-md">
              <button
                type="button"
                onClick={() => handleTabSwitch('consultation')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'consultation'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Consultation</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch('tracker')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'tracker'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Track Live Project</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Web Notifications Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ProjectWebNotificationManager />
      </div>

      {/* Render Active View without Page Reload */}
      <div className="w-full max-w-full overflow-x-hidden">
        {activeTab === 'consultation' ? (
          <ConsultationPage embedded={true} />
        ) : (
          <TrackProjectPage embedded={true} />
        )}
      </div>
    </div>
  );
};
