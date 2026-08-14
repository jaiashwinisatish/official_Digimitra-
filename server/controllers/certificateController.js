const PDFDocument = require('pdfkit');
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Generate and Get Certificate
// @route   GET /api/certificate/:courseId
// @access  Private
const getCertificate = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  const course = await Course.findById(courseId);
  const user = await User.findById(userId);

  if (!course || !user) {
    res.status(404).json({ message: 'Course or User not found' });
    return;
  }

  // Create PDF
  const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=certificate-${courseId}.pdf`);

  doc.pipe(res);

  // Design Certificate
  doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();
  
  doc.fontSize(40).text('Certificate of Completion', { align: 'center' }).moveDown();
  doc.fontSize(20).text('This is to certify that', { align: 'center' }).moveDown(0.5);
  doc.fontSize(30).fillColor('#2c3e50').text(user.name, { align: 'center' }).moveDown();
  doc.fontSize(20).fillColor('black').text('has successfully completed the course', { align: 'center' }).moveDown(0.5);
  doc.fontSize(25).fillColor('#27ae60').text(course.title.en, { align: 'center' }).moveDown();
  doc.fontSize(15).fillColor('black').text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' }).moveDown(2);
  
  doc.fontSize(12).text('Digimitra - Basic Computer Education', { align: 'center' });

  doc.end();

  // Optionally save to DB
  let certificate = await Certificate.findOne({ userId, courseId });
  if (!certificate) {
    certificate = new Certificate({
      userId,
      courseId,
      issuedDate: new Date()
    });
    await certificate.save();
  }
};

module.exports = { getCertificate };
