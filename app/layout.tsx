import type { Metadata } from 'next'
import React from 'react'
import './globals.css'

export const metadata: Metadata = {
    title: 'OpenAI Website Generator',
    description: 'A website generator powered by OpenAI',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}