var express = require('express')
var router = express.Router()
const middle_oauth = require('../../../OauthRouteMiddleware.js');
const oauthMiddlewares = require('../../../oauthServerMiddlewares.js');

//brand route
const brand = require('../../../controllers/brandController.js');

     // Create a new brand
    router.post('/brand', brand.create);

     // Retrieve all brands
    // router.get('/brand',middle_oauth,brand.list);
     router.get('/brand',brand.list);

     // Update a brand with brandId
    router.put('/brand/:brandId', brand.update);

     // Delete a brand with brandId
    router.delete('/brand/:brandId', brand.delete);

    // Retrieve a single brand with brandId
    router.get('/brand/:brandId', brand.findbybrandId);



//product route
const product = require('../../../controllers/productController.js');    

	//create a new product
	router.post('/product', product.create);

	// Update a product with productId
    router.put('/product/:productId', product.update);

    // Retrieve a single product with brandId
    router.get('/productByBrandId/:brandId', product.findbybrandId);

    // Retrieve a single product with productId
    router.get('/product/:productId', product.findbyproductId);

    // Delete a single product with productId
    router.delete('/product/:productId', product.deletebyId);

    //create a new product varient with productId
	router.post('/varient/:productId', product.create_prod_varient);

	// Retrieve product varient details from producId
	router.get('/varient/:productId', product.findvarientbyproductId);

	// Delete product varient details using producId and varientId
	router.delete('/varient/:productId/:varientId', product.delvarientbyId);

	// Update/edit Product varient with product id and varient ID
	router.put('/varient/:productId/:varientId', product.updatevarientbyId);




//shop route
const shop = require('../../../controllers/shopController.js'); 

	// Create a new shop
    router.post('/shop', shop.create);

    // Retrieve all shops
    // router.get('/shop',middle_oauth, shop.list);
    router.get('/shop', shop.list);

    // Update a shop with shopId
    router.put('/shop/:shopId', shop.update);

    // Delete a shop with shopId
    router.delete('/shop/:shopId', shop.delete);

    // Fetch balance of shop with shopId
    router.get('/balance/:shopId', shop.fetchBalance);

    // Retrieve shop details with shopId
    router.get('/shop/:shopId', shop.findbyshopId);




//Ad route
const ad = require('../../../controllers/adController.js'); 

	// Create a new ad
    router.post('/Ad', ad.create);

    //Retrieve an ad by countryId
    router.get('/AdByCountryId/:countryId', ad.findbycountryId);

    //Retrieve an ad by brandId
    router.get('/AdByBrandId/:brandId', ad.findbybrandId);

    // Delete an ad with adId
    router.delete('/Ad/:adId', ad.delete);

    // Update a ad with adId
    router.put('/Ad/:adId', ad.update);



//Country route
const country = require('../../../controllers/countryController.js'); 

	//Retrieve all country details
    router.get('/country', country.list);

    //Retrieve country by countryId
    router.get('/country/:countryId', country.findbycountryId);




//RechargeType route
const rechargeType = require('../../../controllers/rechargetypeController.js'); 

	//Retrieve all rechargetype details
    router.get('/rechargetype',middle_oauth, rechargeType.list);

    //Retrieve rechargetype by rechargetypeId
    router.get('/rechargetype/:rechargetypeId', rechargeType.findbyrchgetypeId);

    



//Company route
const company = require('../../../controllers/companyController.js'); 

	//Retrieve all company details
    router.get('/company',middle_oauth, company.list);

    //Retrieve company by companyId
    router.get('/company/:companyId', company.findbycompanyId);



//Supported dialers route
const dialers = require('../../../controllers/supporteddialersController.js'); 

	//Retrieve all dialers details
    router.get('/dialers',middle_oauth, dialers.list);

    //Retrieve dialers by dialerId
    router.get('/dialers/:dialerId', dialers.findbydialerId);




module.exports = router