const bodyParser = require("body-parser");

const middlewaresExpress = async (app) => {

  // Body parser to have body in post request easily
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  app.use(bodyParser.json());

}

module.exports = middlewaresExpress;