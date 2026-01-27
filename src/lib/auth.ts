import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Mock authentication for development
                // In production, verify user from DB password hash
                if (process.env.NODE_ENV === "development") {
                    // Return a mock user
                    return { id: "1", name: "지수", email: "jisoo@example.com", image: "https://ui-avatars.com/api/?name=Jisoo" };
                }
                return null;
            }
        }),
    ],
    callbacks: {
        async session({ session, user, token }) {
            // Add user ID to session
            if (session.user) {
                // For database sessions (with adapter)
                if (user) {
                    session.user.id = user.id;
                }
                // For JWT sessions (without adapter)
                else if (token?.sub) {
                    session.user.id = token.sub;
                }
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET || "secret",
};
