import { z } from "zod";

/**
 * Validation schema for user registration
 */
export const registerUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * Validation schema for user login
 */
export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});

/**
 * Validation schema for token refresh
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});
