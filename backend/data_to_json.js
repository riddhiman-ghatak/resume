const fs = require('fs');

// JSON data (replace with your own data)
const jsonData = {
    name: 'John Doe',
    age: 30,
    email: 'johndoe@example.com'
};

// // Convert JSON data to a string
// const jsonString = JSON.stringify(jsonData, null, 2);

// // Write JSON string to a file
// fs.writeFile('data.json', jsonString, (err) => {
//     if (err) {
//         console.error('Error writing JSON file:', err);
//     } else {
//         console.log('JSON file has been created!');
//     }
// });

const jsonString = JSON.stringify(jsonData, null, 2);

// Print JSON data to the console
console.log(jsonString);
