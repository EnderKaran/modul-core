import { router, publicProcedure } from '../trpc';
import { db } from '@/db';
import { products, orders, suppliers, invoices } from "@/db/schema";
import { procurementSchema } from "@/lib/validations/procurement";
import { count, eq, sql } from 'drizzle-orm';
import * as Ably from 'ably';
import z from 'zod';

const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });

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
ggetInventory: publicProcedure.query(async () => {
    // products tablosundaki tüm verileri isme göre sıralayarak getirir
    return await db.select().from(products).orderBy(products.name);
  }),
getLatestInvoices: publicProcedure.query(async () => {
  return await db.select()
    .from(invoices)
    .orderBy(sql`${invoices.createdAt} DESC`)
    .limit(5);
}),
createProcurement: publicProcedure
    .input(procurementSchema)
    .mutation(async ({ input }) => {
      // 1. Neon DB'ye kaydet (Mevcut kodun)
      const [newOrder] = await db.insert(orders).values({
        orderNumber: `MOD-${Math.floor(1000 + Math.random() * 9000)}`,
        supplierId: input.vendorId,
        status: "approved",
        totalAmount: (input.quantity * 125.50).toString(),
      }).returning();

      // 2. ABLY TELEMETRİ SİNYALİ GÖNDER (YENİ)
      const channel = ably.channels.get('modul-network');
      await channel.publish('order-created', {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        message: "New industrial procurement authorized."
      });

      return newOrder;
    }),
    addInventoryItem: publicProcedure
    .input(z.object({
      sku: z.string().min(1),
      name: z.string().min(1),
      category: z.string().min(1),
      stock: z.number().min(0),
      unit: z.string(),
      safetyStock: z.number().min(0),
      location: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      await db.insert(products).values({
        sku: input.sku,
        name: input.name,
        category: input.category,
        stock: input.stock,
        unit: input.unit,
        safetyStock: input.safetyStock,
        location: input.location,
      });
      return { success: true };
    }),
});

export type AppRouter = typeof appRouter;