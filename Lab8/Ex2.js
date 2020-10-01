counter = 1 // starting the age count
age = 20
while (counter < 20) {
    if ( (counter > age / 2) ) {
        console.log("Don't ask how old I am!");
        process.exit();
    }
    else {
        console.log(`age ${counter}`);
    }
counter++;
}
console.log(`Alvin is ${counter} years old.`)