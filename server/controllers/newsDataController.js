const axios = require('axios');
// const bcrypt = require('bcryptjs');
// const models = require('../models/mapModels');

const newsDataController = {};

newsDataController.getArticles = async (req, res, next) => {
  const { countryName } = req.params;
  // add the request details for the fetch request that will get the news data
  const requestDetails = {
    method: 'GET',
    url: 'https://free-news.p.rapidapi.com/v1/search',
    params: {
      q: countryName, lang: 'en', page: '1', page_size: '5',
    },
    headers: {
      'x-rapidapi-key':
      '0a9cc778c4msh8ec778a834e5103p1683bajsn6db8490b850c',
      // 'c9dd5fae0bmshb0c6910ac9ff173p1739a1jsn7a43e27d0bc4',
      'x-rapidapi-host': 'free-news.p.rapidapi.com',
    },
  };

  axios.request(requestDetails)
    .then((response) => {
      //   console.log(response.data.articles);
      //   res.locals.articles = response.body;
      const arrOut = [];
      // iterate through the articles recieved and save the required fields in a new object
      for (let i = 0; i < response.data.articles.length; i += 1) {
        const currentItem = response.data.articles[i];
        arrOut[i] = {
          title: currentItem.title,
          summary: currentItem.summary,
          link: currentItem.link,
          media: currentItem.media,
        };
      }
      // assign it to res.locals and send back
      res.locals.articles = arrOut;

      return next();
    }).catch((err) => {
      const defaultErr = {
        log: 'Error handler caught an error inside getArticles',
        status: 500,
        message: { err: `An error occurred inside a middleware named getArticles : ${err}` },
      };
      next(defaultErr);
    });

  // get the country name of the country clicked by the user on the FE and store it in a variable

  // Send a server side request to the API
  // search the API with COUNTRY and SAVE THE RESPONSE
  // using axios, fetch the response and save the required details like Title, Summary, url link
  // call next() and send it to the next middleware
  // send it back to front end as required by the FE
};

module.exports = newsDataController;