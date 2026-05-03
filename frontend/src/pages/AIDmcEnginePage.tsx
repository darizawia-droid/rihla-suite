import { useState, useRef } from 'react'
import {
  Cpu, Sparkles, ChevronRight, ChevronDown, ChevronUp,
  FileText, Globe, Mail, Download, RefreshCw, Check,
  MapPin, Users, Calendar, DollarSign, Star, Zap,
  TrendingUp, Heart, Video, ArrowRight, Edit3, Plus,
  Hotel, Utensils, Compass, Truck, Shield, Gift,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────
interface AnalysisData {
  destination: string
  country: string
  flag: string
  duration: number
  pax: number
  budget: number
  period: string
  type: string
  preferences: string[]
  market: string
  assumptions: string[]
}

interface DayItem {
  time: string
  icon: string
  title: string
  detail: string
  cost: number
}

interface Day {
  number: number
  title: string
  theme: string
  items: DayItem[]
  dayTotal: number
}

interface PricingLine {
  icon: string
  category: string
  detail: string
  cost: number
}

interface UpsellOption {
  title: string
  desc: string
  price: number
  icon: string
}

// ── Demo Data Engine ───────────────────────────────────────────────────────
function generateDemoData(brief: string): {
  analysis: AnalysisData
  days: Day[]
  pricing: PricingLine[]
  storytelling: string
  videoPrompt: string
  upsells: UpsellOption[]
} {
  const isGermany = brief.toLowerCase().includes('allem') || brief.toLowerCase().includes('german')
  const paxMatch = brief.match(/(\d+)\s*pax/i)
  const budgetMatch = brief.match(/(\d[\d\s]*)\s*[€$]/i)
  const pax = paxMatch ? parseInt(paxMatch[1]) : 18
  const budget = budgetMatch ? parseInt(budgetMatch[1].replace(/\s/g, '')) : 85000

  const analysis: AnalysisData = {
    destination: 'Marrakech + Agafay + Essaouira',
    country: isGermany ? 'Allemagne' : 'France',
    flag: isGermany ? '🇩🇪' : '🇫🇷',
    duration: 6,
    pax,
    budget,
    period: 'Juin 2026',
    type: 'Incentive Luxe',
    preferences: ['Gastronomie', 'Culture', 'Authenticité', 'Privatisation'],
    market: isGermany ? 'Corporate Allemand' : 'Corporate Européen',
    assumptions: [
      'Hôtel 5★ Riad privatisé (non Palace — optimisation budget)',
      'Vols non inclus dans le budget',
      'Guide senior dédié au groupe sur toute la durée',
      'Marge DMC 25% — niveau incentive standard',
    ],
  }

  const days: Day[] = [
    {
      number: 1, title: 'Arrivée Royale', theme: 'Premier souffle d\'Orient',
      items: [
        { time: '10:30', icon: '✈️', title: 'Accueil VIP Aéroport RAK', detail: 'Agent dédié, fast-track, panneaux personnalisés', cost: 0 },
        { time: '11:00', icon: '🚐', title: 'Transfert flotte Mercedes V-Class', detail: '3 véhicules × 18 pax, eau minérale, wifi', cost: 450 },
        { time: '12:30', icon: '🏨', title: 'Check-in Riad 5★ (privatisé)', detail: '18 suites, accueil eau de rose & dattes', cost: 5040 },
        { time: '14:00', icon: '🍽️', title: 'Déjeuner terrasse panoramique', detail: 'Mezze marocains, vins de Meknès', cost: 990 },
        { time: '16:00', icon: '🎵', title: 'Cérémonie d\'accueil Gnaoua', detail: 'Musique live, henné, eau de fleur d\'oranger', cost: 800 },
        { time: '21:00', icon: '🕯️', title: 'Dîner Dar Yacout — privatisation', detail: 'Chandelles, oud live, menu fassi 7 plats', cost: 1620 },
      ],
      dayTotal: 8900,
    },
    {
      number: 2, title: 'Immersion Culturelle', theme: 'L\'âme de la Médina',
      items: [
        { time: '09:30', icon: '🏛️', title: 'Visite privée Médina (guide senior)', detail: 'Bahia, Saadiens, Medersa Ben Youssef', cost: 600 },
        { time: '12:30', icon: '🍽️', title: 'Déjeuner Nomad Rooftop', detail: 'Vue panoramique toits, cuisine fusion', cost: 810 },
        { time: '14:30', icon: '🎨', title: 'Atelier Zellige avec maître artisan', detail: 'Pièce unique à emporter, 2h d\'immersion', cost: 1440 },
        { time: '17:00', icon: '🛍️', title: 'Souks thématiques + personal shopper', detail: 'Épices, babouches, tapis — accompagné', cost: 400 },
        { time: '21:00', icon: '👨‍🍳', title: 'Dîner Dar Moha — menu signature', detail: 'Chef Mohammed Fedal, 7 plats gastronomiques', cost: 1620 },
      ],
      dayTotal: 4870,
    },
    {
      number: 3, title: 'Désert Agafay', theme: 'L\'infini minéral',
      items: [
        { time: '07:00', icon: '🚙', title: 'Convoi 4x4 privé → Agafay', detail: '18 4x4, route dorée, lever de soleil', cost: 2700 },
        { time: '10:00', icon: '🍳', title: 'Masterclass cuisine berbère', detail: 'Tajine sur braise, pain khobz, thé cérémoniel', cost: 1800 },
        { time: '12:30', icon: '🍽️', title: 'Déjeuner bivouac de luxe', detail: 'Tables dressées dans le désert, verrerie', cost: 990 },
        { time: '17:00', icon: '🥂', title: 'Sunset cocktail plateau rocheux', detail: 'Champagne, amuse-bouches, silence absolu', cost: 720 },
        { time: '19:30', icon: '🎭', title: 'Fantasia privée + dîner méchoui', detail: 'Show équestre, feux, agneau entier rôti', cost: 3600 },
      ],
      dayTotal: 9810,
    },
    {
      number: 4, title: 'Gastronomie & Bien-être', theme: 'Le corps et le palais',
      items: [
        { time: '09:00', icon: '🥕', title: 'Marché Mellah avec Chef', detail: 'Sélection des ingrédients, immersion marché', cost: 300 },
        { time: '10:30', icon: '👨‍🍳', title: 'Masterclass Chef étoilé', detail: 'Pastilla, couscous royal, m\'hanncha — 18 pax', cost: 1800 },
        { time: '13:00', icon: '🍽️', title: 'Déjeuner des plats réalisés', detail: 'Table commune, partage et fierté culinaire', cost: 0 },
        { time: '15:00', icon: '🧖', title: 'Hammam & Spa privatisé (90min)', detail: 'Kessa, ghassoul, huile d\'argan — 18 soins', cost: 2700 },
        { time: '20:30', icon: '🌟', title: 'Dîner libre partenaires sélectionnés', detail: 'Choix entre 3 restaurants étoilés', cost: 1260 },
      ],
      dayTotal: 6060,
    },
    {
      number: 5, title: 'Escapade Essaouira', theme: 'Le Maroc de l\'Atlantique',
      items: [
        { time: '08:00', icon: '🚐', title: 'Route panoramique → Essaouira', detail: '2h30, arganiers, musique ambiance', cost: 1200 },
        { time: '10:30', icon: '🏰', title: 'Médina UNESCO + port de pêche', detail: 'Guide local, ramparts, art Gnaoua', cost: 500 },
        { time: '12:30', icon: '🦞', title: 'Déjeuner bord d\'Atlantique', detail: 'Chalet de la Plage, poissons & fruits de mer', cost: 990 },
        { time: '15:00', icon: '🏄', title: 'Activités plage / galeries d\'art', detail: 'Windsurf optionnel, thuya, bijoux', cost: 500 },
        { time: '21:00', icon: '🏆', title: 'Gala de clôture — Riad privatisé', detail: 'Orchestre andalou, menu prestige 9 plats, trophées', cost: 4500 },
      ],
      dayTotal: 7690,
    },
    {
      number: 6, title: 'Départ', theme: 'L\'au revoir en douceur',
      items: [
        { time: '08:30', icon: '🎁', title: 'Remise des cadeaux DMC', detail: 'Coffret argan, épices, artisanat personnalisé', cost: 1800 },
        { time: '10:30', icon: '🌿', title: 'Option : Jardins Majorelle', detail: 'Visite libre, boutique YSL (selon vol)', cost: 270 },
        { time: '12:30', icon: '✈️', title: 'Transfert aéroport + assistance', detail: 'Agent dédié, assistance bagages', cost: 450 },
      ],
      dayTotal: 2520,
    },
  ]

  const pricing: PricingLine[] = [
    { icon: '🏨', category: 'Hébergement', detail: `18 ch. × 5 nuits × 280 €`, cost: 25200 },
    { icon: '🍽️', category: 'Restauration', detail: `5 dîners (18 pax × 90€) + 5 déj. (18 pax × 55€)`, cost: 13500 },
    { icon: '🚐', category: 'Transport', detail: `Flotte V-Class × 6j + transferts aéroport`, cost: 4200 },
    { icon: '🧭', category: 'Activités & Excursions', detail: `Médina, Agafay, Fantasia, Essaouira`, cost: 12000 },
    { icon: '👨‍🍳', category: 'Masterclasses cuisine', detail: `2 sessions chef × 18 pax`, cost: 3600 },
    { icon: '🧖', category: 'Hammam & Spa', detail: `Session exclusive 18 pax × 150€`, cost: 2700 },
    { icon: '🎭', category: 'Animation & Événements', detail: `Gala, cérémonie accueil, Fantasia, orchestre`, cost: 5500 },
    { icon: '👤', category: 'Guides', detail: `Guide senior × 6 jours`, cost: 1800 },
    { icon: '🛡️', category: 'Assurance groupe', detail: `18 pax × 60€`, cost: 1080 },
    { icon: '🎁', category: 'Cadeaux & Welcome kit', detail: `18 coffrets prestige Maroc`, cost: 1800 },
    { icon: '⚙️', category: 'Frais DMC & Coordination', detail: `Chef de projet dédié`, cost: 2350 },
  ]

  const storytelling = `Il existe des voyages qui transforment. Ceux où l'on ne revient pas identique.

Marrakech, juin 2026. Dix-huit regards s'ouvrent sur l'ocre ancien des remparts, sur l'odeur du cumin et de la rose d'Arabie. Dans les ruelles labyrinthiques de la Médina, un maître artisan transmet un savoir-faire millénaire. Dans un désert de pierre baigné d'or, un chef berbère révèle les secrets d'un tajine cuit au feu de braise. Sur une terrasse d'Essaouira, l'Atlantique souffle ses embruns sur des assiettes de poissons qui fleurent l'iode et la liberté.

Ce n'est pas un voyage. C'est une initiation. Une parenthèse hors du temps qui dit à chaque participant : vous avez mérité ceci. Et ils le savent.`

  const videoPrompt = `Cinematic drone shot at golden hour over Marrakech medina rooftops, slow zoom to a private riad courtyard lit with hundreds of candles, 18 Europeans in elegant dress seated at a long table. Moroccan musicians playing oud and guembri, mountains of saffron couscous arriving, laughter. Cut to desert sunrise — 4x4 convoy through Agafay mineral landscape, cooking fire smoke, a chef in white kneading dough. Cut to Essaouira ramparts, Atlantic wind, blue fishing boats. Emotional, luxurious, cultural. Color grade: warm amber and deep teal. Score: fusion gnaoua-electronic, building to emotional crescendo.`

  const upsells: UpsellOption[] = [
    { title: 'Upgrade La Mamounia Palace', desc: '18 suites palace, butler, piscine privée → remplace le Riad', price: 8000, icon: '👑' },
    { title: 'Montgolfière au lever du soleil', desc: 'Vol privatisé 18 pax, champagne, palmeraie de Marrakech', price: 4500, icon: '🎈' },
    { title: 'Photographe/Vidéaste 3 jours', desc: 'Film incentive monté livré en 72h + album individuel', price: 2200, icon: '📸' },
    { title: 'DJ Clôture + Sound Premium', desc: 'DJ set après gala, système son haut de gamme, light show', price: 3800, icon: '🎵' },
  ]

  return { analysis, days, pricing, storytelling, videoPrompt, upsells }
}

// ── Step Indicator ─────────────────────────────────────────────────────────
const STEPS = [
  { n: 1, label: 'Brief', icon: Edit3 },
  { n: 2, label: 'Analyse', icon: Cpu },
  { n: 3, label: 'Itinéraire', icon: MapPin },
  { n: 4, label: 'Devis', icon: DollarSign },
  { n: 5, label: 'Storytelling', icon: Heart },
  { n: 6, label: 'Export', icon: Download },
]

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 overflow-x-auto">
      {STEPS.map((s, i) => {
        const Icon = s.icon
        const done = current > s.n
        const active = current === s.n
        return (
          <div key={s.n} className="flex items-center gap-1 flex-shrink-0">
            <div className={`flex flex-col items-center gap-1 ${active ? 'opacity-100' : done ? 'opacity-80' : 'opacity-35'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                done ? 'bg-teal-500/20 border border-teal-500/50' :
                active ? 'bg-teal-500/25 border-2 border-teal-400 shadow-[0_0_12px_rgba(20,184,166,.4)]' :
                'bg-white/5 border border-white/10'
              }`}>
                {done ? <Check className="w-4 h-4 text-teal-400" /> : <Icon className={`w-4 h-4 ${active ? 'text-teal-300' : 'text-slate-400'}`} />}
              </div>
              <span className={`text-[10px] font-bold ${active ? 'text-teal-300' : done ? 'text-teal-500' : 'text-slate-500'}`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-6 h-[2px] mx-1 rounded mb-4 transition-all ${done ? 'bg-teal-500/50' : 'bg-white/8'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────
export function AIDmcEnginePage() {
  const [step, setStep] = useState(1)
  const [brief, setBrief] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisLabel, setAnalysisLabel] = useState('')
  const [demoData, setDemoData] = useState<ReturnType<typeof generateDemoData> | null>(null)
  const [margin, setMargin] = useState(25)
  const [expandedDays, setExpandedDays] = useState<number[]>([1])
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const briefRef = useRef<HTMLTextAreaElement>(null)

  const QUICK_BRIEFS = [
    '🇩🇪 Groupe 18 pax, Allemagne, incentive luxe, 6 jours Maroc, budget 85 000€, juin 2026, passionnés de gastronomie et culture',
    '🇫🇷 Mariage Paris, 35 invités, riad exclusif, 5 jours Marrakech, budget 72 000€, septembre 2026',
    '🇦🇪 Circuit Dubai, 12 pax, découverte culturelle, 7 jours Maroc Nord, budget 45 000€, octobre 2026',
    '🇬🇧 Team building Londres, 50 pax, aventure & nature, 4 jours désert, budget 60 000€, novembre 2026',
  ]

  const analyzeLabels = [
    'Extraction des données client…',
    'Identification destination & contraintes…',
    'Sélection fournisseurs partenaires…',
    'Génération itinéraire J+J…',
    'Calcul devis & marges…',
    'Rédaction storytelling…',
    'Suggestions upsell…',
    'Package complet prêt ✓',
  ]

  function runAnalysis() {
    if (!brief.trim()) return
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    let i = 0
    const interval = setInterval(() => {
      i++
      setAnalysisProgress(Math.round((i / analyzeLabels.length) * 100))
      setAnalysisLabel(analyzeLabels[i - 1] || analyzeLabels[analyzeLabels.length - 1])
      if (i >= analyzeLabels.length) {
        clearInterval(interval)
        setTimeout(() => {
          setDemoData(generateDemoData(brief))
          setIsAnalyzing(false)
          setStep(2)
        }, 500)
      }
    }, 420)
  }

  // ── Computed pricing ───────────────────────────────────────────────────
  const totalCost = demoData?.pricing.reduce((s, l) => s + l.cost, 0) ?? 0
  const sellPrice = Math.round(totalCost / (1 - margin / 100))
  const marginAmount = sellPrice - totalCost
  const perPerson = demoData ? Math.round(sellPrice / demoData.analysis.pax) : 0

  function toggleDay(n: number) {
    setExpandedDays(prev => prev.includes(n) ? prev.filter(d => d !== n) : [...prev, n])
  }

  function copyPrompt() {
    if (demoData) {
      navigator.clipboard?.writeText(demoData.videoPrompt).catch(() => {})
      setCopiedPrompt(true)
      setTimeout(() => setCopiedPrompt(false), 2000)
    }
  }

  // ── RENDER ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-full bg-[#0b0e17]">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-violet-600 flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,.3)]">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Moteur IA DMC</h1>
            <p className="text-xs text-slate-400">Brief client → Package complet en quelques secondes</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-300 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              IA Active
            </span>
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <StepIndicator current={step} />

      <div className="p-6 max-w-4xl mx-auto">

        {/* ── STEP 1 — BRIEF ───────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5 animate-[fadeIn_.3s_ease]">
            <div>
              <h2 className="text-lg font-black text-white mb-1">Brief Client</h2>
              <p className="text-sm text-slate-400">Collez un email, un message WhatsApp, ou décrivez librement la demande.</p>
            </div>

            <textarea
              ref={briefRef}
              value={brief}
              onChange={e => setBrief(e.target.value)}
              className="w-full h-36 bg-[#1a2035] border border-white/7 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-teal-500/50 resize-none leading-relaxed"
              placeholder="Ex : Groupe 18 pax Allemagne, incentive luxe, 6 jours Maroc, budget 85 000€, juin 2026, passionnés de gastronomie et culture…"
            />

            {/* Quick briefs */}
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">Exemples rapides</p>
              <div className="grid grid-cols-1 gap-2">
                {QUICK_BRIEFS.map((b, i) => (
                  <button key={i} onClick={() => setBrief(b)}
                    className="text-left px-4 py-3 rounded-xl bg-[#1a2035] border border-white/7 text-sm text-slate-300 hover:border-teal-500/40 hover:bg-teal-500/5 transition-all">
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Analyze button */}
            {!isAnalyzing ? (
              <button onClick={runAnalysis} disabled={!brief.trim()}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-violet-600 text-white font-black text-base flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(20,184,166,.3)] disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_4px_30px_rgba(20,184,166,.5)] transition-all">
                <Sparkles className="w-5 h-5" />
                Analyser & Générer le Package
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-full rounded-xl bg-[#1a2035] border border-teal-500/25 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <RefreshCw className="w-5 h-5 text-teal-400 animate-spin" />
                  <span className="text-sm font-bold text-teal-300">{analysisLabel}</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-violet-500 rounded-full transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }} />
                </div>
                <div className="text-right text-xs text-slate-500 mt-2">{analysisProgress}%</div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2 — ANALYSIS ────────────────────────────────────────── */}
        {step === 2 && demoData && (
          <div className="space-y-5 animate-[fadeIn_.3s_ease]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white mb-1">Données Extraites</h2>
                <p className="text-sm text-slate-400">Vérifiez et ajustez les paramètres détectés par l'IA.</p>
              </div>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/25 rounded-full text-green-400 text-xs font-bold">
                <Check className="w-3 h-3" /> 100% extrait
              </span>
            </div>

            {/* Data cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: MapPin, label: 'Destination', value: demoData.analysis.destination, color: 'teal' },
                { icon: Globe, label: 'Marché', value: `${demoData.analysis.flag} ${demoData.analysis.country}`, color: 'blue' },
                { icon: Users, label: 'Pax', value: `${demoData.analysis.pax} personnes`, color: 'violet' },
                { icon: Calendar, label: 'Durée', value: `${demoData.analysis.duration} jours`, color: 'teal' },
                { icon: DollarSign, label: 'Budget', value: `${demoData.analysis.budget.toLocaleString('fr')} €`, color: 'green' },
                { icon: Star, label: 'Type', value: demoData.analysis.type, color: 'orange' },
              ].map((item) => {
                const Icon = item.icon
                const colorMap: Record<string, string> = {
                  teal: 'bg-teal-500/10 border-teal-500/20 text-teal-300',
                  blue: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
                  violet: 'bg-violet-500/10 border-violet-500/20 text-violet-300',
                  green: 'bg-green-500/10 border-green-500/20 text-green-300',
                  orange: 'bg-orange-500/10 border-orange-500/20 text-orange-300',
                }
                return (
                  <div key={item.label} className={`rounded-xl border p-4 ${colorMap[item.color]}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 opacity-70" />
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{item.label}</span>
                    </div>
                    <div className="text-sm font-bold">{item.value}</div>
                  </div>
                )
              })}
            </div>

            {/* Preferences */}
            <div className="rounded-xl bg-[#1a2035] border border-white/7 p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Préférences détectées</p>
              <div className="flex flex-wrap gap-2">
                {demoData.analysis.preferences.map(p => (
                  <span key={p} className="px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-300 text-xs font-bold">{p}</span>
                ))}
              </div>
            </div>

            {/* Assumptions */}
            <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">💡 Hypothèses IA</p>
              <ul className="space-y-2">
                {demoData.analysis.assumptions.map(a => (
                  <li key={a} className="flex items-start gap-2 text-xs text-amber-200/70">
                    <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={() => setStep(3)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-violet-600 text-white font-black flex items-center justify-center gap-2">
              Voir l'itinéraire généré <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── STEP 3 — ITINERARY ───────────────────────────────────────── */}
        {step === 3 && demoData && (
          <div className="space-y-4 animate-[fadeIn_.3s_ease]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white mb-1">Itinéraire {demoData.analysis.duration} Jours</h2>
                <p className="text-sm text-slate-400">{demoData.analysis.destination} · {demoData.analysis.period}</p>
              </div>
              <span className="text-xs font-bold text-slate-400">{demoData.days.reduce((s, d) => s + d.items.length, 0)} étapes</span>
            </div>

            {demoData.days.map(day => (
              <div key={day.number} className="rounded-xl bg-[#1a2035] border border-white/7 overflow-hidden">
                <button onClick={() => toggleDay(day.number)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/2 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500/25 to-violet-500/25 border border-teal-500/30 flex items-center justify-center text-teal-300 font-black text-sm">
                      {day.number}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">Jour {day.number} — {day.title}</div>
                      <div className="text-xs text-slate-400">{day.theme}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-teal-300">{day.dayTotal.toLocaleString('fr')} €</span>
                    {expandedDays.includes(day.number)
                      ? <ChevronUp className="w-4 h-4 text-slate-400" />
                      : <ChevronDown className="w-4 h-4 text-slate-400" />
                    }
                  </div>
                </button>

                {expandedDays.includes(day.number) && (
                  <div className="border-t border-white/5 px-4 py-3 space-y-3">
                    {day.items.map((item, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-sm flex-shrink-0">{item.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 font-mono">{item.time}</span>
                            <span className="text-sm font-bold text-white">{item.title}</span>
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">{item.detail}</div>
                        </div>
                        {item.cost > 0 && (
                          <span className="text-xs font-bold text-teal-300 flex-shrink-0">{item.cost.toLocaleString('fr')} €</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button onClick={() => setStep(4)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-violet-600 text-white font-black flex items-center justify-center gap-2">
              Calculer le devis <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── STEP 4 — PRICING ─────────────────────────────────────────── */}
        {step === 4 && demoData && (
          <div className="space-y-5 animate-[fadeIn_.3s_ease]">
            <div>
              <h2 className="text-lg font-black text-white mb-1">Devis & Marges</h2>
              <p className="text-sm text-slate-400">Ajustez la marge pour voir le prix de vente en temps réel.</p>
            </div>

            {/* Pricing lines */}
            <div className="rounded-xl bg-[#1a2035] border border-white/7 overflow-hidden">
              {demoData.pricing.map((line, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i < demoData.pricing.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <span className="text-lg w-8 text-center flex-shrink-0">{line.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white">{line.category}</div>
                    <div className="text-xs text-slate-400 truncate">{line.detail}</div>
                  </div>
                  <span className="text-sm font-bold text-slate-200 flex-shrink-0">{line.cost.toLocaleString('fr')} €</span>
                </div>
              ))}
            </div>

            {/* Margin slider */}
            <div className="rounded-xl bg-[#1a2035] border border-white/7 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Marge S'TOURS</span>
                <span className="text-lg font-black text-teal-300">{margin}%</span>
              </div>
              <input type="range" min={10} max={45} value={margin} onChange={e => setMargin(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer mb-2" />
              <div className="flex justify-between text-xs text-slate-500">
                <span>10% min</span><span>Recommandé: 25–30%</span><span>45% max</span>
              </div>
            </div>

            {/* Totals */}
            <div className="rounded-xl bg-gradient-to-br from-teal-500/10 to-violet-500/8 border border-teal-500/25 p-5 space-y-3">
              {[
                { label: 'Coût total fournisseurs', value: `${totalCost.toLocaleString('fr')} €`, style: 'text-white' },
                { label: `Marge S'TOURS (${margin}%)`, value: `+${marginAmount.toLocaleString('fr')} €`, style: 'text-green-400' },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-sm text-slate-400">{row.label}</span>
                  <span className={`text-sm font-bold ${row.style}`}>{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center">
                <span className="text-base font-black text-white">Prix de vente HT</span>
                <span className="text-2xl font-black text-teal-300">{sellPrice.toLocaleString('fr')} €</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Prix / personne</span>
                <span className="text-lg font-black text-violet-300">{perPerson.toLocaleString('fr')} € / pax</span>
              </div>
              {/* Margin bar */}
              <div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-green-400 rounded-full transition-all duration-300"
                    style={{ width: `${margin}%` }} />
                </div>
              </div>
            </div>

            {/* Budget check */}
            <div className={`flex items-center gap-3 rounded-xl p-4 border ${
              sellPrice <= demoData.analysis.budget
                ? 'bg-green-500/8 border-green-500/25 text-green-300'
                : 'bg-red-500/8 border-red-500/25 text-red-300'
            }`}>
              {sellPrice <= demoData.analysis.budget
                ? <Check className="w-5 h-5 flex-shrink-0" />
                : <Zap className="w-5 h-5 flex-shrink-0" />
              }
              <span className="text-sm font-bold">
                {sellPrice <= demoData.analysis.budget
                  ? `Dans le budget client (${(demoData.analysis.budget - sellPrice).toLocaleString('fr')} € de marge de manœuvre)`
                  : `Dépasse le budget de ${(sellPrice - demoData.analysis.budget).toLocaleString('fr')} € — réduire la marge ou les prestations`
                }
              </span>
            </div>

            <button onClick={() => setStep(5)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-violet-600 text-white font-black flex items-center justify-center gap-2">
              Storytelling & Upsell <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── STEP 5 — STORYTELLING & UPSELL ──────────────────────────── */}
        {step === 5 && demoData && (
          <div className="space-y-5 animate-[fadeIn_.3s_ease]">
            <div>
              <h2 className="text-lg font-black text-white mb-1">Storytelling & Upsell</h2>
              <p className="text-sm text-slate-400">Description émotionnelle + options de valorisation.</p>
            </div>

            {/* Storytelling */}
            <div className="rounded-xl bg-[#1a2035] border border-white/7 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description expérientielle</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed italic whitespace-pre-line">{demoData.storytelling}</p>
            </div>

            {/* Video prompt */}
            <div className="rounded-xl bg-violet-500/8 border border-violet-500/20 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">Prompt Vidéo IA</span>
                </div>
                <button onClick={copyPrompt}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold hover:bg-violet-500/25 transition-colors">
                  {copiedPrompt ? <><Check className="w-3 h-3" /> Copié</> : 'Copier'}
                </button>
              </div>
              <p className="text-xs text-violet-200/60 leading-relaxed">{demoData.videoPrompt}</p>
            </div>

            {/* Upsells */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" /> Suggestions Upsell
              </p>
              <div className="space-y-2">
                {demoData.upsells.map((u, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-[#1a2035] border border-white/7 p-4 hover:border-teal-500/30 transition-colors cursor-pointer">
                    <span className="text-2xl">{u.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white">{u.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{u.desc}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-teal-300">+{u.price.toLocaleString('fr')} €</div>
                      <button className="text-xs text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1 mt-1 ml-auto">
                        <Plus className="w-3 h-3" /> Ajouter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-xl bg-teal-500/8 border border-teal-500/20 p-3 flex justify-between items-center">
                <span className="text-sm text-slate-300">Package Prestige complet</span>
                <span className="text-sm font-black text-teal-300">{(sellPrice + demoData.upsells.reduce((s, u) => s + u.price, 0)).toLocaleString('fr')} €</span>
              </div>
            </div>

            <button onClick={() => setStep(6)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-violet-600 text-white font-black flex items-center justify-center gap-2">
              Exporter le package <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── STEP 6 — EXPORT ──────────────────────────────────────────── */}
        {step === 6 && demoData && (
          <div className="space-y-5 animate-[fadeIn_.3s_ease]">
            <div>
              <h2 className="text-lg font-black text-white mb-1">Package Prêt à Envoyer</h2>
              <p className="text-sm text-slate-400">Exportez le devis sous différents formats.</p>
            </div>

            {/* Summary card */}
            <div className="rounded-xl bg-gradient-to-br from-teal-500/12 to-violet-500/8 border border-teal-500/25 p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{demoData.analysis.flag}</span>
                <div>
                  <div className="font-black text-white">{demoData.analysis.country} — {demoData.analysis.pax} pax</div>
                  <div className="text-sm text-slate-400">{demoData.analysis.type} · {demoData.analysis.duration}j · {demoData.analysis.period}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Prix total', value: `${sellPrice.toLocaleString('fr')} €`, color: 'text-teal-300' },
                  { label: 'Par pax', value: `${perPerson.toLocaleString('fr')} €`, color: 'text-violet-300' },
                  { label: 'Marge', value: `${margin}%`, color: 'text-green-400' },
                ].map(item => (
                  <div key={item.label} className="text-center">
                    <div className={`text-lg font-black ${item.color}`}>{item.value}</div>
                    <div className="text-xs text-slate-400">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export actions */}
            <div className="grid grid-cols-1 gap-3">
              {[
                { icon: FileText, label: 'Devis PDF Professionnel', desc: 'Mise en page S\'TOURS, prêt à envoyer au client', color: 'from-red-500/20 to-orange-500/20 border-red-500/30 text-red-300', action: 'Générer PDF' },
                { icon: Globe, label: 'Mini-site Client', desc: 'Lien personnalisé avec le programme complet + photos', color: 'from-blue-500/20 to-teal-500/20 border-blue-500/30 text-blue-300', action: 'Créer le lien' },
                { icon: Mail, label: 'Email Agence', desc: 'Mail de proposition formaté avec pièce jointe PDF', color: 'from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-300', action: 'Rédiger l\'email' },
                { icon: Download, label: 'Export Excel Devis', desc: 'Fichier XLSX avec toutes les lignes budgétaires', color: 'from-green-500/20 to-teal-500/20 border-green-500/30 text-green-300', action: 'Exporter XLSX' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <button key={item.label}
                    onClick={() => alert(`✓ ${item.action} — Fonctionnalité connectée au backend`)}
                    className={`flex items-center gap-4 rounded-xl bg-gradient-to-r ${item.color} border p-4 text-left hover:opacity-90 transition-opacity`}>
                    <Icon className="w-8 h-8 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-bold text-white text-sm">{item.label}</div>
                      <div className="text-xs opacity-70 mt-0.5">{item.desc}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-60 flex-shrink-0" />
                  </button>
                )
              })}
            </div>

            {/* New request */}
            <div className="pt-2">
              <button onClick={() => { setStep(1); setBrief(''); setDemoData(null); setMargin(25); setExpandedDays([1]) }}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/8 transition-colors">
                <RefreshCw className="w-4 h-4" /> Nouvelle demande client
              </button>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
      `}</style>
    </div>
  )
}
