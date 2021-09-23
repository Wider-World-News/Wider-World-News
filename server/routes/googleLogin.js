/* eslint-disable import/extensions */
const express = require('express');
const { google } = require('googleapis');

const router = express.Router();

// file dependencies
const googleController = require('../controllers/googleController.js');
const apiController = require('../controllers/apiController.js');

// executes when a user signs in with google, redirects to /callback
router.get('/', googleController.login);

// redirected from /
router.get('/callback', googleController.getCredentials, (req, res) => {
  if (res.locals.redirectUrl) {
    res.redirect(res.locals.redirectUrl);
  } else {
    res
      .sendStatus(404)
      .statusMessage('There was an error with the  credentials request. Please try again.');
  }
});

// redirected from callback
router.use('/googleuserloggedin/:user_id/',
  (req, res, next) => {
    // res.locals.user = req.params.user_id;
    res.locals.username = req.params.user_id;
    res.locals.password = req.params.user_id;
    res.redirect('/api/login');
  });

module.exports = router;
