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
    from: '"SanjuTechProds" <sanjutechprods77@gmail.com>', // Improved format
    to: email,
    subject: 'SanjuTechProds : Your OTP (Valid for 10 mins)', // More specific
    html: `
    <div style="font-family:Arial,sans-serif; max-width:600px; margin:auto">
        <div style="background:#f8f9fa; padding:20px; text-align:center">
            <h2 style="color:#007BFF; margin:0">Thank you for choosing <strong>SanjuTechProds</strong></h2>
        </div>
        <div style="padding:20px">
            <p>Dear User,</p>
            <p>Your one-time login verification code is:</p>
            <div style="background:#f8f9fa; padding:15px; text-align:center; margin:15px 0; 
                 font-size:24px; font-weight:bold; color:#007BFF">
                ${otp}
            </div>
            <p>This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
            <p>If you didn't request this, please contact our support team.</p>
            <br>
            <p>Best regards,<br>SanjuTechProds Team,<br>sanjutechprods77@gmail.com</p>
        </div>
        <div style="background:#f8f9fa; padding:10px; text-align:center; font-size:12px">
            <p>© ${new Date().getFullYear()} SanjuTechProds</p>
        </div>
    </div>
    `,
    text: `Thank you for choosing SanjuTechProds \n\nYour OTP: ${otp}\n\nValid for 10 minutes. Do not share.\n\nIf you didn't request this, please contact us.\n\n--\nSanjuTechProds Team`, // Plain text version
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