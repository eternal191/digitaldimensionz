const { Resend } = require('resend');
const { readFileSync } = require('fs')
const { join } = require('path');

const resend = new Resend(process.env.RESEND_API_KEY);


function getEmailTemplate() {
  try {
    const templatePath = join(process.cwd(), 'email.html');
    const template = readFileSync(templatePath, 'utf8');
    return template;
  } catch (error) {
    console.error('Error reading email template:', error);
    return null;
  }
}


module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;
    
    const data = await resend.emails.send({
      from: 'Digital Dimensionz <onboarding@resend.dev>',
      to: ['eternal191@gmail.com'], // Replace with your email
      subject: 'Test new contact form submission with resend',
      html: getEmailTemplate(),
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(400).json({ success: false, error: error.message });
  }
} 