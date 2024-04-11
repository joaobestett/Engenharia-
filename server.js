const express = require('express');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const multer = require('multer');

const app = express();

const upload = multer({ dest: 'uploads/' });

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.post('/generate-pdf', upload.single('pdf'), async (req, res) => {
  const { title, summary } = req.body;
  const pdf = req.file.buffer;

// Create a new PDFDocument
const pdfDoc = await PDFDocument.create();

// Add a new page to the document
const page = pdfDoc.addPage();

// Get the width and height of the page
const { width, height } = page.getSize();

// Create a new text object for the title
const titleText = pdfDoc.getTextBox(title, {
  width: width - 2 * 40,
  height: height / 4,
  horizontalAlign: 'center',
  verticalAlign: 'middle',
});

// Add the title text object to the page
page.drawText(titleText, { x: 40, y: height - 10 });

// Create a new text object for the summary
const summaryText = pdfDoc.getTextBox(summary, {
  width: width - 2 * 40,
  height: height / 2,
  horizontalAlign: 'center',
  verticalAlign: 'middle',
});

// Add the summary text object to the page
page.drawText(summaryText, { x: 40, y: height / 2 });

// Add the uploaded PDF to the document
const uploadedPdf = await PDFDocument.load(pdf);
const uploadedPage = uploadedPdf.getPages()[0];
pdfDoc.addPage(uploadedPage);

// Save the PDF to a file in the "generated-pdfs" folder
const pdfBytes = await pdfDoc.save();
fs.writeFileSync(`${__dirname}/generated-pdfs/generated-pdf.pdf`, pdfBytes);

// Send the file to the client as a download
res.download(`${__dirname}/generated-pdfs/generated-pdf.pdf`, 'generated-pdf.pdf');
});

app.listen(3003, () => {
  console.log('Server started on port 3003');
});