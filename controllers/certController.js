const Certificate = require('../models/Certificate');
const QRCode = require('qrcode');

// @desc    Create a new certificate
// @route   POST /api/certificates
// @access  Private/Admin
exports.createCertificate = async (req, res) => {
  try {
    const { certificateId, recipientName, courseName, issueDate, issuerDetails } = req.body;

    const certExists = await Certificate.findOne({ certificateId });
    if (certExists) return res.status(400).json({ message: 'Certificate ID already exists' });

    // Generate QR code data string encoded as a standard URL or JSON for scanning. 
    // Here we include the ID. The frontend can use this string to generate a scannable QR.
    const qrData = JSON.stringify({ certificateId });
    
    // Actually, let's also generate a Base64 image of the QR to store if we want to provide it directly.
    const qrCodeImage = await QRCode.toDataURL(qrData);

    const certificate = await Certificate.create({
      certificateId,
      recipientName,
      courseName,
      issueDate,
      issuerDetails,
      qrCodeData: qrCodeImage
    });

    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all certificates (Admin or sync for offline)
// @route   GET /api/certificates
// @access  Private
exports.getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({});
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
