// Alvin Alvin; uploaded  on Github on Nov18, fixed on Nov22-24 ||  from assignment 1 screencast and lab 13
// Recognitions: Daniel Port for the screencasts. Rick Kazman and his help with lab14. inspiration from other students's code because my original idea of simple validations was a complete flop (students such as Rianne, Daphne, Alyssa, Jojo, Meghan, Philip, Rose, Chavez)

var data = require('./public/products.js'); // load products.js file and set to variable 'data'
var products_array = data.products; // 'products_array' gets assigned to the products.js file
const queryString = require('query-string'); // read variable 'queryString' as the loaded query-string module

var express = require('express'); // load & cache express module
var app = express(); // assign module to variable 'app'
var myParser = require("body-parser"); //load & cache body parser module

const fs = require('fs'); // loads fs actions like read, write, etc...


// declares the user data json file
const user_data_info = 'user_data.json';

// from lab14 :: check if file exists before reading
if (fs.existsSync(user_data_info)) {
    stats = fs.statSync(user_data_info);
    console.log(`user_data_info.json has ${stats['size']} characters`)

    let info = fs.readFileSync(user_data_info, 'utf-8');
    user_reg_data = JSON.parse(info);
}

/////

app.all('*', function (request, response, next) { //request methods
    console.log(request.method + ' to ' + request.path); //write in the console the request method and its path
    next(); // goes onto next process
});
app.use(myParser.urlencoded({ extended: true })); //gets data in the body


// Processes the products and the quanitites wanted and puts it into the invoice
app.post("/process_purchase", function (request, response) {
    let POST = request.body; // data packaged in body
    //check if quantities are nonnegative integers
    if (typeof POST['submitPurchase'] != 'undefined') {
        var validQty = true; // creating a variabale if it's true
        var anyQuantity = false;
        for (i = 0; i < products.length; i++) {

            qty = POST[`quantity${i}`];
            anyQuantity = anyQuantity || qty > 0; // If it has a value bigger than 0, passes
            validQty = validQty && isNonNegInt(qty);    // for both a quantity over 0 and is valid    
        }
        // if all quantities are valid, converts the data into strings
        let intoString = queryString.stringify(POST);
        if (validQty && anyQuantity) {
            response.redirect("./forms/login.html?" + intoString); // changed the ./path from invoice.html ******
            // using the invoice.html and all the data that is input
        }
        else {
            response.redirect("./products_display.html?" + intoString + request.body.username)
        }
    }
});


///////////// Registration and Login processing

// from lab 14 :: to process the registration form
app.post("/process_register", function (request, response) {
    //console.log(user_reg_data[0]);
    // process a simple register form
    // response.send(request.body);
    // if all data is valid, write out the user_data_info and send to invoice
    
    //regexp variables :: i tried to use the variables instead of the regExp but it didn't work for some reason
   /* var usernameCheck = /[a-zA-Z0-9_.]+/;
    var nameCheck = /[^a-zA-Z ]+$/;
    var emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$\);
    */

    var error = [];
    //requires that the username only be letters and numbers 
    // ––– if request.body.username matches user_reg_data, redirect back to page –––//
    if (user_reg_data[request.body['username'].toLowerCase()]) {
        response.redirect(`./forms/username_taken.html?quantities=lost?goback?username=taken`);
        return;
    }
    //username validation :: modified from stackoverflow :: test in https://regexr.com/
    if (/\w[^a-zA-Z0-9_.]+$/.test(request.body.username.toLowerCase())) {
        error.push('Only letters, numbers, periods and underscores.')
    }
    // name validation :: modified from stackoverflow :: test in https://regexr.com/
    if (/[^a-zA-Z ]+$/.test(request.body.name)) { //only allows letters and spaces
        error.push('Only letters are allowed.')
    }
    //email validation :: modified from stackoverflow :: test in https://regexr.com/
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$\)/i.test(request.body.email)) {
        error.push('Email contains invalid characters.')
    }
    // verifys the passwords match
    if (request.body.password != request.body.repeat_password) {
        error.push('Passwords do not match. Re-enter passwords and try again.')
    }

    if (error.length == 0) {

        // adds user data to the JSON
        username = request.body.username.toLowerCase();
        user_reg_data[username] = {};
        user_reg_data[username].name = request.body.name; // name
        user_reg_data[username].password = request.body.password; // password
        user_reg_data[username].email = request.body.email.toLowerCase(); // email in toLowerCase()

        // write updated object to user_data_info 
        user_info_str = JSON.stringify(user_reg_data);
        fs.writeFileSync(user_data_info, user_info_str);

        response.redirect("./invoice.html?" + queryString.stringify(request.query));
    }

    if (error.length > 0) {
        // redirects to an error notice page w/ hints
        console.log(error)
       response.redirect('./forms/error.html?quantities=lost?goback?tryagain'); 

    }

    //        
    /* 
        if (request.body.password == request.body.repeat_password) {
            // write updated object to user_data_info 
            user_info_str = JSON.stringify(user_reg_data);
            fs.writeFileSync(user_data_info, user_info_str);
    
            response.redirect("./invoice.html?");
        }
    */


});


//
//
// from lab14 :: processes the Login form
app.post("/process_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    // console.log(request.body.password); //
    // checks if the user exists; if they exist, get the password


    if (typeof user_reg_data[request.body['username'].toLowerCase()] != 'undefined') {
        // console.log(userdata)
        userdata = user_reg_data[request.body['username'].toLowerCase()];
        if (request.body['password'] == userdata.password) {
            userdata_Uname = user_reg_data[request.body['username'].toLowerCase()];
            request.query.username = userdata_Uname;

            response.redirect("./invoice.html?" + queryString.stringify(request.query));
        } else {
            response.redirect(`./forms/invalid_login.html?password=incorrect`);
        }
    } else {
        response.redirect(` ${request.body['username']} does not exist. Press the back button.`);
    }
});



/* this was suppose to process the form and POST a thank you
function process_invoice_form(POST, response) {
    if (typeof POST['completePurchase'] != 'undefined') {
        var contents = fs.readFileSync('./views/display_invoice.view', 'utf8');
        receipt = '';
        for (i in products) {
            let total = total.toFixed(2);
            if (isNonNegIntStr(q)) {
                receipt += eval('`' + contents + '`'); // render template string
            } 
        }
        response.send(receipt);
        response.end();
    }
}
*/


//from lab12 || repeats the isNonNegInt function from the products_display.html 
function isNonNegInt(qty, return_errors = false) { //this function checks if values are postitive, integer, whole values 
    errors = []; // assume no errors at first
    if (qty == '') qty = 0; //sets input quatity as 0 
    if (Number(qty) != qty) errors.push(' <b>This is not a number!</b>'); // Check if string is a number value
    else if (qty < 0) errors.push('<b>Negative value!</b>'); // Check if it is non-negative
    else if (parseInt(qty) != qty) errors.push('<b>This is not a full value!</b>'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0);
}

app.use(express.static('./public')); // root in the 'public' directory so that express will load files from the public directory as a static page in the event the functions above don't work
app.listen(8080, () => console.log(`listening on port 8080`)); //run the server on port 8080 and show it in the console