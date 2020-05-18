const fs = require("fs");
const path = require("path");
const { callModule, sendEmail } = require("./services.js")

function readFile(path) {
  try {
    const component = fs.readFileSync(path, 'utf8');
    return component;
  }
  catch(e) {
    throw e;
  }
}

const header = readFile(path.join(__dirname, "../components/header.html"));
const separataion = readFile(path.join(__dirname, "../components/separation.html"));
const footer = readFile(path.join(__dirname, "../components/footer.html"));
const Pacifico = readFile(path.join(__dirname, "../font/Pacifico/pacifico.html"));

async function buildMainEmail(parts) {
  let email = '<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' + Pacifico + '</head>';
  email += "<body style='width:100%; background:#D1D9FF;'>";
  email += Pacifico;
  email += "<div style='width: 600px; font-family:Pacifico; background:white; margin-left:auto; margin-right:auto;'>";
  email += header;
  for(let i = 0; i < parts.length; i++) {
    email += separataion;
    email += parts[i];
  }
  email += footer;
  email += "</div></body>";
  return email;
}

async function run(modules) {
  let partMails = [];

  for(let i = 0; i < modules.length; i++) {
    let part = await callModule(modules[i]);
    partMails.push(part)
  } 

  const email = await buildMainEmail(partMails);
  const today = new Date();
  sendEmail({
    recipient: "thibault.willer@gmail.com",
    content: email,
    subjectEmail: `DailyMail du ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
  })
}

setTimeout(async function() { await run(['meteo', 'news'])  }, 20000);
