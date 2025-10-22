import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(3, "Full name is required")
    .refine(
      (val) => val.trim().split(" ").length >= 2,
      "Please enter both first and last name"
    ),
  email: z.email("Enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@, $, !, %, *, ?, &)"
    ),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
