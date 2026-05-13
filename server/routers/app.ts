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
});

export type AppRouter = typeof appRouter;