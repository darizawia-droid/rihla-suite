import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft, FolderKanban, Calculator, MapPin, Receipt, Download,
  Save, Edit3, Check, X, Clock, Users, Calendar, Globe,
  ChevronRight, Sparkles, FileText, BarChart2, Plane, Building2,
  AlertTriangle, Copy, ExternalLink, MoreHorizontal,
  BadgeCheck, TrendingUp, Hash, Layers, History, Shield, Navigation,
  Loader2, Plus, Trash2, Sliders
} from 'lucide-react'
import { projectsApi, quotationsApi, itinerariesApi, invoicesApi, aiApi } from '@/lib/api'
import { clsx } from 'clsx'
import { ItineraryMap } from '@/components/maps/ItineraryMap'

// ââ Status badges ââââââââââââââââââââââââââââââââââââââââââââââââ
const STATUS_MAP: Record<string, { label: string; class: string; icon: typeof Clock }> = {
  draft:       { label: 'Brouillon',  class: 'bg-slate-500/10 text-slate-500 border-slate-500/20', icon: Edit3 },
  in_progress: { label: 'En cours',   class: 'bg-blue-500/10 text-blue-500 border-blue-500/20',     icon: Clock },
  validated:   { label: 'Validé',     class: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: Check },
  sent:        { label: 'Envoyé',     class: 'bg-rihla/10 text-rihla border-rihla/20',            icon: Plane },
  won:         { label: 'Gagné',      class: 'bg-emerald-600/10 text-emerald-600 border-emerald-600/20', icon: Check },
  lost:        { label: 'Perdu',      class: 'bg-rose-500/10 text-rose-500 border-rose-500/20',     icon: X },
}

const TABS = [
  { id: 'overview',   label: 'Pilotage Global', icon: Layers },
  { id: 'quotation',  label: 'Cotation',         icon: Calculator },
  { id: 'itinerary',  label: 'Itinéraire',       icon: MapPin },
  { id: 'invoice',    label: 'Facturation',      icon: Receipt },
  { id: 'exports',    label: 'Édition & PDF',    icon: FileText },
  { id: 'audit',      label: 'Audit Trail',      icon: History },
] as const
type TabId = typeof TABS[number]['id']

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [tab, setTab] = useState<TabId>('overview')

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.get(projectId!).then(r => r.data),
    enabled: !!projectId,
  })

  const { data: quotationData } = useQuery({
    queryKey: ['project-quotation', projectId],
    queryFn: () => quotationsApi.byProject(projectId!).then(r => r.data),
    enabled: !!projectId && (tab === 'quotation' || tab === 'overview'),
  })

  const { data: itineraryData } = useQuery({
    queryKey: ['project-itinerary', projectId],
    queryFn: () => itinerariesApi.byProject(projectId!).then(r => r.data),
    enabled: !!projectId && (tab === 'itinerary' || tab === 'overview'),
  })

  const { data: invoiceData } = useQuery({
    queryKey: ['project-invoices', projectId],
    queryFn: () => invoicesApi.byProject(projectId!).then(r => r.data),
    enabled: !!projectId && (tab === 'invoice' || tab === 'overview'),
  })

  const statusMutation = useMutation({
    mutationFn: (newStatus: string) => projectsApi.patch(projectId!, newStatus),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['project', projectId] }),
  })

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
      <div className="w-12 h-12 border-4 border-rihla/20 border-t-rihla rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Analyse du dossier...</p>
    </div>
  )

  if (!project) return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="text-center bg-white dark:bg-slate-900 p-12 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-2xl">
        <AlertTriangle size={64} className="mx-auto mb-6 text-amber-500" />
        <h2 className="text-2xl font-black text-slate-800 dark:text-cream mb-2">Dossier non référencé</h2>
        <p className="text-slate-400 text-sm mb-8">Ce projet n'existe plus dans la base active de S'TOURS.</p>
        <Link to="/projects" className="px-8 py-3 bg-rihla text-white rounded-2xl text-[11px] font-black uppercase shadow-xl shadow-rihla/20">
          Retour au Portfolio
        </Link>
      </div>
    </div>
  )

  const status = STATUS_MAP[project.status] || STATUS_MAP.draft
  const StatusIcon = status.icon

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-300">
      
      {/* ———————————————————————————————————————————————————————————————————————————— */}
      <div className="px-10 py-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <Link to="/projects" className="hover:text-rihla transition-colors">PORTFOLIO</Link>
        <ChevronRight size={10} />
        <span className="text-slate-900 dark:text-cream">{project.name}</span>
      </div>

      {/* ———————————————————————————————————————————————————————————————————————————— */}
      <div className="px-10 mb-10">
        <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 p-10 shadow-sm relative overflow-hidden">
          
          {/* Glass Accent */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rihla/5 blur-[120px] -mr-64 -mt-64 pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={clsx(
                  "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                  status.class
                )}>
                  <StatusIcon size={12} className="inline mr-2" /> {status.label}
                </div>
                {project.project_type && (
                  <div className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                    {project.project_type}
                  </div>
                )}
              </div>
              
              <h1 className="text-4xl font-black text-slate-900 dark:text-cream leading-tight mb-2 tracking-tighter">
                {project.name}
              </h1>
              
              <div className="flex items-center gap-6 mt-4">
                 <div className="flex items-center gap-2 text-slate-400 text-xs font-bold italic">
                   <Building2 size={14} className="text-rihla" /> {project.client_name || 'Client Direct'}
                 </div>
                 <div className="flex items-center gap-2 text-slate-400 text-xs font-bold italic">
                   <Hash size={14} className="text-rihla" /> {project.reference || 'REF-9921'}
                 </div>
              </div>
            </div>

            <div className="flex gap-3">
               <button className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-rihla transition-all shadow-inner">
                 <Copy size={20} />
               </button>
               <button className="px-8 py-4 bg-rihla text-white text-[11px] font-black uppercase rounded-2xl shadow-2xl shadow-rihla/20 hover:scale-105 transition-all">
                 <Save size={18} className="inline mr-2" /> Sauvegarder
               </button>
            </div>
          </div>

          {/* Metrics Bar */}
          <div className="grid grid-cols-4 gap-6 mt-10 pt-10 border-t border-slate-100 dark:border-white/5 relative z-10">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
              <p className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 italic">
                <MapPin size={14} className="text-rihla" /> {project.destination || 'Marrakech, Maroc'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Logistique</p>
              <p className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 italic">
                <Users size={14} className="text-rihla" /> {project.pax_count || 20} PAX
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Temporalité</p>
              <p className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 italic">
                <Calendar size={14} className="text-rihla" /> {project.duration_days || 7} Jours
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dernière MaJ</p>
              <p className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 italic">
                <Clock size={14} className="text-rihla" /> {new Date(project.updated_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          {/* Workflow Interactive */}
          <div className="flex items-center gap-1 mt-10">
            {['draft', 'in_progress', 'validated', 'sent', 'won'].map((s, i) => {
              const st = STATUS_MAP[s]
              const active = s === project.status
              const past = ['draft','in_progress','validated','sent','won'].indexOf(project.status) >= i
              return (
                <button
                  key={s}
                  onClick={() => !active && statusMutation.mutate(s)}
                  disabled={active}
                  className={clsx(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border",
                    active ? "bg-slate-900 text-white border-slate-900 shadow-xl" :
                    past ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                    "bg-slate-50 dark:bg-white/5 text-slate-400 border-slate-100 dark:border-white/5"
                  )}
                >
                  <div className={clsx("w-2 h-2 rounded-full", active ? "bg-rihla" : past ? "bg-emerald-500" : "bg-slate-300")} />
                  {st.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ———————————————————————————————————————————————————————————————————————————— */}
      <div className="px-10 mb-8 flex items-center gap-2">
        {TABS.map(t => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={clsx(
                "flex items-center gap-3 px-8 py-4 rounded-3xl text-[11px] font-black uppercase tracking-widest transition-all",
                active ? "bg-slate-900 text-white shadow-2xl scale-105" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
              )}
            >
              <Icon size={16} /> {t.label}
            </button>
          )
        })}
      </div>

      {/* ———————————————————————————————————————————————————————————————————————————— */}
      <div className="px-10">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {tab === 'overview' && (
            <OverviewTab project={project} quotation={quotationData} itinerary={itineraryData} invoices={invoiceData} onTab={setTab} />
          )}
          {tab === 'quotation' && (
            <QuotationTab project={project} quotation={quotationData} />
          )}
          {tab === 'itinerary' && (
            <ItineraryTab project={project} itinerary={itineraryData} />
          )}
          {tab === 'invoice' && (
            <InvoiceTab project={project} invoices={invoiceData} />
          )}
          {tab === 'exports' && (
            <ExportsTab project={project} />
          )}
          {tab === 'audit' && (
            <AuditTab projectId={projectId!} />
          )}
        </div>
      </div>
    </div>
  )
}

// ————————————————————————————————————————————————————————————————————————————
// OVERVIEW TAB
// ————————————————————————————————————————————————————————————————————————————
function OverviewTab({ project, quotation, itinerary, invoices, onTab }: any) {
  const modules = [
    {
      title: 'Cotation',
      icon: Calculator,
      color: 'text-rihla',
      bg: 'bg-rihla/10',
      status: quotation?.total_selling ? `${quotation.total_selling.toLocaleString()} MAD` : 'En attente',
      label: 'Volume de vente',
      tab: 'quotation',
    },
    {
      title: 'Itinéraire',
      icon: MapPin,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      status: itinerary?.days?.length ? `${itinerary.days.length} Jours Rédigés` : 'À créer',
      label: 'Progression éditoriale',
      tab: 'itinerary',
    },
    {
      title: 'Facturation',
      icon: Receipt,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      status: invoices?.length ? `${invoices.length} Factures` : 'Aucune émise',
      label: 'État des encaissements',
      tab: 'invoice',
    },
    {
      title: 'Exports',
      icon: Download,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      status: 'PDF · DOCX · PPT',
      label: 'Documents prêts',
      tab: 'exports',
    },
    {
      title: 'Live Tracking',
      icon: Navigation,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
      status: 'Portail B2C Actif',
      label: 'Expérience Voyageur',
      tab: 'live',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-8">
      {/* Module Grid */}
      <div className="col-span-3 grid grid-cols-2 gap-8">
        {modules.map(m => {
          const Icon = m.icon
          return (
            <button
              key={m.title}
              onClick={() => onTab(m.tab)}
              className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 p-8 text-left hover:shadow-2xl transition-all group overflow-hidden relative"
            >
              <div className="flex items-center justify-between mb-8">
                <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center", m.bg)}>
                  <Icon size={28} className={m.color} />
                </div>
                <ChevronRight size={20} className="text-slate-200 group-hover:text-rihla transition-all group-hover:translate-x-2" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-cream tracking-tighter mb-4">{m.status}</h3>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <BadgeCheck size={14} className="text-emerald-500" /> Module {m.title} Actif
              </div>
            </button>
          )
        })}

        {/* ── TRIP LIFE CYCLE TIMELINE ── */}
        <div className="col-span-2 bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black uppercase tracking-widest dark:text-cream flex items-center gap-2">
                 <History size={16} className="text-rihla" /> Cycle de Vie du Voyage
              </h3>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-full">Phase : Exécution</span>
           </div>

           <div className="relative flex justify-between items-start px-4">
              {/* Line background */}
              <div className="absolute top-5 left-10 right-10 h-0.5 bg-slate-100 dark:bg-white/5 z-0" />
              
              {[
                { label: 'Préparation', icon: Calculator, status: 'done', date: 'J-7' },
                { label: 'Arrivée', icon: Plane, status: 'current', date: 'Jour 1' },
                { label: 'Terrain', icon: MapPin, status: 'pending', date: 'J2 - J6' },
                { label: 'Départ', icon: LogOut, status: 'pending', date: 'Jour 7' },
              ].map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center gap-3">
                   <div className={clsx(
                     "w-10 h-10 rounded-2xl flex items-center justify-center transition-all border-2",
                     step.status === 'done' ? "bg-emerald-500 border-emerald-500 text-white" :
                     step.status === 'current' ? "bg-white dark:bg-slate-800 border-rihla text-rihla animate-pulse" :
                     "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300"
                   )}>
                      <step.icon size={18} />
                   </div>
                   <div>
                      <p className={clsx(
                        "text-[10px] font-black uppercase tracking-tighter",
                        step.status === 'pending' ? "text-slate-400" : "text-slate-900 dark:text-cream"
                      )}>{step.label}</p>
                      <p className="text-[9px] font-bold text-slate-400">{step.date}</p>
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-10 p-4 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                    <Check size={14} />
                 </div>
                 <div>
                    <p className="text-[11px] font-black dark:text-cream">Prochaine étape : Check-in Hôtel Sofitel</p>
                    <p className="text-[9px] text-slate-500">Aujourd'hui à 15:00 · Responsable : Guide Hassan</p>
                 </div>
              </div>
              <button className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase rounded-xl">Action</button>
           </div>
        </div>

        {/* AI Insight Card */}
        <div className="col-span-2 bg-gradient-to-br from-rihla to-rihla-dark rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl shadow-rihla/20">
           <div className="absolute top-0 right-0 p-20 opacity-10">
             <Sparkles size={120} />
           </div>
           <div className="relative z-10 flex items-center justify-between">
              <div>
                <h4 className="text-3xl font-black mb-4 tracking-tighter">S'TOURS Genius : Dossier Analyse</h4>
                <p className="text-rihla-light text-lg font-medium opacity-90 leading-relaxed mb-8 max-w-xl">
                  Ce dossier présente un taux de conversion estimé à **85%**. L'IA suggère d'ajouter une option VIP "Survol en Montgolfière" pour augmenter la marge de 12%.
                </p>
                <button className="px-8 py-4 bg-white text-rihla text-[11px] font-black uppercase rounded-2xl shadow-xl shadow-black/20">
                  Appliquer Suggestion
                </button>
              </div>
           </div>
        </div>
      </div>

      {/* Sidebar: Internal Notes & Team */}
      <div className="col-span-1 space-y-8">
         <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Notes du Designer</h5>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic mb-8">
              {project.notes || "Aucune note interne pour le moment. Le client souhaite une approche centrée sur l'artisanat de Fès."}
            </p>
            <button className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl text-[10px] font-black text-slate-400 uppercase hover:border-rihla hover:text-rihla transition-all">
              Éditer les Notes
            </button>
         </div>

         <div className="bg-emerald-500 rounded-[40px] p-8 text-white text-center">
            <TrendingUp size={40} className="mx-auto mb-4" />
            <p className="text-4xl font-black tracking-tighter mb-1">PRO-FIT</p>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Marge Brute Optimisée</p>
         </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// QUOTATION TAB — Moteur de cotation live intégré au projet
// ════════════════════════════════════════════════════════════════════════════

// ─── Types locaux ─────────────────────────────────────────────────────────────
interface QDay {
  id: string; day: number; hotel: string
  formula: 'BB' | 'HB' | 'FB' | '—'
  halfDbl: number; ss: number; taxe: number; water: number
  rest: number; monu: number; lg: number
}
interface QVar {
  id: string; key: string; label: string; total: number
  type: 'transport' | 'guide' | 'taxi' | 'four_by_four' | 'misc'
}
interface QRow { pax: number; cost: number; sell: number; marge: number; usd: number }

const Q_PAX_ALL = [10, 12, 15, 18, 20, 25, 30, 35, 40, 50]

const DEFAULT_VARS: QVar[] = [
  { id: 'v-bus',   key: 'bus',    label: 'Autocar 48 places',   total: 28000, type: 'transport' },
  { id: 'v-guide', key: 'guide',  label: 'Guide national',      total: 8000,  type: 'guide'     },
  { id: 'v-taxi',  key: 'taxi',   label: 'Taxi chef de groupe', total: 1200,  type: 'taxi'      },
]

function qDayCost(d: QDay): number {
  return (d.formula === '—' ? 0 : d.halfDbl) + d.taxe + d.water + d.rest + d.monu + d.lg
}

function qCalcLocal(days: QDay[], vars: QVar[], margin: number, tiers: number[]): QRow[] {
  const fixedPP = days.reduce((s, d) => s + qDayCost(d), 0)
  const varGrp  = vars.reduce((s, v) => s + v.total, 0)
  return tiers.map(pax => {
    const cost = fixedPP + varGrp / pax
    const sell = cost * (1 + margin / 100)
    return { pax, cost: Math.round(cost), sell: Math.round(sell), marge: margin, usd: Math.round(sell / 10.1) }
  })
}

async function qCallSimulate(days: QDay[], vars: QVar[], margin: number, tiers: number[]): Promise<QRow[] | null> {
  try {
    const token = localStorage.getItem('stours_token')
    const res = await fetch('/api/quotations/engine/simulate-circuit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        days: days.map(d => ({
          day: d.day, hotel: d.hotel, formula: d.formula,
          half_dbl: d.halfDbl, single_sup: d.ss, city_tax: d.taxe,
          water: d.water, rest_price: d.rest, monu_price: d.monu, local_guide: d.lg,
        })),
        variable_costs: vars.map(v => ({ key: v.key, label: v.label, total_group: v.total })),
        margin_pct: margin, currency: 'MAD', pax_tiers: tiers, exchange_rate: 10.1,
      }),
    })
    const json = await res.json()
    if (!json.data?.grid) return null
    return json.data.grid.map((r: any) => ({
      pax: r.pax,
      cost: Math.round(r.cost_per_pax),
      sell: Math.round(r.selling_per_pax),
      marge: margin,
      usd: Math.round(r.usd_per_pax ?? r.selling_per_pax / 10.1),
    }))
  } catch {
    return null
  }
}

// ─── Mini KPI card ─────────────────────────────────────────────────────────────
function QKpi({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent: string }) {
  return (
    <div className={clsx('rounded-[28px] p-6 border text-center', accent)}>
      <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</p>
      <p className="text-2xl font-black tracking-tighter">{value}</p>
      {sub && <p className="text-[9px] font-bold opacity-50 mt-0.5">{sub}</p>}
    </div>
  )
}

// ─── QuotationTab principal ───────────────────────────────────────────────────
function QuotationTab({ project, quotation }: any) {
  const paxRef = project?.pax_count    || 20
  const daysN  = project?.duration_days || 7

  // Session
  const [active,   setActive]   = useState(false)
  const [days,     setDays]     = useState<QDay[]>([])
  const [vars,     setVars]     = useState<QVar[]>(DEFAULT_VARS)
  const [margin,   setMargin]   = useState(15)
  const [paxTiers, setPaxTiers] = useState<number[]>([10, 15, 20, 25, 30, 35])
  const [grid,     setGrid]     = useState<QRow[]>([])
  const [loading,  setLoading]  = useState(false)
  const [source,   setSource]   = useState<'local' | 'backend'>('local')
  const debRef = useRef<ReturnType<typeof setTimeout>>()

  // Init jours depuis la durée du projet
  const startChiffrage = useCallback(() => {
    setDays(Array.from({ length: daysN }, (_, i) => ({
      id: `d${i + 1}`, day: i + 1, hotel: '',
      formula: 'HB' as const, halfDbl: 400, ss: 250, taxe: 20, water: 30,
      rest: 0, monu: 0, lg: 0,
    })))
    setPaxTiers(Q_PAX_ALL.filter(t => Math.abs(t - paxRef) <= 20).slice(0, 6))
    setActive(true)
  }, [daysN, paxRef])

  // Recalcul — local instantané puis backend après debounce 400ms
  const recalc = useCallback((d: QDay[], v: QVar[], m: number, t: number[]) => {
    setGrid(qCalcLocal(d, v, m, t))
    setSource('local')
    clearTimeout(debRef.current)
    debRef.current = setTimeout(async () => {
      setLoading(true)
      const res = await qCallSimulate(d, v, m, t)
      setLoading(false)
      if (res) { setGrid(res); setSource('backend') }
    }, 400)
  }, [])

  useEffect(() => {
    if (active && days.length > 0) recalc(days, vars, margin, paxTiers)
  }, [days, vars, margin, paxTiers, active, recalc])

  // Helpers
  const updateDay = (id: string, f: keyof QDay, val: any) =>
    setDays(p => p.map(d => d.id === id ? { ...d, [f]: val } : d))
  const updateVar = (id: string, f: keyof QVar, val: any) =>
    setVars(p => p.map(v => v.id === id ? { ...v, [f]: val } : v))
  const toggleTier = (t: number) =>
    setPaxTiers(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t].sort((a, b) => a - b))
  const fmt = (n: number) => Math.round(n).toLocaleString('fr-FR')

  const fixedPP    = days.reduce((s, d) => s + qDayCost(d), 0)
  const varTotal   = vars.reduce((s, v) => s + v.total, 0)
  const singleSupp = days.reduce((s, d) => s + d.ss, 0)
  const refRow     = grid.find(r => r.pax === paxRef) || grid[Math.floor(grid.length / 2)]

  // ─── EMPTY STATE ───────────────────────────────────────────────────────────
  if (!active) {
    return (
      <div className="space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 p-12 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-cream tracking-tighter mb-2">Moteur de Cotation</h2>
              <p className="text-slate-400 text-sm font-medium">Calcul déterministe des coûts et marges · règle MIN pax appliquée.</p>
            </div>
            <Link to="/travel-designer"
              className="px-6 py-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-rihla transition-all flex items-center gap-2">
              Travel Designer <ExternalLink size={13} />
            </Link>
          </div>

          {/* Si une cotation backend existe déjà, l'afficher en lecture seule */}
          {quotation?.id && (
            <div className="grid grid-cols-3 gap-6 mb-10">
              <QKpi
                label="Net Achat / PAX"
                value={`${quotation.price_per_pax?.toLocaleString() ?? '—'} MAD`}
                sub="Coût réel enregistré"
                accent="bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-800 dark:text-cream"
              />
              <QKpi
                label="Vente / PAX"
                value={`${Math.round((quotation.total_selling ?? 0) / (project.pax_count || 1)).toLocaleString()} MAD`}
                sub={`Base ${project.pax_count || 20} pax`}
                accent="bg-rihla/5 border-rihla/10 text-rihla"
              />
              <QKpi
                label="Total Dossier"
                value={`${quotation.total_selling?.toLocaleString() ?? '—'} MAD`}
                sub="Prix de vente groupe"
                accent="bg-emerald-500/10 border-emerald-500/20 text-emerald-700"
              />
            </div>
          )}

          {quotation?.id && <AIPricingInsight projectId={project.id} />}

          {/* CTA — Lancer le chiffrage interactif */}
          <div className="text-center py-16 bg-slate-50 dark:bg-white/5 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-white/10 mt-8">
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Calculator size={36} className="text-rihla" />
            </div>
            <h4 className="text-xl font-black text-slate-800 dark:text-cream mb-2">
              {quotation?.id ? 'Recalculer avec le moteur interactif' : 'Démarrer le Chiffrage Interactif'}
            </h4>
            <p className="text-slate-400 text-sm mb-2 max-w-sm mx-auto">
              Saisissez les coûts jour par jour — la grille PAX se calcule en temps réel.
            </p>
            <p className="text-slate-300 dark:text-slate-600 text-xs mb-8 font-mono">
              {daysN} jours · {paxRef} PAX de référence
            </p>
            <button
              onClick={startChiffrage}
              className="px-10 py-4 bg-rihla text-white text-[11px] font-black uppercase rounded-2xl shadow-xl shadow-rihla/20 hover:scale-105 transition-all"
            >
              <Calculator size={16} className="inline mr-2" /> Lancer le Chiffrage
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── ACTIVE STATE — Éditeur + grille live ──────────────────────────────────
  return (
    <div className="space-y-5">

      {/* KPI bar */}
      <div className="grid grid-cols-4 gap-4">
        <QKpi
          label="Fixes / PAX"
          value={`${fmt(fixedPP)} MAD`}
          sub="Hôtels + repas + entrées"
          accent="bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-800 dark:text-cream shadow-sm"
        />
        <QKpi
          label={`Coût @ ${paxRef} pax`}
          value={refRow ? `${fmt(refRow.cost)} MAD` : '…'}
          sub={`Variables ÷ ${paxRef}`}
          accent="bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-800 dark:text-cream shadow-sm"
        />
        <QKpi
          label={`Vente @ ${paxRef} pax`}
          value={refRow ? `${fmt(refRow.sell)} MAD` : '…'}
          sub={`Marge ${margin}%`}
          accent="bg-rihla/5 border-rihla/20 text-rihla"
        />
        <QKpi
          label="Total Groupe"
          value={refRow ? `${fmt(refRow.sell * paxRef)} MAD` : '…'}
          sub={loading ? '⟳ Sync backend…' : source === 'backend' ? '✓ Moteur backend' : '≈ Calcul local'}
          accent={clsx(
            'border',
            loading ? 'bg-amber-50 border-amber-100 text-amber-700 animate-pulse' :
            source === 'backend' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
            'bg-slate-50 border-slate-200 text-slate-500',
          )}
        />
      </div>

      <div className="grid grid-cols-12 gap-5">

        {/* ── Éditeur jours + variables (col gauche) ── */}
        <div className="col-span-7 space-y-3">

          {/* En-tête jours */}
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Calculator size={11} /> Coûts Journaliers — {days.length} nuit{days.length > 1 ? 's' : ''}
            </h3>
            <button
              onClick={() => setDays(p => [...p, {
                id: `d${Date.now()}`, day: p.length + 1, hotel: '',
                formula: 'HB', halfDbl: 400, ss: 250, taxe: 20, water: 30,
                rest: 0, monu: 0, lg: 0,
              }])}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-rihla border border-rihla/20 rounded-xl hover:bg-rihla/5 transition-colors"
            >
              <Plus size={11} /> Ajouter un jour
            </button>
          </div>

          {/* Cards jours */}
          {days.map(d => (
            <div key={d.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-4">
              {/* Row 1 : numéro + hôtel + formule + delete */}
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-xl bg-slate-900 text-white text-[11px] font-black flex items-center justify-center flex-shrink-0">
                  {d.day}
                </span>
                <input
                  value={d.hotel}
                  onChange={e => updateDay(d.id, 'hotel', e.target.value)}
                  placeholder="Nom de l'hôtel…"
                  className="flex-1 text-sm font-medium bg-slate-50 dark:bg-white/5 rounded-xl px-3 py-1.5 border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rihla/20 text-slate-800 dark:text-cream"
                />
                <select
                  value={d.formula}
                  onChange={e => updateDay(d.id, 'formula', e.target.value)}
                  className="text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 rounded-xl px-2 py-1.5 focus:outline-none"
                >
                  {(['BB', 'HB', 'FB', '—'] as const).map(f => <option key={f}>{f}</option>)}
                </select>
                <button
                  onClick={() => setDays(p => p.filter(x => x.id !== d.id))}
                  className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Row 2 : champs numériques */}
              <div className="grid grid-cols-6 gap-2">
                {([
                  { key: 'halfDbl', label: '½ Dbl', emoji: '🏨' },
                  { key: 'ss',      label: 'Suppl.S', emoji: '👤' },
                  { key: 'taxe',    label: 'Taxe',   emoji: '🏷' },
                  { key: 'water',   label: 'Eau',    emoji: '💧' },
                  { key: 'rest',    label: 'Resto',  emoji: '🍽' },
                  { key: 'monu',    label: 'Entrées', emoji: '🏛' },
                ] as { key: keyof QDay; label: string; emoji: string }[]).map(({ key, label, emoji }) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 font-bold uppercase text-center">
                      {emoji} {label}
                    </label>
                    <input
                      type="number" min="0" step="10"
                      value={(d as any)[key] as number}
                      onChange={e => updateDay(d.id, key, +e.target.value)}
                      className="w-full text-[11px] font-mono bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-700 rounded-lg px-1 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-rihla/20 text-slate-700 dark:text-cream"
                    />
                  </div>
                ))}
              </div>

              {/* Row 3 : sous-total jour */}
              <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-50 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase font-bold">Sous-total jour {d.day}</span>
                <span className="text-[11px] font-black text-slate-700 dark:text-cream tabular-nums">{fmt(qDayCost(d))} MAD/pax</span>
              </div>
            </div>
          ))}

          {/* Coûts variables */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              Coûts Variables — Total Groupe (partagés entre PAX)
            </h4>
            <div className="space-y-2">
              {vars.map(v => (
                <div key={v.id} className="flex items-center gap-3">
                  <input
                    value={v.label}
                    onChange={e => updateVar(v.id, 'label', e.target.value)}
                    className="flex-1 text-sm bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rihla/20 text-slate-700 dark:text-cream"
                  />
                  <div className="flex items-center gap-1 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-700 rounded-xl px-3 py-1.5">
                    <input
                      type="number" min="0" step="500"
                      value={v.total}
                      onChange={e => updateVar(v.id, 'total', +e.target.value)}
                      className="w-24 text-sm font-mono text-right bg-transparent focus:outline-none text-slate-700 dark:text-cream"
                    />
                    <span className="text-[10px] text-slate-400 font-bold">MAD</span>
                  </div>
                  <button
                    onClick={() => setVars(p => p.filter(x => x.id !== v.id))}
                    className="text-slate-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50 dark:border-slate-800">
              <button
                onClick={() => setVars(p => [...p, { id: `v${Date.now()}`, key: 'misc', label: 'Nouveau poste', total: 0, type: 'misc' }])}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-rihla border border-rihla/20 rounded-xl hover:bg-rihla/5"
              >
                <Plus size={11} /> Ajouter un poste
              </button>
              <span className="text-[10px] font-black text-slate-500">
                Total variables : <span className="text-slate-800 dark:text-cream">{fmt(varTotal)} MAD</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Colonne droite : contrôles + grille ── */}
        <div className="col-span-5 space-y-4">

          {/* Paramètres de simulation */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sliders size={11} /> Paramètres
              </h4>
              {loading && <Loader2 size={12} className="animate-spin text-rihla" />}
            </div>

            {/* Slider marge */}
            <div>
              <div className="flex justify-between text-[10px] font-bold mb-1.5">
                <span className="text-slate-500">Marge commerciale</span>
                <span className="text-amber-600 font-black">{margin}%</span>
              </div>
              <input
                type="range" min="0" max="40" step="0.5" value={margin}
                onChange={e => setMargin(+e.target.value)}
                className="w-full h-2 rounded-lg cursor-pointer"
                style={{ accentColor: '#F59E0B' }}
              />
              <div className="flex justify-between text-[9px] text-slate-300 mt-0.5">
                <span>0%</span><span>Standard 15%</span><span>40%</span>
              </div>
            </div>

            {/* Toggle PAX tiers */}
            <div>
              <p className="text-[10px] font-bold text-slate-500 mb-2">Tranches PAX actives</p>
              <div className="flex flex-wrap gap-1.5">
                {Q_PAX_ALL.map(t => (
                  <button
                    key={t}
                    onClick={() => toggleTier(t)}
                    className={clsx(
                      'w-9 h-9 rounded-xl text-[11px] font-black transition-all',
                      paxTiers.includes(t)
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:bg-slate-200',
                      t === paxRef && paxTiers.includes(t) && 'ring-2 ring-rihla ring-offset-1',
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Mini summary */}
            <div className="pt-2 border-t border-slate-50 dark:border-slate-800 space-y-1 text-[10px]">
              {[
                { label: 'Fixes / pax', value: fmt(fixedPP) + ' MAD' },
                { label: 'Variables (groupe)', value: fmt(varTotal) + ' MAD' },
                { label: 'Suppl. Single', value: fmt(singleSupp) + ' MAD' },
              ].map(r => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-slate-400">{r.label}</span>
                  <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grille tarifaire live */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
              <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <BarChart2 size={12} /> Grille Tarifaire Multi-PAX
              </span>
              <span className={clsx(
                'text-[9px] font-bold px-2 py-0.5 rounded-full transition-all',
                loading ? 'bg-amber-500/20 text-amber-300 animate-pulse' :
                source === 'backend' ? 'bg-emerald-500/20 text-emerald-400' :
                'bg-slate-700 text-slate-400',
              )}>
                {loading ? '⟳ Calcul…' : source === 'backend' ? '✓ Backend' : '≈ Local'}
              </span>
            </div>

            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  <th className="px-3 py-2 text-left text-[9px] font-black uppercase text-slate-400">PAX</th>
                  <th className="px-3 py-2 text-right text-[9px] font-black uppercase text-slate-400">Coût/pax</th>
                  <th className="px-3 py-2 text-right text-[9px] font-black uppercase text-rihla">Vente/pax</th>
                  <th className="px-3 py-2 text-right text-[9px] font-black uppercase text-slate-400">Groupe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                {grid.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-8 text-center text-slate-300 text-xs">
                      Saisissez les coûts pour calculer…
                    </td>
                  </tr>
                ) : grid.map(row => (
                  <tr
                    key={row.pax}
                    className={clsx(
                      'hover:bg-slate-50 dark:hover:bg-white/5 transition-colors',
                      row.pax === paxRef && 'bg-rihla/5',
                    )}
                  >
                    <td className="px-3 py-2.5">
                      <span className={clsx('font-black', row.pax === paxRef ? 'text-rihla' : 'text-slate-700 dark:text-cream')}>
                        {row.pax}
                      </span>
                      {row.pax === paxRef && (
                        <span className="ml-1 text-[8px] text-rihla font-black uppercase">Réf</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right text-slate-400 tabular-nums font-mono">{fmt(row.cost)}</td>
                    <td className="px-3 py-2.5 text-right font-black text-slate-800 dark:text-cream tabular-nums">{fmt(row.sell)}</td>
                    <td className="px-3 py-2.5 text-right text-slate-400 tabular-nums font-mono text-[10px]">{fmt(row.sell * row.pax)}</td>
                  </tr>
                ))}
              </tbody>
              {singleSupp > 0 && (
                <tfoot>
                  <tr className="bg-amber-50 dark:bg-amber-900/10 border-t border-amber-100 dark:border-amber-800/20">
                    <td colSpan={3} className="px-3 py-2 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                      + Supplément Single
                    </td>
                    <td className="px-3 py-2 text-right font-black text-amber-700 dark:text-amber-400 tabular-nums text-[10px]">
                      {fmt(singleSupp)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Lien vers Travel Designer complet */}
          <Link
            to="/travel-designer"
            className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-rihla/20 text-[10px] font-black text-rihla uppercase tracking-widest hover:bg-rihla/5 transition-all"
          >
            <ExternalLink size={11} /> Ouvrir dans Travel Designer
          </Link>

          {/* Insight IA si actif */}
          <AIPricingInsight projectId={project.id} />
        </div>
      </div>
    </div>
  )
}

// ————————————————————————————————————————————————————————————————————————————
// ITINERARY TAB
// ————————————————————————————————————————————————————————————————————————————
function ItineraryTab({ project, itinerary }: any) {
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 p-12 shadow-sm">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-cream tracking-tighter mb-2">Programme de Voyage</h2>
            <p className="text-slate-400 text-sm font-medium">Narration de l'expérience client au Maroc.</p>
          </div>
          <div className="flex gap-4">
             <button className="px-6 py-3 bg-emerald-500/10 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={14} /> Régénérer par IA
             </button>
             <Link to="/itineraries" className="px-6 py-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                Éditeur Narratif <ExternalLink size={14} className="inline ml-2" />
             </Link>
          </div>
        </div>

        {/* STRATEGIC ITINERARY MAP */}
        <div className="mb-12">
          <ItineraryMap days={itinerary?.days || []} />
        </div>

        {itinerary?.days?.length > 0 ? (
          <div className="space-y-6">
            {itinerary.days.map((day: any) => (
              <div key={day.id || day.day_number} className="group bg-white dark:bg-slate-950/50 rounded-[32px] border border-slate-100 dark:border-white/5 p-8 flex items-start gap-8 hover:shadow-xl transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Edit3 size={18} className="text-slate-300 hover:text-rihla cursor-pointer" />
                </div>
                
                {/* Day Marker */}
                <div className="w-16 h-16 rounded-[24px] bg-slate-900 text-white flex items-center justify-center shrink-0 font-serif text-2xl font-bold shadow-2xl">
                  {day.day_number}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-2">
                   <div className="flex items-center gap-4 mb-3">
                     <h4 className="text-xl font-black text-slate-900 dark:text-cream tracking-tight truncate">{day.title}</h4>
                     {day.ai_generated && (
                       <span className="px-3 py-1 bg-rihla/10 text-rihla text-[9px] font-black uppercase tracking-widest rounded-lg">IA Genius</span>
                     )}
                   </div>
                   <div className="flex items-center gap-6 text-[11px] font-bold text-slate-400 italic mb-6">
                      <span className="flex items-center gap-2"><MapPin size={14} className="text-rihla" /> {day.city}</span>
                      <span className="flex items-center gap-2"><Building2 size={14} className="text-amber-500" /> {day.hotel || 'Hébergement non défini'}</span>
                   </div>
                   <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                     {day.description || 'Cliquez pour rédiger l’expérience de cette journée...'}
                   </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-[40px]">
            <MapPin size={64} className="mx-auto mb-6 text-slate-200" />
            <h4 className="text-xl font-black text-slate-800 dark:text-cream mb-6">Itinéraire Vierge</h4>
            <button className="px-10 py-4 bg-slate-900 text-white text-[11px] font-black uppercase rounded-2xl shadow-xl shadow-black/20">
              Générer Premier Jet (IA)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ————————————————————————————————————————————————————————————————————————————
// INVOICE TAB
// ————————————————————————————————————————————————————————————————————————————
function InvoiceTab({ project, invoices }: any) {
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 p-12 shadow-sm">
        <div className="flex items-center justify-between mb-12">
          <div>
             <h2 className="text-3xl font-black text-slate-900 dark:text-cream tracking-tighter mb-2">Comptabilité & Encaissements</h2>
             <p className="text-slate-400 text-sm font-medium">Historique des facturations et état des paiements.</p>
          </div>
          <button className="px-8 py-4 bg-amber-500 text-white text-[11px] font-black uppercase rounded-2xl shadow-xl shadow-amber-500/20">
             Nouvelle Facture
          </button>
        </div>

        {invoices?.length > 0 ? (
          <div className="grid grid-cols-2 gap-6">
             {invoices.map((inv: any) => (
                <div key={inv.id} className="bg-slate-50 dark:bg-white/5 rounded-[32px] p-8 border border-slate-100 dark:border-white/5 flex items-center justify-between group hover:shadow-xl transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-amber-500 shadow-sm group-hover:scale-110 transition-transform">
                         <Receipt size={28} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{inv.invoice_number}</p>
                         <p className="text-lg font-black text-slate-900 dark:text-cream tracking-tighter">
                            {inv.total_ttc?.toLocaleString()} MAD
                         </p>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase rounded-lg">Payée</span>
                      <p className="text-[10px] font-bold text-slate-400 mt-2 italic">Le 12/04/26</p>
                   </div>
                </div>
             ))}
          </div>
        ) : (
          <div className="text-center py-20">
             <Receipt size={64} className="mx-auto mb-6 text-slate-200" />
             <p className="text-slate-400 text-sm font-medium">Aucun flux financier dÃ©tectÃ© sur ce dossier.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// EXPORTS TAB
// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function ExportsTab({ project }: any) {
  const formats = [
    { ext: 'PDF Premium',  icon: FileText,  color: 'bg-rihla text-white',      desc: 'Proposition Client Haute Définition' },
    { ext: 'Word Editable', icon: FileText,  color: 'bg-blue-600 text-white',   desc: 'Version modifiable pour correction' },
    { ext: 'PowerPoint',   icon: BarChart2, color: 'bg-amber-600 text-white',  desc: 'Présentation pour écran géant' },
    { ext: 'Excel Budget', icon: BarChart2, color: 'bg-emerald-600 text-white', desc: 'Détail analytique des coûts' },
  ]

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 p-12 shadow-sm">
       <h2 className="text-3xl font-black text-slate-900 dark:text-cream tracking-tighter mb-4">Exportation & Brand Content</h2>
       <p className="text-slate-400 text-sm font-medium mb-12">GÃ©nÃ©rez vos documents officiels aux couleurs de S'TOURS.</p>

       <div className="grid grid-cols-2 gap-8">
          {formats.map(f => {
            const Icon = f.icon
            return (
              <button key={f.ext} className="flex items-center gap-6 p-8 rounded-[40px] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:shadow-2xl transition-all group text-left">
                 <div className={clsx("w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform", f.color)}>
                    <Icon size={32} />
                 </div>
                 <div className="flex-1">
                    <p className="text-xl font-black text-slate-900 dark:text-cream tracking-tighter mb-1">{f.ext}</p>
                    <p className="text-xs font-medium text-slate-400">{f.desc}</p>
                 </div>
                 <Download size={20} className="text-slate-200 group-hover:text-rihla transition-colors" />
              </button>
            )
          })}
       </div>
    </div>
  )
}

// ── AUDIT TAB ──────────────────────────────────────────────────────────
function AuditTab({ projectId }: { projectId: string }) {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['project-audit', projectId],
    queryFn: () => projectsApi.getAudit(projectId).then(r => r.data),
  })

  if (isLoading) return <div className="p-20 text-center animate-pulse">Chargement de l'historique...</div>

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 p-12 shadow-sm">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
          <Shield size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-cream tracking-tighter">Historique des Modifications</h2>
          <p className="text-slate-400 text-sm font-medium italic">Audit trail complet pour la conformité et le suivi des dossiers.</p>
        </div>
      </div>

      <div className="space-y-4">
        {logs?.map((log: any) => (
          <div key={log.id} className="p-6 rounded-[32px] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-start gap-6 hover:shadow-lg transition-all">
             <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-rihla shadow-sm">
               <History size={18} />
             </div>
             <div className="flex-1">
               <div className="flex justify-between items-start mb-2">
                 <h4 className="font-black text-slate-900 dark:text-cream text-sm uppercase tracking-tight">
                   {log.action} · {log.entity_type}
                 </h4>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                   {new Date(log.created_at).toLocaleString('fr-FR')}
                 </span>
               </div>
               <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                 {log.description || `Action effectuée sur ${log.entity_type} (${log.entity_id})`}
               </p>
               {log.changes && (
                 <div className="bg-white dark:bg-black/20 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
                   <div className="grid grid-cols-2 gap-4">
                     {Object.entries(log.changes).map(([field, val]: [string, any]) => (
                       <div key={field} className="text-[10px]">
                         <p className="font-black text-slate-400 uppercase tracking-tighter mb-1">{field}</p>
                         <div className="flex items-center gap-2">
                           <span className="text-rose-500 line-through opacity-50">{JSON.stringify(val.before)}</span>
                           <ChevronRight size={10} className="text-slate-300" />
                           <span className="text-emerald-500 font-bold">{JSON.stringify(val.after)}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
               <div className="mt-4 flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                 <span>IP: {log.ip_address || '—'}</span>
                 <span>ID Utilisateur: {log.user_id || 'Système'}</span>
               </div>
             </div>
          </div>
        ))}
        {(!logs || logs.length === 0) && (
          <div className="text-center py-20 opacity-30">
            <Shield size={64} className="mx-auto mb-4" />
            <p className="text-xs font-black uppercase tracking-widest">Aucun log d'audit pour ce dossier.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── AI PRICING INSIGHT ──────────────────────────────────────────────────
function AIPricingInsight({ projectId }: { projectId: string }) {
  const { data: insight, isLoading } = useQuery({
    queryKey: ['predictive-pricing', projectId],
    queryFn: () => aiApi.getPredictivePricing(projectId).then(r => r.data),
  })

  if (isLoading) return <div className="h-40 bg-slate-50 dark:bg-white/5 rounded-[40px] animate-pulse mb-8" />
  if (!insight || insight.error) return null

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group mb-12">
      <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
        <Sparkles size={100} />
      </div>
      
      <div className="flex items-start gap-8 relative z-10">
        <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shrink-0">
          <TrendingUp size={40} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-white/20 px-3 py-1 rounded-full">S'TOURS Genius</span>
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Confiance: {Math.round(insight.confidence_score * 100)}%</span>
          </div>
          <h4 className="text-3xl font-black tracking-tighter mb-4">Stratégie de Marge Optimale</h4>
          <p className="text-indigo-100 font-medium leading-relaxed mb-8 max-w-2xl">
            {insight.market_insight}
          </p>
          
          <div className="flex items-center gap-12">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Marge Suggérée</p>
              <p className="text-4xl font-black text-white">{insight.optimal_margin_pct}%</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Ajustement Marché</p>
              <p className="text-4xl font-black text-emerald-400">+{insight.suggested_price_adjustment}%</p>
            </div>
            <button className="ml-auto px-8 py-4 bg-white text-indigo-900 text-[11px] font-black uppercase rounded-2xl shadow-xl hover:scale-105 transition-all">
              Appliquer la Stratégie
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
