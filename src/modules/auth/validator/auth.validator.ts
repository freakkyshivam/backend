import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Invalid email")
    .trim()
    .toLowerCase(),

  password: z
    .string("Password is required")
    .min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z
    .string("Name is required")
    .trim()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .email("Invalid email")
    .trim()
    .toLowerCase(),

  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters"),
});