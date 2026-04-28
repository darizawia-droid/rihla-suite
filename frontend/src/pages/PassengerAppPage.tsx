import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { 
  MapPin, Navigation, Info, Users, Clock, 
  Sun, CloudRain, Wind, MessageSquare, 
  Calendar, Phone, ShieldCheck, Map as MapIcon,
  ChevronRight, ArrowLeft, Camera, Heart, Share2, Sparkles, Star, ShoppingBag, Zap, CreditCard,
  Smile, Meh, Frown, Compass, Radio, Activity
} from 'lucide-react'
import { clsx } from 'clsx'

export function PassengerAppPage() {
  const { token } = useParams<{ token: string }>()
  const [activeTab, setActiveTab] = useState<'live' | 'program' | 'info' | 'memories'>('live')
  const [mood, setMood] = useState<'happy' | 'neutral' | 'sad' | null>(null)
  
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-rihla/30 overflow-hidden flex flex-col">
      
      {/* ── ULTRA-LUXE BACKGROUND ELEMENTS ─────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-rihla/10 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]" />
      </div>

      {/* ── TOP NAV: DYNAMIC GLASS ────────────────────────────── */}
      <header className="sticky top-0 z-50 px-6 py-6 flex items-center justify-between bg-black/20 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rihla to-amber-600 flex items-center justify-center shadow-2xl shadow-rihla/30 ring-1 ring-white/20">
             <span className="font-black text-sm text-white">S</span>
          </div>
          <div>
            <h1 className="text-xs font-black tracking-[0.2em] uppercase text-white/90">S'TOURS <span className="text-rihla">VIP</span></h1>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-2">
               <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Live : ST-2026
            </p>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
           <MessageSquare size={18} className="text-rihla" />
        </button>
      </header>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-32 relative z-10 custom-scrollbar">
        
        {activeTab === 'live' && (
          <div className="animate-in fade-in zoom-in-95 duration-700 space-y-8">
            
            {/* HERO STATUS CARD */}
            <div className="px-6 pt-6">
               <div className="bg-gradient-to-br from-slate-900/80 to-black/80 border border-white/10 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                     <Compass size={120} />
                  </div>
                  <div className="relative z-10">
                     <p className="text-[10px] font-black text-rihla uppercase tracking-[0.3em] mb-4">Statut Actuel</p>
                     <h2 className="text-3xl font-black text-white leading-tight mb-2">En route vers <br/> <span className="text-rihla">La Médina</span></h2>
                     <div className="flex items-center gap-4 mt-6">
                        <div className="flex -space-x-2">
                           {[1,2].map(i => (
                             <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black">
                                {i === 1 ? 'Y' : 'D'}
                             </div>
                           ))}
                        </div>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Yassine & Driss sont avec vous</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* LIVE RADAR MAP */}
            <div className="px-6">
               <div className="h-64 bg-slate-900/50 rounded-[40px] border border-white/5 relative overflow-hidden group shadow-inner">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                  
                  {/* Pulse Center */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                     <div className="w-24 h-24 bg-rihla/10 rounded-full animate-ping" />
                     <div className="absolute inset-0 w-24 h-24 bg-rihla/5 rounded-full animate-pulse" />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-rihla rounded-full shadow-[0_0_20px_rgba(212,175,55,0.8)] border-2 border-white" />
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                     <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl">
                        <p className="text-[8px] font-black text-rihla uppercase tracking-widest mb-1">Localisation Bus</p>
                        <p className="text-xs font-bold text-white">Quartier de l'Hivernage</p>
                     </div>
                     <button className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                        <Navigation size={20} />
                     </button>
                  </div>
               </div>
            </div>

            {/* UPCOMING HIGHLIGHT */}
            <div className="px-6 pb-6">
               <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6 px-2">À suivre</h3>
               <div className="relative rounded-[40px] overflow-hidden aspect-[4/5] shadow-2xl group">
                  <img 
                    src="https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80" 
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                    alt="Marrakech"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-10 left-10 right-10">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="px-3 py-1 bg-rihla text-white text-[9px] font-black rounded-full uppercase tracking-widest">Incontournable</div>
                        <span className="text-[10px] font-bold text-white/60">12:30 — 14:30</span>
                     </div>
                     <h4 className="text-3xl font-black text-white mb-4">Déjeuner au Palais <br/> <span className="text-rihla">Dar Yacout</span></h4>
                     <p className="text-sm text-white/60 leading-relaxed font-medium line-clamp-2">
                        Une institution de la gastronomie marocaine dans un cadre millénaire.
                     </p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'program' && (
          <div className="p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="flex items-center justify-between mb-12">
                <h2 className="text-4xl font-black text-white tracking-tighter">Itinéraire</h2>
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-rihla">
                   <Calendar size={20} />
                </div>
             </div>

             <div className="space-y-12 relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-4 bottom-4 w-px bg-white/5" />

                {[
                  { day: '01', title: 'Casablanca Dream', status: 'completed' },
                  { day: '02', title: 'The Red City Spirit', status: 'active' },
                  { day: '03', title: 'Atlas Mountains', status: 'upcoming' },
                  { day: '04', title: 'Sahara Silence', status: 'upcoming' },
                ].map((d, i) => (
                  <div key={i} className={clsx(
                    "relative pl-16 transition-all duration-500",
                    d.status === 'upcoming' ? "opacity-30 grayscale" : "opacity-100"
                  )}>
                     {/* Timeline Dot */}
                     <div className={clsx(
                       "absolute left-[19px] top-2 w-[10px] h-[10px] rounded-full border-2 border-[#020617] z-10",
                       d.status === 'completed' ? "bg-emerald-500" : d.status === 'active' ? "bg-rihla scale-150 shadow-[0_0_15px_rgba(212,175,55,0.5)]" : "bg-slate-700"
                     )} />

                     <div className={clsx(
                       "p-8 rounded-[32px] border transition-all",
                       d.status === 'active' ? "bg-slate-900 border-white/10 shadow-2xl" : "bg-white/2 border-white/5"
                     )}>
                        <p className="text-[10px] font-black text-rihla uppercase tracking-[0.2em] mb-2">Jour {d.day}</p>
                        <h4 className="text-xl font-black text-white mb-4">{d.title}</h4>
                        <div className="flex gap-2">
                           <button className="flex-1 py-3 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Détails</button>
                           <button className="w-12 h-12 bg-rihla/10 text-rihla rounded-xl flex items-center justify-center hover:bg-rihla hover:text-white transition-all border border-rihla/20">
                              <MapIcon size={16} />
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

      </main>

      {/* ── NANO BANANA BOTTOM NAV ───────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 p-8 z-50">
         <div className="max-w-md mx-auto bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[40px] p-3 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {[
              { id: 'live', icon: Activity, label: 'Live' },
              { id: 'program', icon: Calendar, label: 'Agenda' },
              { id: 'info', icon: Info, label: 'Concierge' },
              { id: 'memories', icon: Heart, label: 'Box' },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  "relative flex-1 flex flex-col items-center gap-1.5 py-4 rounded-[32px] transition-all duration-500",
                  activeTab === tab.id ? "bg-rihla text-white shadow-xl scale-105" : "text-white/30 hover:text-white/60"
                )}
              >
                 <tab.icon size={20} className={activeTab === tab.id ? "animate-pulse" : ""} />
                 <span className="text-[9px] font-black uppercase tracking-tighter">{tab.label}</span>
                 {activeTab === tab.id && (
                   <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />
                 )}
              </button>
            ))}
         </div>
      </nav>

    </div>
  )
}
 scale-105" : "text-white/40"
              )}
            >
              <Zap size={18} />
              <span className="text-[9px] font-black uppercase tracking-tighter">VIP Plus</span>
            </button>
         </div>
      </nav>

    </div>
  )
}
