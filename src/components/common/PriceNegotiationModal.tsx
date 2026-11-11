import React, { useState } from 'react';
import { 
  Tag, 
  X, 
  Check, 
  Send, 
  DollarSign, 
  Building, 
  Mail, 
  Phone, 
  User, 
  Sparkles, 
  CheckCircle2, 
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';

export const PriceNegotiationModal: React.FC = () => {
  const { 
    isNegotiationModalOpen, 
    setIsNegotiationModalOpen, 
    negotiationTargetItem, 
    submitNegotiation, 
    clientUser,
    config,
    getAdjustedPrice
  } = useSite();

  const [proposedPrice, setProposedPrice] = useState<number>(() => {
    if (negotiationTargetItem) {
      const current = getAdjustedPrice(negotiationTargetItem.price, negotiationTargetItem.type === 'software' ? 'software' : 'hardware');
      return Math.round(current * 0.9); // Default suggestion: 10% discount
    }
    return 1000;
  });

  const [quantity, setQuantity] = useState<number>(1);
  const [fullName, setFullName] = useState(clientUser?.fullName || '');
  const [email, setEmail] = useState(clientUser?.email || '');
  const [phone, setPhone] = useState(clientUser?.phone || '+233 ');
  const [company, setCompany] = useState(clientUser?.company || '');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isNegotiationModalOpen || !negotiationTargetItem) {
    return null;
  }

  const currentAdjustedPrice = getAdjustedPrice(
    negotiationTargetItem.price, 
    negotiationTargetItem.type === 'software' ? 'software' : 'hardware'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !proposedPrice) return;

    setIsSubmitting(true);
    try {
      await submitNegotiation({
        itemType: negotiationTargetItem.type,
        itemId: negotiationTargetItem.id,
        itemTitle: negotiationTargetItem.title,
        originalPrice: currentAdjustedPrice,
        offeredPrice: Number(proposedPrice),
        quantity: Number(quantity) || 1,
        clientName: fullName,
        clientEmail: email,
        clientPhone: phone,
        clientNotes: notes
      });
      setSubmittedSuccess(true);
    } catch (err) {
      console.error('Error submitting negotiation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsNegotiationModalOpen(false);
    setSubmittedSuccess(false);
  };

  const diffAmount = proposedPrice - currentAdjustedPrice;
  const diffPercent = currentAdjustedPrice > 0 ? Math.round((diffAmount / currentAdjustedPrice) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Commercial Price Negotiation</h4>
              <p className="text-[11px] text-slate-300">Submit a proposal to DeRoyalTech Executive Desk</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Price Proposal Submitted!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Your commercial proposal of <strong className="text-slate-900 dark:text-white font-mono">GH₵ {proposedPrice.toLocaleString()}</strong> for <em>"{negotiationTargetItem.title}"</em> has been transmitted to our senior commercial team in Accra. You will receive real-time notifications once reviewed.
            </p>
            <div className="pt-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {/* Item Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                  Selected Item ({negotiationTargetItem.type})
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  Current List Price: <strong className="text-slate-900 dark:text-white font-mono">GH₵ {currentAdjustedPrice.toLocaleString()}</strong>
                </span>
              </div>
              <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {negotiationTargetItem.title}
              </h5>
            </div>

            {/* Proposed Price & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Your Proposed Offer Price (GH₵) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">GH₵</span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(Number(e.target.value))}
                    className="w-full pl-12 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between font-mono">
                  <span>Delta vs List:</span>
                  <span className={diffPercent < 0 ? 'text-amber-500 font-bold' : 'text-emerald-500 font-bold'}>
                    {diffPercent}% (GH₵ {diffAmount.toLocaleString()})
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Volume orders receive prioritized review</span>
              </div>
            </div>

            {/* Client Contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kwame Mensah"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. k.mensah@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. West Africa Shippers"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Justification & Context */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Commercial Scope & Justification Notes
              </label>
              <textarea
                rows={2}
                placeholder="Mention deployment scale, timeline, or non-profit/corporate tier..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Transmitting...' : 'Submit Price Proposal'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
