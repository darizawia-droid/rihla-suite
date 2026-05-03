import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, Search, MapPin, Tag, Image as ImageIcon, FileText, Copy, Trash2,
  X, Check, Globe2, Sparkles, Package,
} from 'lucide-react'
import { mediaLibraryApi } from '@/lib/api'
import type { MediaAsset } from '@/lib/api'
import { PageHeader } from '@/components/layout/PageHeader'
import { Spinner } from '@/components/ui'
import { clsx } from 'clsx'

const TYPES = [
  { value: '',     label: 'Tous',           icon: ImageIcon },
  { value: 'photo', label: 'Photos',        icon: ImageIcon },
  { value: 'poi',   label: 'Descriptions',  icon: FileText },
]

export function MediaLibraryPage() {
  const qc = useQueryClient()
  const [type, setType] = useState('')
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<MediaAsset | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [justCopied, setJustCopied] = useState<string | null>(null)

  const { data: assets, isLoading } = useQuery({
    queryKey: ['media-assets', type, city, category, q],
    queryFn: () => mediaLibraryApi.list({ asset_type: type || undefined, city: city || undefined, category: category || undefined, q: q || undefined }).then(r => r.data),
    staleTime: 30_000,
  })

  const { data: facets } = useQuery({
    queryKey: ['media-facets'],
    queryFn: () => mediaLibraryApi.facets().then(r => r.data),
    staleTime: 60_000,
  })

  const removeMutation = useMutation({
    mutationFn: (id: string) => mediaLibraryApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['media-assets'] }); setSelected(null) },
  })

  const handleCopy = async (asset: MediaAsset) => {
    const text = asset.asset_type === 'photo' ? (asset as any).image_url ?? '' : (asset as any).description ?? ''
    await navigator.clipboard.writeText(text)
    setJustCopied(asset.id)
    setTimeout(() => setJustCopied(null), 2000)
  }

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const copySelection = async () => {
    const selectedAssets = assets?.filter(a => selectedIds.includes(a.id)) || []
    const text = selectedAssets.map(a => a.asset_type === 'photo' ? a.image_url : a.description).join('\n\n')
    await navigator.clipboard.writeText(text)
    alert(`${selectedIds.length} assets copiés !`)
    setSelectedIds([])
    setIsSelectionMode(false)
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen font-sans">
      <PageHeader
        title="Bibliothèque Stratégique"
        subtitle="Mutualisez photos HD et descriptions POI — optimisez vos propositions en un clic"
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => setIsSelectionMode(!isSelectionMode)}
              className={clsx(
                "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all border",
                isSelectionMode ? "bg-emerald-500 border-emerald-600 text-white" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-cream"
              )}
            >
              <Package size={14} /> {isSelectionMode ? `Sélection (${selectedIds.length})` : 'Mode Sélection'}
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rihla text-white text-[12px] font-bold hover:bg-rihla/90 transition-all shadow-lg shadow-rihla/20"
            >
              <Plus size={14} strokeWidth={2.5} /> Ajouter un asset
            </button>
          </div>
        }
      />

      <div className="p-8 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">

          {/* Sidebar facets */}
          <aside className="space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm">
              <FacetSection
                title="Type d'Asset"
                items={TYPES.map(t => ({ value: t.value, label: t.label, count: facets?.types.find(f => f.value === t.value)?.count }))}
                active={type}
                onChange={setType}
                showAll
              />
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm">
              <FacetSection
                title="Villes"
                items={(facets?.cities ?? []).map(c => ({ value: c.value, label: c.value, count: c.count }))}
                active={city}
                onChange={setCity}
                showAll
              />
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm">
              <FacetSection
                title="Secteurs"
                items={(facets?.categories ?? []).map(c => ({ value: c.value, label: c.value, count: c.count }))}
                active={category}
                onChange={setCategory}
                showAll
              />
            </div>
          </aside>

          {/* Main grid */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-lg">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, tag ou contenu…"
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-[14px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rihla/5 focus:border-rihla transition-all"
                />
              </div>
              {isSelectionMode && selectedIds.length > 0 && (
                <button 
                  onClick={copySelection}
                  className="px-6 py-3 bg-emerald-500 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
                >
                  Copier la sélection ({selectedIds.length})
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20"><Spinner size={32} /></div>
            ) : !assets?.length ? (
              <EmptyState onCreate={() => setShowCreate(true)} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {assets.map(a => (
                  <AssetCard
                    key={a.id}
                    asset={a}
                    copied={justCopied === a.id}
                    selected={selectedIds.includes(a.id)}
                    selectionMode={isSelectionMode}
                    onSelect={() => toggleSelect(a.id)}
                    onClick={() => !isSelectionMode && setSelected(a)}
                    onCopy={(e) => { e.stopPropagation(); handleCopy(a) }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreate && (
        <CreateAssetModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false)
            qc.invalidateQueries({ queryKey: ['media-library'] })
            qc.invalidateQueries({ queryKey: ['media-facets'] })
          }}
        />
      )}

      {selected && (
        <DetailDrawer
          asset={selected}
          onClose={() => setSelected(null)}
          onCopy={() => handleCopy(selected)}
          onDelete={() => removeMutation.mutate(selected.id)}
          copied={justCopied === selected.id}
        />
      )}
    </div>
  )
}

function FacetSection({
  title, items, active, onChange, showAll,
}: {
  title: string
  items: { value: string; label: string; count?: number }[]
  active: string
  onChange: (v: string) => void
  showAll?: boolean
}) {
  const list = showAll ? items : items
  return (
    <div>
      <h4 className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider mb-2">{title}</h4>
      <ul className="space-y-0.5">
        {showAll && !items.find(i => i.value === '') && (
          <li>
            <button
              onClick={() => onChange('')}
              className={clsx(
                'w-full text-left px-2 py-1.5 rounded-md text-[12.5px] flex items-center justify-between transition-colors',
                active === '' ? 'bg-rihla/10 text-rihla font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              )}
            >
              Tous
            </button>
          </li>
        )}
        {list.map(it => (
          <li key={it.value}>
            <button
              onClick={() => onChange(active === it.value ? '' : it.value)}
              className={clsx(
                'w-full text-left px-2 py-1.5 rounded-md text-[12.5px] flex items-center justify-between transition-colors',
                active === it.value ? 'bg-rihla/10 text-rihla font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              )}
            >
              <span className="capitalize truncate">{it.label}</span>
              {it.count != null && <span className="text-slate-400 text-[11px]">{it.count}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function AssetCard({
  asset, copied, selected, selectionMode, onSelect, onClick, onCopy,
}: {
  asset: MediaAsset
  copied: boolean
  selected: boolean
  selectionMode: boolean
  onSelect: () => void
  onClick: () => void
  onCopy: (e: React.MouseEvent) => void
}) {
  const isPhoto = asset.asset_type === 'photo'
  return (
    <div
      onClick={selectionMode ? onSelect : onClick}
      className={clsx(
        "group bg-white dark:bg-slate-900 border rounded-[32px] overflow-hidden transition-all duration-300 cursor-pointer relative",
        selected ? "border-rihla ring-2 ring-rihla/20" : "border-slate-200/80 dark:border-white/5 hover:border-rihla/30 hover:shadow-xl",
        selectionMode && "hover:scale-[1.02]"
      )}
    >
      {selectionMode && (
        <div className="absolute top-4 left-4 z-20">
           <div className={clsx(
             "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
             selected ? "bg-rihla border-rihla text-white" : "bg-white/50 backdrop-blur-md border-white text-transparent"
           )}>
             <Check size={14} strokeWidth={4} />
           </div>
        </div>
      )}

      {isPhoto && asset.thumb_url ? (
        <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
          <img src={asset.thumb_url} alt={asset.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          {asset.is_public && (
            <span className="absolute top-4 right-4 text-[9px] bg-white/90 dark:bg-slate-900/90 text-emerald-700 px-2 py-0.5 rounded-full font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Globe2 size={10} /> Public
            </span>
          )}
        </div>
      ) : (
        <div className="aspect-[4/3] bg-gradient-to-br from-rihla/10 via-cream/30 to-rihla/5 p-4 flex items-center justify-center">
          <FileText size={48} className="text-rihla/20" strokeWidth={1} />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-[14px] font-bold text-slate-900 dark:text-cream truncate flex-1 tracking-tight">{asset.title}</h3>
          <span className="text-[9px] text-rihla bg-rihla/8 px-2 py-1 rounded-full font-black uppercase tracking-widest flex-shrink-0">
            {asset.asset_type}
          </span>
        </div>
        {asset.city && (
          <p className="text-[12px] text-slate-500 font-medium inline-flex items-center gap-1.5 mb-3">
            <MapPin size={12} strokeWidth={2.5} className="text-rihla" />
            {asset.city}
          </p>
        )}
        {asset.description && !isPhoto && (
          <p className="text-[12px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed italic">"{asset.description}"</p>
        )}
        
        <div className="flex items-center justify-between gap-2 mt-2 pt-4 border-t border-slate-50 dark:border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400 font-black flex items-center gap-1">
              <Sparkles size={10} className="text-amber-500" /> {asset.use_count}
            </span>
            {asset.tags && asset.tags.length > 0 && (
              <span className="text-[10px] text-slate-400 font-black">#{asset.tags[0]}</span>
            )}
          </div>
          {!selectionMode && (
            <span
              onClick={onCopy as any}
              role="button"
              className={clsx(
                'text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all',
                copied
                  ? 'text-white bg-emerald-500 shadow-lg shadow-emerald-500/20'
                  : 'text-slate-500 hover:text-rihla hover:bg-rihla/5',
              )}
            >
              {copied ? <><Check size={12} strokeWidth={3} /> Copié</> : <><Copy size={12} /> Copier</>}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailDrawer({
  asset, onClose, onCopy, onDelete, copied,
}: {
  asset: MediaAsset
  onClose: () => void
  onCopy: () => void
  onDelete: () => void
  copied: boolean
}) {
  const isPhoto = asset.asset_type === 'photo'
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />
      <aside className="w-[640px] max-w-full bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-white/5 flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-rihla font-medium mb-1">
              {asset.asset_type} · {asset.city ?? '—'}
            </p>
            <h2 className="text-[20px] font-semibold text-slate-900 dark:text-cream tracking-tight">
              {asset.title}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {isPhoto && asset.image_url && (
          <div className="bg-slate-100 dark:bg-slate-950">
            <img src={asset.image_url} alt={asset.title} className="w-full h-auto max-h-[480px] object-contain" />
          </div>
        )}

        <div className="px-6 py-5 space-y-4">
          {asset.description && (
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1.5 inline-flex items-center gap-1">
                <FileText size={10} /> Description
              </p>
              <p className="text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {asset.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {asset.city && (
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">Ville</p>
                <p className="text-[13px] text-slate-700 dark:text-slate-200">{asset.city}, {asset.country}</p>
              </div>
            )}
            {asset.category && (
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">Catégorie</p>
                <p className="text-[13px] text-slate-700 dark:text-slate-200 capitalize">{asset.category}</p>
              </div>
            )}
            {asset.source && (
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">Source</p>
                <p className="text-[13px] text-slate-700 dark:text-slate-200">{asset.source}{asset.license && ` · ${asset.license}`}</p>
              </div>
            )}
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1">Utilisations</p>
              <p className="text-[13px] text-slate-700 dark:text-slate-200">{asset.use_count}</p>
            </div>
          </div>

          {!!(asset.tags?.length) && (
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-1.5 inline-flex items-center gap-1">
                <Tag size={10} /> Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {asset.tags!.map(t => (
                  <span key={t} className="text-[11.5px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 sticky bottom-0 bg-white dark:bg-slate-900 flex items-center gap-3">
          <button
            onClick={onCopy}
            className={clsx(
              'flex-1 px-4 py-2.5 rounded-md text-[13px] font-medium transition-colors inline-flex items-center justify-center gap-2',
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-rihla text-white hover:bg-rihla/90',
            )}
          >
            {copied ? <><Check size={14} /> Copié dans le presse-papiers</> : <><Copy size={14} /> Copier {isPhoto ? "l'URL de l'image" : 'la description'}</>}
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-2.5 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
            title="Supprimer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </aside>
    </div>
  )
}

function CreateAssetModal({
  onClose, onCreated,
}: {
  onClose: () => void
  onCreated: () => void
}) {
  const [form, setForm] = useState<Partial<MediaAsset>>({
    asset_type: 'photo',
    title: '',
    city: '',
    category: '',
    description: '',
    image_url: '',
    tags: [],
    is_public: false,
  })
  const [tagsRaw, setTagsRaw] = useState('')

  const create = useMutation({
    mutationFn: () => mediaLibraryApi.create({
      ...form,
      title: form.title!,
      tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : undefined,
    }),
    onSuccess: onCreated,
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) return
    create.mutate()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="px-5 py-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-slate-900 dark:text-cream">Ajouter un asset</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div className="flex gap-2">
            {(['photo', 'poi'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, asset_type: t })}
                className={clsx(
                  'flex-1 px-3 py-2 rounded-md text-[13px] font-medium transition-colors',
                  form.asset_type === t
                    ? 'bg-rihla text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300',
                )}
              >
                {t === 'photo' ? 'Photo' : 'Description POI'}
              </button>
            ))}
          </div>
          <Field label="Titre">
            <input
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="input"
              placeholder="Place Jemaa el-Fna"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ville">
              <input value={form.city ?? ''} onChange={e => setForm({ ...form, city: e.target.value })} className="input" placeholder="Marrakech" />
            </Field>
            <Field label="Catégorie">
              <input value={form.category ?? ''} onChange={e => setForm({ ...form, category: e.target.value })} className="input" placeholder="culture / nature / hotel" />
            </Field>
          </div>
          {form.asset_type === 'photo' && (
            <Field label="URL de l'image">
              <input value={form.image_url ?? ''} onChange={e => setForm({ ...form, image_url: e.target.value })} className="input" placeholder="https://..." />
            </Field>
          )}
          <Field label="Description">
            <textarea
              value={form.description ?? ''}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="input min-h-[80px] resize-y"
              placeholder={form.asset_type === 'photo' ? 'Légende optionnelle' : 'Texte descriptif premium pour propositions clients…'}
            />
          </Field>
          <Field label="Tags (séparés par virgule)">
            <input value={tagsRaw} onChange={e => setTagsRaw(e.target.value)} className="input" placeholder="medina, unesco, sunset" />
          </Field>
          <label className="flex items-center gap-2 text-[13px] text-slate-600 dark:text-slate-300">
            <input type="checkbox" checked={!!form.is_public} onChange={e => setForm({ ...form, is_public: e.target.checked })} />
            Rendre cet asset visible publiquement (toutes les agences)
          </label>
        </div>
        <div className="px-5 py-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3.5 py-2 text-[13px] text-slate-600 hover:bg-slate-100 dark:hover:bg-white/5 rounded-md">Annuler</button>
          <button
            type="submit"
            disabled={!form.title || create.isPending}
            className="px-4 py-2 rounded-md bg-rihla text-white text-[13px] font-medium hover:bg-rihla/90 transition-colors disabled:opacity-50"
          >
            {create.isPending ? 'Ajout…' : 'Ajouter'}
          </button>
        </div>

        <style>{`
          .input {
            width: 100%;
            padding: 8px 10px;
            font-size: 13px;
            background: white;
            border: 1px solid rgb(226 232 240);
            border-radius: 6px;
            outline: none;
          }
          .input:focus { border-color: rgb(180 62 32); }
          .dark .input { background: rgb(2 6 23); border-color: rgba(255,255,255,0.1); color: rgb(241 245 249); }
        `}</style>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] text-slate-400 uppercase tracking-wide mb-1">{label}</label>
      {children}
    </div>
  )
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="text-center py-20 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-white/5 rounded-lg">
      <div className="w-12 h-12 mx-auto rounded-full bg-rihla/8 flex items-center justify-center mb-4">
        <ImageIcon size={20} className="text-rihla" strokeWidth={1.75} />
      </div>
      <h3 className="text-[15px] font-semibold text-slate-900 dark:text-cream mb-1">Bibliothèque vide</h3>
      <p className="text-[13px] text-slate-500 max-w-md mx-auto mb-4">
        Ajoute photos et descriptions POI pour les réutiliser dans toutes vos propositions.
      </p>
      <button
        onClick={onCreate}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-rihla text-white text-[13px] font-medium hover:bg-rihla/90"
      >
        <Plus size={14} /> Premier asset
      </button>
    </div>
  )
}
