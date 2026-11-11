import React, { useState } from 'react';
import { 
  Calculator, 
  Check, 
  ArrowRight, 
  Clock, 
  DollarSign, 
  Layers, 
  Cpu, 
  ShieldCheck,
  Coins
} from 'lucide-react';
import { EstimatorState } from '../types/index.ts';
import { useSite } from '../context/SiteContext.tsx';

interface SolutionEstimatorProps {
  onApplyScopeToBrief: (configSummary: string) => void;
  initialSelectedService?: string;
}

export const SolutionEstimator: React.FC<SolutionEstimatorProps> = ({
  onApplyScopeToBrief,
  initialSelectedService
}) => {
  const { formatPrice, config } = useSite();
  const [selectedServices, setSelectedServices] = useState<string[]>(() => {
    return initialSelectedService ? [initialSelectedService] : ['web-software', 'custom-crm'];
  });

  const [companyScale, setCompanyScale] = useState<'growth' | 'midmarket' | 'enterprise'>('midmarket');
  const [cloudTier, setCloudTier] = useState<'standard' | 'high-availability' | 'mission-critical'>('high-availability');
  const [hardwareUnits, setHardwareUnits] = useState<number>(25);
  const [timelineSpeed, setTimelineSpeed] = useState<'standard' | 'accelerated'>('standard');

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) 
        ? (prev.length > 1 ? prev.filter(s => s !== id) : prev) 
        : [...prev, id]
    );
  };

  // Pricing & Timeline Matrix calculations in Ghanaian Cedis (GH₵)
  const calculateEstimate = () => {
    let baseMin = 0;
    let baseMax = 0;
    let weeksMin = 4;
    let weeksMax = 8;

    selectedServices.forEach(srv => {
      switch (srv) {
        case 'web-software':
          baseMin += 45000;
          baseMax += 85000;
          weeksMin += 2;
          weeksMax += 4;
          break;
        case 'mobile-dev':
          baseMin += 55000;
          baseMax += 98000;
          weeksMin += 3;
          weeksMax += 5;
          break;
        case 'custom-crm':
          baseMin += 75000;
          baseMax += 140000;
          weeksMin += 3;
          weeksMax += 6;
          break;
        case 'cloud-infrastructure':
          baseMin += 38000;
          baseMax += 78000;
          weeksMin += 1;
          weeksMax += 3;
          break;
        case 'hardware-integration':
          baseMin += 60000;
          baseMax += 115000;
          weeksMin += 3;
          weeksMax += 5;
          break;
        case 'computer-hardware':
          baseMin += 28000;
          baseMax += 55000;
          break;
      }
    });

    // Scale multiplier
    const scaleMultiplier = companyScale === 'growth' ? 0.85 : companyScale === 'midmarket' ? 1.0 : 1.45;
    
    // Cloud Tier addition (in GH₵)
    const cloudAdd = cloudTier === 'standard' ? 0 : cloudTier === 'high-availability' ? 14000 : 38000;

    // Hardware unit procurement scaling (in GH₵)
    const hardwareProcurement = selectedServices.includes('computer-hardware') || selectedServices.includes('hardware-integration')
      ? hardwareUnits * 1650
      : 0;

    const finalMin = Math.round((baseMin * scaleMultiplier + cloudAdd + hardwareProcurement) / 1000) * 1000;
    const finalMax = Math.round((baseMax * scaleMultiplier + cloudAdd * 1.3 + hardwareProcurement * 1.15) / 1000) * 1000;

    if (timelineSpeed === 'accelerated') {
      weeksMin = Math.max(3, Math.round(weeksMin * 0.7));
      weeksMax = Math.max(5, Math.round(weeksMax * 0.75));
    }

    return {
      minPrice: finalMin,
      maxPrice: finalMax,
      weeksMin,
      weeksMax
    };
  };

  const { minPrice, maxPrice, weeksMin, weeksMax } = calculateEstimate();

  const handleApply = () => {
    const summary = `Selected Modules: ${selectedServices.join(', ')} | Scale: ${companyScale} | Cloud Availability: ${cloudTier} | Hardware Units: ${hardwareUnits} | Speed: ${timelineSpeed} | Scope: ${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
    onApplyScopeToBrief(summary);
  };

  const serviceOptions = [
    { id: 'web-software', title: 'Custom Web & Software Development', desc: 'Enterprise SaaS, high-throughput web portals, APIs' },
    { id: 'mobile-dev', title: 'Native iOS & Android Mobile Apps', desc: 'Offline-first database, BLE peripheral interfacing' },
    { id: 'custom-crm', title: 'Custom CRM & Sales Pipelines', desc: 'Bespoke automation, ERP sync, customer 360 portal' },
    { id: 'cloud-infrastructure', title: 'Cloud DevOps & Kubernetes', desc: 'Multi-cloud Terraform, 99.98% SLA, Prometheus' },
    { id: 'hardware-integration', title: 'Hardware Integration & IoT Telemetry', desc: 'Edge gateways, Modbus/MQTT, industrial barcode sync' },
    { id: 'computer-hardware', title: 'Computer Hardware & Peripherals', desc: 'Workstations, 1U servers, 5K displays, scanners' },
  ];

  return (
    <section id="estimator" className="py-20 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-2">
            Interactive Project Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ textWrap: 'balance' }}>
            Solution Scope & Timeline Estimator
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Configure your technical requirements to generate a transparent estimate of engineering timelines, infrastructure sizing, and investment scope.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Configuration Form Controls */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Services Selection */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
                1. Select Desired Solution Modules:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serviceOptions.map((opt) => {
                  const isChecked = selectedServices.includes(opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleService(opt.id)}
                      className={`cursor-pointer p-4 rounded-xl border transition-all ${
                        isChecked
                          ? 'bg-white dark:bg-slate-800 border-blue-600 dark:border-blue-500 shadow-sm ring-1 ring-blue-600 dark:ring-blue-500'
                          : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                          {opt.title}
                        </span>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isChecked
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Organization Scale */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
                2. Operational Scale & User Concurrency:
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'growth', label: 'Growth / SMB', desc: '< 100 internal users' },
                  { id: 'midmarket', label: 'Mid-Market', desc: '100 - 1,000 users' },
                  { id: 'enterprise', label: 'Enterprise', desc: '1,000+ users / multi-site' }
                ].map((scale) => (
                  <button
                    key={scale.id}
                    onClick={() => setCompanyScale(scale.id as any)}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      companyScale === scale.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{scale.label}</div>
                    <div className={`text-[10px] mt-0.5 ${companyScale === scale.id ? 'text-blue-100' : 'text-slate-400'}`}>
                      {scale.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Cloud SLA Tier */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
                3. Cloud Infrastructure Availability SLA:
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'standard', label: '99.9% Uptime', sub: 'Single-Region Autoscaling' },
                  { id: 'high-availability', label: '99.98% High Availability', sub: 'Multi-AZ EKS/GKE Cluster' },
                  { id: 'mission-critical', label: '99.99% Mission Critical', sub: 'Multi-Cloud Active-Active' }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setCloudTier(tier.id as any)}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      cloudTier === tier.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{tier.label}</div>
                    <div className={`text-[10px] mt-0.5 ${cloudTier === tier.id ? 'text-blue-100' : 'text-slate-400'}`}>
                      {tier.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Hardware Endpoints / Peripherals Count */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
                <span>4. Connected Hardware Endpoints / Workstations:</span>
                <span className="font-mono text-blue-600 dark:text-blue-400 tabular-nums">{hardwareUnits} Endpoints</span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={hardwareUnits}
                onChange={(e) => setHardwareUnits(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>5 units (pilot branch)</span>
                <span>50 units</span>
                <span>150 units</span>
                <span>250+ units (enterprise fleet)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Real-Time Output Card */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Preliminary Engineering Scope</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Fixed-Price / Milestone
              </span>
            </div>

            {/* Price Output */}
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Estimated Project Investment ({config.currencySymbol})</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
                {formatPrice(minPrice)} – {formatPrice(maxPrice)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Includes full architecture, source IP transfer, deployment & QA in Ghana
              </div>
            </div>

            {/* Timeline Output */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Estimated Delivery Horizon:
                </span>
                <span className="text-base font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {weeksMin} – {weeksMax} Weeks
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Availability SLA:
                </span>
                <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {cloudTier === 'standard' ? '99.9%' : cloudTier === 'high-availability' ? '99.98%' : '99.99%'} Uptime
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Hardware Fleet:
                </span>
                <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {hardwareUnits} Peripherals Staged
                </span>
              </div>
            </div>

            {/* Architecture Highlights Included */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-1">
                Guaranteed in Every Scope:
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Complete 100% Client Ownership of Code & IP</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Pre-Deployment Staging & Hardware Testing</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>90-Day Post-Launch Warranty & DevOps Handover</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleApply}
              className="w-full py-3.5 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <span>Apply Scope to Consultation Brief</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
