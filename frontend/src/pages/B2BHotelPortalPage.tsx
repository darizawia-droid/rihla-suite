import { useState, useMemo } from 'react'
import {
  Search, Star, MapPin, Calendar, Users, Filter,
  ChevronDown, ChevronRight, ChevronLeft, Check, X,
  Download, Eye, TrendingUp, DollarSign, Building2,
  Wifi, Car, Coffee, Dumbbell, Waves, Wind,
  AlertCircle, Clock, RefreshCw, Plus, FileText,
  ArrowUpRight, Shield, Tag, Percent, Phone, Mail,
  BarChart3, Award, Globe,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────
type BoardType = 'RO' | 'BB' | 'HB' | 'FB' | 'AI'
type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'on_request'
type RoomType = 'SGL' | 'DBL' | 'TWN' | 'STE' | 'JNS' | 'FAM'

interface Hotel {
  id: string
  name: string
  stars: number
  category: string
  city: string
  district: string
  image: string        // gradient class
  netRate: number      // per night, double room
  sellRate: number
  commission: number   // %
  available: boolean
  availRooms: number
  amenities: string[]
  board: BoardType[]
  rating: number
  reviews: number
  description: string
  rooms: RoomConfig[]
  policies: string[]
}

interface RoomConfig {
  type: RoomType
  label: string
  netRate: number
  sellRate: number
  maxOcc: number
  available: number
  boards: { type: BoardType; label: string; netExtra: number }[]
}

interface Booking {
  ref: string
  hotel: string
  city: string
  checkIn: string
  checkOut: string
  nights: number
  rooms: number
  pax: number
  roomType: RoomType
  board: BoardType
  status: BookingStatus
  netTotal: number
  sellTotal: number
  commission: number
  bookedAt: string
  guestName: string
  voucherReady: boolean
}

// ── Demo Data ──────────────────────────────────────────────────────────────
const HOTELS: Hotel[] = [
  {
    id: 'h1',
    name: 'La Mamounia',
    stars: 5,
    category: 'Palace',
    city: 'Marrakech',
    district: 'Médina',
    image: 'from-amber-700 to-rose-900',
    netRate: 320,
    sellRate: 420,
    commission: 23,
    available: true,
    availRooms: 8,
    amenities: ['wifi', 'pool', 'spa', 'gym', 'restaurant', 'parking'],
    board: ['BB', 'HB', 'FB'],
    rating: 9.4,
    reviews: 2840,
    description: 'Palace légendaire au cœur des jardins de Marrakech. Depuis 1923, icône de l\'hospitalité marocaine.',
    policies: ['Annulation gratuite 72h avant', 'Arrhes 30% à la réservation', 'Check-in 15h / Check-out 12h'],
    rooms: [
      { type: 'SGL', label: 'Chambre Supérieure', netRate: 320, sellRate: 420, maxOcc: 2, available: 4, boards: [{ type: 'BB', label: 'Petit-déj.', netExtra: 0 }, { type: 'HB', label: 'Demi-pension', netExtra: 65 }, { type: 'FB', label: 'Pension complète', netExtra: 120 }] },
      { type: 'DBL', label: 'Deluxe Jardin', netRate: 420, sellRate: 550, maxOcc: 2, available: 3, boards: [{ type: 'BB', label: 'Petit-déj.', netExtra: 0 }, { type: 'HB', label: 'Demi-pension', netExtra: 65 }] },
      { type: 'STE', label: 'Suite Mamounia', netRate: 980, sellRate: 1280, maxOcc: 3, available: 1, boards: [{ type: 'BB', label: 'Petit-déj.', netExtra: 0 }, { type: 'HB', label: 'Demi-pension', netExtra: 80 }] },
    ],
  },
  {
    id: 'h2',
    name: 'Riad Fes Boutique Palace',
    stars: 5,
    category: 'Riad 5★',
    city: 'Fès',
    district: 'Médina',
    image: 'from-teal-700 to-indigo-900',
    netRate: 180,
    sellRate: 245,
    commission: 26,
    available: true,
    availRooms: 12,
    amenities: ['wifi', 'pool', 'spa', 'restaurant'],
    board: ['BB', 'HB'],
    rating: 9.2,
    reviews: 1240,
    description: 'Riad authentique du XIVe siècle entièrement rénové. Cour intérieure à fontaine, zellige d\'exception.',
    policies: ['Annulation gratuite 48h avant', 'Arrhes 25% à la réservation', 'Check-in 14h / Check-out 11h'],
    rooms: [
      { type: 'SGL', label: 'Chambre Standard', netRate: 180, sellRate: 245, maxOcc: 2, available: 6, boards: [{ type: 'BB', label: 'Petit-déj.', netExtra: 0 }, { type: 'HB', label: 'Demi-pension', netExtra: 45 }] },
      { type: 'DBL', label: 'Suite Cour', netRate: 280, sellRate: 380, maxOcc: 2, available: 4, boards: [{ type: 'BB', label: 'Petit-déj.', netExtra: 0 }, { type: 'HB', label: 'Demi-pension', netExtra: 45 }] },
      { type: 'JNS', label: 'Suite Panorama', netRate: 450, sellRate: 610, maxOcc: 4, available: 2, boards: [{ type: 'BB', label: 'Petit-déj.', netExtra: 0 }] },
    ],
  },
  {
    id: 'h3',
    name: 'Sofitel Agadir Thalassa',
    stars: 5,
    category: 'Resort 5★',
    city: 'Agadir',
    district: 'Bord de mer',
    image: 'from-blue-600 to-cyan-800',
    netRate: 210,
    sellRate: 280,
    commission: 25,
    available: true,
    availRooms: 22,
    amenities: ['wifi', 'pool', 'spa', 'gym', 'restaurant', 'parking', 'beach'],
    board: ['BB', 'HB', 'FB', 'AI'],
    rating: 8.8,
    reviews: 3450,
    description: 'Resort balnéaire premium face à l\'Atlantique. Thalasso, 3 piscines, accès direct plage d\'Agadir.',
    policies: ['Annulation gratuite 30 jours avant', 'Arrhes 20% à la réservation', 'Check-in 15h / Check-out 12h'],
    rooms: [
      { type: 'SGL', label: 'Chambre Océan Vue', netRate: 210, sellRate: 280, maxOcc: 2, available: 10, boards: [{ type: 'BB', label: 'Petit-déj.', netExtra: 0 }, { type: 'HB', label: 'Demi-pension', netExtra: 55 }, { type: 'FB', label: 'Pension complète', netExtra: 95 }, { type: 'AI', label: 'Tout inclus', netExtra: 140 }] },
      { type: 'FAM', label: 'Suite Familiale', netRate: 340, sellRate: 455, maxOcc: 4, available: 8, boards: [{ type: 'BB', label: 'Petit-déj.', netExtra: 0 }, { type: 'HB', label: 'Demi-pension', netExtra: 95 }, { type: 'AI', label: 'Tout inclus', netExtra: 220 }] },
      { type: 'STE', label: 'Suite Prestige', netRate: 520, sellRate: 700, maxOcc: 2, available: 4, boards: [{ type: 'BB', label: 'Petit-déj.', netExtra: 0 }, { type: 'HB', label: 'Demi-pension', netExtra: 55 }] },
    ],
  },
  {
    id: 'h4',
    name: 'Palais Namaskar',
    stars: 5,
    category: 'Palace',
    city: 'Marrakech',
    district: 'Palmeraie',
    image: 'from-violet-700 to-fuchsia-900',
    netRate: 480,
    sellRate: 640,
    commission: 25,
    available: true,
    availRooms: 5,
    amenities: ['wifi', 'pool', 'spa', 'gym', 'restaurant', 'parking'],
    board: ['BB', 'HB'],
    rating: 9.6,
    reviews: 890,
    description: 'Palace ultra-luxe en pleine palmeraie. Villas avec piscine privée, service butler 24/7.',
    policies: ['Non remboursable', 'Prépaiement total à la réservation', 'Check-in 16h / Check-out 11h'],
    rooms: [
      { type: 'DBL', label: 'Pavilion Garden', netRate: 480, sellRate: 640, maxOcc: 2, available: 3, boards: [{ type: 'BB', label: 'Petit-déj.', netExtra: 0 }, { type: 'HB', label: 'Demi-pension', netExtra: 90 }] },
      { type: 'STE', label: 'Villa Piscine Privée', netRate: 1200, sellRate: 1600, maxOcc: 4, available: 2, boards: [{ type: 'BB', label: 'Petit-déj.', netExtra: 0 }] },
    ],
  },
  {
    id: 'h5',
    name: 'Barceló Tanger',
    stars: 4,
    category: 'Hôtel 4★',
    city: 'Tanger',
    district: 'Centre-ville',
    image: 'from-emerald-600 to-teal-900',
    netRate: 95,
    sellRate: 130,
    commission: 27,
    available: true,
    availRooms: 30,
    amenities: ['wifi', 'gym', 'restaurant', 'parking'],
    board: ['RO', 'BB', 'HB'],
    rating: 8.3,
    reviews: 1870,
    description: 'Hôtel moderne en centre-ville, vue détroit de Gibraltar. Idéal groupes et voyages d\'affaires.',
    policies: ['Annulation gratuite 24h avant', 'Pas d\'arrhes requises', 'Check-in 14h / Check-out 12h'],
    rooms: [
      { type: 'SGL', label: 'Standard', netRate: 95, sellRate: 130, maxOcc: 1, available: 15, boards: [{ type: 'RO', label: 'Sans repas', netExtra: 0 }, { type: 'BB', label: 'Petit-déj.', netExtra: 12 }, { type: 'HB', label: 'Demi-pension', netExtra: 35 }] },
      { type: 'DBL', label: 'Supérieure', netRate: 120, sellRate: 165, maxOcc: 2, available: 10, boards: [{ type: 'RO', label: 'Sans repas', netExtra: 0 }, { type: 'BB', label: 'Petit-déj.', netExtra: 20 }, { type: 'HB', label: 'Demi-pension', netExtra: 55 }] },
      { type: 'TWN', label: 'Twin Vue Mer', netRate: 145, sellRate: 195, maxOcc: 2, available: 5, boards: [{ type: 'RO', label: 'Sans repas', netExtra: 0 }, { type: 'BB', label: 'Petit-déj.', netExtra: 20 }] },
    ],
  },
  {
    id: 'h6',
    name: 'Les Jardins de la Médina',
    stars: 5,
    category: 'Riad 5★',
    city: 'Marrakech',
    district: 'Kasbah',
    image: 'from-orange-600 to-amber-900',
    netRate: 155,
    sellRate: 210,
    commission: 26,
    available: false,
    availRooms: 0,
    amenities: ['wifi', 'pool', 'restaurant'],
    board: ['BB', 'HB'],
    rating: 9.0,
    reviews: 760,
    description: 'Riad historique avec jardin tropical de 3 000m². Architecture marocaine préservée, piscine chauffée.',
    policies: ['Annulation gratuite 72h avant', 'Arrhes 30% à la réservation'],
    rooms: [
      { type: 'DBL', label: 'Chambre Jardin', netRate: 155, sellRate: 210, maxOcc: 2, available: 0, boards: [{ type: 'BB', label: 'Petit-déj.', netExtra: 0 }] },
    ],
  },
]

const DEMO_BOOKINGS: Booking[] = [
  { ref: 'STRB-2026-0412', hotel: 'La Mamounia', city: 'Marrakech', checkIn: '2026-06-12', checkOut: '2026-06-19', nights: 7, rooms: 9, pax: 18, roomType: 'DBL', board: 'HB', status: 'confirmed', netTotal: 26460, sellTotal: 34650, commission: 8190, bookedAt: '2026-04-15', guestName: 'Groupe Paris — Müller GmbH', voucherReady: true },
  { ref: 'STRB-2026-0389', hotel: 'Riad Fes Boutique Palace', city: 'Fès', checkIn: '2026-05-20', checkOut: '2026-05-25', nights: 5, rooms: 12, pax: 22, roomType: 'SGL', board: 'BB', status: 'confirmed', netTotal: 10800, sellTotal: 14700, commission: 3900, bookedAt: '2026-04-10', guestName: 'Groupe Culture Maroc — Voyages Durand', voucherReady: true },
  { ref: 'STRB-2026-0451', hotel: 'Sofitel Agadir Thalassa', city: 'Agadir', checkIn: '2026-07-01', checkOut: '2026-07-08', nights: 7, rooms: 18, pax: 35, roomType: 'SGL', board: 'AI', status: 'pending', netTotal: 26460, sellTotal: 35280, commission: 8820, bookedAt: '2026-04-22', guestName: 'Family Club — Reisebüro Wien', voucherReady: false },
  { ref: 'STRB-2026-0398', hotel: 'Barceló Tanger', city: 'Tanger', checkIn: '2026-05-10', checkOut: '2026-05-13', nights: 3, rooms: 5, pax: 8, roomType: 'DBL', board: 'BB', status: 'confirmed', netTotal: 1800, sellTotal: 2475, commission: 675, bookedAt: '2026-04-08', guestName: 'Business Trip — Agence Soleil', voucherReady: true },
  { ref: 'STRB-2026-0367', hotel: 'Palais Namaskar', city: 'Marrakech', checkIn: '2026-06-03', checkOut: '2026-06-07', nights: 4, rooms: 3, pax: 6, roomType: 'STE', board: 'BB', status: 'on_request', netTotal: 14400, sellTotal: 19200, commission: 4800, bookedAt: '2026-04-18', guestName: 'VIP — Luxury Travel Partners', voucherReady: false },
  { ref: 'STRB-2026-0321', hotel: 'Riad Fes Boutique Palace', city: 'Fès', checkIn: '2026-04-15', checkOut: '2026-04-18', nights: 3, rooms: 6, pax: 10, roomType: 'DBL', board: 'HB', status: 'cancelled', netTotal: 5040, sellTotal: 6840, commission: 0, bookedAt: '2026-03-28', guestName: 'Annulé — Agence Touristique Sud', voucherReady: false },
]

// ── Helpers ────────────────────────────────────────────────────────────────
const BOARD_LABELS: Record<BoardType, string> = { RO: 'Sans repas', BB: 'Petit-déj.', HB: 'Demi-pension', FB: 'Pension complète', AI: 'Tout inclus' }
const BOARD_COLORS: Record<BoardType, string> = { RO: 'bg-slate-700/40 text-slate-300', BB: 'bg-blue-500/15 text-blue-300', HB: 'bg-teal-500/15 text-teal-300', FB: 'bg-violet-500/15 text-violet-300', AI: 'bg-amber-500/15 text-amber-300' }
const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string }> = {
  confirmed: { label: 'Confirmée', color: 'bg-green-500/15 text-green-300 border-green-500/25' },
  pending:   { label: 'En attente', color: 'bg-amber-500/15 text-amber-300 border-amber-500/25' },
  cancelled: { label: 'Annulée', color: 'bg-red-500/15 text-red-300 border-red-500/25' },
  on_request:{ label: 'Sur demande', color: 'bg-violet-500/15 text-violet-300 border-violet-500/25' },
}
const ROOM_LABELS: Record<RoomType, string> = { SGL: 'Chambre simple', DBL: 'Chambre double', TWN: 'Twin', STE: 'Suite', JNS: 'Junior Suite', FAM: 'Familiale' }
const AMENITY_ICONS: Record<string, { icon: typeof Wifi; label: string }> = {
  wifi:       { icon: Wifi,     label: 'Wi-Fi' },
  pool:       { icon: Waves,    label: 'Piscine' },
  spa:        { icon: Wind,     label: 'Spa' },
  gym:        { icon: Dumbbell, label: 'Gym' },
  restaurant: { icon: Coffee,   label: 'Restaurant' },
  parking:    { icon: Car,      label: 'Parking' },
  beach:      { icon: Globe,    label: 'Plage' },
}

function StarRow({ n, size = 'sm' }: { n: number; size?: 'sm' | 'lg' }) {
  return (
    <div className={`flex gap-0.5 ${size === 'lg' ? 'text-base' : 'text-xs'}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} ${i < n ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
      ))}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────
export function B2BHotelPortalPage() {
  const [activeTab, setActiveTab] = useState<'search' | 'bookings' | 'commissions' | 'agency'>('search')
  const [destination, setDestination] = useState('Maroc')
  const [checkIn, setCheckIn] = useState('2026-06-12')
  const [checkOut, setCheckOut] = useState('2026-06-19')
  const [rooms, setRooms] = useState(9)
  const [adults, setAdults] = useState(18)
  const [starFilter, setStarFilter] = useState<number[]>([])
  const [cityFilter, setCityFilter] = useState('')
  const [boardFilter, setBoardFilter] = useState<BoardType | ''>('')
  const [maxPrice, setMaxPrice] = useState(600)
  const [showFilters, setShowFilters] = useState(false)
  const [searched, setSearched] = useState(true)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<RoomConfig | null>(null)
  const [selectedBoard, setSelectedBoard] = useState<BoardType>('BB')
  const [bookingStep, setBookingStep] = useState<'list' | 'detail' | 'book' | 'confirm'>('list')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('')
  const [nights, setNights] = useState(7)

  const cities = [...new Set(HOTELS.map(h => h.city))].sort()

  const filteredHotels = useMemo(() => {
    return HOTELS.filter(h => {
      if (starFilter.length > 0 && !starFilter.includes(h.stars)) return false
      if (cityFilter && h.city !== cityFilter) return false
      if (boardFilter && !h.board.includes(boardFilter as BoardType)) return false
      if (h.netRate > maxPrice) return false
      return true
    })
  }, [starFilter, cityFilter, boardFilter, maxPrice])

  const filteredBookings = useMemo(() => {
    if (!statusFilter) return DEMO_BOOKINGS
    return DEMO_BOOKINGS.filter(b => b.status === statusFilter)
  }, [statusFilter])

  const totalCommission = DEMO_BOOKINGS.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.commission, 0)
  const pendingCommission = DEMO_BOOKINGS.filter(b => b.status === 'pending').reduce((s, b) => s + b.commission, 0)
  const confirmedCommission = DEMO_BOOKINGS.filter(b => b.status === 'confirmed').reduce((s, b) => s + b.commission, 0)
  const avgCommission = Math.round(HOTELS.reduce((s, h) => s + h.commission, 0) / HOTELS.length)

  function openHotel(hotel: Hotel) {
    setSelectedHotel(hotel)
    setSelectedRoom(hotel.rooms[0])
    setSelectedBoard(hotel.rooms[0].boards[0].type)
    setBookingStep('detail')
  }

  function startBooking() {
    setBookingStep('book')
  }

  function confirmBooking() {
    setBookingStep('confirm')
  }

  function resetSearch() {
    setBookingStep('list')
    setSelectedHotel(null)
    setSelectedRoom(null)
    setGuestName('')
    setGuestEmail('')
  }

  function toggleStar(s: number) {
    setStarFilter(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const nightCount = useMemo(() => {
    const d1 = new Date(checkIn), d2 = new Date(checkOut)
    return Math.max(1, Math.round((d2.getTime() - d1.getTime()) / 86400000))
  }, [checkIn, checkOut])

  const roomTotal = useMemo(() => {
    if (!selectedRoom) return { net: 0, sell: 0, comm: 0 }
    const boardExtra = selectedRoom.boards.find(b => b.type === selectedBoard)?.netExtra ?? 0
    const net = (selectedRoom.netRate + boardExtra) * nightCount * rooms
    const ratio = selectedRoom.sellRate / selectedRoom.netRate
    const sell = Math.round((selectedRoom.netRate + boardExtra) * ratio * nightCount * rooms)
    return { net, sell, comm: sell - net }
  }, [selectedRoom, selectedBoard, nightCount, rooms])

  // ── TABS ──────────────────────────────────────────────────────────────
  const TABS = [
    { id: 'search',      label: 'Rechercher',     icon: Search },
    { id: 'bookings',    label: 'Réservations',   icon: FileText, badge: DEMO_BOOKINGS.filter(b => b.status === 'pending').length },
    { id: 'commissions', label: 'Commissions',    icon: Percent },
    { id: 'agency',      label: 'Mon Agence',     icon: Building2 },
  ] as const

  return (
    <div className="min-h-full bg-[#0b0e17]">

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-0">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,.3)]">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">B2B Hôtel Portal</h1>
              <p className="text-xs text-slate-400">Tarifs nets agents · Maroc · {HOTELS.length} établissements</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/25 text-green-300 text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live rates
            </div>
          </div>
        </div>

        {/* KPI bar */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { icon: Building2, label: 'Hôtels dispo', value: HOTELS.filter(h=>h.available).length + '/' + HOTELS.length, color: 'text-blue-300' },
            { icon: Percent,   label: 'Commission moy.', value: avgCommission + '%', color: 'text-teal-300' },
            { icon: DollarSign,label: 'Comm. confirmée', value: confirmedCommission.toLocaleString('fr') + ' €', color: 'text-green-300' },
            { icon: Clock,     label: 'En attente', value: pendingCommission.toLocaleString('fr') + ' €', color: 'text-amber-300' },
          ].map(kpi => {
            const Icon = kpi.icon
            return (
              <div key={kpi.label} className="bg-[#1a2035] border border-white/7 rounded-xl p-3 text-center">
                <Icon className={`w-4 h-4 mx-auto mb-1 ${kpi.color}`} />
                <div className={`text-sm font-black ${kpi.color}`}>{kpi.value}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{kpi.label}</div>
              </div>
            )
          })}
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-white/7">
          {TABS.map(t => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => { setActiveTab(t.id as typeof activeTab); if (t.id === 'search') resetSearch() }}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all relative ${
                  activeTab === t.id ? 'text-blue-300 border-blue-400' : 'text-slate-500 border-transparent hover:text-slate-300'
                }`}>
                <Icon className="w-4 h-4" />
                {t.label}
                {'badge' in t && t.badge > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-[9px] font-black text-white flex items-center justify-center">{t.badge}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto">

        {/* ══ TAB: SEARCH ════════════════════════════════════════════════ */}
        {activeTab === 'search' && bookingStep === 'list' && (
          <div className="space-y-5">
            {/* Search form */}
            <div className="bg-[#1a2035] border border-white/7 rounded-2xl p-5">
              <div className="grid grid-cols-2 gap-3 mb-3 lg:grid-cols-4">
                <div className="lg:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={destination} onChange={e => setDestination(e.target.value)}
                      className="w-full bg-[#0f1520] border border-white/8 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500/50"
                      placeholder="Destination, ville, hôtel…" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Check-in</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
                      className="w-full bg-[#0f1520] border border-white/8 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/50" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Check-out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
                      className="w-full bg-[#0f1520] border border-white/8 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/50" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4 lg:grid-cols-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Chambres</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="number" min={1} value={rooms} onChange={e => setRooms(Number(e.target.value))}
                      className="w-full bg-[#0f1520] border border-white/8 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/50" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Adultes</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="number" min={1} value={adults} onChange={e => setAdults(Number(e.target.value))}
                      className="w-full bg-[#0f1520] border border-white/8 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/50" />
                  </div>
                </div>
                <div className="lg:col-span-2 flex items-end gap-3">
                  <button onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${showFilters ? 'bg-blue-500/15 border-blue-500/40 text-blue-300' : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'}`}>
                    <Filter className="w-4 h-4" /> Filtres
                    {(starFilter.length > 0 || cityFilter || boardFilter || maxPrice < 600) && (
                      <span className="w-4 h-4 rounded-full bg-blue-500 text-[9px] font-black text-white flex items-center justify-center">
                        {[starFilter.length > 0, !!cityFilter, !!boardFilter, maxPrice < 600].filter(Boolean).length}
                      </span>
                    )}
                  </button>
                  <button onClick={() => setSearched(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 text-white font-black text-sm shadow-[0_2px_12px_rgba(59,130,246,.3)] hover:shadow-[0_2px_20px_rgba(59,130,246,.5)] transition-all">
                    <Search className="w-4 h-4" /> Rechercher
                  </button>
                </div>
              </div>

              {/* Filters panel */}
              {showFilters && (
                <div className="border-t border-white/7 pt-4 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-2">Étoiles</p>
                      <div className="flex gap-2">
                        {[3, 4, 5].map(s => (
                          <button key={s} onClick={() => toggleStar(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${starFilter.includes(s) ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                            {'★'.repeat(s)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-2">Ville</p>
                      <select value={cityFilter} onChange={e => setCityFilter(e.target.value)}
                        className="w-full bg-[#0f1520] border border-white/8 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none">
                        <option value="">Toutes les villes</option>
                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 mb-2">Régime</p>
                      <select value={boardFilter} onChange={e => setBoardFilter(e.target.value as BoardType | '')}
                        className="w-full bg-[#0f1520] border border-white/8 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none">
                        <option value="">Tous régimes</option>
                        {(['RO','BB','HB','FB','AI'] as BoardType[]).map(b => <option key={b} value={b}>{BOARD_LABELS[b]}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-2">Tarif net max/nuit : <span className="text-white">{maxPrice} €</span></p>
                    <input type="range" min={50} max={600} step={10} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-blue-500" />
                    <div className="flex justify-between text-xs text-slate-500 mt-1"><span>50 €</span><span>600 €</span></div>
                  </div>
                </div>
              )}
            </div>

            {/* Results summary */}
            {searched && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">
                  <span className="text-white font-bold">{filteredHotels.length} établissements</span> · {nightCount} nuit{nightCount > 1 ? 's' : ''} · {rooms} chambre{rooms > 1 ? 's' : ''} · {adults} adultes
                </p>
                <span className="text-xs text-slate-500">{checkIn} → {checkOut}</span>
              </div>
            )}

            {/* Hotel cards */}
            {searched && (
              <div className="space-y-3">
                {filteredHotels.map(hotel => (
                  <div key={hotel.id}
                    className={`bg-[#1a2035] border rounded-2xl overflow-hidden transition-all hover:border-blue-500/30 ${hotel.available ? 'border-white/7 cursor-pointer' : 'border-white/4 opacity-60'}`}
                    onClick={() => hotel.available && openHotel(hotel)}>
                    <div className="flex">
                      {/* Image */}
                      <div className={`w-40 flex-shrink-0 bg-gradient-to-br ${hotel.image} flex flex-col items-center justify-center relative`}>
                        <div className="text-4xl mb-1">🏨</div>
                        <StarRow n={hotel.stars} />
                        {!hotel.available && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-xs font-bold text-red-300 bg-red-500/20 px-2 py-1 rounded-full">Complet</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-black text-white text-base">{hotel.name}</h3>
                              <span className="px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300 text-[10px] font-bold">{hotel.category}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                              <MapPin className="w-3 h-3" /> {hotel.district}, {hotel.city}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-slate-400">Tarif net /nuit</div>
                            <div className="text-xl font-black text-white">{hotel.netRate} €</div>
                            <div className="text-xs text-teal-300 font-bold">Vente: {hotel.sellRate} €</div>
                          </div>
                        </div>

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {hotel.amenities.slice(0, 5).map(a => {
                            const info = AMENITY_ICONS[a]
                            if (!info) return null
                            const Icon = info.icon
                            return (
                              <span key={a} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-slate-400 text-[10px]">
                                <Icon className="w-3 h-3" /> {info.label}
                              </span>
                            )
                          })}
                        </div>

                        {/* Boards & commission */}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1.5 flex-wrap">
                            {hotel.board.map(b => (
                              <span key={b} className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${BOARD_COLORS[b]}`}>{b}</span>
                            ))}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <div className="text-xs font-bold text-amber-400">★ {hotel.rating}</div>
                              <div className="text-[10px] text-slate-500">({hotel.reviews})</div>
                            </div>
                            <div className="px-2.5 py-1 rounded-lg bg-teal-500/15 border border-teal-500/25 text-teal-300 text-xs font-black">
                              Comm. {hotel.commission}%
                            </div>
                            {hotel.available && (
                              <div className="flex items-center gap-1 text-xs text-green-400 font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                {hotel.availRooms} dispo
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ HOTEL DETAIL ════════════════════════════════════════════════ */}
        {activeTab === 'search' && bookingStep === 'detail' && selectedHotel && (
          <div className="space-y-5 animate-[fadeIn_.25s_ease]">
            {/* Back */}
            <button onClick={resetSearch} className="flex items-center gap-2 text-sm text-blue-300 font-bold hover:text-blue-200 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Retour aux résultats
            </button>

            {/* Hero */}
            <div className={`rounded-2xl bg-gradient-to-br ${selectedHotel.image} p-6 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <StarRow n={selectedHotel.stars} size="lg" />
                    <h2 className="text-2xl font-black text-white mt-2">{selectedHotel.name}</h2>
                    <div className="flex items-center gap-2 text-white/70 text-sm mt-1">
                      <MapPin className="w-4 h-4" /> {selectedHotel.district}, {selectedHotel.city}
                    </div>
                  </div>
                  <div className="text-right bg-black/30 rounded-xl p-3 backdrop-blur-sm">
                    <div className="text-white/60 text-xs">Commission agent</div>
                    <div className="text-2xl font-black text-teal-300">{selectedHotel.commission}%</div>
                  </div>
                </div>
                <p className="text-white/70 text-sm mt-3 max-w-xl">{selectedHotel.description}</p>
              </div>
            </div>

            {/* Room selector */}
            <div className="bg-[#1a2035] border border-white/7 rounded-2xl p-5">
              <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" /> Types de chambres
              </h3>
              <div className="space-y-2">
                {selectedHotel.rooms.map(room => (
                  <div key={room.type}
                    onClick={() => { setSelectedRoom(room); setSelectedBoard(room.boards[0].type) }}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedRoom?.type === room.type
                        ? 'bg-blue-500/10 border-blue-500/40'
                        : 'bg-white/3 border-white/7 hover:border-white/15'
                    }`}>
                    <div>
                      <div className="font-bold text-white text-sm">{room.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{ROOM_LABELS[room.type]} · Max {room.maxOcc} pers. · {room.available} dispo</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Net /nuit</div>
                      <div className="text-lg font-black text-white">{room.netRate} €</div>
                      <div className="text-xs text-teal-300">Vente: {room.sellRate} €</div>
                    </div>
                    {selectedRoom?.type === room.type && <Check className="w-5 h-5 text-blue-400 ml-3 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Board selector */}
            {selectedRoom && (
              <div className="bg-[#1a2035] border border-white/7 rounded-2xl p-5">
                <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-400" /> Régime alimentaire
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {selectedRoom.boards.map(b => (
                    <button key={b.type} onClick={() => setSelectedBoard(b.type)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                        selectedBoard === b.type ? 'bg-teal-500/15 border-teal-500/40 text-teal-300' : 'bg-white/5 border-white/10 text-slate-400'
                      }`}>
                      {b.label}
                      {b.netExtra > 0 && <span className="text-xs opacity-70">+{b.netExtra} €</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price summary */}
            {selectedRoom && (
              <div className="bg-gradient-to-br from-blue-500/10 to-teal-500/8 border border-blue-500/25 rounded-2xl p-5">
                <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-400" /> Récapitulatif tarifaire
                </h3>
                <div className="space-y-2">
                  {[
                    { label: `${rooms} ch. × ${nightCount} nuits × ${selectedRoom.netRate}€`, value: `${roomTotal.net.toLocaleString('fr')} €`, note: 'Tarif net' },
                    { label: 'Prix de vente suggéré', value: `${roomTotal.sell.toLocaleString('fr')} €`, note: 'Client final', highlight: true },
                    { label: `Votre commission (${selectedHotel.commission}%)`, value: `${roomTotal.comm.toLocaleString('fr')} €`, note: 'À encaisser', green: true },
                  ].map(row => (
                    <div key={row.label} className={`flex justify-between items-center py-2 ${!row.green ? 'border-b border-white/5' : ''}`}>
                      <div>
                        <div className={`text-sm font-bold ${row.highlight ? 'text-white' : 'text-slate-300'}`}>{row.label}</div>
                        <div className="text-xs text-slate-500">{row.note}</div>
                      </div>
                      <span className={`text-base font-black ${row.green ? 'text-green-400' : row.highlight ? 'text-teal-300 text-lg' : 'text-white'}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Policies */}
            <div className="bg-[#1a2035] border border-white/7 rounded-2xl p-5">
              <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-400" /> Conditions & Politiques
              </h3>
              <ul className="space-y-2">
                {selectedHotel.policies.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" /> {p}
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={startBooking}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 text-white font-black text-base flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(59,130,246,.3)]">
              Réserver maintenant <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ══ BOOKING FORM ═══════════════════════════════════════════════ */}
        {activeTab === 'search' && bookingStep === 'book' && selectedHotel && selectedRoom && (
          <div className="space-y-5 animate-[fadeIn_.25s_ease]">
            <button onClick={() => setBookingStep('detail')} className="flex items-center gap-2 text-sm text-blue-300 font-bold">
              <ChevronLeft className="w-4 h-4" /> Retour au détail
            </button>

            <h2 className="text-lg font-black text-white">Finaliser la réservation</h2>

            {/* Booking summary */}
            <div className="bg-[#1a2035] border border-white/7 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedHotel.image} flex items-center justify-center text-2xl`}>🏨</div>
                <div>
                  <div className="font-black text-white">{selectedHotel.name}</div>
                  <div className="text-xs text-slate-400">{selectedRoom.label} · {BOARD_LABELS[selectedBoard]} · {nightCount} nuits · {rooms} ch.</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-xs text-slate-400">Net total</div>
                  <div className="text-lg font-black text-white">{roomTotal.net.toLocaleString('fr')} €</div>
                </div>
              </div>
            </div>

            {/* Guest info */}
            <div className="bg-[#1a2035] border border-white/7 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-black text-white">Informations client</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">Nom du groupe / voyageur</label>
                  <input value={guestName} onChange={e => setGuestName(e.target.value)}
                    className="w-full bg-[#0f1520] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500/50"
                    placeholder="Ex: Müller GmbH — 18 pax" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">Email de confirmation</label>
                  <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)}
                    className="w-full bg-[#0f1520] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500/50"
                    placeholder="agent@agence.com" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">Check-in</label>
                  <input type="date" value={checkIn} readOnly className="w-full bg-[#0f1520] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white outline-none opacity-60" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">Check-out</label>
                  <input type="date" value={checkOut} readOnly className="w-full bg-[#0f1520] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white outline-none opacity-60" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1.5">Chambres</label>
                  <input type="number" value={rooms} readOnly className="w-full bg-[#0f1520] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white outline-none opacity-60" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">Notes spéciales</label>
                <textarea rows={2} className="w-full bg-[#0f1520] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500/50 resize-none"
                  placeholder="Demandes spéciales, allergies, arrangements VIP…" />
              </div>
            </div>

            {/* Commission preview */}
            <div className="flex items-center gap-3 bg-teal-500/8 border border-teal-500/20 rounded-xl p-4">
              <Tag className="w-5 h-5 text-teal-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-teal-300">Commission estimée : {roomTotal.comm.toLocaleString('fr')} €</div>
                <div className="text-xs text-slate-400 mt-0.5">Versée sous 30 jours après check-out</div>
              </div>
            </div>

            <button onClick={confirmBooking} disabled={!guestName.trim()}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 text-white font-black flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(59,130,246,.3)]">
              <Check className="w-5 h-5" /> Confirmer la réservation
            </button>
          </div>
        )}

        {/* ══ BOOKING CONFIRM ════════════════════════════════════════════ */}
        {activeTab === 'search' && bookingStep === 'confirm' && selectedHotel && selectedRoom && (
          <div className="space-y-5 text-center animate-[fadeIn_.3s_ease]">
            <div className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500/40 flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white mb-2">Réservation confirmée !</h2>
              <p className="text-slate-400 text-sm">Votre voucher a été généré et envoyé par email.</p>
            </div>
            <div className="bg-[#1a2035] border border-green-500/25 rounded-2xl p-5 text-left space-y-3">
              {[
                { label: 'Référence', value: `STRB-2026-0${Math.floor(Math.random()*900+100)}` },
                { label: 'Hôtel', value: selectedHotel.name },
                { label: 'Chambre', value: selectedRoom.label },
                { label: 'Check-in', value: checkIn },
                { label: 'Check-out', value: checkOut },
                { label: 'Tarif net total', value: `${roomTotal.net.toLocaleString('fr')} €` },
                { label: 'Votre commission', value: `${roomTotal.comm.toLocaleString('fr')} €` },
              ].map(row => (
                <div key={row.label} className="flex justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                  <span className="text-xs text-slate-400">{row.label}</span>
                  <span className="text-sm font-bold text-white">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold text-sm hover:bg-white/8 transition-colors">
                <Download className="w-4 h-4" /> Télécharger voucher
              </button>
              <button onClick={resetSearch}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold text-sm">
                <Plus className="w-4 h-4" /> Nouvelle recherche
              </button>
            </div>
          </div>
        )}

        {/* ══ TAB: BOOKINGS ══════════════════════════════════════════════ */}
        {activeTab === 'bookings' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white">Mes Réservations</h2>
              <span className="text-xs text-slate-400">{filteredBookings.length} dossiers</span>
            </div>
            {/* Status filter */}
            <div className="flex gap-2 flex-wrap">
              {([['', 'Toutes'], ['confirmed', 'Confirmées'], ['pending', 'En attente'], ['on_request', 'Sur demande'], ['cancelled', 'Annulées']] as [BookingStatus | '', string][]).map(([s, l]) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${statusFilter === s ? 'bg-blue-500/15 border-blue-500/40 text-blue-300' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                  {l}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredBookings.map(b => {
                const st = STATUS_CONFIG[b.status]
                return (
                  <div key={b.ref} className="bg-[#1a2035] border border-white/7 rounded-2xl p-4 hover:border-white/12 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white">{b.hotel}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${st.color}`}>{st.label}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{b.guestName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500 font-mono">{b.ref}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{b.bookedAt}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 mb-3 text-center">
                      {[
                        { label: 'Dates', value: `${b.checkIn} → ${b.checkOut}` },
                        { label: `${b.nights}n · ${b.rooms}ch · ${b.pax}pax`, value: `${ROOM_LABELS[b.roomType]} · ${b.board}` },
                        { label: 'Net total', value: `${b.netTotal.toLocaleString('fr')} €` },
                        { label: 'Commission', value: b.status === 'cancelled' ? '—' : `${b.commission.toLocaleString('fr')} €` },
                      ].map((item, i) => (
                        <div key={i} className="bg-white/3 rounded-xl p-2">
                          <div className="text-[10px] text-slate-500">{item.label}</div>
                          <div className={`text-xs font-bold mt-0.5 ${i === 3 && b.status !== 'cancelled' ? 'text-teal-300' : 'text-slate-200'}`}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/8 transition-colors">
                        <Eye className="w-3.5 h-3.5" /> Détail
                      </button>
                      {b.voucherReady && (
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-bold hover:bg-blue-500/15 transition-colors">
                          <Download className="w-3.5 h-3.5" /> Voucher PDF
                        </button>
                      )}
                      {b.status === 'pending' && (
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold hover:bg-amber-500/15 transition-colors">
                          <RefreshCw className="w-3.5 h-3.5" /> Relancer
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ══ TAB: COMMISSIONS ═══════════════════════════════════════════ */}
        {activeTab === 'commissions' && (
          <div className="space-y-5">
            <h2 className="text-lg font-black text-white">Tableau des Commissions</h2>

            {/* Commission KPIs */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total gagné', value: totalCommission, color: 'from-teal-500/15 to-blue-500/10 border-teal-500/25 text-teal-300' },
                { label: 'Confirmé', value: confirmedCommission, color: 'from-green-500/15 to-teal-500/10 border-green-500/25 text-green-300' },
                { label: 'En attente', value: pendingCommission, color: 'from-amber-500/15 to-orange-500/10 border-amber-500/25 text-amber-300' },
              ].map(kpi => (
                <div key={kpi.label} className={`rounded-2xl bg-gradient-to-br ${kpi.color} border p-4 text-center`}>
                  <div className={`text-2xl font-black ${kpi.color.split(' ').pop()}`}>{kpi.value.toLocaleString('fr')} €</div>
                  <div className="text-xs text-slate-400 mt-1">{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Monthly bar chart (simplified) */}
            <div className="bg-[#1a2035] border border-white/7 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-black text-white">Commissions 2026</span>
              </div>
              <div className="flex items-end gap-2 h-28">
                {[
                  { m: 'Jan', v: 3200 }, { m: 'Fév', v: 4800 }, { m: 'Mar', v: 3900 },
                  { m: 'Avr', v: totalCommission }, { m: 'Mai', v: 0, future: true },
                  { m: 'Jun', v: 0, future: true }, { m: 'Jul', v: 0, future: true },
                ].map(bar => {
                  const max = Math.max(3200, 4800, 3900, totalCommission)
                  const pct = bar.v > 0 ? Math.round((bar.v / max) * 100) : 10
                  return (
                    <div key={bar.m} className="flex-1 flex flex-col items-center gap-1">
                      <div className="text-[9px] text-slate-500 font-bold">{bar.v > 0 && !bar.future ? bar.v.toLocaleString('fr')+'€' : ''}</div>
                      <div className={`w-full rounded-t-md transition-all ${bar.future ? 'bg-white/5 border border-dashed border-white/10' : 'bg-gradient-to-t from-blue-600 to-teal-400'}`}
                        style={{ height: `${pct}%` }} />
                      <div className="text-[10px] text-slate-400">{bar.m}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Top hotels by commission */}
            <div className="bg-[#1a2035] border border-white/7 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-black text-white">Top hôtels par commission</span>
              </div>
              {[...HOTELS].sort((a, b) => b.commission - a.commission).slice(0, 4).map((h, i) => (
                <div key={h.id} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${i === 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-white/8 text-slate-400'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white">{h.name}</div>
                    <div className="text-xs text-slate-400">{h.city} · {h.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-teal-300">{h.commission}%</div>
                    <div className="text-xs text-slate-500">net {h.netRate}€/n</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Commission breakdown per booking */}
            <div className="bg-[#1a2035] border border-white/7 rounded-2xl p-5">
              <h3 className="text-sm font-black text-white mb-4">Détail par réservation</h3>
              <div className="space-y-2">
                {DEMO_BOOKINGS.filter(b => b.status !== 'cancelled').map(b => (
                  <div key={b.ref} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${b.status === 'confirmed' ? 'bg-green-400' : b.status === 'pending' ? 'bg-amber-400' : 'bg-violet-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">{b.hotel}</div>
                      <div className="text-xs text-slate-400">{b.ref} · {b.checkIn}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-black text-teal-300">{b.commission.toLocaleString('fr')} €</div>
                      <div className="text-[10px] text-slate-500">{STATUS_CONFIG[b.status].label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB: AGENCY ════════════════════════════════════════════════ */}
        {activeTab === 'agency' && (
          <div className="space-y-5">
            <h2 className="text-lg font-black text-white">Mon Agence</h2>

            {/* Agency profile */}
            <div className="bg-gradient-to-br from-blue-500/10 to-teal-500/8 border border-blue-500/25 rounded-2xl p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-600 flex items-center justify-center text-2xl font-black text-white">AT</div>
                <div>
                  <div className="text-xl font-black text-white">Agence TravelPro Maroc</div>
                  <div className="text-sm text-slate-400">Code agence : TPM-2024-0089</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-gold-500/20 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">⭐ Partenaire Gold</span>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-300 text-xs font-bold">Vérifié</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Phone, label: 'Téléphone', value: '+212 522 456 789' },
                  { icon: Mail,  label: 'Email',     value: 'contact@travelpro.ma' },
                  { icon: MapPin, label: 'Adresse',  value: 'Casablanca, Maroc' },
                  { icon: Globe, label: 'Marché',    value: 'Europe + MENA' },
                ].map(item => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-center gap-2 text-sm text-slate-300">
                      <Icon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span className="text-slate-500 mr-1 text-xs">{item.label}:</span>
                      {item.value}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Performance */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Réservations totales', value: DEMO_BOOKINGS.length, icon: FileText, color: 'text-blue-300' },
                { label: 'Taux de confirmation', value: '73%', icon: TrendingUp, color: 'text-green-300' },
                { label: 'Volume total généré', value: DEMO_BOOKINGS.reduce((s, b) => s + b.sellTotal, 0).toLocaleString('fr') + ' €', icon: DollarSign, color: 'text-teal-300' },
                { label: 'Commissions totales', value: totalCommission.toLocaleString('fr') + ' €', icon: Award, color: 'text-amber-300' },
              ].map(item => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="bg-[#1a2035] border border-white/7 rounded-xl p-4">
                    <Icon className={`w-5 h-5 ${item.color} mb-2`} />
                    <div className={`text-lg font-black ${item.color}`}>{item.value}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{item.label}</div>
                  </div>
                )
              })}
            </div>

            {/* Net rates access */}
            <div className="bg-[#1a2035] border border-white/7 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-black text-white">Accès Tarifs Nets</span>
              </div>
              {[
                { cat: 'Hôtels 5★', count: HOTELS.filter(h=>h.stars===5).length, comm: '23–26%', color: 'text-amber-300' },
                { cat: 'Hôtels 4★', count: HOTELS.filter(h=>h.stars===4).length, comm: '25–28%', color: 'text-blue-300' },
                { cat: 'Riads boutique', count: 2, comm: '24–27%', color: 'text-teal-300' },
                { cat: 'Resorts balnéaires', count: 1, comm: '22–25%', color: 'text-violet-300' },
              ].map(row => (
                <div key={row.cat} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-sm text-slate-300">{row.cat}</span>
                    <span className="text-xs text-slate-500">{row.count} hôtels</span>
                  </div>
                  <span className={`text-xs font-black ${row.color}`}>{row.comm}</span>
                </div>
              ))}
            </div>

            {/* Contact DMC */}
            <div className="bg-[#1a2035] border border-white/7 rounded-2xl p-5">
              <h3 className="text-sm font-black text-white mb-3">Contact S'TOURS DMC</h3>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-violet-600 flex items-center justify-center text-sm font-black text-white flex-shrink-0">SA</div>
                <div>
                  <div className="font-bold text-white">Sara Alaoui</div>
                  <div className="text-xs text-slate-400">Travel Designer · Votre référente B2B</div>
                </div>
                <div className="ml-auto flex gap-2">
                  <button className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-300 hover:bg-teal-500/20 transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-300 hover:bg-blue-500/20 transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
      `}</style>
    </div>
  )
}
