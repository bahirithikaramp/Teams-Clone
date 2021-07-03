// put all the information for authentication

const LocalStrategy = require('passport-local').Strategy    // for using the local method (password + emailid) for authentication
const bcrypt = require('bcrypt')

function initialise(passport, getUserByEmail, getUserById) {
    // function for authenticating the user
    // we will call done whenever we are authenticating our user
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email)   // function to return email of the user
        if (user == null) {
            return done(null, false, { message: 'No user with that email' })   // the three parameters of done - any error in serve, if user found, error message
        }

        try {   // to compare the hashed password
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)   // return the user as they have logged in as
            } else {
                return done(null, false, { message: 'Password incorrect' })  // if the two passwords did not match
            }
        } catch (e) {
            return done(e)
        }
    }
    
    passport.use(new LocalStrategy({ usernameField: 'email' },    // setting up the possport local with the user credentials
        authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))   // serialise user to store inside of our session
    passport.deserializeUser((id, done) => {
        done(null, getUserById(id))
    })
}

// exporting the initialise function
module.exports = initialise