import { useState, useMemo } from 'react'
import {
  Users, Bed, Download, Plus, Trash2,
  UserPlus, CheckCircle2,
  FileSpreadsheet, Mail, ChevronRight, User,
  Loader2, X, AlertCircle
} from 'lucide-react'
import { clsx } from 'clsx'
import { roomingApi, passengersApi } from '@/lib/api'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Passenger {
  id: string
  name: string
  roomType: 'SGL' | 'DBL' | 'TWIN' | 'TRPL'
  roomNumber?: string
  dietary?: string
  notes?: string
  isGroupLeader?: boolean
}

// Map backend room_preference → UI roomType
function prefToType(pref?: string): Passenger['roomType'] {
  if (!pref) return 'DBL'
  const map: Record<string, Passenger['roomType']> = {
    single: 'SGL', double: 'DBL', twin: 'TWIN', triple: 'TRPL',
    sharing: 'DBL',
  }
  return map[pref.toLowerCase()] ?? 'DBL'
}

function typeToColor(t: Passenger['roomType']) {
  const c: Record<Passenger['roomType'], string> = {
    SGL:  'bg-blue-500/10 text-blue-500 border-blue-500/20',
    DBL:  'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    TWIN: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    TRPL: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  }
  return c[t]
}

// ── Add Participant Modal ─────────────────────────────────────────────────────

interface AddForm {
  first_name: string
  last_name: string
  room_preference: string
  dietary: string
  notes: string
  is_group_leader: boolean
}

function AddParticipantModal({ open, onClose, projectId }: {
  open: boolean
  onClose: () => void
  projectId: string
}) {
  const qc = useQueryClient()
  const [form, setForm] = useState<AddForm>({
    first_name: '', last_name: '',
    room_preference: 'double', dietary: 'standard',
    notes: '', is_group_leader: false,
  })

  const mutation = useMutation({
    mutationFn: () => passengersApi.add(projectId, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['passengers', projectId] })
      onClose()
      setForm({ first_name: '', last_name: '', room_preference: 'double', dietary: 'standard', notes: '', is_group_leader: false })
    },
  })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg text-slate-800 dark:text-cream">Ajouter un Participant</h2>
            <p className="text-[12px] text-slate-400 mt-0.5">Nouveau voyageur sur ce circuit</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Prénom *</label>
              <input
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] text-slate-800 dark:text-cream focus:ring-2 focus:ring-rihla transition-all"
                placeholder="John"
                value={form.first_name}
                onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Nom *</label>
              <input
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] text-slate-800 dark:text-cream focus:ring-2 focus:ring-rihla transition-all"
                placeholder="Smith"
                value={form.last_name}
                onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Type Chambre</label>
              <select
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] text-slate-800 dark:text-cream focus:ring-2 focus:ring-rihla transition-all"
                value={form.room_preference}
                onChange={e => setForm(f => ({ ...f, room_preference: e.target.value }))}
              >
                <option value="single">Single (SGL)</option>
                <option value="double">Double (DBL)</option>
                <option value="twin">Twin (TWIN)</option>
                <option value="triple">Triple (TRPL)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Régime</label>
              <select
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] text-slate-800 dark:text-cream focus:ring-2 focus:ring-rihla transition-all"
                value={form.dietary}
                onChange={e => setForm(f => ({ ...f, dietary: e.target.value }))}
              >
                <option value="standard">Standard</option>
                <option value="vegetarian">Végétarien</option>
                <option value="vegan">Vegan</option>
                <option value="halal">Halal</option>
                <option value="kosher">Kosher</option>
                <option value="gluten-free">Sans Gluten</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Notes Spéciales</label>
            <input
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[13px] text-slate-800 dark:text-cream focus:ring-2 focus:ring-rihla transition-all"
              placeholder="Fauteuil roulant, allergie noix..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_group_leader}
              onChange={e => setForm(f => ({ ...f, is_group_leader: e.target.checked }))}
              className="w-4 h-4 rounded accent-rihla"
            />
            <span className="text-[13px] font-bold text-slate-600 dark:text-slate-300">Chef de groupe / Guide (FOC)</span>
          </label>

          {mutation.isError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-[12px] font-bold">
              <AlertCircle size={14} /> Erreur lors de la création. Réessayez.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 btn btn-secondary">Annuler</button>
          <button
            onClick={() => mutation.mutate()}
            disabled={!form.first_name.trim() || !form.last_name.trim() || mutation.isPending}
            className="flex-1 btn btn-primary flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function RoomingListPage() {
  const { projectId = 'DEMO-PROJECT' } = useParams()
  const [isExporting, setIsExporting] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const qc = useQueryClient()

  // ── Fetch real passengers ──────────────────────────────────────────────────
  const { data: passengerData, isLoading } = useQuery({
    queryKey: ['passengers', projectId],
    queryFn: () => passengersApi.list(projectId).then(r => r.data),
    staleTime: 30_000,
  })

  // Map backend passengers → UI Participant list
  const participants: Passenger[] = useMemo(() => {
    const raw = passengerData?.passengers as any[] | undefined
    if (!raw || raw.length === 0) {
      // Demo fallback
      return [
        { id: '1', name: 'Mr. John Smith',     roomType: 'SGL',  roomNumber: '101' },
        { id: '2', name: 'Mrs. Jane Doe',       roomType: 'DBL',  roomNumber: '102' },
        { id: '3', name: 'Mr. Robert Doe',      roomType: 'DBL',  roomNumber: '102' },
        { id: '4', name: 'Ms. Alice Johnson',   roomType: 'TWIN', roomNumber: '105' },
        { id: '5', name: 'Mr. Michael Brown',   roomType: 'TWIN', roomNumber: '105' },
      ]
    }
    return raw.map((p: any) => ({
      id: p.id ?? String(Math.random()),
      name: [p.first_name, p.last_name].filter(Boolean).join(' ') || 'Passager',
      roomType: prefToType(p.room_preference),
      roomNumber: p.room_number ?? undefined,
      dietary: p.dietary,
      notes: p.notes,
      isGroupLeader: p.is_group_leader,
    }))
  }, [passengerData])

  // ── Stats (safe, no NaN) ───────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = participants.length
    const sgl  = participants.filter(p => p.roomType === 'SGL').length
    const dbl  = participants.filter(p => p.roomType === 'DBL' || p.roomType === 'TWIN').length
    const assigned = participants.filter(p => p.roomNumber).length
    return {
      total,
      sgl,
      dbl:  Math.ceil(dbl / 2),   // room count (2 pax per room)
      assigned,
      pct: total > 0 ? Math.round((assigned / total) * 100) : 0,
      allDone: total > 0 && assigned === total,
    }
  }, [participants])

  // ── Delete mutation ────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (passengerId: string) => passengersApi.remove(projectId, passengerId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['passengers', projectId] }),
  })

  // ── Export handler ─────────────────────────────────────────────────────────
  const handleExport = async (type: 'pdf' | 'excel') => {
    setIsExporting(type)
    try {
      const response = type === 'pdf'
        ? await roomingApi.exportPdf(projectId)
        : await roomingApi.exportExcel(projectId)

      const blob = new Blob([response.data], {
        type: type === 'pdf'
          ? 'application/pdf'
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `RoomingList_${projectId}_${new Date().toISOString().slice(0, 10)}.${type === 'pdf' ? 'pdf' : 'xlsx'}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      alert('Erreur lors de l\'export. Vérifiez la connexion au serveur.')
    } finally {
      setIsExporting(null)
    }
  }

  const isDemo = !passengerData?.passengers?.length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 transition-colors">
      <AddParticipantModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        projectId={projectId}
      />

      {/* ── HEADER ────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-end gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            Opérations <ChevronRight size={10} /> Rooming List
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-cream tracking-tighter flex items-center gap-4">
            <Users className="text-rihla" size={36} />
            Rooming List Manager
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-slate-500 text-sm font-medium italic">
              Projet : <span className="text-rihla font-bold">{passengerData?.project_name ?? projectId}</span>
            </p>
            {isDemo && (
              <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase rounded-md border border-amber-200 dark:border-amber-500/20">
                Données démo
              </span>
            )}
            {!isDemo && (
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase rounded-md border border-emerald-200 dark:border-emerald-500/20">
                Live — {passengerData.registered_pax} / {passengerData.expected_pax} PAX
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => handleExport('excel')}
            disabled={!!isExporting}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 transition-all shadow-sm disabled:opacity-50"
          >
            {isExporting === 'excel' ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
            Export Excel
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={!!isExporting}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
          >
            {isExporting === 'pdf' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Export PDF Hôtel
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-rihla text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-rihla/20 hover:-translate-y-0.5 transition-all"
          >
            <UserPlus size={16} /> Ajouter Participant
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">

        {/* ── LEFT: STATS & TOOLS ───────────────────────────────── */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-white/10 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Résumé Occupation</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Total PAX</span>
                <span className="text-lg font-black text-slate-800 dark:text-cream">
                  {isLoading ? <Loader2 size={16} className="animate-spin text-rihla inline" /> : stats.total}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Chambres SGL</span>
                <span className="text-lg font-black text-blue-500">{stats.sgl}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Chambres DBL/TWN</span>
                <span className="text-lg font-black text-emerald-500">{stats.dbl}</span>
              </div>
              <hr className="border-slate-100 dark:border-white/5" />
              <div className="pt-2">
                <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                  <span>Assignation</span>
                  <span className="text-rihla">{stats.pct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={clsx(
                      'h-full rounded-full transition-all duration-500',
                      stats.pct === 100 ? 'bg-emerald-500' : 'bg-rihla'
                    )}
                    style={{ width: `${stats.pct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={clsx(
            'rounded-[32px] p-6 text-white shadow-xl',
            stats.allDone ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-slate-900 shadow-slate-900/20'
          )}>
            <CheckCircle2 size={24} className={clsx('mb-4', stats.allDone ? 'text-white' : 'text-emerald-400')} />
            <h4 className="text-sm font-black mb-2 uppercase tracking-tight">
              {stats.allDone ? 'Prêt pour l\'envoi !' : 'En préparation'}
            </h4>
            <p className="text-[11px] text-white/60 leading-relaxed mb-6">
              {stats.allDone
                ? 'Tous les participants sont assignés. Envoyez la liste à la réception de l\'hôtel.'
                : `${stats.assigned} / ${stats.total} participants assignés à une chambre.`
              }
            </p>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
              <Mail size={14} /> Envoyer à l'Hôtel
            </button>
          </div>
        </div>

        {/* ── RIGHT: PARTICIPANTS TABLE ─────────────────────────── */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Participant</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Type Chambre</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">N° Chambre</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Notes Spéciales</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 size={32} className="text-rihla animate-spin" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Chargement des participants...</p>
                      </div>
                    </td>
                  </tr>
                ) : participants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-600">
                          <Users size={28} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-cream">Aucun participant</p>
                          <p className="text-[12px] text-slate-400 mt-1">Ajoutez les voyageurs de ce circuit.</p>
                        </div>
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-rihla text-white rounded-xl text-[11px] font-black uppercase tracking-widest"
                        >
                          <Plus size={14} /> Ajouter le premier participant
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  participants.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={clsx(
                            'w-8 h-8 rounded-full flex items-center justify-center',
                            p.isGroupLeader
                              ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-slate-100 dark:bg-white/5 text-slate-400'
                          )}>
                            <User size={14} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-cream">{p.name}</p>
                            {p.isGroupLeader && (
                              <p className="text-[10px] font-black text-amber-500 uppercase tracking-wider">Chef de groupe</p>
                            )}
                            {p.dietary && p.dietary !== 'standard' && (
                              <p className="text-[10px] text-slate-400 capitalize">{p.dietary}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={clsx(
                          'px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border',
                          typeToColor(p.roomType)
                        )}>
                          {p.roomType}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <input
                          type="text"
                          defaultValue={p.roomNumber ?? ''}
                          placeholder="—"
                          className="w-16 bg-transparent border-b border-dashed border-slate-200 dark:border-white/10 text-center text-sm font-mono font-bold focus:border-rihla outline-none placeholder:text-slate-300"
                        />
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[11px] text-slate-400 italic font-medium">
                          {p.notes || 'Aucune restriction'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => deleteMutation.mutate(p.id)}
                          disabled={deleteMutation.isPending && deleteMutation.variables === p.id}
                          className="p-2 text-slate-300 hover:text-red-500 disabled:opacity-50 transition-colors"
                        >
                          {deleteMutation.isPending && deleteMutation.variables === p.id
                            ? <Loader2 size={16} className="animate-spin" />
                            : <Trash2 size={16} />
                          }
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="p-6 bg-slate-50/50 dark:bg-white/[0.01] border-t border-slate-100 dark:border-white/5 flex justify-center">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 text-[11px] font-black text-rihla uppercase tracking-[0.2em] hover:opacity-80 transition-opacity"
              >
                <Plus size={14} /> Ajouter une ligne d'occupation
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
