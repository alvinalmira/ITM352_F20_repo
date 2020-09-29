counter = 1 // starting an age counter
age = 20
while ( counter < 20 ) {
    if (counter >= age/2){
        console.log("I'm old!");
        break;
    }
    console.log(`age ${counter}`);
    counter++;
}
console.log(`Alvin is ${counter} years old.`)