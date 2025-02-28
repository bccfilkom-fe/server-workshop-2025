import type { IUser } from "@/types/types.user";
import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { env } from "@/env";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET;

const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

/**
 * Generate hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate access token for a user
 */
export function generateAccessToken(user: IUser): string {
  return jwt.sign({ userId: user.id, email: user.email }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

/**
 * Generate refresh token for a user
 */
export function generateRefreshToken(user: IUser): string {
  return jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

/**
 * Calculate refresh token expiry date
 */
export function getRefreshTokenExpiry(): Date {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);
  return expiryDate;
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as jwt.JwtPayload;
    return { userId: decoded.userId };
  } catch (_error) {
    return null;
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
    return { userId: decoded.userId };
  } catch (_error) {
    return null;
  }
}

/**
 * Extract access token from request headers
 */
export function getAccessTokenFromHeader(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  return authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1]! : null;
}
