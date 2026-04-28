import { useState, useEffect } from 'react'
import { 
  Navigation, MapPin, Users, Zap, 
  MessageSquare, AlertCircle, CheckCircle2,
  Clock, ArrowRight, Camera, Star,
  ShieldCheck, Phone, Video, MoreHorizontal,
  TrendingUp, TrendingDown, Activity
} from 'lucide-react'
import { clsx } from 'clsx'

interface OperationalEvent {
  id: string
  type: 'status' | 'feedback' | 'alert' | 'media'
  author: 'guide' | 'driver' | 'client' | 'ia'
  text: string
  timestamp: string
  roleName: string
}

export function LiveOpsSyncPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'feedback' | 'alerts'>('all')
  
  const [events, setEvents] = useState<OperationalEvent[]>([
    { id: '1', type: 'status', author: 'driver', roleName: 'Youssef (Chauffeur)', text: 'Pick-up effectué : Groupe G-204 en direction de l\'aéroport.', timestamp: '14:02' },
    { id: '2', type: 'feedback', author: 'client', roleName: 'Jean D. (Client)', text: 'Rating 5/5 pour le déjeuner au Palais Faraj.', timestamp: '13:45' },
    { id: '3', type: 'alert', author: 'ia', roleName: 'IA Monitoring', text: 'Risque de retard détecté sur le tronçon Fès-Ifrane (Trafic dense).', timestamp: '13:30' },
    { id: '4', type: 'media', author: 'guide', roleName: 'Yassine (Guide)', text: 'Photo de groupe partagée depuis les Tanneries.', timestamp: '11:20' }
  ])

  // Simulation d'événements live
  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents(prev => [{
        id: Date.now().toString(),
        type: 'feedback',
        author: 'client',
        roleName: 'Sarah S. (Client)',
        text: 'Expérience insolite géniale ! Merci Rihla.',
        timestamp: 'À l\'instant'
      }, ...prev])
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 transition-colors">
      
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-rihla uppercase tracking-widest mb-4">
             Mission Control <Activity size={12} className="animate-pulse" /> Live Ops
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-cream tracking-tighter">Live Sync Hub</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium italic">
             Propagation en temps réel des signaux terrain entre Clients, Guides, Chauffeurs et Designers.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-3 shadow-sm flex items-center gap-6">
              <div className="text-center">
                 <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Groupes Live</p>
                 <p className="text-xl font-black">12</p>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-white/10" />
              <div className="text-center">
                 <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Alertes</p>
                 <p className="text-xl font-black text-red-500">2</p>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-white/10" />
              <div className="text-center">
                 <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Satisfaction</p>
                 <p className="text-xl font-black text-emerald-500">4.9</p>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        
        {/* ── LEFT: LIVE FEED (8 cols) ────────────────────────────── */}
        <div className="col-span-8 space-y-6">
           
           <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden flex flex-col h-[700px]">
              {/* Feed Header */}
              <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/2">
                 <div className="flex gap-2">
                    {['all', 'feedback', 'alerts'].map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={clsx(
                          "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          activeTab === tab ? "bg-rihla text-white shadow-lg shadow-rihla/20" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                        )}
                      >
                         {tab === 'all' ? 'Tout le Flux' : tab === 'feedback' ? 'Quality Pulse' : 'Alertes'}
                      </button>
                    ))}
                 </div>
                 <div className="text-[10px] font-black text-slate-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> SYNCHRONISÉ
                 </div>
              </div>

              {/* Feed Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                 {events.filter(e => activeTab === 'all' || e.type === activeTab).map(e => (
                   <div key={e.id} className="relative pl-12 group animate-in slide-in-from-left-4 duration-500">
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-100 dark:bg-white/5 group-last:bg-transparent" />
                      <div className={clsx(
                        "absolute left-[-8px] top-0 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 shadow-sm",
                        e.type === 'status' ? "bg-blue-500" : e.type === 'feedback' ? "bg-emerald-500" : e.type === 'alert' ? "bg-red-500" : "bg-purple-500"
                      )} />
                      
                      <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-rihla uppercase tracking-widest">{e.roleName}</span>
                            <span className="text-[10px] text-slate-400 font-bold">{e.timestamp}</span>
                         </div>
                         {e.type === 'feedback' && (
                           <div className="flex gap-1">
                              {[1,2,3,4,5].map(s => <Star key={s} size={10} className="text-amber-400" fill="currentColor" />)}
                           </div>
                         )}
                      </div>
                      
                      <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 p-5 rounded-3xl group-hover:shadow-md transition-all">
                         <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                            {e.text}
                         </p>
                      </div>

                      {e.type === 'alert' && (
                        <div className="mt-3 flex gap-3">
                           <button className="px-4 py-2 bg-red-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20">Intervenir</button>
                           <button className="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest">Ignorer</button>
                        </div>
                      )}
                   </div>
                 ))}
              </div>
           </div>

        </div>

        {/* ── RIGHT: QUALITY METRICS (4 cols) ──────────────────────── */}
        <div className="col-span-4 space-y-6">
           
           {/* Real-Time Sentiment Card */}
           <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-200 dark:border-white/10 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <TrendingUp size={14} className="text-emerald-500" /> Pulse de Satisfaction Live
              </h3>
              <div className="text-center py-8 relative">
                 <div className="text-6xl font-black text-slate-900 dark:text-cream mb-2">4.91</div>
                 <div className="text-xs font-black text-emerald-500 uppercase tracking-widest">+0.2 ce mois</div>
                 {/* Decorative background circle */}
                 <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
              </div>
              
              <div className="space-y-4">
                 {[
                   { label: 'Transport', val: 4.8, color: 'bg-blue-500' },
                   { label: 'Hébergement', val: 5.0, color: 'bg-emerald-500' },
                   { label: 'Guide', val: 4.9, color: 'bg-rihla' },
                   { label: 'Activités', val: 4.7, color: 'bg-purple-500' },
                 ].map(m => (
                   <div key={m.label}>
                      <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                         <span className="text-slate-500">{m.label}</span>
                         <span>{m.val}/5</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                         <div className={clsx("h-full rounded-full transition-all duration-1000", m.color)} style={{ width: `${(m.val/5)*100}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Live Sync Map Simulation */}
           <div className="bg-slate-900 rounded-[40px] overflow-hidden border border-white/5 shadow-2xl relative group">
              <div className="h-64 bg-slate-800 relative">
                 {/* Map Placeholder */}
                 <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                 
                 {/* Moving dots simulation */}
                 <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-pulse" title="Groupe G-204" />
                 <div className="absolute top-2/3 left-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 animate-pulse" title="Groupe G-205" />
                 <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-rihla rounded-full shadow-lg shadow-rihla/50 animate-pulse" title="Groupe G-206" />
                 
                 <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Statut Flotte</p>
                    <p className="text-xs font-bold text-white">3 Groupes en mouvement sur le terrain</p>
                 </div>
              </div>
              <div className="p-6">
                 <button className="w-full py-4 bg-rihla text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rihla/20 hover:-translate-y-1 transition-all">
                    Ouvrir Carte Temps Réel
                 </button>
              </div>
           </div>

           {/* Collaboration Box */}
           <div className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
              <Zap size={32} className="mb-4 opacity-50" />
              <h4 className="text-lg font-black mb-2">Prêt à intervenir ?</h4>
              <p className="text-xs text-white/70 font-medium leading-relaxed mb-6">
                 Utilisez le canal d'urgence unifié pour synchroniser instantanément les modifications d'itinéraire.
              </p>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                 Lancer Multi-Chat SOS
              </button>
           </div>
        </div>

      </div>
    </div>
  )
}
