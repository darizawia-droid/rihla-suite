import { useState, useMemo } from 'react'
import {
  Hotel, Star, MapPin, Search, Plus, Filter, Bed,
  DollarSign, X, ChevronRight, Eye, Edit, Calendar,
  Users, Coffee, Wifi, Car, Utensils, Waves,
  Sun, Snowflake, CloudSun, Sparkles, ChevronDown,
} from 'lucide-react'
import { clsx } from 'clsx'

// ─── TYPES ────────────────────────────────────────────────────────────
type MealPlan = 'RO' | 'BB' | 'HB' | 'FB' | 'AI'
type RateType = 'rack' | 'contractuel' | 'promo'
type SeasonType = 'haute' | 'basse' | 'moyenne' | 'speciale'

interface RoomRate {
  id: string
  season: string
  seasonType: SeasonType
  dateFrom: string
  dateTo: string
  rateSgl: number
  rateDbl: number
  rateTpl: number
  rateType: RateType
  mealPlan: MealPlan
}

interface RoomCategory {
  id: string
  name: string
  capacity: number
  description: string
  amenities: string[]
  count: number
  size: string
  rates: RoomRate[]
}

interface HotelEntry {
  id: string
  name: string
  city: string
  category: string
  stars: number
  rating: number
  supplier: string
  supplierContact: string
  supplierPhone: string
  address: string
  totalRooms: number
  checkIn: string
  checkOut: string
  commission: number
  contractStatus: 'active' | 'expired' | 'pending'
  contractEnd: string
  amenities: string[]
  rooms: RoomCategory[]
  notes: string
  tags: string[]
}

const MEAL_LABELS: Record<MealPlan, string> = {
  RO: 'Room Only', BB: 'Bed & Breakfast', HB: 'Half Board', FB: 'Full Board', AI: 'All Inclusive',
}
const RATE_LABELS: Record<RateType, string> = {
  rack: 'Rack', contractuel: 'Contractuel', promo: 'Promo',
}
const SEASON_ICONS: Record<SeasonType, { icon: typeof Sun; color: string }> = {
  haute: { icon: Sun, color: 'text-red-500' },
  moyenne: { icon: CloudSun, color: 'text-amber-500' },
  basse: { icon: Snowflake, color: 'text-blue-500' },
  speciale: { icon: Sparkles, color: 'text-violet-500' },
}

// ─── DEMO HOTELS ──────────────────────────────────────────────────────
const HOTELS: HotelEntry[] = [
  {
    id: 'H001', name: 'Royal Mansour Marrakech', city: 'Marrakech', category: '5* Palace', stars: 5, rating: 5.0,
    supplier: 'Royal Mansour', supplierContact: 'Khalid Bennani', supplierPhone: '+212 524 388 600',
    address: 'Rue Abou Abbas El Sebti, 40000 Marrakech', totalRooms: 53,
    checkIn: '15:00', checkOut: '12:00', commission: 12, contractStatus: 'active', contractEnd: '2026-12-31',
    amenities: ['Spa', 'Piscine', 'Restaurant gastronomique', 'Golf', 'Hammam', 'Butler service'],
    notes: 'Riads privés. Allotement 5 riads/semaine haute saison.',
    tags: ['Palace', 'Ultra-Luxury', 'Allotement'],
    rooms: [
      {
        id: 'R001', name: 'Riad Classique', capacity: 2, description: 'Riad privatif sur 3 niveaux, patio, fontaine, terrasse', amenities: ['Climatisation', 'Minibar', 'Coffre-fort', 'WiFi', 'Butler'], count: 20, size: '120 m²',
        rates: [
          { id: 'rt1', season: 'Haute Saison Été 2026', seasonType: 'haute', dateFrom: '2026-06-15', dateTo: '2026-09-15', rateSgl: 8500, rateDbl: 9200, rateTpl: 0, rateType: 'contractuel', mealPlan: 'BB' },
          { id: 'rt2', season: 'Basse Saison 2026', seasonType: 'basse', dateFrom: '2026-01-10', dateTo: '2026-03-14', rateSgl: 5800, rateDbl: 6200, rateTpl: 0, rateType: 'contractuel', mealPlan: 'BB' },
          { id: 'rt3', season: 'Moyenne Saison', seasonType: 'moyenne', dateFrom: '2026-03-15', dateTo: '2026-06-14', rateSgl: 7200, rateDbl: 7800, rateTpl: 0, rateType: 'contractuel', mealPlan: 'BB' },
        ],
      },
      {
        id: 'R002', name: 'Riad Prestige', capacity: 2, description: 'Riad luxe avec piscine privée, salon marocain, cheminée', amenities: ['Piscine privée', 'Climatisation', 'Butler', 'WiFi', 'Terrasse privée'], count: 20, size: '185 m²',
        rates: [
          { id: 'rt4', season: 'Haute Saison Été 2026', seasonType: 'haute', dateFrom: '2026-06-15', dateTo: '2026-09-15', rateSgl: 14000, rateDbl: 15500, rateTpl: 0, rateType: 'contractuel', mealPlan: 'BB' },
          { id: 'rt5', season: 'Basse Saison 2026', seasonType: 'basse', dateFrom: '2026-01-10', dateTo: '2026-03-14', rateSgl: 9800, rateDbl: 10500, rateTpl: 0, rateType: 'contractuel', mealPlan: 'BB' },
        ],
      },
      {
        id: 'R003', name: 'Grand Riad', capacity: 4, description: 'Le plus grand riad, 4 chambres, piscine, hammam privé', amenities: ['4 chambres', 'Piscine privée', 'Hammam privé', 'Chef privé', 'Butler dédié'], count: 13, size: '340 m²',
        rates: [
          { id: 'rt6', season: 'Haute Saison Été 2026', seasonType: 'haute', dateFrom: '2026-06-15', dateTo: '2026-09-15', rateSgl: 28000, rateDbl: 28000, rateTpl: 28000, rateType: 'contractuel', mealPlan: 'HB' },
          { id: 'rt7', season: 'Basse Saison 2026', seasonType: 'basse', dateFrom: '2026-01-10', dateTo: '2026-03-14', rateSgl: 19000, rateDbl: 19000, rateTpl: 19000, rateType: 'contractuel', mealPlan: 'HB' },
        ],
      },
    ],
  },
  {
    id: 'H002', name: 'La Mamounia', city: 'Marrakech', category: '5* Palace', stars: 5, rating: 4.9,
    supplier: 'La Mamounia', supplierContact: 'Nadia Alaoui', supplierPhone: '+212 524 388 600',
    address: 'Avenue Bab Jdid, 40000 Marrakech', totalRooms: 209,
    checkIn: '15:00', checkOut: '12:00', commission: 10, contractStatus: 'active', contractEnd: '2026-12-31',
    amenities: ['Spa', '3 piscines', '4 restaurants', 'Jardins 8 hectares', 'Casino'],
    notes: 'Politique allotement stricte. Confirmation 21j avant.',
    tags: ['Palace', '5*', 'Historique'],
    rooms: [
      {
        id: 'R010', name: 'Chambre Supérieure', capacity: 2, description: 'Vue jardin ou piscine, décor Art Déco revisité', amenities: ['Climatisation', 'Minibar', 'Coffre-fort', 'WiFi'], count: 72, size: '38 m²',
        rates: [
          { id: 'rt10', season: 'Haute Saison', seasonType: 'haute', dateFrom: '2026-06-15', dateTo: '2026-09-15', rateSgl: 4200, rateDbl: 4800, rateTpl: 5400, rateType: 'contractuel', mealPlan: 'BB' },
          { id: 'rt11', season: 'Basse Saison', seasonType: 'basse', dateFrom: '2026-01-10', dateTo: '2026-03-14', rateSgl: 2800, rateDbl: 3200, rateTpl: 3600, rateType: 'contractuel', mealPlan: 'BB' },
        ],
      },
      {
        id: 'R011', name: 'Chambre Deluxe', capacity: 2, description: 'Grande chambre avec salon, vue Atlas', amenities: ['Balcon', 'Salon', 'Minibar', 'WiFi', 'Room service 24h'], count: 59, size: '52 m²',
        rates: [
          { id: 'rt12', season: 'Haute Saison', seasonType: 'haute', dateFrom: '2026-06-15', dateTo: '2026-09-15', rateSgl: 5800, rateDbl: 6500, rateTpl: 7200, rateType: 'contractuel', mealPlan: 'BB' },
          { id: 'rt13', season: 'Basse Saison', seasonType: 'basse', dateFrom: '2026-01-10', dateTo: '2026-03-14', rateSgl: 3900, rateDbl: 4400, rateTpl: 4900, rateType: 'contractuel', mealPlan: 'BB' },
        ],
      },
      {
        id: 'R012', name: 'Suite Prestige', capacity: 3, description: 'Suite avec salon séparé, terrasse, baignoire jacuzzi', amenities: ['Terrasse privée', 'Jacuzzi', 'Salon séparé', 'Butler', 'WiFi'], count: 38, size: '85 m²',
        rates: [
          { id: 'rt14', season: 'Haute Saison', seasonType: 'haute', dateFrom: '2026-06-15', dateTo: '2026-09-15', rateSgl: 9500, rateDbl: 10500, rateTpl: 11500, rateType: 'contractuel', mealPlan: 'HB' },
          { id: 'rt15', season: 'Basse Saison', seasonType: 'basse', dateFrom: '2026-01-10', dateTo: '2026-03-14', rateSgl: 6500, rateDbl: 7200, rateTpl: 8000, rateType: 'contractuel', mealPlan: 'HB' },
        ],
      },
      {
        id: 'R013', name: 'Riad La Mamounia', capacity: 4, description: 'Riad privatif dans les jardins, 4 chambres, piscine', amenities: ['Piscine privée', '4 chambres', 'Chef privé', 'Majordomme'], count: 3, size: '400 m²',
        rates: [
          { id: 'rt16', season: 'Haute Saison', seasonType: 'haute', dateFrom: '2026-06-15', dateTo: '2026-09-15', rateSgl: 45000, rateDbl: 45000, rateTpl: 45000, rateType: 'contractuel', mealPlan: 'FB' },
        ],
      },
    ],
  },
  {
    id: 'H003', name: 'Palais Faraj Fès', city: 'Fès', category: '5* Riad', stars: 5, rating: 4.8,
    supplier: 'Palais Faraj', supplierContact: 'Ahmed Fassi', supplierPhone: '+212 535 635 356',
    address: 'Quartier Ziat, Bab Guissa, Fès', totalRooms: 25,
    checkIn: '14:00', checkOut: '12:00', commission: 15, contractStatus: 'active', contractEnd: '2027-12-31',
    amenities: ['Spa', 'Piscine', 'Restaurant', 'Vue Médina panoramique', 'Hammam'],
    notes: 'Meilleur rapport qualité/vue médina. Ahmed très flexible.',
    tags: ['5*', 'Riad', 'Fès', 'Exclusivité'],
    rooms: [
      {
        id: 'R020', name: 'Chambre Tradition', capacity: 2, description: 'Décor traditionnel fessi, zellige, bois de cèdre', amenities: ['Climatisation', 'WiFi', 'Coffre-fort'], count: 10, size: '28 m²',
        rates: [
          { id: 'rt20', season: 'Haute Saison', seasonType: 'haute', dateFrom: '2026-06-15', dateTo: '2026-09-15', rateSgl: 2200, rateDbl: 2600, rateTpl: 3000, rateType: 'contractuel', mealPlan: 'BB' },
          { id: 'rt21', season: 'Basse Saison', seasonType: 'basse', dateFrom: '2026-01-10', dateTo: '2026-03-14', rateSgl: 1400, rateDbl: 1700, rateTpl: 2000, rateType: 'contractuel', mealPlan: 'BB' },
        ],
      },
      {
        id: 'R021', name: 'Suite Ambassadeur', capacity: 3, description: 'Vue panoramique médina, salon marocain, cheminée', amenities: ['Terrasse panoramique', 'Salon', 'Cheminée', 'Baignoire'], count: 8, size: '55 m²',
        rates: [
          { id: 'rt22', season: 'Haute Saison', seasonType: 'haute', dateFrom: '2026-06-15', dateTo: '2026-09-15', rateSgl: 3800, rateDbl: 4200, rateTpl: 4800, rateType: 'contractuel', mealPlan: 'BB' },
          { id: 'rt23', season: 'Basse Saison', seasonType: 'basse', dateFrom: '2026-01-10', dateTo: '2026-03-14', rateSgl: 2600, rateDbl: 2900, rateTpl: 3300, rateType: 'contractuel', mealPlan: 'BB' },
        ],
      },
      {
        id: 'R022', name: 'Suite Royale', capacity: 4, description: 'La plus grande suite, vue 360° sur la médina', amenities: ['Vue 360°', 'Jacuzzi', '2 chambres', 'Salon', 'Terrasse'], count: 2, size: '110 m²',
        rates: [
          { id: 'rt24', season: 'Haute Saison', seasonType: 'haute', dateFrom: '2026-06-15', dateTo: '2026-09-15', rateSgl: 6500, rateDbl: 7000, rateTpl: 7500, rateType: 'contractuel', mealPlan: 'HB' },
        ],
      },
    ],
  },
  {
    id: 'H004', name: 'Kasbah Tamadot', city: 'Atlas', category: '5* Boutique', stars: 5, rating: 4.9,
    supplier: 'Virgin Limited Edition', supplierContact: 'Youssef El Alami', supplierPhone: '+212 524 368 200',
    address: 'BP 67, Asni, Atlas Mountains', totalRooms: 28,
    checkIn: '14:00', checkOut: '11:00', commission: 10, contractStatus: 'active', contractEnd: '2026-12-31',
    amenities: ['Infinity pool', 'Spa Asounfou', 'Restaurant', 'Trekking', 'Mule rides'],
    notes: 'Hôtel de Richard Branson. Expérience montagne unique. Réserver 30j+ en haute saison.',
    tags: ['Boutique', 'Atlas', 'Nature', 'Exclusive'],
    rooms: [
      {
        id: 'R030', name: 'Chambre Deluxe', capacity: 2, description: 'Vue Atlas, balcon privé, cheminée', amenities: ['Vue Atlas', 'Balcon', 'Cheminée', 'WiFi'], count: 18, size: '40 m²',
        rates: [
          { id: 'rt30', season: 'Haute Saison', seasonType: 'haute', dateFrom: '2026-06-15', dateTo: '2026-09-15', rateSgl: 3500, rateDbl: 4000, rateTpl: 4500, rateType: 'contractuel', mealPlan: 'HB' },
          { id: 'rt31', season: 'Basse Saison', seasonType: 'basse', dateFrom: '2026-01-10', dateTo: '2026-03-14', rateSgl: 2200, rateDbl: 2600, rateTpl: 3000, rateType: 'contractuel', mealPlan: 'HB' },
        ],
      },
      {
        id: 'R031', name: 'Berber Tent Suite', capacity: 2, description: 'Tente berbère luxueuse, terrasse panoramique', amenities: ['Terrasse panoramique', 'Cheminée', 'Baignoire cuivre'], count: 5, size: '65 m²',
        rates: [
          { id: 'rt32', season: 'Haute Saison', seasonType: 'haute', dateFrom: '2026-06-15', dateTo: '2026-09-15', rateSgl: 5500, rateDbl: 6000, rateTpl: 0, rateType: 'contractuel', mealPlan: 'HB' },
        ],
      },
    ],
  },
  {
    id: 'H005', name: 'Sahara Luxury Camp', city: 'Merzouga', category: 'Luxury Camp', stars: 4, rating: 4.7,
    supplier: 'Desert Dreams SARL', supplierContact: 'Brahim Ait Oumghar', supplierPhone: '+212 661 234 567',
    address: 'Erg Chebbi, Merzouga', totalRooms: 15,
    checkIn: '16:00', checkOut: '10:00', commission: 18, contractStatus: 'active', contractEnd: '2026-12-31',
    amenities: ['Tentes climatisées', 'Dîner sous les étoiles', 'Balade dromadaire', 'Sandboarding'],
    notes: 'Fermé juillet-août (chaleur). Expérience désert premium.',
    tags: ['Désert', 'Camp', 'Expérience'],
    rooms: [
      {
        id: 'R040', name: 'Tente Standard', capacity: 2, description: 'Tente berbère avec lit, salle d\'eau', amenities: ['Lit double', 'Salle d\'eau privée', 'Tapis berbères'], count: 8, size: '25 m²',
        rates: [
          { id: 'rt40', season: 'Haute Saison', seasonType: 'haute', dateFrom: '2026-03-15', dateTo: '2026-05-31', rateSgl: 1800, rateDbl: 2200, rateTpl: 2600, rateType: 'contractuel', mealPlan: 'FB' },
          { id: 'rt41', season: 'Basse Saison', seasonType: 'basse', dateFrom: '2026-01-10', dateTo: '2026-03-14', rateSgl: 1200, rateDbl: 1500, rateTpl: 1800, rateType: 'contractuel', mealPlan: 'FB' },
        ],
      },
      {
        id: 'R041', name: 'Suite Royale du Désert', capacity: 2, description: 'Grande tente avec salon, baignoire, terrasse privée étoilée', amenities: ['Baignoire', 'Salon', 'Terrasse privée', 'Télescope'], count: 4, size: '50 m²',
        rates: [
          { id: 'rt42', season: 'Haute Saison', seasonType: 'haute', dateFrom: '2026-03-15', dateTo: '2026-05-31', rateSgl: 3200, rateDbl: 3800, rateTpl: 0, rateType: 'contractuel', mealPlan: 'FB' },
        ],
      },
    ],
  },
]

// ─── HOTEL DETAIL PANEL ───────────────────────────────────────────────
function HotelDetailPanel({ hotel, onClose }: { hotel: HotelEntry; onClose: () => void }) {
  const [tab, setTab] = useState<'rooms' | 'rates' | 'info'>('rooms')
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null)

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-[720px] bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto border-l border-slate-200 dark:border-slate-700">
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">{hotel.name}</h2>
              <div className="flex items-center gap-2 mt-0.5 text-[12px]">
                <span className="flex items-center gap-0.5 text-amber-500">{Array.from({ length: hotel.stars }).map((_, i) => <Star key={i} size={11} className="fill-amber-500" />)}</span>
                <span className="text-slate-400">{hotel.category}</span>
                <span className="text-slate-400">&middot; {hotel.city}</span>
                <span className="text-slate-400">&middot; {hotel.totalRooms} chambres</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><X size={18} /></button>
          </div>
          <div className="flex gap-1 mt-2">
            {(['rooms', 'rates', 'info'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={clsx('px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors', tab === t ? 'bg-rihla/10 text-rihla' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800')}>
                {t === 'rooms' ? `Catégories (${hotel.rooms.length})` : t === 'rates' ? 'Grille Tarifaire' : 'Informations'}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {tab === 'rooms' && (
            <div className="space-y-3">
              {hotel.rooms.map(room => (
                <div key={room.id} className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <button onClick={() => setExpandedRoom(expandedRoom === room.id ? null : room.id)} className="w-full px-4 py-3 flex items-center justify-between text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rihla/10 flex items-center justify-center"><Bed size={14} className="text-rihla" /></div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-900 dark:text-white">{room.name}</p>
                        <p className="text-[11px] text-slate-500">{room.size} &middot; {room.capacity} pers. &middot; {room.count} unités</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold text-rihla">{room.rates[0]?.rateDbl.toLocaleString()} MAD</span>
                      <ChevronDown size={14} className={clsx('text-slate-400 transition-transform', expandedRoom === room.id && 'rotate-180')} />
                    </div>
                  </button>
                  {expandedRoom === room.id && (
                    <div className="px-4 pb-4 space-y-3 border-t border-slate-200 dark:border-slate-700 pt-3">
                      <p className="text-[12px] text-slate-600 dark:text-slate-300">{room.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {room.amenities.map(a => <span key={a} className="px-2 py-0.5 bg-rihla/5 text-rihla text-[10px] font-medium rounded-lg border border-rihla/10">{a}</span>)}
                      </div>
                      {/* Rate Grid */}
                      <div className="mt-3">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2">Tarifs par Saison</h4>
                        <table className="w-full text-[11px]">
                          <thead>
                            <tr className="text-[9px] font-bold text-slate-400 uppercase">
                              <th className="px-2 py-1.5 text-left">Saison</th>
                              <th className="px-2 py-1.5 text-left">Période</th>
                              <th className="px-2 py-1.5 text-right">SGL</th>
                              <th className="px-2 py-1.5 text-right">DBL</th>
                              <th className="px-2 py-1.5 text-right">TPL</th>
                              <th className="px-2 py-1.5 text-center">Formule</th>
                              <th className="px-2 py-1.5 text-center">Type</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {room.rates.map(r => {
                              const seasonIcon = SEASON_ICONS[r.seasonType]
                              const SIcon = seasonIcon.icon
                              return (
                                <tr key={r.id} className="hover:bg-white dark:hover:bg-slate-900/50">
                                  <td className="px-2 py-2 text-left">
                                    <div className="flex items-center gap-1">
                                      <SIcon size={10} className={seasonIcon.color} />
                                      <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[100px]">{r.season}</span>
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 text-slate-500">{r.dateFrom.slice(5)} → {r.dateTo.slice(5)}</td>
                                  <td className="px-2 py-2 text-right font-bold text-slate-900 dark:text-white tabular-nums">{r.rateSgl.toLocaleString()}</td>
                                  <td className="px-2 py-2 text-right font-bold text-rihla tabular-nums">{r.rateDbl.toLocaleString()}</td>
                                  <td className="px-2 py-2 text-right font-bold text-slate-900 dark:text-white tabular-nums">{r.rateTpl > 0 ? r.rateTpl.toLocaleString() : '—'}</td>
                                  <td className="px-2 py-2 text-center"><span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-600 rounded text-[9px] font-bold">{r.mealPlan}</span></td>
                                  <td className="px-2 py-2 text-center"><span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[9px] font-bold">{RATE_LABELS[r.rateType]}</span></td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button className="w-full py-3 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-[12px] font-medium text-slate-500 hover:bg-slate-50 flex items-center justify-center gap-2">
                <Plus size={14} /> Ajouter une catégorie de chambre
              </button>
            </div>
          )}

          {tab === 'rates' && (
            <div>
              <h3 className="text-[14px] font-bold text-slate-900 dark:text-white mb-4">Grille Tarifaire Complète — {hotel.name}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="text-[9px] font-bold text-slate-400 uppercase bg-slate-50 dark:bg-slate-800">
                      <th className="px-3 py-2 text-left">Catégorie</th>
                      <th className="px-3 py-2 text-left">Saison</th>
                      <th className="px-3 py-2 text-right">SGL (MAD)</th>
                      <th className="px-3 py-2 text-right">DBL (MAD)</th>
                      <th className="px-3 py-2 text-right">TPL (MAD)</th>
                      <th className="px-3 py-2 text-center">Formule</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {hotel.rooms.flatMap(room =>
                      room.rates.map(r => (
                        <tr key={`${room.id}-${r.id}`} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                          <td className="px-3 py-2 font-medium text-slate-900 dark:text-white">{room.name}</td>
                          <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{r.season}</td>
                          <td className="px-3 py-2 text-right tabular-nums font-bold">{r.rateSgl.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right tabular-nums font-bold text-rihla">{r.rateDbl.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right tabular-nums">{r.rateTpl > 0 ? r.rateTpl.toLocaleString() : '—'}</td>
                          <td className="px-3 py-2 text-center"><span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-600 rounded text-[9px] font-bold">{r.mealPlan}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'info' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase">Fournisseur</h4>
                  <div className="space-y-2 text-[13px]">
                    <p className="font-medium text-slate-900 dark:text-white">{hotel.supplier}</p>
                    <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5"><Users size={12} className="text-slate-400" />{hotel.supplierContact}</p>
                    <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5"><MapPin size={12} className="text-slate-400" />{hotel.address}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase">Commercial</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-[10px] text-slate-400">Commission</p>
                      <p className="text-lg font-bold text-rihla">{hotel.commission}%</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <p className="text-[10px] text-slate-400">Contrat</p>
                      <p className={clsx('text-[12px] font-bold', hotel.contractStatus === 'active' ? 'text-emerald-600' : 'text-red-600')}>{hotel.contractStatus === 'active' ? 'Actif' : 'Expiré'}</p>
                      <p className="text-[10px] text-slate-400">→ {hotel.contractEnd}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2">Check-in / Check-out</h4>
                <p className="text-[13px] text-slate-600 dark:text-slate-300">{hotel.checkIn} / {hotel.checkOut}</p>
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2">Équipements</h4>
                <div className="flex flex-wrap gap-1.5">
                  {hotel.amenities.map(a => <span key={a} className="px-2 py-0.5 bg-rihla/5 text-rihla text-[10px] font-medium rounded-lg border border-rihla/10">{a}</span>)}
                </div>
              </div>
              {hotel.notes && (
                <div className="p-3 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 rounded-xl text-[13px] text-slate-600 dark:text-slate-300">{hotel.notes}</div>
              )}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {hotel.tags.map(t => <span key={t} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] rounded-full">{t}</span>)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────
export function HotelCatalogPage() {
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('all')
  const [selectedHotel, setSelectedHotel] = useState<HotelEntry | null>(null)

  const cities = useMemo(() => [...new Set(HOTELS.map(h => h.city))], [])
  const filtered = useMemo(() => HOTELS.filter(h => {
    if (cityFilter !== 'all' && h.city !== cityFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q) || h.tags.some(t => t.toLowerCase().includes(q))
    }
    return true
  }), [search, cityFilter])

  const totalRooms = HOTELS.reduce((s, h) => s + h.totalRooms, 0)
  const totalCategories = HOTELS.reduce((s, h) => s + h.rooms.length, 0)

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 transition-colors pb-16">
      {selectedHotel && <HotelDetailPanel hotel={selectedHotel} onClose={() => setSelectedHotel(null)} />}

      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-6">
        <div className="max-w-[1600px] mx-auto flex justify-between items-end gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              <Hotel size={12} className="text-rihla" /> Paramétrage Produits
            </div>
            <h1 className="text-[24px] font-bold text-slate-900 dark:text-white tracking-tight">
              Parc Hôtelier — Chambres & Tarifs
            </h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              {HOTELS.length} hôtels &middot; {totalCategories} catégories &middot; {totalRooms} chambres &middot; Tarifs par saison
            </p>
          </div>
          <button className="inline-flex items-center gap-1.5 h-9 px-3.5 text-[13px] font-bold text-white bg-rihla hover:bg-rihla/90 rounded-lg">
            <Plus size={14} /> Ajouter un Hôtel
          </button>
        </div>
      </div>

      <div className="p-8 max-w-[1600px] mx-auto space-y-5">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: 'Hôtels', value: HOTELS.length, icon: Hotel, color: 'text-rihla' },
            { label: 'Chambres', value: totalRooms, icon: Bed, color: 'text-blue-600' },
            { label: 'Catégories', value: totalCategories, icon: Star, color: 'text-amber-600' },
            { label: 'Contrats Actifs', value: HOTELS.filter(h => h.contractStatus === 'active').length, icon: Calendar, color: 'text-emerald-600' },
            { label: 'Villes', value: cities.length, icon: MapPin, color: 'text-violet-600' },
          ].map(k => (
            <div key={k.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between mb-1"><span className="text-[11px] font-medium text-slate-500">{k.label}</span><k.icon size={14} className={k.color} /></div>
              <p className="text-[22px] font-bold text-slate-900 dark:text-white">{k.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[13px] focus:ring-2 focus:ring-rihla" placeholder="Rechercher hôtel, ville, tag..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="h-9 px-3 text-[12px] font-medium border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-600">
            <option value="all">Toutes les villes</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className="text-[12px] text-slate-400">{filtered.length} hôtel(s)</span>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(h => (
            <div key={h.id} onClick={() => setSelectedHotel(h)} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:border-rihla/30 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">{h.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                    <span className="flex items-center gap-0.5 text-amber-500">{Array.from({ length: h.stars }).map((_, i) => <Star key={i} size={10} className="fill-amber-500" />)}</span>
                    <span>{h.category}</span>
                    <span>&middot; {h.city}</span>
                  </div>
                </div>
                <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold', h.contractStatus === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600')}>
                  {h.contractStatus === 'active' ? 'Contrat actif' : 'Expiré'}
                </span>
              </div>

              {/* Room Categories */}
              <div className="space-y-1.5 mb-3">
                {h.rooms.map(r => (
                  <div key={r.id} className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Bed size={11} className="text-rihla" />
                      <span className="font-medium text-slate-700 dark:text-slate-200">{r.name}</span>
                      <span className="text-slate-400">({r.count})</span>
                    </div>
                    <span className="font-bold text-rihla tabular-nums">{r.rates[0]?.rateDbl.toLocaleString()} MAD</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>{h.totalRooms} chambres &middot; {h.rooms.length} catégories</span>
                <span className="font-medium">Commission {h.commission}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
