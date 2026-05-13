'use client';
import { trpc } from '@/lib/trpc-client';

export default function Home() {
  const suppliers = trpc.getSuppliers.useQuery();

  return (
    <main className="p-24">
      <h1 className="text-2xl font-bold tracking-tightest">MODUL CORE</h1>
      {suppliers.isLoading ? <p>Yükleniyor...</p> : (
        <pre>{JSON.stringify(suppliers.data, null, 2)}</pre>
      )}
    </main>
  );
}