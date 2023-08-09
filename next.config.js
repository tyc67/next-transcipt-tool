/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude specific folder from being bundled
      config.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /backup/,
      })
    }

    return config
  },
}

module.exports = nextConfig
