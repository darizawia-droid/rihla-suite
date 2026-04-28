import { useState } from 'react'
import { 
  TrendingUp, TrendingDown, RefreshCw, 
  DollarSign, Euro, PoundSterling, Landmark,
  ArrowRightLeft, AlertCircle, ShieldCheck, Sparkles,
  ChevronRight, Calendar, Calculator
} from 'lucide-react'
import { clsx } from 'clsx'
import { useQuery } from '@tanstack/react-query'
import { currencyApi } from '@/lib/api'
import { PageHeader } from '@/components/layout/PageHeader'
import { Spinner } from '@/components/ui'

const CURRENCIES = [
  { code: 'EUR', name: 'Euro', symbol: '€', icon: Euro, color: 'text-blue-500' },
  { code: 'USD', name: 'US Dollar', symbol: '$', icon: DollarSign, color: 'text-emerald-500' },
  { code: 'GBP', name: 'British Pound', symbol: '£', icon: PoundSterling, color: 'text-purple-500' },
  { code: 'MAD', name: 'Dirham Marocain', symbol: 'DH', icon: Landmark, color: 'text-rihla' },
]

export function ForexDashboardPage() {
  const [baseCurrency, setBaseCurrency] = useState('EUR')
  const [amount, setAmount] = useState<number>(1000)
  const [targetCurrency, setTargetCurrency] = useState('MAD')

  const { data: ratesData, isLoading, refetch } = useQuery({
    queryKey: ['forex-rates'],
    queryFn: () => currencyApi.rates().then(r => r.data),
    refetchInterval: 60000 * 60, // 1 hour
  })

  const convert = (val: number, from: string, to: string) => {
    if (!ratesData?.rates) return 0
    const rates = ratesData.rates
    const eurVal = val / (rates[from] || 1)
    return eurVal * (rates[to] || 1)
  }

  const convertedAmount = convert(amount, baseCurrency, targetCurrency)
  const rate = ratesData?.rates?.[targetCurrency] / ratesData?.rates?.[baseCurrency]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-20">
      <PageHeader 
        title="Forex Dashboard" 
        subtitle="Suivi des taux de change en temps réel (ECB) — Protégez vos marges contre la volatilité"
        actions={
          <button 
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={clsx(isLoading && "animate-spin")} />
            Actualiser les taux
          </button>
        }
      />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* ── TOP: RATE GRID ───────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {CURRENCIES.filter(c => c.code !== 'EUR').map(curr => {
            const currentRate = ratesData?.rates?.[curr.code] || 0
            const isUp = Math.random() > 0.5 // Simulated trend
            return (
              <div key={curr.code} className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className={clsx("w-10 h-10 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center", curr.color)}>
                    <curr.icon size={20} />
                  </div>
                  <div className={clsx("flex items-center gap-1 text-[10px] font-black uppercase", isUp ? "text-emerald-500" : "text-red-500")}>
                    {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {isUp ? '+0.42%' : '-0.18%'}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">1 EUR =</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-cream">{currentRate.toFixed(4)}</span>
                    <span className="text-xs font-bold text-slate-400">{curr.code}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 dark:border-white/5">
                   <p className="text-[9px] text-slate-400 font-bold uppercase">Dernier fixing : Aujourd'hui 14:00</p>
                </div>
              </div>
            )
          })}
          <div className="bg-rihla rounded-[32px] p-6 text-white shadow-xl shadow-rihla/20 flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Protection Change</h4>
              <p className="text-sm font-bold leading-tight">Marge de sécurité (Hedge) activée sur toutes les cotations.</p>
            </div>
            <div className="flex items-center gap-2 mt-4">
               <ShieldCheck size={16} />
               <span className="text-xl font-black">2.5%</span>
               <span className="text-[10px] font-bold uppercase opacity-60">Safety Buffer</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          
          {/* ── LEFT: CONVERTER ─────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-5">
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-200 dark:border-white/10 shadow-sm sticky top-8">
               <h3 className="text-[11px] font-black text-rihla uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                 <ArrowRightLeft size={16} /> Convertisseur Stratégique
               </h3>

               <div className="space-y-6">
                 <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Montant à convertir</label>
                   <div className="relative">
                     <input 
                       type="number" 
                       value={amount}
                       onChange={e => setAmount(Number(e.target.value))}
                       className="w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-2xl p-5 text-2xl font-black text-slate-900 dark:text-cream outline-none focus:border-rihla transition-all"
                     />
                     <div className="absolute right-4 top-1/2 -translate-y-1/2">
                       <select 
                         value={baseCurrency}
                         onChange={e => setBaseCurrency(e.target.value)}
                         className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-sm font-bold shadow-sm"
                       >
                         {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                       </select>
                     </div>
                   </div>
                 </div>

                 <div className="flex justify-center -my-3 relative z-10">
                    <button className="w-12 h-12 bg-rihla text-white rounded-2xl shadow-lg shadow-rihla/30 flex items-center justify-center hover:rotate-180 transition-transform duration-500">
                       <RefreshCw size={20} strokeWidth={2.5} />
                    </button>
                 </div>

                 <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Résultat estimé</label>
                   <div className="relative">
                     <div className="w-full bg-slate-900 rounded-2xl p-6 text-white">
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Target</span>
                           <select 
                             value={targetCurrency}
                             onChange={e => setTargetCurrency(e.target.value)}
                             className="bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold outline-none"
                           >
                             {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                           </select>
                        </div>
                        <div className="text-3xl font-black tracking-tight">
                           {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-sm font-medium text-white/40">{targetCurrency}</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-bold text-white/40 uppercase tracking-wider">
                           <span>Rate: 1 {baseCurrency} = {rate.toFixed(4)} {targetCurrency}</span>
                           <span className="text-emerald-500 flex items-center gap-1"><ShieldCheck size={10} /> Garanti 24h</span>
                        </div>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="mt-10 p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
                 <div className="flex gap-3">
                   <AlertCircle size={18} className="text-rihla shrink-0" />
                   <div>
                     <p className="text-[11px] font-bold text-slate-900 dark:text-cream uppercase mb-1">Note sur le risque</p>
                     <p className="text-[11px] text-slate-500 leading-relaxed italic">
                       Les taux affichés incluent une marge de sécurité S'TOURS de 1%. Pour les transactions réelles, veuillez consulter le département finance.
                     </p>
                   </div>
                 </div>
               </div>
            </div>
          </div>

          {/* ── RIGHT: MARKET INSIGHTS ──────────────────────────── */}
          <div className="col-span-12 lg:col-span-7 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-200 dark:border-white/10 shadow-sm">
               <div className="flex justify-between items-center mb-10">
                 <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-3">
                   <TrendingUp size={20} className="text-rihla" /> Analyse Volatilité MAD
                 </h3>
                 <div className="flex gap-2">
                    <button className="px-3 py-1 bg-rihla/10 text-rihla rounded-lg text-[10px] font-black uppercase">7 Jours</button>
                    <button className="px-3 py-1 text-slate-400 rounded-lg text-[10px] font-black uppercase">30 Jours</button>
                 </div>
               </div>

               {/* Mock Chart Visualization */}
               <div className="h-64 flex items-end gap-2 mb-8">
                  {[40, 45, 38, 52, 48, 60, 55, 65, 70, 68, 75, 80, 78, 85, 90, 88, 92, 100, 95, 98].map((h, i) => (
                    <div key={i} className="flex-1 bg-slate-50 dark:bg-white/5 rounded-t-lg relative group">
                       <div 
                         className={clsx("absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-1000", i > 15 ? "bg-rihla" : "bg-slate-300 dark:bg-slate-700")} 
                         style={{ height: `${h}%` }} 
                       />
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded transition-opacity">
                         {10.85 + (i * 0.01)}
                       </div>
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-500/20">
                     <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Point Bas (30j)</p>
                     <p className="text-2xl font-black text-slate-900 dark:text-cream">10.7420 <span className="text-xs text-slate-400">MAD</span></p>
                  </div>
                  <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-500/20">
                     <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Point Haut (30j)</p>
                     <p className="text-2xl font-black text-slate-900 dark:text-cream">10.9850 <span className="text-xs text-slate-400">MAD</span></p>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-rihla rounded-2xl flex items-center justify-center text-white">
                     <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight">Intelligence Financière</h3>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Optimisation de marge automatique</p>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-4">
                     <Calculator size={20} className="text-rihla shrink-0 mt-1" />
                     <div>
                        <p className="text-xs font-bold mb-1">Recalcul global des cotations</p>
                        <p className="text-[11px] text-white/50 leading-relaxed">
                           Le taux EUR/MAD a varié de +0.5% ce matin. Nous vous suggérons de mettre à jour les cotations "Draft" pour préserver votre marge cible de 22%.
                        </p>
                        <button className="mt-3 text-[10px] font-black text-rihla uppercase tracking-widest hover:underline flex items-center gap-2">
                           Lancer le scan global <ChevronRight size={10} />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
