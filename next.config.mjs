import TerserPlugin from 'terser-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config, { isServer }) {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
              },
            },
          }),
        ],
        usedExports: true,
      };
      config.module.rules.push(
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      );
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'letsmetrix.com',
        port: '',
        pathname: '/admin-blog/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/app-store/listing_images/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.letsmetrix.com',
        port: '',
        pathname: '/app-store/listing_images/**',
      },
    ],
  },
  experimental: {
    forceSwcTransforms: true,
  },
};

export default nextConfig;
