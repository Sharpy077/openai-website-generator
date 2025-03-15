import { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

// Extend the User type to include role
declare module "next-auth" {
    interface User {
        role?: string
    }
    interface Session {
        user: {
            id: string
            role: string
            email?: string | null
            name?: string | null
            image?: string | null
        }
    }
}

export const authConfig = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/login",
        signUp: "/auth/register",
    },
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user || !user.password) {
                    return null;
                }

                // In a real application, you would verify the password here
                // For now, we'll just check if they match exactly (NOT SECURE!)
                const isValid = credentials.password === user.password;

                if (!isValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.sub!;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
    },
} satisfies NextAuthConfig;