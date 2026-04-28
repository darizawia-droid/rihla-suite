import { useState } from 'react'
import { 
  ShieldCheck, Star, AlertTriangle, 
  FileText, TrendingDown, TrendingUp,
  Search, Filter, ChevronRight, 
  Hotel, Utensils, Compass, Building,
  History, MessageCircle
} from 'lucide-react'
import { clsx } from 'clsx'

interface Supplier {
  id: string
  name: string
  type: 'hotel' | 'restaurant' | 'guide' | 'transport'
  score: number
  trend: 'up' | 'down' | 'stable'
  lastAudit: string
  contractExpiry: string
  status: 'certified' | 'probation' | 'blacklisted'
}

const MOCK_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'La Mamounia Marrakech', type: 'hotel', score: 4.9, trend: 'stable', lastAudit: '12 Mai 2024', contractExpiry: '31 Dec 2024', status: 'certified' },
  { id: '2', name: 'Restaurant Le Jardin', type: 'restaurant', score: 3.8, trend: 'down', lastAudit: '15 Mai 2024', contractExpiry: '30 Juin 2024', status: 'probation' },
  { id: '3', name: 'Youssef B. (Guide)', type: 'guide', score: 5.0, trend: 'up', lastAudit: '20 Mai 2024', contractExpiry: 'N/A', status: 'certified' },
  { id: '4', name: 'Hôtel Royal Mansour', type: 'hotel', score: 4.9, trend: 'stable', lastAudit: '05 Mai 2024', contractExpiry: '31 Dec 2025', status: 'certified' },
]

export function SupplierAuditPage() {
  const [filter, setFilter] = useState<'all' | 'hotel' | 'restaurant' | 'guide'>('all')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 transition-colors pb-20">
      
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto flex justify-between items-end mb-10">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            Qualité & Réseau <ChevronRight size={10} /> Audit Prestataires
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-cream tracking-tighter flex items-center gap-4">
            <ShieldCheck className="text-rihla" size={36} />
            Supplier Quality Hub
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium italic">
            Garantir l'excellence S'TOURS via un contrôle rigoureux de notre écosystème de partenaires.
          </p>
        </div>

        <div className="flex gap-4">
           <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-6">
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Moyenne Réseau</p>
                 <p className="text-xl font-black text-emerald-500">4.72</p>
              </div>
              <div className="w-px h-8 bg-slate-100 dark:bg-white/5" />
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Alertes Actives</p>
                 <p className="text-xl font-black text-rihla">3</p>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        
        {/* ── FILTERS & LIST ────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
           <div className="flex gap-4 items-center mb-6 overflow-x-auto pb-2">
              {['all', 'hotel', 'restaurant', 'guide'].map((f) => (
                <button 
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={clsx(
                    "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                    filter === f ? "bg-rihla text-white shadow-lg shadow-rihla/20" : "bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-white/10 hover:text-slate-600"
                  )}
                >
                  {f === 'all' ? 'Tous' : f === 'hotel' ? 'Hôtels' : f === 'restaurant' ? 'Restaurants' : 'Guides'}
                </button>
              ))}
           </div>

           <div className="space-y-4">
              {MOCK_SUPPLIERS.filter(s => filter === 'all' || s.type === filter).map((s) => (
                <div key={s.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[28px] p-6 hover:shadow-xl transition-all group flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-rihla transition-colors">
                         {s.type === 'hotel' ? <Hotel size={24} /> : s.type === 'restaurant' ? <Utensils size={24} /> : <Compass size={24} />}
                      </div>
                      <div>
                         <div className="flex items-center gap-3">
                            <h4 className="text-sm font-black dark:text-cream">{s.name}</h4>
                            <span className={clsx(
                               "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                               s.status === 'certified' ? "bg-emerald-500/10 text-emerald-500" :
                               s.status === 'probation' ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                            )}>
                               {s.status}
                            </span>
                         </div>
                         <p className="text-[11px] text-slate-500 font-medium">Dernier audit : {s.lastAudit} · Contrat : {s.contractExpiry}</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-8">
                      <div className="text-right">
                         <div className="flex items-center gap-1 justify-end">
                            <span className="text-lg font-black dark:text-cream">{s.score}</span>
                            <Star size={14} className="text-amber-500 fill-amber-500" />
                         </div>
                         <div className={clsx(
                            "flex items-center gap-1 justify-end text-[9px] font-black",
                            s.trend === 'up' ? "text-emerald-500" : s.trend === 'down' ? "text-red-500" : "text-slate-400"
                         )}>
                            {s.trend === 'up' ? <TrendingUp size={10} /> : s.trend === 'down' ? <TrendingDown size={10} /> : null}
                            {s.trend === 'up' ? '+0.2' : s.trend === 'down' ? '-0.5' : 'stable'}
                         </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-200 group-hover:translate-x-1 transition-transform" />
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* ── QUALITY ALERTS SIDEBAR ──────────────────────────── */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
           <div className="bg-amber-500/10 border border-amber-500/20 rounded-[32px] p-8">
              <div className="flex items-center gap-3 mb-6 text-amber-600">
                 <AlertTriangle size={20} />
                 <h3 className="text-xs font-black uppercase tracking-widest">Alertes Qualité</h3>
              </div>
              <div className="space-y-4">
                 <div className="p-4 bg-white dark:bg-slate-900/50 rounded-2xl shadow-sm">
                    <p className="text-[10px] font-black text-rihla uppercase mb-1">Feedback Négatif</p>
                    <p className="text-xs font-bold dark:text-cream mb-1">Restaurant Le Jardin</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">"Le service était extrêmement lent hier soir (Groupe Smith)."</p>
                    <button className="mt-3 text-[9px] font-black text-rihla uppercase tracking-widest flex items-center gap-1">
                       Ouvrir Ticket Incident <ChevronRight size={10} />
                    </button>
                 </div>
                 <div className="p-4 bg-white dark:bg-slate-900/50 rounded-2xl shadow-sm opacity-60">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Contrat Expiré</p>
                    <p className="text-xs font-bold dark:text-cream">Hôtel Sofitel Agadir</p>
                    <p className="text-[10px] text-slate-500">Tarif 2024 non encore signé.</p>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 rounded-[32px] p-8 text-white">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">Certification S'TOURS</h3>
              <p className="text-sm font-medium leading-relaxed mb-6">
                 "Seuls les prestataires ayant une note moyenne {'>'} 4.2 et un audit valide de moins de 6 mois sont éligibles pour les dossiers VIP."
              </p>
              <button className="w-full py-4 bg-rihla text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rihla/20">
                 Lancer un Nouvel Audit
              </button>
           </div>
        </div>

      </div>
    </div>
  )
}
