import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { guidePortalApi, AvailabilityStatus, RemarkType } from '@/lib/api'
import {
  Calendar, MessageSquare, CheckCircle, AlertTriangle, Lightbulb, Send, DollarSign,
  Mic, AlertCircle, Info, Star, ShieldAlert, BookOpen, CheckSquare, MapPin, Clock, Utensils, Phone
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { ExpenseCapture } from '@/components/finance/ExpenseCapture'

const STATUS_CONFIG: Record<AvailabilityStatus, { label: string; color: string }> = {
  available: { label: 'Disponible',  color: '#10b981' },
  busy:      { label: 'Occupé',      color: '#ef4444' },
  tentative: { label: 'Incertain',   color: '#f59e0b' },
}

const REMARK_ICONS: Record<RemarkType, React.ReactNode> = {
  observation: <CheckCircle size={14} />,
  issue:       <AlertTriangle size={14} />,
  suggestion:  <Lightbulb size={14} />,
}

export function GuidePortalPage() {
  const { user } = useAuthStore()
  const [logbookContent, setLogbookContent] = useState('')
  const qc = useQueryClient()
  const today = new Date()
  const [month, setMonth] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`)
  const [projectId, setProjectId] = useState('')
  const [remarkType, setRemarkType] = useState<RemarkType>('observation')
  const [remarkContent, setRemarkContent] = useState('')
  const [dayNum, setDayNum] = useState<number | ''>('')
  const [insightContent, setInsightContent] = useState('')
  const [insightTarget, setInsightTarget] = useState('')

  const { data: agenda = [] } = useQuery({
    queryKey: ['guide-agenda', month],
    queryFn: () => guidePortalApi.getAgenda(month).then(r => r.data),
  })

  const setAvail = useMutation({
    mutationFn: ({ date, status }: { date: string; status: AvailabilityStatus }) =>
      guidePortalApi.setAvailability(date, { date, status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['guide-agenda'] }),
  })

  const addRemark = useMutation({
    mutationFn: () => guidePortalApi.addRemark({
      project_id: projectId,
      remark_type: remarkType,
      day_number: dayNum !== '' ? Number(dayNum) : undefined,
      content: remarkContent,
    }),
    onSuccess: () => {
      setRemarkContent('')
      setDayNum('')
      qc.invalidateQueries({ queryKey: ['guide-remarks'] })
    },
  })

  // Génère les jours du mois
  const [year, mon] = month.split('-').map(Number)
  const daysInMonth = new Date(year, mon, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = String(i + 1).padStart(2, '0')
    return `${month}-${d}`
  })
  const agendaMap = Object.fromEntries(agenda.map((a: any) => [a.date, a]))

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
        Portail Guide
      </h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Bonjour {user?.full_name} — gérez votre agenda et vos remarques de circuit
      </p>

      {/* ── CONTEXTUAL ACTION CARD (The "Next Step" assistant) ── */}
      <section style={{ marginBottom: '2rem' }}>
         <div style={{
            padding: '1.5rem', background: '#fff', border: '2px solid #1628A9', borderRadius: 28,
            boxShadow: '0 15px 30px -10px rgba(22, 40, 169, 0.2)', position: 'relative', overflow: 'hidden'
         }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
               <div>
                  <span style={{ fontSize: '9px', fontUint8Array: 900, background: '#1628A9', color: '#fff', padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Prochaine Étape</span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: 8, color: '#0f172a' }}>Déjeuner au Dar Yacout</h2>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>13:00 — Médina de Marrakech</p>
               </div>
               <div style={{ width: 50, h: 50, background: '#f1f5f9', borderRadius: 16, display: 'flex', alignItems: 'center', justify: 'center' }}>
                  <Clock size={24} className="text-rihla" />
               </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
               <button style={{
                  flex: 2, padding: '1.2rem', background: '#1628A9', color: '#fff', border: 'none', borderRadius: 20,
                  fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: '0 8px 16px -4px rgba(22, 40, 169, 0.4)'
               }}>
                  <MapPin size={20} /> Pointer l'Arrivée
               </button>
               <button style={{
                  flex: 1, padding: '1.2rem', background: '#f8fafc', color: '#1628A9', border: '2px solid #e2e8f0', borderRadius: 20,
                  fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
               }}>
                  <Utensils size={18} /> Menu
               </button>
            </div>
         </div>
      </section>

      {/* ── SOS / ASSISTANCE BUREAU ── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: '2rem' }}>
         <button style={{
            flex: 1, padding: '1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 20,
            fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
         }}>
            <ShieldAlert size={18} /> SOS Bureau
         </button>
         <button style={{
            flex: 1, padding: '1rem', background: '#fff', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: 20,
            fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
         }}>
            <Phone size={18} /> Appeler Designer
         </button>
      </div>

      {/* ── ALERTE HUMEUR CLIENT ── */}
      <div style={{
         background: '#fee2e2', border: '1px solid #ef4444', borderRadius: 16, padding: '1rem', marginBottom: '2.5rem',
         display: 'flex', alignItems: 'center', gap: 12
      }}>
         <AlertCircle style={{ color: '#ef4444' }} />
         <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#991b1b', margin: 0 }}>ALERTE SATISFACTION : Projet #CAS-9982</p>
            <p style={{ fontSize: '0.75rem', color: '#b91c1c', margin: 0 }}>Un client a signalé une humeur "Déçu" il y a 10 minutes. Merci de vérifier la situation.</p>
         </div>
      </div>

      {/* ── LIVE CHECK-IN STATION ── */}
      <section style={{ marginBottom: '2.5rem' }}>
         <div style={{
            padding: '2rem', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
            borderRadius: 24, color: '#fff', border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', overflow: 'hidden', position: 'relative'
         }}>
            <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
               <MapPin size={120} />
            </div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
               <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MapPin size={20} style={{ color: '#1628A9' }} /> Station de Check-in Live
               </h2>
               <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
                  Pointez votre arrivée aux étapes pour informer le client et le bureau.
               </p>

               <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                     <input 
                        placeholder="Lieu actuel (ex: Palais Bahia)" 
                        style={{
                           width: '100%', padding: '1rem', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)',
                           background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none', fontSize: '0.85rem'
                        }}
                     />
                  </div>
                  <button style={{
                     padding: '0 2rem', background: '#1628A9', color: '#fff', border: 'none', borderRadius: 16,
                     fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                     boxShadow: '0 10px 15px -3px rgba(22, 40, 169, 0.3)'
                  }}>
                     <CheckCircle size={18} /> Valider l'Étape
                  </button>
               </div>
               
               <div style={{ marginTop: '1.5rem', display: 'flex', gap: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#10b981' }}>
                     <div style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%' }} />
                     GPS Connecté
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                     Dernier check-in : **La Mamounia** (11:32)
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* ── Agenda ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
          <Calendar size={18} />
          <h2 style={{ fontWeight: 600 }}>Mon agenda</h2>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{
              marginLeft: 'auto', padding: '0.25rem 0.6rem',
              borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.85rem',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
          {days.map((date) => {
            const entry = agendaMap[date]
            const status: AvailabilityStatus = entry?.status ?? 'available'
            const cfg = STATUS_CONFIG[status]
            const dayNum = parseInt(date.split('-')[2])
            return (
              <button
                key={date}
                onClick={() => {
                  const next: AvailabilityStatus = status === 'available' ? 'busy' : status === 'busy' ? 'tentative' : 'available'
                  setAvail.mutate({ date, status: next })
                }}
                style={{
                  padding: '0.5rem',
                  borderRadius: 8,
                  border: `1px solid ${cfg.color}40`,
                  background: `${cfg.color}15`,
                  color: cfg.color,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
                title={`${date} — ${cfg.label} (cliquer pour changer)`}
              >
                {dayNum}
              </button>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: '0.75rem' }}>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <span key={k} style={{ color: v.color }}>■ {v.label}</span>
          ))}
        </div>
      </section>

      {/* ── Gestion des Frais (OCR) ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
          <DollarSign size={18} />
          <h2 style={{ fontWeight: 600 }}>Gestion des Frais (OCR)</h2>
        </div>
        <div style={{ maxWidth: 500 }}>
           <ExpenseCapture />
        </div>
      </section>

      {/* ── INSIGHTS POUR TRAVEL DESIGNER ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
          <Star size={18} />
          <h2 style={{ fontWeight: 600 }}>Designer Insights (Feedback Produit)</h2>
        </div>
        <div style={{
           padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 20,
           display: 'flex', flexDirection: 'column', gap: 12
        }}>
           {/* Intent Display */}
           <div style={{ padding: '1rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, marginBottom: 10 }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#92400e', margin: '0 0 5px 0' }}>
                 <ShieldAlert size={12} style={{ display: 'inline', marginRight: 4 }} /> 
                 DESIGNER INTENT (Note pour vous)
              </p>
              <p style={{ fontSize: '0.8rem', color: '#b45309', margin: 0 }}>
                 "Le client adore la photographie. Suggérez-lui un détour par le jardin secret à 17h pour la lumière."
              </p>
           </div>

           <div style={{ display: 'flex', gap: 8 }}>
              <input 
                placeholder="Cible (ex: Hôtel Movenpick)" 
                value={insightTarget}
                onChange={(e) => setInsightTarget(e.target.value)}
                style={{ flex: 1, padding: '0.6rem', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.8rem' }} 
              />
           </div>
           <textarea 
             placeholder="Note technique pour le Travel Designer..." 
             value={insightContent}
             onChange={(e) => setInsightContent(e.target.value)}
             style={{ padding: '0.8rem', borderRadius: 10, border: '1px solid #cbd5e1', minHeight: 80, fontSize: '0.8rem' }}
           />
           <button style={{
              background: '#1e293b', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: 10,
              fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
           }}>
              <Send size={14} /> Envoyer Insight
           </button>
        </div>
      </section>

      {/* ── LOGBOOK DIGITAL ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
          <BookOpen size={18} />
          <h2 style={{ fontWeight: 600 }}>Logbook Digital (Rapport Journalier)</h2>
        </div>
        <div style={{
           padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24,
           boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}>
           <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.5rem' }}>
              Résumez le déroulement de la journée pour le dossier final.
           </p>
           <textarea 
             placeholder="Déroulement de la journée, satisfaction globale du groupe, imprévus..." 
             value={logbookContent}
             onChange={(e) => setLogbookContent(e.target.value)}
             style={{ width: '100%', padding: '1rem', borderRadius: 16, border: '1px solid #e2e8f0', minHeight: 120, fontSize: '0.85rem', marginBottom: '1rem', outline: 'none' }}
           />
           <button style={{
              width: '100%', background: '#10b981', color: '#fff', border: 'none', padding: '1rem', borderRadius: 16,
              fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
           }}>
              <CheckSquare size={16} /> Clôturer la Journée
           </button>
           <button style={{
               width: '100%', marginTop: '0.75rem', background: '#f1f5f9', color: '#475569', border: 'none', padding: '0.8rem', borderRadius: 16,
               fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}>
               <Mic size={16} style={{ color: '#1628A9' }} /> Dicter mon rapport (IA)
            </button>
        </div>
      </section>


      {/* ── Remarques ── */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
          <MessageSquare size={18} />
          <h2 style={{ fontWeight: 600 }}>Remarque sur un circuit</h2>
        </div>

        <div style={{
          padding: '1.25rem',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.02)',
          display: 'flex', flexDirection: 'column', gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['observation', 'issue', 'suggestion'] as RemarkType[]).map((t) => (
              <button
                key={t}
                onClick={() => setRemarkType(t)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '0.35rem 0.8rem', borderRadius: 8, border: '1px solid',
                  borderColor: remarkType === t ? '#1628A9' : 'rgba(255,255,255,0.1)',
                  background: remarkType === t ? '#1628A9' : 'transparent',
                  color: remarkType === t ? '#fff' : '#94a3b8',
                  fontSize: '0.8rem', cursor: 'pointer',
                }}
              >
                {REMARK_ICONS[t]}
                {{ observation: 'Observation', issue: 'Problème', suggestion: 'Suggestion' }[t]}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input
              placeholder="ID ou référence du projet"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              style={{ flex: 2, padding: '0.4rem 0.7rem', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
            />
            <input
              type="number"
              placeholder="Jour n°"
              value={dayNum}
              onChange={(e) => setDayNum(e.target.value ? Number(e.target.value) : '')}
              style={{ flex: 1, padding: '0.4rem 0.7rem', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
            />
          </div>

          <textarea
            rows={3}
            placeholder="Décrivez votre remarque..."
            value={remarkContent}
            onChange={(e) => setRemarkContent(e.target.value)}
            style={{ padding: '0.5rem 0.7rem', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
          />

          <button
            onClick={() => addRemark.mutate()}
            disabled={!projectId || !remarkContent || addRemark.isPending}
            style={{
              alignSelf: 'flex-start',
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '0.5rem 1.2rem', borderRadius: 8, border: 'none',
              background: projectId && remarkContent ? '#1628A9' : '#334155',
              color: '#fff', fontWeight: 600, fontSize: '0.85rem',
              cursor: projectId && remarkContent ? 'pointer' : 'not-allowed',
            }}
          >
            <Send size={13} />
            {addRemark.isPending ? 'Envoi...' : 'Envoyer au Travel Designer'}
          </button>
          {addRemark.isSuccess && (
            <p style={{ color: '#10b981', fontSize: '0.8rem' }}>✓ Remarque envoyée — le Travel Designer a été notifié</p>
          )}
        </div>
      </section>
    </div>
  )
}
