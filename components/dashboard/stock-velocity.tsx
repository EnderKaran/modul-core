'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface StockVelocityProps {
  data: any[];
}

export function StockVelocity({ data }: StockVelocityProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-6 bg-white border border-slate-200 rounded-sm h-[400px] flex flex-col"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-medium tracking-tightest">Stock Health Velocity</h3>
        </div>
        <button className="px-3 py-1 text-[10px] font-bold border border-slate-200 rounded-sm uppercase tracking-widest hover:bg-slate-50 transition-colors">
          YTD View
        </button>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748B' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748B' }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip 
              cursor={{ fill: '#F8FAFC' }}
              contentStyle={{ borderRadius: '2px', border: '1px solid #E2E8F0', fontSize: '12px' }}
            />
            <Bar 
              dataKey="velocity" 
              fill="#E2E8F0" 
              activeBar={{ fill: '#94A3B8' }}
              radius={[2, 2, 0, 0]} 
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}