import React, { useEffect, useState } from 'react';
import { FiShield, FiLogOut } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

interface AdminInfo {
  username: string;
  email: string; // 🎯 BACKEND UYUMU: Name alanı yerine backend modelindeki email'i kullanıyoruz
}

export const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminActive = location.pathname === '/admin';

  const [adminUser, setAdminUser] = useState<AdminInfo | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setAdminUser(JSON.parse(savedUser));
    }
  }, []);

  /* =========================================================================
     🔒 OTURUMU KAPATMA VE TEMİZLEME İŞLEMİ (HATASIZ VE ONAY KUTUSUZ)
     ========================================================================= */
  const handleLogout = () => {
    // 1. Tarayıcı hafızasını tamamen temizliyoruz
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 2. navigate kullanmak yerine doğrudan tarayıcıyı auth sayfasına yönlendiriyoruz (Asla hata vermez)
    window.location.href = '/auth'; 
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
        {/* LOGO ALANI */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingLeft: '8px' }}>
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

        {/* MENÜ NAVİGASYONU */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => navigate('/admin')}
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
              textAlign: "left",
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: isAdminActive ? '#FDFBF7' : 'transparent',
              color: isAdminActive ? '#4F46E5' : '#94A3B8',
            }}
          >
            <FiShield style={{ fontSize: '18px' }} />
            Yönetici Paneli
          </button>
        </nav>
      </div>

      {/* ALT ALAN: AKTİF ADMİN BİLGİSİ VE ÇIKIŞ BUTONU */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* Admin Bilgi Kartı */}
        {adminUser && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            padding: '12px 16px', 
            backgroundColor: '#F9FAFB', 
            borderRadius: '12px',
            border: '1px solid #F3F4F6',
            textAlign: 'left'
          }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1E1B4B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {adminUser.email}
            </span>
            <span style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
              {adminUser.username} 
            </span>
          </div>
        )}

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

    </div>
  );
};