import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  Search,
  CheckCircle2,
  ArrowRight,
  Tag,
  ShieldCheck,
  Lock,
  RefreshCw,
  Activity
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { PriceNegotiation } from '../../types/index.ts';

export const ClientServiceNotificationModal: React.FC = () => {
  const {
    isClientNotificationModalOpen,
    setIsClientNotificationModalOpen,
    negotiations,
    serviceRequests,
    trackedProjects,
    formatPrice,
    openNegotiationModal,
    respondToNegotiation,
    openTrackerForId,
    navigateTo,
    clientServiceIds,
    registerClientServiceId,
    removeClientServiceId,
    refreshFromServer
  } = useSite();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterId, setActiveFilterId] = useState<string>('');
  const [isAccepting, setIsAccepting] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pull latest admin decisions from backend immediately when modal opens
  useEffect(() => {
    if (isClientNotificationModalOpen) {
      setIsRefreshing(true);
      refreshFromServer().finally(() => setIsRefreshing(false));
    }
  }, [isClientNotificationModalOpen, refreshFromServer]);

  if (!isClientNotificationModalOpen) return null;

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshFromServer();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchQuery.trim().toUpperCase();
    if (!clean) return;

    registerClientServiceId(clean);
    setActiveFilterId(clean);
    setSearchQuery('');
    setIsRefreshing(true);
    try {
      await refreshFromServer();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSelectQuickId = (id: string) => {
    setActiveFilterId(id);
  };

  const handleRemoveId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeClientServiceId(id);
    if (activeFilterId === id) {
      setActiveFilterId('');
    }
  };

  const targetIds = activeFilterId
    ? [activeFilterId.toUpperCase()]
    : clientServiceIds.map(i => i.toUpperCase());

  // Strict exact-ID matching prevents any client from viewing another client's notifications
  const matchingNegotiations = (negotiations || []).filter(neg => {
    if (targetIds.length === 0) return false;
    return targetIds.some(target => neg.id.toUpperCase() === target);
  });

  const matchingServiceRequests = (serviceRequests || []).filter(req => {
    if (targetIds.length === 0) return false;
    return targetIds.some(
      target =>
        req.id.toUpperCase() === target ||
        (req.assignedProjectId && req.assignedProjectId.toUpperCase() === target)
    );
  });

  const matchingTrackedProjects = (trackedProjects || []).filter(proj => {
    if (targetIds.length === 0) return false;
    return targetIds.some(
      target =>
        proj.projectId.toUpperCase() === target ||
        (proj.requestId && proj.requestId.toUpperCase() === target)
    );
  });

  const handleAcceptCounterOffer = async (neg: PriceNegotiation) => {
    if (!neg.adminResponse?.counterPrice) return;
    setIsAccepting(neg.id);
    try {
      await respondToNegotiation(
        neg.id,
        'approve',
        neg.adminResponse.counterPrice,
        `Client accepted counter-offer of GH₵ ${neg.adminResponse.counterPrice.toLocaleString()}`
      );
    } catch (err) {
      console.error('Error accepting counter-offer:', err);
    } finally {
      setIsAccepting(null);
    }
  };

  const totalAlertsCount =
    matchingNegotiations.length + matchingServiceRequests.length + matchingTrackedProjects.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Client Service Notifications Desk
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Confidential Vault</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Private live status alerts for service approvals, rejections, counter-offers, and project tracking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              title="Refresh decisions from main backend"
              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => setIsClientNotificationModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Confidentiality Privacy Banner */}
        <div className="px-6 py-2.5 bg-blue-50/70 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/50 flex items-start gap-2.5 text-xs text-blue-950 dark:text-blue-200">
          <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-semibold text-blue-700 dark:text-blue-300">Confidentiality Guarantee: </strong>
            To protect commercial privacy, price decisions and service updates are strictly filtered by your unique <strong>Service ID (REQ-...)</strong>, <strong>Negotiation Ref (NEG-...)</strong>, or <strong>Project ID (DRT-...)</strong>.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Service ID Query Form */}
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Enter Service ID or Negotiation Reference:</span>
              {activeFilterId && (
                <button
                  type="button"
                  onClick={() => setActiveFilterId('')}
                  className="text-blue-600 dark:text-blue-400 text-xs hover:underline flex items-center gap-1 lowercase"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>show all my saved IDs</span>
                </button>
              )}
            </label>

            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Enter exact ID (e.g. REQ-2026-412, NEG-..., DRT-2026-7841)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-mono placeholder:font-sans focus:outline-none focus:border-blue-500 shadow-2xs"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                Verify ID
              </button>
            </div>

            {/* Quick Saved IDs Chips */}
            {clientServiceIds.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 font-medium">Your Active IDs:</span>
                {clientServiceIds.map(id => {
                  const isActive = activeFilterId === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleSelectQuickId(id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span>{id}</span>
                      <span
                        onClick={(e) => handleRemoveId(e, id)}
                        title="Remove ID from local session"
                        className="hover:text-red-400 transition-colors ml-0.5 p-0.5 rounded"
                      >
                        ×
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </form>

          {/* Results List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">
              <span>Verified Decision Alerts ({totalAlertsCount})</span>
              <span>
                {isRefreshing
                  ? 'Syncing live...'
                  : activeFilterId
                  ? `Filtered by ${activeFilterId}`
                  : 'Your Entered Service IDs'}
              </span>
            </div>

            {totalAlertsCount === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeFilterId ? `No Records Found for "${activeFilterId}"` : 'Enter Your Private Service ID to View Alerts'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Only decisions matching the exact Service Request ID, Negotiation Ref, or Project Tracker ID you enter are displayed here, preventing any other client from viewing your pricing alerts.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                {/* Negotiations Cards */}
                {matchingNegotiations.map((neg) => {
                  const isApproved = neg.status === 'approved';
                  const isCountered = neg.status === 'countered';
                  const isRejected = neg.status === 'rejected';
                  const agreedFinalPrice = neg.adminResponse?.counterPrice || neg.offeredPrice;

                  return (
                    <div
                      key={neg.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isApproved
                          ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
                          : isCountered
                          ? 'border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 shadow-sm'
                          : isRejected
                          ? 'border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20'
                          : 'border-blue-200 dark:border-blue-800 bg-slate-50 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              {neg.id}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full ${
                                isApproved
                                  ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                                  : isCountered
                                  ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                                  : isRejected
                                  ? 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-700'
                                  : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                              }`}
                            >
                              {isApproved
                                ? 'Approved by Leadership'
                                : isCountered
                                ? 'Admin Counter-Offer Received'
                                : isRejected
                                ? 'Price Offer Declined'
                                : 'Review in Progress'}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-1">
                            {neg.itemTitle}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Requested for: <span className="font-semibold text-slate-700 dark:text-slate-300">{neg.clientName}</span> ({neg.clientEmail})
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {new Date(neg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Pricing Comparison */}
                      <div className="mt-3.5 p-3 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">List MSRP</span>
                          <span className="font-mono text-slate-500 line-through">
                            {formatPrice(neg.originalPrice)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-blue-500 block">Your Offer</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {formatPrice(neg.offeredPrice)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-emerald-500 block">
                            {isCountered ? 'Admin Counter' : isApproved ? 'Final Approved' : isRejected ? 'Decision' : 'Status'}
                          </span>
                          <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400">
                            {isCountered && neg.adminResponse?.counterPrice
                              ? formatPrice(neg.adminResponse.counterPrice)
                              : isApproved
                              ? formatPrice(agreedFinalPrice)
                              : isRejected
                              ? 'Declined'
                              : 'Pending'}
                          </span>
                        </div>
                      </div>

                      {/* Admin Decision Notes */}
                      {neg.adminResponse?.adminNotes && (
                        <div className="mt-3 p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-slate-700 dark:text-slate-200 space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                            <span>Official Leadership Note:</span>
                            <span>{neg.adminResponse.adminName}</span>
                          </div>
                          <p className="italic">"{neg.adminResponse.adminNotes}"</p>
                        </div>
                      )}

                      {/* Action Triggers for Counter-Offers */}
                      {isCountered && neg.adminResponse?.counterPrice && (
                        <div className="mt-3 flex flex-wrap items-center gap-2 pt-1">
                          <button
                            type="button"
                            disabled={isAccepting === neg.id}
                            onClick={() => handleAcceptCounterOffer(neg)}
                            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>
                              {isAccepting === neg.id
                                ? 'Accepting...'
                                : `Accept Counter-Offer (${formatPrice(neg.adminResponse.counterPrice)})`}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setIsClientNotificationModalOpen(false);
                              openNegotiationModal({
                                id: neg.itemId,
                                title: neg.itemTitle,
                                price: neg.adminResponse?.counterPrice || neg.originalPrice,
                                type: neg.itemType
                              });
                            }}
                            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-colors flex items-center gap-1.5"
                          >
                            <Tag className="w-3.5 h-3.5" />
                            <span>Propose Revised Offer</span>
                          </button>
                        </div>
                      )}

                      {/* Approved CTAs */}
                      {isApproved && (
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsClientNotificationModalOpen(false);
                              navigateTo('tracker');
                            }}
                            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors flex items-center gap-1.5"
                          >
                            <span>Open Project Hub & Scope Review</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Service Requests Cards */}
                {matchingServiceRequests.map(req => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {req.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                            req.status === 'confirmed' || req.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : req.status === 'declined'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          }`}
                        >
                          {req.status}
                        </span>
                        {req.assignedProjectId && (
                          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                            Tracker: {req.assignedProjectId}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {req.projectTitle} · <span className="text-slate-500 font-normal">{req.serviceTitle}</span>
                    </h4>

                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-1">
                      <span>Enterprise Budget Allocated:</span>
                      <strong className="font-mono text-blue-600 dark:text-blue-400">{formatPrice(req.estimatedBudget)}</strong>
                    </div>

                    {req.adminNotes && (
                      <p className="text-xs italic bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                        "{req.adminNotes}"
                      </p>
                    )}

                    {req.assignedProjectId && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsClientNotificationModalOpen(false);
                          openTrackerForId(req.assignedProjectId!);
                        }}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors inline-flex items-center gap-1.5"
                      >
                        <Activity className="w-3.5 h-3.5" />
                        <span>Track Project Milestones ({req.assignedProjectId})</span>
                      </button>
                    )}
                  </div>
                ))}

                {/* Direct Tracked Project Lookup Cards */}
                {matchingTrackedProjects.map(proj => (
                  <div
                    key={proj.projectId}
                    className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                          {proj.projectId}
                        </span>
                        <span className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                          {proj.progressPercent}% Complete
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {proj.stageLabel}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{proj.title}</h4>
                    <button
                      type="button"
                      onClick={() => {
                        setIsClientNotificationModalOpen(false);
                        openTrackerForId(proj.projectId);
                      }}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 dark:bg-blue-600 hover:opacity-90 text-white inline-flex items-center gap-1.5"
                    >
                      <span>Open Full Milestone & Cloud Backup Timeline</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>End-to-End Enterprise Privacy Encryption</span>
          </div>

          <button
            type="button"
            onClick={() => setIsClientNotificationModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
