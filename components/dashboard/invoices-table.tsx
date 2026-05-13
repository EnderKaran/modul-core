'use client';

import { motion } from "framer-motion";

interface Invoice {
  id: number;
  invoiceNumber: string;
  dueDate: Date;
  amount: string;
  status: 'paid' | 'pending' | 'overdue';
}

export function InvoicesTable({ data }: { data: any[] }) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'pending': return 'bg-slate-50 text-slate-600 border-slate-100';
      case 'overdue': return 'bg-red-50 text-red-700 border-red-100';
      default: return '';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm"
    >
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-xl font-medium tracking-tightest">Latest Invoices</h3>
        <button className="px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              {['Invoice ID', 'Date', 'Amount', 'Status'].map((header) => (
                <th key={header} className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{invoice.invoiceNumber}</td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                  ${parseFloat(invoice.amount).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${getStatusStyle(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}