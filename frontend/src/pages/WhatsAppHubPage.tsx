import { useState, useEffect, useRef } from 'react'
import {
  MessageCircle, ChevronRight, Send, Phone,
  Users, MapPin, AlertTriangle, CheckCircle2,
  Clock, Image, Paperclip, FileText, Search,
  Bell, Settings, ExternalLink, Zap, Shield,
  ArrowUpRight, X, Loader2
} from 'lucide-react'
import { clsx } from 'clsx'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { whatsappApi, WaConversation, WaMessage } from '@/lib/api'

// ── Types ──────────────────────────────────────────────────────────
interface QuickTemplate {
  id: string
  label: string
  text: string
  category: 'proposal' | 'confirmation' | 'alert' | 'info'
}

const TEMPLATES: QuickTemplate[] = [
  { id: 't1', label: 'Envoyer proposition', text: '📋 Bonjour {nom}, voici votre proposition de circuit : {lien}. N\'hésitez pas à me contacter pour toute question.', category: 'proposal' },
  { id: 't2', label: 'Confirmation réservation', text: '✅ Votre réservation est confirmée ! Réf: {ref}. Dates: {dates}. {pax} personnes. À bientôt au Maroc ! 🇲🇦', category: 'confirmation' },
  { id: 't3', label: 'Alerte guide', text: '⚠️ Attention : changement de programme pour demain. {détails}. Merci de confirmer la réception.', category: 'alert' },
  { id: 't4', label: 'Rappel paiement', text: '💳 Rappel : L\'acompte de 30% ({montant} €) est attendu avant le {date}. Lien de paiement : {lien}', category: 'info' },
]

const roleColors: Record<string, string> = {
  guide: 'bg-emerald-500',
  client: 'bg-blue-500',
  driver: 'bg-amber-500',
  supplier: 'bg-purple-500',
  agent: 'bg-pink-500',
}

const roleLabels: Record<string, string> = {
  guide: 'Guide', client: 'Client', driver: 'Chauffeur', supplier: 'Fournisseur', agent: 'Agent',
}

export function WhatsAppHubPage() {
  const queryClient = useQueryClient()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [search, setSearch] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Fetch Conversations
  const { data: convos = [], isLoading: isLoadingConvos } = useQuery({
    queryKey: ['whatsapp-conversations'],
    queryFn: () => whatsappApi.conversations().then(res => res.data),
  })

  // Fetch Messages for selected conversation
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ['whatsapp-messages', selectedId],
    queryFn: () => selectedId ? whatsappApi.messages(selectedId).then(res => res.data) : Promise.resolve([]),
    enabled: !!selectedId,
    refetchInterval: 5000, // Poll every 5s for demo "live" feel
  })

  // Send Mutation
  const sendMutation = useMutation({
    mutationFn: (text: string) => selectedId ? whatsappApi.send(selectedId, text) : Promise.reject('No convo'),
    onSuccess: () => {
      setNewMessage('')
      queryClient.invalidateQueries({ queryKey: ['whatsapp-messages', selectedId] })
      queryClient.invalidateQueries({ queryKey: ['whatsapp-conversations'] })
    }
  })

  useEffect(() => {
    if (convos.length > 0 && !selectedId) {
      setSelectedId(convos[0].id)
    }
  }, [convos, selectedId])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!newMessage.trim() || sendMutation.isPending) return
    sendMutation.mutate(newMessage)
  }

  const useTemplate = (template: QuickTemplate) => {
    setNewMessage(template.text)
    setShowTemplates(false)
  }

  const filteredConvos = convos.filter(c =>
    c.contact_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.project_ref || '').toLowerCase().includes(search.toLowerCase())
  )

  const currentConvo = convos.find(c => c.id === selectedId)

  const useTemplate = (template: QuickTemplate) => {
    setNewMessage(template.text)
    setShowTemplates(false)
  }

  const filteredConvos = CONVERSATIONS.filter(c =>
    c.contactName.toLowerCase().includes(search.toLowerCase()) ||
    c.projectRef.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Communication <ChevronRight size={10} /> WhatsApp Business
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-cream tracking-tighter flex items-center gap-3">
              <MessageCircle className="text-emerald-500" size={28} />
              WhatsApp Business Hub
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] font-bold">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              API Connectée
            </div>
            <button className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 transition-all">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex h-[calc(100vh-120px)]">

        {/* ── LEFT: CONVERSATION LIST ──────────────────────────── */}
        <div className="w-80 border-r border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 flex flex-col">
          <div className="p-4">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoadingConvos ? (
              <div className="p-8 text-center space-y-4">
                <Loader2 className="mx-auto text-slate-300 animate-spin" size={24} />
                <p className="text-[10px] text-slate-400 font-bold uppercase">Chargement...</p>
              </div>
            ) : filteredConvos.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={clsx(
                  "w-full flex items-center gap-3 px-4 py-3 text-left transition-all",
                  selectedId === c.id ? "bg-emerald-50 dark:bg-emerald-900/20" : "hover:bg-slate-50 dark:hover:bg-white/5"
                )}
              >
                <div className="relative">
                  <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black", roleColors[c.role] || 'bg-slate-400')}>
                    {c.avatar || c.contact_name.slice(0, 2).toUpperCase()}
                  </div>
                  {c.is_online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{c.contact_name}</span>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">{c.last_time || ''}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{c.last_message || 'Pas de message'}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={clsx("px-1.5 py-0.5 rounded text-[8px] font-bold uppercase flex items-center")}>
                      <span className={clsx("inline-block w-1.5 h-1.5 rounded-full mr-1", roleColors[c.role] || 'bg-slate-400')} />
                      {roleLabels[c.role] || c.role}
                    </span>
                    <span className="text-[9px] text-slate-400">{c.project_ref}</span>
                  </div>
                </div>
                {c.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">{c.unread}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT: CHAT ──────────────────────────────────────── */}
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">

          {/* Chat header */}
          {currentConvo ? (
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 px-6 py-3 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black", roleColors[currentConvo.role] || 'bg-slate-400')}>
                  {currentConvo.avatar || currentConvo.contact_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{currentConvo.contact_name}</div>
                  <div className="text-[10px] text-slate-400">{currentConvo.contact_phone} · {currentConvo.project_ref}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 transition-all">
                  <Phone size={14} />
                </button>
                <button className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 transition-all">
                  <Users size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 px-6 py-3 h-16" />
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {isLoadingMessages ? (
              <div className="flex justify-center py-12">
                <Loader2 className="text-slate-200 animate-spin" size={32} />
              </div>
            ) : messages.map(msg => (
              <div key={msg.id} className={clsx("flex", msg.is_outgoing ? "justify-end" : "justify-start")}>
                <div className={clsx(
                  "max-w-md rounded-2xl px-4 py-3 text-sm",
                  msg.is_outgoing
                    ? "bg-emerald-500 text-white rounded-br-md"
                    : msg.type === 'alert'
                      ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-md shadow-sm"
                )}>
                  {msg.type === 'alert' && <AlertTriangle size={14} className="inline mr-1" />}
                  {msg.text}
                  <div className={clsx("text-[10px] mt-1 text-right", msg.is_outgoing ? "text-white/60" : "text-slate-400")}>
                    {new Date(msg.sent_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    {msg.is_outgoing && (
                      <span className="ml-1">
                        {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Templates panel */}
          {showTemplates && (
            <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 p-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black text-slate-400 uppercase">Réponses Rapides</span>
                <button onClick={() => setShowTemplates(false)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => useTemplate(t)}
                    className="text-left p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                  >
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{t.label}</div>
                    <div className="text-[10px] text-slate-400 truncate">{t.text.slice(0, 60)}...</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input bar */}
          <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 transition-all"
                title="Réponses rapides"
              >
                <Zap size={16} />
              </button>
              <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 transition-all">
                <Paperclip size={16} />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Tapez votre message..."
                disabled={sendMutation.isPending}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim() || sendMutation.isPending}
                className={clsx(
                  "p-3 rounded-xl transition-all",
                  (newMessage.trim() && !sendMutation.isPending) ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600" : "bg-slate-100 dark:bg-white/5 text-slate-400"
                )}
              >
                {sendMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
