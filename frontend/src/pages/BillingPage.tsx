import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  CreditCard, CheckCircle2, Clock, AlertCircle,
  Download, Send, Plus, DollarSign, TrendingUp,
  Calendar, FileText, ChevronRight, Banknote, RefreshCw
} from 'lucide-react'
import { invoicesApi } from '@/lib/api'
import { clsx } from 'clsx'

// ── Constants ──────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  paid:    'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  sent:    'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  issued:  'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  draft:   'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400',
  cancelled: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
}

const FX: Record<string, number> = { MAD: 1, EUR: 0.091, USD: 0.099 }

export function BillingPage() {
  const [currency, setCurrency] = useState<'MAD' | 'EUR' | 'USD'>('MAD')

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => invoicesApi.list({ limit: 200 }).then(r => r.data)
  })

  const fmt = (v: number) => 
    (v * FX[currency]).toLocaleString('fr-FR', { 
      minimumFractionDigits: currency === 'MAD' ? 0 : 2,
      maximumFractionDigits: currency === 'MAD' ? 0 : 2 
    })

  // ── Stats Calculations ──────────────────────────────────────────
  const stats = useMemo(() => {
    if (!invoices) return { total: 0, paid: 0, due: 0, count: 0, paidCount: 0 }
    
    const total = invoices.reduce((a: number, i: any) => a + Number(i.total || 0), 0)
    const paid = invoices.filter((i: any) => i.status === 'paid')
                        .reduce((a: number, i: any) => a + Number(i.total || 0), 0)
     const recoveryRate = stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0

  const [activeTab, setActiveTab] = useState<'clients' | 'suppliers'>('clients')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-white/5 px-8 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4 flex-wrap">
          <div className="flex items-center gap-8">
            <div>
              <h1 className="text-[22px] font-semibold text-slate-900 dark:text-cream tracking-tight">Cockpit Financier</h1>
              <p className="text-[13px] text-slate-500 mt-0.5">Flux de trésorerie · Payouts Fournisseurs · Invoicing</p>
            </div>
            <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border dark:border-white/10">
              <button 
                onClick={() => setActiveTab('clients')}
                className={clsx("px-4 py-2 rounded-xl text-xs font-black transition-all", activeTab === 'clients' ? "bg-white dark:bg-slate-800 text-rihla shadow-sm" : "text-slate-400")}
              >
                Clients (Recevables)
              </button>
              <button 
                onClick={() => setActiveTab('suppliers')}
                className={clsx("px-4 py-2 rounded-xl text-xs font-black transition-all", activeTab === 'suppliers' ? "bg-white dark:bg-slate-800 text-rihla shadow-sm" : "text-slate-400")}
              >
                Fournisseurs (Dettes)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border dark:border-white/10">
              {(['MAD', 'EUR', 'USD'] as const).map(c => (
                <button 
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={clsx(
                    "px-4 py-1.5 rounded-lg text-xs font-black transition-all",
                    currency === c ? "bg-white dark:bg-slate-800 text-klein shadow-sm" : "text-slate-400 hover:text-ink"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-ink text-cream text-xs font-bold rounded-xl shadow-xl hover:-translate-y-0.5 transition-all">
              <Plus size={16} /> {activeTab === 'clients' ? 'Nouvelle Facture' : 'Nouvel Acompte'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        
        {/* Financial KPIs */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="col-span-1 bg-ink text-white p-8 rounded-[40px] relative overflow-hidden shadow-2xl">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-klein/20 rounded-full blur-2xl" />
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Cash Flow Pulse</p>
            <p className="text-4xl font-black">{fmt(stats.total - (stats.total * 0.72))} <span className="text-lg opacity-30">{currency}</span></p>
            
            <div className="mt-8 pt-8 border-t border-white/10 flex gap-6">
              <div>
                <p className="text-[9px] text-white/30 uppercase font-bold mb-1">Inbound (Clients)</p>
                <p className="text-lg font-black text-emerald-400">{fmt(stats.total)}</p>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <p className="text-[9px] text-white/30 uppercase font-bold mb-1">Outbound (Fournisseurs)</p>
                <p className="text-lg font-black text-rihla">{fmt(stats.total * 0.72)}</p>
              </div>
            </div>
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-6">
            {[
              { label: activeTab === 'clients' ? 'Factures Soldées' : 'Acomptes Réglés', value: activeTab === 'clients' ? stats.paidCount : '14', sub: `Sur ${activeTab === 'clients' ? stats.count : '22'} total`, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { label: activeTab === 'clients' ? 'En Attente / Retard' : 'Paiements Dus', value: activeTab === 'clients' ? stats.count - stats.paidCount : '8', sub: 'Paiements à relancer', icon: Clock, color: 'text-rihla', bg: 'bg-rihla/5' },
              { label: 'Taux de Recouvrement', value: `${recoveryRate}%`, sub: 'Performance financière', icon: TrendingUp, color: 'text-klein', bg: 'bg-klein/5' },
              { label: 'Délai Moyen Paiement', value: '18 Jours', sub: 'Depuis émission', icon: Calendar, color: 'text-ink', bg: 'bg-slate-50' },
            ].map((kpi, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-6 shadow-sm group hover:border-klein/30 transition-all">
                <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", kpi.bg, kpi.color)}>
                  <kpi.icon size={20} />
                </div>
                <p className="text-2xl font-black text-ink dark:text-cream">{kpi.value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{kpi.label}</p>
                <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-1">{kpi.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Table */}
        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
            <h3 className="font-black text-ink dark:text-cream flex items-center gap-3 text-sm uppercase tracking-wider">
              {activeTab === 'clients' ? <FileText size={20} className="text-klein" /> : <Banknote size={20} className="text-amber-500" />}
              {activeTab === 'clients' ? 'Registre des Ventes' : 'Registre des Payouts Fournisseurs'}
            </h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase text-slate-400 hover:text-ink border border-slate-100 rounded-xl transition-all">
                <Download size={14} /> Exporter Rapport
              </button>
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 bg-slate-50/50">
                <th className="px-8 py-4">{activeTab === 'clients' ? 'Référence' : 'Partenaire'}</th>
                <th className="px-6 py-4">{activeTab === 'clients' ? 'Client B2B' : 'Prestation'}</th>
                <th className="px-6 py-4">{activeTab === 'clients' ? 'Total Facturé' : 'Montant Dû'}</th>
                <th className="px-6 py-4">{activeTab === 'clients' ? 'Encaissement' : 'Taxes / Frais'}</th>
                <th className="px-6 py-4">{activeTab === 'clients' ? 'Échéance' : 'Date Paiement'}</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-20 text-slate-300 font-bold uppercase tracking-widest text-xs">Chargement des finances...</td></tr>
              ) : activeTab === 'clients' ? (
                invoices?.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="font-mono font-bold text-xs text-ink">{inv.number}</span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-ink">{inv.client_name || 'Client Inconnu'}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 italic">Projet ID: {inv.project_id?.slice(-6)}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-ink">{fmt(inv.total)}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{currency}</p>
                    </td>
                    <td className="px-6 py-5 w-40">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={clsx("h-full rounded-full transition-all", inv.status === 'paid' ? "bg-emerald-500" : "bg-rihla")}
                            style={{ width: inv.status === 'paid' ? '100%' : '30%' }}
                          />
                        </div>
                        <span className="text-[10px] font-black text-slate-500 w-8">{inv.status === 'paid' ? '100%' : '30%'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar size={12} /> {inv.created_at?.split('T')[0] || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={clsx("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider", STATUS_STYLES[inv.status] || STATUS_STYLES.draft)}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 rounded-lg text-slate-400 hover:text-klein hover:bg-klein/5 transition-all"><Send size={14} /></button>
                        <button className="p-2 rounded-lg text-slate-400 hover:text-ink hover:bg-slate-100 transition-all"><Download size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // MOCK SUPPLIER PAYOUTS
                [
                  { id: 's1', partner: 'La Mamounia', service: 'Hébergement Group B', amount: 145000, status: 'pending', date: '2026-05-12' },
                  { id: 's2', partner: 'Atlas Sky Guide', service: 'Guides Trekking Toubkal', amount: 12500, status: 'approved', date: '2026-05-08' },
                  { id: 's3', partner: 'Zahara Tours Transport', service: 'Transferts VIP Casablanca', amount: 48000, status: 'paid', date: '2026-04-25' },
                ].map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 text-xs font-bold text-ink">{p.partner}</td>
                    <td className="px-6 py-5 text-xs text-slate-500 font-medium">{p.service}</td>
                    <td className="px-6 py-5 text-sm font-black text-ink">{fmt(p.amount)}</td>
                    <td className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase">HT + TVA 20%</td>
                    <td className="px-6 py-5 text-xs text-slate-500">{p.date}</td>
                    <td className="px-6 py-5">
                       <span className={clsx("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider", 
                         p.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : p.status === 'approved' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600')}>
                         {p.status}
                       </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <button className="px-4 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-rihla transition-all">
                         Payer maintenant
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
over:scale-105 transition-all">
                    RELANCER CLIENT
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

