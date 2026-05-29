import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../AdminSidebar'; 
import { FiUsers, FiMessageSquare, FiUserCheck, FiEye, FiEyeOff, FiTrendingUp, FiGlobe, FiPieChart, FiUserX, FiAlertTriangle } from 'react-icons/fi';
import axios from 'axios';

// 🎯 BACKEND GERÇEĞİ: Port 3000 ve /api prefix'i yok
const API_BASE_URL = 'https://fisilti-12i6.onrender.com';

interface ReportedPost {
  id: number;          // 🎯 id: number
  content: string;     // 🎯 fısıltı içeriği
  username: string;    // 🎯 fısıltıyı atan kullanıcının adı (Backend'den ekledik)
  reportCount: number; // 🎯 Toplam şikayet edilme sayısı (Backend'den ekledik)
  reasons: string[];   // 🎯 Şikayet nedenleri dizisi (Backend'den ekledik)
  isActive: boolean;   // 🎯 Alper'in şemasında postun aktiflik (gizlenmeme) durumu
}

interface SystemUser {
  id: number;          
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  isActive: boolean;   // Backend modelindeki ban kontrolü (true = aktif, false = banlı)
}

// 📊 ALPER'İN STATS ENDPOINT'İNDEN DÖNEN VERİLERİN TİP TANIMLAMALARI
interface BackendStats {
  overview: {
    totalUsers: number;
    totalPosts: number;
    totalReports: number;
    bannedUsers: number;
  };
  dailyPosts: Array<{ date: string; count: number }>;
  dailyUsers: Array<{ date: string; count: number }>;
  countryDistribution: Array<{ country: string; count: number }>;
}

export default function AdminDashboard(): React.JSX.Element {
  const [adminTab, setAdminTab] = useState<'reports' | 'ban' | 'stats'>('reports');

  const [reportedPosts, setReportedPosts] = useState<ReportedPost[]>([]);
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 📈 İstatistik sekmesi için state'ler
  const [statsData, setStatsData] = useState<BackendStats | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(false);

  // 🛡️ LocalStorage'dan token alıp konfigürasyonu hazırlıyoruz
  const token = localStorage.getItem('token');
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // Sekme geçişlerinde backend verilerini tazeleyelim
  useEffect(() => {
    if (adminTab === 'reports') fetchReportedPosts();
    if (adminTab === 'ban') fetchSystemUsers();
    if (adminTab === 'stats') fetchAdminStats();
  }, [adminTab]);

  /* =========================================================================
     🔄 1. API: DETAYLI RAPORLARI ÇEKME VE GÖNDERİ GİZLEME (PATCH /admin/posts/:id/hide)
     ========================================================================= */
  const fetchReportedPosts = async () => {
    try {
      setLoading(true);
      // 🎯 Seninle beraber backend controller'a yazdığımız o yeni detaylı endpoint'e istek atıyoruz!
      const response = await axios.get(`${API_BASE_URL}/admin/reports/detail`, axiosConfig);
      setReportedPosts(response.data);
    } catch (error) {
      console.error("Detaylı raporlar getirilirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHidePost = async (postId: number, currentIsActive: boolean) => {
    const confirmMessage = currentIsActive 
      ? "Bu fısıltıyı akıştan gizlemek istediğinize emin misiniz?" 
      : "Bu fısıltıyı yeniden yayına almak istiyor musunuz?";

    if (!window.confirm(confirmMessage)) return;

    try {
      // 🎯 Alper'in controller'ındaki gibi PATCH isteği atıyoruz
      const response = await axios.patch(`${API_BASE_URL}/admin/posts/${postId}/hide`, {}, axiosConfig);

      if (response.status === 200) {
        // 🔄 State içindeki postun isActive (yayında olma) durumunu tersine çeviriyoruz
        setReportedPosts(reportedPosts.map(post => 
          post.id === postId ? { ...post, isActive: !currentIsActive } : post
        ));
      }
    } catch (error) {
      alert("Gönderi gizleme/gösterme işlemi başarısız oldu.");
    }
  };

  /* =========================================================================
     👥 2. API: KULLANICILARI ÇEKME VE BANLAMA (PUT /admin/users/:id/ban)
     ========================================================================= */
  const fetchSystemUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/users`, axiosConfig);
      setUsers(response.data);
    } catch (error) {
      console.error("Kullanıcı listesi çekilemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBanUser = async (userId: number, currentIsActive: boolean) => {
    const confirmMessage = currentIsActive 
      ? "Kullanıcıyı sistemden engellemek istiyor musunuz?" 
      : "Kullanıcının erişim engelini kaldırmak istediğinize emin misiniz?";
    
    if (!window.confirm(confirmMessage)) return;

    try {
      const response = await axios.put(`${API_BASE_URL}/admin/users/${userId}/ban`, {}, axiosConfig);

      if (response.status === 200) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, isActive: !currentIsActive } : user
        ));
      }
    } catch (error) {
      alert("Kullanıcı yaptırım işlemi sırasında bir hata oluştu.");
    }
  };

  /* =========================================================================
     📊 3. API: İSTATİSTİKLERİ ÇEKME (GET /admin/stats)
     ========================================================================= */
  const fetchAdminStats = async () => {
    try {
      setStatsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/stats?days=45`, axiosConfig);
      setStatsData(response.data);
    } catch (error) {
      console.error("İstatistik verileri backend'den alınamadı:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FDFBF7', minHeight: '100vh', width: '100vw', color: '#1E1B4B', display: 'flex', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      
      {/* Sol Menü */}
      <AdminSidebar />

      {/* Sağ Admin Panel Alanı */}
      <div style={{ flex: 1, marginLeft: '260px', padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: '32px', boxSizing: 'border-box' }}>
        
        {/* Üst Navigasyon Kontrol Kartı */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px 32px', borderRadius: '24px', border: '1px solid #E5E7EB', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <div style={{ display: 'flex', backgroundColor: '#FDFBF7', padding: '6px', borderRadius: '14px', border: '1px solid #E5E7EB', gap: '6px' }}>
            <button onClick={() => setAdminTab('reports')} style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: adminTab === 'reports' ? '#FFFFFF' : 'transparent', color: adminTab === 'reports' ? '#4F46E5' : '#64748B', boxShadow: adminTab === 'reports' ? '0 4px 10px rgba(0,0,0,0.04)' : 'none' }}>
              <FiAlertTriangle /> Raporlar
            </button>
            <button onClick={() => setAdminTab('ban')} style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: adminTab === 'ban' ? '#FFFFFF' : 'transparent', color: adminTab === 'ban' ? '#4F46E5' : '#64748B', boxShadow: adminTab === 'ban' ? '0 4px 10px rgba(0,0,0,0.04)' : 'none' }}>
              <FiUserX /> Üye Yönetimi 
            </button>
            <button onClick={() => setAdminTab('stats')} style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: adminTab === 'stats' ? '#FFFFFF' : 'transparent', color: adminTab === 'stats' ? '#4F46E5' : '#64748B', boxShadow: adminTab === 'stats' ? '0 4px 10px rgba(0,0,0,0.04)' : 'none' }}>
              <FiPieChart /> İstatistikler
            </button>
          </div>
        </div>

        {/* LOADING DURUMU */}
        {loading && <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#4F46E5' }}>Veriler backend'den yükleniyor...</div>}

        {/* ----------------- 1. SEKME: RAPORLANAN GÖNDERİLER ----------------- */}
        {!loading && adminTab === 'reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {reportedPosts.length > 0 ? reportedPosts.map((post) => (
              <div key={post.id} style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '24px', border: '1px solid #E5E7EB', opacity: post.isActive ? 1 : 0.6, transition: 'all 0.3s', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* 📊 Backend'den gelen gerçek kullanıcı adını basıyoruz */}
                    <span style={{ color: '#64748B', fontSize: '14px', fontWeight: '500' }}>
                      Yazar: <span style={{ color: '#1E1B4B', fontWeight: 'bold' }}>@{post.username}</span>
                    </span>
                  </div>
                  {/* 📊 Backend'den gelen gerçek şikayet sayısını buraya yerleştirdik */}
                  <span style={{ backgroundColor: '#FEF2F2', color: '#EF4444', fontSize: '12px', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiAlertTriangle /> {post.reportCount} Kez Şikayet Edildi
                  </span>
                </div>
                
                <p style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#1E1B4B', lineHeight: '1.6', backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '14px', border: '1px solid #E5E7EB', textAlign: 'left' }}>
                  "{post.content}"
                </p>

                {/* 📝 Şikayet Nedenleri Kutusu (Senin için tasarladığım yeni dinamik arayüz) */}
                <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', textAlign: 'left' }}>
                  <strong style={{ fontSize: '13px', color: '#B45309', display: 'block', marginBottom: '6px' }}>
                    Gelen Şikayet Nedenleri:
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#78350F', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {post.reasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {/* 🎯 Buton tetikleyicisine post.id ve o anki post.isActive durumunu paslıyoruz */}
                  <button
                    onClick={() => handleToggleHidePost(post.id, post.isActive)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: post.isActive ? '#FEF2F2' : '#E5E7EB', color: post.isActive ? '#EF4444' : '#4B5563' }}
                  >
                    {post.isActive ? (<><FiEyeOff /> Akıştan Gizle</>) : (<><FiEye /> Akışta Göster</>)}
                  </button>
                </div>
              </div>
            )) : <div style={{ textAlign: 'center', color: '#64748B' }}>Şu an şikayet edilmiş aktif bir fısıltı bulunmuyor. ✨</div>}
          </div>
        )}

        {/* ----------------- 2. SEKME: KULLANICI LİSTESİ VE BANLAMA ----------------- */}
        {!loading && adminTab === 'ban' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '16px', color: '#64748B', fontSize: '14px' }}>Kullanıcı Bilgisi</th>
                  <th style={{ padding: '16px', color: '#64748B', fontSize: '14px' }}>E-posta</th>
                  <th style={{ padding: '16px', color: '#64748B', fontSize: '14px' }}>Durum</th>
                  <th style={{ padding: '16px', color: '#64748B', fontSize: '14px', textAlign: 'right' }}>Eylem</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 'bold', color: 'black' }}>{user.username}</div>
                    </td>
                    <td style={{ padding: '16px', color: '#1E1B4B' }}>{user.email}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        fontSize: '12px', 
                        padding: '4px 10px', 
                        borderRadius: '12px', 
                        fontWeight: 'bold', 
                        backgroundColor: user.isActive ? '#F0FDF4' : '#FEF2F2', 
                        color: user.isActive ? '#16A34A' : '#EF4444' 
                      }}>
                        {user.isActive ? 'Aktif Hesap' : 'Erişimi Engelli'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleToggleBanUser(user.id, user.isActive)} 
                        style={{ 
                          border: 'none', 
                          backgroundColor: user.isActive ? '#FEF2F2' : '#F0FDF4', 
                          color: user.isActive ? '#EF4444' : '#16A34A', 
                          padding: '8px 14px', 
                          borderRadius: '10px', 
                          fontWeight: 'bold', 
                          fontSize: '13px', 
                          cursor: 'pointer', 
                          transition: '0.2s' 
                        }}
                      >
                        {user.isActive ? 'Sistemden Banla' : 'Engeli Kaldır'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ----------------- 3. SEKME: DİNAMİK STATS PANELİ ----------------- */}
        {adminTab === 'stats' && (
          statsLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#4F46E5', fontWeight: 'bold' }}>İstatistikler backend'den yükleniyor...</div>
          ) : statsData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'sans-serif' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
                  <div style={{ width: '54px', height: '54px', borderRadius: '16px', backgroundColor: '#EEF2FF', color: '#4F46E5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <FiUsers style={{ fontSize: '24px' }} />
                  </div>
                  <div>
                    <div style={{ color: '#6B7280', fontSize: '13px', fontWeight: 'bold' }}>Toplam Kullanıcı</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginTop: '2px' }}>
                      {statsData.overview.totalUsers.toLocaleString('tr-TR')}
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
                  <div style={{ width: '54px', height: '54px', borderRadius: '16px', backgroundColor: '#F0FDF4', color: '#16A34A', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <FiUserCheck style={{ fontSize: '24px' }} />
                  </div>
                  <div>
                    <div style={{ color: '#6B7280', fontSize: '13px', fontWeight: 'bold' }}>Aktif / Pasif</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginTop: '2px' }}>
                      {(statsData.overview.totalUsers - statsData.overview.bannedUsers)} <span style={{ color: '#9CA3AF', fontWeight: 'normal', fontSize: '20px' }}>/</span> <span style={{ color: '#EF4444' }}>{statsData.overview.bannedUsers}</span>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
                  <div style={{ width: '54px', height: '54px', borderRadius: '16px', backgroundColor: '#FFF7ED', color: '#EA580C', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <FiMessageSquare style={{ fontSize: '24px' }} />
                  </div>
                  <div>
                    <div style={{ color: '#6B7280', fontSize: '13px', fontWeight: 'bold' }}>Toplam Fısıltı</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginTop: '2px' }}>
                      {statsData.overview.totalPosts.toLocaleString('tr-TR')}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '24px', border: '1px solid #E5E7EB', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <FiTrendingUp style={{ color: '#4F46E5', fontSize: '18px' }} />
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1E1B4B' }}>Tarihsel Gönderi İstatistikleri</h3>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                      <span style={{ color: '#4F46E5', fontWeight: '500' }}>Son 15 Gün:</span>
                      <span style={{ fontWeight: 'bold', color: '#111827' }}>
                        {(statsData.dailyPosts || [])
                          .slice(0, 15)
                          .reduce((sum, item) => sum + item.count, 0)
                          .toLocaleString('tr-TR')} fısıltı
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                      <span style={{ color: '#4F46E5', fontWeight: '500' }}>Son 30 Gün:</span>
                      <span style={{ fontWeight: 'bold', color: '#111827' }}>
                        {(statsData.dailyPosts || [])
                          .slice(0, 30)
                          .reduce((sum, item) => sum + item.count, 0)
                          .toLocaleString('tr-TR')} fısıltı
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                      <span style={{ color: '#4F46E5', fontWeight: '500' }}>Son 45 Gün:</span>
                      <span style={{ fontWeight: 'bold', color: '#111827' }}>
                        {(statsData.dailyPosts || [])
                          .slice(0, 45)
                          .reduce((sum, item) => sum + item.count, 0)
                          .toLocaleString('tr-TR')} fısıltı
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '24px', border: '1px solid #E5E7EB', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <FiGlobe style={{ color: '#0D9488', fontSize: '18px' }} />
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1E1B4B' }}>Coğrafi Kullanıcı Dağılımı (IP / Ülke)</h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {statsData.countryDistribution && statsData.countryDistribution.length > 0 ? (
                      statsData.countryDistribution.map((item, index) => {
                        const totalUsers = statsData.overview.totalUsers || 1;
                        const percentage = Math.round((item.count / totalUsers) * 100);
                        
                        return (
                          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                            <span style={{ color: '#4B5563', fontWeight: '500' }}>
                              {item.country === 'TR' ? 'Türkiye (TR)' : item.country === 'DE' ? 'Almanya (DE)' : `Ülke: ${item.country}`}
                            </span>
                            <span style={{ fontWeight: 'bold', color: '#111827' }}>
                              %{percentage} <span style={{ fontWeight: 'normal', color: '#6B7280', fontSize: '13px' }}>({item.count} üye)</span>
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ textAlign: 'center', color: '#64748B', padding: '20px' }}>Coğrafi veri bulunamadı.</div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#64748B', padding: '20px' }}>Veriler yüklenirken bir sorun oluştu.</div>
          )
        )}

      </div>
    </div>
  );
}