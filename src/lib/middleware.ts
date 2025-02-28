import type { NextRequest } from "next/server";
import { db } from "@/server/db";
import { env } from "@/env";
import { eq } from "drizzle-orm";
import { getAccessTokenFromHeader } from "@/lib/auth";
import jwt from "jsonwebtoken";
import { sendError } from "@/lib/api";
import { users } from "@/server/db/schema";

const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET;

/**
 * Authentication middleware to protect routes
 */
export async function authenticate(
  request: NextRequest,
  handler: (request: NextRequest, userId: string) => Promise<Response>,
): Promise<Response> {
  const token = getAccessTokenFromHeader(request);
  if (!token) {
    return sendError("Authentication required", "MISSING_TOKEN", 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as jwt.JwtPayload;
    if (!decoded?.userId) {
      return sendError("Invalid token format", "INVALID_TOKEN", 401);
    }

    // Check if user exists
    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, decoded.userId as string))
      .limit(1);

    if (user.length === 0) {
      return sendError("User not found", "USER_NOT_FOUND", 401);
    }

    return handler(request, decoded.userId as string);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return sendError("Token has expired", "TOKEN_EXPIRED", 401);
    } else if (error instanceof jwt.JsonWebTokenError) {
      return sendError("Invalid access token", "INVALID_TOKEN", 401);
    } else {
      console.error("Authentication error:", error);
      return sendError("Authentication failed", "AUTH_ERROR", 401);
    }
  }
}
