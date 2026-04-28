import { useState, useMemo } from 'react'
import { 
  Users, Package, FileText, Banknote, 
  ChevronRight, Calendar, MessageSquare, 
  Download, Clock, CheckCircle2, ShieldCheck,
  Building2, ExternalLink, X, Navigation
} from 'lucide-react'
import { projectsApi, invoicesApi } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { clsx } from 'clsx'

// ── Mock Agencies ─────────────────────────────────────────────────
const AGENCIES = [
  { id: 'ag-1', name: 'Travel Agency XYZ', contact: 'John Doe', logo: 'TA' },
  { id: 'ag-2', name: 'Prestige Tours Paris', contact: 'Marie Lefebvre', logo: 'PT' },
  { id: 'ag-3', name: 'US Adventure Co.', contact: 'Sarah Miller', logo: 'UA' },
]

export function ClientPortalPage() {
  const [selectedAgency, setSelectedAgency] = useState(AGENCIES[0])
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [comments, setComments] = useState<Record<string, string[]>>({
    '2': ['Pouvez-vous confirmer si le déjeuner est inclus ?'],
  })

  // Fetch all projects and invoices, then filter by client_name
  const { data: allProjects, isLoading: loadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.list({ limit: 100 }).then(r => r.data?.items ?? [])
  })

  const { data: allInvoices, isLoading: loadingInvoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => invoicesApi.list({ limit: 100 }).then(r => r.data)
  })

  // Filter data for the "logged in" agency
  const agencyProjects = useMemo(() => 
    allProjects?.filter((p: any) => p.client_name === selectedAgency.name) || [],
  [allProjects, selectedAgency])

  const agencyInvoices = useMemo(() => 
    allInvoices?.filter((i: any) => i.client_name === selectedAgency.name) || [],
  [allInvoices, selectedAgency])

  const tota  const [likes, setLikes] = useState<Record<string, boolean>>({})

  const toggleLike = (id: string) => {
    setLikes(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-hidden font-sans">
      
      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        
        {/* Top Bar (Switcher) */}
        <div className="bg-slate-900 px-8 py-2.5 flex justify-between items-center text-white/40 text-[9px] font-black uppercase tracking-widest shrink-0 z-50">
          <div className="flex items-center gap-4">
            <ShieldCheck size={12} className="text-emerald-500" />
            Accès Sécurisé B2B · {selectedAgency.name}
          </div>
          <div className="flex items-center gap-2">
            <span>Simuler Client :</span>
            {AGENCIES.map(ag => (
              <button 
                key={ag.id} 
                onClick={() => setSelectedAgency(ag)}
                className={clsx("px-2 py-0.5 rounded transition-colors", selectedAgency.id === ag.id ? "bg-white/10 text-white" : "hover:text-white")}
              >
                {ag.logo}
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-40 shrink-0 shadow-sm">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-rihla/5 border border-rihla/10 flex items-center justify-center text-rihla font-black text-2xl shadow-inner">
                {selectedAgency.logo}
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{selectedAgency.name}</h1>
                <div className="flex items-center gap-4 mt-1.5">
                  <p className="text-[10px] text-slate-500 font-bold flex items-center gap-2 uppercase tracking-wider">
                    <Clock size={12} className="text-rihla" /> Dossier Actif : <span className="text-slate-900">Grand Tour Maroc #ST-9921</span>
                  </p>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Édition : <span className="text-emerald-600">Version Finale v2.4</span></p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-5 py-3 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-2 border border-slate-200">
                <FileText size={14} /> Devis PDF
              </button>
              <button className="px-8 py-3 bg-rihla text-white text-[10px] font-black uppercase rounded-2xl shadow-xl shadow-rihla/20 hover:scale-105 active:scale-95 transition-all">
                Valider le projet
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto grid grid-cols-12 gap-10">
            
            {/* Timeline (Collaborative) */}
            <div className="col-span-8 space-y-8">
               <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-3">
                    <Navigation size={16} className="text-rihla" />
                    <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Itinéraire Dynamique Interactif</h3>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[9px] font-black text-slate-400 uppercase">Live Sync</span>
                    </div>
                 </div>
               </div>
               
               <div className="space-y-8 relative">
                <div className="absolute left-6 top-8 bottom-8 w-px bg-slate-200 border-l border-dashed border-slate-300" />
                
                {[
                  { id: '1', day: 'Jour 1', city: 'Marrakech', title: 'Accueil VIP & Palais Ronsard', desc: 'Transfert en Mercedes Classe-V avec accueil protocolaire. Installation au Palais Ronsard, cocktail de bienvenue en présence de la direction.', img: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&q=80&w=800' },
                  { id: '2', day: 'Jour 2', city: 'Marrakech', title: 'Héritage & Secrets de la Médina', desc: 'Visite privée avec historien des Palais Bahia et Badii. Déjeuner gastronomique en terrasse privée surplombant la place Jemaa El Fna.', img: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=800' },
                  { id: '3', day: 'Jour 3', city: 'Agafay', title: 'Expédition Désert & Ciel Étoilé', desc: 'Safari 4x4 premium à travers le désert de pierre. Dîner aux chandelles sous les étoiles et nuitée de prestige au camp Inara.', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800' },
                ].map((item) => (
                  <div key={item.id} className="relative pl-14 group">
                    <div className="absolute left-3.5 top-0 w-5 h-5 rounded-full border-2 border-slate-200 bg-white z-10 group-hover:border-rihla transition-colors flex items-center justify-center">
                       {likes[item.id] && <div className="w-2 h-2 bg-emerald-500 rounded-full" />}
                    </div>
                    
                    <div className={clsx(
                      "bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-rihla/20 transition-all duration-500",
                      likes[item.id] && "ring-2 ring-emerald-500/20 border-emerald-500/30"
                    )}>
                      <div className="flex flex-col md:flex-row h-full">
                        <div className="md:w-52 h-48 md:h-auto overflow-hidden relative">
                          <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                             <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.day}</span>
                          </div>
                        </div>
                        <div className="flex-1 p-7 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="text-[10px] font-black text-rihla uppercase tracking-widest">{item.city}</span>
                                <h4 className="text-lg font-black text-slate-800 mt-1">{item.title}</h4>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => toggleLike(item.id)}
                                  className={clsx(
                                    "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
                                    likes[item.id] ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50"
                                  )}
                                >
                                  <CheckCircle2 size={18} />
                                </button>
                                <button 
                                  onClick={() => setActiveChat(item.id)}
                                  className={clsx(
                                    "w-10 h-10 rounded-2xl flex items-center justify-center transition-all relative",
                                    comments[item.id] ? "bg-rihla text-white shadow-lg shadow-rihla/30" : "bg-slate-50 text-slate-400 hover:text-rihla hover:bg-rihla/5"
                                  )}
                                >
                                  <MessageSquare size={18} />
                                  {comments[item.id] && <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[9px] flex items-center justify-center rounded-full font-black border-2 border-white">{comments[item.id].length}</span>}
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">{item.desc}</p>
                          </div>
                          
                          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wide border-t border-slate-50 pt-4">
                             <div className="flex items-center gap-1.5"><Calendar size={12} /> 12 Oct</div>
                             <div className="flex items-center gap-1.5"><Package size={12} /> VIP Pack</div>
                             {likes[item.id] && <span className="text-emerald-500 ml-auto flex items-center gap-1"><ShieldCheck size={12} /> Approuvé</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
               </div>
            </div>

            {/* Sidebar Stats/Docs */}
            <div className="col-span-4 space-y-6">
               <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-rihla/20 rounded-full blur-3xl group-hover:bg-rihla/40 transition-colors" />
                 <h4 className="font-black text-[10px] uppercase text-white/40 tracking-widest mb-6">Résumé Financier</h4>
                 <div className="space-y-6">
                   <div>
                     <p className="text-4xl font-black">{totalDue.toLocaleString()} <span className="text-xs text-white/40 font-medium">MAD</span></p>
                     <div className="flex items-center gap-2 mt-2">
                        <div className="px-2 py-0.5 bg-amber-500/20 text-amber-500 text-[9px] font-black rounded uppercase">En attente</div>
                        <p className="text-[10px] font-bold text-white/60">Échéance : 15/05</p>
                     </div>
                   </div>
                   <div className="space-y-3">
                     <button className="w-full py-4 bg-rihla text-white text-[10px] font-black uppercase rounded-2xl hover:bg-white hover:text-slate-900 transition-all shadow-lg shadow-rihla/20">
                       Payer l'Acompte (30%)
                     </button>
                     <button className="w-full py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase rounded-2xl hover:bg-white/10 transition-all">
                       Virement Bancaire
                     </button>
                   </div>
                 </div>
               </div>

               <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                 <h4 className="font-black text-[10px] uppercase text-slate-400 tracking-widest mb-6">Conciergerie Dédiée</h4>
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rihla to-rihla-dark flex items-center justify-center text-white font-black text-lg shadow-lg shadow-rihla/20">YE</div>
                    <div>
                      <p className="text-sm font-black text-slate-900">Yassine El Amrani</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Expert Travel Designer</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-[9px] font-black text-emerald-600 uppercase">En ligne</span>
                      </div>
                    </div>
                 </div>
                 <div className="mt-8 grid grid-cols-2 gap-3">
                    <button className="py-3.5 bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                      <MessageSquare size={14} /> Message
                    </button>
                    <button className="py-3.5 bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                      <ExternalLink size={14} /> Meet
                    </button>
                 </div>
               </div>

               {/* Agency Documents */}
               <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                 <h4 className="font-black text-[10px] uppercase text-slate-400 tracking-widest mb-6">Documents Légaux</h4>
                 <div className="space-y-3">
                    {[
                      { icon: FileText, name: 'Conditions Générales de Vente', size: '1.2 MB' },
                      { icon: ShieldCheck, name: 'Attestation Assurance RCP', size: '0.8 MB' },
                      { icon: Building2, name: 'RIB Agence S\'TOURS', size: '0.4 MB' },
                    ].map((doc, i) => (
                      <button key={i} className="w-full p-4 bg-slate-50 rounded-2xl flex items-center gap-3 group hover:bg-rihla/5 transition-colors">
                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-rihla transition-colors">
                          <doc.icon size={14} />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-[11px] font-bold text-slate-700 truncate">{doc.name}</p>
                          <p className="text-[9px] text-slate-400 font-black">{doc.size}</p>
                        </div>
                        <Download size={14} className="text-slate-300 group-hover:text-rihla" />
                      </button>
                    ))}
                 </div>
               </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── COLLABORATION PANEL ────────────────────────────── */}
      <div className={clsx(
        "fixed right-0 top-0 bottom-0 w-[450px] bg-white border-l border-slate-200 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-[100] shadow-2xl",
        activeChat ? "translate-x-0" : "translate-x-full"
      )}>
        {activeChat && (
          <>
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 backdrop-blur-xl">
              <div>
                <h4 className="text-[10px] font-black text-rihla uppercase tracking-[0.25em] mb-1">Collaboration Hub</h4>
                <p className="text-xl font-black text-slate-900 tracking-tight">Commentaires Jour {activeChat}</p>
              </div>
              <button onClick={() => setActiveChat(null)} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all shadow-sm"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              {/* S'TOURS Agent Message */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-[18px] bg-rihla flex items-center justify-center text-white font-black text-xs shrink-0 shadow-lg shadow-rihla/20">ST</div>
                <div className="flex-1">
                  <div className="bg-slate-100 p-5 rounded-[32px] rounded-tl-none border border-slate-200/50 shadow-sm">
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      Bonjour John ! J'ai ajouté une option pour un déjeuner privé chez l'habitant. C'est une expérience très appréciée pour l'authenticité. Souhaitez-vous que je valide cette modification ?
                    </p>
                  </div>
                  <span className="text-[9px] text-slate-400 font-black mt-3 block uppercase tracking-widest">Yassine E. · Designer · 10:45</span>
                </div>
              </div>

              {/* Client Messages */}
              {(comments[activeChat] || []).map((msg, i) => (
                <div key={i} className="flex gap-4 flex-row-reverse">
                  <div className="w-10 h-10 rounded-[18px] bg-slate-900 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-lg">CL</div>
                  <div className="flex-1">
                    <div className="bg-rihla text-white p-5 rounded-[32px] rounded-tr-none shadow-xl shadow-rihla/20">
                      <p className="text-xs leading-relaxed font-bold">{msg}</p>
                    </div>
                    <span className="text-[9px] text-rihla font-black mt-3 block uppercase tracking-widest text-right">Vous · À l'instant</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-10 border-t border-slate-100 bg-white">
              <div className="relative">
                <textarea 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      if (e.currentTarget.value.trim()) {
                        addComment(activeChat!, e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }
                  }}
                  placeholder="Posez une question ou demandez une modification..." 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[32px] p-6 text-xs text-slate-900 outline-none focus:border-rihla focus:bg-white transition-all resize-none h-32 font-medium"
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                   <button className="bg-rihla text-white p-3 rounded-2xl shadow-lg shadow-rihla/30 hover:scale-105 transition-transform">
                     <Navigation size={16} className="rotate-90" />
                   </button>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 font-black uppercase text-center mt-6 tracking-[0.3em]">Protocole B2B Chiffré</p>
            </div>
          </>
        )}
      </div>

      {/* ── FLOATING CONCIERGE BUBBLE ────────────────────── */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-rihla text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[60] group">
         <MessageSquare size={24} className="group-hover:animate-bounce" />
         <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white" />
      </button>

    </div>
  )
}
             </button>
              </div>
              <p className="text-[9px] text-slate-400 font-black uppercase text-center mt-4 tracking-widest">Discussion sécurisée et archivée</p>
            </div>
          </>
        )}
      </div>

    </div>
  )
}
