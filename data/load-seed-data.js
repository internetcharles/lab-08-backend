const client = require('../lib/client');
// import our seed data:
const pizzas = require('./pizzas.js')
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      pizzas.map(pizza => {
        return client.query(`
                    INSERT INTO pizzas (name, ingredients, meal, price, delicious)
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [pizza.name, pizza.ingredients, pizza.meal, pizza.price, pizza.delicious ]);
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
