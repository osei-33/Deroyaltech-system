import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Check, 
  ShoppingBag, 
  Cpu, 
  ShieldCheck, 
  Truck, 
  HelpCircle,
  Activity,
  Play,
  Tag
} from 'lucide-react';
import { HARDWARE_HERO_IMAGE } from '../data/companyData.ts';
import { HardwareCategory, HardwareProduct } from '../types/index.ts';
import { useSite } from '../context/SiteContext.tsx';
import { HardwareTelemetryModal } from './hardware/HardwareTelemetryModal.tsx';

interface HardwareCatalogProps {
  onAddToCart: (product: HardwareProduct) => void;
  openQuoteDrawer: () => void;
  quoteItemCount: number;
  openConsultation: () => void;
}

export const HardwareCatalog: React.FC<HardwareCatalogProps> = ({
  onAddToCart,
  openQuoteDrawer,
  quoteItemCount,
  openConsultation
}) => {
  const { hardwareProducts, formatPrice, config, openNegotiationModal } = useSite();
  const [selectedCategory, setSelectedCategory] = useState<HardwareCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [telemetryModalProduct, setTelemetryModalProduct] = useState<HardwareProduct | null>(null);

  const filteredProducts = hardwareProducts.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.values(product.specs).some(val => val.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAdd = (product: HardwareProduct) => {
    onAddToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1200);
  };

  return (
    <section id="hardware" className="py-20 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-2">
            Enterprise Hardware & Peripherals Supply
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ textWrap: 'balance' }}>
            High-performance workstations, telemetry gateways & industrial peripherals.
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            DeRoyalTech provides turnkey hardware procurement, custom rackmount configuration, and specialized peripherals fully tested for software compatibility and real-time CRM data workflows.
          </p>
        </div>

        {/* Marquee Banner: Hardware Lab & Workstation Showcase */}
        <div className="mb-12 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-lg relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-6 sm:p-10 text-white space-y-4">
              <span className="text-xs font-semibold font-mono uppercase tracking-wider text-blue-400">
                Single-Vendor Assurance
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Eliminate hardware and software finger-pointing.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                When you procure computer workstations, edge servers, and industrial scanners through DeRoyalTech, your hardware arrives pre-flashed, asset-tagged, and verified against your custom software and cloud endpoints.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400" /> 3 to 5-Year Enterprise Warranties
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-400" /> Staged & Imaged Before Shipment
                </span>
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-blue-400" /> Burn-In Stress Tested
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden">
              <img
                src={HARDWARE_HERO_IMAGE}
                alt="DeRoyalTech Enterprise Computer Hardware and Peripherals"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Catalog Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 text-xs font-medium scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Peripherals ({hardwareProducts.length})
            </button>
            <button
              onClick={() => setSelectedCategory('workstations')}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === 'workstations'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Workstations & Racks
            </button>
            <button
              onClick={() => setSelectedCategory('networking')}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === 'networking'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Network & Gateways
            </button>
            <button
              onClick={() => setSelectedCategory('scanners-pos')}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === 'scanners-pos'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Scanners & POS
            </button>
            <button
              onClick={() => setSelectedCategory('displays-docks')}
              className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === 'displays-docks'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Displays & Docks
            </button>
          </div>

          {/* Search Box & Quote Cart Trigger */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search specs, SKU, model..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {quoteItemCount > 0 && (
              <button
                onClick={openQuoteDrawer}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quote ({quoteItemCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isJustAdded = addedProductId === product.id;

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 group"
              >
                <div>
                  {/* Hardware Image Preview with Interactive View Demo Trigger */}
                  <div className="relative w-full h-44 mb-4 rounded-xl bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-800/80 group/img">
                    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />
                    
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="max-h-[82%] max-w-[82%] object-contain filter drop-shadow-md transition-transform duration-300 group-hover/img:scale-110"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />

                    {/* Quick View Demo Button floating on image */}
                    <button
                      type="button"
                      onClick={() => setTelemetryModalProduct(product)}
                      className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-blue-600/95 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all active:scale-95"
                      title="Launch Hardware Live Telemetry Demo"
                    >
                      <Activity className="w-3.5 h-3.5 animate-pulse" />
                      <span>View Demo</span>
                    </button>

                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-900/85 text-[10px] font-mono text-slate-300 border border-slate-700/60">
                      {product.sku}
                    </div>
                  </div>

                  {/* Top Metadata */}
                  <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {product.stockStatus}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      Ghana Hub Stock
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {product.tagline}
                  </p>

                  {/* Key Specs Breakdown */}
                  <div className="space-y-1.5 py-3 border-t border-b border-slate-100 dark:border-slate-800 text-[11px] font-mono">
                    {Object.entries(product.specs).slice(0, 3).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-start gap-2">
                        <span className="text-slate-400 uppercase text-[10px] shrink-0">{key}:</span>
                        <span className="text-slate-700 dark:text-slate-200 text-right truncate">{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Integration note */}
                  <div className="mt-3 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{product.integrationReady}</span>
                  </div>
                </div>

                {/* Price and Action Buttons */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-base sm:text-lg font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-normal">
                      Enterprise Ghana MSRP
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {/* Explicit 'View Demo' Button */}
                    <button
                      type="button"
                      onClick={() => setTelemetryModalProduct(product)}
                      className="min-h-[38px] px-2.5 py-1 text-xs font-bold rounded-lg border border-blue-500/40 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all flex items-center gap-1 shadow-sm active:scale-95"
                      title="Launch Hardware Live Telemetry Demo"
                    >
                      <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                      <span>Demo</span>
                    </button>

                    {/* Negotiate Price Button */}
                    <button
                      type="button"
                      onClick={() => openNegotiationModal({
                        id: product.id,
                        title: product.name,
                        price: product.price,
                        type: 'hardware'
                      })}
                      className="min-h-[38px] px-2.5 py-1 text-xs font-bold rounded-lg border border-amber-500/40 bg-amber-50/80 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-all flex items-center gap-1 shadow-sm active:scale-95"
                      title="Negotiate wholesale or custom project pricing"
                    >
                      <Tag className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Negotiate</span>
                    </button>

                    {/* Add to Quote Button */}
                    <button
                      onClick={() => handleAdd(product)}
                      className={`min-h-[38px] px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 active:scale-95 ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white'
                      }`}
                      title="Add to Hardware Quote Cart"
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Quote</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No matching computer peripherals found
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try adjusting your search criteria or contact our hardware engineering desk for custom specifications.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-blue-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Hardware Telemetry Live Demo Modal */}
      <HardwareTelemetryModal
        product={telemetryModalProduct}
        onClose={() => setTelemetryModalProduct(null)}
        onAddToCart={handleAdd}
      />
    </section>
  );
};
