import React, { useState, useEffect } from 'react';
import { Sidebar } from '../Sidebar'; 
import { FiTrash2, FiPlus, FiX, FiSend, FiBookmark, FiUsers, FiLayers } from 'react-icons/fi';
import axios from 'axios';

// 🚀 BACKEND GERÇEKLERİNE UYGUN URL
const API_BASE_URL = 'https://fisilti-12i6.onrender.com';

interface Whisper {
  id: number;     
  content: string; 
  createdAt: string; 
  // 🎯 YENİ: Fısıltıyı paylaşan kişinin bilgilerini profil sayfasında göstermek için ekledik
  user?: {
    username: string;
  };
}

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
}

interface FollowCounts {
  followersCount: number;
  followingCount: number;
}

// 🎯 TAKİP EDİLEN KULLANICI MODELİ
interface FollowingUser {
  id: number;
  username: string;
}

export const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'posts' | 'following' | 'saved'>('posts');
  const [counts, setCounts] = useState<FollowCounts>({ followersCount: 0, followingCount: 0 });

  // 🎯 TAKİP EDİLENLER STATE'LERİ
  const [followingList, setFollowingList] = useState<FollowingUser[]>([]);
  const [followingLoading, setFollowingLoading] = useState<boolean>(false);

  // 💾 🎯 YENİ STATE'LER: Kaydedilen fısıltılar listesi ve yüklenme durumu
  const [savedWhispers, setSavedWhispers] = useState<Whisper[]>([]);
  const [savedLoading, setSavedLoading] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWhisperText, setNewWhisperText] = useState('');
  const maxCharacters = 240;

  const token = localStorage.getItem('token');
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  /* =========================================================================
      🔄 MEVCUT KULLANICIYI AL VE İLK VERİLERİ TETİKLE
     ========================================================================= */
  useEffect(() => {
    const savedUserStr = localStorage.getItem('user');
    if (savedUserStr) {
      const parsedUser = JSON.parse(savedUserStr) as UserProfile;
      setUser(parsedUser);
      
      fetchMyWhispers(parsedUser.id);
      fetchFollowCounts(parsedUser.id);
    }
  }, []);

  /* =========================================================================
      🔄 🎯 GÜNCELLENEN EFFECT: SEKMELER ARASI GEÇİŞTE DOĞRU API İSTEKLERİNİ AT
     ========================================================================= */
  useEffect(() => {
    if (activeSubTab === 'following' && user?.id) {
      fetchFollowingList(user.id);
    } else if (activeSubTab === 'saved') {
      fetchSavedWhispers(); // 💾 Kaydedilenler sekmesine geçildiğinde API'yi tetikle
    }
  }, [activeSubTab, user?.id]);

  // 📥 API: Fısıltıları Getir
  const fetchMyWhispers = async (userId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/user/${userId}`, axiosConfig);
      if (Array.isArray(response.data)) {
        setWhispers(response.data);
      } else if (response.data && Array.isArray(response.data.posts)) {
        setWhispers(response.data.posts);
      } else if (response.data && Array.isArray(response.data.whispers)) {
        setWhispers(response.data.whispers);
      }
    } catch (error) {
      console.error("Fısıltılar çekilirken bir hata oluştu:", error);
    }
  };

  // 📥 API: Takip Sayılarını Getir
  const fetchFollowCounts = async (userId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/counts`, axiosConfig);
      if (response.data) {
        setCounts({
          followersCount: response.data.followersCount ?? 0,
          followingCount: response.data.followingCount ?? 0
        });
      }
    } catch (error) {
      console.error("Takip sayıları backend'den alınamadı:", error);
    }
  };

  // 📥 API: Takip Edilenler Listesini Getir
  const fetchFollowingList = async (userId: number) => {
    try {
      setFollowingLoading(true);
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/following`, axiosConfig);
      setFollowingList(response.data || []);
      if (Array.isArray(response.data)) {
        setCounts(prev => ({ ...prev, followingCount: response.data.length }));
      }
    } catch (error) {
      console.error("Takip edilenler listesi alınamadı:", error);
      setFollowingList([{ id: 99, username: "simüle_edilen_kullanici" }]);
    } finally {
      setFollowingLoading(false);
    }
  };

  /* =========================================================================
      📥 🎯 YENİ API FONKSİYONU: ALPER'İN GET /users/me/saved ENDPOINT'İ
     ========================================================================= */
  const fetchSavedWhispers = async () => {
    try {
      setSavedLoading(true);
      const response = await axios.get(`${API_BASE_URL}/users/me/saved`, axiosConfig);
      setSavedWhispers(response.data || []);
    } catch (error) {
      console.error("Kaydedilen fısıltılar backend'den çekilemedi:", error);
    } finally {
      setSavedLoading(false);
    }
  };

  /* =========================================================================
      🗑️ 🎯 YENİ API FONKSİYONU: ALPER'İN DELETE /posts/:id/save ENDPOINT'İ
     ========================================================================= */
  const handleRemoveFromSaved = async (whisperId: number) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/posts/${whisperId}/save`, axiosConfig);
      if (response.status === 200 || response.status === 204) {
        // Silme işlemi başarılıysa arayüzdeki listeden de fırlatıp atıyoruz
        setSavedWhispers(savedWhispers.filter(w => w.id !== whisperId));
      }
    } catch (error) {
      console.error("Kayıt kaldırılırken backend hatası oluştu:", error);
      alert("Kayıt kaldırma işlemi başarısız oldu.");
    }
  };

  // 🚀 API: Fısıltı Oluştur
  const handleCreateWhisper = async () => {
    if (newWhisperText.trim() === '') return;
    try {
      const response = await axios.post(`${API_BASE_URL}/posts`, { content: newWhisperText }, axiosConfig);
      if (response.status === 201 || response.status === 200) {
        const createdWhisper: Whisper = response.data.post || response.data.whisper || response.data;
        if (createdWhisper && createdWhisper.content) {
          setWhispers([createdWhisper, ...whispers]);
        } else {
          setWhispers([{ id: Date.now(), content: newWhisperText, createdAt: new Date().toISOString() }, ...whispers]);
        }
        setNewWhisperText('');
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Fısıltı gönderilirken hata oluştu:", error);
    }
  };

  // 🗑️ API: Fısıltı Sil
  const handleDeleteWhisper = async (id: number) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/posts/${id}`, axiosConfig);
      if (response.status === 200) {
        setWhispers(whispers.filter(w => w.id !== id));
      }
    } catch (error) {
      alert("Fısıltı silinirken bir hata meydana geldi.");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Az Önce";
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#FDFBF7', minHeight: '100vh', width: '100vw' }}>
      
      {/* SOL MENÜ */}
      <Sidebar />

      {/* SAĞ İÇERİK ALANI */}
      <div style={{ flex: 1, marginLeft: '260px', color: '#1E1B4B', padding: '40px', fontFamily: 'sans-serif', position: 'relative', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          {/* ÜST PROFİL ALANI */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
            <div style={{
              width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#FFFFFF',
              display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '28px',
              fontWeight: 'bold', color: '#4F46E5', border: '3px solid #4F46E5', boxShadow: '0px 4px 12px rgba(91, 192, 190, 0.2)'
            }}>
              {user?.username ? user.username.slice(0, 2).toUpperCase() : 'U'}
            </div>
            
            <div>
              <h2 style={{ fontSize: '26px', margin: 0, textAlign: "left", fontWeight: 'bold', color: '#1E1B4B' }}>
                {user?.username ? `${user.username}` : 'Kullanıcı'}
              </h2>
              <p style={{ color: '#6B7280', margin: '4px 0 12px 0', textAlign: "left", fontWeight: '500' }}>
                {user?.email}
              </p>
            </div>
          </div>

          {/* İSTATİSTİKLER VE İNTERAKTİF SEKMELER */}
          <div style={{ display: 'flex', gap: '40px', borderBottom: '2px solid #E5E7EB', paddingBottom: '16px', marginBottom: '24px' }}>
            
            {/* Gönderiler Sekme Butonu */}
            <div onClick={() => setActiveSubTab('posts')} style={{ cursor: 'pointer', transition: '0.2s' }}>
              <span style={{ fontWeight: 'bold', fontSize: '15px', color: activeSubTab === 'posts' ? '#1E1B4B' : '#64748B' }}>
                {whispers.length} fısıltı
              </span>
            </div>

            {/* Takip Edilenler Sekme Butonu */}
            <div onClick={() => setActiveSubTab('following')} style={{ cursor: 'pointer', transition: '0.2s' }}>
              <span style={{ fontWeight: 'bold', fontSize: '15px', color: activeSubTab === 'following' ? '#1E1B4B' : '#64748B' }}>
                {counts.followingCount} takip edilen
              </span>
            </div>

            {/* Kaydedilenler Sekme Butonu */}
            <div onClick={() => setActiveSubTab('saved')} style={{ cursor: 'pointer', transition: '0.2s' }}>
              <span style={{ fontWeight: 'bold', fontSize: '15px', color: activeSubTab === 'saved' ? '#1E1B4B' : '#64748B' }}>
                Kaydedilenler
              </span>
            </div>
          </div>

          {/* DİNAMİK BAŞLIK ALT SİMGE */}
          <h3 style={{ fontSize: '13px', color: '#6B7280', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
            {activeSubTab === 'posts' && <><FiLayers style={{ color: '#5bc0be' }} /> Gönderiler</>}
            {activeSubTab === 'following' && <><FiUsers style={{ color: '#5bc0be' }} /> Takip Edilenler</>}
            {activeSubTab === 'saved' && <><FiBookmark style={{ color: '#5bc0be' }} /> Kaydedilenler</>}
          </h3>

          {/* ─── DİNAMİK İÇERİK ALANI PANELİ ─── */}
          
          {/* 1. SEKME: GÖNDERİLER */}
          {activeSubTab === 'posts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {whispers.length > 0 ? (
                whispers.map(whisper => (
                  <div key={whisper.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E5E7EB', boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)' }}>
                    <p style={{ margin: '0 0 20px 0', fontSize: '16px', textAlign:"left", lineHeight: '1.6', color: '#1F2937' }}>
                      {whisper.content}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#9CA3AF', fontSize: '13px', fontWeight: '500' }}>
                        {formatDate(whisper.createdAt)}
                      </span>
                      <button onClick={() => handleDeleteWhisper(whisper.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '50%' }}>
                        <FiTrash2 style={{ fontSize: '18px' }} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', border: '1px solid #E5E7EB', color: '#6B7280', textAlign: 'center' }}>
                  Henüz bir fısıltı paylaşmadın. Dünyaya sesini duyur!
                </div>
              )}
            </div>
          )}

          {/* 2. SEKME: TAKİP EDİLENLER */}
          {activeSubTab === 'following' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {followingLoading ? (
                <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>Takip listesi güncelleniyor...</p>
              ) : followingList.length > 0 ? (
                followingList.map(fUser => (
                  <div 
                    key={fUser.id} 
                    style={{ 
                      backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '16px 20px', 
                      border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', 
                      justifyContent: 'space-between', boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)' 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FDFBF7',
                        border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'center', alignItems: 'center',
                        fontWeight: 'bold', fontSize: '13px', color: '#4F46E5'
                      }}>
                        {fUser.username.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: '600', color: '#1E1B4B', fontSize: '15px' }}>
                        @{fUser.username}
                      </span>
                    </div>

                    <span style={{ fontSize: '12px', color: '#10B981', backgroundColor: '#ECFDF5', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                      Takip Ediliyor
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', border: '1px solid #E5E7EB', color: '#6B7280', textAlign: 'center' }}>
                  Henüz kimseyi takip etmiyorsunuz. Ana akıştan fısıltı sahiplerini keşfedin!
                </div>
              )}
            </div>
          )}

          {/* 3. 🎯 YENİ CANLI SEKME: KAYDEDİLENLER İÇERİĞİ */}
          {activeSubTab === 'saved' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {savedLoading ? (
                <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>Kaydedilen fısıltılar getiriliyor...</p>
              ) : savedWhispers.length > 0 ? (
                savedWhispers.map(whisper => {
                  // Fısıltının sahibinin adı (eğer backend göndermediyse yedek isim veriyoruz)
                  const author = whisper.user?.username || "fısıltı_sahibi";
                  return (
                    <div key={whisper.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E5E7EB', boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#4F46E5' }}>@{author}</span>
                        <span style={{ color: '#9CA3AF', fontSize: '12px' }}>fısıldadı:</span>
                      </div>
                      <p style={{ margin: '0 0 20px 0', fontSize: '15px', textAlign:"left", lineHeight: '1.6', color: '#1F2937' }}>
                        {whisper.content}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#9CA3AF', fontSize: '13px' }}>
                          {formatDate(whisper.createdAt)}
                        </span>
                        <button 
                          onClick={() => handleRemoveFromSaved(whisper.id)} 
                          style={{ background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '6px', gap: '6px', fontWeight: 'bold', fontSize: '13px' }}
                          title="Kaydı Kaldır"
                        >
                          <FiBookmark style={{ fill: '#4F46E5', fontSize: '16px' }} />
                          <span>Kaydı Kaldır</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', border: '1px solid #E5E7EB', color: '#6B7280', textAlign: 'center' }}>
                  Henüz hiçbir fısıltıyı kaydetmediniz. Ana akıştan fısıltıları kaydederek başlayın!
                </div>
              )}
            </div>
          )}

        </div>

        {/* PANELSİZ ARTI BUTONU VE MODAL KODLARI */}
        <button onClick={() => setIsModalOpen(true)} style={{ position: 'fixed', bottom: '40px', right: '40px', width: '60px', height: '60px', borderRadius: '50%', backgroundImage: 'linear-gradient(to bottom right, #5bc0be, #4F46E5)', border: 'none', color: '#FFFFFF', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0px 6px 20px rgba(79, 70, 229, 0.3)', transition: 'transform 0.2s, boxShadow 0.2s', zIndex: 99 }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} >
          <FiPlus style={{ fontSize: '28px' }} />
        </button>

        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
            <div style={{ backgroundColor: '#FFFFFF', width: '500px', borderRadius: '20px', padding: '24px', border: '1px solid #E5E7EB', position: 'relative', boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}><FiX style={{ fontSize: '20px' }} /></button>
              <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 'bold', color: '#1E1B4B' }}>Yeni Fısıltı</h3>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#4F46E5', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: '#FFFFFF' }}>{user?.username ? user.username.slice(0, 1).toUpperCase() : 'U'}</div>
                <div style={{ flex: 1 }}>
                  <textarea placeholder="Neler fısıldamak istersin?" value={newWhisperText} onChange={(e) => setNewWhisperText(e.target.value.slice(0, maxCharacters))} style={{ width: '100%', height: '100px', backgroundColor: 'transparent', border: 'none', outline: 'none', color: '#1F2937', fontSize: '16px', resize: 'none', fontFamily: 'sans-serif', lineHeight: '1.5' }} />
                  <hr style={{ borderColor: '#F3F4F6', margin: '16px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#9CA3AF', fontSize: '14px', fontWeight: '500' }}>{maxCharacters - newWhisperText.length} karakter kaldı</span>
                    <button onClick={handleCreateWhisper} style={{ backgroundImage: 'linear-gradient(to right, #5bc0be, #4F46E5)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '30px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0px 4px 12px rgba(79, 70, 229, 0.2)' }}><FiSend /> Fısılda</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};