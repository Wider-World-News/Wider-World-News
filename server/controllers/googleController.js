const express = require('express');

const router = express.Router();

// file dependencies
const { google } = require('googleapis');
const { oauth2 } = require('googleapis/build/src/apis/oauth2');
// const queryString = require('query-string');
// connect to favorites controller?

// required for decoding web tokesn to object format & creating cookies
const jwt = require('jsonwebtoken');

// use this to create a secret for cookie on each login
const randomString = require('random-string');

// mongoose schema for users
const User = require('../models/mapModels');

//You must create a .env file to store client ID, Client secret, and Redirect Uri follow .env file example
// required for reading .env file
require('dotenv').config();

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, ENCODED_SECRET } = process.env;

// from googleapi docs
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// functionality to check if new user needs to be created
async function checkUser(currentUser) {
  console.log('currentUser:', currentUser);
  try {
    // check if user is currently in database
    const user = await User.DATABSENAME.find({ user_id: currentUser.user_id });
    // if no user found, create new user and return user_id
    if (Array.isArray(user) && user.length === 0) {
      // create new User query string out of passed in currentUser object
      // should be changed to /different enpoint
      const newUser = await User.DATABASENAME.create(currentUser);

      // check in the console for newUser
      console.log(newUser);
    }
    // take user_id & prepare query link for frontend to GET user's info from databse
    const userQuery = `http://localhost:3000/DIFFERENT?user_id=${currentUser.user_id}`;
    return userQuery;
  } catch (err) {
    return {
      err: 'error occured in checkUser function inside googleController.js',
    };
  }
}

const googleController = {};

googleController.login = (req, res) => {
  console.log('inside googleController.login middleware');
  // scopes needed for acces to user data (email and profile)
  try {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];
    // generate url using Google Api library
    const url = oauth2Client.generateAuthUrl({
      // default is 'online', set to 'offline' to get a refresh_token)
      access_type: 'offline',
      scope: scopes,
      response_type: 'code',
    });
    return res.redirect(url);
    // https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?
    // access_type=offline
    // &scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email
    // &response_type=code
    // &client_id=681582185466-s4phiv7hoor5bso81fqt9nkhkeo80fog.apps.googleusercontent.com
    // &redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fgooglelogin%2Fcallback&flowName=GeneralOAuthFlow
  } catch (err) {
    return res
      .sendStatus(404)
      .message(
        'There was an error with your request to the server, please try again'
      );
  }
};

// get users credentials
googleController.getCredentials = async (req, res, next) => {
  // console.log('req queries', req.query);

  const { code } = req.query;
  // get token using access code
  const { tokens } = await oauth2Client.getToken(code);
  // set credentials object (currently empty) to be tokens
  oauth2Client.setCredentials(tokens);
  try {
    // take token id, turn it into human readable info to read users email/name/prof picture, etc.
    const decoded = jwt.decode(oauth2Client.credentials.id_token, {
      complete: true,
    });
    console.log('decoded is defined?', decoded);

    // put all pieces of data form decoded JWT - sub is unique google account id
    const { sub, email, name, picture } = decoded.payload;
    const googleUserInfo = {
      user_id: sub,
      email,
      name,
      picture,
    };
    console.log(googleUserInfo);

    // create correct user query string to send to frontend for database request
    const databaseQuery = await checkUser(googleUserInfo);
    console.log('do we reach this point?');
    // create cookie for each new user session
    // encrtyped jwt should be used in cookie
    const token = jwt.sign(googleUserInfo, ENCODED_SECRET);
    res.cookie('token', token, { httpOnly: true });
    // redirect to databaseQuery string so front end can display data
    res.locals.redirectUrl = databaseQuery;
    next();
  } catch (err) {
    next({
      log: `error in googleController.getCredentials: ERROR = ${err}`,
      message: { err: 'error occured in googleController.getCredentials' },
    });
  }
};

module.exports = googleController;
