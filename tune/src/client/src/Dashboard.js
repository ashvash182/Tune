import React, { useEffect, useState } from 'react';
import useAuth from './Custom Hooks/useAuth'
import Container from 'react-bootstrap';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001')

const Dashboard = (props) => {
    const [userName, setUserName] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [expiresIn, setExpiresIn] = useState('');
    
    const [currSongID, setCurrSongID] = useState('');
    const [currSongDisp, setCurrSongDisp] = useState('');

    const getCurrSong = () => {
        if (!accessToken == '') {
            socket.emit('curr_playing', { accessToken }, function(res) {
                setCurrSongID(res);
            })
        }
    }

    useEffect(() => {
        if (accessToken == '') {
            socket.emit('login_req', { props }, function(res) {
                setAccessToken(res.access_token);
                setRefreshToken(res.refresh_token);
                setExpiresIn(res.expires_in);
            })
        }

        const songRefresher = setInterval(() => {
            getCurrSong();
          }, 1000);
    
        // Fix dependency array for refresh, later
    }, [])

    useEffect(() => {   
        if (!accessToken == '') {

            socket.emit('curr_playing', { accessToken }, function(res) {
                setCurrSongID(res);
            })

            socket.emit('fetch_user_info', { accessToken }, function(res) {
                setUserName(res.body.display_name);
            })  
        }
    }, [accessToken])

    useEffect(() => {
        if (!currSongID == '') {
            console.log(currSongID);
            setCurrSongDisp(currSongID.name + ' by' + currSongID.artists.map(x => ' ' + x.name))
        }
    }, [currSongID])

    // Eventually allow the user to set their own refresh interval

    return (
        <div className='homepage'>
            <div className='userInfo'>
                <h1>
                    User: 
                    <br></br>
                    { userName }
                </h1>
            </div>
            <div className='songInfo'>
                <h1>Current Song:</h1>
                { currSongDisp }
                <img >
                    Song Image:
                </img>
            </div>
        </div>
    )
}

export default Dashboard;