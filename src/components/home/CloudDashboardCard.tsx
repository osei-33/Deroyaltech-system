import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  Server, 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  ShieldCheck, 
  Clock, 
  Zap, 
  RefreshCw, 
  Globe,
  Database,
  ArrowUpRight
} from 'lucide-react';

interface TelemetryPoint {
  time: string;
  latencyMs: number;
  throughputGbps: number;
  cpuLoadPercent: number;
  uptimeRate: number;
}

const INITIAL_TELEMETRY: TelemetryPoint[] = [
  { time: '00:00', latencyMs: 12.1, throughputGbps: 2.4, cpuLoadPercent: 22, uptimeRate: 100 },
  { time: '02:00', latencyMs: 11.8, throughputGbps: 1.9, cpuLoadPercent: 18, uptimeRate: 100 },
  { time: '04:00', latencyMs: 10.9, throughputGbps: 1.5, cpuLoadPercent: 16, uptimeRate: 100 },
  { time: '06:00', latencyMs: 13.4, throughputGbps: 3.1, cpuLoadPercent: 26, uptimeRate: 100 },
  { time: '08:00', latencyMs: 14.8, throughputGbps: 5.8, cpuLoadPercent: 41, uptimeRate: 99.99 },
  { time: '10:00', latencyMs: 15.2, throughputGbps: 6.9, cpuLoadPercent: 46, uptimeRate: 99.99 },
  { time: '12:00', latencyMs: 14.6, throughputGbps: 7.4, cpuLoadPercent: 49, uptimeRate: 100 },
  { time: '14:00', latencyMs: 13.9, throughputGbps: 6.8, cpuLoadPercent: 44, uptimeRate: 100 },
  { time: '16:00', latencyMs: 15.5, throughputGbps: 7.1, cpuLoadPercent: 47, uptimeRate: 100 },
  { time: '18:00', latencyMs: 16.2, throughputGbps: 6.2, cpuLoadPercent: 39, uptimeRate: 99.98 },
  { time: '20:00', latencyMs: 13.7, throughputGbps: 4.8, cpuLoadPercent: 32, uptimeRate: 100 },
  { time: '22:00', latencyMs: 12.3, throughputGbps: 3.6, cpuLoadPercent: 25, uptimeRate: 100 },
  { time: 'Now', latencyMs: 11.4, throughputGbps: 4.2, cpuLoadPercent: 28, uptimeRate: 100 },
];

export const CloudDashboardCard: React.FC = () => {
  const [data, setData] = useState<TelemetryPoint[]>(INITIAL_TELEMETRY);
  const [activeMetric, setActiveMetric] = useState<'latency' | 'throughput' | 'cpu'>('latency');
  const [autoTick, setAutoTick] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');

  // Real-time telemetry heartbeat simulation
  useEffect(() => {
    if (!autoTick) return;

    const interval = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1];
        // Jitter within normal operational boundaries
        const jitterLatency = Math.max(9.5, Math.min(18.5, Number((last.latencyMs + (Math.random() * 2 - 1)).toFixed(1))));
        const jitterThroughput = Math.max(2.0, Math.min(8.5, Number((last.throughputGbps + (Math.random() * 1.2 - 0.6)).toFixed(1))));
        const jitterCpu = Math.max(18, Math.min(65, Math.round(last.cpuLoadPercent + (Math.random() * 6 - 3))));

        const updatedLast: TelemetryPoint = {
          ...last,
          latencyMs: jitterLatency,
          throughputGbps: jitterThroughput,
          cpuLoadPercent: jitterCpu
        };

        return [...prev.slice(0, -1), updatedLast];
      });
      setLastRefreshed(new Date().toLocaleTimeString());
    }, 3500);

    return () => clearInterval(interval);
  }, [autoTick]);

  const currentStats = data[data.length - 1];

  const getMetricColor = () => {
    switch (activeMetric) {
      case 'latency':
        return { stroke: '#3b82f6', fill: 'url(#latencyGradient)', label: 'Ping Latency (ms)', unit: 'ms' };
      case 'throughput':
        return { stroke: '#10b981', fill: 'url(#throughputGradient)', label: 'Throughput (Gbps)', unit: 'Gbps' };
      case 'cpu':
        return { stroke: '#8b5cf6', fill: 'url(#cpuGradient)', label: 'CPU Load (%)', unit: '%' };
    }
  };

  const metricInfo = getMetricColor();

  return (
    <div className="w-full bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Live Telemetry Badge */}
      <div className="relative p-6 sm:p-8 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE TELEMETRY STREAM</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Accra Edge DC-01 • Zero-Packet-Loss SLA
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Server className="w-7 h-7 text-blue-400" />
            <span>Cloud Infrastructure & Hardware Telemetry Hub</span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Real-time server uptime, low-latency edge routing, and dedicated hardware telemetry monitored 24/7 across West Africa.
          </p>
        </div>

        {/* Controls & Metric Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center">
            <button
              type="button"
              onClick={() => setActiveMetric('latency')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMetric === 'latency'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Latency ({currentStats.latencyMs} ms)
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('throughput')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMetric === 'throughput'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Network ({currentStats.throughputGbps} Gbps)
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('cpu')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMetric === 'cpu'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              CPU ({currentStats.cpuLoadPercent}%)
            </button>
          </div>

          <button
            type="button"
            onClick={() => setAutoTick(!autoTick)}
            title={autoTick ? 'Pause real-time tick' : 'Resume real-time tick'}
            className={`p-2 rounded-xl border transition-colors ${
              autoTick 
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' 
                : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${autoTick ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>
        </div>
      </div>

      {/* Grid of 4 Key Uptime & Hardware Telemetry Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 bg-slate-950/40 border-b border-slate-800/80">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Ping Latency</span>
            </span>
            <span className="text-emerald-400 font-mono font-bold text-[11px]">OPTIMAL</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {currentStats.latencyMs} <span className="text-sm font-normal text-slate-400">ms</span>
          </div>
          <p className="text-[11px] text-slate-400">Target: &lt; 20ms within Ghana</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SLA Uptime</span>
            </span>
            <span className="text-blue-400 font-mono font-bold text-[11px]">30-DAY</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
            99.99<span className="text-sm font-normal text-slate-400">%</span>
          </div>
          <p className="text-[11px] text-slate-400">248 days zero unmanaged downtime</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-blue-400" />
              <span>Edge Throughput</span>
            </span>
            <span className="text-indigo-400 font-mono font-bold text-[11px]">LIVE</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {currentStats.throughputGbps} <span className="text-sm font-normal text-slate-400">Gbps</span>
          </div>
          <p className="text-[11px] text-slate-400">Burstable to 10 Gbps redundant uplink</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>Hardware Load</span>
            </span>
            <span className="text-emerald-400 font-mono font-bold text-[11px]">HEALTHY</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {currentStats.cpuLoadPercent}<span className="text-sm font-normal text-slate-400">%</span>
          </div>
          <p className="text-[11px] text-slate-400">Thermal: 38.5°C • 128GB ECC Active</p>
        </div>
      </div>

      {/* Main Recharts Telemetry Graph */}
      <div className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              {metricInfo.label} — 24-Hour Telemetry Curve
            </h4>
          </div>
          <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
            <span>Tick: {lastRefreshed}</span>
          </div>
        </div>

        <div className="w-full h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="throughputGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                unit={activeMetric === 'latency' ? 'ms' : activeMetric === 'throughput' ? 'G' : '%'}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const pt = payload[0].payload as TelemetryPoint;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1 font-mono">
                        <div className="font-bold text-slate-300 border-b border-slate-800 pb-1">
                          Timeline: {label}
                        </div>
                        <div className="text-blue-400">
                          Latency: <strong>{pt.latencyMs} ms</strong>
                        </div>
                        <div className="text-emerald-400">
                          Throughput: <strong>{pt.throughputGbps} Gbps</strong>
                        </div>
                        <div className="text-purple-400">
                          CPU Compute: <strong>{pt.cpuLoadPercent}%</strong>
                        </div>
                        <div className="text-slate-400 text-[10px]">
                          Uptime: {pt.uptimeRate}%
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey={
                  activeMetric === 'latency' 
                    ? 'latencyMs' 
                    : activeMetric === 'throughput' 
                    ? 'throughputGbps' 
                    : 'cpuLoadPercent'
                }
                stroke={metricInfo.stroke} 
                strokeWidth={2.5}
                fill={metricInfo.fill} 
                dot={{ r: 3, fill: metricInfo.stroke, stroke: '#0f172a', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: metricInfo.stroke, stroke: '#ffffff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cluster Node Status Footer */}
      <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-semibold">Accra Central DC-01</span>
            <span className="text-slate-500 font-mono">(99.99%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-semibold">Kumasi Edge Gateway</span>
            <span className="text-slate-500 font-mono">(99.98%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-semibold">Takoradi Port Relay</span>
            <span className="text-slate-500 font-mono">(99.97%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-slate-300 font-semibold">London Cloud Peering</span>
            <span className="text-slate-500 font-mono">(78ms)</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Tier-3 Ghana Data Center Certified</span>
        </div>
      </div>
    </div>
  );
};
