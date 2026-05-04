import { useState, useMemo, useEffect } from 'react'
import {
  Building2, Users, Truck, UserCheck, ChefHat, MapPin,
  Search, Filter, Plus, X, Mail, Phone, Globe2,
  ChevronRight, Eye, Edit, Star, DollarSign,
  FileText, Calendar, TrendingUp, AlertCircle,
  CreditCard, Clock, ShieldCheck, Tag,
} from 'lucide-react'
import { clsx } from 'clsx'

// ─── TYPES ────────────────────────────────────────────────────────────
type PartnerRole = 'client' | 'supplier'
type ClientType = 'agence' | 'tour_operator' | 'corporate' | 'mice' | 'individuel'
type SupplierType = 'hotelier' | 'transporteur' | 'guide' | 'restaurateur' | 'activite' | 'autre'
type PaymentTerms = 'prepaid' | '15_days' | '30_days' | '45_days' | '60_days' | 'end_of_month'

interface Contract {
  id: string
  name: string
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'pending'
  commission?: number
  notes?: string
}

interface Partner {
  id: string
  role: PartnerRole
  name: string
  type: ClientType | SupplierType
  country: string
  countryFlag: string
  city: string
  address: string
  email: string
  phone: string
  website: string
  contactName: string
  contactRole: string
  status: 'active' | 'inactive' | 'prospect'
  // Client-specific
  markup?: number
  creditLimit?: number
  paymentTerms?: PaymentTerms
  totalRevenue?: number
  totalProjects?: number
  // Supplier-specific
  serviceType?: string
  rating?: number
  contracts?: Contract[]
  commission?: number
  // Common
  currency: string
  taxId?: string
  notes: string
  tags: string[]
  createdAt: string
  lastActivity: string
}

// ─── DEMO DATA ────────────────────────────────────────────────────────
const PARTNERS: Partner[] = [
  // ── CLIENTS ──
  {
    id: 'P-001', role: 'client', name: 'Luxe Voyages International', type: 'tour_operator',
    country: 'France', countryFlag: '🇫🇷', city: 'Paris', address: '45 Rue de Rivoli, 75001 Paris',
    email: 's.martin@luxevoyages.fr', phone: '+33 1 42 56 78 90', website: 'luxevoyages.fr',
    contactName: 'Sophie Martin', contactRole: 'Directrice Partenariats',
    status: 'active', markup: 18, creditLimit: 500000, paymentTerms: '30_days',
    totalRevenue: 2450000, totalProjects: 45, currency: 'EUR', taxId: 'FR12345678901',
    notes: 'Partenaire fidèle depuis 2019. Préfère les riads 5*. Facturation à 30j.',
    tags: ['VIP', 'Luxury', 'Fidèle'], createdAt: '2019-03-15', lastActivity: 'Il y a 2 jours',
  },
  {
    id: 'P-002', role: 'client', name: 'Elite Destinations NY', type: 'agence',
    country: 'USA', countryFlag: '🇺🇸', city: 'New York', address: '250 Park Avenue, NYC 10177',
    email: 'sarah@elitedest.com', phone: '+1 212 555 0142', website: 'elitedest.com',
    contactName: 'Sarah Jenkins', contactRole: 'CEO',
    status: 'active', markup: 22, creditLimit: 1000000, paymentTerms: 'prepaid',
    totalRevenue: 3800000, totalProjects: 30, currency: 'USD', taxId: 'US-EIN-1234567',
    notes: 'Clientèle UHNW. Budget jamais un problème. Communication via WhatsApp uniquement.',
    tags: ['Ultra-Luxury', 'UHNW', 'Hélicoptère'], createdAt: '2021-01-20', lastActivity: 'Il y a 3 heures',
  },
  {
    id: 'P-003', role: 'client', name: 'Sanofi Events Division', type: 'corporate',
    country: 'France', countryFlag: '🇫🇷', city: 'Paris', address: '54 Rue La Boétie, 75008 Paris',
    email: 'events@sanofi.com', phone: '+33 1 53 77 40 00', website: 'sanofi.com',
    contactName: 'Marc Lefebvre', contactRole: 'Travel & Events Manager',
    status: 'active', markup: 15, creditLimit: 800000, paymentTerms: '60_days',
    totalRevenue: 420000, totalProjects: 3, currency: 'EUR', taxId: 'FR98765432100',
    notes: 'Incentive pharma annuel au Maroc. 150-200 pax. Budget confortable. Processus d\'achat long.',
    tags: ['MICE', 'Corporate', 'Incentive'], createdAt: '2024-06-01', lastActivity: 'Il y a 1 semaine',
  },
  {
    id: 'P-004', role: 'client', name: 'Tokyo Luxury Travel', type: 'tour_operator',
    country: 'Japan', countryFlag: '🇯🇵', city: 'Tokyo', address: 'Shibuya-ku, Tokyo 150-0002',
    email: 'y.tanaka@tokyoluxury.jp', phone: '+81 3 5555 0142', website: 'tokyoluxury.jp',
    contactName: 'Yuki Tanaka', contactRole: 'Director of Outbound',
    status: 'prospect', markup: 20, creditLimit: 0, paymentTerms: 'prepaid',
    totalRevenue: 0, totalProjects: 1, currency: 'JPY',
    notes: 'Premier contact. Potentiel 3M+ MAD/an si premier projet réussi.',
    tags: ['Nouveau', 'Potentiel élevé', 'Japon'], createdAt: '2026-04-15', lastActivity: 'Il y a 5 jours',
  },
  {
    id: 'P-005', role: 'client', name: 'Prestige Events Geneva', type: 'mice',
    country: 'Switzerland', countryFlag: '🇨🇭', city: 'Geneva', address: '12 Quai du Mont-Blanc, 1201 Geneva',
    email: 'm.dupont@prestige-events.ch', phone: '+41 22 555 0142', website: 'prestige-events.ch',
    contactName: 'Marc Dupont', contactRole: 'Event Director',
    status: 'active', markup: 16, creditLimit: 600000, paymentTerms: '45_days',
    totalRevenue: 280000, totalProjects: 5, currency: 'CHF',
    notes: 'Spécialiste incentive pharma et finance. Site inspections 2x/an.',
    tags: ['MICE', 'Suisse', 'Incentive'], createdAt: '2025-03-10', lastActivity: 'Il y a 1 semaine',
  },

  // ── FOURNISSEURS ──
  {
    id: 'P-101', role: 'supplier', name: 'Royal Mansour Marrakech', type: 'hotelier',
    country: 'Morocco', countryFlag: '🇲🇦', city: 'Marrakech', address: 'Rue Abou Abbas El Sebti, 40000',
    email: 'reservation@royalmansour.ma', phone: '+212 524 388 600', website: 'royalmansour.ma',
    contactName: 'Khalid Bennani', contactRole: 'Directeur Commercial',
    status: 'active', serviceType: '5* Palace', rating: 5.0,
    commission: 12, currency: 'MAD', taxId: 'MA-ICE-001234567',
    contracts: [
      { id: 'ct1', name: 'Accord-cadre 2025-2026', startDate: '2025-01-01', endDate: '2026-12-31', status: 'active', commission: 12, notes: 'Tarifs contractuels rack -25%' },
    ],
    notes: '5* Palace référence. Allotement 5 riads/semaine haute saison. Relation excellente avec Khalid.',
    tags: ['Palace', '5*', 'Marrakech', 'Allotement'], createdAt: '2018-01-01', lastActivity: 'Hier',
  },
  {
    id: 'P-102', role: 'supplier', name: 'La Mamounia', type: 'hotelier',
    country: 'Morocco', countryFlag: '🇲🇦', city: 'Marrakech', address: 'Avenue Bab Jdid, 40000',
    email: 'groups@mamounia.com', phone: '+212 524 388 600', website: 'mamounia.com',
    contactName: 'Nadia Alaoui', contactRole: 'Revenue Manager',
    status: 'active', serviceType: '5* Palace', rating: 4.9,
    commission: 10, currency: 'MAD',
    contracts: [
      { id: 'ct2', name: 'Contrat groupes 2026', startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', commission: 10 },
    ],
    notes: 'Politique allotement stricte. Confirmation 21j avant. Nadia très réactive.',
    tags: ['Palace', '5*', 'Marrakech'], createdAt: '2019-06-01', lastActivity: 'Il y a 3 jours',
  },
  {
    id: 'P-103', role: 'supplier', name: 'Palais Faraj Fès', type: 'hotelier',
    country: 'Morocco', countryFlag: '🇲🇦', city: 'Fès', address: 'Quartier Ziat, Bab Guissa, Fès',
    email: 'reservations@palaisfaraj.com', phone: '+212 535 635 356', website: 'palaisfaraj.com',
    contactName: 'Ahmed Fassi', contactRole: 'General Manager',
    status: 'active', serviceType: '5* Riad Palace', rating: 4.8,
    commission: 15, currency: 'MAD',
    contracts: [
      { id: 'ct3', name: 'Partenariat 2025-2027', startDate: '2025-01-01', endDate: '2027-12-31', status: 'active', commission: 15, notes: 'Exclusivité groupes luxe Fès' },
    ],
    notes: 'Meilleur rapport qualité/vue sur la médina. Ahmed très flexible pour les demandes spéciales.',
    tags: ['5*', 'Fès', 'Riad', 'Exclusivité'], createdAt: '2020-03-01', lastActivity: 'Il y a 5 jours',
  },
  {
    id: 'P-104', role: 'supplier', name: 'S\'TOURS Transport', type: 'transporteur',
    country: 'Morocco', countryFlag: '🇲🇦', city: 'Casablanca', address: 'Zone Industrielle, Ain Sebaa',
    email: 'fleet@stours-transport.ma', phone: '+212 522 123 456', website: 'stours-transport.ma',
    contactName: 'Rachid Amrani', contactRole: 'Directeur de Flotte',
    status: 'active', serviceType: 'Transport VIP + Standard', rating: 4.6,
    commission: 0, currency: 'MAD',
    contracts: [
      { id: 'ct4', name: 'Contrat flotte 2026', startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', notes: '15 véhicules en exclusivité' },
    ],
    notes: 'Flotte propre: 5 Mercedes V-Class, 4 minibus, 3 bus 50 places, 3 4x4.',
    tags: ['Transport', 'VIP', 'Flotte propre'], createdAt: '2017-01-01', lastActivity: 'Aujourd\'hui',
  },
  {
    id: 'P-105', role: 'supplier', name: 'Hassan Amazigh', type: 'guide',
    country: 'Morocco', countryFlag: '🇲🇦', city: 'Marrakech', address: 'Guéliz, Marrakech',
    email: 'hassan.guide@gmail.com', phone: '+212 661 123 456', website: '',
    contactName: 'Hassan Amazigh', contactRole: 'Guide Officiel',
    status: 'active', serviceType: 'Guide Officiel Certifié', rating: 4.9,
    commission: 0, currency: 'MAD',
    contracts: [
      { id: 'ct5', name: 'Convention 2026', startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', notes: 'Tarif: 800 MAD/jour, 500 MAD/demi-journée' },
    ],
    notes: 'Guide certifié. Langues: FR, EN, ES, AR. Zones: Marrakech, Atlas, Sahara. Top rating clients.',
    tags: ['Guide', 'Certifié', 'Multilingue', 'Marrakech'], createdAt: '2018-06-01', lastActivity: 'Il y a 2 jours',
  },
  {
    id: 'P-106', role: 'supplier', name: 'Dar Yacout', type: 'restaurateur',
    country: 'Morocco', countryFlag: '🇲🇦', city: 'Marrakech', address: '79 Sidi Ahmed Soussi, Médina',
    email: 'reservation@daryacout.com', phone: '+212 524 382 929', website: 'daryacout.com',
    contactName: 'Fatima Zahra', contactRole: 'Maître de maison',
    status: 'active', serviceType: 'Restaurant gastronomique', rating: 4.7,
    commission: 8, currency: 'MAD',
    contracts: [
      { id: 'ct6', name: 'Accord groupes 2026', startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', commission: 8, notes: 'Menu groupe à 450 MAD/pers, minimum 10 pax' },
    ],
    notes: 'Incontournable pour dîners de gala. Capacité max 60 pax en privatisation. Réserver 48h minimum.',
    tags: ['Restaurant', 'Gastronomique', 'Marrakech', 'Gala'], createdAt: '2019-01-01', lastActivity: 'Il y a 1 semaine',
  },
]

const CLIENT_TYPES: Record<ClientType, string> = {
  agence: 'Agence de Voyage', tour_operator: 'Tour Opérateur', corporate: 'Corporate',
  mice: 'MICE / Events', individuel: 'Individuel',
}
const SUPPLIER_TYPES: Record<SupplierType, string> = {
  hotelier: 'Hôtelier', transporteur: 'Transporteur', guide: 'Guide',
  restaurateur: 'Restaurateur', activite: 'Activité', autre: 'Autre',
}
const PAYMENT_TERMS: Record<PaymentTerms, string> = {
  prepaid: 'Prépayé', '15_days': '15 jours', '30_days': '30 jours',
  '45_days': '45 jours', '60_days': '60 jours', end_of_month: 'Fin de mois',
}
const SUPPLIER_ICONS: Record<SupplierType, typeof Building2> = {
  hotelier: Building2, transporteur: Truck, guide: UserCheck,
  restaurateur: ChefHat, activite: Star, autre: Tag,
}

// ─── ADD PARTNER MODAL ────────────────────────────────────────────────
function AddPartnerModal({ open, onClose, defaultRole }: { open: boolean; onClose: () => void; defaultRole: PartnerRole }) {
  const [role, setRole] = useState<PartnerRole>(defaultRole)
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', city: '', contactName: '', contactRole: '', type: defaultRole === 'client' ? 'tour_operator' : 'hotelier', currency: 'MAD', notes: '' })

  useEffect(() => {
    setRole(defaultRole)
    setForm(f => ({ ...f, type: defaultRole === 'client' ? 'tour_operator' : 'hotelier' }))
  }, [defaultRole, open])

  const handleRoleToggle = (newRole: PartnerRole) => {
    setRole(newRole)
    setForm(f => ({ ...f, type: newRole === 'client' ? 'tour_operator' : 'hotelier' }))
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xl mx-4 max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Nouveau Partenaire</h2>
            <p className="text-[12px] text-slate-400 mt-0.5">Ajouter un {role === 'client' ? 'client' : 'fournisseur'} au référentiel</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          {/* Role toggle */}
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button onClick={() => handleRoleToggle('client')} className={clsx('flex-1 py-2 rounded-lg text-[13px] font-medium transition-all', role === 'client' ? 'bg-white dark:bg-slate-700 text-rihla shadow-sm' : 'text-slate-500')}>Client</button>
            <button onClick={() => handleRoleToggle('supplier')} className={clsx('flex-1 py-2 rounded-lg text-[13px] font-medium transition-all', role === 'supplier' ? 'bg-white dark:bg-slate-700 text-rihla shadow-sm' : 'text-slate-500')}>Fournisseur</button>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nom *</label>
            <input className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] focus:ring-2 focus:ring-rihla" placeholder={role === 'client' ? 'Luxe Voyages International' : 'Royal Mansour Marrakech'} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type *</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] focus:ring-2 focus:ring-rihla" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              {role === 'client'
                ? Object.entries(CLIENT_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)
                : Object.entries(SUPPLIER_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)
              }
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Contact principal</label>
              <input className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] focus:ring-2 focus:ring-rihla" placeholder="Sophie Martin" value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Fonction</label>
              <input className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] focus:ring-2 focus:ring-rihla" placeholder="Dir. Partenariats" value={form.contactRole} onChange={e => setForm(f => ({ ...f, contactRole: e.target.value }))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] focus:ring-2 focus:ring-rihla" placeholder="contact@partner.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Téléphone</label>
              <input className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] focus:ring-2 focus:ring-rihla" placeholder="+212 524 388 600" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pays</label>
              <input className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] focus:ring-2 focus:ring-rihla" placeholder="Maroc" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ville</label>
              <input className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] focus:ring-2 focus:ring-rihla" placeholder="Marrakech" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Devise</label>
              <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] focus:ring-2 focus:ring-rihla" value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
                <option>MAD</option><option>EUR</option><option>USD</option><option>GBP</option><option>CHF</option><option>JPY</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Notes</label>
            <textarea className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] focus:ring-2 focus:ring-rihla resize-y" rows={2} placeholder="Notes internes..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] font-medium text-slate-600 hover:bg-slate-50">Annuler</button>
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-rihla text-white rounded-xl text-[13px] font-bold hover:bg-rihla/90 flex items-center justify-center gap-2">
            <Plus size={14} /> Créer le partenaire
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── PARTNER DETAIL PANEL ─────────────────────────────────────────────
function PartnerDetail({ partner, onClose }: { partner: Partner; onClose: () => void }) {
  const [tab, setTab] = useState<'info' | 'contracts' | 'commercial'>('info')
  const isClient = partner.role === 'client'

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-[640px] bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto border-l border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center text-lg', isClient ? 'bg-blue-500/10' : 'bg-emerald-500/10')}>
                {partner.countryFlag}
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-900 dark:text-white">{partner.name}</h2>
                <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                  <span className={clsx('px-2 py-0.5 rounded-full font-bold', isClient ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600')}>
                    {isClient ? 'CLIENT' : 'FOURNISSEUR'}
                  </span>
                  <span className="text-slate-400">
                    {isClient ? CLIENT_TYPES[partner.type as ClientType] : SUPPLIER_TYPES[partner.type as SupplierType]}
                  </span>
                  {partner.rating != null && <span className="flex items-center gap-0.5 text-amber-500"><Star size={10} /> {partner.rating}</span>}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><X size={18} /></button>
          </div>
          <div className="flex gap-1 mt-2">
            {(['info', 'contracts', 'commercial'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={clsx('px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors', tab === t ? 'bg-rihla/10 text-rihla' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800')}>
                {t === 'info' ? 'Fiche' : t === 'contracts' ? 'Contrats' : 'Conditions'}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-5">
          {tab === 'info' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase">Contact</h4>
                  <div className="space-y-2 text-[13px]">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><UserCheck size={13} className="text-slate-400" />{partner.contactName} — {partner.contactRole}</div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Mail size={13} className="text-slate-400" />{partner.email}</div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Phone size={13} className="text-slate-400" />{partner.phone}</div>
                    {partner.website && <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Globe2 size={13} className="text-slate-400" />{partner.website}</div>}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase">Localisation</h4>
                  <div className="space-y-2 text-[13px]">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><MapPin size={13} className="text-slate-400" />{partner.city}, {partner.country}</div>
                    <div className="text-[12px] text-slate-400">{partner.address}</div>
                    {partner.taxId && <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><FileText size={13} className="text-slate-400" />ID Fiscal: {partner.taxId}</div>}
                  </div>
                </div>
              </div>

              {partner.notes && (
                <div className="p-3 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 rounded-xl text-[13px] text-slate-600 dark:text-slate-300">{partner.notes}</div>
              )}

              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {partner.tags.map(t => <span key={t} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium rounded-full">{t}</span>)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-400">Créé le</span>
                  <p className="font-medium text-slate-700 dark:text-white mt-0.5">{partner.createdAt}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-400">Dernière activité</span>
                  <p className="font-medium text-slate-700 dark:text-white mt-0.5">{partner.lastActivity}</p>
                </div>
              </div>
            </>
          )}

          {tab === 'contracts' && (
            <div className="space-y-3">
              {(partner.contracts ?? []).length === 0 ? (
                <p className="text-[13px] text-slate-400 text-center py-8">Aucun contrat enregistré</p>
              ) : (
                partner.contracts?.map(c => (
                  <div key={c.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">{c.name}</h4>
                      <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold',
                        c.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' :
                        c.status === 'expired' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'
                      )}>{c.status === 'active' ? 'Actif' : c.status === 'expired' ? 'Expiré' : 'En attente'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1"><Calendar size={11} />{c.startDate} → {c.endDate}</span>
                      {c.commission != null && c.commission !== 0 && <span className="flex items-center gap-1"><DollarSign size={11} />Commission: {c.commission}%</span>}
                    </div>
                    {c.notes && <p className="text-[12px] text-slate-500 mt-2">{c.notes}</p>}
                  </div>
                ))
              )}
              <button className="w-full py-3 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-[12px] font-medium text-slate-500 hover:bg-slate-50 flex items-center justify-center gap-2">
                <Plus size={14} /> Ajouter un contrat
              </button>
            </div>
          )}

          {tab === 'commercial' && (
            <div className="space-y-4">
              {isClient ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Markup appliqué</p>
                      <p className="text-2xl font-bold text-rihla">{partner.markup ?? 0}%</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Crédit autorisé</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{(partner.creditLimit ?? 0).toLocaleString()} {partner.currency}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Délai paiement</p>
                      <p className="text-[14px] font-bold text-slate-900 dark:text-white">{PAYMENT_TERMS[partner.paymentTerms ?? 'prepaid']}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Devise</p>
                      <p className="text-[14px] font-bold text-slate-900 dark:text-white">{partner.currency}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl border border-emerald-200 dark:border-emerald-500/10">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">CA total généré</p>
                      <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{((partner.totalRevenue ?? 0) / 1000).toFixed(0)}k {partner.currency}</p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-500/5 rounded-xl border border-blue-200 dark:border-blue-500/10">
                      <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Projets réalisés</p>
                      <p className="text-xl font-bold text-blue-700 dark:text-blue-400">{partner.totalProjects ?? 0}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Commission</p>
                      <p className="text-2xl font-bold text-rihla">{partner.commission ?? 0}%</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Type de service</p>
                      <p className="text-[14px] font-bold text-slate-900 dark:text-white">{partner.serviceType ?? '—'}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Notation qualité</p>
                    <div className="flex items-center gap-2 mt-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={18} className={s <= (partner.rating ?? 0) ? 'text-amber-500 fill-amber-500' : 'text-slate-300'} />
                      ))}
                      <span className="text-[14px] font-bold text-slate-900 dark:text-white ml-2">{partner.rating ?? 0}/5</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────
export function PartnersPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'clients' | 'suppliers'>('all')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [showAddRole, setShowAddRole] = useState<PartnerRole>('client')
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filtered = useMemo(() => {
    return PARTNERS.filter(p => {
      if (activeTab === 'clients' && p.role !== 'client') return false
      if (activeTab === 'suppliers' && p.role !== 'supplier') return false
      if (typeFilter !== 'all' && p.type !== typeFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) ||
               p.contactName.toLowerCase().includes(q) || p.country.toLowerCase().includes(q) ||
               p.tags.some(t => t.toLowerCase().includes(q))
      }
      return true
    })
  }, [activeTab, search, typeFilter])

  const clients = PARTNERS.filter(p => p.role === 'client')
  const suppliers = PARTNERS.filter(p => p.role === 'supplier')

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 transition-colors pb-16">
      <AddPartnerModal open={showAdd} onClose={() => setShowAdd(false)} defaultRole={showAddRole} />
      {selectedPartner && <PartnerDetail partner={selectedPartner} onClose={() => setSelectedPartner(null)} />}

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-6">
        <div className="max-w-[1600px] mx-auto flex justify-between items-end gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              <Users size={12} className="text-rihla" /> Référentiel Partenaires
            </div>
            <h1 className="text-[24px] font-bold text-slate-900 dark:text-white tracking-tight">
              Partenaires — Clients & Fournisseurs
            </h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              {clients.length} clients &middot; {suppliers.length} fournisseurs &middot; Base solide pour la cotation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setShowAddRole('client'); setShowAdd(true) }} className="inline-flex items-center gap-1.5 h-9 px-3 text-[13px] font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg">
              <Users size={14} /> + Client
            </button>
            <button onClick={() => { setShowAddRole('supplier'); setShowAdd(true) }} className="inline-flex items-center gap-1.5 h-9 px-3.5 text-[13px] font-bold text-white bg-rihla hover:bg-rihla/90 rounded-lg">
              <Building2 size={14} /> + Fournisseur
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-[1600px] mx-auto space-y-5">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: 'Total Partenaires', value: PARTNERS.length, icon: Users, color: 'text-rihla' },
            { label: 'Clients', value: clients.length, icon: Building2, color: 'text-blue-600' },
            { label: 'Fournisseurs', value: suppliers.length, icon: Truck, color: 'text-emerald-600' },
            { label: 'Contrats Actifs', value: PARTNERS.filter(p => p.contracts?.some(c => c.status === 'active')).length, icon: FileText, color: 'text-violet-600' },
            { label: 'Prospects', value: PARTNERS.filter(p => p.status === 'prospect').length, icon: TrendingUp, color: 'text-amber-600' },
          ].map(k => (
            <div key={k.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-slate-500">{k.label}</span>
                <k.icon size={14} className={k.color} />
              </div>
              <p className="text-[22px] font-bold text-slate-900 dark:text-white">{k.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs + Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {(['all', 'clients', 'suppliers'] as const).map(t => (
                <button key={t} onClick={() => { setActiveTab(t); setTypeFilter('all') }} className={clsx('px-3 py-1.5 rounded-md text-[12px] font-medium transition-all', activeTab === t ? 'bg-white dark:bg-slate-700 text-rihla shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
                  {t === 'all' ? `Tous (${PARTNERS.length})` : t === 'clients' ? `Clients (${clients.length})` : `Fournisseurs (${suppliers.length})`}
                </button>
              ))}
            </div>
            <div className="relative flex-1 min-w-[240px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Rechercher nom, ville, contact, tag..." className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-[13px] focus:ring-2 focus:ring-rihla" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {activeTab !== 'all' && (
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="h-9 px-3 text-[12px] font-medium border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-600">
                <option value="all">Tous les types</option>
                {activeTab === 'clients'
                  ? Object.entries(CLIENT_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)
                  : Object.entries(SUPPLIER_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)
                }
              </select>
            )}
            <span className="text-[12px] font-medium text-slate-400">{filtered.length} résultat(s)</span>
          </div>
        </div>

        {/* Partners Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Partenaire</th>
                <th className="px-4 py-3 text-left">Rôle</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Contact</th>
                <th className="px-4 py-3 text-left">Ville</th>
                <th className="px-4 py-3 text-center">Statut</th>
                <th className="px-4 py-3 text-right">Détail</th>
                <th className="px-4 py-3 text-center">Voir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(p => {
                const isClient = p.role === 'client'
                const SupIcon = isClient ? Building2 : (SUPPLIER_ICONS[p.type as SupplierType] ?? Building2)
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => setSelectedPartner(p)}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', isClient ? 'bg-blue-500/10' : 'bg-emerald-500/10')}>
                          <SupIcon size={16} className={isClient ? 'text-blue-600' : 'text-emerald-600'} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{p.name}</p>
                          <p className="text-[11px] text-slate-500">{p.countryFlag} {p.country}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold', isClient ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600')}>
                        {isClient ? 'Client' : 'Fournisseur'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {isClient ? CLIENT_TYPES[p.type as ClientType] : SUPPLIER_TYPES[p.type as SupplierType]}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-700 dark:text-slate-200">{p.contactName}</p>
                      <p className="text-[11px] text-slate-400">{p.contactRole}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{p.city}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold',
                        p.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' :
                        p.status === 'prospect' ? 'bg-amber-500/10 text-amber-600' : 'bg-slate-500/10 text-slate-500'
                      )}>{p.status === 'active' ? 'Actif' : p.status === 'prospect' ? 'Prospect' : 'Inactif'}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-[12px] text-slate-500">
                      {isClient ? `${((p.totalRevenue ?? 0) / 1000).toFixed(0)}k ${p.currency}` :
                       p.rating ? `${p.rating}/5` : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="p-1.5 text-slate-400 hover:text-rihla hover:bg-rihla/5 rounded-lg" onClick={e => { e.stopPropagation(); setSelectedPartner(p) }}>
                        <Eye size={14} />
                      </button>
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
