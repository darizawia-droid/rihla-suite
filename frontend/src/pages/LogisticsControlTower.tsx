import { useState, useEffect } from 'react'
import { 
  Map as MapIcon, Navigation, Truck, 
  Users, AlertCircle, CheckCircle2, 
  Clock, Search, Filter, Phone,
  MessageCircle, ChevronRight, Maximize2,
  Activity, Shield, Zap, X, Car
} from 'lucide-react'
import { clsx } from 'clsx'

// Note: On simule le mouvement des chauffeurs pour la démo
interface DriverPos {
  id: string
  name: string
  lat: number
  lng: number
  status: 'active' | 'idle' | 'warning'
  mission: string
  vehicle: string
}

const MOCK_DRIVERS: DriverPos[] = [
  { id: '1', name: 'Hassan El M.', lat: 31.6295, lng: -7.9811, status: 'active', mission: 'Transfert Aéroport -> Mamounia', vehicle: 'Mercedes V-Class' },
  { id: '2', name: 'Youssef A.', lat: 31.6500, lng: -8.0100, status: 'idle', mission: 'En attente', vehicle: 'Sprinter 12p' },
  { id: '3', name: 'Karim B.', lat: 31.6100, lng: -7.9500, status: 'warning', mission: 'Excursion Ourika', vehicle: 'Toyota Prado' },
]

export function LogisticsControlTower() {
  const [drivers, setDrivers] = useState(MOCK_DRIVERS)
  const [selectedDriver, setSelectedDriver] = useState<DriverPos | null>(null)

  // Simulation de mouvement
  useEffect(() => {
    const interval = setInterval(() => {
      setDrivers(prev => prev.map(d => ({
        ...d,
        lat: d.lat + (Math.random() - 0.5) * 0.001,
        lng: d.lng + (Math.random() - 0.5) * 0.001
      })))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden text-slate-300">
      
      {/* ── TOP NAV ────────────────────────────────────────────── */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-rihla rounded-xl flex items-center justify-center text-white shadow-lg shadow-rihla/20">
             <Navigation size={22} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest text-white">Logistics Control Tower</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter flex items-center gap-2">
              <Activity size={10} className="text-emerald-500" /> Live Fleet Tracking · 24/7 Monitoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button className="px-4 py-1.5 bg-rihla text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Carte</button>
              <button className="px-4 py-1.5 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Liste</button>
           </div>
           <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <div className="text-right">
                 <p className="text-[10px] text-slate-500 font-bold uppercase">Alertes</p>
                 <p className="text-xs font-black text-rihla">2 Critiques</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-rihla/20 flex items-center justify-center text-rihla">
                 <AlertCircle size={16} />
              </div>
           </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* ── LEFT SIDEBAR: DRIVERS LIST ────────────────────────── */}
        <aside className="w-80 border-r border-white/10 flex flex-col bg-slate-900/30">
          <div className="p-6">
             <div className="relative mb-6">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                   placeholder="Rechercher Chauffeur..." 
                   className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-rihla"
                />
             </div>
             
             <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Flotte en Ligne ({drivers.length})</p>
                <Filter size={12} className="text-slate-500" />
             </div>

             <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-250px)] custom-scrollbar">
                {drivers.map(d => (
                  <button 
                    key={d.id}
                    onClick={() => setSelectedDriver(d)}
                    className={clsx(
                      "w-full p-4 rounded-2xl border transition-all text-left group",
                      selectedDriver?.id === d.id ? "bg-rihla/10 border-rihla" : "bg-white/5 border-transparent hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                       <div className={clsx(
                         "w-2 h-2 rounded-full",
                         d.status === 'active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                         d.status === 'warning' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-slate-500"
                       )} />
                       <span className="text-xs font-black text-white">{d.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium mb-1">{d.vehicle}</p>
                    <p className="text-[9px] text-slate-400 italic truncate">{d.mission}</p>
                  </button>
                ))}
             </div>
          </div>
        </aside>

        {/* ── CENTER: THE MAP (Simulée avec des points car Leaflet nécessite config) ── */}
        <main className="flex-1 relative bg-[url('https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png')] bg-cover">
           <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px]" />
           
           {/* Markers simulés sur une "carte" conceptuelle */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[80%] h-[80%] border border-white/5 rounded-[40px] relative">
                 {drivers.map(d => (
                   <div 
                     key={d.id}
                     className="absolute transition-all duration-1000 ease-linear pointer-events-auto group cursor-pointer"
                     style={{ 
                       left: `${((d.lng + 8.05) / 0.15) * 100}%`, 
                       top: `${((d.lat - 31.55) / 0.15) * 100}%` 
                     }}
                     onClick={() => setSelectedDriver(d)}
                   >
                      <div className={clsx(
                        "w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-2xl rotate-45 border-2",
                        d.status === 'active' ? "bg-emerald-500 border-white/20" : 
                        d.status === 'warning' ? "bg-red-500 border-white/20 animate-bounce" : "bg-slate-700 border-white/20"
                      )}>
                         <Truck size={20} className="-rotate-45 text-white" />
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-black text-white shadow-2xl">
                         {d.name} · {d.mission}
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* ── DISPATCH COMMAND PANEL (Overlay) ────────────────── */}
           {selectedDriver && (
             <div className="absolute top-8 right-8 bottom-8 w-96 bg-slate-900/90 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-500 z-50">
                
                {/* Driver Profile Header */}
                <div className="p-8 pb-4 text-center relative">
                   <button onClick={() => setSelectedDriver(null)} className="absolute top-6 right-6 text-slate-500 hover:text-white">
                      <X size={20} />
                   </button>
                   <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-rihla to-rihla-dark mx-auto mb-4 flex items-center justify-center text-3xl font-black text-white shadow-2xl border-4 border-white/5">
                      {selectedDriver.name[0]}
                   </div>
                   <h4 className="text-xl font-black text-white tracking-tighter">{selectedDriver.name}</h4>
                   <p className="text-[10px] font-black text-rihla uppercase tracking-[0.2em] mt-1">Chauffeur Senior Certifié</p>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-4 space-y-8 custom-scrollbar">
                   
                   {/* Vehicle Info */}
                   <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
                      <div className="flex justify-between items-center mb-4">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Véhicule Assigné</p>
                         <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full">En Service</span>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400">
                            <Car size={24} />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-white">{selectedDriver.vehicle}</p>
                            <p className="text-[10px] text-slate-500 font-mono italic">Immat: 44-A-12345</p>
                         </div>
                      </div>
                   </div>

                   {/* Daily Timeline (Planning) */}
                   <div>
                      <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Planning de la Journée</h5>
                      <div className="space-y-6 relative ml-2">
                         <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />
                         
                         <TimelineItem time="08:00" label="Dépôt Garage" status="done" />
                         <TimelineItem time="09:30" label="Pick-up Ménara" status="done" />
                         <TimelineItem time="En cours" label={selectedDriver.mission} status="active" />
                         <TimelineItem time="16:00" label="Transfert Agadir" status="pending" />
                         <TimelineItem time="19:00" label="Fin de service" status="pending" />
                      </div>
                   </div>

                   {/* Messaging Quick-Link */}
                   <div className="p-5 bg-rihla/5 border border-rihla/20 rounded-3xl">
                      <h5 className="text-[10px] font-black text-rihla uppercase tracking-widest mb-4">Message Direct</h5>
                      <div className="flex gap-2">
                         <input 
                            placeholder="Envoyer une instruction..." 
                            className="flex-1 bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-[10px] text-white focus:outline-none"
                         />
                         <button className="w-10 h-10 bg-rihla text-white rounded-xl flex items-center justify-center shadow-lg">
                            <Zap size={16} />
                         </button>
                      </div>
                   </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-8 pt-4 flex gap-3 border-t border-white/10 bg-slate-900/50">
                   <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                      Assigner Mission
                   </button>
                   <button className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all">
                      <Phone size={20} />
                   </button>
                </div>
             </div>
           )}
        </main>

        {/* ── RIGHT PANEL: LOGISTICS ANALYTICS ──────────────────── */}
        <aside className="w-80 border-l border-white/10 flex flex-col bg-slate-900/30 p-6 space-y-6">
           <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Capacité Flotte</h3>
              <div className="space-y-4">
                 <CapBar label="VIP Vans" value={85} color="bg-emerald-500" />
                 <CapBar label="Sprinters" value={42} color="bg-amber-500" />
                 <CapBar label="4x4 Luxury" value={95} color="bg-blue-500" />
              </div>
           </div>

           <div className="p-6 bg-rihla/5 rounded-3xl border border-rihla/20">
              <div className="flex items-center gap-2 mb-4 text-rihla">
                 <Shield size={16} />
                 <h3 className="text-[10px] font-black uppercase tracking-widest">Zone de Risque</h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed italic">
                "Embouteillages signalés sur l'Avenue Mohammed VI. Redirection suggérée pour le transfert Smith."
              </p>
           </div>
        </aside>
      </div>
    </div>
  )
}

function TimelineItem({ time, label, status }: { time: string, label: string, status: 'done' | 'active' | 'pending' }) {
  return (
    <div className="flex gap-4 relative">
       <div className={clsx(
         "w-2 h-2 rounded-full mt-1.5 z-10",
         status === 'done' ? "bg-emerald-500" : status === 'active' ? "bg-rihla animate-pulse" : "bg-white/10"
       )} />
       <div>
          <p className={clsx(
            "text-[10px] font-black uppercase tracking-widest",
            status === 'pending' ? "text-slate-500" : "text-white"
          )}>{time}</p>
          <p className={clsx(
            "text-[11px] font-medium",
            status === 'pending' ? "text-slate-600" : "text-slate-300"
          )}>{label}</p>
       </div>
    </div>
  )
}

function CapBar({ label, value, color }: any) {
  return (
    <div>
       <div className="flex justify-between text-[9px] font-black uppercase mb-1.5">
          <span>{label}</span>
          <span>{value}%</span>
       </div>
       <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className={clsx("h-full transition-all duration-1000", color)} style={{ width: `${value}%` }} />
       </div>
    </div>
  )
}
