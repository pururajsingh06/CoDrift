const nodemailer = require('nodemailer');

const isPlaceholderCredentials = (user, pass) => {
  if (!user || !pass) return true;
  const u = user.trim().toLowerCase();
  const p = pass.trim().toLowerCase();
  return (
    u === '' ||
    p === '' ||
    u === 'your_email@gmail.com' ||
    p === 'your_app_password'
  );
};

// Generates transporter dynamically depending on credentials configuration and validation
const getTransporter = async () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (isPlaceholderCredentials(user, pass)) {
    console.log('[Email Service] Placeholder or empty SMTP credentials. Generating Ethereal test account...');
    const account = await nodemailer.createTestAccount();
    return {
      transporter: nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      }),
      isTest: true
    };
  }

  // Create real SMTP transporter
  const realTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: { user, pass },
  });

  // Verify connection, if fails, fallback to Ethereal
  try {
    await realTransporter.verify();
    return { transporter: realTransporter, isTest: false };
  } catch (error) {
    console.warn('[Email Service] Real SMTP verification failed. Falling back to Ethereal developer preview. Error:', error.message);
    const account = await nodemailer.createTestAccount();
    return {
      transporter: nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      }),
      isTest: true
    };
  }
};

/**
 * Sends a welcome email to the newly registered user.
 * @param {string} toEmail - The recipient's email address.
 * @param {string} userName - The recipient's name.
 */
const sendWelcomeEmail = async (toEmail, userName) => {
  try {
    const { transporter, isTest } = await getTransporter();

    const mailOptions = {
      from: `"CoDrift Welcome" <${process.env.EMAIL_FROM || process.env.SMTP_USER || 'welcome@codrift.com'}>`,
      to: toEmail,
      subject: 'Welcome to CoDrift! 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #21262d; border-radius: 12px; background-color: #0d1117; color: #fff;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #10b981; font-size: 28px; margin: 0;">Welcome to CoDrift! 🚀</h1>
            <p style="color: #9ca3af; font-size: 14px; margin-top: 5px;">The Real-time Collaborative IDE for Developers</p>
          </div>
          <p style="color: #e5e7eb; font-size: 16px;">Hello ${userName || 'Developer'},</p>
          <p style="color: #9ca3af; line-height: 1.6;">We're absolutely thrilled to welcome you to the CoDrift community! Whether you're here to pair program, coordinate team sprints, review code live, or compile in multiple languages, CoDrift is built to make coding together effortless and beautiful.</p>
          
          <div style="background-color: #161b22; border: 1px solid #21262d; border-radius: 8px; padding: 15px; margin: 25px 0;">
            <h3 style="color: #4ade80; margin-top: 0; margin-bottom: 10px;">🌟 What you can do right now:</h3>
            <ul style="color: #9ca3af; padding-left: 20px; line-height: 1.5; margin-bottom: 0;">
              <li><strong>Create Workspace Rooms</strong>: Start a live room and share the link with friends to code together in real-time.</li>
              <li><strong>Multi-Language Execution</strong>: Code and run C++, C, Java, Python, and JS directly inside your console.</li>
              <li><strong>Built-in VS Code Snippets</strong>: Leverage our autocomplete snippets inside Monaco for rapid development.</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" style="background-color: #10b981; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);">Go to Dashboard</a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #21262d; margin: 25px 0;" />
          <p style="color: #8b949e; font-size: 12px;">If you have any questions or need support, feel free to reply to this email.</p>
          <p style="color: #8b949e; font-size: 12px; margin-top: 5px;">&copy; ${new Date().getFullYear()} CoDrift. All rights reserved.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    if (isTest) {
      console.log(`[Email Service] Ethereal Welcome Email Sent! Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } else {
      console.log(`[Email Service] Real Welcome Email Sent to ${toEmail} (Message ID: ${info.messageId})`);
    }
  } catch (error) {
    console.error(`[Email Service] Error sending welcome email to ${toEmail}:`, error);
  }
};

/**
 * Sends a general login security alert email to the user.
 * @param {string} toEmail - The recipient's email address.
 * @param {string} userName - The recipient's name.
 * @param {string} method - The login method used (e.g., 'Password', 'Google', 'GitHub').
 */
const sendLoginNotification = async (toEmail, userName, method = 'Password') => {
  try {
    const { transporter, isTest } = await getTransporter();
    
    const mailOptions = {
      from: `"CoDrift Security" <${process.env.EMAIL_FROM || process.env.SMTP_USER || 'security@codrift.com'}>`,
      to: toEmail,
      subject: `New Login to CoDrift via ${method}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #21262d; border-radius: 10px; background-color: #0d1117; color: #fff;">
          <h2 style="color: #4ade80; margin-bottom: 15px;">New Successful Login</h2>
          <p style="color: #e5e7eb; font-size: 16px;">Welcome back, ${userName || 'Developer'}!</p>
          <p style="color: #9ca3af; line-height: 1.5;">We detected a successful login to your CoDrift account using <strong>${method} Credentials</strong>.</p>
          <p style="color: #9ca3af; line-height: 1.5;">If this was you, you can safely ignore this security notification. We're excited to have you back coding with us!</p>
          <hr style="border: 0; border-top: 1px solid #21262d; margin: 20px 0;" />
          <p style="color: #8b949e; font-size: 12px;">If you did not authorize this login or suspect unauthorized access to your account, please change your password immediately.</p>
          <p style="color: #8b949e; font-size: 12px; margin-top: 5px;">&copy; ${new Date().getFullYear()} CoDrift. All rights reserved.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    if (isTest) {
      console.log(`[Email Service] Ethereal login notice sent. Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } else {
      console.log(`[Email Service] Real login notice sent to ${toEmail} via ${method} (Message ID: ${info.messageId})`);
    }
  } catch (error) {
    console.error(`[Email Service] Error sending login notification to ${toEmail}:`, error);
  }
};

/**
 * Sends a welcome/login notification email to the user (OAuth backwards compatibility).
 */
const sendOAuthLoginNotification = async (toEmail, userName, provider) => {
  return sendLoginNotification(toEmail, userName, provider);
};

/**
 * Sends a password reset recovery email to the user.
 * @param {string} toEmail - The recipient's email address.
 * @param {string} userName - The recipient's name.
 * @param {string} resetUrl - The password reset URL link.
 */
const sendPasswordResetEmail = async (toEmail, userName, resetUrl) => {
  try {
    const { transporter, isTest } = await getTransporter();

    const mailOptions = {
      from: `"CoDrift Support" <${process.env.EMAIL_FROM || process.env.SMTP_USER || 'support@codrift.com'}>`,
      to: toEmail,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Please click the link to reset your password: ${resetUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #333; border-radius: 10px; background-color: #0d1117; color: #fff;">
          <h2 style="color: #4ade80; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="color: #e5e7eb; font-size: 16px;">Hello ${userName || 'Developer'},</p>
          <p style="color: #9ca3af; line-height: 1.5;">You requested a password reset for your CoDrift account. Click the button below to secure your account and set a new password:</p>
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetUrl}" style="background-color: #10b981; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);">Reset Password</a>
          </div>
          <p style="color: #9ca3af; font-size: 13px; line-height: 1.4;">If the button doesn't work, copy and paste the following link into your browser:</p>
          <p style="color: #60a5fa; font-size: 13px; word-break: break-all; background-color: #161b22; padding: 10px; border-radius: 6px; border: 1px solid #21262d;">${resetUrl}</p>
          <hr style="border: 0; border-top: 1px solid #21262d; margin: 25px 0;" />
          <p style="color: #8b949e; font-size: 12px;">If you did not request a password reset, you can safely ignore this email. The link is valid for 1 hour.</p>
          <p style="color: #8b949e; font-size: 12px; margin-top: 5px;">&copy; ${new Date().getFullYear()} CoDrift. All rights reserved.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    if (isTest) {
      console.log(`[Email Service] Ethereal Reset Email Sent! Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } else {
      console.log(`[Email Service] Real Reset Email Sent to ${toEmail} (Message ID: ${info.messageId})`);
    }
  } catch (error) {
    console.error(`[Email Service] Error sending password reset email to ${toEmail}:`, error);
  }
};

module.exports = {
  sendOAuthLoginNotification,
  sendLoginNotification,
  sendWelcomeEmail,
  sendPasswordResetEmail
};
