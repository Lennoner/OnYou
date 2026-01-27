import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Simplified auth config for Vercel deployment
// PrismaAdapter removed because SQLite doesn't work on Vercel serverless
const handler = NextAuth({
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
                // Demo mode: always return a mock user
                // In production with a cloud DB, verify credentials here
                return {
                    id: "demo-user-1",
                    name: "지수",
                    email: "jisoo@example.com",
                    image: "https://ui-avatars.com/api/?name=Jisoo"
                };
            }
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        }
    },
    session: {
        strategy: "jwt", // Use JWT instead of database sessions
    },
    secret: process.env.NEXTAUTH_SECRET || "development-secret-change-in-production",
});

export { handler as GET, handler as POST };
