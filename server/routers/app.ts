import { router, publicProcedure } from '../trpc';
import { db } from '@/db';
import { invoices, orders, suppliers } from '@/db/schema';
import { procurementSchema } from "@/lib/validations/procurement";
import { count, eq, sql } from 'drizzle-orm';

export const appRouter = router({
  getDashboardStats: publicProcedure.query(async () => {
    const activeOrders = await db.select({ value: count() }).from(orders).where(eq(orders.status, 'approved'));
    const pendingShipments = await db.select({ value: count() }).from(orders).where(eq(orders.status, 'pending'));
    const delayedFreight = await db.select({ value: count() }).from(orders).where(eq(orders.status, 'delayed'));

    return {
      activeOrders: activeOrders[0].value,
      pendingShipments: pendingShipments[0].value,
      delayedFreight: delayedFreight[0].value,
    };
  }),
  getStockVelocity: publicProcedure.query(async () => {
  return [
    { month: 'Jan', velocity: 28000 },
    { month: 'Feb', velocity: 42000 },
    { month: 'Mar', velocity: 35000 },
    { month: 'Apr', velocity: 22000 },
    { month: 'May', velocity: 58000 },
    { month: 'Jun', velocity: 52000 },
    { month: 'Jul', velocity: 78000 },
    { month: 'Aug', velocity: 64000 },
    { month: 'Sep', velocity: 89000 },
  ];
}),
getLatestInvoices: publicProcedure.query(async () => {
  return await db.select()
    .from(invoices)
    .orderBy(sql`${invoices.createdAt} DESC`)
    .limit(5);
}),
createProcurement: publicProcedure
    .input(procurementSchema) // Zod ile gelen veriyi doğrula
    .mutation(async ({ input }) => {
      // 1. Siparişi 'orders' tablosuna ekle
      const [newOrder] = await db.insert(orders).values({
        orderNumber: `PRQ-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "approved", // Dinamik olması için onaylı başlıyoruz
        totalAmount: (input.quantity * 150).toString(), // Örnek fiyatlandırma
      }).returning();

      return newOrder;
    }),
    getVendors: publicProcedure.query(async () => {
    return await db.select().from(suppliers).orderBy(suppliers.name);
  }),
});

export type AppRouter = typeof appRouter;