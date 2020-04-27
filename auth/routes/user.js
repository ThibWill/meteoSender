const Router = require('express-promise-router');
const { hash } = require("../utils/encrypt");
const { validateEmail } = require("../utils/utils");

const userRoutes = async (db, app) => {

  const router = new Router();

  // Creation of a new account
  router.post("/signUp", async (req, res) => {
    const { email, password } = req.body;

    // Check parameters
    if(!password || !email) {
      return res.status(400).send({err: "Missing parameters"});
    }

    if(!validateEmail(email)) {
      return res.status(400).send({err: "Email is malformed"});
    }

    if(password.length < 5) {
      return res.status(400).send({err: "Password is too short"});
    }

    try {

      // We check if the email already exists or not in the DB
      {
        const { rows } = await db.query(
          `SELECT * FROM public."User" WHERE email = $1`, 
          [email]
        );

        if(rows.length > 0) {
          return res.status(403).send({err: "Email already exists"});
        }
      }

      // Account creation
      const hashPassword = await hash(password);
      await db.query(
        `INSERT INTO public."User"(email, password, created_at) VALUES ($1, $2, NOW())`, 
        [email, hashPassword]
      );
      return res.status(200).send({action: "Account created"});
    } catch(e) {
      return res.status(500).send({err: "An error occured during the creation of the account"});
    }    
  });

  // Path for user wanting to connect on his account
  router.post("/signIn", async (req, res) => {
    const { email, password } = req.body;

    if(!password || !email) {
      return res.status(400).send({err: "Some parameters are missing in the request"});
    }

    try {
      const hashPassword = await hash(password);
      const  { rows } = await db.query(
        `SELECT * FROM public."User" WHERE email = $1 AND password = $2`, 
        [email, hashPassword]
      );

      if(rows.length === 0) {
        return res.status(404).send({err: "User not found"});
      } else {
        return res.status(200).send({user: rows[0]});
      }
    } catch(e) {
      return res.status(500).send({err: "An error occured during the user registration"});
    }
  });

  router.get("/signOut", async (req, res) => {
    res.send("signOut");
  });

  // Path to use to delete an account
  router.post("/deleteAccount", async (req, res) => {
    const { email } = req.body;

    if(!email) {
      return res.status(400).send({err: "Some parameters are missing in the request"});
    }

    try {
      const { rowCount } = await db.query(
        `DELETE FROM public."User" WHERE email = $1`, 
        [email]
      );

      if(rowCount === 0) {
        return res.status(404).send({err: "User to delete not found"});
      } else {
        return res.status(200).send({message: "User deleted"});
      }
    } catch(e) {
      console.log(e);
      return res.status(500).send({err: "An error occured during the suppression of the account"});
    }
  });

  app.use(router);
}

module.exports = userRoutes;