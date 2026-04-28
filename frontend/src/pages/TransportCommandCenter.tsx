import { useState, useEffect, useMemo } from 'react'
import { 
  Bus, MapPin, AlertCircle, CheckCircle2, 
  Activity, Users, Clock, Search, Filter, 
  ChevronRight, Bell, Shield, Radio, Map as MapIcon,
  Navigation, Zap
} from 'lucide-react'
import { clsx } from 'clsx'
import { MapContainer, TileLayer, Marker, Polyline, ZoomControl, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ── Types ──────────────────────────────────────────────────────────
interface Mission {
  id: string
  driver: string
  vehicle: string
  pax: number
  location: string
  status: 'active' | 'warning' | 'completed'
  task: string
  delay: number
  lat: number
  lng: number
  destination?: { lat: number; lng: number }
}

// ── Mock Real-time Missions ───────────────────────────────────────
const MISSIONS: Mission[] = [
  { id: 'M1', driver: 'Hassan E.', vehicle: 'Mercedes V-Class', pax: 4, location: 'Marrakech', status: 'active', task: 'Transfert Aéroport', delay: 0, lat: 31.6295, lng: -7.9811, destination: { lat: 31.59, lng: -8.03 } },
  { id: 'M2', driver: 'Youssef B.', vehicle: 'Minibus VIP', pax: 12, location: 'Casablanca', status: 'active', task: 'City Tour', delay: 15, lat: 33.5731, lng: -7.5898 },
  { id: 'M3', driver: 'Ahmed L.', vehicle: 'Toyota PRADO', pax: 2, location: 'Désert Agafay', status: 'warning', task: 'Transfert Bivouac', delay: -5, lat: 31.3, lng: -8.2 },
  { id: 'M4', driver: 'Karim M.', vehicle: 'Mercedes Sprinter', pax: 15, location: 'Fès', status: 'completed', task: 'Départ Hôtel', delay: 0, lat: 34.0181, lng: -5.0078 },
  { id: 'M5', driver: 'Samir K.', vehicle: 'Range Rover', pax: 3, location: 'Rabat', status: 'active', task: 'Transfert Privé', delay: 2, lat: 34.0209, lng: -6.8417 },
]

// ── Custom Marker Icons ───────────────────────────────────────────
const createVehicleIcon = (status: 'active' | 'warning' | 'completed') => L.divIcon({
  className: 'custom-vehicle-icon',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-12 h-12 rounded-full ${status === 'warning' ? 'bg-amber-500/20 animate-ping' : 'bg-rihla/20 animate-pulse'}"></div>
      <div class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-lg transition-transform hover:scale-110" 
           style="background: ${status === 'warning' ? '#f59e0b' : status === 'completed' ? '#10b981' : '#E01937'}">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
      </div>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
})

// ── Curved Path Helper ────────────────────────────────────────────
function curvedPath(a: [number, number], b: [number, number], steps = 24, bulge = 0.15): [number, number][] {
  const mid: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  const dy = b[0] - a[0]
  const dx = b[1] - a[1]
  const len = Math.sqrt(dx * dx + dy * dy)
  const nx = -dy / (len || 1)
  const ny =  dx / (len || 1)
  const ctrl: [number, number] = [mid[0] + nx * len * bulge, mid[1] + ny * len * bulge]
  const out: [number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const lat = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * ctrl[0] + t * t * b[0]
    const lng = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * ctrl[1] + t * t * b[1]
    out.push([lat, lng])
  }
  return out
}

function MapUpdater({ missions }: { missions: Mission[] }) {
  const map = useMap()
  useEffect(() => {
    if (missions.length > 0) {
      const bounds = L.latLngBounds(missions.map(m => [m.lat, m.lng]))
      map.fitBounds(bounds, { padding: [100, 100], maxZoom: 10 })
    }
  }, [missions, map])
  return null
}

export function TransportCommandCenter() {
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null)
  const [liveFeed] = useState([
    { time: '15:02', msg: 'Hassan E. est arrivé à destination (Marrakech)', type: 'info' },
    { time: '14:55', msg: 'Alerte : Retard détecté sur M2 (Casablanca)', type: 'warning' },
    { time: '14:48', msg: 'Youssef B. a débuté la mission M2', type: 'success' },
  ])

  const activeMissions = useMemo(() => MISSIONS, [])
  const selectedMission = useMemo(() => activeMissions.find(m => m.id === selectedMissionId), [activeMissions, selectedMissionId])

  // Simulation de données télématiques changeantes
  const [telemetry, setTelemetry] = useState({ speed: 72, rpm: 2100, fuel: 65, temp: 88, gForce: 0.12 })
  useEffect(() => {
    if (!selectedMissionId) return
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        speed: Math.max(0, prev.speed + (Math.random() * 4 - 2)),
        rpm: Math.max(800, prev.rpm + (Math.random() * 100 - 50)),
        fuel: Math.max(0, prev.fuel - 0.001),
        temp: 85 + Math.random() * 5,
        gForce: Math.random() * 0.5
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [selectedMissionId])

  return (
    <div className="flex h-full bg-[#030712] text-white overflow-hidden font-sans">
      
      {/* ── LEFT PANEL: LIVE RADAR ──────────────────────────── */}
      <div className="w-[420px] border-r border-white/5 flex flex-col bg-slate-900/60 backdrop-blur-3xl z-20">
        <div className="p-6 border-b border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-black tracking-tighter flex items-center gap-2">
              <Radio className="text-rihla animate-pulse" size={20} />
              TRANSPORT OPS
            </h1>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[9px] font-black rounded border border-emerald-500/30">RADAR LIVE</span>
              <button className="px-3 py-1 bg-rihla text-white text-[9px] font-black rounded shadow-lg shadow-rihla/20 hover:scale-105 transition-all">NOUVELLE MISSION</button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
            <input 
              type="text" 
              placeholder="Rechercher chauffeur ou véhicule..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-rihla/50 transition-all placeholder:text-white/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {activeMissions.map(m => (
            <div 
              key={m.id} 
              onClick={() => setSelectedMissionId(m.id)}
              className={clsx(
                "p-4 rounded-2xl border transition-all cursor-pointer group",
                selectedMissionId === m.id ? "bg-rihla/10 border-rihla/40 shadow-lg" : "bg-white/5 border-white/5 hover:border-white/20",
                m.status === 'warning' && selectedMissionId !== m.id && "border-amber-500/30"
              )}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    "w-10 h-10 rounded-xl flex items-center justify-center shadow-inner",
                    m.status === 'warning' ? "bg-amber-500 text-white" : "bg-white/5 text-rihla"
                  )}>
                    <Bus size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{m.id} · {m.vehicle}</p>
                    <h3 className="text-[13px] font-bold">{m.driver}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-black">{m.location}</p>
                  <p className={clsx(
                    "text-[9px] font-bold uppercase flex items-center justify-end gap-1",
                    m.delay > 0 ? "text-red-400" : "text-emerald-400"
                  )}>
                    {m.delay === 0 ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                    {m.delay === 0 ? 'À l\'heure' : m.delay > 0 ? `+${m.delay} min` : `${m.delay} min`}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-medium text-white/60">
                <div className="flex items-center gap-1.5">
                   <Activity size={12} className="text-rihla" />
                   {m.task}
                </div>
                <div className="flex items-center gap-1.5">
                   <Users size={12} />
                   {m.pax} PAX
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-black/40 border-t border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest">Flux d'Activité</h4>
            <Zap size={12} className="text-rihla animate-pulse" />
          </div>
          <div className="space-y-3">
            {liveFeed.map((f, i) => (
              <div key={i} className="flex gap-3 text-[11px]">
                <span className="text-white/30 font-mono">{f.time}</span>
                <p className={clsx(
                  "flex-1 font-medium",
                  f.type === 'warning' ? "text-amber-400" : "text-white/70"
                )}>{f.msg}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CENTER: INTERACTIVE STRATEGIC MAP ────────────────── */}
      <div className="flex-1 relative flex flex-col bg-[#020617]">
        {/* Map Header */}
        <div className="absolute top-8 left-8 z-[1000] flex items-center gap-4">
           <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-6 shadow-2xl">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Missions Actives</span>
                <div className="flex items-end gap-1.5">
                  <span className="text-3xl font-black text-white tabular-nums">24</span>
                  <span className="text-[10px] text-emerald-400 font-bold mb-1.5">+2</span>
                </div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Alertes</span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-amber-500 tabular-nums">3</span>
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                </div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Disponibilité</span>
                <span className="text-3xl font-black text-white/80 tabular-nums">85%</span>
              </div>
           </div>
           
           <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col gap-2 shadow-2xl">
              <button className="p-2.5 rounded-xl bg-rihla text-white shadow-lg shadow-rihla/20 hover:scale-105 transition-transform">
                <Navigation size={18} />
              </button>
              <button className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:bg-white/10 transition-colors">
                <MapIcon size={18} />
              </button>
           </div>
        </div>

        {/* The Map (Leaflet) */}
        <div className="flex-1 w-full h-full relative">
          <MapContainer
            center={[31.79, -7.09]}
            zoom={6}
            zoomControl={false}
            scrollWheelZoom
            className="w-full h-full grayscale-[0.2] contrast-[1.1]"
          >
            <TileLayer
              attribution='© CartoDB'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <ZoomControl position="bottomleft" />
            <MapUpdater missions={activeMissions} />

            {/* Active Mission Markers */}
            {activeMissions.map(m => (
              <Marker 
                key={m.id} 
                position={[m.lat, m.lng]} 
                icon={createVehicleIcon(m.status)}
                eventHandlers={{
                  click: () => setSelectedMissionId(m.id)
                }}
              >
                <Tooltip direction="top" offset={[0, -20]} className="bg-slate-900 border-white/10 text-white rounded-lg">
                  <div className="p-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-rihla">{m.id}</p>
                    <p className="text-[12px] font-bold">{m.driver}</p>
                    <p className="text-[10px] text-white/50">{m.task}</p>
                  </div>
                </Tooltip>
              </Marker>
            ))}

            {/* Trajectories for active missions */}
            {activeMissions.filter(m => m.destination && m.status === 'active').map(m => (
              <Polyline 
                key={`route-${m.id}`}
                positions={curvedPath([m.lat, m.lng], [m.destination!.lat, m.destination!.lng])}
                pathOptions={{ 
                  color: m.status === 'warning' ? '#f59e0b' : '#E01937', 
                  weight: 2, 
                  opacity: 0.4, 
                  dashArray: '5, 10' 
                }}
              />
            ))}
          </MapContainer>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-8 right-8 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex gap-8 shadow-2xl z-[1000]">
           <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-rihla shadow-lg shadow-rihla/30" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/80">Active</p>
                <p className="text-[9px] text-white/30">Opérations normales</p>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-amber-500 shadow-lg shadow-amber-500/30 animate-pulse" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Alerte</p>
                <p className="text-[9px] text-white/30">Retard détecté</p>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-emerald-500" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Terminé</p>
                <p className="text-[9px] text-white/30">Mission close</p>
              </div>
           </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: TELEMETRY (Imp #9) ────────────────── */}
      <div className={clsx(
        "fixed right-0 top-0 bottom-0 w-80 bg-slate-900/90 backdrop-blur-3xl border-l border-white/10 z-[1100] transition-transform duration-500 p-6 flex flex-col",
        selectedMission ? "translate-x-0 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]" : "translate-x-full"
      )}>
        {selectedMission && (
          <>
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-[10px] font-black text-rihla uppercase tracking-widest mb-1">Télématique Live</div>
                <h2 className="text-lg font-black">{selectedMission.vehicle}</h2>
                <p className="text-xs text-white/40">{selectedMission.driver}</p>
              </div>
              <button onClick={() => setSelectedMissionId(null)} className="p-2 hover:bg-white/5 rounded-full text-white/40">
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Speed Gauge */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                 <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Vitesse Actuelle</span>
                    <span className="text-2xl font-black tabular-nums">{Math.round(telemetry.speed)} <span className="text-[10px] text-white/30">KM/H</span></span>
                 </div>
                 <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-rihla transition-all" style={{ width: `${(telemetry.speed / 140) * 100}%` }} />
                 </div>
              </div>

              {/* Engine Grid */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-white/30 mb-2">
                       <Zap size={14} />
                       <span className="text-[9px] font-black uppercase">RPM</span>
                    </div>
                    <div className="text-lg font-black tabular-nums">{Math.round(telemetry.rpm)}</div>
                 </div>
                 <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-white/30 mb-2">
                       <Shield size={14} />
                       <span className="text-[9px] font-black uppercase">Temp</span>
                    </div>
                    <div className="text-lg font-black tabular-nums">{telemetry.temp.toFixed(1)}°C</div>
                 </div>
              </div>

              {/* Fuel Level */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                 <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                       <AlertCircle size={12} /> Carburant
                    </span>
                    <span className="text-xs font-bold text-emerald-400">{telemetry.fuel.toFixed(1)}%</span>
                 </div>
                 <div className="flex gap-1 h-3">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className={clsx(
                        "flex-1 rounded-sm",
                        i < telemetry.fuel / 10 ? "bg-emerald-500" : "bg-white/10"
                      )} />
                    ))}
                 </div>
              </div>

              {/* G-Force Ball */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center">
                 <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-4 w-full text-left">G-Force Sensor</span>
                 <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center relative">
                    <div className="absolute inset-0 border border-white/5 rounded-full scale-50" />
                    <div className="w-3 h-3 rounded-full bg-rihla shadow-[0_0_15px_rgba(224,25,55,0.8)] transition-all duration-300" 
                         style={{ transform: `translate(${telemetry.gForce * 20}px, ${Math.random() * 5}px)` }} />
                 </div>
              </div>

              {/* Route Progress */}
              <div className="mt-auto pt-6 border-t border-white/5">
                 <div className="flex justify-between text-[10px] font-black text-white/30 uppercase mb-2">
                    <span>{selectedMission.location}</span>
                    <span>Destination</span>
                 </div>
                 <div className="h-1 bg-white/10 rounded-full relative">
                    <div className="absolute left-[65%] top-1/2 -translate-y-1/2 w-3 h-3 bg-rihla rounded-full border-2 border-slate-900" />
                    <div className="absolute inset-y-0 left-0 bg-rihla/30 w-[65%]" />
                 </div>
                 <p className="text-[10px] text-center mt-3 text-white/40 italic">Arrivée estimée dans 22 min</p>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  )
}
