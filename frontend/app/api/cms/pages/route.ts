import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/auth.config"

// GET /api/cms/pages
export async function GET(_req: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new NextResponse(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 }
        )
    }

    try {
        const pages = await prisma.page.findMany({
            include: {
                author: {
                    select: {
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                categories: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(pages)
    } catch (error) {
        console.error('Error fetching pages:', error)
        return new NextResponse(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        )
    }
}

// POST /api/cms/pages
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const json = await req.json()
        const { title, content, excerpt, status, categories, media } = json

        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")

        const page = await prisma.page.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                status,
                authorId: session.user.id as string,
                ...(categories && {
                    categories: {
                        connect: categories.map((id: string) => ({ id })),
                    },
                }),
                ...(media && {
                    media: {
                        connect: media.map((id: string) => ({ id })),
                    },
                }),
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                categories: true,
                media: true,
            },
        })

        return NextResponse.json(page, { status: 201 })
    } catch (error) {
        console.error("[PAGES_POST]", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}

// PATCH /api/cms/pages
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const json = await req.json()
        const { id, title, content, excerpt, status, categories, media } = json

        const page = await prisma.page.update({
            where: { id },
            data: {
                ...(title && {
                    title,
                    slug: title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, ""),
                }),
                ...(content && { content }),
                ...(excerpt && { excerpt }),
                ...(status && { status }),
                ...(categories && {
                    categories: {
                        set: categories.map((id: string) => ({ id })),
                    },
                }),
                ...(media && {
                    media: {
                        set: media.map((id: string) => ({ id })),
                    },
                }),
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                categories: true,
                media: true,
            },
        })

        return NextResponse.json(page)
    } catch (error) {
        console.error("[PAGES_PATCH]", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}

// DELETE /api/cms/pages
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json(
                { message: "Missing page ID" },
                { status: 400 }
            )
        }

        await prisma.page.delete({
            where: { id },
        })

        return NextResponse.json({ message: "Page deleted" })
    } catch (error) {
        console.error("[PAGES_DELETE]", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}