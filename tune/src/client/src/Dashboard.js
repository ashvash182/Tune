import React, { useEffect, useState } from 'react';
import useAuth from './Custom Hooks/useAuth'
import Container from 'react-bootstrap';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001')

const Dashboard = (props) => {
    const [accessToken, setaccessToken] = useState('');
    const [currTopArtists, setcurrTopArtists] = useState('');

    useEffect(() => {

        socket.emit('login_req', { props }, function(res) {
            setaccessToken(res.access_token, () => {
                console.log('login_req emit completed with callback')
            })
        })
    }, [])

    useEffect(() => {
        socket.emit('top_artists', { accessToken }, function(res) {
            setcurrTopArtists(res.top_artists)

            console.log('top_artists emit completed with callback')
            console.log('Top Artists:', currTopArtists)
        })
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