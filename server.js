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
const bcrypt = require('bcrypt')  // bcrypt for hashing passwords and as well as comparing hashed passwords
const passport = require('passport')  // library for password authentication
const flash = require('express-flash')  // for flashing error message if any
const session = require('express-session')
const methodOverride = require('method-override')  // to override the POST method with delete during logout

// importing function for authentication
const initialisePassport = require('./passport-config')
initialisePassport(
    passport,
    email =>  users.find(user => user.email === email),   // passing the email of the user received and checking if the emails are matching
    id => users.find(user => user.id === id)
)

// creating a local variable to store information of the users
const users = []

// tell the server we are using ejs
app.set('view engine', 'ejs')
/* Setting the view (frontend) of the application to ejs */
app.use(express.static('public'))


app.use('/peerjs', peerServer);


// since we are getting information from forms and take the information to access in our req variables and post methods
app.use(express.urlencoded({ extended: false }))

// setting up the app to use flash and session (of express)
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,    // secret key that will encrypt all our information
    resave: false,   // not resaving environment variables if not saved
    saveUninitialized: false   // not saving an empty value in the session
}))

// inistialising the passport
app.use(passport.initialize())

// to store the varialbles to be persisted across the entire session
app.use(passport.session())
app.use(methodOverride('_method'))


// setting our main route
app.get('/', checkAuthenticated, (req, res) => {
    roomId = req.params.room,
    res.render('room.ejs', { name: req.user.name })    
})

// setting route for login page
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

// route for post method of login
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {    // using passport authentication middleware and setting the method as local
    successRedirect: '/',   // in case of success
    failureRedirect: '/login',
    failureFlash: true  // flashing the error message
}))

// setting route for register page
app.get('/register', checkNotAuthenticated, (req, res) => {    
    res.render('register.ejs')
})

// route for post method of register
app.post('/register', checkNotAuthenticated, async (req, res) => {      // making it an async function to use try catch block
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)    // creating a hashed password of the password entered by user in the register page
        users.push({    // storing infor in the array
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login') // if all that was successful user is redirected to login with the account created
    } catch {
        res.redirect('/register')   // in case of any error they are rediredted back to register
    }
    console.log(users)   // to see if user has been added
})

// final route to logout our users
app.delete('/logout', (req, res) => {
    req.logOut()  // automatically setup by passport
    res.redirect('/login')  // once logged out user redirected to login page
})

// function to check if the user is authenticated to only allow authenticated users to access info
// a middleware function which takes request and response and calls up next variable whenever authentication is done
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        // built-in passport function which will return true if user is authenticated
        return next() // everything works and going to next()
    }

    res.redirect('/login') // if return is false return to login page
}

// function to check if ser is not authenticated
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        // built-in passport function which will return true if user is authenticated
        return res.redirect('/')  // if authenticated will stay on the index page and not redirect page back to login
    }
    next()  // if not authenticated then continue on with the call
}

/* Getting the unique roomId from the url ( necessary for heroku )
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
}) */

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