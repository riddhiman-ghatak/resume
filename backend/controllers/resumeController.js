const { generatePDF } = require('../generatePDF');

const generateResume = async (req, res) => {
    try {
        // Retrieve data and template selection from the request body
        const { data } = req.body;

        // Generate the PDF using the generatePDF function
        await generatePDF(data);

        // Return the generated resume to the client
        res.json({ resumeUrl: 'URL_TO_THE_GENERATED_RESUME' });
    } catch (error) {
        // Handle any errors that occurred during the process
        res.status(500).json({ error: 'An error occurred while generating the resume' });
    }
};
module.exports = { generateResume };