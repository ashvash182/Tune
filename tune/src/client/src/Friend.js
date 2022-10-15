import React, { useEffect, useState } from 'react';
import useAuth from './Custom Hooks/useAuth'
import Container from 'react-bootstrap';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001')

const Friend = (friendID) => {
    const [friendUserName, setFriendUserName] = useState('');
    const [friendUserID, setFriendUserID] = useState(friendID.userName);

    const [currSongID, setCurrSongID] = useState('');
    const [currSongDisp, setCurrSongDisp] = useState('');
    const [currSongImgLink, setCurrSongImgLink] = useState('');

    const getCurrSong = () => {
        if (setFriendUserID != '') {
            socket.emit('curr_playing', { userID: friendUserID }, function(res) {
                setCurrSongID(res);
            })
        }
    }

    useEffect(() => {
        if (currSongID == '') {
            setCurrSongDisp('None')
        }
        else {
            setCurrSongDisp(currSongID.body.item.name + ' by' + currSongID.body.item.artists.map(x => ' ' + x.name))
            setCurrSongImgLink(currSongID.body.item.album.images[0].url) 
        }
    }, [currSongID])

    useEffect(() => {
        socket.emit('fetch_friend_info', { userID: friendUserID }, function(res) {
            setFriendUserName(res.disp);
        })
        // Need to refresh, when the user gets online, it doesn't instantly update.
        setInterval(() => {getCurrSong()}, 1000);
    }, [friendUserID])

    return (
        <div className='Friend'>
            <div className='userInfo'>
                <h2>
                    User:
                    <br></br>
                    { friendUserName }
                </h2>
            </div>
            <div className='songInfo'>
                <h3>Current Song:</h3>
                <h4>{ currSongDisp }</h4>
                <img src={ currSongImgLink } width='100' height='100'>
                </img>
            </div>
        </div>
    )
}

export default Friend;