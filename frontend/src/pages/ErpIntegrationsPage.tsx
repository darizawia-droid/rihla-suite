import { useState, useEffect } from 'react'
import { 
  Plug, Database, RefreshCw, CheckCircle2, 
  AlertCircle, ArrowRight, ShieldCheck, 
  FileJson, Table, Terminal, Activity,
  Lock, History, Download, Filter, Search
} from 'lucide-react'
import { clsx } from 'clsx'

interface SyncEvent {
  id: string
  entity: string
  action: 'PUSH' | 'PULL' | 'SYNC'
  status: 'success' | 'warning' | 'error'
  message: string
  timestamp: string
}

const MOCK_SYNC_LOG: SyncEvent[] = [
  { id: '1', entity: 'Invoice #INV-2026-001', action: 'PUSH', status: 'success', message: 'Exporté vers SAP S/4HANA - Document #882910', timestamp: '15:20:04' },
  { id: '2', entity: 'Master Data: Hotels', action: 'PULL', status: 'success', message: 'Synchronisation des fiches fournisseurs terminée (42 fiches)', timestamp: '14:45:12' },
  { id: '3', entity: 'Budget: Project ST-992', action: 'PULL', status: 'warning', message: 'Écart de 2% détecté entre RIHLA et SAP budget', timestamp: '12:30:00' },
  { id: '4', entity: 'Invoice #INV-2026-002', action: 'PUSH', status: 'error', message: 'Code de taxe inconnu dans SAP (MAR_VAT_20)', timestamp: '11:15:30' },
]

export function ErpIntegrationsPage() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [activeTab, setActiveTab] = useState<'connectors' | 'audit'>('connectors')

  const triggerSync = () => {
    setIsSyncing(true)
    setTimeout(() => setIsSyncing(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 transition-colors">
      
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto flex justify-between items-end mb-12">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">
             Enterprise Connectivity <Plug size={12} /> SAP Ready
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-cream tracking-tighter">Connecteurs ERP</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium italic">
             Synchronisation de la donnée financière RIHLA avec les systèmes comptables SAP, Oracle et Microsoft Dynamics.
          </p>
        </div>
        
        <div className="flex gap-2 p-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl">
           <button 
             onClick={() => setActiveTab('connectors')}
             className={clsx("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'connectors' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-slate-600")}
           >Connecteurs</button>
           <button 
             onClick={() => setActiveTab('audit')}
             className={clsx("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'audit' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-slate-600")}
           >Audit Trail</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">
        
        {activeTab === 'connectors' ? (
          <>
            {/* ── SAP STATUS CARD (7 cols) ────────────────────────────── */}
            <div className="col-span-7 bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
               {/* Background SAP Logo Style */}
               <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
               
               <div className="flex justify-between items-start mb-12">
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/20">
                        <Database size={32} />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-cream tracking-tight">SAP S/4HANA</h3>
                        <div className="flex items-center gap-2 mt-1">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Connecté · Live</span>
                        </div>
                     </div>
                  </div>
                  <button 
                    onClick={triggerSync}
                    disabled={isSyncing}
                    className={clsx(
                      "flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                      isSyncing ? "bg-slate-100 text-slate-400 cursor-wait" : "bg-blue-600 text-white hover:-translate-y-1 shadow-lg shadow-blue-600/20"
                    )}
                  >
                     <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? 'Synchronisation…' : 'Sync Maintenant'}
                  </button>
               </div>

               <div className="grid grid-cols-2 gap-6 mb-12">
                  <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Dernière Sync Factures</p>
                     <p className="text-lg font-black">Aujourd'hui, 15:20</p>
                  </div>
                  <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Mappage Cost Centers</p>
                     <p className="text-lg font-black text-emerald-500">100% Validé</p>
                  </div>
               </div>

               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Flux de Synchronisation (Dernières 24h)</h4>
               <div className="space-y-3">
                  {MOCK_SYNC_LOG.map(log => (
                    <div key={log.id} className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-white/2 rounded-2xl border border-slate-100 dark:border-white/5 group hover:bg-white dark:hover:bg-white/5 transition-all">
                       <div className={clsx(
                         "w-8 h-8 rounded-lg flex items-center justify-center",
                         log.status === 'success' ? "bg-emerald-500/10 text-emerald-500" : log.status === 'error' ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                       )}>
                          {log.status === 'success' ? <CheckCircle2 size={16} /> : log.status === 'error' ? <AlertCircle size={16} /> : <Activity size={16} />}
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-0.5">
                             <p className="text-[11px] font-black truncate">{log.entity}</p>
                             <span className="text-[9px] text-slate-400 font-bold">{log.timestamp}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate">{log.message}</p>
                       </div>
                       <div className="px-2 py-1 bg-white dark:bg-white/5 rounded-md text-[8px] font-black text-slate-400 uppercase">
                          {log.action}
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* ── MAPPING & CONFIG (5 cols) ─────────────────────────── */}
            <div className="col-span-5 space-y-6">
               <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl border border-white/5">
                  <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                     <Table size={20} className="text-blue-400" /> Mapping Comptable
                  </h3>
                  <div className="space-y-4">
                     {[
                       { rihla: 'Vente Package', sap: '706000 - Services Sales' },
                       { rihla: 'TVA Maroc (20%)', sap: 'VAT_MA_20' },
                       { rihla: 'Acompte Client', sap: '411100 - Customer Advance' },
                     ].map((m, i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div>
                             <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">RIHLA</p>
                             <p className="text-[11px] font-bold">{m.rihla}</p>
                          </div>
                          <ArrowRight size={14} className="text-blue-400" />
                          <div className="text-right">
                             <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">SAP S/4</p>
                             <p className="text-[11px] font-bold text-blue-300">{m.sap}</p>
                          </div>
                       </div>
                     ))}
                  </div>
                  <button className="w-full mt-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                     Éditer le Mappage
                  </button>
               </div>

               <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-200 dark:border-white/10 shadow-sm">
                  <h3 className="text-sm font-black text-slate-900 dark:text-cream uppercase tracking-wider mb-6 flex items-center gap-2">
                     <ShieldCheck size={18} className="text-blue-600" /> Certificats & Sécurité
                  </h3>
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                        <Lock size={24} />
                     </div>
                     <div>
                        <p className="text-xs font-black">Mutual TLS (mTLS)</p>
                        <p className="text-[10px] text-slate-500">Certificat valide jusqu'au 12.01.2027</p>
                     </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                     <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Endpoint API SAP</p>
                     <code className="text-[10px] font-mono text-blue-600 break-all">https://api.sours-group.sap.com/v1/finance</code>
                  </div>
               </div>
            </div>
          </>
        ) : (
          /* ── AUDIT TRAIL VIEW (12 cols) ────────────────────────── */
          <div className="col-span-12 bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden flex flex-col h-[700px]">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-slate-900 dark:text-cream tracking-tighter flex items-center gap-4">
                   <History size={28} className="text-blue-600" /> Forensic Audit Trail
                </h3>
                <div className="flex gap-4">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Chercher ID, User, Action..." 
                        className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-white/5 rounded-xl text-xs outline-none border border-transparent focus:border-blue-500/30"
                      />
                   </div>
                   <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                      <Download size={14} /> Export Logs
                   </button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="border-b border-slate-100 dark:border-white/5">
                         <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Horodatage</th>
                         <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Utilisateur</th>
                         <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Module</th>
                         <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                         <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Détails de la modification</th>
                         <th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Signature</th>
                      </tr>
                   </thead>
                   <tbody className="text-xs">
                      {[
                        { time: '16:02:11', user: 'ahmed_finance', module: 'PRICING', action: 'MARGIN_UPDATE', details: 'Marge modifiée de 15% à 18.4% (Projet ST-992)', hash: 'f2a9...' },
                        { time: '15:45:00', user: 'system_sap_sync', module: 'ERP', action: 'INVOICE_PUSH', details: 'Facture #INV-001 exportée vers SAP', hash: 'e812...' },
                        { time: '14:20:55', user: 'mary_sales', module: 'ITINERARY', action: 'FLIGHT_CHANGE', details: 'Modification vol TK-618 par AT-402', hash: 'b991...' },
                        { time: '12:05:30', user: 'admin_root', module: 'SECURITY', action: 'PERM_GRANT', details: 'Accès War Room accordé à "john_ops"', hash: 'a112...' },
                        { time: '10:00:00', user: 'ahmed_finance', module: 'PRICING', action: 'DISCOUNT_AUTH', details: 'Remise de 500€ autorisée pour Prestige Tours', hash: 'c556...' },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-slate-50 dark:border-white/2 hover:bg-slate-50/50 dark:hover:bg-white/2 transition-all">
                           <td className="py-5 font-bold text-slate-400">{row.time}</td>
                           <td className="py-5">
                              <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 rounded-md bg-blue-600/10 text-blue-600 flex items-center justify-center font-black text-[10px]">{row.user[0].toUpperCase()}</div>
                                 <span className="font-bold">{row.user}</span>
                              </div>
                           </td>
                           <td className="py-5">
                              <span className="px-2 py-1 bg-slate-100 dark:bg-white/5 rounded text-[9px] font-black uppercase text-slate-500">{row.module}</span>
                           </td>
                           <td className="py-5">
                              <span className="font-black text-blue-600">{row.action}</span>
                           </td>
                           <td className="py-5 text-slate-600 dark:text-slate-400 font-medium">
                              {row.details}
                           </td>
                           <td className="py-5 text-right">
                              <code className="text-[10px] bg-slate-100 dark:bg-black/20 px-2 py-1 rounded text-slate-400">{row.hash}</code>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}
      </div>

    </div>
  )
}
