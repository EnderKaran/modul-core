'use client';

import { trpc } from '@/lib/trpc-client';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Package, Truck, AlertTriangle } from "lucide-react";

export default function Home() {
  const stats = trpc.getDashboardStats.useQuery();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="space-y-1">
        <h2 className="text-3xl font-medium tracking-tightest">Executive Overview</h2>
        <p className="text-slate-500 text-sm">Real-time telemetry for active supply chain operations.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Active Orders"
          value={stats.data?.activeOrders ?? 0}
          description="Orders currently in production"
          icon={Package}
          trend="+12.5%"
        />
        <StatsCard 
          title="Pending Shipments"
          value={stats.data?.pendingShipments ?? 0}
          description="Requires immediate attention"
          icon={Truck}
        />
        <StatsCard 
          title="Delayed Freight"
          value={stats.data?.delayedFreight ?? 0}
          description="Action Required"
          icon={AlertTriangle}
          isAlert={true}
        />
      </div>

      {/* Buraya bir sonraki adımda grafikler gelecek */}
    </div>
  );
}