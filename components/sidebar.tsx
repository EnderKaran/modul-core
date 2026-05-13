import { LayoutDashboard, ShoppingCart, Box, FileText, User } from "lucide-react";

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Orders', icon: ShoppingCart, href: '/orders' },
  { name: 'Inventory', icon: Box, href: '/inventory' },
  { name: 'Invoices', icon: FileText, href: '/invoices' },
];

export function Sidebar() {
  return (
    <div className="w-64 border-r border-slate-200 bg-white flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tightest">MODUL</h1>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Industrial Portal v1.0</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 rounded-sm hover:bg-slate-50 transition-colors group"
          >
            <item.icon className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
            {item.name}
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs">
            EK
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold">Ender Karan</span>
            <span className="text-[10px] text-slate-500">Administrator</span>
          </div>
        </div>
      </div>
    </div>
  );
}