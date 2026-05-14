'use client';

import { trpc } from '@/lib/trpc-client';
import { StatsCard } from '@/components/dashboard/stats-card';
import { StockVelocity } from '@/components/dashboard/stock-velocity';
import { InvoicesTable } from '@/components/dashboard/invoices-table';
// YENİ EKLENENLER: Activity ikonu, AnimatePresence ve useState eklendi.
import { Package, Truck, AlertTriangle, Info, Zap, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useChannel } from 'ably/react';

export default function Home() {
  const utils = trpc.useUtils(); // Arka planda verileri yenilemek için gerekli
  
  // tRPC ile veri çekme
  const stats = trpc.getDashboardStats.useQuery();
  const velocity = trpc.getStockVelocity.useQuery();
  const invoices = trpc.getLatestInvoices.useQuery();

  // YENİ: Canlı bildirimleri (Toast) tutacağımız state
  const [notification, setNotification] = useState<{title: string, message: string} | null>(null);

  // YENİ: ABLY DİNLEYİCİSİ (SUBSCRIBER)
  // 'modul-network' kanalını dinler, sipariş gelince verileri yeniler ve uyarı gösterir.
  useChannel('modul-network', (message) => {
    if (message.name === 'order-created') {
      // 1. Neon DB'den verileri arka planda sessizce tekrar çek
      utils.getDashboardStats.invalidate();
      utils.getLatestInvoices.invalidate();
      utils.getStockVelocity.invalidate();

      // 2. Ekranda endüstriyel bir uyarı göster
      setNotification({
        title: "Telemetry Sync",
        message: `Procurement ${message.data?.orderNumber || 'Authorized'} successfully broadcasted.`
      });

      // 4 saniye sonra bildirimi kapat
      setTimeout(() => setNotification(null), 4000);
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12 relative">
      
      {/* 1. Başlık Bölümü - Daha belirgin ve tok */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-2"
      >
        <h2 className="text-4xl font-black tracking-tightest text-slate-950 uppercase">
          Executive Overview
        </h2>
        <p className="text-slate-600 text-base font-medium">
          Real-time telemetry for active supply chain operations.
        </p>
      </motion.div>

      {/* 2. İstatistik Kartları - Border-2 ve Gölge eklendi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatsCard 
          title="Active Orders"
          value={stats.isLoading ? "..." : (stats.data?.activeOrders ?? 0)}
          description="Orders currently in production"
          icon={Package}
          trend="+12.5%"
        />
        <StatsCard 
          title="Pending Shipments"
          value={stats.isLoading ? "..." : (stats.data?.pendingShipments ?? 0)}
          description="Requires immediate attention"
          icon={Truck}
        />
        <StatsCard 
          title="Delayed Freight"
          value={stats.isLoading ? "..." : (stats.data?.delayedFreight ?? 0)}
          description="Action Required"
          icon={AlertTriangle}
          isAlert={true}
        />
      </div>

      {/* 3. Orta Bölüm: Grafik ve Uyarılar - Kontrast artırıldı */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Grafik Alanı (2 birim genişlik) */}
        <div className="lg:col-span-2 shadow-xl bg-white border-2 border-slate-200 rounded-sm overflow-hidden">
          <StockVelocity data={velocity.data ?? []} />
        </div>
        
        {/* Kritik Uyarılar Alanı (1 birim genişlik) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-8 bg-white border-2 border-slate-300 rounded-sm flex flex-col shadow-2xl relative"
        >
          {/* Üst Vurgu Çizgisi */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-950" />

          <h3 className="text-2xl font-black tracking-tightest mb-8 text-slate-950 uppercase">
            Critical Alerts
          </h3>
          
          <div className="space-y-5 flex-1">
            {/* Danger Alert */}
            <div className="p-5 border-l-4 border-red-600 bg-red-50/50 group hover:bg-red-50 transition-all shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-700">Part Shortage</span>
              </div>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                Component AX-772 inventory critically low at Munich facility. Impact expected within 48h.
              </p>
            </div>

            {/* Info Alert */}
            <div className="p-5 border-l-4 border-blue-600 bg-blue-50/50 group hover:bg-blue-50 transition-all shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-700">Route Deviation</span>
              </div>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                Shipment #9921 rerouted due to port congestion. ETA updated to Oct 28th.
              </p>
            </div>

            {/* Neutral Alert */}
            <div className="p-5 border-l-4 border-slate-400 bg-slate-50 group hover:bg-slate-100 transition-all shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-600">Compliance Update</span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                New customs regulations effective Q3 for APAC regions. Review required.
              </p>
            </div>
          </div>

          <button className="w-full py-4 mt-8 text-[11px] font-black uppercase tracking-[0.2em] border-2 border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-white transition-all duration-300 active:scale-95 shadow-md">
            View All Intelligence
          </button>
        </motion.div>

      </div>

      {/* 4. Alt Bölüm: Invoices Tablosu - Belirgin Ayrım */}
      <div className="mt-12 bg-white border-2 border-slate-300 rounded-sm shadow-2xl overflow-hidden">
        <div className="p-6 border-b-2 border-slate-100 bg-slate-50/50">
           <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Financial Records</span>
        </div>
        <InvoicesTable data={invoices.data ?? []} />
      </div>

      {/* YENİ: CANLI BİLDİRİM (TOAST) SİSTEMİ */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-10 right-10 bg-slate-950 text-white p-6 shadow-2xl border-l-4 border-emerald-500 z-50 flex gap-4 items-center w-96 rounded-sm"
          >
            <div className="w-10 h-10 bg-emerald-500/20 flex items-center justify-center rounded-sm">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-1">{notification.title}</p>
              <p className="text-xs font-medium text-slate-300 leading-relaxed">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}