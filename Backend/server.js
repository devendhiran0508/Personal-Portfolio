// server.js
import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// POST route to handle contact form submission
app.post('/send', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Setup transporter
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
  });

  // Mail options - Fixed the from field
  let mailOptions = {
    from: process.env.EMAIL_USER,  // Must be your authenticated email
    to: process.env.EMAIL_USER,    // Your receiving address  
    replyTo: email,                // Visitor's email for easy replies
    subject: `Portfolio Contact: ${subject} - From ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #333; border-bottom: 2px solid #8b5cf6; padding-bottom: 10px;">
          📧 New Portfolio Contact Form Submission
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #8b5cf6; margin-top: 0;">Contact Details:</h3>
          <p><strong style="color: #333;">Name:</strong> ${name}</p>
          <p><strong style="color: #333;">Email:</strong> 
            <a href="mailto:${email}" style="color: #8b5cf6;">${email}</a>
          </p>
          <p><strong style="color: #333;">Subject:</strong> ${subject}</p>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border-left: 4px solid #8b5cf6; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Message:</h3>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #f0f9ff; border-radius: 8px;">
          <p style="margin: 0; color: #0ea5e9; font-size: 14px;">
            💡 <strong>Tip:</strong> You can reply directly to this email to respond to ${name}
          </p>
        </div>
        
        <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
          <p>This message was sent from your portfolio contact form</p>
          <p>Sent on: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ message: 'Error sending email.' });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});