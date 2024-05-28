const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const QRCode = require('qrcode');
const sharp = require('sharp');
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// The following line handles JSON payloads
app.use(bodyParser.json());
app.use(cors());

// Additional API routes might go here
app.post('/generate-qr', async (req, res) => {
    // Your existing QR code generation logic
});

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
