import React, { useEffect, useState } from 'react';
import useAuth from './Custom Hooks/useAuth'
import Container from 'react-bootstrap';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001')

const Friends = (props) => {
    const friendList = useState([]);

    useEffect(() => {

    })
    
    return (
        { friendList }
    )
}

export default Friends;