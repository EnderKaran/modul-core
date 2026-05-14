'use client';

import { trpc } from '@/lib/trpc-client';
import { motion } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";
import { Navigation, AlertTriangle, Truck, Activity, ShieldCheck } from "lucide-react";

// Harita topolojisi (Dünya haritası SVG verisi)
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

// Merkez Depomuz (Hedef) - Münih, Almanya
const DESTINATION: [number, number] = [11.5820, 48.1351]; 

// Canlı Kargo Ağımız (Simülasyon Verileri + Gerçekçi Koordinatlar)
const activeFreights = [
  { id: "SHP-001", supplier: "Kordsa Teknik", from: [28.9784, 41.0082], status: "shipped" }, // Istanbul
  { id: "SHP-002", supplier: "Global Synthetics", from: [121.4737, 31.2304], status: "delayed" }, // Shanghai
  { id: "SHP-003", supplier: "US Polymers", from: [-74.006, 40.7128], status: "shipped" }, // New York
  { id: "SHP-004", supplier: "BOSCH Sanayi", from: [29.0610, 40.1828], status: "shipped" }, // Bursa
  { id: "SHP-005", supplier: "Tata Materials", from: [72.8777, 19.0760], status: "delayed" }, // Mumbai
];

export default function TrackingPage() {
  const ordersQuery = trpc.getOrders.useQuery();

  // Gecikmeli ve Yoldaki kargoların istatistikleri
  const delayedCount = activeFreights.filter(f => f.status === 'delayed').length;
  const onRouteCount = activeFreights.filter(f => f.status === 'shipped').length;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12 pt-8">
      
      {/* BAŞLIK */}
      <div className="flex justify-between items-end">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
          <h2 className="text-4xl font-black tracking-tightest text-slate-950 uppercase">Live Freight Network</h2>
          <p className="text-slate-600 text-base font-bold">Global logistics tracking and real-time route telemetry.</p>
        </motion.div>
        
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center gap-3 shadow-xl">
          <Navigation className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">GPS Sync Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SOL PANEL - KONTROL MONİTÖRÜ */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Status Kartı */}
          <div className="bg-slate-950 p-6 rounded-sm shadow-xl border-2 border-slate-900">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Network Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-emerald-400" /><span className="text-xs font-bold text-slate-300">On Route</span></div>
                <span className="text-xl font-black text-white">{onRouteCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" /><span className="text-xs font-bold text-slate-300">Delayed</span></div>
                <span className="text-xl font-black text-red-400">{delayedCount}</span>
              </div>
            </div>
          </div>

          {/* Canlı Kargo Listesi */}
          <div className="bg-white border-2 border-slate-300 p-6 rounded-sm shadow-xl flex-1 h-[450px] overflow-y-auto">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" /> Active Shipments
            </h3>
            
            <div className="space-y-4">
              {activeFreights.map((freight) => (
                <div key={freight.id} className="p-4 border-2 border-slate-100 bg-slate-50 group hover:border-slate-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-mono font-bold text-slate-500">{freight.id}</p>
                    {freight.status === 'delayed' 
                      ? <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[9px] font-black uppercase tracking-widest">Delayed</span>
                      : <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest">On Track</span>
                    }
                  </div>
                  <p className="text-sm font-black text-slate-950 uppercase">{freight.supplier}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Dest: Munich Hub (HQ)</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* SAĞ PANEL - DÜNYA HARİTASI (Radar Görünümü) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-3 bg-[#0f172a] rounded-sm shadow-2xl border-4 border-slate-900 relative overflow-hidden flex items-center justify-center min-h-[600px]"
        >
          {/* Arkaplan Radar Grid Süslemesi */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
          
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 140 }}
            className="w-full h-full opacity-90"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#1e293b" // Koyu Mavi/Gri Karalar
                    stroke="#334155" // Sınır Çizgileri
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#334155", outline: "none", transition: "all 0.2s" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* ROTALARIN ÇİZİLMESİ (Animasyonlu) */}
            {activeFreights.map((freight) => {
              const isDelayed = freight.status === 'delayed';
              const lineColor = isDelayed ? "#ef4444" : "#10b981"; // Kırmızı veya Zümrüt Yeşili
              
              return (
                <Line
                  key={`line-${freight.id}`}
                  from={freight.from as [number, number]}
                  to={DESTINATION}
                  stroke={lineColor}
                  strokeWidth={2}
                  strokeLinecap="round"
                  className="animate-flow" // global.css'den gelen animasyon
                  style={{
                    filter: `drop-shadow(0 0 4px ${lineColor})`,
                    opacity: 0.6
                  }}
                />
              );
            })}

            {/* ÇIKIŞ NOKTALARI (Tedarikçiler) */}
            {activeFreights.map((freight) => (
              <Marker key={`marker-${freight.id}`} coordinates={freight.from as [number, number]}>
                <circle r={3} fill={freight.status === 'delayed' ? "#ef4444" : "#10b981"} />
                <circle r={8} fill={freight.status === 'delayed' ? "#ef4444" : "#10b981"} opacity={0.3} className="animate-ping" />
              </Marker>
            ))}

            {/* HEDEF NOKTASI (Ana Depo - Merkez) */}
            <Marker coordinates={DESTINATION}>
              <g transform="translate(-12, -24)">
                <ShieldCheck className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </g>
              <circle r={4} fill="#ffffff" />
            </Marker>

          </ComposableMap>
        </motion.div>
      </div>
    </div>
  );
}