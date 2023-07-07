const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const resumeRoutes = require('./routes/resumeRoutes');

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/resume', resumeRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
