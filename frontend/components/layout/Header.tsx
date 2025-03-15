import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/auth.config'

export default async function Header() {
    const session = await getServerSession(authOptions)

    return (
        <header className="bg-white shadow">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold">
                        Sharp Horizons
                    </Link>
                    <div className="flex items-center space-x-4">
                        {session ? (
                            <>
                                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                                    Dashboard
                                </Link>
                                <Link href="/api/auth/signout" className="text-gray-600 hover:text-gray-900">
                                    Sign Out
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                                    Sign In
                                </Link>
                                <Link href="/auth/register" className="text-gray-600 hover:text-gray-900">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    )
}