const Shop = require('./models/shop.model.js');
const OTP = require('./models/otp.model.js');
const Transaction = require('./models/transaction.model.js');

const error_messages = { 
	name: "Enter a valid name", 
	length: "Minimum length should be provided", 
	empty: "must be provided",
	validity : "not valid",
	recharge_type : "recharge_type must be provided",
	supported_dialer : "supported_dialers must be provided",
	country_enabled : "country_enabled must be provided",
	db_err_msg : "Something went wrong",
	db_err_title : "Database Error",
	validation_err_title : "Validation Error",
	validation_err_msg : "Validation error occur please try again",
	server_error : 500,
	unprocessable_entity : 422,
	not_found : 404,
	not_found_title :"Not Found",
	server_error_title : "Internal server error",
	success_status : 200,
	success_status_title : "Success",
	no_data:"No data found",
	only_number:"Only Numbers are allowed",
	sku:"Only Alphabets and Numbers are allowed",
	phone :"provide valid phone number",
	balance :"provide a valid balance",
	email :"Enter a valid EmailId",
	alrdy_exist :"Email already Exists",
	alrdy_exist_title :"Email Exists",
	phone_alrdy_exist :"Number already Exists",
	phone_alrdy_exist_title :"Number Exists"
	 };

//Generate 5 Digit OTP
function generateOTP()
{
    var rand_num = Math.floor(100000 + Math.random() * 900000);
    return rand_num;
}


//check mobile number exists for any shop list or not 
function checkUserExist(countrycodeWithMobileNumber,fn)
{
	Shop.find({'accounts.mobile_number':countrycodeWithMobileNumber},function(err, docs)
	{
		if(docs.length > 0)
		{
			docs.find(function(element) 
            {
            	return fn(element);
            })
		}
		else
		{
			return fn(null);
		}
	});
}


// function formatDate(date) 
// {
// var day  = parseInt(date.split("/")[0]);
// var month= parseInt(date.split("/")[1]);
// var year = parseInt(date.split("/")[2]);
// var date = day+','+month+','+year;
// return date;
// }

//Get todays date in YY/MM/DD format
function today() 
{
    var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('/');
}


//Delete existing OTP in otps table and add new OTP entry
function OTPProcess(countrycodeWithMobileNumber,fn)
{
	OTP.find({mobile_number:{$eq:countrycodeWithMobileNumber}}).exec(function(err, docs) 
    {
      	if(docs.length > 0)
        {
            docs.find(function(element) 
            {
                if(element._id)
                {                                            
              		OTP.deleteOne({ _id:element._id }).exec();                         
                }
            })
        }
    })
	randnum = generateOTP();

	const otp_new = new OTP({
		  mobile_number : countrycodeWithMobileNumber,
		  code: randnum
		});

	otp_new.save().then(data => 
	{
	 	return fn(randnum);
	}).catch(err => 
	{
		return fn(null);
	 });
}

//create transaction number
function CreateTXNNumber(sellrate,fn)
{
	var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
	var TXN_No = 'TXN_'+day+month+Math.floor(10000 + Math.random() * 90000)+sellrate;
	return fn(TXN_No);
}

function parseDate(str) {
	console.log(str);
    var mdy = str.split('/');
    return new Date(mdy[0], mdy[1]-1, mdy[2]);
}

function dateCompareAndLimit(from_date,to_date,details,fn)
{
	// if(Date.parse(from_date) >= Date.parse(to_date))
	// {
	// 	return fn('444444');
	// }
	// var transaction = [];
	// var current_date = today();
	// details.find(function(element)
	// {
	// 	var valid_fromdate = isValidDate(from_date);
	// 	var valid_todate = isValidDate(to_date);
	// 	if(valid_fromdate == true && valid_todate == true)
	// 	{
	// 		if(Date.parse(current_date) >= Date.parse(from_date))
	// 		{
	// 			var fromdate = from_date;
	// 			if(Date.parse(current_date) >= Date.parse(to_date))
	// 			{
	// 				var todate = to_date;
	// 			}
	// 			else
	// 			{
	// 				var todate = current_date;
	// 			}
	// 			var check = parseDate(element.createdAt);
	// 			console.log(element.createdAt);
	// 			console.log('ddd');
	// 			if(check > parseDate(fromdate) && check < parseDate(todate))
	// 			{
	// 				// transaction.push(element); 
	// 				console.log('2222');
	// 			}
	// 			else
	// 			{
	// 				return fn('5555555');
	// 			}
	// 		}
	// 		else
	// 		{
	// 			return fn('6666666666');
	// 		}
	// 	}
	// 	else
	// 	{
	// 		return fn('99999999');
	// 	}
	// })
	// if(transaction.length > 0)
	// {
	// 	console.log('2222');
	// 	// return fn(transaction);
	// }
	// else
	// {
	// 	return fn('false');
	// }
}



function isValidDate(s) 
{
	var bits = s.split('/');
  	var d = new Date(bits[0], bits[1] - 1, bits[2]);
  	var test = d && (d.getMonth() + 1) == bits[1];
  	return test;
}



module.exports = { error_messages }
module.exports.generateOTP = generateOTP; 
module.exports.checkUserExist = checkUserExist; 
// module.exports.formatDate = formatDate; 
module.exports.today = today; 
module.exports.OTPProcess = OTPProcess;
module.exports.CreateTXNNumber = CreateTXNNumber;
module.exports.dateCompareAndLimit = dateCompareAndLimit;