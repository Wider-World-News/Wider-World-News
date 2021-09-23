const express = require('express');
const apiController = require('../controllers/apiController');
const path = require('path');

const router = express.Router();

const populationRouter = require(path.join(__dirname, '/populationData.js'));
const newsDataRouter = require(path.join(__dirname, '/newsDataRoute.js'));
const worldBankRouter = require(path.join(__dirname, '/worldBankRouter.js'));
const mcache = require('memory-cache');

const cache = (duration) => (req, res, next) => {
  const key = `__express__${req.originalUrl || req.url}`;
  const cachedBody = mcache.get(key);
  if (cachedBody) {
    // console.log('pulling from cache');
    return res.send(cachedBody);
  }
  res.sendResponse = res.send;
  res.send = (body) => {
    // console.log('has been cached');
    mcache.put(key, body, duration * 1000);
    res.sendResponse(body);
  };
  next();
};
// router.get('/population/:countryName', apiController.getPopulationData, (req, res) => res.status(200).json(res.locals.population));

//route to population data router
router.use('/population', cache(10), populationRouter);

//route to news data router for articles
router.use('/getArticles', newsDataRouter);

//will route requests for world bank to the world bank router
router.use('/', worldBankRouter);
//may want to change route from world bank to something else

// route to sign-up
router.post('/signup', apiController.createUser, (req, res) => {
  res.status(200).send(res.locals.user);
});

// route and middlewares to execute when user tries to login
router.post(
  '/login',
  apiController.verifyUser,
  apiController.getUserData,
  (req, res) => {
    res.status(200).json(res.locals.data);
  }
);

// route and middlewares to execute when user adds favourite links
router.post('/addFav', apiController.addFav, (req, res) => {
  res.status(200).json(res.locals.user);
});

// route and middlewares to execute when user wants to delete a favourite link
router.delete('/deleteFav', apiController.deleteFav, (req, res) => {
  res.status(200).json(res.locals.user);
});
module.exports = router;
