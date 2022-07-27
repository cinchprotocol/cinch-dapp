const withTM = require("next-transpile-modules")(["eth-hooks"]); // pass the modules you would like to see transpiled

const nextConfig = withTM({
    reactStrictMode: true,
    experimental: {
      newNextLinkBehavior: false,
      images: {
        allowFutureImage: true,
      },
    },
  })
  
  module.exports = withTM();
  