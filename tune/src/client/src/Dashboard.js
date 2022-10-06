import React, { useEffect, useState } from 'react';
import useAuth from './Custom Hooks/useAuth'
import Container from 'react-bootstrap';
import Friends from './Friends'
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001')

const Dashboard = (props) => {
    const [userName, setUserName] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [expiresIn, setExpiresIn] = useState('');
    
    const [currSongID, setCurrSongID] = useState('');
    const [currSongDisp, setCurrSongDisp] = useState({
        'displayText': '',
        'displayImgLink': ''
    });

    const [friendsList, setFriendsList] = useState([]);

    const getCurrSong = () => {
        socket.emit('curr_playing', { accessToken }, function(res) {
            setCurrSongID(res);
        })
    }

    const retrieveFriendsList = () => {
        var following_list;
        var follower_list;

        socket.emit('following_list', { accessToken }, function(req) {
            
        })

        socket.emit('followers_list', { accessToken }, function(req) {
            
        })
    }

    const addFriend = (friendID) => {
        
    }

    useEffect(() => {
        socket.emit('login_req', { props }, function(res) {
            setAccessToken(res.access_token);
            setRefreshToken(res.refresh_token);
            setExpiresIn(res.expires_in);
        })
        
        document.title = 'Tune';
        // Fix dependency array for refresh, later
    }, [])

    useEffect(() => {   
        if (!accessToken == '') {
            socket.emit('fetch_user_info', { accessToken }, function(res) {
                setUserName(res.body.display_name);
                setInterval(getCurrSong, 2000);
            })
        }
    }, [accessToken])

    useEffect(() => {
        if (!currSongID == '') {
            console.log(currSongID)
            setCurrSongDisp({
                'displayText': currSongID.name + ' -' + currSongID.artists.map(x => ' ' + x.name),
                'displayImgLink': currSongID.album.images[0].url
            })
        }
    }, [currSongID])

    // Eventually allow the user to set their own refresh interval

    return (
        <div className='homepage'>
            <title>Tune</title>
            <div className='userInfo'>
                <h1>
                    User: { accessToken }
                    <br></br>
                    { userName }
                </h1>
            </div>
            <div className='songInfo'>
                <h1>Currently Listening To:</h1>
                { currSongDisp['displayText'] }
                <br></br>
                <img style={{ width: "10%", height: "10%" }} src={ (currSongDisp['displayImgLink']) }></img>
            </div>
        </div>
    )
}

export default Dashboard;