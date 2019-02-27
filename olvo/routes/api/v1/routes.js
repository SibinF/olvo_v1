var express = require('express')
var router = express.Router()
const middle_oauth = require('../../../OauthRouteMiddleware.js');
const oauthMiddlewares = require('../../../oauthServerMiddlewares.js');


//optimized Apis

const appApi = require('../../../controllers/appApiController.js'); 

// Retrieve shops brand details using shopId
 router.get('/brand/:shopId',appApi.brandByShopId);

// Retrieve dialers details using shopId
 router.get('/dialer/:brandId',appApi.dialerByBrandId);

// Retrieve ad details using shopId
 router.get('/Ad/:shopId',appApi.AdByShopId);

// Retrieve varient details using shopId and brandId
 router.get('/varient/:shopId/:brandId',appApi.varientByShopIdBrandId);




// Recharge route

const recharge = require('../../../controllers/rechargeController.js');

//Recharge Api
router.post('/recharge', recharge.recharge);

//Recharge History
router.post('/rechargeHistory', recharge.rechargeHistory);

//Recharge History Detailed
router.get('/recharge/:transactionId', recharge.rechargeHistoryDetailed);





// Oauth route

const Oauth = require('../../../controllers/oauthController.js');

//create new client
router.post('/clients', Oauth.createClient);

//get client
router.get('/clients', Oauth.getClient);
//?name=Android

//Generate token
router.post('/oauth/token', oauthMiddlewares.token);

// send OTP
router.post('/sendOTP', Oauth.sendOTP);

//verify OTP
router.post('/verifyOTP', Oauth.verifyOTP);

//login
router.post('/login', Oauth.login);

//update Password
router.post('/updatePassword', Oauth.updatePassword);



module.exports = router