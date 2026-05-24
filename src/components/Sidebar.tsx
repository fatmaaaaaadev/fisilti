import React from 'react';
import { FiHome, FiUser, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); 
  };

  return (
    <div style={{
      width: '260px',
      height: '100vh',
      backgroundColor: '#FFFFFF',
      borderRight: '1px solid #E5E7EB',
      position: 'fixed',
      left: 0,
      top: 0,
      padding: '32px 24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* YENİLENEN ALAN: Giriş sayfasındaki orijinal Fısıltı Logosu ve Yazısı */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '44px', // Sidebar oranına uygun olarak 44px yaptık
            height: '44px', 
            backgroundImage: 'linear-gradient(to bottom right, #5bc0be, #4F46E5)', 
            borderRadius: '12px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            boxShadow: '0px 4px 15px rgba(79, 70, 229, 0.15)'
          }}>
            {/* Orijinal Konuşma Balonu Simgesi */}
            <div style={{ 
              width: '16px', 
              height: '16px', 
              borderRadius: '50%', 
              border: '2.5px solid white', 
              borderBottomLeftRadius: '0' 
            }} />
          </div>
          <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#1E1B4B', letterSpacing: '0.5px' }}>Fısıltı</span>
        </div>

        {/* Menü Butonları */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => setCurrentTab('feed')}
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
              backgroundColor: currentTab === 'feed' ? '#FDFBF7' : 'transparent',
              color: currentTab === 'feed' ? '#4F46E5' : '#6B7280',
            }}
          >
            <FiHome style={{ fontSize: '18px' }} />
            Ana Sayfa
          </button>

          <button
            onClick={() => setCurrentTab('profile')}
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
              backgroundColor: currentTab === 'profile' ? '#FDFBF7' : 'transparent',
              color: currentTab === 'profile' ? '#4F46E5' : '#6B7280',
            }}
          >
            <FiUser style={{ fontSize: '18px' }} />
            Profilim
          </button>
        </nav>
      </div>

      {/* En Alt Kısım: Sadece Kırmızı Çıkış Yap Butonu */}
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