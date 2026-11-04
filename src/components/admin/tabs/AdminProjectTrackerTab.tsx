import React, { useState } from 'react';
import { 
  Activity, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  UserCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Cpu, 
  ExternalLink, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  Search,
  Check,
  ChevronDown,
  Building2,
  Mail,
  Coins,
  Send,
  TrendingUp,
  X,
  Eye
} from 'lucide-react';
import { useSite } from '../../../context/SiteContext.tsx';
import { 
  ServiceProjectRequest, 
  TrackedProject, 
  ProjectMilestone, 
  ProjectLogEntry,
  ProjectStageStatus,
  ProjectEmailAlert
} from '../../../types/index.ts';

export const AdminProjectTrackerTab: React.FC = () => {
  const { 
    serviceRequests, 
    trackedProjects, 
    confirmAndCreateProjectTracker, 
    updateServiceRequestStatus,
    deleteServiceRequest,
    updateTrackedProject,
    updateProjectMilestone,
    addProjectLogEntry,
    deleteTrackedProject,
    createCustomTrackedProject,
    openTrackerForId,
    setActiveAdminTab,
    formatPrice,
    emailAlerts,
    dispatchProjectEmailAlert,
    deleteEmailAlert,
    autoEmailEnabled,
    setAutoEmailEnabled
  } = useSite();

  const [activeSubTab, setActiveSubTab] = useState<'requests' | 'projects' | 'new-tracker'>('requests');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(trackedProjects[0]?.projectId || '');
  const [searchProjectQuery, setSearchProjectQuery] = useState('');

  // Confirmation modal state for a service request
  const [confirmingRequestId, setConfirmingRequestId] = useState<string | null>(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmDeliveryDate, setConfirmDeliveryDate] = useState('');
  const [confirmProgress, setConfirmProgress] = useState(25);
  const [confirmLeadEngineer, setConfirmLeadEngineer] = useState('Senior Systems Architect, DeRoyalTech');
  const [confirmNotes, setConfirmNotes] = useState('');

  // Log entry modal state for an active project
  const [newLogTitle, setNewLogTitle] = useState('');
  const [newLogNote, setNewLogNote] = useState('');
  const [newLogBadge, setNewLogBadge] = useState('Engineering Milestone');

  // Custom project creation state
  const [customForm, setCustomForm] = useState({
    title: '',
    clientName: '',
    clientEmail: '',
    clientCompany: '',
    clientPhone: '',
    serviceTitle: 'Custom CRM & Cloud Infrastructure',
    progressPercent: 20,
    estimatedDeliveryDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    leadEngineer: 'Principal Systems Administrator',
    initialLogTitle: 'Project Kickoff & Blueprint Approved',
    initialLogNote: 'Architecture specifications and staging environment initialized.'
  });

  const selectedProject: TrackedProject | undefined = trackedProjects.find(p => p.projectId === selectedProjectId) || trackedProjects[0];

  // Email Notification modal & composer states
  const [viewingEmailAlert, setViewingEmailAlert] = useState<ProjectEmailAlert | null>(null);
  const [isCustomEmailModalOpen, setIsCustomEmailModalOpen] = useState(false);
  const [customEmailSummary, setCustomEmailSummary] = useState('');
  const [emailStatusToast, setEmailStatusToast] = useState<string | null>(null);

  const projectAlerts = selectedProject 
    ? emailAlerts.filter(a => a.projectId === selectedProject.projectId)
    : [];

  const handleSendCustomEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !customEmailSummary.trim()) return;

    const alert = await dispatchProjectEmailAlert({
      projectId: selectedProject.projectId,
      stage: selectedProject.stage,
      stageLabel: selectedProject.stageLabel,
      progressPercent: selectedProject.progressPercent,
      updateSummary: customEmailSummary.trim(),
      force: true
    });

    if (alert) {
      setEmailStatusToast(`Email alert successfully sent to ${selectedProject.clientEmail}`);
      setCustomEmailSummary('');
      setIsCustomEmailModalOpen(false);
      setTimeout(() => setEmailStatusToast(null), 3500);
    }
  };

  const pendingRequestsCount = serviceRequests.filter(r => r.status === 'pending').length;

  const handleOpenConfirmModal = (req: ServiceProjectRequest) => {
    setConfirmingRequestId(req.id);
    setConfirmTitle(req.projectTitle);
    setConfirmDeliveryDate(new Date(Date.now() + 35 * 86400000).toISOString().split('T')[0]);
    setConfirmProgress(25);
    setConfirmLeadEngineer('Senior Systems Architect, DeRoyalTech');
    setConfirmNotes(`Service order confirmed. Allocated hardware components and commenced architecture blueprint.`);
  };

  const handleExecuteConfirm = () => {
    if (!confirmingRequestId) return;
    const newId = confirmAndCreateProjectTracker(confirmingRequestId, {
      title: confirmTitle,
      estimatedDeliveryDate: confirmDeliveryDate,
      progressPercent: confirmProgress,
      leadEngineer: confirmLeadEngineer,
      initialNotes: confirmNotes
    });
    setConfirmingRequestId(null);
    if (newId) {
      setSelectedProjectId(newId);
      setActiveSubTab('projects');
    }
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !newLogTitle.trim() || !newLogNote.trim()) return;

    addProjectLogEntry(selectedProject.projectId, {
      title: newLogTitle.trim(),
      note: newLogNote.trim(),
      stageBadge: newLogBadge.trim()
    });

    setNewLogTitle('');
    setNewLogNote('');
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customForm.title.trim() || !customForm.clientName.trim() || !customForm.clientEmail.trim()) return;

    const projectId = createCustomTrackedProject({
      title: customForm.title.trim(),
      clientName: customForm.clientName.trim(),
      clientEmail: customForm.clientEmail.trim(),
      clientCompany: customForm.clientCompany.trim() || 'Enterprise Client',
      clientPhone: customForm.clientPhone.trim() || '+233 24 000 0000',
      serviceCategory: 'crm',
      serviceTitle: customForm.serviceTitle,
      stage: 'architecture_planning',
      stageLabel: 'Architecture Blueprint & Hardware Component Staging',
      progressPercent: customForm.progressPercent,
      startDate: new Date().toISOString().split('T')[0],
      estimatedDeliveryDate: customForm.estimatedDeliveryDate,
      leadEngineer: customForm.leadEngineer,
      assignedTeam: ['Senior Solutions Architect', 'Full-Stack Developer'],
      milestones: [
        {
          id: 'm-arch',
          title: 'Requirements Finalization & Architecture Specification',
          description: 'System topology, security protocols, and engineering roadmap signed off.',
          status: 'completed',
          completedAt: new Date().toISOString().split('T')[0]
        },
        {
          id: 'm-proto',
          title: 'Hardware Peripheral Staging & UI Prototype',
          description: 'Component allocation, board flashing, and interface design validation.',
          status: 'in_progress',
          targetDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
        },
        {
          id: 'm-dev',
          title: 'Core Software & Custom CRM Engine Development',
          description: 'Implementation of microservices, database schemas, and edge telemetry pipelines.',
          status: 'pending',
          targetDate: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0]
        },
        {
          id: 'm-qa',
          title: 'Telemetry Stress Testing & Security Penetration QA',
          description: 'End-to-end load testing, peripheral latency verification, and failover validation.',
          status: 'pending',
          targetDate: new Date(Date.now() + 28 * 86400000).toISOString().split('T')[0]
        },
        {
          id: 'm-deploy',
          title: 'Turnkey Production Handover & On-site Certification',
          description: 'Final cloud deployment, client team training, and handover of documentation.',
          status: 'pending',
          targetDate: customForm.estimatedDeliveryDate
        }
      ],
      updatesLog: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: customForm.initialLogTitle,
          note: customForm.initialLogNote,
          author: 'DeRoyalTech Systems Lead',
          stageBadge: 'Kickoff'
        }
      ]
    });

    setSelectedProjectId(projectId);
    setActiveSubTab('projects');
  };

  return (
    <div className="space-y-5">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <span>Service Requests & Project Milestone Tracker</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review incoming client service inquiries, approve orders, generate unique Project IDs (DRT-XXXX), and manage milestone progress.
          </p>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveSubTab('requests')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'requests'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Service Requests</span>
            {pendingRequestsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-mono">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('projects')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'projects'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Tracked Projects</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-[10px] text-slate-700 dark:text-slate-300 font-mono">
              {trackedProjects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('new-tracker')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              activeSubTab === 'new-tracker'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Create Tracker</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: INCOMING SERVICE REQUESTS */}
      {activeSubTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Client Service Orders ({serviceRequests.length})
            </span>
            <span className="text-xs text-slate-400">
              Confirming a request automatically assigns a Project ID and notifies the client.
            </span>
          </div>

          <div className="space-y-3">
            {serviceRequests.map((req) => {
              const isPending = req.status === 'pending';
              const isConfirmed = req.status === 'confirmed';

              return (
                <div
                  key={req.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isPending
                      ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/80 shadow-sm'
                      : isConfirmed
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {req.id}
                        </span>

                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {req.serviceTitle}
                        </span>

                        {req.hardwareIntegrationNeeded && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                            <Cpu className="w-3 h-3" />
                            <span>Hardware Requested</span>
                          </span>
                        )}

                        {isPending ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                            AWAITING APPROVAL
                          </span>
                        ) : isConfirmed ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                            CONFIRMED & TRACKED
                          </span>
                        ) : null}
                      </div>

                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {req.projectTitle}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {req.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                        <span className="flex items-center gap-1 text-slate-900 dark:text-slate-200 font-medium">
                          <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                          {req.clientName} ({req.clientCompany})
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-blue-500" />
                          {req.clientEmail}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          <Coins className="w-3.5 h-3.5 text-emerald-500" />
                          Budget: {formatPrice(req.estimatedBudget)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          Timeline: {req.targetTimeline}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0">
                      {isPending && (
                        <button
                          type="button"
                          onClick={() => handleOpenConfirmModal(req)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Confirm & Set Tracker</span>
                        </button>
                      )}

                      {isConfirmed && req.assignedProjectId && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProjectId(req.assignedProjectId!);
                            setActiveSubTab('projects');
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-mono font-bold text-xs hover:bg-blue-100 transition-colors flex items-center gap-1"
                        >
                          <span>Tracker: {req.assignedProjectId}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteServiceRequest(req.id)}
                        className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Delete Request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confirm & Create Tracker Dialog */}
          {confirmingRequestId && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Confirm Project & Activate Live Tracker
                    </h4>
                  </div>
                  <button onClick={() => setConfirmingRequestId(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={confirmTitle}
                      onChange={(e) => setConfirmTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Initial Progress (%)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={confirmProgress}
                        onChange={(e) => setConfirmProgress(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Target Handover Date
                      </label>
                      <input
                        type="date"
                        value={confirmDeliveryDate}
                        onChange={(e) => setConfirmDeliveryDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Lead Systems Engineer
                    </label>
                    <input
                      type="text"
                      value={confirmLeadEngineer}
                      onChange={(e) => setConfirmLeadEngineer(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Initial Engineering Note
                    </label>
                    <textarea
                      rows={2}
                      value={confirmNotes}
                      onChange={(e) => setConfirmNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmingRequestId(null)}
                    className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteConfirm}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
                  >
                    <span>Generate Project ID & Activate</span>
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: ACTIVE TRACKED PROJECTS */}
      {activeSubTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Projects List (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tracked projects..."
                value={searchProjectQuery}
                onChange={(e) => setSearchProjectQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs rounded-xl border border-transparent focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-2 max-h-[620px] overflow-y-auto">
              {trackedProjects
                .filter(p => 
                  p.projectId.toLowerCase().includes(searchProjectQuery.toLowerCase()) ||
                  p.title.toLowerCase().includes(searchProjectQuery.toLowerCase()) ||
                  p.clientName.toLowerCase().includes(searchProjectQuery.toLowerCase())
                )
                .map((project) => {
                  const isSelected = selectedProject?.projectId === project.projectId;

                  return (
                    <div
                      key={project.projectId}
                      onClick={() => setSelectedProjectId(project.projectId)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 dark:border-blue-800 shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                          {project.projectId}
                        </span>
                        <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                          {project.progressPercent}%
                        </span>
                      </div>

                      <h5 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1 mb-1">
                        {project.title}
                      </h5>

                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all"
                          style={{ width: `${project.progressPercent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                        <span>{project.clientCompany}</span>
                        <span className="capitalize">{project.stage.replace('_', ' ')}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Project Control Panel (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-5">
            {selectedProject ? (
              <>
                {/* Control Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded font-mono text-xs font-bold bg-blue-600 text-white">
                        {selectedProject.projectId}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {selectedProject.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Client: <strong>{selectedProject.clientName}</strong> ({selectedProject.clientCompany}) · Lead: {selectedProject.leadEngineer}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openTrackerForId(selectedProject.projectId)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 transition-colors flex items-center gap-1"
                    >
                      <span>Preview Client View</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTrackedProject(selectedProject.projectId)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Delete Tracked Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Email Alert Notification Dispatcher Bar */}
                <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Email Alerts Active</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Updates automatically dispatched to: <strong className="text-blue-600 dark:text-blue-400 font-mono">{selectedProject.clientEmail}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={autoEmailEnabled}
                        onChange={(e) => setAutoEmailEnabled(e.target.checked)}
                        className="w-3.5 h-3.5 text-blue-600 accent-blue-600 rounded"
                      />
                      <span>Auto-email client on update</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setIsCustomEmailModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Custom Alert</span>
                    </button>
                  </div>
                </div>

                {emailStatusToast && (
                  <div className="p-3 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{emailStatusToast}</span>
                  </div>
                )}

                {/* Live Progress Slider & Stage Adjuster */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                      <span>Adjust Live Completion Percentage:</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400 text-base">
                        {selectedProject.progressPercent}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={selectedProject.progressPercent}
                      onChange={(e) => updateTrackedProject(selectedProject.projectId, { progressPercent: Number(e.target.value) })}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                        Current Engineering Stage:
                      </label>
                      <select
                        value={selectedProject.stage}
                        onChange={(e) => {
                          const val = e.target.value as ProjectStageStatus;
                          const labels: Record<ProjectStageStatus, string> = {
                            confirmed: 'Service Request Confirmed & Hardware Scheduled',
                            architecture_planning: 'Architecture Specification & Component Staging',
                            prototyping: 'Hardware Peripheral & Interface Prototyping',
                            development: 'Core Engine & Microservices Development in Progress',
                            hardware_assembly: 'Hardware Peripheral Calibration & Gateway Staging',
                            testing_qa: 'Telemetry Stress Testing & Security Penetration QA',
                            deployment: 'Production Handover & Port Operations Staging',
                            completed: 'Project Completed & Officially Verified',
                            on_hold: 'Project On Hold'
                          };
                          updateTrackedProject(selectedProject.projectId, { 
                            stage: val, 
                            stageLabel: labels[val] || val 
                          });
                        }}
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white"
                      >
                        <option value="architecture_planning">Architecture Planning & Spec</option>
                        <option value="prototyping">Prototyping & Board Staging</option>
                        <option value="development">Core Development in Progress</option>
                        <option value="hardware_assembly">Hardware Staging & Calibration</option>
                        <option value="testing_qa">Testing & QA Penetration</option>
                        <option value="deployment">Deployment & Final Handover</option>
                        <option value="completed">Completed & Verified</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                        Target Handover Date:
                      </label>
                      <input
                        type="date"
                        value={selectedProject.estimatedDeliveryDate}
                        onChange={(e) => updateTrackedProject(selectedProject.projectId, { estimatedDeliveryDate: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Milestone Checklist */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-blue-500" />
                      <span>Milestone Checklist (Auto-syncs Client Tracker)</span>
                    </h5>
                  </div>

                  <div className="space-y-2">
                    {selectedProject.milestones.map((m, idx) => (
                      <div
                        key={m.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-400 text-[11px]">0{idx + 1}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{m.title}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {(['completed', 'in_progress', 'pending'] as const).map(status => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => updateProjectMilestone(selectedProject.projectId, m.id, status)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-bold capitalize transition-all ${
                                m.status === status
                                  ? status === 'completed'
                                    ? 'bg-emerald-600 text-white'
                                    : status === 'in_progress'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-700 text-white'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                              }`}
                            >
                              {status === 'in_progress' ? 'In Progress' : status}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Engineering Update Log Form */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span>Post Live Engineering Update Note</span>
                  </h5>

                  <form onSubmit={handleAddLog} className="space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Update Title (e.g. Telemetry Passed 1,000 Pings)"
                        value={newLogTitle}
                        onChange={(e) => setNewLogTitle(e.target.value)}
                        className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Stage Tag (e.g. Firmware QA, Database, Staging)"
                        value={newLogBadge}
                        onChange={(e) => setNewLogBadge(e.target.value)}
                        className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Detailed engineering note visible to client..."
                        value={newLogNote}
                        onChange={(e) => setNewLogNote(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                      />
                      <button
                        type="submit"
                        disabled={!newLogTitle.trim() || !newLogNote.trim()}
                        className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs shadow transition-colors flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Post Note</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Dispatched Email Notifications History for this Project */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-blue-500" />
                      <span>Dispatched Client Email Alerts ({projectAlerts.length})</span>
                    </h5>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Recipient: {selectedProject.clientEmail}
                    </span>
                  </div>

                  {projectAlerts.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">
                      No email alerts recorded yet for this project. Status updates and milestones automatically dispatch emails.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {projectAlerts.map(alert => (
                        <div
                          key={alert.id}
                          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs shadow-sm hover:border-slate-300 transition-colors"
                        >
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                ✓ {alert.status}
                              </span>
                              <span className="font-mono text-[11px] text-slate-400">
                                {new Date(alert.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(alert.sentAt).toLocaleDateString()}
                              </span>
                            </div>
                            <h6 className="font-bold text-slate-900 dark:text-white truncate">
                              {alert.subject}
                            </h6>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              To: {alert.recipientEmail} · {alert.updateSummary}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => setViewingEmailAlert(alert)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:text-blue-600 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview HTML</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="py-16 text-center text-slate-400 text-xs">
                Select a project on the left to inspect milestones and adjust telemetry.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CREATE CUSTOM TRACKER */}
      {activeSubTab === 'new-tracker' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-500" />
              <span>Initialize Custom Project Tracker</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Instantly create a new tracked project for walk-in or offline clients. Generates a unique tracking code (DRT-2026-XXXX).
            </p>
          </div>

          <form onSubmit={handleCreateCustom} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Accra Logistics Port RFID Integration"
                value={customForm.title}
                onChange={(e) => setCustomForm({ ...customForm, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Client Contact Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Kwame Asante"
                  value={customForm.clientName}
                  onChange={(e) => setCustomForm({ ...customForm, clientName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Client Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="k.asante@company.com"
                  value={customForm.clientEmail}
                  onChange={(e) => setCustomForm({ ...customForm, clientEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="Asante Logistics Ltd"
                  value={customForm.clientCompany}
                  onChange={(e) => setCustomForm({ ...customForm, clientCompany: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Handover Date
                </label>
                <input
                  type="date"
                  value={customForm.estimatedDeliveryDate}
                  onChange={(e) => setCustomForm({ ...customForm, estimatedDeliveryDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <span>Create & Launch Project Tracker</span>
                <Activity className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 1: VIEW EMAIL ALERT PREVIEW */}
      {viewingEmailAlert && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" />
                <div>
                  <h4 className="font-bold text-sm">Dispatched Email Notification Preview</h4>
                  <p className="text-[11px] text-slate-400">To: {viewingEmailAlert.recipientEmail} · Delivered</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingEmailAlert(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <div><strong>Subject:</strong> {viewingEmailAlert.subject}</div>
                <div><strong>Timestamp:</strong> {new Date(viewingEmailAlert.sentAt).toLocaleString()}</div>
                <div><strong>Lead Architect:</strong> {viewingEmailAlert.leadEngineer}</div>
              </div>

              {viewingEmailAlert.htmlPreview ? (
                <div 
                  className="rounded-xl overflow-hidden border border-slate-700"
                  dangerouslySetInnerHTML={{ __html: viewingEmailAlert.htmlPreview }} 
                />
              ) : (
                <div className="p-5 rounded-xl bg-slate-900 text-slate-200 text-xs space-y-3 font-sans">
                  <div className="font-bold text-base text-white">DeRoyalTech Systems Notification</div>
                  <div>Hello {viewingEmailAlert.recipientName},</div>
                  <div className="p-3 bg-slate-800 rounded-lg">
                    <div className="font-bold text-blue-400">{viewingEmailAlert.projectTitle} ({viewingEmailAlert.projectId})</div>
                    <div>Status: {viewingEmailAlert.stageLabel} ({viewingEmailAlert.progressPercent}%)</div>
                    <div className="mt-2 text-slate-300">{viewingEmailAlert.updateSummary}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setViewingEmailAlert(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: COMPOSE CUSTOM EMAIL ALERT */}
      {isCustomEmailModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-400" />
                <h4 className="font-bold text-sm">Dispatch Custom Status Email</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomEmailModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendCustomEmail} className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div><strong>Project ID:</strong> {selectedProject.projectId}</div>
                <div><strong>Recipient:</strong> {selectedProject.clientName} ({selectedProject.clientEmail})</div>
                <div><strong>Current Stage:</strong> {selectedProject.stageLabel} ({selectedProject.progressPercent}%)</div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Custom Engineering Update / Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter the specific message you would like to notify the client about (e.g. Completed initial edge gateway stress tests and ready for staging demo)..."
                  value={customEmailSummary}
                  onChange={(e) => setCustomEmailSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white border border-transparent focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCustomEmailModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Email Alert</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
