/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        hostname: "app.darkduck.se",
        // pathname: "/api/v1/images/uploads/**",
        // protocol: "http",
        hostname: "thinkingform.com",
        hostname: "darkduck.s3.eu-north-1.amazonaws.com",
        // pathname: "/wp-content/uploads/2017/09/**",
      },
    ],
  },

  // experimental: {
  //   appDir: true,
  //   serverComponentsExternalPackages: ["mongoose"],
  // },
  // webpack(config) {
  //   config.plugins.push(
  //     new DefinePlugin({
  //       FLUENTFFMPEG_COV: "",
  //     })
  //   );
  //   config.experiments = {
  //     ...config.experiments,
  //     topLevelAwait: true,
  //     asyncWebAssembly: true,
  //   };
  //   return config;
  // },

  // webpack(cfg) {
  //   // make selected env vars avail on client
  //   cfg.plugins.push(
  //     new webpack.DefinePlugin({
  //       FLUENTFFMPEG_COV: "",
  //     })
  //   );
  //   return cfg;
  // },
  webpack: (
    config,
    {
      buildId,
      dev,
      isServer,
      DefinePlugin,
      defaultLoaders,
      nextRuntime,
      webpack,
    }
  ) => {
    // Important: return the modified config
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
        path: false,
        os: false,
        child_process: false,
      },
    };
    config.plugins.push(new webpack.DefinePlugin({ FLUENTFFMPEG_COV: false }));
    return config;
  },
  reactStrictMode: true,
  env: {
    REACT_APP_AUDIO_PATH: process.env.REACT_APP_AUDIO_PATH,
    REACT_APP_IMAGES_PATH: process.env.REACT_APP_IMAGES_PATH,
    ACCESSKEYID: process.env.ACCESSKEYID,
    SECRETACCESSKEY: process.env.SECRETACCESSKEY,
    REGION: process.env.REGION,
  },
};

module.exports = nextConfig;
