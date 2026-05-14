'use client';

import { LayoutDashboard, ShoppingCart, Box, FileText, Factory, Navigation, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Orders', icon: ShoppingCart, href: '/orders' },
  { name: 'Inventory', icon: Box, href: '/inventory' },
  { name: 'Warehouse', icon: Factory, href: '/warehouse' },
  { name: 'Tracking', icon: Navigation, href: '/tracking' },
  { name: 'Invoices', icon: FileText, href: '/invoices' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Menü içeriğini bir değişkene alıyoruz ki hem mobilde hem masaüstünde aynı kodu tekrar yazmayalım
  const SidebarContent = (
    <>
      <div className="p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tightest text-slate-950">MODUL</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Industrial Portal v1.0</p>
        </div>
        {/* Mobilde Kapatma Butonu */}
        <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-slate-400 hover:text-slate-950">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileOpen(false)} // Tıklanınca mobilde menüyü kapat
              className={`flex items-center gap-3 px-4 py-3 text-sm font-black uppercase tracking-widest rounded-sm transition-all border-2 ${
                isActive 
                  ? 'bg-slate-950 text-white border-slate-950 shadow-lg translate-x-1' // Aktif Menü (Yüksek Kontrast)
                  : 'bg-transparent text-slate-500 border-transparent hover:border-slate-300 hover:text-slate-950' // Pasif Menü
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t-2 border-slate-100 bg-slate-50 mt-auto">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 rounded-sm bg-slate-950 flex items-center justify-center text-emerald-400 text-xs font-black shadow-md border border-slate-800">
            EK
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-slate-950 uppercase tracking-tight">Ender Karan</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Administrator</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* MOBİL İÇİN HAMBURGER BUTONU */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white border-b-2 border-slate-200 z-40 px-4 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-black tracking-tightest text-slate-950">MODUL</h1>
        <button onClick={() => setIsMobileOpen(true)} className="p-2 bg-slate-100 rounded-sm text-slate-950 border-2 border-slate-300 active:bg-slate-200">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* MOBİL YARI SAYDAM ARKA PLAN */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR'IN KENDİSİ (Hem Masaüstü Hem Mobil) */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r-2 border-slate-200 flex flex-col h-screen transform transition-transform duration-300 ease-in-out shadow-2xl
        md:sticky md:top-0 md:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {SidebarContent}
      </div>
    </>
  );
}