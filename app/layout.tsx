import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/components/providers/trpc-provider";
import { Sidebar } from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MODUL | Industrial Supply Chain",
  description: "High-fidelity B2B portal for automotive and textile manufacturing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-white text-slate-950">
        <TRPCProvider>
          {/* Ana Flex Konteynırı */}
          <div className="flex h-screen overflow-hidden">
            
            {/* Sol Panel: Sabit Sidebar */}
            <Sidebar />

            {/* Sağ Panel: Üst Bar ve Ana İçerik */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-slate-50">
              
              {/* İsteğe bağlı: Üst Bar (Search & User info) */}
              <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-8">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                  Supply Chain Intelligence
                </div>
                <div className="flex items-center gap-4">
                 
                  <div className="h-8 w-64 bg-slate-100 rounded-sm border border-slate-200 px-3 flex items-center text-xs text-slate-400">
                    Search orders, invoices...
                  </div>
                </div>
              </header>

              {/* Dinamik İçerik Alanı */}
              <main className="flex-1 overflow-y-auto p-8">
                {children}
              </main>
            </div>
            
          </div>
        </TRPCProvider>
      </body>
    </html>
  );
}