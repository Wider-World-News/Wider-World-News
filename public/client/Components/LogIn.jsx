/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-array-index-key */
import React from 'react';
// import PropTypes from 'prop-types';

function LogIn(props) {
  const { loginButton, signUp, loginAttempt } = props;
  return (
    <>
      <a href="/googlelogin"><button>Log in with Google</button></a>
      {/* <div className="g-signin2" data-onsuccess="onSignIn">Log in with Google</div> */}
      <button onClick={signUp} value="Sign-Up"> Sign-Up </button>
      <button onClick={loginButton} value="Log-In"> Log In </button>
      <input name="password" placeholder="password" id="password" autoComplete="off" type="password" />
      <input name="username" placeholder="username" id="username" autoComplete="off" />
      <div id="loginAttemptMessage">{loginAttempt}</div>
      <h1>Wider World News</h1>
    </>
  );
}

export default LogIn;
