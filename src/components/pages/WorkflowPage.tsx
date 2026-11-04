import React from 'react';
import { ArrowLeft, ShieldCheck, Zap, Server, Cpu, Database, Activity } from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { WorkflowSimulator } from '../WorkflowSimulator.tsx';

interface WorkflowPageProps {
  openConsultation: (scope?: string) => void;
}

export const WorkflowPage: React.FC<WorkflowPageProps> = ({ openConsultation }) => {
  const { navigateTo, clientUser } = useSite();

  return (
    <div className="py-8 sm:py-12 space-y-12">
      {/* Breadcrumb Header */}
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
              <span>Verified Client Session: {clientUser.company}</span>
            </div>
          )}
        </div>

        <div className="pt-8 max-w-3xl space-y-3">
          <div className="text-xs font-bold font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>Dedicated Workflow Hub & Telemetry Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Hardware-to-Cloud Integration Simulator
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            DeRoyalTech unifies physical hardware peripherals—RFID scanners, biometric POS terminals, and edge gateway servers—with custom cloud CRM architectures. Test the live interactive simulator below to observe data propagation and sub-millisecond pipeline sync.
          </p>
        </div>
      </div>

      {/* Simulator Component */}
      <WorkflowSimulator />

      {/* Workflow Integration Architecture Specs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold">Need Custom Hardware Data Automation for Your Facility?</h3>
              <p className="text-xs text-slate-400">
                We design custom firmware hooks, IoT gateways, and direct ERP/CRM synchronization for ports, warehouses, retail chains, and hospitals.
              </p>
            </div>
            <button
              onClick={() => openConsultation('Hardware Workflow Integration Inquiry')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shrink-0 shadow-sm"
            >
              Discuss Your Facility Architecture
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
