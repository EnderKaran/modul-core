'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { procurementSchema, type ProcurementInput } from "@/lib/validations/procurement";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronRight, X } from "lucide-react";

const steps = [
  { id: '01', name: 'Material Specs' },
  { id: '02', name: 'Quantity & Lead Time' },
  { id: '03', name: 'Vendor Selection' },
  { id: '04', name: 'Review & Submit' },
];

export default function ProcurementPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<ProcurementInput>({
    resolver: zodResolver(procurementSchema),
    defaultValues: { fiberType: "Carbon Fiber T700", arealWeight: 200 }
  });

  return (
    <div className="flex h-screen bg-slate-50"> {/* Arka planı hafif gri yaparak kartı öne çıkardık */}
      
      {/* SOL PANEL: Request Flow */}
      <div className="w-80 border-r border-slate-300 bg-white p-12 flex flex-col shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
        <div className="space-y-10 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Request Flow</p>
          <nav className="space-y-8">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`flex items-center gap-5 transition-all duration-300 ${currentStep === index + 1 ? 'opacity-100 translate-x-1' : 'opacity-30'}`}
              >
                <span className="text-xs font-mono font-bold text-slate-900">{step.id}</span>
                <span className={`text-sm font-bold tracking-tight ${currentStep === index + 1 ? 'text-slate-900' : 'text-slate-600'}`}>
                  {step.name}
                </span>
              </div>
            ))}
          </nav>
        </div>
        
        {/* PROCUREMENT ID */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-sm space-y-4 shadow-sm">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Procurement ID</p>
            <p className="text-xs font-mono font-black text-slate-900">PRQ-8820-TXT</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Originator</p>
            <p className="text-xs font-bold text-slate-800">System Administrator</p>
          </div>
        </div>
      </div>

      {/* SAĞ PANEL: Form Alanı */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 border-b border-slate-300 bg-white px-10 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-950 rounded-sm flex items-center justify-center text-white shadow-lg">
              <span className="font-black text-lg">M</span>
            </div>
            <h1 className="text-xl font-black tracking-tightest text-slate-950 uppercase">MODUL-Ops</h1>
          </div>
          <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 hover:text-red-600 transition-colors py-2 px-4 border border-transparent hover:border-red-100 hover:bg-red-50 rounded-sm">
            <X className="w-4 h-4" /> Save & Close
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-12 bg-slate-50">
          <div className="max-w-3xl mx-auto space-y-10">
            
            {/* SEARCH BAR (Kontrast artırıldı) */}
            <div className="relative group">
              <input 
                placeholder="Quick Add: Search SKU or paste raw material specs..." 
                className="w-full h-16 bg-white border-2 border-slate-200 px-8 pr-20 text-sm rounded-sm focus:outline-none focus:border-slate-950 shadow-subtle transition-all placeholder:text-slate-400 text-slate-900"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-1.5 opacity-60 group-focus-within:opacity-100">
                <kbd className="px-2 py-1.5 text-[10px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-300 rounded-sm shadow-sm">⌘</kbd>
                <kbd className="px-2 py-1.5 text-[10px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-300 rounded-sm shadow-sm">K</kbd>
              </div>
            </div>

            {/* FORM CONTENT (Kart daha belirgin hale getirildi) */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white border border-slate-300 rounded-sm p-14 shadow-xl space-y-14 relative overflow-hidden"
              >
                {/* Estetik dokunuş: Üstte ince bir vurgu çizgisi */}
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-950" />

                <div>
                  <h2 className="text-4xl font-black tracking-tightest mb-3 text-slate-950">Material Specifications</h2>
                  <p className="text-slate-600 text-base font-medium">Define the technical parameters for the required raw material.</p>
                </div>

                {/* Form Alanları (Grid ve Inputlar güçlendirildi) */}
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Fiber Type *</label>
                    <input 
                      {...form.register("fiberType")} 
                      className="w-full h-14 border-2 border-slate-200 px-5 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-950 bg-white transition-colors" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Thread Count (EPI X PPI)</label>
                    <input 
                      {...form.register("threadCount")} 
                      placeholder="e.g. 12 x 12" 
                      className="w-full h-14 border-2 border-slate-200 px-5 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-950 bg-white transition-colors" 
                    />
                  </div>
                  <div className="space-y-3 col-span-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Areal Weight (GSM) *</label>
                    <div className="flex shadow-sm">
                      <input 
                        type="number" 
                        {...form.register("arealWeight")} 
                        className="flex-1 h-14 border-2 border-slate-200 px-5 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-950" 
                      />
                      <div className="w-20 h-14 bg-slate-950 border-2 border-l-0 border-slate-950 flex items-center justify-center text-[10px] font-black text-white uppercase tracking-widest">
                        g/m²
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-12 border-t-2 border-slate-100 flex justify-between items-center">
                  <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-950 transition-colors">Clear Fields</button>
                  <button 
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="flex items-center gap-3 bg-slate-950 text-white px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                  >
                    Next Step <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}