import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="relative min-h-screen">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-secondary-900 to-primary-800 animate-gradient opacity-90" />

            {/* Content */}
            <div className="relative z-10 px-4 py-32 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                        Welcome to{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                            SharpHorizons
                        </span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                        Crafting cutting-edge digital experiences for the modern web.
                        We bring your vision to life with innovative technology and stunning design.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            href="/about"
                            className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all duration-200"
                        >
                            Learn more
                        </Link>
                        <Link
                            href="/projects"
                            className="text-sm font-semibold leading-6 text-white hover:text-primary-300 transition-colors duration-200"
                        >
                            View our work <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-32 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {features.map((feature, _index) => (
                        <div
                            key={feature.title}
                            className="relative rounded-2xl bg-white/5 p-6 backdrop-blur-lg ring-1 ring-white/10 hover:ring-white/20 transition-all duration-300"
                        >
                            <dt className="text-lg font-semibold text-white">
                                {feature.title}
                            </dt>
                            <dd className="mt-2 text-gray-400">
                                {feature.description}
                            </dd>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

const features = [
    {
        title: 'Modern Design',
        description: 'Creating beautiful, responsive interfaces that engage and delight users across all devices.',
    },
    {
        title: 'Performance First',
        description: 'Optimized for speed and efficiency, ensuring your website loads quickly and runs smoothly.',
    },
    {
        title: 'Future Ready',
        description: 'Built with cutting-edge technology to keep your digital presence ahead of the curve.',
    },
];