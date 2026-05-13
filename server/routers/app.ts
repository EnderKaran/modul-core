import { router, publicProcedure } from '../trpc';
import { db } from '@/db';
import { orders } from '@/db/schema';
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
});

export type AppRouter = typeof appRouter;