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

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('send_message', (data) => {
        socket.broadcast.emit('receive_message', (data) => {
            
        })
    })

    socket.on('tune_with_user', (username) => {
        if (username.listeningStatus == 'False') {
            console.log('User inactive')
        }
        else {
            userTune(socket.id, username)
        }
    })

    socket.on('login_req', (req, callback) => {
        const spotifyApi = new spotifyWebApi({
            redirectUri: 'http://localhost:3000',
            clientId: 'f7450a055d644e5c94cab30cafb546c9',
            clientSecret: 'd3198745631e452aa0d921574782fe2b'
        })
                
        code = req['code'];

        console.log(code);

        spotifyApi.authorizationCodeGrant(code)
        .then(data => {
            console.log({
                accessToken: data.body['access_token'],
                refreshToken: data.body['refresh_token'],
                expiresIn: data.body['expires_in']
            })
        })
        .catch(console.error())
    })
})

server.listen(3001, () => {
    console.log('Server is running!')
})