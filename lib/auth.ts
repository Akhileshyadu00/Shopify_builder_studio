import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

// Sanity check for environment variables
if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === "production") {
    const errorMsg = "❌ CONFIG ERROR: NEXTAUTH_SECRET is missing. Authentication will fail. Add it in Vercel Settings > Environment Variables.";
    console.error(errorMsg);
    throw new Error(errorMsg);
}

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }

    interface User {
        id: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
    }
}

export const authOptions: NextAuthOptions = {
    // We only use the adapter if MONGODB_URI is available
    adapter: process.env.MONGODB_URI ? MongoDBAdapter(clientPromise, {
        databaseName: "shopify_builder",
    }) : undefined,

    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                try {
                    const client = await clientPromise;
                    const user = await client.db("shopify_builder").collection("users").findOne({
                        email: credentials.email,
                    });

                    if (!user || !user.password) {
                        throw new Error("User not found");
                    }

                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordCorrect) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                    };
                } catch (error) {
                    console.error("Authentication error:", error);
                    if (error instanceof Error && error.message.includes("User not found")) {
                        throw error;
                    }
                    if (error instanceof Error && error.message.includes("Invalid password")) {
                        throw error;
                    }
                    // MongoDB connection or other errors
                    throw new Error("Authentication service unavailable. Please check your database connection.");
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    // Use an environment variable, but provide a stable secret for development to avoid config errors
    secret: process.env.NEXTAUTH_SECRET || "development-secret-key-123456789",
};
