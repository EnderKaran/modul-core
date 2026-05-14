import { z } from "zod";

export const procurementSchema = z.object({
  // Step 1
  fiberType: z.string().min(1, "Fiber type is required"),
  threadCount: z.string().optional(),
  // HTML'den gelen string'i zorla sayıya çevir:
  arealWeight: z.coerce.number().min(1, "Areal weight must be positive"), 
  finishType: z.string().optional(),
  notes: z.string().max(500).optional(),
  
  // Step 2 & 3
  // HTML'den gelen string'leri zorla sayıya ve tarihe çevir:
  quantity: z.coerce.number().min(1),
  leadTime: z.coerce.date({ error: "Please select a delivery date" }),
  vendorId: z.coerce.number().min(1, "Please select a vendor"),
});

export type ProcurementInput = z.infer<typeof procurementSchema>;