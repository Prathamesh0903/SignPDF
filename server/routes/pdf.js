const router = require('express').Router();
const multer = require('multer');
const Pdf = require('../models/Pdf');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync('uploads/')) {
      fs.mkdirSync('uploads/', { recursive: true });
    }
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    // Check if file is a PDF
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

router.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const filename = req.file.filename;
    const filepath = req.file.path;
    const uploaderId = req.body.uploaderId || 'anonymous'; // Make uploaderId optional

    const newPdf = new Pdf({ 
      filename, 
      filepath, 
      uploaderId,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      uploadDate: new Date()
    });

    await newPdf.save();
    
    res.json({ 
      success: true, 
      message: 'PDF uploaded successfully!',
      pdf: {
        id: newPdf._id,
        filename: newPdf.filename,
        originalName: newPdf.originalName
      }
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error uploading PDF: ' + err.message 
    });
  }
});

router.get('/', (req, res) => {
  Pdf.find()
    .then(pdfs => res.json(pdfs))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/:id', (req, res) => {
  Pdf.findById(req.params.id)
    .then(pdf => res.json(pdf))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/add-text', async (req, res) => {
  const { filepath, pageNumber, text, x, y } = req.body;

  try {
    const existingPdfBytes = await fs.promises.readFile(filepath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[pageNumber - 1]; // pageNumber is 1-based

    firstPage.drawText(text, { x, y });

    const pdfBytes = await pdfDoc.save();

    // Save the modified PDF to a new file or overwrite the existing one
    const newFilePath = filepath.replace('.pdf', '_signed.pdf');
    await fs.promises.writeFile(newFilePath, pdfBytes);

    res.json({ message: 'Text added to PDF successfully!', newFilePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding text to PDF' });
  }
});

module.exports = router;
