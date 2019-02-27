const Shop = require('../models/shop.model.js');
const Brand = require('../models/brand.model.js');
const Ads = require('../models/ad.model.js');
const Product = require('../models/product.model.js');
var path = require("path");
let Err = require('../global');
const { check,validationResult } = require('express-validator/check');
const mongoose = require('mongoose');

// *************MOBILE***************

//list shops brand details using shopId
exports.brandByShopId = (req, res) => 
{
    var arr = [];
  //   Shop.aggregate([
		// {$lookup: {"from": "brands","localField": "brands.brand_id","foreignField": "_id","as": "brands"}},
		// {$unwind:'$brands'},
		// {$match : {'_id': mongoose.Types.ObjectId(req.params.shopId) }},
		// {$project:{_id:0,'id':'$brands._id','name':'$brands.name','logo':'$brands.logo'}}
		// ],function (err, shop_det) 
		// 	{

		// 	});

    Shop.findById(req.params.shopId,"brands.brand_id").populate('brands.brand_id').then(findBrands =>
    {
    	if(findBrands.brands.length > 0)
    	{
    		findBrands.brands.find(function(element)
	        {
	        	arr.push({'_id':element.brand_id._id,'name':element.brand_id.name,'logo':element.brand_id.logo});
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
	        	res.status(Err.error_messages.not_found).json({
	                      status : "false", 
	                      status_code : Err.error_messages.not_found,
	                      data : [],
	                      error : { 
	                          title : Err.error_messages.not_found_title,
	                          message: "Brand not found"
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
	                          message: "Brand not found"
	                        } 
	                  }); 
    	}
    }).catch(err => {
          if(err.kind === 'ObjectId') {
              return res.status(Err.error_messages.not_found).json({
                    status : "false", 
                    status_code : Err.error_messages.not_found,
                    data : [],
                    error : { 
                        title : Err.error_messages.not_found_title,
                        message: "Brand not found"
                      } 
                });               
          }
          return res.status(Err.error_messages.server_error).json({
                    status : "false", 
                    status_code : Err.error_messages.server_error,
                    data : [],
                    error : { 
                        title : Err.error_messages.server_error_title,
                        message: "Brand not found"
                      }
              });
        });
};




//list dialer by brandid
exports.dialerByBrandId = (req, res) => 
{
	var arr = [];
    Brand.findById({'_id':req.params.brandId}).populate('supported_dialer').then(findDialer => 
    {
    	if(findDialer.supported_dialer.length > 0)
    	{
	    	res.status(Err.error_messages.success_status).json({
	                      status : "true",
	                      status_code : Err.error_messages.success_status,
	                      data : findDialer.supported_dialer,
	                      error : []
	                  });
    	}
    	else
    	{
    		return res.status(Err.error_messages.not_found).json({
                    status : "false", 
                    status_code : Err.error_messages.not_found,
                    data : [],
                    error : { 
                        title : Err.error_messages.not_found_title,
                        message: "Dialer not found"
                      }
              	});
    	}
    }).catch(err => 
    	{
	        if(err.kind === 'ObjectId') 
	        {
              	return res.status(Err.error_messages.not_found).json({
                    status : "false", 
                    status_code : Err.error_messages.not_found,
                    data : [],
                    error : { 
                        title : Err.error_messages.not_found_title,
                        message: "Dialer not found"
                      } 
                });               
	        }
          		return res.status(Err.error_messages.not_found).json({
                    status : "false", 
                    status_code : Err.error_messages.not_found,
                    data : [],
                    error : { 
                        title : Err.error_messages.not_found_title,
                        message: "Dialer not found"
                      }
              	});
        });
};




//list Ad by shop and country ids
exports.AdByShopId = (req, res) => 
{
	var arr = [];
	var arr1 = [];
    Shop.findById(req.params.shopId,"accounts brands.brand_id").then(findShop => 
    {
    	country_id = findShop.accounts.country_id;
    	if(findShop.brands.length > 0)
    	{
    		findShop.brands.find(function(element)
	        {
	        	arr.push(element.brand_id);
	        })
	        if(arr.length > 0)
	        {
	        	Ads.find({$and:[{'brand_id':{ $in:arr } },{'country_id':country_id },{'status':1}]}).select({"country_id":0,"brand_id":0,"status":0,"createdAt":0,"updatedAt":0}).lean()
		        .then(findAd => 
		        {
		        	if(findAd.length>0)
		        	{
		        		findAd.find(function(element)
				        {
				        	var today = Err.today();
				        	if(Date.parse(element.promo_start) <= Date.parse(element.promo_end))
				        	{
				        		if(Date.parse(today) >= Date.parse(element.promo_start) && Date.parse(today) <= Date.parse(element.promo_end))
					        	{
					        		arr1.push(element);
					        	}
				        	}
				        	else
					        {
						        	return res.status(Err.error_messages.not_found).json({
				                    status : "false", 
				                    status_code : Err.error_messages.not_found,
				                    data : [],
				                    error : { 
				                        title : Err.error_messages.not_found_title,
				                        message: "No Ads to Display"
				                      } 
				                }); 
					        }
				        })	
				        if(arr1.length > 0)
				        {
				        	res.status(Err.error_messages.success_status).json({
			                      status : "true",
			                      status_code : Err.error_messages.success_status,
			                      data : arr1,
			                      error : []
			                  });
				        }
				        else
				        {
					        	return res.status(Err.error_messages.not_found).json({
			                    status : "false", 
			                    status_code : Err.error_messages.not_found,
			                    data : [],
			                    error : { 
			                        title : Err.error_messages.not_found_title,
			                        message: "No Ads to Display"
			                      } 
			                }); 
				        }
		        	}
		        	else
		        	{
		        		return res.status(Err.error_messages.not_found).json({
		                    status : "false", 
		                    status_code : Err.error_messages.not_found,
		                    data : [],
		                    error : { 
		                        title : Err.error_messages.not_found_title,
		                        message: "No Ads to Display"
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
		                        message: "No Ads to Display"
		                      } 
		                });               
		          }
		          return res.status(Err.error_messages.server_error).json({
		                    status : "false", 
		                    status_code : Err.error_messages.server_error,
		                    data : [],
		                    error : { 
		                        title : Err.error_messages.server_error_title,
		                        message: "No Ads to Display"
		                      }
		              });
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
		                        message: "No Ads to Display"
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
	                        message: "No Ads to Display"
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
                        message: "No Ads to Display"
                      } 
                });               
          }
          return res.status(Err.error_messages.server_error).json({
                    status : "false", 
                    status_code : Err.error_messages.server_error,
                    data : [],
                    error : { 
                        title : Err.error_messages.server_error_title,
                        message: "No Ads to Display"
                      }
              });
        });     
};



//get varient details by shop brand and countryids
exports.varientByShopIdBrandId = (req, res) => 
{
	Shop.countDocuments({$and:[ {'_id':req.params.shopId },{'brands':{ $elemMatch:{'brand_id':req.params.brandId }} } ] },function(err, count) 
	{ 
		if(count > 0)
		{
			Shop.findById(req.params.shopId).then(shop_det => 
			{
				if(shop_det)
				{
					Brand.findById(req.params.brandId).populate('brands.brand_id').then(findBrands =>
	    			{
	    				if(findBrands)
	    				{
	    					var shop_country = shop_det.accounts.country_id;
							Product.aggregate([
								{$unwind:'$varient'},
								{$match : {$and: [{'brand_id': mongoose.Types.ObjectId(req.params.brandId),'varient.country_id' :mongoose.Types.ObjectId(shop_country) }]}},
								{$project:{_id:1,name:1,title:1,description:1,offer_message:1,varient:"$varient"}}
								],function (err, product_det) 
									{
										if(product_det.length > 0)
										{
											var data = {brands:{'_id':findBrands._id,'name':findBrands.name,'logo':findBrands.logo},products:product_det}
											res.status(Err.error_messages.success_status).json({
							                      status : "true",
							                      status_code : Err.error_messages.success_status,
							                      data : data,
							                      error : []
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
										if(err)
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
										
									})
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
			        }).catch(err => {
				        if(err.kind === 'ObjectId') {
				            return res.status(Err.error_messages.not_found).json({
				                  status : "false", 
				                  status_code : Err.error_messages.not_found,
				                  data : [],
				                  error : { 
				                      title : Err.error_messages.not_found_title,
				                      message: "Varient not found"
				                    } 
				              });               
				        }
				        return res.status(Err.error_messages.server_error).json({
				                  status : "false", 
				                  status_code : Err.error_messages.not_found,
				                  data : [],
				                  error : { 
				                      title : Err.error_messages.server_error_title,
				                      message: "Varient not found"
				                    }
				            });
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
				
			}).catch(err => {
	        if(err.kind === 'ObjectId') {
	            return res.status(Err.error_messages.not_found).json({
	                  status : "false", 
	                  status_code : Err.error_messages.not_found,
	                  data : [],
	                  error : { 
	                      title : Err.error_messages.not_found_title,
	                      message: "Varient not found"
	                    } 
	              });               
	        }
	        return res.status(Err.error_messages.server_error).json({
	                  status : "false", 
	                  status_code : Err.error_messages.not_found,
	                  data : [],
	                  error : { 
	                      title : Err.error_messages.server_error_title,
	                      message: "Varient not found"
	                    }
	            });
	    	}); 
		} 
		else
    	{
    		return res.status(Err.error_messages.not_found).json({
              status : "false", 
              status_code : Err.error_messages.not_found,
              data : [],
              error : { 
                  title : Err.error_messages.not_found_title,
                  message: "Varient not found"
                } 
          	}); 
    	}
		
	}).catch(err => {
	        if(err.kind === 'ObjectId') {
	            return res.status(Err.error_messages.not_found).json({
	                  status : "false", 
	                  status_code : Err.error_messages.not_found,
	                  data : [],
	                  error : { 
	                      title : Err.error_messages.not_found_title,
	                      message: "Varient not found"
	                    } 
	              });               
	        }
	        return res.status(Err.error_messages.server_error).json({
	                  status : "false", 
	                  status_code : Err.error_messages.not_found,
	                  data : [],
	                  error : { 
	                      title : Err.error_messages.server_error_title,
	                      message: "Varient not found"
	                    }
	            });
	    	}); 
};