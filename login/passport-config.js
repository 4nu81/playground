const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserByID) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email);
        if (user == null) {
            return done(null, false, {message:"No User with that eMail!"});
        }
        try {
            const success = await bcrypt.compare(password, user.password)
            if ( success ) {
                return done(null, user);
            } else {
                return done(null, false,  {message: "Password incorrect!"});
            }
        } catch (e) {
            return done(e);
        }
    }
    passport.use(new LocalStrategy({usernameField: 'email'},authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserByID(id));
    });
}

module.exports = initialize;