const client = require('../lib/client');
// import our seed data:
const pizzas = require('./pizzas.js')
const usersData = require('./users.js')
const origin = require('./origin.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    
    const user = users[0].rows[0];


    await Promise.all(
      origin.map(o => {
        return client.query(`
                    INSERT INTO origin (origin)
                    VALUES ($1);
                `,
        [ o.origin ]);
      })
    );


    await Promise.all(
      pizzas.map(pizza => {
        return client.query(`
                    INSERT INTO pizzas (name, ingredients, meal, price, delicious, origin_id)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
        [pizza.name, pizza.ingredients, pizza.meal, pizza.price, pizza.delicious, pizza.origin_id ]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
