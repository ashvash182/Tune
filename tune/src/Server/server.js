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

io.on('connection', (socket) => {
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

    socket.on('fetch_user_info', function(data, callback) {

        spotifyApi.setAccessToken(data.accessToken)

        spotifyApi.getMe()
        .then(
            function(data) {
                callback(data);
            }
        )
        .catch((err => {
            console.log('fetch_user_info failed', err);
        }))
    })

    socket.on('curr_playing', (data, callback) => {

        spotifyApi.setAccessToken(data.accessToken)

        console.log(data.accessToken)

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
})

server.listen(3001, () => {
    console.log('Server is running!')
})