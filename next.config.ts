import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.tokopedia-static.net',
            },
            {
                protocol: 'https',
                hostname: '*.tokopedia.net',
            },
            {
                protocol: 'https',
                hostname: '*.rulltech.web.id',
            },
            {
                protocol: 'https',
                hostname: 'imagekit.io',
            }
        ],
    },
};

export default nextConfig;
