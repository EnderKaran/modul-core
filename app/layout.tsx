import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/components/providers/trpc-provider";
import { TelemetryProvider } from "@/components/providers/ably-provider";
import { Sidebar } from "@/components/sidebar";

// YENİ: Arama Çubuğu Bileşenini İçeri Aktar
import { TopSearchBar } from "@/components/top-search-bar";

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
          <TelemetryProvider>
            {/* Ana Flex Konteynırı */}
            <div className="flex h-screen overflow-hidden">
              
              {/* Sol Panel: Sabit Sidebar */}
              <Sidebar />

            {/* Sağ Panel: Üst Bar ve Ana İçerik */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-slate-50">
              
              {/* Üst Bar (Search & User info) */}
              <header className="h-16 md:h-14 border-b-2 border-slate-200 bg-white flex items-center justify-between px-4 md:px-8">
                <div className="hidden md:block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Supply Chain Intelligence
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                 
                 {/* YENİ: Dinamik Command Palette (Arama Çubuğu) */}
                 <TopSearchBar />
                 
                </div>
              </header>

              {/* Dinamik İçerik Alanı */}
              <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                {children}
              </main>
            </div>
            
          </div>
          </TelemetryProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}