/**
 * GroupLiveTrackingPage — Suivi groupe en temps réel
 * De l'arrivée à l'aéroport jusqu'au départ
 * Gestion incidents : retards vols, chauffeurs, restaurants, hôtels…
 */
import { useState, useMemo } from 'react'
import {
  Plane, Bus, Hotel, Utensils, MapPin, AlertTriangle, CheckCircle2,
  Clock, User, Phone, Plus, X, ChevronRight, Activity, Wifi,
  AlertCircle, Wrench, ThumbsUp, MessageSquare, Flag, Navigation,
  Car, Coffee, Camera, Moon, Sunrise, RefreshCw, Filter, Bell,
  TrendingUp, Users, Shield
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────

type StageId = 'arrival' | 'transfer_in' | 'checkin' | 'activity' | 'restaurant' | 'transfer_out' | 'departure'
type IncidentType = 'flight_delay' | 'driver_delay' | 'vehicle_breakdown' | 'hotel_room' | 'restaurant' | 'guide' | 'medical' | 'payment' | 'weather' | 'other'
type IncidentSeverity = 'urgent' | 'warning' | 'info'
type IncidentStatus = 'open' | 'in_progress' | 'resolved'
type GroupStatus = 'on_track' | 'delayed' | 'critical' | 'completed'

interface JourneyStage {
  id: StageId
  label: string
  icon: React.ReactNode
  time?: string
  location?: string
  status: 'done' | 'active' | 'pending' | 'delayed'
  notes?: string
}

interface Incident {
  id: string
  groupId: string
  type: IncidentType
  severity: IncidentSeverity
  status: IncidentStatus
  title: string
  description: string
  reportedBy: string
  reportedAt: string
  resolvedAt?: string
  resolution?: string
  actions: string[]
}

interface ActiveGroup {
  id: string
  name: string
  client: string
  pax: number
  nationality: string
  arrivalFlight: string
  departureFlight: string
  arrivalTime: string
  departureTime: string
  currentStage: StageId
  status: GroupStatus
  guide: string
  guidePhone: string
  driver: string
  driverPhone: string
  hotel: string
  stages: JourneyStage[]
}

// ─── Demo Data ─────────────────────────────────────────────────────

const DEMO_GROUPS: ActiveGroup[] = [
  {
    id: 'G001',
    name: 'Circuit Impérial — Groupe Paris',
    client: 'Voyages Lumière Paris',
    pax: 24,
    nationality: '🇫🇷 Français',
    arrivalFlight: 'AT 702',
    departureFlight: 'AT 703',
    arrivalTime: '09:15',
    departureTime: 'Demain 14:30',
    currentStage: 'activity',
    status: 'on_track',
    guide: 'Hassan Benjelloun',
    guidePhone: '+212 661 234 567',
    driver: 'Khalid Mansouri',
    driverPhone: '+212 672 890 123',
    hotel: 'Sofitel Marrakech Lounge & Spa',
    stages: [
      { id: 'arrival',      label: 'Arrivée aéroport', icon: null, time: '09:15', location: 'RAK — Aéroport Marrakech-Ménara', status: 'done', notes: 'Vol AT702 atterri à l\'heure' },
      { id: 'transfer_in', label: 'Transfert hôtel',   icon: null, time: '09:45', location: 'Sofitel Marrakech',                 status: 'done', notes: 'Bus 45 places, climatisé' },
      { id: 'checkin',      label: 'Check-in hôtel',   icon: null, time: '11:00', location: 'Sofitel Marrakech',                 status: 'done', notes: '12 chambres double, 0 simple' },
      { id: 'restaurant',   label: 'Déjeuner',         icon: null, time: '13:00', location: 'Restaurant Dar Moha',               status: 'done', notes: 'Menu marocain 4 services' },
      { id: 'activity',     label: 'Visite Médina',    icon: null, time: '15:30', location: 'Médina de Marrakech',               status: 'active', notes: 'Souks + Bahia + Badi' },
      { id: 'transfer_out', label: 'Dîner + Spectacle',icon: null, time: '20:00', location: 'Chez Ali — Fantasia',               status: 'pending' },
      { id: 'departure',    label: 'Départ aéroport',  icon: null, time: 'Demain 12:00', location: 'RAK — Départ AT703',        status: 'pending' },
    ],
  },
  {
    id: 'G002',
    name: 'Désert & Kasbahs — Berlin',
    client: 'Morocco Exclusive Tours GmbH',
    pax: 16,
    nationality: '🇩🇪 Allemands',
    arrivalFlight: 'LH 6036',
    departureFlight: 'LH 6037',
    arrivalTime: '11:40',
    departureTime: 'Demain 18:15',
    currentStage: 'checkin',
    status: 'delayed',
    guide: 'Youssef Tazi',
    guidePhone: '+212 655 445 678',
    driver: 'Ahmed Zidane',
    driverPhone: '+212 664 112 233',
    hotel: 'Riad Kniza Marrakech',
    stages: [
      { id: 'arrival',      label: 'Arrivée aéroport', icon: null, time: '11:40', location: 'RAK — Aéroport',      status: 'done',    notes: 'Vol LH6036, atterri 12:10 (+30 min)' },
      { id: 'transfer_in', label: 'Transfert hôtel',   icon: null, time: '12:15', location: 'Riad Kniza',          status: 'done',    notes: 'Retard chauffeur → 40 min d\'attente' },
      { id: 'checkin',      label: 'Check-in hôtel',   icon: null, time: '13:30', location: 'Riad Kniza',          status: 'active',  notes: '⚠️ 2 chambres non disponibles avant 15h' },
      { id: 'restaurant',   label: 'Déjeuner tardif',  icon: null, time: '14:30', location: 'Café des Épices',     status: 'pending' },
      { id: 'activity',     label: 'Palais Bahia',     icon: null, time: '16:30', location: 'Médina',              status: 'pending' },
      { id: 'transfer_out', label: 'Dîner',            icon: null, time: '20:00', location: 'Le Foundouk',         status: 'pending' },
      { id: 'departure',    label: 'Départ aéroport',  icon: null, time: 'Demain 16:30', location: 'RAK',         status: 'pending' },
    ],
  },
  {
    id: 'G003',
    name: 'Honeymoon Collection — Dubai',
    client: 'Arabian Holidays LLC',
    pax: 6,
    nationality: '🇦🇪 Émiratis',
    arrivalFlight: 'FZ 5402',
    departureFlight: 'FZ 5403',
    arrivalTime: '14:20',
    departureTime: 'J+3 22:00',
    currentStage: 'transfer_in',
    status: 'critical',
    guide: 'Fatima Chaoui',
    guidePhone: '+212 612 998 877',
    driver: 'Mourad Alaoui',
    driverPhone: '+212 678 321 654',
    hotel: 'La Mamounia Marrakech',
    stages: [
      { id: 'arrival',      label: 'Arrivée aéroport', icon: null, time: '14:20', location: 'RAK — VIP Terminal', status: 'done',   notes: 'Vol FZ5402, accueil VIP' },
      { id: 'transfer_in', label: 'Transfert hôtel',   icon: null, time: '14:45', location: 'La Mamounia',        status: 'active', notes: '🚨 Panne véhicule — véhicule de remplacement en route (ETA 20 min)' },
      { id: 'checkin',      label: 'Check-in hôtel',   icon: null, time: '16:00', location: 'La Mamounia',        status: 'pending' },
      { id: 'restaurant',   label: 'Dîner romantique', icon: null, time: '20:30', location: 'Le Français — La Mamounia', status: 'pending' },
      { id: 'activity',     label: 'Excursion Ourika', icon: null, time: 'J+1 09:00', location: 'Vallée Ourika',  status: 'pending' },
      { id: 'transfer_out', label: 'Spa & Détente',    icon: null, time: 'J+2',   location: 'La Mamounia SPA',    status: 'pending' },
      { id: 'departure',    label: 'Départ aéroport',  icon: null, time: 'J+3 21:00', location: 'RAK',            status: 'pending' },
    ],
  },
  {
    id: 'G004',
    name: 'Merveilles d\'Atlas — Madrid',
    client: 'Viajes Sueños SL',
    pax: 32,
    nationality: '🇪🇸 Espagnols',
    arrivalFlight: 'IB 3812',
    departureFlight: 'IB 3813',
    arrivalTime: '07:30',
    departureTime: 'Aujourd\'hui 21:00',
    currentStage: 'departure',
    status: 'completed',
    guide: 'Omar Chraibi',
    guidePhone: '+212 661 777 888',
    driver: 'Said Boukhari',
    driverPhone: '+212 677 444 555',
    hotel: 'Four Seasons Resort Marrakech',
    stages: [
      { id: 'arrival',      label: 'Arrivée aéroport', icon: null, time: '07:30', status: 'done' },
      { id: 'transfer_in', label: 'Transfert hôtel',   icon: null, time: '08:15', status: 'done' },
      { id: 'checkin',      label: 'Check-in hôtel',   icon: null, time: '09:00', status: 'done' },
      { id: 'restaurant',   label: 'Déjeuner',         icon: null, time: '13:00', status: 'done' },
      { id: 'activity',     label: 'Excursions',       icon: null, time: '15:00', status: 'done' },
      { id: 'transfer_out', label: 'Transfert aéroport', icon: null, time: '18:30', status: 'done' },
      { id: 'departure',    label: 'Départ aéroport',  icon: null, time: '21:00', location: 'RAK — IB3813', status: 'active', notes: 'Groupe en cours d\'embarquement' },
    ],
  },
]

const DEMO_INCIDENTS: Incident[] = [
  {
    id: 'INC001', groupId: 'G002', type: 'flight_delay', severity: 'warning',
    status: 'resolved', title: 'Retard vol LH6036 — 30 minutes',
    description: 'Le vol Lufthansa LH6036 Frankfurt-Marrakech a atterri avec 30 minutes de retard (12:10 au lieu de 11:40).',
    reportedBy: 'Youssef Tazi (Guide)', reportedAt: '11:45',
    resolvedAt: '12:15', resolution: 'Chauffeur prévenu, planning décalé de 30 min. Déjeuner reporté à 14h30.',
    actions: ['Chauffeur notifié', 'Restaurant Café des Épices contacté', 'Planning journée mis à jour'],
  },
  {
    id: 'INC002', groupId: 'G002', type: 'hotel_room', severity: 'warning',
    status: 'in_progress', title: '2 chambres non disponibles au Riad Kniza',
    description: 'À l\'arrivée du groupe, 2 chambres sur 8 ne sont pas prêtes. L\'hôtel indique disponibilité à 15h.',
    reportedBy: 'Youssef Tazi (Guide)', reportedAt: '13:35',
    actions: ['Hôtelier contacté', 'Bagages stockés en consigne', 'Surclassement salon VIP offert'],
  },
  {
    id: 'INC003', groupId: 'G003', type: 'vehicle_breakdown', severity: 'urgent',
    status: 'in_progress', title: 'Panne véhicule de transfert — Groupe Honeymoon',
    description: 'Le minibus de luxe (Mercedes Viano) a eu une crevaison à 2 km de l\'aéroport. 6 passagers VIP en attente.',
    reportedBy: 'Mourad Alaoui (Chauffeur)', reportedAt: '14:52',
    actions: ['Véhicule de remplacement (Classe V) envoyé', 'Guests informés — boissons fraîches offertes', 'ETA véhicule de remplacement : 15h10'],
  },
  {
    id: 'INC004', groupId: 'G001', type: 'restaurant', severity: 'info',
    status: 'resolved', title: 'Restaurant Dar Moha — allergie non déclarée',
    description: 'Une passagère (Mme Dupont) présente une allergie aux noix non signalée dans le fichier groupe.',
    reportedBy: 'Hassan Benjelloun (Guide)', reportedAt: '13:10',
    resolvedAt: '13:20', resolution: 'Chef cuisinier informé. Menu alternatif préparé sans noix. Passagère satisfaite.',
    actions: ['Chef notifié', 'Menu adapté servi', 'Fiche pax mise à jour'],
  },
]

const INCIDENT_TYPES: Record<IncidentType, { label: string; icon: React.ReactNode; color: string }> = {
  flight_delay:      { label: 'Retard de vol',         icon: <Plane size={14} />,        color: '#f59e0b' },
  driver_delay:      { label: 'Retard chauffeur',      icon: <Car size={14} />,          color: '#f59e0b' },
  vehicle_breakdown: { label: 'Panne véhicule',        icon: <Wrench size={14} />,       color: '#ef4444' },
  hotel_room:        { label: 'Problème chambre',      icon: <Hotel size={14} />,        color: '#f59e0b' },
  restaurant:        { label: 'Problème restaurant',   icon: <Utensils size={14} />,     color: '#8b5cf6' },
  guide:             { label: 'Problème guide',        icon: <User size={14} />,         color: '#f59e0b' },
  medical:           { label: 'Urgence médicale',      icon: <AlertCircle size={14} />,  color: '#ef4444' },
  payment:           { label: 'Problème paiement',     icon: <Flag size={14} />,         color: '#6366f1' },
  weather:           { label: 'Météo / Force majeure', icon: <Activity size={14} />,     color: '#06b6d4' },
  other:             { label: 'Autre',                 icon: <MessageSquare size={14} />,color: '#64748b' },
}

const STAGE_ICONS: Record<StageId, React.ReactNode> = {
  arrival:      <Plane size={16} />,
  transfer_in:  <Bus size={16} />,
  checkin:      <Hotel size={16} />,
  activity:     <Camera size={16} />,
  restaurant:   <Utensils size={16} />,
  transfer_out: <Navigation size={16} />,
  departure:    <Plane size={16} style={{ transform: 'rotate(90deg)' }} />,
}

const STATUS_STYLES: Record<GroupStatus, { bg: string; text: string; dot: string; label: string }> = {
  on_track:  { bg: 'rgba(34,197,94,0.1)',  text: '#22c55e', dot: '#22c55e',  label: 'En ordre' },
  delayed:   { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', dot: '#f59e0b',  label: 'Retardé' },
  critical:  { bg: 'rgba(239,68,68,0.1)',  text: '#ef4444', dot: '#ef4444',  label: 'Critique' },
  completed: { bg: 'rgba(100,116,139,0.1)',text: '#64748b', dot: '#64748b',  label: 'Terminé' },
}

// ─── Modal Signalement Incident ────────────────────────────────────

interface ReportModalProps {
  groupId: string
  groupName: string
  onClose: () => void
  onSubmit: (inc: Incident) => void
}

function ReportModal({ groupId, groupName, onClose, onSubmit }: ReportModalProps) {
  const [form, setForm] = useState({
    type: 'flight_delay' as IncidentType,
    severity: 'warning' as IncidentSeverity,
    title: '',
    description: '',
    reportedBy: '',
  })

  const now = new Date()
  const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`

  function handleSubmit() {
    if (!form.title.trim()) return
    const newInc: Incident = {
      id: 'INC' + Date.now(),
      groupId,
      type: form.type,
      severity: form.severity,
      status: 'open',
      title: form.title,
      description: form.description,
      reportedBy: form.reportedBy || 'Opérateur RIHLA',
      reportedAt: timeStr,
      actions: [],
    }
    onSubmit(newInc)
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '20px',
    }}>
      <div style={{
        background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px', width: '100%', maxWidth: '560px', padding: '28px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <div style={{ background: 'rgba(239,68,68,0.15)', borderRadius: '8px', padding: '6px' }}>
                <AlertTriangle size={18} color="#ef4444" />
              </div>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '17px' }}>Signaler un incident</span>
            </div>
            <span style={{ color: '#64748b', fontSize: '13px' }}>{groupName}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        {/* Type */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Type d'incident
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {(Object.entries(INCIDENT_TYPES) as [IncidentType, any][]).map(([key, val]) => (
              <button key={key} onClick={() => setForm(f => ({ ...f, type: key }))}
                style={{
                  padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                  background: form.type === key ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
                  border: form.type === key ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.06)',
                  color: form.type === key ? '#818cf8' : '#94a3b8',
                  display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px',
                  transition: 'all 0.15s',
                }}>
                {val.icon} {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sévérité */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Sévérité
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {([['urgent','#ef4444','🔴 Urgent'],['warning','#f59e0b','🟡 Modéré'],['info','#06b6d4','🔵 Info']] as const).map(([sev, clr, lbl]) => (
              <button key={sev} onClick={() => setForm(f => ({ ...f, severity: sev }))}
                style={{
                  flex: 1, padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                  background: form.severity === sev ? `${clr}22` : 'rgba(255,255,255,0.03)',
                  border: form.severity === sev ? `1px solid ${clr}66` : '1px solid rgba(255,255,255,0.06)',
                  color: form.severity === sev ? clr : '#64748b', transition: 'all 0.15s',
                }}>
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {/* Titre */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Titre *
          </label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Ex: Retard vol AT702 — 45 minutes"
            style={{
              width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '14px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Détails
          </label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={3} placeholder="Décrivez la situation..."
            style={{
              width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '13px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Signalé par */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Signalé par
          </label>
          <input value={form.reportedBy} onChange={e => setForm(f => ({ ...f, reportedBy: e.target.value }))}
            placeholder="Nom du guide / chauffeur / opérateur"
            style={{
              width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '14px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Boutons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8',
          }}>
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={!form.title.trim()}
            style={{
              flex: 2, padding: '11px', borderRadius: '8px', cursor: form.title.trim() ? 'pointer' : 'not-allowed',
              fontSize: '14px', fontWeight: 700, border: 'none',
              background: form.title.trim() ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'rgba(239,68,68,0.2)',
              color: form.title.trim() ? '#fff' : '#64748b', transition: 'all 0.2s',
            }}>
            🚨 Signaler l'incident
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Panneau détail groupe ─────────────────────────────────────────

interface GroupDetailProps {
  group: ActiveGroup
  incidents: Incident[]
  onReport: () => void
  onResolve: (incId: string, resolution: string) => void
}

function GroupDetail({ group, incidents, onReport, onResolve }: GroupDetailProps) {
  const [resolvingId, setResolvingId] = useState<string | null>(null)
  const [resolutionText, setResolutionText] = useState('')
  const groupIncidents = incidents.filter(i => i.groupId === group.id)
  const openIncidents = groupIncidents.filter(i => i.status !== 'resolved')

  const stageProgress = useMemo(() => {
    const stages = group.stages
    const activeIdx = stages.findIndex(s => s.status === 'active')
    return activeIdx >= 0 ? Math.round((activeIdx / (stages.length - 1)) * 100) : 100
  }, [group.stages])

  return (
    <div style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header groupe */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h2 style={{ margin: 0, color: '#fff', fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{group.name}</h2>
            <div style={{ color: '#64748b', fontSize: '13px' }}>{group.client} · {group.nationality}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <span style={{
              padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
              background: STATUS_STYLES[group.status].bg, color: STATUS_STYLES[group.status].text,
            }}>
              ● {STATUS_STYLES[group.status].label}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>{group.pax} pax</span>
          </div>
        </div>

        {/* Infos contacts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          {[
            { label: 'Guide', name: group.guide, phone: group.guidePhone, icon: <User size={13} /> },
            { label: 'Chauffeur', name: group.driver, phone: group.driverPhone, icon: <Car size={13} /> },
          ].map(c => (
            <div key={c.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {c.icon} {c.label}
              </div>
              <div style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{c.name}</div>
              <a href={`tel:${c.phone}`} style={{ color: '#6366f1', fontSize: '12px', textDecoration: 'none' }}>
                📞 {c.phone}
              </a>
            </div>
          ))}
        </div>

        {/* Vols */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <div style={{ flex: 1, background: 'rgba(99,102,241,0.08)', borderRadius: '8px', padding: '10px', border: '1px solid rgba(99,102,241,0.15)' }}>
            <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>✈️ Arrivée</div>
            <div style={{ color: '#818cf8', fontWeight: 700, fontSize: '14px' }}>{group.arrivalFlight}</div>
            <div style={{ color: '#94a3b8', fontSize: '12px' }}>{group.arrivalTime}</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(99,102,241,0.08)', borderRadius: '8px', padding: '10px', border: '1px solid rgba(99,102,241,0.15)' }}>
            <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>🛫 Départ</div>
            <div style={{ color: '#818cf8', fontWeight: 700, fontSize: '14px' }}>{group.departureFlight}</div>
            <div style={{ color: '#94a3b8', fontSize: '12px' }}>{group.departureTime}</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>🏨 Hôtel</div>
            <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '12px', lineHeight: '1.3' }}>{group.hotel}</div>
          </div>
        </div>

        {/* Barre de progression */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#64748b', fontSize: '11px' }}>Progression du circuit</span>
            <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }}>{stageProgress}%</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '4px', transition: 'width 0.5s ease',
              width: `${stageProgress}%`,
              background: group.status === 'critical' ? '#ef4444' : group.status === 'delayed' ? '#f59e0b' : group.status === 'completed' ? '#64748b' : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            }} />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 style={{ margin: '0 0 16px', color: '#fff', fontSize: '14px', fontWeight: 700 }}>
          📅 Programme de la journée
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {group.stages.map((stage, idx) => (
            <div key={stage.id} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
              {/* Ligne verticale */}
              {idx < group.stages.length - 1 && (
                <div style={{
                  position: 'absolute', left: '15px', top: '32px', bottom: '-4px', width: '2px',
                  background: stage.status === 'done' ? 'rgba(34,197,94,0.3)' : stage.status === 'active' ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)',
                }} />
              )}

              {/* Icône étape */}
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background:
                  stage.status === 'done'    ? 'rgba(34,197,94,0.15)' :
                  stage.status === 'active'  ? 'rgba(99,102,241,0.2)'  :
                  stage.status === 'delayed' ? 'rgba(239,68,68,0.15)'  :
                  'rgba(255,255,255,0.05)',
                border: `2px solid ${
                  stage.status === 'done'    ? 'rgba(34,197,94,0.5)' :
                  stage.status === 'active'  ? 'rgba(99,102,241,0.7)' :
                  stage.status === 'delayed' ? 'rgba(239,68,68,0.5)'  :
                  'rgba(255,255,255,0.1)'}`,
                color:
                  stage.status === 'done'    ? '#22c55e' :
                  stage.status === 'active'  ? '#818cf8' :
                  stage.status === 'delayed' ? '#ef4444' :
                  '#475569',
                zIndex: 1,
              }}>
                {stage.status === 'done' ? <CheckCircle2 size={14} /> : STAGE_ICONS[stage.id]}
              </div>

              {/* Contenu */}
              <div style={{ flex: 1, paddingBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{
                    color: stage.status === 'done' ? '#94a3b8' : stage.status === 'active' ? '#e2e8f0' : '#64748b',
                    fontSize: '13px', fontWeight: stage.status === 'active' ? 700 : 500,
                  }}>
                    {stage.label}
                    {stage.status === 'active' && (
                      <span style={{
                        marginLeft: '8px', fontSize: '10px', padding: '1px 7px', borderRadius: '20px',
                        background: 'rgba(99,102,241,0.2)', color: '#818cf8', fontWeight: 700, letterSpacing: '0.3px',
                      }}>EN COURS</span>
                    )}
                  </span>
                  {stage.time && (
                    <span style={{ color: '#475569', fontSize: '11px', flexShrink: 0, marginLeft: '8px' }}>
                      <Clock size={10} style={{ display: 'inline', marginRight: '3px' }} />
                      {stage.time}
                    </span>
                  )}
                </div>
                {stage.location && (
                  <div style={{ color: '#475569', fontSize: '11px', marginTop: '2px' }}>
                    <MapPin size={10} style={{ display: 'inline', marginRight: '3px' }} />{stage.location}
                  </div>
                )}
                {stage.notes && (
                  <div style={{
                    marginTop: '6px', padding: '6px 10px', borderRadius: '6px', fontSize: '12px',
                    background: stage.notes.includes('⚠️') || stage.notes.includes('🚨') ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.03)',
                    border: stage.notes.includes('⚠️') || stage.notes.includes('🚨') ? '1px solid rgba(239,68,68,0.15)' : '1px solid rgba(255,255,255,0.04)',
                    color: stage.notes.includes('⚠️') || stage.notes.includes('🚨') ? '#fca5a5' : '#64748b',
                  }}>
                    {stage.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incidents */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '14px', fontWeight: 700 }}>
            🚨 Incidents
            {openIncidents.length > 0 && (
              <span style={{
                marginLeft: '8px', background: 'rgba(239,68,68,0.15)', color: '#ef4444',
                borderRadius: '20px', padding: '1px 8px', fontSize: '11px', fontWeight: 700,
              }}>{openIncidents.length} ouvert{openIncidents.length > 1 ? 's' : ''}</span>
            )}
          </h3>
          <button onClick={onReport} style={{
            padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 700,
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444',
            display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s',
          }}>
            <Plus size={13} /> Signaler
          </button>
        </div>

        {groupIncidents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#475569' }}>
            <CheckCircle2 size={32} style={{ margin: '0 auto 8px', display: 'block', color: '#22c55e', opacity: 0.5 }} />
            <div style={{ fontSize: '13px' }}>Aucun incident pour ce groupe</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {groupIncidents.map(inc => {
              const typeInfo = INCIDENT_TYPES[inc.type]
              const isResolving = resolvingId === inc.id
              return (
                <div key={inc.id} style={{
                  borderRadius: '10px', border: `1px solid ${
                    inc.severity === 'urgent' ? 'rgba(239,68,68,0.25)' :
                    inc.severity === 'warning' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.07)'}`,
                  background: inc.status === 'resolved' ? 'rgba(255,255,255,0.02)' :
                    inc.severity === 'urgent' ? 'rgba(239,68,68,0.06)' :
                    inc.severity === 'warning' ? 'rgba(245,158,11,0.05)' : 'rgba(255,255,255,0.03)',
                  overflow: 'hidden',
                }}>
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                        <span style={{ color: typeInfo.color }}>{typeInfo.icon}</span>
                        <span style={{ color: inc.status === 'resolved' ? '#64748b' : '#e2e8f0', fontSize: '13px', fontWeight: 600 }}>{inc.title}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <span style={{
                          fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '20px',
                          background: inc.status === 'resolved' ? 'rgba(34,197,94,0.1)' : inc.status === 'in_progress' ? 'rgba(99,102,241,0.1)' : 'rgba(239,68,68,0.1)',
                          color: inc.status === 'resolved' ? '#22c55e' : inc.status === 'in_progress' ? '#818cf8' : '#ef4444',
                        }}>
                          {inc.status === 'resolved' ? '✓ Résolu' : inc.status === 'in_progress' ? '⟳ En cours' : '● Ouvert'}
                        </span>
                      </div>
                    </div>

                    {inc.description && (
                      <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: '12px', lineHeight: '1.5' }}>{inc.description}</p>
                    )}

                    {inc.actions.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                        {inc.actions.map((a, i) => (
                          <span key={i} style={{
                            fontSize: '11px', padding: '2px 8px', borderRadius: '4px',
                            background: 'rgba(34,197,94,0.08)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.15)',
                          }}>✓ {a}</span>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#475569', fontSize: '11px' }}>
                        {inc.reportedBy} · {inc.reportedAt}
                        {inc.resolvedAt && ` → Résolu ${inc.resolvedAt}`}
                      </span>
                      {inc.status !== 'resolved' && (
                        <button onClick={() => { setResolvingId(inc.id); setResolutionText('') }}
                          style={{
                            padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px',
                            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e',
                            display: 'flex', alignItems: 'center', gap: '4px',
                          }}>
                          <ThumbsUp size={10} /> Résoudre
                        </button>
                      )}
                    </div>

                    {inc.resolution && (
                      <div style={{ marginTop: '8px', padding: '8px 10px', borderRadius: '6px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)', color: '#4ade80', fontSize: '12px' }}>
                        ✓ {inc.resolution}
                      </div>
                    )}
                  </div>

                  {/* Formulaire résolution */}
                  {isResolving && (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', background: 'rgba(0,0,0,0.15)' }}>
                      <textarea value={resolutionText} onChange={e => setResolutionText(e.target.value)}
                        placeholder="Décrivez comment l'incident a été résolu..."
                        rows={2}
                        style={{
                          width: '100%', padding: '8px 10px', borderRadius: '6px', fontSize: '12px',
                          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit', marginBottom: '8px',
                        }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setResolvingId(null)} style={{
                          flex: 1, padding: '7px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px',
                          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b',
                        }}>Annuler</button>
                        <button onClick={() => { onResolve(inc.id, resolutionText); setResolvingId(null) }}
                          style={{
                            flex: 2, padding: '7px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 700,
                            background: 'linear-gradient(135deg, #22c55e, #16a34a)', border: 'none', color: '#fff',
                          }}>
                          ✓ Marquer résolu
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page principale ───────────────────────────────────────────────

export function GroupLiveTrackingPage() {
  const [groups] = useState<ActiveGroup[]>(DEMO_GROUPS)
  const [incidents, setIncidents] = useState<Incident[]>(DEMO_INCIDENTS)
  const [selectedId, setSelectedId] = useState<string>('G002')
  const [reportingFor, setReportingFor] = useState<{ id: string; name: string } | null>(null)
  const [filterStatus, setFilterStatus] = useState<GroupStatus | 'all'>('all')
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const selectedGroup = groups.find(g => g.id === selectedId)

  const stats = useMemo(() => {
    const open = incidents.filter(i => i.status !== 'resolved').length
    const resolved = incidents.filter(i => i.status === 'resolved').length
    const critical = groups.filter(g => g.status === 'critical').length
    const active = groups.filter(g => g.status !== 'completed').length
    return { open, resolved, critical, active }
  }, [incidents, groups])

  const filteredGroups = useMemo(() =>
    filterStatus === 'all' ? groups : groups.filter(g => g.status === filterStatus)
  , [groups, filterStatus])

  function handleNewIncident(inc: Incident) {
    setIncidents(prev => [inc, ...prev])
  }

  function handleResolve(incId: string, resolution: string) {
    const now = new Date()
    const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`
    setIncidents(prev => prev.map(i =>
      i.id === incId ? { ...i, status: 'resolved' as const, resolvedAt: timeStr, resolution: resolution || 'Résolu par l\'opérateur' } : i
    ))
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0f1117', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      {/* Barre de titre */}
      <div style={{
        padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))',
              borderRadius: '10px', padding: '8px',
            }}>
              <Navigation size={20} color="#818cf8" />
            </div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#fff' }}>
              Suivi Groupes — Temps Réel
            </h1>
          </div>
          <div style={{ color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wifi size={12} color="#22c55e" />
            <span style={{ color: '#22c55e', fontSize: '12px' }}>Live</span>
            · Dernière mise à jour {lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            · Mardi 28 avril 2026
          </div>
        </div>

        {/* Stats rapides */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {[
            { label: 'Groupes actifs', value: stats.active, icon: <Users size={14} />, color: '#818cf8', bg: 'rgba(99,102,241,0.1)' },
            { label: 'Incidents ouverts', value: stats.open, icon: <AlertTriangle size={14} />, color: stats.open > 0 ? '#f59e0b' : '#22c55e', bg: stats.open > 0 ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)' },
            { label: 'Critiques', value: stats.critical, icon: <Shield size={14} />, color: stats.critical > 0 ? '#ef4444' : '#22c55e', bg: stats.critical > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)' },
            { label: 'Résolus auj.', value: stats.resolved, icon: <CheckCircle2 size={14} />, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
          ].map(s => (
            <div key={s.label} style={{
              background: s.bg, borderRadius: '10px', padding: '10px 14px',
              border: `1px solid ${s.color}22`, textAlign: 'center', minWidth: '80px',
            }}>
              <div style={{ color: s.color, display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>{s.icon}</div>
              <div style={{ color: s.color, fontSize: '20px', fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
              <div style={{ color: '#475569', fontSize: '10px', marginTop: '3px', whiteSpace: 'nowrap' }}>{s.label}</div>
            </div>
          ))}
          <button onClick={() => setLastRefresh(new Date())} style={{
            padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b',
            display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px',
          }}>
            <RefreshCw size={14} /> Actualiser
          </button>
        </div>
      </div>

      {/* Corps — 2 colonnes */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Colonne gauche — liste groupes */}
        <div style={{
          width: '320px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Filtres */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {([['all','Tous'], ['critical','Critiques'], ['delayed','Retardés'], ['on_track','OK'], ['completed','Terminés']] as const).map(([s, l]) => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  style={{
                    flex: 1, padding: '5px 4px', borderRadius: '6px', cursor: 'pointer', fontSize: '10px', fontWeight: 600,
                    background: filterStatus === s ? 'rgba(99,102,241,0.2)' : 'transparent',
                    border: filterStatus === s ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent',
                    color: filterStatus === s ? '#818cf8' : '#475569',
                    transition: 'all 0.15s',
                  }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Liste */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {filteredGroups.map(g => {
              const groupIncs = incidents.filter(i => i.groupId === g.id && i.status !== 'resolved')
              const st = STATUS_STYLES[g.status]
              const isSelected = selectedId === g.id
              const currentStage = g.stages.find(s => s.status === 'active')

              return (
                <button key={g.id} onClick={() => setSelectedId(g.id)}
                  style={{
                    width: '100%', padding: '14px', borderRadius: '10px', cursor: 'pointer', marginBottom: '6px',
                    textAlign: 'left', border: isSelected ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.05)',
                    background: isSelected ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                    transition: 'all 0.15s',
                  }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: isSelected ? '#c7d2fe' : '#e2e8f0', fontSize: '13px', fontWeight: 600, lineHeight: '1.3' }}>
                      {g.name.length > 32 ? g.name.substring(0,32) + '…' : g.name}
                    </span>
                    <span style={{
                      flexShrink: 0, width: '8px', height: '8px', borderRadius: '50%',
                      background: st.dot, marginTop: '4px', boxShadow: `0 0 6px ${st.dot}`,
                    }} />
                  </div>
                  {/* Client + pax */}
                  <div style={{ color: '#475569', fontSize: '11px', marginBottom: '6px' }}>
                    {g.nationality} · {g.pax} pax · {g.client.substring(0,24)}
                  </div>
                  {/* Stage actuel */}
                  {currentStage && (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      fontSize: '11px', padding: '3px 8px', borderRadius: '6px',
                      background: 'rgba(99,102,241,0.08)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.15)',
                    }}>
                      {STAGE_ICONS[currentStage.id]}
                      <span>{currentStage.label}</span>
                    </div>
                  )}
                  {g.status === 'completed' && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(100,116,139,0.1)', color: '#64748b', border: '1px solid rgba(100,116,139,0.15)' }}>
                      <CheckCircle2 size={11} /> Circuit terminé
                    </div>
                  )}
                  {/* Incidents ouverts */}
                  {groupIncs.length > 0 && (
                    <div style={{ marginTop: '6px', display: 'flex', gap: '4px' }}>
                      {groupIncs.map(i => (
                        <span key={i.id} style={{
                          fontSize: '10px', padding: '2px 7px', borderRadius: '4px', fontWeight: 600,
                          background: i.severity === 'urgent' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.1)',
                          color: i.severity === 'urgent' ? '#ef4444' : '#f59e0b',
                          border: `1px solid ${i.severity === 'urgent' ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.2)'}`,
                        }}>
                          🚨 {INCIDENT_TYPES[i.type].label}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Colonne droite — détail groupe */}
        <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto' }}>
          {selectedGroup ? (
            <GroupDetail
              group={selectedGroup}
              incidents={incidents}
              onReport={() => setReportingFor({ id: selectedGroup.id, name: selectedGroup.name })}
              onResolve={handleResolve}
            />
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', flexDirection: 'column', gap: '12px' }}>
              <Navigation size={48} style={{ opacity: 0.3 }} />
              <p style={{ margin: 0 }}>Sélectionnez un groupe pour voir son suivi</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal signalement */}
      {reportingFor && (
        <ReportModal
          groupId={reportingFor.id}
          groupName={reportingFor.name}
          onClose={() => setReportingFor(null)}
          onSubmit={handleNewIncident}
        />
      )}
    </div>
  )
}
