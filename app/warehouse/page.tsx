'use client';

import { trpc } from '@/lib/trpc-client';
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Factory, Activity, Box } from "lucide-react";
import { useMemo } from 'react';

export default function WarehouseTwinPage() {
  const inventory = trpc.ggetInventory.useQuery();

  // Veritabanından gelen envanteri lokasyonlarına göre grupluyoruz (Örn: Munich, Sec-A)
  const locationData = useMemo(() => {
    if (!inventory.data) return {};

    const grouped: Record<string, { totalItems: number; criticalItems: number; items: any[] }> = {};

    inventory.data.forEach((item: any) => {
      const loc = item.location || 'Unassigned Sector';
      const safetyLimit = item.safetyStock || item.safety_stock || 0;
      const isCritical = item.stock <= safetyLimit;

      if (!grouped[loc]) {
        grouped[loc] = { totalItems: 0, criticalItems: 0, items: [] };
      }

      grouped[loc].totalItems += 1;
      if (isCritical) grouped[loc].criticalItems += 1;
      grouped[loc].items.push(item);
    });

    return grouped;
  }, [inventory.data]);

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12 pt-8">
      
      {/* BAŞLIK */}
      <div className="flex justify-between items-end">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
          <h2 className="text-4xl font-black tracking-tightest text-slate-950 uppercase">Facility Digital Twin</h2>
          <p className="text-slate-600 text-base font-bold">2D spatial representation & real-time telemetry heatmap.</p>
        </motion.div>
        
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center gap-3 shadow-xl">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">Live Sync Active</span>
        </div>
      </div>

      {/* DİJİTAL İKİZ KONTROL MONİTÖRÜ (Dark Mode CAD Tasarımı) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-slate-950 rounded-sm shadow-2xl border-4 border-slate-900 overflow-hidden flex flex-col min-h-[600px]"
      >
        {/* Monitör Üst Bar */}
        <div className="border-b-2 border-slate-800 p-4 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Factory className="w-5 h-5 text-slate-400" />
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Global Facilities Map</span>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" /><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Optimal</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" /><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Critical Alert</span></div>
          </div>
        </div>

        {/* 2D Grid Alanı */}
        <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]">
          
          {inventory.isLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center text-slate-500 space-y-4">
              <Activity className="w-10 h-10 animate-spin" />
              <p className="text-xs font-mono uppercase tracking-widest">Establishing connection to physical assets...</p>
            </div>
          ) : (
            Object.entries(locationData).map(([locName, data], index) => {
              const isCritical = data.criticalItems > 0;

              return (
                <motion.div 
                  key={locName}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-6 border-2 flex flex-col justify-between transition-all duration-500 ${
                    isCritical 
                      ? 'bg-red-950/40 border-red-500/50 shadow-[inset_0_0_30px_rgba(239,68,68,0.1)]' 
                      : 'bg-slate-900/80 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {/* Kritik Uyarı Işığı (Sadece kritikse yanıp söner) */}
                  {isCritical && (
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                  )}
                  {isCritical && (
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,1)]" />
                  )}

                  <div>
                    <h3 className={`text-lg font-black uppercase tracking-widest mb-1 ${isCritical ? 'text-red-400' : 'text-slate-200'}`}>
                      {locName}
                    </h3>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-6">
                      Zone ID: {Math.floor(Math.random() * 9000) + 1000}
                    </p>

                    <div className="space-y-3">
                      {/* Lokasyondaki Ürünlerin Özeti */}
                      {data.items.slice(0, 3).map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center border-b border-slate-800 pb-2">
                          <span className="text-xs font-medium text-slate-400 truncate pr-4">{item.name}</span>
                          <span className={`text-xs font-mono font-bold ${item.stock <= (item.safetyStock || item.safety_stock || 0) ? 'text-red-400' : 'text-emerald-400'}`}>
                            {item.stock}
                          </span>
                        </div>
                      ))}
                      {data.items.length > 3 && (
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest pt-2">
                          + {data.items.length - 3} more SKUs
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Alt Durum Çubuğu */}
                  <div className={`mt-8 pt-4 border-t flex justify-between items-center ${isCritical ? 'border-red-900/50' : 'border-slate-800'}`}>
                    <div className="flex items-center gap-2">
                      <Box className={`w-4 h-4 ${isCritical ? 'text-red-500' : 'text-slate-500'}`} />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {data.totalItems} SKUs Total
                      </span>
                    </div>
                    {isCritical ? (
                      <div className="px-2 py-1 bg-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest border border-red-500/50 rounded-sm flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> ACTION REQ
                      </div>
                    ) : (
                      <div className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-500/30 rounded-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> STABLE
                      </div>
                    )}
                  </div>

                </motion.div>
              );
            })
          )}
          
        </div>
      </motion.div>
    </div>
  );
}