const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());
app.use(cors());

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sanjutechprods77@gmail.com', // Your email
    pass: 'oxpi dtaq mzww goho', // App-specific password
  },
});

// Store OTPs temporarily
const otpStore = {};

// Endpoint to send OTP
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Store OTP for verification
  otpStore[email] = otp;

  // Send OTP via email
  const mailOptions = {
    from: 'sanju-techprods.com', // Use a professional email address
    to: email,
    subject: 'Your OTP for Admin Login',
    text: `Dear User,\n\nThank you for choosing SanjuTechProds.\n\nYour One-Time Password (OTP) for Admin Login is: ${otp}\n\nPlease use this OTP to access your account. The OTP is valid for a limited time only.\n\nIf you did not request this, please contact our support team immediately.\n\nBest regards,\nSanjuTechProds Team\nsanjutechprods77@gmail.com`,
  };
  

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully to:', email);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
  }
});

// Endpoint to verify OTP
app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  // Validate email and OTP
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  if (otpStore[email] && otpStore[email] === parseInt(otp)) {
    delete otpStore[email]; // Clear OTP after verification
    res.json({ success: true, message: 'OTP verified' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});