import { IApiResponse } from "@/types/types.api";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Create a successful API response
 */
export function sendSuccess<T>(data?: T, status = 200): NextResponse {
  // For 204 No Content, don't include a response body
  if (status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const response: IApiResponse<T> = {
    success: true,
    data,
  };
  return NextResponse.json(response, { status });
}

/**
 * Create an error API response
 */
export function sendError(
  message: string,
  code = "INTERNAL_SERVER_ERROR",
  status = 500,
): NextResponse {
  const response: IApiResponse<null> = {
    success: false,
    error: {
      code,
      message,
    },
  };
  return NextResponse.json(response, { status });
}

/**
 * Handle validation errors from Zod
 */
export function handleZodError(error: ZodError): NextResponse {
  const issues = error.issues.map((issue) => issue.message).join(", ");
  return sendError(issues, "VALIDATION_ERROR", 400);
}

/**
 * Handle general API errors
 */
export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);

  if (error instanceof ZodError) {
    return handleZodError(error);
  }

  if (error instanceof Error) {
    return sendError(error.message, "INTERNAL_SERVER_ERROR", 500);
  }

  return sendError("Unknown error occurred", "INTERNAL_SERVER_ERROR", 500);
}
