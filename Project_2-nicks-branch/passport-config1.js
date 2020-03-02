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

       
        // const user1 = connection.query("SELECT * FROM info WHERE email = ?",[email], function(err, res){

        // var user = res[0].email

        // console.log(res)
        // console.log(res[0].id)
        // console.log(res[0].email)



        if ( user == null) {
            return done(null, false, { message: 'No user with that email' });
        };

        console.log("after ==")


        // function(req, username, password, done) { // callback with email and password from our form
        //     connection.connect();
        //     connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
        //         if (err)
        //             return done(err);
        //         if (!rows.length) {
        //             return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
        //         }

        //         // // if the user is found but the password is wrong
        //         // if (!bcrypt.compareSync(password, rows[0].password))
        //         //     return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

        //         // all is well, return successful user
        //         return done(null, rows[0]);
        //     });
        //     connection.end();

   


    console.log("b trt")

        // compares user's entered password with bcrypt password linked to account
        try {
            console.log("ins try")

            if (bcrypt.compare(password, user.password)) {
                return done(null, user);

            } else {
                return done(null, false, { message: 'Password incorrect' });
            };
        } catch (e) {
            return done(e);
        };
    // });

    };


    console.log("pass . use")

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));


    // passport.serializeUser(function(res, done) {
    //     done(null, res.id);
    // });

    // // used to deserialize the user
    // passport.deserializeUser(function(id, done) {
    //     connection.connect();
    //     connection.query("SELECT * FROM info WHERE id = ? ",[id], function(err, rows){
    //         done(err, rows[0]);
    //     });
    //     connection.end();
    // });
    console.log("befor end")


    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id));
    });

    // passport.serializeUser(function(user, done) {
    //     done(null, user.id);
    //   });
      
    //   passport.deserializeUser(function(id, done) {
    //     User.findById(id, function(err, user) {
    //       done(err, user);
    //     });
    //   });

      
console.log("end")

};
module.exports = initialize;
console.log(initialize)
