import { z } from "zod";

export const webhookSchema = z.object({
  token: z.string().min(1),
  transactionId: z.number().int().positive(),
});
