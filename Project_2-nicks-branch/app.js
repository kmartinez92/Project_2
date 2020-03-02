    const express = require("express");
    const multer = require("multer");
    const ejs = require("ejs");
    const path = require("path");
    const app = express();
    const bcrypt = require('bcrypt');
    const passport = require('passport');
    const flash = require('express-flash');
    const session = require('express-session');
    const methodOverride = require('method-override');




    // call app - farok
    // var app = express();


    // add mysql - farok
    var mysql = require("mysql");


    // add connection - farok
    var connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "gw2019gw",
        database: "files"
    });
    


    var PORT = process.env.PORT || 3000;

    // add connection - farok
    connection.connect(function(err) {
        if (err) {
        console.error("error connecting: " + err.stack);
        return;
        }
        console.log("connected as id " + connection.threadId);
    });



    if (process.env.NODE_ENV !== 'production') {
        require('dotenv').config()
    };



    // const initializePassport = require('./passport-config');
    const initializePassport = require('./passport-config');

    const users1 = connection.query("SELECT * FROM info", function(err, res){
    initializePassport(
        
        passport, 
        email => users.find(user => user.email === email),
        id => users.find(user => user.id === id),
    );

    // once database is set up, get rid of this

    // const users = [];

    users = res
        console.log(users)
        console.log("res")
    });




    // starts view engine
    // since we're getting information from forms--allows us to access information 
    // from forms inside of our request variable inside of our post method
    app.set('view-engine', 'ejs');
    app.use(express.urlencoded({ extended: false }));
    app.use(flash())


    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }));


    app.use(passport.initialize());
    app.use(passport.session());
    app.use(methodOverride('_method'));

    // routes for login...
    app.get('/', checkAuthenticated, (req, res) =>{
        res.render('index.ejs', { name: req.user.name });
    });


    const emails = []


    app.get('/login', checkNotAuthenticated, (req, res) => {


        res.render('login.ejs');


        var emails1 =  connection.query("SELECT email FROM info", function(err, res){

            for (i = 0; i < res.length; i++) {
            emails.push(res[i].email)
            
                }
                
            });
    
            console.log(emails)
            console.log("emails")


    });

    app.post('/login', checkNotAuthenticated, passport.authenticate('local', {

    

        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,

    }));





    app.get('/register', checkNotAuthenticated, (req, res) => {
       

     

        res.render('register.ejs');


        var emails1 =  connection.query("SELECT email FROM info", function(err, res){

            for (i = 0; i < res.length; i++) {
            emails.push(res[i].email)
            
                }
                
            });
    
            console.log(emails)
            console.log("emails")

    });

  
    
    app.post('/register', checkNotAuthenticated, async (req, res) => {



        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            // users.push({
            //     // this will be replaced once database is set up
            //     id: Date.now().toString(),
            //     name: req.body.name,
            //     email: req.body.email,
            //     password: hashedPassword
            // })\
            


            var emails1 =  connection.query("SELECT email FROM info", function(err, res){

            for (i = 0; i < res.length; i++) {
            emails.push(res[i].email)
            
                }
                
            });
    
            console.log(emails)
            console.log("emails")
            

              

                if (req.body.email.includes(emails)){
                    res.render('register.ejs', {
                        message: 'this email existsl'
                    });
                }


        
            // if (req.body.email == "f5@f"){
            //     res.render('register.ejs', {
            //         message: 'this email existsl'
            //     });
           

                //console.log(req); - farok
                else { var sql = connection.query("INSERT INTO info SET ?",

                

                {
                name: req.body.name,
                email: req.body.email,
                password:hashedPassword
                },
                )

                            
                
                }

                
                const users1 = connection.query("SELECT * FROM info", function(err, res){
                                    initializePassport(
                                        
                                        passport, 
                                        email => users.find(user => user.email === email),
                                        id => users.find(user => user.id === id),
                                    );
                                    
                                    // once database is set up, get rid of this
                                    // const users = [];
                                    users = res
                                    });



                                

            res.redirect('/login')
            
        } catch {
            res.redirect('/register')
        }
        console.log(users);
        console.log("users");

    });




    app.delete('/logout', (req, res) => {
        req.logOut();
        res.redirect('/login');
    })


    function checkAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/login')
    }

    function checkNotAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/');
        }
        next();
    };

    // middleware for kelvin
    app.set('view engine', 'ejs');
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // code below creates the POST request fromt he uploads folder that holds the image. this is done by setting the method to POST in the html code and setting the action to /uploads which makes the file input save to that folder.
    app.post('/upload', (req, res) => {
        upload(req, res, (err) => {
            if (err) {
                res.render('index', {
                    msg: err
                });
            } else {

                //below is the conditional statement that will pass if the user hits the submit button without a file selected.
                if (req.file == undefined) {
                    res.render('index', {
                        msg: 'Error: No File Selected!'
                    });
                } else {

                    //below is the code that will be used to render and post the image to the image tag we have in our HTML code that is in index.ejs 
                    res.render('index', {
                        msg: 'File Uploaded!',
                        file: `uploads/${req.file.filename}`
                    });
                }
            }
        });
    });

    const storage = multer.diskStorage({
        destination: './public/uploads/',
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });

    // this is allowing the upload to be one file at a time instead of multiple - this also sets the file size limit
    const upload = multer({
        storage: storage,
        limits: { fileSize: 1000000 },
        fileFilter: function (req, file, cb) {
            checkFileType(file, cb);
        }
    }).single('myImage');



    // this function will check the type of file being uploaded so that its only a picture
    function checkFileType(file, cb) {
        //below are the files that will be allowed to be uploaded 
        const filetypes = /jpeg|jpg|png|gif/;


        // below is going to look at the file name and the extension to make sure its one of the ones we can allow above
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());


        // below checks the uploads information and makes sure the mime type of the image is a extension we allow like jpeg
        const mimetype = filetypes.test(file.mimetype);


        //the code below is conditional statement that checks both the mimetype and extension name to make sure it is what we allowed to be passed. 
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }

    app.listen(PORT, function() {
        // Log (server-side) when our server has started
        console.log("Server listening on: http://localhost:" + PORT);
    });