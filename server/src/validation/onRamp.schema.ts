import { z } from "zod";

export const onRampSchema = z.object({
  amount: z.number().int().positive(),
  provider: z.string().min(1, "Provider cannot be empty"),
});
