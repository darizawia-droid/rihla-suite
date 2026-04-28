import { useState } from 'react'
import { 
  Truck, Car, Gauge, Fuel, AlertCircle, 
  ChevronRight, Calculator, Luggage, Users,
  CheckCircle, Settings, MapPin, Wrench
} from 'lucide-react'
import { clsx } from 'clsx'

interface Vehicle {
  id: string
  model: string
  type: 'Luxury Sedan' | 'SUV 4x4' | 'Van' | 'Minibus' | 'Bus'
  paxCapacity: number
  luggageCapacity: number // in standard large bags
  status: 'available' | 'on_trip' | 'maintenance'
  licensePlate: string
  fuelLevel: number
}

const FLEET: Vehicle[] = [
  { id: '1', model: 'Mercedes Classe S', type: 'Luxury Sedan', paxCapacity: 3, luggageCapacity: 2, status: 'available', licensePlate: '123-MAR', fuelLevel: 85 },
  { id: '2', model: 'Toyota Land Cruiser V8', type: 'SUV 4x4', paxCapacity: 4, luggageCapacity: 4, status: 'on_trip', licensePlate: '456-RAK', fuelLevel: 40 },
  { id: '3', model: 'Mercedes Vito XL', type: 'Van', paxCapacity: 7, luggageCapacity: 8, status: 'available', licensePlate: '789-CAS', fuelLevel: 100 },
  { id: '4', model: 'Mercedes Sprinter', type: 'Minibus', paxCapacity: 17, luggageCapacity: 15, status: 'maintenance', licensePlate: '000-TGR', fuelLevel: 20 },
]

export function FleetOptimizerPage() {
  const [pax, setPax] = useState(4)
  const [largeBags, setLargeBags] = useState(4)
  const [cabinBags, setCabinBags] = useState(4)
  
  const totalVolume = largeBags + (cabinBags * 0.5)
  const suggestedVehicles = FLEET.filter(v => v.paxCapacity >= pax && v.luggageCapacity >= totalVolume)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 transition-colors pb-20">
      
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto flex justify-between items-end mb-10">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            Logistique <ChevronRight size={10} /> Flotte
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-cream tracking-tighter flex items-center gap-4">
            <Truck className="text-rihla" size={36} />
            Fleet Optimizer
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium italic">
            Intelligence d'assignation des véhicules et gestion de capacité.
          </p>
        </div>

        <div className="flex gap-4">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-6 py-2 rounded-2xl flex items-center gap-4">
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-400 uppercase">Véhicules Actifs</p>
                 <p className="text-xl font-black">24/30</p>
              </div>
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                 <Gauge size={20} />
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">
        
        {/* ── LEFT: CAPACITY CALCULATOR ─────────────────────────── */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rihla/20 rounded-full blur-3xl" />
              <h3 className="text-xs font-black uppercase tracking-widest text-rihla mb-8 flex items-center gap-2">
                 <Calculator size={14} /> Calculateur de Capacité
              </h3>
              
              <div className="space-y-8 relative z-10">
                 <div className="space-y-4">
                    <label className="flex justify-between items-center text-[10px] font-black uppercase text-white/40">
                       Nombre de Passagers (PAX) <span>{pax}</span>
                    </label>
                    <input 
                       type="range" min="1" max="50" value={pax} 
                       onChange={(e) => setPax(parseInt(e.target.value))}
                       className="w-full accent-rihla"
                    />
                 </div>

                 <div className="space-y-4">
                    <label className="flex justify-between items-center text-[10px] font-black uppercase text-white/40">
                       Valises Larges <span>{largeBags}</span>
                    </label>
                    <input 
                       type="range" min="0" max="40" value={largeBags} 
                       onChange={(e) => setLargeBags(parseInt(e.target.value))}
                       className="w-full accent-rihla"
                    />
                 </div>

                 <div className="space-y-4">
                    <label className="flex justify-between items-center text-[10px] font-black uppercase text-white/40">
                       Bags Cabine / Golf <span>{cabinBags}</span>
                    </label>
                    <input 
                       type="range" min="0" max="20" value={cabinBags} 
                       onChange={(e) => setCabinBags(parseInt(e.target.value))}
                       className="w-full accent-rihla"
                    />
                 </div>

                 <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-white/60">Volume Total Estimé</span>
                       <span className="text-2xl font-black text-rihla">{totalVolume} <span className="text-[10px] uppercase opacity-40">Units</span></span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-white/10">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Alertes Maintenance</h3>
              <div className="space-y-4">
                 <div className="flex items-center gap-4 p-3 bg-red-500/5 border border-red-500/10 rounded-2xl">
                    <Wrench size={16} className="text-red-500" />
                    <div>
                       <p className="text-[10px] font-black text-red-600 uppercase">Sprinter (000-TGR)</p>
                       <p className="text-[9px] text-red-500/60 font-bold uppercase">Vidange & Freins - J-1</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* ── RIGHT: SUGGESTED VEHICLES ─────────────────────────── */}
        <div className="col-span-12 lg:col-span-8">
           <div className="mb-6 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">
                 Véhicules suggérés ({suggestedVehicles.length})
              </h2>
              <div className="flex gap-2">
                 <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl"><Settings size={14} /></button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestedVehicles.map((v) => (
                <div key={v.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[32px] p-6 group hover:border-rihla/30 transition-all">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-rihla transition-colors">
                         {v.type === 'Luxury Sedan' ? <Car size={24} /> : <Truck size={24} />}
                      </div>
                      <span className={clsx(
                         "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                         v.status === 'available' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                      )}>
                         {v.status.replace('_', ' ')}
                      </span>
                   </div>

                   <h4 className="text-lg font-black dark:text-cream mb-1">{v.model}</h4>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{v.licensePlate}</p>

                   <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center gap-2">
                         <Users size={14} className="text-slate-300" />
                         <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{v.paxCapacity} Places</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <Luggage size={14} className="text-slate-300" />
                         <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{v.luggageCapacity} Valises</span>
                      </div>
                   </div>

                   <div className="space-y-2 mb-8">
                      <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                         <span>Carburant</span>
                         <span className={v.fuelLevel < 30 ? 'text-red-500' : 'text-slate-500'}>{v.fuelLevel}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                         <div 
                           className={clsx("h-full transition-all duration-1000", v.fuelLevel < 30 ? 'bg-red-500' : 'bg-emerald-500')} 
                           style={{ width: `${v.fuelLevel}%` }} 
                         />
                      </div>
                   </div>

                   <button className="w-full py-4 bg-slate-900 dark:bg-white/5 dark:hover:bg-rihla hover:bg-rihla text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-950/20 flex items-center justify-center gap-2">
                      <MapPin size={12} /> Assigner au Projet
                   </button>
                </div>
              ))}
              
              {suggestedVehicles.length === 0 && (
                <div className="col-span-2 py-20 text-center bg-white/30 dark:bg-white/2 rounded-[32px] border border-dashed border-slate-200 dark:border-white/10">
                   <AlertCircle size={40} className="mx-auto text-slate-300 mb-4" />
                   <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Aucun véhicule disponible pour cette capacité</p>
                   <p className="text-[10px] text-slate-400 mt-2 italic">Envisagez de diviser le groupe en deux véhicules.</p>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  )
}
