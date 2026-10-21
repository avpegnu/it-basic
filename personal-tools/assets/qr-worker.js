"use strict";
importScripts("vendor/jsQR.js");

self.onmessage = ({ data }) => {
  try {
    const result = jsQR(
      new Uint8ClampedArray(data.buffer),
      data.width,
      data.height,
      {
        inversionAttempts: "attemptBoth",
      },
    );
    self.postMessage({ result: result ? { data: result.data } : null });
  } catch {
    self.postMessage({ error: "decode failed" });
  }
};
