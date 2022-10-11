const express = require('express');
const http = require('http');
const { Server } = require('socket.io')
const cors = require('cors');
const spotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
const { stringify } = require('querystring');
const fs = require('fs');
const store = require('store')


const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
let activeUsers = [];

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

const spotifyApi = new spotifyWebApi({
    redirectUri: 'http://localhost:3000',
    clientId: '55ab070927814122baceb56cf32982f8',
    clientSecret: '9d9bd3c95a7c453abd4ce006fb3fbd2f'
})

const updateUserToken = function(accessToken) {
    spotifyApi.setAccessToken(accessToken);
    return new Promise((resolve, reject) => {
        if (spotifyApi.getAccessToken() == accessToken) {
            resolve('Success');
        }
        else {
            reject('Failure');
        }
    })
}

const updateSongs = () => {
    let userKeys = activeUsers.map(x => x.userData.userID);
    for (user in activeUsers) {

        // Do search using the access token

        updateUserToken(activeUsers[user].userData.accessToken).then((msg) => {
            console.log(msg)
            spotifyApi.getMyCurrentPlayingTrack().then(
                function(data) {
                    if (data.statusCode != 204) {
                        activeUsers[user].userData.currSongID = data;
                    }
                    else {
                        activeUsers[user].userData.currSongID = 'None'
                    }
                },
                function(err) {
                console.log('curr_playing failed', err);
                }
            )
        }
        )
    }

    // console.log('Songs: ', activeUsers.map(x => {
    //     if (x.userData.currSongID.length != 0) {
    //         return x.userData.userID + ' playing ' + x.userData.currSongID.body.item.name
    //     }
    //     else {
    //         return ''
    //     }
    // }))
    console.log('Active Users: ', activeUsers)
}

setInterval(updateSongs, 1000)

io.on('connection', (socket) => {
    const socketID = socket;

    console.log(`User Connected: ${socket.id}`);

    socket.on('login_req', function (req, callback) {

        code = req.props['code'];

        spotifyApi.authorizationCodeGrant(code)
        .then(
            function(data) {
                callback({  
                    access_token: data.body['access_token'],
                    refresh_token: data.body['refresh_token'],
                    expires_in: data.body['expires_in']
                }); 

              }
            )   
        .catch((err) => {
            console.log('authCodeGrant error', err)
        })
    })

    socket.on('update_user', function(data, callback) {

        let jsonContent = {
            userData: {
                userID: data.id,
                accessToken: data.accessToken,
                currSongID: data.currSongID,
                disp: data.disp,
                currSongID: data.currSongID
            }
        }

        if (!isActiveUser(data.id)) {
            activeUsers.push(jsonContent)
        }
        // What if they are an active user? How to update their server state then?
    })   

    const isActiveUser = (userID) => {
        if (activeUsers.map(x => x.userData.userID).includes(userID)) {
            return true;
        }
        return false;
    }

    socket.on('fetch_user_info', function(data, callback) {

        spotifyApi.setAccessToken(data.accessToken)

        spotifyApi.getMe()
        .then(
            function(data) {
                callback(data);
            }
        )
        .catch((err => {
            console.log('fetch_user_info failed');
        }))
    })

    socket.on('refresh_access_token', (data, callback) => {
        spotifyApi.setAccessToken(data.accessToken);
        spotifyApi.setRefreshToken(data.refreshToken);

        spotifyApi.refreshAccessToken()
        .then((data) => {
              callback(data);
            },
          )
          .catch((err) => {
            console.log('Error with refresh');
          })
    })

    socket.on('curr_playing', (data, callback) => { 

        if (activeUsers.find(x => x.userData.accessToken == data.accessToken) == undefined) {
            return undefined;
        }
        
        let userInfo = activeUsers.find(x => x.userData.accessToken == data.accessToken)

        callback(userInfo.userData.currSongID)
    })

    socket.on('remove_active_user', (data) => {
        console.log('removing')
        activeUsers = activeUsers.filter(function(x) {
            return x.userData.userID !== data.userID;
        });
    })

    socket.on('get_friend_curr_song', (data, callback) => {
        if (isActiveUser(data.userID)) {
            socket.emit('curr_playing', { res }, function(resTwo) {
                callback(resTwo)
            })
        }
    })
})

server.listen(3001, () => {
    console.log('Server is running!')
})