import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Building2, 
  User, 
  Printer, 
  QrCode, 
  ExternalLink, 
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { OfficialLetter } from '../../types/index.ts';

export const DocumentVerificationPage: React.FC = () => {
  const { letters, config, navigateTo } = useSite();
  const [referenceQuery, setReferenceQuery] = useState('');
  const [searchedLetter, setSearchedLetter] = useState<OfficialLetter | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Parse reference number from URL hash/search if present
  useEffect(() => {
    const handleUrlRef = () => {
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      let refParam = '';

      if (hash.includes('ref=')) {
        refParam = decodeURIComponent(hash.split('ref=')[1].split('&')[0]);
      } else if (search.includes('ref=')) {
        const params = new URLSearchParams(search);
        refParam = params.get('ref') || '';
      }

      if (refParam) {
        setReferenceQuery(refParam);
        verifyRef(refParam);
      } else if (letters && letters.length > 0 && !hasSearched) {
        // Pre-fill with the first available official letter for immediate demonstration
        setReferenceQuery(letters[0].referenceNumber);
        verifyRef(letters[0].referenceNumber);
      }
    };

    handleUrlRef();
    window.addEventListener('hashchange', handleUrlRef);
    return () => window.removeEventListener('hashchange', handleUrlRef);
  }, [letters]);

  const verifyRef = (query: string) => {
    const clean = query.trim().toUpperCase();
    if (!clean) {
      setSearchedLetter(null);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    const match = (letters || []).find(
      (l) => l.referenceNumber.toUpperCase() === clean
    );
    setSearchedLetter(match || null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyRef(referenceQuery);
  };

  const [isPrinting, setIsPrinting] = useState(false);
  const [printToast, setPrintToast] = useState<string | null>(null);

  const handlePrintCertificate = () => {
    setIsPrinting(true);
    setPrintToast('🖨️ Preparing certified certificate print preview...');
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

  const letterhead = config.letterhead || {
    companyName: 'DeRoyalTech Systems Limited',
    tagline: 'Enterprise Cloud Infrastructure · Custom CRM · Hardware Telemetry',
    physicalAddress: 'Suite 402, Standard Chartered Building, Airport City & Spintex Tech Corridor, Accra, Ghana',
    phone: config.contact.phonePrimary || '+233 (0) 30 294 8821',
    email: config.contact.emailGeneral || 'info@deroyaltech.com',
    website: 'www.deroyaltech.com',
    regNumber: 'RC-2024-8921',
    sealText: 'AUTHENTICATED · DEROYALTECH SYSTEMS · ACCRA, GHANA'
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Public Document Verification Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Official Document & Letter Verification
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Verify the cryptographic authenticity of letters, technical proposals, quotations, and service level agreements issued by {letterhead.companyName}.
          </p>
        </div>

        {/* Verification Search Bar Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <label htmlFor="ref-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Enter Document Reference Number
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="ref-input"
                  type="text"
                  placeholder="e.g., DRT/LTR/2026/042 or DRT/LTR/2026/184"
                  value={referenceQuery}
                  onChange={(e) => setReferenceQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Authenticity</span>
              </button>
            </div>

            {/* Quick Demo Samples */}
            {letters && letters.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Quick Verify Sample:</span>
                {letters.slice(0, 3).map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      setReferenceQuery(l.referenceNumber);
                      verifyRef(l.referenceNumber);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-mono text-[11px] font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    {l.referenceNumber}
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Verification Result Display */}
        {hasSearched && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {searchedLetter ? (
              /* Verified Genuine Document Certificate */
              <div className="printable-certificate bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-500/40">
                {/* Certificate Banner */}
                <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/30">
                      <CheckCircle2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="text-xs uppercase font-extrabold tracking-widest text-emerald-100">
                        Official Verification Certificate
                      </div>
                      <h2 className="text-xl font-extrabold text-white">
                        GENUINE OFFICIAL DOCUMENT VERIFIED
                      </h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePrintCertificate}
                    disabled={isPrinting}
                    className="print:hidden px-4 py-2 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 disabled:opacity-75 transition-all shadow flex items-center gap-1.5 self-start sm:self-center shrink-0 active:scale-95"
                    title="Print Verification Certificate"
                  >
                    <Printer className={`w-4 h-4 text-emerald-700 ${isPrinting ? 'animate-spin' : ''}`} />
                    <span>{isPrinting ? 'Preparing Certificate...' : 'Print Verification Seal'}</span>
                  </button>
                </div>

                {/* Certificate Details */}
                <div className="p-6 sm:p-10 space-y-6">
                  {/* Reference & Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
                    <div>
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reference Number</div>
                      <div className="font-mono text-sm font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
                        {searchedLetter.referenceNumber}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Issue Date</div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                        {searchedLetter.date}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Registry Status</div>
                      <div className="mt-0.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                          {searchedLetter.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Issuer RC Reg</div>
                      <div className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                        {letterhead.regNumber}
                      </div>
                    </div>
                  </div>

                  {/* Document Particulars */}
                  <div className="space-y-4">
                    <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recipient Organization</div>
                      <div className="text-base font-bold text-slate-950 dark:text-white mt-0.5">
                        {searchedLetter.recipientCompany}
                      </div>
                      {searchedLetter.recipientName && (
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          Attn: {searchedLetter.recipientName} {searchedLetter.recipientTitle ? `(${searchedLetter.recipientTitle})` : ''}
                        </div>
                      )}
                    </div>

                    <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Document Subject</div>
                      <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-0.5 uppercase tracking-wide">
                        {searchedLetter.subject}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Verified Content Excerpt</div>
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line font-serif italic">
                        {searchedLetter.content}
                      </div>
                    </div>
                  </div>

                  {/* Signatory & Security Seal Block */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Authorized Executive Signatory</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {searchedLetter.signatoryName}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {searchedLetter.signatoryRole}
                      </div>
                      <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                        {letterhead.companyName} · Accra, Ghana
                      </div>
                    </div>

                    {/* Certified Digital Stamp */}
                    <div className="p-3.5 rounded-2xl border-2 border-emerald-600/40 bg-emerald-50/60 dark:bg-emerald-950/30 text-center text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 space-y-0.5 shadow-sm">
                      <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <Award className="w-4 h-4" />
                        <span>DIGITALLY CERTIFIED</span>
                      </div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400">{letterhead.sealText}</div>
                      <div className="text-[9px] text-slate-500">Timestamp: {new Date().toUTCString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Unverified / Not Found Alert */
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border-2 border-amber-500/40 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center border border-amber-500/30">
                  <AlertCircle className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                    Document Not Found in Official Registry
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    The reference number <span className="font-mono font-bold text-amber-600 dark:text-amber-400">"{referenceQuery}"</span> does not match any authenticated record in the DeRoyalTech Systems corporate registry.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 max-w-lg mx-auto text-left space-y-1.5">
                  <div className="font-bold">Next Steps for Verification:</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Confirm that the reference number includes the prefix <span className="font-mono font-semibold">DRT/LTR/</span>.</li>
                    <li>If you received a printed letter, scan the QR code located near the signatory seal.</li>
                    <li>Contact our verification team directly at <span className="font-semibold">{letterhead.email}</span> or call <span className="font-semibold">{letterhead.phone}</span>.</li>
                  </ul>
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigateTo('contact')}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
                  >
                    <span>Contact Verification Desk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Print Feedback Toast */}
        {printToast && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-emerald-950 text-white rounded-xl shadow-2xl text-xs flex items-center gap-2.5 border border-emerald-700 animate-in fade-in duration-200">
            <Printer className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span className="font-semibold">{printToast}</span>
          </div>
        )}

        {/* Embedded Print Media Styles for Verification Certificate */}
        <style>{`
          @media print {
            body * {
              visibility: hidden !important;
            }
            .printable-certificate,
            .printable-certificate * {
              visibility: visible !important;
            }
            .printable-certificate {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 15mm !important;
              background: white !important;
              color: #0f172a !important;
              box-shadow: none !important;
              border: 2px solid #059669 !important;
            }
            .print\\:hidden {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};
