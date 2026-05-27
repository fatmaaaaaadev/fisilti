require('dotenv').config();
const app = require('./app');
const prisma = require('./config/prisma');

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    // Veritabanı bağlantısını test et
    await prisma.$connect();
    console.log('✅ Veritabanı bağlantısı kuruldu.');

    app.listen(PORT, () => {
      console.log(`🚀 Fısıltı backend http://localhost:${PORT} adresinde çalışıyor.`);
    });
  } catch (err) {
    console.error('❌ Sunucu başlatılamadı:', err.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
