import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiClock, FiRefreshCw, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';

// 🚀 BACKEND BAĞLANTISI GÜNCELLEMESİ: Port 3000 yapıldı ve /api kaldırıldı
const API_BASE_URL = 'https://fisilti-12i6.onrender.com/auth';

export default function EmailVerification(): React.JSX.Element {
  const navigate = useNavigate();
  const [code, setCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(180); // 3 dakika = 180 saniye
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [verifyError, setVerifyError] = useState<string | null>(null);

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

  /* ----------------- 🔐 API ENTEGRASYONU: KODU DOĞRULA ----------------- */
  const handleVerify = async () => {
    if (code.length !== 6) return;
    setVerifyError(null); 

    // Kayıt anında sakladığımız e-postayı alıyoruz ki backend hangi hesabı açacağını bilsin
    const userEmail = localStorage.getItem('pendingEmail');

    try {
      // Backend tablosundaki "/verify-email" endpoint'ine istek atıyoruz
      const response = await axios.post(`${API_BASE_URL}/verify-email`, {
        email: userEmail, // Hangi kullanıcının doğrulandığını belirtiyoruz
        code: code
      });

      if (response.status === 200) {
        alert("Hesabınız başarıyla aktifleştirildi!");
        
        // Eğer giriş token'ı gelmişse kaydediyoruz
        if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('role', response.data.user?.role || 'USER');
        }

        // Geçici sakladığımız e-posta bilgisini temizliyoruz
        localStorage.removeItem('pendingEmail');

        // Kullanıcıyı uygulamanın ana akışına uçuruyoruz
        navigate('/home');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Doğrulama kodu geçersiz veya süresi dolmuş.";
      setVerifyError(errorMessage);
    }
  };

  /* ----------------- 🔄 API ENTEGRASYONU: KODU YENİDEN GÖNDER ----------------- */
  const handleResendCode = async () => {
    setVerifyError(null);
    const userEmail = localStorage.getItem('pendingEmail');

    if (!userEmail) {
      setVerifyError("E-posta bilgisi bulunamadı. Lütfen tekrar kayıt olmayı deneyin.");
      return;
    }

    try {
      // Backend tablosundaki: POST /auth/resend-verify-code
      // Görüntüdeki istek detayına göre gövdede (body) email bekliyorlar
      const response = await axios.post(`${API_BASE_URL}/resend-verify-code`, {
        email: userEmail
      });

      if (response.status === 200) {
        alert("Yeni doğrulama kodu e-posta adresinize gönderildi!");
        setTimeLeft(180);
        setIsResendDisabled(true);
        setCode('');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Yeni kod gönderilirken bir hata oluştu.";
      setVerifyError(errorMessage);
    }
  };

  return (
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
          
          {/* Canlı Geri Sayım Sayacı */}
          <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FDFBF7', border: '1px solid #E5E7EB', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontFamily: 'monospace', color: '#4F46E5', fontWeight: 'bold' }}>
            <FiClock />
            <span>Süre: {formatTime(timeLeft)}</span>
          </div>

          {/* Mektup Amblemi */}
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
                    padding: '14px 12px 14px 42px',
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

            {verifyError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(229, 62, 62, 0.1)', border: '1px solid #EF4444', padding: '12px', borderRadius: '12px', color: '#B91C1C', fontSize: '14px' }}>
                {verifyError}
              </div>
            )}

            <button 
              type="button" 
              onClick={handleVerify}
              disabled={code.length !== 6}
              style={{ 
                backgroundColor: code.length === 6 ? '#4F46E5' : '#9CA3AF', 
                color: 'white', 
                border: 'none', 
                padding: '14px', 
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

            {/* Yeniden Kod İsteme Alanı */}
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