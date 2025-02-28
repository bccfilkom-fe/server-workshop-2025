import { and, eq, sql } from "drizzle-orm";
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
  verifyRefreshToken,
} from "@/lib/auth";
import { handleApiError, sendError, sendSuccess } from "@/lib/api";
import { refreshTokens, users } from "@/server/db/schema";

import { IUser } from "@/types/types.user";
import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { refreshTokenSchema } from "@/models/user";

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const validatedData = refreshTokenSchema.parse(body);

    // Verify refresh token
    const payload = verifyRefreshToken(validatedData.refreshToken);

    if (!payload) {
      return sendError("Invalid or expired refresh token", "UNAUTHORIZED", 401);
    }

    // Find token in database
    const tokenRecord = await db
      .select()
      .from(refreshTokens)
      .where(
        and(
          eq(refreshTokens.token, validatedData.refreshToken),
          eq(refreshTokens.userId, payload.userId),
          sql`${refreshTokens.expires} > NOW()`,
        ),
      )
      .limit(1);

    if (tokenRecord.length === 0) {
      return sendError("Invalid or expired refresh token", "UNAUTHORIZED", 401);
    }

    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (user.length === 0) {
      return sendError("User not found", "UNAUTHORIZED", 401);
    }

    // Generate new tokens
    const accessToken = generateAccessToken(user[0] as IUser);
    const refreshToken = generateRefreshToken(user[0] as IUser);
    const expiryDate = getRefreshTokenExpiry();

    // Delete old token
    await db
      .delete(refreshTokens)
      .where(eq(refreshTokens.id, tokenRecord[0]!.id));

    // Store new refresh token
    await db.insert(refreshTokens).values({
      userId: user[0]!.id,
      token: refreshToken,
      expires: expiryDate,
    });

    return sendSuccess({
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
