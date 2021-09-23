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
const User = require('../models/userModels');

// .env file stores client ID, Client secret, and Redirect Uri
// required for reading .env file
require('dotenv').config();

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, ENCODED_SECRET } = process.env;

// from googleapi docs
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
);

// functionality to check if new user needs to be created
async function checkUser(currentUser) {
  // console.log('currentUser:', currentUser);
  const {
    user_id,
    email,
    name,
    picture,
  } = currentUser;
  try {
    // check if user is currently in database
    const user = await User.Users.find({ username: user_id });
    // if no user found, create new user and return user_id
    if (Array.isArray(user) && user.length === 0) {
      // create new User query string out of passed in currentUser object

      const newUser = await User.Users.create({
        username: user_id,
        password: user_id,
        favorites: [],
        email,
        name,
        picture,
      });

      // check in the console for newUser
      // console.log(newUser);
    }
    // take user_id & prepare query link for frontend to GET user's info from databse
    const redirectUrl = `/googlelogin/googleuserloggedin/${user_id}`;
    
    return redirectUrl;
  } catch (err) {
    return {
      err: 'error occured in checkUser function inside googleController.js',
    };
  }
}

const googleController = {};

googleController.login = (req, res) => {
  // console.log('inside googleController.login middleware');
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
    // console.log(decoded);
    // put all pieces of data form decoded JWT - sub is unique google account id
    const { sub, email, name, picture } = decoded.payload;
    const googleUserInfo = {
      user_id: sub,
      password: sub,
      email,
      name,
      picture,
    };

    // create correct user query string to send to frontend for database request
    const redirectUrl = await checkUser(googleUserInfo);
    
    // create cookie for each new user session
    // encrtyped jwt should be used in cookie
    const token = jwt.sign(googleUserInfo, ENCODED_SECRET);
    res.cookie('token', token, { httpOnly: true });
    // redirect to databaseQuery string so front end can display data
    console.log(redirectUrl);
    res.locals.redirectUrl = redirectUrl;
    next();
  } catch (err) {
    next({
      log: `error in googleController.getCredentials: ERROR = ${err}`,
      message: { err: 'error occured in googleController.getCredentials' },
    });
  }
};

googleController.getUserInfo = async (req, res, next) => {
  console.log('inside getUserInfo middleware', req);
};

module.exports = googleController;
