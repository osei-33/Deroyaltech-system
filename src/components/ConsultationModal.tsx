import React, { useState } from 'react';
import { X, CheckCircle2, Send, Clock, ShieldCheck, AlertCircle, Calendar, Phone } from 'lucide-react';
import { useSite } from '../context/SiteContext.tsx';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledScope?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  prefilledScope = ''
}) => {
  const { submitInquiry, bookConsultation, clientUser, config } = useSite();

  // Next business day as default date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    fullName: clientUser?.fullName || '',
    email: clientUser?.email || '',
    phone: clientUser?.phone || '+233 (0) 24 590 1284',
    company: clientUser?.company || '',
    projectType: 'turnkey',
    budget: 'GH₵ 80,000 - GH₵ 150,000',
    timeline: 'Within 2-3 months',
    scheduledDate: defaultDateStr,
    timeSlot: '10:00 AM GMT',
    scopeNotes: prefilledScope,
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Business email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.company.trim()) newErrors.company = 'Company name is required.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!formData.scheduledDate) newErrors.scheduledDate = 'Preferred date is required.';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    // 1. Submit consultation booking
    const newBookingId = bookConsultation({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      projectScope: formData.scopeNotes || `${formData.projectType} architecture consultation`,
      budgetBracket: formData.budget,
      scheduledDate: formData.scheduledDate,
      timeSlot: formData.timeSlot,
      adminNotes: formData.message
    });

    // 2. Also log as inquiry for CRM tracking
    submitInquiry({
      fullName: formData.fullName,
      email: formData.email,
      company: formData.company,
      projectType: formData.projectType,
      budget: formData.budget,
      timeline: formData.timeline,
      scopeNotes: formData.scopeNotes,
      message: `${formData.message} [Consultation Booking requested for ${formData.scheduledDate} at ${formData.timeSlot}]`
    });

    setBookingId(newBookingId);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      company: '',
      projectType: 'turnkey',
      budget: 'GH₵ 80,000 - GH₵ 150,000',
      timeline: 'Within 2-3 months',
      scheduledDate: defaultDateStr,
      timeSlot: '10:00 AM GMT',
      scopeNotes: '',
      message: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <span>Project Discovery Call & Architecture Booking</span>
            <span aria-hidden="true">·</span>
            <span>Accra Engineering Hub</span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          /* Confirmation State */
          <div className="p-8 sm:p-10 space-y-6 text-center animate-in fade-in">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
                Booking Reference: {bookingId}
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Consultation Scheduled Successfully
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Your consultation request for <strong>{formData.scheduledDate} ({formData.timeSlot})</strong> has been received by our lead systems engineer. You will receive an email confirmation and calendar invite once our administrator confirms the slot.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Date:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formData.scheduledDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time Slot:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formData.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Client / Company:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formData.company}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Budget Bracket:</span>
                <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{formData.budget}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
              >
                Done & Return to Site
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Schedule Technical Architecture Consultation
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Select your preferred date, time slot, and project scope. Our Accra engineering lead reviews and confirms your appointment within 2 business hours.
              </p>
            </div>

            {/* Scope Badge if prefilled */}
            {prefilledScope && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 rounded-xl text-xs flex items-start gap-2.5 text-blue-900 dark:text-blue-200">
                <span className="font-bold text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-200/80 dark:bg-blue-900 shrink-0">
                  Target Scope
                </span>
                <span className="font-mono text-xs">{prefilledScope}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Kwame Mensah"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                {errors.fullName && <p className="text-[11px] text-red-500 mt-0.5">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Business Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="k.mensah@company.com"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                {errors.email && <p className="text-[11px] text-red-500 mt-0.5">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company / Organization *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. West Africa Shippers Council"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                {errors.company && <p className="text-[11px] text-red-500 mt-0.5">{errors.company}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number (Ghana / International) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+233 24 590 1284"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                {errors.phone && <p className="text-[11px] text-red-500 mt-0.5">{errors.phone}</p>}
              </div>
            </div>

            {/* Date & Time Slot Scheduling */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Preferred Architecture Consultation Slot</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Select Appointment Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Select Time Window (GMT)
                  </label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  >
                    <option value="09:00 AM GMT">09:00 AM GMT (Morning Briefing)</option>
                    <option value="11:30 AM GMT">11:30 AM GMT (Midday Session)</option>
                    <option value="02:00 PM GMT">02:00 PM GMT (Afternoon Deep-Dive)</option>
                    <option value="04:30 PM GMT">04:30 PM GMT (Executive Review)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Estimated Investment Bracket (GH₵)
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                >
                  <option value="GH₵ 40,000 - GH₵ 80,000">GH₵ 40,000 - GH₵ 80,000</option>
                  <option value="GH₵ 80,000 - GH₵ 150,000">GH₵ 80,000 - GH₵ 150,000</option>
                  <option value="GH₵ 150,000 - GH₵ 400,000">GH₵ 150,000 - GH₵ 400,000</option>
                  <option value="GH₵ 400,000+ Enterprise Turnkey">GH₵ 400,000+ Enterprise Turnkey</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project Domain
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="turnkey">Turnkey Full-Stack & Hardware</option>
                  <option value="crm">Custom CRM Architecture</option>
                  <option value="web">Web Application & Portal</option>
                  <option value="mobile">Native Mobile App (iOS / Android)</option>
                  <option value="cloud">Cloud Infrastructure & DevOps</option>
                  <option value="hardware">Hardware Supply & Telemetry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Project Specifics or Key Challenges
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mention operational bottlenecks, existing tech stack, hardware quantities needed, or deadlines..."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm & Request Consultation Slot</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
