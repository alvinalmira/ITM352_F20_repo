var express = require('express');
var app = express();
var myParser = require("body-parser");
var data = require('./public/product_data.js');
var products = data.products;
var fs = require('fs');

app.use(myParser.urlencoded({ extended: true }));


function process_quantity_form(POST, response) {
    if (typeof POST['purchase_submit_button'] != 'undefined') {
        var contents = fs.readFileSync('./views/display_quantity_template.view', 'utf8');
        receipt = '';
        for (i in products) {
            let q = POST[`quantity_textbox${i}`];
            let model = products[i]['model'];
            let model_price = products[i]['price'];
            if (isNonNegIntStr(q)) {
                receipt += eval('`' + contents + '`'); // render template string
            } else {
                receipt += `<h3><font color="red">${q} is not a valid quantity for ${model}!</font></h3>`;
            }
        }
        response.send(receipt);
        response.end();
    }
}


///////// Nonnegative integer
function isNonNegIntStr(value, returnErrors = false) {
    /*    This function returns true if strings_to_check is a non-negative integer. If returnErrors=true it will return the array of reasons it is not a non-negative integer */
    errors = []; // assume no errors at first
    if (Number(value) != value) {
        errors.push('Not a number!');
    } // Check if string is a number value
    else {
        if (value < 0) errors.push('Negative value!'); // Check if it is non-negative
        if (parseInt(value) != value) errors.push('Not an integer!'); // Check that it is an integer
    }
    return returnErrors ? errors : ((errors.length > 0) ? false : true);
}

app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
    next();
});

app.post("/process_form", function (request, response) {
    let POST = request.body;
    process_quantity_form(POST, response);
});



app.get('/test', function (request, response, next) {
    response.send('Got a GET to /test');
});


app.use(express.static('./public')); // depends on what app.use() is doing || safe to put app.use() at the bottom


app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here




// checks quantity in textbox
function checkQuantityTextbox(purchase_qty) {
    quantity_textbox_message.innerHTML = isNonNegIntStr(quantity_textbox.value, true).join(" ");
}