const fs = require('fs');

const filename = 'user_data.json';

var data = fs.readFileSync(filename, 'utf-8');

user_reg_data = JSON.parse(data);

// console.log(user_reg_data, typeof user_reg_data, typeof data);

console.log(user_reg_data['dport']['password'], typeof user_reg_data['dport']['password']);