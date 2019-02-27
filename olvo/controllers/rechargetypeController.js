const Rechargetype = require('../models/recharge_type.model.js');
var path = require("path");
let Err = require('../global');
const { check,validationResult } = require('express-validator/check');


// Find a single recharge type with a rechargetypeId
exports.findbyrchgetypeId = (req, res) => {
Rechargetype.findById(req.params.rechargetypeId)
    .then(rchgetype_det => {
        if(!rchgetype_det) {
        	return res.status(Err.error_messages.not_found).json({
                  status : "false", 
                  status_code : Err.error_messages.not_found,
                  data : [],
                  error : { 
                      title : Err.error_messages.not_found_title,
                      message: "Rechargetype not found with id " + req.params.rechargetypeId
                    } 
              });           
        }
        // res.send(rchgetype_det);
        res.status(Err.error_messages.success_status).json({
              status : "true",
              status_code : Err.error_messages.success_status,
              data : rchgetype_det,
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
                      message: "Rechargetype not found with id " + req.params.rechargetypeId
                    } 
              });               
        }
        return res.status(Err.error_messages.server_error).json({
                  status : "false", 
                  status_code : Err.error_messages.server_error,
                  data : [],
                  error : { 
                      title : Err.error_messages.server_error_title,
                      message: "Error listing Rechargetype with id " + req.params.rechargetypeId
                    }
            });
    });
};




// Retrieve and return all Rechargetype from the database.
exports.list = (req, res) => {
  Rechargetype.find()
    .then(allrchgetype => {
      if(allrchgetype.length == 0)
      {
          res.status(Err.error_messages.success_status).json({
                  status : "false",
                  status_code : Err.error_messages.success_status,
                  data : [],
                  error : { title : Err.error_messages.not_found_title, message: Err.error_messages.no_data }
                              });
      }
        // res.send(allrchgetype);
        res.status(Err.error_messages.success_status).json({
              status : "true",
              status_code : Err.error_messages.success_status,
              data : allrchgetype,
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

