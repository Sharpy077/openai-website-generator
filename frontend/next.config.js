/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    swcMinify: true,
    poweredByHeader: false,
    compress: true,
    images: {
        domains: [
            'localhost',
            'sharphorizons.tech',
            'avatars.githubusercontent.com',
            'lh3.googleusercontent.com'
        ]
    },
    // Disable server actions warning
    typescript: {
        ignoreBuildErrors: false
    },
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['@mui/material', '@mui/icons-material'],
    },
    // Add webpack configuration for Prisma
    webpack: (config, { dev, isServer }) => {
        if (!dev && !isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            };
            config.optimization = {
                ...config.optimization,
                splitChunks: {
                    chunks: 'all',
                    minSize: 20000,
                    maxSize: 244000,
                    minChunks: 1,
                    maxAsyncRequests: 30,
                    maxInitialRequests: 30,
                    cacheGroups: {
                        defaultVendors: {
                            test: /[\\/]node_modules[\\/]/,
                            priority: -10,
                            reuseExistingChunk: true,
                        },
                        default: {
                            minChunks: 2,
                            priority: -20,
                            reuseExistingChunk: true,
                        },
                    },
                },
            };
        }
        return config;
    }
}

module.exports = nextConfig