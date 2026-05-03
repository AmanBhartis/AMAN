const serverless = require("serverless-http");
const { createApp, initialize } = require("./_app");

// import your routes
const authRoutes = require("./auth");
const farmRoutes = require("./farm");

const app = createApp();

// attach routes
app.use("/api/auth", authRoutes);
app.use("/api/farm", farmRoutes);

module.exports = async (req, res) => {
  await initialize();
  return serverless(app)(req, res);
};