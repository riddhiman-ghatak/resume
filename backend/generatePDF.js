

const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
const fs = require('fs');

const OUTPUT = './generatedReceipt.pdf';
const template = './BasicTemplate.docx';
//const JSON_INPUT = require('./data.json');

function generatePDF(data) {
    return new Promise((resolve, reject) => {
        // If the output file already exists, remove it so we can run the application again.
        if (fs.existsSync(OUTPUT)) fs.unlinkSync(OUTPUT);

        // Set up our credentials object.
        const credentials = PDFServicesSdk.Credentials
            .servicePrincipalCredentialsBuilder()
            .withClientId("37dddd52c7d94d72bf8d08b56b4b35a9")
            .withClientSecret("p8e-J_s77FaxPIUecousUL1euFv8V2MOnDnP")
            .build();
        // Convert JSON data to a string
        const jsonString = JSON.stringify(data, null, 2);

        // // Write JSON string to a file
        // fs.writeFile('data.json', jsonString, (err) => {
        //     if (err) {
        //         console.error('Error writing JSON file:', err);
        //     } else {
        //         console.log('JSON file has been created!');
        //     }
        // });

        const JSON_INPUT = require('./data.json');
        //const JSON_INPUT = require('./data.json');

        // Create an ExecutionContext using credentials
        const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);

        // This creates an instance of the Export operation we're using, as well as specifying output type (PDF)
        const documentMerge = PDFServicesSdk.DocumentMerge,
            documentMergeOptions = documentMerge.options,
            options = new documentMergeOptions.DocumentMergeOptions(JSON_INPUT, documentMergeOptions.OutputFormat.PDF);

        // Create a new operation instance using the options instance.
        const documentMergeOperation = documentMerge.Operation.createNew(options);

        // Set operation input document template from a source file.
        const input = PDFServicesSdk.FileRef.createFromLocalFile(template);
        documentMergeOperation.setInput(input);

        // Execute the operation and Save the result to the specified location.
        documentMergeOperation.execute(executionContext)
            .then(result => result.saveAsFile(OUTPUT))
            .then(() => resolve())
            .catch(err => {
                if (err instanceof PDFServicesSdk.Error.ServiceApiError || err instanceof PDFServicesSdk.Error.ServiceUsageError) {
                    reject(`Exception encountered while executing operation: ${err}`);
                } else {
                    reject(`Exception encountered while executing operation: ${err}`);
                }
            });
    });
}

module.exports = { generatePDF };