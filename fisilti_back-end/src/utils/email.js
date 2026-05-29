const nodemailer = require('nodemailer');

// Yeni Gmail / SSL ayarlarıyla transporter güncellendi 🚀
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,         // 👈 Port 465 yapıldı
  secure: true,      // 👈 Secure değeri TRUE yapıldı (Port 465 SSL protokolü olduğu için)
  auth: {
    user: process.env.SMTP_USER, // Render panelindeki Gmail adresi
    pass: process.env.SMTP_PASS  // Render panelindeki 16 haneli Uygulama Şifresi
  },
  tls: {
    rejectUnauthorized: false // Render sunucusunun DNS/Sertifika hatası vermesini engeller
  }
});

/**
 * Doğrulama kodu e-postası gönderir.
 * @param {string} to - Alıcı e-posta adresi
 * @param {string} code - 6 haneli doğrulama kodu
 */
async function sendVerificationEmail(to, code) {
  // Fonksiyonun içini try-catch içine alıyoruz ki mail servisinde anlık 
  // bir sorun olsa bile backend komple çöküp frontend'e 500 fırlatmasın.
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Fısıltı" <${process.env.SMTP_USER}>`,
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
    console.log(`✅ E-posta başarıyla gönderildi: ${to}`);
  } catch (error) {
    console.error('❌ E-posta gönderilirken hata yaşandı:', error.message);
    // Hatayı yukarı fırlatmıyoruz (throw etmiyoruz), böylece auth.service.js sorunsuz çalışmaya devam ediyor
  }
}

module.exports = { sendVerificationEmail };
