import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  Building2, Users, TrendingUp, Globe, 
  Mail, Phone, MapPin, ChevronRight, 
  Briefcase, Receipt, Star, AlertCircle,
  BarChart3, PieChart, ArrowUpRight, MessageSquare
} from 'lucide-react'
import { clsx } from 'clsx'

export function AgencyDetailPage() {
  const { id = 'AG-882' } = useParams()
  const [activeTab, setActiveTab] = useState<'projects' | 'finance' | 'contacts'>('projects')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 transition-colors pb-20">
      
      {/* ── HEADER & IDENTITY ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
          CRM B2B <ChevronRight size={10} /> Partenaires <ChevronRight size={10} /> {id}
        </div>
        
        <div className="flex justify-between items-start flex-wrap gap-6">
           <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[32px] flex items-center justify-center shadow-xl">
                 <Building2 size={40} className="text-rihla" />
              </div>
              <div>
                 <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-cream tracking-tighter">Luxury Travel Ltd.</h1>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-full tracking-widest">Partenaire Gold</span>
                 </div>
                 <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                    <span className="flex items-center gap-1"><MapPin size={14} /> Londres, UK</span>
                    <span className="flex items-center gap-1"><Globe size={14} /> luxury-travel.co.uk</span>
                 </div>
              </div>
           </div>

           <div className="flex gap-3">
              <button className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2">
                 <MessageSquare size={16} /> Log Interaction
              </button>
              <button className="px-6 py-3 bg-rihla text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-rihla/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                 <Plus size={16} /> Nouveau Dossier Agence
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        
        {/* ── SIDEBAR: STATS & HEALTH ───────────────────────────── */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
           {/* Financial Health */}
           <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rihla/20 rounded-full blur-3xl" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-8">Performance Financière</h3>
              
              <div className="space-y-6 relative z-10">
                 <div>
                    <p className="text-[10px] font-black text-white/40 uppercase mb-1">Volume d'affaires YTD</p>
                    <p className="text-3xl font-black text-white">425 800 <span className="text-sm font-medium text-white/40">€</span></p>
                    <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black mt-1">
                       <TrendingUp size={12} /> +24% vs l'an dernier
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                       <p className="text-[9px] font-black text-white/40 uppercase mb-1">Marge Moyenne</p>
                       <p className="text-xl font-black text-rihla">22.4%</p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                       <p className="text-[9px] font-black text-white/40 uppercase mb-1">Conversion</p>
                       <p className="text-xl font-black text-blue-400">38%</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Satisfaction Score */}
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-white/10 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Satisfaction Partenaire</h3>
                 <Star className="text-amber-500 fill-amber-500" size={16} />
              </div>
              <div className="flex items-end gap-3 mb-6">
                 <span className="text-5xl font-black text-slate-900 dark:text-cream">4.8</span>
                 <span className="text-sm font-bold text-slate-400 mb-2">/ 5.0</span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                "Très satisfaits de la réactivité sur les dossiers VIP. Demande plus de flexibilité sur les conditions d'annulation pour 2026."
              </p>
           </div>
        </div>

        {/* ── MAIN CONTENT: PROJECTS & TIMELINE ────────────────── */}
        <div className="col-span-12 lg:col-span-8">
           {/* Tabs */}
           <div className="flex gap-8 border-b border-slate-200 dark:border-white/5 mb-8">
              {['projects', 'finance', 'contacts'].map((t) => (
                <button 
                   key={t}
                   onClick={() => setActiveTab(t as any)}
                   className={clsx(
                     "pb-4 text-xs font-black uppercase tracking-widest transition-all relative",
                     activeTab === t ? "text-rihla" : "text-slate-400 hover:text-slate-600"
                   )}
                >
                   {t === 'projects' ? 'Dossiers (12)' : t === 'finance' ? 'Facturation' : 'Contacts Agence'}
                   {activeTab === t && <div className="absolute bottom-0 left-0 right-0 h-1 bg-rihla rounded-t-full" />}
                </button>
              ))}
           </div>

           {/* Tab Content: Projects */}
           <div className="space-y-4">
              {[
                { name: 'Grand Tour des Villes Impériales', pax: '14 PAX', status: 'En cours', margin: '24%', date: 'Mai 2024' },
                { name: 'Séminaire Incentive RAK', pax: '45 PAX', status: 'Confirmé', margin: '18%', date: 'Juin 2024' },
                { name: 'Lune de Miel Désert & Mer', pax: '2 PAX', status: 'Devis', margin: '32%', date: 'Sept 2024' },
              ].map((p, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[28px] p-6 hover:shadow-lg transition-all group flex items-center justify-between">
                   <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-rihla transition-colors">
                         <Briefcase size={20} />
                      </div>
                      <div>
                         <h4 className="text-sm font-black dark:text-cream">{p.name}</h4>
                         <p className="text-[11px] text-slate-500 font-medium">{p.pax} · {p.date}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-8">
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marge</p>
                         <p className="text-xs font-black text-emerald-500">{p.margin}</p>
                      </div>
                      <span className={clsx(
                         "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                         p.status === 'En cours' ? "bg-emerald-500/10 text-emerald-500" :
                         p.status === 'Confirmé' ? "bg-blue-500/10 text-blue-500" : "bg-amber-500/10 text-amber-500"
                      )}>
                         {p.status}
                      </span>
                      <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                   </div>
                </div>
              ))}
           </div>

           <Link to="/leads" className="mt-8 flex items-center justify-center p-4 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[28px] text-xs font-bold text-slate-400 hover:border-rihla/40 hover:text-rihla transition-all uppercase tracking-widest">
              Voir tout l'historique partenaire
           </Link>
        </div>

      </div>
    </div>
  )
}

function Plus(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
