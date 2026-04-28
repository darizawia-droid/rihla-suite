import { useState, useEffect } from 'react'
import { 
  ShieldAlert, Radio, Truck, MapPin, 
  CloudRain, AlertTriangle, CheckCircle2, 
  Wind, Clock, Users, Zap, Maximize2,
  ChevronRight, Phone, MessageSquare, Info,
  Settings, Bell, Search, Filter, Play, Pause
} from 'lucide-react'
import { clsx } from 'clsx'

interface Alert {
  id: string
  type: 'weather' | 'strike' | 'delay' | 'vip'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  timestamp: string
  location: string
}

const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1', type: 'weather', severity: 'high', title: 'Tempête de Sable - Merzouga',
    message: 'Visibilité réduite à 50m. Itinéraire alternatif suggéré pour le groupe G-204.',
    timestamp: '14:20', location: 'Erfoud/Merzouga'
  },
  {
    id: 'a2', type: 'delay', severity: 'medium', title: 'Retard Vol AT-402',
    message: '60 pax en provenance de Paris arrivant avec 2h de retard. Chauffeurs prévenus.',
    timestamp: '15:05', location: 'CMN Airport'
  },
  {
    id: 'a3', type: 'vip', severity: 'critical', title: 'Alerte VIP - La Mamounia',
    message: 'Monsieur le Ministre (G-881) demande un changement immédiat de programme pour ce soir.',
    timestamp: '15:45', location: 'Marrakech'
  }
]

export function WarRoomPage() {
  const [time, setTime] = useState(new Date().toLocaleTimeString())
  const [activeTab, setActiveTab] = useState<'alerts' | 'fleet' | 'weather'>('alerts')
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans relative">
      
      {/* ── AMBIENT BACKGROUND ─────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rihla/5 rounded-full blur-[120px] -mr-96 -mt-96" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -ml-48 -mb-48" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </div>

      {/* ── TOP MISSION BAR ────────────────────────────────────── */}
      <div className="h-20 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-10 relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-rihla rounded-xl flex items-center justify-center shadow-lg shadow-rihla/20">
                <Radio className="text-white animate-pulse" size={24} />
             </div>
             <div>
                <h1 className="text-xl font-black tracking-tighter uppercase">Operations War Room</h1>
                <p className="text-[10px] text-rihla font-black tracking-[0.3em] uppercase">Mission Control Center</p>
             </div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex gap-4">
             <div className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px] font-bold uppercase text-emerald-500">Live Sync</span>
             </div>
             <div className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
                <Users size={12} className="text-slate-400" />
                <span className="text-[11px] font-bold">12 Groupes Actifs</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Temps Universel</p>
              <p className="text-2xl font-black text-white tabular-nums tracking-tighter">{time}</p>
           </div>
           <div className="flex gap-2">
              <button className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                 <Settings size={18} className="text-slate-400" />
              </button>
              <button className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all relative">
                 <Bell size={18} className="text-slate-400" />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-rihla rounded-full border-2 border-slate-950" />
              </button>
           </div>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ───────────────────────────────────── */}
      <div className="grid grid-cols-12 h-[calc(100vh-80px)] p-6 gap-6 relative z-10">
        
        {/* LEFT COLUMN: LIVE RADAR (8 cols) */}
        <div className="col-span-8 flex flex-col gap-6">
           
           {/* MAP MOCK */}
           <div className="flex-1 bg-white/5 rounded-[40px] border border-white/10 overflow-hidden relative group shadow-2xl">
              <div className="absolute inset-0 bg-slate-900 opacity-80" />
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
                alt="Map Mock" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 group-hover:scale-105 transition-all duration-[10s]"
              />
              
              {/* Map UI Overlay */}
              <div className="absolute top-8 left-8 flex gap-4">
                 <div className="px-5 py-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-rihla animate-pulse" />
                    <span className="text-xs font-bold">Zone de Tension : Merzouga</span>
                 </div>
                 <div className="px-5 py-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-3">
                    <Truck size={14} className="text-emerald-500" />
                    <span className="text-xs font-bold">Flotte : 100% Opérationnelle</span>
                 </div>
              </div>

              {/* Map Pins (Animated) */}
              <div className="absolute top-1/2 left-1/3 group/pin cursor-pointer">
                 <div className="absolute inset-0 w-12 h-12 bg-rihla/40 rounded-full animate-ping -translate-x-4 -translate-y-4" />
                 <div className="relative w-4 h-4 bg-rihla rounded-full border-2 border-white shadow-lg" />
                 <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg opacity-0 group-hover/pin:opacity-100 transition-all whitespace-nowrap">
                    <p className="text-[10px] font-black uppercase">G-204 (48 pax)</p>
                 </div>
              </div>

              <div className="absolute bottom-8 right-8 flex gap-2">
                 <button onClick={() => setIsPlaying(!isPlaying)} className="p-4 bg-rihla rounded-2xl text-white shadow-xl shadow-rihla/20 hover:scale-105 transition-all">
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                 </button>
                 <button className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/20 transition-all">
                    <Maximize2 size={20} />
                 </button>
              </div>
           </div>

           {/* STATS STRIP */}
           <div className="h-32 grid grid-cols-4 gap-6">
              {[
                { label: 'SLA Qualité', val: '99.2%', sub: '+0.4% vs hier', icon: CheckCircle2, color: 'text-emerald-500' },
                { label: 'Retards (Pondéré)', val: '12 min', sub: 'Moyenne nationale', icon: Clock, color: 'text-amber-500' },
                { label: 'NPS Global', val: '88/100', sub: 'Excellent', icon: Zap, color: 'text-rihla' },
                { label: 'Tempête Act.', val: 'Vent 45km/h', sub: 'Sud-Est', icon: Wind, color: 'text-blue-400' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 rounded-[28px] p-5 border border-white/10 flex flex-col justify-between hover:bg-white/[0.08] transition-all">
                   <div className="flex justify-between items-center">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
                      <s.icon size={14} className={s.color} />
                   </div>
                   <div>
                      <p className="text-xl font-black text-white">{s.val}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{s.sub}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* RIGHT COLUMN: ALERTS FEED (4 cols) */}
        <div className="col-span-4 flex flex-col gap-6">
           
           <div className="flex-1 bg-white/5 rounded-[40px] border border-white/10 flex flex-col overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
                 <h3 className="text-lg font-black flex items-center gap-3">
                    <ShieldAlert className="text-rihla" size={20} />
                    Flux d'Alertes IA
                 </h3>
                 <span className="bg-rihla/20 text-rihla text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest">
                    Critique
                 </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                 {MOCK_ALERTS.map(alert => (
                    <div key={alert.id} className={clsx(
                      "p-6 rounded-[28px] border transition-all cursor-pointer group hover:-translate-y-1",
                      alert.severity === 'critical' ? "bg-red-500/10 border-red-500/30" :
                      alert.severity === 'high' ? "bg-amber-500/10 border-amber-500/30" :
                      "bg-white/5 border-white/10 hover:bg-white/10"
                    )}>
                       <div className="flex justify-between items-start mb-3">
                          <span className={clsx(
                            "text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-[0.2em]",
                            alert.severity === 'critical' ? "bg-red-500 text-white" :
                            alert.severity === 'high' ? "bg-amber-500 text-black" :
                            "bg-white/20 text-white"
                          )}>
                             {alert.type} · {alert.timestamp}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold">{alert.location}</span>
                       </div>
                       <h4 className="text-sm font-black mb-2 flex items-center gap-2 group-hover:text-rihla transition-colors">
                          {alert.title}
                          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all translate-x-0 group-hover:translate-x-1" />
                       </h4>
                       <p className="text-xs text-slate-400 leading-relaxed font-medium">
                          {alert.message}
                       </p>
                    </div>
                 ))}
              </div>

              <div className="p-8 border-t border-white/10">
                 <button className="w-full py-4 bg-rihla hover:bg-rihla-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rihla/20 transition-all flex items-center justify-center gap-3">
                    <MessageSquare size={16} /> Contacter Chef d'Opération
                 </button>
              </div>
           </div>

           {/* WEATHER RADAR PREVIEW */}
           <div className="h-48 bg-white/5 rounded-[40px] border border-white/10 p-8 flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
              <div className="flex justify-between items-start">
                 <div>
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Météo Stratégique</h4>
                    <p className="text-2xl font-black">24°C <span className="text-sm font-bold text-slate-400">Marrakech</span></p>
                 </div>
                 <CloudRain className="text-blue-400" size={32} />
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-400 uppercase">Humidité</span>
                    <span>12%</span>
                 </div>
                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 w-1/4" />
                 </div>
              </div>
           </div>
        </div>

      </div>

    </div>
  )
}
