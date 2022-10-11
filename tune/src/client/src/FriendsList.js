import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001')

const FriendsList = (userID) => {
    const [listFriends, setListFriends] = useState('')
    const [friendComps, setFriendComps] = useState('')

    const addFriend = (friendID) => {
        socket.emit('become_friends', { userID, friendID }, (successVal) => {
            if (successVal) {
                setListFriends(setListFriends.push(friendID));
            }
        })
    }

    useEffect(() => {
        
    }, [listFriends])
    return (
        <div className='Friends'>
            <div className='Options'>
            <h1>Add</h1>
            <form onSubmit= { addFriend }>
                <label>
                    UserName:
                    <input type='text' />
                </label>
                <button type="submit">Submit</button>
            </form>
            </div>
            <div className='ListedFriends'>
                { listFriends }
            </div>
        </div>
    )
}

export default FriendsList;