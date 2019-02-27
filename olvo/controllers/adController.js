const Ads = require('../models/ad.model.js');
var path = require("path");
let Err = require('../global');
const { check,validationResult } = require('express-validator/check');

// Create and Save a new Ad
exports.create = [check('name').matches(/^[a-zA-Z0-9d\-_\s+]*$/).withMessage( Err.error_messages.name )
                               .isLength({ min: 3,max:25 }).withMessage( Err.error_messages.length ),
                  check('title').matches(/^[a-zA-Z0-9d\-_\s+]*$/).withMessage( Err.error_messages.name )
                               .isLength({ min: 3,max:25 }).withMessage( Err.error_messages.length ),
                  check('image').not().isEmpty().withMessage( Err.error_messages.empty ).custom((value,{req})=>
                  {
                    return new Promise((resolve, reject) =>
                    {
                      var ext = path.extname(req.body.image);
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
                  check('description').not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('country_id').not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('brand_id').not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('promo_start').not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('promo_end').not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('status').not().isEmpty().withMessage( Err.error_messages.empty ),
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
                    // Create a ad
                    const ad_new = new Ads({
                        name : req.body.name,
                        title : req.body.title,
                        country_id : req.body.country_id,
                        image : req.body.image,
                        description : req.body.description,
                        brand_id : req.body.brand_id,
                        status : req.body.status,
                        promo_start : req.body.promo_start,
                        promo_end : req.body.promo_end
                    });

                    // save values to database
                    ad_new.save()
                       .then(data => {
                              // res.send(data); 
                              res.status(Err.error_messages.success_status).json({
                                    status : "true",
                                    status_code : Err.error_messages.success_status,
                                    data : [],
                                    error : { title : Err.error_messages.success_status_title, message: "Ad added successfully" }
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
                  }];



// Find an ad with a countryId
exports.findbycountryId = (req, res) => {

Ads.find({country_id:req.params.countryId})
    .then(ad_details => {
        if(!ad_details) {
          return res.status(Err.error_messages.not_found).json({
                  status : "false", 
                  status_code : Err.error_messages.not_found,
                  data : [],
                  error : { 
                      title : Err.error_messages.not_found_title,
                      message: "Ad not found with countryId " + req.params.countryId
                    } 
              });           
        }
        // res.send(ad_details);
        res.status(Err.error_messages.success_status).json({
              status : "true",
              status_code : Err.error_messages.success_status,
              data : ad_details,
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
                      message: "Ad not found with countryId " + req.params.countryId
                    } 
              });               
        }
        return res.status(Err.error_messages.server_error).json({
                  status : "false", 
                  status_code : Err.error_messages.server_error,
                  data : [],
                  error : { 
                      title : Err.error_messages.server_error_title,
                      message: "Error listing Ad with countryId " + req.params.countryId
                    }
            });
    });
};




// Find an ad with a brandId
exports.findbybrandId = (req, res) => {

Ads.find({brand_id:req.params.brandId})
    .then(ad_details => {
        if(!ad_details) {
          return res.status(Err.error_messages.not_found).json({
                  status : "false", 
                  status_code : Err.error_messages.not_found,
                  data : [],
                  error : { 
                      title : Err.error_messages.not_found_title,
                      message: "Ad not found with brandId " + req.params.brandId
                    } 
              });           
        }
        // res.send(ad_details);
        res.status(Err.error_messages.success_status).json({
              status : "true",
              status_code : Err.error_messages.success_status,
              data : ad_details,
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
                      message: "Ad not found with brandId " + req.params.brandId
                    } 
              });               
        }
        return res.status(Err.error_messages.server_error).json({
                  status : "false", 
                  status_code : Err.error_messages.server_error,
                  data : [],
                  error : { 
                      title : Err.error_messages.server_error_title,
                      message: "Error listing Ad with brandId " + req.params.brandId
                    }
            });
    });
};



// Delete ad with the specified adId
exports.delete = (req, res) => {
   Ads.findByIdAndRemove(req.params.adId)
    .then(del_ad => {
        if(!del_ad) {
            return res.status(Err.error_messages.not_found).json({
                status : "false", 
                status_code : Err.error_messages.not_found,
                data : [],
                error : { 
                    title : Err.error_messages.not_found_title,
                    message: "Ad not found with id " + req.params.adId
                  } 
            });
        }
        res.status(Err.error_messages.success_status).json({
            status : "true",
            status_code : Err.error_messages.success_status,
            data : [],
            error : {
              title :Err.error_messages.success_status_title,
              message : "Ad deleted successfully!"
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
                    message: "Ad not found with id " + req.params.adId
                  } 
            });                
        }
        return res.status(Err.error_messages.server_error).json({
                status : "false", 
                status_code : Err.error_messages.server_error,
                data : [],
                error : { 
                    title : Err.error_messages.server_error_title,
                    message: "Could not delete Ad with id " + req.params.adId
                  } 
            });
    });
};



// Update a Ad by the adId
exports.update = [check('name').matches(/^[a-zA-Z0-9d\-_\s+]*$/).withMessage( Err.error_messages.name )
                               .isLength({ min: 3,max:25 }).withMessage( Err.error_messages.length ),
                  check('title').matches(/^[a-zA-Z0-9d\-_\s+]*$/).withMessage( Err.error_messages.name )
                               .isLength({ min: 3,max:25 }).withMessage( Err.error_messages.length ),
                  check('image').not().isEmpty().withMessage( Err.error_messages.empty ).custom((value,{req})=>
                  {
                    return new Promise((resolve, reject) =>
                    {
                      var ext = path.extname(req.body.image);
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
                  check('description').not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('country_id').not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('brand_id').not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('promo_start').not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('promo_end').not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('status').not().isEmpty().withMessage( Err.error_messages.empty ),
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


                      // Find an ad and update it with the request body
                      Ads.findByIdAndUpdate(req.params.adId, {
                                name : req.body.name,
                                title : req.body.title,
                                country_id : req.body.country_id,
                                image : req.body.image,
                                description : req.body.description,
                                brand_id : req.body.brand_id,
                                status : req.body.status,
                                promo_start : req.body.promo_start,
                                promo_end : req.body.promo_end
                      }, {new: true})
                      .then(update_ad => {
                          if(!update_ad) {
                              return res.status(Err.error_messages.not_found).json({
                                  status : "false", 
                                  status_code : Err.error_messages.not_found,
                                  data : [],
                                  error : { 
                                      title : Err.error_messages.not_found_title,
                                      message: "Ad not found with id " + req.params.adId
                                    } 
                              });
                          }
                          // res.send(update_ad);
                          res.status(Err.error_messages.success_status).json({
                                    status : "true",
                                    status_code : Err.error_messages.success_status,
                                    data : [],
                                    error : { title : Err.error_messages.success_status_title, message: "Ad updated successfully" }
                                });
                      }).catch(err => {
                          if(err.kind === 'ObjectId') {
                              return res.status(Err.error_messages.not_found).json({
                                  status : "false", 
                                  status_code : Err.error_messages.not_found,
                                  data : [],
                                  error : { 
                                      title : Err.error_messages.not_found_title,
                                      message: "Ad not found with id " + req.params.adId
                                    } 
                              });                
                          }
                          return res.status(Err.error_messages.server_error).json({
                                  status : "false", 
                                  status_code : Err.error_messages.server_error,
                                  data : [],
                                  error : { 
                                      title : Err.error_messages.server_error_title,
                                      message: "Error updating Ad with id " + req.params.adId
                                    }
                          });
                      });
                  }];