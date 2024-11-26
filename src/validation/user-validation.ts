import { z, ZodType } from "zod";

export class userValidation {
  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(3).max(100),
    password: z.string().min(3).max(100),
    name: z.string().min(3).max(100),
  });

  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(3).max(100),
    password: z.string().min(3).max(100),
  });

  static readonly TOKEN: ZodType = z.string().min(1);

  static readonly UPDATE: ZodType = z.object({
    password: z.string().min(3).max(100).optional(),
    name: z.string().min(3).max(100).optional(),
  });
}
