import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios'

const socket = io.connect('http://localhost:3001')
const authentication = React.createContext(false)

export default function useAuth(code) {
    const [accessToken, setaccessToken] = useState();
    const [refreshToken, setrefreshToken] = useState();
    const [expiresIn, setexpiresIn] = useState();
    
    useEffect(() => {
        socket.emit('login_req', { code }, (res) => {
            setaccessToken(res.body['access_token']);
            setrefreshToken(res.body['refresh_token']);
            setexpiresIn(res.body['expires_in']);
            console.log(res.status)
        })
    }, [code])

    // useEffect(() => {
    //     if (!refreshToken || !expiresIn) return;
    //     socket.emit('refresh', { refreshToken }, (res => {
    //         setaccessToken(res.data.accessToken);
    //         setrefreshToken(res.data.refreshToken);
    //         setexpiresIn(res.data.expiresIn);
    //         console.log(res.data);
    //     })
    // )}, [refreshToken, expiresIn])

    return accessToken;

}