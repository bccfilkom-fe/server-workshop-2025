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
  details?: Record<string, any>,
): NextResponse {
  const response: IApiResponse<null> = {
    success: false,
    error: {
      code,
      message,
      ...details, // This will include the fields object or any other details
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
export function handleApiError(error: unknown) {
  // Handle Zod validation errors with better messages
  if (error instanceof ZodError) {
    // Create an object to store field-specific error messages
    const fieldErrors: Record<string, string> = {};

    // Extract field paths and their error messages
    error.errors.forEach((err) => {
      const fieldName = err.path.join(".");
      fieldErrors[fieldName] = err.message;
    });

    // Create a human-readable message
    const missingFields = Object.keys(fieldErrors);
    let message: string;

    if (missingFields.length === 1) {
      message = `Missing required field: ${missingFields[0]}`;
    } else if (missingFields.length > 1) {
      message = `Missing required fields: ${missingFields.join(", ")}`;
    } else {
      message = "Validation error";
    }

    return sendError(message, "VALIDATION_ERROR", 400, { fields: fieldErrors });
  }

  // Handle other types of errors as before
  console.error("API Error:", error);
  return sendError("Something went wrong", "SERVER_ERROR", 500);
}
