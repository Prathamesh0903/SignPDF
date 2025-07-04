const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // IMPORTANT: Replace with your actual path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173' // Replace with your React app's origin
}));
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const pdfsRouter = require('./routes/pdf');
const authRouter = require('./routes/auth');
const signatureRouter = require('./routes/signature');

app.use('/pdfs', pdfsRouter);
app.use('/auth', authRouter);
app.use('/signatures', signatureRouter);
app.use('/uploads', express.static('uploads'));
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
