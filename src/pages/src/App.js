import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from './Home';
import Login from './Login';
import Playlists from './Playlists'
import LoadPlaylist from './LoadPlaylist';

function App() {
  return (
    <Router>
      <div className="app">
          <Routes>
              <Route path = "/load" element={<LoadPlaylist />} />
              <Route path = "/playlists" element={<Playlists />} />
              <Route path = "/login" element={<Login />} />
              <Route path="/" element={[<Home />]}/>
          </Routes>
      </div>
    </Router>
    
  );
}

export default App;
