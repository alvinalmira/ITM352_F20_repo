
const queryString = require('query-string'); // read variable 'queryString' as the loaded query-string module

var express = require('express'); // load & cache express module
var app = express(); // assign module to variable 'app'
var myParser = require("body-parser"); //load & cache body parser module
const session = require('express-session'); // loads sessions;
const fs = require('fs'); // loads fs actions like read, write, etc...
const cookierParser = require('cookie-parser'); // loads cookie parser; allows cookies to be created & deleted

const products_data = require('./products.json'); // loads the products.json !!! change this
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(session({ secret: "EDC is a lifestyle" }));

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

app.use(myParser.urlencoded({ extended: true })); //gets data in the form body
app.use(myParser.json()); // adds JSON body parser middlware


app.all('*', function (request, response, next) { //request methods
    console.log(request.method + ' to ' + request.path); //write in the console the request method and its path
    // console.log("session id is" + request.session.id);
    next(); // goes onto next process
});

//this get products_data for the service in html
app.post("/grab_products_data", function (request, response) {
    response.json(products_data);
    // console.log(products_data);
});

// Processes the products and the quanitites wanted and puts it into the invoice
app.post("/addToCart", function (request, response) {
    let POST = request.body; // data packaged in body
    console.log(POST);
    let prod_data = POST;

    response.json({ message: "product added." });
});
//

///////////// Registration and Login processing

// from lab 14 :: to process the registration form
app.post("/process_register", function (request, response) {

    // process a simple register form
    // response.send(request.body);
    // if all data is valid, write out the user_data_info and send to invoice

    //regexp variables :: 
    var usernameCheck = /^[a-z\d_.]{4,10}/i;
    var nameCheck = /^[a-z ]+$/i;
    var emailCheck = /^[\w\d.]+@[a-z]+.[\w]{2,3}/i;
    var passwordCheck = /^[\w\d\D]{6,}/;


    var error = [];
    //requires that the username only be letters and numbers 
    // ––– if request.body.username matches user_reg_data, redirect back to page –––//
    if (user_reg_data[request.body['username'].toLowerCase()]) {
        response.redirect(`./forms/username_taken.html?goback?username=taken`);
        return;
    }
    //username validation :: test in https://rubular.com/
    if (usernameCheck.test(request.body.username.toLowerCase()) == true) {
        console.log(usernameCheck.test(request.body.username.toLowerCase()));
    } else {
        error.push('Only letters, numbers, periods, and underscores are allowed.')
    }
    // name validation :: test in https://rubular.com/
    if (nameCheck.test(request.body.name) == true) { //only allows letters and spaces
        console.log(nameCheck.test(request.body.name));
    } else {
        error.push('Only letters are allowed.')
    }
    //email validation :: test in https://rubular.com/
    if (emailCheck.test(request.body.email) == true) {
        console.log(emailCheck.test(request.body.email));
    } else {
        error.push('Email contains invalid characters.')
    }
    // password validation :: test in https://rubular.com/
    if (passwordCheck.test(request.body.password) == true) {
        console.log(passwordCheck.test(request.body.password));
    } else {
        error.push('Password does not meet required length.')
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

        /// CHECK CH
        username = request.body.username.toLowerCase();

        /* replaced ("./invoice.html?" + queryString.stringify(username) + '&' + queryString.stringify(request.query)

        */
       response.cookie("user", username, {maxAge: 100 *1000})
        response.redirect("./products_display.html");
    } else {
        // redirects to an error notice page w/ hints

        // a3 edit, took out ?quantities=lost -- //
        console.log(error)
        response.redirect('./forms/error.html?goback?tryagain');

    }



});

// from lab14 :: processes the Login form
app.post("/process_login", function (request, response) {



    // Process login form POST and redirect to logged in page if ok, back to login page if not
    // checks if the user exists; if they exist, get the password
    if (typeof user_reg_data[request.body['username'].toLowerCase()] != 'undefined') {
        // console.log(userdata)
        userdata = user_reg_data[request.body['username'].toLowerCase()];
        if (request.body['password'] == userdata.password) {
            userdata_Uname = user_reg_data[request.body['username'].toLowerCase()];
            request.query.username = userdata_Uname;


            /* took out "./invoice.html?" + queryString.stringify(request.body) + '&' + queryString.stringify(request.query)
            */

            // cookies and sesssions
            response.cookie("user", request.body['username'], { maxAge: 100 * 1000 });
            //
            response.redirect(`./products_display.html`);
        } else {
            response.redirect(`./forms/invalid_login.html?password=incorrect`);
        }
    } else {
        response.redirect(` ${request.body['username']} does not exist. Press the back button.`);
    }
});


app.get("/logout", function (request, response) {
    console.log(request.cookie);
    response.clearCookie("user");
    response.redirect("./index.html");
});




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