const fs = require('fs');

const filename = 'user_data.json';

// check if file exists before reading
if (fs.existsSync(filename)) {
    stats = fs.statSync(filename);
    console.log(`user_data.json has ${stats['size']} characters`)

    var data = fs.readFileSync(filename, 'utf-8');
    user_reg_data = JSON.parse(data);
    // checks if the user exists; if they exist, get the password
    if (typeof user_reg_data['itm352'] != undefined) {
        console.log(user_reg_data['itm352']['password'] == 'grader');
    }
} else {
    console.log(`ERR: ${user_data_filename} does not exist!`);
}




// console.log(user_reg_data, typeof user_reg_data, typeof data);

console.log(user_reg_data['dport']['password'], typeof user_reg_data['dport']['password']);