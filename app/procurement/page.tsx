'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { procurementSchema, type ProcurementInput } from "@/lib/validations/procurement";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronRight, ChevronLeft, X, CheckCircle2 } from "lucide-react";
import { trpc } from '@/lib/trpc-client';
import { useRouter } from 'next/navigation';

const steps = [
  { id: '01', name: 'Material Specs' },
  { id: '02', name: 'Quantity & Lead Time' },
  { id: '03', name: 'Vendor Selection' },
  { id: '04', name: 'Review & Submit' },
];

export default function ProcurementPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const utils = trpc.useUtils(); // Query invalidation için gerekli

  // 1. FORM SETUP
  const form = useForm<ProcurementInput>({
    resolver: zodResolver(procurementSchema),
    defaultValues: { 
      fiberType: "Carbon Fiber T700", 
      arealWeight: 200,
      quantity: 100
    }
  });

  // 2. TRPC MUTATION (Buraya Yapıştırıldı)
  const mutation = trpc.createProcurement.useMutation({
    onSuccess: () => {
      // Dashboard verilerini tazelemek için query'leri geçersiz kılıyoruz
      utils.getDashboardStats.invalidate();
      utils.getLatestInvoices.invalidate();
      // Başarı durumunda ana sayfaya yönlendir
      router.push('/');
    },
    onError: (err) => {
      console.error("Submission failed:", err);
    }
  });

  // 3. SUBMIT HANDLER
  const onSubmit = (data: ProcurementInput) => {
    mutation.mutate(data);
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="flex h-screen bg-slate-50">
      
      {/* SOL PANEL: Request Flow */}
      <div className="w-80 border-r border-slate-300 bg-white p-12 flex flex-col shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
        <div className="space-y-10 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Request Flow</p>
          <nav className="space-y-8">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`flex items-center gap-5 transition-all duration-300 ${currentStep === index + 1 ? 'opacity-100 translate-x-1' : 'opacity-30'}`}
              >
                <span className="text-xs font-mono font-bold text-slate-900">{step.id}</span>
                <span className={`text-sm font-black tracking-tight ${currentStep === index + 1 ? 'text-slate-950' : 'text-slate-600'}`}>
                  {step.name}
                </span>
              </div>
            ))}
          </nav>
        </div>
        
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-sm space-y-4 shadow-2xl">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Procurement ID</p>
            <p className="text-xs font-mono font-black text-white">PRQ-8820-TXT</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Originator</p>
            <p className="text-xs font-bold text-slate-200">System Administrator</p>
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
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-red-600 transition-colors py-2 px-4 border border-transparent hover:border-red-100 hover:bg-red-50 rounded-sm"
          >
            <X className="w-4 h-4" /> Save & Close
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-12 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentStep}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white border-2 border-slate-300 rounded-sm p-14 shadow-2xl space-y-12 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-950" />

                  {/* STEP 1: MATERIAL SPECS */}
                  {currentStep === 1 && (
                    <div className="space-y-12">
                      <div>
                        <h2 className="text-4xl font-black tracking-tightest mb-3 text-slate-950 uppercase">Material Specifications</h2>
                        <p className="text-slate-600 text-base font-medium">Define technical parameters for the required raw material.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-3">
                          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Fiber Type *</label>
                          <input {...form.register("fiberType")} className="w-full h-14 border-2 border-slate-200 px-5 text-sm font-bold focus:border-slate-950 bg-white" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Thread Count</label>
                          <input {...form.register("threadCount")} placeholder="e.g. 12 x 12" className="w-full h-14 border-2 border-slate-200 px-5 text-sm font-bold focus:border-slate-950 bg-white" />
                        </div>
                        <div className="space-y-3 col-span-2">
                          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Areal Weight (GSM) *</label>
                          <div className="flex">
                            <input type="number" {...form.register("arealWeight", { valueAsNumber: true })} className="flex-1 h-14 border-2 border-slate-200 px-5 text-sm font-bold focus:border-slate-950" />
                            <div className="w-20 h-14 bg-slate-950 border-2 border-l-0 border-slate-950 flex items-center justify-center text-[10px] font-black text-white uppercase tracking-widest">g/m²</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: QUANTITY & LEAD TIME */}
                  {currentStep === 2 && (
                    <div className="space-y-12">
                      <div>
                        <h2 className="text-4xl font-black tracking-tightest mb-3 text-slate-950 uppercase">Quantity & Lead Time</h2>
                        <p className="text-slate-600 text-base font-medium">Specify required volume and delivery deadline.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-3">
                          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Order Quantity *</label>
                          <div className="flex">
                            <input type="number" {...form.register("quantity", { valueAsNumber: true })} className="flex-1 h-14 border-2 border-slate-200 px-5 text-sm font-bold focus:border-slate-950" />
                            <div className="w-20 h-14 bg-slate-100 border-2 border-l-0 border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Units</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Delivery Date *</label>
                          <input type="date" {...form.register("leadTime", { valueAsDate: true })} className="w-full h-14 border-2 border-slate-200 px-5 text-sm font-bold focus:border-slate-950 bg-white" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3 & 4 (Placeholder Logic) */}
                  {currentStep >= 3 && (
                    <div className="space-y-12 py-10 text-center">
                      <div className="flex justify-center">
                        <CheckCircle2 className="w-20 h-20 text-slate-950" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black uppercase tracking-tightest text-slate-950">Ready for Submission</h2>
                        <p className="text-slate-500 mt-2 font-medium">Review your data and confirm the industrial procurement request.</p>
                      </div>
                    </div>
                  )}

                  {/* NAVIGATION FOOTER */}
                  <div className="pt-12 border-t-2 border-slate-100 flex justify-between items-center">
                    <button 
                      type="button"
                      onClick={prevStep}
                      className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-950 transition-colors ${currentStep === 1 ? 'invisible' : ''}`}
                    >
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    
                    {currentStep < 4 ? (
                      <button 
                        type="button"
                        onClick={nextStep}
                        className="flex items-center gap-3 bg-slate-950 text-white px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl"
                      >
                        Next Step <ChevronRight className="w-5 h-5" />
                      </button>
                    ) : (
                      <button 
                        type="submit"
                        disabled={mutation.isPending}
                        className="flex items-center gap-3 bg-slate-950 text-white px-12 py-6 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl disabled:opacity-50"
                      >
                        {mutation.isPending ? "Processing..." : "Confirm & Push to Dashboard"}
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}