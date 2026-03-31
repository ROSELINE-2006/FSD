const express = require('express');
const router = express.Router();
const { verifyCertificate, getVerificationLogs } = require('../controllers/verifyController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', verifyCertificate);
router.get('/logs', protect, admin, getVerificationLogs);

module.exports = router;
