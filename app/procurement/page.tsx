'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { procurementSchema, type ProcurementInput } from "@/lib/validations/procurement";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronRight, ChevronLeft, X, AlertCircle } from "lucide-react";
import { trpc } from '@/lib/trpc-client';
import { useRouter } from 'next/navigation';

const steps = [
  { id: '01', name: 'Material Specs' },
  { id: '02', name: 'Quantity & Lead Time' },
  { id: '03', name: 'Vendor Selection' },
  { id: '04', name: 'Review & Submit' },
];

// Veritabanı boşsa gösterilecek örnek tedarikçiler
const mockVendors = [
  { id: 101, name: "Kordsa Teknik Tekstil", sector: "Advanced Materials", location: "Istanbul, TR" },
  { id: 102, name: "BOSCH Sanayi", sector: "Automotive Components", location: "Bursa, TR" },
  { id: 103, name: "Gestamp Auto", sector: "Chassis & Body", location: "Kocaeli, TR" }
];

export default function ProcurementPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<any>({
    resolver: zodResolver(procurementSchema),
    defaultValues: { 
      fiberType: "Carbon Fiber T700", 
      arealWeight: 200,
      quantity: 100
    }
  });

  const { errors } = form.formState; 
  const vendors = trpc.getVendors.useQuery();
  const selectedVendorId = form.watch("vendorId");
  const formData = form.watch();

  // Eğer veritabanından veri gelmezse mock verileri kullan
  const displayVendors = (vendors.data && vendors.data.length > 0) ? vendors.data : mockVendors;

  const mutation = trpc.createProcurement.useMutation({
    onSuccess: () => {
      utils.getDashboardStats.invalidate();
      utils.getLatestInvoices.invalidate();
      router.push('/');
    },
    onError: (err) => {
      console.error("Mutation Hatası:", err);
    }
  });

  const onSubmit = (data: ProcurementInput) => {
    mutation.mutate(data);
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof ProcurementInput)[] = [];
    
    if (currentStep === 1) fieldsToValidate = ['fiberType', 'arealWeight'];
    if (currentStep === 2) fieldsToValidate = ['quantity', 'leadTime'];
    if (currentStep === 3) fieldsToValidate = ['vendorId']; 
    
    const isStepValid = await form.trigger(fieldsToValidate);
    
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="flex h-screen bg-slate-50">
      
      {/* SOL PANEL */}
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
        </div>
      </div>

      {/* SAĞ PANEL: Form Alanı */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 border-b border-slate-300 bg-white px-10 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 bg-slate-950 rounded-sm flex items-center justify-center text-white shadow-lg">
              <span className="font-black text-lg">M</span>
            </div>
            <h1 className="text-xl font-black tracking-tightest text-slate-950 uppercase">MODUL-Ops</h1>
          </div>
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-red-600 transition-colors py-2 px-4 border border-transparent hover:border-red-100 hover:bg-red-50 rounded-sm">
            <X className="w-4 h-4" /> Save & Close
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-12 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            
            <form onSubmit={form.handleSubmit(onSubmit, (err) => console.error("Kayıt Engellendi. Hatalar:", err))} className="space-y-10">
              
              <input type="hidden" {...form.register("vendorId", { valueAsNumber: true })} />

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
                      </div>
                      <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-3">
                          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Fiber Type *</label>
                          <input {...form.register("fiberType")} className={`w-full h-14 border-2 px-5 text-sm font-black bg-white text-slate-950 focus:outline-none ${errors.fiberType ? 'border-red-500' : 'border-slate-300 focus:border-slate-950'}`} />
                        </div>
                        <div className="space-y-3 col-span-2">
                          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Areal Weight (GSM) *</label>
                          <div className="flex">
                            <input type="number" {...form.register("arealWeight", { valueAsNumber: true })} className={`flex-1 h-14 border-2 border-r-0 px-5 text-sm font-black text-slate-950 focus:outline-none ${errors.arealWeight ? 'border-red-500' : 'border-slate-300 focus:border-slate-950'}`} />
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
                        <h2 className="text-4xl font-black tracking-tightest mb-3 text-slate-950 uppercase">Quantity & Logistics</h2>
                      </div>
                      <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-3">
                          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Order Quantity *</label>
                          <div className="flex">
                            <input type="number" {...form.register("quantity", { valueAsNumber: true })} className={`flex-1 h-14 border-2 border-r-0 px-5 text-sm font-black text-slate-950 focus:outline-none ${errors.quantity ? 'border-red-500' : 'border-slate-300 focus:border-slate-950'}`} />
                            <div className="w-20 h-14 bg-slate-200 border-2 border-l-0 border-slate-300 flex items-center justify-center text-[10px] font-black text-slate-900 uppercase tracking-widest">Units</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Delivery Date *</label>
                          <input type="date" {...form.register("leadTime", { valueAsDate: true })} className={`w-full h-14 border-2 px-5 text-sm font-black bg-white text-slate-950 focus:outline-none ${errors.leadTime ? 'border-red-500' : 'border-slate-300 focus:border-slate-950'}`} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: VENDOR SELECTION */}
                  {currentStep === 3 && (
                    <div className="space-y-10">
                      <div>
                        <h2 className="text-4xl font-black tracking-tightest mb-3 text-slate-950 uppercase">Vendor Selection</h2>
                      </div>
                      <div className={`border-2 rounded-sm overflow-hidden bg-white shadow-xl ${errors.vendorId ? 'border-red-500' : 'border-slate-300'}`}>
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-950 text-white">
                              <th className="p-5 text-[11px] font-black uppercase tracking-[0.2em]">Supplier</th>
                              <th className="p-5 text-[11px] font-black uppercase tracking-[0.2em]">Sector</th>
                              <th className="p-5 text-[11px] font-black uppercase tracking-[0.2em] text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y-2 divide-slate-100">
                            {/* displayVendors kullanılıyor */}
                            {displayVendors.map((vendor: any) => (
                              <tr key={vendor.id} className="group hover:bg-slate-50 cursor-pointer" onClick={() => form.setValue("vendorId", vendor.id, { shouldValidate: true })}>
                                <td className="p-6 font-black text-slate-950 uppercase text-sm">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${selectedVendorId === vendor.id ? 'bg-slate-950' : 'bg-transparent border border-slate-300'}`} />
                                    {vendor.name}
                                  </div>
                                </td>
                                <td className="p-6 text-xs font-bold text-slate-500 uppercase">{vendor.sector}</td>
                                <td className="p-6 text-right">
                                  <button type="button" className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 transition-all ${selectedVendorId === vendor.id ? 'bg-slate-950 text-white border-slate-950' : 'border-slate-200 text-slate-400 group-hover:border-slate-950 group-hover:text-slate-950'}`}>
                                    {selectedVendorId === vendor.id ? 'Selected' : 'Select'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {errors.vendorId && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.vendorId.message?.toString()}</p>}
                    </div>
                  )}

                  {/* STEP 4: FINAL REVIEW */}
                  {currentStep === 4 && (
                    <div className="space-y-12">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-4xl font-black tracking-tightest mb-3 text-slate-950 uppercase">Final Review</h2>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1 border-2 border-slate-300 bg-slate-300">
                        <div className="bg-white p-8 space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Material</p>
                          <p className="text-sm font-black text-slate-950 uppercase">{formData.fiberType}</p>
                        </div>
                        <div className="bg-white p-8 space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quantity</p>
                          <p className="text-sm font-black text-slate-950 uppercase">{formData.quantity} Units</p>
                        </div>
                        <div className="bg-white p-8 space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Date</p>
                          <p className="text-sm font-black text-slate-950 uppercase">{formData.leadTime ? new Date(formData.leadTime).toLocaleDateString() : 'Not Set'}</p>
                        </div>
                        <div className="bg-white p-8 space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vendor ID</p>
                          <p className="text-sm font-black text-slate-950 uppercase">#{formData.vendorId}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* NAVIGATION FOOTER */}
                  <div className="pt-12 border-t-2 border-slate-100 flex justify-between items-center">
                    <button type="button" onClick={prevStep} className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-950 transition-colors ${currentStep === 1 ? 'invisible' : ''}`}>
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    
                    {currentStep < 4 ? (
                      <button type="button" onClick={nextStep} className="flex items-center gap-3 bg-slate-950 text-white px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                        Next Step <ChevronRight className="w-5 h-5" />
                      </button>
                    ) : (
                      <button type="submit" disabled={mutation.isPending} className="flex items-center gap-3 bg-slate-950 text-white px-12 py-6 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl disabled:opacity-50 active:scale-95">
                        {mutation.isPending ? "Processing..." : "Authorize & Commit"}
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