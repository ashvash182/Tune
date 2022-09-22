import React, { useEffect, useState } from 'react';
import useAuth from './Custom Hooks/useAuth'
import Container from 'react-bootstrap';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001')

const Dashboard = (props) => {
    const [accessToken, setaccessToken] = useState();

    useEffect(() => {
        socket.emit('login_req', { props }, function(res) {
            setaccessToken(res.access_token)

            console.log('emit completed with callback')
            console.log('Constructor Access Token:', res.access_token)
        })
    }, [])

    return (
        <div className='top_artists'>
            <h1>Access token is</h1>
        { accessToken }
        <h1>My top artists are</h1>
        { socket.emit('top_artists', accessToken) }
    </div>
    )
}

export default Dashboard;