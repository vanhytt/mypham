/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/products/:path*',
        destination: '/san-pham/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
