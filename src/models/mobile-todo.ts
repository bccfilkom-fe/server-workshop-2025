import { z } from "zod";

/**
 * Validation schema for mobile todo creation
 */
export const createMobileTodoSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(256, "Title is too long"),
  desc: z.string().max(1000, "Description is too long").optional(),
});

/**
 * Validation schema for mobile todo update
 */
export const updateMobileTodoSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(256, "Title is too long")
    .optional(),
  desc: z.string().max(1000, "Description is too long").optional(),
  isCompleted: z.boolean().optional(),
});
