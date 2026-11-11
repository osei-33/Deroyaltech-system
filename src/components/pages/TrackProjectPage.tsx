import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Calendar, 
  UserCheck, 
  Cpu, 
  MessageSquare, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle,
  HardDrive,
  FileCode,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Mail,
  Eye,
  Sparkles,
  ChevronRight,
  Send,
  Download
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { TrackedProject, ProjectMilestone, ProjectLogEntry, ProjectEmailAlert } from '../../types/index.ts';
import { InteractiveProjectTimeline } from '../tracker/InteractiveProjectTimeline.tsx';
import { generateProjectPdfReport } from '../../utils/generateProjectPdfReport.ts';

interface TrackProjectPageProps {
  embedded?: boolean;
}

export const TrackProjectPage: React.FC<TrackProjectPageProps> = ({ embedded = false }) => {
  const { 
    trackedProjects, 
    trackerSearchId, 
    setTrackerSearchId,
    clientUser,
    openChatWithContext,
    formatPrice,
    emailAlerts,
    navigateTo,
    config
  } = useSite();

  const [inputQuery, setInputQuery] = useState(trackerSearchId || '');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    trackerSearchId || (trackedProjects.length > 0 ? trackedProjects[0].projectId : '')
  );
  const [copiedId, setCopiedId] = useState(false);
  const [viewingAlert, setViewingAlert] = useState<ProjectEmailAlert | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleDownloadPdf = async (project: TrackedProject) => {
    setIsExportingPdf(true);
    try {
      await generateProjectPdfReport(project, config);
    } catch (err) {
      console.error('Failed to export PDF status report:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  useEffect(() => {
    if (trackerSearchId) {
      setInputQuery(trackerSearchId);
      setSelectedProjectId(trackerSearchId);
    }
  }, [trackerSearchId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputQuery.trim().toUpperCase();
    if (clean) {
      setSelectedProjectId(clean);
      setTrackerSearchId(clean);
    }
  };

  const handleQuickSelect = (id: string) => {
    setInputQuery(id);
    setSelectedProjectId(id);
    setTrackerSearchId(id);
  };

  const currentProject: TrackedProject | undefined = trackedProjects.find(
    p => p.projectId.toUpperCase() === selectedProjectId.toUpperCase()
  );

  const projectEmailAlerts = emailAlerts.filter(
    a => a.projectId.toUpperCase() === selectedProjectId.toUpperCase()
  );

  const handleCopyId = (id: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const getStageBadgeColor = (stage: string) => {
    switch (stage) {
      case 'completed': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'deployment': return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30';
      case 'testing_qa': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'hardware_assembly': return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
      case 'development': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'prototyping': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'architecture_planning': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30';
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className={`w-full max-w-full overflow-x-hidden ${embedded ? 'py-4' : 'min-h-screen pb-24 bg-slate-50 dark:bg-slate-950'} text-slate-900 dark:text-white transition-colors`}>
      {/* Top Hero Section (Standalone Mode Only) */}
      {!embedded && (
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white py-16 sm:py-20 border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Real-Time Client Telemetry & Milestone Verification</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Live Engineering & <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                Project Milestone Tracker
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
              Monitor real-time progress, CI/CD sprint milestones, hardware assembly benchmarks, and automated email dispatches for your active enterprise systems contracts.
            </p>

            {/* Interactive Project ID Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative mt-4">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Project Tracking ID (e.g., DRT-2026-7841)..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="w-full pl-12 pr-28 py-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-xl transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
              >
                <span>Track</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Select Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
              <span className="text-slate-400 font-semibold">Active Projects:</span>
              {trackedProjects.map((p) => {
                const isSelected = p.projectId.toUpperCase() === selectedProjectId.toUpperCase();
                return (
                  <button
                    key={p.projectId}
                    type="button"
                    onClick={() => handleQuickSelect(p.projectId)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : 'bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300'
                    }`}
                  >
                    {p.projectId}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Main Tracker Container */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${embedded ? 'pt-2' : 'pt-10'}`}>
        {/* Search bar inside embedded view */}
        {embedded && (
          <div className="mb-6 space-y-3">
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Project ID (e.g. DRT-2026-7841)..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1"
              >
                <span>Track</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold text-[11px]">Active Sprints:</span>
              {trackedProjects.map((p) => {
                const isSelected = p.projectId.toUpperCase() === selectedProjectId.toUpperCase();
                return (
                  <button
                    key={p.projectId}
                    type="button"
                    onClick={() => handleQuickSelect(p.projectId)}
                    className={`px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-bold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                    }`}
                  >
                    {p.projectId}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {currentProject ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Project Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{currentProject.projectId}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyId(currentProject.projectId)}
                        className="ml-1 hover:text-blue-700 dark:hover:text-blue-200"
                        title="Copy Project ID"
                      >
                        {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </span>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${getStageBadgeColor(currentProject.stage)}`}>
                      {currentProject.stageLabel || currentProject.stage.replace(/_/g, ' ')}
                    </span>

                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Client: {currentProject.clientCompany || currentProject.clientName}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {currentProject.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Service Scope: <strong className="text-slate-800 dark:text-slate-200">{currentProject.serviceTitle}</strong> · Lead Systems Architect: <strong className="text-blue-600 dark:text-blue-400">{currentProject.leadEngineer}</strong>
                  </p>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDownloadPdf(currentProject)}
                    disabled={isExportingPdf}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isExportingPdf ? 'Exporting PDF...' : 'Download PDF Report'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openChatWithContext(`Tracking inquiry for Project [${currentProject.projectId}]`, currentProject.projectId)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span>Chat with Engineering Team</span>
                  </button>

                  {currentProject.liveUrl && (
                    <a
                      href={currentProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                      <span>Live Staging Portal</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Progress Bar & Key Metas */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    Sprint Execution & Verification Progress
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">
                    {currentProject.progressPercent}% Completed
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.max(5, currentProject.progressPercent))}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">Kickoff Date</span>
                    <strong className="text-slate-800 dark:text-slate-200">{currentProject.startDate || 'November 2026'}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">Target Handover</span>
                    <strong className="text-blue-600 dark:text-blue-400">{currentProject.estimatedDeliveryDate || 'December 2026'}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">Hardware Telemetry</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {currentProject.hardwareUnitsCount ? `${currentProject.hardwareUnitsCount} Nodes Active` : 'Cloud Infrastructure'}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">Verified SLA</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">99.99% Guaranteed</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 2-Column Split: Milestones vs Engineering Logs & Email Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Sprints & Milestones */}
              <div className="lg:col-span-7 space-y-6">
                {/* Interactive Visual Milestone Timeline Component */}
                <InteractiveProjectTimeline project={currentProject} />

                {/* Tech Stack & Assigned Team */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-indigo-500" />
                    <span>Assigned Engineering Topology</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-1.5 font-semibold">Production Tech Stack:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentProject.assignedTeam?.map((tech) => (
                          <span key={tech} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] border border-slate-200 dark:border-slate-700">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Engineering Telemetry Logs & Email Alerts */}
              <div className="lg:col-span-5 space-y-6">
                {/* Engineering Changelog */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-sky-500" />
                      <span>Live Engineering Logs</span>
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                      Live Stream
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {currentProject.updatesLog?.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No changelog entries posted yet.</p>
                    ) : (
                      currentProject.updatesLog?.map((log) => (
                        <div
                          key={log.id}
                          className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                              {log.title}
                            </span>
                            <span className="text-slate-400 font-mono">
                              {new Date(log.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {log.note}
                          </p>
                          <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                            <span>Author: {log.author}</span>
                            <span className="font-mono text-slate-500">{log.stageBadge}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Automated Email Dispatches History */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Mail className="w-5 h-5 text-amber-500" />
                      <span>Email Alerts Dispatched</span>
                    </h3>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {projectEmailAlerts.length} Sent
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                    {projectEmailAlerts.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No automated email alerts dispatched yet for this project ID.</p>
                    ) : (
                      projectEmailAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          onClick={() => setViewingAlert(alert)}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <h5 className="font-bold text-slate-900 dark:text-white truncate">
                              {alert.subject}
                            </h5>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              To: {alert.recipientEmail} · {alert.updateSummary}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                            {alert.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty / Project Not Found State */
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 max-w-2xl mx-auto shadow-sm">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto opacity-80" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Project "{selectedProjectId}" Not Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Please verify your Project Tracking ID from your initial confirmation email or official DeRoyalTech contract invoice.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleQuickSelect('DRT-2026-7841')}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors shadow-sm"
              >
                Load Demo Project (DRT-2026-7841)
              </button>
              <button
                type="button"
                onClick={() => openChatWithContext("Help finding Project Tracking ID")}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Inquire with Support
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Email Alert Preview Modal */}
      {viewingAlert && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Email Notification Record</h4>
              </div>
              <button
                onClick={() => setViewingAlert(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div><strong className="text-slate-400 font-sans">Recipient:</strong> {viewingAlert.recipientName} &lt;{viewingAlert.recipientEmail}&gt;</div>
              <div><strong className="text-slate-400 font-sans">Subject:</strong> {viewingAlert.subject}</div>
              <div><strong className="text-slate-400 font-sans">Dispatched:</strong> {new Date(viewingAlert.sentAt).toLocaleString()}</div>
              <div><strong className="text-slate-400 font-sans">Delivery Status:</strong> <span className="text-emerald-500 font-bold">{viewingAlert.status}</span></div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed">
              <span className="font-bold text-blue-900 dark:text-blue-300 block">Update Summary:</span>
              <p>{viewingAlert.updateSummary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
