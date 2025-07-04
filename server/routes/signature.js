const router = require('express').Router();
const Signature = require('../models/Signature');
const Pdf = require('../models/Pdf');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;

router.post('/add', (req, res) => {
  const { documentId, userId, x, y, page, status, renderedWidth } = req.body;
  const newSignature = new Signature({ documentId, userId, x, y, page, status, renderedWidth });

  newSignature.save()
    .then(() => res.json('Signature added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/:documentId', (req, res) => {
  Signature.find({ documentId: req.params.documentId })
    .then(signatures => res.json(signatures))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/finalize-and-embed', async (req, res) => {
  const { documentId, signatureImage, x, y, page, renderedPdfWidth, renderedPdfHeight } = req.body;

  try {
    const pdf = await Pdf.findById(documentId);
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    const existingPdfBytes = await fs.readFile(pdf.filepath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const targetPage = pages[page - 1];

    const pngImageBytes = Buffer.from(signatureImage.split(',')[1], 'base64');
    const pngImage = await pdfDoc.embedPng(pngImageBytes);

    const { width, height } = targetPage.getSize();

    const scaleX = width / renderedPdfWidth;
    const scaleY = height / renderedPdfHeight;

    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    targetPage.drawImage(pngImage, {
      x: scaledX,
      y: height - (scaledY + (56 * scaleY) + 7), // Adjust for signature height and coordinate system with a fine-tuned offset
      width: 180 * scaleX,
      height: 56 * scaleY,
    });

    const signedPdfBytes = await pdfDoc.save();
    const newFilename = `${Date.now()}-${pdf.filename.replace('.pdf', '_signed.pdf')}`;
    const newFilePath = `uploads/${newFilename}`;

    await fs.writeFile(newFilePath, signedPdfBytes);

    res.json({ 
      message: 'PDF signed and saved!', 
      newFilePath: `/${newFilePath}`
    });

  } catch (err) {
    console.error('Error finalizing PDF:', err);
    res.status(500).json({ message: 'Error finalizing PDF' });
  }
});

module.exports = router;
