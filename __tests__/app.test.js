require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  beforeAll(done => {
    return client.connect(done);
  });

  beforeEach(() => {
    // TODO: ADD DROP SETUP DB SCRIPT
    execSync('npm run setup-db');
  });

  afterAll(done => {
    return client.end(done);
  });

  test('returns pizzas', async() => {

    const expectation = [
      {
        id: 1,
        name: 'chocolate',
        ingredients: 'chocolate, gluttony',
        meal: 'dessert',
        price: 0,
        delicious: false
      },
      {
        id: 2,
        name: 'neapolitan',
        ingredients: 'tomatoes, mozzarella',
        meal: 'dinner',
        price: 10,
        delicious: true
      },
      {
        id: 3,
        name: 'pepperoni',
        ingredients: 'pepperoni, mozzarella, tomatoes',
        meal: 'dinner',
        price: 15,
        delicious: true
      },
      {
        id: 4,
        name: 'cheese',
        ingredients: 'mozzarella, tomatoes',
        meal: 'dinner',
        price: 15,
        delicious: true
      },
      {
        id: 5,
        name: 'sausage',
        ingredients: 'mozzarella, tomatoes, sausage',
        meal: 'dinner',
        price: 15,
        delicious: true
      }
    ];

    const data = await fakeRequest(app)
      .get('/pizzas')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(data.body).toEqual(expectation);
  });
});
