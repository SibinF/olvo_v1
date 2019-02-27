var path = require("path");
let Err = require('../global');
const Oauthuser = require('../models/OAuthUsers.model.js');
const { check,validationResult } = require('express-validator/check');
const Oauthclient = require('../models/OAuthClients.model.js');
const OTP = require('../models/otp.model.js');
const Shop = require('../models/shop.model.js');

const OAuth2Server = require('oauth2-server');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const model = require('../Oauthfunctions');
const oauth = new OAuth2Server({ model });

var request = require('request');

//Check mobile and send OTP
exports.sendOTP = [check('mobile').not().isEmpty().withMessage( Err.error_messages.empty ),
				   check('countryCode').not().isEmpty().withMessage( Err.error_messages.empty ),
				   check('deviceId').not().isEmpty().withMessage( Err.error_messages.empty ),
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
                                message: Err.error_messages.validation_err_msg,
                                // test:errors.array()
                              } 
                      };
        return res.status(Err.error_messages.unprocessable_entity).json(validation_log );
      }
    var countrycodeWithMobileNumber = req.body.countryCode+req.body.mobile;
    Err.checkUserExist(countrycodeWithMobileNumber, function(result) 
    {        
        if(result == null)
        {
        	res.status(Err.error_messages.success_status).json({
              status : "false",
              status_code : Err.error_messages.success_status,
              data : [],
              error : { title : Err.error_messages.not_found_title, 
              			message: "Not yet Registered"
              		  }
                });
        }
        else
        {
        	//new user
        	if(result.status == 0)
        	{
        		// Shop.update( { _id: { $eq:result._id } },{ $set: { deviceId:req.body.deviceId } } ).exec();
        		Err.OTPProcess(countrycodeWithMobileNumber, function(result)
    			{
					if(result == null)
			        {
			        	res.status(Err.error_messages.server_error).json({
		                    status : "false",
		                    status_code : Err.error_messages.server_error,
		                    data : [],
		                    error : { title : Err.error_messages.db_err_title, message: Err.error_messages.db_err_msg }
		                });
			        }
			        else
			        {
			        	res.status(Err.error_messages.success_status).json({
	                            status : "true",
	                            status_code : Err.error_messages.success_status,
	                            data : [],
	                            error : {
	                              title :Err.error_messages.success_status_title,
	                              message : "Check OTP for further process "+result
	                            }
	                        });
			        }
				}); 
        	}
        	else if(result.status == 1)
        	{
        		if(req.body.deviceId == result.deviceId)
        		{
        			//redirect to login
        			res.status(Err.error_messages.success_status).json({
	                  status : "true",
	                  status_code : Err.error_messages.success_status,
	                  data : [],
	                  error : { title : Err.error_messages.success_status_title, 
	                  			message: "Redirect to login" },
	                  deviceIdStatus : "true"
	                              });
        		}
        		else
        		{
        			//sent otp
        			Err.OTPProcess(countrycodeWithMobileNumber, function(result)
        			{
    					if(result == null)
				        {
				        	res.status(Err.error_messages.server_error).json({
			                    status : "false",
			                    status_code : Err.error_messages.server_error,
			                    data : [],
			                    error : { title : Err.error_messages.db_err_title, message: Err.error_messages.db_err_msg }
			                });
				        }
				        else
				        {
				        	res.status(Err.error_messages.success_status).json({
		                            status : "true",
		                            status_code : Err.error_messages.success_status,
		                            data : [],
		                            error : {
		                              title :Err.error_messages.success_status_title,
		                              message : "Check OTP for further process "+result
		                            }
		                        });
				        }
    				});  
        		}
        	}
        	else
        	{
        		res.status(Err.error_messages.success_status).json({
                  status : "false",
                  status_code : Err.error_messages.success_status,
                  data : [],
                  error : { title : Err.error_messages.not_found_title, 
                  			message: "Unable to login Please contact administrator" }
                              });
        	}
        }
    });                           
}];




//Verify mobile and OTP
exports.verifyOTP =[check('mobile').not().isEmpty().withMessage( Err.error_messages.empty ),
					check('code').not().isEmpty().withMessage( Err.error_messages.empty ),
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
                        message: Err.error_messages.validation_err_msg,
                        // test:errors.array()
                      } 
              };
        return res.status(Err.error_messages.unprocessable_entity).json(validation_log );
      }

      //check shop registered or not
     Shop.find({'accounts.mobile_number':req.body.mobile})
    .then(shopnum => 
    {
	    if(shopnum.length == 0)
	    {
	    	//not registered
          res.status(Err.error_messages.success_status).json({
                  status : "false",
                  status_code : Err.error_messages.success_status,
                  data : [],
                  error : { title : Err.error_messages.not_found_title, 
                  			message: "Not yet Registered" }
                              });
	    } 
	    else
	    {
	    	//Registered and check if otp and mobile exists in otp list
	    	OTP.find( { $and: [ { mobile_number: { $eq: req.body.mobile } }, { code: { $eq: req.body.code } } ] } )
		    .then(otp => 
		    {
			    if(otp.length == 0)
			    {
			    	//not in list
		          	res.status(Err.error_messages.success_status).json({
		                    status : "false",
		                    status_code : Err.error_messages.success_status,
		                    data : [],
		                    error : {
		                      title :Err.error_messages.not_found_title,
		                      message : "Invalid OTP"
		                    }
		                });
			    }  
			    else
			    {
			    	//Otp exists check the otp expired or not
			    	otp.find(function(element)
			    	{
	        			var current_time = new Date();
						var otp_time = new Date(element.createdAt);
						if(current_time-otp_time > 5*60*1000)
						{
							// otp expired
							  res.status(Err.error_messages.success_status).json({
	                            status : "false",
	                            status_code : Err.error_messages.success_status,
	                            data : [],
	                            error : {
	                              title :Err.error_messages.success_status_title,
	                              message : "OTP Expired!"
	                            }
	                        });
						}
						else
						{
							//otp verified
							console.log(element.mobile_number);
							res.status(Err.error_messages.success_status).json({
		                        status : "true",
		                        status_code : Err.error_messages.success_status,
		                        data : [],
		                        error : {
		                          title :Err.error_messages.success_status_title,
		                          message : "OTP verified successfully!"
		                        }
		                    }); 
						}
			    	})
			    }
			}).catch(err => {
		        res.status(Err.error_messages.success_status).json({
                  status : "false",
                  status_code : Err.error_messages.success_status,
                  data : [],
                  error : { title : Err.error_messages.not_found_title, 
                  			message: Err.error_messages.no_data }
                              });
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
}];




//login api
exports.login =[check('username').not().isEmpty().withMessage( Err.error_messages.empty ),
				check('password').not().isEmpty().withMessage( Err.error_messages.empty ),
				check('deviceId').not().isEmpty().withMessage( Err.error_messages.empty ),
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
	                    message: Err.error_messages.validation_err_msg,
	                    // test:errors.array()
	                  } 
	          };
	    return res.status(Err.error_messages.unprocessable_entity).json(validation_log);
	}
      //check shop registered or not
    Err.checkUserExist(req.body.username, function(result) 
    { 
    	if(result == null)
        {
        	res.status(Err.error_messages.success_status).json({
              status : "false",
              status_code : Err.error_messages.success_status,
              data : [],
              error : { title : Err.error_messages.not_found_title, 
              			message: "Not yet Registered"
              		  }
                });
        }
        else
        {
        	if(result.status == 0)
        	{
        		//first login save new user to users table
    			var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    			Oauthuser.find({username:{$eq:req.body.username}}).exec(function(err, docs) 
		  		{
		  			if(docs.length > 0)
		  			{
		  				res.status(Err.error_messages.success_status).json({
				              status : "false",
				              status_code : Err.error_messages.success_status,
				              data : [],
				              error : { title : Err.error_messages.not_found_title, 
				              			message: "Already exist"
				              		  }
				                });
		  			}
		  			else
		  			{
		  				const user_new = new Oauthuser({
						      username : req.body.username,
						      password: hashedPassword
						  	});
							// save values to database
					      	user_new.save()
					        .then(data => 
					        {
				                // res.send(data);
				                var headers = {
								        'Content-Type': 'application/x-www-form-urlencoded'
								    }
								var postData = {
								 client_id: 'bedbc7b69c606d59e2c358a456391231',
								 client_secret:'3ffcd8e19b5d2e381620f9ed3224df3f7559dd26c7c3477f89b37b1ab4855b2d',
								 grant_type:'password',
								 username:req.body.username,
								 password:hashedPassword
								}

								request.post({url:'http://localhost:3000/v1/oauth/token', form: postData,headers:headers}, 
									function(err,httpResponse,body){ 
										if (err) 
										{
								    		res.status(Err.error_messages.success_status).json({
							                  status : "false",
							                  status_code : Err.error_messages.success_status,
							                  data : [],
							                  error : { title : Err.error_messages.not_found_title, message: Err.error_messages.no_data }
							                              });
								  		}
										// res.json(body); 
										else
										{
											Shop.updateOne({$and:[ { 'accounts.mobile_number': { $eq:req.body.username } },{ status: { $eq:0 } } ] }, { $set: { status:1 , deviceId:req.body.deviceId } },function(err, docs)
											{
				               					if(docs)
				               					{
				               						var values = JSON.parse(body);
							                		res.status(Err.error_messages.success_status).json({
							                            status : "true",
							                            status_code : Err.error_messages.success_status,
							                            data : values,
							                            error : []
							                        });
				               					}
				               					else
				               					{
				               						res.status(Err.error_messages.success_status).json({
									                  status : "false",
									                  status_code : Err.error_messages.success_status,
									                  data : [],
									                  error : { title : Err.error_messages.not_found_title, message: Err.error_messages.no_data }
									                              });
				               					}
				               				});
										}
				                })
				            }).catch(err => {
				                res.status(Err.error_messages.server_error).json({
				                    status : "false",
				                    status_code : Err.error_messages.server_error,
				                    data : [],
				                    error : { title : Err.error_messages.db_err_title, message: Err.error_messages.db_err_msg }
				                });
				            });
		  			}
		  		})
        	}
        	else if(result.status == 1)
        	{
        		Oauthuser.find({username:{$eq:req.body.username}}).exec(function(err, docs) 
		  		{
		  			if(docs.length > 0)
		  			{
		  				docs.find(function(element) 
		  				{
		  					var passwordIsValid = bcrypt.compareSync(req.body.password, element.password);
		  					// console.log(passwordIsValid);
		  					if(passwordIsValid == true)
		  					{
		  						res.status(Err.error_messages.success_status).json({
				                  status : "true",
				                  status_code : Err.error_messages.success_status,
				                  data : [],
				                  error : { title : Err.error_messages.success_status_title, 
				                  			message: "login successfully" }
				                              });
		  					}
		  					else
		  					{
		  						res.status(Err.error_messages.success_status).json({
				                  status : "false",
				                  status_code : Err.error_messages.success_status,
				                  data : [],
				                  error : { title : Err.error_messages.not_found_title, 
				                  			message: "Incorrect Password" }
				                              });
		  					}
		  				})
		  			}
		  			else
		  			{
		  				res.status(Err.error_messages.success_status).json({
				              status : "false",
				              status_code : Err.error_messages.success_status,
				              data : [],
				              error : { title : Err.error_messages.not_found_title, 
				              			message: "Not Found"
				              		  }
				                });
		  			}
		  		})

        		// if(req.body.deviceId == result.deviceId)
        		// {
        		// 	//login directly
        		// 	res.status(Err.error_messages.success_status).json({
	         //          status : "true",
	         //          status_code : Err.error_messages.success_status,
	         //          data : [],
	         //          error : { title : Err.error_messages.success_status_title, 
	         //          			message: "login successfully" },
	         //          deviceIdStatus : "true"
	         //                      });
        		// }
        		// else
        		// {
        		// 	//sent otp
        		// 	res.status(Err.error_messages.success_status).json({
	         //          status : "true",
	         //          status_code : Err.error_messages.success_status,
	         //          data : [],
	         //          error : { title : Err.error_messages.not_found_title, 
	         //          			message: "Otp process" },
	         //          deviceIdStatus : "false"
	         //                      });
        		// }
        	}
        	else
        	{
        		res.status(Err.error_messages.success_status).json({
                  status : "false",
                  status_code : Err.error_messages.success_status,
                  data : [],
                  error : { title : Err.error_messages.not_found_title, 
                  			message: "Unable to login Please contact administrator" }
                              });
        	}
        }
    }); 
}];



//create new client
exports.createClient =[check('name').not().isEmpty().withMessage( Err.error_messages.empty ),
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
	                    message: Err.error_messages.validation_err_msg,
	                    // test:errors.array()
	                  } 
	          };
        return res.status(Err.error_messages.unprocessable_entity).json(validation_log );
      }
    const client = new Oauthclient(req.body);
	client.clientId = crypto.createHash('md5').update(crypto.randomBytes(16)).digest('hex'); // 32 chars
	client.clientSecret = crypto.createHash('sha256').update(crypto.randomBytes(32)).digest('hex'); // 64 chars
	client.scope = '*';

	client.save()
	  .then(() => res.json({ id: client }));
}];



//list client based on client name
exports.getClient =[ check('name').not().isEmpty().withMessage( Err.error_messages.empty ),
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
                        message: Err.error_messages.validation_err_msg,
                        // test:errors.array()
                      } 
              };
        return res.status(Err.error_messages.unprocessable_entity).json(validation_log );
      }
  Oauthclient.findOne({ name: req.query.name })
    .then((client) => {
    	console.log(client);
      res.json(client);
    });
}];


exports.updatePassword =[ check('username').not().isEmpty().withMessage( Err.error_messages.empty ),
						  check('password').not().isEmpty().withMessage( Err.error_messages.empty ),
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
                        message: Err.error_messages.validation_err_msg,
                        // test:errors.array()
                      } 
              };
        return res.status(Err.error_messages.unprocessable_entity).json(validation_log );
      }
  	Err.checkUserExist(req.body.username, function(result) 
    { 
    	if(result == null)
        {
        	res.status(Err.error_messages.success_status).json({
              status : "false",
              status_code : Err.error_messages.success_status,
              data : [],
              error : { title : Err.error_messages.not_found_title, 
              			message: "Not yet Registered"
              		  }
                });
        }
        else
        {
 		
        }
    });
}];


//update password
// Oauthuser.find( { $and: [ { username: { $eq: req.body.mobile } }, { password: { $eq: req.body.password } } ] } ).exec(function(err, docs) 
	    			// Oauthuser.find({username:{$eq:req.body.username}}).exec(function(err, docs) 
			  		// {
			  		// 	console.log(docs);
			  		// 	console.log('ggggg');
			  			// var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
			  		// 	if(docs.length > 0)
			  		// 	{
			  		// 		docs.find(function(element) 
		     //              	{
			    //                 if(element._id)
			    //                 {
			    //                   	var hashedPassword = bcrypt.hashSync(req.body.password, 8);
			    //                     Oauthuser.update({_id: element._id}, { password: hashedPassword }, 
							// 		function(err, affected, resp) 
							// 		{
							// 		   res.status(Err.error_messages.success_status).json({
					  //                       status : "true",
					  //                       status_code : Err.error_messages.success_status,
					  //                       data : [],
					  //                       error : {
					  //                         title :Err.error_messages.success_status_title,
					  //                         message : "Password updated successfully!"
					  //                       }
					  //                   });
							// 		})                           
			    //                 }
		     //              	})
			  		// 	}
			  		// })






			  	