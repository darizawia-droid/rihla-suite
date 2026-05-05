import { useState, useMemo } from 'react'
import {
  Calculator, Hotel, Truck, UserCheck, Utensils, Star,
  Plus, Minus, MapPin, Calendar, Users, TrendingUp, TrendingDown,
  ChevronDown, ChevronUp, Trash2, Copy, Download, RefreshCw,
  BarChart3, PieChart, DollarSign, Percent, Sparkles,
} from 'lucide-react'

/* ──────────── BASE SOLIDE DATA (prix importés des modules paramétrés) ──────────── */

interface HotelOption {
  id: string; name: string; city: string; category: string
  rooms: { name: string; sgl: number; dbl: number; tpl: number }[]
}

interface TransportOption {
  id: string; name: string; type: string; capacity: number
  routes: { from: string; to: string; price: number; duration: string }[]
}

interface GuideOption {
  id: string; name: string; languages: string[]; rating: number
  rates: { type: string; price: number }[]
}

interface RestaurantOption {
  id: string; name: string; city: string; pricePerPax: number; type: string
}

const HOTELS: HotelOption[] = [
  { id: 'H1', name: 'Royal Mansour Marrakech', city: 'Marrakech', category: '5* Palace',
    rooms: [{ name: 'Riad Classique', sgl: 9200, dbl: 9200, tpl: 12000 }, { name: 'Riad Prestige', sgl: 15500, dbl: 15500, tpl: 18000 }, { name: 'Grand Riad', sgl: 28000, dbl: 28000, tpl: 32000 }] },
  { id: 'H2', name: 'La Mamounia', city: 'Marrakech', category: '5* Palace',
    rooms: [{ name: 'Supérieure', sgl: 4800, dbl: 4800, tpl: 6200 }, { name: 'Deluxe', sgl: 6500, dbl: 6500, tpl: 8000 }, { name: 'Suite Prestige', sgl: 10500, dbl: 10500, tpl: 13000 }] },
  { id: 'H3', name: 'Palais Faraj', city: 'Fès', category: '5* Riad',
    rooms: [{ name: 'Tradition', sgl: 2600, dbl: 2600, tpl: 3400 }, { name: 'Ambassadeur', sgl: 4200, dbl: 4200, tpl: 5500 }] },
  { id: 'H4', name: 'Kasbah Tamadot', city: 'Atlas', category: '5* Boutique',
    rooms: [{ name: 'Deluxe', sgl: 4000, dbl: 4000, tpl: 5200 }, { name: 'Berber Tent Suite', sgl: 6000, dbl: 6000, tpl: 7500 }] },
  { id: 'H5', name: 'Sahara Luxury Camp', city: 'Merzouga', category: 'Luxury Camp',
    rooms: [{ name: 'Tente Standard', sgl: 2200, dbl: 2200, tpl: 2800 }, { name: 'Suite Royale', sgl: 3800, dbl: 3800, tpl: 4800 }] },
]

const TRANSPORTS: TransportOption[] = [
  { id: 'T1', name: 'Mercedes V-Class', type: 'Minivan', capacity: 7,
    routes: [{ from: 'Marrakech', to: 'Essaouira', price: 1800, duration: '2h30' }, { from: 'Marrakech', to: 'Casablanca', price: 2200, duration: '2h45' }, { from: 'Marrakech', to: 'Ouarzazate', price: 2500, duration: '4h00' }] },
  { id: 'T2', name: 'Mercedes S-Class', type: 'Berline', capacity: 3,
    routes: [{ from: 'Marrakech', to: 'Aéroport', price: 400, duration: '0h20' }, { from: 'Casablanca', to: 'Rabat', price: 1500, duration: '1h15' }] },
  { id: 'T3', name: 'Mercedes Sprinter', type: 'Minibus', capacity: 19,
    routes: [{ from: 'Marrakech', to: 'Fès', price: 4500, duration: '6h00' }, { from: 'Fès', to: 'Chefchaouen', price: 3200, duration: '3h30' }, { from: 'Marrakech', to: 'Essaouira', price: 2500, duration: '2h30' }] },
  { id: 'T4', name: 'Grand Bus', type: 'Bus', capacity: 53,
    routes: [{ from: 'Marrakech', to: 'Fès', price: 7500, duration: '6h00' }, { from: 'Casablanca', to: 'Marrakech', price: 5500, duration: '2h45' }, { from: 'Marrakech', to: 'Ouarzazate', price: 6000, duration: '4h00' }] },
  { id: 'T5', name: 'Toyota Land Cruiser', type: '4x4', capacity: 5,
    routes: [{ from: 'Ouarzazate', to: 'Merzouga', price: 3500, duration: '5h00' }, { from: 'Marrakech', to: 'Imlil', price: 1200, duration: '1h30' }] },
]

const GUIDES: GuideOption[] = [
  { id: 'G1', name: 'Hassan Amazigh', languages: ['FR', 'EN', 'ES', 'AR'], rating: 4.9,
    rates: [{ type: 'Journée', price: 800 }, { type: 'Demi-journée', price: 500 }, { type: 'Multi-jours', price: 700 }] },
  { id: 'G2', name: 'Fatima Zahra Bennis', languages: ['FR', 'EN', 'DE'], rating: 4.8,
    rates: [{ type: 'Journée', price: 750 }, { type: 'Demi-journée', price: 450 }, { type: 'Multi-jours', price: 650 }] },
  { id: 'G3', name: 'Youssef Ouarzazi', languages: ['FR', 'EN', 'IT'], rating: 4.7,
    rates: [{ type: 'Journée', price: 700 }, { type: 'Demi-journée', price: 400 }, { type: 'Multi-jours', price: 600 }] },
]

const RESTAURANTS: RestaurantOption[] = [
  { id: 'R1', name: 'Dar Yacout', city: 'Marrakech', pricePerPax: 450, type: 'Gastronomique' },
  { id: 'R2', name: 'Le Comptoir Darna', city: 'Marrakech', pricePerPax: 380, type: 'Marocain Moderne' },
  { id: 'R3', name: 'Palais Faraj', city: 'Fès', pricePerPax: 350, type: 'Traditionnel' },
  { id: 'R4', name: 'Café Clock', city: 'Fès', pricePerPax: 180, type: 'Café-Restaurant' },
  { id: 'R5', name: 'La Maison Blanche', city: 'Casablanca', pricePerPax: 420, type: 'Franco-Marocain' },
  { id: 'R6', name: 'Restaurant Atlas', city: 'Atlas', pricePerPax: 220, type: 'Montagnard' },
  { id: 'R7', name: 'Café Sahara', city: 'Merzouga', pricePerPax: 200, type: 'Bivouac' },
]

const SEASON_MODS = [
  { name: 'Haute Saison Été', mod: 1.30, color: 'text-red-600' },
  { name: 'Moyenne Saison', mod: 1.00, color: 'text-amber-600' },
  { name: 'Basse Saison Hiver', mod: 0.80, color: 'text-blue-600' },
  { name: 'Période Fêtes', mod: 1.40, color: 'text-purple-600' },
  { name: 'Ramadan', mod: 0.85, color: 'text-emerald-600' },
]

interface CircuitDay {
  day: number
  city: string
  hotelId: string
  roomType: number
  transportId: string
  routeIdx: number
  guideId: string
  guideType: number
  restaurantId: string
  activities: { name: string; pricePerPax: number }[]
}

const CITIES = ['Marrakech', 'Fès', 'Casablanca', 'Atlas', 'Merzouga', 'Essaouira', 'Chefchaouen', 'Ouarzazate']

const DEFAULT_DAY: CircuitDay = {
  day: 1, city: 'Marrakech', hotelId: 'H1', roomType: 0, transportId: '', routeIdx: 0,
  guideId: 'G1', guideType: 0, restaurantId: 'R1', activities: [],
}

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(Math.round(n))

export function CircuitPricingPage() {
  const [pax, setPax] = useState(20)
  const [margin, setMargin] = useState(12)
  const [season, setSeason] = useState(1) // index in SEASON_MODS
  const [currency] = useState('MAD')
  const [days, setDays] = useState<CircuitDay[]>([
    { ...DEFAULT_DAY, day: 1, city: 'Casablanca', hotelId: 'H2', roomType: 0, transportId: '', routeIdx: 0, guideId: '', restaurantId: 'R5', activities: [] },
    { ...DEFAULT_DAY, day: 2, city: 'Marrakech', hotelId: 'H1', roomType: 0, transportId: 'T4', routeIdx: 0, guideId: 'G1', restaurantId: 'R1', activities: [{ name: 'Visite Médina', pricePerPax: 50 }] },
    { ...DEFAULT_DAY, day: 3, city: 'Marrakech', hotelId: 'H1', roomType: 0, transportId: '', routeIdx: 0, guideId: 'G1', restaurantId: 'R2', activities: [{ name: 'Jardins Majorelle', pricePerPax: 150 }] },
    { ...DEFAULT_DAY, day: 4, city: 'Atlas', hotelId: 'H4', roomType: 0, transportId: 'T5', routeIdx: 1, guideId: 'G3', restaurantId: 'R6', activities: [{ name: 'Trek Imlil', pricePerPax: 200 }] },
    { ...DEFAULT_DAY, day: 5, city: 'Ouarzazate', hotelId: '', roomType: 0, transportId: 'T3', routeIdx: 0, guideId: 'G2', restaurantId: '', activities: [{ name: 'Studios Ouarzazate', pricePerPax: 80 }] },
    { ...DEFAULT_DAY, day: 6, city: 'Merzouga', hotelId: 'H5', roomType: 0, transportId: 'T5', routeIdx: 0, guideId: 'G3', restaurantId: 'R7', activities: [{ name: 'Balade Chameau', pricePerPax: 300 }] },
    { ...DEFAULT_DAY, day: 7, city: 'Fès', hotelId: 'H3', roomType: 0, transportId: 'T3', routeIdx: 1, guideId: 'G2', restaurantId: 'R3', activities: [{ name: 'Visite Médina Fès', pricePerPax: 50 }] },
  ])
  const [expandedDay, setExpandedDay] = useState<number | null>(null)

  const seasonMod = SEASON_MODS[season].mod

  const pricing = useMemo(() => {
    let totalHotel = 0, totalTransport = 0, totalGuide = 0, totalRestaurant = 0, totalActivities = 0
    const perDay: { hotel: number; transport: number; guide: number; restaurant: number; activities: number }[] = []

    for (const d of days) {
      let dayHotel = 0, dayTransport = 0, dayGuide = 0, dayRestaurant = 0, dayActivities = 0

      // Hotel cost (per room night × rooms needed)
      if (d.hotelId) {
        const hotel = HOTELS.find(h => h.id === d.hotelId)
        if (hotel) {
          const room = hotel.rooms[d.roomType] || hotel.rooms[0]
          const roomsNeeded = Math.ceil(pax / 2) // assume double occupancy
          dayHotel = room.dbl * roomsNeeded * seasonMod
        }
      }

      // Transport cost (flat rate per route)
      if (d.transportId) {
        const transport = TRANSPORTS.find(t => t.id === d.transportId)
        if (transport) {
          const route = transport.routes[d.routeIdx] || transport.routes[0]
          const vehiclesNeeded = Math.ceil(pax / transport.capacity)
          dayTransport = route.price * vehiclesNeeded
        }
      }

      // Guide cost (daily rate, flat)
      if (d.guideId) {
        const guide = GUIDES.find(g => g.id === d.guideId)
        if (guide) {
          const rate = guide.rates[d.guideType] || guide.rates[0]
          dayGuide = rate.price
        }
      }

      // Restaurant cost (per pax)
      if (d.restaurantId) {
        const resto = RESTAURANTS.find(r => r.id === d.restaurantId)
        if (resto) {
          dayRestaurant = resto.pricePerPax * pax
        }
      }

      // Activities cost (per pax)
      dayActivities = d.activities.reduce((sum, a) => sum + a.pricePerPax * pax, 0)

      perDay.push({ hotel: dayHotel, transport: dayTransport, guide: dayGuide, restaurant: dayRestaurant, activities: dayActivities })
      totalHotel += dayHotel
      totalTransport += dayTransport
      totalGuide += dayGuide
      totalRestaurant += dayRestaurant
      totalActivities += dayActivities
    }

    const totalCost = totalHotel + totalTransport + totalGuide + totalRestaurant + totalActivities
    const marginAmount = totalCost * (margin / 100)
    const totalSelling = totalCost + marginAmount
    const pricePerPax = totalSelling / pax

    return { totalHotel, totalTransport, totalGuide, totalRestaurant, totalActivities, totalCost, marginAmount, totalSelling, pricePerPax, perDay }
  }, [days, pax, margin, seasonMod])

  const addDay = () => {
    setDays(prev => [...prev, { ...DEFAULT_DAY, day: prev.length + 1 }])
  }

  const removeDay = (idx: number) => {
    setDays(prev => prev.filter((_, i) => i !== idx).map((d, i) => ({ ...d, day: i + 1 })))
  }

  const updateDay = (idx: number, updates: Partial<CircuitDay>) => {
    setDays(prev => prev.map((d, i) => i === idx ? { ...d, ...updates } : d))
  }

  const costBreakdown = [
    { label: 'Hébergement', value: pricing.totalHotel, icon: Hotel, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Transport', value: pricing.totalTransport, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Guides', value: pricing.totalGuide, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Restauration', value: pricing.totalRestaurant, icon: Utensils, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Activités', value: pricing.totalActivities, icon: Star, color: 'text-violet-600', bg: 'bg-violet-50' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-amber-600 font-semibold mb-1">
          <Calculator size={16} /> Phase 3 — Calculateur Automatique
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-cream">
          Calculateur de Circuit — Prix Automatique
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Hôtels + Transport + Guides + Restaurants + Activités · Tarifs Base Solide · Modificateurs saisonniers
        </p>
      </div>

      {/* Global Parameters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-white/10">
          <label className="text-xs text-slate-500 mb-1 block flex items-center gap-1"><Users size={12} /> PAX (passagers)</label>
          <div className="flex items-center gap-2">
            <button onClick={() => setPax(Math.max(1, pax - 1))} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center"><Minus size={14} /></button>
            <input type="number" value={pax} onChange={e => setPax(Math.max(1, parseInt(e.target.value) || 1))} className="w-16 text-center text-xl font-black text-slate-900 dark:text-cream bg-transparent" />
            <button onClick={() => setPax(pax + 1)} className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center"><Plus size={14} /></button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-white/10">
          <label className="text-xs text-slate-500 mb-1 block flex items-center gap-1"><Percent size={12} /> Marge (%)</label>
          <input type="range" min={0} max={30} value={margin} onChange={e => setMargin(parseInt(e.target.value))} className="w-full mt-1" />
          <div className="text-xl font-black text-slate-900 dark:text-cream">{margin}%</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-white/10">
          <label className="text-xs text-slate-500 mb-1 block flex items-center gap-1"><Calendar size={12} /> Saison</label>
          <select value={season} onChange={e => setSeason(parseInt(e.target.value))} className="w-full mt-1 bg-transparent border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1.5 text-sm font-bold">
            {SEASON_MODS.map((s, i) => (
              <option key={i} value={i}>{s.name} ({s.mod > 1 ? '+' : ''}{Math.round((s.mod - 1) * 100)}%)</option>
            ))}
          </select>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-white/10">
          <label className="text-xs text-slate-500 mb-1 block flex items-center gap-1"><Calendar size={12} /> Durée</label>
          <div className="text-xl font-black text-slate-900 dark:text-cream">{days.length} jours</div>
          <div className="text-xs text-slate-400">{days.length - 1} nuits</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Day-by-day builder */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 dark:text-cream">Itinéraire jour par jour</h2>
            <button onClick={addDay} className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-bold hover:bg-amber-700">
              <Plus size={14} /> Ajouter un jour
            </button>
          </div>

          {days.map((day, idx) => {
            const isExpanded = expandedDay === idx
            const dayPricing = pricing.perDay[idx]
            const dayTotal = dayPricing ? dayPricing.hotel + dayPricing.transport + dayPricing.guide + dayPricing.restaurant + dayPricing.activities : 0
            return (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-white/10 overflow-hidden">
                {/* Day header */}
                <button onClick={() => setExpandedDay(isExpanded ? null : idx)} className="w-full flex items-center justify-between p-4 hover:bg-slate-50/50 dark:hover:bg-white/5 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-700 dark:text-amber-400 font-black">J{day.day}</div>
                    <div className="text-left">
                      <div className="font-bold text-slate-900 dark:text-cream flex items-center gap-2">
                        <MapPin size={14} className="text-amber-600" /> {day.city}
                        {day.hotelId && <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-full">{HOTELS.find(h => h.id === day.hotelId)?.name}</span>}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        {day.guideId && <span>🧭 {GUIDES.find(g => g.id === day.guideId)?.name}</span>}
                        {day.transportId && <span>🚐 {TRANSPORTS.find(t => t.id === day.transportId)?.name}</span>}
                        {day.activities.length > 0 && <span>⭐ {day.activities.length} activité(s)</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-black text-slate-900 dark:text-cream">{fmt(dayTotal)} <span className="text-xs font-normal text-slate-400">{currency}</span></div>
                      <div className="text-[10px] text-slate-400">{fmt(dayTotal / pax)} /pax</div>
                    </div>
                    {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </button>

                {/* Expanded config */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-slate-50 dark:border-white/5 space-y-3">
                    <div className="grid grid-cols-2 gap-3 pt-3">
                      {/* City */}
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Ville</label>
                        <select value={day.city} onChange={e => updateDay(idx, { city: e.target.value })} className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm">
                          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      {/* Hotel */}
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block flex items-center gap-1"><Hotel size={11} /> Hôtel</label>
                        <select value={day.hotelId} onChange={e => updateDay(idx, { hotelId: e.target.value, roomType: 0 })} className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm">
                          <option value="">— Aucun —</option>
                          {HOTELS.map(h => <option key={h.id} value={h.id}>{h.name} ({h.city})</option>)}
                        </select>
                      </div>

                      {/* Room type */}
                      {day.hotelId && (
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Catégorie chambre</label>
                          <select value={day.roomType} onChange={e => updateDay(idx, { roomType: parseInt(e.target.value) })} className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm">
                            {(HOTELS.find(h => h.id === day.hotelId)?.rooms || []).map((r, ri) => (
                              <option key={ri} value={ri}>{r.name} — {fmt(r.dbl)} MAD/nuit</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Transport */}
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block flex items-center gap-1"><Truck size={11} /> Transport</label>
                        <select value={day.transportId} onChange={e => updateDay(idx, { transportId: e.target.value, routeIdx: 0 })} className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm">
                          <option value="">— Aucun —</option>
                          {TRANSPORTS.map(t => <option key={t.id} value={t.id}>{t.name} ({t.capacity} pax)</option>)}
                        </select>
                      </div>

                      {/* Route */}
                      {day.transportId && (
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Route</label>
                          <select value={day.routeIdx} onChange={e => updateDay(idx, { routeIdx: parseInt(e.target.value) })} className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm">
                            {(TRANSPORTS.find(t => t.id === day.transportId)?.routes || []).map((r, ri) => (
                              <option key={ri} value={ri}>{r.from} → {r.to} ({fmt(r.price)} MAD, {r.duration})</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Guide */}
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block flex items-center gap-1"><UserCheck size={11} /> Guide</label>
                        <select value={day.guideId} onChange={e => updateDay(idx, { guideId: e.target.value, guideType: 0 })} className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm">
                          <option value="">— Aucun —</option>
                          {GUIDES.map(g => <option key={g.id} value={g.id}>{g.name} ({g.languages.join(', ')}) ★{g.rating}</option>)}
                        </select>
                      </div>

                      {/* Guide rate type */}
                      {day.guideId && (
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">Type prestation</label>
                          <select value={day.guideType} onChange={e => updateDay(idx, { guideType: parseInt(e.target.value) })} className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm">
                            {(GUIDES.find(g => g.id === day.guideId)?.rates || []).map((r, ri) => (
                              <option key={ri} value={ri}>{r.type} — {fmt(r.price)} MAD</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Restaurant */}
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block flex items-center gap-1"><Utensils size={11} /> Restaurant</label>
                        <select value={day.restaurantId} onChange={e => updateDay(idx, { restaurantId: e.target.value })} className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm">
                          <option value="">— Aucun —</option>
                          {RESTAURANTS.map(r => <option key={r.id} value={r.id}>{r.name} ({r.city}) — {r.pricePerPax} MAD/pax</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Day cost breakdown */}
                    {dayPricing && (
                      <div className="flex items-center gap-4 pt-2 border-t border-slate-50 dark:border-white/5 text-xs">
                        {dayPricing.hotel > 0 && <span className="text-amber-600">🏨 {fmt(dayPricing.hotel)}</span>}
                        {dayPricing.transport > 0 && <span className="text-blue-600">🚐 {fmt(dayPricing.transport)}</span>}
                        {dayPricing.guide > 0 && <span className="text-emerald-600">🧭 {fmt(dayPricing.guide)}</span>}
                        {dayPricing.restaurant > 0 && <span className="text-rose-600">🍽 {fmt(dayPricing.restaurant)}</span>}
                        {dayPricing.activities > 0 && <span className="text-violet-600">⭐ {fmt(dayPricing.activities)}</span>}
                        <span className="ml-auto font-bold text-slate-700 dark:text-slate-300">= {fmt(dayTotal)} MAD</span>
                        <button onClick={() => removeDay(idx)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Right: Pricing Summary */}
        <div className="space-y-4">
          {/* Total Card */}
          <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 text-amber-200 text-sm mb-3">
              <Calculator size={16} /> Prix de vente total
            </div>
            <div className="text-3xl font-black">{fmt(pricing.totalSelling)} <span className="text-lg font-normal text-amber-200">{currency}</span></div>
            <div className="text-amber-200 text-sm mt-1">{fmt(pricing.pricePerPax)} {currency} / pax</div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-amber-200">Coût brut</div>
                <div className="font-bold">{fmt(pricing.totalCost)} {currency}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-amber-200">Marge ({margin}%)</div>
                <div className="font-bold">{fmt(pricing.marginAmount)} {currency}</div>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-white/10">
            <h3 className="font-bold text-sm text-slate-900 dark:text-cream mb-3 flex items-center gap-1"><BarChart3 size={14} /> Décomposition par catégorie</h3>
            <div className="space-y-2">
              {costBreakdown.map((cat, i) => {
                const pct = pricing.totalCost > 0 ? (cat.value / pricing.totalCost) * 100 : 0
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="flex items-center gap-1">
                        <cat.icon size={12} className={cat.color} /> {cat.label}
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{fmt(cat.value)} <span className="text-slate-400 font-normal">({pct.toFixed(0)}%)</span></span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${cat.bg.replace('bg-', 'bg-').replace('50', '400')}`} style={{ width: `${pct}%`, backgroundColor: cat.color.includes('amber') ? '#d97706' : cat.color.includes('blue') ? '#2563eb' : cat.color.includes('emerald') ? '#059669' : cat.color.includes('rose') ? '#e11d48' : '#7c3aed' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Season Impact */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-white/10">
            <h3 className="font-bold text-sm text-slate-900 dark:text-cream mb-2 flex items-center gap-1">
              <Calendar size={14} /> Impact saisonnier
            </h3>
            <div className={`text-lg font-black ${SEASON_MODS[season].color}`}>
              {SEASON_MODS[season].name}
            </div>
            <div className="flex items-center gap-1 text-sm mt-1">
              {seasonMod > 1 ? <TrendingUp size={14} className="text-red-500" /> : seasonMod < 1 ? <TrendingDown size={14} className="text-green-500" /> : <RefreshCw size={14} className="text-slate-400" />}
              <span className={seasonMod > 1 ? 'text-red-600' : seasonMod < 1 ? 'text-green-600' : 'text-slate-500'}>
                {seasonMod > 1 ? '+' : ''}{Math.round((seasonMod - 1) * 100)}% sur hébergement
              </span>
            </div>
          </div>

          {/* PAX Scaling */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-white/10">
            <h3 className="font-bold text-sm text-slate-900 dark:text-cream mb-3 flex items-center gap-1"><Users size={14} /> Grille PAX</h3>
            <div className="space-y-1 text-xs">
              {[10, 15, 20, 25, 30, 40].map(p => {
                const scale = pax / p
                const adjPrice = pricing.pricePerPax * scale
                return (
                  <div key={p} className={`flex items-center justify-between py-1 ${p === pax ? 'font-bold text-amber-600' : 'text-slate-600 dark:text-slate-400'}`}>
                    <span>{p} PAX {p === pax && '←'}</span>
                    <span>{fmt(adjPrice)} {currency}/pax</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
