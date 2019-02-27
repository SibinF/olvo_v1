const Shop = require('../models/shop.model.js');
const Brand = require('../models/brand.model.js');
var path = require("path");
let Err = require('../global');
const { check,validationResult } = require('express-validator/check');

// Create and Save a new shop
exports.create = [check('name').matches(/^[a-zA-Z0-9d\-_\s+]*$/).withMessage( Err.error_messages.name )
                               .isLength({ min: 3,max:25 }).withMessage( Err.error_messages.length ),
                  check('mobile_number').matches(/^[0-9]*$/).withMessage( Err.error_messages.phone )
                                        .not().isEmpty().withMessage( Err.error_messages.empty )
                                        .isLength({ min: 8,max:13}).withMessage( Err.error_messages.length ),
                  check('email').isEmail().withMessage( Err.error_messages.email )
                                .not().isEmpty().withMessage( Err.error_messages.empty )
                                .custom((value,{req})=>
                                {
                                  return new Promise((resolve, reject) =>
                                  {
                                    Shop.findOne({email: req.body.email}).then(function(result)
                                    {
                                          if(result != null)
                                          {
                                              reject(new Error(Err.error_messages.alrdy_exist))
                                          }
                                          resolve(true)
                                     });
                                  });
                                }),
                  check('credit_balance').matches(/^[0-9d\.]*$/).withMessage( Err.error_messages.balance )
                                         .not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('country_code').not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('country_id').not().isEmpty().withMessage( Err.error_messages.empty ),
                  // check('discount').not().isEmpty().withMessage( Err.error_messages.empty ),
                  (req, res)=>
                  {
                      const errors = validationResult(req);
                      if(!errors.isEmpty())
                      {
                        var validation_log = { 
                                      status : "false", 
                                      status_code : Err.error_messages.unprocessable_entity,
                                      data : [],
                                      error : { 
                                                title : Err.error_messages.validation_err_title,
                                                message: Err.error_messages.validation_err_msg,
                                                test:errors.array()
                                              } 
                                      };
                        return res.status(Err.error_messages.unprocessable_entity).json(validation_log );
                      }
                    Shop.find({'accounts.mobile_number':req.body.mobile_number})
                    .then(fndmob => 
                    {
                      if(fndmob.length == 0)
                      {
                          // Create a user
                          const shop_new = new Shop({
                              name : req.body.name,
                              email : req.body.email,
                              accounts :{
                                country_id : req.body.country_id,
                                mobile_number : req.body.mobile_number,
                                country_code : req.body.country_code
                              },
                              credit_balance : req.body.credit_balance,
                              brands : req.body.brands,
                              status : 0
                          });

                          // save values to database
                          shop_new.save()
                             .then(data => {
                                    // res.send(data);
                                    res.status(Err.error_messages.success_status).json({
                                          status : "true",
                                          status_code : Err.error_messages.success_status,
                                          data : [],
                                          error : { title : Err.error_messages.success_status_title, message: "Shop added successfully" }
                                      });
                                })
                             .catch(err => {
                                    res.status(Err.error_messages.server_error).json({
                                        status : "false",
                                        status_code : Err.error_messages.server_error,
                                        data : [],
                                        error : { title : Err.error_messages.db_err_title, message: Err.error_messages.db_err_msg }
                                    });
                                });
                      }
                      else
                      {
                        res.status(Err.error_messages.unprocessable_entity).json({
                                  status : "false",
                                  status_code : Err.error_messages.unprocessable_entity,
                                  data : [],
                                  error : { title : Err.error_messages.phone_alrdy_exist_title, message: Err.error_messages.phone_alrdy_exist }
                              });
                      }
                    
                     })
                  }];



// Retrieve and return all shops from the database.
exports.list = (req, res) => {
  Shop.find()
    .then(allshops => {
      if(allshops.length == 0)
      {
          res.status(Err.error_messages.success_status).json({
                  status : "false",
                  status_code : Err.error_messages.success_status,
                  data : [],
                  error : { title : Err.error_messages.not_found_title, message: Err.error_messages.no_data }
                              });
      }  
      // res.send(allshops);
      res.status(Err.error_messages.success_status).json({
              status : "true",
              status_code : Err.error_messages.success_status,
              data : allshops,
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



// Delete shop with the specified shopId
exports.delete = (req, res) => {
   Shop.findByIdAndRemove(req.params.shopId)
    .then(delbrands => {
        if(!delbrands) {
            return res.status(Err.error_messages.not_found).json({
                status : "false", 
                status_code : Err.error_messages.not_found,
                data : [],
                error : { 
                    title : Err.error_messages.not_found_title,
                    message: "Shop not found with id " + req.params.shopId
                  } 
            });
        }
        res.status(Err.error_messages.success_status).json({
            status : "true",
            status_code : Err.error_messages.success_status,
            data : [],
            error : {
              title :Err.error_messages.success_status_title,
              message : "Shop deleted successfully!"
            }
        });

    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(Err.error_messages.not_found).json({
                status : "false", 
                status_code : Err.error_messages.not_found,
                data : [],
                error : { 
                    title : Err.error_messages.not_found_title,
                    message: "Shop not found with id " + req.params.shopId
                  } 
            });                
        }
        return res.status(Err.error_messages.server_error).json({
                status : "false", 
                status_code : Err.error_messages.server_error,
                data : [],
                error : { 
                    title : Err.error_messages.server_error_title,
                    message: "Could not delete Shop with id " + req.params.shopId
                  } 
            });
    });
};



// Update a brand by the shopId
exports.update = [check('name').matches(/^[a-zA-Z0-9d\-_\s+]*$/).withMessage( Err.error_messages.name )
                               .isLength({ min: 3,max:25 }).withMessage( Err.error_messages.length ),
                  check('mobile_number').matches(/^[0-9]*$/).withMessage( Err.error_messages.phone )
                                        .not().isEmpty().withMessage( Err.error_messages.empty )
                                        .isLength({ min: 5}).withMessage( Err.error_messages.length ),
                  check('credit_balance').matches(/^[0-9d\.]*$/).withMessage( Err.error_messages.balance )
                                         .not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('country_code').not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('country_id').not().isEmpty().withMessage( Err.error_messages.empty ),
                  (req, res)=>
                  {
                      //validation
                      const errors = validationResult(req);
                      if(!errors.isEmpty())
                      {
                        var validation_log = { 
                                      status : "false", 
                                      status_code : Err.error_messages.unprocessable_entity,
                                      data : [],
                                      error : { 
                                                title : Err.error_messages.validation_err_title,
                                                message: Err.error_messages.validation_err_msg,
                                                test:errors.array()
                                              } 
                                      };
                        return res.status(Err.error_messages.unprocessable_entity).json(validation_log );
                      }


                      // Find a brand and update it with the request body
                      Shop.findByIdAndUpdate(req.params.shopId, {
                              name : req.body.name,
                              email : req.body.email,
                              accounts :{
                                country_id : req.body.country_id,
                                mobile_number : req.body.mobile_number,
                                country_code : req.body.country_code
                              },
                              credit_balance : req.body.credit_balance,
                              brands : req.body.brands,
                      }, {new: true})
                      .then(update_shop => {
                          if(!update_shop) {
                              return res.status(Err.error_messages.not_found).json({
                                  status : "false", 
                                  status_code : Err.error_messages.not_found,
                                  data : [],
                                  error : { 
                                      title : Err.error_messages.not_found_title,
                                      message: "Shop not found with id " + req.params.shopId
                                    } 
                              });
                          }
                          // res.send(update_shop);
                          res.status(Err.error_messages.success_status).json({
                            status : "true",
                            status_code : Err.error_messages.success_status,
                            data : [],
                            error : {
                              title :Err.error_messages.success_status_title,
                              message : "Shop updated successfully!"
                            }
                        });
                      }).catch(err => {
                          if(err.kind === 'ObjectId') {
                              return res.status(Err.error_messages.not_found).json({
                                  status : "false", 
                                  status_code : Err.error_messages.not_found,
                                  data : [],
                                  error : { 
                                      title : Err.error_messages.not_found_title,
                                      message: "Shop not found with id " + req.params.shopId
                                    } 
                              });                
                          }
                          return res.status(Err.error_messages.server_error).json({
                                  status : "false", 
                                  status_code : Err.error_messages.server_error,
                                  data : [],
                                  error : { 
                                      title : Err.error_messages.server_error_title,
                                      message: "Error updating Shop with id " + req.params.shopId
                                    }
                          });
                      });
                  }];



//Fetch Balance with shopId
exports.fetchBalance = (req, res) => {

Shop.findById(req.params.shopId).select({_id : 1,credit_balance :1})
    .then(shop => {
        if(!shop) {       
            res.status(Err.error_messages.not_found).json({
                status : "true",
                status_code : Err.error_messages.not_found,
                data : [],
                error : { 
                          title : Err.error_messages.not_found_title,
                          message: "Shop not found with id " + req.params.shopId
                        }
            });  
        }
        else
        {
            // res.send(shop);
            res.status(Err.error_messages.success_status).json({
                            status : "true",
                            status_code : Err.error_messages.success_status,
                            data : shop,
                            error : []
                        });
        }
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            res.status(Err.error_messages.not_found).json({
                status : "true",
                status_code : Err.error_messages.not_found,
                data : [],
                error : { 
                          title : Err.error_messages.not_found_title,
                          message: "Shop not found with id " + req.params.shopId
                        }
            });                
        }
        res.status(Err.error_messages.server_error).json({
                status : "false",
                status_code : Err.error_messages.server_error,
                data : [],
                error : { 
                          title : Err.error_messages.server_error_title,
                          message: "Error retrieving Shop with id " + req.params.shopId
                        }
            });
    });
};


//Retrieve shop details with shopId
exports.findbyshopId = (req, res) => {
Shop.findById(req.params.shopId).populate(['accounts.country_id','brands.brand_id'])                                           
    .then(shop_det => {
        if(!shop_det) {
          return res.status(Err.error_messages.not_found).json({
                  status : "true", 
                  status_code : Err.error_messages.not_found,
                  data : [],
                  error : { 
                      title : Err.error_messages.not_found_title,
                      message: "Shop not found with id " + req.params.shopId
                    } 
              });           
        }
        // res.send(shop_det);
         res.status(Err.error_messages.success_status).json({
              status : "true",
              status_code : Err.error_messages.success_status,
              data : shop_det,
              error : []
          });
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(Err.error_messages.not_found).json({
                  status : "true", 
                  status_code : Err.error_messages.not_found,
                  data : [],
                  error : { 
                      title : Err.error_messages.not_found_title,
                      message: "Shop not found with id " + req.params.shopId
                    } 
              });               
        }
        return res.status(Err.error_messages.server_error).json({
                  status : "false", 
                  status_code : Err.error_messages.server_error,
                  data : [],
                  error : { 
                      title : Err.error_messages.server_error_title,
                      message: "Error listing Shop with id " + req.params.shopId
                    }
            });
    });
};
