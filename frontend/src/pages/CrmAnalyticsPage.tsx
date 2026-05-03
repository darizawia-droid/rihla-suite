import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3, TrendingUp, Users, DollarSign, Globe2,
  ChevronRight, ArrowUpRight, ArrowDownRight, Calendar,
  Target, Building2, Award, Zap, MapPin, Star,
} from 'lucide-react'
import { clsx } from 'clsx'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line,
} from 'recharts'

// ─── DEMO DATA ────────────────────────────────────────────────────────
const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 420, target: 500, projects: 8 },
  { month: 'Fév', revenue: 380, target: 500, projects: 6 },
  { month: 'Mar', revenue: 550, target: 550, projects: 12 },
  { month: 'Avr', revenue: 680, target: 600, projects: 14 },
  { month: 'Mai', revenue: 920, target: 650, projects: 18 },
  { month: 'Jun', revenue: 1100, target: 700, projects: 22 },
  { month: 'Jul', revenue: 1350, target: 800, projects: 28 },
  { month: 'Aoû', revenue: 1200, target: 800, projects: 25 },
  { month: 'Sep', revenue: 980, target: 750, projects: 20 },
  { month: 'Oct', revenue: 1050, target: 750, projects: 21 },
  { month: 'Nov', revenue: 880, target: 700, projects: 16 },
  { month: 'Déc', revenue: 720, target: 650, projects: 12 },
]

const MARKET_DISTRIBUTION = [
  { name: 'France', value: 35, revenue: 2800, color: '#b43e20' },
  { name: 'USA', value: 22, revenue: 3800, color: '#7c3aed' },
  { name: 'UK', value: 15, revenue: 850, color: '#059669' },
  { name: 'UAE', value: 12, revenue: 680, color: '#d97706' },
  { name: 'Suisse', value: 8, revenue: 280, color: '#0ea5e9' },
  { name: 'Autres', value: 8, revenue: 165, color: '#64748b' },
]

const SEGMENT_PERFORMANCE = [
  { segment: 'Luxury TO', clients: 3, revenue: 3980, conversion: 82, avgTicket: 85, growth: '+24%' },
  { segment: 'Luxury Concierge', clients: 2, revenue: 3800, conversion: 93, avgTicket: 136, growth: '+38%' },
  { segment: 'Tour Operator', clients: 3, revenue: 1015, conversion: 38, avgTicket: 49, growth: '+5%' },
  { segment: 'MICE Agency', clients: 1, revenue: 280, conversion: 60, avgTicket: 93, growth: '+15%' },
]

const RADAR_DATA = [
  { metric: 'Volume', value: 78 },
  { metric: 'Conversion', value: 65 },
  { metric: 'Fidélisation', value: 82 },
  { metric: 'Marge', value: 71 },
  { metric: 'Satisfaction', value: 88 },
  { metric: 'Réactivité', value: 74 },
]

const CONVERSION_FUNNEL = [
  { stage: 'Leads Identifiés', value: 248, rate: '100%' },
  { stage: 'Premier Contact', value: 186, rate: '75%' },
  { stage: 'Cotation Envoyée', value: 142, rate: '57%' },
  { stage: 'Négociation', value: 98, rate: '39%' },
  { stage: 'Confirmé', value: 87, rate: '35%' },
  { stage: 'Facturé', value: 64, rate: '26%' },
]

const TOP_CLIENTS = [
  { name: 'Elite Destinations NY', flag: '🇺🇸', revenue: 3800, growth: '+38%', tier: 'Platinum' },
  { name: 'Luxe Voyages International', flag: '🇫🇷', revenue: 2450, growth: '+24%', tier: 'Platinum' },
  { name: 'Atlas Tours UK', flag: '🇬🇧', revenue: 850, growth: '+12%', tier: 'Gold' },
  { name: 'Dubai Exclusive Travels', flag: '🇦🇪', revenue: 680, growth: '+45%', tier: 'Gold' },
  { name: 'Prestige Events Geneva', flag: '🇨🇭', revenue: 280, growth: '+15%', tier: 'Silver' },
]

const SEASONALITY = [
  { month: 'Jan', luxury: 30, adventure: 15, mice: 10, cultural: 25 },
  { month: 'Fév', luxury: 25, adventure: 20, mice: 15, cultural: 30 },
  { month: 'Mar', luxury: 45, adventure: 35, mice: 20, cultural: 40 },
  { month: 'Avr', luxury: 60, adventure: 50, mice: 30, cultural: 55 },
  { month: 'Mai', luxury: 75, adventure: 65, mice: 25, cultural: 60 },
  { month: 'Jun', luxury: 55, adventure: 70, mice: 15, cultural: 45 },
  { month: 'Jul', luxury: 40, adventure: 45, mice: 5, cultural: 30 },
  { month: 'Aoû', luxury: 35, adventure: 40, mice: 5, cultural: 25 },
  { month: 'Sep', luxury: 65, adventure: 55, mice: 35, cultural: 50 },
  { month: 'Oct', luxury: 80, adventure: 60, mice: 40, cultural: 70 },
  { month: 'Nov', luxury: 50, adventure: 30, mice: 25, cultural: 45 },
  { month: 'Déc', luxury: 45, adventure: 20, mice: 20, cultural: 35 },
]

export function CrmAnalyticsPage() {
  const [period, setPeriod] = useState<'ytd' | '12m' | '6m' | '3m'>('ytd')

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 transition-colors pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-6">
        <div className="max-w-[1600px] mx-auto flex justify-between items-end gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              <Link to="/crm" className="hover:text-rihla transition-colors">CRM</Link>
              <ChevronRight size={10} /> Analytique
            </div>
            <h1 className="text-[24px] font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <BarChart3 size={24} className="text-rihla" />
              Analyse Portefeuille Client
            </h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              Performance commerciale, segmentation et tendances
            </p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
            {(['ytd', '12m', '6m', '3m'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={clsx('px-3 py-1.5 text-[11px] font-medium rounded-md transition-all', period === p ? 'bg-white dark:bg-slate-700 text-rihla shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
                {p === 'ytd' ? 'YTD' : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8 max-w-[1600px] mx-auto space-y-6">

        {/* KPI Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: 'CA Total YTD', value: '8.23M', sub: 'MAD', change: '+22%', up: true, icon: DollarSign },
            { label: 'Nouveaux Clients', value: '12', sub: 'ce trimestre', change: '+4', up: true, icon: Users },
            { label: 'Ticket Moyen', value: '82k', sub: 'MAD / projet', change: '+8%', up: true, icon: Target },
            { label: 'Taux Conversion', value: '64%', sub: 'devis → confirmé', change: '+3pts', up: true, icon: TrendingUp },
            { label: 'NPS Moyen', value: '8.6', sub: '/ 10', change: '-0.2', up: false, icon: Star },
          ].map(kpi => (
            <div key={kpi.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-slate-500">{kpi.label}</span>
                <kpi.icon size={14} className="text-rihla" />
              </div>
              <p className="text-[22px] font-bold text-slate-900 dark:text-white tabular-nums">
                {kpi.value} <span className="text-[12px] font-normal text-slate-400">{kpi.sub}</span>
              </p>
              <div className={clsx('flex items-center gap-1 mt-1 text-[11px] font-medium', kpi.up ? 'text-emerald-600' : 'text-red-500')}>
                {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {kpi.change}
              </div>
            </div>
          ))}
        </div>

        {/* Revenue & Funnel Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue Trend */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-[14px] font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp size={15} className="text-rihla" /> Évolution CA Mensuel (k MAD)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={MONTHLY_REVENUE}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b43e20" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#b43e20" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" fillOpacity={0} strokeWidth={1.5} name="Objectif" />
                <Area type="monotone" dataKey="revenue" stroke="#b43e20" fill="url(#colorRev)" strokeWidth={2.5} name="CA Réalisé" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Conversion Funnel */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-[14px] font-bold text-slate-900 dark:text-white mb-4">Entonnoir de Conversion</h3>
            <div className="space-y-2">
              {CONVERSION_FUNNEL.map((stage, i) => {
                const width = (stage.value / CONVERSION_FUNNEL[0].value) * 100
                const colors = ['#64748b', '#3b82f6', '#d97706', '#b43e20', '#059669', '#7c3aed']
                return (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">{stage.stage}</span>
                      <span className="text-[11px] font-bold text-slate-900 dark:text-white tabular-nums">{stage.value} <span className="text-slate-400 font-normal">({stage.rate})</span></span>
                    </div>
                    <div className="w-full h-5 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
                      <div className="h-full rounded-md transition-all duration-500" style={{ width: `${width}%`, backgroundColor: colors[i] }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Markets & Radar Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Market Distribution */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-[14px] font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe2 size={15} className="text-rihla" /> Marchés Source
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={MARKET_DISTRIBUTION} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} label={({ name, value }) => `${name} ${value}%`}>
                  {MARKET_DISTRIBUTION.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Radar */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-[14px] font-bold text-slate-900 dark:text-white mb-4">Performance Globale</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Score" dataKey="value" stroke="#b43e20" fill="#b43e20" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Seasonality */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-[14px] font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar size={15} className="text-rihla" /> Saisonnalité
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={SEASONALITY}>
                <XAxis dataKey="month" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Line type="monotone" dataKey="luxury" stroke="#b43e20" strokeWidth={2} dot={false} name="Luxe" />
                <Line type="monotone" dataKey="adventure" stroke="#059669" strokeWidth={2} dot={false} name="Aventure" />
                <Line type="monotone" dataKey="mice" stroke="#7c3aed" strokeWidth={2} dot={false} name="MICE" />
                <Line type="monotone" dataKey="cultural" stroke="#d97706" strokeWidth={2} dot={false} name="Culturel" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Segment Performance Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-[14px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award size={15} className="text-rihla" /> Performance par Segment
            </h3>
          </div>
          <table className="w-full text-[13px]">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Segment</th>
                <th className="px-4 py-3 text-center">Clients</th>
                <th className="px-4 py-3 text-right">CA (k MAD)</th>
                <th className="px-4 py-3 text-center">Conversion</th>
                <th className="px-4 py-3 text-right">Ticket Moy. (k)</th>
                <th className="px-4 py-3 text-center">Croissance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {SEGMENT_PERFORMANCE.map(s => (
                <tr key={s.segment} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                  <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">{s.segment}</td>
                  <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{s.clients}</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white tabular-nums">{s.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={clsx('font-bold', s.conversion >= 70 ? 'text-emerald-600' : s.conversion >= 50 ? 'text-amber-600' : 'text-red-600')}>{s.conversion}%</span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300 tabular-nums">{s.avgTicket}k</td>
                  <td className="px-4 py-3 text-center text-emerald-600 font-medium">{s.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Clients */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="text-[14px] font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Star size={15} className="text-amber-500" /> Top 5 Clients par CA
          </h3>
          <div className="space-y-3">
            {TOP_CLIENTS.map((c, i) => (
              <div key={c.name} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-rihla/10 flex items-center justify-center text-rihla font-black text-[14px]">#{i + 1}</div>
                <span className="text-lg">{c.flag}</span>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-slate-900 dark:text-white">{c.name}</p>
                  <p className="text-[11px] text-slate-500">{c.tier}</p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-bold text-slate-900 dark:text-white tabular-nums">{c.revenue.toLocaleString()}k MAD</p>
                  <p className="text-[11px] text-emerald-600 font-medium">{c.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
