const { interpolate } = require('d3-interpolate');
const mongoose = require('mongoose');
const {Users} = require('../server/models/mapModels');

const dbURL = 'mongodb://127.0.0.1/testDB'


//before any test, delete the test db
beforeAll(async () => {
  mongoose.connect(dbURL);
  await Users.deleteMany({});
});
//after each test, delete the db in case we chain tests
afterEach(() => {
  Users.deleteMany({});
});
afterAll(async () => {
  await mongoose.connection.close();
})

describe("user unit tests" , () => {
  it('can create a new user', async () => {
    await Users.create({ username: "testUser", password: "testPassword" });
    User.find({}).sort({_id: -1}).limit(1)
        // .then((products) => {
              // console.log(products[0].voice) 
    // })
  });
});