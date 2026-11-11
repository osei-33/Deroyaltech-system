import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause, 
  Volume2, 
  Trash2, 
  Check, 
  Sparkles, 
  FileAudio, 
  Clock, 
  User, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { ProjectMilestone, MilestoneAudioNote } from '../../types/index.ts';

interface MilestoneVoiceNoteRecorderProps {
  projectId: string;
  milestone: ProjectMilestone;
}

export const MilestoneVoiceNoteRecorder: React.FC<MilestoneVoiceNoteRecorderProps> = ({
  projectId,
  milestone
}) => {
  const { addMilestoneAudioNote, clientUser, openChatWithContext } = useSite();

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingNoteId, setPlayingNoteId] = useState<string | null>(null);
  const [recorderError, setRecorderError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showRecorderPanel, setShowRecorderPanel] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const speechRecognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const noteAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    setRecorderError(null);
    setAudioUrl(null);
    setTranscript('');
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    try {
      // 1. Microphone capture
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioUrl(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);

        // Stop all media tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);

      // Start timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(sec => sec + 1);
      }, 1000);

      // 2. Real-time Speech-to-Text Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        speechRecognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        let accumulatedTranscript = '';
        recognition.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              accumulatedTranscript += event.results[i][0].transcript + ' ';
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          setTranscript((accumulatedTranscript + interim).trim());
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition warning:', err);
        };

        recognition.start();
      } else {
        setTranscript('(Voice note recorded. Speech recognition is not supported in this browser version, but your voice note audio will be saved and reviewed by our engineers.)');
      }
    } catch (err: any) {
      console.error('Microphone access error:', err);
      setRecorderError('Microphone permission denied or device unavailable. Please allow microphone access to record audio.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsRecording(false);
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsRecording(false);
    setAudioUrl(null);
    setTranscript('');
    setRecordingSeconds(0);
  };

  const togglePreviewPlay = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSaveAudioNote = () => {
    if (!audioUrl && !transcript.trim()) return;

    addMilestoneAudioNote(projectId, milestone.id, {
      author: clientUser?.fullName || 'Verified Client',
      transcript: transcript.trim() || 'Client Voice Note',
      audioUrl: audioUrl || undefined,
      durationSeconds: recordingSeconds > 0 ? recordingSeconds : 10
    });

    setSaveSuccess(true);
    setAudioUrl(null);
    setTranscript('');
    setRecordingSeconds(0);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowRecorderPanel(false);
    }, 2000);
  };

  const playSavedNote = (noteId: string, url?: string) => {
    if (!url) return;
    if (playingNoteId === noteId) {
      noteAudioPlayerRef.current?.pause();
      setPlayingNoteId(null);
    } else {
      if (noteAudioPlayerRef.current) {
        noteAudioPlayerRef.current.src = url;
        noteAudioPlayerRef.current.play();
        setPlayingNoteId(noteId);
      }
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const audioNotes = milestone.audioNotes || [];

  return (
    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
      {/* Hidden Audio Players for Playback */}
      {audioUrl && (
        <audio
          ref={audioPlayerRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}
      <audio
        ref={noteAudioPlayerRef}
        onEnded={() => setPlayingNoteId(null)}
        className="hidden"
      />

      {/* Voice-to-Text Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold font-mono text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <FileAudio className="w-4 h-4" />
              <span>Client Voice-to-Text Telemetry Notes</span>
            </span>
            {audioNotes.length > 0 && (
              <span className="px-2 py-0.2 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold font-mono">
                {audioNotes.length} note{audioNotes.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Record audio feedback with live speech transcription directly appended to this milestone.
          </p>
        </div>

        {!showRecorderPanel && (
          <button
            type="button"
            onClick={() => setShowRecorderPanel(true)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:shadow self-start sm:self-auto"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Record Voice Note</span>
          </button>
        )}
      </div>

      {/* Recorder Interactive Modal / Drawer */}
      {showRecorderPanel && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-blue-500/30 shadow-inner space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-slate-400'}`} />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isRecording ? 'Recording Voice-to-Text...' : audioUrl ? 'Voice Note Captured' : 'Ready to Record'}
              </span>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                {formatTimer(recordingSeconds)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                cancelRecording();
                setShowRecorderPanel(false);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Close
            </button>
          </div>

          {recorderError && (
            <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{recorderError}</span>
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {!isRecording && !audioUrl && (
              <button
                type="button"
                onClick={startRecording}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
              >
                <Mic className="w-4 h-4 animate-pulse" />
                <span>Start Microphone</span>
              </button>
            )}

            {isRecording && (
              <button
                type="button"
                onClick={stopRecording}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop & Process Audio</span>
              </button>
            )}

            {audioUrl && !isRecording && (
              <>
                <button
                  type="button"
                  onClick={togglePreviewPlay}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause Audio' : 'Listen Preview'}</span>
                </button>

                <button
                  type="button"
                  onClick={startRecording}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  Re-record
                </button>
              </>
            )}

            {(isRecording || audioUrl) && (
              <button
                type="button"
                onClick={cancelRecording}
                className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                title="Discard"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Real-Time Live Speech Transcription Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Live Voice-to-Text Transcription (Editable):</span>
              </span>
              <span>{transcript.length} chars</span>
            </div>
            <textarea
              rows={3}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={isRecording ? "Listening to your voice... Speak clearly into your microphone..." : "Your spoken words will appear here in real time. You can also edit this text prior to saving."}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
            />
          </div>

          {/* Save Button */}
          {(audioUrl || transcript.trim()) && !isRecording && (
            <div className="flex items-center justify-between pt-1">
              {saveSuccess ? (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  <span>Audio note saved to milestone!</span>
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">
                  Ready to append to <strong>{milestone.title}</strong>
                </span>
              )}

              <button
                type="button"
                onClick={handleSaveAudioNote}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Append Note to Milestone</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* List of Appended Audio Notes */}
      {audioNotes.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
            Appended Audio Logs & Transcripts ({audioNotes.length})
          </span>

          <div className="space-y-2">
            {audioNotes.map((note) => (
              <div 
                key={note.id}
                className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/70 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-[10px]">
                      {note.author.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block leading-none">
                        {note.author}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {note.audioUrl && (
                      <button
                        type="button"
                        onClick={() => playSavedNote(note.id, note.audioUrl)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors ${
                          playingNoteId === note.id
                            ? 'bg-amber-500 text-white'
                            : 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100'
                        }`}
                      >
                        {playingNoteId === note.id ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>{playingNoteId === note.id ? 'Playing...' : 'Play Voice'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => openChatWithContext(`[Voice Note on Milestone "${milestone.title}"]: ${note.transcript}`, projectId)}
                      className="p-1 rounded text-slate-400 hover:text-blue-500"
                      title="Send to Live Chat Desk"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  <p className="italic">"{note.transcript}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
