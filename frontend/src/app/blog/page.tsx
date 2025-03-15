'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for blog posts
const blogPosts = [
    {
        id: 1,
        title: 'The Future of AI Development',
        excerpt: 'Exploring the latest trends and innovations in artificial intelligence development.',
        date: 'March 15, 2024',
        readTime: '5 min read',
        imageUrl: '/blog/ai-development.jpg',
        category: 'Technology',
    },
    {
        id: 2,
        title: 'Building Scalable Web Applications',
        excerpt: 'Best practices and architecture patterns for building scalable web applications.',
        date: 'March 10, 2024',
        readTime: '7 min read',
        imageUrl: '/blog/web-development.jpg',
        category: 'Development',
    },
    // Add more blog posts as needed
];

export default function Blog() {
    return (
        <div className="min-h-screen bg-gray-900 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <h1 className="text-4xl font-bold text-white sm:text-5xl">
                        Latest Insights
                    </h1>
                    <p className="mt-4 text-xl text-gray-400">
                        Discover our thoughts on technology, development, and innovation.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                >
                    {blogPosts.map((post) => (
                        <Link href={`/blog/${post.id}`} key={post.id}>
                            <motion.article
                                whileHover={{ scale: 1.02 }}
                                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-shadow hover:shadow-2xl"
                            >
                                <div className="relative h-48">
                                    <Image
                                        src={post.imageUrl}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-blue-400">
                                            {post.category}
                                        </span>
                                        <span className="text-sm text-gray-400">{post.readTime}</span>
                                    </div>
                                    <h2 className="text-xl font-semibold text-white mb-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-400 mb-4">{post.excerpt}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-400">{post.date}</span>
                                        <span className="text-blue-400 hover:text-blue-300">
                                            Read more →
                                        </span>
                                    </div>
                                </div>
                            </motion.article>
                        </Link>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-16 text-center"
                >
                    <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Load More Posts
                    </button>
                </motion.div>
            </div>
        </div>
    );
}