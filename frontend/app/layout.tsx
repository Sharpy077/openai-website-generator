import { Inter, Roboto_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import { Metadata } from 'next'

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
})

const robotoMono = Roboto_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto-mono',
})

export const metadata: Metadata = {
    title: 'SharpHorizons - Modern Web Solutions',
    description: 'Cutting-edge web development and design solutions for the future.',
    keywords: ['web development', 'design', 'modern', 'technology', 'innovation'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
            <body className="bg-gray-50 dark:bg-gray-900">
                <Header />
                <main className="min-h-screen pt-16">
                    {children}
                </main>
            </body>
        </html>
    )
}