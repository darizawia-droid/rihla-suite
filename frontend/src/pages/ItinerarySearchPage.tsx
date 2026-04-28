import { useState } from 'react'
import { 
  Search, Sparkles, History, Filter, 
  MapPin, Clock, Users, ArrowRight,
  Brain, Zap, Heart, Star, Globe, 
  ChevronRight, Calculator, FileText
} from 'lucide-react'
import { clsx } from 'clsx'

interface PastItinerary {
  id: string
  title: string
  client: string
  pax: number
  budget: string
  rating: number
  tags: string[]
  matchScore?: number
}

const PAST_ITINERARIES: PastItinerary[] = [
  { 
    id: 'p1', title: 'Luxury Desert Retreat', client: 'London VIP Group', 
    pax: 12, budget: '€45,000', rating: 4.9, 
    tags: ['Luxury', 'Desert', 'Private Jet', 'Helicopter'] 
  },
  { 
    id: 'p2', title: 'Imperial Cities Culture', client: 'Madrid University', 
    pax: 45, budget: '€18,500', rating: 4.7, 
    tags: ['Culture', 'History', 'Educational', 'Budget'] 
  },
  { 
    id: 'p3', title: 'Atlas Trekking Adventure', client: 'Nature Lovers Oslo', 
    pax: 8, budget: '€12,000', rating: 4.8, 
    tags: ['Nature', 'Active', 'Atlas', 'Sustainable'] 
  },
  { 
    id: 'p4', title: 'Marrakech Incentives', client: 'Tech Corp Paris', 
    pax: 150, budget: '€120,000', rating: 5.0, 
    tags: ['MICE', 'Events', 'Gala', 'Team Building'] 
  },
]

export function ItinerarySearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PastItinerary[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    if (!query) return
    setIsSearching(true)
    setTimeout(() => {
      // Mock semantic search logic
      const scored = PAST_ITINERARIES.map(it => ({
        ...it,
        matchScore: Math.floor(Math.random() * 30) + 70 // 70-100%
      })).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
      setResults(scored)
      setIsSearching(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 transition-colors">
      
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rihla/10 text-rihla rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
          <Brain size={12} /> Mémoire Sémantique S'TOURS
        </div>
        <h1 className="text-5xl font-black text-slate-900 dark:text-cream tracking-tighter mb-4">
          Mémoire d'Expérience
        </h1>
        <p className="text-slate-500 text-lg font-medium italic">
          "Trouve-moi un itinéraire similaire à celui du groupe VIP de Londres en 2024..."
        </p>
      </div>

      {/* ── SEARCH BAR ─────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto mb-16 relative">
        <div className="relative group">
          <div className="absolute inset-0 bg-rihla/20 rounded-[32px] blur-2xl group-focus-within:bg-rihla/30 transition-all" />
          <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-[32px] p-2 shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
            <Search size={24} className="ml-6 text-slate-400" />
            <input 
              type="text" 
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Décrivez votre besoin (ex: Groupe MICE, luxe, désert, 5 jours)..."
              className="flex-1 px-6 py-4 bg-transparent text-lg font-medium text-slate-900 dark:text-cream outline-none placeholder:text-slate-400"
            />
            <button 
              onClick={handleSearch}
              className="bg-rihla text-white px-10 py-4 rounded-[26px] font-black text-xs uppercase tracking-widest hover:bg-rihla-dark transition-all flex items-center gap-2"
            >
              {isSearching ? <Zap size={14} className="animate-spin" /> : <Sparkles size={14} />}
              Chercher
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
           {['Incentive', 'Luxe', 'Nature', 'Moyen Atlas', 'Chefchaouen'].map(tag => (
             <button 
               key={tag}
               onClick={() => setQuery(tag)}
               className="px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs font-bold text-slate-500 hover:text-rihla hover:border-rihla/30 transition-all"
             >
               #{tag}
             </button>
           ))}
        </div>
      </div>

      {/* ── RESULTS ────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
         {results.map(it => (
           <div key={it.id} className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rihla/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-rihla/10 transition-all" />
              
              <div className="flex justify-between items-start mb-6">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rihla/10 rounded-2xl flex items-center justify-center text-rihla">
                       <MapPin size={20} />
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-slate-900 dark:text-cream leading-tight">{it.title}</h3>
                       <p className="text-xs text-slate-500 font-bold">{it.client}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Match IA</div>
                    <div className="text-2xl font-black text-emerald-500">{it.matchScore}%</div>
                 </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                 <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Budget</p>
                    <p className="text-sm font-black text-slate-700 dark:text-white">{it.budget}</p>
                 </div>
                 <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Pax</p>
                    <p className="text-sm font-black text-slate-700 dark:text-white">{it.pax}</p>
                 </div>
                 <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Rating</p>
                    <p className="text-sm font-black text-amber-500 flex items-center gap-1">{it.rating} <Star size={10} fill="currentColor" /></p>
                 </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                 {it.tags.map(tag => (
                   <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {tag}
                   </span>
                 ))}
              </div>

              <div className="flex gap-3">
                 <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2">
                    <Copy size={14} /> Dupliquer & Adapter
                 </button>
                 <button className="p-4 bg-slate-100 dark:bg-white/10 rounded-2xl text-slate-500 hover:text-rihla transition-all border border-transparent hover:border-rihla/20">
                    <ChevronRight size={16} />
                 </button>
              </div>
           </div>
         ))}

         {query && results.length === 0 && !isSearching && (
           <div className="col-span-2 text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
              <History size={48} className="mx-auto text-slate-700 mb-4 opacity-20" />
              <p className="text-slate-500 font-medium italic">Entrez votre recherche pour explorer la mémoire de l'agence.</p>
           </div>
         )}
      </div>

    </div>
  )
}
