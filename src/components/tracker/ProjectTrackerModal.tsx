import React, { useState, useEffect } from 'react';
import { 
  X, 
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
  Eye
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { TrackedProject, ProjectMilestone, ProjectLogEntry, ProjectEmailAlert } from '../../types/index.ts';

export const ProjectTrackerModal: React.FC = () => {
  const { 
    isTrackerModalOpen, 
    setIsTrackerModalOpen, 
    trackedProjects, 
    trackerSearchId, 
    setTrackerSearchId,
    clientUser,
    openChatWithContext,
    formatPrice,
    emailAlerts
  } = useSite();

  const [inputQuery, setInputQuery] = useState(trackerSearchId || '');
  const [copiedId, setCopiedId] = useState(false);
  const [viewingClientAlert, setViewingClientAlert] = useState<ProjectEmailAlert | null>(null);
  const [isEmailHistoryOpen, setIsEmailHistoryOpen] = useState(false);

  useEffect(() => {
    if (trackerSearchId) {
      setInputQuery(trackerSearchId);
    }
  }, [trackerSearchId]);

  if (!isTrackerModalOpen) return null;

  // Find project by ID (case-insensitive) or by client name/company
  const cleanQuery = inputQuery.trim().toUpperCase();
  const currentProject: TrackedProject | undefined = trackedProjects.find(
    p => p.projectId.toUpperCase() === cleanQuery || 
         p.title.toUpperCase().includes(cleanQuery) ||
         p.clientCompany.toUpperCase().includes(cleanQuery)
  );

  // Client's own projects if logged in
  const userProjects = clientUser 
    ? trackedProjects.filter(p => p.clientEmail.toLowerCase() === clientUser.email.toLowerCase() || p.clientCompany.toLowerCase() === clientUser.company.toLowerCase())
    : [];

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSelectSample = (id: string) => {
    setInputQuery(id);
    setTrackerSearchId(id);
  };

  const handleOpenChat = () => {
    if (currentProject) {
      openChatWithContext(`Tracking Project: ${currentProject.projectId}`, currentProject.projectId);
    } else {
      openChatWithContext("Project Inquiry");
    }
  };

  const formatIsoDate = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-base sm:text-xl font-bold tracking-tight">Project Tracker</h2>
                <span className="text-[9px] sm:text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 sm:px-2 py-0.5 rounded-full">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 line-clamp-1 sm:line-clamp-none">
                Real-time milestone progression and engineering telemetry.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTrackerModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
            aria-label="Close Project Tracker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Sample ID Row */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Project ID (e.g. DRT-2026-7841, DRT-2026-9024)..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all uppercase placeholder:normal-case placeholder:font-sans"
              />
            </div>
            
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs text-slate-500 dark:text-slate-400">
              <span className="shrink-0 text-[11px] font-semibold text-slate-400">Demo IDs:</span>
              <button
                type="button"
                onClick={() => handleSelectSample('DRT-2026-7841')}
                className={`px-2.5 py-1.5 rounded-lg border font-mono text-xs font-semibold whitespace-nowrap transition-colors ${
                  cleanQuery === 'DRT-2026-7841' 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300'
                }`}
              >
                DRT-2026-7841 (Port CRM)
              </button>
              <button
                type="button"
                onClick={() => handleSelectSample('DRT-2026-9024')}
                className={`px-2.5 py-1.5 rounded-lg border font-mono text-xs font-semibold whitespace-nowrap transition-colors ${
                  cleanQuery === 'DRT-2026-9024' 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300'
                }`}
              >
                DRT-2026-9024 (POS Hub)
              </button>
            </div>
          </div>

          {/* User's Own Project Quick Buttons */}
          {userProjects.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Your Company Projects:</span>
              </span>
              {userProjects.map(p => (
                <button
                  key={p.projectId}
                  onClick={() => handleSelectSample(p.projectId)}
                  className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 whitespace-nowrap"
                >
                  {p.projectId} · {p.title.slice(0, 24)}...
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {currentProject ? (
            <div className="space-y-6">
              
              {/* Project Overview Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700/60 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-mono text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-sm">
                        <span>{currentProject.projectId}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyId(currentProject.projectId)}
                          className="hover:text-blue-200 transition-colors"
                          title="Copy Project ID"
                        >
                          {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </span>

                      <span className="px-2.5 py-1 rounded-lg bg-slate-700/80 text-slate-200 text-xs font-semibold uppercase tracking-wider">
                        {currentProject.serviceTitle}
                      </span>

                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Active Telemetry</span>
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      {currentProject.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-blue-400" />
                        <span>Client: <strong>{currentProject.clientName}</strong> ({currentProject.clientCompany})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span>Target Handover: <strong>{formatIsoDate(currentProject.estimatedDeliveryDate)}</strong></span>
                      </div>
                    </div>

                    {/* Email Alerts Active Badge & History Toggle */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-900/40 border border-blue-700/60 text-blue-200">
                        <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>Email Alerts Active: <strong className="font-mono text-white">{currentProject.clientEmail}</strong></span>
                      </div>

                      {emailAlerts.filter(a => a.projectId === currentProject.projectId).length > 0 && (
                        <button
                          type="button"
                          onClick={() => setIsEmailHistoryOpen(!isEmailHistoryOpen)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-semibold transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          <span>View Sent Email Alerts ({emailAlerts.filter(a => a.projectId === currentProject.projectId).length})</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Gauge */}
                  <div className="flex items-center gap-4 shrink-0 p-4 rounded-xl bg-slate-800/90 border border-slate-700">
                    <div className="text-center">
                      <span className="text-3xl font-extrabold font-mono text-blue-400 tracking-tight">
                        {currentProject.progressPercent}%
                      </span>
                      <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Overall Progress
                      </span>
                    </div>

                    <div className="w-24 sm:w-32">
                      <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden p-0.5">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${currentProject.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block truncate">
                        Stage: {currentProject.stage}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Current Stage Highlight */}
                <div className="mt-4 pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Current Phase: <strong className="text-white">{currentProject.stageLabel}</strong></span>
                  </div>

                  <button
                    onClick={handleOpenChat}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Live Chat with Engineering Team</span>
                  </button>
                </div>

                {/* Optional Email Alerts History Panel */}
                {isEmailHistoryOpen && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-700/80 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span>Email Notifications Dispatched to Your Inbox ({emailAlerts.filter(a => a.projectId === currentProject.projectId).length})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsEmailHistoryOpen(false)}
                        className="text-slate-400 hover:text-white text-[11px]"
                      >
                        Hide
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {emailAlerts
                        .filter(a => a.projectId === currentProject.projectId)
                        .map(alert => (
                          <div
                            key={alert.id}
                            className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-0.5 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  ✓ Delivered
                                </span>
                                <span className="font-mono text-[10px] text-slate-400">
                                  {new Date(alert.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(alert.sentAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="font-bold text-white truncate">{alert.subject}</div>
                              <div className="text-[11px] text-slate-400 truncate">{alert.updateSummary}</div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setViewingClientAlert(alert)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 font-semibold text-xs shrink-0 flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Email</span>
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Milestone Roadmap */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Project Milestone Roadmap</span>
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {currentProject.milestones.filter(m => m.status === 'completed').length} of {currentProject.milestones.length} Completed
                  </span>
                </div>

                <div className="space-y-3">
                  {currentProject.milestones.map((milestone, idx) => {
                    const isDone = milestone.status === 'completed';
                    const isCurrent = milestone.status === 'in_progress';

                    return (
                      <div 
                        key={milestone.id}
                        className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isDone 
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-slate-900 dark:text-slate-100'
                            : isCurrent
                            ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-slate-900 dark:text-slate-100 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : isCurrent ? (
                              <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                            ) : (
                              <Clock className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono font-bold text-slate-400">
                                0{idx + 1}
                              </span>
                              <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                {milestone.title}
                              </h5>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white uppercase">
                                  Current Sprint
                                </span>
                              )}
                              {isDone && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 uppercase">
                                  Verified
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                              {milestone.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 text-xs font-mono">
                          {milestone.completedAt ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold block">
                              Completed: {formatIsoDate(milestone.completedAt)}
                            </span>
                          ) : milestone.targetDate ? (
                            <span className="text-slate-500 dark:text-slate-400 block">
                              Target: {formatIsoDate(milestone.targetDate)}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Engineering Updates & Telemetry Logs */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span>Engineering Activity Log</span>
                </h4>

                <div className="space-y-2.5">
                  {currentProject.updatesLog.map((log: ProjectLogEntry) => (
                    <div 
                      key={log.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {log.stageBadge && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              {log.stageBadge}
                            </span>
                          )}
                          <span className="font-bold text-slate-900 dark:text-white">
                            {log.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {log.note}
                      </p>
                      <span className="text-[10px] text-slate-400 block italic">
                        Logged by: {log.author}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team & Hardware Allocation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Engineering Leadership
                  </span>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-blue-500" />
                    <span>{currentProject.leadEngineer}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {currentProject.assignedTeam.map((member, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-[10px] text-slate-700 dark:text-slate-300">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Hardware & Telemetry Staging
                  </span>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-emerald-500" />
                    <span>
                      {currentProject.hardwareUnitsCount 
                        ? `${currentProject.hardwareUnitsCount} Hardware Nodes Configured` 
                        : 'Pure Cloud & Custom Software Pipeline'}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Continuous uptime monitoring and encrypted telemetry endpoints active.
                  </p>
                </div>
              </div>

            </div>
          ) : (
            /* Empty or Invalid Search View */
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {inputQuery ? `No active project found for "${inputQuery}"` : "Enter a Project ID to track progress"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Every confirmed service engagement receives a unique DeRoyalTech tracking code. If you recently requested a service, our systems team is reviewing requirements and will activate your tracker shortly.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => handleSelectSample('DRT-2026-7841')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  View Sample: Asante Logistics (DRT-2026-7841)
                </button>
                <button
                  onClick={() => handleSelectSample('DRT-2026-9024')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  View Sample: Gold Coast POS (DRT-2026-9024)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted Telemetry Hub · DeRoyalTech Systems Ghana</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenChat}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
            >
              <span>Need help finding your Project ID? Speak to Live Support</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Client Email Preview Modal */}
        {viewingClientAlert && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-white">
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-xs sm:text-sm">Dispatched Email Notification</span>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingClientAlert(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1 space-y-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div><strong>Subject:</strong> {viewingClientAlert.subject}</div>
                  <div><strong>Dispatched to:</strong> {viewingClientAlert.recipientEmail}</div>
                  <div><strong>Sent At:</strong> {new Date(viewingClientAlert.sentAt).toLocaleString()}</div>
                </div>

                {viewingClientAlert.htmlPreview ? (
                  <div
                    className="rounded-xl overflow-hidden border border-slate-800"
                    dangerouslySetInnerHTML={{ __html: viewingClientAlert.htmlPreview }}
                  />
                ) : (
                  <div className="p-4 rounded-xl bg-slate-950 text-xs text-slate-300">
                    <p>{viewingClientAlert.updateSummary}</p>
                  </div>
                )}
              </div>

              <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setViewingClientAlert(null)}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
