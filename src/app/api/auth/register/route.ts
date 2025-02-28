import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
  hashPassword,
  verifyPassword,
  verifyRefreshToken,
} from "@/lib/auth";
import { handleApiError, sendError, sendSuccess } from "@/lib/api";
import { refreshTokens, users } from "@/server/db/schema";

import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { registerUserSchema } from "@/models/user";

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const validatedData = registerUserSchema.parse(body);

    // Check if email is already registered
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existingUser.length > 0) {
      return sendError("Email already registered", "CONFLICT", 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user in database
    const newUser = await db
      .insert(users)
      .values({
        email: validatedData.email,
        password: hashedPassword,
      })
      .returning({
        id: users.id,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return sendSuccess(newUser[0], 201);
  } catch (error) {
    return handleApiError(error);
  }
}
