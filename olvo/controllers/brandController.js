const Brand = require('../models/brand.model.js');
const Product = require('../models/product.model.js');
var path = require("path");
let Err = require('../global');
const { check,validationResult } = require('express-validator/check');

// Create and Save a new brand
exports.create = [check('name').matches(/^[a-zA-Z0-9d\-_\s+]*$/).withMessage( Err.error_messages.name )
                               .isLength({ min: 4,max:25 }).withMessage( Err.error_messages.length ),
                  check('company_id').matches(/^[a-zA-Z0-9]*$/).withMessage( Err.error_messages.validity ).not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('logo').not().isEmpty().withMessage( Err.error_messages.empty ).custom((value,{req})=>
                  {
                    return new Promise((resolve, reject) =>
                    {
                      var ext = path.extname(req.body.logo);
                      if(ext)
                      {
                          if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') 
                          {
                              reject(new Error('Only png jpg jpeg extensions are allowed'))
                          }
                      }
                       resolve(true)
                    });
                  }),
                  check('recharge_type').not().isEmpty().withMessage( Err.error_messages.recharge_type ),
                  check('supported_dialers').not().isEmpty().withMessage( Err.error_messages.supported_dialer ),
                  check('country_enabled').not().isEmpty().withMessage( Err.error_messages.country_enabled ),
                  (req, res)=>{
  
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
                      
                    // Create a user
                    const brand_new = new Brand({
                        name : req.body.name,
                        company_id : req.body.company_id,
                        country_enabled : req.body.country_enabled,
                        recharge_type : req.body.recharge_type,
                        logo : req.body.logo,
                        supported_dialer : req.body.supported_dialers
                    });
                    // save values to database
                    // Brand.populate(brand_new, ['recharge_type','country_enabled','company_id'], function(err) {
                      brand_new.save()
                         .then(data => {
                                // res.send(data);
                                res.status(Err.error_messages.success_status).json({
                                    status : "true",
                                    status_code : Err.error_messages.success_status,
                                    data : [],
                                    error : { title : Err.error_messages.success_status_title, message: "Brand added successfully" }
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
                    // });
                  }];



// Retrieve and return all brands from the database.
exports.list = (req, res) => {
  Brand.find()
    .then(allBrands => {
      if(allBrands.length == 0)
      {
          res.status(Err.error_messages.success_status).json({
                  status : "false",
                  status_code : Err.error_messages.success_status,
                  data : [],
                  error : {
                            title : Err.error_messages.not_found_title, 
                            message: Err.error_messages.no_data 
                          }
                  });
      }
      else
      {
        // res.send(allBrands);
        res.status(Err.error_messages.success_status).json({
              status : "true",
              status_code : Err.error_messages.success_status,
              data : allBrands,
              error : []
          });
      }
        
    }).catch(err => {
        res.status(Err.error_messages.server_error).json({
            status : "false",
            status_code : Err.error_messages.server_error,
            data : [],
            error : { title : Err.error_messages.db_err_title, message: Err.error_messages.db_err_msg }
        });
    });
};





// Update a brand by the brandId
exports.update = [check('name').matches(/^[a-zA-Z0-9d\-_\s+]*$/).withMessage( Err.error_messages.name )
                               .isLength({ min: 4,max:25 }).withMessage( Err.error_messages.length ),
                  check('company_id').matches(/^[a-zA-Z0-9]*$/).withMessage( Err.error_messages.validity )
                                     .not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('logo').not().isEmpty().withMessage( Err.error_messages.empty ).custom((value,{req})=>
                  {
                    return new Promise((resolve, reject) =>
                    {
                      var ext = path.extname(req.body.logo);
                      if(ext)
                      {
                          if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') 
                          {
                              reject(new Error('Only png jpg jpeg extensions are allowed'))
                          }
                      }
                       resolve(true)
                    });
                  }),
                  check('recharge_type').not().isEmpty().withMessage( Err.error_messages.recharge_type ),
                  check('supported_dialers').not().isEmpty().withMessage( Err.error_messages.supported_dialer ),
                  check('country_enabled').not().isEmpty().withMessage( Err.error_messages.country_enabled ),
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
                                                message: Err.error_messages.validation_err_msg
                                              } 
                                      };
                        return res.status(Err.error_messages.unprocessable_entity).json(validation_log );
                      }


                      // Find a brand and update it with the request body
                      Brand.findByIdAndUpdate(req.params.brandId, {
                              name : req.body.name,
                              company_id : req.body.company_id,
                              country_enabled : req.body.country_enabled,
                              recharge_type : req.body.recharge_type,
                              logo : req.body.logo,
                              supported_dialer : req.body.supported_dialers
                      }, {new: true})
                      .then(update_brand => {
                          if(!update_brand) {
                              return res.status(Err.error_messages.not_found).json({
                                  status : "false", 
                                  status_code : Err.error_messages.not_found,
                                  data : [],
                                  error : { 
                                      title : Err.error_messages.not_found_title,
                                      message: "Brand not found with id " + req.params.brandId
                                    } 
                              });
                          }
                          // res.send(update_brand);
                          res.status(Err.error_messages.success_status).json({
                                    status : "true",
                                    status_code : Err.error_messages.success_status,
                                    data : [],
                                    error : { title : Err.error_messages.success_status_title, message: "Brand updated successfully" }
                                });
                      }).catch(err => {
                          if(err.kind === 'ObjectId') {
                              return res.status(Err.error_messages.not_found).json({
                                  status : "false", 
                                  status_code : Err.error_messages.not_found,
                                  data : [],
                                  error : { 
                                      title : Err.error_messages.not_found_title,
                                      message: "Brand not found with id " + req.params.brandId
                                    } 
                              });                
                          }
                          return res.status(Err.error_messages.server_error).json({
                                  status : "false", 
                                  status_code : Err.error_messages.server_error,
                                  data : [],
                                  error : { 
                                      title : Err.error_messages.server_error_title,
                                      message: "Error updating brand with id " + req.params.brandId
                                    }
                          });
                      });
                  }];




// Delete brand with the specified brandId
exports.delete = (req, res) => {
   Brand.findByIdAndRemove(req.params.brandId)
    .then(delbrands => 
    {
        if(!delbrands) 
        {
            return res.status(Err.error_messages.not_found).json({
                status : "false", 
                status_code : Err.error_messages.not_found,
                data : [],
                error : { 
                    title : Err.error_messages.not_found_title,
                    message: "Brand not found with id " + req.params.brandId
                  } 
            });
        }
        else
        {
          Product.find({brand_id:{$eq:req.params.brandId}}).exec(function(err, docs) 
          {
              if(docs.length > 0)
              {
                  docs.find(function(element) 
                  {
                    if(element._id)
                      {
                         Product.findByIdAndRemove(element._id).exec(function(err, docs)
                         {
                            res.status(Err.error_messages.success_status).json({
                                  status : "true",
                                  status_code : Err.error_messages.success_status,
                                  data : [],
                                  error : {
                                    title :Err.error_messages.success_status_title,
                                    message : "Brand deleted successfully!"
                                  }
                              });
                         })                             
                      }
                  })
              }
              else
              {
                  res.status(Err.error_messages.success_status).json({
                          status : "true",
                          status_code : Err.error_messages.success_status,
                          data : [],
                          error : {
                            title :Err.error_messages.success_status_title,
                            message : "Brand deleted successfully!"
                          }
                      });
              }
          })
        }
        
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(Err.error_messages.not_found).json({
                status : "false", 
                status_code : Err.error_messages.not_found,
                data : [],
                error : { 
                    title : Err.error_messages.not_found_title,
                    message: "Brand not found with id " + req.params.brandId
                  } 
            });                
        }
        return res.status(Err.error_messages.server_error).json({
                status : "false", 
                status_code : Err.error_messages.server_error,
                data : [],
                error : { 
                    title : Err.error_messages.server_error_title,
                    message: "Could not delete brand with id " + req.params.brandId
                  } 
            });
    });
};


// Find a single brand with a BrandId
exports.findbybrandId = (req, res) => {
Brand.findById(req.params.brandId).populate(['recharge_type','country_enabled','company_id','supported_dialer',{path:'company_id',populate:{path: 'address.country_id'}}])                                           
    .then(brand_det => {
        if(!brand_det) {
          return res.status(Err.error_messages.not_found).json({
                  status : "false", 
                  status_code : Err.error_messages.not_found,
                  data : [],
                  error : { 
                      title : Err.error_messages.not_found_title,
                      message: "Brand not found with id " + req.params.brandId
                    } 
              });           
        }
        // res.send(brand_det);
         res.status(Err.error_messages.success_status).json({
              status : "true",
              status_code : Err.error_messages.success_status,
              data : brand_det,
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
                      message: "Brand not found with id " + req.params.brandId
                    } 
              });               
        }
        return res.status(Err.error_messages.server_error).json({
                  status : "false", 
                  status_code : Err.error_messages.server_error,
                  data : [],
                  error : { 
                      title : Err.error_messages.server_error_title,
                      message: "Error listing Brand with id " + req.params.brandId
                    }
            });
    });
};










