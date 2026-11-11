import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  X, 
  Layers, 
  FolderKanban, 
  Users, 
  Cpu, 
  BookOpen, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { PageId } from '../../types/index.ts';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { 
    services, 
    completedProjects, 
    teamMembers, 
    hardwareProducts, 
    faqArticles, 
    letters,
    navigateTo 
  } = useSite();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or state
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    // 1. Services
    const matchedServices = (services || []).filter(s => 
      s.title.toLowerCase().includes(q) ||
      s.shortDesc.toLowerCase().includes(q) ||
      s.techStack.some(t => t.toLowerCase().includes(q)) ||
      s.category.toLowerCase().includes(q)
    ).slice(0, 3);

    // 2. Projects
    const matchedProjects = (completedProjects || []).filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.client.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.techStack.some(t => t.toLowerCase().includes(q))
    ).slice(0, 3);

    // 3. Team Members
    const matchedTeam = (teamMembers || []).filter(m => 
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      (m.assignedRole && m.assignedRole.toLowerCase().includes(q)) ||
      m.department.toLowerCase().includes(q)
    ).slice(0, 3);

    // 4. Hardware Products
    const matchedHardware = (hardwareProducts || []).filter(h => 
      h.name.toLowerCase().includes(q) ||
      h.sku.toLowerCase().includes(q) ||
      h.tagline.toLowerCase().includes(q) ||
      h.category.toLowerCase().includes(q)
    ).slice(0, 3);

    // 5. Knowledge Base
    const matchedFaq = (faqArticles || []).filter(f => 
      f.title.toLowerCase().includes(q) ||
      f.summary.toLowerCase().includes(q) ||
      f.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 3);

    // 6. Letter Verification matches
    const isRefLike = q.includes('drt') || q.includes('ltr') || q.includes('ref') || q.includes('verify') || q.includes('letter');
    const matchedLetters = (letters || []).filter(l => 
      l.referenceNumber.toLowerCase().includes(q) ||
      l.recipientCompany.toLowerCase().includes(q) ||
      l.subject.toLowerCase().includes(q)
    ).slice(0, 2);

    const totalCount = 
      matchedServices.length + 
      matchedProjects.length + 
      matchedTeam.length + 
      matchedHardware.length + 
      matchedFaq.length +
      matchedLetters.length;

    return {
      services: matchedServices,
      projects: matchedProjects,
      team: matchedTeam,
      hardware: matchedHardware,
      faq: matchedFaq,
      letters: matchedLetters,
      isRefLike,
      totalCount
    };
  }, [query, services, completedProjects, teamMembers, hardwareProducts, faqArticles, letters]);

  if (!isOpen) return null;

  const handleSelectPage = (page: PageId, extraAction?: () => void) => {
    onClose();
    navigateTo(page);
    if (extraAction) extraAction();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-20 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services, team members, projects, hardware, or letter ref..."
            className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            Esc
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {!query.trim() ? (
            /* Suggested Quick Links */
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Quick Navigation & Categories
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { label: 'Cloud & Software', page: 'services' as PageId, icon: Layers },
                  { label: 'Portfolio & MP4', page: 'projects' as PageId, icon: FolderKanban },
                  { label: 'Hardware Store', page: 'hardware' as PageId, icon: Cpu },
                  { label: 'Document Verify', page: 'verify' as PageId, icon: ShieldCheck },
                  { label: 'Track Project', page: 'tracker' as PageId, icon: Sparkles },
                  { label: 'Knowledge Base', page: 'knowledge' as PageId, icon: BookOpen },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleSelectPage(item.page)}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700/80 text-left transition-colors flex items-center gap-2.5 group"
                    >
                      <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sample Search Hints */}
              <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                <div>Tip: Search for <span className="text-blue-500 font-semibold">"Lead Developer"</span>, <span className="text-blue-500 font-semibold">"CRM"</span>, <span className="text-blue-500 font-semibold">"RFID"</span>, or verify a letter with <span className="text-blue-500 font-semibold">"DRT/LTR"</span>.</div>
              </div>
            </div>
          ) : results?.totalCount === 0 ? (
            /* No results */
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No matching results for "{query}"
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try searching for general keywords like "cloud", "consultant", "pricing", or navigate directly to our services catalog.
              </p>
            </div>
          ) : (
            /* Grouped Results */
            <div className="space-y-5">
              {/* Official Document Verification match */}
              {(results?.letters && results.letters.length > 0) || results?.isRefLike ? (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Official Letter & Document Verification</span>
                  </div>
                  {results?.letters && results.letters.length > 0 ? (
                    results.letters.map((letItem) => (
                      <button
                        key={letItem.id}
                        type="button"
                        onClick={() => {
                          onClose();
                          window.location.hash = `verify?ref=${encodeURIComponent(letItem.referenceNumber)}`;
                          navigateTo('verify');
                        }}
                        className="w-full p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-left transition-colors flex items-center justify-between"
                      >
                        <div>
                          <div className="font-mono text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                            {letItem.referenceNumber}
                          </div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-white">
                            {letItem.recipientCompany} — {letItem.subject}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase shrink-0 px-2 py-1 bg-emerald-100 dark:bg-emerald-900 rounded-md">
                          Verify Document
                        </span>
                      </button>
                    ))
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        window.location.hash = `verify?ref=${encodeURIComponent(query)}`;
                        navigateTo('verify');
                      }}
                      className="w-full p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-left transition-colors flex items-center justify-between"
                    >
                      <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                        Check authenticity of reference "{query}" on Verification Portal
                      </div>
                      <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
                    </button>
                  )}
                </div>
              ) : null}

              {/* Services Results */}
              {results?.services && results.services.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Services & Solutions ({results.services.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.services.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSelectPage('services')}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700/80 text-left transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {s.title}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            {s.shortDesc}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Team Members Results */}
              {results?.team && results.team.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Engineering Leadership & Team ({results.team.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.team.map((m) => (
                      <div
                        key={m.id}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={m.avatarUrl}
                            alt={m.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              {m.name}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                              <span>{m.role}</span>
                              {m.assignedRole && (
                                <span className="px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-semibold text-[10px]">
                                  {m.assignedRole}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSelectPage('contact')}
                          className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                        >
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Portfolio & Completed Projects */}
              {results?.projects && results.projects.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <FolderKanban className="w-3.5 h-3.5" />
                    <span>Projects & Case Studies ({results.projects.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.projects.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPage('projects')}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700/80 text-left transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            {p.title}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            {p.client} · {p.industry}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Hardware Catalog */}
              {results?.hardware && results.hardware.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Hardware Catalog ({results.hardware.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.hardware.map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => handleSelectPage('hardware')}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700/80 text-left transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600">
                            {h.name}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">
                            SKU: {h.sku} · GH₵ {h.price.toLocaleString()}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Knowledge Base */}
              {results?.faq && results.faq.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Knowledge Base ({results.faq.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.faq.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => handleSelectPage('knowledge')}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700/80 text-left transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600">
                            {f.title}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            {f.summary}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer shortcuts note */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-400 flex items-center justify-between px-6">
          <span>DeRoyalTech Systems Search</span>
          <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
            Press Esc to close
          </span>
        </div>
      </div>
    </div>
  );
};
