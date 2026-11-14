"use strict";
const dns = require("node:dns/promises");
const http = require("node:http");
const https = require("node:https");
const { BlockList, isIP } = require("node:net");

class ResolverError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

const private4 = new BlockList();
for (const [address, prefix] of [
  ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10],
  ["127.0.0.0", 8], ["169.254.0.0", 16], ["172.16.0.0", 12],
  ["192.0.0.0", 24], ["192.0.2.0", 24], ["192.88.99.0", 24],
  ["192.168.0.0", 16], ["198.18.0.0", 15], ["198.51.100.0", 24],
  ["203.0.113.0", 24], ["224.0.0.0", 4], ["240.0.0.0", 4],
]) private4.addSubnet(address, prefix, "ipv4");
const global6 = new BlockList();
global6.addSubnet("2000::", 3, "ipv6");
const private6 = new BlockList();
for (const [address, prefix] of [
  ["2001::", 23], ["2001:db8::", 32], ["2002::", 16], ["3fff::", 20],
]) private6.addSubnet(address, prefix, "ipv6");

function isPublicAddress(address) {
  const family = isIP(address);
  if (family === 4) return !private4.check(address, "ipv4");
  if (family === 6)
    return global6.check(address, "ipv6") && !private6.check(address, "ipv6");
  return false;
}

function parseUrl(value, base) {
  if (typeof value !== "string" || !value.trim() || value.length > 4096 || /[\x00-\x1f\x7f]/.test(value))
    throw new ResolverError("URL không hợp lệ hoặc dài quá 4.096 ký tự.");
  let url;
  try { url = new URL(value, base); }
  catch { throw new ResolverError("URL không hợp lệ."); }
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.port)
    throw new ResolverError("Chỉ nhận HTTP/HTTPS trên cổng mặc định, không chứa thông tin đăng nhập.");
  if (url.href.length > 4096) throw new ResolverError("URL dài quá 4.096 ký tự.");
  return url;
}

// Race DNS and injected operations against the overall deadline as well as sockets.
function abortable(operation, signal) {
  signal.throwIfAborted();
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason);
    signal.addEventListener("abort", abort, { once: true });
    Promise.resolve(operation).then(resolve, reject).finally(() => signal.removeEventListener("abort", abort));
  });
}

async function pinAddress(url, lookup, signal) {
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  const family = isIP(hostname);
  const addresses = family
    ? [{ address: hostname, family }]
    : await abortable(lookup(hostname, { all: true, verbatim: true }), signal);
  // Reject mixed public/private answers; validate again at every redirect.
  if (!addresses.length || addresses.some(({ address }) => !isPublicAddress(address)))
    throw new ResolverError("Không tra URL trỏ tới địa chỉ nội bộ hoặc địa chỉ dành riêng.");
  return addresses.find((entry) => entry.family === 4) || addresses[0];
}

function requestHeaders(url, address, signal) {
  return new Promise((resolve, reject) => {
    const transport = url.protocol === "https:" ? https : http;
    const request = transport.request(url, {
      method: "GET",
      agent: false,
      family: address.family,
      autoSelectFamily: false,
      signal,
      maxHeaderSize: 16384,
      // Keep the original hostname for Host/TLS, but connect only to the vetted IP.
      lookup: (_hostname, options, callback) => {
        if (options.all) callback(null, [address]);
        else callback(null, address.address, address.family);
      },
      headers: { "User-Agent": "PersonalTools-URLResolver/1.0", Accept: "*/*" },
    }, (response) => {
      resolve({ status: response.statusCode, location: response.headers.location });
      // The resolver consumes headers only, never executes HTML/JS or retains cookies.
      response.destroy();
    });
    request.on("error", reject);
    request.on("upgrade", (_response, socket) => {
      socket.destroy();
      reject(new ResolverError("Trang yêu cầu giao thức không được hỗ trợ.", 502));
    });
    request.end();
  });
}

function createResolver({ lookup = dns.lookup, request = requestHeaders, timeoutMs = 12000, maxRedirects = 8 } = {}) {
  return async function resolveUrl(value, callerSignal) {
    const signal = AbortSignal.any([AbortSignal.timeout(timeoutMs), ...(callerSignal ? [callerSignal] : [])]);
    const hops = [];
    const visited = new Set();
    let url = parseUrl(value);
    const originalUrl = url.href;
    try {
      while (true) {
        signal.throwIfAborted();
        const networkUrl = new URL(url);
        networkUrl.hash = "";
        if (visited.has(networkUrl.href)) throw new ResolverError("Phát hiện vòng lặp chuyển hướng.", 422);
        visited.add(networkUrl.href);
        const address = await pinAddress(url, lookup, signal);
        const response = await abortable(request(url, address, signal), signal);
        hops.push({ url: url.href, status: response.status });
        if ([301, 302, 303, 307, 308].includes(response.status)) {
          if (!response.location) throw new ResolverError("Trang chuyển hướng không cung cấp link đích.", 502);
          if (hops.length > maxRedirects) throw new ResolverError(`Link chuyển hướng quá ${maxRedirects} lần.`, 422);
          const next = parseUrl(response.location, url);
          if (!response.location.includes("#")) next.hash = url.hash;
          url = next;
          continue;
        }
        if (response.status < 200 || response.status >= 300)
          throw new ResolverError(`Trang trả HTTP ${response.status}; chưa xác định được link đích.`, 502);
        return { originalUrl, finalUrl: url.href, hops };
      }
    } catch (error) {
      if (signal.aborted) throw new ResolverError("Tra cứu đã bị hủy hoặc vượt quá thời gian chờ.", 504);
      if (error instanceof ResolverError) throw error;
      throw new ResolverError("Không kết nối được tới trang. Link có thể đã hết hạn hoặc chặn tra cứu tự động.", 502);
    }
  };
}

module.exports = { createResolver, ResolverError, isPublicAddress, parseUrl, requestHeaders };
