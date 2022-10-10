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
let tuneUsers = {
    users: []
};

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

const userList = [];

fs.writeFile('../userList.json', '', 'utf-8', (err) => {
    if (err) {
        console.log('could not empty userlist file')
    }
});

io.on('connection', (socket) => {
    const socketID = socket;

    console.log(`User Connected: ${socket.id}`);

    socket.on('send_message', (data) => {
        socket.broadcast.emit('receive_message', (data) => {
            
        })
    })

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

    socket.on('add_user', function(data, callback) {
        let id = data.id
        let jsonContent = {
            userID: data.id,
            userData: {
                accessToken: data.accessToken,
                currSongID: data.currSongID,
                disp: data.disp
            }
        }
        if (userExists(data.id)) {
            console.log('user already exists!')
            return;
        }
        fs.readFile('../userList.json', 'utf-8', (err, jsonString) => {
            if (err) {
                console.log('error reading userList.json')
                return;
            }
            if (jsonString.length == 0) {
                let emptyFileContent = [];
                emptyFileContent.push(jsonContent)
                fs.writeFile('../userList.json', JSON.stringify(emptyFileContent), 'utf-8', function(err, resp) {
                    if (err) {
                        console.log('json writing failed')
                        return;
                    }
                    return;
                })
            }
            else {
                let tempUsers = JSON.parse(jsonString);
                tempUsers.push(jsonContent)
                fs.writeFile('../userList.json', JSON.stringify(tempUsers), 'utf-8', function(err, newJSON) {
                    if (err) {
                        console.log('json writing failed')
                    }
                })
            }
        })
    })

    const userExists = (userID) => {
        // Issue where keys are not identified, 
        // users are added within their userID key twice.
        fs.readFile('../userList.json', 'utf-8', (err, jsonString) => {
            if (err) {
                console.log('error reading userList.json')
                return;
            }
            if (jsonString.length != 0) {            
                let exists = JSON.parse(jsonString);
                let keys = exists.map(x => x.userID)
                if (keys.includes(userID)) {
                    return true;
                }
                else {
                    return false
                }
                }
            else {
                console.log('no users')
            }
        })
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

    socket.on('update_user_accessToken', function(data) {
        let id = data.userID
        if (userExists(data.userID)) {
            users[id] = data.accessToken;
        }
        else {
            console.log('user does not exist')
        }
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
                
        spotifyApi.setAccessToken(data.accessToken)

        // Do search using the access token
        spotifyApi.getMyCurrentPlayingTrack().then(
            function(data) {
            callback(data.body.item)
            },
            function(err) {
            console.log('curr_playing failed', err);
            }
        );
    })

    socket.on('update_my_song', (data) => {
        if (!userExists(data.userID)) {
            // console.log('user nonexistent');
        }
        // users[data.userID].currSongID = data.currSongID;
    })

    socket.on('get_friend_curr_song', (data, callback) => {
        if (userExists(data.userID)) {
            socket.emit('curr_playing', { res }, function(resTwo) {
                callback(resTwo)
            })
        }
    })
})

server.listen(3001, () => {
    console.log('Server is running!')
})