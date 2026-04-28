import { useState, useMemo } from 'react'
import {
  Plane, ChevronRight, Search, ArrowRight,
  Clock, DollarSign, ArrowUpDown, Filter,
  Star, ExternalLink, CheckCircle2, Plus,
  Calendar, Users, Sparkles, AlertCircle,
  RefreshCw, Luggage, Loader2
} from 'lucide-react'
import { clsx } from 'clsx'
import { useQuery, useMutation } from '@tanstack/react-query'
import { flightSearchApi, FlightResult, FlightSearchParams } from '@/lib/api'

const fmt = (n: number) => n.toLocaleString('fr-FR')

export function FlightSearchPage() {
  const [params, setParams] = useState<FlightSearchParams>({
    origin: 'PAR',
    destination: 'CMN',
    depart_date: '2026-06-10',
    return_date: '2026-06-20',
    pax: 12,
    cabin_class: 'economy',
  })

  const [selectedOutboundId, setSelectedOutboundId] = useState<string | null>(null)
  const [selectedReturnId, setSelectedReturnId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price')
  const [directOnly, setDirectOnly] = useState(false)

  const searchMutation = useMutation({
    mutationFn: (p: FlightSearchParams) => flightSearchApi.search(p).then(res => res.data),
    onSuccess: () => {
      setSelectedOutboundId(null)
      setSelectedReturnId(null)
    }
  })

  const results = searchMutation.data || { outbound: [], inbound: [], currency: 'EUR' }

  const sortedOutbound = useMemo(() => {
    return [...results.outbound]
      .filter(f => !directOnly || f.stops === 0)
      .sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price
        if (sortBy === 'duration') return a.duration.localeCompare(b.duration)
        return a.departure.time.localeCompare(b.departure.time)
      })
  }, [results.outbound, directOnly, sortBy])

  const sortedInbound = useMemo(() => {
    return [...results.inbound]
      .filter(f => !directOnly || f.stops === 0)
      .sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price
        if (sortBy === 'duration') return a.duration.localeCompare(b.duration)
        return a.departure.time.localeCompare(b.departure.time)
      })
  }, [results.inbound, directOnly, sortBy])

  const selectedOut = results.outbound.find(f => f.id === selectedOutboundId)
  const selectedRet = results.inbound.find(f => f.id === selectedReturnId)
  const totalPerPax = (selectedOut?.price || 0) + (selectedRet?.price || 0)
  const totalGroup = totalPerPax * (params.pax || 1)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchMutation.mutate(params)
  }

      {/* ── SEARCH FORM ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-sm">
          <div className="grid grid-cols-6 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Origine</label>
              <input type="text" value={params.origin} onChange={e => setParams(p => ({ ...p, origin: e.target.value }))} placeholder="Ex: PAR, LHR..." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rihla/30 uppercase" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Destination</label>
              <input type="text" value={params.destination} onChange={e => setParams(p => ({ ...p, destination: e.target.value }))} placeholder="Ex: CMN, RAK..." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rihla/30 uppercase" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Aller</label>
              <input type="date" value={params.depart_date} onChange={e => setParams(p => ({ ...p, depart_date: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-rihla/30" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Retour</label>
              <input type="date" value={params.return_date} onChange={e => setParams(p => ({ ...p, return_date: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-rihla/30" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Passagers</label>
              <input type="number" value={params.pax} onChange={e => setParams(p => ({ ...p, pax: Number(e.target.value) }))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-rihla/30" />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={searchMutation.isPending}
                className="w-full px-4 py-2.5 bg-rihla text-white rounded-xl text-sm font-black uppercase shadow-lg shadow-rihla/20 hover:bg-rihla/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {searchMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Rechercher
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">

        {/* ── LEFT: FILTERS ──────────────────────────────────────── */}
        <div className="col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Filter size={14} /> Filtres
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={directOnly} onChange={() => setDirectOnly(!directOnly)} className="w-4 h-4 rounded border-slate-300 text-rihla focus:ring-rihla" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Vols directs uniquement</span>
              </label>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
              <div className="text-[10px] font-black text-slate-400 uppercase mb-3">Trier par</div>
              {[
                { key: 'price', label: 'Prix', icon: DollarSign },
                { key: 'duration', label: 'Durée', icon: Clock },
                { key: 'departure', label: 'Heure départ', icon: Clock },
              ].map(s => (
                <button
                  key={s.key}
                  onClick={() => setSortBy(s.key as typeof sortBy)}
                  className={clsx(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all mb-1",
                    sortBy === s.key ? "bg-rihla/10 text-rihla font-bold" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5"
                  )}
                >
                  <s.icon size={12} /> {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selection summary */}
          {(selectedOutboundId || selectedReturnId) && (
            <div className="bg-rihla/5 border border-rihla/20 rounded-3xl p-6 animate-in zoom-in-95 duration-300">
              <h3 className="text-[10px] font-black text-rihla uppercase tracking-widest mb-4">Sélection Vol + Circuit</h3>
              {selectedOut && (
                <div className="mb-3">
                  <div className="text-[10px] text-slate-400 uppercase mb-1">Aller</div>
                  <div className="text-xs font-bold">{selectedOut.airline} — {selectedOut.flight_number}</div>
                  <div className="text-xs text-slate-500">{selectedOut.departure.time} → {selectedOut.arrival.time}</div>
                  <div className="text-xs font-bold text-rihla">{selectedOut.price} {results.currency}</div>
                </div>
              )}
              {selectedRet && (
                <div className="mb-3">
                  <div className="text-[10px] text-slate-400 uppercase mb-1">Retour</div>
                  <div className="text-xs font-bold">{selectedRet.airline} — {selectedRet.flight_number}</div>
                  <div className="text-xs text-slate-500">{selectedRet.departure.time} → {selectedRet.arrival.time}</div>
                  <div className="text-xs font-bold text-rihla">{selectedRet.price} {results.currency}</div>
                </div>
              )}
              <div className="pt-3 border-t border-rihla/20">
                <div className="flex justify-between text-xs">
                  <span>Total/pax :</span>
                  <span className="font-black text-rihla">{fmt(totalPerPax)} {results.currency}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>Total groupe ({params.pax} pax) :</span>
                  <span className="font-black">{fmt(totalGroup)} {results.currency}</span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-3 bg-rihla text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-rihla/20 hover:bg-rihla/90 transition-all">
                <Plus size={14} className="inline mr-1" /> Ajouter au devis
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT: RESULTS ──────────────────────────────────────── */}
        <div className="col-span-9 space-y-6">
          {searchMutation.isPending ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 p-12 text-center">
              <Loader2 className="text-rihla animate-spin mx-auto mb-4" size={48} />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Recherche en cours sur les GDS...</p>
            </div>
          ) : !searchMutation.isIdle && results.outbound.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 p-12 text-center">
              <Plane size={48} className="text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Aucun vol trouvé</p>
            </div>
          ) : (
            <>
              {/* Outbound */}
              {results.outbound.length > 0 && (
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-cream uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Plane size={16} className="text-rihla" /> Vols Aller — {params.depart_date}
                  </h3>
                  <div className="space-y-3">
                    {sortedOutbound.map(f => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedOutboundId(f.id)}
                        className={clsx(
                          "w-full bg-white dark:bg-slate-900 rounded-2xl border p-5 text-left transition-all hover:shadow-md",
                          selectedOutboundId === f.id ? "border-rihla shadow-lg shadow-rihla/10" : "border-slate-200 dark:border-white/10 shadow-sm"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-sm font-black text-slate-600 dark:text-slate-400">
                              {f.airline_code}
                            </div>
                            <div>
                              <div className="text-xs text-slate-500">{f.airline}</div>
                              <div className="text-sm font-bold text-slate-900 dark:text-white">{f.flight_number}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-lg font-black text-slate-900 dark:text-cream">{f.departure.time}</div>
                              <div className="text-[10px] text-slate-400">{f.departure.code}</div>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="text-[10px] text-slate-400">{f.duration}</div>
                              <div className="w-20 h-px bg-slate-300 dark:bg-white/20 relative my-1">
                                <Plane size={10} className="absolute -top-1 right-0 text-slate-400" />
                              </div>
                              <div className="text-[10px] text-slate-400">{f.stops === 0 ? 'Direct' : `${f.stops} escale${f.stops > 1 ? 's' : ''}`}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-black text-slate-900 dark:text-cream">{f.arrival.time}</div>
                              <div className="text-[10px] text-slate-400">{f.arrival.code}</div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xl font-black text-rihla">{f.price} {results.currency}</div>
                            <div className="text-[10px] text-slate-400">par personne</div>
                            {f.seats_left < 5 && <div className="text-[10px] text-red-500 font-bold mt-1">{f.seats_left} places restantes</div>}
                            {f.recommended && (
                              <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-[9px] font-bold">
                                <Star size={8} /> Recommandé
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 dark:border-white/5 text-[10px] text-slate-400">
                          <span><Luggage size={10} className="inline" /> {f.baggage}</span>
                          <span>Groupe ({params.pax} pax): <span className="font-bold text-slate-600 dark:text-slate-300">{fmt(f.price * (params.pax || 1))} {results.currency}</span></span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Return flights */}
              {results.inbound.length > 0 && (
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-cream uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Plane size={16} className="text-rihla rotate-180" /> Vols Retour — {params.return_date}
                  </h3>
                  <div className="space-y-3">
                    {sortedInbound.map(f => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedReturnId(f.id)}
                        className={clsx(
                          "w-full bg-white dark:bg-slate-900 rounded-2xl border p-5 text-left transition-all hover:shadow-md",
                          selectedReturnId === f.id ? "border-rihla shadow-lg shadow-rihla/10" : "border-slate-200 dark:border-white/10 shadow-sm"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-sm font-black text-slate-600 dark:text-slate-400">{f.airline_code}</div>
                            <div>
                              <div className="text-xs text-slate-500">{f.airline}</div>
                              <div className="text-sm font-bold text-slate-900 dark:text-white">{f.flight_number}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-lg font-black">{f.departure.time}</div>
                              <div className="text-[10px] text-slate-400">{f.departure.code}</div>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="text-[10px] text-slate-400">{f.duration}</div>
                              <div className="w-20 h-px bg-slate-300 dark:bg-white/20 my-1" />
                              <div className="text-[10px] text-slate-400">{f.stops === 0 ? 'Direct' : `${f.stops} escale${f.stops > 1 ? 's' : ''}`}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-black">{f.arrival.time}</div>
                              <div className="text-[10px] text-slate-400">{f.arrival.code}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-black text-rihla">{f.price} {results.currency}</div>
                            <div className="text-[10px] text-slate-400">par personne</div>
                            {f.recommended && (
                              <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-[9px] font-bold">
                                <Star size={8} /> Recommandé
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* API notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-700 dark:text-blue-400">
              <strong>Intégration API :</strong> Les résultats sont actuellement simulés via le provider {results.provider || 'Skyscanner'}. Connectez votre clé API Amadeus ou Skyscanner dans les paramètres pour obtenir les prix réels.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
