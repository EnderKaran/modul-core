import { z } from "zod";

export const procurementSchema = z.object({
  // Step 1: Material Specs
  fiberType: z.string().min(1, "Fiber type is required"),
  threadCount: z.string().optional(),
  arealWeight: z.number().min(1, "Areal weight must be positive"),
  finishType: z.string().optional(),
  notes: z.string().max(500).optional(),
  
  // Step 2: Quantity & Lead Time
  quantity: z.number().min(1),
  leadTime: z.date(),
  
  // Step 3: Vendor Selection
  vendorId: z.number().min(1, "Please select a vendor"),
});

export type ProcurementInput = z.infer<typeof procurementSchema>;