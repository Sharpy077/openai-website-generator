import { motion } from 'framer-motion';

export default function About() {
    return (
        <div className="relative min-h-screen bg-gray-900">
            <div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
                    >
                        About SharpHorizons
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mt-4 text-lg text-gray-400"
                    >
                        Pioneering the future of web development with innovative solutions and cutting-edge technology.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2"
                >
                    {/* Vision Section */}
                    <div className="relative p-8 bg-gray-800 rounded-2xl">
                        <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
                        <p className="text-gray-300">
                            At SharpHorizons, we envision a digital landscape where technology seamlessly enhances human experiences.
                            Our commitment to innovation drives us to create solutions that not only meet today&apos;s needs but anticipate tomorrow&apos;s challenges.
                        </p>
                        <div className="mt-6 space-y-4">
                            {visionPoints.map((point, index) => (
                                <div key={index} className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="ml-3 text-gray-300">{point}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Technology Stack */}
                    <div className="relative p-8 bg-gray-800 rounded-2xl">
                        <h2 className="text-2xl font-bold text-white mb-4">Our Technology Stack</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {techStack.map((tech, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="p-4 bg-gray-700 rounded-lg"
                                >
                                    <h3 className="font-semibold text-white">{tech.category}</h3>
                                    <p className="mt-2 text-sm text-gray-300">{tech.technologies.join(', ')}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Team Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-16"
                >
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Our Approach</h2>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {approaches.map((approach, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="relative p-6 bg-gray-800 rounded-xl"
                            >
                                <h3 className="text-xl font-semibold text-white mb-3">{approach.title}</h3>
                                <p className="text-gray-300">{approach.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

const visionPoints = [
    "Leading the way in modern web development",
    "Creating seamless, user-centric experiences",
    "Embracing emerging technologies",
    "Delivering scalable, future-proof solutions"
];

const techStack = [
    {
        category: "Frontend",
        technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"]
    },
    {
        category: "Backend",
        technologies: ["Node.js", "Python", "FastAPI", "PostgreSQL"]
    },
    {
        category: "DevOps",
        technologies: ["Docker", "Kubernetes", "Azure", "GitHub Actions"]
    },
    {
        category: "Tools & Analytics",
        technologies: ["Prometheus", "Grafana", "ELK Stack"]
    }
];

const approaches = [
    {
        title: "User-Centric Design",
        description: "We prioritize user experience in every aspect of our development process, ensuring intuitive and engaging interfaces."
    },
    {
        title: "Agile Development",
        description: "Our iterative approach allows for rapid development and continuous improvement based on real feedback."
    },
    {
        title: "Future-Proof Solutions",
        description: "We build scalable applications that can grow and adapt to changing technology landscapes."
    }
];