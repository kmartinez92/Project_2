var path = require("path");

module.exports = function(app) {

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/home-page.html"));
  });

  app.get("/about", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/about.html"));
  });


  app.get("/buy", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/buy.html"));
  });

  
  app.get("/contact-page", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/contact-page.html"));
  });


  
  app.get("/FQA", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/FQA.html"));
  });


  
  app.get("/signin", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/signin-form.html"));
  });


  
  app.get("/signup", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/signup-form.html"));
  });


};

 
  