import {  z } from "zod";

export const transferSchema = z.object({
  receiverId: z.number().int().positive(),
  value: z.number().int().positive(),
});
