const express = require('express');
const bodyParser = require('body-parser');
const OAuth2Server = require('oauth2-server');
let Err = require('./global');
// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
// app.use(bodyParser.json())

//add oauth server
const oauth = new OAuth2Server({
model: require('./Oauthfunctions'),
grants: ['authorization_code', 'password'],
debug: true,
allowBearerTokensInQueryString: true,
// accessTokenLifetime: 4 * 60 * 60
});


// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


 

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});


var mobileClient = require('./routes/api/v1/routes.js')
app.use("/v1",mobileClient)


var webClient = require('./routes/api/v2/routes.js')
app.use("/v2",webClient)

// var routes_Dir = require('./routes/api/routes.js')
// app.use("/v1",routes_Dir)

//Catch all Invalid urls
app.use(function(req, res, next) {
    return res.status(Err.error_messages.not_found).json({
                  status : "false",
                  status_code : Err.error_messages.not_found,
                  data : [],
                  error : { title : Err.error_messages.not_found_title, 
                  			message: "404: File Not Found" }
                              });
});
// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});