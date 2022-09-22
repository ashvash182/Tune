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
    clientId: 'f7450a055d644e5c94cab30cafb546c9',
    clientSecret: 'd3198745631e452aa0d921574782fe2b'
})

app.post('/login', (req, res) => {
    const code = req.body.code
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'f7450a055d644e5c94cab30cafb546c9',
        clientSecret: 'd3198745631e452aa0d921574782fe2b'
    })

    spotifyApi.authorizationCodeGrant(code)
    .then(data => {
        res.json({
            accessToken: data.body['access_token'],
            refreshToken: data.body['refresh_token'],
            expiresIn: data.body['expires_in']
        })
    })
})

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;

    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'f7450a055d644e5c94cab30cafb546c9',
        clientSecret: 'd3198745631e452aa0d921574782fe2b',
        refreshToken: refreshToken
    })

    spotifyApi.refreshAccessToken().then(
        (data) => {
          console.log(data);
          // Save the access token so that it's used in future calls
          spotifyApi.setAccessToken(data.body['access_token']);
        },
      )
      .catch((err) => {
        console.log('Error with refresh', err);
      })
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

    socket.on('login_req', function (req, callback) {

        code = req.props['code'];

        console.log(code);

        spotifyApi.authorizationCodeGrant(code)
        .then(
            function(data) {
                // Set the access token on the API object to use it in later calls
                spotifyApi.setAccessToken(data.body['access_token']);
                spotifyApi.setRefreshToken(data.body['refresh_token']);

                callback({  
                    status: 'ok',
                    access_token: data.body['access_token'],
                    refresh_token: data.body['refresh_token'],
                    expires_in: data.body['expires_in']
                });
                console.log('callback executed?')
              }
            )   
        .catch((err) => {
            console.log('authCodeGrant error', err)
        })
    })

    socket.on('refresh', (req, callback) => {
        const refreshToken = req['refresh_token'];

        console.log('refresh is being run!')
        console.log(refreshToken)

        const spotifyApi = new spotifyWebApi({
            redirectUri: 'http://localhost:3000',
            clientId: 'f7450a055d644e5c94cab30cafb546c9',
            clientSecret: 'd3198745631e452aa0d921574782fe2b'
        })

        spotifyApi.refreshAccessToken().then(
            (data) => {
              console.log(data);
              callback(data);
              // Save the access token so that it's used in future calls
              spotifyApi.setAccessToken(data.body['access_token']);
            },
          )
          .catch((err) => {
            console.log('Error with refresh', err);
          })
    })

    socket.on('top_artists', (data) => {

        console.log('top artists receives ', data)

        let spotifyApi = new spotifyWebApi({
            accessToken: data
          });

        console.log('set token as ', data)

        spotifyApi.getMyTopArtists()
        .then(function(data) {
          let topArtists = data.body.items;
          console.log(topArtists);
        }, function(err) {
          console.log('Something went wrong with top_artists', err);
        })
    })
})

server.listen(3001, () => {
    console.log('Server is running!')
})