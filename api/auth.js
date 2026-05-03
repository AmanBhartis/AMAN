const express = require("express");
const serverless = require("serverless-http");
const { createApp, initialize } = require("./_app");
const authRoutes = require("../backend/routes/auth");

let handler;

module.exports = async (req, res) => {
  if (!handler) {
    await initialize();
    const app = createApp();
    app.use("/", authRoutes);

    if (typeof authRoutes.seedDemoFarmer === "function") {
      await authRoutes.seedDemoFarmer(app);
    }

    handler = serverless(app);
  }
  return handler(req, res);
};
