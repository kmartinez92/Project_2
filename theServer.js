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

var PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
};


app.use(express.static(__dirname + '/public'));



require("./routes/html-routes.js")(app)

app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
  });

