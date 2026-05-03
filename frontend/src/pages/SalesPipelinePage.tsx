/**
 * SalesPipelinePage — Pipeline commercial visuel (Kanban)
 * Inspiré d'Ezus.io : Prospect → Devis → Accepté → Acompte → Confirmé → En cours → Terminé
 */
import { useState, useMemo } from 'react'
import {
  Plus, X, Phone, Mail, Globe, DollarSign, Users, Calendar,
  ChevronRight, TrendingUp, Flag, Star, Filter, Search,
  ArrowRight, CheckCircle2, Clock, AlertCircle, Zap, Eye
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────

type StageKey = 'prospect' | 'devis' | 'envoye' | 'accepte' | 'acompte' | 'confirme' | 'en_cours' | 'termine'

interface Deal {
  id: string
  title: string
  client: string
  country: string
  flag: string
  pax: number
  budget: number
  currency: string
  stage: StageKey
  probability: number
  startDate: string
  createdAt: string
  notes?: string
  tags: string[]
  priority: 'high' | 'medium' | 'low'
  assignee: string
}

// ─── Pipeline Stages ──────────────────────────────────────────────

const STAGES: { key: StageKey; label: string; color: string; bg: string; icon: string }[] = [
  { key: 'prospect',  label: 'Prospect',      color: '#64748b', bg: 'rgba(100,116,139,0.1)',  icon: '🔍' },
  { key: 'devis',     label: 'Devis préparé', color: '#818cf8', bg: 'rgba(99,102,241,0.1)',   icon: '📝' },
  { key: 'envoye',    label: 'Devis envoyé',  color: '#a78bfa', bg: 'rgba(139,92,246,0.1)',   icon: '📨' },
  { key: 'accepte',   label: 'Accepté',       color: '#38bdf8', bg: 'rgba(56,189,248,0.1)',   icon: '✅' },
  { key: 'acompte',   label: 'Acompte reçu',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   icon: '💶' },
  { key: 'confirme',  label: 'Confirmé',      color: '#34d399', bg: 'rgba(52,211,153,0.1)',   icon: '🎯' },
  { key: 'en_cours',  label: 'En cours',      color: '#f4c430', bg: 'rgba(244,196,48,0.1)',   icon: '▶️' },
  { key: 'termine',   label: 'Terminé',       color: '#22c55e', bg: 'rgba(34,197,94,0.1)',    icon: '🏁' },
]

// ─── Demo Data ────────────────────────────────────────────────────

const DEMO_DEALS: Deal[] = [
  { id:'D001', title:'Circuit Impérial 7J',    client:'Voyages Lumière Paris',   country:'France',     flag:'🇫🇷', pax:24, budget:142000, currency:'MAD', stage:'en_cours', probability:100, startDate:'28 Avr', createdAt:'5 Avr',  tags:['Groupe','Culturel'],  priority:'high',   assignee:'Sara B.' },
  { id:'D002', title:'Désert & Kasbahs 10J',   client:'Morocco Exclusive GmbH',  country:'Allemagne',  flag:'🇩🇪', pax:16, budget:98000,  currency:'MAD', stage:'confirme', probability:95,  startDate:'3 Mai',  createdAt:'8 Avr',  tags:['Aventure','4x4'],     priority:'high',   assignee:'Youssef T.' },
  { id:'D003', title:'Honeymoon Collection',   client:'Arabian Holidays LLC',    country:'Émirats',    flag:'🇦🇪', pax:6,  budget:85000,  currency:'MAD', stage:'acompte',  probability:90,  startDate:'28 Avr', createdAt:'10 Avr', tags:['VIP','Luxe'],         priority:'high',   assignee:'Sara B.' },
  { id:'D004', title:'Circuit Méditerranée',   client:'Viajes Sueños Madrid',    country:'Espagne',    flag:'🇪🇸', pax:32, budget:165000, currency:'MAD', stage:'accepte',  probability:80,  startDate:'15 Mai', createdAt:'12 Avr', tags:['Groupe','Familial'],  priority:'medium', assignee:'Omar C.' },
  { id:'D005', title:'Atlas & Désert 8J',      client:'Globetrotter Zürich',     country:'Suisse',     flag:'🇨🇭', pax:12, budget:74000,  currency:'MAD', stage:'envoye',   probability:60,  startDate:'20 Mai', createdAt:'15 Avr', tags:['Aventure'],           priority:'medium', assignee:'Youssef T.' },
  { id:'D006', title:'Maroc Authentique 5J',   client:'Grand Tour Roma SRL',     country:'Italie',     flag:'🇮🇹', pax:20, budget:92000,  currency:'MAD', stage:'envoye',   probability:55,  startDate:'1 Jun',  createdAt:'18 Avr', tags:['Culturel','Gastrono'],priority:'medium', assignee:'Sara B.' },
  { id:'D007', title:'Sahara Experience VIP',  client:'Luxury Escapes London',   country:'UK',         flag:'🇬🇧', pax:8,  budget:110000, currency:'MAD', stage:'devis',    probability:40,  startDate:'10 Jun', createdAt:'20 Avr', tags:['VIP','Désert'],       priority:'high',   assignee:'Omar C.' },
  { id:'D008', title:'Circuit Familles 6J',    client:'Fun Travel Amsterdam',    country:'Pays-Bas',   flag:'🇳🇱', pax:28, budget:128000, currency:'MAD', stage:'devis',    probability:35,  startDate:'25 Jun', createdAt:'22 Avr', tags:['Famille','Enfants'],  priority:'low',    assignee:'Youssef T.' },
  { id:'D009', title:'Incentive Corporate',    client:'Sanofi France',           country:'France',     flag:'🇫🇷', pax:45, budget:290000, currency:'MAD', stage:'prospect', probability:25,  startDate:'Jul',    createdAt:'24 Avr', tags:['MICE','Corporate'],   priority:'high',   assignee:'Sara B.' },
  { id:'D010', title:'Golf & Gastronomie 4J',  client:'Golf Tours Belgium',      country:'Belgique',   flag:'🇧🇪', pax:16, budget:68000,  currency:'MAD', stage:'prospect', probability:20,  startDate:'Aoû',    createdAt:'26 Avr', tags:['Golf','Luxe'],        priority:'low',    assignee:'Omar C.' },
  { id:'D011', title:'Noces à Marrakech',      client:'Agence Bonheur Bordeaux', country:'France',     flag:'🇫🇷', pax:4,  budget:45000,  currency:'MAD', stage:'termine',  probability:100, startDate:'15 Avr', createdAt:'1 Mar',  tags:['Mariage','Luxe'],     priority:'medium', assignee:'Sara B.' },
  { id:'D012', title:'Tour Grandes Villes 9J', client:'Discover Morocco Oslo',   country:'Norvège',    flag:'🇳🇴', pax:18, budget:102000, currency:'MAD', stage:'termine',  probability:100, startDate:'10 Avr', createdAt:'5 Mar',  tags:['Groupe','Culturel'],  priority:'medium', assignee:'Omar C.' },
]

const PRIORITY_COLORS = { high:'#ef4444', medium:'#f59e0b', low:'#64748b' }
const PRIORITY_LABELS = { high:'🔴 Urgent', medium:'🟡 Normal', low:'🔵 Faible' }

// ─── Add Deal Modal ────────────────────────────────────────────────

interface AddDealModalProps { onClose:()=>void; onAdd:(d:Deal)=>void }

function AddDealModal({ onClose, onAdd }: AddDealModalProps) {
  const [form, setForm] = useState({ title:'', client:'', country:'France', flag:'🇫🇷', pax:'', budget:'', stage:'prospect' as StageKey, notes:'' })
  const FLAGS: Record<string,string> = { France:'🇫🇷', Allemagne:'🇩🇪', 'Espagne':'🇪🇸', Italie:'🇮🇹', 'Royaume-Uni':'🇬🇧', 'Pays-Bas':'🇳🇱', Belgique:'🇧🇪', Suisse:'🇨🇭', Norvège:'🇳🇴', 'Émirats':'🇦🇪', 'États-Unis':'🇺🇸', Autre:'🌍' }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, padding:'20px' }}>
      <div style={{ background:'#1a2035', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'16px', width:'100%', maxWidth:'520px', padding:'28px', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ background:'rgba(99,102,241,0.15)', borderRadius:'8px', padding:'8px' }}><Plus size={18} color="#818cf8"/></div>
            <span style={{ color:'#fff', fontWeight:700, fontSize:'17px' }}>Nouveau dossier</span>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b' }}><X size={20}/></button>
        </div>
        {[
          ['Titre du circuit *', 'title', 'text', 'Ex: Circuit Impérial 7J', ''],
          ['Client / Agence *', 'client', 'text', 'Ex: Voyages Lumière Paris', ''],
        ].map(([label, key, type, placeholder]) => (
          <div key={key as string} style={{ marginBottom:'14px' }}>
            <label style={{ display:'block', fontSize:'12px', fontWeight:700, color:'#94a3b8', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{label as string}</label>
            <input type={type as string} placeholder={placeholder as string} value={(form as any)[key as string]}
              onChange={e => setForm(f => ({ ...f, [key as string]: e.target.value }))}
              style={{ width:'100%', padding:'10px 12px', borderRadius:'8px', fontSize:'14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff', outline:'none', boxSizing:'border-box' }}
            />
          </div>
        ))}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'14px' }}>
          <div>
            <label style={{ display:'block', fontSize:'12px', fontWeight:700, color:'#94a3b8', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>Pays</label>
            <select value={form.country} onChange={e => setForm(f => ({ ...f, country:e.target.value, flag: FLAGS[e.target.value]||'🌍' }))}
              style={{ width:'100%', padding:'10px 12px', borderRadius:'8px', fontSize:'14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff', outline:'none' }}>
              {Object.keys(FLAGS).map(c => <option key={c} value={c}>{FLAGS[c]} {c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display:'block', fontSize:'12px', fontWeight:700, color:'#94a3b8', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>Nb pax</label>
            <input type="number" placeholder="Ex: 20" value={form.pax} onChange={e => setForm(f => ({ ...f, pax:e.target.value }))}
              style={{ width:'100%', padding:'10px 12px', borderRadius:'8px', fontSize:'14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff', outline:'none', boxSizing:'border-box' }}
            />
          </div>
        </div>
        <div style={{ marginBottom:'14px' }}>
          <label style={{ display:'block', fontSize:'12px', fontWeight:700, color:'#94a3b8', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>Budget estimé (MAD)</label>
          <input type="number" placeholder="Ex: 85000" value={form.budget} onChange={e => setForm(f => ({ ...f, budget:e.target.value }))}
            style={{ width:'100%', padding:'10px 12px', borderRadius:'8px', fontSize:'14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff', outline:'none', boxSizing:'border-box' }}
          />
        </div>
        <div style={{ marginBottom:'14px' }}>
          <label style={{ display:'block', fontSize:'12px', fontWeight:700, color:'#94a3b8', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>Étape initiale</label>
          <select value={form.stage} onChange={e => setForm(f => ({ ...f, stage:e.target.value as StageKey }))}
            style={{ width:'100%', padding:'10px 12px', borderRadius:'8px', fontSize:'14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff', outline:'none' }}>
            {STAGES.map(s => <option key={s.key} value={s.key}>{s.icon} {s.label}</option>)}
          </select>
        </div>
        <div style={{ marginBottom:'20px' }}>
          <label style={{ display:'block', fontSize:'12px', fontWeight:700, color:'#94a3b8', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>Notes</label>
          <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes:e.target.value }))} rows={3}
            placeholder="Demandes spéciales, remarques, contact commercial..."
            style={{ width:'100%', padding:'10px 12px', borderRadius:'8px', fontSize:'13px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff', outline:'none', resize:'vertical', boxSizing:'border-box', fontFamily:'inherit' }}
          />
        </div>
        <div style={{ display:'flex', gap:'10px' }}>
          <button onClick={onClose} style={{ flex:1, padding:'11px', borderRadius:'8px', cursor:'pointer', fontSize:'14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8' }}>Annuler</button>
          <button onClick={() => {
            if (!form.title.trim() || !form.client.trim()) return
            onAdd({ id:'D'+Date.now(), title:form.title, client:form.client, country:form.country, flag:form.flag,
              pax:parseInt(form.pax)||0, budget:parseInt(form.budget)||0, currency:'MAD', stage:form.stage,
              probability: STAGES.find(s=>s.key===form.stage) ? [5,20,40,60,80,90,95,100][STAGES.findIndex(s=>s.key===form.stage)] : 20,
              startDate:'À définir', createdAt:'Aujourd\'hui', tags:[], priority:'medium', assignee:'Non assigné', notes:form.notes })
            onClose()
          }} disabled={!form.title.trim()||!form.client.trim()}
            style={{ flex:2, padding:'11px', borderRadius:'8px', cursor:'pointer', fontSize:'14px', fontWeight:700, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff' }}>
            ➕ Créer le dossier
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Deal Card ────────────────────────────────────────────────────

function DealCard({ deal, onMove }: { deal:Deal; onMove:(id:string,dir:'left'|'right')=>void }) {
  const stageIdx = STAGES.findIndex(s => s.key === deal.stage)
  return (
    <div style={{
      background:'#1a2035', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'12px',
      padding:'14px', marginBottom:'10px', cursor:'default',
      transition:'all 0.2s', borderLeft:`3px solid ${PRIORITY_COLORS[deal.priority]}`,
    }}
    onMouseEnter={e=>(e.currentTarget.style.borderColor='rgba(99,102,241,0.4)')}
    onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(255,255,255,0.06)')}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' }}>
        <div style={{ fontSize:'13px', fontWeight:700, color:'#fff', lineHeight:1.3, flex:1, marginRight:'8px' }}>{deal.flag} {deal.title}</div>
        <div style={{ display:'flex', gap:'4px', flexShrink:0 }}>
          {stageIdx > 0 && (
            <button onClick={()=>onMove(deal.id,'left')} style={{ width:'22px', height:'22px', borderRadius:'4px', border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.04)', cursor:'pointer', color:'#64748b', fontSize:'10px', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
          )}
          {stageIdx < STAGES.length-1 && (
            <button onClick={()=>onMove(deal.id,'right')} style={{ width:'22px', height:'22px', borderRadius:'4px', border:'1px solid rgba(99,102,241,0.25)', background:'rgba(99,102,241,0.1)', cursor:'pointer', color:'#818cf8', fontSize:'10px', display:'flex', alignItems:'center', justifyContent:'center' }}>→</button>
          )}
        </div>
      </div>
      <div style={{ fontSize:'12px', color:'#64748b', marginBottom:'10px' }}>{deal.client}</div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'5px', marginBottom:'10px' }}>
        <span style={{ fontSize:'11px', padding:'2px 7px', borderRadius:'5px', background:'rgba(255,255,255,0.05)', color:'#94a3b8' }}><Users size={9} style={{display:'inline',marginRight:'3px'}}/>{deal.pax} pax</span>
        <span style={{ fontSize:'11px', padding:'2px 7px', borderRadius:'5px', background:'rgba(244,196,48,0.1)', color:'#f4c430', fontWeight:700 }}>{(deal.budget/1000).toFixed(0)}k MAD</span>
        {deal.tags.slice(0,1).map(t => (
          <span key={t} style={{ fontSize:'11px', padding:'2px 7px', borderRadius:'5px', background:'rgba(99,102,241,0.08)', color:'#818cf8' }}>{t}</span>
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
          <div style={{ width:'52px', height:'4px', background:'rgba(255,255,255,0.08)', borderRadius:'4px', overflow:'hidden' }}>
            <div style={{ height:'100%', borderRadius:'4px', width:`${deal.probability}%`, background: deal.probability>=80?'#22c55e':deal.probability>=50?'#f59e0b':'#6366f1' }}/>
          </div>
          <span style={{ fontSize:'11px', color:'#64748b' }}>{deal.probability}%</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'10px', color:'#475569' }}>
          <Calendar size={10}/>
          {deal.startDate}
        </div>
      </div>
      {deal.notes && (
        <div style={{ marginTop:'8px', fontSize:'11px', color:'#475569', padding:'6px 8px', background:'rgba(255,255,255,0.02)', borderRadius:'6px', borderLeft:'2px solid rgba(255,255,255,0.08)', lineHeight:1.5 }}>
          {deal.notes.substring(0,60)}{deal.notes.length>60?'…':''}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────

export function SalesPipelinePage() {
  const [deals, setDeals] = useState<Deal[]>(DEMO_DEALS)
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')
  const [filterPriority, setFilterPriority] = useState<'all'|'high'|'medium'|'low'>('all')
  const [view, setView] = useState<'kanban'|'list'>('kanban')

  const filtered = useMemo(() => deals.filter(d => {
    const q = search.toLowerCase()
    const matchSearch = !q || d.title.toLowerCase().includes(q) || d.client.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)
    const matchPriority = filterPriority === 'all' || d.priority === filterPriority
    return matchSearch && matchPriority
  }), [deals, search, filterPriority])

  const stats = useMemo(() => {
    const active = deals.filter(d => d.stage !== 'termine' && d.stage !== 'prospect')
    const pipeline = active.reduce((s,d) => s + d.budget * d.probability / 100, 0)
    const won = deals.filter(d => d.stage === 'termine').reduce((s,d) => s + d.budget, 0)
    const conversion = Math.round(deals.filter(d=>d.stage==='termine').length / Math.max(deals.length,1) * 100)
    return { total: deals.length, pipeline: Math.round(pipeline/1000), won: Math.round(won/1000), conversion }
  }, [deals])

  function moveStage(id: string, dir: 'left'|'right') {
    setDeals(prev => prev.map(d => {
      if (d.id !== id) return d
      const idx = STAGES.findIndex(s => s.key === d.stage)
      const newIdx = dir === 'right' ? Math.min(idx+1, STAGES.length-1) : Math.max(idx-1, 0)
      return { ...d, stage: STAGES[newIdx].key, probability: [5,20,40,60,80,90,95,100][newIdx] }
    }))
  }

  const stageMap = useMemo(() => {
    const m: Record<string, Deal[]> = {}
    STAGES.forEach(s => { m[s.key] = filtered.filter(d => d.stage === s.key) })
    return m
  }, [filtered])

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:'#0f1117', color:'#fff', fontFamily:'system-ui,sans-serif' }}>

      {/* Header */}
      <div style={{ padding:'20px 24px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px' }}>
              <div style={{ background:'linear-gradient(135deg,rgba(244,196,48,.25),rgba(245,158,11,.15))', borderRadius:'10px', padding:'8px' }}>
                <TrendingUp size={20} color="#f4c430"/>
              </div>
              <h1 style={{ margin:0, fontSize:'20px', fontWeight:800 }}>Pipeline Commercial</h1>
            </div>
            <div style={{ color:'#64748b', fontSize:'13px' }}>Prospect → Devis → Accepté → Confirmé → Terminé</div>
          </div>
          <div style={{ display:'flex', gap:'10px', alignItems:'center', flexWrap:'wrap' }}>
            {/* Stats rapides */}
            {[
              { label:'Pipeline pondéré', val:`${stats.pipeline}k MAD`, color:'#818cf8' },
              { label:'CA gagné', val:`${stats.won}k MAD`, color:'#22c55e' },
              { label:'Conversion', val:`${stats.conversion}%`, color:'#f4c430' },
            ].map(s => (
              <div key={s.label} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'10px', padding:'8px 14px', textAlign:'center' }}>
                <div style={{ color:s.color, fontSize:'16px', fontWeight:800 }}>{s.val}</div>
                <div style={{ color:'#475569', fontSize:'10px', marginTop:'2px' }}>{s.label}</div>
              </div>
            ))}
            <button onClick={()=>setShowAdd(true)} style={{ padding:'10px 18px', borderRadius:'10px', border:'none', cursor:'pointer', fontSize:'14px', fontWeight:700, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', display:'flex', alignItems:'center', gap:'6px' }}>
              <Plus size={15}/> Nouveau dossier
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div style={{ display:'flex', gap:'10px', marginTop:'14px', flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ position:'relative', flex:'1', minWidth:'200px', maxWidth:'320px' }}>
            <Search size={14} style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', color:'#64748b' }}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher client, circuit, pays..."
              style={{ width:'100%', padding:'9px 12px 9px 32px', borderRadius:'8px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'#fff', fontSize:'13px', outline:'none', boxSizing:'border-box' }}
            />
          </div>
          {(['all','high','medium','low'] as const).map(p => (
            <button key={p} onClick={()=>setFilterPriority(p)}
              style={{ padding:'8px 14px', borderRadius:'8px', cursor:'pointer', fontSize:'12px', fontWeight:600, border:'none',
                background: filterPriority===p ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                color: filterPriority===p ? '#818cf8' : '#64748b',
                borderWidth:1, borderStyle:'solid', borderColor: filterPriority===p ? 'rgba(99,102,241,0.4)' : 'transparent',
              }}>
              {p==='all'?'Tous':PRIORITY_LABELS[p]}
            </button>
          ))}
          <div style={{ marginLeft:'auto', display:'flex', gap:'6px' }}>
            <button onClick={()=>setView('kanban')} style={{ padding:'7px 12px', borderRadius:'7px', border:'1px solid', cursor:'pointer', fontSize:'12px', background: view==='kanban'?'rgba(99,102,241,0.15)':'rgba(255,255,255,0.04)', borderColor: view==='kanban'?'rgba(99,102,241,0.3)':'rgba(255,255,255,0.07)', color: view==='kanban'?'#818cf8':'#64748b' }}>⬛ Kanban</button>
            <button onClick={()=>setView('list')}   style={{ padding:'7px 12px', borderRadius:'7px', border:'1px solid', cursor:'pointer', fontSize:'12px', background: view==='list'?'rgba(99,102,241,0.15)':'rgba(255,255,255,0.04)', borderColor: view==='list'?'rgba(99,102,241,0.3)':'rgba(255,255,255,0.07)', color: view==='list'?'#818cf8':'#64748b' }}>☰ Liste</button>
          </div>
        </div>
      </div>

      {/* Corps */}
      <div style={{ flex:1, overflow:'auto' }}>

        {/* KANBAN */}
        {view === 'kanban' && (
          <div style={{ display:'flex', gap:'0', height:'100%', minWidth:'fit-content' }}>
            {STAGES.map(stage => {
              const stageDealS = stageMap[stage.key] || []
              const stageTotal = stageDealS.reduce((s,d) => s+d.budget, 0)
              return (
                <div key={stage.key} style={{ width:'240px', flexShrink:0, borderRight:'1px solid rgba(255,255,255,0.05)', display:'flex', flexDirection:'column' }}>
                  {/* Colonne header */}
                  <div style={{ padding:'14px 14px 10px', borderBottom:'1px solid rgba(255,255,255,0.05)', flexShrink:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                        <span style={{ fontSize:'14px' }}>{stage.icon}</span>
                        <span style={{ fontSize:'12px', fontWeight:700, color:stage.color }}>{stage.label}</span>
                      </div>
                      <span style={{ background:stage.bg, color:stage.color, borderRadius:'20px', padding:'2px 8px', fontSize:'11px', fontWeight:700 }}>{stageDealS.length}</span>
                    </div>
                    <div style={{ fontSize:'11px', color:'#475569' }}>
                      {stageTotal > 0 ? `${(stageTotal/1000).toFixed(0)}k MAD` : '—'}
                    </div>
                    <div style={{ height:'2px', background:'rgba(255,255,255,0.05)', borderRadius:'2px', marginTop:'8px', overflow:'hidden' }}>
                      <div style={{ height:'100%', background:stage.color, width:`${Math.min(stageDealS.length*12,100)}%`, borderRadius:'2px', opacity:0.7 }}/>
                    </div>
                  </div>
                  {/* Cards */}
                  <div style={{ flex:1, overflowY:'auto', padding:'12px 10px' }}>
                    {stageDealS.length === 0 ? (
                      <div style={{ textAlign:'center', padding:'24px 8px', color:'#334155', fontSize:'12px' }}>
                        <div style={{ fontSize:'24px', marginBottom:'6px', opacity:.4 }}>○</div>
                        Aucun dossier
                      </div>
                    ) : (
                      stageDealS.map(d => <DealCard key={d.id} deal={d} onMove={moveStage}/>)
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* LIST */}
        {view === 'list' && (
          <div style={{ padding:'20px 24px' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                  {['Dossier','Client','Étape','Pax','Budget','Probabilité','Départ'].map(h => (
                    <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontSize:'11px', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => {
                  const st = STAGES.find(s=>s.key===d.stage)!
                  return (
                    <tr key={d.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td style={{ padding:'12px' }}>
                        <div style={{ fontWeight:700, color:'#fff', fontSize:'13px' }}>{d.flag} {d.title}</div>
                        <div style={{ fontSize:'11px', color:'#475569', marginTop:'2px', display:'flex', gap:'4px' }}>
                          {d.tags.map(t=><span key={t} style={{ background:'rgba(255,255,255,0.05)', padding:'1px 6px', borderRadius:'4px' }}>{t}</span>)}
                        </div>
                      </td>
                      <td style={{ padding:'12px', color:'#94a3b8', fontSize:'13px' }}>{d.client}</td>
                      <td style={{ padding:'12px' }}>
                        <span style={{ background:st.bg, color:st.color, padding:'4px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:700, whiteSpace:'nowrap' }}>{st.icon} {st.label}</span>
                      </td>
                      <td style={{ padding:'12px', color:'#94a3b8', fontSize:'13px' }}>{d.pax}</td>
                      <td style={{ padding:'12px', color:'#f4c430', fontWeight:700, fontSize:'13px' }}>{(d.budget/1000).toFixed(0)}k MAD</td>
                      <td style={{ padding:'12px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
                          <div style={{ width:'48px', height:'4px', background:'rgba(255,255,255,0.08)', borderRadius:'4px', overflow:'hidden' }}>
                            <div style={{ height:'100%', width:`${d.probability}%`, background:d.probability>=80?'#22c55e':d.probability>=50?'#f59e0b':'#6366f1', borderRadius:'4px' }}/>
                          </div>
                          <span style={{ fontSize:'12px', color:'#64748b' }}>{d.probability}%</span>
                        </div>
                      </td>
                      <td style={{ padding:'12px', color:'#64748b', fontSize:'12px' }}>{d.startDate}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAdd && <AddDealModal onClose={()=>setShowAdd(false)} onAdd={d=>{ setDeals(p=>[d,...p]); setShowAdd(false) }}/>}
    </div>
  )
}
