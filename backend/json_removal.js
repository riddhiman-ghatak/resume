const fs = require('fs');

const filePath = 'receipt.json';

fs.unlink(filePath, (err) => {
    if (err) {
        console.error('Error removing file:', err);
        return;
    }

    console.log('File removed successfully.');
});
