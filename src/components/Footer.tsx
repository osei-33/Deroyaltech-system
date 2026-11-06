import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Settings, 
  MessageSquare, 
  ExternalLink,
  Lock,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { useSite } from '../context/SiteContext.tsx';
import { 
  WhatsAppLogo, 
  FacebookLogo, 
  TikTokLogo, 
  InstagramLogo, 
  LinkedInLogo 
} from './SocialLogos.tsx';

interface FooterProps {
  openConsultation: () => void;
  openAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ openConsultation, openAdmin }) => {
  const { config, navigateTo, clientUser, logoutClient, setIsAuthModalOpen } = useSite();

  const getWhatsAppHref = (val?: string) => {
    if (!val) return 'https://wa.me/233245901284';
    if (val.startsWith('http')) return val;
    const cleaned = val.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleaned}`;
  };

  const isApproved = clientUser && clientUser.status === 'approved' && clientUser.isVerified;
  const isAdmin = clientUser && clientUser.isAdmin === true;

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info & Logo */}
          <div className="lg:col-span-2 space-y-4">
            <button 
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3 text-left group"
            >
              <img
                src={config.logoUrl}
                alt={config.contact.companyName}
                className="h-8 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              />
            </button>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Engineering unified web software, native mobile apps, custom CRM solutions, multi-cloud infrastructure, and enterprise computer peripherals to streamline operational workflows across Ghana and internationally.
            </p>

            <div className="pt-2 text-slate-300 space-y-2 font-mono text-[11px]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>{config.contact.physicalAddress}, {config.contact.cityCountry}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{config.contact.emailGeneral} · {config.contact.emailSales}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{config.contact.phonePrimary} / {config.contact.phoneSecondary}</span>
              </div>
            </div>

            {/* Official Social Media Vector Logos */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                Official Channels:
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* WhatsApp Logo */}
                <a
                  href={getWhatsAppHref(config.social.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-800/60 transition-all hover:scale-105"
                  title="Official WhatsApp: Contact DeRoyalTech"
                >
                  <WhatsAppLogo className="w-4 h-4" />
                </a>

                {/* Facebook Logo */}
                <a
                  href={config.social.facebook || 'https://facebook.com/deroyaltech'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-blue-950/60 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-800/60 transition-all hover:scale-105"
                  title="Official Facebook: DeRoyalTech"
                >
                  <FacebookLogo className="w-4 h-4" />
                </a>

                {/* TikTok Logo */}
                <a
                  href={config.social.tiktok || 'https://tiktok.com/@deroyaltech'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-pink-950/60 hover:bg-pink-600 text-pink-400 hover:text-white border border-pink-800/60 transition-all hover:scale-105"
                  title="Official TikTok: @deroyaltech"
                >
                  <TikTokLogo className="w-4 h-4" />
                </a>

                {/* Instagram Logo */}
                <a
                  href={config.social.instagram || 'https://instagram.com/deroyaltech'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-amber-950/60 hover:bg-gradient-to-r hover:from-amber-500 hover:to-pink-600 text-amber-400 hover:text-white border border-amber-800/60 transition-all hover:scale-105"
                  title="Official Instagram: @deroyaltech"
                >
                  <InstagramLogo className="w-4 h-4" />
                </a>

                {/* LinkedIn Logo */}
                <a
                  href={config.social.linkedin || 'https://linkedin.com/company/deroyaltech'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-sky-950/60 hover:bg-sky-600 text-sky-400 hover:text-white border border-sky-800/60 transition-all hover:scale-105"
                  title="Official LinkedIn: DeRoyalTech Systems"
                >
                  <LinkedInLogo className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Software & Systems */}
          <div className="space-y-3">
            <div className="text-white font-bold uppercase tracking-wider text-[11px]">
              Software & Cloud
            </div>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors text-left flex items-center gap-1">
                  <span>Custom Web Platforms</span>
                  {!isApproved && <Lock className="w-2.5 h-2.5 text-slate-500" />}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors text-left flex items-center gap-1">
                  <span>Native iOS & Android Apps</span>
                  {!isApproved && <Lock className="w-2.5 h-2.5 text-slate-500" />}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors text-left flex items-center gap-1">
                  <span>Custom CRM Architectures</span>
                  {!isApproved && <Lock className="w-2.5 h-2.5 text-slate-500" />}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors text-left flex items-center gap-1">
                  <span>Multi-Cloud Kubernetes</span>
                  {!isApproved && <Lock className="w-2.5 h-2.5 text-slate-500" />}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors text-left flex items-center gap-1">
                  <span>Terraform Cloud DevOps</span>
                  {!isApproved && <Lock className="w-2.5 h-2.5 text-slate-500" />}
                </button>
              </li>
            </ul>
          </div>

          {/* Hardware & Peripherals */}
          <div className="space-y-3">
            <div className="text-white font-bold uppercase tracking-wider text-[11px]">
              Hardware & Edge (GH₵)
            </div>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigateTo('hardware')} className="hover:text-white transition-colors text-left flex items-center gap-1">
                  <span>Pro-X Workstations</span>
                  {!isApproved && <Lock className="w-2.5 h-2.5 text-slate-500" />}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('hardware')} className="hover:text-white transition-colors text-left flex items-center gap-1">
                  <span>1U Edge Gateway Servers</span>
                  {!isApproved && <Lock className="w-2.5 h-2.5 text-slate-500" />}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('hardware')} className="hover:text-white transition-colors text-left flex items-center gap-1">
                  <span>Industrial RFID Scanners</span>
                  {!isApproved && <Lock className="w-2.5 h-2.5 text-slate-500" />}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('hardware')} className="hover:text-white transition-colors text-left flex items-center gap-1">
                  <span>5K Displays & Docking Stations</span>
                  {!isApproved && <Lock className="w-2.5 h-2.5 text-slate-500" />}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('hardware')} className="hover:text-white transition-colors text-left flex items-center gap-1">
                  <span>OmniPay Biometric POS</span>
                  {!isApproved && <Lock className="w-2.5 h-2.5 text-slate-500" />}
                </button>
              </li>
            </ul>
          </div>

          {/* Dedicated Dedicated Pages & Client Portal */}
          <div className="space-y-3">
            <div className="text-white font-bold uppercase tracking-wider text-[11px]">
              Portals & Directory
            </div>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors text-left">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('projects')} className="hover:text-white transition-colors text-left flex items-center gap-1">
                  <span>Completed Projects & MP4</span>
                  {!isApproved && <Lock className="w-2.5 h-2.5 text-slate-500" />}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('workflow')} className="hover:text-white transition-colors text-left flex items-center gap-1">
                  <span>Workflow Pipeline Simulator</span>
                  {!isApproved && <Lock className="w-2.5 h-2.5 text-slate-500" />}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('estimator')} className="hover:text-white transition-colors text-left flex items-center gap-1">
                  <span>Scope Estimator (GH₵)</span>
                  {!isApproved && <Lock className="w-2.5 h-2.5 text-slate-500" />}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('knowledge')} className="hover:text-white transition-colors text-left flex items-center gap-1 text-blue-400 font-semibold">
                  <span>Knowledge Base & FAQ Center</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('tracker')} className="hover:text-white transition-colors text-left flex items-center gap-1 text-emerald-400 font-semibold">
                  <span>Live Project Tracker</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('consultation')} className="hover:text-white transition-colors text-left flex items-center gap-1 text-blue-400 font-semibold">
                  <span>Schedule Consultation</span>
                </button>
              </li>
              {clientUser?.isAdmin && (
                <li>
                  <button onClick={() => navigateTo('inquiries')} className="hover:text-white transition-colors text-left flex items-center gap-1 text-amber-400 font-semibold">
                    <span>Client Inquiries Dashboard</span>
                  </button>
                </li>
              )}
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors text-left flex items-center gap-1">
                  <span>Ghana Offices & Contact Hub</span>
                  {!isApproved && <Lock className="w-2.5 h-2.5 text-slate-500" />}
                </button>
              </li>

              {/* Show Log Out option in footer if logged in */}
              {clientUser && (
                <li>
                  <button
                    onClick={logoutClient}
                    className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out ({clientUser.fullName.split(' ')[0]})</span>
                  </button>
                </li>
              )}

              {/* Admin Portal link - only shown to Admin! Or discreet staff login */}
              {isAdmin ? (
                <li>
                  <button
                    onClick={openAdmin}
                    className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1.5"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Admin CMS Console</span>
                  </button>
                </li>
              ) : (
                <li>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-slate-600 hover:text-slate-400 flex items-center gap-1 text-[10px]"
                    title="Administrator Login"
                  >
                    <ShieldAlert className="w-3 h-3" />
                    <span>Staff Gateway</span>
                  </button>
                </li>
              )}

              <li>
                <button
                  onClick={openConsultation}
                  className="text-blue-400 hover:text-blue-300 font-semibold text-left"
                >
                  Schedule Discovery Call →
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} DeRoyalTech Systems Inc. All rights reserved. Registered in Ghana and internationally.
          </div>
          <div className="flex items-center gap-4">
            <span>SOC 2 Type II Audited</span>
            <span>·</span>
            <span>ISO 27001 Certified</span>
            <span>·</span>
            <span>Enterprise SLA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
