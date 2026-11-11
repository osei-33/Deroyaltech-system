import React from 'react';
import { ArrowLeft, ShieldCheck, DollarSign, Calculator, HelpCircle } from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { SolutionEstimator } from '../SolutionEstimator.tsx';

interface EstimatorPageProps {
  onApplyScopeToBrief: (configSummary: string) => void;
}

export const EstimatorPage: React.FC<EstimatorPageProps> = ({ onApplyScopeToBrief }) => {
  const { config, navigateTo, clientUser } = useSite();

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
              <span>Verified Session: {clientUser.company}</span>
            </div>
          )}
        </div>

        <div className="pt-8 max-w-3xl space-y-3">
          <div className="text-xs font-bold font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-orange-500" />
            <span>Interactive Scope & Investment Matrix</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Solution Scope & Timeline Estimator (GH₵)
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Configure target software modules, cloud DevOps topologies, and hardware peripheral fleet requirements to generate transparent delivery timelines and pricing benchmarks in Ghanaian Cedis ({config.currencySymbol}).
          </p>
        </div>
      </div>

      {/* Solution Estimator Component */}
      <SolutionEstimator
        onApplyScopeToBrief={onApplyScopeToBrief}
      />
    </div>
  );
};
