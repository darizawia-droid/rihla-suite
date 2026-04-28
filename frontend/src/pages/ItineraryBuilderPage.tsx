import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { 
  Plus, Calendar, Clock, MapPin, 
  Hotel, Utensils, Car, Camera, 
  ChevronRight, GripVertical, Trash2,
  Sparkles, Save, Share2, Map as MapIcon,
  Search, Filter, ArrowRight, Zap, Info,
  Loader2, Wand2, X
} from 'lucide-react'
import { clsx } from 'clsx'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { itinerariesApi } from '@/lib/api'

export function ItineraryBuilderPage() {
  const { projectId } = useParams()
  const queryClient = useQueryClient()
  const [activeDayId, setActiveDayId] = useState<string | null>(null)
  const [showAiModal, setShowAiModal] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiDuration, setAiDuration] = useState(7)

  // Fetch Itineraries for this project
  const { data: itineraries, isLoading } = useQuery({
    queryKey: ['itineraries', projectId],
    queryFn: () => itinerariesApi.byProject(projectId!).then(r => r.data)
  })

  const activeItinerary = itineraries?.[0] // Using first one for demo
  const days = activeItinerary?.days || []

  // Magic Generation Mutation
  const generateMutation = useMutation({
    mutationFn: (data: any) => itinerariesApi.generateFull(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itineraries', projectId] })
      setShowAiModal(false)
      setAiPrompt('')
    }
  })

  const totalPrice = days.reduce((sum, d) => sum + (d.distance_km || 0), 0) // Mock price

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-950 text-rihla"><Loader2 className="animate-spin" /></div>

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      
      {/* ── LEFT: INVENTORY BANK ────────────────────────────────── */}
      <div className="w-80 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 flex flex-col">
         <div className="p-6 border-b border-slate-200 dark:border-white/5">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
               <Plus size={16} className="text-rihla" /> Catalogue Items
            </h2>
            <div className="relative mb-4">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
               <input 
                 type="text" 
                 placeholder="Chercher hotel, resto..." 
                 className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs outline-none focus:border-rihla"
               />
            </div>
            <div className="flex gap-2">
               {['🏨', '🍽️', '🚗', '🎟️'].map(emoji => (
                 <button key={emoji} className="flex-1 py-2 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-rihla/10 transition-all text-sm">
                   {emoji}
                 </button>
               ))}
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {[
              { type: 'hotel', title: 'Riad Fes', price: '450€', icon: Hotel },
              { type: 'activity', title: 'Dromadaires Agafay', price: '65€', icon: Camera },
              { type: 'meal', title: 'Resto Al Fassia', price: '45€', icon: Utensils },
              { type: 'transport', title: 'SUV 4x4 Luxe', price: '180€', icon: Car },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-white dark:bg-white/2 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing group">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-rihla transition-colors">
                       <item.icon size={18} />
                    </div>
                    <div className="flex-1">
                       <h4 className="text-[11px] font-black uppercase">{item.title}</h4>
                       <p className="text-[10px] text-slate-500 font-bold">{item.price}</p>
                    </div>
                    <Plus size={14} className="text-slate-300 group-hover:text-rihla" />
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* ── CENTER: BUILDER TIMELINE ────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950">
         
         {/* Top Toolbar */}
         <div className="h-16 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-cream">Itinéraire Projet</h3>
               <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />
               <div className="text-xs font-bold text-rihla">{days.length} Jours / {totalPrice}€ Total</div>
            </div>
            <div className="flex gap-3">
               <button 
                 onClick={() => setShowAiModal(true)}
                 className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all"
               >
                  <Sparkles size={12} fill="currentColor" /> AI Magic Builder
               </button>
               <button className="flex items-center gap-2 px-6 py-2 bg-rihla text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rihla/20">
                  <Save size={12} /> Sauvegarder
               </button>
            </div>
         </div>

         {/* Timeline */}
         <div className="flex-1 overflow-x-auto p-8 flex gap-8 custom-scrollbar">
            {days.length === 0 && !generateMutation.isPending && (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                 <Wand2 size={48} className="mb-4 text-rihla" />
                 <p className="text-sm font-bold">Aucun itinéraire pour l'instant.</p>
                 <button onClick={() => setShowAiModal(true)} className="mt-4 text-rihla text-xs font-black uppercase underline">Utiliser l'IA pour commencer</button>
              </div>
            )}

            {generateMutation.isPending && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                 <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-600 animate-pulse">
                    <Sparkles size={40} />
                 </div>
                 <div className="text-indigo-600 font-black animate-bounce">Génération du circuit idéal en cours...</div>
              </div>
            )}

            {!generateMutation.isPending && days.map((day) => (
              <div 
                key={day.id}
                className={clsx(
                  "w-80 flex-shrink-0 flex flex-col gap-4 transition-all duration-500",
                  activeDayId === day.id ? "scale-100 opacity-100" : "scale-95 opacity-60 grayscale-[0.5]"
                )}
                onClick={() => setActiveDayId(day.id)}
              >
                 <div className="flex justify-between items-center px-4">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Jour {day.day_number}</h4>
                      {day.ai_generated && <Zap size={10} className="text-rihla" fill="currentColor" />}
                    </div>
                    <span className="text-[9px] font-black text-slate-500 uppercase">{day.city}</span>
                 </div>
                 
                 <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-200 dark:border-white/10 shadow-sm flex-1 flex flex-col gap-4 overflow-y-auto">
                    <h5 className="text-lg font-black text-slate-900 dark:text-cream leading-tight">{day.title}</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-4 italic border-l-2 border-rihla/20 pl-4">
                       {day.description}
                    </p>

                    <div className="space-y-3 mt-4">
                       <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 group relative">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                <Hotel size={14} className="text-blue-500" />
                             </div>
                             <div className="flex-1 min-w-0">
                                <h5 className="text-[11px] font-black truncate">{day.hotel}</h5>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">{day.hotel_category}</p>
                             </div>
                          </div>
                       </div>
                       {day.activities?.map((act: string, idx: number) => (
                         <div key={idx} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-3">
                               <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                  <Camera size={14} className="text-emerald-500" />
                               </div>
                               <h5 className="text-[11px] font-black truncate">{act}</h5>
                            </div>
                         </div>
                       ))}
                    </div>

                    <button className="w-full mt-auto py-3 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:border-rihla hover:text-rihla transition-all">
                       + Modifier
                    </button>
                 </div>
              </div>
            ))}

            {!generateMutation.isPending && days.length > 0 && (
              <button className="w-16 h-full flex-shrink-0 bg-slate-200/50 dark:bg-white/5 rounded-[32px] border-2 border-dashed border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-400 hover:bg-rihla/10 hover:border-rihla transition-all">
                 <Plus size={24} />
              </button>
            )}
         </div>
      </div>

      {/* ── RIGHT: INTELLIGENCE ─────────────────────────────────── */}
      <div className="w-96 border-l border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 p-8 hidden xl:flex flex-col gap-8">
         <div className="bg-slate-900 rounded-[32px] h-64 overflow-hidden border border-white/5 relative group">
            <img 
              src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10">
               <p className="text-[10px] font-black text-white/40 uppercase mb-1">Optimisation Route</p>
               <div className="flex items-center gap-2">
                  <MapIcon size={12} className="text-rihla" />
                  <span className="text-xs font-bold text-white">{days.length > 0 ? 'Parcours Validé' : 'En attente...'}</span>
               </div>
            </div>
         </div>

         <div className="flex-1 space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <Sparkles size={14} className="text-rihla" /> Intelligence Itinéraire
            </h3>

            <div className="p-5 bg-rihla/5 border border-rihla/20 rounded-[28px] relative overflow-hidden group">
               <h4 className="text-xs font-black text-rihla mb-2 flex items-center gap-2">
                  <Zap size={14} /> Suggestions IA
               </h4>
               <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                  L'IA analyse vos choix en temps réel pour optimiser le temps de trajet et le confort des voyageurs.
               </p>
            </div>

            <div className="p-5 bg-indigo-600 rounded-[28px] text-white shadow-xl shadow-indigo-600/20">
               <h4 className="text-xs font-black mb-2">Marge Estimée</h4>
               <div className="text-2xl font-black mb-1">22.4%</div>
               <p className="text-[10px] text-white/70">Optimisé par RIHLA Genius</p>
            </div>
         </div>
      </div>

      {/* ── AI MAGIC MODAL ─────────────────────────────────────── */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
           <div className="w-full max-w-xl bg-slate-900 rounded-[40px] border border-white/10 p-10 space-y-8 animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                       <Sparkles size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black dark:text-cream">Magic Itinerary Builder</h3>
                       <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">IA Claude 3.5 Sonnet Power</p>
                    </div>
                 </div>
                 <button onClick={() => setShowAiModal(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Décrivez le voyage de vos rêves</label>
                 <textarea 
                   value={aiPrompt}
                   onChange={(e) => setAiPrompt(e.target.value)}
                   placeholder="ex: Un circuit VIP de 7 jours passant par les villes impériales avec un focus sur la gastronomie et le design contemporain..."
                   className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-sm text-white focus:outline-none focus:border-indigo-500 h-32"
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Durée (Jours)</label>
                    <input 
                      type="number" 
                      value={aiDuration}
                      onChange={(e) => setAiDuration(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Style</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none appearance-none">
                       <option>Ultra-Luxe</option>
                       <option>Aventure</option>
                       <option>Famille</option>
                    </select>
                 </div>
              </div>

              <button 
                onClick={() => generateMutation.mutate({ project_id: projectId, prompt: aiPrompt, duration_days: aiDuration })}
                disabled={!aiPrompt || generateMutation.isPending}
                className="w-full py-6 bg-indigo-600 text-white font-black uppercase text-xs tracking-widest rounded-3xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {generateMutation.isPending ? 'L\'IA conçoit votre circuit...' : 'Générer l\'Itinéraire Magique'}
              </button>
           </div>
        </div>
      )}

    </div>
  )
}
