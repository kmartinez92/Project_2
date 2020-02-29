if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
};

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override')

const initializePassport = require('./passport-config');
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

// once database is set up, get rid of this
const users = [];

// starts view engine
// app.set tells our server that we are using ejs syntax
app.set('view-engine', 'ejs');
// since we're getting information from forms--allows us to access information 
// from forms inside of our request variable inside of our post method
app.use(express.urlencoded({ extended: false }));
// flashes error message if invalid info is provided
app.use(flash())
app.use(session({
    // creates a key that encryts information
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// stores variables so they can be persisted throughout our session
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// our homepage route that you will need to be logged into to access
// this will be where we add image uploader page
app.get('/', checkAuthenticated, (req, res) =>{
    res.render('index2.ejs', { name: req.user.name });
});

// route for login page
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
});

// route to post to login
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

// route for register page
app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
});

// route to post to our register page
// asynchronous because we need to wait for password to be hashed
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            // this will be replaced once database is set up
            // id will be removed because it will be automatically generated in database
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        // if the above was successful, redirect to login page
        res.redirect('/login')
        // if there was a failure, catch and redirect back to register
    } catch {
        res.redirect('/register')
    }
    console.log(users);
});

app.delete('/logout', (req, res) => {
    // passport has this function which clears the session and logs the user out
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
}

app.listen(3000);