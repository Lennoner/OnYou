/**
 * Environment variable management with validation
 */

interface EnvConfig {
    // Database
    DATABASE_URL: string;

    // NextAuth
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;

    // Google OAuth (optional)
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;

    // Node environment
    NODE_ENV: 'development' | 'production' | 'test';
}

/**
 * Validate and load environment variables
 */
function loadEnv(): EnvConfig {
    const env = process.env;

    // Required variables
    const required = {
        DATABASE_URL: env.DATABASE_URL,
        NEXTAUTH_URL: env.NEXTAUTH_URL || 'http://localhost:3000',
        NEXTAUTH_SECRET: env.NEXTAUTH_SECRET,
        NODE_ENV: (env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
    };

    // Validate required variables
    const missing: string[] = [];

    if (!required.DATABASE_URL) missing.push('DATABASE_URL');
    if (!required.NEXTAUTH_SECRET && required.NODE_ENV === 'production') {
        missing.push('NEXTAUTH_SECRET');
    }

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}\n` +
            'Please check your .env file.'
        );
    }

    return {
        ...required,
        GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
    };
}

/**
 * Cached environment configuration
 */
export const env = loadEnv();

/**
 * Helper to check if we're in development
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Helper to check if we're in production
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Helper to check if we're in test
 */
export const isTest = env.NODE_ENV === 'test';

/**
 * Get a safe environment variable with fallback
 */
export function getEnv(key: string, fallback: string = ''): string {
    return process.env[key] || fallback;
}
