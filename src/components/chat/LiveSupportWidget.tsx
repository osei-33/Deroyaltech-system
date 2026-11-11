import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Headphones, 
  ShieldCheck, 
  Clock, 
  CheckCheck, 
  Sparkles, 
  ExternalLink,
  ChevronDown,
  Paperclip,
  User,
  ArrowRight,
  Mic,
  Square,
  Play,
  Pause,
  Image as ImageIcon,
  Film,
  Trash2,
  FileAudio
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { ChatMessage, ChatThread, ChatAttachment } from '../../types/index.ts';

export const LiveSupportWidget: React.FC = () => {
  const { 
    chatThreads, 
    activeThreadId, 
    setActiveThreadId, 
    sendClientMessage, 
    isChatWidgetOpen, 
    setIsChatWidgetOpen, 
    clientUser,
    trackedProjects,
    openTrackerForId
  } = useSite();

  const [messageText, setMessageText] = useState('');
  const [clientName, setClientName] = useState(clientUser?.fullName || '');
  const [clientEmail, setClientEmail] = useState(clientUser?.email || '');
  const [clientCompany, setClientCompany] = useState(clientUser?.company || '');
  const [subject, setSubject] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [viewHistory, setViewHistory] = useState(false);

  // Staged Attachment (Image or Video)
  const [stagedAttachment, setStagedAttachment] = useState<ChatAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Voice Note Recording State
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [voiceAudioUrl, setVoiceAudioUrl] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);

  const voiceMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const voiceTimerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync profile if clientUser changes
  useEffect(() => {
    if (clientUser) {
      if (!clientName) setClientName(clientUser.fullName);
      if (!clientEmail) setClientEmail(clientUser.email);
      if (!clientCompany) setClientCompany(clientUser.company);
    }
  }, [clientUser]);

  // Find active thread or client's thread
  const currentThread: ChatThread | undefined = activeThreadId 
    ? chatThreads.find(t => t.id === activeThreadId)
    : (clientUser ? chatThreads.find(t => t.clientEmail === clientUser.email) : chatThreads[0]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isChatWidgetOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentThread?.messages, isChatWidgetOpen]);

  // Count unread client messages across active threads
  const totalClientUnread = chatThreads.reduce((acc, t) => {
    if (clientUser && t.clientEmail === clientUser.email) {
      return acc + (t.unreadCountForClient || 0);
    }
    return acc;
  }, 0);

  // File Upload Handler (Image & Video)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      setChatError('Please upload an image (PNG, JPG, WebP) or video (MP4, WebM) file.');
      setTimeout(() => setChatError(null), 3500);
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setChatError('File size exceeds 25MB limit.');
      setTimeout(() => setChatError(null), 3500);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setStagedAttachment({
        type: isImage ? 'image' : 'video',
        url: reader.result as string,
        name: file.name,
        size: file.size
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Voice Note Recording Handlers
  const startVoiceRecording = async () => {
    setVoiceAudioUrl(null);
    setVoiceSeconds(0);
    voiceChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      voiceMediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          voiceChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(voiceChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const resultUrl = reader.result as string;
          setVoiceAudioUrl(resultUrl);
          setStagedAttachment({
            type: 'audio',
            url: resultUrl,
            name: `Voice_Note_${new Date().toLocaleTimeString().replace(/\s+/g, '')}.webm`,
            durationSeconds: voiceSeconds > 0 ? voiceSeconds : 5
          });
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecordingVoice(true);

      voiceTimerRef.current = setInterval(() => {
        setVoiceSeconds(sec => sec + 1);
      }, 1000);
    } catch (err) {
      console.warn('Voice recording error:', err);
      setChatError('Microphone access is required to record a voice note. Please allow permissions.');
      setTimeout(() => setChatError(null), 3500);
      setIsRecordingVoice(false);
    }
  };

  const stopVoiceRecording = () => {
    if (voiceMediaRecorderRef.current && voiceMediaRecorderRef.current.state === 'recording') {
      voiceMediaRecorderRef.current.stop();
    }
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    setIsRecordingVoice(false);
  };

  const cancelVoiceRecording = () => {
    if (voiceMediaRecorderRef.current && voiceMediaRecorderRef.current.state === 'recording') {
      voiceMediaRecorderRef.current.stop();
    }
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    setIsRecordingVoice(false);
    setVoiceAudioUrl(null);
    setVoiceSeconds(0);
  };

  const togglePlayAudio = (msgId: string, url: string) => {
    if (playingAudioId === msgId) {
      audioPlayerRef.current?.pause();
      setPlayingAudioId(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = url;
        audioPlayerRef.current.play();
        setPlayingAudioId(msgId);
      }
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim() && !stagedAttachment) return;

    const senderName = clientName.trim() || clientUser?.fullName || 'Prospective Partner';
    const senderEmail = clientEmail.trim() || clientUser?.email || 'guest@deroyaltech.com';

    sendClientMessage({
      threadId: currentThread?.id,
      clientName: senderName,
      clientEmail: senderEmail,
      clientCompany: clientCompany.trim(),
      message: messageText.trim() || (stagedAttachment ? `[Sent ${stagedAttachment.type.toUpperCase()} file: ${stagedAttachment.name || 'attachment'}]` : ''),
      subject: subject.trim() || (selectedProjectId ? `Project Inquiry: ${selectedProjectId}` : undefined),
      projectId: selectedProjectId || currentThread?.projectId,
      attachment: stagedAttachment || undefined
    });

    setMessageText('');
    setStagedAttachment(null);
    setVoiceAudioUrl(null);
    setVoiceSeconds(0);
  };

  const handleQuickPrompt = (prompt: string) => {
    setMessageText(prompt);
  };

  const [showVisitorPrompt, setShowVisitorPrompt] = useState(false);

  // Proactively alert visitors after 1.8 seconds if they need assistance
  useEffect(() => {
    const dismissed = sessionStorage.getItem('drt_visitor_chat_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setShowVisitorPrompt(true);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  // When chat opens, dismiss visitor prompt
  useEffect(() => {
    if (isChatWidgetOpen) {
      setShowVisitorPrompt(false);
    }
  }, [isChatWidgetOpen]);

  const dismissVisitorPrompt = () => {
    setShowVisitorPrompt(false);
    sessionStorage.setItem('drt_visitor_chat_dismissed', 'true');
  };

  const handlePromptOpenChat = () => {
    setShowVisitorPrompt(false);
    setIsChatWidgetOpen(true);
    sessionStorage.setItem('drt_visitor_chat_dismissed', 'true');
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <>
      {/* Visitor Proactive Support Prompt Alert Bubble */}
      {showVisitorPrompt && !isChatWidgetOpen && (
        <div className="fixed bottom-28 sm:bottom-24 right-3 sm:right-6 z-40 max-w-[320px] sm:max-w-[340px] bg-white dark:bg-slate-900 border border-blue-500/50 rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-3 duration-300 backdrop-blur-md">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">👋</span>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Need any assistance?</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h4>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Live Engineering Desk Online</span>
              </div>
            </div>
            <button
              onClick={dismissVisitorPrompt}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Dismiss chat note"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            If you find anything difficult on the site or have questions about our services, hardware quotations, or project milestones, you can chat directly with our engineers right now!
          </p>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handlePromptOpenChat}
              className="flex-1 py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/25 transition-all active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat with Agent</span>
            </button>
            <button
              type="button"
              onClick={dismissVisitorPrompt}
              className="py-1.5 px-2.5 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

      {/* Floating Launcher Trigger */}
      <div className="fixed bottom-18 sm:bottom-6 right-3 sm:right-6 z-40 flex items-center gap-2.5">
        {!isChatWidgetOpen && (
          <div 
            onClick={() => setIsChatWidgetOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-700/60 shadow-lg text-xs text-slate-200 cursor-pointer hover:border-blue-500/50 transition-all hover:scale-[1.02]"
          >
            <span className="font-medium">Live Engineering Support</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">ONLINE</span>
          </div>
        )}

        <button
          onClick={() => setIsChatWidgetOpen(!isChatWidgetOpen)}
          aria-label="Open DeRoyalTech Live Support"
          className="relative group p-3 sm:p-4 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 transition-all transform hover:scale-105 active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          {isChatWidgetOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-90" />
          ) : (
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
          )}

          {/* Unread badge */}
          {totalClientUnread > 0 && !isChatWidgetOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white dark:border-slate-900">
              {totalClientUnread}
            </span>
          )}
        </button>
      </div>

      {/* Live Support Modal / Flyout Window */}
      {isChatWidgetOpen && (
        <div className="fixed bottom-18 sm:bottom-24 right-2 sm:right-6 z-40 w-[calc(100vw-1rem)] sm:w-[410px] max-w-[430px] h-[520px] max-h-[76vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden backdrop-blur-lg animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-4 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
                  <Headphones className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-tight">DeRoyalTech Support</h3>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-1.5 py-0.2 rounded border border-blue-400/30">Live Desk</span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1">
                  <span>Engineers On Duty</span>
                  <span>•</span>
                  <span className="text-emerald-400">Avg reply &lt; 2m</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {chatThreads.length > 1 && (
                <button
                  onClick={() => setViewHistory(!viewHistory)}
                  title="Switch Conversation"
                  className="px-2 py-1 text-[11px] text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-md transition-colors font-medium"
                >
                  {viewHistory ? 'Active Chat' : 'All Chats'}
                </button>
              )}
              <button
                onClick={() => setIsChatWidgetOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Minimize Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          {viewHistory ? (
            /* Threads Selector View */
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50 dark:bg-slate-950/50">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Conversations</span>
                <button 
                  onClick={() => {
                    setActiveThreadId(`chat-${Date.now()}`);
                    setViewHistory(false);
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  + New Conversation
                </button>
              </div>
              {chatThreads.map(thread => (
                <div
                  key={thread.id}
                  onClick={() => {
                    setActiveThreadId(thread.id);
                    setViewHistory(false);
                  }}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    currentThread?.id === thread.id
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {thread.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {formatTime(thread.updatedAt)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {thread.messages[thread.messages.length - 1]?.message || 'No messages yet'}
                  </p>
                  {thread.projectId && (
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] font-mono text-blue-600 dark:text-blue-400 font-semibold">
                      <span>Project:</span>
                      <span className="bg-blue-100 dark:bg-blue-950 px-1.5 py-0.5 rounded">{thread.projectId}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Active Thread View */
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-950/40">
              
              {/* Linked Project Banner if available */}
              {currentThread?.projectId && (
                <div className="px-3 py-1.5 bg-blue-50/80 dark:bg-blue-950/60 border-b border-blue-200/60 dark:border-blue-900/60 flex items-center justify-between text-xs text-blue-700 dark:text-blue-300">
                  <div className="flex items-center gap-1.5 truncate">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="font-medium truncate">Tracking: <strong>{currentThread.projectId}</strong></span>
                  </div>
                  <button 
                    onClick={() => openTrackerForId(currentThread.projectId!)}
                    className="shrink-0 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                  >
                    <span>View Status</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Intro message badge */}
                <div className="text-center py-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-200/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-300/40 dark:border-slate-700/40">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <span>Connected to DeRoyalTech Accra Engineering Desk</span>
                  </span>
                </div>

                {/* Initial Client Info Prompt if guest without info */}
                {!clientUser && (!currentThread || currentThread.messages.length === 0) && (
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 mb-2 text-xs">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-500" />
                      <span>Introduce Yourself (Optional)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="email"
                        placeholder="Work Email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Render Messages */}
                {currentThread?.messages.map((msg: ChatMessage) => {
                  const isClient = msg.sender === 'client';
                  const isSystem = msg.sender === 'system';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="text-center my-2">
                        <div className="inline-block px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/60 text-[11px] text-blue-700 dark:text-blue-300 max-w-[90%] text-left">
                          <span className="font-semibold block">{msg.senderName}</span>
                          <span>{msg.message}</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5 px-1">
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          {isClient ? (msg.senderName || 'You') : 'DeRoyalTech Systems Lead'}
                        </span>
                        {!isClient && (
                          <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1 rounded">
                            ADMIN
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>

                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm ${
                          isClient
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 rounded-tl-none'
                        }`}
                      >
                        {/* Attached Image */}
                        {msg.attachment?.type === 'image' && (
                          <div className="mb-2">
                            <img
                              src={msg.attachment.url}
                              alt={msg.attachment.name || 'Chat attachment'}
                              onClick={() => setPreviewImageModal(msg.attachment!.url)}
                              className="max-h-52 w-full object-cover rounded-xl border border-white/20 cursor-pointer hover:opacity-95 transition-opacity"
                            />
                            {msg.attachment.name && (
                              <span className="text-[10px] opacity-75 mt-1 block truncate">
                                📷 {msg.attachment.name}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Attached Video */}
                        {msg.attachment?.type === 'video' && (
                          <div className="mb-2">
                            <video
                              controls
                              src={msg.attachment.url}
                              className="max-h-52 w-full rounded-xl bg-black border border-white/20"
                            />
                            {msg.attachment.name && (
                              <span className="text-[10px] opacity-75 mt-1 block truncate">
                                🎬 {msg.attachment.name}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Attached Voice Note */}
                        {msg.attachment?.type === 'audio' && (
                          <div className="mb-2 p-2 rounded-xl bg-black/20 dark:bg-black/30 border border-white/10 flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => togglePlayAudio(msg.id, msg.attachment!.url)}
                              className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow"
                            >
                              {playingAudioId === msg.id ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4 ml-0.5" />
                              )}
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                                <span className="flex items-center gap-1">
                                  <FileAudio className="w-3 h-3 text-amber-400" />
                                  <span>Voice Note</span>
                                </span>
                                <span>{msg.attachment.durationSeconds ? `${msg.attachment.durationSeconds}s` : 'Audio'}</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/30 dark:bg-white/10 rounded-full overflow-hidden">
                                <div className={`h-full bg-current ${playingAudioId === msg.id ? 'animate-pulse w-full' : 'w-1/3'}`} />
                              </div>
                            </div>
                          </div>
                        )}

                        {msg.message && (
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                        )}
                      </div>

                      {isClient && (
                        <div className="flex items-center gap-1 text-[9px] text-slate-400 mt-0.5 px-1">
                          <CheckCheck className="w-3 h-3 text-blue-500" />
                          <span>Delivered to Admin</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="px-3 py-1.5 bg-slate-100/70 dark:bg-slate-900/70 border-t border-slate-200/60 dark:border-slate-800 flex gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
                <button
                  type="button"
                  onClick={() => handleQuickPrompt("What is the current status of my project?")}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors"
                >
                  🚀 Project Status
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPrompt("I would like to request custom CRM and software development.")}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors"
                >
                  💼 Request Service
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPrompt("Do you provide on-site hardware installation in Ghana?")}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors"
                >
                  🛠️ Hardware Warranty
                </button>
              </div>

              {/* Error Notice */}
              {chatError && (
                <div className="px-3 py-1.5 bg-red-50 dark:bg-red-950/80 border-t border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-[11px] flex items-center justify-between">
                  <span>{chatError}</span>
                  <button onClick={() => setChatError(null)} className="text-red-400 hover:text-red-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Staged Attachment Preview Pill */}
              {stagedAttachment && (
                <div className="px-3 py-2 bg-blue-50 dark:bg-blue-950/60 border-t border-blue-200 dark:border-blue-900 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    {stagedAttachment.type === 'image' && (
                      <img src={stagedAttachment.url} alt="Staged" className="w-7 h-7 object-cover rounded border border-blue-300" />
                    )}
                    {stagedAttachment.type === 'video' && (
                      <Film className="w-5 h-5 text-purple-500" />
                    )}
                    {stagedAttachment.type === 'audio' && (
                      <FileAudio className="w-5 h-5 text-amber-500" />
                    )}
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {stagedAttachment.name || `${stagedAttachment.type.toUpperCase()} Attachment`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStagedAttachment(null)}
                    className="p-1 rounded text-slate-400 hover:text-red-500"
                    title="Remove attachment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Voice Note Live Recording Bar */}
              {isRecordingVoice ? (
                <div className="p-2.5 bg-red-50 dark:bg-red-950/50 border-t border-red-200 dark:border-red-900/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
                    <span className="text-xs font-bold text-red-700 dark:text-red-300">
                      Recording Voice Note...
                    </span>
                    <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400">
                      {Math.floor(voiceSeconds / 60).toString().padStart(2, '0')}:{(voiceSeconds % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={cancelVoiceRecording}
                      className="px-2.5 py-1 rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-300 hover:bg-red-100 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={stopVoiceRecording}
                      className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow flex items-center gap-1"
                    >
                      <Square className="w-3 h-3 fill-current" />
                      <span>Done</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Message Composer Form */
                <form onSubmit={handleSendMessage} className="p-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Attachment button for Image / Video */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach Image or Video (up to 25MB)"
                    className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  {/* Voice Note Recording trigger button */}
                  <button
                    type="button"
                    onClick={startVoiceRecording}
                    title="Record Voice Note"
                    className="p-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={stagedAttachment ? "Add a message with this attachment..." : "Type a message to our systems engineers..."}
                    className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                  />

                  <button
                    type="submit"
                    disabled={!messageText.trim() && !stagedAttachment}
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white shadow-md transition-colors shrink-0"
                    aria-label="Send Message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Footer note */}
          <div className="bg-slate-100 dark:bg-slate-950 px-3 py-1.5 text-[10px] text-slate-500 dark:text-slate-400 text-center border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>End-to-End Encrypted Support • DeRoyalTech Systems Accra</span>
          </div>
        </div>
      )}

      {/* Hidden Audio Player for Voice Note Playback */}
      <audio
        ref={audioPlayerRef}
        onEnded={() => setPlayingAudioId(null)}
        className="hidden"
      />

      {/* Image Lightbox Preview Modal */}
      {previewImageModal && (
        <div 
          onClick={() => setPreviewImageModal(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImageModal(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImageModal}
              alt="Preview"
              className="max-h-[85vh] w-auto object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </>
  );
};
