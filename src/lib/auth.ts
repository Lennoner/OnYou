import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Demo",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "demo@example.com" },
            },
            async authorize(credentials) {
                // Demo mode: Find or create a demo user
                if (!credentials?.email) {
                    return null;
                }

                // Find existing user or create demo user
                let user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) {
                    // Create demo user if not exists
                    user = await prisma.user.create({
                        data: {
                            email: credentials.email,
                            name: credentials.email.split('@')[0],
                            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(credentials.email.split('@')[0])}`,
                        }
                    });
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                };
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Initial sign in
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            // Pass user id to session
            if (session.user && token.id) {
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt", // Use JWT for simpler session handling
    },
    pages: {
        signIn: "/auth/signin", // Custom sign-in page
    },
    secret: process.env.NEXTAUTH_SECRET || "development-secret-change-in-production",
};

/**
 * Helper function to get the current session in API routes
 * Returns the session or null if not authenticated
 */
export async function getSession() {
    return await getServerSession(authOptions);
}

/**
 * Helper function to get the authenticated user ID
 * Returns the user ID or null if not authenticated
 */
export async function getAuthUserId(): Promise<string | null> {
    const session = await getSession();
    return session?.user?.id || null;
}
