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
const cors = require('cors');
//const path = require('path');

const corsOptions = {
    origin: 'http://127.0.0.1:5500',
    optionsSuccessStatus: 200
};

app.use(express.json());

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors(corsOptions));

app.use(express.static('../frontend'));

// // Serve static files from the "frontend" folder
// app.use(express.static('frontend'));

// // Routes
app.use('/api/resume', resumeRoutes);

// Handle root path - Serve index.html from the "frontend" folder
app.get('/', (req, res) => {
    res.sendFile('../frontend/index.html');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Add a console.log to check the payload data
// app.post('/api/resume', (req, res) => {
//     const resumeData = req.body;
//     console.log(resumeData);
// });