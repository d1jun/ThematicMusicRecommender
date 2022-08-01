import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import './GetTracks.css'

const ALBUM_TRACKS_ENDPOINT = `https://api.spotify.com/v1/albums/`;
const PLAYLIST_TRACKS_ENDPOINT = `https://api.spotify.com/v1/playlists/`;

function GetTracks() {
  const [token, setToken] = useState("");
  const [playlistTracks, setPlaylists] = useState({});
  const [albumTracks, setAlbums] = useState({});
  const [trackURL, setTrackURL] = useState({});
  // const [trackURL, setTrackURL] = useState("");

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setToken(localStorage.getItem("accessToken"));
    }
  }, []);

  useEffect(() => {
    async function fetchData(track) {
    // async function fetchData() {
      // const request = await axios.post(trackURL);
      const request = await axios.post(track);
      // console.log(x)
      return request;
    }
    async function fetchPost(){
      for (let i = 0; i<trackURL.length; i++){
        await fetchData(trackURL[i]);
      }
    }
    fetchPost();
  }, [trackURL]);

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
        var playlistTracks = response.data;
        // console.log(response)
        var req = playlistTracks?.items ? (playlistTracks.items.map(item => (`http://localhost:5000/usertracks?spotify_id=${item.track.id}&song=${item.track.name}&artist=${item.track.artists[0].name}`))) : '';
        // req.forEach((x,i) => console.log(x));
        setTrackURL(req)
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
          console.log(response);
          var req = albumTracks?.items ? (albumTracks.items.map(item => (`http://localhost:5000/usertracks?spotify_id=${item.id}&song=${item.name}&artist=${item.artists[0].name}`))) : '';
          setTrackURL(req);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  return (
    <div className='getTracks'>
        {/* <Link to='/load'> */}
            <button className='getTracks__generate' onClick={() => {handleGetPlaylistTracks();handleGetAlbumTracks()}}>
                Generate New Playlist
            </button>
        {/* </Link> */}
        <div className='tracks'>
            {playlistTracks?.items ? playlistTracks.items.map((item) => <p>{item.track.name}</p>) : null}
            {albumTracks?.items ? albumTracks.items.map((item) => <p>{item.name}</p>) : null}
        </div>
    </div>
  )
}

export default GetTracks