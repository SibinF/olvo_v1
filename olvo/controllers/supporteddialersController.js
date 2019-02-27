const SupportedDialers = require('../models/supporteddialers.model.js');
var path = require("path");
let Err = require('../global');
const { check,validationResult } = require('express-validator/check');


// Find a single dialer with a dialerId
exports.findbydialerId = (req, res) => {
SupportedDialers.findById(req.params.dialerId)
    .then(sprt_dial => {
        if(!sprt_dial) {
        	return res.status(Err.error_messages.not_found).json({
                  status : "false", 
                  status_code : Err.error_messages.not_found,
                  data : [],
                  error : { 
                      title : Err.error_messages.not_found_title,
                      message: "Dialer not found with id " + req.params.dialerId
                    } 
              });           
        }
        // res.send(sprt_dial);
        res.status(Err.error_messages.success_status).json({
              status : "true",
              status_code : Err.error_messages.success_status,
              data : sprt_dial,
              error : []
          });
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(Err.error_messages.not_found).json({
                  status : "false", 
                  status_code : Err.error_messages.not_found,
                  data : [],
                  error : { 
                      title : Err.error_messages.not_found_title,
                      message: "Dialer not found with id " + req.params.dialerId
                    } 
              });               
        }
        return res.status(Err.error_messages.server_error).json({
                  status : "false", 
                  status_code : Err.error_messages.server_error,
                  data : [],
                  error : { 
                      title : Err.error_messages.server_error_title,
                      message: "Error listing dialer with id " + req.params.dialerId
                    }
            });
    });
};




// Retrieve and return all dialers from the database.
exports.list = (req, res) => {
  SupportedDialers.find()
    .then(allsprt_dial => {
      if(allsprt_dial.length == 0)
      {
          res.status(Err.error_messages.success_status).json({
                  status : "false",
                  status_code : Err.error_messages.success_status,
                  data : [],
                  error : { title : Err.error_messages.not_found_title, message: Err.error_messages.no_data }
                              });
      }
        // res.send(allsprt_dial);
        res.status(Err.error_messages.success_status).json({
              status : "true",
              status_code : Err.error_messages.success_status,
              data : allsprt_dial,
              error : []
          });
    }).catch(err => {
        res.status(Err.error_messages.server_error).json({
            status : "false",
            status_code : Err.error_messages.server_error,
            data : [],
            error : { title : Err.error_messages.db_err_title, message: Err.error_messages.db_err_msg }
        });
    });
};

