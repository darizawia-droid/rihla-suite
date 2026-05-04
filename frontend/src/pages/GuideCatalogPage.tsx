import { useState, useMemo } from 'react'
import {
  UserCheck, Search, Plus, X, Star, MapPin,
  Globe2, Award, Calendar, DollarSign, Clock,
  Eye, Phone, Mail, Languages, Mountain, Users,
  CheckCircle2, AlertCircle,
} from 'lucide-react'
import { clsx } from 'clsx'

type RateType = 'journee' | 'demi_journee' | 'transfert' | 'multi_jours'
type Certification = 'officiel' | 'specialise_montagne' | 'specialise_sahara' | 'culturel' | 'nature'

interface GuideRate {
  id: string
  type: RateType
  rate: number
  season: string
  seasonType: 'haute' | 'basse' | 'moyenne'
  maxPax: number
  notes: string
}

interface GuideAvailability {
  month: string
  status: 'available' | 'partial' | 'unavailable'
}

interface GuideEntry {
  id: string
  name: string
  photo: string
  city: string
  phone: string
  email: string
  languages: string[]
  certifications: Certification[]
  zones: string[]
  rating: number
  totalTours: number
  yearsExp: number
  status: 'active' | 'on_tour' | 'unavailable'
  specialties: string[]
  rates: GuideRate[]
  availability: GuideAvailability[]
  notes: string
  tags: string[]
}

const CERT_LABELS: Record<Certification, { label: string; color: string }> = {
  officiel: { label: 'Guide Officiel', color: 'bg-emerald-500/10 text-emerald-600' },
  specialise_montagne: { label: 'Spécialiste Montagne', color: 'bg-amber-500/10 text-amber-600' },
  specialise_sahara: { label: 'Spécialiste Sahara', color: 'bg-orange-500/10 text-orange-600' },
  culturel: { label: 'Guide Culturel', color: 'bg-blue-500/10 text-blue-600' },
  nature: { label: 'Guide Nature', color: 'bg-green-500/10 text-green-600' },
}
const RATE_LABELS: Record<RateType, string> = {
  journee: 'Journée complète', demi_journee: 'Demi-journée', transfert: 'Transfert', multi_jours: 'Multi-jours',
}

const GUIDES: GuideEntry[] = [
  {
    id: 'G001', name: 'Hassan Amazigh', photo: '', city: 'Marrakech',
    phone: '+212 661 123 456', email: 'hassan.guide@gmail.com',
    languages: ['FR', 'EN', 'ES', 'AR'], certifications: ['officiel', 'culturel'],
    zones: ['Marrakech', 'Atlas', 'Essaouira', 'Ouarzazate'],
    rating: 4.9, totalTours: 320, yearsExp: 12, status: 'active',
    specialties: ['Médina Marrakech', 'Jardins historiques', 'Architecture islamique', 'Souks'],
    notes: 'Guide référence pour Marrakech. Excellente relation client. Disponible weekend.',
    tags: ['Top Guide', 'VIP', 'Marrakech'],
    rates: [
      { id: 'GR1', type: 'journee', rate: 800, season: 'Toute saison', seasonType: 'moyenne', maxPax: 15, notes: 'Inclut déjeuner guide' },
      { id: 'GR2', type: 'journee', rate: 1000, season: 'Haute Saison', seasonType: 'haute', maxPax: 15, notes: 'Tarif haute saison' },
      { id: 'GR3', type: 'demi_journee', rate: 500, season: 'Toute saison', seasonType: 'moyenne', maxPax: 15, notes: '4 heures maximum' },
      { id: 'GR4', type: 'transfert', rate: 300, season: 'Toute saison', seasonType: 'moyenne', maxPax: 20, notes: 'Accompagnement transfert + briefing' },
    ],
    availability: [
      { month: 'Jan', status: 'available' }, { month: 'Fév', status: 'available' },
      { month: 'Mar', status: 'available' }, { month: 'Avr', status: 'partial' },
      { month: 'Mai', status: 'available' }, { month: 'Jun', status: 'available' },
      { month: 'Jul', status: 'partial' }, { month: 'Aoû', status: 'unavailable' },
      { month: 'Sep', status: 'available' }, { month: 'Oct', status: 'available' },
      { month: 'Nov', status: 'available' }, { month: 'Déc', status: 'partial' },
    ],
  },
  {
    id: 'G002', name: 'Fatima Zahra El Idrissi', photo: '', city: 'Fès',
    phone: '+212 662 234 567', email: 'fatima.guide.fes@gmail.com',
    languages: ['FR', 'EN', 'AR', 'IT'], certifications: ['officiel', 'culturel'],
    zones: ['Fès', 'Meknès', 'Volubilis', 'Moulay Idriss'],
    rating: 4.8, totalTours: 250, yearsExp: 8, status: 'active',
    specialties: ['Médina de Fès', 'Artisanat fassi', 'Gastronomie', 'Architecture mérinide'],
    notes: 'Spécialiste incontestée de Fès. Réseau d\'artisans pour visites privées.',
    tags: ['Expert Fès', 'Artisanat', 'Gastronomie'],
    rates: [
      { id: 'GR5', type: 'journee', rate: 750, season: 'Toute saison', seasonType: 'moyenne', maxPax: 12, notes: '' },
      { id: 'GR6', type: 'demi_journee', rate: 450, season: 'Toute saison', seasonType: 'moyenne', maxPax: 12, notes: '' },
      { id: 'GR7', type: 'multi_jours', rate: 650, season: 'Toute saison', seasonType: 'moyenne', maxPax: 10, notes: 'Tarif/jour pour circuits 3+ jours' },
    ],
    availability: [
      { month: 'Jan', status: 'available' }, { month: 'Fév', status: 'available' },
      { month: 'Mar', status: 'available' }, { month: 'Avr', status: 'available' },
      { month: 'Mai', status: 'partial' }, { month: 'Jun', status: 'available' },
      { month: 'Jul', status: 'available' }, { month: 'Aoû', status: 'partial' },
      { month: 'Sep', status: 'available' }, { month: 'Oct', status: 'available' },
      { month: 'Nov', status: 'available' }, { month: 'Déc', status: 'available' },
    ],
  },
  {
    id: 'G003', name: 'Brahim Ait Oumghar', photo: '', city: 'Ouarzazate',
    phone: '+212 663 345 678', email: 'brahim.sahara@gmail.com',
    languages: ['FR', 'EN', 'AR', 'DE'], certifications: ['officiel', 'specialise_sahara'],
    zones: ['Sahara', 'Ouarzazate', 'Draa-Tafilalet', 'Zagora', 'Merzouga'],
    rating: 4.9, totalTours: 180, yearsExp: 15, status: 'on_tour',
    specialties: ['Trekking Sahara', 'Bivouac', 'Astronomie', 'Culture nomade', 'Navigation désert'],
    notes: 'Expert désert. Connaissance intime des pistes. Gère aussi le camp Sahara Luxury.',
    tags: ['Sahara', 'Aventure', 'Bivouac'],
    rates: [
      { id: 'GR8', type: 'journee', rate: 900, season: 'Haute Saison', seasonType: 'haute', maxPax: 8, notes: 'Inclut logistique camp' },
      { id: 'GR9', type: 'journee', rate: 700, season: 'Basse Saison', seasonType: 'basse', maxPax: 8, notes: '' },
      { id: 'GR10', type: 'multi_jours', rate: 600, season: 'Toute saison', seasonType: 'moyenne', maxPax: 8, notes: 'Circuit 3-7 jours, tarif/jour dégressif' },
    ],
    availability: [
      { month: 'Jan', status: 'available' }, { month: 'Fév', status: 'available' },
      { month: 'Mar', status: 'available' }, { month: 'Avr', status: 'available' },
      { month: 'Mai', status: 'available' }, { month: 'Jun', status: 'partial' },
      { month: 'Jul', status: 'unavailable' }, { month: 'Aoû', status: 'unavailable' },
      { month: 'Sep', status: 'partial' }, { month: 'Oct', status: 'available' },
      { month: 'Nov', status: 'available' }, { month: 'Déc', status: 'available' },
    ],
  },
  {
    id: 'G004', name: 'Youssef El Alami', photo: '', city: 'Marrakech',
    phone: '+212 664 456 789', email: 'youssef.atlas@gmail.com',
    languages: ['FR', 'EN', 'AR'], certifications: ['officiel', 'specialise_montagne', 'nature'],
    zones: ['Atlas', 'Toubkal', 'Imlil', 'Ourika', 'Cascades Ouzoud'],
    rating: 4.7, totalTours: 200, yearsExp: 10, status: 'active',
    specialties: ['Trekking Atlas', 'Ascension Toubkal', 'Vallée Ourika', 'Villages berbères'],
    notes: 'Accompagnateur montagne certifié. Premiers secours niveau 2. Guide pour groupes sportifs.',
    tags: ['Montagne', 'Atlas', 'Trekking', 'Sport'],
    rates: [
      { id: 'GR11', type: 'journee', rate: 850, season: 'Toute saison', seasonType: 'moyenne', maxPax: 10, notes: 'Inclut matériel sécurité' },
      { id: 'GR12', type: 'multi_jours', rate: 700, season: 'Toute saison', seasonType: 'moyenne', maxPax: 8, notes: 'Ascension Toubkal 2-3 jours' },
      { id: 'GR13', type: 'demi_journee', rate: 500, season: 'Toute saison', seasonType: 'moyenne', maxPax: 12, notes: 'Vallée Ourika / Ouzoud' },
    ],
    availability: [
      { month: 'Jan', status: 'partial' }, { month: 'Fév', status: 'partial' },
      { month: 'Mar', status: 'available' }, { month: 'Avr', status: 'available' },
      { month: 'Mai', status: 'available' }, { month: 'Jun', status: 'available' },
      { month: 'Jul', status: 'available' }, { month: 'Aoû', status: 'available' },
      { month: 'Sep', status: 'available' }, { month: 'Oct', status: 'available' },
      { month: 'Nov', status: 'available' }, { month: 'Déc', status: 'partial' },
    ],
  },
  {
    id: 'G005', name: 'Khadija Bennani', photo: '', city: 'Casablanca',
    phone: '+212 665 567 890', email: 'khadija.mice@gmail.com',
    languages: ['FR', 'EN', 'AR', 'ES', 'PT'], certifications: ['officiel', 'culturel'],
    zones: ['Casablanca', 'Rabat', 'Tanger', 'Marrakech'],
    rating: 4.6, totalTours: 150, yearsExp: 6, status: 'active',
    specialties: ['MICE & Incentive', 'Team building', 'Casablanca Art Déco', 'Villes impériales'],
    notes: 'Profil MICE & corporate. Bilingue parfait. Habituée aux groupes 50+ pax.',
    tags: ['MICE', 'Corporate', 'Grands groupes'],
    rates: [
      { id: 'GR14', type: 'journee', rate: 900, season: 'Toute saison', seasonType: 'moyenne', maxPax: 50, notes: 'Spécial groupes MICE' },
      { id: 'GR15', type: 'demi_journee', rate: 550, season: 'Toute saison', seasonType: 'moyenne', maxPax: 50, notes: '' },
    ],
    availability: [
      { month: 'Jan', status: 'available' }, { month: 'Fév', status: 'available' },
      { month: 'Mar', status: 'available' }, { month: 'Avr', status: 'available' },
      { month: 'Mai', status: 'available' }, { month: 'Jun', status: 'available' },
      { month: 'Jul', status: 'available' }, { month: 'Aoû', status: 'available' },
      { month: 'Sep', status: 'available' }, { month: 'Oct', status: 'partial' },
      { month: 'Nov', status: 'available' }, { month: 'Déc', status: 'available' },
    ],
  },
  {
    id: 'G006', name: 'Mohamed Touri', photo: '', city: 'Tanger',
    phone: '+212 666 678 901', email: 'mohamed.tanger@gmail.com',
    languages: ['FR', 'EN', 'AR', 'ES'], certifications: ['officiel'],
    zones: ['Tanger', 'Chefchaouen', 'Tétouan', 'Rif'],
    rating: 4.5, totalTours: 120, yearsExp: 5, status: 'active',
    specialties: ['Tanger historique', 'Chefchaouen', 'Grottes d\'Hercule', 'Cap Spartel'],
    notes: 'Jeune guide dynamique. Spécialiste du nord du Maroc.',
    tags: ['Nord', 'Tanger', 'Chefchaouen'],
    rates: [
      { id: 'GR16', type: 'journee', rate: 650, season: 'Toute saison', seasonType: 'moyenne', maxPax: 15, notes: '' },
      { id: 'GR17', type: 'demi_journee', rate: 400, season: 'Toute saison', seasonType: 'moyenne', maxPax: 15, notes: '' },
    ],
    availability: [
      { month: 'Jan', status: 'available' }, { month: 'Fév', status: 'available' },
      { month: 'Mar', status: 'available' }, { month: 'Avr', status: 'available' },
      { month: 'Mai', status: 'available' }, { month: 'Jun', status: 'available' },
      { month: 'Jul', status: 'partial' }, { month: 'Aoû', status: 'partial' },
      { month: 'Sep', status: 'available' }, { month: 'Oct', status: 'available' },
      { month: 'Nov', status: 'available' }, { month: 'Déc', status: 'available' },
    ],
  },
]

function GuideDetailPanel({ guide, onClose }: { guide: GuideEntry; onClose: () => void }) {
  const [tab, setTab] = useState<'rates' | 'availability' | 'info'>('rates')

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-[640px] bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto border-l border-slate-200 dark:border-slate-700">
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">{guide.name}</h2>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                <MapPin size={11} />{guide.city}
                <span>&middot; {guide.yearsExp} ans d'exp.</span>
                <span className="flex items-center gap-0.5 text-amber-500"><Star size={10} className="fill-amber-500" /> {guide.rating}</span>
                <span>&middot; {guide.totalTours} tours</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><X size={18} /></button>
          </div>
          <div className="flex gap-1 mt-2">
            {(['rates', 'availability', 'info'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={clsx('px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors', tab === t ? 'bg-rihla/10 text-rihla' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800')}>
                {t === 'rates' ? `Tarifs (${guide.rates.length})` : t === 'availability' ? 'Disponibilité' : 'Profil'}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {tab === 'rates' && (
            <div className="space-y-3">
              {guide.rates.map(r => (
                <div key={r.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">{RATE_LABELS[r.type]}</h4>
                    <span className="text-lg font-bold text-rihla">{r.rate.toLocaleString()} MAD</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>{r.season}</span>
                    <span>&middot; Max {r.maxPax} pax</span>
                    {r.notes && <span className="text-slate-400">&middot; {r.notes}</span>}
                  </div>
                </div>
              ))}
              <button className="w-full py-3 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-[12px] font-medium text-slate-500 hover:bg-slate-50 flex items-center justify-center gap-2">
                <Plus size={14} /> Ajouter un tarif
              </button>
            </div>
          )}

          {tab === 'availability' && (
            <div>
              <h3 className="text-[13px] font-bold text-slate-900 dark:text-white mb-3">Calendrier de disponibilité 2026</h3>
              <div className="grid grid-cols-6 gap-2">
                {guide.availability.map(a => (
                  <div key={a.month} className={clsx('p-3 rounded-xl text-center border', a.status === 'available' ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/10' : a.status === 'partial' ? 'bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/10' : 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/10')}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{a.month}</p>
                    <div className={clsx('w-4 h-4 rounded-full mx-auto', a.status === 'available' ? 'bg-emerald-500' : a.status === 'partial' ? 'bg-amber-500' : 'bg-red-500')} />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                {[{ s: 'available', l: 'Disponible', c: 'bg-emerald-500' }, { s: 'partial', l: 'Partiel', c: 'bg-amber-500' }, { s: 'unavailable', l: 'Indisponible', c: 'bg-red-500' }].map(i => (
                  <div key={i.s} className="flex items-center gap-1.5 text-[11px] text-slate-500"><div className={clsx('w-2.5 h-2.5 rounded-full', i.c)} />{i.l}</div>
                ))}
              </div>
            </div>
          )}

          {tab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-[10px] text-slate-400">Téléphone</p>
                  <p className="text-[13px] font-medium text-slate-700 dark:text-white">{guide.phone}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-[10px] text-slate-400">Email</p>
                  <p className="text-[13px] font-medium text-slate-700 dark:text-white truncate">{guide.email}</p>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2">Langues</h4>
                <div className="flex gap-1.5">
                  {guide.languages.map(l => <span key={l} className="px-2.5 py-1 bg-blue-500/10 text-blue-600 text-[11px] font-bold rounded-lg">{l}</span>)}
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2">Certifications</h4>
                <div className="flex flex-wrap gap-1.5">
                  {guide.certifications.map(c => (
                    <span key={c} className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold', CERT_LABELS[c].color)}>{CERT_LABELS[c].label}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2">Zones couvertes</h4>
                <div className="flex flex-wrap gap-1.5">
                  {guide.zones.map(z => <span key={z} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] rounded-full flex items-center gap-1"><MapPin size={9} />{z}</span>)}
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2">Spécialités</h4>
                <div className="flex flex-wrap gap-1.5">
                  {guide.specialties.map(s => <span key={s} className="px-2 py-0.5 bg-rihla/5 text-rihla text-[10px] font-medium rounded-lg border border-rihla/10">{s}</span>)}
                </div>
              </div>

              {guide.notes && <p className="p-3 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 rounded-xl text-[13px] text-slate-600">{guide.notes}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function GuideCatalogPage() {
  const [search, setSearch] = useState('')
  const [zoneFilter, setZoneFilter] = useState('all')
  const [selectedGuide, setSelectedGuide] = useState<GuideEntry | null>(null)

  const allZones = useMemo(() => [...new Set(GUIDES.flatMap(g => g.zones))].sort(), [])
  const filtered = useMemo(() => GUIDES.filter(g => {
    if (zoneFilter !== 'all' && !g.zones.includes(zoneFilter)) return false
    if (search) {
      const q = search.toLowerCase()
      return g.name.toLowerCase().includes(q) || g.city.toLowerCase().includes(q) ||
             g.languages.some(l => l.toLowerCase().includes(q)) || g.zones.some(z => z.toLowerCase().includes(q))
    }
    return true
  }), [search, zoneFilter])

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 transition-colors pb-16">
      {selectedGuide && <GuideDetailPanel guide={selectedGuide} onClose={() => setSelectedGuide(null)} />}

      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-6">
        <div className="max-w-[1600px] mx-auto flex justify-between items-end gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              <UserCheck size={12} className="text-rihla" /> Paramétrage Guides
            </div>
            <h1 className="text-[24px] font-bold text-slate-900 dark:text-white tracking-tight">
              Guides — Profils, Tarifs & Disponibilité
            </h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              {GUIDES.length} guides &middot; {GUIDES.filter(g => g.status === 'active').length} actifs &middot; {allZones.length} zones couvertes
            </p>
          </div>
          <button className="inline-flex items-center gap-1.5 h-9 px-3.5 text-[13px] font-bold text-white bg-rihla hover:bg-rihla/90 rounded-lg">
            <Plus size={14} /> Ajouter un Guide
          </button>
        </div>
      </div>

      <div className="p-8 max-w-[1600px] mx-auto space-y-5">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: 'Total Guides', value: GUIDES.length, icon: UserCheck, color: 'text-rihla' },
            { label: 'Actifs', value: GUIDES.filter(g => g.status === 'active').length, icon: CheckCircle2, color: 'text-emerald-600' },
            { label: 'En Tour', value: GUIDES.filter(g => g.status === 'on_tour').length, icon: MapPin, color: 'text-blue-600' },
            { label: 'Langues', value: new Set(GUIDES.flatMap(g => g.languages)).size, icon: Globe2, color: 'text-violet-600' },
            { label: 'Tours Total', value: GUIDES.reduce((s, g) => s + g.totalTours, 0), icon: Star, color: 'text-amber-600' },
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
            <input className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[13px] focus:ring-2 focus:ring-rihla" placeholder="Rechercher guide, langue, zone..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select value={zoneFilter} onChange={e => setZoneFilter(e.target.value)} className="h-9 px-3 text-[12px] font-medium border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-600">
            <option value="all">Toutes les zones</option>
            {allZones.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
          <span className="text-[12px] text-slate-400">{filtered.length} guide(s)</span>
        </div>

        {/* Guide Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(g => (
            <div key={g.id} onClick={() => setSelectedGuide(g)} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:border-rihla/30 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rihla/20 to-rihla/5 flex items-center justify-center text-rihla font-bold text-[14px]">
                    {g.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">{g.name}</h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <MapPin size={10} />{g.city}
                      <span className="flex items-center gap-0.5 text-amber-500"><Star size={10} className="fill-amber-500" /> {g.rating}</span>
                      <span>&middot; {g.totalTours} tours</span>
                    </div>
                  </div>
                </div>
                <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold',
                  g.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' :
                  g.status === 'on_tour' ? 'bg-blue-500/10 text-blue-600' : 'bg-red-500/10 text-red-600'
                )}>{g.status === 'active' ? 'Disponible' : g.status === 'on_tour' ? 'En tour' : 'Indisponible'}</span>
              </div>

              {/* Languages */}
              <div className="flex items-center gap-1 mb-2">
                <Globe2 size={11} className="text-slate-400" />
                {g.languages.map(l => <span key={l} className="px-1.5 py-0.5 bg-blue-500/10 text-blue-600 text-[9px] font-bold rounded">{l}</span>)}
              </div>

              {/* Certifications */}
              <div className="flex flex-wrap gap-1 mb-2">
                {g.certifications.map(c => (
                  <span key={c} className={clsx('px-1.5 py-0.5 rounded text-[9px] font-bold', CERT_LABELS[c].color)}>{CERT_LABELS[c].label}</span>
                ))}
              </div>

              {/* Zones */}
              <div className="flex flex-wrap gap-1 mb-3">
                {g.zones.slice(0, 4).map(z => <span key={z} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] rounded">{z}</span>)}
                {g.zones.length > 4 && <span className="text-[9px] text-slate-400">+{g.zones.length - 4}</span>}
              </div>

              {/* Rate summary */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                <span className="text-slate-500">{g.yearsExp} ans d'expérience</span>
                <span className="font-bold text-rihla">{Math.min(...g.rates.map(r => r.rate)).toLocaleString()} — {Math.max(...g.rates.map(r => r.rate)).toLocaleString()} MAD</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
