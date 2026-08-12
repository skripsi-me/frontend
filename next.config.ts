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
			},
		],
	},
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination:
					'https://api.toko-online.rulltech.web.id/api/:path*',
			},
		];
	},
};

export default nextConfig;
