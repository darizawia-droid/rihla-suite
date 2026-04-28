import { useState, useMemo } from 'react'
import {
  Hotel, ChevronRight, Lock, Unlock, Calendar,
  CheckCircle2, AlertTriangle, Clock, Users,
  ArrowRight, RefreshCw, Bell, Eye, X,
  ChevronDown, ChevronUp, Loader2
} from 'lucide-react'
import { clsx } from 'clsx'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { allotmentsApi } from '@/lib/api'

// ── Types ──────────────────────────────────────────────────────────
interface Allotment {
  id: string
  hotelName: string
  city: string
  category: string
  checkIn: string
  checkOut: string
  roomsBlocked: number
  roomsConfirmed: number
  roomsReleased: number
  deadline: string
  status: 'blocked' | 'confirmed' | 'partial' | 'released' | 'expired'
  contractId: string
  pricePerNight: number
  notes: string
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Lock }> = {
  blocked:   { label: 'Bloqué', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', icon: Lock },
  confirmed: { label: 'Confirmé', color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', icon: CheckCircle2 },
  partial:   { label: 'Partiel', color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30', icon: AlertTriangle },
  released:  { label: 'Libéré', color: 'text-slate-500', bgColor: 'bg-slate-100 dark:bg-white/10', icon: Unlock },
  expired:   { label: 'Expiré', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30', icon: Clock },
}

const fmt = (n: number) => n.toLocaleString('fr-FR')

export function AllotmentManagerPage() {
  const queryClient = useQueryClient()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showTimeline, setShowTimeline] = useState(true)

  const { data: rawAllotments, isLoading } = useQuery({
    queryKey: ['allotments'],
    queryFn: () => allotmentsApi.list().then(res => res.data),
  })

  const allotments: Allotment[] = useMemo(() => {
    if (!rawAllotments) return []
    return rawAllotments.map(a => ({
      id: a.id,
      hotelName: a.hotel_name,
      city: a.city,
      category: a.category || '—',
      checkIn: a.check_in,
      checkOut: a.check_out,
      roomsBlocked: a.rooms_blocked,
      roomsConfirmed: a.rooms_confirmed,
      roomsReleased: a.rooms_released,
      deadline: a.deadline || '—',
      status: a.status as Allotment['status'],
      contractId: a.contract_id || 'N/A',
      pricePerNight: a.price_per_night,
      notes: a.notes || '',
    }))
  }, [rawAllotments])

  const confirmMutation = useMutation({
    mutationFn: (id: string) => allotmentsApi.confirm(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allotments'] }),
  })

  const releaseMutation = useMutation({
    mutationFn: (id: string) => allotmentsApi.release(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allotments'] }),
  })

  const stats = useMemo(() => ({
    totalRooms: allotments.reduce((s, a) => s + a.roomsBlocked, 0),
    confirmed: allotments.reduce((s, a) => s + a.roomsConfirmed, 0),
    released: allotments.reduce((s, a) => s + a.roomsReleased, 0),
    pending: allotments.reduce((s, a) => s + (a.roomsBlocked - a.roomsConfirmed - a.roomsReleased), 0),
    totalCost: allotments.reduce((s, a) => {
      const nights = Math.ceil((new Date(a.checkOut).getTime() - new Date(a.checkIn).getTime()) / 86400000)
      return s + a.pricePerNight * nights * a.roomsBlocked
    }, 0),
    nearDeadline: allotments.filter(a => {
      if (a.deadline === '—') return false
      const dl = new Date(a.deadline)
      const now = new Date()
      const diff = (dl.getTime() - now.getTime()) / 86400000
      return diff > 0 && diff < 7 && a.status !== 'confirmed' && a.status !== 'released'
    }).length,
  }), [allotments])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="text-rihla animate-spin" size={48} />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Chargement des allotements...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 transition-colors">

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto flex justify-between items-end mb-10">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            Contracting <ChevronRight size={10} /> Allotements
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-cream tracking-tighter flex items-center gap-4">
            <Hotel className="text-rihla" size={36} />
            Gestion des Allotements
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium italic">
            Bloquer / Libérer automatiquement les chambres à la confirmation du devis
          </p>
        </div>
      </div>

      {/* ── KPI CARDS ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto grid grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Chambres bloquées', value: stats.totalRooms, icon: Lock, color: 'text-blue-500' },
          { label: 'Confirmées', value: stats.confirmed, icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'En attente', value: stats.pending, icon: Clock, color: 'text-amber-500' },
          { label: 'Libérées', value: stats.released, icon: Unlock, color: 'text-slate-400' },
          { label: 'Deadline < 7j', value: stats.nearDeadline, icon: AlertTriangle, color: 'text-red-500' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-2">
              <s.icon size={14} className={s.color} /> {s.label}
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-cream">{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── TIMELINE VIEW ──────────────────────────────────────── */}
      {showTimeline && (
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Calendar size={14} /> Vue Chronologique
            </h3>
            {allotments.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-slate-400 text-xs italic">
                Aucun allotement planifié pour cette période
              </div>
            ) : (
              <div className="relative h-32">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-white/10 -translate-y-1/2" />
                {allotments.map((a, i) => {
                  const startDate = new Date(a.checkIn)
                  // Fixed window for demo timeline: June 2026
                  const minDate = new Date('2026-06-01')
                  const maxDate = new Date('2026-06-30')
                  const range = maxDate.getTime() - minDate.getTime()
                  const left = ((startDate.getTime() - minDate.getTime()) / range) * 100
                  const endDate = new Date(a.checkOut)
                  const width = ((endDate.getTime() - startDate.getTime()) / range) * 100
                  const sc = statusConfig[a.status]

                  if (left < 0 || left > 100) return null

                  return (
                    <div
                      key={a.id}
                      className="absolute"
                      style={{ left: `${Math.max(0, Math.min(left, 90))}%`, width: `${Math.max(5, Math.min(width, 90 - left))}%`, top: `${(i % 3) * 35 + 5}px` }}
                    >
                      <div className={clsx("h-8 rounded-lg flex items-center px-2 text-[9px] font-bold truncate cursor-pointer hover:scale-105 transition-transform", sc.bgColor, sc.color)} title={`${a.hotelName} — ${a.city}`}>
                        {a.hotelName.split(' ').slice(0, 2).join(' ')}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            <div className="flex justify-between text-[10px] text-slate-400 mt-2">
              <span>01 Juin</span>
              <span>08 Juin</span>
              <span>15 Juin</span>
              <span>22 Juin</span>
              <span>30 Juin</span>
            </div>
          </div>
        </div>
      )}

      {/* ── ALLOTMENT CARDS ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto space-y-4">
        {allotments.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 p-12 text-center">
            <Hotel size={48} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Aucun allotement trouvé</p>
          </div>
        )}
        {allotments.map(a => {
          const sc = statusConfig[a.status]
          const StatusIcon = sc.icon
          const nights = Math.ceil((new Date(a.checkOut).getTime() - new Date(a.checkIn).getTime()) / 86400000)
          const totalCost = a.pricePerNight * nights * a.roomsBlocked
          const occupancy = a.roomsBlocked > 0 ? (a.roomsConfirmed / a.roomsBlocked) * 100 : 0
          const daysToDeadline = a.deadline !== '—' ? Math.ceil((new Date(a.deadline).getTime() - new Date().getTime()) / 86400000) : 999

          return (
            <div key={a.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
              <div
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-rihla/10 flex items-center justify-center">
                    <Hotel size={24} className="text-rihla" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{a.hotelName} <span className="text-rihla text-xs">{a.category}</span></div>
                    <div className="text-xs text-slate-500 mt-0.5">{a.city} · {a.checkIn} → {a.checkOut} ({nights} nuits)</div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={clsx("px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1", sc.bgColor, sc.color)}>
                        <StatusIcon size={10} /> {sc.label}
                      </span>
                      <span className="text-[10px] text-slate-400">Réf: {a.contractId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase">Chambres</div>
                    <div className="text-lg font-black">{a.roomsConfirmed}/{a.roomsBlocked}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase">Coût total</div>
                    <div className="text-lg font-black text-rihla">{fmt(totalCost)} MAD</div>
                  </div>
                  {daysToDeadline > 0 && daysToDeadline < 7 && a.status !== 'confirmed' && a.status !== 'released' && (
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <Bell size={10} /> {daysToDeadline}j restants
                    </div>
                  )}
                  {expandedId === a.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </div>
              </div>

              {expandedId === a.id && (
                <div className="p-6 pt-0 border-t border-slate-100 dark:border-white/5 space-y-4 animate-in slide-in-from-top-2 duration-300">
                  {/* Occupancy bar */}
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
                      <span>Taux d'occupation</span>
                      <span className="text-rihla">{occupancy.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${occupancy}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>{a.roomsConfirmed} confirmées</span>
                      <span>{a.roomsBlocked - a.roomsConfirmed - a.roomsReleased} en attente</span>
                      <span>{a.roomsReleased} libérées</span>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3">
                      <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Prix/nuit</div>
                      <div className="text-sm font-bold">{fmt(a.pricePerNight)} MAD</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3">
                      <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Deadline</div>
                      <div className="text-sm font-bold">{a.deadline}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3">
                      <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Notes</div>
                      <div className="text-xs text-slate-500">{a.notes || '—'}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  {a.status !== 'confirmed' && a.status !== 'released' && (
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => confirmMutation.mutate(a.id)}
                        disabled={confirmMutation.isPending}
                        className="flex items-center gap-2 px-5 py-3 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-wait"
                      >
                        {confirmMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                        Confirmer toutes les chambres
                      </button>
                      <button
                        onClick={() => releaseMutation.mutate(a.id)}
                        disabled={releaseMutation.isPending}
                        className="flex items-center gap-2 px-5 py-3 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-wait"
                      >
                        {releaseMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Unlock size={14} />}
                        Libérer les non-confirmées
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
