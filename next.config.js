module.exports = {
    //... other configurations ...
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          tls: false,
          net: false,
          fs: false,
        };
      }
      return config;
    },
  };