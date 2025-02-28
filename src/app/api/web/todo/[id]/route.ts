import { eq, param } from "drizzle-orm";
import { handleApiError, sendError, sendSuccess } from "@/lib/api";
import { idParamSchema, updateTodoSchema } from "@/models/todo";

import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { todos } from "@/server/db/schema";

/**
 * GET /api/todos/[id]
 * Get a specific todo by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const paramsId = (await params).id;
    const id = idParamSchema.parse(paramsId);

    // Fetch the todo from database
    const todo = await db.select().from(todos).where(eq(todos.id, id)).limit(1);

    // Check if todo exists
    if (todo.length === 0) {
      return sendError("Todo not found", "NOT_FOUND", 404);
    }

    return sendSuccess(todo[0]);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/todos/[id]
 * Update a specific todo by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const paramsId = (await params).id;
    const id = idParamSchema.parse(paramsId);

    const body: unknown = await request.json();
    const validatedData = updateTodoSchema.parse(body);

    // Update the todo in database
    const result = await db
      .update(todos)
      .set({
        text: validatedData.text,
        updatedAt: new Date(),
      })
      .where(eq(todos.id, id))
      .returning();

    if (result.length === 0) {
      return sendError("Todo not found", "NOT_FOUND", 404);
    }

    return sendSuccess(result[0]);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/todos/[id]
 * Delete a specific todo by ID
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const paramsId = (await params).id;
    const id = idParamSchema.parse(paramsId);

    // Delete the todo from database
    const result = await db.delete(todos).where(eq(todos.id, id)).returning();

    if (result.length === 0) {
      return sendError("Todo not found", "NOT_FOUND", 404);
    }

    return sendSuccess(null, 204);
  } catch (error) {
    return handleApiError(error);
  }
}
