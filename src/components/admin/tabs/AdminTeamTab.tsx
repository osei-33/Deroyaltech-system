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
  ExternalLink
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

export const AdminTeamTab: React.FC = () => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember, resetTeamToDefault } = useSite();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const [formData, setFormData] = useState<Omit<TeamMember, 'id'>>({
    name: '',
    role: '',
    department: 'Cloud & Infrastructure',
    bio: '',
    avatarUrl: SAMPLE_AVATARS[0],
    email: '',
    phone: '+233 (0) 30 294 8821',
    linkedinUrl: '',
    githubUrl: '',
    displayOrder: 1,
    isActive: true
  });

  const handleOpenNew = () => {
    setEditingMemberId(null);
    setFormData({
      name: '',
      role: '',
      department: 'Cloud & Infrastructure',
      bio: '',
      avatarUrl: SAMPLE_AVATARS[Math.floor(Math.random() * SAMPLE_AVATARS.length)],
      email: '',
      phone: '+233 (0) 30 294 8821',
      linkedinUrl: 'https://linkedin.com/company/deroyaltech',
      githubUrl: 'https://github.com/osei-33',
      displayOrder: (teamMembers || []).length + 1,
      isActive: true
    });
    setIsEditorOpen(true);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMemberId(member.id);
    setFormData({
      name: member.name,
      role: member.role,
      department: member.department,
      bio: member.bio,
      avatarUrl: member.avatarUrl,
      email: member.email,
      phone: member.phone || '',
      linkedinUrl: member.linkedinUrl || '',
      githubUrl: member.githubUrl || '',
      displayOrder: member.displayOrder,
      isActive: member.isActive
    });
    setIsEditorOpen(true);
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
            <span>Engineering & Leadership Team Directory</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage public team profiles, lead systems architects, and engineering department leads displayed on the website.
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
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTeam.map(member => (
          <div
            key={member.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-all shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start gap-4">
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-md shrink-0"
              />

              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {member.name}
                  </h4>
                  <button
                    type="button"
                    onClick={() => updateTeamMember(member.id, { isActive: !member.isActive })}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                      member.isActive
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300'
                    }`}
                  >
                    {member.isActive ? 'Active' : 'Hidden'}
                  </button>
                </div>

                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {member.role}
                </div>

                <span className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-mono">
                  {member.department}
                </span>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 pt-1 leading-relaxed">
                  {member.bio}
                </p>
              </div>
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
                  <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {member.githubUrl && (
                  <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(member)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Edit Profile"
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
          <div className="w-full max-w-xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold">
                  {editingMemberId ? 'Edit Team Member Profile' : 'Add New Team Member'}
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Official Role / Title *
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

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                >
                  <option value="Executive & Architecture">Executive & Systems Architecture</option>
                  <option value="Cloud & Infrastructure">Cloud Infrastructure & DevOps</option>
                  <option value="Software & CRM Development">Software & CRM Development</option>
                  <option value="Hardware & Embedded Systems">Hardware & Embedded Systems</option>
                  <option value="Client Success">Client Success & Solutions Consulting</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Professional Bio / Core Expertise
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of engineering focus, cloud systems experience in Ghana..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              {/* Avatar Picker */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white mb-2"
                />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-semibold">Presets:</span>
                  {SAMPLE_AVATARS.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Preset"
                      onClick={() => setFormData({ ...formData, avatarUrl: url })}
                      className={`w-7 h-7 rounded-lg object-cover cursor-pointer border transition-transform hover:scale-110 ${
                        formData.avatarUrl === url ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-300 dark:border-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Email & Social Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Corporate Email
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
                    LinkedIn Profile
                  </label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="isActiveToggle" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Display member publicly on the website
                </label>
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors"
                >
                  {editingMemberId ? 'Save Profile' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
