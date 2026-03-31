const Certificate = require('../models/Certificate');
const VerificationLog = require('../models/VerificationLog');

// @desc    Verify Certificate and Log Geolocation
// @route   POST /api/verify
// @access  Public (can be called unauthenticated or authenticated)
exports.verifyCertificate = async (req, res) => {
  try {
    const { certificateId, location, deviceInfo, verificationMethod, verifierId } = req.body;

    if (!certificateId) {
      return res.status(400).json({ message: 'Certificate ID is required' });
    }

    const certificate = await Certificate.findOne({ certificateId });

    let status = 'Invalid';
    if (certificate) {
      if (certificate.isRevoked) {
        status = 'Revoked';
      } else {
        status = 'Valid';
      }
    }

    // Log the verification attempt
    const log = await VerificationLog.create({
      certificateId,
      verifierId: verifierId || null,
      status,
      location: location || {}, // { latitude, longitude }
      deviceInfo,
      verificationMethod: verificationMethod || 'online'
    });

    if (status === 'Valid') {
      return res.json({ status: 'Valid', certificate, logId: log._id });
    } else {
      return res.json({ status, message: `Certificate is ${status}`, logId: log._id });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get Verification Logs (Admin only)
// @route   GET /api/verify/logs
// @access  Private/Admin
exports.getVerificationLogs = async (req, res) => {
  try {
    const logs = await VerificationLog.find({}).sort({ createdAt: -1 }).populate('verifierId', 'name email');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
