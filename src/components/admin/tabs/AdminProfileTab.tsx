import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  PenTool, 
  Upload, 
  Type, 
  Trash2, 
  Save, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  FileText, 
  Building, 
  Mail, 
  Phone, 
  Lock, 
  Award,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { useSite } from '../../../context/SiteContext.tsx';
import { AdminProfile } from '../../../types/index.ts';

export const AdminProfileTab: React.FC = () => {
  const { config, updateConfig, clientUser } = useSite();

  const [profileForm, setProfileForm] = useState<AdminProfile>(() => {
    return config.adminProfile || {
      fullName: clientUser?.fullName || 'Emmanuel Osei',
      role: 'Principal Systems Architect & Lead Engineer',
      email: clientUser?.email || 'emmanuel.osei@deroyaltech.com',
      phone: config.contact?.phonePrimary || '+233 (0) 30 294 8821',
      department: 'Cloud Infrastructure & Enterprise Systems',
      clearanceLevel: 'Level 4: Executive Root Administrator',
      signatureType: 'draw',
      signatureFont: 'font-dancing',
      bio: 'Lead Principal Systems Architect overseeing high-availability cloud deployments, hardware telemetry integration, and official corporate SLA authorizations across West Africa.'
    };
  });

  const [activeSigTab, setActiveSigTab] = useState<'draw' | 'upload' | 'type'>(
    profileForm.signatureType || 'draw'
  );
  const [penColor, setPenColor] = useState<string>('#1e3a8a'); // Executive blue
  const [penSize, setPenSize] = useState<number>(3);
  const [typedName, setTypedName] = useState(profileForm.fullName);
  const [selectedFont, setSelectedFont] = useState<'cursive-1' | 'cursive-2' | 'cursive-3' | 'cursive-4'>('cursive-1');
  const [savedToast, setSavedToast] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string>(profileForm.signatureDataUrl || '');

  // Canvas Drawing Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialize Canvas
  useEffect(() => {
    if (activeSigTab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penSize;
      }
    }
  }, [activeSigTab, penColor, penSize]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      setPreviewDataUrl(dataUrl);
      setProfileForm(prev => ({
        ...prev,
        signatureType: 'draw',
        signatureDataUrl: dataUrl
      }));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setPreviewDataUrl('');
    setProfileForm(prev => ({ ...prev, signatureDataUrl: undefined }));
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreviewDataUrl(result);
      setProfileForm(prev => ({
        ...prev,
        signatureType: 'upload',
        signatureDataUrl: result
      }));
    };
    reader.readAsDataURL(file);
  };

  // Generate SVG Calligraphy Data URL from text
  const applyTypedSignature = (fontChoice: string) => {
    const name = typedName || profileForm.fullName || 'Authorized Signatory';
    
    // Create an offscreen SVG to convert to clean data URL
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="120" viewBox="0 0 400 120">
        <text x="20" y="75" font-family="${
          fontChoice === 'cursive-1' ? 'Brush Script MT, cursive' :
          fontChoice === 'cursive-2' ? 'Lucida Handwriting, cursive' :
          fontChoice === 'cursive-3' ? 'Segoe Script, cursive' : 'Snell Roundhand, cursive'
        }" font-size="38" font-style="italic" fill="${penColor}">
          ${name}
        </text>
      </svg>
    `;
    const encoded = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
    setPreviewDataUrl(encoded);
    setProfileForm(prev => ({
      ...prev,
      signatureType: 'type',
      signatureDataUrl: encoded,
      signatureFont: fontChoice
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProfile: AdminProfile = {
      ...profileForm,
      signatureType: activeSigTab,
      signatureDataUrl: previewDataUrl || profileForm.signatureDataUrl,
      lastUpdated: new Date().toISOString()
    };

    // Also update letterhead signatory info so letters match admin credentials
    updateConfig({
      adminProfile: updatedProfile,
      letterhead: {
        ...(config.letterhead || {
          companyName: 'DeRoyalTech Systems Limited',
          tagline: 'Enterprise Cloud Infrastructure · Custom CRM · Hardware Telemetry',
          physicalAddress: 'Suite 402, Standard Chartered Building, Airport City & Spintex Tech Corridor, Accra, Ghana',
          phone: config.contact?.phonePrimary || '+233 (0) 30 294 8821',
          email: config.contact?.emailGeneral || 'info@deroyaltech.com',
          website: 'www.deroyaltech.com',
          regNumber: 'RC-2024-8921',
          sealText: 'AUTHENTICATED · DEROYALTECH SYSTEMS · ACCRA, GHANA'
        }),
        signatureDataUrl: previewDataUrl || profileForm.signatureDataUrl
      }
    });

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              EXECUTIVE CREDENTIALS
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Certified Lead Architect</span>
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            Admin Profile & Official Signature Studio
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure your executive profile credentials and draw, upload, or generate your official digital signature to authenticate DeRoyalTech official letters and contracts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveProfile}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile & Signature</span>
        </button>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Section 1: Executive Identity Details */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <User className="w-4 h-4 text-blue-500" />
            <span>Executive Identity & Signatory Authority</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Full Legal Name (Signatory)
              </label>
              <input
                type="text"
                required
                value={profileForm.fullName}
                onChange={(e) => {
                  setProfileForm({ ...profileForm, fullName: e.target.value });
                  setTypedName(e.target.value);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Official Corporate Designation / Title
              </label>
              <input
                type="text"
                required
                value={profileForm.role}
                onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Official Business Email
              </label>
              <input
                type="email"
                required
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Direct Telephony / Dispatch Phone
              </label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Corporate Department
              </label>
              <input
                type="text"
                value={profileForm.department}
                onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Security Clearance Level
              </label>
              <input
                type="text"
                value={profileForm.clearanceLevel || 'Level 4: Root Administrator'}
                onChange={(e) => setProfileForm({ ...profileForm, clearanceLevel: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Official Signature Studio */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PenTool className="w-5 h-5 text-indigo-500" />
                <span>Official Digital Signature Studio</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Draw your signature on the pad, upload an image of your signature, or pick an executive calligraphy style.
              </p>
            </div>

            {/* Signature Mode Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveSigTab('draw')}
                className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeSigTab === 'draw'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Draw on Canvas</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSigTab('upload')}
                className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeSigTab === 'upload'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Signature</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSigTab('type')}
                className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeSigTab === 'type'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Calligraphy Type</span>
              </button>
            </div>
          </div>

          {/* Mode 1: Interactive Canvas Signature */}
          {activeSigTab === 'draw' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Pen Ink Color Picker */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-semibold">Ink Color:</span>
                  {[
                    { label: 'Executive Blue', color: '#1e3a8a' },
                    { label: 'Deep Indigo', color: '#312e81' },
                    { label: 'Classic Obsidian', color: '#0f172a' },
                    { label: 'Emerald Seal', color: '#065f46' }
                  ].map(c => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setPenColor(c.color)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        penColor === c.color ? 'scale-125 border-blue-500 shadow-md' : 'border-slate-300 dark:border-slate-700'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                    />
                  ))}
                </div>

                {/* Stroke Width Slider */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-semibold">Stroke:</span>
                  <input
                    type="range"
                    min="1.5"
                    max="6"
                    step="0.5"
                    value={penSize}
                    onChange={(e) => setPenSize(Number(e.target.value))}
                    className="w-24 accent-blue-600"
                  />
                  <span className="font-mono text-slate-400 text-[11px]">{penSize}px</span>
                </div>

                {/* Clear Pad */}
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition-colors flex items-center gap-1.5 font-semibold text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Pad</span>
                </button>
              </div>

              {/* Drawing Canvas Area */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-2 bg-slate-50 dark:bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={180}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full max-w-2xl h-44 bg-white dark:bg-slate-900 rounded-xl cursor-crosshair touch-none shadow-inner border border-slate-200 dark:border-slate-800"
                />

                {!hasDrawn && !previewDataUrl && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 text-xs space-y-1">
                    <PenTool className="w-5 h-5 text-slate-400" />
                    <span>Sign with mouse, trackpad, or touch pen inside this box</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode 2: Upload Signature Image */}
          {activeSigTab === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 bg-slate-50 dark:bg-slate-950 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                    Upload Scanned Signature Image
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    PNG, JPG, SVG, or WebP (transparent background recommended)
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Choose Signature Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Mode 3: Executive Calligraphy Type Generator */}
          {activeSigTab === 'type' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Type Name for Signature
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => {
                    setTypedName(e.target.value);
                  }}
                  placeholder="Enter full name..."
                  className="w-full max-w-md px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Calligraphy Font Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { id: 'cursive-1', label: 'Executive Script', preview: typedName || profileForm.fullName, style: 'font-serif italic text-2xl font-bold' },
                  { id: 'cursive-2', label: 'Classic Parchment', preview: typedName || profileForm.fullName, style: 'font-mono italic text-xl font-bold' },
                  { id: 'cursive-3', label: 'Modern Architectural', preview: typedName || profileForm.fullName, style: 'italic tracking-wider text-2xl font-extrabold' },
                  { id: 'cursive-4', label: 'Formal Chancery', preview: typedName || profileForm.fullName, style: 'font-serif tracking-tight text-2xl italic font-semibold' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setSelectedFont(f.id as any);
                      applyTypedSignature(f.id);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedFont === f.id
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                      <span className="font-mono font-bold uppercase">{f.label}</span>
                      {selectedFont === f.id && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    </div>
                    <div className={`${f.style} text-indigo-900 dark:text-indigo-300 py-1 border-b border-slate-300 dark:border-slate-700`}>
                      {f.preview}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Official Letter Document Signature Preview Block */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                <span>Live Official Letter Signature Preview</span>
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready for Official Correspondence</span>
              </span>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 max-w-sm">
              <div className="text-xs text-slate-400">Yours faithfully,</div>
              
              {/* Render Signature Image or Font */}
              <div className="h-16 flex items-center">
                {previewDataUrl ? (
                  <img 
                    src={previewDataUrl} 
                    alt="Official Signature" 
                    className="max-h-14 max-w-full object-contain filter drop-shadow-sm" 
                  />
                ) : (
                  <div className="font-serif italic text-2xl text-indigo-900 dark:text-indigo-300 font-bold border-b border-slate-400 pb-1">
                    {profileForm.fullName}
                  </div>
                )}
              </div>

              <div className="text-xs font-bold text-slate-900 dark:text-white pt-1">
                {profileForm.fullName}
              </div>
              <div className="text-[11px] text-slate-500">
                {profileForm.role}
              </div>
              <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">
                DeRoyalTech Systems Limited · Accra, Ghana
              </div>
            </div>
          </div>
        </div>

        {/* Floating Save Confirmation */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Signature Settings</span>
          </button>
        </div>
      </form>

      {/* Success Notification Toast */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-emerald-950 text-white rounded-xl shadow-2xl text-xs flex items-center gap-2 border border-emerald-700 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">Admin profile & official signature saved successfully!</span>
        </div>
      )}
    </div>
  );
};
