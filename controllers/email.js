const nodemailer = require('nodemailer');
const { generatePdfBuffer } = require('../utils/pdfgenerator');


const sendProtonEmail = async (req, res) => {
    try {
      const { email, subject, data } = req.body;
  
      const timestamp = Date.now();
      const safeEmail = email.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filename = `quote_${safeEmail}_${timestamp}.pdf`;
  
      const htmlContent = data.emailTemplate;
      const pdfBuffer = await generatePdfBuffer(htmlContent)
  
      const transporter = nodemailer.createTransport({
        host: 'smtp.protonmail.ch',
        port: 587,
        secure: false,
        auth: {
          user: process.env.PROTON_USER,
          pass: process.env.PROTON_PASSWORD,
        },
      });
  
      const mailOptions = {
        from: process.env.PROTON_USER,
        to: email,
        subject: subject,
        html: htmlContent,
        attachments: [
          {
            filename: filename,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      };
  
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ success: true, message: 'Email sent!' });
  
    } catch (err) {
      console.error('Unexpected error:', err);
      return res.status(500).json({ success: false, error: 'Failed to send email.' });
    }
  };


module.exports = { sendProtonEmail };
