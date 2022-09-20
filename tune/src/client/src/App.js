import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

const socket = io.connect('http://localhost:3001')

function App() {
  const [currSong, changeCurrSong] = useState(
    {
      'Name': 'Mutt',
      'Artist': 'blink-182',
      'Album': 'Enema of the State'
    })

  const sendMessage = () => {
      socket.emit('send_message', { message: 'Hello' })
  }

  const tuneRequest = () => {

  }

  const expandProfile = () => {
    
  }

  const handleSongChange = (songName, songArtist, songAlbum) => {

    changeCurrSong(() => ({
      'Name': songName,
      'Artist': songArtist,
      'Album': songAlbum
    })
    
  )}

  return (
    <div className="App">
      <form onsubmit= { handleSongChange }>
        <label>
          Name:
          <input type="text" name="name"/>
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default App;
