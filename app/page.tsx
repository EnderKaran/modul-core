'use client';

import { trpc } from '@/lib/trpc-client';
import { StatsCard } from '@/components/dashboard/stats-card';
import { StockVelocity } from '@/components/dashboard/stock-velocity';
import { InvoicesTable } from '@/components/dashboard/invoices-table';
import { Package, Truck, AlertTriangle, Info, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  // tRPC ile veri çekme (Backend router'daki veriler)
  const stats = trpc.getDashboardStats.useQuery();
  const velocity = trpc.getStockVelocity.useQuery();
  const invoices = trpc.getLatestInvoices.useQuery();

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      
      {/* 1. Başlık Bölümü */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-1"
      >
        <h2 className="text-3xl font-medium tracking-tightest text-slate-950">Executive Overview</h2>
        <p className="text-slate-500 text-sm">Real-time telemetry for active supply chain operations.</p>
      </motion.div>

      {/* 2. İstatistik Kartları (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* 3. Orta Bölüm: Grafik ve Uyarılar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Grafik Alanı (2 birim genişlik) */}
        <div className="lg:col-span-2">
          <StockVelocity data={velocity.data ?? []} />
        </div>
        
        {/* Kritik Uyarılar Alanı (1 birim genişlik) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-white border border-slate-200 rounded-sm flex flex-col shadow-sm"
        >
          <h3 className="text-xl font-medium tracking-tightest mb-6">Critical Alerts</h3>
          
          <div className="space-y-4 flex-1">
            <div className="p-4 border border-red-100 rounded-sm bg-red-50/30 group hover:bg-red-50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-3 h-3 text-red-500 fill-red-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">Part Shortage</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Component AX-772 inventory critically low at Munich facility. Production impact expected within 48h.
              </p>
            </div>

            <div className="p-4 border border-blue-100 rounded-sm bg-blue-50/30 group hover:bg-blue-50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-3 h-3 text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Route Deviation</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Shipment #9921 rerouted due to port congestion. Estimated arrival updated to Oct 28th.
              </p>
            </div>

            <div className="p-4 border border-slate-100 rounded-sm bg-slate-50/50 group hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Compliance Update</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                New customs regulations effective Q3 for APAC regions. Documentation review required.
              </p>
            </div>
          </div>

          <button className="w-full py-3 mt-6 text-[10px] font-bold uppercase tracking-widest border border-slate-200 hover:bg-slate-900 hover:text-white transition-all duration-300">
            View All Intelligence
          </button>
        </motion.div>

      </div>

      <div className="mt-8">
      <InvoicesTable data={invoices.data ?? []} />
    </div>
    </div>
  );
}