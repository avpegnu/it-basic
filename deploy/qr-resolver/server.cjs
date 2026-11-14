"use strict";
const http = require("node:http");
const { createResolver, ResolverError } = require("./resolve.cjs");

async function readJson(request) {
  if (Number(request.headers["content-length"]) > 8192)
    throw new ResolverError("Dữ liệu gửi lên quá lớn.", 413);
  // Vercel supplies a lazy, parsed body; its stream may already be consumed.
  let parsed;
  try { parsed = request.body; }
  catch { throw new ResolverError("JSON không hợp lệ."); }
  if (parsed !== undefined) {
    const body = typeof parsed === "string" || Buffer.isBuffer(parsed)
      ? parsed.toString() : JSON.stringify(parsed);
    if (Buffer.byteLength(body) > 8192)
      throw new ResolverError("Dữ liệu gửi lên quá lớn.", 413);
    try { return JSON.parse(body); }
    catch { throw new ResolverError("JSON không hợp lệ."); }
  }
  const chunks = [];
  let length = 0;
  for await (const chunk of request) {
    length += chunk.length;
    if (length > 8192) throw new ResolverError("Dữ liệu gửi lên quá lớn.", 413);
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw new ResolverError("JSON không hợp lệ."); }
}

function createHandler({ resolveUrl = createResolver(), allowedOrigin = "https://it.avpegnu.io.vn", rateLimit = 20, maxActive = 8 } = {}) {
  const clients = new Map();
  let active = 0;
  function send(response, code, data) {
    if (response.destroyed) return;
    response.writeHead(code, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...(code === 429 ? { "Retry-After": "60" } : {}),
    });
    response.end(JSON.stringify(data));
  }
  return async (request, response) => {
    if (request.url !== "/api/expand-url") return send(response, 404, { error: "Không có API này." });
    if (request.method !== "POST") {
      response.setHeader("Allow", "POST");
      return send(response, 405, { error: "API chỉ nhận POST." });
    }
    if (request.headers.origin !== allowedOrigin || request.headers["sec-fetch-site"] === "cross-site")
      return send(response, 403, { error: "Hãy tra link từ trang Personal Tools." });
    if (request.headers["content-type"]?.split(";")[0].trim() !== "application/json")
      return send(response, 415, { error: "API chỉ nhận JSON." });
    // Vercel/Nginx supplies X-Real-IP; Nginx must overwrite the incoming header.
    const ip = request.headers["x-real-ip"] || request.socket.remoteAddress;
    const now = Date.now();
    for (const [key, entry] of clients) if (entry.expires <= now) clients.delete(key);
    const client = clients.get(ip) || { count: 0, expires: now + 60000 };
    if (client.count >= rateLimit || (!clients.has(ip) && clients.size >= 2000))
      return send(response, 429, { error: "Bạn tra cứu quá nhanh. Hãy thử lại sau một phút." });
    client.count++;
    clients.set(ip, client);
    if (active >= maxActive) return send(response, 503, { error: "Máy chủ đang bận. Hãy thử lại sau." });
    active++;
    const controller = new AbortController();
    request.on("error", () => controller.abort());
    response.on("close", () => { if (!response.writableFinished) controller.abort(); });
    const bodyTimer = setTimeout(() => request.destroy(), 5000);
    try {
      const data = await readJson(request);
      clearTimeout(bodyTimer);
      const result = await resolveUrl(data?.url, controller.signal);
      send(response, 200, result);
    } catch (error) {
      send(response, error instanceof ResolverError ? error.status : 500, {
        error: error instanceof ResolverError ? error.message : "Không hoàn tất được tra cứu.",
      });
    } finally {
      clearTimeout(bodyTimer);
      active--;
    }
  };
}

function createServer(options) {
  const server = http.createServer({ maxHeaderSize: 8192, requestTimeout: 10000, headersTimeout: 10000 }, createHandler(options));
  server.maxConnections = 64;
  server.setTimeout(20000, (socket) => socket.destroy());
  return server;
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3040);
  const origin = process.env.ALLOWED_ORIGIN || "https://it.avpegnu.io.vn";
  const server = createServer({ allowedOrigin: origin });
  server.listen(port, "127.0.0.1", () => console.log(`QR resolver listening on 127.0.0.1:${port}`));
}
module.exports = { createServer, createHandler };
