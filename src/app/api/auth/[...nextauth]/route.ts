import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

const handler = NextAuth({
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
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET || "secret",
});

export { handler as GET, handler as POST };
