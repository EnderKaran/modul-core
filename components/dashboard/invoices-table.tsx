'use client';

import { motion } from "framer-motion";
import { CheckCircle2, Clock, AlertOctagon } from "lucide-react";

export function InvoicesTable({ data }: { data: any[] }) {
  
  // Endüstriyel Statü Rozetleri
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
        return <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">{status || 'Unknown'}</span>;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-sm overflow-hidden relative"
    >
      {/* Üst Vurgu Çizgisi (Gizli Endüstriyel Detay) */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-950 z-10 hidden md:block" />

      <div className="p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h3 className="text-2xl font-black uppercase tracking-tightest text-slate-950">
          Latest Invoices
        </h3>
        <button className="w-full sm:w-auto px-6 py-3 border-2 border-slate-950 text-slate-950 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-950 hover:text-white transition-all active:scale-95">
          View All Ledger
        </button>
      </div>

      <div className="overflow-x-auto w-full border-t-2 border-slate-100">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-slate-50 border-b-2 border-slate-300">
            <tr>
              {['Invoice ID', 'Date Issued', 'Amount', 'Status'].map((header, index) => (
                <th 
                  key={header} 
                  className={`p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap ${index === 2 ? 'text-right' : ''} ${index === 3 ? 'text-center' : ''}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-100">
            {(!data || data.length === 0) ? (
              <tr>
                <td colSpan={4} className="p-12 text-center text-xs font-black uppercase tracking-widest text-slate-400">
                  No recent financial records found.
                </td>
              </tr>
            ) : (
              data.map((invoice) => (
                <tr key={invoice.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="p-6">
                    <span className="text-sm font-mono font-black text-slate-950 bg-slate-100 px-2 py-1 rounded-sm border border-slate-200 whitespace-nowrap">
                      {invoice.invoiceNumber}
                    </span>
                  </td>
                  <td className="p-6 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </td>
                  <td className="p-6 text-right whitespace-nowrap">
                    <span className="text-base font-black text-slate-950">
                      ${Number(invoice.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    {renderStatusBadge(invoice.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}