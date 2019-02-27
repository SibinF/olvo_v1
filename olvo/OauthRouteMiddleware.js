var oauthServer = require('oauth2-server');
var Request = oauthServer.Request;
var Response = oauthServer.Response;
const model = require('./Oauthfunctions');
const oauth = new oauthServer({ model });


module.exports = function(req, res, next) {
  
   var request = new Request({
     headers: {authorization: req.headers.authorization},
     method: req.method,
     query: req.query,
     body: req.body
   });
   var response = new Response(res);
   console.log(response);

   oauth.authenticate(request, response)
     .then(function (token) {
       // Request is authorized.
       req.user = token
       next();
     })
     .catch(function (err) {
       // Request is not authorized.
       // res.status(err.code || 500).json(err)
       return res.status(err.statusCode).json({
                      status : "false", 
                      status_code : err.statusCode,
                      data : [],
                      error : { 
                          title : err.name,
                          message: err.message
                        } 
                  });
     });
 }
