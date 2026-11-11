import React, { useState, useMemo } from 'react';
import { 
  Inbox, 
  Search, 
  Filter, 
  Trash2, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  MessageSquare, 
  User, 
  Layers, 
  Coins, 
  Lock, 
  ArrowLeft,
  Save,
  Check,
  ShieldCheck,
  X
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { InquiryItem } from '../../types/index.ts';

export const AdminInquiriesPage: React.FC = () => {
  const { 
    inquiries, 
    updateInquiryStatus, 
    addInquiryNote,
    deleteInquiry, 
    clientUser, 
    openChatWithContext,
    navigateTo,
    adminLogin,
    setIsAdminOpen
  } = useSite();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [adminNotesText, setAdminNotesText] = useState<string>('');
  const [savedNotesToast, setSavedNotesToast] = useState<string | null>(null);

  // Gated check: must have admin role
  const isAdmin = clientUser?.isAdmin;

  const handlePinUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    const success = adminLogin(adminPin);
    if (!success) {
      setPinError('Invalid administrator PIN. (Default: admin)');
    }
  };

  const filteredInquiries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return inquiries.filter((inq) => {
      const matchesStatus = selectedStatus === 'all' || inq.status === selectedStatus;
      if (!matchesStatus) return false;
      if (!q) return true;

      const name = (inq.fullName || '').toLowerCase();
      const email = (inq.email || '').toLowerCase();
      const company = (inq.company || '').toLowerCase();
      const domain = (inq.projectType || '').toLowerCase();
      const msg = (inq.message || '').toLowerCase();
      const id = (inq.id || '').toLowerCase();

      return (
        name.includes(q) ||
        email.includes(q) ||
        company.includes(q) ||
        domain.includes(q) ||
        msg.includes(q) ||
        id.includes(q)
      );
    });
  }, [inquiries, selectedStatus, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: inquiries.length,
      newCount: inquiries.filter(i => i.status === 'New').length,
      inProgressCount: inquiries.filter(i => i.status === 'In Progress').length,
      contactedCount: inquiries.filter(i => i.status === 'Contacted').length,
      closedCount: inquiries.filter(i => i.status === 'Closed').length
    };
  }, [inquiries]);

  const handleSaveNotes = (id: string) => {
    addInquiryNote(id, adminNotesText);
    setEditingNotesId(null);
    setSavedNotesToast('Notes updated successfully');
    setTimeout(() => setSavedNotesToast(null), 2500);
  };

  const getStatusBadge = (status: InquiryItem['status']) => {
    switch (status) {
      case 'New':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'Contacted':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      case 'Closed':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-800 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold">Admin Privileges Required</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The Client Inquiries dashboard is restricted to authorized DeRoyalTech systems administrators.
            </p>
          </div>

          {pinError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 text-xs">
              {pinError}
            </div>
          )}

          <form onSubmit={handlePinUnlock} className="space-y-3">
            <input
              type="password"
              placeholder="Enter Administrator PIN..."
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-center font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              Authenticate as Administrator
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      {/* Top Header Banner */}
      <section className="bg-slate-900 text-white border-b border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  CMS Administration Portal
                </span>
                <span className="text-xs text-slate-400">Authenticated: {clientUser.fullName}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2.5">
                <Inbox className="w-7 h-7 text-blue-400" />
                <span>Client Inquiries & RFQ Management</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAdminOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <span>Full Admin CMS Modal</span>
              </button>
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Website</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`p-3.5 rounded-2xl text-left border transition-all ${
                selectedStatus === 'all' 
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-md' 
                  : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Inquiries</span>
              <span className="text-xl font-bold font-mono">{stats.total}</span>
            </button>

            <button
              onClick={() => setSelectedStatus('New')}
              className={`p-3.5 rounded-2xl text-left border transition-all ${
                selectedStatus === 'New' 
                  ? 'bg-amber-600/20 border-amber-500 text-white shadow-md' 
                  : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                <span>New / Unread</span>
                {stats.newCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
              </span>
              <span className="text-xl font-bold font-mono text-amber-400">{stats.newCount}</span>
            </button>

            <button
              onClick={() => setSelectedStatus('In Progress')}
              className={`p-3.5 rounded-2xl text-left border transition-all ${
                selectedStatus === 'In Progress' 
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-md' 
                  : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-blue-400 block">In Progress</span>
              <span className="text-xl font-bold font-mono text-blue-400">{stats.inProgressCount}</span>
            </button>

            <button
              onClick={() => setSelectedStatus('Contacted')}
              className={`p-3.5 rounded-2xl text-left border transition-all ${
                selectedStatus === 'Contacted' 
                  ? 'bg-purple-600/20 border-purple-500 text-white shadow-md' 
                  : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-purple-400 block">Contacted</span>
              <span className="text-xl font-bold font-mono text-purple-400">{stats.contactedCount}</span>
            </button>

            <button
              onClick={() => setSelectedStatus('Closed')}
              className={`p-3.5 rounded-2xl text-left border transition-all ${
                selectedStatus === 'Closed' 
                  ? 'bg-slate-700 border-slate-500 text-white shadow-md' 
                  : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Resolved / Closed</span>
              <span className="text-xl font-bold font-mono text-slate-300">{stats.closedCount}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client, company, email, or scope..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {['all', 'New', 'In Progress', 'Contacted', 'Closed'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedStatus === st
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {st === 'all' ? 'All' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Toast */}
        {savedNotesToast && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{savedNotesToast}</span>
          </div>
        )}

        {/* Inquiries List */}
        {filteredInquiries.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <Inbox className="w-12 h-12 text-slate-400 mx-auto opacity-60" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No inquiries match your criteria
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Incoming client requests from the Contact page or Consultation scheduler will automatically appear here in real time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInquiries.map((inq) => {
              const isEditingNotes = editingNotesId === inq.id;

              return (
                <div
                  key={inq.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-md space-y-5 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                >
                  {/* Top Row: ID, Name, Company, Timestamp & Status Dropdown */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                        {inq.id}
                      </span>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {inq.fullName}
                      </h3>

                      <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{inq.company}</span>
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(inq.status)}`}>
                        {inq.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(inq.createdAt).toLocaleString()}</span>
                      </span>

                      {/* Status Selector */}
                      <select
                        value={inq.status}
                        onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="New">Status: New</option>
                        <option value="In Progress">Status: In Progress</option>
                        <option value="Contacted">Status: Contacted</option>
                        <option value="Closed">Status: Closed</option>
                      </select>

                      {/* Delete Inquiry (Reactive, no modal lock) */}
                      <button
                        type="button"
                        onClick={() => deleteInquiry(inq.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                        title="Delete this inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Metas Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block font-sans text-[10px] uppercase">Business Email</span>
                      <a href={`mailto:${inq.email}`} className="text-blue-600 dark:text-blue-400 hover:underline truncate block">
                        {inq.email}
                      </a>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block font-sans text-[10px] uppercase">Phone / WhatsApp</span>
                      <span className="text-slate-800 dark:text-slate-200">{inq.phone || 'Not provided'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block font-sans text-[10px] uppercase">Budget (GH₵ Cedis)</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{inq.budget || 'Custom Quote'}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block font-sans text-[10px] uppercase">Timeline / Scope</span>
                      <span className="text-slate-800 dark:text-slate-200 capitalize">{inq.projectType} · {inq.timeline || 'Flexible'}</span>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Client Specification & Message:</span>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {inq.message}
                    </div>
                  </div>

                  {/* Internal Admin Notes */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        Internal Technical Review Notes:
                      </span>
                      {!isEditingNotes && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNotesId(inq.id);
                            setAdminNotesText(inq.adminNotes || '');
                          }}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                        >
                          {inq.adminNotes ? 'Edit Notes' : '+ Add Technical Notes'}
                        </button>
                      )}
                    </div>

                    {isEditingNotes ? (
                      <div className="space-y-2">
                        <textarea
                          rows={3}
                          value={adminNotesText}
                          onChange={(e) => setAdminNotesText(e.target.value)}
                          placeholder="Add internal notes regarding scope assessment, lead architect assignment, or preliminary BOM cost..."
                          className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSaveNotes(inq.id)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Notes</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingNotesId(null)}
                            className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : inq.adminNotes ? (
                      <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-950 dark:text-blue-200 leading-relaxed italic">
                        "{inq.adminNotes}"
                      </div>
                    ) : null}
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`mailto:${inq.email}?subject=DeRoyalTech Follow-up: Inquiry [${inq.id}] for ${inq.company}`}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply via Email</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => openChatWithContext(`Follow-up on Client Inquiry [${inq.id}] for ${inq.fullName} (${inq.company})`)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                        <span>Start Support Chat</span>
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono">
                      Domain: <span className="text-slate-700 dark:text-slate-300 uppercase">{inq.projectType}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
