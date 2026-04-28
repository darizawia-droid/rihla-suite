import { useState } from 'react'
import { 
  TrendingUp, TrendingDown, DollarSign, 
  ArrowUpRight, ArrowDownRight, Calendar,
  Wallet, Landmark, Receipt, PieChart,
  ShieldCheck, Info, Search, Filter,
  FileText, Download, Zap, Sparkles
} from 'lucide-react'
import { clsx } from 'clsx'

interface CashFlowItem {
  id: string
  date: string
  type: 'inflow' | 'outflow'
  category: string
  amount: number
  description: string
  status: 'confirmed' | 'pending' | 'projected'
}

const MOCK_FLOW: CashFlowItem[] = [
  { id: '1', date: '2026-04-28', type: 'inflow', category: 'Client Acompte', amount: 450000, description: 'Groupe G-204 (48 pax) - Reste à payer', status: 'pending' },
  { id: '2', date: '2026-04-29', type: 'outflow', category: 'Hôtellerie', amount: 125000, description: 'Règlement Facture Movenpick', status: 'confirmed' },
  { id: '3', date: '2026-05-01', type: 'outflow', category: 'Transport', amount: 85000, description: 'Solde Transport Horizon Q1', status: 'projected' },
  { id: '4', date: '2026-05-05', type: 'inflow', category: 'Booking B2B', amount: 280000, description: 'Exotic Escapes - Virement prévu', status: 'projected' },
]

export function CashPulsePage() {
  const [activeRange, setActiveRange] = useState('90d')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 transition-colors">
      
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            Finance <Landmark size={10} className="text-rihla" /> Pilotage Trésorerie
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-cream tracking-tighter flex items-center gap-4">
            <Wallet className="text-rihla" size={36} />
            Cash Pulse
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium italic">
            Visualisation prédictive des flux de trésorerie et pilotage des décaissements stratégiques
          </p>
        </div>
        
        <div className="flex bg-white dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
           {['30d', '90d', '180d', '1Y'].map(r => (
             <button 
               key={r}
               onClick={() => setActiveRange(r)}
               className={clsx(
                 "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                 activeRange === r ? "bg-rihla text-white shadow-lg" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
               )}
             >
               {r}
             </button>
           ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        
        {/* ── TOP KPIs ────────────────────────────────────────── */}
        <div className="col-span-12 grid grid-cols-4 gap-6">
           {[
             { label: 'Trésorerie Disponible', val: '4.2M MAD', sub: 'Cash en banque', icon: Landmark, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
             { label: 'Burn Rate Mensuel', val: '1.8M MAD', sub: 'Opérations + Salaires', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
             { label: 'Encaissements Prévis.', val: '2.5M MAD', sub: 'Prochains 30 jours', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
             { label: 'Dettes Fournisseurs', val: '850k MAD', sub: 'À régler sous 15j', icon: Receipt, color: 'text-red-500', bg: 'bg-red-500/10' },
           ].map(k => (
             <div key={k.label} className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-white/10 shadow-sm group hover:-translate-y-1 transition-all">
                <div className="flex justify-between items-start mb-6">
                   <div className={clsx("p-3 rounded-2xl", k.bg)}>
                      <k.icon size={20} className={k.color} />
                   </div>
                   <ArrowUpRight size={16} className="text-slate-300 group-hover:text-rihla transition-colors" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{k.label}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-cream">{k.val}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">{k.sub}</p>
             </div>
           ))}
        </div>

        {/* ── FORESIGHT CHART (8 cols) ───────────────────────── */}
        <div className="col-span-8 bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-rihla/5 rounded-full -mr-20 -mt-20 blur-3xl" />
           
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-slate-900 dark:text-cream tracking-tight flex items-center gap-3">
                 <PieChart size={24} className="text-rihla" /> Prévision de Trésorerie
              </h3>
              <div className="flex gap-2">
                 <button className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-xl text-slate-400 hover:text-rihla transition-all">
                    <Download size={16} />
                 </button>
                 <button className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-xl text-slate-400 hover:text-rihla transition-all">
                    <FileText size={16} />
                 </button>
              </div>
           </div>

           {/* MOCK CHART AREA */}
           <div className="h-64 flex items-end gap-1 mb-8">
              {[40, 60, 45, 90, 110, 80, 70, 100, 130, 150, 140, 160].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                   <div className="w-full bg-rihla/10 rounded-t-lg relative group-hover:bg-rihla/20 transition-all overflow-hidden" style={{ height: `${h}px` }}>
                      <div className="absolute bottom-0 left-0 right-0 bg-rihla rounded-t-lg transition-all" style={{ height: i > 8 ? '40%' : '100%' }} />
                      {i > 8 && <div className="absolute top-0 left-0 right-0 bg-blue-500/40 animate-pulse h-full" />}
                   </div>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">S{i+17}</span>
                </div>
              ))}
           </div>

           <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-t border-slate-100 dark:border-white/5 pt-6">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-rihla" /> Confirmé
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500/40" /> Projeté IA
              </div>
              <div className="flex-1" />
              <p className="italic text-rihla">Confiance IA: 94%</p>
           </div>
        </div>

        {/* ── TRANSACTION FEED (4 cols) ─────────────────────── */}
        <div className="col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rihla/20 rounded-full blur-3xl" />
              <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                 <Sparkles size={20} className="text-rihla" /> Smart Forecast
              </h3>
              <p className="text-xs text-white/60 leading-relaxed mb-6 font-medium">
                "Le solde de trésorerie atteindra son point bas le **12 Mai** (1.2M MAD). Nous recommandons d'avancer l'encaissement de la facture **Tokyo Travel** pour sécuriser les salaires de fin de mois."
              </p>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/10">
                 Appliquer Recommandation
              </button>
           </div>

           <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col h-[400px]">
              <h3 className="text-xs font-black text-slate-900 dark:text-cream uppercase tracking-widest mb-6 flex items-center justify-between">
                 Flux Récent
                 <Filter size={14} className="text-slate-400" />
              </h3>
              <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                 {MOCK_FLOW.map(f => (
                   <div key={f.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                         <div className={clsx(
                           "w-10 h-10 rounded-xl flex items-center justify-center",
                           f.type === 'inflow' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                         )}>
                            {f.type === 'inflow' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                         </div>
                         <div>
                            <p className="text-xs font-black text-slate-900 dark:text-white">{f.category}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{f.date}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className={clsx(
                           "text-xs font-black",
                           f.type === 'inflow' ? "text-emerald-500" : "text-red-500"
                         )}>
                            {f.type === 'inflow' ? '+' : '-'}{ (f.amount/1000).toFixed(0) }k
                         </p>
                         <span className={clsx(
                           "text-[8px] font-black uppercase",
                           f.status === 'confirmed' ? "text-emerald-500" : "text-slate-400"
                         )}>
                            {f.status}
                         </span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}
