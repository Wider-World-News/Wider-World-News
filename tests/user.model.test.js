const mongoose = require('mongoose');
const {Users} = require('../server/models/mapModels');

const dbURI = 'mongodb://127.0.0.1/testDB'

require("dotenv").config();
jest.setTimeout(6000);
//before any test, delete the test db
beforeAll(async () => {
  try {
    await mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, () =>
      console.log("connected"));
  } catch (error) {
    console.log("could not connect");
  }  
  await Users.deleteMany({});
});
//after each test, delete the db in case we chain tests
afterEach(async () => {
  await Users.deleteMany({});
});
afterAll(async () => {
  await mongoose.connection.close();
})

describe("user unit tests" , () => {
  it('can create a new user', async () => {
    const createdUser = await Users.create({ username: "testUser", password: "testPassword" });
    const lastUser = await Users.findOne({}).sort({_id: -1}).limit(1);
    expect(lastUser.username).toEqual(createdUser.username);
  });
});