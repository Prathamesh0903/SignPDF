const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pdfSchema = new Schema({
  filename: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  filepath: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  uploaderId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Pdf = mongoose.model('Pdf', pdfSchema);

module.exports = Pdf;
