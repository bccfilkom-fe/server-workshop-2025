import { handleApiError, sendSuccess } from "@/lib/api";

import { NextRequest } from "next/server";
import { authenticate } from "@/lib/middleware";
import { createMobileTodoSchema } from "@/models/mobile-todo";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { mobileTodos } from "@/server/db/schema";

/**
 * GET /api/mobile-todos
 * Get all mobile todos for the current user
 */
export async function GET(request: NextRequest) {
  return authenticate(request, async (_request, userId) => {
    try {
      const todos = await db
        .select()
        .from(mobileTodos)
        .where(eq(mobileTodos.userId, userId))
        .orderBy(mobileTodos.createdAt);

      return sendSuccess(todos);
    } catch (error) {
      return handleApiError(error);
    }
  });
}

/**
 * POST /api/mobile-todos
 * Create a new mobile todo
 */
export async function POST(request: NextRequest) {
  return authenticate(request, async (request, userId) => {
    try {
      const body: unknown = await request.json();
      const validatedData = createMobileTodoSchema.parse(body);

      const newTodo = await db
        .insert(mobileTodos)
        .values({
          userId,
          title: validatedData.title,
          desc: validatedData.desc ?? null,
        })
        .returning();

      return sendSuccess(newTodo[0], 201);
    } catch (error) {
      return handleApiError(error);
    }
  });
}
