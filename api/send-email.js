const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

function getEmailTemplate(name, email, message) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
            table { border-collapse: collapse; }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
        <!-- Wrapper table for centering -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <!-- Main content table -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; max-width: 600px;">
                        <tr>
                            <td style="padding: 40px 30px;">
                                <h2 style="color: #333333; font-size: 24px; margin: 0 0 20px 0;">New Contact Form Submission</h2>
                                <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 15px 0;">
                                    <strong style="color: #333333;">Name:</strong> ${name}
                                </p>
                                <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 15px 0;">
                                    <strong style="color: #333333;">Email:</strong> ${email}
                                </p>
                                <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 10px 0;">
                                    <strong>Message:</strong>
                                </p>
                                <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #4CAF50;">
                                    ${message}
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
}

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: name, email, and message are required' 
      });
    }

    const data = await resend.emails.send({
      from: 'Digital Dimensionz <onboarding@resend.dev>',
      to: ['eternal191@gmail.com'],
      subject: `New contact form submission from ${name}`,
      html: getEmailTemplate(name, email, message),
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to send email' 
    });
  }
} 