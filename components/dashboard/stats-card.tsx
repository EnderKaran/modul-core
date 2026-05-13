'use client';

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

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
      className={`p-6 bg-white border ${isAlert ? 'border-red-200 bg-red-50/30' : 'border-slate-200'} rounded-sm flex flex-col justify-between h-48`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</p>
          <h3 className="text-4xl font-medium tracking-tightest">{value}</h3>
        </div>
        <Icon className={`w-5 h-5 ${isAlert ? 'text-red-500' : 'text-slate-400'}`} />
      </div>

      <div className="mt-auto">
        {trend && (
          <p className="text-xs font-semibold text-slate-900 mb-1">
            ↑ {trend} <span className="font-normal text-slate-500 ml-1">from last week</span>
          </p>
        )}
        <p className={`text-xs ${isAlert ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
          {description}
        </p>
      </div>
    </motion.div>
  );
}