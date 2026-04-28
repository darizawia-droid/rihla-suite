import { useState, useEffect } from 'react'
import { 
  FileText, CheckCircle2, Send, 
  Download, Search, Filter,
  Building2, Calendar, Clock, ArrowRight,
  ShieldCheck, AlertCircle, RefreshCw,
  Mail, MessageSquare, ExternalLink,
  MapPin, Radio, Activity, Zap,
  Navigation, Plane, User, Phone,
  TrendingUp, TrendingDown,
  ChevronRight, MoreVertical
} from 'lucide-react'
import { clsx } from 'clsx'

interface OperationUpdate {
  id: string
  time: string
  type: 'info' | 'warning' | 'success' | 'critical'
  message: string
  project: string
  staff?: string
}

const MOCK_ALERTS: OperationUpdate[] = [
  { id: '1', time: 'Il y a 2 min', type: 'success', message: 'Pick-up effectué à l’aéroport de Marrakech', project: 'S’TOURS LUXURY GROUP', staff: 'Ahmed (Chauffeur)' },
  { id: '2', time: 'Il y a 15 min', type: 'info', message: 'Check-in confirmé à La Mamounia', project: 'FAM TRIP INCENTIVE', staff: 'Sonia (Guide)' },
  { id: '3', time: 'Il y a 45 min', type: 'warning', message: 'Retard vol AT761 (Paris > RAK) - 40 min d’attente estimée', project: 'B2B PARTNER - SMITH', staff: 'Logistique Vol' },
  { id: '4', time: 'Il y a 1h', type: 'critical', message: 'Incident mineur : Embouteillage Médina - Itinéraire bis activé', project: 'GOLF EXPERIENCE', staff: 'Karim (Guide)' },
]

export function OperationsFulfillmentPage() {
  const [pulse, setPulse] = useState<OperationUpdate[]>(MOCK_ALERTS)
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'pending'>('all')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors overflow-hidden">
      
      {/* ── TOP NAVIGATION ──────────────────────────────────────── */}
      <header className="h-20 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl px-8 flex items-center justify-between z-50">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rihla rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rihla/20">
                 <Radio size={20} className="animate-pulse" />
              </div>
              <div>
                 <h1 className="text-xl font-black tracking-tighter dark:text-cream">Command Center</h1>
                 <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                    Système Live <Zap size={10} fill="currentColor" /> Opérations 100% Fluides
                 </p>
              </div>
           </div>
           
           <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
           
           <div className="flex gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
              {['all', 'critical', 'pending'].map((t) => (
                <button 
                  key={t}
                  onClick={() => setActiveTab(t as any)}
                  className={clsx(
                    "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                    activeTab === t ? "bg-white dark:bg-slate-800 text-rihla shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {t === 'all' ? 'Tous les Groupes' : t === 'critical' ? 'Alertes terrain' : 'En attente'}
                </button>
              ))}
           </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?u=guide${i}`} className="w-8 h-8 rounded-full border-2 border-slate-900 shadow-xl" alt="Guide" />
              ))}
              <div className="w-8 h-8 rounded-full bg-rihla/20 border-2 border-slate-900 flex items-center justify-center text-[10px] font-black text-rihla">+12</div>
           </div>
           <button className="px-6 py-2.5 bg-slate-900 dark:bg-cream dark:text-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
              Export Global Operations
           </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* ── LEFT PANEL: PULSE FEED ────────────────────────────── */}
        <aside className="w-96 border-r border-slate-200 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md flex flex-col">
           <div className="p-6 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                 <Activity size={14} className="text-rihla" /> Flux d'activités IA
              </h2>
              <span className="bg-rihla/10 text-rihla text-[9px] font-black px-2 py-0.5 rounded-full">LIVE</span>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {pulse.map((alert) => (
                <div key={alert.id} className="group relative bg-white dark:bg-white/2 border border-slate-100 dark:border-white/5 p-5 rounded-3xl hover:border-rihla/30 transition-all cursor-pointer">
                   <div className="flex justify-between items-start mb-2">
                      <span className={clsx(
                        "px-2 py-0.5 rounded-full text-[8px] font-black uppercase",
                        alert.type === 'critical' ? "bg-red-500/10 text-red-500" :
                        alert.type === 'warning' ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                      )}>
                        {alert.type}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400">{alert.time}</span>
                   </div>
                   <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 leading-relaxed">
                      {alert.message}
                   </p>
                   <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-white/2">
                      <div>
                         <p className="text-[9px] font-black text-rihla uppercase tracking-widest">{alert.project}</p>
                         <p className="text-[9px] text-slate-500 font-medium">{alert.staff}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-rihla transition-transform group-hover:translate-x-1" />
                   </div>
                </div>
              ))}
           </div>
        </aside>

        {/* ── CENTER PANEL: STRATEGIC MAP & OPS ─────────────────── */}
        <main className="flex-1 relative overflow-hidden flex flex-col bg-slate-100 dark:bg-slate-950">
           
           {/* Interactive Ops Map Placeholder */}
           <div className="relative h-[60%] w-full overflow-hidden">
              <div className="absolute inset-0 bg-slate-900/40 z-10 pointer-events-none" />
              <img 
                src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2070&auto=format&fit=crop" 
                className="w-full h-full object-cover grayscale opacity-20" 
                alt="Map Background" 
              />
              
              {/* Animated Map Markers */}
              <div className="absolute top-[30%] left-[40%] z-20 group">
                 <div className="relative">
                    <div className="absolute -inset-4 bg-rihla/30 rounded-full animate-ping" />
                    <div className="w-4 h-4 bg-rihla rounded-full border-2 border-white relative" />
                    <div className="absolute top-6 -left-20 bg-slate-900 border border-white/10 p-3 rounded-2xl w-40 opacity-0 group-hover:opacity-100 transition-opacity">
                       <p className="text-[9px] font-black text-rihla uppercase">Marrakech</p>
                       <p className="text-[11px] font-bold text-white">4 Groupes Actifs</p>
                    </div>
                 </div>
              </div>

              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 bg-slate-900/80 backdrop-blur-2xl border border-white/10 px-8 py-4 rounded-full flex gap-12">
                 <MapStat label="Groupes" value="12" icon={Users} color="text-rihla" />
                 <MapStat label="Chauffeurs" value="8" icon={Navigation} color="text-emerald-400" />
                 <MapStat label="Guides" value="10" icon={User} color="text-blue-400" />
                 <MapStat label="Alertes" value="2" icon={AlertCircle} color="text-red-400" />
              </div>
           </div>

           {/* ── LOWER SECTION: FULFILLMENT MONITORING ───────────── */}
           <div className="flex-1 bg-white dark:bg-slate-900/50 backdrop-blur-2xl border-t border-slate-200 dark:border-white/5 p-8 overflow-y-auto">
              <div className="flex justify-between items-end mb-8">
                 <div>
                    <h3 className="text-2xl font-black tracking-tighter dark:text-cream">Flux de Réalisation</h3>
                    <p className="text-xs text-slate-500 font-medium italic">Suivi des confirmations fournisseurs & vouchers</p>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-500 hover:text-rihla transition-all"><Filter size={18} /></button>
                    <button className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-500 hover:text-rihla transition-all"><RefreshCw size={18} /></button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <OpsCard 
                    title="Hébergement" 
                    supplier="La Mamounia" 
                    service="5 Suites Deluxe" 
                    status="confirmed" 
                    date="12-14 Mai"
                    price="4 250 €"
                 />
                 <OpsCard 
                    title="Transport" 
                    supplier="Atlas Transports" 
                    service="Transfert Aéroport RAK" 
                    status="sent" 
                    date="12 Mai"
                    price="150 €"
                 />
                 <OpsCard 
                    title="Restauration" 
                    supplier="Palais Faraj" 
                    service="Déjeuner de Gala - 24 pax" 
                    status="pending" 
                    date="13 Mai"
                    price="1 840 €"
                 />
              </div>
           </div>
        </main>

        {/* ── RIGHT PANEL: LOGISTICS RADAR ──────────────────────── */}
        <aside className="w-80 border-l border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-6 hidden xl:flex flex-col gap-8">
           <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Radar Logistique</h3>
              <div className="space-y-6">
                 <RadarItem icon={Plane} label="Suivi Vols" info="3 vols attendus" status="ok" />
                 <RadarItem icon={Building2} label="Allotments" info="2 deadlines demain" status="warning" />
                 <RadarItem icon={ShieldCheck} label="Assurances" info="100% à jour" status="ok" />
              </div>
           </div>

           <div className="flex-1 flex flex-col justify-end">
              <div className="bg-rihla rounded-[32px] p-6 text-white shadow-2xl shadow-rihla/30">
                 <TrendingUp size={32} className="mb-4" />
                 <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Marge Réelle Projet</h4>
                 <p className="text-3xl font-black">24.2%</p>
                 <p className="text-[10px] mt-2 font-medium">+1.4% vs Prévisionnel</p>
                 <button className="w-full mt-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Détails Financiers
                 </button>
              </div>

              <div className="bg-slate-900 border border-white/10 rounded-[32px] p-6 mt-4">
                 <FileText size={24} className="text-rihla mb-4" />
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Archive Opérationnelle</h4>
                 <p className="text-sm font-bold text-white mb-4">Logbook Digital de fin de circuit</p>
                 <button 
                   onClick={() => window.open('/api/field-ops/projects/current/logbook/pdf', '_blank')}
                   className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                 >
                    <Download size={12} /> Générer Logbook Final
                 </button>
              </div>
           </div>
        </aside>

      </div>
    </div>
  )
}

function MapStat({ label, value, icon: Icon, color }: any) {
  return (
    <div className="flex items-center gap-4">
       <div className={clsx("w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center", color)}>
          <Icon size={20} />
       </div>
       <div>
          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">{label}</p>
          <p className="text-xl font-black text-white">{value}</p>
       </div>
    </div>
  )
}

function OpsCard({ title, supplier, service, status, date, price }: any) {
  return (
    <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 p-6 rounded-[32px] hover:shadow-xl hover:shadow-rihla/5 transition-all group">
       <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400">
             {title === 'Hébergement' ? <Building2 size={20} /> : <FileText size={20} />}
          </div>
          <button className="p-2 text-slate-300 hover:text-rihla transition-colors"><MoreVertical size={16} /></button>
       </div>
       <div className="space-y-1 mb-4">
          <p className="text-[9px] font-black text-rihla uppercase tracking-widest">{title}</p>
          <h4 className="text-sm font-black dark:text-cream">{supplier}</h4>
          <p className="text-xs text-slate-500 font-medium">{service}</p>
       </div>
       <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-white/2">
          <div className="flex items-center gap-2">
             <Calendar size={12} className="text-slate-400" />
             <span className="text-[10px] font-bold text-slate-400 uppercase">{date}</span>
          </div>
          <span className={clsx(
            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
            status === 'confirmed' ? "bg-emerald-500/10 text-emerald-500" :
            status === 'sent' ? "bg-blue-500/10 text-blue-500" : "bg-amber-500/10 text-amber-500"
          )}>
            {status}
          </span>
       </div>
    </div>
  )
}

function RadarItem({ icon: Icon, label, info, status }: any) {
  return (
    <div className="flex items-center gap-4 group">
       <div className={clsx(
         "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
         status === 'ok' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
       )}>
          <Icon size={18} />
       </div>
       <div className="flex-1">
          <p className="text-[10px] font-black dark:text-cream uppercase tracking-widest">{label}</p>
          <p className="text-xs text-slate-500 font-medium">{info}</p>
       </div>
       <div className={clsx("w-1.5 h-1.5 rounded-full", status === 'ok' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]")} />
    </div>
  )
}
