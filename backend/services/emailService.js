const nodemailer = require("nodemailer");

module.exports.sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const receiver = process.env.TEST_RECEIVER_EMAIL || email;

    const mailOptions = {
      from: `"${process.env.APP_NAME || 'CyberShield'}" <${process.env.EMAIL_USER}>`,
      to: receiver,
      subject: "🔒 Your 2FA Security Cryptogram",
      html: `
        <div style="background-color: #050b14; color: #e2eaff; padding: 40px; font-family: 'Courier New', Courier, monospace; text-align: center;">
          <h1 style="color: #00e5ff; letter-spacing: 2px;">CHAKRAVYUHA SECURE ACCESS</h1>
          <p style="font-size: 16px; color: #8c9eff;">A node handshake was initiated. Use the secure crytogram below to gain access to the Evidence Vault.</p>
          <div style="background: rgba(0, 229, 255, 0.1); border: 2px dashed #00e5ff; display: inline-block; padding: 20px 40px; margin: 30px 0;">
            <h2 style="font-size: 32px; letter-spacing: 12px; font-weight: bold; margin: 0; color: #fff;">${otp}</h2>
          </div>
          <p style="font-size: 14px; color: #ff1744;">⚠️ This token is valid for a limited time. Do not share it.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 CyberShield OTP successfully dispatched to ${receiver}: ${info.messageId}`);
  } catch (err) {
    console.error(`❌ Mail Dispatch Error:`, err);
  }
};

module.exports.sendInvestigatorEmail = async (email, investigatorName, investigatorEmail) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    
    // Explicitly sending to the test receiver if specified, else the user's email
    const receiver = process.env.TEST_RECEIVER_EMAIL || email;

    const mailOptions = {
      from: `"${process.env.APP_NAME || 'CyberShield'}" <${process.env.EMAIL_USER}>`,
      to: receiver,
      subject: "🛡️ Investigator Assigned to Your Incident",
      html: `
        <div style="background-color: #050b14; color: #e2eaff; padding: 40px; font-family: 'Courier New', Courier, monospace; text-align: center;">
          <h1 style="color: #00e676; letter-spacing: 2px;">CASE ACCEPTED</h1>
          <p style="font-size: 16px; color: #8c9eff;">Your incident report has been securely processed and assigned.</p>
          <div style="background: rgba(0, 230, 118, 0.1); border: 1px solid #00e676; display: inline-block; padding: 20px; margin: 30px 0;">
            <p style="margin:5px 0;"><strong>Officer Designate:</strong> ${investigatorName}</p>
            <p style="margin:5px 0;"><strong>Comms Address:</strong> ${investigatorEmail}</p>
          </div>
          <p style="font-size: 14px; color: #e2eaff;">The investigator will be assessing the blockchain hash integrity and AI summaries shortly.</p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error(`❌ Investigator Mail Error:`, err);
  }
};