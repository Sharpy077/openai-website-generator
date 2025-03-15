import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
    const session = await auth();

    // Public routes
    const isPublicRoute = [
        "/auth/login",
        "/auth/register",
        "/",
        "/about",
        "/contact",
    ].includes(request.nextUrl.pathname);

    // API routes that don't require authentication
    const isPublicApiRoute = request.nextUrl.pathname.startsWith("/api/public");

    if (isPublicRoute || isPublicApiRoute) {
        return NextResponse.next();
    }

    // Protected routes
    if (!session) {
        const url = new URL("/auth/login", request.url);
        url.searchParams.set("callbackUrl", request.url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// See https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};