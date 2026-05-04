/**
 * Configuration par rôle :
 * - homeRoute : page d'accueil après login
 * - navGroups : navigation affichée dans la sidebar
 */

export type AppRole =
  | 'super_admin'
  | 'sales_director'
  | 'travel_designer'
  | 'quotation_officer'
  | 'data_operator'
  | 'sales_agent'
  | 'guide'
  | 'client'
  | 'driver'

export function getHomeRoute(role: string): string {
  const map: Record<string, string> = {
    super_admin:      '/dashboard',
    sales_director:   '/portal/horizon',
    travel_designer:  '/projects',
    quotation_officer:'/invoices',
    data_operator:    '/inventory/hotels',
    sales_agent:      '/projects',
    guide:            '/portal/guide',
    client:           '/portal',
    driver:           '/portal/driver',
  }
  return map[role] ?? '/dashboard'
}

export interface NavItem {
  to: string
  label: string
  icon: string   // Lucide icon name
  shortcut?: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

const ALL_GROUPS: NavGroup[] = [
  {
    label: 'STRATÉGIE & PILOTAGE',
    items: [
      { to: '/dashboard',            icon: 'LayoutDashboard', label: 'Pilotage Général',        shortcut: '1' },
      { to: '/executive-insights',    icon: 'TrendingUp',      label: 'Command Center CEO',      shortcut: 'S' },
      { to: '/analytics',            icon: 'BarChart3',       label: 'Performance Insights',    shortcut: 'A' },
      { to: '/war-room',             icon: 'Radio',           label: 'War Room · Ops Live',     shortcut: 'W' },
    ],
  },
  {
    label: 'CONCEPTION & IA',
    items: [
      { to: '/ai-dmc-engine',        icon: 'Cpu',             label: '🤖 Moteur IA DMC',        shortcut: 'M' },
      { to: '/projects',             icon: 'FolderKanban',    label: 'Dossiers & Projets',      shortcut: '2' },
      { to: '/travel-designer',      icon: 'Compass',         label: 'Travel Designer',         shortcut: 'T' },
      { to: '/proposal-studio',      icon: 'FileText',        label: 'Proposal Studio',         shortcut: 'P' },
      { to: '/circuit-generator',    icon: 'Sparkles',        label: 'Générateur IA',           shortcut: 'G' },
      { to: '/itineraries',          icon: 'MapPin',          label: 'Concepteur Itinéraires',  shortcut: '3' },
      { to: '/ai-assistant',         icon: 'Bot',             label: 'Assistant IA' },
      { to: '/circuit-model',        icon: 'Route',           label: 'Modèles Circuits' },
      { to: '/content-studio',       icon: 'Palette',         label: 'Studio Contenu' },
      { to: '/itinerary-builder',    icon: 'Map',             label: 'Builder Itinéraire' },
    ],
  },
  {
    label: 'RELATION CLIENT & B2B',
    items: [
      { to: '/sales-pipeline',       icon: 'TrendingUp',      label: '📊 Pipeline Commercial',  shortcut: 'P' },
      { to: '/b2b-hotel-portal',     icon: 'Building2',       label: '🏨 Portail Hôtels B2B',   shortcut: 'H' },
      { to: '/crm',                  icon: 'Users',           label: 'CRM B2B Clients',         shortcut: 'V' },
      { to: '/crm/analytics',        icon: 'BarChart3',       label: 'Analytique CRM' },
      { to: '/client-portal',        icon: 'Globe',           label: 'Portail Client B2C' },
      { to: '/email-quotation',      icon: 'Mail',            label: 'Email Devis' },
      { to: '/whatsapp',             icon: 'MessageCircle',   label: 'WhatsApp Hub' },
      { to: '/operations/concierge', icon: 'Gem',             label: 'Conciergerie VIP',        shortcut: 'J' },
    ],
  },
  {
    label: 'OPÉRATIONS & LOGISTIQUE',
    items: [
      { to: '/operations/live-tracking',   icon: 'Navigation',      label: '🔴 Suivi Groupes Live',   shortcut: 'N' },
      { to: '/operations/logistics-tower', icon: 'Activity',      label: 'Tour de Contrôle Live',   shortcut: 'L' },
      { to: '/operations/war-room',      icon: 'Layout',          label: 'War Room Kanban',         shortcut: 'K' },
      { to: '/operations/command-center', icon: 'Radio',           label: 'Transport Radar',         shortcut: 'R' },
      { to: '/fleet-optimizer',          icon: 'Truck',           label: 'Flotte & Capacité',       shortcut: 'F' },
      { to: '/operations/rooming',       icon: 'Bed',             label: 'Rooming Lists',           shortcut: 'B' },
      { to: '/operations/catering',      icon: 'Utensils',        label: 'Catering Plan',           shortcut: 'U' },
      { to: '/operations/fulfillment', icon: 'ClipboardCheck', label: 'Fulfillment Ops' },
      { to: '/passenger-app',        icon: 'Users',           label: 'App Passagers' },
    ],
  },
  {
    label: 'BASE SOLIDE — PARAMÉTRAGE',
    items: [
      { to: '/partners',            icon: 'Users',            label: 'Partenaires (Clients & Fournisseurs)', shortcut: 'X' },
      { to: '/hotel-catalog',       icon: 'Hotel',            label: 'Hôtels — Chambres & Tarifs',            shortcut: 'O' },
      { to: '/guide-catalog',       icon: 'UserCheck',        label: 'Guides — Profils & Tarifs' },
      { to: '/fleet-management',    icon: 'Truck',            label: 'Transport — Flotte & Routes' },
      { to: '/seasons',             icon: 'Calendar',         label: 'Saisons & Périodes Tarifaires' },
    ],
  },
  {
    label: 'RESEAU & INVENTAIRE',
    items: [
      { to: '/operations/supplier-audit', icon: 'ShieldCheck',     label: 'Audit Qualité & Réseau',  shortcut: 'Q' },
      { to: '/inventory/hotels',     icon: 'Hotel',           label: 'Parc Hôtelier (legacy)',  shortcut: 'I' },
      { to: '/inventory/guides',     icon: 'Compass',         label: 'Réseau Guides (legacy)',  shortcut: 'G' },
      { to: '/inventory/restaurants',icon: 'Utensils',        label: 'Partenaires Resto',       shortcut: 'R' },
      { to: '/activities',           icon: 'Star',            label: 'Catalogue Activités',     shortcut: 'Y' },
    ],
  },
  {
    label: 'FINANCE & ERP',
    items: [
      { to: '/finance/erp-center',   icon: 'Landmark',        label: 'Console HANA Finance',    shortcut: 'F' },
      { to: '/finance/invoices',     icon: 'Receipt',         label: 'Facturation & Taxes',     shortcut: 'I' },
      { to: '/finance/quotations',   icon: 'Calculator',      label: 'Analyses Marges',         shortcut: 'K' },
    ],
  },
]

// Groupes visibles par rôle
const ROLE_GROUPS: Record<string, string[]> = {
  super_admin: [
    'STRATÉGIE & PILOTAGE',
    'CONCEPTION & IA',
    'BASE SOLIDE — PARAMÉTRAGE',
    'RELATION CLIENT & B2B',
    'OPÉRATIONS & LOGISTIQUE',
    'RESEAU & INVENTAIRE',
    'FINANCE & ERP',
  ],
  sales_director: [
    'STRATÉGIE & PILOTAGE',
    'RELATION CLIENT & B2B',
    'OPÉRATIONS & LOGISTIQUE',
    'FINANCE & ERP',
  ],
  travel_designer: [
    'CONCEPTION & IA',
    'BASE SOLIDE — PARAMÉTRAGE',
    'OPÉRATIONS & LOGISTIQUE',
    'RESEAU & INVENTAIRE',
    'RELATION CLIENT & B2B',
  ],
  quotation_officer: [
    'CONCEPTION & IA',
    'FINANCE & ERP',
  ],
  data_operator: [
    'BASE SOLIDE — PARAMÉTRAGE',
    'RESEAU & INVENTAIRE',
  ],
  sales_agent: [
    'RELATION CLIENT & B2B',
    'CONCEPTION & IA',
    'STRATÉGIE & PILOTAGE',
  ],
  guide: [],
  client: [],
  driver: [],
}

const MOBILE_NAV: Record<string, NavItem[]> = {
  guide: [
    { to: '/portal/guide',     icon: 'Calendar', label: 'Mon Agenda' },
    { to: '/notifications',    icon: 'Bell',      label: 'Notifications' },
  ],
  client: [
    { to: '/portal',           icon: 'Globe',     label: 'Mon Voyage' },
    { to: '/notifications',    icon: 'Bell',      label: 'Notifications' },
  ],
  driver: [
    { to: '/portal/driver',    icon: 'Car',       label: 'Mes Courses' },
    { to: '/notifications',    icon: 'Bell',      label: 'Notifications' },
  ],
}

export function getNavGroups(role: string): NavGroup[] {
  const allowed = ROLE_GROUPS[role] ?? ROLE_GROUPS.sales_agent
  return ALL_GROUPS.filter(g => allowed.includes(g.label))
}

export function getMobileNav(role: string): NavItem[] {
  return MOBILE_NAV[role] ?? []
}

export function isMobileRole(role: string): boolean {
  return ['guide', 'client', 'driver'].includes(role)
}

export const ROLE_LABELS: Record<string, string> = {
  super_admin:      'CEO',
  sales_director:   'Directeur Transport',
  travel_designer:  'Travel Designer',
  quotation_officer:'Directeur Financier',
  data_operator:    'Opérateur Data',
  sales_agent:      'Commercial',
  guide:            'Guide',
  client:           'Client',
  driver:           'Chauffeur',
}
