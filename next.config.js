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
  //   config.experiments = {
  //     ...config.experiments,
  //     topLevelAwait: true,
  //     asyncWebAssembly: true,
  //   };
  //   config.module.rules.push(
  //     {
  //       test: /fibonacci\.js$/,
  //       loader: "exports-loader",
  //     },
  //     {
  //       test: /fibonacci\.wasm$/,
  //       loader: "file-loader",
  //       options: {
  //         publicPath: "dist/",
  //       },
  //     }
  //   );
  //   return config;
  // },
  reactStrictMode: true,
  env: {
    REACT_APP_AUDIO_PATH: process.env.REACT_APP_AUDIO_PATH,
    REACT_APP_IMAGES_PATH: process.env.REACT_APP_IMAGES_PATH,
  },
};

module.exports = nextConfig;
