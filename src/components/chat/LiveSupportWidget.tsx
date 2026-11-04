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
  ArrowRight
} from 'lucide-react';
import { useSite } from '../../context/SiteContext.tsx';
import { ChatMessage, ChatThread } from '../../types/index.ts';

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

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim()) return;

    const senderName = clientName.trim() || clientUser?.fullName || 'Prospective Partner';
    const senderEmail = clientEmail.trim() || clientUser?.email || 'guest@deroyaltech.com';

    sendClientMessage({
      threadId: currentThread?.id,
      clientName: senderName,
      clientEmail: senderEmail,
      clientCompany: clientCompany.trim(),
      message: messageText.trim(),
      subject: subject.trim() || (selectedProjectId ? `Project Inquiry: ${selectedProjectId}` : undefined),
      projectId: selectedProjectId || currentThread?.projectId
    });

    setMessageText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    setMessageText(prompt);
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
      {/* Floating Launcher Trigger */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
        {!isChatWidgetOpen && (
          <div 
            onClick={() => setIsChatWidgetOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-700/60 shadow-lg text-xs text-slate-200 cursor-pointer hover:border-blue-500/50 transition-all hover:scale-[1.02]"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-medium">Live Engineering Support</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">ONLINE</span>
          </div>
        )}

        <button
          onClick={() => setIsChatWidgetOpen(!isChatWidgetOpen)}
          aria-label="Open DeRoyalTech Live Support"
          className="relative group p-3.5 sm:p-4 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 transition-all transform hover:scale-105 active:scale-95"
        >
          {isChatWidgetOpen ? (
            <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
          ) : (
            <MessageSquare className="w-6 h-6 transition-transform group-hover:scale-110" />
          )}

          {/* Unread badge */}
          {totalClientUnread > 0 && !isChatWidgetOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white dark:border-slate-900 animate-bounce">
              {totalClientUnread}
            </span>
          )}
        </button>
      </div>

      {/* Live Support Modal / Flyout Window */}
      {isChatWidgetOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-40 w-[94vw] sm:w-[410px] max-w-[430px] h-[580px] max-h-[82vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden backdrop-blur-lg animate-in fade-in slide-in-from-bottom-5 duration-200">
          
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
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
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

              {/* Message Composer */}
              <form onSubmit={handleSendMessage} className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message to our systems engineers..."
                  className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white shadow-md transition-colors shrink-0"
                  aria-label="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Footer note */}
          <div className="bg-slate-100 dark:bg-slate-950 px-3 py-1.5 text-[10px] text-slate-500 dark:text-slate-400 text-center border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>End-to-End Encrypted Support • DeRoyalTech Systems Accra</span>
          </div>
        </div>
      )}
    </>
  );
};
