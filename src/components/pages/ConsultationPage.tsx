import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  AlertCircle, 
  Phone, 
  Building, 
  Mail, 
  User, 
  Layers, 
  Cpu, 
  Sparkles, 
  ArrowRight,
  MapPin,
  MessageSquare
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';

export const ConsultationPage: React.FC = () => {
  const { 
    bookConsultation, 
    submitInquiry, 
    clientUser, 
    config, 
    openChatWithContext,
    navigateTo 
  } = useSite();

  // Next business day as default date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    fullName: clientUser?.fullName || '',
    email: clientUser?.email || '',
    phone: clientUser?.phone || '+233 (0) 24 590 1284',
    company: clientUser?.company || '',
    projectType: 'turnkey',
    budget: 'GH₵ 80,000 - GH₵ 150,000',
    timeline: 'Within 2-3 months',
    scheduledDate: defaultDateStr,
    timeSlot: '10:00 AM - 11:00 AM GMT',
    scopeNotes: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Business email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.company.trim()) newErrors.company = 'Company / organization name is required.';
    if (!formData.scheduledDate) newErrors.scheduledDate = 'Please select a preferred date.';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 1. Submit consultation booking
    const id = bookConsultation({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      projectScope: `${formData.projectType.toUpperCase()} - ${formData.scopeNotes || formData.message || 'Discovery Call'}`,
      budgetBracket: formData.budget,
      scheduledDate: formData.scheduledDate,
      timeSlot: formData.timeSlot
    });

    // 2. Also log as direct inquiry
    submitInquiry({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      projectType: formData.projectType,
      budget: formData.budget,
      timeline: formData.timeline,
      scopeNotes: formData.scopeNotes,
      message: `[Booked Consultation: ${formData.scheduledDate} at ${formData.timeSlot}] ${formData.message}`
    });

    setBookingId(id);
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen pb-24 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white py-16 sm:py-24 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Discovery Architecture Session</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Book an Engineering Consultation with <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              DeRoyalTech Technical Leads
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            Schedule a dedicated 45-minute discovery consultation with our systems architects in Accra. We'll review your software blueprints, hardware peripheral specifications, and operational workflows.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {submitted ? (
          /* Booking Confirmation State */
          <div className="max-w-2xl mx-auto p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                Booking Reference: {bookingId}
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Consultation Confirmed!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
                Thank you, <strong>{formData.fullName}</strong>. Our senior systems architect has received your discovery request for <strong>{formData.company}</strong>. A calendar invite with Google Meet & phone bridge details has been dispatched.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs font-mono space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-sans">Scheduled Date:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formData.scheduledDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-sans">Time Window:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{formData.timeSlot}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-sans">Scope Focus:</span>
                <span className="capitalize text-slate-800 dark:text-slate-200">{formData.projectType}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigateTo('tracker')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
              >
                Go to Project Tracker
              </button>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Book Another Call
              </button>
            </div>
          </div>
        ) : (
          /* Consultation Booking Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form Column */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Reserve Your Architecture Review Session
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  All consultations include preliminary scope mapping, Ghanaian Cedis budget modeling, and hardware BOM estimates.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 2-Column: Full Name & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Kwame Mensah"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Company / Organization *
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. West Africa Shippers Council"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {errors.company && <p className="text-[11px] text-red-500 mt-1">{errors.company}</p>}
                  </div>
                </div>

                {/* 2-Column: Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Business Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="k.mensah@company.com"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Phone or WhatsApp Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+233 24 000 0000"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Domain & Budget in GH₵ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Primary Project Domain
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="turnkey">Turnkey Full-Stack & Hardware System</option>
                      <option value="software">Web Application / Portal Architecture</option>
                      <option value="mobile">Native Mobile Application (iOS & Android)</option>
                      <option value="crm">Custom CRM & Telemetry Pipeline</option>
                      <option value="cloud">Cloud Infrastructure & DevOps</option>
                      <option value="hardware">Hardware Assembly & Peripheral Fleet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Estimated Budget (in Ghanaian Cedis GH₵)
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    >
                      <option value="GH₵ 30,000 - GH₵ 60,000">GH₵ 30,000 - GH₵ 60,000 (Sprint MVP)</option>
                      <option value="GH₵ 60,000 - GH₵ 120,000">GH₵ 60,000 - GH₵ 120,000 (Mid-Market Solution)</option>
                      <option value="GH₵ 120,000 - GH₵ 300,000">GH₵ 120,000 - GH₵ 300,000 (Enterprise Deployment)</option>
                      <option value="GH₵ 300,000+">GH₵ 300,000+ (Turnkey Multi-Site Fleet)</option>
                    </select>
                  </div>
                </div>

                {/* Scheduling Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Select Meeting Date *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    {errors.scheduledDate && <p className="text-[11px] text-red-500 mt-1">{errors.scheduledDate}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Meeting Time Window (GMT)
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={formData.timeSlot}
                        onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="09:00 AM - 10:00 AM GMT">09:00 AM - 10:00 AM GMT</option>
                        <option value="10:00 AM - 11:00 AM GMT">10:00 AM - 11:00 AM GMT (Recommended)</option>
                        <option value="01:00 PM - 02:00 PM GMT">01:00 PM - 02:00 PM GMT</option>
                        <option value="03:00 PM - 04:00 PM GMT">03:00 PM - 04:00 PM GMT</option>
                        <option value="04:30 PM - 05:30 PM GMT">04:30 PM - 05:30 PM GMT</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Scope Notes / Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Project Scope, Architectural Challenges, or Specific Deliverables
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide context regarding your requirements, user scale, hardware peripheral needs, or current system architecture..."
                    className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  <span>Confirm and Schedule Discovery Session</span>
                </button>
              </form>
            </div>

            {/* Sidebar Column: Trust Signals & Office Details */}
            <div className="lg:col-span-4 space-y-6">
              {/* Engineering Guarantees Card */}
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Our Consultation Guarantee
                  </h3>
                </div>

                <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Direct discussion with senior engineering leads, not sales delegates.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Binding mutual Non-Disclosure Agreement (NDA) on request.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Transparent Ghanaian Cedis (GH₵) milestone billing model.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Hardware BOM availability validation with verified local warranty.</span>
                  </li>
                </ul>
              </div>

              {/* Accra Tech Corridor Office Card */}
              <div className="bg-slate-900 text-white p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-md space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>Accra Systems Lab & Office</span>
                </h3>

                <div className="text-xs text-slate-300 space-y-2 font-mono">
                  <p>{config.contact.physicalAddress}</p>
                  <p>{config.contact.cityCountry}</p>
                  <p className="pt-2 text-blue-400 font-bold">{config.contact.phonePrimary}</p>
                  <p className="text-slate-400">{config.contact.businessHours}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Need immediate answers?</span>
                  <button
                    type="button"
                    onClick={() => openChatWithContext("Urgent Consultation Request")}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open Live Chat</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
