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


          
        // const user1 = connection.query("SELECT * FROM info WHERE email = ?",[email]) function(err, res){
            
        // var user = getUserByEmail(connection.query("SELECT * FROM info WHERE email = ?",[email], function(err, res){
        //     user = res[0]
        //     return 
        // }));

        // var user = connection.query("INSERT INTO file SET ?",

        //     {
        //       name: req.file.filename ,
        //       type: req.file.mimetype,
        //       size: req.file.size,
        //       description:req.body.task
        //     },
        //   )
    
        
        console.log(user)
        

        if (user == null) {
            return done(null, false, { message: 'No user with that email' });
        };


        // compares user's entered password with bcrypt password linked to account
        try {
            if (await bcrypt.compare(password, user.password)) {
                console.log(user.password+ "passw")
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
    console.log("des")

};

module.exports = initialize;