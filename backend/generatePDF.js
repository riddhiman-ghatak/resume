






//.......................................................................................................................................
const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
const fs = require('fs');
const { promisify } = require('util');

const OUTPUT = './generatedReceipt.pdf';

function generatePDF(data) {
    return new Promise((resolve, reject) => {
        //if pdf is already there in the directory remove it.
        if (fs.existsSync(OUTPUT)) fs.unlinkSync(OUTPUT);

        //if data.json is already there in the directory remove it.
        if (fs.existsSync('./data.json')) {
            fs.unlinkSync('./data.json');
            console.log('Existing data.json file deleted.');
        }

        const credentials = PDFServicesSdk.Credentials
            .servicePrincipalCredentialsBuilder()
            .withClientId("37dddd52c7d94d72bf8d08b56b4b35a9")
            .withClientSecret("p8e-J_s77FaxPIUecousUL1euFv8V2MOnDnP")
            .build();

        const writeFileAsync = promisify(fs.writeFile);

        async function writeDataToFile(data) {
            // Remove the "resume_type" key from the data object
            const { resume_type, ...dataWithoutResumeType } = data;

            const jsonString = JSON.stringify(dataWithoutResumeType, null, 2);

            try {

                await writeFileAsync('data.json', jsonString);// now let's make data.json file according to user input.
                console.log('JSON file has been created!');
            } catch (err) {
                console.error('Error writing JSON file:', err);
            }
        }

        async function executeDocumentMerge() {
            try {
                await writeDataToFile(data);
                const JSON_INPUT = require('./data.json');

                const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);

                const documentMerge = PDFServicesSdk.DocumentMerge;
                const documentMergeOptions = documentMerge.options;
                const options = new documentMergeOptions.DocumentMergeOptions(
                    JSON_INPUT,
                    documentMergeOptions.OutputFormat.PDF
                );

                const documentMergeOperation = documentMerge.Operation.createNew(options);

                let template = './BasicTemplate1.docx'; // Default template

                if (data.resume_type === "2") {             //select the template according to user input.
                    template = './BasicTemplate2.docx';
                } else if (data.resume_type === "3") {
                    template = './BasicTemplate3.docx';
                }

                const input = PDFServicesSdk.FileRef.createFromLocalFile(template);
                documentMergeOperation.setInput(input);

                documentMergeOperation.execute(executionContext)
                    .then(result => result.saveAsFile(OUTPUT))
                    .then(() => {
                        console.log('PDF generated successfully!');
                        resolve();
                    })
                    .catch(err => {
                        if (
                            err instanceof PDFServicesSdk.Error.ServiceApiError ||
                            err instanceof PDFServicesSdk.Error.ServiceUsageError
                        ) {
                            reject(`Exception encountered while executing operation: ${err}`);
                        } else {
                            reject(`Exception encountered while executing operation: ${err}`);
                        }
                    });
            } catch (err) {
                console.error('Error during document merge:', err);
                reject(err);
            }
        }

        executeDocumentMerge();
    });
}

module.exports = { generatePDF };

