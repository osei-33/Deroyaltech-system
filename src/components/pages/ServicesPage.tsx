import React from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, Globe, Smartphone, Server, Cpu, Layers } from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { ServicesSection } from '../ServicesSection.tsx';

interface ServicesPageProps {
  openConsultation: (scope?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ openConsultation }) => {
  const { navigateTo, clientUser } = useSite();

  return (
    <div className="py-8 sm:py-12 space-y-12">
      {/* Page Header & Navigation Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>

          {clientUser && (
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verified Session: {clientUser.company}</span>
            </div>
          )}
        </div>

        <div className="pt-8 max-w-3xl space-y-3">
          <div className="text-xs font-bold font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Dedicated Services Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Enterprise Software, Custom CRM & Cloud Engineering
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            DeRoyalTech designs, develops, and delivers resilient digital infrastructure: custom high-performance web applications, native mobile ecosystems, bespoke CRM platforms, and automated multi-cloud deployments with local hardware peripheral synchronization.
          </p>
        </div>
      </div>

      {/* Services Section Bento & Interactive Capabilities */}
      <ServicesSection
        onSelectServiceForEstimate={(_serviceId) => {
          navigateTo('estimator');
        }}
        openConsultation={() => openConsultation('Services Engineering Scope')}
      />

      {/* Technical Standards Guarantee */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Full Source Code Ownership</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              100% of IP, repositories, database schemas, and cloud deployment pipelines are transferred to your enterprise upon delivery.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>SLA-Backed 99.99% Uptime</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Rigorous DevOps health monitoring, automated failover Kubernetes pods, and disaster recovery architectures.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Local On-Premises & Cloud Support</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Dedicated field engineering teams based in Accra, Ghana, ready for rapid on-site and remote response.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
