/* eslint-disable react/button-has-type */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import fetch from 'isomorphic-fetch';
import Map from './Map.jsx';
// import LogIn from './LogIn.jsx';
// import Welcome from './Welcome.jsx';
import FavoriteList from './FavoriteList.jsx';
import NewsFeed from './NewsFeed.jsx';
import NavBar from './NavBar.jsx';

function App() {
  const [currentFavorites, setFavorites] = useState({});
  const [loginStatus, changeLoginStatus] = useState(false);
  const [loginAttempt, changeAttempt] = useState(null);
  const [currentUser, changeUser] = useState(null);
  const [currentCountryClick, setCurrentCountryClick] = useState(null);
  const [posts, setPosts] = useState([]);

  const getPosts = (countryName) => {
    setTimeout(async () => {
      const postFetchData = await fetch(`/api/getArticles/${countryName}`);
      const postsArr = await postFetchData.json();
      setPosts(postsArr);
    },
    1000);
  };

  const addFavorite = (title, link) => {
    const currentFavoritesCopy = { ...currentFavorites };
    const favoriteUpdate = Object.assign(currentFavoritesCopy, { [title]: link });
    setFavorites(favoriteUpdate);
    fetch('/api/addFav', {
      method: 'POST',
      body: JSON.stringify({ currentUser, title, link }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  const deleteFavorite = (title, link) => {
    const currentFavoritesCopy = { ...currentFavorites };
    delete currentFavoritesCopy[title];
    setFavorites(currentFavoritesCopy);
    fetch('/api/deleteFav', {
      method: 'DELETE',
      body: JSON.stringify({ currentUser, title, link }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  return (
    <>
      <NavBar
        setFavorites={setFavorites}
        loginStatus={loginStatus}
        changeLoginStatus={changeLoginStatus}
        loginAttempt={loginAttempt}
        changeAttempt={changeAttempt}
        currentUser={currentUser}
        changeUser={changeUser}
        setCurrentCountryClick={setCurrentCountryClick}
        setPosts={setPosts}
      />
      <div className="wrapper">
        <Map
          setCurrentCountryClick={setCurrentCountryClick}
          setPosts={setPosts}
          getPosts={getPosts}
        />
        <NewsFeed
          currentCountryClick={currentCountryClick}
          posts={posts}
          currentFavorites={currentFavorites}
          setFavorites={setFavorites}
          addFavorite={addFavorite}
          deleteFavorite={deleteFavorite}
        />

        <FavoriteList
          currentFavorites={currentFavorites}
          deleteFavorite={deleteFavorite}
        />
      </div>
    </>
  );
}

export default App;
