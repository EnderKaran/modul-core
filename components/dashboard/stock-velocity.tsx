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
      className="relative p-6 md:p-8 bg-white border-2 border-slate-300 rounded-sm h-[400px] flex flex-col shadow-xl"
    >
      {/* Üst Vurgu Çizgisi */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-950 z-10 hidden md:block" />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tightest text-slate-950">
            Stock Velocity
          </h3>
        </div>
        <button className="px-4 py-2 border-2 border-slate-950 text-slate-950 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-950 hover:text-white transition-all active:scale-95">
          YTD View
        </button>
      </div>

      <div className="flex-1 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#64748B', fontWeight: 900, fontFamily: 'monospace' }} 
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#64748B', fontWeight: 900, fontFamily: 'monospace' }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip 
              cursor={{ fill: '#F1F5F9' }} // Hover yapılan sütunun arkasındaki hafif gri vurgu
              contentStyle={{ 
                backgroundColor: '#0f172a', // slate-950
                border: 'none', 
                borderRadius: '2px', 
                color: '#f8fafc', // slate-50
                fontSize: '11px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '12px'
              }}
              itemStyle={{ color: '#10b981' }} // Rakamların Zümrüt Yeşili olması
            />
            <Bar 
              dataKey="velocity" 
              fill="#0f172a" // Ana barlar Simsiyah (slate-950)
              activeBar={{ fill: '#10b981' }} // Hover olunca Zümrüt Yeşili parlar
              radius={[0, 0, 0, 0]} // Yuvarlaklık tamamen kaldırıldı, keskin hatlı
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}