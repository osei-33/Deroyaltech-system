import React, { useState, useMemo, useRef } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Printer, 
  Copy, 
  Trash2, 
  Edit3, 
  Check, 
  Send, 
  Building2, 
  Calendar, 
  User, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  X, 
  CheckCircle2, 
  Layers,
  ExternalLink,
  ChevronRight,
  Eye
} from 'lucide-react';
import { useSite } from '../../../context/SiteContext.tsx';
import { OfficialLetter, LetterTemplateType } from '../../../types/index.ts';

const LETTER_TEMPLATES: Record<LetterTemplateType, { name: string; subject: string; content: string }> = {
  proposal: {
    name: 'Enterprise IT Architecture Proposal',
    subject: 'PROPOSAL FOR DEDICATED HYBRID CLOUD INFRASTRUCTURE & ENTERPRISE CRM INTEGRATION',
    content: `We have the honor to submit our technical and commercial proposal for the design, deployment, and ongoing engineering support of your organization's mission-critical technology infrastructure.

DeRoyalTech Systems Limited proposes to architect a fault-tolerant hybrid cloud environment coupled with customized software pipelines tailored to your operational scale in Ghana. Our solution provides:

1. High-Availability Cloud Architecture: Redundant edge nodes deployed across Accra and secondary cloud clusters with guaranteed 99.99% uptime SLA.
2. Bespoke Business Logic & CRM Synchronization: End-to-end telemetry pipelines connecting your branch offices, internal databases, and client-facing web portals.
3. Turnkey Hardware Integration: Dedicated enterprise computer peripherals, local server appliances, and secured automated daily backups.

Our engineering team in Accra stands prepared to begin immediate technical discovery upon execution of this scope. We look forward to partnering with your leadership to drive digital innovation and operational efficiency.`
  },
  quotation: {
    name: 'Hardware & Workstation Quotation Cover',
    subject: 'FORMAL QUOTATION & SLA SPECIFICATIONS FOR COMPUTER HARDWARE SUPPLY',
    content: `Pursuant to your request for quotation, DeRoyalTech Systems Limited is pleased to present our official pricing schedule for the supply, configuration, and on-site deployment of high-density enterprise computing hardware.

All equipment specified includes:
- Comprehensive 3-Year Enterprise Replacement Warranty in Ghana.
- Initial OS hardening, custom corporate disk imaging, and network security configuration.
- Complimentary on-site installation by DeRoyalTech Systems certified hardware engineers in Accra.

Quotations are valid for thirty (30) calendar days from the date of this letter. Payment terms and delivery milestones are outlined in the accompanying schedule.`
  },
  agreement: {
    name: 'Software Service Level Agreement (SLA)',
    subject: 'SERVICE LEVEL AGREEMENT & CONTINUOUS DEVOPS MAINTENANCE',
    content: `This official letter confirms DeRoyalTech Systems Limited's commitment to delivering enterprise-grade technical support, system patching, and continuous infrastructure monitoring under our comprehensive SLA terms.

Under this agreement, our technical response parameters are guaranteed as follows:
- Severity 1 (System Down / Critical Outage): Immediate engineer dispatch; resolution target < 2 hours.
- Severity 2 (Degraded Performance / Core Feature): Technical triage < 4 hours; patch deployment within 24 hours.
- Routine Maintenance & Security Audits: Performed during scheduled low-traffic maintenance windows with zero data loss.

Our dedicated 24/7 DevOps monitoring desk in Accra maintains automated telemetry tracking of your server nodes.`
  },
  sla: {
    name: 'Hardware Telemetry & Zero-Downtime Guarantee',
    subject: 'OFFICIAL ASSURANCE OF TELEMETRY UPTIME & HARDWARE REPLACEMENT GUARANTEE',
    content: `DeRoyalTech Systems Limited hereby issues this formal warranty and telemetry performance guarantee for all edge nodes, computer workstations, and industrial gateway devices deployed at your facilities.

In the event of any hardware component malfunction, our rapid-response replacement unit will be dispatched from our Accra central inventory hub within twenty-four (24) business hours, minimizing downtime and maintaining compliance with your institutional standards.`
  },
  demand: {
    name: 'Formal Scope Adjustment / Notice',
    subject: 'OFFICIAL NOTICE CONCERNING PROJECT MILESTONE COMPLETION & SIGN-OFF',
    content: `We write to officially notify your management that all engineering deliverables associated with Phase I of our technical contract have been successfully implemented, tested under load, and approved for production deployment.

We kindly request that your designated technical representative complete the enclosed milestone sign-off certificate to facilitate the initiation of Phase II operations.`
  },
  custom: {
    name: 'Custom Executive Letter',
    subject: 'OFFICIAL CORRESPONDENCE FROM DEROYALTECH SYSTEMS LIMITED',
    content: `We write to convey our compliments and bring to your esteemed attention the matters outlined below regarding our ongoing technology collaboration and digital infrastructure initiatives.`
  }
};

export const AdminLettersTab: React.FC = () => {
  const { letters, addLetter, updateLetter, deleteLetter, config } = useSite();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingLetterId, setEditingLetterId] = useState<string | null>(null);
  const [previewLetter, setPreviewLetter] = useState<OfficialLetter | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  // Form state for creating/editing letters
  const [formData, setFormData] = useState({
    referenceNumber: `DRT/LTR/${new Date().getFullYear()}/${Math.floor(10 + Math.random() * 90)}`,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    recipientCompany: '',
    recipientName: '',
    recipientTitle: 'Director of Technology',
    recipientAddress: 'Airport Residential Area, Accra, Ghana',
    recipientEmail: '',
    recipientPhone: '',
    subject: '',
    templateType: 'proposal' as LetterTemplateType,
    salutation: 'Dear Sir/Madam,',
    content: '',
    signatoryName: 'Emmanuel Osei',
    signatoryRole: 'Principal Systems Architect & Lead Engineer',
    signatoryPhone: config.contact.phonePrimary || '+233 (0) 30 294 8821',
    status: 'draft' as OfficialLetter['status']
  });

  const handleApplyTemplate = (type: LetterTemplateType) => {
    const tmpl = LETTER_TEMPLATES[type];
    setFormData(prev => ({
      ...prev,
      templateType: type,
      subject: tmpl.subject,
      content: tmpl.content,
      salutation: prev.recipientName ? `Dear ${prev.recipientName},` : 'Dear Sir/Madam,'
    }));
  };

  const handleOpenNew = () => {
    setEditingLetterId(null);
    const tmpl = LETTER_TEMPLATES.proposal;
    setFormData({
      referenceNumber: `DRT/LTR/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      recipientCompany: '',
      recipientName: '',
      recipientTitle: 'Managing Director',
      recipientAddress: 'Accra, Greater Accra Region, Ghana',
      recipientEmail: '',
      recipientPhone: '',
      subject: tmpl.subject,
      templateType: 'proposal',
      salutation: 'Dear Sir/Madam,',
      content: tmpl.content,
      signatoryName: 'Emmanuel Osei',
      signatoryRole: 'Chief Technology Officer & Solutions Architect',
      signatoryPhone: config.contact.phonePrimary || '+233 (0) 30 294 8821',
      status: 'draft'
    });
    setIsEditorOpen(true);
  };

  const handleEdit = (letter: OfficialLetter) => {
    setEditingLetterId(letter.id);
    setFormData({
      referenceNumber: letter.referenceNumber,
      date: letter.date,
      recipientCompany: letter.recipientCompany,
      recipientName: letter.recipientName,
      recipientTitle: letter.recipientTitle || '',
      recipientAddress: letter.recipientAddress || '',
      recipientEmail: letter.recipientEmail || '',
      recipientPhone: letter.recipientPhone || '',
      subject: letter.subject,
      templateType: letter.templateType,
      salutation: letter.salutation,
      content: letter.content,
      signatoryName: letter.signatoryName,
      signatoryRole: letter.signatoryRole,
      signatoryPhone: letter.signatoryPhone || '',
      status: letter.status
    });
    setIsEditorOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipientCompany || !formData.subject || !formData.content) return;

    if (editingLetterId) {
      updateLetter(editingLetterId, formData);
    } else {
      addLetter(formData);
    }
    setIsEditorOpen(false);
    setEditingLetterId(null);
  };

  const filteredLetters = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return (letters || []).filter((l) => {
      const matchStatus = selectedStatus === 'all' || l.status === selectedStatus;
      if (!matchStatus) return false;
      if (!q) return true;
      return (
        l.recipientCompany.toLowerCase().includes(q) ||
        l.recipientName.toLowerCase().includes(q) ||
        l.referenceNumber.toLowerCase().includes(q) ||
        l.subject.toLowerCase().includes(q)
      );
    });
  }, [letters, searchQuery, selectedStatus]);

  const handleCopyLetter = (letter: OfficialLetter) => {
    const text = `
=============================================================
DEROYALTECH SYSTEMS LIMITED — OFFICIAL CORRESPONDENCE
Suite 402, Standard Chartered Building, Airport City, Accra, Ghana
Tel: ${config.contact.phonePrimary} | Email: ${config.contact.emailGeneral}
Web: https://deroyal.tech
=============================================================

REF: ${letter.referenceNumber}
DATE: ${letter.date}

TO:
${letter.recipientName}
${letter.recipientTitle ? letter.recipientTitle + '\n' : ''}${letter.recipientCompany}
${letter.recipientAddress || 'Accra, Ghana'}

SUBJECT: ${letter.subject}

${letter.salutation}

${letter.content}

Yours faithfully,

${letter.signatoryName}
${letter.signatoryRole}
DeRoyalTech Systems Limited
Tel: ${letter.signatoryPhone || config.contact.phonePrimary}
`;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text.trim());
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <span>Official Company Letters & Proposals</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Draft, issue, preview, and print official letters on DeRoyalTech Systems letterhead for corporate clients and institutions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Write Official Letter</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by company, recipient, reference number or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          {['all', 'draft', 'issued', 'sent', 'archived'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors whitespace-nowrap ${
                selectedStatus === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Letters List */}
      <div className="space-y-3">
        {filteredLetters.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 text-xs space-y-3">
            <FileText className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-medium">No official letters found matching your criteria.</p>
            <button
              type="button"
              onClick={handleOpenNew}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
            >
              Compose First Letter
            </button>
          </div>
        ) : (
          filteredLetters.map((letter) => {
            const statusColor = 
              letter.status === 'issued' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300' :
              letter.status === 'sent' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300' :
              letter.status === 'draft' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300' :
              'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300';

            return (
              <div
                key={letter.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-900">
                      {letter.referenceNumber}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${statusColor}`}>
                      {letter.status}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{letter.date}</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {letter.subject}
                  </h4>

                  <div className="text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-semibold flex items-center gap-1 text-slate-900 dark:text-white">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{letter.recipientCompany}</span>
                    </span>
                    {letter.recipientName && (
                      <span className="text-slate-500 dark:text-slate-400">
                        Attn: {letter.recipientName} ({letter.recipientTitle || 'Executive'})
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewLetter(letter)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                    title="View DeRoyalTech Letterhead"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Letterhead</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyLetter(letter)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Copy Text"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEdit(letter)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Edit Letter"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteLetter(letter.id)}
                    className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                    title="Delete Letter"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h4 className="text-sm font-bold">
                  {editingLetterId ? 'Edit Official Letter' : 'Compose Official Letter'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Quick Template Picker */}
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 space-y-2">
                <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load Corporate Template:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(LETTER_TEMPLATES) as LetterTemplateType[]).map((tKey) => (
                    <button
                      key={tKey}
                      type="button"
                      onClick={() => handleApplyTemplate(tKey)}
                      className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      {LETTER_TEMPLATES[tKey].name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reference & Date & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.referenceNumber}
                    onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="issued">Issued</option>
                    <option value="sent">Sent to Recipient</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Recipient Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Recipient Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Ghana Commercial Bank (GCB) PLC"
                    value={formData.recipientCompany}
                    onChange={(e) => setFormData({ ...formData, recipientCompany: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Contact Person Name & Title
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="e.g., Mr. Kwame Asante"
                      value={formData.recipientName}
                      onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="e.g., Chief Technology Officer"
                      value={formData.recipientTitle}
                      onChange={(e) => setFormData({ ...formData, recipientTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Recipient Physical Address / City
                </label>
                <input
                  type="text"
                  placeholder="e.g., GCB Head Office, High Street, Accra, Ghana"
                  value={formData.recipientAddress}
                  onChange={(e) => setFormData({ ...formData, recipientAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              {/* Subject Line */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Subject Line (RE:) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., PROPOSAL: ENTERPRISE CLOUD ARCHITECTURE & HIGH-DENSITY SERVER RACKS"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              {/* Salutation */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Salutation
                </label>
                <input
                  type="text"
                  value={formData.salutation}
                  onChange={(e) => setFormData({ ...formData, salutation: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              {/* Body Content */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Letter Body Paragraphs *
                </label>
                <textarea
                  required
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                />
              </div>

              {/* Signatory Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Signatory Name
                  </label>
                  <input
                    type="text"
                    value={formData.signatoryName}
                    onChange={(e) => setFormData({ ...formData, signatoryName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Signatory Role & Organization
                  </label>
                  <input
                    type="text"
                    value={formData.signatoryRole}
                    onChange={(e) => setFormData({ ...formData, signatoryRole: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-colors"
                >
                  {editingLetterId ? 'Save Changes' : 'Issue Letter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official DeRoyalTech Letterhead Print & Preview Modal */}
      {previewLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-4xl my-auto bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-300 flex flex-col">
            {/* Control Bar (hidden in browser print) */}
            <div className="print:hidden p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold tracking-wide uppercase">
                  DeRoyalTech Systems • Official Document Preview
                </span>
                <span className="font-mono text-xs text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                  {previewLetter.referenceNumber}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyLetter(previewLetter)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLetter(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* A4 Document Body Container */}
            <div className="p-8 sm:p-14 bg-white text-slate-900 font-sans space-y-6 leading-relaxed relative selection:bg-indigo-100">
              {/* Letterhead Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-indigo-900">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-white font-extrabold text-xl shadow-md border border-indigo-500/40">
                    DRT
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950">
                      DEROYALTECH SYSTEMS LIMITED
                    </h2>
                    <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Enterprise Cloud Infrastructure · Custom CRM · Hardware Telemetry
                    </p>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-600 space-y-0.5">
                  <div className="font-semibold text-slate-900">Head Office: Accra, Ghana</div>
                  <div>Standard Chartered Bldg, Airport City</div>
                  <div>Tel: {config.contact.phonePrimary}</div>
                  <div>Web: www.deroyaltech.com</div>
                </div>
              </div>

              {/* Reference Number & Date */}
              <div className="flex items-center justify-between text-xs pt-2 font-mono">
                <div>
                  <span className="font-bold text-slate-500">REF: </span>
                  <span className="font-extrabold text-indigo-900">{previewLetter.referenceNumber}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500">DATE: </span>
                  <span className="font-semibold text-slate-900">{previewLetter.date}</span>
                </div>
              </div>

              {/* Recipient Block */}
              <div className="text-xs text-slate-800 space-y-0.5 pt-2">
                <div className="font-bold text-slate-950 text-sm">{previewLetter.recipientName}</div>
                {previewLetter.recipientTitle && <div className="text-slate-600 font-medium">{previewLetter.recipientTitle}</div>}
                <div className="font-bold text-indigo-950">{previewLetter.recipientCompany}</div>
                {previewLetter.recipientAddress && <div className="text-slate-600">{previewLetter.recipientAddress}</div>}
              </div>

              {/* Subject Line */}
              <div className="pt-3 pb-1 border-b border-slate-200">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-950 tracking-tight uppercase">
                  RE: {previewLetter.subject}
                </h3>
              </div>

              {/* Salutation */}
              <div className="text-xs font-semibold text-slate-900">
                {previewLetter.salutation}
              </div>

              {/* Content Paragraphs */}
              <div className="text-xs sm:text-sm text-slate-800 space-y-4 whitespace-pre-line leading-relaxed text-justify">
                {previewLetter.content}
              </div>

              {/* Formal Sign-Off */}
              <div className="pt-6 space-y-4">
                <div className="text-xs text-slate-700">Yours faithfully,</div>

                {/* Digital Seal & Signature Block */}
                <div className="pt-2 flex items-end justify-between">
                  <div className="space-y-1">
                    <div className="font-serif italic text-lg sm:text-xl text-indigo-900 font-bold border-b border-slate-400 pb-1 inline-block pr-6">
                      {previewLetter.signatoryName}
                    </div>
                    <div className="text-xs font-bold text-slate-950">{previewLetter.signatoryName}</div>
                    <div className="text-[11px] text-slate-600">{previewLetter.signatoryRole}</div>
                    <div className="text-[11px] text-slate-500 font-mono">DeRoyalTech Systems Limited · Accra, Ghana</div>
                  </div>

                  {/* Certified Seal Stamp */}
                  <div className="border-2 border-indigo-700/60 rounded-xl p-2.5 text-center text-[10px] text-indigo-900 bg-indigo-50/60 font-mono font-bold space-y-0.5 rotate-[-2deg] shadow-sm">
                    <div className="flex items-center justify-center gap-1 text-indigo-700">
                      <ShieldCheck className="w-4 h-4" />
                      <span>AUTHENTICATED</span>
                    </div>
                    <div className="text-[9px] text-slate-600">DEROYALTECH SYSTEMS</div>
                    <div className="text-[8px] text-slate-500">ACCRA, GHANA</div>
                  </div>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="pt-8 mt-8 border-t border-slate-200 text-center text-[10px] text-slate-500 space-y-0.5 font-mono">
                <div>DeRoyalTech Systems Limited · Registered in the Republic of Ghana · RC-2024-8921</div>
                <div>Airport City & Spintex Tech Corridor, Greater Accra · 24/7 DevOps Operations Hub</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copy Toast */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-xl text-xs flex items-center gap-2 border border-slate-700">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Letter formatted and copied to clipboard!</span>
        </div>
      )}
    </div>
  );
};
