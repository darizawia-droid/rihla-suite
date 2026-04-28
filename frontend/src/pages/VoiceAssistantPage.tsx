import { useState, useEffect } from 'react'
import { 
  Mic, MicOff, Zap, Brain, 
  MessageSquare, History, X,
  Play, Volume2, Globe, Command,
  Sparkles, CheckCircle2, AlertCircle
} from 'lucide-react'
import { clsx } from 'clsx'

interface VoiceCommand {
  id: string
  text: string
  action: string
  timestamp: string
  status: 'executed' | 'failed' | 'processing'
}

export function VoiceAssistantPage() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [history, setHistory] = useState<VoiceCommand[]>([
    { id: '1', text: 'Crée un dossier pour 12 pax à Marrakech', action: 'Nouveau projet créé: Marrakech VIP', timestamp: 'Il y a 2 min', status: 'executed' },
    { id: '2', text: 'Affiche la marge du groupe G-204', action: 'Marge actuelle: 18.4%', timestamp: 'Il y a 5 min', status: 'executed' }
  ])

  const toggleListening = () => {
    setIsListening(!isListening)
    if (!isListening) {
      setTranscript('En écoute...')
      setTimeout(() => setTranscript('Crée un devis pour Prestige Tours...'), 2000)
    } else {
      if (transcript && transcript !== 'En écoute...') {
        setHistory(prev => [{
          id: Date.now().toString(),
          text: transcript,
          action: 'Analyse de l\'instruction en cours...',
          timestamp: 'Maintenant',
          status: 'processing'
        }, ...prev])
      }
      setTranscript('')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8 relative overflow-hidden font-sans">
      
      {/* ── AMBIENT BACKGROUND ─────────────────────────────────── */}
      <div className="absolute inset-0">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rihla/10 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </div>

      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center">
         
         <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rihla/20 text-rihla rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
               <Brain size={12} /> Rihla Voice Assistant
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-4">Commandez par la voix</h1>
            <p className="text-slate-500 font-medium italic">
               "Rihla, quel est le solde de trésorerie pour Juin ?"
            </p>
         </div>

         {/* ── CENTRAL MIC BUTTON ────────────────────────────────── */}
         <div className="relative mb-20">
            {isListening && (
              <>
                 <div className="absolute inset-0 bg-rihla/40 rounded-full animate-ping scale-150" />
                 <div className="absolute inset-0 bg-rihla/20 rounded-full animate-ping scale-125 delay-75" />
              </>
            )}
            <button 
              onClick={toggleListening}
              className={clsx(
                "relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl",
                isListening ? "bg-white text-rihla scale-110" : "bg-rihla text-white hover:scale-105"
              )}
            >
               {isListening ? <Mic size={48} /> : <Mic size={48} />}
            </button>
            
            {isListening && (
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap">
                 <p className="text-rihla font-black text-sm animate-pulse tracking-widest uppercase">Écoute active...</p>
              </div>
            )}
         </div>

         {/* ── TRANSCRIPT DISPLAY ────────────────────────────────── */}
         <div className={clsx(
           "w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] mb-12 transition-all duration-500",
           transcript ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
         )}>
            <p className="text-xl font-bold text-center text-white/90">
               {transcript || "..."}
            </p>
         </div>

         {/* ── COMMAND HISTORY ───────────────────────────────────── */}
         <div className="w-full space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4">Commandes Récentes</h3>
            {history.map(cmd => (
              <div key={cmd.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between group hover:bg-white/10 transition-all">
                 <div className="flex items-center gap-4">
                    <div className={clsx(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      cmd.status === 'executed' ? "bg-emerald-500/10 text-emerald-500" : "bg-rihla/10 text-rihla animate-spin"
                    )}>
                       {cmd.status === 'executed' ? <CheckCircle2 size={18} /> : <Zap size={18} />}
                    </div>
                    <div>
                       <p className="text-sm font-black text-white">{cmd.text}</p>
                       <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{cmd.action}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{cmd.timestamp}</span>
                 </div>
              </div>
            ))}
         </div>

         {/* ── CAPABILITIES HINT ─────────────────────────────────── */}
         <div className="mt-12 grid grid-cols-2 gap-4 w-full">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
               <Command size={14} className="text-slate-500" />
               <span className="text-[10px] font-bold text-slate-400">"Crée un projet..."</span>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
               <Volume2 size={14} className="text-slate-500" />
               <span className="text-[10px] font-bold text-slate-400">"Quelle est la marge..."</span>
            </div>
         </div>

      </div>

      {/* Close button */}
      <button className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10">
         <X size={20} className="text-slate-400" />
      </button>

    </div>
  )
}
