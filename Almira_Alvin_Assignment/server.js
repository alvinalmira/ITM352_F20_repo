// from assignment 1 screencast and lab 13

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
        // if all quantities are valid, generate the invoice  
        const stringified = queryString.stringify(POST);
        if (validQty && anyQuantity) {
            response.redirect("./invoice.html?"+stringified); 
            // using the invoice.html and all the data that is input
        }  
        else { 
            response.redirect("./products_display.html?" + stringified) 
        }
    }
});

//repeats the isNonNegInt function from the products_display.html
function isNonNegInt(qty, returnErrors = false) {
    errors = []; // assume that qty data is valid 
    if (qty == "") { qty = 0; }
    if (Number(qty) != qty) errors.push('Not a number!'); //check if the string is a number
    if (qty < 0) errors.push('Negative value!'); //check if value is a positive
    if (parseInt(qty) != qty) errors.push('Not an integer!'); //check if value is an integer
    return returnErrors ? errors : (errors.length == 0);
}

app.use(express.static('./public')); // root in the 'public' directory so that express will serve up files from here
app.listen(8080, () => console.log(`listening on port 8080`)); //run the server on port 8080 and show it in the console