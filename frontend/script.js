// Retrieve the form element from the HTML
const form = document.getElementById('receiptForm');

// Add a submit event listener to the form
form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page

    // Retrieve the form field values
    const name = document.getElementById('name').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const linkedin = document.getElementById('linkedin').value;
    const jobTitle = document.getElementById('jobTitle').value;
    const summary = document.getElementById('summary').value;
    const skills = document.getElementById('skills').value;
    const schoolName = document.getElementById('schoolName').value;
    const schoolYear = document.getElementById('schoolYear').value;
    const schoolDescription = document.getElementById('schoolDescription').value;
    const collegeName = document.getElementById('collegeName').value;
    const collegeYear = document.getElementById('collegeYear').value;
    const collegeDescription = document.getElementById('collegeDescription').value;
    const companyName = document.getElementById('companyName').value;
    const companyYear = document.getElementById('companyYear').value;
    const companyDescription = document.getElementById('companyDescription').value;
    const achievementType1 = document.getElementById('achievementType1').value;
    const achievementDescription1 = document.getElementById('achievementDescription1').value;
    const achievementType2 = document.getElementById('achievementType2').value;
    const achievementDescription2 = document.getElementById('achievementDescription2').value;

    const resume_type = document.getElementById('resumetype').value;//may create problem

    // Create an object with the form field values
    const payload = {
        "Name": name,
        "LastName": lastName,
        "EmailAddress": email,
        "PhoneNumber": phone,
        "LinkedIn": linkedin,
        "JobTitle": jobTitle,
        "Summary": summary,
        "Skills": skills.split(','),
        "Education": [
            {
                "SchoolName": schoolName,
                "Year": schoolYear,
                "Description": schoolDescription
            },
            {
                "SchoolName": collegeName,
                "Year": collegeYear,
                "Description": collegeDescription
            }
        ],
        "Experience": [
            {
                "CompanyName": companyName,
                "Year": companyYear,
                "Description": companyDescription
            }
        ],
        "Achievements": [
            {
                "Type": achievementType1,
                "Description": achievementDescription1
            },
            {
                "Type": achievementType2,
                "Description": achievementDescription2
            }
        ],
        "resume_type": resume_type,
    };


    //console.log(name);

    // sendResumeData(payload);
    const jsonString = JSON.stringify(payload, null, 2);

    // Print JSON data to the console
    //console.log(jsonString);





    // 
    function sendResumeData(payload) {
        fetch('http://localhost:3000/api/resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload, null, 2),
        })
            //.then(response => response.json())
            .then(response => {
                // Print the request body
                console.log('Request Body:', payload);

                // Parse the response as JSON
                return response.json();
            })
            .then(data => {
                // Handle the response from the backend API
                if (data.resumeUrl) {
                    // If the response includes a resume URL, initiate the download
                    const link = document.createElement('a');
                    link.href = data.resumeUrl;
                    link.download = 'resume.pdf';
                    link.click();
                } else {
                    // Handle other success cases, such as displaying a success message
                    console.log('Resume generated successfully');
                }
            })
            .catch(error => {
                // Handle any errors that occurred during the API request
                console.error('Error:', error);
            });
    }

    sendResumeData(payload);










});
