var express = require('express');
var app = express();
var myParser = require("body-parser");
const fs = require('fs');
const cookierParser = require('cookie-parser');
var session = require('express-session');
const { nextTick } = require('process')

const user_data_filename = 'user_data.json';

app.use(cookierParser());


app.use(session({ secret: "ITM352 rocks!:" }));

// check if file exists before reading
if (fs.existsSync(user_data_filename)) {
    stats = fs.statSync(user_data_filename);
    console.log(`user_data.json has ${stats['size']} characters`)

    var data = fs.readFileSync(user_data_filename, 'utf-8');
    user_reg_data = JSON.parse(data);

}



// output login form
app.use(myParser.urlencoded({ extended: true }));

app.get("/use_session", function (request, response) {
    console.log("session id is" + request.session.id);
    if (typeof request.session.id != 'undefined') {
        response.send(`welcome, your session ID is ${request.session.id}`)
    }
})

app.get("/set_cookie", function (request, response) {
    response.cookie('myname', 'Alvin', { maxAge: 10 * 1000 });
    response.send('cookie sent!');
});

app.get("/use_cookie", function (request, response) {
    console.log(request.cookies);
    var theName = 'user00';
    if (typeof request.cookies["myname"] != 'undefined') {
        theName = request.cookies["myname"];
    }
    response.send(`Welcome to the user cookie page ${theName}`);
});


app.get("/register", function (request, response) {
    // Give a simple register form

    str = `
<body>
<form action="process_register" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
<input type="email" name="email" size="40" placeholder="enter email"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/process_register", function (request, response) {
    // process a simple register form
    // response.send(request.body);
    // assignment2 needs validation
    // if all daata is valud, write ot the user_data_filename and send to invoice

    // add example new user reg info
    username = request.body.username;
    user_reg_data[username] = {};
    user_reg_data[username].password = request.body.password;
    user_reg_data[username].email = request.body.email;

    // write updated object to user_data_filename :: needed for assignment2
    reg_info_str = JSON.stringify(user_reg_data);
    fs.writeFileSync(user_data_filename, reg_info_str);

    if (request.body.password == request.body.repeat_password) {
        response.send(`Thank you for registering`)
    }

});


app.get("/login", function (request, response) {
    // Give a simple login form
    if (typeof request.session.lastLogin != 'undefined') {
        lastLogin = request.session.lastLogin;
    } else {
        lastLogin = "First Login";
    };
    if (typeof request.cookies.username != 'undefined') {
        welcome_str = request.cookies.username;
    } else {
        welcome_str = 'Guest';
    }

    str = `
<body>
Welcome Back ${welcome_str}
<br>
Last Login: ${lastLogin}

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
        if (request.body.password == user_reg_data[request.body.username].password) {
            var now = new Date();
            request.session.lastLogin = now.getTime();
            console.log(`${request.body.username} logged in on ${request.session.lastLogin}`);
            response.cookie('username', request.body.username, { maxAge: 10 * 1000 })
            response.send(`Thank you ${request.body.username} for logging in.`);

        } else {
            response.send(` ${request.body['username']} password is incorrect.`);
        }
    } else {
        response.send(` ${request.body['username']} does not exist.`);
    }
});

app.listen(8080, () => console.log(`listening on port 8080`));
