const { Pool } = require("pg");
const config = require("../config/database.json");

class DatabaseConnexion {
  constructor() {
    this.pool = new Pool({  
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database
    });
    this.startConnection();
  }

  // Test connection with the database
  startConnection() {
    this.pool
      .connect()
      .then(() => console.error('Database connexion succeed'))
      .catch(err =>  {
        console.error(`connection error with the database: \n ${err.stack}`)
      })
  }

  // Method to use to request the database
  async query(text, params) {
    console.log({
      "requestDone": text,
      "params": params
    })
    return await this.pool.query(text, params);
  }
}

module.exports = {
  DatabaseConnexion: DatabaseConnexion
}
