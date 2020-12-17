console.log('running');

// sourced from lab12; integer checker
function isNonNegInt(qty, return_errors = false) { //this function checks if values are postitive, integer, whole values 
    errors = []; // assume no errors at first
    if (qty == '') qty = 0; //sets input quantity as 0 
    if (Number(qty) != qty) errors.push(' <b>This is not a number!</b>'); // Check if string is a number value
    else if (qty < 0) errors.push('<b>Negative value!</b>'); // Check if it is non-negative
    else if (parseInt(qty) != qty) errors.push('<b>This is not a full value!</b>'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0);
}

function checkQuantityTextbox(textbox) { // this function uses the isNonNegInt to check quantity
    check = isNonNegInt(textbox.value, true);
    if (check.length == 0) check = ['Getting: '];
    if (textbox.value.trim() == '') check = ['Quantity:'];
    document.getElementById(textbox.name + '_label').innerHTML = check.join(", ");
}
// ---

// REFERENCE Assignment3 example code \\ This function asks the server for a "service" and converts the response to text. 
function loadJSON(service, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('POST', service, false);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

// --- referenced and changed from the Assignment 3 example code
function nav_bar() {
    // This makes a navigation bar to other product pages

    document.write(` <nav>
        <ul>

            <li><a class="index" href="./index.html">Your EDC</a></li>
            <li><a class="cart" id="cart" href="javascript:void(0)" onclick="userCartVerify();"  >Cart:<span>0</span></a></li>
            <li><a class="products" href="./products_display.html">Product Categories</a></li>
            <li><a class="loginReg" id="loginReg" href="./forms/login.html">Login/Signup</a></li>

            <!--calling navbar function in function.js-->

        </ul>
    
    </nav>`);
}
// ---

// --- selects the products category to display \\ REFERENCE: Assignment 3 example code
function prodSelector(this_product_key, products) {
    for (let products_key in products) {
        if (products_key == this_product_key) continue;
        document.write(`<div class="prodBar" ><ul class="Category"><li><a href = './products_display.html?products_key=${products_key}'>${products_key}</a></li></ul></div>`);
    }
}
//

// --- Add to cart functions \\ REFERENCE: https://www.youtube.com/watch?v=PoTGs38DR9E [Youtuber: Telmo Sampaio]
let carts = document.querySelectorAll('.add-cart'); // setting a document.querySelectorAll to a variable

// whenever you click Add to cart, it will listen for a click event and increase the more you click
for (let i = 0; i < carts.length; i++) {
    carts[i].addEventListener('click', () => {
        cartNumbers();
        // to see if the eventListener works
        console.log("added to cart");
    })
}

// this function checks the session to see if cartNumbers exist; it will match the number in carts and in the session storage
function onLoadCartNumbers() {
    let productNumbers = sessionStorage.getItem('cartNumbers');
    if (productNumbers) {
        document.querySelector('.cart span').textContent = productNumbers;
    }
}

// this function puts cartNumbers on the session storage
function cartNumbers() {
    console.log(`Product selected.`)

    let productNumbers = sessionStorage.getItem('cartNumbers');

    //  it parses the productNumbers into an integer from a string
    productNumbers = parseInt(productNumbers);
    // if productNumbers is 1, add quantity to products number
    if (productNumbers) {


        sessionStorage.setItem('cartNumbers', productNumbers + 1);
        document.querySelector('.cart span').innerHTML = productNumbers + 1;

        // if productNumbers does not exist, make carts content equal to 1
    } else {
        sessionStorage.setItem('cartNumbers', 1);
        document.querySelector('.cart span').textContent = 1;
    }
}
// --------

// --- changes login to logout button
function loggedIn() {

    if (document.cookie != "") {

        var cookie_obj = document.cookie.split(";").map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {});

        console.log(cookie_obj);

        document.getElementById("loginReg").href = `/logout`;
        document.getElementById("loginReg").innerHTML = `Logout, ${cookie_obj['user']}`;
    }
}
// ---

// --- security to stop users from getting to invoice from products_display
function userCartVerify() {
    if (document.cookie == "") {
        document.getElementById("cart").href = "javascript:void(0)";
    } else {
        document.getElementById("cart").href = "./invoice.html";
    }
}