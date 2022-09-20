const express = require('express');
const http = require('http');
const { Server } = require('socket.io')
const cors = require('cors')

const app = express();
app.use(cors());

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

})

server.listen(3001, () => {
    console.log('Server is running!')
})