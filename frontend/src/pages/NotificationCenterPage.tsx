import { useState, useMemo } from 'react'
import {
  Bell, CheckCheck, Trash2, ChevronRight,
  CreditCard, Users, Calendar, TrendingUp,
  Sparkles, Briefcase, Bus, AlertTriangle,
  Info, CheckCircle2, FileText, Loader2,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '@/lib/api'

// ── Types ─────────────────────────────────────────────────────────────────────

type NotifType = 'finance' | 'operations' | 'project' | 'ai' | 'system' | string
type Priority  = 'urgent' | 'success' | 'info' | 'warning'

interface Notification {
  id: string
  title: string
  message: string
  time: string          // formatted relative string
  type: NotifType
  priority: Priority
  read: boolean
}

// ── Style maps ────────────────────────────────────────────────────────────────

const PRIORITY_STYLES: Record<Priority, string> = {
  urgent:  'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20',
  success: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
  warning: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',
  info:    'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800',
}

const PRIORITY_ICON_STYLES: Record<Priority, string> = {
  urgent:  'text-red-500 bg-red-50 dark:bg-red-500/10',
  success: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10',
  warning: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10',
  info:    'text-slate-400 bg-slate-50 dark:bg-white/5',
}

const TYPE_LABELS: Record<string, string> = {
  finance:    'Finance',
  operations: 'Opérations',
  project:    'Projets',
  ai:         'Intelligence IA',
  system:     'Système',
  payment:    'Paiement',
  invoice:    'Facture',
  alert:      'Alerte',
}

// Derive icon from type / title keywords
function getIcon(type: string, title: string) {
  const t = (type + ' ' + title).toLowerCase()
  if (t.includes('paiement') || t.includes('payment') || t.includes('facture') || t.includes('finance')) return CreditCard
  if (t.includes('guide') || t.includes('pax') || t.includes('passager')) return Users
  if (t.includes('départ') || t.includes('bus') || t.includes('transport') || t.includes('vehicle')) return Bus
  if (t.includes('taux') || t.includes('forex') || t.includes('prix')) return TrendingUp
  if (t.includes('ia') || t.includes('ai') || t.includes('itinéraire généré')) return Sparkles
  if (t.includes('partenaire') || t.includes('agence')) return Briefcase
  if (t.includes('rooming') || t.includes('calendrier')) return Calendar
  if (t.includes('confirmé') || t.includes('réglée') || t.includes('payé')) return CheckCircle2
  if (t.includes('retard') || t.includes('conflit') || t.includes('urgent')) return AlertTriangle
  if (t.includes('facture') || t.includes('invoice')) return FileText
  if (t.includes('opération') || t.includes('projet')) return Info
  return Bell
}

// Derive priority from type / title keywords
function getPriority(type: string, title: string): Priority {
  const t = (type + ' ' + title).toLowerCase()
  if (t.includes('conflit') || t.includes('urgent') || t.includes('retard') || t.includes('en retard')) return 'urgent'
  if (t.includes('confirmé') || t.includes('réglée') || t.includes('paiement reçu') || t.includes('payé')) return 'success'
  if (t.includes('seuil') || t.includes('attention') || t.includes('départ demain')) return 'warning'
  return 'info'
}

// Format relative time
function relTime(d?: string): string {
  if (!d) return ''
  try {
    const diff = Date.now() - new Date(d).getTime()
    const min  = Math.floor(diff / 60000)
    if (min < 2)   return 'À l\'instant'
    if (min < 60)  return `Il y a ${min} min`
    const h = Math.floor(min / 60)
    if (h < 24)    return `Il y a ${h}h`
    const days = Math.floor(h / 24)
    if (days === 1) return 'Hier'
    return `Il y a ${days} jours`
  } catch { return '' }
}

// ── Static fallback (shown when API has no data) ───────────────────────────

const MOCK_NOTIFS: Notification[] = [
  { id: 'N01', title: 'Paiement reçu',             message: "Nordic Adventures a réglé l'acompte de 58 600 MAD pour Atlas Trekking.",              time: 'Il y a 5 min',  type: 'finance',    priority: 'success', read: false },
  { id: 'N02', title: 'Conflit de guide détecté',   message: "Ahmed El Mansouri est assigné à 2 groupes les 12-14 Nov. Veuillez réassigner.",        time: 'Il y a 18 min', type: 'operations', priority: 'urgent',  read: false },
  { id: 'N03', title: 'Projet confirmé',            message: "Grand Tour of Morocco (P01) est confirmé par Travel Agency XYZ.",                       time: 'Il y a 1h',     type: 'project',    priority: 'success', read: false },
  { id: 'N04', title: 'Taux EUR/MAD hors seuil',   message: "Le taux EUR/MAD (10.48) est passé sous le seuil minimal (10.50). Vérifiez vos tarifs.", time: 'Il y a 2h',     type: 'finance',    priority: 'warning', read: true  },
  { id: 'N05', title: 'Itinéraire généré par IA',  message: "L'assistant IA a créé un itinéraire 7J pour le groupe German Explorer.",                 time: 'Il y a 3h',     type: 'ai',         priority: 'info',    read: true  },
  { id: 'N06', title: 'Rooming List importée',      message: "Desert Stars Adventure : 18 passagers importés depuis Excel. Validation requise.",       time: 'Il y a 5h',     type: 'operations', priority: 'info',    read: true  },
  { id: 'N07', title: 'Nouveau partenaire ajouté',  message: "Prestige Tours Paris a été ajouté à votre réseau de distribution.",                      time: 'Hier, 18h30',   type: 'project',    priority: 'info',    read: true  },
  { id: 'N08', title: 'Départ de groupe demain',    message: "Grand Tour of Morocco (24 PAX) départ demain à 08h00 — Aéroport Marrakech-Menara.",     time: 'Hier, 09h00',   type: 'operations', priority: 'warning', read: true  },
  { id: 'N09', title: 'Facture en retard',          message: "La facture INV-2026-062 pour Luxury Marrakech est en retard de 3 jours.",               time: 'Il y a 2 jours',type: 'finance',    priority: 'urgent',  read: true  },
  { id: 'N10', title: 'Mise à jour système',        message: "RIHLA v2.4.1 : Nouveau module Forex Live disponible.",                                   time: 'Il y a 3 jours',type: 'system',     priority: 'info',    read: true  },
]

// ── Loading skeleton ──────────────────────────────────────────────────────────

function NotifSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-1/3" />
              <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-3/4" />
              <div className="h-2 bg-slate-100 dark:bg-white/5 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

const FILTERS: Array<{ key: 'all' | NotifType; label: string }> = [
  { key: 'all',        label: 'Tout' },
  { key: 'finance',    label: 'Finance' },
  { key: 'operations', label: 'Opérations' },
  { key: 'project',    label: 'Projets' },
  { key: 'ai',         label: 'IA' },
  { key: 'system',     label: 'Système' },
]

export function NotificationCenterPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | NotifType>('all')
  const qc = useQueryClient()

  // ── Fetch from real API ───────────────────────────────────────────────────
  const { data: rawNotifs, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn:  () => notificationsApi.list().then(r => r.data),
    staleTime: 15_000,
    refetchInterval: 60_000,  // auto-refresh every 60s
  })

  // Map backend → UI. Fallback to static demo if empty.
  const notifications: Notification[] = useMemo(() => {
    const raw = rawNotifs as any[] | undefined
    if (!raw || raw.length === 0) return MOCK_NOTIFS

    return raw.map((n: any) => {
      const type = n.type ?? n.category ?? 'system'
      const title = n.title ?? n.subject ?? 'Notification'
      return {
        id:       String(n.id),
        title,
        message:  n.message ?? n.body ?? n.content ?? '',
        time:     relTime(n.created_at),
        type,
        priority: getPriority(type, title),
        read:     Boolean(n.is_read ?? n.read ?? false),
      }
    })
  }, [rawNotifs])

  const isDemo = !rawNotifs || (rawNotifs as any[]).length === 0

  // ── Mutations ──────────────────────────────────────────────────────────────
  const markReadMut = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const markAllMut = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })

  // ── Derived values ─────────────────────────────────────────────────────────
  const unreadCount = notifications.filter(n => !n.read).length

  const filtered = useMemo(() =>
    notifications.filter(n => activeFilter === 'all' || n.type === activeFilter),
    [notifications, activeFilter]
  )

  const handleMarkRead = (id: string, alreadyRead: boolean) => {
    if (alreadyRead) return
    if (isDemo) return   // no-op on mock data
    markReadMut.mutate(id)
  }

  const handleMarkAll = () => {
    if (isDemo) return
    markAllMut.mutate()
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors">

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 shadow-inner">
                <Bell size={24} />
              </div>
              {unreadCount > 0 && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-white text-[9px] font-black shadow-lg">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-800 dark:text-cream">Centre de Notifications</h1>
                {isDemo && (
                  <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase rounded border border-amber-200 dark:border-amber-500/20">
                    Démo
                  </span>
                )}
                {!isDemo && (
                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase rounded border border-emerald-200 dark:border-emerald-500/20">
                    Live
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-xs mt-0.5 uppercase tracking-widest font-bold">
                {isLoading
                  ? 'Chargement…'
                  : unreadCount > 0
                    ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
                    : 'Tout est à jour ✓'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkAll}
              disabled={unreadCount === 0 || markAllMut.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-cream transition-all disabled:opacity-40"
            >
              {markAllMut.isPending
                ? <Loader2 size={14} className="animate-spin" />
                : <CheckCheck size={14} />
              }
              Tout marquer lu
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">

        {/* ── FILTER TABS ────────────────────────────────────────────── */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 scrollbar-none">
          {FILTERS.map(f => {
            const count = f.key === 'all'
              ? notifications.length
              : notifications.filter(n => n.type === f.key).length
            const unread = f.key === 'all'
              ? unreadCount
              : notifications.filter(n => n.type === f.key && !n.read).length
            return (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`whitespace-nowrap px-5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                  activeFilter === f.key
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg'
                    : 'bg-white dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-400'
                }`}
              >
                {f.label}
                {count > 0 && (
                  <span className={`text-[9px] font-black rounded-full px-1.5 py-0.5 min-w-[18px] text-center ${
                    unread > 0
                      ? 'bg-rose-500 text-white'
                      : activeFilter === f.key
                        ? 'bg-white/20 text-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-white/10 text-slate-400'
                  }`}>
                    {unread > 0 ? unread : count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ── NOTIFICATIONS LIST ──────────────────────────────────────── */}
        {isLoading ? (
          <NotifSkeleton />
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Bell size={48} className="mx-auto text-slate-200 dark:text-slate-800 mb-4" />
            <p className="text-sm font-bold text-slate-300 dark:text-slate-700">
              Aucune notification dans cette catégorie
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(notif => {
              const Icon = getIcon(notif.type, notif.title)
              return (
                <div
                  key={notif.id}
                  onClick={() => handleMarkRead(notif.id, notif.read)}
                  className={`relative p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-md group
                    ${PRIORITY_STYLES[notif.priority]}
                    ${!notif.read ? 'ring-1 ring-offset-1 ring-rihla/20' : 'opacity-80 hover:opacity-100'}
                  `}
                >
                  {/* Unread dot */}
                  {!notif.read && (
                    <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-rihla shadow-sm shadow-rihla/50" />
                  )}

                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${PRIORITY_ICON_STYLES[notif.priority]}`}>
                      <Icon size={18} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h4 className={`text-sm font-bold ${notif.read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-cream'}`}>
                          {notif.title}
                        </h4>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                          {TYPE_LABELS[notif.type] ?? notif.type}
                        </span>
                        {markReadMut.isPending && markReadMut.variables === notif.id && (
                          <Loader2 size={12} className="animate-spin text-rihla" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{notif.message}</p>
                      <p className="text-[10px] text-slate-400 mt-2 font-bold">{notif.time}</p>
                    </div>

                    <ChevronRight size={16} className="text-slate-300 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── PROMO: real notifications need backend events ──────────── */}
        {isDemo && !isLoading && (
          <div className="mt-10 p-5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-white/[0.02] text-center">
            <Bell size={24} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
            <p className="text-[12px] font-bold text-slate-400">
              Ces notifications sont en mode démo.<br />
              Les vraies notifications apparaîtront ici dès que des événements se produisent sur la plateforme (paiements, projets, alertes IA…)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
