/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import Button from './Button.jsx';

function Welcome(props) {
  const { currentUser, signOut } = props;
  return (
    <>
      <Button key={1} signOut={signOut} />
      <div>
        <p>
          Welcome,
          {' '}
          {currentUser}
        </p>
      </div>
    </>
  );
}

export default Welcome;
