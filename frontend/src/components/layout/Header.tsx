'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/projects', label: 'Projects' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <header className="fixed w-full z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                            SharpHorizons
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-gray-300 hover:text-white transition-colors duration-200"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className="w-6 h-6 flex items-center justify-center relative">
                            <span
                                className={`transform transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''
                                    } absolute w-full h-0.5 bg-white`}
                            />
                            <span
                                className={`transform transition-all duration-300 ${isOpen ? 'opacity-0' : ''
                                    } absolute w-full h-0.5 bg-white`}
                            />
                            <span
                                className={`transform transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''
                                    } absolute w-full h-0.5 bg-white`}
                            />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <motion.nav
                initial={false}
                animate={isOpen ? 'open' : 'closed'}
                variants={{
                    open: { opacity: 1, height: 'auto' },
                    closed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden bg-gray-800"
            >
                <div className="px-4 pt-2 pb-3 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </motion.nav>
        </header>
    );
};

export default Header;