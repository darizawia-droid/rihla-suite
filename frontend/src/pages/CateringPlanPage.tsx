import { useState } from 'react'
import { 
  Utensils, Calendar, Download, Search, 
  AlertCircle, ChevronRight, FileText, 
  Coffee, Wine, Soup, CheckCircle, Clock
} from 'lucide-react'
import { clsx } from 'clsx'

interface MealEvent {
  id: string
  day: number
  date: string
  type: 'Petit-déjeuner' | 'Déjeuner' | 'Dîner'
  restaurant: string
  menu: string
  status: 'confirmé' | 'en attente' | 'option'
  dietaryNeeds: {
    veg: number
    glutenFree: number
    allergies: string[]
  }
}

const MOCK_MEALS: MealEvent[] = [
  { 
    id: '1', day: 1, date: '12 Mai', type: 'Dîner', restaurant: 'Dar Yacout', 
    menu: 'Menu Signature Royal', status: 'confirmé', 
    dietaryNeeds: { veg: 2, glutenFree: 1, allergies: ['Arachides (1)'] } 
  },
  { 
    id: '2', day: 2, date: '13 Mai', type: 'Déjeuner', restaurant: 'Kasbah Tamadot', 
    menu: 'Déjeuner Berbère Chic', status: 'confirmé', 
    dietaryNeeds: { veg: 3, glutenFree: 0, allergies: [] } 
  },
  { 
    id: '3', day: 2, date: '13 Mai', type: 'Dîner', restaurant: 'Le Jardin', 
    menu: 'Buffet Méditerranéen', status: 'en attente', 
    dietaryNeeds: { veg: 2, glutenFree: 1, allergies: [] } 
  },
]

export function CateringPlanPage() {
  const [meals] = useState<MealEvent[]>(MOCK_MEALS)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 transition-colors pb-20">
      
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto flex justify-between items-end mb-10">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            Opérations <ChevronRight size={10} /> Restauration
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-cream tracking-tighter flex items-center gap-4">
            <Utensils className="text-rihla" size={36} />
            Catering & Dietaries
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium italic">
            Planification des repas et gestion des restrictions alimentaires.
          </p>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-rihla text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rihla/20 hover:-translate-y-0.5 transition-all">
          <Download size={16} /> Export Catering Full Plan
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">
        
        {/* ── LEFT: DIETARY SUMMARY ─────────────────────────────── */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rihla/20 rounded-full blur-3xl" />
              <h3 className="text-xs font-black uppercase tracking-widest text-rihla mb-6">Alerte Diététique Groupe</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-white/40 uppercase mb-1">Végétariens</p>
                    <p className="text-2xl font-black">04 <span className="text-xs text-white/30 font-medium">PAX</span></p>
                 </div>
                 <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-white/40 uppercase mb-1">Sans Gluten</p>
                    <p className="text-2xl font-black">02 <span className="text-xs text-white/30 font-medium">PAX</span></p>
                 </div>
              </div>

              <div className="space-y-3">
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Allergies Critiques</p>
                 <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                    <AlertCircle size={16} />
                    <span className="text-xs font-bold uppercase tracking-tight">Arachides / Fruits à coque (01)</span>
                 </div>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-white/10 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Statut Réservations</h3>
              <div className="space-y-4">
                 <StatusRow label="Confirmés" value={12} color="bg-emerald-500" />
                 <StatusRow label="En attente" value={3} color="bg-amber-500" />
                 <StatusRow label="À réserver" value={1} color="bg-slate-200" />
              </div>
           </div>
        </div>

        {/* ── RIGHT: MEALS TIMELINE ─────────────────────────────── */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
           {meals.map((meal) => (
             <div key={meal.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[32px] p-6 flex items-center gap-6 group hover:border-rihla/30 transition-all">
                <div className="flex flex-col items-center justify-center w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-2xl flex-shrink-0">
                   <span className="text-[10px] font-black text-slate-400 uppercase">Jour</span>
                   <span className="text-2xl font-black text-rihla">{meal.day}</span>
                   <span className="text-[9px] font-bold text-slate-500">{meal.date}</span>
                </div>

                <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-3 mb-1">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/10 text-[9px] font-black uppercase rounded tracking-widest text-slate-500">
                         {meal.type}
                      </span>
                      <span className={clsx(
                         "text-[9px] font-black uppercase tracking-widest",
                         meal.status === 'confirmé' ? "text-emerald-500" : "text-amber-500"
                      )}>
                         ● {meal.status}
                      </span>
                   </div>
                   <h4 className="text-lg font-black dark:text-cream truncate">{meal.restaurant}</h4>
                   <p className="text-xs text-slate-500 font-medium truncate flex items-center gap-2">
                      <Soup size={12} /> {meal.menu}
                   </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                   <div className="flex gap-1">
                      {meal.dietaryNeeds.veg > 0 && <DietTag label="VEG" count={meal.dietaryNeeds.veg} />}
                      {meal.dietaryNeeds.glutenFree > 0 && <DietTag label="GF" count={meal.dietaryNeeds.glutenFree} />}
                   </div>
                   <button className="px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-rihla hover:text-white transition-all rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <FileText size={12} /> Voucher
                   </button>
                </div>
             </div>
           ))}
        </div>

      </div>
    </div>
  )
}

function StatusRow({ label, value, color }: any) {
  return (
    <div className="flex items-center justify-between">
       <div className="flex items-center gap-3">
          <div className={clsx("w-2 h-2 rounded-full", color)} />
          <span className="text-xs font-bold text-slate-500">{label}</span>
       </div>
       <span className="text-sm font-black">{value}</span>
    </div>
  )
}

function DietTag({ label, count }: any) {
  return (
    <span className="px-2 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-[9px] font-black text-rihla">
       {label} x{count}
    </span>
  )
}
