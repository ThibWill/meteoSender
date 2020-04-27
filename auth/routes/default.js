const { Router } = require("express");
const bodyParser = require("body-parser");

const defaultRoutes = (db, app) => {

  const router = new Router();

  // Default route if not exist
  router.get("*", (req, res) => {
    res.status(404).send("Ressource not found");
  });

  app.use(router);
}

module.exports = defaultRoutes;