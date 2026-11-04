import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Database, 
  Cloud, 
  Radio, 
  ArrowRight, 
  Check, 
  RefreshCw, 
  Zap, 
  Activity,
  Layers,
  Sliders,
  Code
} from 'lucide-react';
import { WorkflowPacket } from '../types/index.ts';

export const WorkflowSimulator: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<'RFID' | 'IoT_Sensor' | 'POS_Terminal' | 'Mobile_BLE'>('RFID');
  const [packets, setPackets] = useState<WorkflowPacket[]>([
    {
      id: 'PKT-84920',
      timestamp: '01:29:44.102',
      sourceDevice: 'DeRoyalTech Handheld RFID (Zone B)',
      deviceType: 'RFID',
      payloadData: '{"sku":"DRT-WS-9950X","rfidTag":"E28011606000021A","palletId":"PLT-4091","weightKg":32.4}',
      edgeGatewayStatus: 'Decrypted',
      cloudStatus: 'Processed via K8s',
      crmStatus: 'Pipeline Updated',
      latencyMs: 24
    },
    {
      id: 'PKT-84921',
      timestamp: '01:29:45.319',
      sourceDevice: 'CNC Spindle Thermal Sensor #4',
      deviceType: 'IoT_Sensor',
      payloadData: '{"tempC":74.2,"vibrationMmS":3.8,"spindleRpm":18000,"healthScore":98.2}',
      edgeGatewayStatus: 'Decrypted',
      cloudStatus: 'Streamed to Kafka',
      crmStatus: 'Telemetry Logged',
      latencyMs: 18
    }
  ]);

  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedPacket, setSelectedPacket] = useState<WorkflowPacket | null>(packets[0]);
  const [totalProcessedCount, setTotalProcessedCount] = useState<number>(1429);
  const [lastLatency, setLastLatency] = useState<number>(24);

  const triggerPacket = (type: 'RFID' | 'IoT_Sensor' | 'POS_Terminal' | 'Mobile_BLE') => {
    setSelectedDevice(type);
    setIsSimulating(true);
    setActiveStep(1);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    const pktId = `PKT-${Math.floor(10000 + Math.random() * 90000)}`;

    let deviceLabel = '';
    let payload = '';
    let crmAction: 'Pipeline Updated' | 'Telemetry Logged' | 'Order Triggered' = 'Pipeline Updated';
    const simulatedLatency = Math.floor(16 + Math.random() * 22);

    switch (type) {
      case 'RFID':
        deviceLabel = 'DeRoyalTech Handheld 2D/RFID Scanner #12';
        payload = JSON.stringify({
          eventType: 'WAREHOUSE_SCAN',
          rfidUHF: 'E28069000000002199',
          sku: 'DRT-WS-9950X',
          destinationBay: 'Dock-East-04',
          operatorId: 'ENG-882'
        }, null, 2);
        crmAction = 'Pipeline Updated';
        break;
      case 'IoT_Sensor':
        deviceLabel = 'Industrial Telemetry Hub (Modbus RTU)';
        payload = JSON.stringify({
          eventType: 'TELEMETRY_SAMPLE',
          temperatureCelsius: 72.8,
          bearingVibrationMmS: 2.9,
          pressureBar: 6.4,
          status: 'NORMAL'
        }, null, 2);
        crmAction = 'Telemetry Logged';
        break;
      case 'POS_Terminal':
        deviceLabel = 'OmniPay Hardened POS Terminal #3';
        payload = JSON.stringify({
          eventType: 'B2B_CHECKOUT',
          terminalId: 'DRT-POS-450-X',
          authAmountUSD: 4850.00,
          paymentMethod: 'EMV_CHIP',
          crmAccountId: 'ACC-8910-CORP'
        }, null, 2);
        crmAction = 'Order Triggered';
        break;
      case 'Mobile_BLE':
        deviceLabel = 'Field Tech iPad + BLE Ultrasonic Probe';
        payload = JSON.stringify({
          eventType: 'ULTRASOUND_INSPECTION',
          aircraftTailNo: 'N940DT',
          thicknessMm: 14.82,
          toleranceVariancePct: 0.12,
          signedCertHash: '0x8f3c4e...91b'
        }, null, 2);
        crmAction = 'Pipeline Updated';
        break;
    }

    // Step 2: Edge Gateway
    setTimeout(() => {
      setActiveStep(2);
    }, 400);

    // Step 3: Cloud Infrastructure
    setTimeout(() => {
      setActiveStep(3);
    }, 850);

    // Step 4: CRM Commit
    setTimeout(() => {
      setActiveStep(4);
      const newPacket: WorkflowPacket = {
        id: pktId,
        timestamp: timeStr,
        sourceDevice: deviceLabel,
        deviceType: type,
        payloadData: payload,
        edgeGatewayStatus: 'Decrypted',
        cloudStatus: 'Processed via K8s',
        crmStatus: crmAction,
        latencyMs: simulatedLatency
      };

      setPackets(prev => [newPacket, ...prev.slice(0, 9)]);
      setSelectedPacket(newPacket);
      setTotalProcessedCount(c => c + 1);
      setLastLatency(simulatedLatency);
      setIsSimulating(false);
    }, 1300);
  };

  return (
    <section id="workflow-hub" className="py-20 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-2">
            Interactive Architecture Demonstration
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ textWrap: 'balance' }}>
            Hardware Integration & Real-Time Data Pipeline
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            See how DeRoyalTech bridges physical warehouse peripherals, edge computing gateways, cloud Kubernetes clusters, and bespoke CRM records in under 35 milliseconds.
          </p>
        </div>

        {/* Live Simulation Controls Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Select Hardware Peripheral to Trigger:
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  disabled={isSimulating}
                  onClick={() => triggerPacket('RFID')}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                    selectedDevice === 'RFID'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>RFID Warehouse Scan</span>
                </button>

                <button
                  disabled={isSimulating}
                  onClick={() => triggerPacket('IoT_Sensor')}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                    selectedDevice === 'IoT_Sensor'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Industrial IoT Telemetry</span>
                </button>

                <button
                  disabled={isSimulating}
                  onClick={() => triggerPacket('POS_Terminal')}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                    selectedDevice === 'POS_Terminal'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Smart POS Checkout</span>
                </button>

                <button
                  disabled={isSimulating}
                  onClick={() => triggerPacket('Mobile_BLE')}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                    selectedDevice === 'Mobile_BLE'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Mobile Field Inspector</span>
                </button>
              </div>
            </div>

            {/* Live Metrics */}
            <div className="flex items-center gap-6 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Telemetry Latency</span>
                <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                  {lastLatency}ms
                </span>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Total Events</span>
                <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                  {totalProcessedCount}
                </span>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Integrity</span>
                <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                  100% Zero-Loss
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual 4-Stage Architectural Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Stage 1: Physical Peripherals */}
          <div className={`p-5 rounded-xl border transition-all ${
            activeStep === 1 || (!isSimulating && activeStep === 0)
              ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-600 dark:border-blue-500 shadow-sm'
              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-semibold text-slate-400">01. CAPTURE</span>
              <Radio className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Physical Peripherals</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Industrial RFID scanners, optical sensors, BLE probes, or biometric POS hardware capture operational events.
            </p>
            <div className="mt-3 text-[11px] font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1">
              {activeStep === 1 ? (
                <span className="flex items-center gap-1 font-semibold animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Emitting Packet...
                </span>
              ) : (
                <span className="text-slate-500 dark:text-slate-400">Ready for scan</span>
              )}
            </div>
          </div>

          {/* Stage 2: DeRoyalTech Edge Gateway */}
          <div className={`p-5 rounded-xl border transition-all ${
            activeStep === 2
              ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-600 dark:border-blue-500 shadow-sm'
              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-semibold text-slate-400">02. EDGE ROUTING</span>
              <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">1U Edge Gateway</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Local store-and-forward caching, hardware TPM encryption, Modbus/MQTT ingestion, and sub-5ms protocol validation.
            </p>
            <div className="mt-3 text-[11px] font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1">
              {activeStep === 2 ? (
                <span className="flex items-center gap-1 font-semibold animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Decrypting at Edge...
                </span>
              ) : (
                <span className="text-slate-500 dark:text-slate-400">Low-latency buffer active</span>
              )}
            </div>
          </div>

          {/* Stage 3: Multi-Cloud Streaming */}
          <div className={`p-5 rounded-xl border transition-all ${
            activeStep === 3
              ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-600 dark:border-blue-500 shadow-sm'
              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-semibold text-slate-400">03. CLOUD DEVOPS</span>
              <Cloud className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Kubernetes / Kafka Stream</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              High-throughput containerized microservices process telemetry payloads with zero packet degradation.
            </p>
            <div className="mt-3 text-[11px] font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1">
              {activeStep === 3 ? (
                <span className="flex items-center gap-1 font-semibold animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Stream processing...
                </span>
              ) : (
                <span className="text-slate-500 dark:text-slate-400">Multi-region cluster active</span>
              )}
            </div>
          </div>

          {/* Stage 4: Custom CRM & ERP Integration */}
          <div className={`p-5 rounded-xl border transition-all ${
            activeStep === 4
              ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-600 dark:border-blue-500 shadow-sm'
              : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-semibold text-slate-400">04. CUSTOM CRM</span>
              <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Custom CRM & Action</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Real-time dispatch orders, automated sales stage advancement, client notification, and inventory ledger commit.
            </p>
            <div className="mt-3 text-[11px] font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1">
              {activeStep === 4 ? (
                <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3.5 h-3.5" /> CRM Record Synchronized
                </span>
              ) : (
                <span className="text-slate-500 dark:text-slate-400">Real-time webhook sync</span>
              )}
            </div>
          </div>
        </div>

        {/* Live Packet Ledger & Payload Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Recent Packets Stream Table */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Live Ingestion Log</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Auto-updating
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-mono text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Packet ID</th>
                    <th className="py-2.5 px-4 font-semibold">Source Device</th>
                    <th className="py-2.5 px-4 font-semibold">CRM Action</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {packets.map((pkt) => {
                    const isSelected = selectedPacket?.id === pkt.id;
                    return (
                      <tr
                        key={pkt.id}
                        onClick={() => setSelectedPacket(pkt)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-50/70 dark:bg-blue-950/40 font-medium'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <td className="py-2.5 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                          {pkt.id}
                        </td>
                        <td className="py-2.5 px-4 truncate max-w-[200px]">
                          {pkt.sourceDevice}
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <span className="text-slate-800 dark:text-slate-200">
                            {pkt.crmStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {pkt.latencyMs}ms
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Packet Payload Inspector */}
          <div className="lg:col-span-5 bg-slate-900 rounded-xl border border-slate-800 text-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-300">
                <Code className="w-3.5 h-3.5 text-blue-400" />
                <span>Payload Inspector: {selectedPacket?.id || 'None'}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                {selectedPacket?.timestamp}
              </span>
            </div>

            {selectedPacket ? (
              <div className="space-y-3">
                <div className="text-xs text-slate-400">
                  <span className="text-slate-500">Source:</span> {selectedPacket.sourceDevice}
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-500 uppercase mb-1">
                    Telemetry JSON Payload (Decrypted at Edge):
                  </div>
                  <pre className="p-3 bg-slate-950 rounded-lg text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                    {selectedPacket.payloadData}
                  </pre>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Cloud Orchestration:</span>
                    <span className="text-slate-300 font-mono">{selectedPacket.cloudStatus}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">CRM Status:</span>
                    <span className="text-slate-300 font-mono">{selectedPacket.crmStatus}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500">
                Select a packet from the ledger to inspect data schema.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
