const router = require('express').Router();
const admin = require('firebase-admin');

router.post('/verify-token', async (req, res) => {
  const idToken = req.body.idToken;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    res.json({ uid: decodedToken.uid });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

module.exports = router;
