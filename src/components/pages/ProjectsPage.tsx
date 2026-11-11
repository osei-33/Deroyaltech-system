import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  ExternalLink, 
  Film, 
  CheckCircle2, 
  TrendingUp, 
  Building2,
  Lock,
  Code2,
  Smile,
  CheckSquare,
  Activity,
  Cpu,
  BarChart3,
  Clock
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { CompletedProject } from '../../types/index.ts';

interface ProjectsPageProps {
  onOpenVideo: (project: CompletedProject) => void;
  openConsultation: (scope?: string) => void;
}

// Animated Counter Hook
function useAnimatedCounter(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return count;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onOpenVideo, openConsultation }) => {
  const { config, completedProjects, navigateTo, clientUser } = useSite();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const metrics = config.metrics || {
    projectsCompleted: 86,
    clientSatisfactionRate: 99.4,
    linesOfCodeWritten: '1.4M+',
    uptimeSla: 99.99,
    hardwareNodesDeployed: 2400
  };

  const animatedProjects = useAnimatedCounter(metrics.projectsCompleted || 86);
  const animatedNodes = useAnimatedCounter(metrics.hardwareNodesDeployed || 2400);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'crm', label: 'Custom CRM & Logistics' },
    { id: 'web', label: 'Web Platforms & FinTech' },
    { id: 'mobile', label: 'Mobile Apps' },
    { id: 'cloud-edge', label: 'Cloud & Hardware IoT' },
  ];

  const filteredProjects = selectedCategory === 'all'
    ? completedProjects
    : completedProjects.filter(p => p.category === selectedCategory);

  const isApprovedClient = clientUser && clientUser.status === 'approved' && clientUser.isVerified;

  return (
    <div className="py-8 sm:py-12 space-y-12">
      {/* Breadcrumb Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>

          {clientUser && (
            <div className="flex items-center gap-2 text-xs font-mono">
              {isApprovedClient ? (
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Partner: {clientUser.company}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-amber-500">
                  <Clock className="w-4 h-4" />
                  <span>Pending Approval: {clientUser.company}</span>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="pt-8 max-w-3xl space-y-3">
          <div className="text-xs font-bold font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-orange-500" />
            <span>Dedicated Client Project Showcase & Live Trackers</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Completed Projects, Metrics & MP4 Walkthroughs
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Explore verified enterprise solutions delivered by DeRoyalTech across Ghana and the diaspora. Clients can click to visit the live running applications or launch our integrated MP4 video theater for an in-depth architecture and UI walkthrough.
          </p>
        </div>

        {/* Dynamic Project Metrics & Progress Tracker Bar (Fetched from Admin Config) */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 border border-slate-800 text-white shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Live Enterprise Delivery Metrics & Progress Tracker
              </span>
            </div>
            <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              Synced with Admin CMS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Metric 1: Projects Completed */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckSquare className="w-4 h-4 text-blue-400" />
                  <span>Projects Completed</span>
                </span>
                <span className="font-mono text-blue-400">Target 100</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
                  {animatedProjects}+
                </span>
                <span className="text-xs text-emerald-400 font-semibold">100% On-Time</span>
              </div>
              <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${Math.min(metrics.projectsCompleted, 100)}%` }} 
                />
              </div>
            </div>

            {/* Metric 2: Client Satisfaction Rate */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Smile className="w-4 h-4 text-emerald-400" />
                  <span>Client Satisfaction Rate</span>
                </span>
                <span className="font-mono text-emerald-400">NPS 94</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
                  {metrics.clientSatisfactionRate}%
                </span>
                <span className="text-xs text-emerald-400 font-semibold">Verified SLA</span>
              </div>
              <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${Math.min(metrics.clientSatisfactionRate, 100)}%` }} 
                />
              </div>
            </div>

            {/* Metric 3: Lines of Code Written */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Code2 className="w-4 h-4 text-orange-400" />
                  <span>Lines of Code Written</span>
                </span>
                <span className="font-mono text-orange-400">Production</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
                  {metrics.linesOfCodeWritten}
                </span>
                <span className="text-xs text-orange-400 font-semibold">0 CVE Flaws</span>
              </div>
              <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-amber-400 h-2 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: '92%' }} 
                />
              </div>
            </div>

            {/* Metric 4: Hardware Nodes Deployed */}
            <div className="space-y-2 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Cpu className="w-4 h-4 text-sky-400" />
                  <span>Hardware Nodes Deployed</span>
                </span>
                <span className="font-mono text-sky-400">Active</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
                  {animatedNodes.toLocaleString()}+
                </span>
                <span className="text-xs text-sky-400 font-semibold">{metrics.uptimeSla}% Uptime</span>
              </div>
              <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-sky-500 to-blue-400 h-2 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: '85%' }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full">
                    {project.industry}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {project.completionDate}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{project.client} · {project.clientCountry}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {project.summary}
                </p>

                {/* Key Deliverables */}
                {project.deliverables && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                      Scope Delivered:
                    </span>
                    <ul className="space-y-1">
                      {project.deliverables.map((deliv, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Metric Box */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">
                        Verified Metric
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-300">
                        {project.metrics[0].label}
                      </span>
                    </div>
                    <span className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {project.metrics[0].value}
                    </span>
                  </div>
                )}

                {/* Tech Stack */}
                {project.techStack && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons: Visit Live Product & Watch MP4 Overview */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 text-xs font-semibold text-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  <span>Visit Live App</span>
                </a>

                {project.videoUrl && (
                  <button
                    onClick={() => onOpenVideo(project)}
                    className="flex-1 py-2.5 px-3 text-xs font-semibold text-center rounded-lg bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Watch MP4</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discovery Call Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-900 to-slate-900 text-white border border-blue-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl font-bold">Inspired by One of Our Completed Deployments?</h3>
            <p className="text-xs text-blue-200 leading-relaxed">
              We can adapt proven architectures or develop a zero-compromise bespoke solution matching your exact business workflows and hardware requirements.
            </p>
          </div>
          <button
            onClick={() => openConsultation('Inquiry for custom project architecture')}
            className="px-5 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-lg hover:bg-blue-50 transition-colors shrink-0 shadow-md"
          >
            Start Project Discovery Call
          </button>
        </div>
      </div>
    </div>
  );
};
