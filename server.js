// backend/server.js
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
    user: 'sanjaykumarmullu3@gmail.com', // Your email
    pass: 'Sri@0926', // Your email password or app-specific password
  },
});

// Store OTPs temporarily
const otpStore = {};

// Endpoint to send OTP
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Store OTP for verification
  otpStore[email] = otp;

  // Send OTP via email
  const mailOptions = {
    from: 'sanjaykumarmullu3@gmail.com',
    to: email,
    subject: 'Your OTP for Admin Login',
    text: `Your OTP is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// Endpoint to verify OTP
app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

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