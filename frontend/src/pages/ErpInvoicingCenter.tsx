import { useState } from 'react'
import { 
  Receipt, Landmark, Globe, 
  ArrowUpRight, FileSpreadsheet, ShieldCheck, 
  History, PieChart, TrendingUp, AlertCircle,
  FileText, Download, CheckCircle2, ChevronRight,
  Database, RefreshCw
} from 'lucide-react'
import { clsx } from 'clsx'

interface InvoiceLine {
  id: string
  code: string // Code Comptable SAP/Sage
  label: string
  amount: number
  tva: number
  currency: string
}

export function ErpInvoicingCenter() {
  const [activeTab, setActiveTab] = useState<'billing' | 'ledger' | 'aging'>('billing')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 transition-colors pb-20">
      
      {/* ── HEADER FINANCE ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto flex justify-between items-end mb-10">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            Finance & ERP <ChevronRight size={10} /> Facturation HANA
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-cream tracking-tighter flex items-center gap-4">
            <Landmark className="text-emerald-600" size={36} />
            Financial Command Center
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium italic">
            Intégration comptable de niveau entreprise avec conformité fiscale et suivi multi-devises.
          </p>
        </div>

        <div className="flex gap-3">
           <button className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2">
              <FileSpreadsheet size={16} /> Export SAP (JSON/CSV)
           </button>
           <button className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:-translate-y-0.5 transition-all">
              Générer Facture HANA
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        
        {/* ── FINANCIAL SUMMARY (KPIs) ─────────────────────────── */}
        <div className="col-span-12 grid grid-cols-4 gap-6 mb-4">
           <FinanceCard label="Encaissements YTD" value="1.2M €" trend="+14%" icon={TrendingUp} color="text-emerald-500" />
           <FinanceCard label="En Attente (DSO)" value="245k €" trend="34 jours" icon={Clock} color="text-amber-500" />
           <FinanceCard label="Écart de Change" value="-2.1k €" trend="Risque USD" icon={Globe} color="text-rihla" />
           <FinanceCard label="TVA à Décaisser" value="84k MAD" trend="Q2 2024" icon={Receipt} color="text-blue-500" />
        </div>

        {/* ── MAIN LEDGER VIEW ─────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[32px] p-8 shadow-sm">
           <div className="flex gap-8 border-b border-slate-100 dark:border-white/5 mb-8">
              {['billing', 'ledger', 'aging'].map((t) => (
                <button 
                  key={t}
                  onClick={() => setActiveTab(t as any)}
                  className={clsx(
                    "pb-4 text-xs font-black uppercase tracking-widest transition-all relative",
                    activeTab === t ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {t === 'billing' ? 'Facturation Live' : t === 'ledger' ? 'Grand Livre (Mapping)' : 'Balance Âgée'}
                  {activeTab === t && <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-t-full" />}
                </button>
              ))}
           </div>

           {/* Table styled like SAP Fiori */}
           <table className="w-full text-left">
              <thead>
                 <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-white/5">
                    <th className="pb-4">Compte (SAP)</th>
                    <th className="pb-4">Libellé Prestataire</th>
                    <th className="pb-4">Base HT</th>
                    <th className="pb-4">TVA</th>
                    <th className="pb-4 text-right">Total TTC</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                 {[
                   { code: '701100', label: 'Transport Touristique VIP', ht: 12500, tva: '14%', ttc: 14250, status: 'mapped' },
                   { code: '701200', label: 'Hébergement La Mamounia', ht: 45000, tva: '10%', ttc: 49500, status: 'mapped' },
                   { code: '701300', label: 'Restauration & Events', ht: 8200, tva: '20%', ttc: 9840, status: 'pending' },
                 ].map((row, i) => (
                   <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-4 text-[11px] font-mono font-bold text-emerald-600">{row.code}</td>
                      <td className="py-4">
                         <p className="text-[12px] font-bold dark:text-cream">{row.label}</p>
                         <span className="text-[9px] text-slate-400 flex items-center gap-1">
                            {row.status === 'mapped' ? <CheckCircle2 size={10} className="text-emerald-500" /> : <AlertCircle size={10} className="text-rihla" />}
                            ERP Ready
                         </span>
                      </td>
                      <td className="py-4 text-[11px] font-medium text-slate-500">{row.ht.toLocaleString()} MAD</td>
                      <td className="py-4 text-[11px] font-medium text-slate-500">{row.tva}</td>
                      <td className="py-4 text-[12px] font-black text-right dark:text-cream">{row.ttc.toLocaleString()} MAD</td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>

        {/* ── SIDEBAR: AUDIT & COMPLIANCE ─────────────────────── */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
           {/* Compliance Widget */}
           <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="flex items-center gap-3 mb-6">
                 <ShieldCheck className="text-emerald-500" size={20} />
                 <h3 className="text-xs font-black uppercase tracking-widest">Piste d'Audit (Compliance)</h3>
              </div>
              <div className="space-y-4 relative z-10">
                 <AuditItem time="14:22" user="Chakir" msg="Facture #INV-9921 générée" />
                 <AuditItem time="10:05" user="Système" msg="Taux de change USD mis à jour (10.12)" />
                 <AuditItem time="Hier" user="Direction" msg="Validation du mapping SAP Compte 7011" />
              </div>
           </div>

           {/* FX Risk Indicator */}
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-white/10 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                 <RefreshCw size={12} className="text-rihla" /> Risque de Change Live
              </h3>
              <div className="flex items-end justify-between mb-2">
                 <span className="text-xs font-bold dark:text-cream">EUR / MAD</span>
                 <span className="text-sm font-black text-emerald-500">10.84</span>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mb-4">
                 <div className="h-full bg-emerald-500" style={{ width: '65%' }} />
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed italic">
                 "Exposition actuelle : 42k €. Couverture recommandée via contrat à terme."
              </p>
           </div>
        </div>

      </div>
    </div>
  )
}

function FinanceCard({ label, value, trend, icon: Icon, color }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[28px] p-6 shadow-sm">
       <div className="flex justify-between items-start mb-4">
          <div className={clsx("w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center", color)}>
             <Icon size={20} />
          </div>
          <span className={clsx("text-[10px] font-black", color)}>{trend}</span>
       </div>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
       <p className="text-2xl font-black dark:text-cream tracking-tight">{value}</p>
    </div>
  )
}

function AuditItem({ time, user, msg }: any) {
  return (
    <div className="flex gap-3 text-[10px]">
       <span className="text-white/30 font-mono">{time}</span>
       <p className="text-white/60 font-medium flex-1">
          <span className="text-white font-bold">{user}</span> : {msg}
       </p>
    </div>
  )
}

function Clock(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
