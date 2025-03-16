import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/auth.config"

// GET /api/cms/media
export async function GET(_req: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new NextResponse(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 }
        )
    }

    try {
        const media = await prisma.media.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(media)
    } catch (error) {
        console.error('Error fetching media:', error)
        return new NextResponse(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        )
    }
}

// POST /api/cms/media
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const formData = await req.formData()
        const file = formData.get("file") as File
        const title = formData.get("title") as string
        const alt = formData.get("alt") as string
        const description = formData.get("description") as string

        if (!file) {
            return NextResponse.json(
                { message: "No file provided" },
                { status: 400 }
            )
        }

        // Here you would typically:
        // 1. Upload the file to Azure Blob Storage
        // 2. Get the URL of the uploaded file
        // For now, we'll use a placeholder URL
        const url = `https://storage.azure.com/${file.name}`
        const type = file.type.split("/")[0] // image, video, etc.

        const media = await prisma.media.create({
            data: {
                title: title || file.name,
                type,
                url,
                alt,
                description,
                uploaderId: session.user.id as string,
                metadata: {
                    size: file.size,
                    mimeType: file.type,
                },
            },
            include: {
                uploader: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        })

        return NextResponse.json(media, { status: 201 })
    } catch (error) {
        console.error("[MEDIA_POST]", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}

// DELETE /api/cms/media
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
                { message: "Missing media ID" },
                { status: 400 }
            )
        }

        // Here you would typically:
        // 1. Delete the file from Azure Blob Storage
        // 2. Delete the database record

        await prisma.media.delete({
            where: { id },
        })

        return NextResponse.json({ message: "Media deleted" })
    } catch (error) {
        console.error("[MEDIA_DELETE]", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}