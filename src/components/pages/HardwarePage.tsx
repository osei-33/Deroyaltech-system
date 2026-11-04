import React from 'react';
import { ArrowLeft, ShieldCheck, ShoppingBag, Truck, CheckCircle2, Shield, Wrench } from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { HardwareCatalog } from '../HardwareCatalog.tsx';
import { HardwareProduct } from '../../types/index.ts';

interface HardwarePageProps {
  onAddToCart: (product: HardwareProduct) => void;
  openQuoteDrawer: () => void;
  quoteItemCount: number;
  openConsultation: (scope?: string) => void;
}

export const HardwarePage: React.FC<HardwarePageProps> = ({
  onAddToCart,
  openQuoteDrawer,
  quoteItemCount,
  openConsultation
}) => {
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

          <div className="flex items-center gap-4">
            {clientUser && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verified Client: {clientUser.company}</span>
              </div>
            )}

            <button
              onClick={openQuoteDrawer}
              className="relative px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-colors shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Quote Cart</span>
              {quoteItemCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-orange-500 text-white text-[10px] font-mono">
                  {quoteItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="pt-8 max-w-3xl space-y-3">
          <div className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Dedicated Enterprise Hardware Store
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Computer Hardware Peripherals & IoT Supply
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            DeRoyalTech sources, configures, and warranties tier-1 enterprise computing equipment in Accra, Ghana. All products are priced in Ghanaian Cedis ({config.currencySymbol}) and ready for immediate deployment and CRM API integration.
          </p>
        </div>
      </div>

      {/* Hardware Catalog Component */}
      <HardwareCatalog
        onAddToCart={onAddToCart}
        openQuoteDrawer={openQuoteDrawer}
        quoteItemCount={quoteItemCount}
        openConsultation={openConsultation}
      />

      {/* Procurement & Warranty Policies */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Truck className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Fast Delivery Across Ghana
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Dispatch from our Airport City & Spintex tech distribution centers with 24-48 hour delivery to Greater Accra, Kumasi, and Takoradi.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Shield className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Enterprise Local Warranty
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Standard 3-year hardware replacement warranties with in-country spare parts and factory-certified engineering technicians.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Wrench className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Turnkey Software Staging
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Pre-flashed OS, DeRoyalTech telemetry agents, custom VPN certificates, and API tokens configured prior to shipment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
