const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');

const app = express();
const port = 3003;

app.use(express.static('public'));

app.get('/generate-pdf', async (req, res) => {
  const html = fs.readFileSync('public/pdf-template.html', 'utf8');
  const pdf = await new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    await page.emulateMediaType('print');
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();
    resolve(pdfBuffer);
  });
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="output.pdf"',
  });
  res.send(pdf);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});