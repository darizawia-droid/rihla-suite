import { useState } from 'react'
import { 
  Target, Globe, Users, TrendingUp, Sparkles, 
  Linkedin, Mail, Phone, MapPin, Search, 
  Filter, CheckCircle2, AlertCircle, Zap,
  BarChart3, Globe2, Building2, Send
} from 'lucide-react'
import { clsx } from 'clsx'

interface Lead {
  id: string
  company: string
  type: 'Tour Operator' | 'MICE Agency' | 'Luxury Concierge'
  country: string
  relevance: number // 0-100
  potential_volume: string
  last_interaction: string | null
  status: 'new' | 'contacted' | 'negotiating' | 'partner'
  notes: string
}

const MOCK_LEADS: Lead[] = [
  { 
    id: 'l1', company: 'Exotic Escapes UK', type: 'Tour Operator', country: 'United Kingdom',
    relevance: 94, potential_volume: '€2.5M+', last_interaction: null, status: 'new',
    notes: 'Strong interest in Moroccan luxury riads. High alignment with S\'TOURS catalog.'
  },
  { 
    id: 'l2', company: 'Prestige Events Geneva', type: 'MICE Agency', country: 'Switzerland',
    relevance: 88, potential_volume: '€1.2M+', last_interaction: '2026-04-10', status: 'contacted',
    notes: 'Planning a 200-pax incentive in Marrakech for Q4.'
  },
  { 
    id: 'l3', company: 'Hispano Tours', type: 'Tour Operator', country: 'Spain',
    relevance: 72, potential_volume: '€800k+', last_interaction: null, status: 'new',
    notes: 'Expanding their North Africa portfolio.'
  },
  { 
    id: 'l4', company: 'Tokyo Luxury Travel', type: 'Luxury Concierge', country: 'Japan',
    relevance: 91, potential_volume: '€3.0M+', last_interaction: '2026-04-15', status: 'negotiating',
    notes: 'Looking for exclusive Desert experiences and private jets.'
  },
]

export function LeadGenerationPage() {
  const [search, setSearch] = useState('')
  const [isScanning, setIsScanning] = useState(false)

  const handleScan = () => {
    setIsScanning(true)
    setTimeout(() => setIsScanning(false), 3000)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 transition-colors">
      
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto flex justify-between items-end mb-10">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            Expansion <Target size={10} className="text-rihla" /> Lead Generation IA
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-cream tracking-tighter flex items-center gap-4">
            <Target className="text-rihla" size={36} />
            Lead Generation
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium italic">
            Identifier et cibler de nouveaux partenaires B2B stratégiques à l'international
          </p>
        </div>
        <button 
          onClick={handleScan}
          disabled={isScanning}
          className={clsx(
            "px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-rihla/20",
            isScanning ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-rihla text-white hover:-translate-y-1"
          )}
        >
          {isScanning ? <Zap size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {isScanning ? 'Scan Global en cours...' : 'Lancer Scan IA Marché'}
        </button>
      </div>

      {/* ── MARKET RADAR ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        
        {/* Left: Intelligence Panel */}
        <div className="col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rihla/20 rounded-full blur-3xl" />
              <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                <Globe2 size={20} className="text-rihla" /> Intelligence Marché
              </h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-white/60">Marché Porteur</span>
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Suisse (+14%)</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-white/60">Segment VIP</span>
                    <span className="text-xs font-black text-amber-400 uppercase tracking-widest">En hausse</span>
                 </div>
                 <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-rihla w-3/4" />
                 </div>
                 <p className="text-[10px] text-white/40 italic mt-4 leading-relaxed">
                   L'IA détecte une demande croissante pour le MICE à Tanger et Chefchaouen sur les réseaux professionnels.
                 </p>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-white/10 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Taux de Conversion Lead</h3>
              <div className="flex items-end gap-2 mb-4">
                 <span className="text-4xl font-black text-slate-900 dark:text-cream">24.8%</span>
                 <TrendingUp size={24} className="text-emerald-500 mb-1" />
              </div>
              <p className="text-xs text-slate-500 mb-6 font-medium">Amélioration de **+3.2%** ce mois-ci grâce au ciblage prédictif.</p>
              <div className="grid grid-cols-5 gap-1 h-12">
                 {[40, 60, 50, 90, 70].map((h, i) => (
                    <div key={i} className="bg-rihla/20 rounded-t-sm relative group">
                       <div className="absolute bottom-0 left-0 right-0 bg-rihla rounded-t-sm transition-all" style={{ height: `${h}%` }} />
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right: Lead Table */}
        <div className="col-span-8 bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-rihla/5 rounded-full -mr-20 -mt-20 blur-3xl" />
           
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-slate-900 dark:text-cream tracking-tight flex items-center gap-3">
                 <Users size={24} className="text-rihla" /> Opportunités B2B Détectées
              </h3>
              <div className="relative">
                 <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                   type="text" 
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                   placeholder="Filtrer..." 
                   className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-white/5 border-0 rounded-xl text-xs focus:ring-2 focus:ring-rihla/30 outline-none transition-all"
                 />
              </div>
           </div>

           <div className="space-y-4">
              {MOCK_LEADS.map(lead => (
                 <div key={lead.id} className="group flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-transparent hover:border-rihla/20 transition-all cursor-pointer">
                    <div className="flex items-center gap-5">
                       <div className={clsx(
                         "w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg",
                         lead.relevance >= 90 ? "bg-emerald-500" : lead.relevance >= 80 ? "bg-rihla" : "bg-slate-400"
                       )}>
                          {lead.company[0]}
                       </div>
                       <div>
                          <div className="flex items-center gap-2">
                             <h4 className="text-sm font-black text-slate-900 dark:text-white">{lead.company}</h4>
                             <span className="px-2 py-0.5 bg-white dark:bg-white/10 text-[8px] font-bold uppercase rounded border border-slate-100 dark:border-white/10 text-slate-400">
                                {lead.type}
                             </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                             <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                                <Globe size={10} /> {lead.country}
                             </div>
                             <div className="flex items-center gap-1 text-[10px] text-rihla font-black">
                                <TrendingUp size={10} /> {lead.potential_volume}
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-8">
                       <div className="text-right">
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Score Affinité</div>
                          <div className={clsx("text-xl font-black", lead.relevance >= 90 ? "text-emerald-500" : "text-rihla")}>{lead.relevance}%</div>
                       </div>
                       <button className="p-3 bg-white dark:bg-white/10 rounded-2xl shadow-sm text-slate-400 group-hover:text-rihla group-hover:scale-110 transition-all border border-slate-100 dark:border-white/10">
                          <Send size={16} />
                       </button>
                    </div>
                 </div>
              ))}
           </div>

           <div className="mt-10 pt-10 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Source: LinkedIn Insights + Google Trends API</p>
              <button className="text-[11px] font-black text-rihla hover:underline uppercase tracking-widest flex items-center gap-2">
                 Voir tout le Pipeline <TrendingUp size={12} />
              </button>
           </div>
        </div>

      </div>
    </div>
  )
}
