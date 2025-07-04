const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const signatureSchema = new Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pdf',
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
  renderedWidth: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'signed', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const Signature = mongoose.model('Signature', signatureSchema);

module.exports = Signature;
