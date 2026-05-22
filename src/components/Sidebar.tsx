import React from 'react';
import { FiHome, FiUser, FiLogOut } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

// Propları tamamen kaldırdık veya eski dosyalar hata vermesin diye opsiyonel yaptık.
interface SidebarProps {
  currentTab?: string;
  setCurrentTab?: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Güncel URL'i takip eder (/home mu /profile mı?)

  // Butonların aktiflik durumunu doğrudan URL adresi belirler
  const isHomeActive = location.pathname === '/home';
  const isProfileActive = location.pathname === '/profile';

  const handleLogout = () => {
    navigate('/auth');
  };

  return (
    <div style={{
      width: '260px',
      height: '100vh',
      backgroundColor: '#FFFFFF',
      borderRight: '1px solid #E5E7EB',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      boxSizing: 'border-box',
      zIndex: 100
    }}>
      
      <div>
        {/* Orijinal Konuşma Balonlu Fısıltı Logosu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', paddingLeft: '8px' }}>
          <div style={{ 
            width: '44px', 
            height: '44px', 
            backgroundImage: 'linear-gradient(to bottom right, #5bc0be, #4F46E5)', 
            borderRadius: '12px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            boxShadow: '0px 4px 15px rgba(79, 70, 229, 0.15)'
          }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              borderRadius: '50%', 
              border: '2.5px solid white', 
              borderBottomLeftRadius: '0' 
            }} />
          </div>
          <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#1E1B4B', letterSpacing: '0.5px', fontFamily: 'sans-serif' }}>
            Fısıltı
          </span>
        </div>

        {/* Menü Navigasyon Alanı */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          {/* ANA SAYFA BUTONU */}
          <button
            onClick={() => navigate('/home')} // State değiştirmek yok, direkt sayfaya git!
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: isHomeActive ? '#FDFBF7' : 'transparent',
              color: isHomeActive ? '#4F46E5' : '#94A3B8',
            }}
          >
            <FiHome style={{ fontSize: '18px' }} />
            Ana Sayfa
          </button>

          {/* PROFİLİM BUTONU */}
          <button
            onClick={() => navigate('/profile')} // State değiştirmek yok, direkt gerçek Profil sayfasına git!
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: isProfileActive ? '#FDFBF7' : 'transparent',
              color: isProfileActive ? '#4F46E5' : '#94A3B8',
            }}
          >
            <FiUser style={{ fontSize: '18px' }} />
            Profilim
          </button>

        </nav>
      </div>

      {/* EN ALT KISIM: Çıkış Yap Butonu */}
      <button
        onClick={handleLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          width: '100%',
          padding: '14px 16px',
          borderRadius: '12px',
          border: 'none',
          backgroundColor: 'transparent',
          color: '#EF4444',
          fontWeight: 'bold',
          fontSize: '15px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          textAlign: 'left'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <FiLogOut style={{ fontSize: '18px' }} />
        Çıkış Yap
      </button>

    </div>
  );
};