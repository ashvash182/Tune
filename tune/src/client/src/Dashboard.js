import React, { useEffect, useState } from 'react';
import useAuth from './Custom Hooks/useAuth'
import Container from 'react-bootstrap';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001')

const Dashboard = (props) => {
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [expiresIn, setExpiresIn] = useState('');
    const [currTopArtists, setCurrTopArtists] = useState([]);

    useEffect(() => {
        socket.emit('login_req', { props }, function(res) {
            setAccessToken(res.access_token);
            setRefreshToken(res.refresh_token);
            setExpiresIn(res.expires_in);
        })
    }, [])

    useEffect(() => {
        if (!accessToken == '') {
            socket.emit('top_artists', { accessToken }, function(res) {
                // for (let key in res.tracks.items) {
                //     setCurrTopArtists(() => {
                //         currTopArtists.push(res.tracks.items[key].artists[0].name);
                //     })
                // }
                console.log(res)
            })
        }

    }, [accessToken])

    return (
        <div className='top_artists'>
            <h1>Access token is</h1>
        { accessToken }
        <h1>My top artists are</h1>
        { currTopArtists }
    </div>
    )
}

export default Dashboard;