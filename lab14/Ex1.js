const fs = require('fs');

const filename = 'user_data.json';

var data = fs.readFileSync(filename, 'utf-8');

user_reg_data = JSON.parse(data);

// console.log(user_reg_data, typeof user_reg_data, typeof data);

// console.log(user_reg_data['dport']['password'], typeof user_reg_data['dport']['password']);

// checks if the user exists; if they exist, get the password
if (typeof user_reg_data['itm352'] != undefined) {
    console.log(user_reg_data['itm352']['password']=='grader');
}

// to check if a user exists statement
// if (typeof user_reg_data['itm352'] == undefined) {};
    
