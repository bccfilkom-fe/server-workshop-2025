import { handleApiError, sendSuccess } from "@/lib/api";

// app/api/users/me/route.ts
import { NextRequest } from "next/server";
import { authenticate } from "@/lib/middleware";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { users } from "@/server/db/schema";

/**
 * GET /api/users/me
 * Get current user information
 */
export async function GET(request: NextRequest) {
  return authenticate(request, async (_request, userId) => {
    try {
      const user = await db
        .select({
          id: users.id,
          email: users.email,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (user.length === 0) {
        throw new Error("User not found");
      }

      return sendSuccess(user[0]);
    } catch (error) {
      return handleApiError(error);
    }
  });
}
