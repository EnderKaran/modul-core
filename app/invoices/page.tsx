'use client';

import { trpc } from '@/lib/trpc-client';
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Download, DollarSign, CheckCircle2, Clock, AlertOctagon } from "lucide-react";
import { useState } from 'react';

export default function InvoicesPage() {
  const invoicesQuery = trpc.getInvoices.useQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filtreleme Mantığı
  const filteredInvoices = invoicesQuery.data?.filter((invoice: any) => {
    const matchesSearch = 
      invoice.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      invoice.supplierName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus ? invoice.status?.toLowerCase() === selectedStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  // Finansal Özet Hesaplamaları
  const totalOutstanding = filteredInvoices
    ?.filter((i: any) => i.status === 'pending' || i.status === 'overdue')
    .reduce((sum: number, i: any) => sum + Number(i.amount || 0), 0) || 0;

  // Statü Rozetleri
  const renderStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 rounded-sm whitespace-nowrap">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Paid</span>
          </div>
        );
      case 'pending':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border-2 border-amber-200 text-amber-700 rounded-sm whitespace-nowrap">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Pending</span>
          </div>
        );
      case 'overdue':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border-2 border-red-200 text-red-700 rounded-sm whitespace-nowrap">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Overdue</span>
          </div>
        );
      default:
        return <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 md:space-y-10 pb-12 pt-6 md:pt-8 relative px-4 lg:px-0 print:p-0 print:m-0">
      
      {/* BAŞLIK VE KONTROLLER (Responsive Flex) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0 print:hidden">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black tracking-tightest text-slate-950 uppercase">Financial Ledger</h2>
          <p className="text-slate-600 text-sm md:text-base font-bold">Accounts payable and invoice settlement tracking.</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* FİLTRE BUTONU */}
          <div className="relative w-full sm:w-auto">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-4 border-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-sm ${selectedStatus ? 'bg-slate-950 text-white border-slate-950' : 'bg-white border-slate-300 text-slate-600 hover:text-slate-950 hover:border-slate-950'}`}
            >
              <Filter className="w-4 h-4" /> {selectedStatus || "Filter Status"}
            </button>
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 md:right-0 md:left-auto mt-2 w-full sm:w-48 bg-white border-2 border-slate-950 shadow-2xl z-20 flex flex-col">
                  <button onClick={() => { setSelectedStatus(null); setIsFilterOpen(false); }} className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest hover:bg-slate-100 border-b-2 border-slate-100 text-slate-500">All Statuses</button>
                  <button onClick={() => { setSelectedStatus('paid'); setIsFilterOpen(false); }} className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest hover:bg-slate-100 text-emerald-700">Paid</button>
                  <button onClick={() => { setSelectedStatus('pending'); setIsFilterOpen(false); }} className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest hover:bg-slate-100 text-amber-700">Pending</button>
                  <button onClick={() => { setSelectedStatus('overdue'); setIsFilterOpen(false); }} className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest hover:bg-slate-100 text-red-700">Overdue</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PDF YAZDIRMA BUTONU */}
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-4 bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl active:scale-95"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* FİNANSAL ÖZET KARTI (Mobilde flex-col yapısı eklendi) */}
      <div className="bg-slate-950 text-white p-6 md:p-8 border-2 border-slate-950 rounded-sm shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 print:hidden">
        <div>
          <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Total Outstanding Balance</p>
          <div className="flex items-center gap-2 md:gap-3">
            <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
            <h3 className="text-3xl md:text-4xl font-black tracking-tightest">${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-[10px] md:text-xs font-bold text-slate-400">Filtered Invoices: <span className="text-white">{filteredInvoices?.length || 0}</span></p>
        </div>
      </div>

      {/* ARAMA ÇUBUĞU */}
      <div className="relative group print:hidden">
        <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-950 transition-colors" />
        <input 
          type="text" placeholder="Search Invoice No or Supplier..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-14 md:h-16 bg-white border-2 border-slate-300 pl-12 md:pl-16 pr-4 md:pr-20 text-sm font-black text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-slate-950 shadow-sm transition-all"
        />
      </div>

      {/* FATURA TABLOSU (Yatay Kaydırma Eklendi) */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border-2 border-slate-300 rounded-sm shadow-2xl overflow-hidden relative print:border-none print:shadow-none">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-950 print:hidden z-10" />
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse mt-1 min-w-[900px] print:min-w-0">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-300 print:bg-transparent print:border-slate-950">
                <th className="p-4 md:p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 print:text-slate-950 whitespace-nowrap">Invoice No</th>
                <th className="p-4 md:p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 print:text-slate-950 whitespace-nowrap">Supplier</th>
                <th className="p-4 md:p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 print:text-slate-950 whitespace-nowrap">Linked Order</th>
                <th className="p-4 md:p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 print:text-slate-950 whitespace-nowrap">Due Date</th>
                <th className="p-4 md:p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 text-right print:text-slate-950 whitespace-nowrap">Amount</th>
                <th className="p-4 md:p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 text-center print:text-slate-950 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 print:divide-slate-300">
              {invoicesQuery.isLoading ? (
                <tr><td colSpan={6} className="p-8 md:p-12 text-center text-xs font-black uppercase tracking-widest text-slate-400">Loading Financial Records...</td></tr>
              ) : filteredInvoices?.length === 0 ? (
                <tr><td colSpan={6} className="p-8 md:p-12 text-center text-xs font-black uppercase tracking-widest text-slate-400">No invoices found.</td></tr>
              ) : filteredInvoices?.map((invoice: any) => (
                <tr key={invoice.id} className="group hover:bg-slate-50 transition-colors print:hover:bg-transparent">
                  <td className="p-4 md:p-6">
                    <span className="text-xs md:text-sm font-mono font-black text-slate-950 whitespace-nowrap">{invoice.invoiceNumber}</span>
                  </td>
                  <td className="p-4 md:p-6 font-black text-slate-900 uppercase tracking-tight text-xs md:text-sm whitespace-nowrap">{invoice.supplierName || 'Unknown Vendor'}</td>
                  <td className="p-4 md:p-6 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">#{invoice.orderNumber || 'N/A'}</td>
                  <td className="p-4 md:p-6 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Upon Receipt'}
                  </td>
                  <td className="p-4 md:p-6 text-right">
                    <span className="text-xs md:text-sm font-black text-slate-950 whitespace-nowrap">${Number(invoice.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </td>
                  <td className="p-4 md:p-6 text-center">{renderStatusBadge(invoice.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}