import React, { useState, useEffect, useRef } from 'react';
import { User, ChatMessage, Webinar, DB } from '../database';
import { MessageSquare, Send, Trash2, Shield, UserCheck, Check } from 'lucide-react';

interface ChatBoxProps {
  webinar: Webinar;
  currentUser: User;
  onNewMessage?: () => void;
}

export default function ChatBox({ webinar, currentUser, onNewMessage }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typedMsg, setTypedMsg] = useState('');
  const [clearedMessageIds, setClearedMessageIds] = useState<string[]>([]);
  const [showConfirmClearLocal, setShowConfirmClearLocal] = useState(false);
  const [showConfirmClearAll, setShowConfirmClearAll] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Retrieve chats from DB
  const reloadChats = () => {
    const list = DB.getChats(webinar.id);
    setMessages(list);
  };

  useEffect(() => {
    reloadChats();
    
    // Set periodic sync to simulate real-time chat (every 2.5s)
    const interval = setInterval(() => {
      reloadChats();
    }, 2500);

    return () => clearInterval(interval);
  }, [webinar.id]);

  // Load local cleared messages list on mount / webinar change
  useEffect(() => {
    const key = `cleared_chats_${currentUser.email}_${webinar.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setClearedMessageIds(JSON.parse(saved));
      } catch (e) {
        setClearedMessageIds([]);
      }
    } else {
      setClearedMessageIds([]);
    }
  }, [webinar.id, currentUser.email]);

  useEffect(() => {
    // Scroll chats to bottom of the container only, without scrolling the main window
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMsg.trim()) return;

    DB.addChatMessage(
      webinar.id,
      currentUser.namaLengkap,
      currentUser.role,
      typedMsg.trim()
    );

    setTypedMsg('');
    reloadChats();
    if (onNewMessage) {
      onNewMessage();
    }
  };

  const handleDelete = (id: string) => {
    // Remove individual message from database
    const allChatsStr = localStorage.getItem('umkm_webinar_chats');
    if (allChatsStr) {
      try {
        const chats = JSON.parse(allChatsStr) as ChatMessage[];
        const filtered = chats.filter(c => c.id !== id);
        localStorage.setItem('umkm_webinar_chats', JSON.stringify(filtered));
        reloadChats();
      } catch (err) {
        console.error('Error deleting chat message', err);
      }
    }
  };

  const handleClearLocal = () => {
    setShowConfirmClearLocal(true);
  };

  const executeClearLocal = () => {
    const allIds = messages.map(m => m.id);
    const key = `cleared_chats_${currentUser.email}_${webinar.id}`;
    localStorage.setItem(key, JSON.stringify(allIds));
    setClearedMessageIds(allIds);
    setShowConfirmClearLocal(false);
  };

  const handleRestoreLocal = () => {
    const key = `cleared_chats_${currentUser.email}_${webinar.id}`;
    localStorage.removeItem(key);
    setClearedMessageIds([]);
  };

  const handleClearAll = () => {
    setShowConfirmClearAll(true);
  };

  const executeClearAll = () => {
    DB.clearChats(webinar.id);
    reloadChats();
    setShowConfirmClearAll(false);
  };

  const canModerate = currentUser.role === 'admin' || currentUser.role === 'superadmin';
  const visibleMessages = messages.filter(msg => !clearedMessageIds.includes(msg.id));

  return (
    <div className="glass border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[400px] shadow-2xl accent-glow-indigo relative">
      
      {/* Custom Confirmation Modals for Sandboxed Iframes */}
      {showConfirmClearLocal && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 text-center font-sans">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 max-w-[280px] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto text-indigo-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-200">Bersihkan Layar Chat</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Bersihkan seluruh obrolan saat ini dari layar Anda? Pesan baru yang masuk setelah ini tetap tampil.
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowConfirmClearLocal(false)}
                className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeClearLocal}
                className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Bersihkan
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmClearAll && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 text-center font-sans">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 max-w-[280px] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-200">Kosongkan Database</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Apakah Anda yakin ingin mengosongkan seluruh obrolan chat webinar ini di database? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowConfirmClearAll(false)}
                className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeClearAll}
                className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-550 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Kosongkan
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Chat Title bar */}
      <div className="bg-slate-950/40 px-4 py-3 border-b border-white/5 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-sm font-bold text-slate-200">Kolom Obrolan Live</span>
        </div>
        
        <div className="flex items-center space-x-1.5">
          {visibleMessages.length > 0 && (
            <button
              type="button"
              onClick={handleClearLocal}
              id="btn-clear-local-chats"
              className="text-[10px] text-indigo-300 hover:text-indigo-200 font-sans transition-colors border border-indigo-500/20 hover:bg-indigo-500/10 px-2 py-0.5 rounded cursor-pointer shrink-0"
              title="Bersihkan layar chat Anda saja"
            >
              🧹 Bersihkan Layar
            </button>
          )}

          {clearedMessageIds.length > 0 && (
            <button
              type="button"
              onClick={handleRestoreLocal}
              id="btn-restore-local-chats"
              className="text-[10px] text-slate-400 hover:text-slate-200 font-sans transition-colors border border-white/5 hover:bg-white/5 px-2 py-0.5 rounded cursor-pointer shrink-0"
              title="Tampilkan kembali pesan sebelumnya"
            >
              🔄 Tampilkan Lagi
            </button>
          )}

          {canModerate && messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              id="btn-clear-chats"
              className="text-[10px] text-rose-400 hover:text-rose-300 font-sans transition-colors border border-rose-500/10 hover:bg-rose-500/5 px-2 py-0.5 rounded cursor-pointer shrink-0"
              title="Hapus chat dari semua database (Khusus Admin)"
            >
              🚫 Kosongkan Database
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3" 
        id="chat-messages-container"
      >
        {visibleMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <span className="text-xl">💬</span>
            <p className="text-xs text-slate-400 mt-2">
              {messages.length > 0
                ? 'Layar obrolan dibersihkan. Pesan baru otomatis akan muncul di sini!'
                : 'Belum ada obrolan. Jadilah yang pertama memberikan pertanyaan atau menyapa!'}
            </p>
          </div>
        ) : (
          visibleMessages.map((msg) => {
            const isMyMsg = msg.senderName === currentUser.namaLengkap;
            const isModeratorRole = msg.senderRole === 'admin' || msg.senderRole === 'superadmin';

            return (
              <div 
                key={msg.id} 
                className={`flex flex-col max-w-[85%] ${isMyMsg ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                {/* Meta details */}
                <div className="flex items-center space-x-1.5 mb-1">
                  <span className="text-[10px] font-bold text-slate-300">{msg.senderName}</span>
                  {isModeratorRole && (
                    <span className="bg-indigo-500/15 text-indigo-300 px-1.5 py-0.05 rounded text-[8px] font-semibold border border-indigo-500/25 font-mono">
                      {msg.senderRole === 'superadmin' ? '⚜️ Super' : '🛡️ Mod'}
                    </span>
                  )}
                  <span className="text-[9px] text-slate-500 font-mono">{msg.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div className="relative group flex items-start space-x-2">
                  <div className={`p-2.5 rounded-2xl text-xs leading-relaxed ${
                    isMyMsg 
                      ? 'bg-indigo-650 text-white font-medium rounded-tr-none shadow-md shadow-indigo-600/10' 
                      : isModeratorRole 
                        ? 'bg-violet-950/40 text-violet-200 border border-violet-500/10 rounded-tl-none shadow-sm' 
                        : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/5 shadow-sm'
                  }`}>
                    {msg.message}
                  </div>

                  {/* Inline Delete for moderators */}
                  {canModerate && (
                    <button
                      onClick={() => handleDelete(msg.id)}
                      title="Hapus Pesan"
                      className="opacity-0 group-hover:opacity-100 p-1 bg-slate-950/80 text-rose-450 rounded-lg hover:text-rose-400 border border-white/5 self-center transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Typing Form */}
      <form onSubmit={handleSend} className="bg-slate-950/60 border-t border-white/5 p-3 flex space-x-2 items-center" id="form-chat">
        <input
          type="text"
          value={typedMsg}
          onChange={(e) => setTypedMsg(e.target.value)}
          placeholder={`Hubungi narasumber/admin...`}
          maxLength={300}
          id="input-chat-text"
          className="flex-1 bg-slate-900/60 border border-white/10 focus:border-indigo-500 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none transition-all placeholder:text-slate-500"
        />
        <button
          type="submit"
          id="btn-chat-send"
          className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all cursor-pointer shadow-md accent-glow"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
