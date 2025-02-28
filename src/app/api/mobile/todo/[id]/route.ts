import { and, eq } from "drizzle-orm";
import { handleApiError, sendError, sendSuccess } from "@/lib/api";

import { NextRequest } from "next/server";
import { authenticate } from "@/lib/middleware";
import { db } from "@/server/db";
import { idParamSchema } from "@/models/todo";
import { mobileTodos } from "@/server/db/schema";
import { updateMobileTodoSchema } from "@/models/mobile-todo";

/**
 * GET /api/mobile-todos/[id]
 * Get a specific mobile todo
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return authenticate(request, async (_request, userId) => {
    try {
      const paramsId = (await params).id;
      const id = idParamSchema.parse(paramsId);

      const todo = await db
        .select()
        .from(mobileTodos)
        .where(and(eq(mobileTodos.id, id), eq(mobileTodos.userId, userId)))
        .limit(1);

      if (todo.length === 0) {
        return sendError("Todo not found", "NOT_FOUND", 404);
      }

      return sendSuccess(todo[0]);
    } catch (error) {
      return handleApiError(error);
    }
  });
}

/**
 * PUT /api/mobile-todos/[id]
 * Update a specific mobile todo
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return authenticate(request, async (request, userId) => {
    try {
      const paramsId = (await params).id;
      const id = idParamSchema.parse(paramsId);
      const body: unknown = await request.json();
      const validatedData = updateMobileTodoSchema.parse(body);

      // Prepare update data
      const updateData: Record<string, unknown> = {};
      if (validatedData.title !== undefined)
        updateData.title = validatedData.title;
      if (validatedData.desc !== undefined)
        updateData.desc = validatedData.desc;
      if (validatedData.isCompleted !== undefined)
        updateData.isCompleted = validatedData.isCompleted;
      updateData.updatedAt = new Date();

      const result = await db
        .update(mobileTodos)
        .set(updateData)
        .where(and(eq(mobileTodos.id, id), eq(mobileTodos.userId, userId)))
        .returning();

      if (result.length === 0) {
        return sendError("Todo not found", "NOT_FOUND", 404);
      }

      return sendSuccess(result[0]);
    } catch (error) {
      return handleApiError(error);
    }
  });
}

/**
 * DELETE /api/mobile-todos/[id]
 * Delete a specific mobile todo
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return authenticate(request, async (_request, userId) => {
    try {
      const paramsId = (await params).id;
      const id = idParamSchema.parse(paramsId);

      const result = await db
        .delete(mobileTodos)
        .where(and(eq(mobileTodos.id, id), eq(mobileTodos.userId, userId)))
        .returning();

      if (result.length === 0) {
        return sendError("Todo not found", "NOT_FOUND", 404);
      }

      return sendSuccess(null, 204);
    } catch (error) {
      return handleApiError(error);
    }
  });
}
