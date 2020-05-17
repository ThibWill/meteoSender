const Router = require('express-promise-router');

const recipeRoutes = async (db, app) => {

  const router = new Router();

  router.post("/modifyPreference", async (req, res) => {
    const { preferenceName, newValue, email, particularityName, particularityValue } = req.body;

    if(!preferenceName || !newValue || !email) { return res.status(400).send({err: "Missing parameters"}); }
    if(newValue*1 !== 0 && newValue*1 !== 1) { return res.status(400).send({err: "Wrong input value"}); }

    let user;
    // Get id user
    try {
      const { rowCount, rows } = await db.query(
        `SELECT * FROM public."User" WHERE email = $1`, 
        [email]
      )
      if(rowCount !== 1) {
        return res.status(404).send({err: "Error when trying to recongnize the user (user doesn't exist or multiple user found)"});
      }
      user = rows[0];
    } catch(e) {
      return res.status(500).send({err: "Error when trying to recongnize the user (database connexion)"});
    }

    // Get preference
    try {
      const { rowCount, rows } = await db.query(
        `SELECT * FROM public."Service" WHERE name = $1`, 
        [preferenceName]
      );
      if(rowCount === 0) {
        return res.status(404).send({err: "Error when trying to find the preference"});
      }
      const service = rows[0];

      await db.query(
        `INSERT INTO public."Subscription"(id_user, id_service) VALUES ($1, $2, NOW())`, 
        [user.id, service.id]
      );

      if(particularityName && particularityValue) {
        const { rowCount, rows } = await db.query(
          `SELECT * FROM public."Subscription" WHERE id_user = $1 && id_service = $2`, 
          [user.id, service.id]
        );
        if(rowCount === 0) {
          return res.status(404).send({err: "Error when trying to find the new subscription"});
        }
        const subscription = rows[0];

        const { rowCount, rows } = await db.query(
          `SELECT * FROM public."Particularity" WHERE id_service = $1 && name = $2`, 
          [service.id, particularityName]
        );
        if(rowCount === 0) {
          return res.status(404).send({err: "Error when trying to find the particularity"});
        }
        const particularity = rows[0];

        await db.query(
          `INSERT INTO public."Particularity_Sub"(id_particularity, id_subscription, value) VALUES ($1, $2, $3)`, 
          [particularity.id, subscription.id, particularityValue]
        );
      }
    } catch(e) {
      return res.status(500).send({err: "Error when trying to enable a prefrence for the the user"});
    }

    // Create / delete subscription
    if(newValue === 0) {
      const { rowCount, rows } = await db.query(
        `DELETE FROM public."Preference" WHERE name = $1`, 
        [preferenceName]
      )
    }

    // if creation create particularity of exists
    // if deleation delete particularity

    try {
      await db.query(
        `UPDATE Public."Recipe" SET recipe_name = $1, difficulty = $2, price = $3, 
        duration = $4, created_at = $5, description = $6, number_person = $7
        WHERE recipe_name = $8 AND created_by = $9`, 
        [recipe_name, difficulty, price, duration, 'NOW()', description, number_persons, old_recipe_name, user.id]
      );
    } catch(e) {
      console.log(e);
      return res.status(500).send({err: "Error while updating the recipe"});
    }

    let id_recipe;
    // Get id recipe
    try {
      const {rows} = await db.query(
        `SELECT id FROM Public."Recipe" WHERE created_by = $1 AND recipe_name = $2`, 
        [user.id, recipe_name]
      );
      id_recipe = rows[0].id;
    } catch(e) {
      console.log(e);
      return res.status(500).send({err: "Error while getting the recipe"});
    }

    // Delete old steps
    try {
      await db.query(
        `DELETE FROM Public."RecipeStep" WHERE id_recipe = $1`, 
        [id_recipe]
      );
    } catch(e) {
      console.log(e);
      return res.status(500).send({err: "Error while deletting old steps"});
    }

    // Creation new steps
    for(let i = 0; i < steps.length; i++) {
      if(steps[i].description !== undefined) {
        try {
          
          await db.query(
            `INSERT INTO Public."RecipeStep"(step_number, description, id_recipe) Values($1, $2, $3)`, 
            [i+1, steps[i].description, id_recipe]
          );
        } catch(e) {
          console.log(e);
          // TODO delete recipe
          return res.status(500).send({err: "Error while creating new steps of the recipe"});
        }
      }
    }
    return res.status(200).send({message: "Recipe modified"});
  });

  router.get("/deleteRecipe", async (req, res) => {
    const { recipe_name, pseudo } = req.query;

    if(!recipe_name || !pseudo) {
      return res.status(400).send({err: "Missing parameters"});
    }

    let user;
    // Get id user
    try {
      const { rowCount, rows } = await db.query(
        `SELECT * FROM public."User" WHERE pseudo = $1`, 
        [pseudo]
      )
      if(rowCount !== 1) {
        return res.status(404).send({err: "Error when trying to recongnize the user (user doesn't exist or multiple user found)"});
      }
      user = rows[0];
    } catch(e) {
      return res.status(500).send({err: "Error when trying to recongnize the user (database connexion)"});
    }

    // Get id recipe
    let id_recipe;
    try {
      const {rows, rowCount} = await db.query(
        `SELECT id FROM Public."Recipe" WHERE created_by = $1 AND recipe_name = $2`, 
        [user.id, recipe_name]
      );
      if(rowCount < 1) {
        return res.status(404).send({err: "Recipe not found"});
      }
      id_recipe = rows[0].id;
    } catch(e) {
      console.log(e);
      return res.status(500).send({err: "Error while getting the recipe to delete"});
    }

    // Delete steps recipe
    try {
      await db.query(
        `DELETE FROM Public."RecipeStep" WHERE id_recipe = $1`, 
        [id_recipe]
      );
    } catch(e) {
      console.log(e);
      return res.status(500).send({err: "Error while deletting the steps of the recipe"});
    }

    // Delete recipe
    try {
      await db.query(
        `DELETE FROM Public."Recipe" WHERE created_by = $1 AND recipe_name = $2`, 
        [user.id, recipe_name]
      );
    } catch(e) {
      console.log(e);
      return res.status(500).send({err: "Error while deletting the recipe"});
    }
    res.status(200).send({message: "Recipe deleted"});
  });

  app.use(router);
}

module.exports = recipeRoutes;