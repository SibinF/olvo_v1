const Country = require('../models/country.model.js');
var path = require("path");
let Err = require('../global');
const { check,validationResult } = require('express-validator/check');


// Find a single country with a countryId
exports.findbycountryId = (req, res) => {
Country.findById(req.params.countryId)
    .then(cntry_det => {
        if(!cntry_det) {
        	return res.status(Err.error_messages.not_found).json({
                  status : "false", 
                  status_code : Err.error_messages.not_found,
                  data : [],
                  error : { 
                      title : Err.error_messages.not_found_title,
                      message: "Country not found with id " + req.params.countryId
                    } 
              });           
        }
        // res.send(cntry_det);
        res.status(Err.error_messages.success_status).json({
              status : "true",
              status_code : Err.error_messages.success_status,
              data : cntry_det,
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
                      message: "Country not found with id " + req.params.countryId
                    } 
              });               
        }
        return res.status(Err.error_messages.server_error).json({
                  status : "false", 
                  status_code : Err.error_messages.server_error,
                  data : [],
                  error : { 
                      title : Err.error_messages.server_error_title,
                      message: "Error listing country with id " + req.params.countryId
                    }
            });
    });
};




// Retrieve and return all countries from the database.
exports.list = (req, res) => {
  Country.find()
    .then(allCntry => {
      if(allCntry.length == 0)
      {
          res.status(Err.error_messages.success_status).json({
                  status : "false",
                  status_code : Err.error_messages.success_status,
                  data : [],
                  error : { title : Err.error_messages.not_found_title, message: Err.error_messages.no_data }
                              });
      }
        res.send(allCntry);
        // res.status(Err.error_messages.success_status).json({
        //       status : "true",
        //       status_code : Err.error_messages.success_status,
        //       data : allCntry,
        //       error : []
        //   });
    }).catch(err => {
        res.status(Err.error_messages.server_error).json({
            status : "false",
            status_code : Err.error_messages.server_error,
            data : [],
            error : { title : Err.error_messages.db_err_title, message: Err.error_messages.db_err_msg }
        });
    });
};

