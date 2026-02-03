
import { z } from "zod";

export const emailSchema = z.string().email().max(254);
export const passwordSchema = z.string().min(8).max(72);

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().max(60).optional()
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

export const forgotSchema = z.object({
  email: emailSchema
});

export const resetSchema = z.object({
  token: z.string().min(20).max(200),
  password: passwordSchema
});

export const planIdSchema = z.enum(["FREE", "ESSENCIAL", "PLUS", "ULTRA", "MAX"]);

export const txCreateSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  valueCents: z.number().int().min(1).max(10_000_000_00),
  category: z.string().min(1).max(60),
  description: z.string().min(1).max(140),
  method: z.enum(["PIX", "CARD", "CASH"]),
  dateISO: z.string().min(8).max(40)
});

export const kashAiSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string().min(1).max(2000)
    })
  ).min(1).max(16),
  monthContext: z.string().max(1200).optional(),
  summaryStats: z.record(z.string(), z.union([z.string(), z.number()])).optional()
});
