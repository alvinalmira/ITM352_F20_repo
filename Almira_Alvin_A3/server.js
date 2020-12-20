// Alvin Alvin; changes Dec20 Guam time ||  ADAPATED FROM MY ASSIGNMENT2 from assignment 1 screencast and lab 13

// Recognitions and REFRENENCES: Daniel Port for the screencasts. Rick Kazman and his help with lab14, from assignment 1 screencast and lab 13 - 15, Daniel Port's workshop, and from fellow students when I got major stuck)

const express = require('express'); // load & cache express module
const app = express(); // assign module to variable 'app'
const cookieParser = require('cookie-parser'); // loads cookie parser; allows cookies to be created & deleted
const myParser = require("body-parser"); //load & cache body parser module
const session = require('express-session'); // loads sessions;
const fs = require('fs'); // loads fs actions like read, write, etc...
var nodemailer = require('nodemailer'); // loads the mail module

const products_data = require('./products.json'); // loads the products.json !!! change this

// from the lab15 examples
app.use(cookieParser()); // calls cookie-parser module
app.use(session({
    secret: "EDC is a lifestyle",
})); // creates a session


// declares the user data json file \\ from lab14 examples
const user_data_info = 'user_data.json';
// from lab14 :: check if file exists before reading
if (fs.existsSync(user_data_info)) {
    stats = fs.statSync(user_data_info);
    console.log(`user_data_info.json has ${stats['size']} characters`)

    let info = fs.readFileSync(user_data_info, 'utf-8');
    user_reg_data = JSON.parse(info);
}
/////

// from lab13 examples
app.use(myParser.urlencoded({ extended: true })); //gets data in the form body
app.use(myParser.json()); // adds JSON body parser middlware

// from assignment 1-3 examples
app.all('*', function (request, response, next) { // any request methods
    // console.log(request.method + ' to ' + request.path); //write in the console the request method and its path
    // console.log("session id is" + request.session.id);

    //initialize shopping cart, if not already there. (Reference: got this from Kevin's server)
    if (typeof request.session.cart == 'undefined') {

        request.session.cart = {};
        for (pk in products_data) {
            emptyArray = new Array(products_data[pk].length).fill(0)
            request.session.cart[pk] = emptyArray;
        }

    }
    next(); // goes onto next process
    //-- --- 
});

// code for the products and cart
//this get products_data for the service in html \\ from assignment 3 code examples
app.post("/grab_products_data", function (request, response) {
    response.json(products_data);
    // console.log(products_data);
});

// gets carts data from the shopping cart \\ from assignment 3 example
app.post("/get_cart_data", function (request, response) {
    response.json(request.session.cart);
})

//--

// Processes the products and the quanitites wanted and puts it into the invoice \\ from assignment 3 workshop w/ Daniel Port
app.post("/addToCart", function (request, response) {
    // var prods = request.body; // data packaged in body

    // console.log(response.req.body);
    response.json({ message: "product added." });

    console.log(request.session.cart);

    // this checks if the re.body.prod_qty is true.\\__ got this portion of the code from kevin's server
    if (isNonNegInt(request.body.prod_qty) == true) {
        pk = request.body.prod_key; // sets the response.req.body.prod_key as pk
        idx = request.body.prod_index; // sets the idx as the parsed response.req.body.product_index
        qty = Number.parseInt(request.body.prod_qty); // sets qty as the parsed response.req.body.prod_qty
        request.session.cart[pk][idx] = qty;

    }
    // --
    console.log(request.session.cart);
    request.session.save();



});

// code from kevin's server \\ this code redirects the user to the login page if the login does not exist
app.post("/invoice", function (request, response) {


    response.redirect("invoice.html");
});


//

///------- Registration and Login processing
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

        // checks username if they match
        username = request.body.username.toLowerCase();

        /* replaced ("./invoice.html?" + queryString.stringify(username) + '&' + queryString.stringify(request.query)
        */
       email = request.body.email

       request.session.email
       request.session.save()
        response.cookie("user", username)
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


        userdata = user_reg_data[request.body['username'].toLowerCase()];
        if (request.body['password'] == userdata.password) {
            userdata_Uname = user_reg_data[request.body['username'].toLowerCase()];
            request.session.username = userdata_Uname;
            request.session.save();

            /* took out "./invoice.html?" + queryString.stringify(request.body) + '&' + queryString.stringify(request.query)
            */
            // cookies and sesssions
            response.cookie("user", request.body['username']);
            //
            response.redirect(`./products_display.html`);
        } else {
            response.redirect(`./forms/invalid_login.html?password=incorrect`);
        }
    } else {
        response.redirect(`./forms/invalid_login.html?password=incorrect`);
    }
});

// when path is called, the cookie is deleted and the user is redirected to the index.html page \\ from lab15 examples
app.get("/logout", function (request, response) {
    response.clearCookie("user");
    request.session.destroy();
    // console.log(request.cookie);
    response.redirect("./index.html");
});
// ----- 

// -----  emails user when they press purchase button  \\ REFERENCE ASSIGNMENT 3 email example
app.get("/checkout", function (request, response) {
    // Generate HTML invoice string

    console.log("testing if this is called")
    var subtotal = 0;
    var shipping = 0;
    var invoice_str = `Thank you for your order!<table border><th>Quantity</th><th>Item</th>`;
    var shopping_cart = request.session.cart;
    for (product_key in products_data) {
        for (i = 0; i < products_data[product_key].length; i++) {
            if (typeof shopping_cart[product_key] == 'undefined') continue;
            qty = shopping_cart[product_key][i];
            if (qty > 0) { // got this code form daphne's server
                ext_price = qty * products_data[product_key][i]["price"];
                subtotal += ext_price;
                invoice_str += `<tr><td>${products_data[product_key][i].name}</td><td>${qty}</td><td>\$${products_data[product_key][i]["price"].toFixed(2)}</td><td>\$${ext_price.toFixed(2)}</td><tr>`;
            }
        }
    }
    // Compute tax
    var tax_rate = 0.0575;
    var tax = tax_rate * subtotal;

    // Compute shipping
    if (subtotal == 0) {
        shipping = 0;
    }
    else if (subtotal <= 50) {
        shipping = 2;
    }
    else if (subtotal <= 100) {
        shipping = 5;
    }
    else {
        shipping = 0.05 * subtotal; // 5% of subtotal
    }
    var total = (subtotal + tax + shipping);

    // Compute grand total
    invoice_str += `<tr>
        <td style="text-align: center;" colspan="3" width="67%">Sub-total</td>
        <td width="54%">\$${subtotal.toFixed(2)}</td>
      </tr>`;
    invoice_str += `
      <tr>
        <td style="text-align: center;" colspan="3" width="67%"><span style="font-family: arial;">Tax @ 5.75%</span></td>
        <td width="54%">\$${tax.toFixed(2)}</td>
      </tr>
      `;
    invoice_str += `
      <tr>
        <td style = "text-align: center;" colspan = "3" width="67"><span style="font-family: arial;">Shipping</span></td>
        <td width="54%">$${shipping.toFixed(2)}</td>
      `;
   invoice_str += `
      <tr>
        <td style="text-align: center;" colspan="3" width="67%"><strong>Total</strong></td>
        <td width="54%"><strong>$${total.toFixed(2)}</strong></td>
      </tr>
      `;
    invoice_str += '</table>';
    // Set up mail server. Only will work on UH Network due to security restrictions
    var transporter = nodemailer.createTransport({
        host: "mail.hawaii.edu",
        port: 25,
        secure: false, // use TLS
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
    console.log(request.session.username.email);

    var user_email = request.session.username.email;
    var mailOptions = {
        from: 'Skrillex@yourEDC.com',
        to: user_email,
        subject: 'Your Everyday EDC Invoice',
        html: invoice_str
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            invoice_str += '<br>There was an error and your invoice could not be emailed :(';
            console.log(error);
        } else {
            invoice_str += `<br>Your invoice was mailed to ${user_email}`;
        }
        response.send(invoice_str);
    });

    console.log(invoice_str);

});
// --------

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