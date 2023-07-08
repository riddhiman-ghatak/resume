// const { generatePDF } = require('../generatePDF');

// const generateResume = async (req, res) => {
//     try {
//         // Retrieve data and template selection from the request body
//         const { data } = req.body;

//         // Generate the PDF using the generatePDF function
//         await generatePDF(data);

//         const resumePath = 'C:/Users/riddh/Music/resume/backend/generatedReceipt.pdf';

//         //const resumeUrl = `file://${resumePath}`;
//         const resumeUrl = 'http://localhost:3000/generatedReceipt.pdf';


//         // Return the generated resume to the client
//         res.json({ resumeUrl });
//         //res.json({ resumeUrl: 'URL_TO_THE_GENERATED_RESUME' });
//     } catch (error) {
//         // Handle any errors that occurred during the process
//         res.status(500).json({ error: 'An error occurred while generating the resume' });
//     }
// };
// module.exports = { generateResume };
// const fs = require('fs');
// const path = require('path');
// //const { generatePDF } = require('../generatePDF');

// const generateResume = async (req, res) => {
//     try {
//         // Retrieve data and template selection from the request body
//         const { data } = req.body;

//         // Generate the PDF using the generatePDF function
//         //await generatePDF(data);

//         const resumePath = path.join(__dirname, '../backend/generatedReceipt.pdf');

//         // Read the generated PDF file
//         fs.readFile(resumePath, (err, data) => {
//             if (err) {
//                 console.error('Error reading PDF file:', err);
//                 return res.status(500).json({ error: 'An error occurred while reading the PDF file' });
//             }

//             // Set the appropriate headers for the response
//             res.setHeader('Content-Type', 'application/pdf');
//             res.setHeader('Content-Disposition', 'attachment; filename=generatedReceipt.pdf');

//             // Send the PDF file to the client
//             res.send(data);
//         });
//     } catch (error) {
//         // Handle any errors that occurred during the process
//         console.error('Error generating the resume:', error);
//         res.status(500).json({ error: 'An error occurred while generating the resume' });
//     }
// };

// module.exports = { generateResume };


//const { generatePDF } = require('../generatePDF');
const fs = require('fs');
const path = require('path');

const generateResume = async (req, res) => {
    try {
        // Retrieve data and template selection from the request body
        const data = req.body;
        console.log(data);

        // // Convert JSON data to a string
        const jsonString = JSON.stringify(data, null, 2);

        // // Write JSON string to a file
        // fs.writeFile('data.json', jsonString, (err) => {
        //     if (err) {
        //         console.error('Error writing JSON file:', err);
        //     } else {
        //         console.log('JSON file has been created!');
        //     }
        // });



        // Generate the PDF using the generatePDF function
        //await generatePDF(data);

        const resumePath = 'C:/Users/riddh/Music/resume/backend/generatedReceipt.pdf';

        // Read the generated PDF file
        const file = fs.readFileSync(resumePath);

        // Convert the file data to base64 format
        const base64Data = file.toString('base64');

        // Construct the data URL for the PDF
        const resumeUrl = `data:application/pdf;base64,${base64Data}`;

        // Return the generated resume to the client
        res.json({ resumeUrl });
    } catch (error) {
        // Handle any errors that occurred during the process
        res.status(500).json({ error: 'An error occurred while generating the resume' });
    }
};

module.exports = { generateResume };
