/**
 * Input validation and sanitization utilities
 */

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
    if (typeof input !== 'string') return '';

    return input
        .trim()
        .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
        .substring(0, 10000); // Limit length
}

/**
 * Sanitize HTML content (for rich text)
 * In production, use a library like DOMPurify
 */
export function sanitizeHtml(input: string): string {
    if (typeof input !== 'string') return '';

    // Basic sanitization - remove script tags and dangerous attributes
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .substring(0, 50000);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    if (typeof email !== 'string') return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate required fields
 */
export function validateRequired(
    data: Record<string, any>,
    requiredFields: string[]
): { valid: boolean; missing: string[] } {
    const missing = requiredFields.filter(field => {
        const value = data[field];
        return value === undefined || value === null || value === '';
    });

    return {
        valid: missing.length === 0,
        missing
    };
}

/**
 * Validate object shape
 */
export function validateObject(
    data: any,
    validator: Record<string, (value: any) => boolean>
): { valid: boolean; errors: string[] } {
    if (typeof data !== 'object' || data === null) {
        return { valid: false, errors: ['Data must be an object'] };
    }

    const errors: string[] = [];

    for (const [key, validateFn] of Object.entries(validator)) {
        if (!validateFn(data[key])) {
            errors.push(`Invalid value for field: ${key}`);
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Validate survey answers
 */
export function validateSurveyAnswers(answers: any): boolean {
    if (typeof answers !== 'object' || answers === null) return false;

    // Check if answers is a valid object
    return Object.keys(answers).every(key => {
        const value = answers[key];
        // Allow string, number, or array of strings
        return (
            typeof value === 'string' ||
            typeof value === 'number' ||
            (Array.isArray(value) && value.every(v => typeof v === 'string'))
        );
    });
}

/**
 * Validate scores object
 */
export function validateScores(scores: any): boolean {
    if (typeof scores !== 'object' || scores === null) return false;

    // Check if all values are numbers between 1 and 5
    return Object.values(scores).every(value =>
        typeof value === 'number' && value >= 1 && value <= 5
    );
}

/**
 * Rate limiting (simple in-memory implementation)
 * For production, use Redis or a dedicated rate limiting service
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
    identifier: string,
    maxRequests: number = 60,
    windowMs: number = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const record = rateLimitMap.get(identifier);

    // Clean up expired records
    if (record && now > record.resetAt) {
        rateLimitMap.delete(identifier);
    }

    if (!record || now > record.resetAt) {
        // Create new window
        const resetAt = now + windowMs;
        rateLimitMap.set(identifier, { count: 1, resetAt });
        return { allowed: true, remaining: maxRequests - 1, resetAt };
    }

    // Increment count
    record.count++;

    if (record.count > maxRequests) {
        return { allowed: false, remaining: 0, resetAt: record.resetAt };
    }

    return {
        allowed: true,
        remaining: maxRequests - record.count,
        resetAt: record.resetAt
    };
}

/**
 * Clean up old rate limit records periodically
 */
setInterval(() => {
    const now = Date.now();
    const entries = Array.from(rateLimitMap.entries());
    for (const [key, record] of entries) {
        if (now > record.resetAt) {
            rateLimitMap.delete(key);
        }
    }
}, 60000); // Clean up every minute
