const http = require("http");
const url = require("url");

const { sendEmail } = require("./sender.js");

const port = 80;

const server = http.createServer(async (req, res) => {
  const path = url.parse(req.url).pathname;
  if (path === "/sendEmail") {
      let body = "";
      await req.on('data', async (chunk) => {
        body += chunk;
      })
      await req.on('end', async () => {
        try {
          console.log(body);
          body = JSON.parse(body);
          if(body.email.content && body.email.subjectEmail) {
            await sendEmail(body.email.content, body.email.subjectEmail);
            await buildresponse(res, 200, "email sent");
          } else {
            //TODO LOGS
            console.log("Bad request")
            await buildresponse(res, 400, "bad request");
          }
        } catch(e) {
          // TODO LOGS
          console.log(e)
          await buildresponse(res, 400, "bad request");
        }
      })
  } else {
    await buildresponse(res, 404, "wrong path");
  }
});

async function buildresponse(res, code, text) {
  res.writeHead(code, { 'Content-Type': 'text/plain' });
  res.write(text);
  res.end();
}

server.listen(port);