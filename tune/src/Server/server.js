const express = require('express');
const http = require('http');
const { Server } = require('socket.io')
const cors = require('cors');
const spotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
const { stringify } = require('querystring');


const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
let users = [];

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

io.on('connection', (socket) => {
    const socketID = socket;

    console.log(`User Connected: ${socket.id}`);

    socket.on('login_req', function (req, callback) {

        code = req.props['code'];

        spotifyApi.authorizationCodeGrant(code)
        .then(
            function(data) {
                // Set the access token on the API object to use it in later calls
                spotifyApi.setAccessToken(data.body['access_token']);
                spotifyApi.setRefreshToken(data.body['refresh_token']);

                callback({  
                    access_token: data.body['access_token'],
                    refresh_token: data.body['refresh_token'],
                    expires_in: data.body['expires_in']
                });

              }
            )   
        .catch((err) => {
            console.log('authCodeGrant error')
        })
    })

    socket.on('add_user', function(data, callback) {
        let id = data.id
        if (users[id] != undefined) {
            users[id] = data.disp;
        }
        else {
            users.push({
                key: data.id,
                value: data.disp
            })
        }
        console.log('Active Users', users)
    })

    socket.on('user_exists', function(id) {
        if (users[id] != undefined) {
            return users[id];
        }
        else {
            return false;
        }
    })

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

    socket.on('update_user_access', function(data) {
        let id = data.userID
        socket.emit('user_exists', id, function(res) {
            users[id] = data.accessToken;
        })
    })

    socket.on('refresh_access_token', (data, callback) => {
        console.log('serverside refreshtoken', data.refreshToken)
        console.log('serverside accessToken', data.accessToken)
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

    socket.on('get_friend_curr_song', (data, callback) => {
        socket.emit('user_exists', data.userID, function(res) {
            socket.emit('curr_playing', { res }, function(resTwo) {
                callback(resTwo)
            })
        })
    })
})

server.listen(3001, () => {
    console.log('Server is running!')
})