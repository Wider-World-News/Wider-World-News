/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-array-index-key */
import React from 'react';
// import PropTypes from 'prop-types';

function LogIn(props) {
  const { loginButton, signUp, loginAttempt } = props;
  return (
    <>
      <div className="g-signin2" data-onsuccess="onSignIn">Log in with Google</div>
      <button onClick={signUp} value="Sign-Up"> Sign-Up </button>
      <button onClick={loginButton} value="Log-In"> Log In </button>
      <input name="password" placeholder="password" id="password" autoComplete="off" type="password" />
      <input name="username" placeholder="username" id="username" autoComplete="off" />
      <div id="loginAttemptMessage">{loginAttempt}</div>
      <h1>Wider World News</h1>
    </>
  );
}

// LogIn.propTypes = {
//   // eslint-disable-next-line react/forbid-prop-types
//   loginButton: PropTypes.func.isRequired,
//   signUp: PropTypes.func.isRequired,
//   // eslint-disable-next-line react/forbid-prop-types
//   loginAttempt: PropTypes.any.isRequired,
// };

export default LogIn;
