const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});





app.get('/pizzas', async(req, res) => {
  const data = await client.query(`
    SELECT pizzas.id, ingredients, meal, price, delicious, origin.origin AS origin_id
      FROM pizzas
      JOIN origin
      ON pizzas.origin_id = origin.id`);

  res.json(data.rows);
});

app.get('/origin', async(req, res) => {
  const data = await client.query(`
  SELECT * FROM origin`);

  res.json(data.rows)
});

app.get('/pizzas/:id', async(req, res) => {
  const pizzaId = req.params.id;

  const data = await client.query(`
  SELECT pizzas.id, ingredients, meal, price, delicious, origin.origin AS origin
    FROM pizzas
    JOIN origin
    ON pizzas.origin_id=origin.id
    WHERE pizzas.id=$1
  `, [pizzaId]);

  res.json(data.rows[0]);
});

app.delete('/pizzas/:id', async(req, res) => {
  const pizzaId = req.params.id;

  const data = await client.query('DELETE FROM pizzas WHERE pizzas.id=$1;', [pizzaId]);

  res.json(data.rows[0]);
});



app.post('/pizzas', async(req, res) => {
  const realNewPizza = {
    name: req.body.name,
    ingredients: req.body.ingredients,
    meal: req.body.meal,
    price: req.body.price,
    delicious: req.body.delicious
  };


  const data = await client.query(`
    INSERT INTO pizzas(name, ingredients, meal, price, delicious )
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [ realNewPizza.name, realNewPizza.ingredients, realNewPizza.meal, realNewPizza.price, realNewPizza.delicious ])
    ;

  res.json(data.rows[0]);
});

app.use(require('./middleware/error'));

module.exports = app;
