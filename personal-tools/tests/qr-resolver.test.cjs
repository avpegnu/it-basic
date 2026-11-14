const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { once } = require("node:events");
const { createResolver, isPublicAddress, parseUrl, requestHeaders } = require("../../deploy/qr-resolver/resolve.cjs");
const { createServer } = require("../../deploy/qr-resolver/server.cjs");
const publicDns = async () => [{ address: "93.184.215.14", family: 4 }];

test("public IP policy rejects internal, metadata, mapped and reserved addresses", () => {
  for (const address of [
    "0.0.0.0", "10.1.2.3", "100.100.100.200", "127.0.0.1", "169.254.169.254",
    "172.16.0.1", "172.31.255.255", "192.168.1.2", "192.0.0.1", "192.0.2.1",
    "198.18.0.1", "198.51.100.1", "203.0.113.1", "224.0.0.1", "255.255.255.255",
    "::", "::1", "::ffff:127.0.0.1", "::ffff:8.8.8.8", "fc00::1", "fe80::1",
    "64:ff9b::a00:1", "2001::a00:1", "2001:db8::1", "2002:7f00:1::", "3fff::1", "invalid",
  ]) assert.equal(isPublicAddress(address), false, address);
  for (const address of ["1.1.1.1", "8.8.8.8", "93.184.215.14", "172.32.0.1", "2001:4860:4860::8888", "2606:4700:4700::1111"])
    assert.equal(isPublicAddress(address), true, address);
});

test("URL parser restricts protocols, credentials, ports and length", () => {
  for (const value of ["javascript:alert(1)", "file:///etc/passwd", "ftp://example.com", "https://user:secret@example.com", "https://example.com:8443", "http://example.com\n", "x".repeat(4097), null, {}])
    assert.throws(() => parseUrl(value), undefined, String(value));
  assert.equal(parseUrl("https://example.com:443/path?q=1#section").href, "https://example.com/path?q=1#section");
});

test("relative and cross-host redirects retain queries, fragment and order", async () => {
  const calls = [];
  const dnsCalls = [];
  const resolve = createResolver({
    lookup: async (hostname) => { dnsCalls.push(hostname); return publicDns(); },
    request: async (url, address) => {
      calls.push({ url: url.href, address });
      if (calls.length === 1) return { status: 302, location: "/next?q=vi%E1%BB%87t" };
      if (calls.length === 2) return { status: 307, location: "https://final.example/article#new" };
      return { status: 200 };
    },
  });
  const result = await resolve("https://short.example/start#old");
  assert.equal(result.originalUrl, "https://short.example/start#old");
  assert.equal(result.finalUrl, "https://final.example/article#new");
  assert.deepEqual(result.hops.map(hop => hop.status), [302, 307, 200]);
  assert.equal(calls[1].url, "https://short.example/next?q=vi%E1%BB%87t#old");
  assert.deepEqual(dnsCalls, ["short.example", "short.example", "final.example"]);
  assert.ok(calls.every(call => call.address.address === "93.184.215.14"));
});

test("rejects literal and encoded internal targets before opening a socket", async () => {
  let calls = 0;
  const resolve = createResolver({ lookup: publicDns, request: async () => { calls++; return { status: 200 }; } });
  for (const url of ["http://127.0.0.1/", "http://2130706433/", "http://0x7f000001/", "http://[::1]/", "http://[::ffff:127.0.0.1]/", "http://169.254.169.254/"])
    await assert.rejects(resolve(url), /nội bộ/);
  assert.equal(calls, 0);
});

test("rechecks DNS at every hop; rejects mixed DNS and rebinding", async () => {
  let dnsCalls = 0;
  let sockets = 0;
  const resolve = createResolver({
    lookup: async () => ++dnsCalls === 1 ? publicDns() : [{ address: "10.0.0.1", family: 4 }],
    request: async () => { sockets++; return { status: 302, location: "/next" }; },
  });
  await assert.rejects(resolve("https://short.example/"), /nội bộ/);
  assert.equal(sockets, 1);
  const mixed = createResolver({ lookup: async () => [...await publicDns(), { address: "::1", family: 6 }] });
  await assert.rejects(mixed("https://short.example/"), /nội bộ/);
});

test("blocks redirects to private URLs, unsupported protocols and credentials", async () => {
  for (const location of ["http://127.0.0.1/", "http://10.0.0.1/", "http://[fc00::1]/", "file:///etc/passwd", "https://user:password@example.com/"]) {
    let count = 0;
    const resolve = createResolver({ lookup: publicDns, request: async () => { count++; return { status: 302, location }; } });
    await assert.rejects(resolve("https://short.example/"));
    assert.equal(count, 1);
  }
});

test("reports loops, excessive redirects, missing location, HTTP errors and DNS failures", async () => {
  const scenarios = [
    [async () => ({ status: 302, location: "#other" }), /vòng lặp/],
    [async () => ({ status: 301 }), /không cung cấp/],
    [async () => ({ status: 403 }), /HTTP 403/],
    [async () => ({ status: 404 }), /HTTP 404/],
  ];
  for (const [request, pattern] of scenarios)
    await assert.rejects(createResolver({ lookup: publicDns, request })("https://short.example/"), pattern);
  let count = 0;
  await assert.rejects(createResolver({ lookup: publicDns, maxRedirects: 2, request: async () => ({ status: 302, location: `/${++count}` }) })("https://short.example/"), /quá 2 lần/);
  await assert.rejects(createResolver({ lookup: async () => { throw new Error("ENOTFOUND"); } })("https://short.example/"), /Không kết nối/);
});

test("overall deadline covers DNS and transport; caller can cancel", async () => {
  // Keep the event loop alive while AbortSignal.timeout uses unref'd timers.
  const keepAlive = setInterval(() => {}, 1000);
  try {
    await assert.rejects(createResolver({ timeoutMs: 20, lookup: () => new Promise(() => {}) })("https://short.example/"), /thời gian chờ/);
    await assert.rejects(createResolver({ timeoutMs: 20, lookup: publicDns, request: () => new Promise(() => {}) })("https://short.example/"), /thời gian chờ/);
    const controller = new AbortController();
    controller.abort();
    await assert.rejects(createResolver()("https://short.example/", controller.signal), /bị hủy/);
  } finally { clearInterval(keepAlive); }
});

test("transport pins connection address, keeps Host and sends no cookies", async (t) => {
  let headers;
  const target = http.createServer((request, response) => {
    headers = request.headers;
    response.writeHead(302, { Location: "/destination" });
    response.flushHeaders();
    // Intentionally never finish the body: only headers are needed.
  });
  target.listen(0, "127.0.0.1");
  await once(target, "listening");
  t.after(() => { target.closeAllConnections(); target.close(); });
  const url = new URL(`http://pinned.example:${target.address().port}/path`);
  const result = await requestHeaders(url, { address: "127.0.0.1", family: 4 }, AbortSignal.timeout(1000));
  assert.equal(result.status, 302);
  assert.equal(result.location, "/destination");
  assert.equal(headers.host, `pinned.example:${target.address().port}`);
  assert.equal(headers.cookie, undefined);
  assert.equal(headers.authorization, undefined);
});

test("API validates origin/method/body, returns JSON no-store, and limits rate", async (t) => {
  let requests = 0;
  const api = createServer({ rateLimit: 4, allowedOrigin: "https://tools.example", resolveUrl: async (url) => {
    requests++;
    assert.equal(url, "https://short.example/");
    return { finalUrl: "https://final.example/", hops: [{ url, status: 200 }] };
  } });
  api.listen(0, "127.0.0.1");
  await once(api, "listening");
  t.after(() => { api.closeAllConnections(); api.close(); });
  const endpoint = `http://127.0.0.1:${api.address().port}/api/expand-url`;
  const options = { method: "POST", headers: { Origin: "https://tools.example", "Content-Type": "application/json" }, body: JSON.stringify({ url: "https://short.example/" }) };
  assert.equal((await fetch(endpoint)).status, 405);
  assert.equal((await fetch(endpoint, { ...options, headers: { ...options.headers, Origin: "https://evil.example" } })).status, 403);
  assert.equal((await fetch(endpoint, { ...options, headers: { Origin: "https://tools.example" } })).status, 415);
  assert.equal((await fetch(endpoint, { ...options, body: "not JSON" })).status, 400);
  assert.equal((await fetch(endpoint, { ...options, body: JSON.stringify({ url: "x".repeat(9000) }) })).status, 413);
  const response = await fetch(endpoint, options);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("access-control-allow-origin"), null);
  assert.equal((await response.json()).finalUrl, "https://final.example/");
  assert.equal((await fetch(endpoint, options)).status, 200);
  assert.equal((await fetch(endpoint, options)).status, 429);
  assert.equal(requests, 2);
});
