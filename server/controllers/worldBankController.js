/* eslint-disable no-restricted-syntax */
const axios = require('axios');
const { countries } = require('@aerapass/country-data');

const worldBankController = {};

worldBankController.getEconomicData = (req, res, next) => {
  const exceptionCountries = {
    Russia: 'RUS',
    Venezuela: 'VEN',
    Suriname: 'SUR',
    'French Guiana': 'GUF',
    Bolivia: 'BOL',
    'Democratic Republic of the Congo': 'ZAR',
    'Republic of the Congo': 'COG',
    Tanzania: 'TZA',
    'South Sudan': 'SDN',
    'Ivory Coast': 'CIV',
    Moldova: 'MDA',
    Syria: 'SYR',
    Iran: 'IRN',
    Laos: 'LAO',
  };
  const yAxes = {
    'SP.DYN.CBRT.IN': 'Birth rate, crude (per 1000 people)',
    DPANUSSPB: 'Exchange rate, new LCU per USD',
    'SP.POP.SCIE.RD.P6': 'Researchers in R&D (per million people)',
    'EN.ATM.CO2E.KT': 'CO2 Emissions (kton)',
    'EN.ATM.CO2E.KTbig': 'CO2 Emissions (megaton)',
    'AG.LND.AGRI.ZS': '% Land used Agriculturally',
  };
  let countryCode;
  if (exceptionCountries[req.params.countryName]) {
    countryCode = exceptionCountries[req.params.countryName];
  } else {
    delete countries.all;
    const transposedCountries = {};

    for (let i = 0; i < Object.keys(countries).length; i += 1) {
      const key = countries[Object.keys(countries)[i]];
      transposedCountries[key.name.toLowerCase()] = key.alpha3.toLowerCase();
    }
    countryCode = transposedCountries[req.params.countryName.toLowerCase()];
  }

  try {
    const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${req.params.indicatorCode}?format=json`;
    axios({
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      url,
    })
      .then((response) => {
        let isBig = false;
        if (response.data[1][response.data[1].length - 5].value > 1000000) {
          isBig = true;
        }
        const parentObj = {
          yAxis: isBig
            ? yAxes[req.params.indicatorCode + 'big']
            : yAxes[req.params.indicatorCode],
          data: [],
          countryName: response.data[1][0].country.value,
        };
        for (let i = 0; i < response.data[1].length; i++) {
          parentObj.data.push({
            year: Number(response.data[1][i].date),
            value: isBig
              ? response.data[1][i].value / 1000
              : response.data[1][i].value,
          });
        }
        res.locals.data = parentObj;
        next();
      })
      .catch((error) => next(error));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = worldBankController;
