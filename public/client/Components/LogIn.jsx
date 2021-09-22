/* eslint-disable react/button-has-type */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';

function LogIn(props) {
  const { loginButton, signUp, loginAttempt } = props;
  return (
    <div>
      Log In
      <div id="inputButtonWrapper">
        <input name="username" placeholder="username" id="username" autoComplete="off" />
        <input name="password" placeholder="password" id="password" autoComplete="off" type="password" />
        <div id="buttonsDiv">
          <button onClick={loginButton} value="Log-In"> Log In </button>
          <button onClick={signUp} value="Sign-Up"> Sign-Up </button>
        </div>
        <div />
        <div id="loginAttemptMessage">
          {loginAttempt}
        </div>
      </div>
      <div>
        {/* <div className="g-signin2" data-onsuccess="onSignIn">Log in with Google</div> */}
        <a href="/googlelogin"><button>Log in with Google</button></a>
      </div>
    </div>
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
