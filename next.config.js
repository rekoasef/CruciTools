/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. ACTIVAR SERVER ACTIONS (Obligatorio en Next.js 13)
  experimental: {
    serverActions: true,
  },

  // 2. IGNORAR ADVERTENCIAS MOLESTAS DE WEBPACK
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/@supabase/ },
      { module: /node_modules\/ws/ }
    ];
    return config;
  },
};

module.exports = nextConfig;