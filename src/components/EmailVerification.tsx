import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { FiMail, FiClock, FiRefreshCw, FiArrowRight } from 'react-icons/fi';

export default function EmailVerification(): React.JSX.Element {
  const [code, setCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(180); // 3 dakika = 180 saniye
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);

  // Geri sayım sayacı
  useEffect(() => {
    if (timeLeft === 0) {
      setIsResendDisabled(false);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleVerify = () => {
    if (code.length !== 6) return;
    alert(`Doğrulama Kodu Gönderiliyor: ${code}`);
  };

  const handleResendCode = () => {
    setTimeLeft(180);
    setIsResendDisabled(true);
    setCode('');
  };

  return (
    /* SAYFA ARKA PLANI: İkili renk sorununu çözmek için genişlik ve yüksekliği tarayıcıya kilitledik */
    <div style={{ 
      backgroundColor: '#FDFBF7', 
      height: '100vh', 
      width: '100vw', 
      position: 'fixed',
      top: 0,
      left: 0,
      color: '#1E1B4B', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '24px', 
      fontFamily: 'sans-serif',
      boxSizing: 'border-box',
      overflowY: 'auto'
    }}>
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', zIndex: 10 }}>
        
        {/* Ana Form Kartı */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '24px', border: '1px solid #E5E7EB', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', position: 'relative' }}>
          
          {/* Üst Sağ Köşedeki Canlı Geri Sayım Sayacı */}
          <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FDFBF7', border: '1px solid #E5E7EB', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontFamily: 'monospace', color: '#4F46E5', fontWeight: 'bold' }}>
            <FiClock />
            <span>Süre: {formatTime(timeLeft)}</span>
          </div>

          {/* Mektup Amblemi - Artık Kutunun İçinde Başlığın Üstünde */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', marginTop: '10px' }}>
            <div style={{ width: '60px', height: '60px', backgroundImage: 'linear-gradient(to bottom right, #5bc0be, #4F46E5)', borderRadius: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 4px 15px rgba(79, 70, 229, 0.15)' }}>
              <FiMail style={{ color: 'white', fontSize: '24px' }} />
            </div>
          </div>

          {/* Panel Başlığı */}
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '20px', color: 'black', fontWeight: 'bold', margin: '0 0 25px 0' }}>E-posta Adresini Doğrula</h2>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Lütfen e-posta adresinize gelen 6 haneli kodu giriniz.</p>
          </div>

          {/* Form İçeriği */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Giriş Yap Kutusu Stilinde Tekli Kod Giriş Alanı */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', textAlign: 'left', fontWeight: 'bold' }}>Doğrulama Kodu</label>
              
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FiMail style={{ position: 'absolute', left: '14px', color: '#9CA3AF', fontSize: '18px' }} />
                
                <input 
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="_ _ _ _ _ _" 
                  style={{ 
                    width: '100%',
                    backgroundColor: '#FDFBF7', 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '12px', 
                    padding: '14px 12px 14px 42px', // Kutuyu biraz daha uzatmak için dikey padding'i 14px yaptık
                    color: '#1E1B4B', 
                    outline: 'none',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    letterSpacing: '6px',
                    fontFamily: 'monospace'
                  }}
                />
              </div>
            </div>

            {/* Fısıltı Moru Aktifleştirme Butonu - Giriş Yap Butonuyla Birebir Aynı Boyutta */}
            <button 
              type="button" 
              onClick={handleVerify}
              disabled={code.length !== 6}
              style={{ 
                backgroundColor: code.length === 6 ? '#4F46E5' : '#9CA3AF', 
                color: 'white', 
                border: 'none', 
                padding: '14px', // Buton dikey genişliği auth sayfasındakiyle eşitlendi
                borderRadius: '12px', 
                fontWeight: 'bold', 
                fontSize: '16px', 
                cursor: code.length === 6 ? 'pointer' : 'not-allowed', 
                marginTop: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                boxShadow: code.length === 6 ? '0 4px 12px rgba(79, 70, 229, 0.2)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <span>Hesabı Aktifleştir</span>
              <FiArrowRight />
            </button>

            {/* Alt Kısım: Yeniden Kod İsteme Linki */}
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#6B7280' }}>
              Kodu almadın mı?{' '}
              <span 
                onClick={!isResendDisabled ? handleResendCode : undefined} 
                style={{ 
                  cursor: isResendDisabled ? 'not-allowed' : 'pointer', 
                  color: isResendDisabled ? '#9CA3AF' : '#4F46E5', 
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <FiRefreshCw style={{ fontSize: '12px' }} />
                Kodu Tekrar Gönder
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}