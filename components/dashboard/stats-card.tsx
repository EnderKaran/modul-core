'use client';

import { motion } from "framer-motion";
import { LucideIcon, ArrowUpRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: string;
  isAlert?: boolean;
}

export function StatsCard({ title, value, description, icon: Icon, trend, isAlert }: StatsCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative p-6 md:p-8 bg-white border-2 ${isAlert ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-slate-300'} rounded-sm flex flex-col justify-between h-48 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 overflow-hidden`}
    >
      {/* Üst Vurgu Çizgisi (Endüstriyel Kart Detayı) */}
      <div className={`absolute top-0 left-0 w-full h-1.5 ${isAlert ? 'bg-red-600' : 'bg-slate-950'} transition-colors`} />

      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
            {title}
          </p>
          <h3 className={`text-4xl md:text-5xl font-black tracking-tightest ${isAlert ? 'text-red-600' : 'text-slate-950'}`}>
            {value}
          </h3>
        </div>
        
        {/* İkon Kutusu - Hover olunca simsiyah olur */}
        <div className={`p-3 rounded-sm border-2 ${isAlert ? 'border-red-200 bg-red-50 text-red-600' : 'border-slate-200 bg-slate-50 text-slate-900 group-hover:border-slate-950 group-hover:bg-slate-950 group-hover:text-white'} transition-all duration-300`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-auto pt-4">
        {trend && (
          <p className="text-[11px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1 mb-1.5">
            <ArrowUpRight className="w-3.5 h-3.5" /> {trend} 
            <span className="font-bold text-slate-400 ml-1 tracking-widest">vs last wk</span>
          </p>
        )}
        <p className={`text-[10px] font-bold uppercase tracking-widest ${isAlert ? 'text-red-500' : 'text-slate-400'}`}>
          {description}
        </p>
      </div>
    </motion.div>
  );
}