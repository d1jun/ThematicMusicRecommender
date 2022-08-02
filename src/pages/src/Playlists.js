import React, { useEffect } from 'react'
import './Playlists.css'
import { Link } from 'react-router-dom';
import SpotifyGetAlbumsPlaylists from './components/SpotifyGetAlbumsPlaylists';
import GetTracks from './components/GetTracks';
import HomeHeader from './components/HomeHeader';

const LOGIN_ERROR = '?error=access_denied';

function Playlists() {
  useEffect(() => {
    if(window.location.search === LOGIN_ERROR) {
      alert('Login Failed: You must click "Agree" to allow Spotify permissions');
      window.location.replace(window.location.origin + '/login');
      return (
        <h1>Login failed. Redirecting</h1>
      );
    }
  }, []);
  
  const getReturnedParamsFromSpotifyAuth = (hash) => {
    const stringAfterHashtag = hash.substring(1);
    const paramsInUrl = stringAfterHashtag.split("&");
    const paramsSplitUp = paramsInUrl.reduce((accumulator, currentValue) => {
      console.log(currentValue);
      const [key, value] = currentValue.split("=");
      accumulator[key] = value;
      return accumulator;
    }, {});
  
    return paramsSplitUp;
  };
  
  useEffect(() => {
    if (window.location.hash) {
      const { access_token, expires_in, token_type } =
        getReturnedParamsFromSpotifyAuth(window.location.hash);

      localStorage.clear();
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("tokenType", token_type);
      localStorage.setItem("expiresIn", expires_in);
    }
  });
  
  return (
    <div className='playlists'>
        <HomeHeader></HomeHeader>
        <div className='playlists__container'>
            {/* <div className='playlists__themes'>
              <select>Choose a Theme</select>
            </div> */}
              <SpotifyGetAlbumsPlaylists />
              <div className='gettracks__btn'>
                <GetTracks />
              </div>
        </div>
        
        <Link to='/load'>
            <button className='playlistBtn'>Tester btn to load playlist</button>
        </Link>
        {/* {data?.artist ?  <p>{data.artist[0]}</p> : <p>waiting</p>} */}
    </div>
  )
}

export default Playlists