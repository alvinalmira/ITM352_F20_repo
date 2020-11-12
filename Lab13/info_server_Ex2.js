var express = require('express');
var app = express();
var myParser = require("body-parser");


app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
    next();
});


app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (request, response) {
    let POST = request.body;

    if (isNonNegIntStr(POST["quantity_textbox"])) {
        response.send(`Thank you for ordering ${POST["quantity_textbox"]} items?`);
    } else {


        response.send(`${POST["quantity_textbox"]} is not valid!?!`);
    }


});



app.get('/test', function (request, response, next) {
    response.send('Got a GET to /test');

});


app.use(express.static('./public')); // depends on what app.use() is doing || safe to put app.use() at the bottom


app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here


///////// Nonnegative integer

function isNonNegIntStr(value, returnErrors = false) {
    /*
    This function returns true if strings_to_check is a non-negative integer. If returnErrors=true it will return the array of reasons it is not a non-negative integer
    */
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

// checks quantity in textbox
function checkQuantityTextbox(purchase_qty) {
    quantity_textbox_message.innerHTML = isNonNegIntStr(quantity_textbox.value, true).join(" ");
}