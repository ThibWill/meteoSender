const { DatabaseConnexion } = require("./middlewares/databaseCo");
const express = require("express");
const middlewaresExpress = require("./middlewares/express");
const defaultRoutes = require("./routes/default");
const userRoutes = require("./routes/user");
const recipeRoutes = require("./routes/preferences");


class Server {
  constructor(port) {
    this.db = new DatabaseConnexion();
    this.app = express();
    this.app.listen(port, async () => {
      await middlewaresExpress(this.app);
      await userRoutes(this.db, this.app);
      await recipeRoutes(this.db, this.app);
      await defaultRoutes(this.db, this.app);
      console.log("API OK");
    });
  }
}

const server = new Server(3000);


