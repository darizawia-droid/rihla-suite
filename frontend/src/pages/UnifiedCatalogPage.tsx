import { useState } from 'react'
import {
  Hotel, Truck, UserCheck, Utensils, Star, MapPin, Phone, Mail,
  Search, Filter, ChevronRight, Building2, Globe, Award, TrendingUp,
  Package, Eye, ExternalLink, BarChart3,
} from 'lucide-react'

/* ──────────────── DONNÉES PARTENAIRES (Base Solide) ──────────────── */

interface Supplier {
  id: string
  name: string
  type: 'hotelier' | 'transporteur' | 'guide' | 'restaurateur' | 'activite'
  city: string
  country: string
  contact: string
  email: string
  phone: string
  rating: number
  status: 'active' | 'inactive'
  contractEnd: string
  commission: number
}

interface Product {
  id: string
  supplierId: string
  name: string
  category: string
  type: 'hotel' | 'transport' | 'guide' | 'restaurant' | 'activity'
  city: string
  basePrice: number
  currency: string
  season: string
  details: Record<string, string | number>
}

const SUPPLIERS: Supplier[] = [
  { id: 'S1', name: 'Royal Mansour Marrakech', type: 'hotelier', city: 'Marrakech', country: 'Morocco', contact: 'Khalid Bennani', email: 'k.bennani@royalmansour.ma', phone: '+212 5 24 38 80 00', rating: 5, status: 'active', contractEnd: '2027-03-31', commission: 12 },
  { id: 'S2', name: 'La Mamounia', type: 'hotelier', city: 'Marrakech', country: 'Morocco', contact: 'Nadia Alaoui', email: 'n.alaoui@mamounia.com', phone: '+212 5 24 38 86 00', rating: 4.9, status: 'active', contractEnd: '2026-12-31', commission: 10 },
  { id: 'S3', name: 'Palais Faraj Fès', type: 'hotelier', city: 'Fès', country: 'Morocco', contact: 'Ahmed Fassi', email: 'a.fassi@palaisfaraj.com', phone: '+212 5 35 63 53 56', rating: 4.8, status: 'active', contractEnd: '2027-06-30', commission: 15 },
  { id: 'S4', name: "S'TOURS Transport", type: 'transporteur', city: 'Casablanca', country: 'Morocco', contact: 'Rachid Amrani', email: 'r.amrani@stours.ma', phone: '+212 6 61 23 45 67', rating: 4.6, status: 'active', contractEnd: '2027-01-31', commission: 8 },
  { id: 'S5', name: 'Hassan Amazigh', type: 'guide', city: 'Marrakech', country: 'Morocco', contact: 'Hassan Amazigh', email: 'hassan.guide@gmail.com', phone: '+212 6 72 34 56 78', rating: 4.9, status: 'active', contractEnd: '2026-12-31', commission: 0 },
  { id: 'S6', name: 'Dar Yacout', type: 'restaurateur', city: 'Marrakech', country: 'Morocco', contact: 'Fatima Zahra', email: 'contact@daryacout.com', phone: '+212 5 24 38 29 29', rating: 4.7, status: 'active', contractEnd: '2027-09-30', commission: 12 },
  { id: 'S7', name: 'Kasbah Tamadot', type: 'hotelier', city: 'Atlas', country: 'Morocco', contact: 'Youssef Berrada', email: 'info@kasbahtamadot.com', phone: '+212 5 24 36 82 00', rating: 4.8, status: 'active', contractEnd: '2027-04-30', commission: 10 },
  { id: 'S8', name: 'Sahara Luxury Camp', type: 'hotelier', city: 'Merzouga', country: 'Morocco', contact: 'Omar Sahraoui', email: 'omar@saharacamp.ma', phone: '+212 6 66 78 90 12', rating: 4.5, status: 'active', contractEnd: '2026-11-30', commission: 18 },
]

const PRODUCTS: Product[] = [
  // Hotels - Royal Mansour
  { id: 'P1', supplierId: 'S1', name: 'Riad Classique', category: '5* Palace', type: 'hotel', city: 'Marrakech', basePrice: 9200, currency: 'MAD', season: 'Haute', details: { rooms: 20, size: '120 m²', capacity: 2, mealPlan: 'BB' } },
  { id: 'P2', supplierId: 'S1', name: 'Riad Prestige', category: '5* Palace', type: 'hotel', city: 'Marrakech', basePrice: 15500, currency: 'MAD', season: 'Haute', details: { rooms: 20, size: '185 m²', capacity: 2, mealPlan: 'BB' } },
  { id: 'P3', supplierId: 'S1', name: 'Grand Riad', category: '5* Palace', type: 'hotel', city: 'Marrakech', basePrice: 28000, currency: 'MAD', season: 'Haute', details: { rooms: 13, size: '340 m²', capacity: 4, mealPlan: 'BB' } },
  // Hotels - La Mamounia
  { id: 'P4', supplierId: 'S2', name: 'Chambre Supérieure', category: '5* Palace', type: 'hotel', city: 'Marrakech', basePrice: 4800, currency: 'MAD', season: 'Haute', details: { rooms: 72, size: '40 m²', capacity: 2, mealPlan: 'BB' } },
  { id: 'P5', supplierId: 'S2', name: 'Chambre Deluxe', category: '5* Palace', type: 'hotel', city: 'Marrakech', basePrice: 6500, currency: 'MAD', season: 'Haute', details: { rooms: 59, size: '55 m²', capacity: 2, mealPlan: 'BB' } },
  { id: 'P6', supplierId: 'S2', name: 'Suite Prestige', category: '5* Palace', type: 'hotel', city: 'Marrakech', basePrice: 10500, currency: 'MAD', season: 'Haute', details: { rooms: 38, size: '90 m²', capacity: 3, mealPlan: 'HB' } },
  // Hotels - Palais Faraj
  { id: 'P7', supplierId: 'S3', name: 'Chambre Tradition', category: '5* Riad', type: 'hotel', city: 'Fès', basePrice: 2600, currency: 'MAD', season: 'Haute', details: { rooms: 10, size: '30 m²', capacity: 2, mealPlan: 'BB' } },
  { id: 'P8', supplierId: 'S3', name: 'Suite Ambassadeur', category: '5* Riad', type: 'hotel', city: 'Fès', basePrice: 4200, currency: 'MAD', season: 'Haute', details: { rooms: 8, size: '65 m²', capacity: 2, mealPlan: 'HB' } },
  // Hotels - Kasbah Tamadot
  { id: 'P9', supplierId: 'S7', name: 'Chambre Deluxe', category: '5* Boutique', type: 'hotel', city: 'Atlas', basePrice: 4000, currency: 'MAD', season: 'Haute', details: { rooms: 18, size: '45 m²', capacity: 2, mealPlan: 'HB' } },
  { id: 'P10', supplierId: 'S7', name: 'Berber Tent Suite', category: '5* Boutique', type: 'hotel', city: 'Atlas', basePrice: 6000, currency: 'MAD', season: 'Haute', details: { rooms: 5, size: '80 m²', capacity: 2, mealPlan: 'FB' } },
  // Hotels - Sahara Camp
  { id: 'P11', supplierId: 'S8', name: 'Tente Standard', category: 'Luxury Camp', type: 'hotel', city: 'Merzouga', basePrice: 2200, currency: 'MAD', season: 'Haute', details: { rooms: 8, size: '35 m²', capacity: 2, mealPlan: 'FB' } },
  { id: 'P12', supplierId: 'S8', name: 'Suite Royale du Désert', category: 'Luxury Camp', type: 'hotel', city: 'Merzouga', basePrice: 3800, currency: 'MAD', season: 'Haute', details: { rooms: 4, size: '60 m²', capacity: 2, mealPlan: 'FB' } },
  // Transport
  { id: 'P13', supplierId: 'S4', name: 'Mercedes V-Class', category: 'Minivan', type: 'transport', city: 'Tout Maroc', basePrice: 1800, currency: 'MAD', season: 'Toute', details: { capacity: 7, routes: 3, type: 'minivan' } },
  { id: 'P14', supplierId: 'S4', name: 'Mercedes Sprinter', category: 'Minibus', type: 'transport', city: 'Tout Maroc', basePrice: 2800, currency: 'MAD', season: 'Toute', details: { capacity: 19, routes: 4, type: 'minibus' } },
  { id: 'P15', supplierId: 'S4', name: 'Grand Bus Mercedes', category: 'Bus', type: 'transport', city: 'Tout Maroc', basePrice: 4500, currency: 'MAD', season: 'Toute', details: { capacity: 53, routes: 5, type: 'bus' } },
  { id: 'P16', supplierId: 'S4', name: 'Toyota Land Cruiser', category: '4x4', type: 'transport', city: 'Sahara', basePrice: 3500, currency: 'MAD', season: 'Toute', details: { capacity: 5, routes: 2, type: '4x4' } },
  // Guide
  { id: 'P17', supplierId: 'S5', name: 'Journée complète', category: 'Guide Officiel', type: 'guide', city: 'Marrakech', basePrice: 800, currency: 'MAD', season: 'Toute', details: { languages: 4, zones: 'Marrakech, Fès, Atlas', maxPax: 25 } },
  { id: 'P18', supplierId: 'S5', name: 'Demi-journée', category: 'Guide Officiel', type: 'guide', city: 'Marrakech', basePrice: 500, currency: 'MAD', season: 'Toute', details: { languages: 4, zones: 'Marrakech', maxPax: 25 } },
  // Restaurant
  { id: 'P19', supplierId: 'S6', name: 'Menu Découverte', category: 'Gastronomique', type: 'restaurant', city: 'Marrakech', basePrice: 450, currency: 'MAD', season: 'Toute', details: { courses: 5, drinks: 'inclus', capacity: 60 } },
  { id: 'P20', supplierId: 'S6', name: 'Menu Royal', category: 'Gastronomique', type: 'restaurant', city: 'Marrakech', basePrice: 750, currency: 'MAD', season: 'Toute', details: { courses: 7, drinks: 'premium', capacity: 40 } },
]

const TYPE_CONFIG: Record<string, { icon: any; color: string; bgColor: string; label: string }> = {
  hotel:      { icon: Hotel,     color: 'text-amber-600',  bgColor: 'bg-amber-50',  label: 'Hébergement' },
  transport:  { icon: Truck,     color: 'text-blue-600',   bgColor: 'bg-blue-50',   label: 'Transport' },
  guide:      { icon: UserCheck, color: 'text-emerald-600',bgColor: 'bg-emerald-50', label: 'Guide' },
  restaurant: { icon: Utensils,  color: 'text-rose-600',   bgColor: 'bg-rose-50',   label: 'Restauration' },
  activity:   { icon: Star,      color: 'text-violet-600', bgColor: 'bg-violet-50',  label: 'Activité' },
}

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n)

export function UnifiedCatalogPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [cityFilter, setCityFilter] = useState<string>('all')
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)
  const [view, setView] = useState<'products' | 'suppliers'>('products')

  const cities = [...new Set(PRODUCTS.map(p => p.city))]

  const filteredProducts = PRODUCTS.filter(p => {
    if (typeFilter !== 'all' && p.type !== typeFilter) return false
    if (cityFilter !== 'all' && p.city !== cityFilter) return false
    if (selectedSupplier && p.supplierId !== selectedSupplier) return false
    if (search) {
      const s = search.toLowerCase()
      const supplier = SUPPLIERS.find(sup => sup.id === p.supplierId)
      return p.name.toLowerCase().includes(s) || p.city.toLowerCase().includes(s) || supplier?.name.toLowerCase().includes(s)
    }
    return true
  })

  const filteredSuppliers = SUPPLIERS.filter(s => {
    if (typeFilter !== 'all') {
      const typeMap: Record<string, string> = { hotel: 'hotelier', transport: 'transporteur', guide: 'guide', restaurant: 'restaurateur' }
      if (s.type !== typeMap[typeFilter]) return false
    }
    if (cityFilter !== 'all' && s.city !== cityFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q) || s.contact.toLowerCase().includes(q)
    }
    return true
  })

  const stats = {
    totalProducts: PRODUCTS.length,
    totalSuppliers: SUPPLIERS.length,
    hotels: PRODUCTS.filter(p => p.type === 'hotel').length,
    transport: PRODUCTS.filter(p => p.type === 'transport').length,
    guides: PRODUCTS.filter(p => p.type === 'guide').length,
    restaurants: PRODUCTS.filter(p => p.type === 'restaurant').length,
    avgRating: (SUPPLIERS.reduce((s, sup) => s + sup.rating, 0) / SUPPLIERS.length).toFixed(1),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-amber-600 font-semibold mb-1">
            <Package size={16} /> Catalogue Unifié Produits × Fournisseurs
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-cream">
            Catalogue Unifié — Produits & Fournisseurs
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {stats.totalProducts} produits · {stats.totalSuppliers} fournisseurs · Liaison Base Solide
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Total Produits', value: stats.totalProducts, icon: Package, color: 'text-slate-700' },
          { label: 'Fournisseurs', value: stats.totalSuppliers, icon: Building2, color: 'text-blue-600' },
          { label: 'Hébergements', value: stats.hotels, icon: Hotel, color: 'text-amber-600' },
          { label: 'Transport', value: stats.transport, icon: Truck, color: 'text-blue-600' },
          { label: 'Guides', value: stats.guides, icon: UserCheck, color: 'text-emerald-600' },
          { label: 'Restaurants', value: stats.restaurants, icon: Utensils, color: 'text-rose-600' },
          { label: 'Note Moy.', value: `${stats.avgRating}/5`, icon: Star, color: 'text-yellow-500' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-1">
              {kpi.label} <kpi.icon size={12} className={kpi.color} />
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-cream">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          <button onClick={() => setView('products')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${view === 'products' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-cream shadow' : 'text-slate-500'}`}>
            Produits ({filteredProducts.length})
          </button>
          <button onClick={() => setView('suppliers')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${view === 'suppliers' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-cream shadow' : 'text-slate-500'}`}>
            Fournisseurs ({filteredSuppliers.length})
          </button>
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher produit, fournisseur..."
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm"
          />
        </div>

        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm">
          <option value="all">Tous les types</option>
          <option value="hotel">Hébergement</option>
          <option value="transport">Transport</option>
          <option value="guide">Guide</option>
          <option value="restaurant">Restauration</option>
        </select>

        <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm">
          <option value="all">Toutes les villes</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {selectedSupplier && (
          <button onClick={() => setSelectedSupplier(null)} className="px-3 py-2 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold flex items-center gap-1">
            <Filter size={14} /> {SUPPLIERS.find(s => s.id === selectedSupplier)?.name} ✕
          </button>
        )}
      </div>

      {/* Products View */}
      {view === 'products' && (
        <div className="grid gap-3">
          {filteredProducts.map(product => {
            const supplier = SUPPLIERS.find(s => s.id === product.supplierId)!
            const config = TYPE_CONFIG[product.type]
            const Icon = config.icon
            return (
              <div key={product.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-white/10 p-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${config.bgColor} rounded-xl flex items-center justify-center`}>
                      <Icon size={20} className={config.color} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-cream">{product.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${config.bgColor} ${config.color}`}>{config.label}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1"><MapPin size={11} />{product.city}</span>
                        <span>{product.category}</span>
                        <span className="flex items-center gap-1">
                          <Building2 size={11} />
                          <button onClick={() => setSelectedSupplier(supplier.id)} className="text-amber-600 hover:underline font-semibold">
                            {supplier.name}
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-slate-900 dark:text-cream">{fmt(product.basePrice)} <span className="text-xs font-normal text-slate-400">{product.currency}</span></div>
                    <div className="text-[10px] text-slate-400">{product.season} saison · {supplier.commission}% comm.</div>
                  </div>
                </div>
                {/* Details row */}
                <div className="mt-3 pt-3 border-t border-slate-50 dark:border-white/5 flex items-center gap-4 text-xs text-slate-500">
                  {Object.entries(product.details).map(([key, val]) => (
                    <span key={key} className="flex items-center gap-1">
                      <span className="text-slate-400">{key}:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{val}</span>
                    </span>
                  ))}
                  <span className="ml-auto flex items-center gap-1">
                    <Star size={11} className="text-yellow-500" /> {supplier.rating}/5
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${supplier.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {supplier.status === 'active' ? 'Contrat actif' : 'Inactif'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Suppliers View */}
      {view === 'suppliers' && (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredSuppliers.map(supplier => {
            const supplierProducts = PRODUCTS.filter(p => p.supplierId === supplier.id)
            const typeConfig = TYPE_CONFIG[supplier.type === 'hotelier' ? 'hotel' : supplier.type === 'transporteur' ? 'transport' : supplier.type === 'restaurateur' ? 'restaurant' : supplier.type] || TYPE_CONFIG.hotel
            const Icon = typeConfig.icon
            return (
              <div key={supplier.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-white/10 p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${typeConfig.bgColor} rounded-xl flex items-center justify-center`}>
                      <Icon size={24} className={typeConfig.color} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-cream">{supplier.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin size={11} /> {supplier.city}, {supplier.country}
                        <span className="flex items-center gap-0.5">
                          <Star size={11} className="text-yellow-500 fill-yellow-500" /> {supplier.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${supplier.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {supplier.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="flex items-center gap-1 text-slate-500"><Phone size={11} /> {supplier.phone}</div>
                  <div className="flex items-center gap-1 text-slate-500"><Mail size={11} /> {supplier.email}</div>
                  <div className="flex items-center gap-1 text-slate-500"><Award size={11} /> Commission {supplier.commission}%</div>
                  <div className="flex items-center gap-1 text-slate-500"><Globe size={11} /> Contrat → {supplier.contractEnd}</div>
                </div>

                <div className="border-t border-slate-50 dark:border-white/5 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{supplierProducts.length} produit(s) liés</span>
                    <button onClick={() => { setSelectedSupplier(supplier.id); setView('products') }} className="text-xs text-amber-600 hover:underline flex items-center gap-1">
                      Voir tout <ChevronRight size={12} />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {supplierProducts.slice(0, 3).map(p => (
                      <div key={p.id} className="flex items-center justify-between text-xs py-1">
                        <span className="text-slate-600 dark:text-slate-400">{p.name}</span>
                        <span className="font-bold text-slate-900 dark:text-cream">{fmt(p.basePrice)} {p.currency}</span>
                      </div>
                    ))}
                    {supplierProducts.length > 3 && (
                      <div className="text-[10px] text-slate-400">+{supplierProducts.length - 3} autres produits</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
