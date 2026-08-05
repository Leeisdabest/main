const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const SCRIPT_PATH = path.join(__dirname, "scripts", "main.lua");

function send(res, status, body, contentType) {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
    "X-Content-Type-Options": "nosniff",
    "Access-Control-Allow-Origin": "*"
  });
  res.end(body);
}

function sendRawScript(res) {
  fs.readFile(SCRIPT_PATH, "utf8", (err, source) => {
    if (err) {
      send(res, 500, "-- script file missing\n", "text/plain; charset=utf-8");
      return;
    }

    send(res, 200, source, "text/plain; charset=utf-8");
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/" || url.pathname === "/index.html") {
    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Nin's Raw Code</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0b0d13; color: #f4f7ff; font-family: Arial, sans-serif; }
    main { width: min(680px, calc(100% - 32px)); border: 1px solid #283044; border-radius: 16px; padding: 28px; background: #121622; box-shadow: 0 20px 60px rgba(0,0,0,.35); }
    h1 { margin: 0 0 10px; font-size: 30px; }
    p { color: #aeb8d1; line-height: 1.5; }
    code { display: block; white-space: pre-wrap; word-break: break-all; background: #090b10; border: 1px solid #252b3b; border-radius: 10px; padding: 14px; color: #99ffca; }
    a { color: #7da2ff; font-weight: 700; }
  </style>
</head>
<body>
  <main>
    <h1>Nin's Raw Code</h1>
    <p>Raw Lua endpoint:</p>
    <p><a href="/raw.lua">/raw.lua</a></p>
    <code>loadstring(game:HttpGet("${url.origin}/raw.lua"))()</code>
  </main>
</body>
</html>`;
    send(res, 200, html, "text/html; charset=utf-8");
    return;
  }

  if (url.pathname === "/raw.lua" || url.pathname === "/script.lua" || url.pathname === "/main.lua") {
    sendRawScript(res);
    return;
  }

  send(res, 404, "not found\n", "text/plain; charset=utf-8");
});

server.listen(PORT, () => {
  console.log(`Raw code site running on port ${PORT}`);
});
