/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  // experimental: {
  //   appDir: true,
  //   serverComponentsExternalPackages: ["mongoose"],
  // },
  // webpack(config) {
  //   config.experiments = { ...config.experiments, topLevelAwait: true };
  //   return config;
  // },
  reactStrictMode: true,
  env: {
    REACT_APP_AUDIO_PATH: process.env.REACT_APP_AUDIO_PATH,
  },
};

module.exports = nextConfig;
