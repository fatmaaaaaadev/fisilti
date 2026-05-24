import React from 'react';
import { FiShield, FiLogOut } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

export const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Admin URL kontrolü için

  // Admin panelinde miyiz kontrolü (/admin adresindeyse mor yanacak)
  const isAdminActive = location.pathname === '/admin';

  const handleLogout = () => {
    navigate('/auth'); // Çıkış yapınca auth sayfasına fırlatır
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
        {/* ÜST KISIM: Orijinal Konuşma Balonlu Fısıltı Logosu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingLeft: '8px' }}>
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
          
          {/* ADMİN YÖNETİM PANELİ BUTONU */}
          <button
            onClick={() => navigate('/admin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              width: '100%',
              padding: '24px 16px',
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

      {/* EN ALT KISIM: Kırmızı Çıkış Yap Butonu */}
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