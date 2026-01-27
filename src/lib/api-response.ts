import { NextResponse } from "next/server";

/**
 * Standardized API response formats
 */

export interface ApiSuccessResponse<T = any> {
    success: true;
    data: T;
    message?: string;
}

export interface ApiErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: any;
    };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Create a success response
 */
export function successResponse<T>(data: T, message?: string, status: number = 200) {
    return NextResponse.json<ApiSuccessResponse<T>>(
        {
            success: true,
            data,
            ...(message && { message })
        },
        { status }
    );
}

/**
 * Create an error response
 */
export function errorResponse(
    message: string,
    code: string = "INTERNAL_ERROR",
    status: number = 500,
    details?: any
) {
    return NextResponse.json<ApiErrorResponse>(
        {
            success: false,
            error: {
                code,
                message,
                ...(details && { details })
            }
        },
        { status }
    );
}

/**
 * Common error responses
 */
export const ApiErrors = {
    unauthorized: (message: string = "Unauthorized") =>
        errorResponse(message, "UNAUTHORIZED", 401),

    forbidden: (message: string = "Forbidden") =>
        errorResponse(message, "FORBIDDEN", 403),

    notFound: (message: string = "Resource not found") =>
        errorResponse(message, "NOT_FOUND", 404),

    badRequest: (message: string = "Bad request", details?: any) =>
        errorResponse(message, "BAD_REQUEST", 400, details),

    validationError: (message: string = "Validation failed", details?: any) =>
        errorResponse(message, "VALIDATION_ERROR", 422, details),

    internalError: (message: string = "Internal server error") =>
        errorResponse(message, "INTERNAL_ERROR", 500),

    tooManyRequests: (message: string = "Too many requests") =>
        errorResponse(message, "RATE_LIMIT_EXCEEDED", 429),
};

/**
 * Pagination helper
 */
export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasMore: boolean;
    };
}

export function paginatedResponse<T>(
    items: T[],
    total: number,
    page: number = 1,
    limit: number = 10
) {
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return successResponse<PaginatedResponse<T>>({
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasMore
        }
    });
}

/**
 * Parse pagination parameters from URL
 */
export function getPaginationParams(request: Request): { page: number; limit: number } {
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.max(1, Math.min(100, parseInt(url.searchParams.get('limit') || '10')));

    return { page, limit };
}
