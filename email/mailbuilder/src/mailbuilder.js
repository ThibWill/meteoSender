const fs = require("fs");
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

const header = readFile("../components/header.html");
const separataion = readFile("../components/separation.html");
const footer = readFile("../components/footer.html");
const Pacifico = readFile("../font/Pacifico/pacifico.html");

async function buildMainEmail(parts) {
  let email = '<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' + Pacifico + '</head>';
  email += "<body style='width: 600px; font-family:Pacifico'>";
  email += header;
  for(let i = 0; i < parts.length; i++) {
    email += separataion;
    email += parts[i];
  }
  email += footer;
  email += "</body>";
  return email;
}

async function run() {
  /*const news = await callModule("news");
  const meteo = await callModule("meteo");  
  const email = await buildMainEmail([meteo, news]);*/
  const email = await buildMainEmail([]);
  console.log(email);
  /*sendEmail({
    email: {
      recipient: "thibault.willer@gmail.com",
      content: email,
      subjectEmail: "DailyMail du 17/05/2020",
    }
  })*/
}

run();
