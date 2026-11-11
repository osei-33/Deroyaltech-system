import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Save, 
  RotateCcw, 
  ExternalLink, 
  Check, 
  X, 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  Sparkles, 
  Clock, 
  Tag, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Star
} from 'lucide-react';
import { useSite } from '../../../context/SiteContext.tsx';
import { FAQArticle, FAQCategory } from '../../../types/index.ts';

const FAQ_CATEGORIES: FAQCategory[] = [
  'General & Onboarding',
  'Web & Mobile Development',
  'Custom CRM Solutions',
  'Cloud Infrastructure & DevOps',
  'Hardware & Peripherals',
  'Billing & Ghana Cedis Pricing',
  'Project Tracking & SLAs'
];

export const AdminKnowledgeBaseTab: React.FC = () => {
  const { 
    faqArticles, 
    addFAQArticle, 
    updateFAQArticle, 
    deleteFAQArticle, 
    resetFAQToDefault,
    navigateTo 
  } = useSite();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Modal / Form state for Add/Edit
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  
  // Preview modal
  const [previewArticle, setPreviewArticle] = useState<FAQArticle | null>(null);

  // Form fields
  const [formCategory, setFormCategory] = useState<FAQCategory>('General & Onboarding');
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formReadTime, setFormReadTime] = useState(3);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [formAuthor, setFormAuthor] = useState('DeRoyalTech Systems Lead');

  const filteredArticles = faqArticles.filter(art => {
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalHelpful = faqArticles.reduce((acc, a) => acc + (a.helpfulVotes || 0), 0);
  const totalPublished = faqArticles.filter(a => a.isPublished).length;
  const totalFeatured = faqArticles.filter(a => a.isFeatured).length;

  const handleOpenCreate = () => {
    setEditingArticleId(null);
    setFormCategory('General & Onboarding');
    setFormTitle('');
    setFormSlug('');
    setFormSummary('');
    setFormContent('');
    setFormTags('Getting Started, Overview');
    setFormReadTime(3);
    setFormIsFeatured(false);
    setFormIsPublished(true);
    setFormAuthor('DeRoyalTech Systems Lead');
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (art: FAQArticle) => {
    setEditingArticleId(art.id);
    setFormCategory(art.category);
    setFormTitle(art.title);
    setFormSlug(art.slug);
    setFormSummary(art.summary);
    setFormContent(art.content);
    setFormTags(art.tags.join(', '));
    setFormReadTime(art.readTimeMinutes);
    setFormIsFeatured(art.isFeatured);
    setFormIsPublished(art.isPublished);
    setFormAuthor(art.author);
    setIsEditorOpen(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const parsedTags = formTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (editingArticleId) {
      updateFAQArticle(editingArticleId, {
        category: formCategory,
        title: formTitle.trim(),
        slug: formSlug.trim() || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        summary: formSummary.trim(),
        content: formContent.trim(),
        tags: parsedTags,
        readTimeMinutes: Number(formReadTime) || 3,
        isFeatured: formIsFeatured,
        isPublished: formIsPublished,
        author: formAuthor.trim() || 'DeRoyalTech Systems Lead'
      });
    } else {
      addFAQArticle({
        category: formCategory,
        title: formTitle.trim(),
        slug: formSlug.trim() || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        summary: formSummary.trim(),
        content: formContent.trim(),
        tags: parsedTags,
        readTimeMinutes: Number(formReadTime) || 3,
        isFeatured: formIsFeatured,
        isPublished: formIsPublished,
        author: formAuthor.trim() || 'DeRoyalTech Systems Lead'
      });
    }

    setIsEditorOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Overview Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Knowledge Base & Self-Serve FAQ Center
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Empower enterprise clients to self-serve with comprehensive technical guides, pricing policies, hardware documentation, and SLA references.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => navigateTo('knowledge')}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Visit Client Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New FAQ Article</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Articles</div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {faqArticles.length}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">Live Published</div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {totalPublished}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Featured Guides</div>
          <div className="text-xl font-bold font-mono text-amber-500 mt-1">
            {totalFeatured}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-500">Helpful Votes</div>
          <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
            +{totalHelpful}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search FAQ articles by question, keyword, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs text-slate-900 dark:text-white border border-transparent focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-xs rounded-xl border border-transparent focus:border-blue-500 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
          >
            <option value="all">All Categories ({faqArticles.length})</option>
            {FAQ_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={resetFAQToDefault}
            title="Restore Default DeRoyalTech Knowledge Base"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-3">
        {filteredArticles.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              No FAQ articles found matching your criteria.
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="mt-3 px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-500"
            >
              + Create First FAQ Article
            </button>
          </div>
        ) : (
          filteredArticles.map((art) => (
            <div
              key={art.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                      {art.category}
                    </span>

                    {art.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>Featured</span>
                      </span>
                    )}

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      art.isPublished 
                        ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {art.isPublished ? '● Published' : 'Draft'}
                    </span>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{art.readTimeMinutes} min read</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {art.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {art.summary}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewArticle(art)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Client View Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(art)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Article"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteFAQArticle(art.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete Article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tags & Feedback footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-500">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Tag className="w-3 h-3 text-slate-400" />
                  {art.tags.map(t => (
                    <span key={t} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px]">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <ThumbsUp className="w-3 h-3" />
                    <span>+{art.helpfulVotes || 0}</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <ThumbsDown className="w-3 h-3" />
                    <span>-{art.unhelpfulVotes || 0}</span>
                  </span>
                  <span className="text-slate-400">By {art.author}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <h4 className="font-bold text-sm">
                  {editingArticleId ? 'Edit FAQ Article' : 'Create New Knowledge Base FAQ Article'}
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

            <form onSubmit={handleSaveArticle} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as FAQCategory)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white border border-transparent focus:border-blue-500 focus:outline-none"
                  >
                    {FAQ_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Read Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white border border-transparent focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Question / Article Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How does the DeRoyalTech Project Tracker work?"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white border border-transparent focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Brief Summary (shown in search previews)
                </label>
                <input
                  type="text"
                  placeholder="A clear 1-2 sentence overview explaining the answer."
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white border border-transparent focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Detailed Answer Content (Markdown supported) *
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder="Write clear, comprehensive steps, hardware specifications, SLA commitments, or pricing rules..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white border border-transparent focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Tracker, Milestones, Ghana Cedis, Hardware"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white border border-transparent focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Author / Department
                  </label>
                  <input
                    type="text"
                    placeholder="Principal Systems Administrator"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white border border-transparent focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                  />
                  <span>Feature on Knowledge Base Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                  />
                  <span>Publish Immediately (Visible to Clients)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingArticleId ? 'Update Article' : 'Publish Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Preview Modal */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
                {previewArticle.category}
              </span>
              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {previewArticle.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {previewArticle.readTimeMinutes} min read · Authored by {previewArticle.author}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
              {previewArticle.content}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="text-slate-400">
                Helpfulness: +{previewArticle.helpfulVotes} helpful
              </div>
              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
