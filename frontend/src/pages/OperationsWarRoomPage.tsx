import { useState } from 'react'
import { 
  Layout, Search, Filter, Plus, 
  MoreVertical, Clock, Users, 
  CheckCircle2, AlertCircle, Sparkles,
  ChevronRight, FileText, Send, Calendar
} from 'lucide-react'
import { clsx } from 'clsx'

interface KanbanCard {
  id: string
  title: string
  agency: string
  pax: string
  date: string
  priority: 'low' | 'medium' | 'high'
  tasks: { total: number; done: number }
  aiStatus: 'ready' | 'pending' | 'none'
}

interface KanbanColumn {
  id: string
  title: string
  color: string
  cards: KanbanCard[]
}

const INITIAL_DATA: KanbanColumn[] = [
  {
    id: 'inbox',
    title: 'Nouveaux Leads',
    color: 'bg-blue-500',
    cards: [
      { id: '1', title: 'Groupe Incentive Smith', agency: 'Travel Co UK', pax: '24 PAX', date: 'Oct 2024', priority: 'high', tasks: { total: 5, done: 0 }, aiStatus: 'pending' },
      { id: '2', title: 'Famille Garcia - VIP', agency: 'Direct B2C', pax: '4 PAX', date: 'Dec 2024', priority: 'medium', tasks: { total: 3, done: 1 }, aiStatus: 'ready' },
    ]
  },
  {
    id: 'proposal',
    title: 'Devis & Proposal',
    color: 'bg-purple-500',
    cards: [
      { id: '3', title: 'Circuit Sud Marocain', agency: 'Atlas Voyages', pax: '12 PAX', date: 'Sept 2024', priority: 'medium', tasks: { total: 8, done: 6 }, aiStatus: 'ready' },
    ]
  },
  {
    id: 'logistics',
    title: 'Logistique & Vouchers',
    color: 'bg-amber-500',
    cards: [
      { id: '4', title: 'Marrakech Luxury Retreat', agency: 'Elite Stays', pax: '8 PAX', date: 'Juin 2024', priority: 'high', tasks: { total: 12, done: 4 }, aiStatus: 'none' },
    ]
  },
  {
    id: 'live',
    title: 'LIVE (Sur le Terrain)',
    color: 'bg-emerald-500',
    cards: [
      { id: '5', title: 'Imperial Cities Group', agency: 'Globus', pax: '30 PAX', date: 'En cours', priority: 'high', tasks: { total: 20, done: 18 }, aiStatus: 'none' },
    ]
  }
]

export function OperationsWarRoomPage() {
  const [columns] = useState<KanbanColumn[]>(INITIAL_DATA)

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors overflow-hidden">
      
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <header className="h-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 px-8 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-rihla rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rihla/20">
              <Layout size={20} />
           </div>
           <div>
              <h1 className="text-xl font-black tracking-tighter dark:text-cream">Operations War Room</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flux de travail & Productivité Équipe</p>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
              <button className="px-4 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">Board View</button>
              <button className="px-4 py-1.5 text-slate-500 text-[10px] font-black uppercase tracking-widest">List View</button>
           </div>
           <button className="p-2.5 bg-rihla text-white rounded-xl shadow-lg shadow-rihla/20 hover:scale-105 transition-transform">
              <Plus size={20} />
           </button>
        </div>
      </header>

      {/* ── KANBAN BOARD ────────────────────────────────────────── */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden p-8 flex gap-6 custom-scrollbar">
         {columns.map((col) => (
           <div key={col.id} className="w-80 flex-shrink-0 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4 px-2">
                 <div className="flex items-center gap-2">
                    <div className={clsx("w-2 h-2 rounded-full", col.color)} />
                    <h3 className="text-[11px] font-black uppercase tracking-widest dark:text-cream">{col.title}</h3>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full">{col.cards.length}</span>
                 </div>
                 <button className="text-slate-300 hover:text-rihla"><MoreVertical size={14} /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar pb-10">
                 {col.cards.map((card) => (
                   <div key={card.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-5 rounded-[28px] shadow-sm hover:shadow-xl hover:border-rihla/30 transition-all cursor-grab active:cursor-grabbing group">
                      <div className="flex justify-between items-start mb-3">
                         <span className={clsx(
                           "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                           card.priority === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                         )}>
                            {card.priority} Priority
                         </span>
                         {card.aiStatus === 'ready' && <Sparkles size={14} className="text-rihla animate-pulse" />}
                      </div>

                      <h4 className="text-sm font-black dark:text-cream mb-1 leading-tight group-hover:text-rihla transition-colors">{card.title}</h4>
                      <p className="text-[10px] font-bold text-slate-500 mb-4">{card.agency}</p>

                      <div className="flex items-center gap-4 mb-5">
                         <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                            <Users size={12} /> {card.pax}
                         </div>
                         <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                            <Calendar size={12} /> {card.date}
                         </div>
                      </div>

                      <div className="pt-4 border-t border-slate-50 dark:border-white/2 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <div className="w-full w-24 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                               <div 
                                 className="h-full bg-emerald-500" 
                                 style={{ width: `${(card.tasks.done / card.tasks.total) * 100}%` }} 
                               />
                            </div>
                            <span className="text-[9px] font-black text-slate-400">{card.tasks.done}/{card.tasks.total}</span>
                         </div>
                         <div className="flex -space-x-2">
                            <img src="https://i.pravatar.cc/100?u=user1" className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900" alt="Avatar" />
                            <img src="https://i.pravatar.cc/100?u=user2" className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900" alt="Avatar" />
                         </div>
                      </div>
                   </div>
                 ))}
                 
                 <button className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-rihla/30 hover:text-rihla transition-all">
                    + Ajouter un dossier
                 </button>
              </div>
           </div>
         ))}
      </main>

    </div>
  )
}
