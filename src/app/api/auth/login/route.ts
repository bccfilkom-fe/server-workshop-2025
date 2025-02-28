import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
  verifyPassword,
} from "@/lib/auth";
import { handleApiError, sendError, sendSuccess } from "@/lib/api";
import { refreshTokens, users } from "@/server/db/schema";

import { IUser } from "@/types/types.user";
import { NextRequest } from "next/server";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { loginUserSchema } from "@/models/user";

/**
 * POST /api/auth/login
 * Login a user
 */
export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const validatedData = loginUserSchema.parse(body);

    // Find user by email
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (user.length === 0) {
      return sendError("Invalid email or password", "UNAUTHORIZED", 401);
    }

    // Verify password
    const passwordValid = await verifyPassword(
      validatedData.password,
      user[0]!.password,
    );

    if (!passwordValid) {
      return sendError("Invalid email or password", "UNAUTHORIZED", 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user[0] as IUser);
    const refreshToken = generateRefreshToken(user[0] as IUser);
    const expiryDate = getRefreshTokenExpiry();

    // Store refresh token in database
    await db.insert(refreshTokens).values({
      userId: user[0]!.id,
      token: refreshToken,
      expires: expiryDate,
    });

    return sendSuccess({
      user: {
        id: user[0]!.id,
        email: user[0]!.email,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
