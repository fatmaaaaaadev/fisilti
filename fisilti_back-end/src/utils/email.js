const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Doğrulama kodu e-postası gönderir.
 * @param {string} to - Alıcı e-posta adresi
 * @param {string} code - 6 haneli doğrulama kodu
 */
async function sendVerificationEmail(to, code) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Fısıltı — E-posta Doğrulama',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Fısıltı'ya Hoş Geldin 👋</h2>
        <p>Hesabını aktif etmek için aşağıdaki doğrulama kodunu kullan:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px; background: #f4f4f4; border-radius: 8px; text-align: center;">
          ${code}
        </div>
        <p style="color: #888; margin-top: 16px;">Bu kod 15 dakika geçerlidir. Eğer bu işlemi sen yapmadıysan bu e-postayı yok say.</p>
      </div>
    `,
  });
}

module.exports = { sendVerificationEmail };
