import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Activity, 
  Layers, 
  ChevronRight, 
  ShieldCheck, 
  Download, 
  Check, 
  Sparkles, 
  FileCode,
  Info
} from 'lucide-react';
import { TrackedProject, ProjectMilestone } from '../../types/index.ts';
import { useSite } from '../../context/SiteContext.tsx';
import { generateProjectPdfReport } from '../../utils/generateProjectPdfReport.ts';

interface ProjectGanttChartProps {
  project: TrackedProject;
  onSelectMilestone?: (index: number) => void;
  selectedMilestoneIdx?: number;
}

export const ProjectGanttChart: React.FC<ProjectGanttChartProps> = ({
  project,
  onSelectMilestone,
  selectedMilestoneIdx = 0
}) => {
  const { config } = useSite();
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const milestones = project.milestones || [];
  const totalMilestones = milestones.length;

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      await generateProjectPdfReport(project, config);
    } catch (err) {
      console.error('Error generating PDF report:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Generate sprint timeline columns (e.g. Sprint 1 to Sprint N + Delivery)
  const sprintWeeks = Array.from({ length: Math.max(5, totalMilestones + 1) }, (_, i) => ({
    label: i === totalMilestones ? 'Final QA & Handover' : `Sprint ${i + 1}`,
    weekNum: i + 1
  }));

  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const inProgressCount = milestones.filter(m => m.status === 'in_progress').length;
  const pendingCount = milestones.filter(m => m.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Top Bar with Title, Legend & PDF Export */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <Calendar className="w-3.5 h-3.5" />
                <span>VISUAL SPRINT GANTT TIMELINE</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {project.projectId}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight mt-1.5">
              Project Milestones & Delivery Schedule
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Interactive timeline view displaying sprint dependencies, execution durations, and estimated completion targets.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Download PDF Status Report Button */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingPdf ? 'Generating PDF...' : 'Download PDF Report'}</span>
            </button>
          </div>
        </div>

        {/* Milestone Status Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">Total Sprints</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">{totalMilestones} Phases</span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
            <span className="text-[10px] font-mono uppercase text-emerald-700 dark:text-emerald-400 font-semibold block">Completed</span>
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{completedCount} Verified</span>
          </div>

          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60">
            <span className="text-[10px] font-mono uppercase text-blue-700 dark:text-blue-400 font-semibold block">In Active Execution</span>
            <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-mono">{inProgressCount} Active</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block">Handover Target</span>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate block mt-0.5">{project.estimatedDeliveryDate || 'Q2 2026'}</span>
          </div>
        </div>

        {/* Visual Gantt Chart Grid Container */}
        <div className="pt-2 overflow-x-auto no-scrollbar">
          <div className="min-w-[700px] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950">
            {/* Gantt Header Columns */}
            <div className="grid grid-cols-12 bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 py-3 px-4">
              <div className="col-span-5 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                <span>Milestone Stage & Owner</span>
              </div>
              <div className="col-span-7 grid grid-cols-5 text-center font-mono text-[10px] uppercase">
                {sprintWeeks.slice(0, 5).map((w, wIdx) => (
                  <div key={wIdx} className="border-l border-slate-200 dark:border-slate-800 px-1 truncate">
                    {w.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Gantt Rows for Each Milestone */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {milestones.map((m: ProjectMilestone, idx: number) => {
                const isSelected = selectedMilestoneIdx === idx;
                const isHovered = hoveredIdx === idx;

                // Calculate horizontal Gantt span
                // Each milestone spans roughly across sprint columns
                const startCol = Math.min(4, Math.floor((idx / totalMilestones) * 5));
                const spanCols = Math.max(1, Math.min(5 - startCol, 2));

                const leftPercent = (startCol / 5) * 100;
                const widthPercent = (spanCols / 5) * 100;

                return (
                  <div
                    key={m.id}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onClick={() => onSelectMilestone && onSelectMilestone(idx)}
                    className={`grid grid-cols-12 items-center px-4 py-3.5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/40'
                        : isHovered
                        ? 'bg-slate-50 dark:bg-slate-900/50'
                        : ''
                    }`}
                  >
                    {/* Left Info Column */}
                    <div className="col-span-5 pr-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono shrink-0 ${
                          m.status === 'completed'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : m.status === 'in_progress'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {m.status === 'completed' ? <Check className="w-3 h-3" /> : idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {m.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 pl-7 text-[10px] text-slate-400">
                        <span>ETA: {m.targetDate || project.estimatedDeliveryDate}</span>
                        <span>•</span>
                        <span className="truncate">{project.leadEngineer}</span>
                      </div>
                    </div>

                    {/* Right Timeline Bar Track */}
                    <div className="col-span-7 relative h-9 flex items-center px-2">
                      {/* Background grid vertical lines */}
                      <div className="absolute inset-0 grid grid-cols-5 pointer-events-none">
                        {Array.from({ length: 5 }).map((_, cIdx) => (
                          <div key={cIdx} className="border-l border-slate-100 dark:border-slate-800/80 h-full" />
                        ))}
                      </div>

                      {/* Timeline Bar */}
                      <div
                        style={{
                          left: `${leftPercent}%`,
                          width: `${widthPercent}%`
                        }}
                        className={`relative z-10 h-7 rounded-xl flex items-center justify-between px-2.5 text-[11px] font-bold shadow-sm transition-all duration-300 ${
                          m.status === 'completed'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/20'
                            : m.status === 'in_progress'
                            ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-blue-500/30 ring-2 ring-blue-400/40 animate-pulse'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        <span className="truncate text-[10px] flex items-center gap-1">
                          {m.status === 'completed' && <CheckCircle2 className="w-3 h-3 shrink-0" />}
                          {m.status === 'in_progress' && <Activity className="w-3 h-3 shrink-0 animate-spin" />}
                          <span className="truncate">{m.status.toUpperCase().replace('_', ' ')}</span>
                        </span>

                        <span className="font-mono text-[9px] opacity-90 hidden sm:inline shrink-0">
                          {m.status === 'completed' ? '100%' : m.status === 'in_progress' ? 'Active' : 'Queued'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Completed & Verified</span>
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span>In Active Execution</span>
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span>Scheduled Pipeline</span>
            </span>
          </div>

          <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
            <Info className="w-3 h-3" />
            <span>Click any milestone row to inspect audit criteria & audio notes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
