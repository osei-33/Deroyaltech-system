import React, { useState, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  ExternalLink, 
  CheckCircle2, 
  Film,
  Sparkles
} from 'lucide-react';
import { CompletedProject } from '../types/index.ts';

interface VideoTheaterModalProps {
  project: CompletedProject | null;
  onClose: () => void;
}

export const VideoTheaterModal: React.FC<VideoTheaterModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoError, setVideoError] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSpeedChange = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/95 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
              MP4 Project Overview Theater
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-xs text-blue-400 font-medium truncate max-w-[280px]">
              {project.client}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close video player"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video & Info Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-black">
          {/* Video Player Column */}
          <div className="lg:col-span-8 relative bg-slate-950 flex flex-col justify-center min-h-[360px] sm:min-h-[460px]">
            {!videoError && project.videoUrl ? (
              <div className="relative aspect-video w-full flex items-center justify-center bg-black">
                <video
                  ref={videoRef}
                  src={project.videoUrl}
                  poster={project.videoThumbnail}
                  autoPlay
                  playsInline
                  loop
                  muted={isMuted}
                  onError={() => setVideoError(true)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-contain"
                />

                {/* Video HUD Overlays */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="px-2.5 py-1 text-[11px] font-mono font-semibold text-white bg-slate-950/80 backdrop-blur-md rounded border border-white/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE MP4 STREAM · 1080p
                  </span>
                </div>

                {/* Bottom Custom Playback Bar */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between gap-3 text-white">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                      className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>

                    <button
                      onClick={toggleMute}
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                      className="p-2 text-slate-300 hover:text-white transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-400 text-[11px] hidden sm:inline">Speed:</span>
                    {[1, 1.25, 1.5].map(spd => (
                      <button
                        key={spd}
                        onClick={() => handleSpeedChange(spd)}
                        className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                          playbackSpeed === spd
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}

                    <button
                      onClick={toggleFullscreen}
                      aria-label="Fullscreen"
                      className="p-2 text-slate-300 hover:text-white ml-2 transition-colors"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Fallback Interactive Screen Walkthrough Simulation */
              <div className="aspect-video w-full p-8 flex flex-col justify-center items-center text-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center mb-4 text-blue-400 shadow-lg">
                  <Film className="w-8 h-8" />
                </div>
                
                <h3 className="text-lg font-bold tracking-tight text-white mb-1">
                  High-Definition Walkthrough Simulation
                </h3>
                <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6">
                  Interactive screen demonstration recorded live from {project.client}'s production cluster in {project.clientCountry}.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <span>Visit Live Product Direct</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      setVideoError(false);
                      setIsPlaying(true);
                    }}
                    className="px-4 py-2.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Retry Video Stream
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Project Details Sidebar */}
          <div className="lg:col-span-4 p-6 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between space-y-6 text-slate-200">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-mono text-blue-400 uppercase font-semibold">
                  {project.category.toUpperCase()} SOLUTION · {project.completionDate}
                </span>
                <h3 className="text-xl font-extrabold text-white tracking-tight mt-1">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {project.summary}
                </p>
              </div>

              {/* Verified Badge */}
              <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-900/60 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300">
                  {project.verifiedDeliveryBadge}
                </span>
              </div>

              {/* Measured Metrics */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Delivered Performance Metrics:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {project.metrics.map((m, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-center">
                      <div className="text-sm font-extrabold font-mono text-blue-400">{m.value}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Engineering Deliverables:
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {project.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visit Live Action */}
            <div className="pt-4 border-t border-slate-800">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <span>Visit Live Client Product</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <span className="text-[10px] text-slate-500 block text-center mt-2 font-mono">
                {project.liveUrl}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
