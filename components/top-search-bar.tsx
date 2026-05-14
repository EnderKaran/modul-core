'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Command, ShoppingCart, Box, FileText, Factory, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function TopSearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Klavye Kısayolu (Cmd+K veya Ctrl+K) Dinleyicisi
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Hızlı Menü Bağlantıları
  const quickLinks = [
    { name: 'Go to Orders', icon: ShoppingCart, href: '/orders', shortcut: 'O' },
    { name: 'Go to Inventory', icon: Box, href: '/inventory', shortcut: 'I' },
    { name: 'Go to Warehouse Twin', icon: Factory, href: '/warehouse', shortcut: 'W' },
    { name: 'Live Freight Tracking', icon: Navigation, href: '/tracking', shortcut: 'T' },
    { name: 'Financial Ledger', icon: FileText, href: '/invoices', shortcut: 'F' },
  ];

  // Arama sonucunda filtrelenen linkler
  const filteredLinks = quickLinks.filter(link => 
    link.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleNavigate = (href: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(href);
  };

  return (
    <>
      {/* 1. LAYOUT'DA GÖRÜNEN BUTON */}
      <button 
        onClick={() => setIsOpen(true)}
        className="group h-10 w-full md:w-80 bg-slate-100/50 hover:bg-slate-100 rounded-sm border-2 border-slate-200 px-3 flex items-center justify-between text-xs text-slate-400 transition-colors focus:outline-none focus:border-slate-400"
      >
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          <span className="font-bold uppercase tracking-widest group-hover:text-slate-600 transition-colors">Search system...</span>
        </div>
        <div className="hidden md:flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-white border-2 border-slate-200 rounded-sm font-mono font-black text-[10px] text-slate-500 flex items-center justify-center">
            <Command className="w-3 h-3" />
          </kbd>
          <kbd className="px-1.5 py-0.5 bg-white border-2 border-slate-200 rounded-sm font-mono font-black text-[10px] text-slate-500">
            K
          </kbd>
        </div>
      </button>

      {/* 2. AÇILIR MODAL (KOMUT MERKEZİ) */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
            {/* Arka plan karartması */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            {/* Modal İçeriği */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl bg-white border-2 border-slate-300 shadow-2xl rounded-sm overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-950" />
              
              <div className="flex items-center px-4 border-b-2 border-slate-100">
                <Search className="w-5 h-5 text-slate-400" />
                <input 
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search..."
                  className="w-full h-16 bg-transparent border-none focus:ring-0 text-sm font-black text-slate-900 placeholder:text-slate-400 px-4 focus:outline-none"
                />
                <button onClick={() => setIsOpen(false)} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-950 border-2 border-transparent hover:border-slate-200 px-2 py-1 transition-all">
                  ESC
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filteredLinks.length === 0 ? (
                  <p className="p-8 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
                    No results found for "{query}"
                  </p>
                ) : (
                  <div className="space-y-1">
                    <p className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Quick Navigation
                    </p>
                    {filteredLinks.map((link) => (
                      <button
                        key={link.name}
                        onClick={() => handleNavigate(link.href)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-sm hover:bg-slate-50 group transition-colors border-2 border-transparent hover:border-slate-200 focus:outline-none focus:bg-slate-50 focus:border-slate-200"
                      >
                        <div className="flex items-center gap-3">
                          <link.icon className="w-4 h-4 text-slate-400 group-hover:text-slate-950 transition-colors" />
                          <span className="text-xs font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-950 transition-colors">
                            {link.name}
                          </span>
                        </div>
                        <kbd className="hidden sm:flex px-2 py-1 bg-white border border-slate-200 rounded-sm font-mono font-bold text-[10px] text-slate-400 group-hover:text-slate-600">
                          {link.shortcut}
                        </kbd>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}