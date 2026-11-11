import React from 'react';
import { 
  Users, 
  Mail, 
  Linkedin, 
  Github, 
  ShieldCheck, 
  ExternalLink,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';

export const TeamShowcaseSection: React.FC = () => {
  const { teamMembers, navigateTo } = useSite();

  const activeMembers = (teamMembers || []).filter(m => m.isActive);

  if (activeMembers.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>Systems Leadership & Engineering</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Meet the DeRoyalTech Engineering Directorate
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Principal solutions architects, cloud DevOps leads, and hardware integration specialists based in Airport City, Accra.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('consultation')}
          className="group flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
        >
          <span>Consult with Technical Leads</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {activeMembers.map((member) => (
          <div
            key={member.id}
            className="group p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-all hover:shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Avatar with status indicator */}
              <div className="relative">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-full h-52 rounded-xl object-cover border border-slate-200 dark:border-slate-800 group-hover:scale-[1.01] transition-transform duration-300"
                />
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ACCRA HQ</span>
                </span>
              </div>

              {/* Info */}
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {member.name}
                </h3>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {member.role}
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  {member.department}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 pt-1 leading-relaxed line-clamp-3">
                  {member.bio}
                </p>
              </div>
            </div>

            {/* Social & Contact */}
            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2.5">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="hover:text-emerald-500 transition-colors"
                    title={`Email ${member.name}`}
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-500 transition-colors"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {member.githubUrl && (
                  <a
                    href={member.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-slate-900 dark:hover:text-white transition-colors"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>

              <span className="text-[10px] font-mono text-slate-400">
                Verified Lead
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
