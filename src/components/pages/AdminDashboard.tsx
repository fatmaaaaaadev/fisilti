import React, { useState } from 'react';
import { AdminSidebar } from '../AdminSidebar'; // Eski Sidebar yerine bunu import et
import { 
  FiAlertTriangle, FiUserX, FiPieChart, FiEyeOff, FiEye, 
  FiUsers, FiMessageSquare, FiTrendingUp, FiGlobe, 
} from 'react-icons/fi';

// Tip Tanımlamaları
interface ReportedPost {
  id: number;
  author: string;
  username: string;
  content: string;
  reportsCount: number;
  reason: string;
  isStatusPassive: boolean;
}

interface SystemUser {
  id: number;
  name: string;
  username: string;
  country: string;
  isBanned: boolean;
  banDuration: 'none' | 'temporary' | 'permanent';
}

export default function AdminDashboard(): React.JSX.Element {
  // Sol admin alt sekmelerini yönetmek için state
  const [adminTab, setAdminTab] = useState<'reports' | 'ban' | 'stats'>('reports');

  // 1. RAPORLANAN GÖNDERİLER DATA & STATE
  const [reportedPosts, setReportedPosts] = useState<ReportedPost[]>([
    {
      id: 101,
      author: "Ahmet Yılmaz",
      username: "@ahmety",
      content: "Mabel Matiz iğrenç şarkı söylüyor.",
      reportsCount: 4,
      reason: "Rahatsız Edici Söylem",
      isStatusPassive: false
    },
    {
      id: 102,
      author: "Caner Demir",
      username: "@canerd",
      content: "Gratis ürünlerinden lykde almanızı öneririm.",
      reportsCount: 7,
      reason: "Reklam",
      isStatusPassive: false
    }
  ]);

  // 2. KULLANICI BANLAMA DATA & STATE
  const [users, setUsers] = useState<SystemUser[]>([
    { id: 1, name: "Merve Kaya", username: "@mervek", country: "Türkiye", isBanned: false, banDuration: 'none' },
    { id: 2, name: "John Doe", username: "@johndoe", country: "Almanya", isBanned: false, banDuration: 'none' },
    { id: 3, name: "Elif Yıldız", username: "@elify", country: "Türkiye", isBanned: true, banDuration: 'permanent' }
  ]);

  // Görünürlük Kapatma/Açma Fonksiyonu (Veri silinmez, pasife alınır)
  const togglePostVisibility = (postId: number) => {
    setReportedPosts(reportedPosts.map(post => 
      post.id === postId ? { ...post, isStatusPassive: !post.isStatusPassive } : post
    ));
  };

  // Kullanıcı Banlama Fonksiyonu
  const handleBanUser = (userId: number, duration: 'temporary' | 'permanent' | 'none') => {
    setUsers(users.map(user => 
      user.id === userId ? { 
        ...user, 
        isBanned: duration !== 'none', 
        banDuration: duration 
      } : user
    ));
  };

  return (
    <div style={{ 
      backgroundColor: '#FDFBF7', 
      minHeight: '100vh', 
      width: '100vw', 
      color: '#1E1B4B', 
      display: 'flex', 
      fontFamily: 'sans-serif',
      boxSizing: 'border-box'
    }}>
      {/* Sol Ana Menü */}
      <AdminSidebar />

      {/* Sağ Admin Panel Alanı */}
      <div style={{ 
        flex: 1, 
        marginLeft: '260px', 
        padding: '40px 32px', 
        display: 'flex', 
        flexDirection: 'column',
        gap: '32px',
        boxSizing: 'border-box'
      }}>
        
        {/* Üst Yönetici Başlık Kartı */}
<div style={{ 
  backgroundColor: '#FFFFFF', 
  padding: '24px 32px', 
  borderRadius: '24px', 
  border: '1px solid #E5E7EB', 
  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)',
  display: 'flex',
  justifyContent: 'flex-start', // Sola hizalamak için flex-start yaptık
  alignItems: 'center'
}}>

  {/* İç Sub-Navigasyon Sekmeleri (Artık Sola Yaslı) */}
  <div style={{ display: 'flex', backgroundColor: '#FDFBF7', padding: '6px', borderRadius: '14px', border: '1px solid #E5E7EB', gap: '6px' }}>
    <button 
      onClick={() => setAdminTab('reports')}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
        backgroundColor: adminTab === 'reports' ? '#FFFFFF' : 'transparent',
        color: adminTab === 'reports' ? '#4F46E5' : '#64748B',
        boxShadow: adminTab === 'reports' ? '0 4px 10px rgba(0,0,0,0.04)' : 'none'
      }}
    >
      <FiAlertTriangle /> Raporlar
    </button>
    <button 
      onClick={() => setAdminTab('ban')}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
        backgroundColor: adminTab === 'ban' ? '#FFFFFF' : 'transparent',
        color: adminTab === 'ban' ? '#4F46E5' : '#64748B',
        boxShadow: adminTab === 'ban' ? '0 4px 10px rgba(0,0,0,0.04)' : 'none'
      }}
    >
      <FiUserX /> Ban
    </button>
    <button 
      onClick={() => setAdminTab('stats')}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
        backgroundColor: adminTab === 'stats' ? '#FFFFFF' : 'transparent',
        color: adminTab === 'stats' ? '#4F46E5' : '#64748B',
        boxShadow: adminTab === 'stats' ? '0 4px 10px rgba(0,0,0,0.04)' : 'none'
      }}
    >
      <FiPieChart /> İstatistikler
    </button>
  </div>
</div>
        {/* ----------------- 1. SEKME: RAPORLANAN GÖNDERİLERİN YÖNETİMİ ----------------- */}
        {adminTab === 'reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {reportedPosts.map((post) => (
              <div key={post.id} style={{ 
                backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '24px', border: '1px solid #E5E7EB', opacity: post.isStatusPassive ? 0.65 : 1, transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(0,0,0,0.01)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: 'black' }}>{post.author}</span>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>{post.username}</span>
                  </div>
                  <span style={{ backgroundColor: '#FEF2F2', color: '#EF4444', fontSize: '12px', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiAlertTriangle /> {post.reportsCount} Kez Raporlandı ({post.reason})
                  </span>
                </div>
                <p style={{ margin: '0 0 20px 0', fontSize: '15px', color: '#1E1B4B', lineHeight: '1.6', backgroundColor: 'white', padding: '16px', borderRadius: '14px', border: '1px solid #4F46E5', textAlign: 'left' }}>
                  {post.content}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => togglePostVisibility(post.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
                      backgroundColor: post.isStatusPassive ? '#E5E7EB' : '#FEF2F2',
                      color: post.isStatusPassive ? '#4B5563' : '#EF4444'
                    }}
                  >
                    {post.isStatusPassive ? (
                      <> <FiEye /> Görünürlüğü Aç </>
                    ) : (
                      <> <FiEyeOff /> Görünürlüğü Kapat </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ----------------- 2. SEKME: KULLANICI BANLAMA MEKANİZMASI ----------------- */}
        {adminTab === 'ban' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '16px', color: '#64748B', fontSize: '14px' }}>Kullanıcı</th>
                  <th style={{ padding: '16px', color: '#64748B', fontSize: '14px' }}>Ülke</th>
                  <th style={{ padding: '16px', color: '#64748B', fontSize: '14px' }}>Durum</th>
                  <th style={{ padding: '16px', color: '#64748B', fontSize: '14px', textAlign: 'right' }}>Yaptırım İşlemleri</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 'bold', color: 'black' }}>{user.name}</div>
                      <div style={{ color: '#6B7280', fontSize: '13px' }}>{user.username}</div>
                    </td>
                    <td style={{ padding: '16px', color: '#1E1B4B', fontWeight: '500' }}>{user.country}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        fontSize: '12px', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold',
                        backgroundColor: user.isBanned ? '#FEF2F2' : '#F0FDF4',
                        color: user.isBanned ? '#EF4444' : '#16A34A'
                      }}>
                        {user.isBanned ? `Engelli (${user.banDuration === 'permanent' ? 'Kalıcı' : 'Geçici'})` : 'Aktif Hesap'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      {user.isBanned ? (
                        <button 
                          onClick={() => handleBanUser(user.id, 'none')}
                          style={{ border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', color: '#16A34A', padding: '8px 14px', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                          Engeli Kaldır
                        </button>
                      ) : (
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleBanUser(user.id, 'temporary')}
                            style={{ border: 'none', backgroundColor: '#FFF7ED', color: '#EA580C', padding: '8px 14px', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
                          >
                            Geçici Ban
                          </button>
                          <button 
                            onClick={() => handleBanUser(user.id, 'permanent')}
                            style={{ border: 'none', backgroundColor: '#FEF2F2', color: '#EF4444', padding: '8px 14px', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
                          >
                            Kalıcı Ban
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ----------------- 3. SEKME: SİSTEM RAPORLAMA VE İSTATİSTİK PANELİ ----------------- */}
        {adminTab === 'stats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Üst Küçük İstatistik Kartları */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              
              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EEF2FF', color: '#4F46E5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FiUsers style={{ fontSize: '20px' }} /></div>
                <div>
                  <div style={{ color: '#6B7280', fontSize: '13px', fontWeight: 'bold' }}>Toplam Kullanıcı</div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'black', marginTop: '2px' }}>12,450</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F0FDF4', color: '#16A34A', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FiUsers style={{ fontSize: '20px' }} /></div>
                <div>
                  <div style={{ color: '#6B7280', fontSize: '13px', fontWeight: 'bold' }}>Aktif / Pasif</div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'black', marginTop: '2px' }}>12,412 / 38</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FFF7ED', color: '#EA580C', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FiMessageSquare style={{ fontSize: '20px' }} /></div>
                <div>
                  <div style={{ color: '#6B7280', fontSize: '13px', fontWeight: 'bold' }}>Günlük Fısıltı</div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'black', marginTop: '2px' }}>1,840</div>
                </div>
              </div>

            </div>

            {/* Alt Detaylı İstatistik Blokları */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              
              {/* Tarih Bazlı İçerik Yoğunluğu */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '24px', border: '1px solid #E5E7EB', textAlign: 'left' }}>
                <h3 style={{ fontSize: '16px', margin: '0 0 16px 0', fontWeight: 'bold', color: 'black', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiTrendingUp style={{ color: '#4F46E5' }} /> Tarihsel Gönderi İstatistikleri
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid #F3F4F6', paddingBottom: '8px' }}><span>Son 7 Gün:</span><strong style={{ color: 'black' }}>14,250 fısıltı</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid #F3F4F6', paddingBottom: '8px' }}><span>Son 30 Gün:</span><strong style={{ color: 'black' }}>58,900 fısıltı</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}><span>Bu Ay Toplam:</span><strong style={{ color: '#4F46E5' }}>62,400 fısıltı</strong></div>
                </div>
              </div>

              {/* Coğrafi Dağılım */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '24px', border: '1px solid #E5E7EB', textAlign: 'left' }}>
                <h3 style={{ fontSize: '16px', margin: '0 0 16px 0', fontWeight: 'bold', color: 'black', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiGlobe style={{ color: '#5bc0be' }} /> Coğrafi Kullanıcı Dağılımı (IP / Ülke)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid #F3F4F6', paddingBottom: '8px' }}><span>Türkiye:</span><strong style={{ color: 'black' }}>%78 (9,711)</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid #F3F4F6', paddingBottom: '8px' }}><span>Almanya:</span><strong style={{ color: 'black' }}>%12 (1,494)</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}><span>Diğer:</span><strong style={{ color: 'black' }}>%10 (1,245)</strong></div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}