import React, { useState } from 'react';
import { 
  Headphones, 
  MessageSquare, 
  Search, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  ExternalLink, 
  Trash2, 
  Sparkles, 
  ShieldCheck,
  Check,
  Zap,
  Activity,
  Play,
  Pause,
  Volume2,
  FileAudio,
  Film,
  Image as ImageIcon
} from 'lucide-react';
import { useSite } from '../../../context/SiteContext.tsx';
import { ChatThread, ChatMessage } from '../../../types/index.ts';

export const AdminLiveSupportTab: React.FC = () => {
  const { 
    chatThreads, 
    sendAdminReply, 
    updateThreadStatus, 
    deleteThread,
    openTrackerForId,
    setActiveAdminTab
  } = useSite();

  const [selectedThreadId, setSelectedThreadId] = useState<string>(chatThreads[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'waiting_admin' | 'active' | 'resolved'>('all');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioPlayerRef = React.useRef<HTMLAudioElement | null>(null);

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

  const selectedThread: ChatThread | undefined = chatThreads.find(t => t.id === selectedThreadId) || chatThreads[0];

  // Filter threads
  const filteredThreads = chatThreads.filter(t => {
    const matchesSearch = 
      t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.clientCompany?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.projectId?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  const handleSendReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !selectedThread) return;

    sendAdminReply(selectedThread.id, replyText.trim());
    setReplyText('');
  };

  const handleCannedResponse = (response: string) => {
    setReplyText(response);
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Headphones className="w-5 h-5 text-blue-500" />
            <span>Live Engineering Support & Client Desk</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time two-way communication with registered partners and prospective clients. Instant responses sync to the client chat widget.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            {chatThreads.filter(t => t.status === 'waiting_admin').length} Action Required
          </span>
        </div>
      </div>

      {/* Two-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[650px] max-h-[75vh]">
        
        {/* Left Pane: Thread Directory (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          
          {/* Search & Filter */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2 bg-white dark:bg-slate-900">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations by name, company, project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs rounded-lg border border-transparent focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-[11px] pb-0.5">
              {(['all', 'waiting_admin', 'active', 'resolved'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2.5 py-1 rounded-md font-semibold capitalize whitespace-nowrap transition-colors ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {status === 'waiting_admin' ? 'Needs Reply' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Thread List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredThreads.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No matching chat conversations.
              </div>
            ) : (
              filteredThreads.map(thread => {
                const isSelected = selectedThread?.id === thread.id;
                const lastMsg = thread.messages[thread.messages.length - 1];

                return (
                  <div
                    key={thread.id}
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {thread.clientName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                        {new Date(thread.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate mb-1">
                      {thread.subject}
                    </p>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                      {lastMsg ? `"${lastMsg.message}"` : 'Conversation started'}
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-1 text-[10px]">
                      <div className="flex items-center gap-1.5 truncate">
                        {thread.clientCompany && (
                          <span className="text-slate-500 truncate">
                            {thread.clientCompany}
                          </span>
                        )}
                        {thread.projectId && (
                          <span className="px-1.5 py-0.2 rounded font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {thread.projectId}
                          </span>
                        )}
                      </div>

                      {thread.status === 'waiting_admin' ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 font-bold font-mono">
                          NEW MESSAGE
                        </span>
                      ) : thread.status === 'resolved' ? (
                        <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          Resolved
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Conversation & Response Studio (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {selectedThread ? (
            <>
              {/* Thread Client Header */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {selectedThread.clientName}
                    </h4>
                    {selectedThread.clientCompany && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                        · {selectedThread.clientCompany}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-blue-500" />
                      {selectedThread.clientEmail}
                    </span>
                    {selectedThread.clientPhone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-500" />
                        {selectedThread.clientPhone}
                      </span>
                    )}
                    {selectedThread.projectId && (
                      <button
                        onClick={() => openTrackerForId(selectedThread.projectId!)}
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-0.5"
                      >
                        <span>Project: {selectedThread.projectId}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={selectedThread.status}
                    onChange={(e) => updateThreadStatus(selectedThread.id, e.target.value as any)}
                    className="px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="waiting_client">Awaiting Client</option>
                    <option value="waiting_admin">Needs Reply</option>
                    <option value="resolved">Resolved</option>
                  </select>

                  <button
                    onClick={() => deleteThread(selectedThread.id)}
                    title="Delete Conversation"
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Transcript Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/30">
                {selectedThread.messages.map((msg: ChatMessage) => {
                  const isAdmin = msg.sender === 'admin';
                  const isSystem = msg.sender === 'system';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="text-center my-2">
                        <span className="inline-block px-3 py-1 text-[11px] rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60">
                          {msg.message}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                          {isAdmin ? 'You (Systems Lead)' : selectedThread.clientName}
                        </span>
                        <span>•</span>
                        <span>{formatTime(msg.timestamp)}</span>
                      </div>

                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                          isAdmin
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                        }`}
                      >
                        {/* Attached Image */}
                        {msg.attachment?.type === 'image' && (
                          <div className="mb-2">
                            <img
                              src={msg.attachment.url}
                              alt={msg.attachment.name || 'Chat attachment'}
                              className="max-h-56 w-full object-cover rounded-xl border border-white/20"
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
                              className="max-h-56 w-full rounded-xl bg-black border border-white/20"
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

                        {msg.message && <p className="whitespace-pre-wrap">{msg.message}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Canned Responses */}
              <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-orange-500" />
                  <span>Templates:</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCannedResponse("Thank you for reaching out. Our engineering lead has reviewed your specifications and we are ready to proceed.")}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300 whitespace-nowrap text-[11px]"
                >
                  🚀 Requirements Approved
                </button>
                <button
                  type="button"
                  onClick={() => handleCannedResponse("Your Project Tracking ID is now active on our client portal. You can view milestone progression in real time.")}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300 whitespace-nowrap text-[11px]"
                >
                  📈 Project Tracker Live
                </button>
                <button
                  type="button"
                  onClick={() => handleCannedResponse("Our hardware team in Accra has staged and bench-tested the requested peripherals. On-site dispatch scheduled.")}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300 whitespace-nowrap text-[11px]"
                >
                  🛠️ Hardware Staging Ready
                </button>
                <button
                  type="button"
                  onClick={() => handleCannedResponse("Would you like to schedule a 20-minute Zoom/Google Meet technical consultation this week?")}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300 whitespace-nowrap text-[11px]"
                >
                  📅 Request Call
                </button>
              </div>

              {/* Reply Input Bar */}
              <form onSubmit={handleSendReply} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Type an official admin response (press Enter to send)..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs border border-transparent focus:border-blue-500 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <span>Send Reply</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8 text-slate-400 text-xs">
              Select a conversation to view transcript and respond.
            </div>
          )}
        </div>

      </div>

      {/* Hidden Audio Player for Voice Note Playback */}
      <audio
        ref={audioPlayerRef}
        onEnded={() => setPlayingAudioId(null)}
        className="hidden"
      />
    </div>
  );
};
