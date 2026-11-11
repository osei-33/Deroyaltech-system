import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  Shield, 
  X, 
  Sparkles,
  UserCheck,
  UserX,
  ExternalLink,
  Award,
  Briefcase
} from 'lucide-react';
import { useSite } from '../../../context/SiteContext.tsx';
import { TeamMember } from '../../../types/index.ts';

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
];

export const ASSIGNABLE_ROLES = [
  'Lead Developer',
  'Project Manager',
  'Consultant',
  'Solutions Architect',
  'DevOps Specialist',
  'Full-Stack Engineer',
  'Hardware & IoT Specialist',
  'QA & Systems Reliability Lead'
];

export const AVAILABLE_RESPONSIBILITIES = [
  'Sprint Architecture & Code Review',
  'Project Delivery & Client Management',
  'Technical Briefs & Scope Estimates',
  'Hybrid Cloud Telemetry & DevOps',
  'Hardware Assembly & Firmware Testing',
  'POS Terminal Integration & Handheld Fleets',
  'Security Hardening & Database Integrity',
  '24/7 Operations Standby Desk'
];

export const AdminTeamTab: React.FC = () => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember, resetTeamToDefault } = useSite();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [roleUpdatedToast, setRoleUpdatedToast] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<TeamMember, 'id'>>({
    name: '',
    role: '',
    assignedRole: 'Lead Developer',
    department: 'Cloud & Infrastructure',
    bio: '',
    avatarUrl: SAMPLE_AVATARS[0],
    email: '',
    phone: '+233 (0) 30 294 8821',
    linkedinUrl: '',
    githubUrl: '',
    displayOrder: 1,
    isActive: true,
    responsibilities: ['Sprint Architecture & Code Review']
  });

  const handleOpenNew = () => {
    setEditingMemberId(null);
    setFormData({
      name: '',
      role: '',
      assignedRole: 'Lead Developer',
      department: 'Cloud & Infrastructure',
      bio: '',
      avatarUrl: SAMPLE_AVATARS[Math.floor(Math.random() * SAMPLE_AVATARS.length)],
      email: '',
      phone: '+233 (0) 30 294 8821',
      linkedinUrl: 'https://linkedin.com/company/deroyaltech',
      githubUrl: 'https://github.com/osei-33',
      displayOrder: (teamMembers || []).length + 1,
      isActive: true,
      responsibilities: ['Sprint Architecture & Code Review', 'Hybrid Cloud Telemetry & DevOps']
    });
    setIsEditorOpen(true);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMemberId(member.id);
    setFormData({
      name: member.name,
      role: member.role,
      assignedRole: member.assignedRole || 'Lead Developer',
      department: member.department,
      bio: member.bio,
      avatarUrl: member.avatarUrl,
      email: member.email,
      phone: member.phone || '',
      linkedinUrl: member.linkedinUrl || '',
      githubUrl: member.githubUrl || '',
      displayOrder: member.displayOrder,
      isActive: member.isActive,
      responsibilities: member.responsibilities || []
    });
    setIsEditorOpen(true);
  };

  const handleQuickRoleAssign = (memberId: string, newRole: string) => {
    updateTeamMember(memberId, { assignedRole: newRole });
    const member = (teamMembers || []).find(m => m.id === memberId);
    setRoleUpdatedToast(`Role assigned: ${member?.name || 'Member'} is now ${newRole}`);
    setTimeout(() => setRoleUpdatedToast(null), 3000);
  };

  const toggleResponsibility = (resp: string) => {
    setFormData(prev => {
      const current = prev.responsibilities || [];
      const updated = current.includes(resp)
        ? current.filter(r => r !== resp)
        : [...current, resp];
      return { ...prev, responsibilities: updated };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) return;

    if (editingMemberId) {
      updateTeamMember(editingMemberId, formData);
    } else {
      addTeamMember(formData);
    }

    setIsEditorOpen(false);
    setEditingMemberId(null);
  };

  const filteredTeam = (teamMembers || []).filter(m => {
    if (selectedDept === 'all') return true;
    return m.department === selectedDept;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            <span>Team Management & Role Assignments</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Assign designated operational roles (Lead Developer, Project Manager, Consultant, etc.) and core project responsibilities to engineering team members.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={resetTeamToDefault}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleOpenNew}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* Department Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
        {[
          { id: 'all', label: 'All Departments' },
          { id: 'Executive & Architecture', label: 'Architecture & Leadership' },
          { id: 'Cloud & Infrastructure', label: 'Cloud Infrastructure' },
          { id: 'Software & CRM Development', label: 'Software & CRM' },
          { id: 'Hardware & Embedded Systems', label: 'Hardware & IoT' }
        ].map(dept => (
          <button
            key={dept.id}
            type="button"
            onClick={() => setSelectedDept(dept.id)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
              selectedDept === dept.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {dept.label}
          </button>
        ))}
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeam.map(member => (
          <div
            key={member.id}
            className={`p-5 rounded-2xl border transition-all space-y-4 flex flex-col justify-between ${
              member.isActive
                ? 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-900 border-dashed border-slate-300 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {member.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() => updateTeamMember(member.id, { isActive: !member.isActive })}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        member.isActive
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {member.isActive ? 'Active' : 'Hidden'}
                    </button>
                  </div>

                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {member.role}
                  </div>

                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-mono mt-1">
                    {member.department}
                  </span>
                </div>
              </div>

              {/* Specific Assigned Operational Role Selector */}
              <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Assigned Operational Role:</span>
                  </span>
                </div>
                <select
                  value={member.assignedRole || 'Lead Developer'}
                  onChange={(e) => handleQuickRoleAssign(member.id, e.target.value)}
                  className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-lg text-xs font-bold text-emerald-900 dark:text-emerald-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {ASSIGNABLE_ROLES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Responsibilities Tags */}
              {member.responsibilities && member.responsibilities.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Key Responsibilities:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {member.responsibilities.map(resp => (
                      <span
                        key={resp}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium"
                      >
                        {resp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {member.bio}
              </p>
            </div>

            {/* Contacts & Controls */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                {member.email && (
                  <a href={`mailto:${member.email}`} className="hover:text-emerald-500 transition-colors" title={member.email}>
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {member.linkedinUrl && (
                  <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors" title="LinkedIn">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {member.githubUrl && (
                  <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors" title="GitHub">
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(member)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Edit Profile & Responsibilities"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteTeamMember(member.id)}
                  className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                  title="Remove from Directory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold">
                  {editingMemberId ? 'Edit Team Member & Assign Role' : 'Add New Team Member'}
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

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Emmanuel Osei"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Public Professional Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Chief Technology Officer"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Specific Role Assignment Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Assigned Operational Role (Admin Assignment) *
                </label>
                <select
                  value={formData.assignedRole || 'Lead Developer'}
                  onChange={(e) => setFormData({ ...formData, assignedRole: e.target.value })}
                  className="w-full px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs font-bold text-emerald-900 dark:text-emerald-200"
                >
                  {ASSIGNABLE_ROLES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Assign specific roles like Lead Developer, Project Manager, or Consultant for project tracking and client matching.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Executive & Architecture">Architecture & Leadership</option>
                    <option value="Cloud & Infrastructure">Cloud Infrastructure</option>
                    <option value="Software & CRM Development">Software & CRM Development</option>
                    <option value="Hardware & Embedded Systems">Hardware & IoT Systems</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Display Priority Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Responsibilities Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Assigned Project Responsibilities
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  {AVAILABLE_RESPONSIBILITIES.map(resp => {
                    const isSelected = (formData.responsibilities || []).includes(resp);
                    return (
                      <button
                        key={resp}
                        type="button"
                        onClick={() => toggleResponsibility(resp)}
                        className={`p-2 rounded-xl text-left text-xs font-medium transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span className="text-[11px] leading-snug">{resp}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Professional Bio
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g., e.osei@deroyaltech.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    GitHub / Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
                >
                  {editingMemberId ? 'Save Changes' : 'Add Team Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Updated Quick Toast */}
      {roleUpdatedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-emerald-950 text-emerald-200 rounded-2xl shadow-xl text-xs flex items-center gap-2 border border-emerald-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{roleUpdatedToast}</span>
        </div>
      )}
    </div>
  );
};
