import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/auth.config"

// GET /api/cms/categories
export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new NextResponse(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 }
        )
    }

    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(categories)
    } catch (error) {
        console.error('Error fetching categories:', error)
        return new NextResponse(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        )
    }
}

// POST /api/cms/categories
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
        const { name, description } = json

        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description,
            },
            include: {
                _count: {
                    select: { pages: true },
                },
            },
        })

        return NextResponse.json(category, { status: 201 })
    } catch (error) {
        console.error("[CATEGORIES_POST]", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}

// PATCH /api/cms/categories
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
        const { id, name, description } = json

        const category = await prisma.category.update({
            where: { id },
            data: {
                ...(name && {
                    name,
                    slug: name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, ""),
                }),
                ...(description && { description }),
            },
            include: {
                _count: {
                    select: { pages: true },
                },
            },
        })

        return NextResponse.json(category)
    } catch (error) {
        console.error("[CATEGORIES_PATCH]", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}

// DELETE /api/cms/categories
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
                { message: "Missing category ID" },
                { status: 400 }
            )
        }

        await prisma.category.delete({
            where: { id },
        })

        return NextResponse.json({ message: "Category deleted" })
    } catch (error) {
        console.error("[CATEGORIES_DELETE]", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}