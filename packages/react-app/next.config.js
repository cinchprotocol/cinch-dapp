const withTM = require("next-transpile-modules")(["eth-hooks"]); // pass the modules you would like to see transpiled

module.exports = {
  ...withTM(),
  env: {
    MONGODB_APP_ID: process.env.MONGODB_APP_ID,
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
    DEFAULT_WEB3_PROVIDER: process.env.DEFAULT_WEB3_PROVIDER,
  },
  async redirects() {
    return [
      {
        source: "/dapp",
        destination: "/revenuestreamsforsale",
        permanent: true,
      },
    ];
  },
};
