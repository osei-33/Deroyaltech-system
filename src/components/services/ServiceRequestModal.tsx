import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Briefcase, 
  Building2, 
  Mail, 
  Phone, 
  Coins, 
  Clock, 
  Cpu, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { ServiceItem } from '../../types/index.ts';

export const ServiceRequestModal: React.FC = () => {
  const { 
    isServiceRequestModalOpen, 
    setIsServiceRequestModalOpen, 
    selectedServiceForRequest, 
    services, 
    clientUser, 
    submitServiceRequest, 
    formatPrice,
    openChatWithContext
  } = useSite();

  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [budget, setBudget] = useState<number>(45000);
  const [timeline, setTimeline] = useState('4-6 Weeks');
  const [hardwareNeeded, setHardwareNeeded] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  // Sync initial values
  useEffect(() => {
    if (selectedServiceForRequest) {
      setSelectedServiceId(selectedServiceForRequest.id);
      if (selectedServiceForRequest.startingPrice) {
        setBudget(selectedServiceForRequest.startingPrice);
      }
    } else if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
      if (services[0].startingPrice) {
        setBudget(services[0].startingPrice);
      }
    }

    if (clientUser) {
      setFullName(clientUser.fullName || '');
      setEmail(clientUser.email || '');
      setPhone(clientUser.phone || '');
      setCompany(clientUser.company || '');
    }
  }, [selectedServiceForRequest, isServiceRequestModalOpen, clientUser, services]);

  if (!isServiceRequestModalOpen) return null;

  const activeService: ServiceItem | undefined = services.find(s => s.id === selectedServiceId) || services[0];

  const handleServiceChange = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const s = services.find(item => item.id === serviceId);
    if (s && s.startingPrice) {
      setBudget(s.startingPrice);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || !fullName.trim() || !email.trim()) return;

    const reqId = submitServiceRequest({
      clientId: clientUser?.id,
      clientName: fullName.trim(),
      clientEmail: email.trim(),
      clientPhone: phone.trim() || '+233 24 000 0000',
      clientCompany: company.trim() || 'Enterprise Client',
      serviceId: activeService?.id || 'software',
      serviceTitle: activeService?.title || 'Custom Engineering Service',
      projectTitle: projectTitle.trim(),
      description: description.trim() || 'Client requested comprehensive technical consultation and turnkey implementation.',
      estimatedBudget: Number(budget) || 45000,
      targetTimeline: timeline,
      hardwareIntegrationNeeded: hardwareNeeded
    });

    setSubmittedRequestId(reqId);
  };

  const handleClose = () => {
    setIsServiceRequestModalOpen(false);
    setSubmittedRequestId(null);
  };

  const handleOpenLiveSupport = () => {
    handleClose();
    openChatWithContext(
      submittedRequestId ? `Service Request: ${submittedRequestId}` : 'Service Request Inquiry'
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">Initiate Service Request</h2>
                <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  GH₵ PRICING
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Our admin team reviews your scope, approves the order, and assigns your live Project Tracking ID.
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
            aria-label="Close Service Request Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {submittedRequestId ? (
            /* Success View */
            <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/40 text-emerald-500 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Request Confirmed & Dispatched
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Order Successfully Submitted!
                </h3>
                <div className="inline-block p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 my-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-sans">Official Request ID:</span>
                  <span className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">{submittedRequestId}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Our Principal Systems Administrator has received your service order. Once reviewed and confirmed on the Admin CMS, you will receive an automated notification and your unique <strong>Project Tracking ID (DRT-XXXX)</strong> to monitor daily engineering milestones in real-time.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenLiveSupport}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open Live Support for this Order</span>
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
                >
                  Return to Website
                </button>
              </div>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Select Service */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Target Service Category *
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.number}. {s.title} {s.startingPrice ? `(Starts at ${formatPrice(s.startingPrice)})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Project Title or Working Scope *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Multi-Branch CRM & Warehouse Scanner Telemetry"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-500" />
                    <span>Contact Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Kwame Asante"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-500" />
                    <span>Business Email *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="k.asante@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-500" />
                    <span>Phone / WhatsApp *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+233 24 590 1284"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>Company Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Asante Logistics Ltd"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Budget & Timeline Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Target Budget (GH₵)</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{formatPrice(budget)}</span>
                  </label>
                  <input
                    type="number"
                    min={10000}
                    step={5000}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>Target Timeline</span>
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="2-3 Weeks (Fast-Track)">2-3 Weeks (Fast-Track)</option>
                    <option value="4-6 Weeks (Standard Enterprise)">4-6 Weeks (Standard Enterprise)</option>
                    <option value="8-12 Weeks (Complex Architecture)">8-12 Weeks (Complex Architecture)</option>
                    <option value="Continuous / Multi-Phase">Continuous / Multi-Phase</option>
                  </select>
                </div>
              </div>

              {/* Hardware integration checkbox */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="hwIntegration"
                  checked={hardwareNeeded}
                  onChange={(e) => setHardwareNeeded(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600"
                />
                <label htmlFor="hwIntegration" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  <span className="font-bold block text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Include Physical Hardware Peripherals & IoT Integration</span>
                  </span>
                  <span>Check this if your project requires DeRoyalTech to supply and integrate barcode scanners, edge gateways, POS terminals, or RFID readers.</span>
                </label>
              </div>

              {/* Scope Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Detailed Operational Requirements / Scope
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline key workflows, target number of branches, integration needs, or legacy software to connect..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Admin Review & Milestone Tracker SLA: &lt; 24h</span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                >
                  <span>Submit Service Order</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
