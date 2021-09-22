const axios = require('axios');
// const bcrypt = require('bcryptjs');
// const models = require('../models/mapModels');

const populationController = {};

populationController.getPopulationData = (req, res, next) => {
  const { countryName } = req.params;
  const populationRequest = {
    method: 'GET',
    url: 'https://world-population.p.rapidapi.com/population',
    params: { country_name: countryName },
    headers: {
      'x-rapidapi-host': 'world-population.p.rapidapi.com',
      'x-rapidapi-key': '0a9cc778c4msh8ec778a834e5103p1683bajsn6db8490b850c',
    },
  };

  axios.request(populationRequest)
    .then((response) => {
      const { population } = response.data.body;
      res.locals.population = population;
      next();
    }).catch((error) => {
      const defaultErr = {
        log: 'Error handler caught an error inside getData',
        status: 500,
        message: { err: `An error occurred inside a middleware named getPopulationData : ${error}` },
      };
      next(defaultErr);
    });
};

module.exports = populationController;