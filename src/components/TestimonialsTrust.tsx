import React from 'react';
import { ShieldCheck, Award, Lock, Server, CheckCircle2 } from 'lucide-react';
import { CLIENT_TESTIMONIALS } from '../data/companyData.ts';

export const TestimonialsTrust: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-2">
            Enterprise Trust & Operational Feedback
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ textWrap: 'balance' }}>
            Trusted by organizations managing mission-critical workflows.
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Hear from operations directors and engineering leaders who have unified their custom software, cloud clusters, and hardware peripherals with DeRoyalTech.
          </p>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {CLIENT_TESTIMONIALS.map((test) => (
            <div
              key={test.id}
              className="p-6 sm:p-7 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                {/* Metric callout */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {test.industry}
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    {test.metric}
                  </span>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic mb-6">
                  "{test.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {test.author}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {test.role} · {test.company}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security, Compliance & SLA Matrix Strip */}
        <div className="p-8 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Security Governance</span>
              </div>
              <div className="text-base font-bold">SOC 2 Type II & ISO 27001</div>
              <p className="text-xs text-slate-400">
                End-to-end data encryption, audit trails, and strict role-based access control built in.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Server className="w-4 h-4" />
                <span>Infrastructure SLA</span>
              </div>
              <div className="text-base font-bold">99.98% High Availability</div>
              <p className="text-xs text-slate-400">
                Guaranteed uptime with automated multi-zone failover and 15-minute response windows.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Certified Engineering</span>
              </div>
              <div className="text-base font-bold">AWS & GCP Certified</div>
              <p className="text-xs text-slate-400">
                Lead architects hold Professional Cloud Architect and Kubernetes CKA certifications.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Lock className="w-4 h-4" />
                <span>Hardware Integrity</span>
              </div>
              <div className="text-base font-bold">100% Pre-Delivery Tested</div>
              <p className="text-xs text-slate-400">
                All computer peripherals and edge gateways undergo 72-hour thermal stress testing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
