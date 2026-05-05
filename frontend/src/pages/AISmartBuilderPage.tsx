import { useState } from 'react'
import {
  Sparkles, MapPin, Calendar, Users, Hotel, Truck, UserCheck,
  Utensils, Star, ChevronRight, Loader2, Send, RefreshCw,
  Zap, Target, TrendingUp, Clock, Globe, Award, Heart,
  CheckCircle2, ArrowRight, DollarSign,
} from 'lucide-react'

/* ──────────── PRESETS & DATA FROM BASE SOLIDE ──────────── */

interface SuggestedCircuit {
  id: string
  name: string
  duration: number
  theme: string
  cities: string[]
  highlights: string[]
  priceFrom: number
  hotels: { city: string; name: string; category: string }[]
  transport: { type: string; name: string }
  guides: { name: string; languages: string[] }[]
  restaurants: { city: string; name: string; pricePerPax: number }[]
  level: 'luxury' | 'premium' | 'standard'
  bestSeason: string
  matchScore: number
}

const AI_CIRCUITS: SuggestedCircuit[] = [
  {
    id: 'C1', name: 'Grand Tour Imperial', duration: 11, theme: 'Culturel & Patrimoine',
    cities: ['Casablanca', 'Rabat', 'Fès', 'Meknès', 'Marrakech'],
    highlights: ['Médina de Fès UNESCO', 'Palais Bahia', 'Volubilis', 'Jardins Majorelle', 'Jemaa el-Fna'],
    priceFrom: 42500, level: 'luxury', bestSeason: 'Moyenne Saison', matchScore: 96,
    hotels: [
      { city: 'Casablanca', name: 'Four Seasons CasaMarina', category: '5*' },
      { city: 'Fès', name: 'Palais Faraj', category: '5* Riad' },
      { city: 'Marrakech', name: 'Royal Mansour', category: '5* Palace' },
    ],
    transport: { type: 'Minibus', name: 'Mercedes Sprinter' },
    guides: [{ name: 'Hassan Amazigh', languages: ['FR', 'EN', 'ES', 'AR'] }],
    restaurants: [{ city: 'Fès', name: 'Palais Faraj', pricePerPax: 350 }, { city: 'Marrakech', name: 'Dar Yacout', pricePerPax: 450 }],
  },
  {
    id: 'C2', name: 'Désert & Montagnes', duration: 7, theme: 'Aventure & Nature',
    cities: ['Marrakech', 'Atlas', 'Ouarzazate', 'Merzouga', 'Marrakech'],
    highlights: ['Vallée Ourika', 'Aït Ben Haddou', 'Dunes Erg Chebbi', 'Nuit bivouac', 'Trek Atlas'],
    priceFrom: 28000, level: 'premium', bestSeason: 'Haute Saison Été', matchScore: 91,
    hotels: [
      { city: 'Marrakech', name: 'La Mamounia', category: '5* Palace' },
      { city: 'Atlas', name: 'Kasbah Tamadot', category: '5* Boutique' },
      { city: 'Merzouga', name: 'Sahara Luxury Camp', category: 'Camp Luxe' },
    ],
    transport: { type: '4x4', name: 'Toyota Land Cruiser' },
    guides: [{ name: 'Youssef Ouarzazi', languages: ['FR', 'EN', 'IT'] }],
    restaurants: [{ city: 'Atlas', name: 'Restaurant Atlas', pricePerPax: 220 }, { city: 'Merzouga', name: 'Café Sahara', pricePerPax: 200 }],
  },
  {
    id: 'C3', name: 'Escapade Marrakech', duration: 4, theme: 'City Break Luxe',
    cities: ['Marrakech'],
    highlights: ['Médina & Souks', 'Spa traditionnel', 'Jardins Menara', 'Cours de cuisine', 'Dinner-show'],
    priceFrom: 18500, level: 'luxury', bestSeason: 'Toute saison', matchScore: 88,
    hotels: [{ city: 'Marrakech', name: 'Royal Mansour', category: '5* Palace' }],
    transport: { type: 'Berline', name: 'Mercedes S-Class' },
    guides: [{ name: 'Hassan Amazigh', languages: ['FR', 'EN', 'ES', 'AR'] }],
    restaurants: [{ city: 'Marrakech', name: 'Dar Yacout', pricePerPax: 450 }, { city: 'Marrakech', name: 'Le Comptoir Darna', pricePerPax: 380 }],
  },
  {
    id: 'C4', name: 'Perles du Nord', duration: 8, theme: 'Nature & Authenticité',
    cities: ['Tanger', 'Chefchaouen', 'Fès', 'Meknès'],
    highlights: ['Ville bleue Chefchaouen', 'Rif montagneux', 'Médina Fès', 'Grottes d\'Hercule', 'Cap Spartel'],
    priceFrom: 22000, level: 'standard', bestSeason: 'Moyenne Saison Printemps', matchScore: 85,
    hotels: [{ city: 'Chefchaouen', name: 'Lina Riad & Spa', category: '4*' }, { city: 'Fès', name: 'Palais Faraj', category: '5* Riad' }],
    transport: { type: 'Minivan', name: 'Mercedes V-Class' },
    guides: [{ name: 'Fatima Zahra Bennis', languages: ['FR', 'EN', 'DE'] }],
    restaurants: [{ city: 'Chefchaouen', name: 'Café Rif', pricePerPax: 150 }, { city: 'Fès', name: 'Palais Faraj', pricePerPax: 350 }],
  },
  {
    id: 'C5', name: 'MICE Incentive Morocco', duration: 5, theme: 'MICE & Événementiel',
    cities: ['Marrakech', 'Essaouira'],
    highlights: ['Team building désert', 'Gala dinner', 'Activités nautiques', 'Conférence Palmeraie', 'Visite privée'],
    priceFrom: 35000, level: 'luxury', bestSeason: 'Moyenne Saison', matchScore: 82,
    hotels: [{ city: 'Marrakech', name: 'La Mamounia', category: '5* Palace' }, { city: 'Essaouira', name: 'Heure Bleue Palais', category: '5*' }],
    transport: { type: 'Bus', name: 'Grand Bus Mercedes' },
    guides: [{ name: 'Hassan Amazigh', languages: ['FR', 'EN', 'ES', 'AR'] }, { name: 'Fatima Zahra Bennis', languages: ['FR', 'EN', 'DE'] }],
    restaurants: [{ city: 'Marrakech', name: 'Dar Yacout', pricePerPax: 450 }],
  },
]

const THEMES = ['Tous', 'Culturel & Patrimoine', 'Aventure & Nature', 'City Break Luxe', 'Nature & Authenticité', 'MICE & Événementiel']
const LEVELS = ['Tous', 'luxury', 'premium', 'standard']
const LEVEL_LABELS: Record<string, string> = { luxury: 'Luxe', premium: 'Premium', standard: 'Standard' }
const LEVEL_COLORS: Record<string, string> = { luxury: 'bg-amber-100 text-amber-700', premium: 'bg-blue-100 text-blue-700', standard: 'bg-slate-100 text-slate-700' }

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n)

export function AISmartBuilderPage() {
  const [prompt, setPrompt] = useState('')
  const [themeFilter, setThemeFilter] = useState('Tous')
  const [levelFilter, setLevelFilter] = useState('Tous')
  const [pax, setPax] = useState(20)
  const [selectedCircuit, setSelectedCircuit] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiResponse, setAiResponse] = useState('')

  const filtered = AI_CIRCUITS.filter(c => {
    if (themeFilter !== 'Tous' && c.theme !== themeFilter) return false
    if (levelFilter !== 'Tous' && c.level !== levelFilter) return false
    return true
  }).sort((a, b) => b.matchScore - a.matchScore)

  const handleAiPrompt = () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setAiResponse('')
    setTimeout(() => {
      setAiResponse(
        `Sur la base de votre demande "${prompt}", voici mon analyse :\n\n` +
        `**Circuit recommandé** : ${filtered[0]?.name || 'Grand Tour Imperial'}\n\n` +
        `**Raisons** :\n` +
        `• Correspond au profil ${pax > 20 ? 'groupe' : 'petit groupe'} (${pax} PAX)\n` +
        `• Les hôtels sélectionnés depuis la Base Solide offrent le meilleur rapport qualité/prix\n` +
        `• Les guides disponibles couvrent les langues demandées\n` +
        `• Transport optimisé selon la capacité du groupe\n\n` +
        `**Budget estimé** : ${fmt(filtered[0]?.priceFrom || 42500)} MAD / pax\n` +
        `**Durée optimale** : ${filtered[0]?.duration || 11} jours\n\n` +
        `💡 *Suggestion IA* : Ajoutez une extension Essaouira (+2 jours) pour un circuit plus complet. Les tarifs Base Solide montrent des prix compétitifs en ${filtered[0]?.bestSeason || 'moyenne saison'}.`
      )
      setIsGenerating(false)
    }, 2000)
  }

  const detail = selectedCircuit ? AI_CIRCUITS.find(c => c.id === selectedCircuit) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-violet-600 font-semibold mb-1">
          <Sparkles size={16} /> Phase 3 — IA sur Base Solide
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-cream">
          AI Smart Builder — Conception Intelligente
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Suggestions de circuits basées sur les données paramétrées · Hôtels, Transport, Guides, Restaurants de la Base Solide
        </p>
      </div>

      {/* AI Prompt */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-2xl p-5 border border-violet-100 dark:border-violet-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} className="text-violet-600" />
          <h2 className="font-bold text-violet-900 dark:text-violet-300">Assistant IA — Décrivez votre besoin</h2>
        </div>
        <div className="flex gap-2">
          <input
            type="text" value={prompt} onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAiPrompt()}
            placeholder="Ex: Circuit luxe 8 jours pour 25 PAX, clientèle française, mix culture & désert..."
            className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-violet-200 dark:border-violet-500/30 rounded-xl text-sm"
          />
          <button onClick={handleAiPrompt} disabled={isGenerating} className="px-5 py-3 bg-violet-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-violet-700 disabled:opacity-50">
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Analyser
          </button>
        </div>
        <div className="flex gap-2 mt-2 flex-wrap">
          {['Luxe 11J groupe français', 'Aventure désert petit groupe', 'MICE incentive 30 PAX', 'City break Marrakech VIP'].map(q => (
            <button key={q} onClick={() => { setPrompt(q); }} className="text-xs px-3 py-1 bg-white/70 dark:bg-white/10 rounded-full text-violet-600 dark:text-violet-400 hover:bg-white">
              {q}
            </button>
          ))}
        </div>

        {/* AI Response */}
        {aiResponse && (
          <div className="mt-4 bg-white dark:bg-slate-800 rounded-xl p-4 border border-violet-100 dark:border-violet-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-violet-500" />
              <span className="text-xs font-bold text-violet-600">Réponse IA</span>
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">{aiResponse}</div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 text-xs text-slate-500"><Users size={12} /> PAX:</div>
        <input type="number" value={pax} onChange={e => setPax(Math.max(1, parseInt(e.target.value) || 1))} className="w-16 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-center font-bold" />

        <select value={themeFilter} onChange={e => setThemeFilter(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm">
          {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm">
          {LEVELS.map(l => <option key={l} value={l}>{l === 'Tous' ? 'Tous niveaux' : LEVEL_LABELS[l]}</option>)}
        </select>

        <span className="text-xs text-slate-400 ml-auto">{filtered.length} circuit(s) trouvé(s)</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Circuit List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map(circuit => (
            <div
              key={circuit.id}
              onClick={() => setSelectedCircuit(circuit.id)}
              className={`bg-white dark:bg-slate-800 rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md ${
                selectedCircuit === circuit.id ? 'border-violet-400 ring-2 ring-violet-200 dark:ring-violet-500/30' : 'border-slate-100 dark:border-white/10'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-cream">{circuit.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${LEVEL_COLORS[circuit.level]}`}>
                      {LEVEL_LABELS[circuit.level]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar size={11} /> {circuit.duration} jours</span>
                    <span className="flex items-center gap-1"><Target size={11} /> {circuit.theme}</span>
                    <span className="flex items-center gap-1"><Globe size={11} /> {circuit.cities.length} ville(s)</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-violet-600 font-bold mb-1">
                    <Zap size={12} /> Match {circuit.matchScore}%
                  </div>
                  <div className="text-lg font-black text-slate-900 dark:text-cream">{fmt(circuit.priceFrom)} <span className="text-xs text-slate-400 font-normal">MAD/pax</span></div>
                </div>
              </div>

              {/* Cities route */}
              <div className="flex items-center gap-1 flex-wrap mb-3">
                {circuit.cities.map((city, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="text-xs px-2 py-0.5 bg-slate-50 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 font-medium">
                      <MapPin size={10} className="inline mr-0.5" />{city}
                    </span>
                    {i < circuit.cities.length - 1 && <ArrowRight size={10} className="text-slate-300" />}
                  </span>
                ))}
              </div>

              {/* Highlights */}
              <div className="flex flex-wrap gap-1">
                {circuit.highlights.slice(0, 4).map((h, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 rounded-full">{h}</span>
                ))}
                {circuit.highlights.length > 4 && (
                  <span className="text-[10px] text-slate-400">+{circuit.highlights.length - 4} autres</span>
                )}
              </div>

              {/* Linked resources */}
              <div className="mt-3 pt-3 border-t border-slate-50 dark:border-white/5 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Hotel size={11} className="text-amber-500" /> {circuit.hotels.length} hôtel(s)</span>
                <span className="flex items-center gap-1"><Truck size={11} className="text-blue-500" /> {circuit.transport.name}</span>
                <span className="flex items-center gap-1"><UserCheck size={11} className="text-emerald-500" /> {circuit.guides.length} guide(s)</span>
                <span className="flex items-center gap-1"><Utensils size={11} className="text-rose-500" /> {circuit.restaurants.length} restaurant(s)</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        <div>
          {detail ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-white/10 p-5 sticky top-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-cream">{detail.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${LEVEL_COLORS[detail.level]}`}>{LEVEL_LABELS[detail.level]}</span>
              </div>

              {/* Hotels */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1"><Hotel size={12} className="text-amber-500" /> Hébergement (Base Solide)</h4>
                <div className="space-y-1.5">
                  {detail.hotels.map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-amber-50/50 dark:bg-amber-900/10 rounded-lg p-2">
                      <div>
                        <div className="font-semibold text-slate-700 dark:text-slate-300">{h.name}</div>
                        <div className="text-slate-400">{h.city} · {h.category}</div>
                      </div>
                      <CheckCircle2 size={14} className="text-amber-500" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Transport */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1"><Truck size={12} className="text-blue-500" /> Transport (Base Solide)</h4>
                <div className="flex items-center justify-between text-xs bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-2">
                  <div>
                    <div className="font-semibold text-slate-700 dark:text-slate-300">{detail.transport.name}</div>
                    <div className="text-slate-400">{detail.transport.type}</div>
                  </div>
                  <CheckCircle2 size={14} className="text-blue-500" />
                </div>
              </div>

              {/* Guides */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1"><UserCheck size={12} className="text-emerald-500" /> Guides (Base Solide)</h4>
                <div className="space-y-1.5">
                  {detail.guides.map((g, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-emerald-50/50 dark:bg-emerald-900/10 rounded-lg p-2">
                      <div>
                        <div className="font-semibold text-slate-700 dark:text-slate-300">{g.name}</div>
                        <div className="text-slate-400">{g.languages.join(', ')}</div>
                      </div>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Restaurants */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1"><Utensils size={12} className="text-rose-500" /> Restauration (Base Solide)</h4>
                <div className="space-y-1.5">
                  {detail.restaurants.map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-rose-50/50 dark:bg-rose-900/10 rounded-lg p-2">
                      <div>
                        <div className="font-semibold text-slate-700 dark:text-slate-300">{r.name}</div>
                        <div className="text-slate-400">{r.city} · {r.pricePerPax} MAD/pax</div>
                      </div>
                      <CheckCircle2 size={14} className="text-rose-500" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Season */}
              <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3">
                <div className="text-xs text-violet-600 font-bold flex items-center gap-1"><Clock size={12} /> Meilleure période</div>
                <div className="text-sm font-bold text-violet-800 dark:text-violet-300 mt-1">{detail.bestSeason}</div>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-4 text-white">
                <div className="text-xs text-violet-200 mb-1">Prix estimé pour {pax} PAX</div>
                <div className="text-2xl font-black">{fmt(detail.priceFrom)} <span className="text-sm font-normal text-violet-200">MAD/pax</span></div>
                <div className="text-xs text-violet-200 mt-1">Total groupe : {fmt(detail.priceFrom * pax)} MAD</div>
              </div>

              <button className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-violet-700">
                <Sparkles size={14} /> Ouvrir dans le Calculateur
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-white/10 p-8 text-center">
              <Sparkles size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Sélectionnez un circuit pour voir le détail des prestations liées à la Base Solide</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
