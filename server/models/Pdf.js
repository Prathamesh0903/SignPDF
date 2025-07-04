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
    required: false,
    default: 'anonymous'
  },
  originalName: {
    type: String,
    required: false
  },
  fileSize: {
    type: Number,
    required: false
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
});

const Pdf = mongoose.model('Pdf', pdfSchema);

module.exports = Pdf;
