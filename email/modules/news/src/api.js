const http = require("http");
const url = require("url");
const { buildMail } = require("./news.js")

const port = 80;

const server = http.createServer(async (req, res) => {
  const path = url.parse(req.url).pathname;
  if (path === "/news") {
    const partEmail = await buildMail();
    if(partEmail) {
      await buildresponse(res, 200, {partEmail});
    } else {
      await buildresponse(res, 500, {err: "error api news"});
    }
  } else {
    await buildresponse(res, 404, {err: "wrong path api news"});
  }
});

async function buildresponse(res, code, json) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(json));
  res.end();
}

server.listen(port);
