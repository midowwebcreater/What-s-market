const express = require('express');
const fileUpload = require('express-fileupload');
const csv = require('csv-parser');
const fs = require('fs');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(fileUpload());
app.use(express.static('../frontend')); // Serve frontend

// Upload CSV
app.post('/upload', (req, res) => {
    if (!req.files || !req.files.contacts) return res.status(400).send('No file uploaded.');
    const contactsFile = req.files.contacts;
    contactsFile.mv('./contacts.csv', (err) => {
        if (err) return res.status(500).send(err);
        res.send('Contacts uploaded successfully.');
    });
});

// Demo send messages
app.get('/send-demo', async (req, res) => {
    const contacts = [];
    fs.createReadStream('./contacts.csv')
        .pipe(csv())
        .on('data', (row) => contacts.push(row))
        .on('end', async () => {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto('https://web.whatsapp.com');
            console.log('⚡ Scan QR Code and login...');

            for (let contact of contacts) {
                const message = `Hello ${contact.name}, this is a test message!`;
                const url = `https://web.whatsapp.com/send?phone=${contact.phone}&text=${encodeURIComponent(message)}`;
                await page.goto(url);
                await page.waitForTimeout(10000);
                await page.keyboard.press('Enter');
                console.log(`✅ Message sent to ${contact.name}`);
                await page.waitForTimeout(5000);
            }
            res.send('Demo messages sent. Check console.');
        });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
