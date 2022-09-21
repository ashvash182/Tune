import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001')

export default function useAuth(code) {
    const [accessToken, setaccessToken] = useState();
    const [refreshToken, setrefreshToken] = useState();
    const [expiresIn, setexpiresIn] = useState();

    useEffect(() => {
        socket.emit('login_req', { code }, (res) => {
            setaccessToken(res.body['access_token']);
            setrefreshToken(res.body['refresh_token']);
            setexpiresIn(res.body['expires_in']);
            console.log(accessToken);
            console.log(refreshToken);
        })
    }, [code])

    useEffect(() => {
        socket.emit('refresh', { code })
    }, [refreshToken, expiresIn])

    return accessToken;
}