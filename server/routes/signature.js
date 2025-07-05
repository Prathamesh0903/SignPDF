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
      console.error('Invalid signature image format:', signatureImage ? signatureImage.substring(0, 50) + '...' : 'null');
      return res.status(400).json({ message: 'Invalid signature image format' });
    }

    let pngImage;
    try {
      const pngImageBytes = Buffer.from(signatureImage.split(',')[1], 'base64');
      pngImage = await pdfDoc.embedPng(pngImageBytes);
      console.log('Signature image embedded successfully');
    } catch (imageError) {
      console.error('Error embedding signature image:', imageError);
      return res.status(400).json({ message: 'Error processing signature image' });
    }

    const { width, height } = targetPage.getSize();

    // Validate coordinate values
    if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) {
      console.error('Invalid coordinates:', { x, y });
      return res.status(400).json({ message: 'Invalid signature coordinates' });
    }

    const scaleX = width / (renderedPdfWidth || 600);
    const scaleY = height / (renderedPdfHeight || 800);

    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    console.log('Scaling factors:', { scaleX, scaleY, originalCoords: { x, y }, scaledCoords: { scaledX, scaledY } });

    targetPage.drawImage(pngImage, {
      x: scaledX,
      y: height - (scaledY + (56 * scaleY) + 7), // Adjust for signature height and coordinate system with a fine-tuned offset
      width: 180 * scaleX,
      height: 56 * scaleY,
    });

    console.log('Saving PDF document...');
    const signedPdfBytes = await pdfDoc.save();
    console.log('PDF document saved, size:', signedPdfBytes.length, 'bytes');
    
    const newFilename = `${Date.now()}-${pdf.filename.replace('.pdf', '_signed.pdf')}`;
    const newFilePath = `uploads/${newFilename}`;
    console.log('New file path:', newFilePath);

    // Ensure uploads directory exists
    try {
      await fs.mkdir('uploads', { recursive: true });
      console.log('Uploads directory ensured');
    } catch (dirError) {
      console.error('Error creating uploads directory:', dirError);
    }

    try {
      await fs.writeFile(newFilePath, signedPdfBytes);
      console.log('Signed PDF saved successfully:', newFilePath);
    } catch (writeError) {
      console.error('Error writing signed PDF:', writeError);
      return res.status(500).json({ message: 'Error saving signed PDF file' });
    }

    res.json({ 
      message: 'PDF signed and saved!', 
      newFilePath: `/${newFilePath}`
    });

  } catch (err) {
    console.error('Error finalizing PDF:', err);
    console.error('Error stack:', err.stack);
    console.error('Request body:', req.body);
    res.status(500).json({ 
      message: 'Error finalizing PDF',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

module.exports = router;
