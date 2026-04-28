import { useState } from 'react'
import { 
  BarChart3, PieChart, TrendingUp, Globe, 
  Users, Briefcase, Award, Target, 
  ChevronRight, ArrowUpRight, ArrowDownRight,
  MapPin, Calendar, LayoutDashboard
} from 'lucide-react'
import { clsx } from 'clsx'

export function ExecutiveInsightPage() {
  const [timeframe, setTimeframe] = useState('2024')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 transition-colors pb-20">
      
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto flex justify-between items-end mb-10">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            Direction <ChevronRight size={10} /> Insights Stratégiques
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-cream tracking-tighter flex items-center gap-4">
            <LayoutDashboard className="text-rihla" size={36} />
            CEO Command Center
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium italic">
            Analyse de haute précision de la performance et de la croissance de S'TOURS.
          </p>
        </div>

        <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-1 rounded-2xl">
           {['2023', '2024', 'Q1 2025'].map(t => (
             <button 
               key={t}
               onClick={() => setTimeframe(t)}
               className={clsx(
                 "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                 timeframe === t ? "bg-rihla text-white shadow-lg shadow-rihla/20" : "text-slate-400 hover:text-slate-600"
               )}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        
        {/* ── TOP KPIs ─────────────────────────────────────────── */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
           <InsightStatCard 
              label="Chiffre d'Affaires" 
              value="2.4M €" 
              trend="+12%" 
              trendUp={true} 
              icon={TrendingUp} 
              color="text-emerald-500" 
           />
        </div>
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
           <InsightStatCard 
              label="Marge Moyenne" 
              value="24.8%" 
              trend="+2.1%" 
              trendUp={true} 
              icon={Target} 
              color="text-rihla" 
           />
        </div>
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
           <InsightStatCard 
              label="Taux de Signature" 
              value="42%" 
              trend="-4%" 
              trendUp={false} 
              icon={BarChart3} 
              color="text-blue-500" 
           />
        </div>
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
           <InsightStatCard 
              label="Satisfaction (NPS)" 
              value="78" 
              trend="+5" 
              trendUp={true} 
              icon={Award} 
              color="text-amber-500" 
           />
        </div>

        {/* ── MARKET REPARTITION ───────────────────────────────── */}
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[32px] p-8 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-sm font-black uppercase tracking-widest dark:text-cream">Répartition par Marchés</h3>
              <Globe size={20} className="text-slate-300" />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <MarketCircle label="Europe" value="54%" color="#E01937" />
              <MarketCircle label="USA / Canada" value="32%" color="#3b82f6" />
              <MarketCircle label="Middle East" value="14%" color="#10b981" />
           </div>

           <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6">
              <MiniInsight label="France" value="18%" trend="+2%" />
              <MiniInsight label="Espagne" value="12%" trend="-1%" />
              <MiniInsight label="UK" value="15%" trend="+4%" />
              <MiniInsight label="Belgique" value="9%" trend="=" />
           </div>
        </div>

        {/* ── TOP AGENCIES ─────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-4 bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-32 h-32 bg-rihla/20 rounded-full blur-3xl" />
           <h3 className="text-[10px] font-black uppercase tracking-widest text-rihla mb-8">Top 5 Partenaires (CA)</h3>
           
           <div className="space-y-6 relative z-10">
              <AgencyRow name="Luxury Travel Ltd" volume="425k €" growth="+12%" />
              <AgencyRow name="Atlas Horizons" volume="310k €" growth="+8%" />
              <AgencyRow name="Elite Escapes" volume="285k €" growth="+15%" />
              <AgencyRow name="Royal Journeys" volume="190k €" growth="-2%" />
              <AgencyRow name="Sahara Chic" volume="145k €" growth="+22%" />
           </div>

           <button className="w-full mt-10 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
              Détails du CRM B2B
           </button>
        </div>

      </div>
    </div>
  )
}

function InsightStatCard({ label, value, trend, trendUp, icon: Icon, color }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all">
       <div className={clsx("w-10 h-10 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-4", color)}>
          <Icon size={20} />
       </div>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
       <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black dark:text-cream tracking-tight">{value}</span>
          <span className={clsx(
             "text-[10px] font-bold flex items-center gap-0.5",
             trendUp ? "text-emerald-500" : "text-red-500"
          )}>
             {trendUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
             {trend}
          </span>
       </div>
    </div>
  )
}

function MarketCircle({ label, value, color }: any) {
  return (
    <div className="flex flex-col items-center">
       <div className="w-24 h-24 rounded-full border-8 border-slate-100 dark:border-white/5 flex items-center justify-center relative mb-4">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
             <circle 
                cx="48" cy="48" r="40" 
                stroke={color} strokeWidth="8" fill="transparent" 
                strokeDasharray="251" strokeDashoffset={251 - (251 * parseInt(value)) / 100}
             />
          </svg>
          <span className="text-xl font-black dark:text-cream">{value}</span>
       </div>
       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
    </div>
  )
}

function MiniInsight({ label, value, trend }: any) {
  return (
    <div>
       <p className="text-[11px] font-bold dark:text-cream mb-0.5">{label}</p>
       <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">{value}</span>
          <span className={clsx(
             "text-[9px] font-black",
             trend.includes('+') ? "text-emerald-500" : trend === '=' ? "text-slate-400" : "text-red-500"
          )}>{trend}</span>
       </div>
    </div>
  )
}

function AgencyRow({ name, volume, growth }: any) {
  return (
    <div className="flex justify-between items-center group cursor-pointer">
       <div>
          <p className="text-xs font-bold text-white group-hover:text-rihla transition-colors">{name}</p>
          <p className="text-[10px] text-white/40">{volume}</p>
       </div>
       <span className={clsx(
          "text-[9px] font-black px-2 py-0.5 rounded-full",
          growth.includes('+') ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
       )}>
          {growth}
       </span>
    </div>
  )
}
