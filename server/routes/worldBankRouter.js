const express = require('express');
const worldBankController = require('../controllers/worldBankController');

const router = express.Router();

router.get(
  '/economic/:countryName/:indicatorCode',
  worldBankController.getEconomicData,
  (req, res, next) => {
    res.status(200).send(res.locals.data);
  }
);
router.get('/economic/:countryName');

module.exports = router;
