import { router, publicProcedure } from '../trpc';
import { db } from '../../db';
import { suppliers } from '../../db/schema';

export const appRouter = router({
  // Test için basit bir tedarikçi listesi çekme
  getSuppliers: publicProcedure.query(async () => {
    return await db.select().from(suppliers);
  }),
});

export type AppRouter = typeof appRouter;