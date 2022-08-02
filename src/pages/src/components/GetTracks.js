import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './GetTracks.css';

const ALBUM_TRACKS_ENDPOINT = `https://api.spotify.com/v1/albums/`;
const PLAYLIST_TRACKS_ENDPOINT = `https://api.spotify.com/v1/playlists/`;
const RESET_USERTRACKS_ENDPOINT = 'http://127.0.0.1:5000/usertracks';

function GetTracks() {
  const [token, setToken] = useState("");
  const [playlistTracks, setPlaylists] = useState({});
  const [albumTracks, setAlbums] = useState({});
  const [trackURL, setTrackURL] = useState([]);
  const [trackLoaded, setTrackLoaded] = useState(false);
  const [btnclickFlag, setBtnClickFlag] = useState(false);

  const trackLoadedFlag = () => {
    setTrackLoaded(true);
    setBtnClickFlag(true);
  }
  const handleLinkToLoad = () => {
    if (trackLoaded) {
      window.location.replace(window.location.origin + '/load');
    }
  }
  // reset user tracks in songs.csv
  async function deleteUserSongs() {
    await axios.delete(RESET_USERTRACKS_ENDPOINT);
  }

  // set token
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setToken(localStorage.getItem("accessToken"));
    }
  }, []);

  // make the POST requests to get the tracks from spotify
  useEffect(() => {
    // reset songs before repopulating
    deleteUserSongs();
    // async makes the program wait until the post request is finished
    async function fetchData(track) {
      const request = await axios.post(track);
      return request;
    }
    async function fetchPost(){
      for (let i = 0; i<trackURL.length; i++){
        await fetchData(trackURL[i]);
      }
      handleLinkToLoad();
    }
    fetchPost();
  }, [trackURL]);

  // sets trackURL to an array of song endpoints from spotify
  useEffect(() => {
      var req = albumTracks?.items ? (albumTracks.items.map(item => (`http://localhost:5000/usertracks?spotify_id=${item.id}&song=${item.name}&artist=${item.artists[0].name}`))) : '';
      setTrackURL(req);
      // req.forEach((x,i) => console.log(x));
  }, [albumTracks]);
  useEffect(() => {
      var req = playlistTracks?.items ? (playlistTracks.items.map(item => (`http://localhost:5000/usertracks?spotify_id=${item.track.id}&song=${item.track.name}&artist=${item.track.artists[0].name}`))) : '';
      setTrackURL(req)
  }, [playlistTracks]);

  // retrieve the tracks from the selected playlist
  const handleGetPlaylistTracks = () => {
    var playlist = document.getElementById('playlists');
    var selectPlaylistID = playlist.options[playlist.selectedIndex].value;
    axios
      .get(PLAYLIST_TRACKS_ENDPOINT + selectPlaylistID + '/tracks', {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setPlaylists(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // retrieve the tracks from the selected album
  const handleGetAlbumTracks = () => {
      var album = document.getElementById('playlists');
      var selectAlbumID = album.options[album.selectedIndex].value;
      axios
        .get(ALBUM_TRACKS_ENDPOINT + selectAlbumID + '/tracks', {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          setAlbums(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  return (
    <div className='getTracks'>
        {btnclickFlag ? <p>Loading...</p> : 
          <button className='getTracks__generate' onClick={() => {handleGetPlaylistTracks();handleGetAlbumTracks();trackLoadedFlag()}}>
              Generate New Playlist
          </button>
        }
        {/* <div className='tracks'>
            {playlistTracks?.items ? playlistTracks.items.map((item) => <p>{item.track.name}</p>) : null}
            {albumTracks?.items ? albumTracks.items.map((item) => <p>{item.name}</p>) : null}
        </div> */}
    </div>
  )
}

export default GetTracks