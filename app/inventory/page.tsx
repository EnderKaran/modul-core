'use client';

import { trpc } from '@/lib/trpc-client';
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Box, ArrowDownRight, CheckCircle2, X } from "lucide-react";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Yeni SKU ekleme formu için Zod şeması
const addSkuSchema = z.object({
  sku: z.string().min(1, "SKU required"),
  name: z.string().min(1, "Name required"),
  category: z.string().min(1, "Category required"),
  stock: z.number().min(0),
  unit: z.string().min(1),
  safetyStock: z.number().min(0),
  location: z.string().min(1),
});

export default function InventoryPage() {
  const utils = trpc.useUtils();
  const inventory = trpc.ggetInventory.useQuery();
  
  // State Yönetimi
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form Kurulumu
  const form = useForm<z.infer<typeof addSkuSchema>>({
    resolver: zodResolver(addSkuSchema),
    defaultValues: { stock: 0, safetyStock: 0, unit: "UN" }
  });

  // SKU Ekleme Mutasyonu
  const addMutation = trpc.addInventoryItem.useMutation({
  onSuccess: () => {
    utils.ggetInventory.invalidate();
    setIsAddModalOpen(false);
    form.reset();
    alert("Material successfully registered."); // Başarı bildirimi
  },
  onError: (err) => {
    // Sunucu tarafında bir hata olursa (örn: DB bağlantısı, SKU çakışması)
    console.error("Database Error:", err);
    alert(`Server Error: ${err.message}`);
  }
});

  const onSubmit = (data: z.infer<typeof addSkuSchema>) => {
  console.log("Form verisi gönderiliyor:", data);
  addMutation.mutate(data);
};

// Formun neden gitmediğini konsolda görmek için:
const onFormError = (errors: any) => {
  console.log("Form Doğrulama Hataları:", errors);
};

  // Dinamik Kategorileri Çek (Veritabanındaki mevcut kategorilerden benzersiz olanları bulur)
  const categories = Array.from(new Set(inventory.data?.map((item: any) => item.category).filter(Boolean)));

  // Arama VE Kategori Filtresini Uygula
  const filteredData = inventory.data?.filter((item: any) => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12 pt-8 relative">
      
      {/* BAŞLIK VE BUTONLAR */}
      <div className="flex justify-between items-end">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <h2 className="text-4xl font-black tracking-tightest text-slate-950 uppercase">Inventory Matrix</h2>
          <p className="text-slate-600 text-base font-bold">Real-time stock tracking and warehouse allocation.</p>
        </motion.div>

        <div className="flex gap-4 relative">
          
          {/* FİLTRE BUTONU VE AÇILIR MENÜSÜ */}
          <div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-6 py-4 border-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-sm ${selectedCategory ? 'bg-slate-950 text-white border-slate-950' : 'bg-white border-slate-300 text-slate-600 hover:text-slate-950 hover:border-slate-950'}`}
            >
              <Filter className="w-4 h-4" /> 
              {selectedCategory || "Filter Categories"}
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-56 bg-white border-2 border-slate-950 shadow-2xl z-20 flex flex-col"
                >
                  <button onClick={() => { setSelectedCategory(null); setIsFilterOpen(false); }} className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest hover:bg-slate-100 border-b-2 border-slate-100 text-slate-500">
                    All Categories
                  </button>
                  {categories.map((cat: any) => (
                    <button key={cat} onClick={() => { setSelectedCategory(cat); setIsFilterOpen(false); }} className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest hover:bg-slate-100 text-slate-950">
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* YENİ EKLENEN ADD SKU BUTONU */}
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-6 py-4 bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl active:scale-95">
            <Box className="w-4 h-4" /> Add New SKU
          </button>
        </div>
      </div>

      {/* ARAMA ÇUBUĞU */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-950 transition-colors" />
        <input 
          type="text" placeholder="Search by SKU or Material Name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-16 bg-white border-2 border-slate-300 pl-16 pr-20 text-sm font-black text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-slate-950 shadow-sm transition-all"
        />
      </div>

      {/* ENVANTER TABLOSU (Aynı kaldı) */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border-2 border-slate-300 rounded-sm shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-950" />
        <table className="w-full text-left border-collapse mt-1">
          <thead>
            <tr className="bg-slate-50 border-b-2 border-slate-300">
              <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">SKU / Material</th>
              <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Category</th>
              <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Location</th>
              <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Current Stock</th>
              <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-100">
            {inventory.isLoading ? (
              <tr><td colSpan={5} className="p-12 text-center text-xs font-black uppercase tracking-widest text-slate-400">Fetching Data...</td></tr>
            ) : filteredData?.map((item: any) => {
              const safetyLimit = item.safetyStock || item.safety_stock || 0;
              const isLowStock = item.stock <= safetyLimit;
              return (
                <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="p-6">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-950 uppercase">{item.name}</p>
                      <p className="text-[10px] font-mono font-bold text-slate-500">{item.sku}</p>
                    </div>
                  </td>
                  <td className="p-6 text-xs font-bold text-slate-600 uppercase tracking-tight">{item.category}</td>
                  <td className="p-6 text-xs font-bold text-slate-600 uppercase tracking-tight">{item.location}</td>
                  <td className="p-6 text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className={`text-lg font-black ${isLowStock ? 'text-red-600' : 'text-slate-950'}`}>{item.stock}</span>
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{item.unit}</span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Min: {safetyLimit} {item.unit}</p>
                  </td>
                  <td className="p-6 text-center">
                    {isLowStock ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border-2 border-red-200 text-red-700 rounded-sm"><ArrowDownRight className="w-3.5 h-3.5" /><span className="text-[10px] font-black uppercase tracking-widest">Restock Req</span></div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 rounded-sm"><CheckCircle2 className="w-3.5 h-3.5" /><span className="text-[10px] font-black uppercase tracking-widest">Optimal</span></div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>

      {/* YENİ: ADD SKU MODAL (POPUP) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-slate-300 shadow-2xl w-full max-w-2xl relative"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-950" />
              <div className="flex justify-between items-center p-8 border-b-2 border-slate-100">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tightest text-slate-950">Add New Material</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Register a new SKU to the warehouse</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-red-600 transition-colors"><X className="w-6 h-6" /></button>
              </div>

             {/* Form etiketini şu şekilde güncelle: */}
<form onSubmit={form.handleSubmit(onSubmit, onFormError)} className="p-8 space-y-8 bg-slate-50">
  <div className="grid grid-cols-2 gap-6">
    
    {/* SKU Code */}
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">SKU Code *</label>
      <input 
        {...form.register("sku")} 
        className={`w-full h-12 border-2 px-4 text-sm font-black text-slate-950 bg-white focus:outline-none ${form.formState.errors.sku ? 'border-red-500' : 'border-slate-300 focus:border-slate-950'}`}
        placeholder="e.g. MTR-001"
      />
      {form.formState.errors.sku && <p className="text-red-500 text-[10px] font-bold uppercase">{form.formState.errors.sku.message}</p>}
    </div>

    {/* Material Name */}
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Material Name *</label>
      <input 
        {...form.register("name")} 
        className={`w-full h-12 border-2 px-4 text-sm font-black text-slate-950 bg-white focus:outline-none ${form.formState.errors.name ? 'border-red-500' : 'border-slate-300 focus:border-slate-950'}`}
        placeholder="e.g. Titanium Alloy"
      />
      {form.formState.errors.name && <p className="text-red-500 text-[10px] font-bold uppercase">{form.formState.errors.name.message}</p>}
    </div>

    {/* Category */}
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Category *</label>
      <input 
        {...form.register("category")} 
        className={`w-full h-12 border-2 px-4 text-sm font-black text-slate-950 bg-white focus:outline-none ${form.formState.errors.category ? 'border-red-500' : 'border-slate-300 focus:border-slate-950'}`}
        placeholder="e.g. Raw Material"
      />
      {form.formState.errors.category && <p className="text-red-500 text-[10px] font-bold uppercase">{form.formState.errors.category.message}</p>}
    </div>

    {/* Warehouse Loc */}
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Warehouse Loc *</label>
      <input 
        {...form.register("location")} 
        className={`w-full h-12 border-2 px-4 text-sm font-black text-slate-950 bg-white focus:outline-none ${form.formState.errors.location ? 'border-red-500' : 'border-slate-300 focus:border-slate-950'}`}
        placeholder="e.g. Sector-A"
      />
      {form.formState.errors.location && <p className="text-red-500 text-[10px] font-bold uppercase">{form.formState.errors.location.message}</p>}
    </div>

    {/* Alt taraftaki Stock/Safety/Unit alanları için de aynı error yapılarını ekle... */}
  </div>

  <div className="flex justify-end pt-4">
    <button type="submit" disabled={addMutation.isPending} className="bg-slate-950 text-white px-10 py-4 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl active:scale-95 disabled:opacity-50">
      {addMutation.isPending ? "Syncing..." : "Register to Database"}
    </button>
  </div>
</form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}