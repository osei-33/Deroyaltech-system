import React, { useState, useMemo } from 'react';
import { 
  Search, 
  BookOpen, 
  HelpCircle, 
  ThumbsUp, 
  ThumbsDown, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Clock, 
  Tag, 
  MessageSquare, 
  ShieldCheck, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Coins, 
  Activity, 
  Terminal,
  X
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { FAQArticle, FAQCategory } from '../../types/index.ts';

const FAQ_CATEGORIES: { id: string; label: string; icon: any }[] = [
  { id: 'all', label: 'All Articles', icon: BookOpen },
  { id: 'Cloud Infrastructure', label: 'Cloud Infrastructure', icon: Terminal },
  { id: 'Hardware', label: 'Hardware', icon: Cpu },
  { id: 'Software Dev', label: 'Software Dev', icon: Layers },
  { id: 'Custom CRM Solutions', label: 'Custom CRM & Telemetry', icon: Layers },
  { id: 'Project Tracking & SLAs', label: 'Project Tracking & SLAs', icon: Activity },
  { id: 'Billing & Ghana Cedis Pricing', label: 'Ghana Cedis (GH₵) Pricing', icon: Coins },
  { id: 'General & Onboarding', label: 'Onboarding & Security', icon: ShieldCheck }
];

export const isCategoryMatch = (articleCategory: string, selectedCat: string): boolean => {
  if (selectedCat === 'all') return true;
  if (selectedCat === 'Cloud Infrastructure') {
    return articleCategory === 'Cloud Infrastructure' || articleCategory === 'Cloud Infrastructure & DevOps';
  }
  if (selectedCat === 'Hardware') {
    return articleCategory === 'Hardware' || articleCategory === 'Hardware & Peripherals';
  }
  if (selectedCat === 'Software Dev') {
    return articleCategory === 'Software Dev' || articleCategory === 'Web & Mobile Development';
  }
  if (selectedCat === 'Custom CRM Solutions') {
    return articleCategory === 'Custom CRM Solutions';
  }
  if (selectedCat === 'Project Tracking & SLAs') {
    return articleCategory === 'Project Tracking & SLAs';
  }
  if (selectedCat === 'Billing & Ghana Cedis Pricing') {
    return articleCategory === 'Billing & Ghana Cedis Pricing';
  }
  if (selectedCat === 'General & Onboarding') {
    return articleCategory === 'General & Onboarding';
  }
  return articleCategory === selectedCat;
};

export const KnowledgeBasePage: React.FC = () => {
  const { 
    faqArticles, 
    voteFAQHelpful, 
    openChatWithContext, 
    setIsTrackerModalOpen, 
    navigateTo 
  } = useSite();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);
  const [votedMap, setVotedMap] = useState<Record<string, 'up' | 'down'>>({});

  const publishedArticles = useMemo(() => {
    return faqArticles.filter(a => a.isPublished);
  }, [faqArticles]);

  // Filters available articles based on category selection AND keyword matching against titles, descriptions (summary), content, and tags
  const filteredArticles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const keywords = q ? q.split(/\s+/).filter(Boolean) : [];

    return publishedArticles.filter(art => {
      const matchesCategory = isCategoryMatch(art.category, selectedCategory);
      if (!matchesCategory) return false;
      if (keywords.length === 0) return true;

      const title = (art.title || '').toLowerCase();
      const description = (art.summary || '').toLowerCase();
      const content = (art.content || '').toLowerCase();
      const tags = (art.tags || []).map(t => t.toLowerCase()).join(' ');

      // Every keyword token entered by the user must match against title, description, content, or tags
      return keywords.every(kw => 
        title.includes(kw) || description.includes(kw) || content.includes(kw) || tags.includes(kw)
      );
    });
  }, [publishedArticles, selectedCategory, searchQuery]);

  const featuredArticles = useMemo(() => {
    return publishedArticles.filter(a => a.isFeatured);
  }, [publishedArticles]);

  const handleToggleExpand = (id: string) => {
    setExpandedArticleId(prev => (prev === id ? null : id));
  };

  const handleVote = (id: string, isHelpful: boolean) => {
    if (votedMap[id]) return; // already voted
    voteFAQHelpful(id, isHelpful);
    setVotedMap(prev => ({ ...prev, [id]: isHelpful ? 'up' : 'down' }));
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white py-16 sm:py-24 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DeRoyalTech Knowledge Base & Client Help Center</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            How can our engineering team <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              help you build and scale?
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            Search our comprehensive documentation, milestone tracking guides, hardware peripheral specifications, and transparent Ghanaian Cedis pricing structures.
          </p>

          {/* Interactive Search Bar */}
          <div className="max-w-2xl mx-auto relative mt-4">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by keywords (e.g., 'Project ID', 'Custom CRM', 'Cedis escrow', 'RFID scanner')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-xl transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white px-2 py-1 rounded-md bg-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Popular Tag Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 pt-2">
            <span className="font-semibold text-slate-500">Popular Searches:</span>
            {['Project Tracker', 'Ghanaian Cedis (GH₵)', 'Custom CRM', 'RFID Hardware', '99.99% SLA', 'Admin Approval'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchQuery(tag)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Categories Pills Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-slate-200 dark:border-slate-800 mb-8">
          {FAQ_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count = cat.id === 'all' 
              ? publishedArticles.length 
              : publishedArticles.filter(a => isCategoryMatch(a.category, cat.id)).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Featured Quick Answers (shown if no search active) */}
        {!searchQuery && selectedCategory === 'all' && (
          <div className="mb-12 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Essential Client Questions & Answers</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredArticles.slice(0, 3).map((art) => (
                <div
                  key={art.id}
                  onClick={() => handleToggleExpand(art.id)}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer shadow-sm group flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
                      {art.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{art.readTimeMinutes} min</span>
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Read guide</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Articles Accordion List */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{searchQuery ? `Search Results for "${searchQuery}"` : 'Browse Documentation Articles'}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                  {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Keyword matching against article titles and descriptions.
              </p>
            </div>

            {/* In-Page Keyword Search Input Bar */}
            <div className="relative w-full sm:w-80 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search titles or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all min-h-[40px]"
                aria-label="Search articles by keyword against title and description"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear keyword search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-3">
              <HelpCircle className="w-10 h-10 text-slate-400 mx-auto opacity-60" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                No matching articles found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Couldn't find the answer to your question? Connect directly with our lead solutions architects via 24/7 Live Support or book an engineering discovery call.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => openChatWithContext("Knowledge Base Inquiry")}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors shadow-sm"
                >
                  Start Live Support Chat
                </button>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredArticles.map((art) => {
                const isExpanded = expandedArticleId === art.id;
                const userVote = votedMap[art.id];

                return (
                  <div
                    key={art.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isExpanded
                        ? 'bg-white dark:bg-slate-900 border-blue-400 dark:border-blue-700 shadow-lg'
                        : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Accordion Trigger */}
                    <button
                      type="button"
                      onClick={() => handleToggleExpand(art.id)}
                      className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 transition-colors"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCategory(art.category);
                            }}
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                            title={`Filter articles by ${art.category}`}
                          >
                            {art.category}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>{art.readTimeMinutes} min</span>
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {art.title}
                        </h3>

                        {!isExpanded && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {art.summary}
                          </p>
                        )}
                      </div>

                      <div className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0 mt-1">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-blue-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Article Body */}
                    {isExpanded && (
                      <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-5 animate-in fade-in duration-200">
                        {/* Summary highlight */}
                        <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 leading-relaxed font-medium">
                          <strong>Key Takeaway:</strong> {art.summary}
                        </div>

                        {/* Formatted Markdown / Detailed text */}
                        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-sans space-y-3">
                          {art.content}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-2">
                          <Tag className="w-3.5 h-3.5 text-slate-400" />
                          {art.tags.map(t => (
                            <span 
                              key={t}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSearchQuery(t);
                              }}
                              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px] cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>

                        {/* Interactive Helpfulness Feedback & Author Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <span className="font-semibold">Was this answer helpful?</span>
                            <button
                              type="button"
                              onClick={() => handleVote(art.id, true)}
                              disabled={!!userVote}
                              className={`px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
                                userVote === 'up'
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 dark:hover:text-emerald-400'
                              }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>Yes ({art.helpfulVotes || 0})</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleVote(art.id, false)}
                              disabled={!!userVote}
                              className={`px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
                                userVote === 'down'
                                  ? 'bg-red-600 text-white border-red-600'
                                  : 'border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/60 hover:text-red-600 dark:hover:text-red-400'
                              }`}
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                              <span>No</span>
                            </button>
                          </div>

                          <div className="text-[11px] text-slate-400">
                            Verified by: <strong className="text-slate-600 dark:text-slate-300">{art.author}</strong>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Help Center CTA Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border border-blue-900/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Engineering Support Standby</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              Require a custom solution or on-site engineering review?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Our Accra-based systems leads are ready to review your warehouse topology, hardware integration fleet, or bespoke CRM specifications.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => openChatWithContext("Consultation via Knowledge Base")}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open Live Support Chat</span>
            </button>
            <button
              type="button"
              onClick={() => setIsTrackerModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Track Project ID</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
