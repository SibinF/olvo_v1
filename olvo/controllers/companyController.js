const Company = require('../models/company.model.js');
var path = require("path");
let Err = require('../global');
const { check,validationResult } = require('express-validator/check');


// Find a single company with a companyId
exports.findbycompanyId = (req, res) => {
Company.findById(req.params.companyId).populate(['address.country_id']) 
    .then(cmpny_det => {
        if(!cmpny_det) {
        	return res.status(Err.error_messages.not_found).json({
                  status : "false", 
                  status_code : Err.error_messages.not_found,
                  data : [],
                  error : { 
                      title : Err.error_messages.not_found_title,
                      message: "Company not found with id " + req.params.companyId
                    } 
              });           
        }
        // res.send(cmpny_det);
        res.status(Err.error_messages.success_status).json({
              status : "true",
              status_code : Err.error_messages.success_status,
              data : cmpny_det,
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
                      message: "Company not found with id " + req.params.companyId
                    } 
              });               
        }
        return res.status(Err.error_messages.server_error).json({
                  status : "false", 
                  status_code : Err.error_messages.server_error,
                  data : [],
                  error : { 
                      title : Err.error_messages.server_error_title,
                      message: "Error listing company with id " + req.params.companyId
                    }
            });
    });
};




// Retrieve and return all countries from the database.
exports.list = (req, res) => {
  Company.find().populate(['address.country_id'])
    .then(allCmpy => {
      if(allCmpy.length == 0)
      {
          res.status(Err.error_messages.success_status).json({
                  status : "false",
                  status_code : Err.error_messages.success_status,
                  data : [],
                  error : { title : Err.error_messages.not_found_title, message: Err.error_messages.no_data }
                              });
      }
        // res.send(allCmpy);
         res.status(Err.error_messages.success_status).json({
              status : "true",
              status_code : Err.error_messages.success_status,
              data : allCmpy,
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

