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

var mysql = require("mysql")


// FAROK Create instance of express app.

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;

// MySQL DB Connection Information (remember to change this with our specific credentials)
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "gw2019gw",
  database: "files"
});

// Initiate MySQL Connection.
connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
    console.log("connected as id " + connection.threadId);
  });
  
users = []
// FAROK link to database
const initializePassport = require('../passport-config');
        const users1 = connection.query("SELECT * FROM info", function(err, res){
        initializePassport(
            
            passport, 
            email => users.find(user => user.email === email),
            id => users.find(user => user.id === id),
        );
        users = res
        users.push(res[0].email)
            console.log(users)
            console.log("res")
        });



console.log(users.email)





// const initializePassport = require('../passport-config');
// initializePassport(
//     passport, 
//     email => users.find(user => user.email === email),
//     id => users.find(user => user.id === id)
// );

// // once database is set up, get rid of this
// const users = [];





module.exports = function(app) {
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
app.use(express.static(__dirname + '/public'));


// routes for login...
app.get('/index', checkAuthenticated, (req, res) =>{
    
    connection.query("SELECT * FROM file;", function(err, data) {
        if (err) {
          throw err;
        }
    
        function myFunction() {
            
        setTimeout(function()
          { res.render("upload", { images: data  });
        }, 
      
        2000);
        }
    
          myFunction()
      });

});


// // routes for login...
// app.get('/upload', checkAuthenticated, (req, res) =>{
    
//     connection.query("SELECT * FROM file;", function(err, data) {
//         if (err) {
//           throw err;
//         }
    
//         function myFunction() {
            
//         setTimeout(function()
//           { res.render("index", { images: data  });
//         }, 
      
//         2000);
//         }
    
//           myFunction()
//       });

// });

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

// app.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname, "../public/home-page.html"));
// });

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/home-page.html"));

  });




app.get("/about", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/about.html"));
});


app.get("/buy", function (req, res) {
  connection.query("SELECT * FROM file;", function(err, data) {
    if (err) {
      throw err;
    }

    function myFunction() {
        
    setTimeout(function()
      { res.render("buy", { images: data  });
    }, 
  
    2000);
    }

      myFunction()
  });

});


app.get("/contact-page", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/contact-page.html"));
});



app.get("/FQA", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/FQA.html"));
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/index',

    failureRedirect: '/login',
    failureFlash: true

}));

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
});

// app.post('/register', checkNotAuthenticated, async (req, res) => {
//     try {
//         const hashedPassword = await bcrypt.hash(req.body.password, 10);
//         users.push({
//             // this will be replaced once database is set up
//             id: Date.now().toString(),
//             name: req.body.name,
//             email: req.body.email,
//             password: hashedPassword
//         })
//         res.redirect('/login')
//     } catch {
//         res.redirect('/register')
//     }
//     console.log(users);
// });

// FAROK
app.post('/register', checkNotAuthenticated, async (req, res) => {

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
        // var emails1 =  connection.query("SELECT email FROM info", function(err, res){

        // for (i = 0; i < res.length; i++) {
        // emails.push(res[i].email)
        
        //     }
            
        // });

        // console.log(emails)
        // console.log("emails")
        
            // if (req.body.email.includes(emails)){
            //     res.render('register.ejs', {
            //         message: 'this email existsl'
            //     });
            // }

        // if (req.body.email == "f5@f"){
        //     res.render('register.ejs', {
        //         message: 'this email existsl'
        //     });
       

            //console.log(req); - farok
            var sql = connection.query("INSERT INTO info SET ?",     
            {
            name: req.body.name,
            email: req.body.email,
            password:hashedPassword
            },
            )
   
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
// code below creates the POST request fromt he uploads folder that holds the image. this is done by setting the method to POST in the html code and setting the action to /uploads which makes the file input save to that folder. 
app.post('/update', (req, res) => {
    upload(req, res, (err) => {
      if(err){
        res.render('index', {
          msg: err
        });
      } else {
  
        //below is the conditional statement that will pass if the user hits the submit button without a file selected.
        if(req.file == undefined){
          res.render('index', {
            msg: 'Error: No File Selected!'
          });
        } 
        else {
  
          //below is the code that will be used to render and post the image to the image tag we have in our HTML code that is in index.ejs 
          console.log('file received');
          //console.log(req);
          var sql = connection.query("INSERT INTO file SET ?",
  
            {
              name: req.file.filename ,
              type: req.file.mimetype,
              size: req.file.size,
              description:req.body.description,
              price:req.body.price,
              item:req.body.item,


            },
          )
  
          
         
        
          console.log('file add');
  
                  // var query = connection.query(sql, function(err, result) {
                  //    console.log('inserted data');
                  // });
          message = "Successfully! uploaded";
  
          res.render('index',{message: message, status:'success',
        
          // file: `uploads/${req.file.filename}`
  
        });
  
        console.log('before reload');
  
        // connection.query("INSERT INTO file (description) VALUES (?)", [req.body.task], function(err, result) {
        //   if (err) throw err;
      
        // });
  
        console.log('after reload');
   
        }
  
  
      }
    });


  
   res.redirect("/upload");
  
  });

  // routes for login...
app.get('/upload', checkAuthenticated, (req, res) =>{
    
    connection.query("SELECT * FROM file;", function(err, data) {
        if (err) {
          throw err;
        }
    
        function myFunction() {
            
        setTimeout(function()
          { res.render("index", { images: data  });
        }, 
      
        2000);
        }
    
          myFunction()
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


// // Delete a movie
app.delete("/api/file/:id", function(req, res) {
  connection.query("DELETE FROM file WHERE id = ?", [req.params.id], function(err, result) {
    if (err) {
      // If an error occurred, send a generic server failure
      return res.status(500).end();
    }
    else if (result.affectedRows === 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    }
    res.status(200).end();
    console.log(" end back delete")

  });
});

app.put("/api/filess/:id", function(req, res) {
  connection.query("UPDATE file SET price = ? WHERE id = ?", 
  [req.body.price, req.params.id], function(err, result) {
    if (err) {
      // If an error occurred, send a generic server failure
      return res.status(500).end();
    }
    else if (result.changedRows === 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    }
    res.status(200).end();
  console.log("Updated!")
  });
  });


  // app.get("/", function(req, res) {
  //     res.sendFile(path.join(__dirname, "../public/home-page.html"));
  // });

  // app.get("/about", function(req, res) {
  //   res.sendFile(path.join(__dirname, "../public/about.html"));
  // });


  // app.get("/buy", function(req, res) {
  //   res.sendFile(path.join(__dirname, "../public/buy.html"));
  // });


  // app.get("/contact-page", function(req, res) {
  //   res.sendFile(path.join(__dirname, "../public/contact-page.html"));
  // });



  // app.get("/FQA", function(req, res) {
  //   res.sendFile(path.join(__dirname, "../public/FQA.html"));
  // });



  // app.get("/signin", function(req, res) {
  //   res.sendFile(path.join(__dirname, "../public/signin-form.html"));
  // });



  // app.get("/signup", function(req, res) {
  //   res.sendFile(path.join(__dirname, "../public/signup-form.html"));
  // });


};


 
  