const express = require('express');
const apiController = require('../controllers/apiController');

const router = express.Router();

const populationRouter = require(path.join(__dirname, 'routes/populationData.js'));
const newsDataRouter = require(path.join(__dirname, 'routes/newsDataRoute.js'));
const worldBankRouter = require(path.join(__dirname, 'routes/worldBankRouter.js'));
// router.get('/population/:countryName', apiController.getPopulationData, (req, res) => res.status(200).json(res.locals.population));

//route to population data router
router.use('/population', populationRouter);

//route to news data router for articles
router.use('/getArticles', newsDataRouter);

//will route requests for world bank to the world bank router
router.use('/', worldBankRouter);
//may want to change route from world bank to something else

// route to sign-up
router.post('/signup', apiController.createUser,
  (req, res) => {
    res.status(200).send(res.locals.user);
  });

// route and middlewares to execute when user tries to login
router.post('/login',
  apiController.verifyUser,
  apiController.getUserData,
  (req, res) => {
    res.status(200).json(res.locals.data);
  });

// route and middlewares to execute when user adds favourite links
router.post('/addFav',
  apiController.addFav,
  (req, res) => {
    res.status(200).json(res.locals.user);
  });

// route and middlewares to execute when user wants to delete a favourite link
router.delete('/deleteFav', apiController.deleteFav, (req, res) => {
  res.status(200).json(res.locals.user);
});
module.exports = router;
