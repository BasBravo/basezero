import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    output: 'export',
    images: {
        unoptimized: true,
    },
    transpilePackages: ['three'],
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
