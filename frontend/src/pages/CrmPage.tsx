import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2, Globe2, Star, TrendingUp, DollarSign,
  Search, Filter, Mail, Phone, ChevronRight, ChevronDown,
  ShieldCheck, AlertCircle, Loader2, X, Plus, Users,
  Calendar, Clock, MapPin, Eye, MoreHorizontal,
  ArrowUpRight, ArrowDownRight, Briefcase, Target,
  UserPlus, FileText, MessageSquare, Activity, Zap,
  BarChart3, Award, Heart, Flag,
} from 'lucide-react'
import { clsx } from 'clsx'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts'

// ─── TYPES ────────────────────────────────────────────────────────────
type Tier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Prospect'
type InteractionType = 'email' | 'call' | 'meeting' | 'whatsapp' | 'proposal'
type ClientStatus = 'active' | 'dormant' | 'at_risk' | 'new' | 'churned'

interface Contact {
  id: string
  name: string
  role: string
  email: string
  phone: string
  isPrimary: boolean
}

interface Interaction {
  id: string
  type: InteractionType
  date: string
  summary: string
  by: string
}

interface Project {
  id: string
  name: string
  status: 'won' | 'lost' | 'pending' | 'in_progress'
  amount: number
  pax: number
  dates: string
  destination: string
}

interface Client {
  id: string
  name: string
  country: string
  countryFlag: string
  tier: Tier
  status: ClientStatus
  contacts: Contact[]
  email: string
  phone: string
  website: string
  segment: string
  source: string
  totalRevenue: number
  totalProjects: number
  wonProjects: number
  activeProjects: number
  conversionRate: number
  avgTicket: number
  lastInteraction: string
  nextFollowUp: string | null
  interactions: Interaction[]
  projects: Project[]
  preferences: string[]
  tags: string[]
  notes: string
  healthScore: number
  nps: number | null
  createdAt: string
}

// ─── MOCK DATA ────────────────────────────────────────────────────────
const CLIENTS: Client[] = [
  {
    id: 'CLI-001',
    name: 'Luxe Voyages International',
    country: 'France',
    countryFlag: '🇫🇷',
    tier: 'Platinum',
    status: 'active',
    contacts: [
      { id: 'c1', name: 'Sophie Martin', role: 'Directrice Partenariats', email: 's.martin@luxevoyages.fr', phone: '+33 1 42 56 78 90', isPrimary: true },
      { id: 'c2', name: 'Pierre Dubois', role: 'Responsable Produit Maroc', email: 'p.dubois@luxevoyages.fr', phone: '+33 1 42 56 78 91', isPrimary: false },
    ],
    email: 's.martin@luxevoyages.fr',
    phone: '+33 1 42 56 78 90',
    website: 'luxevoyages.fr',
    segment: 'Luxury TO',
    source: 'Salon IFTM Top Resa 2024',
    totalRevenue: 2450000,
    totalProjects: 45,
    wonProjects: 38,
    activeProjects: 4,
    conversionRate: 84,
    avgTicket: 64473,
    lastInteraction: 'Il y a 2 jours',
    nextFollowUp: '2026-05-02',
    interactions: [
      { id: 'i1', type: 'meeting', date: '2026-04-24', summary: 'Rdv Paris bureau LV - discussion programme Maroc été 2026, 8 départs confirmés', by: 'Chakir' },
      { id: 'i2', type: 'email', date: '2026-04-20', summary: 'Envoi cotation Grand Tour Imperial 14j - 3 variantes (Standard/Comfort/Luxe)', by: 'Amina' },
      { id: 'i3', type: 'proposal', date: '2026-04-18', summary: 'Proposition Sahara VIP 5j pour groupe privé 6 pax — validée client', by: 'Chakir' },
      { id: 'i4', type: 'call', date: '2026-04-10', summary: 'Appel Sophie - feedback positif sur le dernier groupe, demande hébergement Riad privatisé', by: 'Youssef' },
    ],
    projects: [
      { id: 'p1', name: 'Grand Tour Impérial 14j', status: 'in_progress', amount: 145000, pax: 22, dates: '15 Mai - 28 Mai 2026', destination: 'Marrakech → Fès → Chefchaouen → Tanger' },
      { id: 'p2', name: 'Sahara VIP Private 5j', status: 'won', amount: 38000, pax: 6, dates: '8 Jun - 12 Jun 2026', destination: 'Marrakech → Ouarzazate → Merzouga' },
      { id: 'p3', name: 'MICE Incentive Essaouira', status: 'pending', amount: 220000, pax: 80, dates: '20 Sep - 24 Sep 2026', destination: 'Essaouira' },
      { id: 'p4', name: 'Atlas Trek Premium', status: 'won', amount: 52000, pax: 14, dates: '3 Oct - 9 Oct 2026', destination: 'Imlil → Toubkal → Ourika' },
    ],
    preferences: ['Hôtels 5* uniquement', 'Guides francophones certifiés', 'Transferts Mercedes V-Class', 'Riads privatisés', 'Menu végétarien systématique'],
    tags: ['VIP', 'Luxury', 'France', 'Fidèle', 'MICE'],
    notes: 'Partenaire depuis 2019. Sophie est la décisionnaire. Préfère les communications par email. Facturation à 30 jours.',
    healthScore: 95,
    nps: 9,
    createdAt: '2019-03-15',
  },
  {
    id: 'CLI-002',
    name: 'Elite Destinations NY',
    country: 'USA',
    countryFlag: '🇺🇸',
    tier: 'Platinum',
    status: 'active',
    contacts: [
      { id: 'c3', name: 'Sarah Jenkins', role: 'CEO & Founder', email: 'sarah@elitedest.com', phone: '+1 212 555 0142', isPrimary: true },
    ],
    email: 'sarah@elitedest.com',
    phone: '+1 212 555 0142',
    website: 'elitedest.com',
    segment: 'Luxury Concierge',
    source: 'Recommandation directe',
    totalRevenue: 3800000,
    totalProjects: 30,
    wonProjects: 28,
    activeProjects: 3,
    conversionRate: 93,
    avgTicket: 135714,
    lastInteraction: 'Il y a 3 heures',
    nextFollowUp: '2026-04-28',
    interactions: [
      { id: 'i5', type: 'whatsapp', date: '2026-04-26', summary: 'Discussion détails vol privé Casablanca-Ouarzazate pour groupe Johnson', by: 'Chakir' },
      { id: 'i6', type: 'proposal', date: '2026-04-22', summary: 'Envoi devis Morocco Royal Experience 21j — 4 couples UHNW', by: 'Amina' },
    ],
    projects: [
      { id: 'p5', name: 'Morocco Royal Experience 21j', status: 'pending', amount: 480000, pax: 8, dates: '1 Nov - 21 Nov 2026', destination: 'All Morocco' },
      { id: 'p6', name: 'Desert Glamping Ultra-Luxe', status: 'in_progress', amount: 95000, pax: 4, dates: '10 Mai - 14 Mai 2026', destination: 'Agafay → Merzouga' },
    ],
    preferences: ['Paiement en USD', 'Hébergement Riad privatisé', 'Hélicoptère transfers', 'Chef privé', 'Conciergerie 24/7'],
    tags: ['Ultra-Luxury', 'USA', 'UHNW', 'Hélicoptère'],
    notes: 'Clientèle ultra-fortunée. Budget jamais un problème. Exige exclusivité totale. Sarah répond uniquement sur WhatsApp.',
    healthScore: 98,
    nps: 10,
    createdAt: '2021-01-20',
  },
  {
    id: 'CLI-003',
    name: 'Atlas Tours UK',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    tier: 'Gold',
    status: 'active',
    contacts: [
      { id: 'c4', name: 'James Smith', role: 'Morocco Product Manager', email: 'jsmith@atlastours.co.uk', phone: '+44 20 7946 0958', isPrimary: true },
      { id: 'c5', name: 'Emily Brown', role: 'Operations Coordinator', email: 'ebrown@atlastours.co.uk', phone: '+44 20 7946 0959', isPrimary: false },
    ],
    email: 'jsmith@atlastours.co.uk',
    phone: '+44 20 7946 0958',
    website: 'atlastours.co.uk',
    segment: 'Tour Operator',
    source: 'WTM London 2023',
    totalRevenue: 850000,
    totalProjects: 22,
    wonProjects: 12,
    activeProjects: 2,
    conversionRate: 54,
    avgTicket: 70833,
    lastInteraction: 'Aujourd\'hui',
    nextFollowUp: '2026-05-05',
    interactions: [
      { id: 'i7', type: 'call', date: '2026-04-26', summary: 'Appel James — veut ajouter 2 départs Marrakech-Sahara en automne', by: 'Youssef' },
      { id: 'i8', type: 'email', date: '2026-04-19', summary: 'Feedback clients sur dernier groupe: 4.2/5 — problème restaurant J3 Fès', by: 'Amina' },
    ],
    projects: [
      { id: 'p7', name: 'Best of Morocco 10j', status: 'in_progress', amount: 88000, pax: 18, dates: '5 Mai - 14 Mai 2026', destination: 'Marrakech → Sahara → Fès' },
      { id: 'p8', name: 'Marrakech City Break 4j', status: 'pending', amount: 32000, pax: 24, dates: '12 Jun - 15 Jun 2026', destination: 'Marrakech' },
    ],
    preferences: ['Régimes végétariens fréquents', 'Activités outdoor', 'Budget moyen-haut', 'Guides anglophones'],
    tags: ['UK', 'Tour Operator', 'Outdoor', 'Volume'],
    notes: 'Conversion en hausse depuis Q4 2025. James est réactif. Emily gère la logistique terrain. Potentiel upgrade vers Platinum si on gagne les 2 départs automne.',
    healthScore: 78,
    nps: 8,
    createdAt: '2023-11-10',
  },
  {
    id: 'CLI-004',
    name: 'Iberia Travel Group',
    country: 'Spain',
    countryFlag: '🇪🇸',
    tier: 'Silver',
    status: 'at_risk',
    contacts: [
      { id: 'c6', name: 'Carlos Ruiz', role: 'Directeur Commercial', email: 'cruiz@iberiatravel.es', phone: '+34 91 555 0142', isPrimary: true },
    ],
    email: 'cruiz@iberiatravel.es',
    phone: '+34 91 555 0142',
    website: 'iberiatravel.es',
    segment: 'Tour Operator',
    source: 'FITUR Madrid 2024',
    totalRevenue: 120000,
    totalProjects: 15,
    wonProjects: 4,
    activeProjects: 0,
    conversionRate: 26,
    avgTicket: 30000,
    lastInteraction: 'Il y a 3 semaines',
    nextFollowUp: null,
    interactions: [
      { id: 'i9', type: 'email', date: '2026-04-05', summary: 'Relance cotation été — pas de réponse', by: 'Youssef' },
      { id: 'i10', type: 'call', date: '2026-03-20', summary: 'Carlos indisponible — assistante dit "en réorganisation interne"', by: 'Chakir' },
    ],
    projects: [
      { id: 'p9', name: 'Circuit Nord Maroc 7j', status: 'lost', amount: 45000, pax: 20, dates: 'Juin 2026', destination: 'Tanger → Chefchaouen → Fès' },
    ],
    preferences: ['Budget optimisé', 'Groupes 20+ pax', 'Guides hispanophones'],
    tags: ['Espagne', 'Budget', 'Risque'],
    notes: 'Conversion faible. Client sensible au prix. Carlos prend du temps à répondre. Possible qu\'ils travaillent avec un autre DMC concurrent.',
    healthScore: 32,
    nps: 6,
    createdAt: '2024-02-15',
  },
  {
    id: 'CLI-005',
    name: 'Tokyo Luxury Travel',
    country: 'Japan',
    countryFlag: '🇯🇵',
    tier: 'Gold',
    status: 'new',
    contacts: [
      { id: 'c7', name: 'Yuki Tanaka', role: 'Director of Outbound', email: 'y.tanaka@tokyoluxury.jp', phone: '+81 3 5555 0142', isPrimary: true },
    ],
    email: 'y.tanaka@tokyoluxury.jp',
    phone: '+81 3 5555 0142',
    website: 'tokyoluxury.jp',
    segment: 'Luxury Concierge',
    source: 'Lead Generation IA',
    totalRevenue: 0,
    totalProjects: 2,
    wonProjects: 0,
    activeProjects: 1,
    conversionRate: 0,
    avgTicket: 0,
    lastInteraction: 'Il y a 5 jours',
    nextFollowUp: '2026-04-30',
    interactions: [
      { id: 'i11', type: 'meeting', date: '2026-04-21', summary: 'Visio de présentation S\'TOURS — très intéressés par le Desert Ultra-Luxe et Riad privatisé', by: 'Chakir' },
      { id: 'i12', type: 'email', date: '2026-04-22', summary: 'Envoi brochure S\'TOURS et exemples de programmes exclusifs', by: 'Amina' },
    ],
    projects: [
      { id: 'p10', name: 'Japan VIP Group - Discovery Morocco', status: 'pending', amount: 320000, pax: 12, dates: 'Oct 2026', destination: 'All Morocco Premium' },
    ],
    preferences: ['Service impeccable', 'Traducteur japonais', 'Cuisine halal/kaiseki fusion', 'Photographie pro incluse'],
    tags: ['Japon', 'Nouveau', 'Ultra-Luxury', 'Potentiel élevé'],
    notes: 'Premier contact prometteur. Yuki gère 40+ voyages ultra-luxe/an. Si on gagne le premier projet, potentiel de 3M+ MAD/an. Concurrence: Kensington Tours.',
    healthScore: 70,
    nps: null,
    createdAt: '2026-04-15',
  },
  {
    id: 'CLI-006',
    name: 'Prestige Events Geneva',
    country: 'Switzerland',
    countryFlag: '🇨🇭',
    tier: 'Silver',
    status: 'active',
    contacts: [
      { id: 'c8', name: 'Marc Dupont', role: 'Event Director', email: 'm.dupont@prestige-events.ch', phone: '+41 22 555 0142', isPrimary: true },
    ],
    email: 'm.dupont@prestige-events.ch',
    phone: '+41 22 555 0142',
    website: 'prestige-events.ch',
    segment: 'MICE Agency',
    source: 'IMEX Frankfurt 2025',
    totalRevenue: 280000,
    totalProjects: 5,
    wonProjects: 3,
    activeProjects: 1,
    conversionRate: 60,
    avgTicket: 93333,
    lastInteraction: 'Il y a 1 semaine',
    nextFollowUp: '2026-05-10',
    interactions: [
      { id: 'i13', type: 'meeting', date: '2026-04-19', summary: 'Site inspection Marrakech — Marc visite 4 hôtels pour incentive Q4', by: 'Chakir' },
    ],
    projects: [
      { id: 'p11', name: 'Incentive Pharma 200 pax', status: 'in_progress', amount: 380000, pax: 200, dates: '15 Oct - 19 Oct 2026', destination: 'Marrakech' },
    ],
    preferences: ['Capacité grands groupes', 'AV equipment', 'Team building outdoor', 'Gala dinner'],
    tags: ['MICE', 'Suisse', 'Grands groupes', 'Incentive'],
    notes: 'Spécialiste incentive pharma et finance. Marc fait 2 site inspections/an. Budget confortable.',
    healthScore: 82,
    nps: 8,
    createdAt: '2025-03-10',
  },
  {
    id: 'CLI-007',
    name: 'Nordic Wanderlust',
    country: 'Sweden',
    countryFlag: '🇸🇪',
    tier: 'Bronze',
    status: 'dormant',
    contacts: [
      { id: 'c9', name: 'Erik Lindqvist', role: 'Product Manager', email: 'erik@nordicwanderlust.se', phone: '+46 8 555 0142', isPrimary: true },
    ],
    email: 'erik@nordicwanderlust.se',
    phone: '+46 8 555 0142',
    website: 'nordicwanderlust.se',
    segment: 'Tour Operator',
    source: 'LinkedIn Outreach',
    totalRevenue: 45000,
    totalProjects: 3,
    wonProjects: 1,
    activeProjects: 0,
    conversionRate: 33,
    avgTicket: 45000,
    lastInteraction: 'Il y a 2 mois',
    nextFollowUp: null,
    interactions: [
      { id: 'i14', type: 'email', date: '2026-02-20', summary: 'Relance Q1 — Erik dit "on reprend contact au printemps"', by: 'Youssef' },
    ],
    projects: [
      { id: 'p12', name: 'Morocco Adventure 8j', status: 'won', amount: 45000, pax: 12, dates: 'Mar 2026', destination: 'Marrakech → Atlas → Sahara' },
    ],
    preferences: ['Eco-tourism', 'Activités nature', 'Hébergement authentique'],
    tags: ['Scandinavie', 'Eco', 'Dormant'],
    notes: 'Un seul projet réalisé en 2026. Feedback client excellent (4.8/5). Erik semble intéressé mais lent à décider. Relancer avec offre éco-premium.',
    healthScore: 40,
    nps: 9,
    createdAt: '2025-09-01',
  },
  {
    id: 'CLI-008',
    name: 'Dubai Exclusive Travels',
    country: 'UAE',
    countryFlag: '🇦🇪',
    tier: 'Gold',
    status: 'active',
    contacts: [
      { id: 'c10', name: 'Fatima Al-Rashid', role: 'Managing Director', email: 'fatima@dubaiexclusive.ae', phone: '+971 4 555 0142', isPrimary: true },
      { id: 'c11', name: 'Omar Hassan', role: 'Morocco Desk', email: 'omar@dubaiexclusive.ae', phone: '+971 4 555 0143', isPrimary: false },
    ],
    email: 'fatima@dubaiexclusive.ae',
    phone: '+971 4 555 0142',
    website: 'dubaiexclusive.ae',
    segment: 'Luxury TO',
    source: 'ATM Dubai 2025',
    totalRevenue: 680000,
    totalProjects: 12,
    wonProjects: 8,
    activeProjects: 2,
    conversionRate: 66,
    avgTicket: 85000,
    lastInteraction: 'Hier',
    nextFollowUp: '2026-04-29',
    interactions: [
      { id: 'i15', type: 'whatsapp', date: '2026-04-25', summary: 'Omar demande dispo Riad El Fenn pour groupe royal famille saoudienne — 3 nuits', by: 'Chakir' },
      { id: 'i16', type: 'proposal', date: '2026-04-23', summary: 'Cotation Morocco Royal Family Tour 18j — services VIP complets', by: 'Amina' },
    ],
    projects: [
      { id: 'p13', name: 'Royal Family Morocco Tour', status: 'pending', amount: 520000, pax: 15, dates: 'Jul 2026', destination: 'All Morocco Ultra-VIP' },
      { id: 'p14', name: 'Ramadan Retreat Marrakech', status: 'in_progress', amount: 68000, pax: 8, dates: 'Mar-Avr 2026', destination: 'Marrakech' },
    ],
    preferences: ['Halal strictement', 'Suites royales', 'Sécurité privée', 'Véhicules blindés option'],
    tags: ['Gulf', 'Royal', 'Ultra-VIP', 'Halal'],
    notes: 'Clientèle royale et UHNW du Gulf. Omar est le point de contact opérationnel. Fatima décide. Paiement toujours anticipé.',
    healthScore: 88,
    nps: 9,
    createdAt: '2025-04-20',
  },
]

// ─── TIER CONFIG ──────────────────────────────────────────────────────
const TIER_CONFIG: Record<Tier, { color: string; bg: string; border: string }> = {
  Platinum: { color: 'text-violet-600', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  Gold:     { color: 'text-amber-600',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20' },
  Silver:   { color: 'text-slate-500',  bg: 'bg-slate-500/10',  border: 'border-slate-500/20' },
  Bronze:   { color: 'text-orange-600', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  Prospect: { color: 'text-blue-600',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20' },
}

const STATUS_CONFIG: Record<ClientStatus, { label: string; color: string; bg: string }> = {
  active:  { label: 'Actif',   color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  new:     { label: 'Nouveau', color: 'text-blue-600',    bg: 'bg-blue-500/10' },
  at_risk: { label: 'Risque',  color: 'text-red-600',     bg: 'bg-red-500/10' },
  dormant: { label: 'Dormant', color: 'text-amber-600',   bg: 'bg-amber-500/10' },
  churned: { label: 'Perdu',   color: 'text-slate-400',   bg: 'bg-slate-400/10' },
}

const INTERACTION_ICONS: Record<InteractionType, typeof Mail> = {
  email: Mail, call: Phone, meeting: Users, whatsapp: MessageSquare, proposal: FileText,
}

// ─── ADD CLIENT MODAL ─────────────────────────────────────────────────
function AddClientModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', contact: '', segment: 'Tour Operator', source: '' })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg text-slate-800 dark:text-white">Nouveau Client / Agence</h2>
            <p className="text-[12px] text-slate-400 mt-0.5">Ajouter un partenaire B2B au CRM</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nom de l'agence *</label>
            <input className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] focus:ring-2 focus:ring-rihla transition-all" placeholder="Luxe Voyages International" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Contact principal</label>
              <input className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] focus:ring-2 focus:ring-rihla transition-all" placeholder="Sophie Martin" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pays</label>
              <input className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] focus:ring-2 focus:ring-rihla transition-all" placeholder="France" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] focus:ring-2 focus:ring-rihla transition-all" placeholder="contact@agence.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Telephone</label>
              <input className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] focus:ring-2 focus:ring-rihla transition-all" placeholder="+33 1 23 45 67 89" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Segment</label>
              <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] focus:ring-2 focus:ring-rihla transition-all" value={form.segment} onChange={e => setForm(f => ({ ...f, segment: e.target.value }))}>
                <option>Tour Operator</option>
                <option>Luxury Concierge</option>
                <option>MICE Agency</option>
                <option>OTA / Online</option>
                <option>Corporate</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Source</label>
              <input className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] focus:ring-2 focus:ring-rihla transition-all" placeholder="Salon IFTM 2025" value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} />
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">Annuler</button>
          <button className="flex-1 px-4 py-2.5 bg-rihla text-white rounded-xl text-[13px] font-bold hover:bg-rihla/90 transition-colors flex items-center justify-center gap-2" onClick={onClose}>
            <Plus size={14} /> Ajouter au CRM
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── CLIENT DETAIL PANEL ──────────────────────────────────────────────
function ClientDetailPanel({ client, onClose }: { client: Client; onClose: () => void }) {
  const [tab, setTab] = useState<'overview' | 'projects' | 'interactions' | 'contacts'>('overview')
  const tierCfg = TIER_CONFIG[client.tier]
  const statusCfg = STATUS_CONFIG[client.status]

  const revenueByMonth = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun']
    const base = client.totalRevenue / 12
    return months.map((m, i) => ({ name: m, value: Math.round(base * (0.7 + Math.random() * 0.6)) }))
  }, [client.totalRevenue])

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-[680px] bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto border-l border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rihla/10 flex items-center justify-center text-rihla font-bold text-lg">{client.countryFlag}</div>
              <div>
                <h2 className="font-bold text-lg text-slate-900 dark:text-white">{client.name}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold uppercase', tierCfg.bg, tierCfg.color)}>{client.tier}</span>
                  <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold', statusCfg.bg, statusCfg.color)}>{statusCfg.label}</span>
                  <span className="text-[11px] text-slate-400">{client.segment}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><X size={18} /></button>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 mt-2">
            {(['overview', 'projects', 'interactions', 'contacts'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={clsx('px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors', tab === t ? 'bg-rihla/10 text-rihla' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800')}>
                {t === 'overview' ? 'Vue d\'ensemble' : t === 'projects' ? `Projets (${client.projects.length})` : t === 'interactions' ? `Interactions (${client.interactions.length})` : `Contacts (${client.contacts.length})`}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {tab === 'overview' && (
            <div className="space-y-6">
              {/* Health & KPIs */}
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Score Santé</p>
                  <p className={clsx('text-2xl font-black mt-1', client.healthScore >= 80 ? 'text-emerald-600' : client.healthScore >= 50 ? 'text-amber-600' : 'text-red-600')}>{client.healthScore}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">CA Total</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{(client.totalRevenue / 1000).toFixed(0)}k</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Conversion</p>
                  <p className="text-lg font-bold text-rihla mt-1">{client.conversionRate}%</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">NPS</p>
                  <p className={clsx('text-2xl font-black mt-1', (client.nps ?? 0) >= 9 ? 'text-emerald-600' : (client.nps ?? 0) >= 7 ? 'text-amber-600' : 'text-red-600')}>{client.nps ?? '—'}</p>
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                <h4 className="text-[12px] font-bold text-slate-500 mb-3">Revenus Mensuels (MAD)</h4>
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={revenueByMonth}>
                    <Area type="monotone" dataKey="value" stroke="#b43e20" fill="#b43e20" fillOpacity={0.1} strokeWidth={2} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase">Informations</h4>
                  <div className="space-y-2 text-[13px]">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Mail size={13} className="text-slate-400" />{client.email}</div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Phone size={13} className="text-slate-400" />{client.phone}</div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Globe2 size={13} className="text-slate-400" />{client.website}</div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><MapPin size={13} className="text-slate-400" />{client.country}</div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Target size={13} className="text-slate-400" />{client.source}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase">Préférences</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {client.preferences.map(p => (
                      <span key={p} className="px-2 py-1 bg-rihla/5 text-rihla text-[10px] font-medium rounded-lg border border-rihla/10">{p}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {client.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium rounded-full">{t}</span>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2">Notes Internes</h4>
                <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 rounded-xl p-3">{client.notes}</p>
              </div>

              {/* Next follow-up */}
              {client.nextFollowUp && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/10 rounded-xl">
                  <Calendar size={16} className="text-blue-600" />
                  <div>
                    <p className="text-[12px] font-bold text-blue-700 dark:text-blue-400">Prochain suivi planifié</p>
                    <p className="text-[11px] text-blue-600/70">{client.nextFollowUp}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'projects' && (
            <div className="space-y-3">
              {client.projects.map(p => {
                const statusColor = { won: 'text-emerald-600 bg-emerald-50', lost: 'text-red-600 bg-red-50', pending: 'text-amber-600 bg-amber-50', in_progress: 'text-blue-600 bg-blue-50' }[p.status]
                const statusLabel = { won: 'Gagné', lost: 'Perdu', pending: 'En attente', in_progress: 'En cours' }[p.status]
                return (
                  <div key={p.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-rihla/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">{p.name}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{p.destination}</p>
                      </div>
                      <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold', statusColor)}>{statusLabel}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500">
                      <span className="font-bold text-slate-900 dark:text-white">{p.amount.toLocaleString('fr-MA')} MAD</span>
                      <span>{p.pax} pax</span>
                      <span>{p.dates}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {tab === 'interactions' && (
            <div className="space-y-3">
              {client.interactions.map(int => {
                const Icon = INTERACTION_ICONS[int.type]
                return (
                  <div key={int.id} className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-rihla/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-rihla" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-slate-700 dark:text-slate-200">{int.summary}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span>{int.date}</span>
                        <span>par {int.by}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
              <button className="w-full py-3 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-[12px] font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                <Plus size={14} /> Ajouter une interaction
              </button>
            </div>
          )}

          {tab === 'contacts' && (
            <div className="space-y-3">
              {client.contacts.map(c => (
                <div key={c.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-rihla/10 flex items-center justify-center text-rihla font-bold text-[12px]">{c.name.split(' ').map(n => n[0]).join('')}</div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-900 dark:text-white">{c.name}</p>
                        <p className="text-[11px] text-slate-500">{c.role}</p>
                      </div>
                    </div>
                    {c.isPrimary && <span className="px-2 py-0.5 bg-rihla/10 text-rihla text-[10px] font-bold rounded-full">Principal</span>}
                  </div>
                  <div className="flex items-center gap-4 text-[12px] text-slate-500 mt-2">
                    <span className="flex items-center gap-1"><Mail size={12} />{c.email}</span>
                    <span className="flex items-center gap-1"><Phone size={12} />{c.phone}</span>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-[12px] font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                <UserPlus size={14} /> Ajouter un contact
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN CRM PAGE ────────────────────────────────────────────────────
export function CrmPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [filterTier, setFilterTier] = useState<Tier | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<ClientStatus | 'all'>('all')
  const [filterSegment, setFilterSegment] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'revenue' | 'health' | 'name' | 'conversion'>('revenue')
  const [showFilters, setShowFilters] = useState(false)

  // Filtered & sorted clients
  const filteredClients = useMemo(() => {
    let result = CLIENTS.filter(c => {
      if (filterTier !== 'all' && c.tier !== filterTier) return false
      if (filterStatus !== 'all' && c.status !== filterStatus) return false
      if (filterSegment !== 'all' && c.segment !== filterSegment) return false
      if (searchTerm) {
        const q = searchTerm.toLowerCase()
        return c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.contacts.some(ct => ct.name.toLowerCase().includes(q)) || c.tags.some(t => t.toLowerCase().includes(q))
      }
      return true
    })
    result.sort((a, b) => {
      if (sortBy === 'revenue') return b.totalRevenue - a.totalRevenue
      if (sortBy === 'health') return b.healthScore - a.healthScore
      if (sortBy === 'conversion') return b.conversionRate - a.conversionRate
      return a.name.localeCompare(b.name)
    })
    return result
  }, [searchTerm, filterTier, filterStatus, filterSegment, sortBy])

  // Global KPIs
  const totalRevenue = CLIENTS.reduce((s, c) => s + c.totalRevenue, 0)
  const totalClients = CLIENTS.length
  const activeClients = CLIENTS.filter(c => c.status === 'active').length
  const atRiskClients = CLIENTS.filter(c => c.status === 'at_risk' || c.status === 'dormant').length
  const avgConversion = Math.round(CLIENTS.reduce((s, c) => s + c.conversionRate, 0) / CLIENTS.length)
  const avgHealth = Math.round(CLIENTS.reduce((s, c) => s + c.healthScore, 0) / CLIENTS.length)
  const pipelineValue = CLIENTS.flatMap(c => c.projects).filter(p => p.status === 'pending' || p.status === 'in_progress').reduce((s, p) => s + p.amount, 0)

  // Chart data
  const tierDistribution = useMemo(() => {
    const counts: Record<string, number> = {}
    CLIENTS.forEach(c => { counts[c.tier] = (counts[c.tier] || 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value, color: TIER_CONFIG[name as Tier]?.color.replace('text-', '#').replace('violet-600', '8b5cf6').replace('amber-600', 'd97706').replace('slate-500', '64748b').replace('orange-600', 'ea580c').replace('blue-600', '2563eb') }))
  }, [])

  const countryRevenue = useMemo(() => {
    const byCountry: Record<string, number> = {}
    CLIENTS.forEach(c => { byCountry[c.country] = (byCountry[c.country] || 0) + c.totalRevenue })
    return Object.entries(byCountry).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value: Math.round(value / 1000) }))
  }, [])

  const segments = useMemo(() => [...new Set(CLIENTS.map(c => c.segment))], [])

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 transition-colors pb-16">
      <AddClientModal open={showAddModal} onClose={() => setShowAddModal(false)} />
      {selectedClient && <ClientDetailPanel client={selectedClient} onClose={() => setSelectedClient(null)} />}

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-6">
        <div className="max-w-[1600px] mx-auto flex justify-between items-end gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              <Building2 size={12} className="text-rihla" /> CRM DMC Maroc
            </div>
            <h1 className="text-[24px] font-bold text-slate-900 dark:text-white tracking-tight">
              Gestion Relation Client B2B
            </h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              {totalClients} clients &middot; {activeClients} actifs &middot; Pipeline: {(pipelineValue / 1000000).toFixed(1)}M MAD
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/leads" className="inline-flex items-center gap-1.5 h-9 px-3 text-[13px] font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
              <Target size={14} /> Leads IA
            </Link>
            <Link to="/crm/analytics" className="inline-flex items-center gap-1.5 h-9 px-3 text-[13px] font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
              <BarChart3 size={14} /> Analytique
            </Link>
            <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-1.5 h-9 px-3.5 text-[13px] font-bold text-white bg-rihla hover:bg-rihla/90 rounded-lg transition-colors">
              <UserPlus size={14} /> Nouveau Client
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-[1600px] mx-auto space-y-6">

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            { label: 'CA Total', value: `${(totalRevenue / 1000000).toFixed(1)}M`, sub: 'MAD', icon: DollarSign, color: 'text-emerald-600' },
            { label: 'Pipeline', value: `${(pipelineValue / 1000000).toFixed(1)}M`, sub: 'en cours', icon: Briefcase, color: 'text-blue-600' },
            { label: 'Clients Actifs', value: activeClients, sub: `/ ${totalClients}`, icon: Users, color: 'text-rihla' },
            { label: 'Conversion Moy.', value: `${avgConversion}%`, sub: 'gagnes/total', icon: TrendingUp, color: 'text-amber-600' },
            { label: 'Score Santé', value: avgHealth, sub: '/ 100', icon: Heart, color: 'text-pink-600' },
            { label: 'Clients Risque', value: atRiskClients, sub: 'attention', icon: AlertCircle, color: 'text-red-600' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-slate-500">{kpi.label}</span>
                <kpi.icon size={14} className={kpi.color} />
              </div>
              <p className="text-[22px] font-bold text-slate-900 dark:text-white tabular-nums">{kpi.value}</p>
              <p className="text-[11px] text-slate-400">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-[13px] font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <BarChart3 size={14} className="text-rihla" /> CA par Marché (k MAD)
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={countryRevenue}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="value" fill="#b43e20" radius={[4, 4, 0, 0]} barSize={32} name="CA (k MAD)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-[13px] font-bold text-slate-900 dark:text-white mb-3">Répartition par Tier</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={tierDistribution} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} label={({ name, value }) => `${name}: ${value}`}>
                  {tierDistribution.map((d, i) => (
                    <Cell key={i} fill={['#8b5cf6', '#d97706', '#64748b', '#ea580c', '#2563eb'][i % 5]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[280px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Rechercher client, pays, contact, tag..." className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-[13px] focus:ring-2 focus:ring-rihla transition-all" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={clsx('inline-flex items-center gap-1.5 h-9 px-3 text-[12px] font-medium border rounded-lg transition-colors', showFilters ? 'bg-rihla/10 text-rihla border-rihla/20' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50')}>
              <Filter size={13} /> Filtres
            </button>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="h-9 px-3 text-[12px] font-medium border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <option value="revenue">Trier: CA</option>
              <option value="health">Trier: Score Santé</option>
              <option value="conversion">Trier: Conversion</option>
              <option value="name">Trier: Nom</option>
            </select>
            <span className="text-[12px] font-medium text-slate-400">{filteredClients.length} résultat(s)</span>
          </div>
          {showFilters && (
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex-wrap">
              <select value={filterTier} onChange={e => setFilterTier(e.target.value as any)} className="h-8 px-3 text-[11px] font-medium border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <option value="all">Tous les tiers</option>
                {(['Platinum', 'Gold', 'Silver', 'Bronze', 'Prospect'] as Tier[]).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="h-8 px-3 text-[11px] font-medium border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <option value="all">Tous les statuts</option>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <select value={filterSegment} onChange={e => setFilterSegment(e.target.value)} className="h-8 px-3 text-[11px] font-medium border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <option value="all">Tous les segments</option>
                {segments.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {(filterTier !== 'all' || filterStatus !== 'all' || filterSegment !== 'all') && (
                <button onClick={() => { setFilterTier('all'); setFilterStatus('all'); setFilterSegment('all') }} className="text-[11px] text-rihla font-medium hover:underline">Réinitialiser</button>
              )}
            </div>
          )}
        </div>

        {/* Clients Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Tier</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-right">CA Généré</th>
                <th className="px-4 py-3 text-center">Conversion</th>
                <th className="px-4 py-3 text-center">Santé</th>
                <th className="px-4 py-3 text-left">Dernier Contact</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredClients.map(c => {
                const tierCfg = TIER_CONFIG[c.tier]
                const statusCfg = STATUS_CONFIG[c.status]
                return (
                  <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => setSelectedClient(c)}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-rihla/8 flex items-center justify-center text-[14px] flex-shrink-0">{c.countryFlag}</div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{c.name}</p>
                          <p className="text-[11px] text-slate-500">{c.contacts[0]?.name} &middot; {c.country}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold', tierCfg.bg, tierCfg.color)}>{c.tier}</span></td>
                    <td className="px-4 py-3.5"><span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold', statusCfg.bg, statusCfg.color)}>{statusCfg.label}</span></td>
                    <td className="px-4 py-3.5 text-right font-medium text-slate-900 dark:text-white tabular-nums">{c.totalRevenue > 0 ? `${(c.totalRevenue / 1000).toFixed(0)}k` : '—'}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={clsx('font-bold', c.conversionRate >= 70 ? 'text-emerald-600' : c.conversionRate >= 40 ? 'text-amber-600' : 'text-red-600')}>{c.conversionRate}%</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className={clsx('h-full rounded-full transition-all', c.healthScore >= 80 ? 'bg-emerald-500' : c.healthScore >= 50 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${c.healthScore}%` }} />
                        </div>
                        <span className="text-[11px] text-slate-500 tabular-nums">{c.healthScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[12px] text-slate-500">{c.lastInteraction}</td>
                    <td className="px-4 py-3.5 text-center">
                      <button className="p-1.5 text-slate-400 hover:text-rihla hover:bg-rihla/5 rounded-lg transition-colors" onClick={e => { e.stopPropagation(); setSelectedClient(c) }}>
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Alerts & Follow-ups */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* At Risk */}
          <div className="bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/10 rounded-xl p-5">
            <h3 className="text-[13px] font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-3">
              <AlertCircle size={14} /> Clients en Risque
            </h3>
            <div className="space-y-2">
              {CLIENTS.filter(c => c.status === 'at_risk' || c.status === 'dormant').map(c => (
                <div key={c.id} className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg cursor-pointer hover:shadow-sm transition-shadow" onClick={() => setSelectedClient(c)}>
                  <div className="flex items-center gap-2">
                    <span>{c.countryFlag}</span>
                    <span className="text-[12px] font-medium text-slate-700 dark:text-slate-200">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-red-600">Score: {c.healthScore}</span>
                    <ChevronRight size={12} className="text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Follow-ups */}
          <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/10 rounded-xl p-5">
            <h3 className="text-[13px] font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2 mb-3">
              <Calendar size={14} /> Prochains Suivis
            </h3>
            <div className="space-y-2">
              {CLIENTS.filter(c => c.nextFollowUp).sort((a, b) => (a.nextFollowUp ?? '').localeCompare(b.nextFollowUp ?? '')).map(c => (
                <div key={c.id} className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg cursor-pointer hover:shadow-sm transition-shadow" onClick={() => setSelectedClient(c)}>
                  <div className="flex items-center gap-2">
                    <span>{c.countryFlag}</span>
                    <span className="text-[12px] font-medium text-slate-700 dark:text-slate-200">{c.name}</span>
                  </div>
                  <span className="text-[11px] text-blue-600 font-medium">{c.nextFollowUp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
