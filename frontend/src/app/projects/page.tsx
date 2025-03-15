import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function Projects() {
    return (
        <div className="min-h-screen bg-gray-900 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <h1 className="text-4xl font-bold text-white sm:text-5xl">
                        Our Projects
                    </h1>
                    <p className="mt-4 text-xl text-gray-400">
                        Showcasing our latest work and innovations
                    </p>
                </motion.div>

                <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative bg-gray-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
                        >
                            <div className="relative h-64 w-full">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {project.title}
                                </h3>
                                <p className="text-gray-400 mb-4">{project.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1 text-sm text-blue-300 bg-blue-900/30 rounded-full"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <Link
                                    href={project.link}
                                    className="mt-4 inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                >
                                    View Project
                                    <svg
                                        className="ml-2 h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                        />
                                    </svg>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const projects = [
    {
        title: 'AI-Powered Analytics Dashboard',
        description: 'Real-time data visualization platform with machine learning insights.',
        image: '/images/projects/analytics-dashboard.jpg',
        technologies: ['React', 'TypeScript', 'Python', 'TensorFlow'],
        link: '/projects/analytics-dashboard',
    },
    {
        title: 'E-Commerce Platform',
        description: 'Modern e-commerce solution with headless CMS integration.',
        image: '/images/projects/ecommerce.jpg',
        technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
        link: '/projects/ecommerce',
    },
    {
        title: 'IoT Management System',
        description: 'Centralized platform for managing IoT devices and data.',
        image: '/images/projects/iot-platform.jpg',
        technologies: ['React', 'GraphQL', 'MQTT', 'MongoDB'],
        link: '/projects/iot-platform',
    },
    {
        title: 'Healthcare Portal',
        description: 'Secure patient management system with telemedicine features.',
        image: '/images/projects/healthcare.jpg',
        technologies: ['Vue.js', 'FastAPI', 'PostgreSQL', 'WebRTC'],
        link: '/projects/healthcare',
    },
    {
        title: 'Smart City Dashboard',
        description: 'Real-time monitoring and control system for urban infrastructure.',
        image: '/images/projects/smart-city.jpg',
        technologies: ['React', 'Python', 'Kafka', 'TimescaleDB'],
        link: '/projects/smart-city',
    },
    {
        title: 'Educational Platform',
        description: 'Interactive learning platform with AI-powered personalization.',
        image: '/images/projects/education.jpg',
        technologies: ['Next.js', 'Django', 'Redis', 'WebSocket'],
        link: '/projects/education',
    },
];