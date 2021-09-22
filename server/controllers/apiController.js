const axios = require('axios');
const bcrypt = require('bcryptjs');
const models = require('../models/mapModels');

const apiController = {};

apiController.createUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const newUser = {
      username,
      password,
    };

    const user = await models.Users.findOne({ username });

    if (user) return res.send('User already created').status(304);

    await models.Users.create(newUser);

    console.log(`User: ${username} signed up`);

    res.locals.user = username;
    return next();
  } catch (err) {
    console.log(err);
    return next({
      log: 'Express error handler caught in apiController.createUser middleware',
      status: 500,
      message: { err },
    });
  }
};

// function to verify user when the user tries to login
apiController.verifyUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await models.Users.findOne({ username });

    const hashedPW = user.password;

    const compare = bcrypt.compareSync(password, hashedPW);

    if (!compare) throw Error('Incorrect username or password. Please try again.');

    console.log(`User: ${username} logged in`);
    res.locals.user = username;
    next();
  } catch (err) {
    next({
      log: 'Express error handler caught in apiController.verifyUser middleware',
      status: 500,
      message: { err },
    });
  }
};

// code to get the favourite article links of the user
apiController.getUserData = async (req, res, next) => {
  try {
    const user = await models.Users.findOne({ username: res.locals.user });

    // changed elem => elem.name to elem=>elem.link
    const favoriteArticles = user.favorites.map((elem) => elem);

    res.locals.data = favoriteArticles;
    next();
  } catch (err) {
    next({
      log: 'Express error handler caught in apiController.getUserData middleware',
      status: 500,
      message: { err },
    });
  }
};

// function to add an article link as a favourite

apiController.addFav = async (req, res, next) => {
  try {
    const { currentUser, title, link } = req.body;

    const query = {
      username: currentUser,
    };

    const update = {
      favorites: { title, link },
    };

    await models.Users.findOneAndUpdate(query, { $push: update });

    console.log(`${currentUser} added title: ${title}, link: ${link}`);

    next();
  } catch (err) {
    next({
      log: 'Express error handler caught in apiController.addFav middleware',
      status: 500,
      message: `Express error handler caught in apiController.addFav middleware ${err}`,
    });
  }
};

// add a function to delete an article from the favourite tag
apiController.deleteFav = async (req, res, next) => {
  try {
    const { currentUser, title, link } = req.body;

    const query = {
      username: currentUser,
    };

    const update = {
      favorites: { title, link },
    };

    await models.Users.findOneAndUpdate(query, { $pull: update });

    console.log(`${currentUser} deleted title: ${title}, link: ${link}`);

    next();
  } catch (err) {
    next({
      log: 'Express error handler caught in apiController.deleteFav middleware',
      status: 500,
      message: `Express error handler caught in apiController.deleteFav middleware ${err}`,
    });
  }
};

module.exports = apiController;
