import React, { useEffect, useState } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import useAuth from './Custom Hooks/useAuth'
import Container, { AccordionCollapse } from 'react-bootstrap';
import FriendsList from './FriendsList'
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001')

const Dashboard = (props) => {
    const [userName, setUserName] = useState('');
    const [userID, setUserID] = useState('');

    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [expiresIn, setExpiresIn] = useState('');
    
    const [currSongID, setCurrSongID] = useState('');
    const [currSongDisp, setCurrSongDisp] = useState('');
    const [currSongImgLink, setCurrSongImgLink] = useState('')

    const getCurrSong = () => {
        if (accessToken != '') {
            socket.emit('curr_playing', { accessToken }, function(res) {
                setCurrSongID(res);
            })
        }
    }

    const refreshAccessToken = () => {
        socket.emit('refresh_access_token', { accessToken, refreshToken }, function(data) {
            setAccessToken(data.body['access_token'])
            setRefreshToken(data.body['refresh_token'])
        }) 
    }

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            socket.emit('login_req', { props }, function(res) {
                setAccessToken(res.access_token);
                setRefreshToken(res.refresh_token);
                setExpiresIn(res.expires_in);       
            })
        } 
        else {
            setAccessToken(localStorage.getItem('accessToken'))
            setRefreshToken(localStorage.getItem('refreshToken'))
            setExpiresIn(localStorage.getItem('expiresIn'))
        }
    }, [])

    useEffect(() => {  
        localStorage.setItem('accessToken', accessToken)   
        console.log('what is it now?')   
        if (!accessToken == '') {
            socket.emit('fetch_user_info', { accessToken }, function(res) {
                let id = res.body.id
                let disp = res.body.display_name
                socket.emit('update_user', { disp, id, accessToken, currSongID })
                setUserName(res.body.display_name);
                setUserID(res.body.id);
            })
            setInterval(() => {getCurrSong()}, 1000);
            // const refreshAccess = setInterval(() => {
            //     refreshAccessToken();
            // }, 3600)
        }
    }, [accessToken])

    useEffect(() => {
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('expiresIn', expiresIn)
    }, [refreshToken])

    useEffect(() => {
        if (currSongID == '') {
            setCurrSongDisp('None')
        }
        else {
            console.log('logging: ', currSongID)
            setCurrSongDisp(currSongID.body.item.name + ' by' + currSongID.body.item.artists.map(x => ' ' + x.name))
            setCurrSongImgLink(currSongID.body.item.album.images[0].url) 
        }
    }, [currSongID])

    // useEffect(() => {
    //     const cleanup = () => {
    //       socket.emit('remove_active_user', { userID })
    //     }
      
    //     window.addEventListener('beforeunload', cleanup);
      
    //     return () => {
    //       window.removeEventListener('beforeunload', cleanup);
    //     }
    //   }, []);

    // Eventually allow the user to set their own refresh interval

    return (
        <div className='homepage'>
            <title>Tune</title>
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
                <br></br>
                <img src={ currSongImgLink } width='100' height='100'>
                </img>
            </div>
            <div className='friends'>
                <FriendsList code={ userID }>
                </FriendsList>
            </div>
        </div>
    )
}

export default Dashboard;