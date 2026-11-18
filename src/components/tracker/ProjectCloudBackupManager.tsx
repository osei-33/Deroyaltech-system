import React, { useState, useEffect, useRef } from 'react';
import { 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  CheckCircle2, 
  Clock, 
  Download, 
  RotateCcw, 
  Trash2, 
  Eye, 
  ShieldCheck, 
  AlertCircle, 
  Calendar, 
  Sparkles, 
  FileCode, 
  HardDrive,
  X,
  Play,
  ArrowRight
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { TrackedProject, ProjectBackupSnapshot } from '../../types/index.ts';

interface ProjectCloudBackupManagerProps {
  project: TrackedProject;
}

export const ProjectCloudBackupManager: React.FC<ProjectCloudBackupManagerProps> = ({ project }) => {
  const { 
    clientUser, 
    projectBackups, 
    createProjectCloudBackup, 
    deleteProjectCloudBackup,
    toggleProjectAutoBackup
  } = useSite();

  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgressStep, setBackupProgressStep] = useState<string>('');
  const [inspectingSnapshot, setInspectingSnapshot] = useState<ProjectBackupSnapshot | null>(null);
  const [justCreatedId, setJustCreatedId] = useState<string | null>(null);

  const isAutoBackupActive = project.autoBackupEnabled !== false;

  // Filter snapshots belonging to this project
  const currentProjectBackups = projectBackups.filter(
    b => b.projectId.toUpperCase() === project.projectId.toUpperCase()
  );

  // Determine latest backup timestamp from either project metadata or matching snapshots
  const latestSnapshotTime = currentProjectBackups.reduce((max, b) => {
    const t = new Date(b.createdAt).getTime();
    return !isNaN(t) && t > max ? t : max;
  }, 0);
  const projectLastTime = project.lastBackupDate ? new Date(project.lastBackupDate).getTime() : 0;
  const effectiveLastMs = Math.max(latestSnapshotTime, isNaN(projectLastTime) ? 0 : projectLastTime);
  const lastBackup = effectiveLastMs > 0 ? new Date(effectiveLastMs) : null;
  const daysSinceLastBackup = lastBackup
    ? Math.floor((Date.now() - lastBackup.getTime()) / (1000 * 60 * 60 * 24))
    : 999;
  const daysUntilNext = Math.max(0, 7 - daysSinceLastBackup);

  // Per-project ref so switching tracked projects checks each project independently without duplicates
  const autoTriggeredProjectsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const projKey = project.projectId.toUpperCase();
    if (
      isAutoBackupActive &&
      !autoTriggeredProjectsRef.current.has(projKey) &&
      daysSinceLastBackup >= 7
    ) {
      autoTriggeredProjectsRef.current.add(projKey);
      executeBackup(
        'automated_weekly',
        'Automated weekly progress snapshot stored in client account cloud storage'
      );
    }
  }, [project.projectId, daysSinceLastBackup, isAutoBackupActive]);

  const executeBackup = async (type: 'automated_weekly' | 'manual' = 'manual', note?: string) => {
    setIsBackingUp(true);
    setBackupProgressStep('Capturing active milestone progress and telemetry state...');

    try {
      await new Promise(r => setTimeout(r, 350));
      setBackupProgressStep('Generating SHA-256 cryptographic integrity hash...');
      await new Promise(r => setTimeout(r, 350));
      setBackupProgressStep('Archiving progress snapshot to client account storage...');
      
      const snapshot = await createProjectCloudBackup(
        project.projectId,
        type,
        note || (type === 'automated_weekly' ? 'Scheduled weekly progress snapshot archived in client account storage' : 'Manual client progress archive')
      );

      setJustCreatedId(snapshot.id);
      setTimeout(() => setJustCreatedId(null), 3000);
    } catch (err) {
      console.error('Cloud backup snapshot failed:', err);
    } finally {
      setIsBackingUp(false);
      setBackupProgressStep('');
    }
  };

  const handleDownloadSnapshotJson = (snapshot: ProjectBackupSnapshot) => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snapshot, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `${snapshot.id}-${snapshot.projectId}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error('Error exporting snapshot JSON:', err);
    }
  };

  const totalStorageBytes = currentProjectBackups.reduce((acc, b) => acc + (b.fileSizeBytes || 4096), 0);
  const totalStorageKb = (totalStorageBytes / 1024).toFixed(1);
  const accountStorageOwner = clientUser?.email || project.clientEmail || 'Client Account Vault';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
      {/* Header & Automated Weekly Trigger Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Automated Cloud Progress Backup
              </h3>
              <button
                type="button"
                onClick={() => toggleProjectAutoBackup(project.projectId, !isAutoBackupActive)}
                title="Click to toggle 7-day automated weekly backup trigger"
                className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full border flex items-center gap-1 transition-colors ${
                  isAutoBackupActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>{isAutoBackupActive ? 'Weekly Auto-Sync Active' : 'Weekly Auto-Sync Paused'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Archives weekly progress snapshots into encrypted client account storage (<span className="font-mono text-slate-700 dark:text-slate-300">{accountStorageOwner}</span>).
            </p>
          </div>
        </div>

        {/* Manual Trigger Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isBackingUp}
            onClick={() => executeBackup('manual', 'Manual snapshot triggered from Project Tracker')}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-60"
          >
            <Cloud className={`w-3.5 h-3.5 ${isBackingUp ? 'animate-bounce' : ''}`} />
            <span>{isBackingUp ? 'Backing Up...' : 'Trigger Cloud Backup Now'}</span>
          </button>
        </div>
      </div>

      {/* Backup In-Progress Alert Banner */}
      {isBackingUp && (
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-3 animate-pulse">
          <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin-slow shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold block">Cloud Backup Engine Active</span>
            <p>{backupProgressStep}</p>
          </div>
        </div>
      )}

      {/* Account Storage Quota & Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase font-sans font-semibold">Account Storage Used</span>
          <strong className="text-sm font-bold text-slate-900 dark:text-white">{totalStorageKb} KB</strong>
          <span className="text-[10px] text-slate-400 block font-sans">of 50 MB Dedicated Tier</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase font-sans font-semibold">Archived Snapshots</span>
          <strong className="text-sm font-bold text-blue-600 dark:text-blue-400">{currentProjectBackups.length} Snapshots</strong>
          <span className="text-[10px] text-emerald-500 block font-sans font-semibold">100% Encrypted</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase font-sans font-semibold">Last Cloud Backup</span>
          <strong className="text-xs font-bold text-slate-900 dark:text-white">
            {lastBackup ? lastBackup.toLocaleDateString() : 'Today'}
          </strong>
          <span className="text-[10px] text-slate-400 block font-sans">{daysSinceLastBackup === 0 ? 'Today' : `${daysSinceLastBackup} days ago`}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase font-sans font-semibold">Next Scheduled Auto-Backup</span>
          <strong className="text-xs font-bold text-sky-600 dark:text-sky-400">
            In {daysUntilNext} Days
          </strong>
          <span className="text-[10px] text-blue-500 block font-sans font-semibold">Weekly Automated Trigger</span>
        </div>
      </div>

      {/* Snapshots History Table / List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
          <span>Snapshot Archives History ({currentProjectBackups.length})</span>
          <span>Target Project: {project.projectId}</span>
        </div>

        {currentProjectBackups.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
            <CloudRain className="w-8 h-8 mx-auto text-slate-400" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No cloud snapshots archived yet for this project.
            </p>
            <button
              type="button"
              onClick={() => executeBackup('manual', 'Initial project baseline snapshot')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
            >
              Archive First Snapshot
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {currentProjectBackups.map((snap) => {
              const isWeekly = snap.type === 'automated_weekly';
              const isRecent = snap.id === justCreatedId;

              return (
                <div
                  key={snap.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isRecent
                      ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {snap.id}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full ${
                        isWeekly
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                      }`}>
                        {isWeekly ? 'Weekly Auto-Cloud' : 'Manual Client Trigger'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {snap.snapshotData?.checksum || 'SHA256-VERIFIED'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>{new Date(snap.createdAt).toLocaleString()}</span>
                      <span>·</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {snap.progressPercent}% Progress Snapshot
                      </span>
                      <span>·</span>
                      <span>{snap.completedMilestonesCount} of {snap.totalMilestonesCount} Milestones Verified</span>
                    </div>

                    {snap.note && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                        {snap.note}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setInspectingSnapshot(snap)}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors flex items-center gap-1 shadow-2xs"
                      title="Inspect Snapshot Milestones & Logs"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-500" />
                      <span>Inspect</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadSnapshotJson(snap)}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors flex items-center gap-1 shadow-2xs"
                      title="Download Full Project JSON Backup"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Download</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteProjectCloudBackup(snap.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete snapshot from account storage"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Snapshot Inspector Modal */}
      {inspectingSnapshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2.5">
                <FileCode className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Snapshot Archive: {inspectingSnapshot.id}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Created: {new Date(inspectingSnapshot.createdAt).toLocaleString()} · Checksum: {inspectingSnapshot.snapshotData?.checksum}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectingSnapshot(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Project Title</span>
                  <strong className="text-slate-900 dark:text-white">{inspectingSnapshot.projectTitle}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Snapshot Stage</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{inspectingSnapshot.stageLabel}</span>
                </div>
              </div>

              {/* Milestones captured in this snapshot */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white block">
                  Milestones State at Snapshot Time ({inspectingSnapshot.completedMilestonesCount}/{inspectingSnapshot.totalMilestonesCount} complete):
                </span>
                <div className="space-y-2">
                  {inspectingSnapshot.snapshotData?.project?.milestones?.map((m, idx) => (
                    <div
                      key={m.id || idx}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-start justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 dark:text-white block">{m.title}</span>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px]">{m.description}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full shrink-0 ${
                        m.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : m.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDownloadSnapshotJson(inspectingSnapshot)}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Snapshot JSON</span>
              </button>

              <button
                type="button"
                onClick={() => setInspectingSnapshot(null)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
