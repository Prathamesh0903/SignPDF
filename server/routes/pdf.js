const router = require('express').Router();
const multer = require('multer');
const Pdf = require('../models/Pdf');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

router.post('/upload', upload.single('pdf'), (req, res) => {
  const filename = req.file.filename;
  const filepath = req.file.path;
  const uploaderId = req.body.uploaderId; // Assuming uploaderId is sent in the request body

  const newPdf = new Pdf({ filename, filepath, uploaderId });

  newPdf.save()
    .then(() => res.json('PDF uploaded!'))
    .catch(err => res.status(400).json('Error: ' + err));
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
