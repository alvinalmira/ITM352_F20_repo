var express = require('express');
var app = express();
var myParser = require("body-parser");


const fs = require('fs');
const { static } = require('express');
const filename = 'user_data.json';

// check if file exists before reading
if (fs.existsSync(filename)) {
    stats = fs.statSync(filename);
    console.log(`user_data.json has ${stats['size']} characters`)

    var data = fs.readFileSync(filename, 'utf-8');
    user_reg_data = JSON.parse(data);
}


// console.log(user_reg_data, typeof user_reg_data, typeof data);
// console.log(user_reg_data['dport']['password'], typeof user_reg_data['dport']['password']);

// output login form
app.use(myParser.urlencoded({ extended: true }));
app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="process_login" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/process_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
    // checks if the user exists; if they exist, get the password
    if (typeof user_reg_data[request.body['username']] != 'undefined') {
        userdata = user_reg_data[request.body['username']];
        console.log(userdata)
        if (request.body['password'] == userdata.password){
            response.send(`thank you for ${request.body['username']} for loggin in`);
        } else {
            response.send(` ${request.body['username']} password is incorrect.`);
        }
    } else {
        response.send(` ${request.body['username']} does not exist.`);
    }
});

app.listen(8080, () => console.log(`listening on port 8080`));
