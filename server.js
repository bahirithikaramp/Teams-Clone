/* Load in our environment variables */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

/* Import all necessary frameworks for the application */
const express = require('express');
const { ExpressPeerServer } = require('peer');
const app = express();   // getting app variable from express
const server = require('http').Server(app);
const io = require('socket.io')(server)
const { v4: uuidv4 } = require('uuid');
const peerServer = ExpressPeerServer(server, {
    debug: true
});

// tell the server we are using ejs
app.set('view engine', 'ejs')
/* Setting the view (frontend) of the application to ejs */
app.use(express.static('public'))


app.use('/peerjs', peerServer);



// Getting the unique roomId from the url
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
}) 

/* Forming a peer to peer connection and allowing the user to enter the room */
app.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`);
})

/* using socket IO to allow two way communication */
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
        // messages
          socket.on('message', message => {
            // send messages to the same room
            io.to(roomId).emit('createMessage', message)
        })

        socket.on('video', video => {
            io.to(roomId).emit('screenCapture', video)
        })
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

/* Server listen's to either from the default port 3030 or from the port used by the remote server */
server.listen(process.env.PORT||3030); 