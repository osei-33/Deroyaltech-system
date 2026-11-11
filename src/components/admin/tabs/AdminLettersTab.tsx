import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Eye,
  Mail,
  MessageSquare,
  QrCode,
  Smartphone,
  Monitor,
  Settings
} from 'lucide-react';
import QRCode from 'qrcode';
import { useSite } from '../../../context/SiteContext.tsx';
import { OfficialLetter, LetterTemplateType, LetterheadConfig } from '../../../types/index.ts';

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
  const { letters, addLetter, updateLetter, deleteLetter, config, updateConfig } = useSite();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingLetterId, setEditingLetterId] = useState<string | null>(null);
  const [previewLetter, setPreviewLetter] = useState<OfficialLetter | null>(null);
  const [previewQrCode, setPreviewQrCode] = useState<string>('');
  const [copiedToast, setCopiedToast] = useState(false);

  // Letterhead Configuration Modal
  const [isLetterheadModalOpen, setIsLetterheadModalOpen] = useState(false);
  const [letterheadForm, setLetterheadForm] = useState<LetterheadConfig>(() => ({
    companyName: config.letterhead?.companyName || 'DeRoyalTech Systems Limited',
    tagline: config.letterhead?.tagline || 'Enterprise Cloud Infrastructure · Custom CRM · Hardware Telemetry',
    logoUrl: config.letterhead?.logoUrl || config.logoUrl || '/logo.svg',
    physicalAddress: config.letterhead?.physicalAddress || 'Suite 402, Standard Chartered Building, Airport City & Spintex Tech Corridor, Accra, Ghana',
    phone: config.letterhead?.phone || config.contact.phonePrimary || '+233 (0) 30 294 8821',
    email: config.letterhead?.email || config.contact.emailGeneral || 'info@deroyaltech.com',
    website: config.letterhead?.website || 'www.deroyaltech.com',
    regNumber: config.letterhead?.regNumber || 'RC-2024-8921',
    sealText: config.letterhead?.sealText || 'AUTHENTICATED · DEROYALTECH SYSTEMS · ACCRA, GHANA'
  }));

  // Reactive Print State
  const [isPrinting, setIsPrinting] = useState(false);
  const [printToast, setPrintToast] = useState<string | null>(null);

  // AI Letter Generator Modal
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiObjective, setAiObjective] = useState('');
  const [aiRecipientCompany, setAiRecipientCompany] = useState('');
  const [aiRecipientName, setAiRecipientName] = useState('');
  const [aiKeyPoints, setAiKeyPoints] = useState('');
  const [aiTone, setAiTone] = useState('Formal Executive');

  // Direct Responsive Email Dispatch Modal
  const [emailDispatchLetter, setEmailDispatchLetter] = useState<OfficialLetter | null>(null);
  const [dispatchRecipientEmail, setDispatchRecipientEmail] = useState('');
  const [dispatchSubject, setDispatchSubject] = useState('');
  const [dispatchNote, setDispatchNote] = useState('');
  const [dispatchPreviewDevice, setDispatchPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccessToast, setDispatchSuccessToast] = useState(false);

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

  // Generate QR Code for Previewed Letter
  useEffect(() => {
    if (previewLetter) {
      const verifyUrl = `${window.location.origin}/#verify?ref=${encodeURIComponent(previewLetter.referenceNumber)}`;
      QRCode.toDataURL(verifyUrl, {
        width: 140,
        margin: 1,
        color: {
          dark: '#020617',
          light: '#ffffff'
        }
      })
        .then((url) => setPreviewQrCode(url))
        .catch((err) => console.error('Error generating letter QR code:', err));
    } else {
      setPreviewQrCode('');
    }
  }, [previewLetter]);

  const activeLetterhead: LetterheadConfig = useMemo(() => ({
    companyName: config.letterhead?.companyName || letterheadForm.companyName || 'DeRoyalTech Systems Limited',
    tagline: config.letterhead?.tagline || letterheadForm.tagline || 'Enterprise Cloud Infrastructure · Custom CRM · Hardware Telemetry',
    logoUrl: config.letterhead?.logoUrl || letterheadForm.logoUrl || config.logoUrl || '/logo.svg',
    physicalAddress: config.letterhead?.physicalAddress || letterheadForm.physicalAddress || 'Suite 402, Standard Chartered Building, Airport City & Spintex Tech Corridor, Accra, Ghana',
    phone: config.letterhead?.phone || letterheadForm.phone || config.contact.phonePrimary || '+233 (0) 30 294 8821',
    email: config.letterhead?.email || letterheadForm.email || config.contact.emailGeneral || 'info@deroyaltech.com',
    website: config.letterhead?.website || letterheadForm.website || 'www.deroyaltech.com',
    regNumber: config.letterhead?.regNumber || letterheadForm.regNumber || 'RC-2024-8921',
    sealText: config.letterhead?.sealText || letterheadForm.sealText || 'AUTHENTICATED · DEROYALTECH SYSTEMS · ACCRA, GHANA'
  }), [config.letterhead, config.contact, config.logoUrl, letterheadForm]);

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

  const handleSaveLetterhead = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({ letterhead: letterheadForm });
    setIsLetterheadModalOpen(false);
  };

  // Generate Letter with AI
  const handleGenerateAiLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingAi(true);

    try {
      const response = await fetch('/api/ai/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objective: aiObjective,
          recipientCompany: aiRecipientCompany,
          recipientName: aiRecipientName,
          keyPoints: aiKeyPoints,
          tone: aiTone
        })
      });

      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          recipientCompany: aiRecipientCompany || prev.recipientCompany,
          recipientName: aiRecipientName || prev.recipientName,
          subject: data.subject || prev.subject,
          salutation: data.salutation || prev.salutation,
          content: data.content || prev.content,
          templateType: (data.recommendedTemplate as LetterTemplateType) || 'proposal'
        }));
        setIsAiGeneratorOpen(false);
        setIsEditorOpen(true);
      }
    } catch (err) {
      console.error('Error in AI letter generation:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // WhatsApp Dispatch
  const handleDispatchWhatsApp = (letter: OfficialLetter) => {
    const verifyUrl = `https://deroyal.tech/#verify?ref=${encodeURIComponent(letter.referenceNumber)}`;
    const text = `*OFFICIAL CORRESPONDENCE — DEROYALTECH SYSTEMS LIMITED*
Reference: ${letter.referenceNumber}
Date: ${letter.date}
To: ${letter.recipientCompany}${letter.recipientName ? ` (Attn: ${letter.recipientName})` : ''}

*SUBJECT:* ${letter.subject}

${letter.salutation}

${letter.content.slice(0, 320)}...

*Verify Genuine Official Document Online:*
${verifyUrl}

Authorized Signatory:
*${letter.signatoryName}*
${letter.signatoryRole}
DeRoyalTech Systems Limited · Accra, Ghana`;

    const cleanPhone = (letter.recipientPhone || '').replace(/[^0-9]/g, '');
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Email Dispatch Modal Open
  const handleOpenEmailDispatch = (letter: OfficialLetter) => {
    setEmailDispatchLetter(letter);
    setDispatchRecipientEmail(letter.recipientEmail || '');
    setDispatchSubject(`[Official Correspondence] ${letter.subject} (Ref: ${letter.referenceNumber})`);
    setDispatchNote('');
  };

  // Send Email Dispatch
  const handleConfirmEmailDispatch = async () => {
    if (!emailDispatchLetter || !dispatchRecipientEmail) return;
    setIsDispatching(true);

    try {
      const res = await fetch('/api/letters/dispatch-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letter: emailDispatchLetter,
          recipientEmail: dispatchRecipientEmail,
          personalNote: dispatchNote
        })
      });

      if (res.ok) {
        updateLetter(emailDispatchLetter.id, {
          status: 'sent',
          recipientEmail: dispatchRecipientEmail
        });
        setDispatchSuccessToast(true);
        setTimeout(() => setDispatchSuccessToast(false), 3000);
        setEmailDispatchLetter(null);
      }
    } catch (err) {
      console.error('Error dispatching email:', err);
    } finally {
      setIsDispatching(false);
    }
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
${activeLetterhead.companyName} — OFFICIAL CORRESPONDENCE
${activeLetterhead.physicalAddress}
Tel: ${activeLetterhead.phone} | Email: ${activeLetterhead.email}
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
Tel: ${letter.signatoryPhone || activeLetterhead.phone}

Online Verification: https://deroyal.tech/#verify?ref=${encodeURIComponent(letter.referenceNumber)}
`;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text.trim());
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    }
  };

  const handlePrint = (letter?: OfficialLetter) => {
    if (letter && (!previewLetter || previewLetter.id !== letter.id)) {
      setPreviewLetter(letter);
    }
    setIsPrinting(true);
    setPrintToast('🖨️ Preparing high-resolution PDF print preview...');

    setTimeout(() => {
      try {
        window.print();
      } catch (err) {
        console.error('Print trigger error:', err);
      } finally {
        setTimeout(() => {
          setIsPrinting(false);
          setPrintToast(null);
        }, 1200);
      }
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <span>Official Company Letters & Proposals</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Draft, issue, verify with QR codes, dispatch via Email or WhatsApp, and print official letters on DeRoyalTech Systems letterhead.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Edit Letterhead Button */}
          <button
            type="button"
            onClick={() => setIsLetterheadModalOpen(true)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Configure Corporate Letterhead"
          >
            <Settings className="w-3.5 h-3.5 text-indigo-500" />
            <span>Edit Letterhead</span>
          </button>

          {/* AI Letter Generator Button */}
          <button
            type="button"
            onClick={() => {
              setAiObjective('');
              setAiRecipientCompany('');
              setAiRecipientName('');
              setAiKeyPoints('');
              setIsAiGeneratorOpen(true);
            }}
            className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Letter Generator</span>
          </button>

          {/* New Letter Button */}
          <button
            type="button"
            onClick={handleOpenNew}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Write Official Letter</span>
          </button>
        </div>
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
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
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

                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  {/* View Letterhead Preview with QR Code */}
                  <button
                    type="button"
                    onClick={() => setPreviewLetter(letter)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                    title="View DeRoyalTech Letterhead with QR Code"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Letterhead</span>
                  </button>

                  {/* Reactive Direct Print Button */}
                  <button
                    type="button"
                    onClick={() => handlePrint(letter)}
                    disabled={isPrinting}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1 active:scale-95"
                    title="Print Document or Export PDF"
                  >
                    <Printer className={`w-3.5 h-3.5 ${isPrinting ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">{isPrinting ? 'Printing...' : 'Print'}</span>
                  </button>

                  {/* Dispatch via WhatsApp */}
                  <button
                    type="button"
                    onClick={() => handleDispatchWhatsApp(letter)}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1"
                    title="Dispatch via WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>

                  {/* Dispatch via Email */}
                  <button
                    type="button"
                    onClick={() => handleOpenEmailDispatch(letter)}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1"
                    title="Dispatch via Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Email</span>
                  </button>

                  {/* Copy Text */}
                  <button
                    type="button"
                    onClick={() => handleCopyLetter(letter)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Copy Text"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleEdit(letter)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Edit Letter"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
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

      {/* ==================== LETTERHEAD CONFIGURATION MODAL ==================== */}
      {isLetterheadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-400" />
                <h4 className="text-sm font-bold">Customize Corporate Letterhead & Credentials</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsLetterheadModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLetterhead} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Company Registered Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={letterheadForm.companyName}
                    onChange={(e) => setLetterheadForm({ ...letterheadForm, companyName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Ghana Registrar General (RC) Number
                  </label>
                  <input
                    type="text"
                    required
                    value={letterheadForm.regNumber}
                    onChange={(e) => setLetterheadForm({ ...letterheadForm, regNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Corporate Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={letterheadForm.tagline}
                  onChange={(e) => setLetterheadForm({ ...letterheadForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Official Corporate Logo URL / Asset
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                    {letterheadForm.logoUrl ? (
                      <img src={letterheadForm.logoUrl} alt="Logo Preview" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                    ) : (
                      <span className="text-xs font-mono font-bold text-white">DRT</span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="https://... or /logo.svg"
                    value={letterheadForm.logoUrl || ''}
                    onChange={(e) => setLetterheadForm({ ...letterheadForm, logoUrl: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setLetterheadForm({ ...letterheadForm, logoUrl: config.logoUrl || '/logo.svg' })}
                    className="px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 whitespace-nowrap"
                  >
                    Default Logo
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Head Office Physical Address (Accra, Ghana)
                </label>
                <input
                  type="text"
                  value={letterheadForm.physicalAddress}
                  onChange={(e) => setLetterheadForm({ ...letterheadForm, physicalAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Official Phone
                  </label>
                  <input
                    type="text"
                    value={letterheadForm.phone}
                    onChange={(e) => setLetterheadForm({ ...letterheadForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={letterheadForm.email}
                    onChange={(e) => setLetterheadForm({ ...letterheadForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={letterheadForm.website}
                    onChange={(e) => setLetterheadForm({ ...letterheadForm, website: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Digital Authentication Seal Text
                </label>
                <input
                  type="text"
                  value={letterheadForm.sealText}
                  onChange={(e) => setLetterheadForm({ ...letterheadForm, sealText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLetterheadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
                >
                  Save Letterhead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== AI LETTER GENERATOR MODAL ==================== */}
      {isAiGeneratorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="p-5 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h4 className="text-sm font-bold">AI Corporate Letter Drafter (Gemini 2.5)</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAiGeneratorOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateAiLetter} className="p-6 space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Provide brief context or key bullet points. Gemini AI will generate an executive-grade proposal, quotation cover, or SLA letter formatted for Ghanaian enterprise standards.
              </p>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Recipient Organization Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Ghana Commercial Bank (GCB) PLC or Vodafone Ghana"
                  value={aiRecipientCompany}
                  onChange={(e) => setAiRecipientCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Contact Person Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Dr. Kwame Boakye"
                    value={aiRecipientName}
                    onChange={(e) => setAiRecipientName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Tone & Style
                  </label>
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Formal Executive">Formal Executive</option>
                    <option value="Technical & SLA Oriented">Technical & SLA Oriented</option>
                    <option value="Partnership & Collaborative">Partnership & Collaborative</option>
                    <option value="Urgent Notice / Demand">Milestone Sign-Off / Demand</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Objective / Primary Topic *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Proposing a 50-workstation hybrid cloud deployment with 3-year local warranty"
                  value={aiObjective}
                  onChange={(e) => setAiObjective(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Key Points / Deliverables / Pricing Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g., Include 24/7 DevOps standby, dual fiber failover in Accra, 3-year hardware warranty, payment in Ghanaian Cedis (GH₵)."
                  value={aiKeyPoints}
                  onChange={(e) => setAiKeyPoints(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAiGeneratorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingAi}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold shadow-md flex items-center gap-2"
                >
                  {isGeneratingAi ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Drafting Letter...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Letter with AI</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== DIRECT RESPONSIVE EMAIL DISPATCH MODAL ==================== */}
      {emailDispatchLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-4xl my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" />
                <h4 className="text-sm font-bold">
                  Direct Email Dispatch & Responsive Preview
                </h4>
                <span className="font-mono text-xs text-blue-200 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800 hidden sm:inline">
                  {emailDispatchLetter.referenceNumber}
                </span>
              </div>

              {/* Viewport switcher: Desktop vs Mobile */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-xs">
                  <button
                    type="button"
                    onClick={() => setDispatchPreviewDevice('desktop')}
                    className={`px-2 py-1 rounded flex items-center gap-1 ${
                      dispatchPreviewDevice === 'desktop' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDispatchPreviewDevice('mobile')}
                    className={`px-2 py-1 rounded flex items-center gap-1 ${
                      dispatchPreviewDevice === 'mobile' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Mobile</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setEmailDispatchLetter(null)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Split Form + Live Responsive Preview */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Controls (5 columns on desktop) */}
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Recipient Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g., cto@gcb.com.gh or procurement@client.com"
                    value={dispatchRecipientEmail}
                    onChange={(e) => setDispatchRecipientEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={dispatchSubject}
                    onChange={(e) => setDispatchSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Personalized Executive Note (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g., Please find attached our formal scope document for your executive committee review."
                    value={dispatchNote}
                    onChange={(e) => setDispatchNote(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-[11px] text-blue-900 dark:text-blue-200 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Cryptographic QR Code Included</span>
                  </div>
                  <div>
                    This dispatch embeds a verifiable URL & QR code linking to <span className="font-mono font-semibold">deroyal.tech/#verify?ref={emailDispatchLetter.referenceNumber}</span> for instant public authentication.
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleConfirmEmailDispatch}
                    disabled={isDispatching || !dispatchRecipientEmail}
                    className="w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {isDispatching ? (
                      <>
                        <Send className="w-4 h-4 animate-spin" />
                        <span>Dispatching Letter...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Dispatch Official Email Now</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${dispatchRecipientEmail}?subject=${encodeURIComponent(dispatchSubject)}&body=${encodeURIComponent(
                      `${dispatchNote ? dispatchNote + '\n\n---\n\n' : ''}${emailDispatchLetter.salutation}\n\n${emailDispatchLetter.content}\n\nYours faithfully,\n${emailDispatchLetter.signatoryName}\n${emailDispatchLetter.signatoryRole}\nDeRoyalTech Systems Limited\n\nVerify Online: https://deroyal.tech/#verify?ref=${encodeURIComponent(emailDispatchLetter.referenceNumber)}`
                    )}`}
                    className="w-full px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Default Mail Client (mailto:)</span>
                  </a>
                </div>
              </div>

              {/* Live Responsive HTML Email Preview (7 columns on desktop) */}
              <div className="lg:col-span-7 bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl flex items-center justify-center overflow-x-auto">
                <div 
                  className={`bg-white text-slate-900 rounded-2xl shadow-lg border border-slate-200 transition-all duration-300 overflow-hidden font-sans ${
                    dispatchPreviewDevice === 'mobile' ? 'w-[360px] text-xs' : 'w-full max-w-[560px] text-xs'
                  }`}
                >
                  {/* Email Top Header */}
                  <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-4 text-white flex items-center justify-between border-b-2 border-indigo-600">
                    <div>
                      <div className="font-extrabold text-sm tracking-tight">
                        DEROYALTECH <span className="text-indigo-400">SYSTEMS</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Official Corporate Correspondence</div>
                    </div>
                    <span className="font-mono text-[9px] bg-indigo-950 px-2 py-0.5 rounded border border-indigo-700 text-indigo-300">
                      {emailDispatchLetter.referenceNumber}
                    </span>
                  </div>

                  <div className="p-5 space-y-4 leading-relaxed">
                    {/* Optional Personal Note Box */}
                    {dispatchNote && (
                      <div className="p-3 rounded-xl bg-indigo-50 border-l-4 border-indigo-600 text-[11px] text-indigo-950 italic">
                        "{dispatchNote}"
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between border-b border-slate-100 pb-2">
                      <span>DATE: {emailDispatchLetter.date}</span>
                      <span className="font-bold text-indigo-800">AUTHENTICATED</span>
                    </div>

                    {/* Recipient */}
                    <div className="text-[11px] text-slate-800">
                      <div className="font-bold text-slate-950">{emailDispatchLetter.recipientName}</div>
                      <div className="font-semibold text-indigo-900">{emailDispatchLetter.recipientCompany}</div>
                      <div className="text-slate-500">{emailDispatchLetter.recipientAddress}</div>
                    </div>

                    {/* Subject Line */}
                    <div className="font-bold text-slate-950 text-xs sm:text-sm uppercase tracking-tight bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      RE: {emailDispatchLetter.subject}
                    </div>

                    {/* Salutation & Body */}
                    <div className="text-slate-700 space-y-2 whitespace-pre-line text-justify leading-relaxed">
                      <div className="font-semibold">{emailDispatchLetter.salutation}</div>
                      <div>{emailDispatchLetter.content}</div>
                    </div>

                    {/* Sign-Off & Verification Block */}
                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-4">
                      <div className="space-y-0.5 text-[11px]">
                        <div className="text-slate-500">Yours faithfully,</div>
                        <div className="font-bold text-slate-950">{emailDispatchLetter.signatoryName}</div>
                        <div className="text-slate-600 text-[10px]">{emailDispatchLetter.signatoryRole}</div>
                        <div className="text-indigo-800 font-medium text-[9px]">DeRoyalTech Systems Limited · Accra, Ghana</div>
                      </div>

                      {/* Verification Badge with Link */}
                      <a
                        href={`/#verify?ref=${encodeURIComponent(emailDispatchLetter.referenceNumber)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl border border-indigo-300 bg-indigo-50 text-center text-[9px] font-mono font-bold text-indigo-900 space-y-0.5 shrink-0 block hover:bg-indigo-100"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 mx-auto text-indigo-600" />
                        <div>SCAN / VERIFY</div>
                        <div className="text-[8px] text-indigo-700 underline">deroyal.tech/verify</div>
                      </a>
                    </div>
                  </div>

                  {/* Email Footer */}
                  <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[9px] text-slate-500 font-mono">
                    DeRoyalTech Systems Limited · Accra, Ghana · RC-2024-8921 · Tel: {activeLetterhead.phone}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== EDITOR MODAL ==================== */}
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
                <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Load Corporate Template:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditorOpen(false);
                      setIsAiGeneratorOpen(true);
                    }}
                    className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                  >
                    <span>Or Draft with AI</span>
                    <Sparkles className="w-3 h-3" />
                  </button>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g., k.asante@gcb.com.gh"
                    value={formData.recipientEmail}
                    onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Recipient Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., +233245901284"
                    value={formData.recipientPhone}
                    onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    City / Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Airport City, Accra"
                    value={formData.recipientAddress}
                    onChange={(e) => setFormData({ ...formData, recipientAddress: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
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

      {/* ==================== OFFICIAL LETTERHEAD PRINT & PREVIEW MODAL WITH QR CODE ==================== */}
      {previewLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-4xl my-auto bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-300 flex flex-col">
            {/* Control Bar (hidden in browser print) */}
            <div className="print:hidden p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold tracking-wide uppercase">
                  {activeLetterhead.companyName} • Official Document
                </span>
                <span className="font-mono text-xs text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                  {previewLetter.referenceNumber}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDispatchWhatsApp(previewLetter)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEmailDispatch(previewLetter)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePrint()}
                  disabled={isPrinting}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-75 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all active:scale-95"
                  title="Print Document or Export PDF"
                >
                  <Printer className={`w-4 h-4 ${isPrinting ? 'animate-spin' : ''}`} />
                  <span>{isPrinting ? 'Preparing Print...' : 'Print / PDF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyLetter(previewLetter)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
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

            {/* A4 Document Body Container with Print Styling */}
            <div className="printable-letter-document p-8 sm:p-14 bg-white text-slate-900 font-sans space-y-6 leading-relaxed relative selection:bg-indigo-100">
              {/* Letterhead Header with Official Corporate Logo */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-indigo-900">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border-2 border-indigo-500/30 flex items-center justify-center p-2 shadow-md shrink-0 overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
                    {activeLetterhead.logoUrl ? (
                      <img 
                        src={activeLetterhead.logoUrl} 
                        alt="Corporate Logo" 
                        className="w-full h-full object-contain filter drop-shadow"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                          const p = (e.target as HTMLElement).parentElement;
                          if (p && !p.querySelector('.fallback-drt')) {
                            const el = document.createElement('span');
                            el.className = 'text-white font-extrabold text-xl font-mono fallback-drt';
                            el.innerText = 'DRT';
                            p.appendChild(el);
                          }
                        }}
                      />
                    ) : (
                      <span className="text-white font-extrabold text-xl font-mono">DRT</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950 uppercase">
                      {activeLetterhead.companyName}
                    </h2>
                    <p className="text-xs font-medium text-slate-600 tracking-wider">
                      {activeLetterhead.tagline}
                    </p>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-600 space-y-0.5">
                  <div className="font-semibold text-slate-900">Head Office: Accra, Ghana</div>
                  <div>{activeLetterhead.physicalAddress}</div>
                  <div>Tel: {activeLetterhead.phone}</div>
                  <div>Web: {activeLetterhead.website}</div>
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

                {/* Digital Seal & Signature Block & QR Code */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  {/* Signatory Block with Official Signature */}
                  <div className="space-y-1">
                    {(previewLetter.signatureDataUrl || activeLetterhead.signatureDataUrl || config.adminProfile?.signatureDataUrl) ? (
                      <div className="h-14 flex items-center border-b border-slate-300 pb-1 inline-block pr-6">
                        <img 
                          src={previewLetter.signatureDataUrl || activeLetterhead.signatureDataUrl || config.adminProfile?.signatureDataUrl} 
                          alt="Official Signatory Signature" 
                          className="max-h-12 max-w-[220px] object-contain filter drop-shadow-sm"
                        />
                      </div>
                    ) : (
                      <div className="font-serif italic text-lg sm:text-xl text-indigo-900 font-bold border-b border-slate-400 pb-1 inline-block pr-6">
                        {previewLetter.signatoryName}
                      </div>
                    )}
                    <div className="text-xs font-bold text-slate-950">{previewLetter.signatoryName}</div>
                    <div className="text-[11px] text-slate-600">{previewLetter.signatoryRole}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{activeLetterhead.companyName} · Accra, Ghana</div>
                  </div>

                  {/* Certified Seal Stamp & QR Code Verification */}
                  <div className="flex items-center gap-4">
                    {/* Certified Seal */}
                    <div className="border-2 border-indigo-700/60 rounded-xl p-2.5 text-center text-[10px] text-indigo-900 bg-indigo-50/60 font-mono font-bold space-y-0.5 rotate-[-2deg] shadow-sm">
                      <div className="flex items-center justify-center gap-1 text-indigo-700">
                        <ShieldCheck className="w-4 h-4" />
                        <span>AUTHENTICATED</span>
                      </div>
                      <div className="text-[9px] text-slate-600">{activeLetterhead.companyName}</div>
                      <div className="text-[8px] text-slate-500">ACCRA, GHANA</div>
                    </div>

                    {/* QR Code linking to verification page with ref pre-filled */}
                    {previewQrCode && (
                      <a
                        href={`/#verify?ref=${encodeURIComponent(previewLetter.referenceNumber)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-center space-y-1 shrink-0 p-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors block"
                        title="Scan to verify document authenticity online"
                      >
                        <img
                          src={previewQrCode}
                          alt="Verification QR Code"
                          className="w-16 h-16 rounded object-contain mx-auto"
                        />
                        <div className="text-[8px] font-mono font-extrabold text-indigo-900 uppercase">
                          SCAN TO VERIFY
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="pt-8 mt-8 border-t border-slate-200 text-center text-[10px] text-slate-500 space-y-0.5 font-mono">
                <div>{activeLetterhead.companyName} · Registered in the Republic of Ghana · {activeLetterhead.regNumber}</div>
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

      {/* Print Feedback Toast */}
      {printToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-indigo-950 text-white rounded-xl shadow-2xl text-xs flex items-center gap-2.5 border border-indigo-700 animate-in fade-in duration-200">
          <Printer className="w-4 h-4 text-indigo-400 animate-bounce" />
          <span className="font-semibold">{printToast}</span>
        </div>
      )}

      {/* Embedded Print Media Styles for Letterhead Document */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .printable-letter-document,
          .printable-letter-document * {
            visibility: visible !important;
          }
          .printable-letter-document {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20mm !important;
            background: white !important;
            color: #0f172a !important;
            box-shadow: none !important;
            border: none !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
