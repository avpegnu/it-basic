"use strict";
// Vercel discovers /api/*.js automatically. Share the resolver with the VPS service.
const { createHandler } = require("../deploy/qr-resolver/server.cjs");

module.exports = createHandler({
  allowedOrigin: process.env.ALLOWED_ORIGIN || "https://it.avpegnu.io.vn",
});
