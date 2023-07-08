const { generatePDF } = require('../generatePDF');
const fs = require('fs');
const path = require('path');

const generateResume = async (req, res) => {
    try {
        // Retrieve data and template selection from the request body
        const data = req.body;
        console.log(data);





        // Generate the PDF using the generatePDF function
        await generatePDF(data);

        const resumePath = '../backend/generatedReceipt.pdf';

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