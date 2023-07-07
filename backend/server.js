// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const resumeRoutes = require('./routes/resumeRoutes');

// // Middleware
// app.use(bodyParser.json());

// app.use(express.static('frontend'));

// // Routes
// app.use('/api/resume', resumeRoutes);

// // Start the server
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const resumeRoutes = require('./routes/resumeRoutes');
//const path = require('path');

// Middleware
app.use(bodyParser.json());

app.use(express.static('C:/Users/riddh/Music/resume/frontend'));

// Serve static files from the "frontend" folder
app.use(express.static('frontend'));

// Routes
app.use('/api/resume', resumeRoutes);

// Handle root path - Serve index.html from the "frontend" folder
app.get('/', (req, res) => {
    res.sendFile('C:/Users/riddh/Music/resume/frontend/index.html');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

