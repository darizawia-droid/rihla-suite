import { useState } from 'react'
import { 
  Leaf, TreePine, Droplets, Wind, 
  CloudRain, Globe, ChevronRight,
  TrendingDown, Award, PieChart,
  ArrowRight, CheckCircle2, Info,
  Zap, Sun, Heart
} from 'lucide-react'
import { clsx } from 'clsx'

interface OffsetProject {
  id: string
  name: string
  location: string
  type: 'reforestation' | 'energy' | 'water'
  impact: string
  costPerTon: number
  imageUrl: string
}

const PROJECTS: OffsetProject[] = [
  {
    id: 'p1',
    name: 'Atlas Reforestation Initiative',
    location: 'Haut Atlas, Maroc',
    type: 'reforestation',
    impact: '12,000 tonnes CO2 séquestrées',
    costPerTon: 15,
    imageUrl: 'https://images.unsplash.com/photo-1502082553245-f0bc5a63e94b?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'p2',
    name: 'Ouarzazate Solar Park Offset',
    location: 'Ouarzazate, Maroc',
    type: 'energy',
    impact: 'Énergie propre pour 50,000 foyers',
    costPerTon: 12,
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-fe5bb65830bb?auto=format&fit=crop&q=80&w=1200'
  }
]

export function SustainabilityPage() {
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 transition-colors">
      
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">
            Engagement <Leaf size={10} /> Impact Positif
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-cream tracking-tighter flex items-center gap-4">
            Eco-Luxe Footprint
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium italic">
            Mesure, réduction et compensation de l'empreinte carbone pour des expériences de luxe durables.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
              <Award className="text-emerald-500" size={18} />
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">DMC Certifiée Green Label</span>
           </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">
        
        {/* ── KPI ROW ────────────────────────────────────────────── */}
        <div className="col-span-12 grid grid-cols-4 gap-6">
           {[
             { label: 'CO2 Total (YTD)', val: '45.2 t', sub: '-12% vs 2025', icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-500/10' },
             { label: 'Arbres Plantés', val: '1,240', sub: 'Projet Atlas', icon: TreePine, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
             { label: 'Énergie Propre', val: '88%', sub: 'Hôtels sélectionnés', icon: Sun, color: 'text-amber-500', bg: 'bg-amber-500/10' },
             { label: 'Compensation', val: '100%', sub: 'Dossiers VIP', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
           ].map(k => (
             <div key={k.label} className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-200 dark:border-white/10 shadow-sm group hover:-translate-y-1 transition-all">
                <div className="flex justify-between items-start mb-4">
                   <div className={clsx("p-3 rounded-2xl", k.bg)}>
                      <k.icon size={18} className={k.color} />
                   </div>
                   <TrendingDown size={14} className="text-emerald-500" />
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{k.label}</p>
                <p className="text-xl font-black text-slate-900 dark:text-cream">{k.val}</p>
                <p className="text-[10px] text-slate-500 font-medium">{k.sub}</p>
             </div>
           ))}
        </div>

        {/* ── IMPACT ANALYSIS (7 cols) ───────────────────────────── */}
        <div className="col-span-7 bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-200 dark:border-white/10 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-slate-900 dark:text-cream tracking-tight flex items-center gap-3">
                 <PieChart size={24} className="text-emerald-500" /> Analyse par Segment
              </h3>
              <div className="flex gap-2">
                 <button className="px-4 py-1.5 bg-slate-50 dark:bg-white/5 rounded-xl text-[10px] font-black uppercase text-slate-500">Par Dossier</button>
                 <button className="px-4 py-1.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase">Global</button>
              </div>
           </div>

           <div className="space-y-8">
              {[
                { label: 'Transport Aérien', val: '18.4 t', pct: 45, color: 'bg-blue-500' },
                { label: 'Transport Terrestre (Flotte)', val: '8.2 t', pct: 22, color: 'bg-amber-500' },
                { label: 'Hébergement', val: '12.5 t', pct: 28, color: 'bg-emerald-500' },
                { label: 'Activités & Logistique', val: '2.1 t', pct: 5, color: 'bg-purple-500' },
              ].map(item => (
                <div key={item.label}>
                   <div className="flex justify-between items-end mb-2">
                      <div>
                         <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{item.label}</p>
                         <p className="text-[10px] text-slate-500 font-bold">{item.val} CO2e</p>
                      </div>
                      <span className="text-xs font-black">{item.pct}%</span>
                   </div>
                   <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div className={clsx("h-full rounded-full transition-all duration-1000", item.color)} style={{ width: `${item.pct}%` }} />
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-12 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[32px] flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
                 <Zap size={24} />
              </div>
              <div className="flex-1">
                 <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">Optimisation Suggérée</h4>
                 <p className="text-xs text-slate-500 font-medium">
                    Passer 30% de la flotte en hybride sur les circuits Marrakech-Essaouira réduirait votre empreinte annuelle de **4.2 tonnes**.
                 </p>
              </div>
              <ArrowRight className="text-emerald-500" />
           </div>
        </div>

        {/* ── COMPENSATION PROJECTS (5 cols) ─────────────────────── */}
        <div className="col-span-5 space-y-6">
           <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
              <h3 className="text-lg font-black mb-4 flex items-center gap-3">
                 <TreePine size={20} className="text-emerald-400" /> Projets Locaux
              </h3>
              <p className="text-xs text-white/60 leading-relaxed mb-6 font-medium">
                S'TOURS privilégie des projets de compensation basés au Maroc pour un impact social et environnemental local direct.
              </p>
              
              <div className="space-y-4">
                 {PROJECTS.map(proj => (
                   <button 
                     key={proj.id}
                     onClick={() => setSelectedProject(proj)}
                     className={clsx(
                       "w-full p-4 rounded-2xl border text-left transition-all group relative overflow-hidden",
                       selectedProject.id === proj.id ? "bg-emerald-500 border-emerald-500 shadow-xl" : "bg-white/5 border-white/10 hover:bg-white/10"
                     )}
                   >
                      <img src={proj.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:scale-110 transition-all duration-500" alt={proj.name} />
                      <div className="relative z-10 flex justify-between items-center">
                         <div>
                            <h4 className="text-xs font-black uppercase mb-1">{proj.name}</h4>
                            <p className="text-[10px] text-white/50 font-bold">{proj.location}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-xs font-black">{proj.costPerTon}€ <span className="text-[8px] opacity-60">/ tonne</span></p>
                         </div>
                      </div>
                   </button>
                 ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/10">
                 <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Compensation Requise (Mois)</p>
                    <p className="text-sm font-black text-rihla">4.8 tonnes</p>
                 </div>
                 <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all">
                    Financer la Compensation
                 </button>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-200 dark:border-white/10 shadow-sm text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6">
                 <Award size={32} />
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase mb-2">Générer le Rapport Impact</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">
                 Créez un document PDF professionnel pour vos clients MICE détaillant les efforts de durabilité de leur événement.
              </p>
              <button className="flex items-center justify-center gap-2 w-full py-4 bg-slate-50 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-emerald-500 hover:text-white transition-all">
                 <CheckCircle2 size={14} /> Télécharger Rapport (.PDF)
              </button>
           </div>
        </div>

      </div>
    </div>
  )
}
