import NextAuth from "next-auth";
import { authConfig } from "./app/api/auth/auth.config";

export const { auth, signIn, signOut } = NextAuth(authConfig);