import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Friend from './Friend'
const socket = io.connect('http://localhost:3001')

const FriendsList = (userID) => {
    const inputFriendID = useRef(null);

    const [listFriends, setListFriends] = useState(['ytrg7xd1h7ghdtzflxt0fzsv7'])
    const [friendComps, setFriendComps] = useState('')

    const addFriend = () => {
        // socket.emit('become_friends', { userID, friendID }, (successVal) => {
        //     if (successVal) {
        //         setListFriends(setListFriends.push(<Friend code={friendID}></Friend>));
        //     }
        // })
        setListFriends([...listFriends, inputFriendID.current.value])
    }

    return (
        <div className='Friends'>
            <div className='Options'>
            <h1>Add</h1>
            <form onSubmit={addFriend}>
                <label>
                    UserName:
                    <input type='text' ref={inputFriendID}/>
                </label>
                <button type="button" onClick={addFriend}>Submit</button>
            </form>
            </div>
            <div className='ListedFriends'>
                { listFriends.map((datum) => (<h1 key={datum}><Friend userName={datum}/></h1>)) }
            </div>
        </div>
    )
}

export default FriendsList;