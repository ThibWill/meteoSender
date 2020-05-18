const axios = require("axios");

async function callModule(nameModule) {
  let partEmail = '';
  await axios.get(`http://${nameModule}/${nameModule}`)
  .then((response) => {
    partEmail += response.data.partEmail;
  }).catch((err) => {
    console.error(err);
  });
  return partEmail;
}

async function sendEmail(email) {
  await axios.post('http://mailsender/sendEmail', { email,
    }).then(async (response) => {
      // SAVE LOGS
      console.log("mail sended to api!");
    })
    .catch(async (error) => {
      // SAVE LOGS
      console.log(error);
    }
  )
}

module.exports = {
  callModule,
  sendEmail
}