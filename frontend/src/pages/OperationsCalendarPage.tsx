import { useState, useMemo } from 'react'
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight,
  Users, Flag, Filter, AlertTriangle, CheckCircle2,
  Loader2, MapPin
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '@/lib/api'

// ── Constants ─────────────────────────────────────────────────────────────────

const GUIDES   = ['Ahmed', 'Fatima', 'Youssef', 'Karim', 'Non assigné']
const VEHICLES = ['Sprinter 1 (17p)', 'Vito 1 (7p)', 'Autocar (48p)', '4x4 Prado', 'Non assigné']

const GROUP_COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-indigo-500',
  'bg-rose-500', 'bg-purple-500', 'bg-teal-500', 'bg-orange-500',
]

// ── Date helpers ──────────────────────────────────────────────────────────────

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function parseDate(s?: string | null): Date | null {
  if (!s) return null
  try {
    const d = new Date(s)
    return isNaN(d.getTime()) ? null : d
  } catch { return null }
}

// Clip day to [1, maxDay]
function clipDay(d: number, max: number) {
  return Math.max(1, Math.min(d, max))
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface GanttRow {
  id: string
  name: string
  pax: number
  destination: string
  startDay: number
  endDay: number
  color: string
  guide: string
  vehicle: string
  status: string
  isReal: boolean
}

// ── Static fallback groups ─────────────────────────────────────────────────────

function getMockGroups(year: number, month: number): GanttRow[] {
  const maxDay = daysInMonth(year, month)
  return [
    { id: 'G01', name: 'Group Sunset TO',    pax: 22, destination: 'Marrakech–Fès',   startDay: 1,  endDay: clipDay(11, maxDay), color: 'bg-blue-500',    guide: 'Ahmed',   vehicle: 'Sprinter 1 (17p)', status: 'in_progress', isReal: false },
    { id: 'G02', name: 'Incentive Paris',     pax: 45, destination: 'Circuit Impérial',startDay: 5,  endDay: clipDay(9,  maxDay), color: 'bg-emerald-500', guide: 'Fatima',  vehicle: 'Autocar (48p)',    status: 'won',         isReal: false },
    { id: 'G03', name: 'Luxury FIT Spain',    pax: 4,  destination: 'Sahara',          startDay: 15, endDay: clipDay(22, maxDay), color: 'bg-amber-500',   guide: 'Youssef', vehicle: '4x4 Prado',        status: 'in_progress', isReal: false },
    { id: 'G04', name: 'Cultural Tour UK',    pax: 18, destination: 'Marrakech',       startDay: 12, endDay: clipDay(20, maxDay), color: 'bg-indigo-500',  guide: 'Karim',   vehicle: 'Sprinter 1 (17p)', status: 'won',         isReal: false },
  ]
}

// ── Main component ────────────────────────────────────────────────────────────

export function OperationsCalendarPage() {
  const now = new Date()
  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())  // 0-indexed

  // Local guide/vehicle assignments (no backend API yet — persists during session)
  const [assignments, setAssignments] = useState<Record<string, { guide: string; vehicle: string }>>({})

  const maxDay = daysInMonth(year, month)
  const daysArray = Array.from({ length: maxDay }, (_, i) => i + 1)

  const monthLabel = new Date(year, month, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  // ── Fetch real projects ────────────────────────────────────────────────────
  const { data: rawProjects, isLoading } = useQuery({
    queryKey: ['projects', 'calendar', year, month],
    queryFn:  () => projectsApi.list({ limit: 200 }).then(r => r.data?.items ?? []),
    staleTime: 60_000,
  })

  // Map projects → GanttRow, filtered to current month
  const groups: GanttRow[] = useMemo(() => {
    const raw = rawProjects as any[] | undefined
    if (!raw || raw.length === 0) return getMockGroups(year, month)

    const monthStart = new Date(year, month, 1)
    const monthEnd   = new Date(year, month, maxDay, 23, 59, 59)

    const rows: GanttRow[] = []
    for (const p of raw) {
      const start = parseDate(p.start_date)
      const end   = parseDate(p.end_date)
      if (!start || !end) continue

      // Only include if overlaps current month
      if (end < monthStart || start > monthEnd) continue

      // Clamp to month boundaries
      const startDay = start < monthStart ? 1 : start.getDate()
      const endDay   = end > monthEnd     ? maxDay : end.getDate()

      rows.push({
        id:          p.id,
        name:        p.name ?? 'Projet',
        pax:         p.pax_count ?? 0,
        destination: p.destination ?? p.client_name ?? '',
        startDay:    clipDay(startDay, maxDay),
        endDay:      clipDay(endDay,   maxDay),
        color:       GROUP_COLORS[rows.length % GROUP_COLORS.length],
        guide:       assignments[p.id]?.guide   ?? 'Non assigné',
        vehicle:     assignments[p.id]?.vehicle ?? 'Non assigné',
        status:      p.status ?? '',
        isReal:      true,
      })
    }

    return rows.length > 0 ? rows : getMockGroups(year, month)
  }, [rawProjects, year, month, maxDay, assignments])

  const isDemo = !rawProjects || (rawProjects as any[]).length === 0 ||
    groups.every(g => !g.isReal)

  const handleAssign = (id: string, field: 'guide' | 'vehicle', value: string) => {
    setAssignments(prev => ({
      ...prev,
      [id]: { ...(prev[id] ?? { guide: 'Non assigné', vehicle: 'Non assigné' }), [field]: value },
    }))
  }

  // Conflict detection
  const conflicts = useMemo(() => {
    const found: string[] = []
    for (let i = 0; i < groups.length; i++) {
      for (let j = i + 1; j < groups.length; j++) {
        const a = groups[i], b = groups[j]
        const overlap = Math.max(a.startDay, b.startDay) <= Math.min(a.endDay, b.endDay)
        if (!overlap) continue
        if (a.guide === b.guide && a.guide !== 'Non assigné')
          found.push(`Conflit Guide : ${a.guide} sur "${a.name}" et "${b.name}"`)
        if (a.vehicle === b.vehicle && a.vehicle !== 'Non assigné')
          found.push(`Conflit Flotte : ${a.vehicle} sur "${a.name}" et "${b.name}"`)
      }
    }
    return found
  }, [groups])

  // Today marker (only visible if current month)
  const todayDay = (now.getFullYear() === year && now.getMonth() === month) ? now.getDate() : null

  // Stats
  const todayGroups = groups.filter(g => todayDay && g.startDay <= todayDay && g.endDay >= todayDay)
  const totalPax    = groups.reduce((s, g) => s + g.pax, 0)
  const occupancy   = maxDay > 0 ? Math.round(groups.reduce((s, g) => s + (g.endDay - g.startDay + 1), 0) / maxDay) : 0

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-20 transition-colors">

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-lg">
            <CalendarIcon size={20} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black text-slate-800 dark:text-cream">Planning des Opérations</h1>
              {isLoading && <Loader2 size={14} className="animate-spin text-rihla" />}
              {isDemo && !isLoading && (
                <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase rounded border border-amber-200 dark:border-amber-500/20">
                  Démo
                </span>
              )}
              {!isDemo && (
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase rounded border border-emerald-200 dark:border-emerald-500/20">
                  Live — {groups.length} circuit{groups.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Vue Timeline — Détection de Conflits</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Month navigator */}
          <div className="flex bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1 shadow-sm">
            <button onClick={prevMonth} className="p-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-md transition-colors">
              <ChevronLeft size={16} className="text-slate-600 dark:text-slate-300" />
            </button>
            <span className="px-4 py-1.5 text-sm font-bold text-slate-700 dark:text-cream capitalize min-w-[180px] text-center">
              {monthLabel}
            </span>
            <button onClick={nextMonth} className="p-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-md transition-colors">
              <ChevronRight size={16} className="text-slate-600 dark:text-slate-300" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors">
            <Filter size={14} /> Filtres
          </button>
        </div>
      </div>

      <div className="p-8">

        {/* ── TIMELINE GANTT ────────────────────────────────────── */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-slate-900">
          <div className="overflow-x-auto">
            <div style={{ minWidth: `${64 + maxDay * 36}px` }}>

              {/* Days header */}
              <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                <div className="w-64 flex-shrink-0 border-r border-slate-100 dark:border-slate-800 px-6 py-3 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                  Groupes & Ressources
                </div>
                {daysArray.map(day => {
                  const isWeekend = new Date(year, month, day).getDay() === 0 || new Date(year, month, day).getDay() === 6
                  const isToday   = day === todayDay
                  return (
                    <div
                      key={day}
                      className={`flex-1 text-center py-3 text-[10px] font-bold border-r border-slate-50 dark:border-slate-800/50 last:border-0 transition-colors ${
                        isToday   ? 'bg-rihla/10 text-rihla font-black' :
                        isWeekend ? 'bg-slate-100/50 dark:bg-white/5 text-slate-400' : 'text-slate-400'
                      }`}
                    >
                      {String(day).padStart(2, '0')}
                    </div>
                  )
                })}
              </div>

              {/* Rows */}
              {isLoading ? (
                <div className="p-8 text-center">
                  <Loader2 size={32} className="animate-spin text-rihla mx-auto mb-3" />
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Chargement du planning…</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {groups.map(group => {
                    const assignedGuide   = assignments[group.id]?.guide   ?? group.guide
                    const assignedVehicle = assignments[group.id]?.vehicle ?? group.vehicle
                    return (
                      <div key={group.id} className="flex group/row hover:bg-slate-50/30 dark:hover:bg-white/[0.02] transition-colors">
                        {/* Info + assignment selects */}
                        <div className="w-64 flex-shrink-0 border-r border-slate-100 dark:border-slate-800 p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${group.color}`} />
                            <div className="min-w-0">
                              <h4 className="text-xs font-black text-slate-800 dark:text-cream leading-tight truncate">{group.name}</h4>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Users size={9} className="text-slate-400 flex-shrink-0" />
                                <span className="text-[10px] text-slate-400 font-bold">{group.pax} PAX</span>
                                {group.destination && (
                                  <>
                                    <MapPin size={9} className="text-slate-300 flex-shrink-0" />
                                    <span className="text-[10px] text-slate-300 truncate">{group.destination}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <select
                              value={assignedGuide}
                              onChange={e => handleAssign(group.id, 'guide', e.target.value)}
                              className="w-full text-[10px] font-bold text-rihla bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-1 outline-none cursor-pointer"
                            >
                              {GUIDES.map(g => <option key={g} value={g}>👤 {g}</option>)}
                            </select>
                            <select
                              value={assignedVehicle}
                              onChange={e => handleAssign(group.id, 'vehicle', e.target.value)}
                              className="w-full text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-1 outline-none cursor-pointer"
                            >
                              {VEHICLES.map(v => <option key={v} value={v}>🚐 {v}</option>)}
                            </select>
                          </div>
                        </div>

                        {/* Gantt bar area */}
                        <div className="flex-1 relative h-20 flex items-center">
                          {/* Grid lines */}
                          {daysArray.map(d => (
                            <div
                              key={d}
                              className={`absolute h-full border-r ${
                                d === todayDay
                                  ? 'border-rihla/40 bg-rihla/5'
                                  : 'border-slate-50 dark:border-slate-800/50'
                              }`}
                              style={{ left: `${(d - 1) * (100 / maxDay)}%`, width: `${100 / maxDay}%` }}
                            />
                          ))}

                          {/* Bar */}
                          <div
                            className={`absolute h-9 rounded-lg ${group.color} shadow-md flex items-center px-3 text-[9px] font-bold text-white overflow-hidden cursor-pointer hover:brightness-110 hover:scale-[1.01] transition-all`}
                            style={{
                              left:  `${(group.startDay - 1) * (100 / maxDay)}%`,
                              width: `${(group.endDay - group.startDay + 1) * (100 / maxDay)}%`,
                            }}
                            title={`${group.name} — J${group.startDay} → J${group.endDay}`}
                          >
                            <div className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
                              <Flag size={9} className="flex-shrink-0" />
                              <span className="truncate">{group.name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {groups.length === 0 && !isLoading && (
                    <div className="p-12 text-center">
                      <CalendarIcon size={36} className="mx-auto text-slate-200 dark:text-slate-800 mb-3" />
                      <p className="text-sm font-bold text-slate-400">Aucun circuit ce mois-ci</p>
                      <p className="text-xs text-slate-300 dark:text-slate-700 mt-1">Les projets avec une date de début/fin s'afficheront ici automatiquement.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── LEGEND + STATS ────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-6 mt-8">

          {/* Today status */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              {todayDay ? 'Statut aujourd\'hui' : 'Mois en cours'}
            </h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Circuits actifs</span>
                <span className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-black">
                  {todayDay ? todayGroups.length : groups.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Total PAX</span>
                <span className="bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full text-[10px] font-black">
                  {todayDay
                    ? todayGroups.reduce((s, g) => s + g.pax, 0)
                    : totalPax
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Conflits</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  conflicts.length > 0
                    ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-400'
                }`}>
                  {conflicts.length}
                </span>
              </div>
            </div>
          </div>

          {/* Conflict panel */}
          <div className={`col-span-2 rounded-2xl p-5 flex gap-4 ${
            conflicts.length > 0
              ? 'bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20'
              : 'bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20'
          }`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              conflicts.length > 0
                ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            }`}>
              {conflicts.length > 0 ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className={`text-xs font-black mb-2 ${
                conflicts.length > 0 ? 'text-amber-800 dark:text-amber-300' : 'text-emerald-800 dark:text-emerald-300'
              }`}>
                {conflicts.length > 0 ? `${conflicts.length} conflit${conflicts.length > 1 ? 's' : ''} détecté${conflicts.length > 1 ? 's' : ''}` : 'Planning validé ✓'}
              </h5>
              {conflicts.length > 0 ? (
                <div className="text-[11px] text-amber-700 dark:text-amber-400 space-y-1">
                  {conflicts.map((c, i) => <p key={i}>⚠ {c}</p>)}
                </div>
              ) : (
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
                  Aucun conflit détecté. Toutes les ressources logistiques sont correctement affectées.
                </p>
              )}
            </div>
          </div>

          {/* Occupancy */}
          <div className="bg-slate-900 dark:bg-white/5 rounded-2xl p-5 text-white flex flex-col justify-center border border-transparent dark:border-white/10">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Circuits / mois</p>
            <p className="text-4xl font-black text-emerald-400">{groups.length}</p>
            <p className="text-[10px] text-white/30 mt-1">{totalPax} PAX au total</p>
            <div className="w-full h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, occupancy * 10)}%` }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
