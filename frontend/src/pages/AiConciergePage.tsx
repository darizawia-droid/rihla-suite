import { useState, useEffect } from 'react'
import { 
  MessageSquare, User, Bot, Send, 
  Search, Filter, AlertCircle, CheckCircle2,
  Phone, Video, MoreVertical, ShieldCheck,
  Zap, Smile, Meh, Frown, ArrowRight
} from 'lucide-react'
import { clsx } from 'clsx'

interface ChatMessage {
  id: string
  sender: 'ai' | 'client' | 'human'
  text: string
  timestamp: string
}

interface ChatSession {
  id: string
  clientName: string
  groupName: string
  lastMessage: string
  status: 'ai_handling' | 'human_needed' | 'resolved'
  sentiment: 'positive' | 'neutral' | 'frustrated'
  messages: ChatMessage[]
}

const MOCK_CHATS: ChatSession[] = [
  {
    id: 'c1',
    clientName: 'Jean Dupont',
    groupName: 'G-204 (Marrakech VIP)',
    lastMessage: 'Merci pour l\'info !',
    status: 'ai_handling',
    sentiment: 'positive',
    messages: [
      { id: '1', sender: 'client', text: 'Bonjour, à quelle heure est notre départ demain ?', timestamp: '10:15' },
      { id: '2', sender: 'ai', text: 'Bonjour Jean ! Votre départ de l\'hôtel La Mamounia est prévu à 09h00 précises. Votre chauffeur, Youssef, sera devant l\'entrée principale.', timestamp: '10:15' },
      { id: '3', sender: 'client', text: 'Merci pour l\'info !', timestamp: '10:16' }
    ]
  },
  {
    id: 'c2',
    clientName: 'Sarah Smith',
    groupName: 'G-205 (Atlas Trek)',
    lastMessage: 'Mon chauffeur n\'est pas là...',
    status: 'human_needed',
    sentiment: 'frustrated',
    messages: [
      { id: '1', sender: 'client', text: 'Hello, the driver was supposed to be here at 08:00. It is 08:15 and I see no one.', timestamp: '08:15' },
      { id: '2', sender: 'ai', text: 'I am sorry for the delay, Sarah. Let me check the real-time position of your vehicle...', timestamp: '08:15' },
      { id: '3', sender: 'ai', text: 'The vehicle is currently stuck in traffic (Avenue Mohammed V) and should arrive in 7 minutes. Would you like me to notify the tour leader?', timestamp: '08:16' },
      { id: '4', sender: 'client', text: 'Yes please. I am worried about missing the flight.', timestamp: '08:17' }
    ]
  }
]

export function AiConciergePage() {
  const [selectedChat, setSelectedChat] = useState(MOCK_CHATS[0])
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    // In a real app, this would send to the human-takeover channel
    const msg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'human',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setSelectedChat(prev => ({
      ...prev,
      messages: [...prev.messages, msg],
      status: 'resolved'
    }))
    setNewMessage('')
  }

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden font-sans">
      
      {/* ── LEFT: SESSIONS LIST ────────────────────────────────── */}
      <div className="w-96 border-r border-white/5 flex flex-col bg-slate-900/50 backdrop-blur-xl">
        <div className="p-6 border-b border-white/5">
           <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-black text-white flex items-center gap-2">
                 <Zap size={20} className="text-rihla" /> Concierge IA
              </h1>
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
           </div>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Rechercher un client..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 rounded-xl text-sm text-white border border-white/5 focus:outline-none focus:border-rihla/50"
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
           {MOCK_CHATS.map(chat => (
             <button 
               key={chat.id}
               onClick={() => setSelectedChat(chat)}
               className={clsx(
                 "w-full p-5 text-left border-b border-white/5 transition-all group flex gap-4",
                 selectedChat.id === chat.id ? "bg-white/10" : "hover:bg-white/5"
               )}
             >
                <div className="relative flex-shrink-0">
                   <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-black">
                      {chat.clientName[0]}
                   </div>
                   <div className={clsx(
                     "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 flex items-center justify-center",
                     chat.sentiment === 'positive' ? "bg-emerald-500" : chat.sentiment === 'frustrated' ? "bg-red-500" : "bg-blue-500"
                   )}>
                      {chat.sentiment === 'positive' ? <Smile size={10} className="text-white" /> : chat.sentiment === 'frustrated' ? <Frown size={10} className="text-white" /> : <Meh size={10} className="text-white" />}
                   </div>
                </div>
                <div className="min-w-0 flex-1">
                   <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-black text-white truncate">{chat.clientName}</h4>
                      <span className="text-[10px] text-slate-500 font-bold">14:02</span>
                   </div>
                   <p className="text-[11px] text-slate-400 font-medium truncate mb-2">{chat.groupName}</p>
                   <p className="text-xs text-slate-500 truncate italic">"{chat.lastMessage}"</p>
                </div>
             </button>
           ))}
        </div>
      </div>

      {/* ── MAIN: CHAT AREA ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative">
        
        {/* Chat Header */}
        <div className="h-20 px-8 border-b border-white/5 flex items-center justify-between bg-slate-900/80 backdrop-blur-md">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rihla/10 flex items-center justify-center text-rihla">
                 <User size={20} />
              </div>
              <div>
                 <h2 className="text-sm font-black text-white">{selectedChat.clientName}</h2>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                    {selectedChat.status === 'ai_handling' ? (
                       <> <Bot size={12} className="text-emerald-500" /> IA en cours de traitement</>
                    ) : (
                       <> <AlertCircle size={12} className="text-red-500" /> Intervention Humaine Requise</>
                    )}
                 </p>
              </div>
           </div>
           <div className="flex gap-2">
              <button className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-slate-400 hover:text-white transition-all">
                 <Phone size={18} />
              </button>
              <button className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-slate-400 hover:text-white transition-all">
                 <Video size={18} />
              </button>
              <button className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-slate-400 hover:text-white transition-all">
                 <MoreVertical size={18} />
              </button>
           </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-80">
           {selectedChat.messages.map(msg => (
             <div key={msg.id} className={clsx(
               "flex flex-col max-w-[70%]",
               msg.sender === 'client' ? "mr-auto" : "ml-auto items-end"
             )}>
                <div className={clsx(
                  "p-4 rounded-2xl text-sm leading-relaxed shadow-lg",
                  msg.sender === 'client' ? "bg-white/10 text-white rounded-bl-none" : 
                  msg.sender === 'ai' ? "bg-rihla text-white rounded-br-none" : 
                  "bg-blue-600 text-white rounded-br-none"
                )}>
                   {msg.text}
                </div>
                <div className="flex items-center gap-2 mt-2 px-1">
                   {msg.sender === 'ai' && <Bot size={10} className="text-white/40" />}
                   <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{msg.sender} · {msg.timestamp}</span>
                </div>
             </div>
           ))}
        </div>

        {/* Message Input */}
        <div className="p-8 border-t border-white/5 bg-slate-900/80 backdrop-blur-md">
           <div className="relative flex items-center gap-4">
              <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 flex items-center px-6 py-4">
                 <input 
                   type="text" 
                   value={newMessage}
                   onChange={e => setNewMessage(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                   placeholder="Tapez votre réponse (Prendre le relais de l'IA)..." 
                   className="flex-1 bg-transparent text-sm text-white outline-none"
                 />
                 <div className="flex items-center gap-3 text-slate-500">
                    <Smile size={20} className="hover:text-white cursor-pointer transition-colors" />
                    <Send 
                      size={20} 
                      className={clsx("cursor-pointer transition-colors", newMessage.trim() ? "text-rihla" : "hover:text-white")}
                      onClick={handleSendMessage}
                    />
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* ── RIGHT: INTELLIGENCE PANEL ───────────────────────────── */}
      <div className="w-80 border-l border-white/5 bg-slate-900/50 backdrop-blur-xl p-6 hidden xl:block">
         <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Intelligence Conversationnelle</h3>
         
         <div className="space-y-6">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
               <h4 className="text-xs font-black text-white mb-3 flex items-center gap-2">
                  <Smile size={14} className="text-emerald-500" /> Analyse de Sentiment
               </h4>
               <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={clsx(
                      "h-full transition-all duration-1000",
                      selectedChat.sentiment === 'positive' ? "bg-emerald-500 w-[90%]" : 
                      selectedChat.sentiment === 'frustrated' ? "bg-red-500 w-[20%]" : "bg-blue-500 w-[60%]"
                    )} 
                  />
               </div>
               <p className="text-[10px] text-slate-400 mt-2 font-medium">
                  {selectedChat.sentiment === 'positive' ? "Le client semble très satisfait des réponses de l'IA." : 
                   selectedChat.sentiment === 'frustrated' ? "ALERTE : Frustration détectée. Intervention recommandée." : "Ton neutre."}
               </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
               <h4 className="text-xs font-black text-white mb-3 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-rihla" /> Conformité DMC
               </h4>
               <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-[10px] text-emerald-400">
                     <CheckCircle2 size={12} /> Ton de voix RIHLA respecté
                  </li>
                  <li className="flex items-center gap-2 text-[10px] text-emerald-400">
                     <CheckCircle2 size={12} /> Données de vol synchronisées
                  </li>
               </ul>
            </div>

            <div className="bg-rihla/10 rounded-2xl p-5 border border-rihla/20">
               <h4 className="text-xs font-black text-rihla mb-2">Suggestion IA</h4>
               <p className="text-[11px] text-white/70 leading-relaxed mb-4">
                  "Sarah s'inquiète pour son vol. J'ai déjà notifié le Tour Leader, mais un court message vocal de votre part la rassurerait davantage."
               </p>
               <button className="w-full py-2 bg-rihla text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rihla/20">
                  Notifier Chef d'Agence
               </button>
            </div>
         </div>
      </div>

    </div>
  )
}
