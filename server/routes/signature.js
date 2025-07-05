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

router.post('/finalize', async (req, res) => {
  const { documentId, signatureId } = req.body;

  try {
    const pdf = await Pdf.findById(documentId);
    const signature = await Signature.findById(signatureId);
    
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }
    
    if (!signature) {
      return res.status(404).json({ message: 'Signature not found' });
    }

    // Update signature status to finalized
    signature.status = 'signed';
    await signature.save();

    res.json({ 
      message: 'Signature finalized successfully!',
      newFilePath: `/${pdf.filepath}`
    });

  } catch (err) {
    console.error('Error finalizing signature:', err);
    res.status(500).json({ message: 'Error finalizing signature' });
  }
});

router.post('/finalize-and-embed', async (req, res) => {
  const { documentId, signatureImage, x, y, page, renderedPdfWidth, renderedPdfHeight } = req.body;

  try {
    console.log('Finalize request received:', { documentId, x, y, page, renderedPdfWidth, renderedPdfHeight });
    
    const pdf = await Pdf.findById(documentId);
    if (!pdf) {
      console.log('PDF not found for ID:', documentId);
      return res.status(404).json({ message: 'PDF not found' });
    }

    console.log('PDF found:', pdf.filename, 'Path:', pdf.filepath);

    // Check if file exists
    try {
      await fs.access(pdf.filepath);
    } catch (fileError) {
      console.error('PDF file not accessible:', pdf.filepath, fileError);
      return res.status(404).json({ message: 'PDF file not found on server' });
    }

    const existingPdfBytes = await fs.readFile(pdf.filepath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    
    if (page < 1 || page > pages.length) {
      return res.status(400).json({ message: `Invalid page number. PDF has ${pages.length} pages.` });
    }
    
    const targetPage = pages[page - 1];

    // Validate signature image
    if (!signatureImage || !signatureImage.includes('data:image/png;base64,')) {
      return res.status(400).json({ message: 'Invalid signature image format' });
    }

    const pngImageBytes = Buffer.from(signatureImage.split(',')[1], 'base64');
    const pngImage = await pdfDoc.embedPng(pngImageBytes);

    const { width, height } = targetPage.getSize();

    const scaleX = width / (renderedPdfWidth || 600);
    const scaleY = height / (renderedPdfHeight || 800);

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

    // Ensure uploads directory exists
    try {
      await fs.mkdir('uploads', { recursive: true });
    } catch (dirError) {
      console.error('Error creating uploads directory:', dirError);
    }

    await fs.writeFile(newFilePath, signedPdfBytes);
    console.log('Signed PDF saved:', newFilePath);

    res.json({ 
      message: 'PDF signed and saved!', 
      newFilePath: `/${newFilePath}`
    });

  } catch (err) {
    console.error('Error finalizing PDF:', err);
    res.status(500).json({ 
      message: 'Error finalizing PDF',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

module.exports = router;
