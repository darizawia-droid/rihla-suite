import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Plus, TrendingUp, FolderKanban,
  ArrowRight, Receipt,
  Activity, Gem, AlertCircle, ChevronRight, Sparkles,
} from 'lucide-react'
import { projectsApi, invoicesApi, dashboardApi } from '@/lib/api'
import { StatusPill, Spinner, StatCard } from '@/components/ui'
import { useAuthStore } from '@/stores/authStore'
import { format, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { clsx } from 'clsx'
import { InteractiveMoroccoMap } from '@/components/maps/InteractiveMoroccoMap'
import { GroupItineraryMap } from '@/components/maps/GroupItineraryMap'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from 'recharts'

export function DashboardPage() {
  const { user } = useAuthStore()

  // Fetch up to 100 projects (backend cap) for KPIs + sparklines + activity feed
  const { data: projectsAll, isLoading } = useQuery({
    queryKey: ['projects', 'dashboard-all'],
    queryFn: () => projectsApi.list({ limit: 100 }).then(r => r.data?.items ?? []),
    staleTime: 30_000,
  })
  const projects = projectsAll as any[] | undefined

  const { data: kpis } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: () => dashboardApi.kpis().then(r => r.data),
    staleTime: 60_000,
  })

  const { data: invoices } = useQuery({
    queryKey: ['invoices', 'dashboard'],
    queryFn: () => invoicesApi.list({ limit: 100 }).then(r => r.data).catch(() => []),
    staleTime: 30_000,
  })

  // Real KPI values from backend
  const total       = kpis?.total_projects ?? projects?.length ?? 0
  const inProgress  = kpis?.active_projects ?? 0
  const recentCount = kpis?.recent_projects_30d ?? 0

  // Real invoice totals
  const paidInvoices    = (invoices as any[])?.filter((i: any) => i.status === 'paid') ?? []
  const pendingInvoices = (invoices as any[])?.filter((i: any) => i.status === 'sent' || i.status === 'overdue') ?? []
  const paidTotal       = paidInvoices.reduce((s: number, i: any) => s + (i.total_amount ?? 0), 0)
  const pendingTotal    = pendingInvoices.reduce((s: number, i: any) => s + (i.total_amount ?? 0), 0)
  const grandTotal      = paidTotal + pendingTotal

  // ── Sparklines: aggregate daily activity over the last 14 days ─────────
  const today0 = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const projectsCreatedSpark = useMemo(() => {
    const buckets = Array(14).fill(0)
    for (const p of projects ?? []) {
      const d = new Date(p.created_at)
      d.setHours(0, 0, 0, 0)
      const diff = Math.floor((today0.getTime() - d.getTime()) / 86400000)
      if (diff >= 0 && diff < 14) buckets[13 - diff] += 1
    }
    return buckets
  }, [projects, today0])

  const projectsUpdatedSpark = useMemo(() => {
    const buckets = Array(14).fill(0)
    for (const p of projects ?? []) {
      const d = new Date(p.updated_at)
      d.setHours(0, 0, 0, 0)
      const diff = Math.floor((today0.getTime() - d.getTime()) / 86400000)
      if (diff >= 0 && diff < 14) buckets[13 - diff] += 1
    }
    return buckets
  }, [projects, today0])

  const invoicesPaidSpark = useMemo(() => {
    const buckets = Array(14).fill(0)
    for (const i of paidInvoices) {
      if (!i.issue_date && !i.created_at) continue
      const d = new Date(i.issue_date ?? i.created_at)
      d.setHours(0, 0, 0, 0)
      const diff = Math.floor((today0.getTime() - d.getTime()) / 86400000)
      if (diff >= 0 && diff < 14) buckets[13 - diff] += i.total_amount ?? 0
    }
    return buckets
  }, [paidInvoices, today0])

  const invoicesPendingSpark = useMemo(() => {
    const buckets = Array(14).fill(0)
    for (const i of pendingInvoices) {
      if (!i.issue_date && !i.created_at) continue
      const d = new Date(i.issue_date ?? i.created_at)
      d.setHours(0, 0, 0, 0)
      const diff = Math.floor((today0.getTime() - d.getTime()) / 86400000)
      if (diff >= 0 && diff < 14) buckets[13 - diff] += i.total_amount ?? 0
    }
    return buckets
  }, [pendingInvoices, today0])

  // ── CHARTS DATA (demo) ──────────────────────────────────────────────
  const monthlyRevenue = useMemo(() => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    const base = [320, 280, 410, 520, 680, 790, 850, 620, 730, 880, 950, 1020]
    return months.map((m, i) => ({ name: m, ca: base[i], objectif: 700 }))
  }, [])

  const destinationsData = useMemo(() => [
    { name: 'Marrakech', value: 34, color: '#b43e20' },
    { name: 'Fès', value: 22, color: '#d97706' },
    { name: 'Chefchaouen', value: 15, color: '#059669' },
    { name: 'Sahara', value: 18, color: '#7c3aed' },
    { name: 'Essaouira', value: 11, color: '#0ea5e9' },
  ], [])

  const conversionFunnel = useMemo(() => [
    { name: 'Leads', value: 248, fill: '#94a3b8' },
    { name: 'Devis envoyés', value: 142, fill: '#d97706' },
    { name: 'Confirmés', value: 87, fill: '#059669' },
    { name: 'Facturés', value: 64, fill: '#b43e20' },
  ], [])

  // Recently updated projects (sorted) for activity feed
  const recentlyUpdated = useMemo(() => {
    return [...(projects ?? [])]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5)
  }, [projects])
  
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'
  const firstName = user?.full_name?.split(' ')[0] ?? 'Chakir'
  const today = format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })
  const [viewMode, setViewMode] = useState<'list' | 'gantt'>('list')

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 transition-colors pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-white/5 px-8 py-6">
        <div className="max-w-[1600px] mx-auto flex justify-between items-end gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-[11px] text-slate-500 capitalize">{today}</span>
            </div>
            <h1 className="text-[24px] font-semibold text-slate-900 dark:text-cream tracking-tight">
              {greeting}, {firstName}
            </h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              Voici un aperçu de votre activité aujourd'hui.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 h-9 px-3 text-[13px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-md transition-colors dark:bg-white/5 dark:border-white/10 dark:text-cream dark:hover:bg-white/10">
              <Activity size={14} strokeWidth={2} />
              Market Watch
            </button>
            <Link
              to="/projects/new"
              className="inline-flex items-center gap-1.5 h-9 px-3.5 text-[13px] font-medium text-white bg-rihla hover:bg-rihla-dark rounded-md transition-colors"
            >
              <Plus size={14} strokeWidth={2.25} />
              Nouveau dossier
            </Link>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6 max-w-[1600px] mx-auto">

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Projets total"
            value={total}
            sub={`${inProgress} actifs`}
            icon={FolderKanban}
            sparkline={projectsUpdatedSpark}
            sparklineColor="rgb(180, 62, 32)"
          />
          <StatCard
            label="Nouveaux (30j)"
            value={recentCount}
            sub="créés ce mois-ci"
            icon={TrendingUp}
            sparkline={projectsCreatedSpark}
            sparklineColor="rgb(16, 185, 129)"
          />
          <StatCard
            label="Facturé"
            value={paidTotal > 0 ? `${(paidTotal/1000).toFixed(0)}k MAD` : '0 MAD'}
            sub={`${paidInvoices.length} facture${paidInvoices.length > 1 ? 's' : ''} payée${paidInvoices.length > 1 ? 's' : ''}`}
            icon={Receipt}
            sparkline={invoicesPaidSpark}
            sparklineColor="rgb(16, 185, 129)"
          />
          <StatCard
            label="En attente"
            value={pendingTotal > 0 ? `${(pendingTotal/1000).toFixed(0)}k MAD` : '0 MAD'}
            sub={`${pendingInvoices.length} facture${pendingInvoices.length > 1 ? 's' : ''} à encaisser`}
            icon={Activity}
            sparkline={invoicesPendingSpark}
            sparklineColor="rgb(245, 158, 11)"
          />
        </div>

        {/* ── INTERACTIVE CHARTS ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* CA Mensuel — Area Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-slate-900 dark:text-cream flex items-center gap-2">
                <TrendingUp size={15} className="text-rihla" />
                Chiffre d'Affaires Mensuel (k MAD)
              </h3>
              <span className="text-[11px] text-emerald-600 font-medium">+18% vs N-1</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="colorCa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b43e20" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#b43e20" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Area type="monotone" dataKey="objectif" stroke="#94a3b8" strokeDasharray="5 5" fillOpacity={0} strokeWidth={1.5} name="Objectif" />
                <Area type="monotone" dataKey="ca" stroke="#b43e20" fill="url(#colorCa)" strokeWidth={2} name="CA Réalisé" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Destinations — Pie Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-white/5 p-5">
            <h3 className="text-[14px] font-semibold text-slate-900 dark:text-cream mb-4">
              Destinations Populaires
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={destinationsData} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {destinationsData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-slate-900 dark:text-cream flex items-center gap-2">
              <FolderKanban size={15} className="text-slate-400" />
              Funnel de Conversion
            </h3>
            <span className="text-[11px] text-slate-500">Taux global : {Math.round(64/248*100)}%</span>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={conversionFunnel} layout="vertical" barCategoryGap={8}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={110} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                {conversionFunnel.map((d, i) => (
                  <Cell key={i} fill={d.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── IMMERSIVE MAP CENTERPIECE ──────────────────────────── */}
        <div className="stagger-5">
          <InteractiveMoroccoMap />
        </div>

        {/* ── GROUP ITINERARIES — animated routes, day timeline ─── */}
        <div className="stagger-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Itinéraires des groupes</h2>
              <p className="text-[12px] text-slate-500">
                Suivez chaque groupe jour par jour — lancez l'animation, sautez à un jour, comparez les routes.
              </p>
            </div>
          </div>
          <GroupItineraryMap />
        </div>

        <div className="grid grid-cols-12 gap-4">

          {/* MAIN COLUMN — PROJECTS & ACTIVITY (8 cols) */}
          <div className="col-span-12 lg:col-span-8 space-y-4">

            {/* RECENT PROJECTS & GANTT TOGGLE */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-white/5 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <h3 className="text-[14px] font-semibold text-slate-900 dark:text-cream flex items-center gap-2">
                    <FolderKanban size={15} className="text-slate-400" strokeWidth={2} />
                    Opérations
                  </h3>
                  <div className="flex bg-slate-100 dark:bg-white/5 p-0.5 rounded-md">
                    <button 
                      onClick={() => setViewMode('list')}
                      className={clsx("px-2 py-1 text-[10px] font-bold uppercase rounded transition-all", viewMode === 'list' ? "bg-white dark:bg-slate-800 text-rihla shadow-sm" : "text-slate-500 hover:text-slate-700")}
                    >Liste</button>
                    <button 
                      onClick={() => setViewMode('gantt')}
                      className={clsx("px-2 py-1 text-[10px] font-bold uppercase rounded transition-all", viewMode === 'gantt' ? "bg-white dark:bg-slate-800 text-rihla shadow-sm" : "text-slate-500 hover:text-slate-700")}
                    >Gantt</button>
                  </div>
                </div>
                <Link to="/projects" className="text-[12px] text-rihla hover:underline font-medium flex items-center gap-0.5">
                  Voir tout <ChevronRight size={13} />
                </Link>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-16"><Spinner size={24} /></div>
              ) : (projects?.length ?? 0) === 0 ? (
                <div className="py-16 text-center text-[13px] text-slate-400">Aucun projet</div>
              ) : viewMode === 'list' ? (
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                  {recentlyUpdated.map((p: any) => (
                    <Link key={p.id} to={`/projects/${p.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors group">
                      <div className="w-8 h-8 rounded-md bg-rihla/8 flex items-center justify-center text-rihla text-[12px] font-semibold flex-shrink-0">
                        {p.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-slate-900 dark:text-cream truncate">{p.name}</p>
                        <p className="text-[12px] text-slate-500 truncate">{p.client_name}{p.destination && ` · ${p.destination}`}</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <StatusPill status={p.status} />
                        <p className="text-[11px] text-slate-400 mt-1">{formatDistanceToNow(new Date(p.updated_at), { locale: fr, addSuffix: true })}</p>
                      </div>
                      <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </Link>
                  ))}
                </div>
              ) : (
                <OperationsGantt projects={projects ?? []} />
              )}
            </div>

            {/* QUICK ACTIONS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { to: '/forex',                 icon: Activity, label: 'Live Forex',     desc: 'Surveillance devises'      },
                { to: '/operations/concierge',  icon: Gem,      label: 'Conciergerie',   desc: 'Gestion VIP / à la carte'   },
                { to: '/quality',               icon: CheckCircle, label: 'Qualité & NPS', desc: 'Feedback voyageurs'        },
              ].map(action => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/5 rounded-lg hover:border-slate-300 dark:hover:border-white/10 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 flex items-center justify-center mb-3 group-hover:bg-rihla/8 group-hover:text-rihla transition-colors">
                    <action.icon size={15} strokeWidth={1.75} />
                  </div>
                  <h4 className="text-[13px] font-medium text-slate-900 dark:text-cream">{action.label}</h4>
                  <p className="text-[12px] text-slate-500 mt-0.5">{action.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* SIDE COLUMN — FINANCE & STATUS (4 cols) */}
          <div className="col-span-12 lg:col-span-4 space-y-4">

            {/* FINANCE WIDGET */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/5 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-semibold text-slate-900 dark:text-cream flex items-center gap-2">
                  <Receipt size={14} className="text-slate-400" strokeWidth={2} />
                  Facturation
                </h3>
                <Link to="/invoices" className="text-[12px] text-rihla hover:underline">Détail</Link>
              </div>

              <p className="text-[24px] font-semibold tabular-nums text-slate-900 dark:text-cream tracking-tight">
                {grandTotal > 0 ? `${grandTotal.toLocaleString('fr-MA')} MAD` : '—'}
              </p>
              {paidTotal > 0 && grandTotal > 0 ? (
                <p className="text-[12px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp size={12} strokeWidth={2.25} />
                  {Math.round((paidTotal / grandTotal) * 100)}% encaissé
                </p>
              ) : grandTotal === 0 ? (
                <p className="text-[12px] text-slate-400 mt-1">Aucune facture enregistrée</p>
              ) : null}

              {grandTotal > 0 && (
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-[12px] items-center">
                    <span className="text-slate-500">Payées ({paidInvoices.length})</span>
                    <span className="font-medium tabular-nums text-slate-900 dark:text-cream">{paidTotal.toLocaleString('fr-MA')} MAD</span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-500"
                         style={{ width: `${Math.round((paidTotal / grandTotal) * 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-[12px] items-center">
                    <span className="text-slate-500">En attente ({pendingInvoices.length})</span>
                    <span className="font-medium tabular-nums text-slate-900 dark:text-cream">{pendingTotal.toLocaleString('fr-MA')} MAD</span>
                  </div>
                </div>
              )}
            </div>

            {/* MARKET INTELLIGENCE WIDGET */}
            <div className="bg-slate-900 rounded-lg p-5 text-white shadow-xl relative overflow-hidden group border border-white/10">
               <div className="absolute top-0 right-0 w-32 h-32 bg-rihla/10 rounded-full blur-3xl group-hover:bg-rihla/20 transition-all" />
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-black flex items-center gap-2">
                    <Sparkles size={14} className="text-rihla" /> Intelligence IA
                  </h3>
                  <span className="px-2 py-0.5 bg-rihla/20 text-rihla text-[8px] font-black uppercase rounded tracking-widest">Expansion</span>
               </div>
               <div className="space-y-4">
                  <div>
                     <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Marché Porteur du Jour</p>
                     <p className="text-lg font-black text-white">Suisse <span className="text-emerald-400 text-sm ml-1">+14%</span></p>
                  </div>
                  <p className="text-[11px] text-white/60 leading-relaxed italic">
                    "Forte demande détectée sur le segment Luxury MICE. 12 nouveaux prospects qualifiés identifiés."
                  </p>
                  <Link to="/leads" className="w-full py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-md text-[11px] font-bold text-center block transition-all">
                    Lancer la Prospection
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function OperationsGantt({ projects }: { projects: any[] }) {
  const sorted = useMemo(() => {
    return [...projects]
      .filter(p => p.travel_dates)
      .sort((a, b) => new Date(a.travel_dates.split(' - ')[0]).getTime() - new Date(b.travel_dates.split(' - ')[0]).getTime())
      .slice(0, 10)
  }, [projects])

  if (sorted.length === 0) return <div className="py-12 text-center text-slate-400 text-xs italic">Aucun projet avec dates de voyage défini.</div>

  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']

  return (
    <div className="p-5 overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="flex border-b border-slate-100 dark:border-white/5 mb-4">
          <div className="w-48 flex-shrink-0" />
          <div className="flex-1 flex">
            {months.map(m => (
              <div key={m} className="flex-1 text-[10px] font-black text-slate-400 uppercase text-center border-l border-slate-100 dark:border-white/5">{m}</div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {sorted.map((p, i) => {
            const start = new Date(p.travel_dates.split(' - ')[0])
            const startPct = (start.getMonth() * 30 + start.getDate()) / 365 * 100
            const duration = p.duration_days || 7
            const widthPct = (duration / 365) * 100

            return (
              <div key={p.id} className="flex items-center group">
                <Link to={`/projects/${p.id}`} className="w-48 flex-shrink-0 text-[12px] font-bold text-slate-700 dark:text-slate-300 truncate hover:text-rihla transition-colors">
                  {p.name}
                </Link>
                <div className="flex-1 h-6 relative bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={clsx(
                      "absolute h-full rounded-full shadow-sm flex items-center px-2 text-[8px] font-black text-white uppercase overflow-hidden whitespace-nowrap",
                      i % 4 === 0 ? "bg-rihla" : i % 4 === 1 ? "bg-blue-600" : i % 4 === 2 ? "bg-emerald-600" : "bg-amber-500"
                    )}
                    style={{ left: `${startPct}%`, width: `${Math.max(5, widthPct)}%` }}
                  >
                    {p.duration_days}j
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function CheckCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
