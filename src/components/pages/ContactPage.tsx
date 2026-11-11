import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Share2, 
  ExternalLink,
  MessageCircle,
  Building,
  Sparkles
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { 
  WhatsAppLogo, 
  FacebookLogo, 
  TikTokLogo, 
  InstagramLogo, 
  LinkedInLogo 
} from '../SocialLogos.tsx';

export const ContactPage: React.FC = () => {
  const { config, submitInquiry, navigateTo, clientUser } = useSite();

  const [form, setForm] = useState({
    fullName: clientUser?.fullName || '',
    email: clientUser?.email || '',
    company: clientUser?.company || '',
    projectType: 'crm',
    budget: 'GH₵ 150,000 - GH₵ 400,000',
    timeline: 'Within 2-3 months',
    message: ''
  });

  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = submitInquiry({
      fullName: form.fullName,
      email: form.email,
      company: form.company,
      projectType: form.projectType,
      budget: form.budget,
      timeline: form.timeline,
      message: form.message
    });
    setSubmittedId(id);
  };

  const getWhatsAppHref = (val: string) => {
    if (!val) return 'https://wa.me/233245901284';
    if (val.startsWith('http')) return val;
    const cleaned = val.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleaned}`;
  };

  return (
    <div className="py-8 sm:py-12 space-y-12">
      {/* Breadcrumb Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>

          {clientUser && (
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verified Session: {clientUser.company}</span>
            </div>
          )}
        </div>

        <div className="pt-8 max-w-3xl space-y-3">
          <div className="text-xs font-bold font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Headquarters & Global Communication Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Connect with DeRoyalTech Engineering
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Visit our physical engineering center in Accra, Ghana, reach our direct telephone and WhatsApp lines, or follow our official social channels for architectural updates, product releases, and technology insights.
          </p>
        </div>
      </div>

      {/* Social Media Channels Hub (WhatsApp, Facebook, TikTok, Instagram, LinkedIn) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <Share2 className="w-4 h-4" />
                <span>Official Social Media & Communication Channels</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                Direct Channels Managed by DeRoyalTech
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Configured via Admin CMS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* WhatsApp */}
            <a
              href={getWhatsAppHref(config.social.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <WhatsAppLogo className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
                  WhatsApp
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Instant RFQ & Dispatch
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 group-hover:underline">
                <span>{config.contact.whatsappNumber || '+233 24 590 1284'}</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            {/* Facebook */}
            <a
              href={config.social.facebook || 'https://facebook.com/deroyaltech'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 hover:border-blue-500 hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
                  <FacebookLogo className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
                  Facebook
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Official Company Updates
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-blue-700 dark:text-blue-400 group-hover:underline">
                <span>@deroyaltech</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            {/* TikTok */}
            <a
              href={config.social.tiktok || 'https://tiktok.com/@deroyaltech'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800/80 hover:border-pink-500 hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-pink-500 flex items-center justify-center shadow-sm">
                  <TikTokLogo className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
                  TikTok
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Tech Demos & Hardware
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-pink-700 dark:text-pink-400 group-hover:underline">
                <span>@deroyaltech</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            {/* Instagram */}
            <a
              href={config.social.instagram || 'https://instagram.com/deroyaltech'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 hover:border-amber-500 hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-sm">
                  <InstagramLogo className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
                  Instagram
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Engineering Showcase
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-700 dark:text-rose-400 group-hover:underline">
                <span>@deroyaltech</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href={config.social.linkedin || 'https://linkedin.com/company/deroyaltech'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 hover:border-sky-500 hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <div className="w-9 h-9 rounded-lg bg-sky-700 text-white flex items-center justify-center shadow-sm">
                  <LinkedInLogo className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white pt-2">
                  LinkedIn
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Enterprise Leadership
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-sky-700 dark:text-sky-400 group-hover:underline">
                <span>DeRoyalTech Systems</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Physical Office Details & Interactive Consultation Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Physical Office & Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Ghana Engineering Headquarters
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Standard Chartered Building, Airport City & Spintex Corridor
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Physical Location:</span>
                    <span className="text-slate-600 dark:text-slate-300">{config.contact.physicalAddress}, {config.contact.cityCountry}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Direct Voice Lines:</span>
                    <span className="text-slate-600 dark:text-slate-300 font-mono block">{config.contact.phonePrimary}</span>
                    <span className="text-slate-600 dark:text-slate-300 font-mono block">{config.contact.phoneSecondary}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Email Departments:</span>
                    <span className="text-slate-600 dark:text-slate-300 font-mono block">General: {config.contact.emailGeneral}</span>
                    <span className="text-slate-600 dark:text-slate-300 font-mono block">Sales: {config.contact.emailSales}</span>
                    <span className="text-slate-600 dark:text-slate-300 font-mono block">Support: {config.contact.emailSupport}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Engineering SLA & Hours:</span>
                    <span className="text-slate-600 dark:text-slate-300">{config.contact.businessHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="p-6 rounded-2xl bg-emerald-600 text-white space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-100">
                <MessageSquare className="w-4 h-4" />
                <span>Immediate WhatsApp Dispatch</span>
              </div>
              <h4 className="text-lg font-bold">Have an urgent RFQ or hardware request?</h4>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Send our Accra systems director a direct WhatsApp message for rapid quote issuance within 45 minutes.
              </p>
              <a
                href={getWhatsAppHref(config.social.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-800 text-xs font-bold rounded-lg hover:bg-emerald-50 transition-colors"
              >
                <span>Message on WhatsApp ({config.contact.whatsappNumber})</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Consultation & Brief Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Submit Direct Inquiry or Hardware RFQ
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Our engineering team guarantees responses within 2 business hours.
                </p>
              </div>

              {submittedId ? (
                <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-4 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Inquiry Received Successfully!
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      Your reference tracking code is <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{submittedId}</span>. A DeRoyalTech engineering director has been notified and will contact you via email and phone.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSubmittedId(null);
                      setForm({
                        fullName: '',
                        email: '',
                        company: '',
                        projectType: 'crm',
                        budget: 'GH₵ 150,000 - GH₵ 400,000',
                        timeline: 'Within 2-3 months',
                        message: ''
                      });
                    }}
                    className="px-4 py-2 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        placeholder="e.g. Kwame Mensah"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Work Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="e.g. k.mensah@company.com"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Company or Organization *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="e.g. West Africa Shippers Council"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Project Scope Domain
                      </label>
                      <select
                        value={form.projectType}
                        onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      >
                        <option value="crm">Custom CRM Architecture</option>
                        <option value="web">Web Application & Portal</option>
                        <option value="mobile">Native Mobile App (iOS / Android)</option>
                        <option value="cloud">Multi-Cloud Infrastructure</option>
                        <option value="hardware">Computer Hardware Peripherals</option>
                        <option value="turnkey">Turnkey Full-Stack + Hardware</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Estimated Budget Bracket (GH₵)
                      </label>
                      <select
                        value={form.budget}
                        onChange={(e) => setForm({ ...form, budget: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                      >
                        <option value="GH₵ 40,000 - GH₵ 80,000">GH₵ 40,000 - GH₵ 80,000</option>
                        <option value="GH₵ 80,000 - GH₵ 150,000">GH₵ 80,000 - GH₵ 150,000</option>
                        <option value="GH₵ 150,000 - GH₵ 400,000">GH₵ 150,000 - GH₵ 400,000</option>
                        <option value="GH₵ 400,000+ Enterprise">GH₵ 400,000+ Enterprise Turnkey</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Target Timeline
                      </label>
                      <select
                        value={form.timeline}
                        onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      >
                        <option value="Immediate / Critical (1 Month)">Immediate / Critical (1 Month)</option>
                        <option value="Within 2-3 months">Within 2-3 months</option>
                        <option value="Next Quarter">Next Quarter</option>
                        <option value="Budgeting Phase">Budgeting & RFQ Exploration</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Project Specifications or Hardware Needs
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Describe your workflows, existing software stacks, hardware quantities needed, or performance bottlenecks..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Inquiry to Accra Engineering Team</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
