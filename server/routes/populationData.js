const express = require('express');
const populationController = require('../controllers/populationController');

const router = express.Router();

router.get('/:countryName', populationController.getPopulationData, (req, res) => res.status(200).json(res.locals.population));

module.exports = router;