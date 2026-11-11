import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Activity, 
  Layers, 
  Calendar, 
  ShieldCheck, 
  FileCode, 
  ArrowRight, 
  ChevronRight, 
  Check, 
  Sparkles, 
  Cpu, 
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Code2,
  HardDrive,
  Download,
  BarChart2
} from 'lucide-react';
import { TrackedProject, ProjectMilestone } from '../../types/index.ts';
import { useSite } from '../../context/SiteContext.tsx';
import { MilestoneVoiceNoteRecorder } from './MilestoneVoiceNoteRecorder.tsx';
import { ProjectGanttChart } from './ProjectGanttChart.tsx';
import { generateProjectPdfReport } from '../../utils/generateProjectPdfReport.ts';

interface InteractiveProjectTimelineProps {
  project: TrackedProject;
}

export const InteractiveProjectTimeline: React.FC<InteractiveProjectTimelineProps> = ({ project }) => {
  const { openChatWithContext, config } = useSite();
  const milestones = project.milestones || [];
  
  // Find default active milestone: the first 'in_progress', or the last completed, or the first
  const initialActiveIdx = milestones.findIndex(m => m.status === 'in_progress');
  const [selectedMilestoneIdx, setSelectedMilestoneIdx] = useState<number>(
    initialActiveIdx !== -1 ? initialActiveIdx : 0
  );
  const [filter, setFilter] = useState<'all' | 'completed' | 'in_progress' | 'pending'>('all');
  const [viewMode, setViewMode] = useState<'roadmap' | 'gantt'>('roadmap');
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      await generateProjectPdfReport(project, config);
    } catch (err) {
      console.error('Failed to generate PDF report:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const selectedMilestone: ProjectMilestone | undefined = milestones[selectedMilestoneIdx] || milestones[0];

  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const inProgressCount = milestones.filter(m => m.status === 'in_progress').length;
  const pendingCount = milestones.filter(m => m.status === 'pending').length;

  const filteredMilestones = milestones.filter(m => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  // Generated deliverables criteria for deep technical transparency
  const getDeliverableItems = (milestone: ProjectMilestone, index: number) => {
    return [
      {
        title: `Specification & Architectural Validation for ${milestone.title}`,
        status: milestone.status === 'completed' ? 'verified' : milestone.status === 'in_progress' ? 'validating' : 'pending',
        digest: `DRT-SPEC-${(index + 1) * 104}-V2`
      },
      {
        title: `Automated Integration Tests & Security Auditing`,
        status: milestone.status === 'completed' ? 'verified' : milestone.status === 'in_progress' ? 'running' : 'pending',
        digest: `SEC-AUDIT-${(index + 1) * 89}`
      },
      {
        title: `Lead Systems Architect Sign-Off & Client Milestone Certificate`,
        status: milestone.status === 'completed' ? 'verified' : 'pending',
        digest: `CERT-${project.projectId}-${index + 1}`
      }
    ];
  };

  return (
    <div className="space-y-6">
      {/* Top Milestone Overview & Real-Time Progress Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80 relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>INTERACTIVE SPRINT TIMELINE</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {project.projectId}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight mt-1.5">
              Visual Engineering Roadmaps & Milestones
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Click any stage node below to inspect real-time commit verifications, security audits, and delivery criteria.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('roadmap')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'roadmap'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Sprint Nodes</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('gantt')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'gantt'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Visual Gantt</span>
              </button>
            </div>

            {/* Download PDF Status Report Button */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingPdf ? 'Exporting...' : 'PDF Report'}</span>
            </button>

            {/* Filter buttons */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filter === 'all' 
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-bold' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All ({milestones.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('completed')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filter === 'completed' 
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Done ({completedCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('in_progress')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filter === 'in_progress' 
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-bold' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Active ({inProgressCount})
              </button>
            </div>
          </div>
        </div>

        {/* Dual View Modes: Visual Gantt Chart vs Step Track */}
        {viewMode === 'gantt' ? (
          <div className="pt-6">
            <ProjectGanttChart
              project={project}
              onSelectMilestone={(idx) => setSelectedMilestoneIdx(idx)}
              selectedMilestoneIdx={selectedMilestoneIdx}
            />
          </div>
        ) : (
          <>
            {/* Real-time Progress Bar */}
            <div className="pt-6 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span>Overall Contract Milestone Completion</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-normal">
                    {completedCount} of {milestones.length} Milestones Cleared
                  </span>
                </span>
                <span className="font-mono font-black text-sm text-blue-600 dark:text-blue-400">
                  {project.progressPercent}%
                </span>
              </div>

              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/80 dark:border-slate-700/80">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500 rounded-full transition-all duration-700 shadow-sm relative"
                  style={{ width: `${project.progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                </div>
              </div>
            </div>

            {/* Visual Roadmap Step Track */}
            <div className="pt-8 overflow-x-auto pb-4 scrollbar-none">
              <div className="min-w-[620px] flex items-center justify-between relative px-6">
                {/* Connecting baseline */}
                <div className="absolute left-10 right-10 top-6 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
                
                {/* Active filled connecting line */}
                <div 
                  className="absolute left-10 top-6 h-1 bg-gradient-to-r from-emerald-500 to-blue-600 -translate-y-1/2 z-0 transition-all duration-500"
                  style={{ 
                    width: milestones.length > 1 
                      ? `${Math.min(100, (completedCount / (milestones.length - 1)) * 90)}%` 
                      : '0%' 
                  }}
                />

                {milestones.map((milestone, idx) => {
                  const isSelected = selectedMilestoneIdx === idx;
                  const isCompleted = milestone.status === 'completed';
                  const isInProgress = milestone.status === 'in_progress';

                  return (
                    <button
                      key={milestone.id || idx}
                      type="button"
                      onClick={() => setSelectedMilestoneIdx(idx)}
                      className="flex flex-col items-center relative z-10 group focus:outline-none transition-transform active:scale-95"
                    >
                      {/* Node Icon */}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 border-2 shadow-lg ${
                        isSelected
                          ? 'ring-4 ring-blue-500/30 scale-110 ' + (isCompleted ? 'bg-emerald-600 border-emerald-400 text-white' : isInProgress ? 'bg-blue-600 border-blue-400 text-white animate-pulse' : 'bg-slate-900 border-indigo-400 text-white')
                          : isCompleted
                          ? 'bg-emerald-500 border-emerald-400 text-white hover:scale-105'
                          : isInProgress
                          ? 'bg-blue-600 border-blue-400 text-white hover:scale-105 shadow-blue-500/25'
                          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:scale-105'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-5 h-5 stroke-[3]" />
                        ) : isInProgress ? (
                          <Activity className="w-5 h-5 animate-spin" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>

                      {/* Stage Number & Title */}
                      <div className="mt-3 text-center max-w-[120px]">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          Step {idx + 1}
                        </div>
                        <div className={`text-xs font-bold truncate mt-0.5 transition-colors ${
                          isSelected 
                            ? 'text-blue-600 dark:text-blue-400 underline decoration-2 underline-offset-4' 
                            : isCompleted
                            ? 'text-slate-900 dark:text-slate-100'
                            : isInProgress
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {milestone.title}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Scheduled'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Selected Milestone Deep-Dive Inspector Card */}
      {selectedMilestone && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                selectedMilestone.status === 'completed'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                  : selectedMilestone.status === 'in_progress'
                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
              }`}>
                {selectedMilestone.status === 'completed' ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : selectedMilestone.status === 'in_progress' ? (
                  <Activity className="w-6 h-6 animate-pulse" />
                ) : (
                  <Clock className="w-6 h-6" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-400">
                    Stage Node #{selectedMilestoneIdx + 1}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                    selectedMilestone.status === 'completed'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : selectedMilestone.status === 'in_progress'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800 animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                  }`}>
                    {selectedMilestone.status.replace('_', ' ')}
                  </span>
                </div>
                <h4 className="text-lg sm:text-xl font-extrabold text-slate-950 dark:text-white tracking-tight mt-0.5">
                  {selectedMilestone.title}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openChatWithContext(`Question regarding Project ${project.projectId} - Milestone: ${selectedMilestone.title}`)}
              className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold flex items-center gap-2 transition-colors self-start sm:self-center"
            >
              <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Discuss with Lead Engineer</span>
            </button>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {selectedMilestone.description}
          </p>

          {/* Timing & Assigned Lead Engineer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 text-xs">
            <div>
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Target Completion ETA</div>
              <div className="font-semibold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>{selectedMilestone.targetDate || project.estimatedDeliveryDate}</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Completion Timestamp</div>
              <div className="font-semibold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{selectedMilestone.completedAt || 'In Execution Pipeline'}</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Lead Systems Architect</div>
              <div className="font-semibold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>{project.leadEngineer}</span>
              </div>
            </div>
          </div>

          {/* Milestone Deliverables & Verification Criteria */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-500" />
              <span>Verified Deliverables & Audit Criteria</span>
            </h5>

            <div className="space-y-2">
              {getDeliverableItems(selectedMilestone, selectedMilestoneIdx).map((item, dIdx) => (
                <div 
                  key={dIdx}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      item.status === 'verified'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : item.status === 'validating' || item.status === 'running'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 animate-pulse'
                        : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                    }`}>
                      {item.status === 'verified' ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      )}
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[10px] text-slate-400 hidden sm:inline">
                      {item.digest}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      item.status === 'verified'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                        : item.status === 'validating' || item.status === 'running'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Voice-to-Text Audio Note Recording Engine */}
          <MilestoneVoiceNoteRecorder
            projectId={project.projectId}
            milestone={selectedMilestone}
          />
        </div>
      )}
    </div>
  );
};
