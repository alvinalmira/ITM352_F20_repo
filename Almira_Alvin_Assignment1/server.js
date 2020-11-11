// Alvin Alvin; finished and uploaded Nov5, fixed to make it work on server Nov6 ||  from assignment 1 screencast and lab 13

var data = require('./public/products.js'); // load products.js file and set to variable 'data'
var products_array = data.products; // 'products_array' gets assigned to the products.js file
const queryString = require('query-string'); // read variable 'queryString' as the loaded query-string module

var express = require('express'); // load & cache express module
var app = express(); // assign module to variable 'app'
var myParser = require("body-parser"); //load & cache body parser module

app.all('*', function (request, response, next) { //request methods
    console.log(request.method + ' to ' + request.path); //write in the console the request method and its path
    next(); // goes onto next process
});

app.use(myParser.urlencoded({ extended: true })); //gets data in the body

app.post("/process_purchase", function (request, response) {
    let POST = request.body; // data packaged in body

    //check if quantities are nonnegative integers 
    if (typeof POST['submitPurchase'] != 'undefined') {
        var validQty=true; // creating a variabale if it's true
        var anyQuantity=false
        for (i = 0; i < products.length; i++) {
            
                        qty=POST[`quantity${i}`];
                        anyQuantity=anyQuantity || qty>0; // If it has a value bigger than 0, passes
                        validQty=validQty && isNonNegInt(qty);    // for both a quantity over 0 and is valid    
        } 
        // if all quantities are valid, converts the data into strings
        let intoString = queryString.stringify(POST);
        if (validQty && anyQuantity) {
            response.redirect("./invoice.html?"+intoString); 
            // using the invoice.html and all the data that is input
        }  
        else { 
            response.redirect("./products_display.html?" + intoString) 
        }
    }
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