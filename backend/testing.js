const axios = require('axios');
// Import any other necessary modules or libraries

const generateResume = async (req, res) => {
    try {
        // Retrieve data and template selection from the request body
        const { data, template } = req.body;

        // Construct the payload for the Adobe Document Generation API
        const payload = {
            data,
            template,
            // Include any other required parameters
        };

        // Make a request to the Adobe Document Generation API
        const response = await axios.post('ADG_API_ENDPOINT', payload, {
            headers: {
                // Include necessary headers and authentication credentials
            },
        });

        // Process the response from the Adobe Document Generation API
        // Handle success or error cases accordingly

        // Return the generated resume to the client
        res.json({ resumeUrl: 'URL_TO_THE_GENERATED_RESUME' });
    } catch (error) {
        // Handle any errors that occurred during the process
        res.status(500).json({ error: 'An error occurred while generating the resume' });
    }
};

module.exports = generateResume;
//...................................................................................................................................

const axios = require('axios');
// Import any other necessary modules or libraries

const { generatePDF } = require('../generatePDF');

const generateResume = async (req, res) => {
    try {
        // Retrieve data and template selection from the request body
        const { data, template } = req.body;

        // Generate the PDF using the generatePDF function
        await generatePDF(data, template);

        // Return the generated resume to the client
        const resumeUrl = 'URL_TO_THE_GENERATED_RESUME'; // Replace with the actual URL of the generated resume
        res.json({ resumeUrl });
    } catch (error) {
        // Handle any errors that occurred during the process
        res.status(500).json({ error: 'An error occurred while generating the resume' });
    }
};

module.exports = { generateResume };

//.........................................................................................................................................
const axios = require('axios');
const fs = require('fs');
// Import any other necessary modules or libraries

const { generatePDF } = require('../generatePDF');

const generateResume = async (req, res) => {
    try {
        // Retrieve data and template selection from the request body
        const { data } = req.body;

        const jsonData = JSON.stringify(data);

        fs.writeFile('data.json', jsonData, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Data written to file');
            }
        });

        // Generate the PDF using the generatePDF function
        //await generatePDF(data, template);

        const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
        const fs = require('fs');

        const OUTPUT = './generatedReceipt.pdf';

        // If our output already exists, remove it so we can run the application again.
        if (fs.existsSync(OUTPUT)) fs.unlinkSync(OUTPUT);

        const INPUT = '../BasicTemplate.docx';

        const JSON_INPUT = require('./data.json');


        // Set up our credentials object.
        const credentials = PDFServicesSdk.Credentials
            .servicePrincipalCredentialsBuilder()
            .withClientId("37dddd52c7d94d72bf8d08b56b4b35a9")
            .withClientSecret("p8e-J_s77FaxPIUecousUL1euFv8V2MOnDnP")
            .build();

        // Create an ExecutionContext using credentials
        const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);

        // This creates an instance of the Export operation we're using, as well as specifying output type (DOCX)
        const documentMerge = PDFServicesSdk.DocumentMerge,
            documentMergeOptions = documentMerge.options,
            options = new documentMergeOptions.DocumentMergeOptions(JSON_INPUT, documentMergeOptions.OutputFormat.PDF);

        // Create a new operation instance using the options instance.
        const documentMergeOperation = documentMerge.Operation.createNew(options);

        // Set operation input document template from a source file.
        const input = PDFServicesSdk.FileRef.createFromLocalFile(INPUT);
        documentMergeOperation.setInput(input);


        // Execute the operation and Save the result to the specified location.
        documentMergeOperation.execute(executionContext)
            .then(result => result.saveAsFile(OUTPUT))
            .catch(err => {
                if (err instanceof PDFServicesSdk.Error.ServiceApiError
                    || err instanceof PDFServicesSdk.Error.ServiceUsageError) {
                    console.log('Exception encountered while executing operation', err);
                } else {
                    console.log('Exception encountered while executing operation', err);
                }
            });



        // Return the generated resume to the client
        const resumeUrl = 'URL_TO_THE_GENERATED_RESUME'; // Replace with the actual URL of the generated resume
        res.json({ resumeUrl });
    } catch (error) {
        // Handle any errors that occurred during the process
        res.status(500).json({ error: 'An error occurred while generating the resume' });
    }
};

module.exports = { generateResume };