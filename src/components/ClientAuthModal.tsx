import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  UserPlus, 
  LogIn, 
  ShieldCheck, 
  Building, 
  Mail, 
  Phone, 
  User, 
  Key, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Clock,
} from 'lucide-react';
import { useSite } from '../context/SiteContext.tsx';

export const ClientAuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalTab, 
    setAuthModalTab, 
    registerClient, 
    loginClient,
    authRedirectTarget,
    config
  } = useSite();

  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    company: '',
    phone: '',
    role: 'Procurement & Systems Lead',
    password: '',
    confirmPassword: ''
  });

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [authFeedback, setAuthFeedback] = useState<{ type: 'error' | 'pending' | 'success'; message: string } | null>(null);
  const [registrationSubmitted, setRegistrationSubmitted] = useState(false);

  if (!isAuthModalOpen) return null;

  const getPageTitle = (page: string | null) => {
    switch (page) {
      case 'services': return 'Engineering Services & Architecture';
      case 'workflow': return 'Hardware-to-Cloud Integration Hub';
      case 'projects': return 'Completed Projects & MP4 Video Overviews';
      case 'hardware': return 'Hardware Peripherals & Workstations Catalog';
      case 'estimator': return 'Solution Scope & Pricing Estimator';
      case 'contact': return 'Ghana Office & Consultation';
      default: return 'Enterprise Client Portal';
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFeedback(null);
    const newErrors: { [key: string]: string } = {};

    if (!registerForm.fullName.trim() || registerForm.fullName.trim().length < 3) {
      newErrors.fullName = 'Full legal name must be at least 3 characters.';
    }
    if (!registerForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
      newErrors.email = 'Valid corporate email address is required.';
    }
    if (!registerForm.company.trim() || registerForm.company.trim().length < 2) {
      newErrors.company = 'Registered company/organization name is required.';
    }
    if (!registerForm.phone.trim() || registerForm.phone.trim().length < 7) {
      newErrors.phone = 'Valid phone number with country code is required.';
    }
    if (!registerForm.password || registerForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const res = registerClient({
      fullName: registerForm.fullName,
      email: registerForm.email,
      company: registerForm.company,
      phone: registerForm.phone,
      role: registerForm.role,
      password: registerForm.password
    });

    if (res.success) {
      setRegistrationSubmitted(true);
      setAuthFeedback({
        type: 'pending',
        message: res.message || 'Registration submitted. Account pending admin approval.'
      });
    } else {
      setAuthFeedback({
        type: 'error',
        message: res.message || 'Registration failed. Please check your details.'
      });
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFeedback(null);
    const newErrors: { [key: string]: string } = {};

    if (!loginForm.email.trim()) newErrors.email = 'Email address is required.';
    if (!loginForm.password.trim()) newErrors.password = 'Password is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const res = loginClient(loginForm.email, loginForm.password);

    if (!res.success) {
      setAuthFeedback({
        type: 'error',
        message: res.message || 'Authentication failed.'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-4"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white relative border-b border-slate-800">
          <button
            onClick={() => {
              setIsAuthModalOpen(false);
              setRegistrationSubmitted(false);
              setAuthFeedback(null);
            }}
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
                DeRoyalTech Enterprise Gateway
              </span>
              <h2 className="text-lg font-bold">
                {authModalTab === 'register' ? 'Enterprise Client Registration' : 'Client Partner Sign In'}
              </h2>
            </div>
          </div>

          {authRedirectTarget && (
            <div className="mt-3 p-2.5 bg-blue-950/60 border border-blue-800/80 rounded-lg text-xs text-blue-200 flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                To access <strong>{getPageTitle(authRedirectTarget)}</strong>, an approved client account is required.
              </span>
            </div>
          )}
        </div>

        {registrationSubmitted ? (
          /* Registration Pending Approval State */
          <div className="p-6 sm:p-8 space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Registration Submitted · Pending Admin Approval
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                Thank you for applying for a DeRoyalTech Enterprise Partner account. To protect sensitive hardware inventory pricing and client architectural intellectual property, <strong>verified badges and full page access are granted only after review by our systems administrator</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5 font-mono">
              <div className="text-slate-500">Applicant: <span className="text-slate-900 dark:text-white font-bold">{registerForm.fullName}</span></div>
              <div className="text-slate-500">Company: <span className="text-slate-900 dark:text-white">{registerForm.company}</span></div>
              <div className="text-slate-500">Verification Status: <span className="text-amber-600 dark:text-amber-400 font-bold">Pending Review</span></div>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={() => {
                  setRegistrationSubmitted(false);
                  setIsAuthModalOpen(false);
                }}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                Close and Return to Homepage
              </button>
            </div>
          </div>
        ) : (
          /* Normal Auth Form (Register / Login) */
          <div>
            {/* Tab Switcher */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
              <button
                onClick={() => {
                  setAuthModalTab('register');
                  setAuthFeedback(null);
                }}
                className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                  authModalTab === 'register'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>New Client Registration</span>
              </button>

              <button
                onClick={() => {
                  setAuthModalTab('login');
                  setAuthFeedback(null);
                }}
                className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                  authModalTab === 'login'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In to Approved Account</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Feedback Alert */}
              {authFeedback && (
                <div className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                  authFeedback.type === 'error'
                    ? 'bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300'
                    : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authFeedback.message}</span>
                </div>
              )}

              {/* Registration Form */}
              {authModalTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Legal Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={registerForm.fullName}
                        onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                        placeholder="e.g. Kwame Mensah"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                    {errors.fullName && <p className="text-[11px] text-red-500 mt-0.5">{errors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Corporate Email *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          required
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                          placeholder="k.mensah@company.com"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                      {errors.email && <p className="text-[11px] text-red-500 mt-0.5">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Phone Contact *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          required
                          value={registerForm.phone}
                          onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                          placeholder="+233 24 590 1284"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                      {errors.phone && <p className="text-[11px] text-red-500 mt-0.5">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Company or Organization *
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={registerForm.company}
                          onChange={(e) => setRegisterForm({ ...registerForm, company: e.target.value })}
                          placeholder="e.g. West Africa Shippers Council"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                      {errors.company && <p className="text-[11px] text-red-500 mt-0.5">{errors.company}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Business Role / Title
                      </label>
                      <input
                        type="text"
                        value={registerForm.role}
                        onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                        placeholder="e.g. Chief Technology Officer"
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Create Password (min 6 chars) *
                      </label>
                      <div className="relative">
                        <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                      {errors.password && <p className="text-[11px] text-red-500 mt-0.5">{errors.password}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={registerForm.confirmPassword}
                          onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                      {errors.confirmPassword && <p className="text-[11px] text-red-500 mt-0.5">{errors.confirmPassword}</p>}
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>
                      Notice: All registrations undergo administrative review before verified badges are issued and access to restricted client pages is activated.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors mt-2"
                  >
                    <span>Submit Partner Registration for Approval</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Login Form */}
              {authModalTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Corporate Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        placeholder="e.g. k.asante@ghana-enterprises.com"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                    {errors.email && <p className="text-[11px] text-red-500 mt-0.5">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-[11px] text-red-500 mt-0.5">{errors.password}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Client Portal</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
