const Shop = require('../models/shop.model.js');
const Transaction = require('../models/transaction.model.js');
const Product = require('../models/product.model.js');
let Err = require('../global');
const { check,validationResult } = require('express-validator/check');
const mongoose = require('mongoose');

//recharge api
exports.recharge = [check('shopId').matches(/^[a-zA-Z0-9]*$/).withMessage( Err.error_messages.validity ).not().isEmpty().withMessage( Err.error_messages.empty ),
				    check('brandId').matches(/^[a-zA-Z0-9]*$/).withMessage( Err.error_messages.validity ).not().isEmpty().withMessage( Err.error_messages.empty ),
				    check('productId').matches(/^[a-zA-Z0-9]*$/).withMessage( Err.error_messages.validity ).not().isEmpty().withMessage( Err.error_messages.empty ),
				    check('varientId').matches(/^[a-zA-Z0-9]*$/).withMessage( Err.error_messages.validity ).not().isEmpty().withMessage( Err.error_messages.empty ),
				    check('NoOfCards').matches(/^[0-9]*$/).withMessage( Err.error_messages.only_number ).not().isEmpty().withMessage( Err.error_messages.empty ),
				    (req, res) => 
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

						Shop.find({'_id':req.body.shopId,'status':1}).then(shopdetails =>
					    {
					    	if(shopdetails.length)
					    	{
					    		shopdetails.find(function(element)
						        {
						        	var shop_balance = element.credit_balance;
						        	if(shop_balance > 0)
						        	{
						        		var shop_country = element.accounts.country_id;
										Product.aggregate([
											{$unwind:'$varient'},
											{$match : {$and: [{'brand_id': mongoose.Types.ObjectId(req.body.brandId),
																'_id': mongoose.Types.ObjectId(req.body.productId),
																'varient._id': mongoose.Types.ObjectId(req.body.varientId),
																'varient.country_id' :mongoose.Types.ObjectId(shop_country) }]}},
											{$project:{_id:1,name:1,title:1,description:1,offer_message:1,varient:"$varient"}}
											],function (err, product_det) 
												{
													if(product_det.length > 0)
													{
														product_det.find(function(element)
						        						{
						        							if(req.body.NoOfCards > 0)
						        							{
						        								var sellrate = req.body.NoOfCards * element.varient.sell_rate;
						        								if(shop_balance >= sellrate)
							        							{
							        								// Call recharge api of specific brands for 
							        								// checking mobile number existance
							        								// and for recharge 

							        								// updated balance
							        									// var new_balance = shop_balance - sellrate;


							        								// save value to transaction table

							        					// 			Err.CreateTXNNumber(sellrate, function(TXN_number) 
						    										// { 
													       //              const transaction_new = new Transaction({
													       //                  transaction_number : TXN_number,
													       //                  transaction_type : 0,
													       //                  shop_id : req.body.shopId,
													       //                  recharge_type : '5c00d9ef7dd7a23f08bdae5f',
													       //                  updated_balance : new_balance,
													       //                  amount : sellrate,
													       //                  status : 1
													       //              });
													       //              // save values to database
													       //                transaction_new.save()
													       //                   .then(data => {
													       //                          // res.send(data);
													       //                          res.status(Err.error_messages.success_status).json({
													       //                              status : "true",
													       //                              status_code : Err.error_messages.success_status,
													       //                              data : [],
													       //                              error : { title : Err.error_messages.success_status_title, message: "Transaction successfully" }
													       //                          });
													       //                      })
													       //                   .catch(err => {
													       //                          res.status(Err.error_messages.server_error).json({
													       //                              status : "false",
													       //                              status_code : Err.error_messages.server_error,
													       //                              data : [],
													       //                              error : { title : Err.error_messages.db_err_title, message: Err.error_messages.db_err_msg }
													       //                          });
													       //                      });
						    										// });
						    										
							        								
							        								//update shop balance in shop table
							        								// Shop.update( { _id: { $eq:req.body.shopId } },{ $set: { credit_balance:new_balance } } ).exec();

							        							}
							        							else
							        							{
							        								return res.status(Err.error_messages.server_error).json({
														                  status : "false", 
														                  status_code : Err.error_messages.not_found,
														                  data : [],
														                  error : { 
														                      title : Err.error_messages.server_error_title,
														                      message: "Recharge not possible"
														                    }
														            });
							        							}
						        							}
						        							else
						        							{
						        								res.status(Err.error_messages.not_found).json({
													              status : "false", 
													              status_code : Err.error_messages.not_found,
													              data : [],
													              error : { 
													                  title : Err.error_messages.not_found_title,
													                  message: "Credit unavailable please recharge"
													                } 
												          		});
						        							}
						        						});
													}
													else
													{
														return res.status(Err.error_messages.server_error).json({
											                  status : "false", 
											                  status_code : Err.error_messages.not_found,
											                  data : [],
											                  error : { 
											                      title : Err.error_messages.server_error_title,
											                      message: "Varient not found"
											                    }
											            });
													}
												});
						        	}
						        	else
						        	{
						        		res.status(Err.error_messages.not_found).json({
							              status : "false", 
							              status_code : Err.error_messages.not_found,
							              data : [],
							              error : { 
							                  title : Err.error_messages.not_found_title,
							                  message: "No Credit please recharge"
							                } 
						          		});
						        	}
						        })
					    	}
					    	else
					    	{
					    		res.status(Err.error_messages.not_found).json({
						              status : "false", 
						              status_code : Err.error_messages.not_found,
						              data : [],
						              error : { 
						                  title : Err.error_messages.not_found_title,
						                  message: "Shop not found"
						                } 
					          		});
					    	}
					    });

					
					}];



//Recharge History
exports.rechargeHistory = (req, res) => 
{
	//transaction_type //credit 1 // debit 2 // both 3
	var arr = [];
	Transaction.aggregate([
		{$match : {'shop_id': mongoose.Types.ObjectId(req.body.shopId) }},
		{$project:{_id:1,transaction_number:1,amount:1,transaction_type:1,createdAt: { $dateToString: { format: "%Y/%m/%d", date: "$createdAt" } } }}
		],function (err, txn_det) 
			{
				if(txn_det.length > 0)
    			{
        			Err.dateCompareAndLimit(req.body.date_from,req.body.date_to,txn_det, function(result)
		        	{
		        		res.status(Err.error_messages.not_found).json({
						              result
					          		});
		        	}); 
    			}
			});
	// Transaction.find({'shop_id':req.body.shopId}).select('_id transaction_number amount transaction_type createdAt').then(findtxn => 
 //    {
 //    	if(findtxn.length > 0)
 //    	{
 //    		findtxn.find(function(element)
	//         {
	//         	Err.dateCompareAndLimit(req.body.date_from,req.body.date_to,element.createdAt, function(result)
	//         	{
	//         		console.log(result);
	//         	}); 	
	//         	// arr.push(element);
	//         })
 //        	if(arr.length > 0)
 //        	{
 //        		res.status(Err.error_messages.success_status).json({
	//                       status : "true",
	//                       status_code : Err.error_messages.success_status,
	//                       data : arr,
	//                       error : []
	//                   });
 //        	}
 //        	else
 //        	{
 //        		return res.status(Err.error_messages.server_error).json({
 //                    status : "false", 
 //                    status_code : Err.error_messages.server_error,
 //                    data : [],
 //                    error : { 
 //                        title : Err.error_messages.server_error_title,
 //                        message: "No data Found"
 //                      }
 //              });
 //        	}
 //    	}
 //    	else
 //    	{
 //    		return res.status(Err.error_messages.server_error).json({
 //                    status : "false", 
 //                    status_code : Err.error_messages.server_error,
 //                    data : [],
 //                    error : { 
 //                        title : Err.error_messages.server_error_title,
 //                        message: "No data Found"
 //                      }
 //              });
 //    	}
 //    }).catch(err => {
 //          if(err.kind === 'ObjectId') 
 //          {
 //              return res.status(Err.error_messages.not_found).json({
 //                    status : "true", 
 //                    status_code : Err.error_messages.not_found,
 //                    data : [],
 //                    error : { 
 //                        title : Err.error_messages.not_found_title,
 //                        message: "Invalid Id"
 //                      } 
 //                });               
 //          }
 //          return res.status(Err.error_messages.server_error).json({
 //                    status : "false", 
 //                    status_code : Err.error_messages.server_error,
 //                    data : [],
 //                    error : { 
 //                        title : Err.error_messages.server_error_title,
 //                        message: "No data Found"
 //                      }
 //              });
 //        });
};






//Recharge History Detailed
exports.rechargeHistoryDetailed =(req, res) => 
{
	var arr = [];
	Transaction.find({'_id':req.params.transactionId}).then(findtxn => 
    {
    	if(findtxn.length > 0)
    	{
    		findtxn.find(function(element)
	        {
	        	arr.push(element);
	        })
        	if(arr.length > 0)
        	{
        		res.status(Err.error_messages.success_status).json({
	                      status : "true",
	                      status_code : Err.error_messages.success_status,
	                      data : arr,
	                      error : []
	                  });
        	}
        	else
        	{
        		return res.status(Err.error_messages.server_error).json({
                    status : "false", 
                    status_code : Err.error_messages.server_error,
                    data : [],
                    error : { 
                        title : Err.error_messages.server_error_title,
                        message: "No data Found"
                      }
              });
        	}
    	}
    	else
    	{
    		return res.status(Err.error_messages.server_error).json({
                    status : "false", 
                    status_code : Err.error_messages.server_error,
                    data : [],
                    error : { 
                        title : Err.error_messages.server_error_title,
                        message: "No data Found"
                      }
              });
    	}
    }).catch(err => {
          if(err.kind === 'ObjectId') 
          {
              return res.status(Err.error_messages.not_found).json({
                    status : "true", 
                    status_code : Err.error_messages.not_found,
                    data : [],
                    error : { 
                        title : Err.error_messages.not_found_title,
                        message: "Invalid Id"
                      } 
                });               
          }
          return res.status(Err.error_messages.server_error).json({
                    status : "false", 
                    status_code : Err.error_messages.server_error,
                    data : [],
                    error : { 
                        title : Err.error_messages.server_error_title,
                        message: "No data Found"
                      }
              });
        });
};