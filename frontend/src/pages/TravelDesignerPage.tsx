/**
 * TravelDesignerPage — Cotation Interactive
 *
 * Version améliorée : toutes les données sont en état React (éditables).
 * Le moteur de cotation backend (simulate-circuit) est appelé en live
 * avec debounce 400ms. Fallback local si backend indisponible.
 *
 * Onglets :
 *   1. Circuit Designer — édition jour/jour + contrôles de simulation
 *   2. Répartition Coûts — breakdown catégories + éditeur postes variables
 *   3. Grille PAX — grille tarifaire multi-ranges live
 *   4. Parité XLS — vérification vs référence YS Travel
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  MapPin, Hotel, Utensils, Bus, Calculator, Users,
  ChevronDown, ChevronUp, Eye, Landmark, Droplets,
  GripVertical, DollarSign, Compass, Mountain,
  Plus, Trash2, Save, RefreshCw, Download,
  Loader2, AlertTriangle, BarChart3, Sliders, Copy,
} from 'lucide-react'
import { clsx } from 'clsx'
import {
  XLS_DAILY, XLS_VARIABLE, XLS_SINGLE_SUPPLEMENT,
  XLS_MARGIN_PCT, XLS_GRID_REFERENCE, XLS_META, XLS_EXCHANGE_RATE,
} from '@/data/ys_travel_11d'
import { TravelDesignerMap } from '@/components/maps/TravelDesignerMap'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DayRow {
  id: string
  day: number
  date: string
  km: number
  cities: string
  hotel: string
  formula: 'BB' | 'HB' | 'FB' | '—'
  halfDbl: number
  ss: number
  taxe: number
  water: number
  rest: string
  restPrice: number
  monument: string
  monuPrice: number
  lg: number
}

interface VarCostRow {
  id: string
  key: string
  label: string
  sub: string
  total: number
  type: 'transport' | 'guide' | 'taxi' | 'four_by_four' | 'misc'
}

interface GridRow {
  pax: number
  cost: number
  sell: number
  marge: number
  usd: number
  warnings?: string[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FORMULAS = ['BB', 'HB', 'FB', '—'] as const
const PAX_PRESETS = [10, 12, 15, 18, 20, 25, 30, 35, 40, 50]
const DEFAULT_PAX_TIERS = [10, 15, 20, 25, 30, 35]

const CATEGORY_COLORS: Record<string, string> = {
  hotel:      'bg-blue-50 text-blue-700 border-blue-200',
  restaurant: 'bg-amber-50 text-amber-700 border-amber-200',
  monument:   'bg-purple-50 text-purple-700 border-purple-200',
  transport:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  guide:      'bg-cyan-50 text-cyan-700 border-cyan-200',
  tax:        'bg-slate-50 dark:bg-slate-950 text-slate-600 border-slate-200 dark:border-slate-700 dark:border-slate-700',
  water:      'bg-sky-50 text-sky-700 border-sky-200',
  misc:       'bg-rose-50 text-rose-700 border-rose-200',
}

const CITY_COORDS: Record<string, [number, number]> = {
  'CASABLANCA':  [28, 32], 'RABAT':       [33, 24],
  'CHEFCHAOUEN': [46, 12], 'FES':         [48, 28],
  'FÈS':         [48, 28], 'MIDELT':      [55, 40],
  'MERZOUGA':    [68, 55], 'OUARZAZATE':  [38, 60],
  'MARRAKECH':   [25, 55], 'ESSAOUIRA':   [10, 55],
}

const VAR_TYPE_ICONS: Record<string, string> = {
  transport: '🚌', guide: '🧭', taxi: '🚕', four_by_four: '🚙', misc: '📦',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt  = (v: number, cur = 'MAD') =>
  `${new Intl.NumberFormat('fr-FR').format(Math.round(v))} ${cur}`

const uid  = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`

const dayCost = (d: DayRow) =>
  d.halfDbl + d.restPrice + d.monuPrice + d.taxe + d.water + d.lg

// ─── Default data from XLS ────────────────────────────────────────────────────

function initDays(): DayRow[] {
  return (XLS_DAILY as any[]).map((d, i) => ({
    id:        `d-${i}`,
    day:       d.day,      date:       d.date,    km:        d.km,
    cities:    d.cities,   hotel:      d.hotel,   formula:   d.formula as DayRow['formula'],
    halfDbl:   d.halfDbl,  ss:         d.ss,      taxe:      d.taxe,
    water:     d.water,    rest:       d.rest,    restPrice: d.restPrice,
    monument:  d.monument, monuPrice:  d.monuPrice, lg:      d.lg,
  }))
}

function initVars(): VarCostRow[] {
  return [
    { id: 'v-bus',   key: 'bus',   label: 'Autocar 48 places',   sub: `${XLS_META.bus_rate_km} MAD/km × ${XLS_META.km_total} km`, total: XLS_VARIABLE.bus,          type: 'transport'    },
    { id: 'v-guide', key: 'guide', label: 'Guide National',       sub: '1 000 MAD/jour × 9 jours',                                  total: XLS_VARIABLE.guide,        type: 'guide'        },
    { id: 'v-taxi',  key: 'taxi',  label: 'Taxis Chefchaouen',    sub: 'Médina piétonne',                                            total: XLS_VARIABLE.taxi_chef,    type: 'taxi'         },
    { id: 'v-4x4',   key: '4x4',   label: '4×4 Merzouga',         sub: 'Excursion désert Sahara',                                    total: XLS_VARIABLE.merzouga_4x4, type: 'four_by_four' },
    { id: 'v-upg',   key: 'upg',   label: 'Upgrade Véhicule',     sub: 'Autocar premium',                                            total: XLS_VARIABLE.upgrade,      type: 'transport'    },
  ]
}

// ─── Local calculation (fallback) ────────────────────────────────────────────

function calcLocal(
  days: DayRow[], vars: VarCostRow[],
  margin: number, paxTiers: number[], rate: number,
): GridRow[] {
  const fixedPP = days.reduce((s, d) => s + dayCost(d), 0)
  const varGrp  = vars.reduce((s, v) => s + v.total, 0)
  return paxTiers.map(pax => {
    const cost = fixedPP + varGrp / pax
    const sell = cost * (1 + margin / 100)
    return {
      pax,
      cost:  Math.round(cost * 100) / 100,
      sell:  Math.round(sell * 100) / 100,
      marge: Math.round((sell - cost) * 100) / 100,
      usd:   Math.round((sell / rate) * 100) / 100,
    }
  })
}

// ─── Backend simulate-circuit API call ───────────────────────────────────────

async function callSimulate(
  days: DayRow[], vars: VarCostRow[],
  margin: number, paxTiers: number[], rate: number,
): Promise<GridRow[] | null> {
  try {
    const token = localStorage.getItem('stours_token')
    const body = {
      days: days.map(d => ({
        day: d.day, hotel: d.hotel, formula: d.formula,
        half_dbl: d.halfDbl, single_sup: d.ss,
        city_tax: d.taxe, water: d.water,
        restaurant: d.rest, rest_price: d.restPrice,
        monument: d.monument, monu_price: d.monuPrice,
        local_guide: d.lg,
      })),
      variable_costs: vars.map(v => ({ key: v.key, label: v.label, total_group: v.total })),
      margin_pct:    margin,
      currency:      'MAD',
      pax_tiers:     paxTiers,
      exchange_rate: rate,
    }
    const res = await fetch('/api/quotations/engine/simulate-circuit', {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) return null
    const json = await res.json()
    if (!json.success) return null
    return json.data.grid.map((r: any) => ({
      pax:      r.pax,
      cost:     r.cost_per_pax,
      sell:     r.selling_per_pax,
      marge:    r.margin_per_pax,
      usd:      r.usd_per_pax,
      warnings: r.warnings,
    }))
  } catch {
    return null
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// Sub-components
// ══════════════════════════════════════════════════════════════════════════════

// ─── CostChip ─────────────────────────────────────────────────────────────────
function CostChip({ icon, label, value, cat }: {
  icon: React.ReactNode; label: string; value: number; cat: string
}) {
  return (
    <div className={clsx('flex items-center gap-2 px-3 py-2 rounded-lg border text-[11px]',
      CATEGORY_COLORS[cat] || CATEGORY_COLORS.misc)}>
      {icon}
      <div className="min-w-0 flex-1">
        <p className="font-bold truncate">{label}</p>
      </div>
      <span className="font-black tabular-nums whitespace-nowrap">{fmt(value)}</span>
    </div>
  )
}

// ─── DayEditorRow ─────────────────────────────────────────────────────────────
function DayEditorRow({ d, isExpanded, onToggle, onChange, onDelete, onDuplicate }: {
  d: DayRow
  isExpanded: boolean
  onToggle: () => void
  onChange: (field: keyof DayRow, val: any) => void
  onDelete: () => void
  onDuplicate: () => void
}) {
  const cost     = dayCost(d)
  const isActive = d.formula !== '—'

  return (
    <div className={clsx(
      'card overflow-hidden transition-all border-l-4',
      isExpanded
        ? 'shadow-float border-l-amber-500'
        : 'border-l-transparent hover:border-l-amber-200',
    )}>
      {/* ── Header row ───────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-warm/40 transition-colors"
        onClick={onToggle}
      >
        <div className="text-slate-300 p-0.5"><GripVertical size={14} /></div>

        <div className={clsx(
          'w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0',
          isActive ? 'bg-slate-900 text-cream' : 'bg-slate-200 text-slate-400',
        )}>
          {d.day}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-[13px] text-slate-800 truncate">
            {d.cities || <span className="text-slate-300 italic">Ville non définie</span>}
          </p>
          <div className="flex items-center gap-3 mt-0.5">
            {d.hotel && d.hotel !== 'DÉPART' && (
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Hotel size={9} /> {d.hotel}
              </span>
            )}
            {d.km > 0 && (
              <span className="text-[10px] text-slate-400">{d.km} km</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {d.formula !== '—' && (
            <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 px-2 py-0.5 rounded-full font-black uppercase">
              {d.formula}
            </span>
          )}
          <span className={clsx(
            'text-[11px] font-bold tabular-nums',
            cost > 0 ? 'text-slate-700 dark:text-slate-300 dark:text-slate-300' : 'text-slate-300',
          )}>
            {cost > 0 ? fmt(cost) : '—'}
          </span>
          {isExpanded
            ? <ChevronUp   size={14} className="text-slate-400" />
            : <ChevronDown size={14} className="text-slate-400" />}
        </div>
      </div>

      {/* ── Expanded edit form ────────────────────────────────── */}
      {isExpanded && (
        <div className="px-5 py-4 bg-white border-t border-slate-100 space-y-4">

          {/* Basic info */}
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="text-label text-muted block mb-1">Villes</label>
              <input className="input-base text-xs" value={d.cities}
                onChange={e => onChange('cities', e.target.value)}
                placeholder="CASA → FÈS" />
            </div>
            <div>
              <label className="text-label text-muted block mb-1">Hôtel</label>
              <input className="input-base text-xs" value={d.hotel}
                onChange={e => onChange('hotel', e.target.value)}
                placeholder="Nom de l'hôtel" />
            </div>
            <div>
              <label className="text-label text-muted block mb-1">Formule</label>
              <select className="input-base text-xs" value={d.formula}
                onChange={e => onChange('formula', e.target.value)}>
                {FORMULAS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-label text-muted block mb-1">Km</label>
              <input type="number" className="input-base text-xs font-mono" value={d.km || ''}
                onChange={e => onChange('km', +e.target.value || 0)}
                placeholder="0" />
            </div>
          </div>

          {/* Cost fields */}
          <div className="grid grid-cols-7 gap-3">
            <div>
              <label className="text-label text-muted block mb-1">½ Dbl (MAD)</label>
              <input type="number" className="input-base text-xs font-mono" value={d.halfDbl || ''}
                onChange={e => onChange('halfDbl', +e.target.value || 0)} placeholder="0" />
            </div>
            <div>
              <label className="text-label text-muted block mb-1">Supp. SGL</label>
              <input type="number" className="input-base text-xs font-mono" value={d.ss || ''}
                onChange={e => onChange('ss', +e.target.value || 0)} placeholder="0" />
            </div>
            <div>
              <label className="text-label text-muted block mb-1">Taxe séjour</label>
              <input type="number" className="input-base text-xs font-mono" value={d.taxe || ''}
                onChange={e => onChange('taxe', +e.target.value || 0)} placeholder="0" />
            </div>
            <div>
              <label className="text-label text-muted block mb-1">Eau</label>
              <input type="number" className="input-base text-xs font-mono" value={d.water || ''}
                onChange={e => onChange('water', +e.target.value || 0)} placeholder="0" />
            </div>
            <div>
              <label className="text-label text-muted block mb-1">Restaurant</label>
              <input className="input-base text-xs" value={d.rest}
                onChange={e => onChange('rest', e.target.value)} placeholder="Nom" />
            </div>
            <div>
              <label className="text-label text-muted block mb-1">Prix rest.</label>
              <input type="number" className="input-base text-xs font-mono" value={d.restPrice || ''}
                onChange={e => onChange('restPrice', +e.target.value || 0)} placeholder="0" />
            </div>
            <div>
              <label className="text-label text-muted block mb-1">Guide local</label>
              <input type="number" className="input-base text-xs font-mono" value={d.lg || ''}
                onChange={e => onChange('lg', +e.target.value || 0)} placeholder="0" />
            </div>
          </div>

          {/* Monument */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-label text-muted block mb-1">Monument / Activité</label>
              <input className="input-base text-xs" value={d.monument}
                onChange={e => onChange('monument', e.target.value)}
                placeholder="Médersa, Palais, Kasbah…" />
            </div>
            <div>
              <label className="text-label text-muted block mb-1">Prix entrée / pax</label>
              <input type="number" className="input-base text-xs font-mono" value={d.monuPrice || ''}
                onChange={e => onChange('monuPrice', +e.target.value || 0)} placeholder="0" />
            </div>
          </div>

          {/* Day total + actions */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <div className="flex gap-2">
              <button
                onClick={onDuplicate}
                className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold text-slate-500 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:bg-slate-950 transition-colors"
              >
                <Copy size={10} /> Dupliquer
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 size={10} /> Supprimer
              </button>
            </div>
            <div className="text-sm font-black text-slate-700 dark:text-slate-300 dark:text-slate-300">
              Total jour : <span className="text-amber-600">{fmt(cost)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Circuit Map (SVG fallback) ───────────────────────────────────────────────
function CircuitMapSVG({ days }: { days: DayRow[] }) {
  const cities = days
    .map(d => d.cities.split(/[›→—]/)[0].trim().toUpperCase())
    .filter((c, i, a) => a.indexOf(c) === i && CITY_COORDS[c])
  const points = cities.map(c => CITY_COORDS[c]!)

  return (
    <div className="relative w-full aspect-[5/4] bg-slate-900 rounded-2xl overflow-hidden">
      <div
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      />
      <svg viewBox="0 0 100 80" className="absolute inset-0 w-full h-full p-6">
        <path d="M30 5 L60 8 L75 30 L72 65 L55 75 L20 70 L8 55 L12 25 Z"
          className="fill-white/5 stroke-white/10" strokeWidth="0.3" />
        {points.length > 1 && (
          <path
            d={`M ${points.map(p => `${p[0]} ${p[1]}`).join(' L ')}`}
            className="fill-none stroke-amber-400" strokeWidth="0.8" strokeDasharray="2 1"
          />
        )}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p[0]} cy={p[1]} r="1.8" className="fill-amber-400" />
            <text x={p[0] + 3} y={p[1] + 1} className="fill-white/50 font-bold" style={{ fontSize: '3px' }}>
              {cities[i]}
            </text>
          </g>
        ))}
      </svg>
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        <div>
          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Tracé Circuit</p>
          <p className="text-xs font-bold text-amber-200">{cities.join(' → ')}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-white/30 uppercase">Distance totale</p>
          <p className="text-sm font-black text-white">
            {days.reduce((s, d) => s + d.km, 0).toLocaleString('fr-FR')} km
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Live Pricing Grid ────────────────────────────────────────────────────────
function LivePricingGrid({ grid, loading, source, singleSupp }: {
  grid: GridRow[]; loading: boolean; source: string; singleSupp: number
}) {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-3 bg-slate-900 flex items-center justify-between">
        <div>
          <h3 className="text-white font-black text-sm">Grille Tarifaire Live</h3>
          <p className="text-slate-400 text-[10px] mt-0.5">Calcul déterministe · Règle MIN pax</p>
        </div>
        <div className="flex items-center gap-2">
          {loading && <Loader2 size={13} className="text-amber-400 animate-spin" />}
          <span className={clsx(
            'text-[9px] font-bold px-2 py-0.5 rounded-full uppercase',
            source === 'backend'
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-slate-500/20 text-slate-400',
          )}>
            {source === 'backend' ? '✓ Backend' : '⟳ Local'}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 dark:bg-slate-950">
              {['PAX', 'Coût/pax', 'Vente/pax', 'Marge/pax', 'USD/pax', 'Total Groupe'].map(h => (
                <th key={h} className="text-right py-2.5 px-4 text-[10px] font-black uppercase text-slate-400 first:text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, i) => {
              const isRef = row.pax === 20
              return (
                <tr key={row.pax} className={clsx(
                  'border-b border-slate-100 hover:bg-warm/40 transition-colors',
                  isRef ? 'bg-amber-50/40' : i % 2 === 0 ? '' : 'bg-slate-50/30',
                )}>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className={clsx(
                        'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black',
                        isRef ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600',
                      )}>
                        {row.pax}
                      </div>
                      {isRef && (
                        <span className="text-[8px] font-black text-amber-600 uppercase">Réf.</span>
                      )}
                      {(row.warnings?.length ?? 0) > 0 && (
                        <AlertTriangle size={10} className="text-amber-500" title={row.warnings!.join('\n')} />
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-right tabular-nums text-slate-500">{fmt(row.cost)}</td>
                  <td className="py-2.5 px-4 text-right">
                    <span className={clsx(
                      'tabular-nums font-black',
                      isRef ? 'text-amber-600 text-base' : 'text-slate-800',
                    )}>
                      {fmt(row.sell)}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right tabular-nums text-emerald-600 font-bold">
                    +{fmt(row.marge)}
                  </td>
                  <td className="py-2.5 px-4 text-right tabular-nums font-bold text-blue-600">
                    ${Math.round(row.usd).toLocaleString('fr-FR')}
                  </td>
                  <td className="py-2.5 px-4 text-right tabular-nums text-slate-600">
                    {fmt(row.sell * row.pax)}
                  </td>
                </tr>
              )
            })}
            {grid.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted text-sm">
                  Sélectionnez des tranches PAX dans les paramètres
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {singleSupp > 0 && (
        <div className="px-5 py-3 bg-amber-50 border-t border-amber-100 flex justify-between items-center text-[11px]">
          <div className="flex items-center gap-2 text-amber-700 font-bold">
            <Hotel size={12} />
            Supplément Chambre Single (par demande)
          </div>
          <span className="font-black text-amber-700 tabular-nums">{fmt(singleSupp)}</span>
        </div>
      )}
    </div>
  )
}

// ─── Cost Breakdown (live) ────────────────────────────────────────────────────
function CostBreakdownLive({ days, vars, refPax }: {
  days: DayRow[]; vars: VarCostRow[]; refPax: number
}) {
  const hotels    = days.reduce((s, d) => s + d.halfDbl,    0)
  const restos    = days.reduce((s, d) => s + d.restPrice,  0)
  const monu      = days.reduce((s, d) => s + d.monuPrice,  0)
  const taxes     = days.reduce((s, d) => s + d.taxe,       0)
  const water     = days.reduce((s, d) => s + d.water,      0)
  const lg        = days.reduce((s, d) => s + d.lg,         0)
  const varGroup  = vars.reduce((s, v) => s + v.total,      0)
  const varPerPax = varGroup / Math.max(refPax, 1)

  const cats = [
    { label: 'Hôtels',           value: hotels,    color: '#3B82F6', bg: 'bg-blue-500'    },
    { label: 'Restaurants',      value: restos,    color: '#F59E0B', bg: 'bg-amber-500'   },
    { label: 'Transport / Guide',value: varPerPax, color: '#10B981', bg: 'bg-emerald-500' },
    { label: 'Monuments',        value: monu,      color: '#8B5CF6', bg: 'bg-purple-500'  },
    { label: 'Taxes séjour',     value: taxes,     color: '#94A3B8', bg: 'bg-slate-400'   },
    { label: 'Eau minérale',     value: water,     color: '#38BDF8', bg: 'bg-sky-400'     },
    { label: 'Guides locaux',    value: lg,        color: '#06B6D4', bg: 'bg-cyan-500'    },
  ].filter(c => c.value > 0)

  const total = cats.reduce((s, c) => s + c.value, 0)

  return (
    <div className="space-y-3">
      {/* Stacked progress bar */}
      <div className="flex rounded-full h-3 overflow-hidden">
        {cats.map(c => (
          <div
            key={c.label}
            className={clsx(c.bg, 'transition-all duration-500')}
            style={{ width: `${(c.value / total) * 100}%` }}
            title={`${c.label}: ${fmt(c.value)}`}
          />
        ))}
      </div>

      {/* Breakdown list */}
      <div className="space-y-2">
        {cats.map(c => {
          const pct = total > 0 ? ((c.value / total) * 100).toFixed(0) : '0'
          return (
            <div key={c.label} className="flex items-center gap-2 text-[11px]">
              <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', c.bg)} />
              <span className="text-slate-500 flex-1">{c.label}</span>
              <span className="font-bold text-slate-700 dark:text-slate-300 tabular-nums">{fmt(c.value)}</span>
              <span className="text-slate-400 w-8 text-right font-mono">{pct}%</span>
            </div>
          )
        })}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px]">
        <span className="font-bold text-slate-400 uppercase text-[10px]">
          Total coût / pax ({refPax} pax)
        </span>
        <span className="font-black text-slate-800 tabular-nums">{fmt(total)}</span>
      </div>
    </div>
  )
}

// ─── Simulation Controls ──────────────────────────────────────────────────────
function SimControls({
  margin, rate, paxTiers,
  onMargin, onRate, onToggleTier,
}: {
  margin: number; rate: number; paxTiers: number[]
  onMargin: (v: number) => void
  onRate: (v: number) => void
  onToggleTier: (t: number) => void
}) {
  return (
    <div className="card p-4 space-y-4">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
        <Sliders size={12} /> Paramètres de Cotation
      </h3>

      {/* Margin slider */}
      <div>
        <label className="text-label text-muted flex justify-between mb-1.5">
          Marge commerciale
          <span className="font-black text-amber-600">{margin}%</span>
        </label>
        <input
          type="range" min="0" max="40" step="0.5" value={margin}
          onChange={e => onMargin(+e.target.value)}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{ accentColor: '#F59E0B' }}
        />
        <div className="flex justify-between text-[9px] text-slate-400 mt-1">
          <span>0%</span><span>20% Standard</span><span>40%</span>
        </div>
      </div>

      {/* Exchange rate */}
      <div>
        <label className="text-label text-muted block mb-1.5">
          Taux de change (MAD / USD)
        </label>
        <input
          type="number" min="5" max="20" step="0.1" value={rate}
          onChange={e => onRate(+e.target.value || 10.1)}
          className="input-base font-mono"
        />
      </div>

      {/* PAX tiers */}
      <div>
        <label className="text-label text-muted block mb-2">Tranches PAX actives</label>
        <div className="flex flex-wrap gap-1.5">
          {PAX_PRESETS.map(t => (
            <button
              key={t}
              onClick={() => onToggleTier(t)}
              className={clsx(
                'w-9 h-9 rounded-lg text-xs font-black transition-all',
                paxTiers.includes(t)
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// Main Page
// ══════════════════════════════════════════════════════════════════════════════

type Tab = 'circuit' | 'costs' | 'grid' | 'compare'

export function TravelDesignerPage() {

  // ── State ──────────────────────────────────────────────────────────────────
  const [days,      setDays]      = useState<DayRow[]>(initDays)
  const [vars,      setVars]      = useState<VarCostRow[]>(initVars)
  const [margin,    setMargin]    = useState(XLS_MARGIN_PCT)
  const [paxTiers,  setPaxTiers]  = useState<number[]>(DEFAULT_PAX_TIERS)
  const [rate,      setRate]      = useState(XLS_EXCHANGE_RATE)
  const [tab,       setTab]       = useState<Tab>('circuit')
  const [expanded,  setExpanded]  = useState<Set<string>>(new Set())
  const [grid,      setGrid]      = useState<GridRow[]>(() =>
    calcLocal(initDays(), initVars(), XLS_MARGIN_PCT, DEFAULT_PAX_TIERS, XLS_EXCHANGE_RATE)
  )
  const [loading,   setLoading]   = useState(false)
  const [source,    setSource]    = useState<'backend' | 'local'>('local')
  const [name,      setName]      = useState(XLS_META.reference)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  // ── Live recalculation ─────────────────────────────────────────────────────
  const recalc = useCallback(async (
    d: DayRow[], v: VarCostRow[], m: number, tiers: number[], r: number,
  ) => {
    // Instant local update
    setGrid(calcLocal(d, v, m, tiers, r))
    setSource('local')

    // Debounced backend sync
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      const res = await callSimulate(d, v, m, tiers, r)
      setLoading(false)
      if (res) { setGrid(res); setSource('backend') }
    }, 400)
  }, [])

  useEffect(() => {
    recalc(days, vars, margin, paxTiers, rate)
  }, [days, vars, margin, paxTiers, rate, recalc])

  // ── Day handlers ───────────────────────────────────────────────────────────
  const toggleExpand = (id: string) =>
    setExpanded(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })

  const updateDay = (id: string, field: keyof DayRow, val: any) =>
    setDays(prev => prev.map(d => d.id === id ? { ...d, [field]: val } : d))

  const deleteDay = (id: string) =>
    setDays(prev => prev.filter(d => d.id !== id).map((d, i) => ({ ...d, day: i + 1 })))

  const duplicateDay = (id: string) => {
    const idx = days.findIndex(d => d.id === id)
    if (idx < 0) return
    const copy: DayRow = { ...days[idx], id: uid() }
    setDays([...days.slice(0, idx + 1), copy, ...days.slice(idx + 1)].map((d, i) => ({ ...d, day: i + 1 })))
  }

  const addDay = () => {
    const next: DayRow = {
      id: uid(), day: days.length + 1, date: '', km: 0, cities: '',
      hotel: '', formula: 'HB', halfDbl: 0, ss: 0, taxe: 0, water: 40,
      rest: '', restPrice: 0, monument: '', monuPrice: 0, lg: 0,
    }
    setDays(prev => [...prev, next])
  }

  // ── Variable cost handlers ─────────────────────────────────────────────────
  const updateVar = (id: string, field: keyof VarCostRow, val: any) =>
    setVars(prev => prev.map(v => v.id === id ? { ...v, [field]: val } : v))

  const deleteVar = (id: string) =>
    setVars(prev => prev.filter(v => v.id !== id))

  const addVar = () =>
    setVars(prev => [...prev, {
      id: uid(), key: `var-${Date.now()}`, label: 'Nouveau poste',
      sub: '', total: 0, type: 'transport' as const,
    }])

  // ── PAX tier toggle ────────────────────────────────────────────────────────
  const toggleTier = (t: number) =>
    setPaxTiers(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t].sort((a, b) => a - b)
    )

  // ── Derived values ─────────────────────────────────────────────────────────
  const fixedPerPax = days.reduce((s, d) => s + dayCost(d), 0)
  const varTotal    = vars.reduce((s, v) => s + v.total, 0)
  const singleSupp  = days.reduce((s, d) => s + d.ss, 0)
  const totalKm     = days.reduce((s, d) => s + d.km, 0)
  const nights      = days.filter(d => d.formula !== '—').length
  const refPax      = paxTiers.includes(20) ? 20 : (paxTiers[Math.floor(paxTiers.length / 2)] ?? 20)
  const refRow      = grid.find(r => r.pax === refPax)

  const TABS = [
    { id: 'circuit' as Tab, label: 'Circuit Designer', icon: MapPin    },
    { id: 'costs'   as Tab, label: 'Répartition Coûts', icon: BarChart3 },
    { id: 'grid'    as Tab, label: 'Grille PAX',        icon: Users     },
    { id: 'compare' as Tab, label: 'Parité XLS',        icon: Eye       },
  ]

  return (
    <div className="min-h-full bg-slate-50/30">

      {/* ══ Header ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-slate-200 dark:border-slate-700 px-6 py-5">
        <div className="max-w-7xl mx-auto">

          {/* Title row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
                <Compass size={22} />
              </div>
              <div>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="text-xl font-black text-slate-900 dark:text-white tracking-tight bg-transparent border-none focus:outline-none focus:underline"
                />
                <div className="flex items-center gap-3 mt-0.5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Travel Designer · Cotation Interactive
                  </p>
                  {loading && (
                    <span className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                      <Loader2 size={9} className="animate-spin" /> Recalcul…
                    </span>
                  )}
                  {!loading && source === 'backend' && (
                    <span className="text-[10px] text-emerald-500 font-bold">✓ Backend sync</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setDays(initDays()); setVars(initVars()); setMargin(XLS_MARGIN_PCT) }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:bg-slate-950 transition-colors"
              >
                <RefreshCw size={12} /> Réinitialiser
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-lg shadow-md bg-gradient-to-r from-amber-500 to-orange-600 hover:-translate-y-0.5 transition-all">
                <Download size={12} /> Exporter PDF
              </button>
            </div>
          </div>

          {/* KPI Bar */}
          <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
            {[
              { label: 'Programme',     value: `${days.length}J / ${nights}N`                                    },
              { label: 'Distance',      value: `${totalKm.toLocaleString('fr-FR')} km`                           },
              { label: 'Coûts fixes',   value: fmt(fixedPerPax)                                                   },
              { label: 'Coûts vars.',   value: fmt(varTotal)                                                      },
              { label: 'Supp. Single',  value: fmt(singleSupp)                                                    },
              { label: `Vente @${refPax}pax`, value: refRow ? fmt(refRow.sell) : '—'                             },
              { label: 'Marge',         value: `${margin}%`                                                       },
            ].map(k => (
              <div key={k.label} className="bg-slate-50 dark:bg-slate-950 rounded-lg px-3 py-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{k.label}</p>
                <p className="text-sm font-bold text-slate-800 tabular-nums">{k.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ Tabs ══════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="flex items-center gap-1 mb-6">
          {TABS.map(t => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={clsx(
                  'flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg',
                  active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:bg-slate-800',
                )}
              >
                <Icon size={13} /> {t.label}
              </button>
            )
          })}
        </div>

        {/* ══ TAB : CIRCUIT DESIGNER ═══════════════════════════════════════ */}
        {tab === 'circuit' && (
          <div className="space-y-6">

            {/* Interactive map with Leaflet */}
            <TravelDesignerMap
              days={days as any}
              destinationLabel={name}
              paxCount={refPax}
            />

            <div className="grid grid-cols-12 gap-6">

              {/* Day editor list */}
              <div className="col-span-12 lg:col-span-8 space-y-2">
                {days.map(d => (
                  <DayEditorRow
                    key={d.id}
                    d={d}
                    isExpanded={expanded.has(d.id)}
                    onToggle={() => toggleExpand(d.id)}
                    onChange={(field, val) => updateDay(d.id, field, val)}
                    onDelete={() => deleteDay(d.id)}
                    onDuplicate={() => duplicateDay(d.id)}
                  />
                ))}

                {/* Add day button */}
                <button
                  onClick={addDay}
                  className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 text-xs font-bold hover:border-amber-400 hover:text-amber-500 hover:bg-amber-50/30 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Ajouter un jour
                </button>
              </div>

              {/* Sidebar */}
              <div className="col-span-12 lg:col-span-4 space-y-4">

                {/* Simulation controls */}
                <SimControls
                  margin={margin} rate={rate} paxTiers={paxTiers}
                  onMargin={setMargin} onRate={setRate} onToggleTier={toggleTier}
                />

                {/* Quick calc */}
                <div className="card p-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Calcul Rapide
                  </h3>
                  <div className="space-y-2 text-[11px]">
                    {[
                      ['Coûts fixes/pax',   fmt(fixedPerPax),                           'text-slate-700 dark:text-slate-300 dark:text-slate-300'],
                      ['Coûts variables',    fmt(varTotal),                              'text-slate-700 dark:text-slate-300 dark:text-slate-300'],
                      ['Supp. Single',       fmt(singleSupp),                            'text-amber-600'],
                    ].map(([label, val, cls]) => (
                      <div key={label as string} className="flex justify-between">
                        <span className="text-slate-500">{label}</span>
                        <span className={clsx('font-bold tabular-nums', cls)}>{val}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-100 pt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Vente @ {refPax} pax</span>
                        <span className="font-black text-emerald-600 tabular-nums">
                          {refRow ? fmt(refRow.sell) : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">En USD</span>
                        <span className="font-bold text-blue-600 tabular-nums">
                          {refRow ? `$${Math.round(refRow.usd).toLocaleString('fr-FR')}` : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Miniature pricing grid */}
                <LivePricingGrid
                  grid={grid} loading={loading} source={source} singleSupp={singleSupp}
                />
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB : RÉPARTITION COÛTS ══════════════════════════════════════ */}
        {tab === 'costs' && (
          <div className="grid grid-cols-12 gap-6">

            {/* Fixed costs breakdown */}
            <div className="col-span-12 lg:col-span-7">
              <div className="card p-5">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  Coûts Fixes / PAX · constants quelle que soit la taille du groupe
                </h3>
                <CostBreakdownLive days={days} vars={vars} refPax={refPax} />
              </div>

              {/* Structure summary table */}
              <div className="card p-5 mt-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Détail par catégorie
                </h3>
                <div className="space-y-1.5 text-[11px]">
                  {[
                    { label: 'Hôtels',             value: days.reduce((s, d) => s + d.halfDbl,    0) },
                    { label: 'Restaurants',         value: days.reduce((s, d) => s + d.restPrice,  0) },
                    { label: 'Monuments / Entrées', value: days.reduce((s, d) => s + d.monuPrice,  0) },
                    { label: 'Taxes de séjour',     value: days.reduce((s, d) => s + d.taxe,       0) },
                    { label: 'Eau minérale',        value: days.reduce((s, d) => s + d.water,      0) },
                    { label: 'Guides locaux',       value: days.reduce((s, d) => s + d.lg,         0) },
                    { label: 'Transport + Guide national', value: varTotal },
                    { label: 'Supplément Single',   value: singleSupp },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between py-1.5 border-b border-slate-50">
                      <span className="text-slate-500">{r.label}</span>
                      <span className="font-bold tabular-nums">{fmt(r.value)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 font-black text-slate-800">
                    <span>Total coûts / pax ({refPax} pax)</span>
                    <span className="tabular-nums">{fmt(fixedPerPax + varTotal / refPax)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Variable costs editor */}
            <div className="col-span-12 lg:col-span-5 space-y-4">
              <div className="card overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Coûts Variables du Groupe
                  </h3>
                  <button onClick={addVar} className="btn-primary btn-sm">
                    <Plus size={12} /> Ajouter
                  </button>
                </div>

                <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                  {vars.map(v => (
                    <div key={v.id} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:bg-slate-950 transition-colors group">
                      <select
                        value={v.type}
                        onChange={e => updateVar(v.id, 'type', e.target.value)}
                        className="text-base bg-transparent border-none focus:outline-none cursor-pointer"
                        title="Type"
                      >
                        {Object.entries(VAR_TYPE_ICONS).map(([key, icon]) => (
                          <option key={key} value={key}>{icon}</option>
                        ))}
                      </select>
                      <div className="flex-1 min-w-0">
                        <input
                          value={v.label}
                          onChange={e => updateVar(v.id, 'label', e.target.value)}
                          className="w-full text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-transparent border-none focus:outline-none truncate"
                        />
                        <input
                          value={v.sub}
                          onChange={e => updateVar(v.id, 'sub', e.target.value)}
                          className="w-full text-[9px] text-slate-400 bg-transparent border-none focus:outline-none truncate"
                          placeholder="Détail…"
                        />
                      </div>
                      <input
                        type="number" min="0"
                        value={v.total || ''}
                        onChange={e => updateVar(v.id, 'total', +e.target.value || 0)}
                        className="w-28 text-right font-mono text-[11px] bg-slate-50 dark:bg-slate-950 border border-slate-100 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-300"
                        placeholder="0"
                      />
                      <span className="text-[10px] text-slate-400">MAD</span>
                      <button
                        onClick={() => deleteVar(v.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 flex justify-between text-[11px]">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Total Variable Groupe</span>
                  <span className="font-black text-slate-800 tabular-nums">{fmt(varTotal)}</span>
                </div>
              </div>

              {/* Controls */}
              <SimControls
                margin={margin} rate={rate} paxTiers={paxTiers}
                onMargin={setMargin} onRate={setRate} onToggleTier={toggleTier}
              />
            </div>
          </div>
        )}

        {/* ══ TAB : GRILLE PAX ═════════════════════════════════════════════ */}
        {tab === 'grid' && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8">
              <LivePricingGrid
                grid={grid} loading={loading} source={source} singleSupp={singleSupp}
              />
              <div className="mt-4 text-[10px] text-slate-400 space-y-1 px-1">
                <p>Tous les prix en MAD (Dirhams Marocains) · Taux : 1 USD = {rate} MAD</p>
                <p>Règle : calcul sur le PAX minimum de chaque tranche (jamais le maximum)</p>
                <p>Supplément Single : {fmt(singleSupp)} par demande de chambre individuelle</p>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-4">
              <SimControls
                margin={margin} rate={rate} paxTiers={paxTiers}
                onMargin={setMargin} onRate={setRate} onToggleTier={toggleTier}
              />

              {/* Breakdown @ refPax */}
              <div className="card p-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Répartition @ {refPax} pax
                </h3>
                <CostBreakdownLive days={days} vars={vars} refPax={refPax} />
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB : PARITÉ XLS ═════════════════════════════════════════════ */}
        {tab === 'compare' && (
          <XlsParityCheck days={days} vars={vars} margin={margin} />
        )}
      </div>
    </div>
  )
}

// ─── XLS Parity Check ────────────────────────────────────────────────────────
function XlsParityCheck({ days, vars, margin }: {
  days: DayRow[]; vars: VarCostRow[]; margin: number
}) {
  const fixedPP  = days.reduce((s, d) => s + dayCost(d), 0)
  const varTotal = vars.reduce((s, v) => s + v.total, 0)

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
          Vérification : Calcul RIHLA vs Référence XLS (YS Travel / Giant Tour)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 dark:border-slate-700">
                {['PAX', 'XLS Coût', 'RIHLA Coût', 'Δ Coût', 'XLS Vente', 'RIHLA Vente', 'Δ Vente', 'Statut'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-[10px] font-black uppercase text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(XLS_GRID_REFERENCE).map(([paxStr, ref]) => {
                const pax      = Number(paxStr)
                const rihlaCost = Math.round(fixedPP + varTotal / pax)
                const rihlaSell = Math.round(rihlaCost * (1 + margin / 100))
                const dCost    = rihlaCost - ref.cost
                const dSell    = rihlaSell - ref.sell
                const ok       = Math.abs(dSell) < 300
                return (
                  <tr key={pax} className="border-b border-slate-100 hover:bg-slate-50 dark:bg-slate-950 dark:bg-slate-950">
                    <td className="py-2.5 px-3 font-black">{pax} PAX</td>
                    <td className="py-2.5 px-3 tabular-nums">{fmt(ref.cost)}</td>
                    <td className="py-2.5 px-3 tabular-nums">{fmt(rihlaCost)}</td>
                    <td className={clsx('py-2.5 px-3 tabular-nums font-bold',
                      Math.abs(dCost) < 100 ? 'text-emerald-600' : Math.abs(dCost) < 300 ? 'text-amber-600' : 'text-red-500'
                    )}>
                      {dCost >= 0 ? '+' : ''}{dCost}
                    </td>
                    <td className="py-2.5 px-3 tabular-nums">{fmt(ref.sell)}</td>
                    <td className="py-2.5 px-3 tabular-nums">{fmt(rihlaSell)}</td>
                    <td className={clsx('py-2.5 px-3 tabular-nums font-bold',
                      Math.abs(dSell) < 100 ? 'text-emerald-600' : Math.abs(dSell) < 300 ? 'text-amber-600' : 'text-red-500'
                    )}>
                      {dSell >= 0 ? '+' : ''}{dSell}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={clsx('text-[9px] font-black uppercase px-2 py-0.5 rounded-full',
                        ok ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      )}>
                        {ok ? 'OK' : 'DELTA'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
          Méthode de Calcul RIHLA
        </h3>
        <div className="text-[11px] text-slate-600 space-y-1.5">
          <p><strong>Fixes / pax</strong> = Hôtels + Restaurants + Monuments + Taxes + Eau + Guides locaux</p>
          <p><strong>Variables / pax</strong> = (Autocar + Guide National + Taxis + 4×4 + …) ÷ PAX</p>
          <p><strong>Coût / pax</strong> = Fixes + Variables / pax</p>
          <p><strong>Vente / pax</strong> = Coût × (1 + {margin}%)</p>
          <p className="text-[10px] text-slate-400 italic mt-2">
            Petits deltas attendus (arrondis Excel vs moteur Python RIHLA).
          </p>
        </div>
      </div>
    </div>
  )
}
