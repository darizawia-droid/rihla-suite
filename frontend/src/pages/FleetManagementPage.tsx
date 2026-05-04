import { useState, useMemo } from 'react'
import {
  Truck, Car, Bus, MapPin, Search, Plus, X,
  DollarSign, Users, Fuel, Star, Calendar,
  Navigation, Shield, Eye, Edit, ChevronDown,
  Clock, AlertCircle,
} from 'lucide-react'
import { clsx } from 'clsx'

type VehicleType = 'berline' | 'minivan' | 'bus' | '4x4' | 'minibus' | 'limousine'

interface VehicleRate {
  id: string
  route: string
  from: string
  to: string
  rateFlat: number
  ratePerPax: number
  season: string
  seasonType: 'haute' | 'basse' | 'moyenne'
  includes: string[]
  duration: string
}

interface Vehicle {
  id: string
  type: VehicleType
  brand: string
  model: string
  year: number
  capacity: number
  plate: string
  supplier: string
  supplierPhone: string
  status: 'available' | 'in_use' | 'maintenance'
  features: string[]
  dailyRate: number
  currency: string
  fuelType: string
  routes: VehicleRate[]
  notes: string
}

const TYPE_ICONS: Record<VehicleType, { icon: typeof Car; label: string; color: string }> = {
  berline: { icon: Car, label: 'Berline', color: 'text-blue-600' },
  minivan: { icon: Car, label: 'Minivan', color: 'text-indigo-600' },
  bus: { icon: Bus, label: 'Bus', color: 'text-emerald-600' },
  '4x4': { icon: Truck, label: '4x4', color: 'text-amber-600' },
  minibus: { icon: Bus, label: 'Minibus', color: 'text-violet-600' },
  limousine: { icon: Car, label: 'Limousine', color: 'text-rose-600' },
}

const VEHICLES: Vehicle[] = [
  {
    id: 'V001', type: 'minivan', brand: 'Mercedes', model: 'V-Class', year: 2024, capacity: 7,
    plate: '12345-A-1', supplier: "S'TOURS Transport", supplierPhone: '+212 522 123 456',
    status: 'available', features: ['Climatisation', 'WiFi', 'USB', 'Cuir', 'Toit panoramique'],
    dailyRate: 2500, currency: 'MAD', fuelType: 'Diesel',
    notes: 'Véhicule premium pour VIP et petits groupes.',
    routes: [
      { id: 'VR1', route: 'Marrakech → Essaouira', from: 'Marrakech', to: 'Essaouira', rateFlat: 1800, ratePerPax: 260, season: 'Toute saison', seasonType: 'moyenne', includes: ['Chauffeur', 'Carburant', 'Péages'], duration: '2h30' },
      { id: 'VR2', route: 'Marrakech → Ouarzazate', from: 'Marrakech', to: 'Ouarzazate', rateFlat: 2200, ratePerPax: 320, season: 'Toute saison', seasonType: 'moyenne', includes: ['Chauffeur', 'Carburant', 'Péages'], duration: '4h' },
      { id: 'VR3', route: 'Aéroport RAK → Hôtel', from: 'Aéroport RAK', to: 'Hôtel Marrakech', rateFlat: 350, ratePerPax: 50, season: 'Toute saison', seasonType: 'moyenne', includes: ['Chauffeur', 'Accueil aéroport'], duration: '30 min' },
    ],
  },
  {
    id: 'V002', type: 'berline', brand: 'Mercedes', model: 'S-Class', year: 2024, capacity: 3,
    plate: '67890-B-2', supplier: "S'TOURS Transport", supplierPhone: '+212 522 123 456',
    status: 'available', features: ['Cuir', 'Climatisation bizone', 'WiFi', 'Minibar', 'Vitres teintées'],
    dailyRate: 3500, currency: 'MAD', fuelType: 'Essence',
    notes: 'Berline VIP pour transferts luxe et UHNW.',
    routes: [
      { id: 'VR4', route: 'Aéroport CMN → Casablanca', from: 'Aéroport CMN', to: 'Casablanca centre', rateFlat: 450, ratePerPax: 150, season: 'Toute saison', seasonType: 'moyenne', includes: ['Chauffeur en costume', 'Eau minérale'], duration: '45 min' },
      { id: 'VR5', route: 'Casablanca → Rabat', from: 'Casablanca', to: 'Rabat', rateFlat: 1200, ratePerPax: 400, season: 'Toute saison', seasonType: 'moyenne', includes: ['Chauffeur', 'Carburant', 'Péages'], duration: '1h15' },
    ],
  },
  {
    id: 'V003', type: 'bus', brand: 'Mercedes', model: 'Tourismo', year: 2023, capacity: 50,
    plate: '11111-C-3', supplier: "S'TOURS Transport", supplierPhone: '+212 522 123 456',
    status: 'available', features: ['Climatisation', 'Micro', 'Soute bagages', 'Écran vidéo', 'WC'],
    dailyRate: 4500, currency: 'MAD', fuelType: 'Diesel',
    notes: 'Bus grand tourisme pour groupes 30-50 pax.',
    routes: [
      { id: 'VR6', route: 'Marrakech → Fès (via Beni Mellal)', from: 'Marrakech', to: 'Fès', rateFlat: 6500, ratePerPax: 130, season: 'Toute saison', seasonType: 'moyenne', includes: ['Chauffeur', 'Carburant', 'Péages', 'Eau'], duration: '7h' },
      { id: 'VR7', route: 'Marrakech → Ouarzazate → Sahara', from: 'Marrakech', to: 'Merzouga', rateFlat: 8500, ratePerPax: 170, season: 'Haute Saison', seasonType: 'haute', includes: ['Chauffeur', 'Carburant', 'Péages', 'Hébergement chauffeur'], duration: '10h' },
    ],
  },
  {
    id: 'V004', type: '4x4', brand: 'Toyota', model: 'Land Cruiser V8', year: 2024, capacity: 6,
    plate: '22222-D-4', supplier: 'Atlas 4x4 SARL', supplierPhone: '+212 661 456 789',
    status: 'available', features: ['4x4 permanent', 'Climatisation', 'Réfrigérateur', 'Pneus renforcés'],
    dailyRate: 3000, currency: 'MAD', fuelType: 'Diesel',
    notes: 'Indispensable pour pistes Sahara et Atlas.',
    routes: [
      { id: 'VR8', route: 'Ouarzazate → Merzouga (piste)', from: 'Ouarzazate', to: 'Merzouga', rateFlat: 3500, ratePerPax: 600, season: 'Toute saison', seasonType: 'moyenne', includes: ['Chauffeur 4x4 expérimenté', 'Carburant', 'Kit de secours'], duration: '6h' },
      { id: 'VR9', route: 'Marrakech → Cascades Ouzoud', from: 'Marrakech', to: 'Ouzoud', rateFlat: 2000, ratePerPax: 340, season: 'Toute saison', seasonType: 'moyenne', includes: ['Chauffeur', 'Carburant'], duration: '3h' },
    ],
  },
  {
    id: 'V005', type: 'minibus', brand: 'Mercedes', model: 'Sprinter', year: 2023, capacity: 19,
    plate: '33333-E-5', supplier: "S'TOURS Transport", supplierPhone: '+212 522 123 456',
    status: 'in_use', features: ['Climatisation', 'WiFi', 'USB', 'Soute bagages'],
    dailyRate: 3200, currency: 'MAD', fuelType: 'Diesel',
    notes: 'Idéal pour groupes moyens 10-19 pax.',
    routes: [
      { id: 'VR10', route: 'Circuit Impériales 4J', from: 'Casablanca', to: 'Casablanca', rateFlat: 12000, ratePerPax: 640, season: 'Toute saison', seasonType: 'moyenne', includes: ['Chauffeur', 'Carburant', 'Péages', 'Hébergement chauffeur 3 nuits'], duration: '4 jours' },
    ],
  },
  {
    id: 'V006', type: 'limousine', brand: 'Mercedes', model: 'Maybach S680', year: 2025, capacity: 3,
    plate: '44444-F-6', supplier: 'VIP Limo Maroc', supplierPhone: '+212 661 999 888',
    status: 'available', features: ['Cuir Nappa', 'Champagne bar', 'Vitres teintées', 'Isolation phonique', 'Massage sièges'],
    dailyRate: 8000, currency: 'MAD', fuelType: 'Essence',
    notes: 'Ultra-luxe pour clientèle UHNW. Réserver 72h minimum.',
    routes: [
      { id: 'VR11', route: 'Aéroport RAK → Royal Mansour', from: 'Aéroport RAK', to: 'Royal Mansour', rateFlat: 800, ratePerPax: 270, season: 'Toute saison', seasonType: 'moyenne', includes: ['Chauffeur en costume', 'Champagne', 'Accueil VIP'], duration: '25 min' },
    ],
  },
]

function VehicleDetail({ vehicle, onClose }: { vehicle: Vehicle; onClose: () => void }) {
  const [tab, setTab] = useState<'info' | 'routes'>('routes')
  const typeInfo = TYPE_ICONS[vehicle.type]

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-[640px] bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto border-l border-slate-200 dark:border-slate-700">
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">{vehicle.brand} {vehicle.model}</h2>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                <span className={clsx('px-2 py-0.5 rounded-full font-bold', typeInfo.color, 'bg-current/10')}>{typeInfo.label}</span>
                <span>{vehicle.capacity} places</span>
                <span>&middot; {vehicle.year}</span>
                <span>&middot; {vehicle.plate}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><X size={18} /></button>
          </div>
          <div className="flex gap-1 mt-2">
            {(['routes', 'info'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={clsx('px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors', tab === t ? 'bg-rihla/10 text-rihla' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800')}>
                {t === 'routes' ? `Tarifs Routes (${vehicle.routes.length})` : 'Détails'}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {tab === 'routes' && (
            <div className="space-y-3">
              {vehicle.routes.map(r => (
                <div key={r.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Navigation size={14} className="text-rihla" />
                      <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">{r.route}</h4>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500"><Clock size={11} />{r.duration}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg">
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Forfait véhicule</p>
                      <p className="text-lg font-bold text-rihla">{r.rateFlat.toLocaleString()} MAD</p>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg">
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Prix / Pax</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{r.ratePerPax.toLocaleString()} MAD</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-1">
                    {r.includes.map(i => <span key={i} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-medium rounded-full">{i}</span>)}
                  </div>
                </div>
              ))}
              <button className="w-full py-3 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-[12px] font-medium text-slate-500 hover:bg-slate-50 flex items-center justify-center gap-2">
                <Plus size={14} /> Ajouter une route
              </button>
            </div>
          )}
          {tab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-[10px] text-slate-400">Fournisseur</p>
                  <p className="text-[13px] font-bold text-slate-900 dark:text-white">{vehicle.supplier}</p>
                  <p className="text-[11px] text-slate-500">{vehicle.supplierPhone}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-[10px] text-slate-400">Tarif journalier</p>
                  <p className="text-lg font-bold text-rihla">{vehicle.dailyRate.toLocaleString()} MAD/j</p>
                </div>
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2">Équipements</h4>
                <div className="flex flex-wrap gap-1.5">
                  {vehicle.features.map(f => <span key={f} className="px-2 py-0.5 bg-rihla/5 text-rihla text-[10px] font-medium rounded-lg border border-rihla/10">{f}</span>)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-[10px] text-slate-400">Carburant</p>
                  <p className="text-[13px] font-medium text-slate-700 dark:text-white">{vehicle.fuelType}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-[10px] text-slate-400">Immatriculation</p>
                  <p className="text-[13px] font-medium text-slate-700 dark:text-white">{vehicle.plate}</p>
                </div>
              </div>
              {vehicle.notes && <p className="p-3 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 rounded-xl text-[13px] text-slate-600">{vehicle.notes}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function FleetManagementPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<VehicleType | 'all'>('all')
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  const filtered = useMemo(() => VEHICLES.filter(v => {
    if (typeFilter !== 'all' && v.type !== typeFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return v.brand.toLowerCase().includes(q) || v.model.toLowerCase().includes(q) || v.supplier.toLowerCase().includes(q)
    }
    return true
  }), [search, typeFilter])

  const totalCapacity = VEHICLES.reduce((s, v) => s + v.capacity, 0)

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 transition-colors pb-16">
      {selectedVehicle && <VehicleDetail vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />}

      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-6">
        <div className="max-w-[1600px] mx-auto flex justify-between items-end gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              <Truck size={12} className="text-rihla" /> Paramétrage Transport
            </div>
            <h1 className="text-[24px] font-bold text-slate-900 dark:text-white tracking-tight">
              Flotte & Tarification Transport
            </h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              {VEHICLES.length} véhicules &middot; {totalCapacity} places totales &middot; Tarifs par route
            </p>
          </div>
          <button className="inline-flex items-center gap-1.5 h-9 px-3.5 text-[13px] font-bold text-white bg-rihla hover:bg-rihla/90 rounded-lg">
            <Plus size={14} /> Ajouter un Véhicule
          </button>
        </div>
      </div>

      <div className="p-8 max-w-[1600px] mx-auto space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {Object.entries(TYPE_ICONS).map(([key, { icon: Icon, label, color }]) => {
            const count = VEHICLES.filter(v => v.type === key).length
            return (
              <button key={key} onClick={() => setTypeFilter(typeFilter === key ? 'all' : key as VehicleType)} className={clsx('bg-white dark:bg-slate-900 rounded-xl border p-4 text-left transition-all', typeFilter === key ? 'border-rihla/50 shadow-md' : 'border-slate-200 dark:border-slate-700 hover:border-rihla/20')}>
                <div className="flex items-center justify-between mb-1"><Icon size={16} className={color} /><span className="text-[10px] text-slate-400">{count}</span></div>
                <p className="text-[12px] font-medium text-slate-900 dark:text-white">{label}</p>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[13px] focus:ring-2 focus:ring-rihla" placeholder="Rechercher véhicule, marque, fournisseur..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span className="text-[12px] text-slate-400">{filtered.length} véhicule(s)</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Véhicule</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-center">Places</th>
                <th className="px-4 py-3 text-left">Fournisseur</th>
                <th className="px-4 py-3 text-right">Tarif / jour</th>
                <th className="px-4 py-3 text-center">Routes</th>
                <th className="px-4 py-3 text-center">Statut</th>
                <th className="px-4 py-3 text-center">Voir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(v => {
                const ti = TYPE_ICONS[v.type]
                const TIcon = ti.icon
                return (
                  <tr key={v.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => setSelectedVehicle(v)}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-rihla/10 flex items-center justify-center"><TIcon size={16} className={ti.color} /></div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{v.brand} {v.model}</p>
                          <p className="text-[11px] text-slate-500">{v.year} &middot; {v.plate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={clsx('text-[11px] font-bold', ti.color)}>{ti.label}</span></td>
                    <td className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">{v.capacity}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-[12px]">{v.supplier}</td>
                    <td className="px-4 py-3 text-right font-bold text-rihla tabular-nums">{v.dailyRate.toLocaleString()} MAD</td>
                    <td className="px-4 py-3 text-center"><span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded-full text-[10px] font-bold">{v.routes.length}</span></td>
                    <td className="px-4 py-3 text-center">
                      <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold',
                        v.status === 'available' ? 'bg-emerald-500/10 text-emerald-600' :
                        v.status === 'in_use' ? 'bg-blue-500/10 text-blue-600' : 'bg-amber-500/10 text-amber-600'
                      )}>{v.status === 'available' ? 'Disponible' : v.status === 'in_use' ? 'En course' : 'Maintenance'}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="p-1.5 text-slate-400 hover:text-rihla hover:bg-rihla/5 rounded-lg"><Eye size={14} /></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
