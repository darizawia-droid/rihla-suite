import { useState, useEffect } from 'react'
import { 
  Maximize2, ChevronLeft, ChevronRight, 
  MapPin, Info, Star, Camera, Globe,
  LayoutGrid, Layers, Share2, Plus,
  Sparkles, MousePointer2, ZoomIn
} from 'lucide-react'
import { clsx } from 'clsx'

interface Venue {
  id: string
  name: string
  location: string
  type: 'hotel' | 'gala' | 'experience'
  rating: number
  description: string
  imageUrl: string
  panoramicUrl: string
  hotspots: { x: number; y: number; label: string; details: string }[]
}

const VENUES: Venue[] = [
  {
    id: 'v1',
    name: 'La Mamounia - Grand Salon',
    location: 'Marrakech',
    type: 'gala',
    rating: 5,
    description: 'Espace emblématique pour les soirées de gala les plus prestigieuses du Royaume.',
    imageUrl: 'https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&q=80&w=1200',
    panoramicUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=2000',
    hotspots: [
      { x: 30, y: 40, label: 'Espace Orchestre', details: 'Scène modulable avec acoustique traitée.' },
      { x: 60, y: 55, label: 'Table d\'Honneur', details: 'Dressage argent et cristal Baccarat.' }
    ]
  },
  {
    id: 'v2',
    name: 'Scarabeo Camp - Stone Desert',
    location: 'Agafay',
    type: 'experience',
    rating: 4.8,
    description: 'Une immersion luxueuse dans le désert de pierre, à 45min de Marrakech.',
    imageUrl: 'https://images.unsplash.com/photo-1489447068241-b3490214e879?auto=format&fit=crop&q=80&w=1200',
    panoramicUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2000',
    hotspots: [
      { x: 45, y: 30, label: 'Tente Lounge', details: 'Décoration vintage safari avec tapis berbères.' },
      { x: 80, y: 70, label: 'Espace Astronomie', details: 'Zone d\'observation télescopique sans pollution lumineuse.' }
    ]
  },
  {
    id: 'v3',
    name: 'Riad Fès - Presidential Suite',
    location: 'Fès',
    type: 'hotel',
    rating: 5,
    description: 'L\'élégance andalouse au cœur de la médina spirituelle.',
    imageUrl: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=1200',
    panoramicUrl: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=2000',
    hotspots: [
      { x: 20, y: 60, label: 'Bain à remous privé', details: 'Vue imprenable sur le coucher de soleil sur la médina.' }
    ]
  }
]

export function SiteInspectionPage() {
  const [selectedVenue, setSelectedVenue] = useState(VENUES[0])
  const [viewMode, setViewMode] = useState<'360' | 'grid'>('360')
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Simulation de mouvement panoramique
  useEffect(() => {
    if (viewMode === '360') {
      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 40
        const y = (e.clientY / window.innerHeight - 0.5) * 20
        setMousePos({ x, y })
      }
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [viewMode])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-sans selection:bg-rihla/30">
      
      {/* ── TOP NAV ────────────────────────────────────────────── */}
      <div className="h-16 border-b border-white/10 bg-black/80 backdrop-blur-md flex items-center justify-between px-8 relative z-50">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-3">
              <Camera className="text-rihla" size={20} />
              <h1 className="text-sm font-black uppercase tracking-widest">Site Inspection 360°</h1>
           </div>
           <div className="h-6 w-px bg-white/10" />
           <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
              <button 
                onClick={() => setViewMode('360')}
                className={clsx("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", viewMode === '360' ? "bg-rihla text-white" : "text-slate-400 hover:text-white")}
              >360° View</button>
              <button 
                onClick={() => setViewMode('grid')}
                className={clsx("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", viewMode === 'grid' ? "bg-rihla text-white" : "text-slate-400 hover:text-white")}
              >Catalogue</button>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">
              <Share2 size={12} /> Partager au Client
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-rihla hover:bg-rihla-dark rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-rihla/20">
              <Plus size={12} /> Ajouter au Devis
           </button>
        </div>
      </div>

      <div className="relative h-[calc(100vh-64px)]">
        
        {/* ── 360 VIEWER MODE ────────────────────────────────────── */}
        {viewMode === '360' && (
          <div className="absolute inset-0 overflow-hidden bg-slate-900">
             {/* Panoramic Image with Parallax Effect */}
             <div 
               className="absolute inset-[-100px] transition-transform duration-700 ease-out"
               style={{ 
                 transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(1.1)`,
                 backgroundImage: `url(${selectedVenue.panoramicUrl})`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               }}
             >
                <div className="absolute inset-0 bg-black/20" />
             </div>

             {/* UI Overlay: Venue Info */}
             <div className="absolute top-12 left-12 max-w-md pointer-events-none">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-rihla text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                   <Sparkles size={12} /> Recommandation DMC
                </div>
                <h2 className="text-5xl font-black tracking-tighter mb-4 text-white drop-shadow-2xl">{selectedVenue.name}</h2>
                <div className="flex items-center gap-4 text-white/70 mb-6 drop-shadow-md">
                   <span className="flex items-center gap-1.5 text-xs font-bold"><MapPin size={14} className="text-rihla" /> {selectedVenue.location}</span>
                   <span className="w-1 h-1 rounded-full bg-white/30" />
                   <span className="flex items-center gap-1.5 text-xs font-bold"><Star size={14} className="text-amber-400" fill="currentColor" /> {selectedVenue.rating} / 5</span>
                </div>
                <p className="text-lg text-white/60 font-medium italic leading-relaxed pointer-events-auto">
                   "{selectedVenue.description}"
                </p>
             </div>

             {/* Hotspots */}
             {selectedVenue.hotspots.map((hs, i) => (
               <div 
                 key={i}
                 className="absolute group cursor-pointer"
                 style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                 onClick={() => setActiveHotspot(activeHotspot === hs.label ? null : hs.label)}
               >
                  <div className="relative flex items-center justify-center">
                     <div className="absolute inset-0 w-8 h-8 bg-rihla/40 rounded-full animate-ping" />
                     <div className="relative w-4 h-4 bg-rihla rounded-full border-2 border-white shadow-xl" />
                  </div>
                  
                  {/* Hotspot Tooltip */}
                  <div className={clsx(
                    "absolute top-8 left-1/2 -translate-x-1/2 w-48 bg-black/80 backdrop-blur-xl border border-white/20 p-4 rounded-2xl transition-all duration-300",
                    activeHotspot === hs.label ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                  )}>
                     <h4 className="text-[10px] font-black uppercase text-rihla mb-1 tracking-widest">{hs.label}</h4>
                     <p className="text-[11px] text-white/70 leading-relaxed">{hs.details}</p>
                  </div>
               </div>
             ))}

             {/* Right Controls: Mini Map / Selector */}
             <div className="absolute right-12 top-12 bottom-12 w-80 flex flex-col gap-4">
                <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-y-auto custom-scrollbar">
                   <h3 className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-6">Explorez d'autres lieux</h3>
                   <div className="space-y-4">
                      {VENUES.map(v => (
                        <button 
                          key={v.id}
                          onClick={() => setSelectedVenue(v)}
                          className={clsx(
                            "w-full p-4 rounded-2xl border text-left transition-all group overflow-hidden relative",
                            selectedVenue.id === v.id ? "bg-rihla border-rihla shadow-xl" : "bg-white/5 border-white/10 hover:bg-white/10"
                          )}
                        >
                           <img 
                             src={v.imageUrl} 
                             className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-all duration-500" 
                             alt={v.name}
                           />
                           <div className="relative z-10">
                              <h4 className="text-xs font-black uppercase mb-1">{v.name}</h4>
                              <p className="text-[10px] text-white/50 font-bold">{v.location}</p>
                           </div>
                        </button>
                      ))}
                   </div>
                </div>

                <div className="h-48 bg-rihla rounded-3xl p-6 flex flex-col justify-between shadow-2xl shadow-rihla/30 relative overflow-hidden">
                   <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
                   <div className="relative z-10">
                      <h4 className="text-sm font-black tracking-tighter mb-2 italic">Besoin d'une inspection physique ?</h4>
                      <p className="text-xs text-white/80 font-medium">Réservez un voyage de repérage avec nos experts.</p>
                   </div>
                   <button className="w-full py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all">
                      Réserver FAM Trip
                   </button>
                </div>
             </div>

             {/* Bottom Hint */}
             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 text-white/40 animate-bounce">
                <MousePointer2 size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Bougez la souris pour explorer</span>
             </div>
          </div>
        )}

        {/* ── GRID CATALOGUE MODE ────────────────────────────────── */}
        {viewMode === 'grid' && (
          <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 p-12 overflow-y-auto custom-scrollbar">
             <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                   <div>
                      <h2 className="text-4xl font-black text-slate-900 dark:text-cream tracking-tighter">Catalogue Inspecté</h2>
                      <p className="text-slate-500 font-medium italic mt-2">Accès exclusif aux lieux validés par S'TOURS Quality Label</p>
                   </div>
                   <div className="flex gap-4">
                      <button className="p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-400">
                         <Filter size={18} />
                      </button>
                      <button className="p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-400">
                         <Search size={18} />
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {VENUES.map(v => (
                     <div key={v.id} className="bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-200 dark:border-white/10 group hover:-translate-y-2 transition-all shadow-sm hover:shadow-2xl">
                        <div className="h-64 relative overflow-hidden">
                           <img 
                             src={v.imageUrl} 
                             alt={v.name} 
                             className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" 
                           />
                           <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black uppercase text-white tracking-widest border border-white/20">
                              {v.type}
                           </div>
                           <button 
                             onClick={() => { setSelectedVenue(v); setViewMode('360'); }}
                             className="absolute inset-0 flex items-center justify-center bg-rihla/80 opacity-0 group-hover:opacity-100 transition-all duration-300"
                           >
                              <div className="flex flex-col items-center gap-2">
                                 <ZoomIn className="text-white" size={32} />
                                 <span className="text-[10px] font-black uppercase text-white tracking-[0.2em]">Entrer 360°</span>
                              </div>
                           </button>
                        </div>
                        <div className="p-8">
                           <div className="flex justify-between items-start mb-4">
                              <div>
                                 <h3 className="text-xl font-black text-slate-900 dark:text-cream tracking-tight">{v.name}</h3>
                                 <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{v.location}</p>
                              </div>
                              <div className="flex items-center gap-1 text-amber-500 font-black text-sm">
                                 <Star size={14} fill="currentColor" /> {v.rating}
                              </div>
                           </div>
                           <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-8 line-clamp-2">
                              {v.description}
                           </p>
                           <button className="w-full py-4 border-2 border-slate-900 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white dark:hover:bg-white/10 transition-all">
                              Voir Détails Techniques
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  )
}

function Filter(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}
