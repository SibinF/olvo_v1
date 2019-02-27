const Product = require('../models/product.model.js');
var path = require("path");
let Err = require('../global');
const { check,validationResult } = require('express-validator/check');


//create new products
exports.create = [check('name').matches(/^[a-zA-Z0-9d\-_\s+]*$/).withMessage( Err.error_messages.name )
                               .isLength({ min: 4,max:25 }).withMessage( Err.error_messages.length ),
                  check('title').not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('description').not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('offer_message').not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('buy_rate').matches(/^[0-9d\.]*$/).withMessage( Err.error_messages.only_number )
                             .not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('brand_id').not().isEmpty().withMessage( Err.error_messages.empty ),
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
                  check('recharge_type').not().isEmpty().withMessage( Err.error_messages.recharge_type ),
                  check('profit_margin').matches(/^[0-9d\.]*$/).withMessage( Err.error_messages.only_number )
                              .not().isEmpty().withMessage( Err.error_messages.empty ),
                   (req, res) => {
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

                          // Create a new product
                          const product_new = new Product({
                              name : req.body.name,
                              title: req.body.title,
                              description: req.body.description,
                              offer_message: req.body.offer_message,
                              brand_id : req.body.brand_id,
                              buy_rate : req.body.buy_rate,
                              profit_margin: req.body.profit_margin,
                              recharge_type : req.body.recharge_type,
                              image : req.body.image
                          });
                        // save values to database
                          product_new.save()
                             .then(data => {
                                    res.send(data);
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




// Update a product by productId
exports.update = [check('name').matches(/^[a-zA-Z0-9d\-_\s+]*$/).withMessage( Err.error_messages.name )
                               .isLength({ min: 4,max:25 }).withMessage( Err.error_messages.length ),
                  check('title').not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('description').not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('offer_message').not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('buy_rate').matches(/^[0-9d\.]*$/).withMessage( Err.error_messages.only_number )
                             .not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('brand_id').not().isEmpty().withMessage( Err.error_messages.empty ),
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
                  check('recharge_type').not().isEmpty().withMessage( Err.error_messages.recharge_type ),
                  check('profit_margin').matches(/^[0-9d\.]*$/).withMessage( Err.error_messages.only_number )
                              .not().isEmpty().withMessage( Err.error_messages.empty ),
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
                      Product.findByIdAndUpdate(req.params.productId, {
                                name : req.body.name,
                            title: req.body.title,
                            description: req.body.description,
                            offer_message: req.body.offer_message,
                            brand_id : req.body.brand_id,
                            buy_rate : req.body.buy_rate,
                            profit_margin: req.body.profit_margin,
                            recharge_type : req.body.recharge_type,
                            image : req.body.image
                      }, {new: true})
                      .then(update_product => {
                          if(!update_product) {
                              return res.status(Err.error_messages.not_found).json({
                                  status : "false", 
                                  status_code : Err.error_messages.not_found,
                                  data : [],
                                  error : { 
                                      title : Err.error_messages.not_found_title,
                                      message: "Product not found with id " + req.params.productId
                                    } 
                              });
                          }
                          res.send(update_product);
                      }).catch(err => {
                          if(err.kind === 'ObjectId') {
                              return res.status(Err.error_messages.not_found).json({
                                  status : "false", 
                                  status_code : Err.error_messages.not_found,
                                  data : [],
                                  error : { 
                                      title : Err.error_messages.not_found_title,
                                      message: "Product not found with id " + req.params.productId
                                    } 
                              });                
                          }
                          return res.status(Err.error_messages.server_error).json({
                                  status : "false", 
                                  status_code : Err.error_messages.server_error,
                                  data : [],
                                  error : { 
                                      title : Err.error_messages.server_error_title,
                                      message: "Error updating Product with id " + req.params.productId
                                    }
                          });
                      });
                  }];



// Find a single product with a brandId
exports.findbybrandId = (req, res) => {

Product.find({brand_id:req.params.brandId})
    .then(prod_det => {
        if(!prod_det) {
          return res.status(Err.error_messages.not_found).json({
                  status : "false", 
                  status_code : Err.error_messages.not_found,
                  data : [],
                  error : { 
                      title : Err.error_messages.not_found_title,
                      message: "Product not found with brandId " + req.params.brandId
                    } 
              });           
        }
        res.send(prod_det);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(Err.error_messages.not_found).json({
                  status : "false", 
                  status_code : Err.error_messages.not_found,
                  data : [],
                  error : { 
                      title : Err.error_messages.not_found_title,
                      message: "Product not found with brandId " + req.params.brandId
                    } 
              });               
        }
        return res.status(Err.error_messages.server_error).json({
                  status : "false", 
                  status_code : Err.error_messages.server_error,
                  data : [],
                  error : { 
                      title : Err.error_messages.server_error_title,
                      message: "Error listing Product with brandId " + req.params.brandId
                    }
            });
    });
};



// Find a single product with a ProductId
exports.findbyproductId = (req, res) => {

Product.findById(req.params.productId)
    .then(prod_det => {
        if(!prod_det) {
          return res.status(Err.error_messages.not_found).json({
                  status : "false", 
                  status_code : Err.error_messages.not_found,
                  data : [],
                  error : { 
                      title : Err.error_messages.not_found_title,
                      message: "Product not found with id " + req.params.productId
                    } 
              });           
        }
        res.send(prod_det);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(Err.error_messages.not_found).json({
                  status : "false", 
                  status_code : Err.error_messages.not_found,
                  data : [],
                  error : { 
                      title : Err.error_messages.not_found_title,
                      message: "Product not found with id " + req.params.productId
                    } 
              });               
        }
        return res.status(Err.error_messages.server_error).json({
                  status : "false", 
                  status_code : Err.error_messages.server_error,
                  data : [],
                  error : { 
                      title : Err.error_messages.server_error_title,
                      message: "Error listing Product with id " + req.params.productId
                    }
            });
    });
};





// Delete product with the specified productId
exports.deletebyId = (req, res) => {
   Product.findByIdAndRemove(req.params.productId)
    .then(delproductsbyid => {
        if(!delproductsbyid) {
            return res.status(Err.error_messages.not_found).json({
                status : "false", 
                status_code : Err.error_messages.not_found,
                data : [],
                error : { 
                    title : Err.error_messages.not_found_title,
                    message: "Product not found with id " + req.params.productId
                  } 
            });
        }
        res.json({
            status : "true",
            status_code : Err.error_messages.success_status,
            data : "Product deleted successfully!",
            error : {
              title :Err.error_messages.success_status_title,
              message : "Product deleted successfully!"
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
                    message: "Product not found with id " + req.params.productId
                  } 
            });                
        }
        return res.status(Err.error_messages.server_error).json({
                status : "false", 
                status_code : Err.error_messages.server_error,
                data : [],
                error : { 
                    title : Err.error_messages.server_error_title,
                    message: "Could not delete product with id " + req.params.productId
                  } 
            });
    });
};



//create new product varient
exports.create_prod_varient = [check('display_name').matches(/^[a-zA-Z0-9d\-_\s+]*$/).withMessage( Err.error_messages.name )
                               .isLength({ min: 4,max:25 }).withMessage( Err.error_messages.length ),
                  check('profit_margin').matches(/^[0-9d\.]*$/).withMessage( Err.error_messages.only_number )
                             .not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('max_retail_price').matches(/^[0-9d\.]*$/).withMessage( Err.error_messages.only_number )
                             .not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('sell_rate').matches(/^[0-9d\.]*$/).withMessage( Err.error_messages.only_number )
                             .not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('sell_rate_local').matches(/^[0-9d\.]*$/).withMessage( Err.error_messages.only_number )
                              .not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('country_id').not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('sku').not().isEmpty().withMessage( Err.error_messages.empty )
                          .matches(/^[a-zA-Z0-9]*$/).withMessage( Err.error_messages.sku )
                          .isLength({ min: 6,max:6 }).withMessage( Err.error_messages.length ),
                   (req, res) => 
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
                                                    message: Err.error_messages.validation_err_msg
                                                  } 
                                          };
                            return res.status(Err.error_messages.unprocessable_entity).json(validation_log );
                          }
                          Product.findById(req.params.productId)
                  .then(prod_det_find => 
                  {
                    //ProductId not found
                      if(!prod_det_find) 
                      {
                        return res.status(Err.error_messages.not_found).json({
                                status : "false", 
                                status_code : Err.error_messages.not_found,
                                data : [],
                                error : { 
                                    title : Err.error_messages.not_found_title,
                                    message: "Product not found with id " + req.params.productId
                                  } 
                            });           
                      }
                      else
                      {
                        Product.find({'varient.sku':{$eq:req.body.sku}})
                      .then(prodvart_det => 
                      {
                        prodvart_det.find(function(element) 
                        {             
                          //if varients for the product are available
                          if(element.varient.sku.length > 0)
                          { 
                            var arr = element.varient.sku;
                          var arr_include = arr.includes(req.body.sku);
                            if(arr_include == true)
                            {
                              return res.status(Err.error_messages.not_found).json({
                                        status : "false", 
                                        status_code : Err.error_messages.not_found,
                                        data : [],
                                        error : { 
                                            title : Err.error_messages.not_found_title,
                                            message: "Already exists Sku ID " + req.body.sku
                                          } 
                                    }); 
                            }
                        }    
                      })
                      if(prodvart_det.length == 0)
                      {
                          Product.findOneAndUpdate(
                           { _id: req.params.productId }, 
                           { $push: { varient:{
                                        display_name : req.body.display_name,
                                            profit_margin: req.body.profit_margin,
                                            max_retail_price: req.body.max_retail_price,
                                            sell_rate: req.body.sell_rate,
                                            sell_rate_local : req.body.sell_rate_local,
                                            country_id : req.body.country_id,
                                            sku : req.body.sku
                                        }  } },{new: true})
                            .then(users => {
                                res.send(users);
                            }).catch(err => 
                            {
                                  if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                                    return res.status(Err.error_messages.not_found).json({
                                        status : "false", 
                                        status_code : Err.error_messages.not_found,
                                        data : [],
                                        error : { 
                                            title : Err.error_messages.not_found_title,
                                            message: "Product not found with id " + req.params.productId
                                          } 
                                    });                
                                }
                                return res.status(Err.error_messages.server_error).json({
                                        status : "false", 
                                        status_code : Err.error_messages.server_error,
                                        data : [],
                                        error : { 
                                            title : Err.error_messages.server_error_title,
                                            message: "Error inserting Product varient with product id " + req.params.productId
                                          } 
                                    });
                            });
                      }
                      
                    })
                  }
                  })
                        
            
              }];



// List product varient under a product with product ID

exports.findvarientbyproductId = (req, res) => {

Product.find({_id:req.params.productId},'varient')
    .then(prodvart_det => {
        if(!prodvart_det) {
          return res.status(Err.error_messages.not_found).json({
                  status : "false", 
                  status_code : Err.error_messages.not_found,
                  data : [],
                  error : { 
                      title : Err.error_messages.not_found_title,
                      message: "Varient not found with product id " + req.params.productId
                    } 
              });           
        }
        res.send(prodvart_det);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(Err.error_messages.not_found).json({
                  status : "false", 
                  status_code : Err.error_messages.not_found,
                  data : [],
                  error : { 
                      title : Err.error_messages.not_found_title,
                      message: "Varient not found with product id " + req.params.productId
                    } 
              });               
        }
        return res.status(Err.error_messages.server_error).json({
                  status : "false", 
                  status_code : Err.error_messages.server_error,
                  data : [],
                  error : { 
                      title : Err.error_messages.server_error_title,
                      message: "Error updating varient with Product id " + req.params.productId
                    }
            });
    });
};



// Delete a varient from a product with product ID and varient ID
exports.delvarientbyId = (req, res) => {
  Product.findById(req.params.productId)
    .then(prod_det => 
    {
      //ProductId not found
        if(!prod_det) 
        {
          return res.status(Err.error_messages.not_found).json({
                  status : "false", 
                  status_code : Err.error_messages.not_found,
                  data : [],
                  error : { 
                      title : Err.error_messages.not_found_title,
                      message: "Product not found with id " + req.params.productId
                    } 
              });           
        }
    Product.find({_id:req.params.productId},'varient.sku')
      .then(prodvart_det => 
      {
        prodvart_det.find(function(element) 
        {
          //if varients for the product are available
          if(element.varient.sku.length > 0)
          {
            var arr = element.varient.sku;
          var arr_include = arr.includes(req.params.varientId);
            if(arr_include == true)
            {
              //delete product varient sucessfully
              Product.findByIdAndUpdate(
                   { '_id': req.params.productId}, 
                   { $pull: { 'varient':{ 'sku' : req.params.varientId }}}, 
                  ).then(delbrands => {
                        res.json({
                            status : "true",
                            status_code : Err.error_messages.success_status,
                            data : "Product varient deleted successfully!",
                            error : {
                              title :Err.error_messages.success_status_title,
                              message : "Product varient deleted successfully!"
                            }
                        });
                    })
            }
            else
            {
              //product varient not found with given sku value
              return res.status(Err.error_messages.not_found).json({
                            status : "false", 
                            status_code : Err.error_messages.not_found,
                            data : [],
                            error : { 
                                title : Err.error_messages.server_error_title,
                                message: "Could not found product varient with sku id " + req.params.varientId
                              } 
                            });
            }
          }
          else
          {
            //no varient found
            return res.status(Err.error_messages.not_found).json({
                      status : "false", 
                      status_code : Err.error_messages.not_found,
                      data : [],
                      error : { 
                          title : Err.error_messages.server_error_title,
                          message: "Could not found product varient for product id " + req.params.productId
                        } 
                      });
          }
      });
    })
  }).catch(err => 
    {
      //invalid productid
          if(err.kind === 'ObjectId') {
              return res.status(Err.error_messages.not_found).json({
                    status : "false", 
                    status_code : Err.error_messages.not_found,
                    data : [],
                    error : { 
                        title : Err.error_messages.not_found_title,
                        message: "Product not found with id " + req.params.productId
                      } 
                });               
          }
          return res.status(Err.error_messages.server_error).json({
                    status : "false", 
                    status_code : Err.error_messages.server_error,
                    data : [],
                    error : { 
                        title : Err.error_messages.server_error_title,
                        message: "Error Deleting Product with id " + req.params.productId
                      }
              });
      });
  };




// Update/edit Product varient with product id and varient ID

exports.updatevarientbyId = [check('display_name').matches(/^[a-zA-Z0-9d\-_\s+]*$/).withMessage( Err.error_messages.name )
                               .isLength({ min: 4,max:25 }).withMessage( Err.error_messages.length ),
                  check('profit_margin').matches(/^[0-9d\.]*$/).withMessage( Err.error_messages.only_number )
                             .not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('max_retail_price').matches(/^[0-9d\.]*$/).withMessage( Err.error_messages.only_number )
                             .not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('sell_rate').matches(/^[0-9d\.]*$/).withMessage( Err.error_messages.only_number )
                             .not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('sell_rate_local').matches(/^[0-9d\.]*$/).withMessage( Err.error_messages.only_number )
                              .not().isEmpty().withMessage( Err.error_messages.empty ),
                  check('country_id').not().isEmpty().withMessage( Err.error_messages.empty ),
                        (req, res) => 
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
                                                      message: Err.error_messages.validation_err_msg
                                                    } 
                                            };
                              return res.status(Err.error_messages.unprocessable_entity).json(validation_log );
                            }

                Product.findById(req.params.productId)
                  .then(prod_det_find => 
                  {
                    //ProductId not found
                      if(!prod_det_find) 
                      {
                        return res.status(Err.error_messages.not_found).json({
                                status : "false", 
                                status_code : Err.error_messages.not_found,
                                data : [],
                                error : { 
                                    title : Err.error_messages.not_found_title,
                                    message: "Product not found with id " + req.params.productId
                                  } 
                            });           
                      }
                  Product.find({_id:req.params.productId},'varient.sku')
                    .then(prodvart_updte => 
                    {
                      prodvart_updte.find(function(element) 
                      {
                        //if varients for the product are available
                        if(element.varient.sku.length > 0)
                        {
                          var arr = element.varient.sku;
                        var arr_include = arr.includes(req.params.varientId);
                          if(arr_include == true)
                          {
                            //delete product varient sucessfully
                            Product.findOneAndUpdate(
                                 { '_id': req.params.productId}, 
                                 { $set: { 'varient':{ 
                                              display_name : req.body.display_name,
                                                      profit_margin: req.body.profit_margin,
                                                      max_retail_price: req.body.max_retail_price,
                                                      sell_rate: req.body.sell_rate,
                                                      sell_rate_local : req.body.sell_rate_local,
                                                      country_id : req.body.country_id,
                                                      sku :req.params.varientId
                                            }
                                      }
                                  }, 
                                ).then(varient_updte => {
                                      res.json({
                                          status : "true",
                                          status_code : Err.error_messages.success_status,
                                          data : "Product varient Updated successfully!",
                                          error : {
                                            title :Err.error_messages.success_status_title,
                                            message : "Product varient Updated successfully!"
                                          }
                                      });
                                  })
                          }
                          else
                          {
                            //product varient not found with given sku value
                            return res.status(Err.error_messages.not_found).json({
                                          status : "false", 
                                          status_code : Err.error_messages.not_found,
                                          data : [],
                                          error : { 
                                              title : Err.error_messages.server_error_title,
                                              message: "Could not found product varient with sku id " + req.params.varientId
                                            } 
                                          });
                          }
                        }
                        else
                        {
                          //no varient found
                          return res.status(Err.error_messages.not_found).json({
                                    status : "false", 
                                    status_code : Err.error_messages.not_found,
                                    data : [],
                                    error : { 
                                        title : Err.error_messages.server_error_title,
                                        message: "Could not found product varient for product id " + req.params.productId
                                      } 
                                    });
                        }
                    });
                  })
                }).catch(err => 
                {
                  //invalid productid
                      if(err.kind === 'ObjectId') {
                          return res.status(Err.error_messages.not_found).json({
                                status : "false", 
                                status_code : Err.error_messages.not_found,
                                data : [],
                                error : { 
                                    title : Err.error_messages.not_found_title,
                                    message: "Product not found with id " + req.params.productId
                                  } 
                            });               
                      }
                      return res.status(Err.error_messages.server_error).json({
                                status : "false", 
                                status_code : Err.error_messages.server_error,
                                data : [],
                                error : { 
                                    title : Err.error_messages.server_error_title,
                                    message: "Error Updating Product with id " + req.params.productId
                                  }
                          });
                  });
              }];