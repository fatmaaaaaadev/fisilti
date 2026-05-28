import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ChangeEvent } from 'react';
import axios from 'axios';

// 🚀 BACKEND BAĞLANTISI GÜNCELLEMESİ: Port 3000 yapıldı ve /api prefix'i kaldırıldı
const API_BASE_URL = 'https://fisilti-12i6.onrender.com/auth';

export default function AuthPage(): React.JSX.Element {
  const navigate = useNavigate(); 
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [country, setCountry] = useState<string>('');

  // Hata gösterimleri
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  /* ----------------- 🔐 API ENTEGRASYONU: GİRİŞ YAP ----------------- */
  const handleLogin = async () => {
    setLoginError(null);

    if (!email) {
      setLoginError("E-posta veya kullanıcı adı girmelisiniz.");
      return;
    }
    if (password.length < 6) {
      setLoginError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    try {
      // Backend'deki login endpoint'ine verileri POST ediyoruz
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email: email,      
        password: password  
      });

      // Backend'den gelen veriyi kontrol ediyoruz
      if (response.data && response.data.token) {
        // 1. Token'ı tarayıcı hafızasına alıyoruz
        localStorage.setItem('token', response.data.token);
        
        // 2. 🎯 BÜYÜK HARF ROL KONTROLÜ (Dikkat: "ADMIN" veya "USER" geliyor)
        const userRole = response.data.user?.role || 'USER'; 
        localStorage.setItem('role', userRole);
        
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        
        
        // 3. 🗺️ BÜYÜK HARFE GÖRE YÖNLENDİRME KAPISI
        if (userRole === 'ADMIN') {
          navigate('/admin'); // Admin paneline uçur
        } else {
          navigate('/home');  // Normal kullanıcı ana akışına uçur
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Giriş yapılırken sunucu kaynaklı bir hata oluştu.";
      setLoginError(errorMessage);
    }
  };

  /* ----------------- 📝 API ENTEGRASYONU: KAYIT OL ----------------- */
  const handleRegister = async () => {
    setRegisterError(null);

    if (!username || !email || !password || !country) {
      setRegisterError('Lütfen tüm alanları eksiksiz doldurun.');
      return;
    }

    if (password.length < 6) {
      setRegisterError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    if (!email.includes("@")) {
      setRegisterError("Geçerli bir e-posta adresi girin.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        username: username,
        email: email,
        password: password,
        country: country
      });

      // handleRegister fonksiyonunun içindeki başarılı response kısmına:
if (response.status === 200 || response.status === 201) {
  localStorage.setItem('pendingEmail', email); // E-posta bilgisini verify sayfası için saklıyoruz
  
  navigate('/verify');
}

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.";
      setRegisterError(errorMessage);
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
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Üst Kısım: Logo ve Başlık */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
          <div style={{ width: '70px', height: '70px', backgroundImage: 'linear-gradient(to bottom right, #5bc0be, #4F46E5)', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 4px 20px rgba(79, 70, 229, 0.15)' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '3px solid white', borderBottomLeftRadius: '0' }} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0 0 0' }}>Fısıltı</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Sessizce paylaş, fısıltıyla yayılsın.</p>
        </div>

        {/* Ana Form Kartı */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '24px', border: '1px solid #E5E7EB', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
          
          {/* Giriş Yap / Kayıt Ol Sekme Butonları */}
          <div style={{ display: 'flex', backgroundColor: '#FDFBF7', padding: '4px', borderRadius: '12px', marginBottom: '32px' }}>
            <button 
              type="button"
              onClick={() => setActiveTab('login')} 
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer', backgroundColor: activeTab === 'login' ? '#FFFFFF' : 'transparent', color: activeTab === 'login' ? '#1E1B4B' : '#6B7280', transition: 'all 0.2s' }}
            >
              Giriş Yap
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('register')}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer', backgroundColor: activeTab === 'register' ? '#FFFFFF' : 'transparent', color: activeTab === 'register' ? '#1E1B4B' : '#6B7280', transition: 'all 0.2s' }}
            >
              Kayıt Ol
            </button>
          </div>

          {activeTab === 'login' ? (
            /* ----------------- GİRİŞ YAP PANELİ ----------------- */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: 'black' ,fontWeight: 'bold', margin: '0 0 6px 0' }}>Tekrar hoş geldin</h2>
                <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Hesabına giriş yaparak fısıltılara devam et.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', textAlign: 'left', fontWeight: 'bold' }}> E-posta</label>
                <input 
                  type="text"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="ornek@mail.com" 
                  style={{ backgroundColor: '#FDFBF7', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '12px', color: '#1E1B4B', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '14px', textAlign: 'left', fontWeight: 'bold' }}>Şifre</label>
                </div>
                <input 
                  type="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  style={{ backgroundColor: '#FDFBF7', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '12px', color: '#1E1B4B', outline: 'none' }}
                />
              </div>

              {loginError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(229, 62, 62, 0.1)', border: '1px solid #EF4444', padding: '12px', borderRadius: '12px', color: '#B91C1C', fontSize: '14px' }}>
                  {loginError}
                </div>
              )}

              <button type="button" onClick={handleLogin} style={{ backgroundColor: '#4F46E5', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '8px' }}>
                Giriş Yap
              </button>
              <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px', color: '#6B7280' }}>
                 Hesabın yok mu? <span onClick={() => setActiveTab('register')} style={{ cursor: 'pointer', color: '#4F46E5', fontWeight: 'bold' }}>Kayıt ol</span>
              </div>
            </div>
          ) : (
            /* ----------------- KAYIT OL PANELİ ----------------- */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: 'black' , fontWeight: 'bold', margin: '0 0 6px 0' }}>Aramıza katıl</h2>
                <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>Birkaç saniyede hesabını oluştur.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', textAlign: 'left', fontWeight: 'bold' }}>Kullanıcı adı</label>
                <input 
                  type="text"
                  value={username}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  placeholder="kullaniciadi" 
                  style={{ backgroundColor: '#FDFBF7', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '12px', color: '#1E1B4B', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', textAlign: 'left', fontWeight: 'bold' }}>E-posta</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="ornek@mail.com" 
                  style={{ backgroundColor: '#FDFBF7', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '12px', color: '#1E1B4B', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', textAlign: 'left', fontWeight: 'bold' }}>Şifre</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter" 
                  style={{ backgroundColor: '#FDFBF7', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '12px', color: '#1E1B4B', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '14px', textAlign: 'left', fontWeight: 'bold' }}>Ülke</label>
                <select 
                  value={country}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setCountry(e.target.value)}
                  style={{ backgroundColor: '#FDFBF7', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '12px', color: '#1E1B4B', outline: 'none' }}
                >
                  <option value="" disabled style={{ background: '#FFFFFF' }}>Ülkeni seç</option>
                  <option value="TR" style={{ background: '#FFFFFF' }}>Türkiye</option>
                  <option value="US" style={{ background: '#FFFFFF' }}>Amerika Birleşik Devletleri</option>
                  <option value="DE" style={{ background: '#FFFFFF' }}>Almanya</option>
                  <option value="GB" style={{ background: '#FFFFFF' }}>İngiltere</option>
                  <option value="FR" style={{ background: '#FFFFFF' }}>Fransa</option>
                  <option value="IT" style={{ background: '#FFFFFF' }}>İtalya</option>
                  <option value="ES" style={{ background: '#FFFFFF' }}>İspanya</option>
                  <option value="RU" style={{ background: '#FFFFFF' }}>Rusya</option>
                  <option value="NL" style={{ background: '#FFFFFF' }}>Hollanda</option>
                </select>
              </div>

              {registerError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid #EF4444', padding: '12px', borderRadius: '12px', color: '#B91C1C', fontSize: '14px' }}>
                  {registerError}
                </div>
              )}

              <button type="button" onClick={handleRegister} style={{ backgroundColor: '#4F46E5', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '8px' , boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)' }}>
                Kayıt Ol
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}