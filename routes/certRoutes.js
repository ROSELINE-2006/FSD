const express = require('express');
const router = express.Router();
const { createCertificate, getCertificates } = require('../controllers/certController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, admin, createCertificate)
  .get(protect, getCertificates); // Allow all authenticated to view/sync

module.exports = router;
