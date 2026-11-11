import React, { useState } from 'react';
import { 
  Percent, 
  Tag, 
  Check, 
  X, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Send, 
  DollarSign, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight,
  Clock,
  UserCheck,
  Building,
  Mail,
  Phone,
  Layers,
  RefreshCw
} from 'lucide-react';
import { useSite } from '../../../context/SiteContext.tsx';
import { PriceNegotiation, NegotiationStatus } from '../../../types/index.ts';

export const AdminNegotiationsTab: React.FC = () => {
  const { 
    config, 
    negotiations, 
    respondToNegotiation, 
    updateGlobalPriceAdjustment,
    getAdjustedPrice,
    formatPrice 
  } = useSite();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'countered' | 'rejected'>('all');
  const [globalPercentInput, setGlobalPercentInput] = useState<number>(config.globalPriceAdjustmentPercent || 0);
  const [targetCategory, setTargetCategory] = useState<'all' | 'software' | 'hardware'>('all');
  const [isApplyingPercent, setIsApplyingPercent] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Counter offer modal state
  const [counterNegotiationId, setCounterNegotiationId] = useState<string | null>(null);
  const [counterPriceInput, setCounterPriceInput] = useState<number>(0);
  const [counterNoteInput, setCounterNoteInput] = useState<string>('');

  const currentPercent = config.globalPriceAdjustmentPercent || 0;

  const handleApplyPercentage = async () => {
    setIsApplyingPercent(true);
    try {
      await updateGlobalPriceAdjustment(globalPercentInput, targetCategory);
      setToastMessage(`Successfully updated pricing margin by ${globalPercentInput >= 0 ? '+' : ''}${globalPercentInput}% across ${targetCategory === 'all' ? 'all software and hardware' : targetCategory}!`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsApplyingPercent(false);
    }
  };

  const handlePresetSelect = (percent: number) => {
    setGlobalPercentInput(percent);
  };

  const handleApprove = async (neg: PriceNegotiation) => {
    await respondToNegotiation(neg.id, 'approve', undefined, 'Commercial terms approved by DeRoyalTech Executive Operations.');
    setToastMessage(`Offer approved for ${neg.clientName}! Client notified of approved price.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReject = async (neg: PriceNegotiation) => {
    await respondToNegotiation(neg.id, 'reject', undefined, 'Price offer below production & SLA cost threshold.');
    setToastMessage(`Offer rejected for ${neg.clientName}.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openCounterDialog = (neg: PriceNegotiation) => {
    setCounterNegotiationId(neg.id);
    setCounterPriceInput(Math.round((neg.originalPrice + neg.offeredPrice) / 2));
    setCounterNoteInput('We can offer a special partner rate of GH₵ ' + Math.round((neg.originalPrice + neg.offeredPrice) / 2).toLocaleString() + ' with full 2-year warranty and enterprise SLA.');
  };

  const submitCounterOffer = async () => {
    if (!counterNegotiationId) return;
    await respondToNegotiation(counterNegotiationId, 'counter', counterPriceInput, counterNoteInput);
    setCounterNegotiationId(null);
    setToastMessage('Counter-offer sent to client with updated commercial terms.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredNegotiations = (negotiations || []).filter(n => {
    if (activeFilter === 'all') return true;
    return n.status === activeFilter;
  });

  const pendingCount = (negotiations || []).filter(n => n.status === 'pending').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              COMMERCIAL MARGINS & PRICE NEGOTIATIONS
            </span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 animate-pulse">
                {pendingCount} Pending Review
              </span>
            )}
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            Price Negotiations & Global Margins Controller
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Add or remove bulk percentage margins on all software and hardware products, and review, counter, or approve client price proposals.
          </p>
        </div>
      </div>

      {/* SECTION 1: GLOBAL PERCENTAGE CONTROLLER */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Percent className="w-5 h-5 text-blue-500" />
              <span>Bulk Product Percentage Margin Modifier</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Instantly markup (+) or discount (-) prices across your entire hardware and software catalog.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
              currentPercent > 0 
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                : currentPercent < 0
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}>
              Active Modifier: {currentPercent >= 0 ? `+${currentPercent}` : currentPercent}%
            </span>
          </div>
        </div>

        {/* Category Scope Selector */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="text-slate-400 font-normal">Target Category:</span>
          {[
            { id: 'all', label: 'All Products (Software & Hardware)' },
            { id: 'software', label: 'Software & CRM Only' },
            { id: 'hardware', label: 'Hardware Peripherals Only' }
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setTargetCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                targetCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Slider & Input Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="-50"
              max="100"
              step="1"
              value={globalPercentInput}
              onChange={(e) => setGlobalPercentInput(Number(e.target.value))}
              className="flex-1 h-3 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex items-center gap-1 shrink-0 w-28">
              <input
                type="number"
                min="-50"
                max="100"
                value={globalPercentInput}
                onChange={(e) => setGlobalPercentInput(Number(e.target.value))}
                className="w-20 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-center text-sm font-bold font-mono text-slate-900 dark:text-white"
              />
              <span className="text-sm font-bold text-slate-500">%</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-semibold text-[11px]">Quick Presets:</span>
            {[
              { label: '-25% Flash Sale', val: -25 },
              { label: '-15% Promo', val: -15 },
              { label: '-10% Corporate Partner', val: -10 },
              { label: '0% Standard List', val: 0 },
              { label: '+10% Inflation / Duty Buffer', val: 10 },
              { label: '+15% Peak Demand Surcharge', val: 15 },
              { label: '+25% Priority Queue', val: 25 }
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(p.val)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-colors ${
                  globalPercentInput === p.val
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Price Simulation Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Sample Base Price</span>
              <strong className="text-slate-800 dark:text-slate-200 text-sm font-mono">GH₵ 10,000</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Applied Percentage</span>
              <strong className={`text-sm font-mono ${globalPercentInput > 0 ? 'text-emerald-600' : globalPercentInput < 0 ? 'text-amber-600' : 'text-slate-600'}`}>
                {globalPercentInput >= 0 ? `+${globalPercentInput}` : globalPercentInput}%
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Simulated Client Price</span>
              <strong className="text-blue-600 dark:text-blue-400 text-base font-mono font-bold">
                GH₵ {Math.round(10000 * (1 + globalPercentInput / 100)).toLocaleString()}
              </strong>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleApplyPercentage}
              disabled={isApplyingPercent}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{isApplyingPercent ? 'Enforcing Pricing...' : 'Apply & Enforce Margin On All Products'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: CLIENT PRICE NEGOTIATIONS QUEUE */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-500" />
              <span>Client Price Negotiations & Proposals Queue</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review commercial discount requests submitted by clients. Approve, reject, or propose a counter-offer.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            {(['all', 'pending', 'approved', 'countered', 'rejected'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  activeFilter === tab
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Negotiations Cards List */}
        {filteredNegotiations.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            No price negotiations found in this filter category.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNegotiations.map(neg => {
              const diffPercent = Math.round(((neg.offeredPrice - neg.originalPrice) / neg.originalPrice) * 100);
              return (
                <div 
                  key={neg.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-slate-400">
                          {neg.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {neg.itemType}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          neg.status === 'approved'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : neg.status === 'countered'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                            : neg.status === 'rejected'
                            ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse'
                        }`}>
                          {neg.status}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {neg.itemTitle}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-mono">Submitted</span>
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                        {new Date(neg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Pricing Comparison Box */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs font-mono">
                    <div>
                      <span className="text-[10px] font-sans text-slate-400 block uppercase">Original List Price</span>
                      <span className="text-slate-500 line-through">GH₵ {neg.originalPrice.toLocaleString()}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-sans text-slate-400 block uppercase">Client Proposed Price</span>
                      <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">GH₵ {neg.offeredPrice.toLocaleString()}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-sans text-slate-400 block uppercase">Discount Requested</span>
                      <span className={`font-bold ${diffPercent < 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {diffPercent}% (GH₵ {(neg.offeredPrice - neg.originalPrice).toLocaleString()})
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-sans text-slate-400 block uppercase">Quantity</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{neg.quantity || 1} Unit(s)</span>
                    </div>
                  </div>

                  {/* Client Info & Justification */}
                  <div className="space-y-2 text-xs">
                    <div className="flex flex-wrap items-center gap-3 text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                        {neg.clientName}
                      </span>
                      {neg.clientEmail && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {neg.clientEmail}
                        </span>
                      )}
                      {neg.clientPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {neg.clientPhone}
                        </span>
                      )}
                    </div>

                    {neg.clientNotes && (
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs italic">
                        "{neg.clientNotes}"
                      </div>
                    )}

                    {/* Admin Response Record if responded */}
                    {neg.adminResponse && (
                      <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-blue-900 dark:text-blue-300">
                          <span>Admin Decision: {neg.adminResponse.action.toUpperCase()}</span>
                          <span className="font-mono font-normal text-slate-400">
                            {new Date(neg.adminResponse.respondedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {neg.adminResponse.counterPrice && (
                          <div className="font-mono font-bold text-blue-600 dark:text-blue-400">
                            Counter Offer: GH₵ {neg.adminResponse.counterPrice.toLocaleString()}
                          </div>
                        )}
                        {neg.adminResponse.adminNotes && (
                          <p className="text-slate-600 dark:text-slate-300">
                            {neg.adminResponse.adminNotes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  {neg.status === 'pending' && (
                    <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => handleReject(neg)}
                        className="px-3.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject Offer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openCounterDialog(neg)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Propose Counter Offer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApprove(neg)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Proposed Price</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Counter Offer Modal */}
      {counterNegotiationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-500" />
                <span>Submit Counter-Offer Commercial Terms</span>
              </h4>
              <button
                type="button"
                onClick={() => setCounterNegotiationId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Counter Offer Price (in Ghanaian Cedis GH₵) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={counterPriceInput}
                  onChange={(e) => setCounterPriceInput(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Executive Notes & Terms for Client *
                </label>
                <textarea
                  rows={3}
                  value={counterNoteInput}
                  onChange={(e) => setCounterNoteInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCounterNegotiationId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitCounterOffer}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md"
              >
                Dispatch Counter Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-slate-950 text-white rounded-2xl shadow-xl text-xs flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
