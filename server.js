/* For taking the environment variables from the .env file */
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

/* Import all necessary frameworks for the application */
const express = require('express');
const { ExpressPeerServer } = require('peer');
const app = express();
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const server = require('http').Server(app);
const io = require('socket.io')(server)
const { v4: uuidv4 } = require('uuid');
const peerServer = ExpressPeerServer(server, {
    debug: true
});

/* Using passportJS for user authentication */
const initializePassport = require('./passport-config');
const { request } = require('http');
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

/* Using a local array for storing user login credentials */
const users = []
console.log(users);

/* Setting the view (frontend) of the application to ejs */
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})
  

/* Start of user authentication */
  app.use(express.urlencoded({ extended: false }))
  app.use(flash())
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(methodOverride('_method'))
  
  // Getting the unique roomId from the url
  app.get('/', checkAuthenticated, (req, res) => {
    res.render('room.ejs', { name: req.user.name })
  })
    
  app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
  })
    
  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))
    
  app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
  })
    
  app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
  })
    //
  app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
  }
    
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }
 /* End of user authentication*/


/* Forming a peer to peer connection and allowing the user to enter the room */
app.use('/peerjs', peerServer);
app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
})

/* using socket IO to allow two way communication */
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);

        socket.on('message', message => {
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