import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001')

export default function useAuth(code) {
    const [accessToken, setaccessToken] = useState();
    const [refreshToken, setrefreshToken] = useState();
    const [expiresIn, setexpiresIn] = useState();

    useEffect(() => {
        console.log(code)
        socket.emit('login_req', { code }, (res) => {
            console.log(res.data);
            window.history.pushState({}, null, '/')
        })
    }, [code])
}