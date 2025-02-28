import { z } from "zod";

/**
 * Validation schema for creating a new todo
 */
export const createTodoSchema = z.object({
  text: z
    .string()
    .min(1, "Todo text cannot be empty")
    .max(256, "Todo text is too long"),
});

/**
 * Validation schema for updating a todo
 */
export const updateTodoSchema = z.object({
  text: z
    .string()
    .min(1, "Todo text cannot be empty")
    .max(256, "Todo text is too long"),
});

/**
 * Validation schema for ID params
 */
export const idParamSchema = z.string().uuid("Invalid UUID format");
