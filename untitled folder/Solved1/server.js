// Dependencies
var express = require("express");
var mysql = require("mysql");
var multer = require("multer");
var ejs = require("ejs"); 
var path = require("path"); 

// Create instance of express app.
var app = express();

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


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static("public"));






// this is setting where the images will be stored along with how they'll be named once saved
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// this is allowing the upload to be one file at a time instead of multiple - this also sets the file size limit
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');





// this function will check the type of file being uploaded so that its only a picture
function checkFileType(file, cb){
  //below are the files that will be allowed to be uploaded 
  const filetypes = /jpeg|jpg|png|gif/;


  // below is going to look at the file name and the extension to make sure its one of the ones we can allow above
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());


  // below checks the uploads information and makes sure the mime type of the image is a extension we allow like jpeg
  const mimetype = filetypes.test(file.mimetype);


  //the code below is conditional statement that checks both the mimetype and extension name to make sure it is what we allowed to be passed. 
  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}




//bringing in EJS templates 
app.set('view engine', 'ejs');


// app.get('/', (req, res) => res.render('index'));




app.get("/", function(req, res) {
  connection.query("SELECT * FROM file;", function(err, data) {
    if (err) {
      throw err;
    }

    // Test it.
    // console.log('The solution is: ', data);

    // Test it.
    
    function myFunction() {

      // setTimeout(function() {
      //   $('#loading').addClass('hidden');
      // }, 3000);


    setTimeout(function()
      { res.render("index", { images: data  })
    }, 
  
    2000);
    }

      myFunction()




    // console.log("befoure imges")
    // var images = []
    //   console.log("after imges")

    // for (var i = 0; i < data.length; i++) {
    //   console.log(data[i].name);

    //   img = (data[i].name)
    //   console.log(img)
    //   images.push(img);


    //  return res.render("index", {file: `uploads/${data[i].name}`});

      // res.render('index',
      // {
      // file: `uploads/${res1}`    
      // }
      // );

      
    // }
    // res.render("index", { images: data  } );

   // res.render("index", { wishes: data });
  });
});


// app.post("/", function(req, res) {
//   // Test it
//   // console.log('You sent, ' + req.body.task);

//   // Test it
//   // return res.send('You sent, ' + req.body.task);

//   // When using the MySQL package, we'd use ?s in place of any values to be inserted, which are then swapped out with corresponding elements in the array
//   // This helps us avoid an exploit known as SQL injection which we'd be open to if we used string concatenation
//   // https://en.wikipedia.org/wiki/SQL_injection
//   connection.query("INSERT INTO file (description) VALUES (?)", [req.body.task], function(err, result) {
//     if (err) throw err;

//     res.redirect("/");
//   });
// });




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
            description:req.body.task
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

  res.redirect("/");

});

console.log('after post');



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



// // Delete a movie
app.put("/api/filess/:id", function(req, res) {
connection.query("UPDATE file SET description = ? WHERE id = ?", 
[req.body.movie, req.params.id], function(err, result) {
  if (err) {
    // If an error occurred, send a generic server failure
    return res.status(500).end();
  }
  else if (result.changedRows === 0) {
    // If no rows were changed, then the ID must not exist, so 404
    return res.status(404).end();
  }
  res.status(200).end();
console.log("testtest")
});
});


// function allImage() {
//   connection.query("SELECT * FROM file", function(req, res) {
//     for (var i = 0; i < res.length; i++) {
//       console.log(res[i].name);

//       res1 = res[i].name
//       console.log(res1)

//       res.render('index',
//       {
//       file: `uploads/${res1}`    
//       }
//       );

      
//     }

//     console.log("-----------------------------------");
//   });
// }




// function allImage() {
//   connection.query("SELECT * FROM file", function(err, res) {
//     if (err) throw err;
//     for (var i = 0; i < res.length; i++) {
//       console.log(res[i].name );





//       res.render('index', 
//       { file : `uploads/${res[i].name}`

//       })
//     }
//     console.log("-----------------------------------");
//   });
// }



// function createProduct() {
//   console.log("Inserting a new product...\n");
 

//     console.log('file received');
//     //console.log(req);
//     var query = connection.query("INSERT INTO files SET ?",

//       {
//         name: req.file.fieldname + '-' + Date.now() + path.extname(file.originalname) ,
//         type: req.file.mimetype,
//         size: req.file.size
//       },


//     function(err, res) {
//       if (err) throw err;
//       console.log(res.affectedRows + " product inserted!\n");
//       // Call updateProduct AFTER the INSERT completes
//     }
//   );

//   // logs the actual query being run
//   console.log(query.sql);
// }


// // Routes
// app.get("/cast", function(req, res) {
//   connection.query("SELECT * FROM actors ORDER BY id", function(err, result) {
//     if (err) throw err;
    
//     var html = "<h1>Actors Ordered BY ID</h1>";

//     html += "<ul>";

//     for (var i = 0; i < result.length; i++) {
//       html += "<li><p> ID: " + result[i].id + "</p>";
//       html += "<p> Name: " + result[i].name + "</p>";
//       html += "<p> Coolness Points: " + result[i].coolness_points + "</p>";
//       html += "<p>Attitude: " + result[i].attitude + "</p></li>";
//     }

//     html += "</ul>";

//     res.send(html);
//   });
// });

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});

















// app.post('/api/v1/upload',upload.single('profile'), function (req, res) {
//   message : "Error! in image upload."
//     if (!req.file) {
//         console.log("No file received");
//           message = "Error! in image upload."
//         res.render('index',{message: message, status:'danger'});
    
//       } else {
//         console.log('file received');
//         console.log(req);
//         var sql = "INSERT INTO `file`(`name`, `type`, `size`) VALUES ('" + req.file.filename + "', '"+req.file.mimetype+"', '"+req.file.size+"')";
 
//                 var query = db.query(sql, function(err, result) {
//                    console.log('inserted data');
//                 });
//         message = "Successfully! uploaded";
//         res.render('index',{message: message, status:'success'});
 
//       }
// });



// var db = require("./models");





// db.sequelize.sync({ force: true }).then(function() {
//     app.listen(PORT, function() {
//       console.log("App listening on PORT " + PORT);
//     });
//   });
  