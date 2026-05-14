'use client';

import { trpc } from '@/lib/trpc-client';
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, FileText, Clock, CheckCircle2, Truck, XCircle } from "lucide-react";
import { useState } from 'react';

export default function OrdersPage() {
  const ordersQuery = trpc.getOrders.useQuery();
  
  // State Yönetimi
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Veritabanındaki mevcut statüleri dinamik olarak bul
  const statuses = Array.from(new Set(ordersQuery.data?.map((order: any) => order.status?.toLowerCase()).filter(Boolean)));

  // ARAMA VE FİLTRELEME MANTIĞI
  const filteredOrders = ordersQuery.data?.filter((order: any) => {
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.supplierName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus ? order.status?.toLowerCase() === selectedStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  // CSV EXPORT (RAPOR İNDİRME) FONKSİYONU
  const exportToCSV = () => {
    if (!filteredOrders || filteredOrders.length === 0) {
      alert("No data to export.");
      return;
    }

    // CSV Başlıkları
    const headers = ["Order Ref", "Supplier", "Date Issued", "Total Value (USD)", "Status"];
    
    // Satır verilerini formatla
    const csvRows = filteredOrders.map((order: any) => {
      const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US') : 'N/A';
      // Excel virgülleri sütun ayracı sanmasın diye metinleri tırnak içine alıyoruz
      return `"${order.orderNumber}","${order.supplierName || 'Unknown'}","${date}","${order.totalAmount || 0}","${order.status}"`;
    });

    // Başlık ve satırları birleştir
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    
    // İndirme işlemini tetikle
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `MODUL_Orders_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sipariş durumuna göre rozet render eden yardımcı fonksiyon
  const renderStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 rounded-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Approved</span>
          </div>
        );
      case 'pending':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border-2 border-amber-200 text-amber-700 rounded-sm">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Pending</span>
          </div>
        );
      case 'shipped':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border-2 border-blue-200 text-blue-700 rounded-sm">
            <Truck className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Shipped</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border-2 border-slate-300 text-slate-600 rounded-sm">
            <XCircle className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">{status || 'Unknown'}</span>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12 pt-8 relative">
      
      {/* BAŞLIK VE KONTROLLER */}
      <div className="flex justify-between items-end">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <h2 className="text-4xl font-black tracking-tightest text-slate-950 uppercase">Order Control</h2>
          <p className="text-slate-600 text-base font-bold">Centralized procurement and fulfillment tracking.</p>
        </motion.div>

        <div className="flex gap-4 relative">
          
          {/* FİLTRE BUTONU VE AÇILIR MENÜSÜ */}
          <div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-6 py-4 border-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-sm ${selectedStatus ? 'bg-slate-950 text-white border-slate-950' : 'bg-white border-slate-300 text-slate-600 hover:text-slate-950 hover:border-slate-950'}`}
            >
              <Filter className="w-4 h-4" /> 
              {selectedStatus || "Filter Status"}
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white border-2 border-slate-950 shadow-2xl z-20 flex flex-col"
                >
                  <button onClick={() => { setSelectedStatus(null); setIsFilterOpen(false); }} className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest hover:bg-slate-100 border-b-2 border-slate-100 text-slate-500">
                    All Statuses
                  </button>
                  {statuses.map((status: any) => (
                    <button key={status} onClick={() => { setSelectedStatus(status); setIsFilterOpen(false); }} className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest hover:bg-slate-100 text-slate-950">
                      {status}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* EXPORT BUTONU */}
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-6 py-4 bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl active:scale-95"
          >
            <FileText className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* ARAMA ÇUBUĞU */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-950 transition-colors" />
        <input 
          type="text" 
          placeholder="Search by Order ID or Supplier Name..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-16 bg-white border-2 border-slate-300 pl-16 pr-20 text-sm font-black text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-slate-950 shadow-sm transition-all"
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-1.5 opacity-60">
          <kbd className="px-2 py-1.5 text-[10px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-300 rounded-sm">⌘</kbd>
          <kbd className="px-2 py-1.5 text-[10px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-300 rounded-sm">F</kbd>
        </div>
      </div>

      {/* SİPARİŞ TABLOSU (Aynı Kaldı) */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border-2 border-slate-300 rounded-sm shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-950" />
        <table className="w-full text-left border-collapse mt-1">
          <thead>
            <tr className="bg-slate-50 border-b-2 border-slate-300">
              <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Order Ref</th>
              <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Supplier</th>
              <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Date Issued</th>
              <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Total Value</th>
              <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Status</th>
              <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-100">
            {ordersQuery.isLoading ? (
              <tr><td colSpan={6} className="p-12 text-center text-xs font-black uppercase tracking-widest text-slate-400">Syncing Order Network...</td></tr>
            ) : filteredOrders?.length === 0 ? (
              <tr><td colSpan={6} className="p-12 text-center text-xs font-black uppercase tracking-widest text-slate-400">No orders found.</td></tr>
            ) : filteredOrders?.map((order: any) => (
              <tr key={order.id} className="group hover:bg-slate-50 transition-colors">
                <td className="p-6">
                  <span className="text-sm font-mono font-black text-slate-950 bg-slate-100 px-2 py-1 rounded-sm border border-slate-200">{order.orderNumber}</span>
                </td>
                <td className="p-6 font-black text-slate-900 uppercase tracking-tight text-sm">{order.supplierName || 'Unknown Vendor'}</td>
                <td className="p-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                </td>
                <td className="p-6 text-right">
                  <span className="text-sm font-black text-slate-950">${Number(order.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </td>
                <td className="p-6 text-center">{renderStatusBadge(order.status)}</td>
                <td className="p-6 text-right">
                  <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 border-2 border-transparent group-hover:border-slate-300 group-hover:text-slate-950 hover:!border-slate-950 transition-all">
                    View Docs
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}