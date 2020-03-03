const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


var mysql = require("mysql");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "gw2019gw",
    database: "files"
  });


// authenticate whether or not the user entered the proper info into the login page
function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        // checks if username exists
        const user = getUserByEmail(email);
        if (user == null) {
            return done(null, false, { message: 'No user with that email' });
        };

        // compares user's entered password with bcrypt password linked to account
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            };
        } catch (e) {
            return done(e);
        };
    };

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id));
    });
};

module.exports = initialize;
