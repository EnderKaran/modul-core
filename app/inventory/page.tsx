'use client';

import { trpc } from '@/lib/trpc-client';
import { motion } from "framer-motion";
import { Search, Filter, Box, ArrowDownRight, CheckCircle2 } from "lucide-react";
import { useState } from 'react';

export default function InventoryPage() {
  // Gerçek veritabanından verileri çekiyoruz
  const inventory = trpc.ggetInventory.useQuery();
  const [searchQuery, setSearchQuery] = useState("");

  // Arama filtresi (İsim veya SKU'ya göre)
  const filteredData = inventory.data?.filter((item: any) => 
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12 pt-8">
      
      {/* BAŞLIK VE BUTONLAR */}
      <div className="flex justify-between items-end">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <h2 className="text-4xl font-black tracking-tightest text-slate-950 uppercase">
            Inventory Matrix
          </h2>
          <p className="text-slate-600 text-base font-bold">
            Real-time stock tracking and warehouse allocation.
          </p>
        </motion.div>

        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-4 bg-white border-2 border-slate-300 text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-slate-950 hover:border-slate-950 transition-all shadow-sm">
            <Filter className="w-4 h-4" /> Filter Categories
          </button>
          <button className="flex items-center gap-2 px-6 py-4 bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl active:scale-95">
            <Box className="w-4 h-4" /> Add New SKU
          </button>
        </div>
      </div>

      {/* ARAMA ÇUBUĞU */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-950 transition-colors" />
        <input 
          type="text"
          placeholder="Search by SKU or Material Name..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-16 bg-white border-2 border-slate-300 pl-16 pr-20 text-sm font-black text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-slate-950 shadow-sm transition-all"
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-1.5 opacity-60">
          <kbd className="px-2 py-1.5 text-[10px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-300 rounded-sm">⌘</kbd>
          <kbd className="px-2 py-1.5 text-[10px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-300 rounded-sm">K</kbd>
        </div>
      </div>

      {/* ENVANTER TABLOSU */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-2 border-slate-300 rounded-sm shadow-2xl overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-950" />
        
        <table className="w-full text-left border-collapse mt-1">
          <thead>
            <tr className="bg-slate-50 border-b-2 border-slate-300">
              <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">SKU / Material</th>
              <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Category</th>
              <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Location</th>
              <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Current Stock</th>
              <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Status</th>
              <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-100">
            {inventory.isLoading ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-xs font-black uppercase tracking-widest text-slate-400">
                  Fetching Data from Neon DB...
                </td>
              </tr>
            ) : filteredData?.map((item: any) => {
              
              // Veritabanı isimlendirmesi (safety_stock vs safetyStock) toleransı eklendi
              const safetyLimit = item.safetyStock || item.safety_stock || 0;
              const isLowStock = item.stock <= safetyLimit;

              return (
                <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="p-6">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-950 uppercase">{item.name}</p>
                      <p className="text-[10px] font-mono font-bold text-slate-500">{item.sku}</p>
                    </div>
                  </td>
                  <td className="p-6 text-xs font-bold text-slate-600 uppercase tracking-tight">{item.category || 'N/A'}</td>
                  <td className="p-6 text-xs font-bold text-slate-600 uppercase tracking-tight">{item.location || 'Warehouse'}</td>
                  <td className="p-6 text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className={`text-lg font-black ${isLowStock ? 'text-red-600' : 'text-slate-950'}`}>
                        {item.stock}
                      </span>
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{item.unit || 'UN'}</span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Min: {safetyLimit} {item.unit || 'UN'}
                    </p>
                  </td>
                  <td className="p-6 text-center">
                    {isLowStock ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border-2 border-red-200 text-red-700 rounded-sm">
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Restock Req</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 rounded-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Optimal</span>
                      </div>
                    )}
                  </td>
                  <td className="p-6 text-right">
                    <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 border-2 border-transparent group-hover:border-slate-300 group-hover:text-slate-950 hover:!border-slate-950 transition-all">
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}