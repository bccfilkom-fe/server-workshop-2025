import { handleApiError, sendSuccess } from "@/lib/api";

import { NextRequest } from "next/server";
import { createTodoSchema } from "@/models/todo";
import { db } from "@/server/db";
import { todos } from "@/server/db/schema";

/**
 * POST /api/todos
 * Create a new todo
 */
export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const validatedData = createTodoSchema.parse(body);

    // Insert todo into database
    const result = await db
      .insert(todos)
      .values({
        text: validatedData.text,
      })
      .returning();

    return sendSuccess(result[0], 201);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /api/todos
 * Get all todos
 */
export async function GET() {
  try {
    // Fetch all todos from database, ordered by creation date (newest first)
    const allTodos = await db.select().from(todos).orderBy(todos.createdAt);

    return sendSuccess(allTodos);
  } catch (error) {
    return handleApiError(error);
  }
}
