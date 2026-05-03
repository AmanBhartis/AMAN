const express = require("express");
const serverless = require("serverless-http");
const { createApp, initialize } = require("./_app");
const farmRoutes = require("../backend/routes/farm");

let handler;

module.exports = async (req, res) => {
  if (!handler) {
    await initialize();
    const app = createApp();
    app.use("/", farmRoutes);
    handler = serverless(app);
  }
  return handler(req, res);
};
