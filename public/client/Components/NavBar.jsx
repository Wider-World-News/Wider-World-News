/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import fetch from 'isomorphic-fetch';
import LogIn from './LogIn.jsx';
import Welcome from './Welcome.jsx';

function NavBar(props) {
  const {
    setFavorites, loginStatus, changeLoginStatus, loginAttempt, changeAttempt, currentUser, changeUser, setCurrentCountryClick, setPosts,
  } = props;

  const loginButton = (e) => {
    const username = document.querySelector('#username');
    const password = document.querySelector('#password');

    if (username.value === '' || password.value === '') {
      const result = 'Please fill out the username and password fields to log in.';
      changeAttempt(result);
    } else {
      const user = {
        username: username.value,
        password: password.value,
      };
      fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),

      })
        .then((res) => res.json())
        .then((data) => {
          if (!Array.isArray(data)) throw Error('wrong');
          if (Array.isArray(data)) {
            setFavorites({});
            const favoritesObj = {};
            data.forEach((elem) => {
              favoritesObj[elem.title] = elem.link;
            });
            setFavorites(favoritesObj);
            changeUser(username.value);
            changeLoginStatus(true);
          }
        })
        .catch((err) => changeAttempt('Incorrect username or password!'));
    }
  };

  const signUp = (e) => {
    const username = document.querySelector('#username');
    const password = document.querySelector('#password');

    if (username.value === '' || password.value === '') {
      const result = 'Please fill out the username and password fields to sign up.';
      changeAttempt(result);
    } else if (password.value.length < 5) {
      const result = 'Please create a password longer than 5 characters';
      changeAttempt(result);
    } else {
      const user = {
        username: username.value,
        password: password.value,
      };
      fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })
        .then((res) => {
          if (res.status === 200) {
            changeLoginStatus(true);
            changeUser(username.value);
          }
        })

        .catch((err) => console.log(err));
    }
  };

  const signOut = () => {
    console.log('test');
    changeLoginStatus(false);
    changeAttempt(null);
    setFavorites({});
    changeUser(null);
    setCurrentCountryClick(null);
    setPosts([]);
  };

  return (
    // eslint-disable-next-line react/jsx-no-comment-textnodes
    <nav>
      {!loginStatus ? <LogIn loginButton={loginButton} signUp={signUp} loginAttempt={loginAttempt} /> : [<Welcome key={1} currentUser={currentUser} signOut={signOut} />]}
    </nav>
  );
}

export default NavBar;
