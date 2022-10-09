import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001')

const FriendsList = (userID) => {
    const [listFriends, setlistFriends] = useState('')
    const [friendComps, setfriendComps] = useState('')

    const addFriend = (userID) => {

    }

    return (
        <div classname='Friends'>
            <form onSubmit= { addFriend }>
                <label>
                    UserName:
                    <input type='text' />
                </label>
            </form>
        </div>
    )
}

export default FriendsList;