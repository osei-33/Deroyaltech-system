import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Activity, 
  Cpu, 
  Zap, 
  Gauge, 
  ShieldCheck, 
  Plus, 
  Check, 
  RotateCcw, 
  Sliders, 
  Eye, 
  Terminal, 
  HardDrive, 
  Radio, 
  Server,
  Layers,
  Sparkles,
  Wifi
} from 'lucide-react';
import { HardwareProduct } from '../../types/index.ts';
import { useSite } from '../../context/SiteContext.tsx';

interface HardwareTelemetryModalProps {
  product: HardwareProduct | null;
  onClose: () => void;
  onAddToCart?: (product: HardwareProduct) => void;
}

export const HardwareTelemetryModal: React.FC<HardwareTelemetryModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  const { formatPrice } = useSite();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isStressMode, setIsStressMode] = useState(false);
  const [activeSensor, setActiveSensor] = useState<'thermals' | 'optical' | 'throughput' | 'crm'>('thermals');
  const [isAdded, setIsAdded] = useState(false);

  // Real-time telemetry state variables with organic drift
  const [temp, setTemp] = useState(48.5);
  const [fanRpm, setFanRpm] = useState(2850);
  const [throughput, setThroughput] = useState(9.82);
  const [latency, setLatency] = useState(1.4);
  const [powerWatts, setPowerWatts] = useState(385);
  const [packetCount, setPacketCount] = useState(148290);
  const [logs, setLogs] = useState<string[]>([]);

  // Simulation tick
  useEffect(() => {
    if (!product || !isPlaying) return;

    const interval = setInterval(() => {
      const multiplier = isStressMode ? 1.8 : 1.0;
      
      setTemp(prev => {
        const target = isStressMode ? 74.2 : 48.5;
        const drift = (Math.random() - 0.5) * 1.2;
        return Number((prev + (target - prev) * 0.15 + drift).toFixed(1));
      });

      setFanRpm(prev => {
        const target = isStressMode ? 5200 : 2850;
        const drift = Math.floor((Math.random() - 0.5) * 60);
        return Math.floor(prev + (target - prev) * 0.2 + drift);
      });

      setThroughput(prev => {
        const base = isStressMode ? 18.5 : 9.8;
        return Number((base + (Math.random() - 0.5) * 0.8).toFixed(2));
      });

      setLatency(prev => {
        const base = isStressMode ? 2.8 : 1.4;
        return Number((base + (Math.random() - 0.5) * 0.3).toFixed(1));
      });

      setPowerWatts(prev => {
        const base = isStressMode ? 620 : 385;
        return Math.floor(base + (Math.random() - 0.5) * 25);
      });

      setPacketCount(prev => prev + Math.floor(Math.random() * 850 + 400));

      // Append live logs
      const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
      const events = isStressMode
        ? [
            `[${timestamp}] [STRESS] Node ${product.sku}: PCIe Lane #04 saturation at 94.8%`,
            `[${timestamp}] [FAN] PWM curve adjusted to 88% duty cycle (${fanRpm} RPM)`,
            `[${timestamp}] [TEMP] Core die temperature reached ${temp}°C - Thermal budget nominal`
          ]
        : [
            `[${timestamp}] [HEARTBEAT] Node ${product.sku} online · Accra Spine Cluster`,
            `[${timestamp}] [METRICS] Throughput ${throughput} Gbps · Frame drop rate: 0.000%`,
            `[${timestamp}] [SYNC] Telemetry frame dispatched to DeRoyalTech Central CRM`
          ];

      const newLog = events[Math.floor(Math.random() * events.length)];
      setLogs(prev => [newLog, ...prev.slice(0, 14)]);
    }, 800);

    return () => clearInterval(interval);
  }, [product, isPlaying, isStressMode, temp, fanRpm, throughput]);

  if (!product) return null;

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(product);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto text-white">
        
        {/* Modal Top Control Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-blue-400 font-bold bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                  {product.sku}
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  LIVE TELEMETRY DEMO
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
                {product.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Play / Pause Toggle */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title={isPlaying ? "Pause Telemetry Stream" : "Resume Telemetry Stream"}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
              <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Stream'}</span>
            </button>

            {/* Stress Test Toggle */}
            <button
              type="button"
              onClick={() => setIsStressMode(!isStressMode)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                isStressMode
                  ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-lg shadow-red-500/20 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isStressMode ? '100% Load Active' : 'Simulate Stress'}</span>
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Telemetry Stage & HUD Canvas */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Main Visual Display: Product Image + HUD Telemetry Overlay */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 h-64 sm:h-72 flex items-center justify-center group">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* Product Hardware Photo */}
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="max-h-[85%] max-w-[85%] object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105"
            />

            {/* HUD Top Left Diagnostic Badge */}
            <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
              <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-[11px] font-mono flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span className="text-slate-300">NODE STATUS:</span>
                <span className="text-emerald-400 font-bold">HEALTHY (0 ERRORS)</span>
              </div>
              <div className="px-2.5 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-400">
                FIRMWARE: DRT-OS v4.2.8-LTS
              </div>
            </div>

            {/* HUD Top Right Telemetry Counters */}
            <div className="absolute top-3 right-3 flex flex-col items-end gap-1 z-10">
              <div className="px-3 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-[11px] font-mono text-right">
                <span className="text-slate-400 block text-[9px] uppercase">Packets Processed</span>
                <span className="font-extrabold text-blue-400">{packetCount.toLocaleString()}</span>
              </div>
            </div>

            {/* HUD Bottom Bar Waveform */}
            <div className="absolute bottom-3 left-3 right-3 px-4 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 text-[10px]">POWER:</span>
                  <span className="font-bold text-amber-400">{powerWatts}W</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 text-[10px]">LATENCY:</span>
                  <span className="font-bold text-sky-400">{latency}ms</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                  <span className="text-slate-400 text-[10px]">UPTIME SLA:</span>
                  <span className="font-bold text-emerald-400">99.999%</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-blue-400">
                <Wifi className="w-3 h-3 animate-pulse" />
                <span>ACCRA CENTRAL GATEWAY</span>
              </div>
            </div>
          </div>

          {/* 4 Telemetry Gauge Meters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 1. Core Temperature */}
            <div className={`p-4 rounded-2xl border transition-all ${
              temp > 70 
                ? 'bg-red-950/20 border-red-500/50' 
                : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Core Temperature</span>
                <Gauge className={`w-4 h-4 ${temp > 70 ? 'text-red-400' : 'text-blue-400'}`} />
              </div>
              <div className="text-2xl font-black font-mono tracking-tight text-white flex items-baseline gap-1">
                <span className={temp > 70 ? 'text-red-400' : 'text-white'}>{temp}</span>
                <span className="text-xs text-slate-400 font-sans">°C</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${temp > 70 ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(100, (temp / 90) * 100)}%` }}
                />
              </div>
            </div>

            {/* 2. Fan RPM Tachometer */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Active Cooling</span>
                <RotateCcw className="w-4 h-4 text-emerald-400 animate-spin" />
              </div>
              <div className="text-2xl font-black font-mono tracking-tight text-white flex items-baseline gap-1">
                <span>{fanRpm.toLocaleString()}</span>
                <span className="text-xs text-slate-400 font-sans">RPM</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, (fanRpm / 6000) * 100)}%` }}
                />
              </div>
            </div>

            {/* 3. Optical Throughput */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Data Throughput</span>
                <Activity className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-black font-mono tracking-tight text-white flex items-baseline gap-1">
                <span>{throughput}</span>
                <span className="text-xs text-slate-400 font-sans">Gbps</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-sky-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, (throughput / 20) * 100)}%` }}
                />
              </div>
            </div>

            {/* 4. Power & Voltage Draw */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Power Draw</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black font-mono tracking-tight text-white flex items-baseline gap-1">
                <span>{powerWatts}</span>
                <span className="text-xs text-slate-400 font-sans">Watts</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, (powerWatts / 750) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Real-time Diagnostic Terminal Logs */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span className="font-mono font-bold text-slate-300">Live Hardware Telemetry Stream</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                Listening: /dev/telemetry/{product.sku.toLowerCase()}
              </span>
            </div>

            <div className="font-mono text-[11px] text-slate-400 space-y-1 h-28 overflow-y-auto scrollbar-none">
              {logs.length > 0 ? (
                logs.map((log, i) => (
                  <div key={i} className="leading-relaxed hover:text-white transition-colors truncate">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-slate-600 italic">Initializing telemetry socket handshake...</div>
              )}
            </div>
          </div>

          {/* Product Specifications & Quick Add Footer */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 font-mono">Enterprise Supply & Warranty</div>
              <div className="text-lg font-black font-mono text-white mt-0.5">
                {formatPrice(product.price)}
                <span className="text-xs font-normal text-slate-400 font-sans ml-2">
                  (Includes on-site Accra setup & 3-Year Warranty)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleAdd}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Hardware Quote Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
