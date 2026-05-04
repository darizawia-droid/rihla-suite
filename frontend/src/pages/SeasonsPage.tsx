import { useState, useMemo } from 'react'
import {
  Calendar, Sun, Snowflake, CloudSun, Sparkles,
  Plus, X, Edit, Trash2, ChevronRight,
  Hotel, Truck, UserCheck, MapPin,
} from 'lucide-react'
import { clsx } from 'clsx'

type SeasonType = 'haute' | 'basse' | 'moyenne' | 'speciale'
type AppliesTo = 'hotel' | 'transport' | 'guide' | 'restaurant' | 'activite'

interface Season {
  id: string
  name: string
  type: SeasonType
  dateFrom: string
  dateTo: string
  appliesTo: AppliesTo[]
  modifier: number
  notes: string
  isActive: boolean
}

const TYPE_CONFIG: Record<SeasonType, { label: string; color: string; bg: string; icon: typeof Sun }> = {
  haute:    { label: 'Haute Saison',    color: 'text-red-600',    bg: 'bg-red-500/10',    icon: Sun },
  moyenne:  { label: 'Moyenne Saison',  color: 'text-amber-600',  bg: 'bg-amber-500/10',  icon: CloudSun },
  basse:    { label: 'Basse Saison',    color: 'text-blue-600',   bg: 'bg-blue-500/10',   icon: Snowflake },
  speciale: { label: 'Saison Spéciale', color: 'text-violet-600', bg: 'bg-violet-500/10', icon: Sparkles },
}

const APPLIES_ICONS: Record<AppliesTo, { label: string; icon: typeof Hotel }> = {
  hotel:      { label: 'Hôtels',      icon: Hotel },
  transport:  { label: 'Transport',   icon: Truck },
  guide:      { label: 'Guides',      icon: UserCheck },
  restaurant: { label: 'Restaurants', icon: MapPin },
  activite:   { label: 'Activités',   icon: Sparkles },
}

const DEMO_SEASONS: Season[] = [
  {
    id: 'S001', name: 'Haute Saison Été 2026', type: 'haute',
    dateFrom: '2026-06-15', dateTo: '2026-09-15',
    appliesTo: ['hotel', 'transport', 'guide', 'restaurant'],
    modifier: 30, notes: 'Pic touristique. Tarifs majorés de 30%. Allotements à bloquer 60j avant.',
    isActive: true,
  },
  {
    id: 'S002', name: 'Haute Saison Printemps 2026', type: 'haute',
    dateFrom: '2026-03-15', dateTo: '2026-05-31',
    appliesTo: ['hotel', 'transport', 'guide'],
    modifier: 20, notes: 'Saison des festivals (Gnaoua, Roses). Forte demande groupes européens.',
    isActive: true,
  },
  {
    id: 'S003', name: 'Basse Saison Hiver 2026', type: 'basse',
    dateFrom: '2026-01-10', dateTo: '2026-03-14',
    appliesTo: ['hotel', 'transport', 'guide', 'restaurant', 'activite'],
    modifier: -20, notes: 'Période calme. Tarifs réduits de 20%. Promotions early bird possibles.',
    isActive: true,
  },
  {
    id: 'S004', name: 'Moyenne Saison Automne 2026', type: 'moyenne',
    dateFrom: '2026-09-16', dateTo: '2026-12-20',
    appliesTo: ['hotel', 'transport', 'guide'],
    modifier: 0, notes: 'Tarifs standards. Bonne période pour MICE et incentives.',
    isActive: true,
  },
  {
    id: 'S005', name: 'Fêtes de fin d\'année 2026', type: 'speciale',
    dateFrom: '2026-12-20', dateTo: '2027-01-05',
    appliesTo: ['hotel', 'transport', 'guide', 'restaurant'],
    modifier: 40, notes: 'Réveillons et fêtes. Supplément 40%. Minimum stay 3 nuits en hôtel.',
    isActive: true,
  },
  {
    id: 'S006', name: 'Ramadan 2027', type: 'speciale',
    dateFrom: '2027-02-28', dateTo: '2027-03-30',
    appliesTo: ['hotel', 'restaurant', 'guide'],
    modifier: -15, notes: 'Période Ramadan. Horaires restaurants modifiés. Tarifs ajustés -15%.',
    isActive: true,
  },
]

export function SeasonsPage() {
  const [seasons] = useState(DEMO_SEASONS)
  const [selectedType, setSelectedType] = useState<SeasonType | 'all'>('all')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = useMemo(() =>
    selectedType === 'all' ? seasons : seasons.filter(s => s.type === selectedType),
    [seasons, selectedType]
  )

  const timeline = useMemo(() => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    return months.map((name, i) => {
      const monthStart = new Date(2026, i, 1)
      const monthEnd = new Date(2026, i + 1, 0)
      const active = seasons.filter(s => {
        const from = new Date(s.dateFrom)
        const to = new Date(s.dateTo)
        return from <= monthEnd && to >= monthStart
      })
      return { name, seasons: active }
    })
  }, [seasons])

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 transition-colors pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-6">
        <div className="max-w-[1600px] mx-auto flex justify-between items-end gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              <Calendar size={12} className="text-rihla" /> Paramétrage
            </div>
            <h1 className="text-[24px] font-bold text-slate-900 dark:text-white tracking-tight">
              Saisons & Périodes Tarifaires
            </h1>
            <p className="text-[13px] text-slate-500 mt-0.5">
              {seasons.length} saisons définies &middot; Appliquées à tous les produits (hôtels, transport, guides)
            </p>
          </div>
          <button onClick={() => setShowAdd(!showAdd)} className="inline-flex items-center gap-1.5 h-9 px-3.5 text-[13px] font-bold text-white bg-rihla hover:bg-rihla/90 rounded-lg">
            <Plus size={14} /> Nouvelle Saison
          </button>
        </div>
      </div>

      <div className="p-8 max-w-[1600px] mx-auto space-y-6">
        {/* Timeline Visual */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="text-[13px] font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar size={14} className="text-rihla" /> Calendrier des Saisons 2026
          </h3>
          <div className="grid grid-cols-12 gap-1">
            {timeline.map(m => (
              <div key={m.name} className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">{m.name}</p>
                <div className="space-y-1">
                  {m.seasons.length === 0 ? (
                    <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded" />
                  ) : (
                    m.seasons.map(s => {
                      const cfg = TYPE_CONFIG[s.type]
                      return (
                        <div key={s.id} className={clsx('h-6 rounded flex items-center justify-center text-[8px] font-bold truncate px-0.5', cfg.bg, cfg.color)} title={s.name}>
                          {s.name.split(' ')[0]}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5 text-[11px]">
                <div className={clsx('w-3 h-3 rounded', cfg.bg)} />
                <span className="text-slate-500">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Type Filters */}
        <div className="flex gap-2">
          <button onClick={() => setSelectedType('all')} className={clsx('px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors border', selectedType === 'all' ? 'bg-rihla/10 text-rihla border-rihla/20' : 'text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-50')}>
            Toutes ({seasons.length})
          </button>
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
            const count = seasons.filter(s => s.type === key).length
            return (
              <button key={key} onClick={() => setSelectedType(key as SeasonType)} className={clsx('px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors border flex items-center gap-1.5', selectedType === key ? `${cfg.bg} ${cfg.color} border-current/20` : 'text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-50')}>
                <cfg.icon size={12} /> {cfg.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Seasons List */}
        <div className="space-y-3">
          {filtered.map(s => {
            const cfg = TYPE_CONFIG[s.type]
            const Icon = cfg.icon
            return (
              <div key={s.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:border-rihla/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', cfg.bg)}>
                      <Icon size={18} className={cfg.color} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">{s.name}</h3>
                        <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold', cfg.bg, cfg.color)}>{cfg.label}</span>
                        {s.modifier !== 0 && (
                          <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold',
                            s.modifier > 0 ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'
                          )}>
                            {s.modifier > 0 ? '+' : ''}{s.modifier}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[12px] text-slate-500 mb-2">
                        <span className="flex items-center gap-1"><Calendar size={12} />{s.dateFrom} → {s.dateTo}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {s.appliesTo.map(a => {
                          const ai = APPLIES_ICONS[a]
                          return (
                            <span key={a} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium rounded-full">
                              <ai.icon size={10} /> {ai.label}
                            </span>
                          )
                        })}
                      </div>
                      {s.notes && <p className="text-[12px] text-slate-500 leading-relaxed">{s.notes}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button className="p-2 text-slate-400 hover:text-rihla hover:bg-rihla/5 rounded-lg"><Edit size={14} /></button>
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg"><Trash2 size={14} /></button>
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
