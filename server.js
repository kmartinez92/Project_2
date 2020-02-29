var express = require("express");
var multer = require("multer");
var ejs = require("ejs"); 
var path = require("path"); 


//start app below with express
var app = express(); 


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

// code below creates the POST request from the uploads folder that holds the image. this is done by setting the method to POST in the html code and setting the action to /uploads which makes the file input save to that folder. 
app.post('/upload', (req, res) => {
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


var PORT = process.env.PORT || 3000; 

// var db = require("./models");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static("public"));

app.get('/public/home-page.html', (req, res) => res.render('home-page.html'));

app.listen(PORT, function(){

  console.log("App listening on PORT" + PORT);
});

// db.sequelize.sync({ force: true }).then(function() {
//     app.listen(PORT, function() {
//       console.log("App listening on PORT " + PORT);
//     });
//   });



// Routes below 
require("./routes/html-routes.js")(app);

  