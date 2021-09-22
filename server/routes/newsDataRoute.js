const express = require('express');
const newsDataController = require('../controllers/newsDataController')

const router = express.Router();

router.get('/:countryName', newsDataController.getArticles, (req, res) => res.status(200).json(res.locals.articles));

module.exports = router;