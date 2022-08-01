import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SpotifyGetAlbumsPlaylists.css'

const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists?offset=0&limit=50";
const ALBUMS_ENDPOINT = "https://api.spotify.com/v1/me/albums?offset=0&limit=50"

function SpotifyGetAlbumsPlaylists() {
    const [token, setToken] = useState("");
    const [playlists, setPlaylists] = useState({});
    const [albums, setAlbums] = useState({});
  
    const handleGetPlaylists = () => {
      axios
        .get(PLAYLISTS_ENDPOINT, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          setPlaylists(response.data);
          // console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const handleGetAlbums = () => {
        axios
          .get(ALBUMS_ENDPOINT, {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((response) => {
            setAlbums(response.data);
            // console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
    };

    // runs once on the first render
    useEffect(() => {
      if (localStorage.getItem("accessToken")) {
        setToken(localStorage.getItem("accessToken"));
      }
    }, []);

    // runs when token is changed
    useEffect(() => {
      handleGetAlbums();
      handleGetPlaylists();
    }, [token]);
    
    return (
      <>
        <div className='spotifyGetAlbumsPlaylists'>
            <div className='playlists__userPlaylists'>
                <h1>Choose a Playlist or an Album</h1>
                <select id='playlists' placeholder='Choose a playlist'>
                    <optgroup label='Your Playlists'>
                        {/* <option value={"test"}>TEST1</option> */}
                        {playlists?.items ? playlists.items.map((item) => <option value={item.id}>{item.name}</option>) : null}
                    </optgroup>
                    <optgroup label='Your Albums'>
                        {/* <option value={"test"}>TEST2</option> */}
                        {albums?.items ? albums.items.map((item) => <option value={item.album.id}>{item.album.name}</option>) : null}
                    </optgroup>
                </select>
            </div>
            {/* <button onClick={()=> {handleGetPlaylists();handleGetAlbums()}}>Get Playlists and Albums</button> */}
        </div>
      </>
    );
  };

export default SpotifyGetAlbumsPlaylists