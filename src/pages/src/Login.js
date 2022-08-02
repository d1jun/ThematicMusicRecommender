import React from 'react';
import './Login.css'
import { Link } from 'react-router-dom'
import HomeHeader from './components/HomeHeader';

const CLIENT_ID = 'b00b32733ce64a23bf4d55d2d36f84d0'

const SPOTIFY_AUTHORIZE_ENDPOINT = 'https://accounts.spotify.com/authorize?'
const REDIRECT_URI = 'http://localhost:3000/playlists'
const SCOPES = ['playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read']
const SPACE_DELIMITER = '%20'
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER)

function Login() {
    const signIn = e => {
        e.preventDefault();
        window.location.replace(`${SPOTIFY_AUTHORIZE_ENDPOINT}client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`);
    }

    return (
        <div className='login'>
            <HomeHeader></HomeHeader>
            <div className='login__container'>
                <h1>Sign in with Spotify</h1>
                <h5>to continue with Thematic Music Recommender</h5>

                <form>
                    {/* <h5>Spotify Email or username</h5>
                    <input type='text' value={email} onChange={e => setEmail(e.target.value)} />

                    <h5>Password</h5>
                    <input type='password' value={password} onChange={e => setPassword(e.target.value)} /> */}
                    <button type='submit' onClick={signIn} className='login__signInButton'>Sign In</button>
                </form>

                {/* <p>
                    Sign-in authentication is achieved purely via Spotify. Your
                    Spotify login information is not stored by this app.
                </p> */}
            </div>

            <Link to='/playlists'>
                <button className='playlistBtn'>Tester btn to playlist</button>
            </Link>
        </div>
    )
}

export default Login