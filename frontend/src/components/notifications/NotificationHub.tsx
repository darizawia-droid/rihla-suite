import { useState, useEffect } from 'react'
import { 
  Bell, CheckCircle2, AlertCircle, 
  Clock, MapPin, Plane, 
  MessageSquare, Star, X
} from 'lucide-react'
import { clsx } from 'clsx'

export interface AppNotification {
  id: string
  type: 'info' | 'success' | 'warning' | 'urgent'
  title: string
  message: string
  time: string
  isRead: boolean
  category: 'ops' | 'client' | 'finance'
}

const MOCK_NOTIFS: AppNotification[] = [
  { id: '1', type: 'urgent', title: 'SOS CLIENT', message: 'M. Dubois a besoin d\'assistance médicale (Riad Fès).', time: 'Il y a 2 min', isRead: false, category: 'ops' },
  { id: '2', type: 'info', title: 'VOL ATTERRI', message: 'Le vol AF1234 est arrivé à Marrakech avec 10 min d\'avance.', time: 'Il y a 15 min', isRead: false, category: 'ops' },
  { id: '3', type: 'success', title: 'PAIEMENT REÇU', message: 'L\'agence Luxury Travel a réglé le solde du dossier Smith.', time: 'Il y a 1h', isRead: true, category: 'finance' },
  { id: '4', type: 'warning', title: 'RETARD CHAUFFEUR', message: 'Hassan E. signale un embouteillage sur la route d\'Ourika.', time: 'Il y a 3h', isRead: true, category: 'ops' },
]

export function NotificationHub({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFS)

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[600px]">
      
      {/* Header */}
      <div className="p-6 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
         <div className="flex items-center gap-3">
            <div className="relative">
               <Bell size={20} className="text-rihla" />
               {unreadCount > 0 && (
                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                    {unreadCount}
                 </span>
               )}
            </div>
            <h3 className="text-sm font-black dark:text-cream uppercase tracking-tighter">Notifications Live</h3>
         </div>
         <button onClick={onClose} className="text-slate-400 hover:text-rihla transition-colors">
            <X size={20} />
         </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
         {notifications.length === 0 ? (
           <div className="py-20 text-center text-slate-400 text-xs italic">Aucune notification pour le moment.</div>
         ) : (
           notifications.map((n) => (
             <div 
               key={n.id} 
               className={clsx(
                 "p-4 rounded-2xl border transition-all relative group cursor-pointer",
                 n.isRead ? "bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5" : "bg-rihla/5 border-rihla/20 shadow-sm"
               )}
               onClick={() => setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, isRead: true } : notif))}
             >
                <div className="flex gap-4">
                   <div className={clsx(
                     "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                     n.type === 'urgent' ? "bg-red-500 text-white animate-pulse" :
                     n.type === 'success' ? "bg-emerald-500 text-white" :
                     n.type === 'warning' ? "bg-amber-500 text-white" : "bg-blue-500 text-white"
                   )}>
                      {n.type === 'urgent' ? <AlertCircle size={18} /> : 
                       n.category === 'ops' ? <MapPin size={18} /> : <MessageSquare size={18} />}
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                         <h4 className="text-[12px] font-black dark:text-cream uppercase tracking-tight">{n.title}</h4>
                         <span className="text-[9px] font-bold text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                         {n.message}
                      </p>
                   </div>
                </div>
                {!n.isRead && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-rihla rounded-full" />
                )}
             </div>
           ))
         )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex justify-center">
         <button className="text-[10px] font-black text-rihla uppercase tracking-widest hover:underline">
            Marquer tout comme lu
         </button>
      </div>
    </div>
  )
}
