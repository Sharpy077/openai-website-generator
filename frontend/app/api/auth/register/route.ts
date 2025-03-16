import { NextResponse } from "next/server"
import bcrypt from "bcryptjs" // You need to install this package: npm install bcryptjs @types/bcryptjs
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        // Check if request body exists
        if (!req.body) {
            return NextResponse.json(
                { message: "Request body is empty" },
                { status: 400 }
            )
        }

        const { name, email, password } = await req.json()

        // Input validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            )
        }

        // Name validation
        if (typeof name !== 'string' || name.trim().length === 0) {
            return NextResponse.json(
                { message: "Invalid name format" },
                { status: 400 }
            )
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (typeof email !== 'string' || !emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Invalid email format" },
                { status: 400 }
            )
        }

        // Password strength validation
        if (typeof password !== 'string' || password.length < 8) {
            return NextResponse.json(
                { message: "Password must be at least 8 characters long" },
                { status: 400 }
            )
        }

        // Check if user already exists
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            })

            if (existingUser) {
                return NextResponse.json(
                    { message: "User already exists" },
                    { status: 400 }
                )
            }
        } catch (dbError) {
            console.error("Database error checking existing user:", dbError)
            return NextResponse.json(
                { message: "Error checking user existence" },
                { status: 500 }
            )
        }

        // Hash password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10)
        } catch (hashError) {
            console.error("Password hashing error:", hashError)
            return NextResponse.json(
                { message: "Error processing password" },
                { status: 500 }
            )
        }

        // Create user
        let user;
        try {
            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            })
        } catch (createError) {
            console.error("User creation error:", createError)
            return NextResponse.json(
                { message: "Failed to create user" },
                { status: 500 }
            )
        }

        // Don't return the user object with password
        const { password: _password, ...userWithoutPassword } = user

        return NextResponse.json(
            {
                message: "User created successfully",
                user: userWithoutPassword
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Registration error:", error)
        // Check if it's a JSON parsing error
        if (error instanceof SyntaxError && error.message.includes('JSON')) {
            return NextResponse.json(
                { message: "Invalid JSON in request body" },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        )
    }
}