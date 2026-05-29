import React, { useState, useEffect } from 'react';
import { Sidebar } from '../Sidebar';
import { FiAlertTriangle, FiBookmark, FiUserPlus } from 'react-icons/fi';
import axios from 'axios';

interface Whisper {
  id: number;        
  userId: number;
  content: string;   
  createdAt: string; 
  user?: {
    username: string;
  };
}

interface SuggestedUser {
  id: number;
  username: string;
}

export default function UserFeed(): React.JSX.Element {
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]); 
  const [reportedWhisperIds, setReportedWhisperIds] = useState<number[]>([]);
  const [savedWhisperIds, setSavedWhisperIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [suggestionsLoading, setSuggestionsLoading] = useState<boolean>(true); 

  const API_BASE_URL = 'https://fisilti-12i6.onrender.com';
  const token = localStorage.getItem('token');
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  /* =========================================================================
      📥 1. API: ANA AKIŞI BACKEND'DEN ÇEK
     ========================================================================= */
  useEffect(() => {
    const fetchFeedWhispers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/posts/feed`, axiosConfig);

        if (Array.isArray(response.data)) {
          setWhispers(response.data);
        } else if (response.data && Array.isArray(response.data.posts)) {
          setWhispers(response.data.posts);
        } else if (response.data && Array.isArray(response.data.whispers)) {
          setWhispers(response.data.whispers);
        }
      } catch (error) {
        console.error("Ana akış yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    /* =========================================================================
        📥 1B. KULLANICININ DAHA ÖNCE KAYDETTİĞİ ID'LERİ BACKEND'DEN ÇEK
       ========================================================================= */
    const fetchSavedWhisperIds = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/me/saved`, axiosConfig);
        const savedData = response.data || [];
        // Gelen post nesnelerinden sadece ID'leri ayıklayıp state'e atıyoruz
        const ids = savedData.map((item: any) => item.id || item.postId);
        setSavedWhisperIds(ids);
      } catch (error) {
        console.error("Kaydedilen post ID'leri çekilemedi:", error);
      }
    };

    fetchFeedWhispers();
    if (token) {
      fetchSavedWhisperIds();
    }
  }, []);

  /* =========================================================================
      📥 2. API: TAKİP ÖNERİLERİNİ ÇEK
     ========================================================================= */
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setSuggestionsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/users/suggestions`, axiosConfig);
        setSuggestions(response.data || []);
      } catch (error) {
        console.error("Takip önerileri yüklenemedi:", error);
      } finally {
        setSuggestionsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  /* =========================================================================
      ➕ 3. API: KULLANICIYI TAKİP ET
     ========================================================================= */
  const handleFollowUser = async (userId: number, username: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/${userId}/follow`, {}, axiosConfig);
      if (response.status === 201 || response.status === 200) {
        setSuggestions(suggestions.filter(user => user.id !== userId));
        alert(`@${username} başarıyla takip edildi! 🎉`);
      }
    } catch (error) {
      console.error("Takip etme işlemi başarısız:", error);
      alert("Takip işlemi sırasında bir hata oluştu.");
    }
  };

  /* =========================================================================
      🛑 4. API: RAPORLAMA SİSTEMİ (YENİLENDİ 🚀)
     ========================================================================= */
  const handleReport = async (whisperId: number) => {
    if (reportedWhisperIds.includes(whisperId)) return;
    try {
      const response = await axios.post(`${API_BASE_URL}/posts/${whisperId}/report`, {}, axiosConfig);
      if (response.status === 200 || response.status === 201) {
        setReportedWhisperIds([...reportedWhisperIds, whisperId]);
        alert("Fısıltı incelenmek üzere başarıyla rapor edildi. 🛡️");
      }
    } catch (error) {
      console.error("Raporlama hatası:", error);
      alert("Raporlama esnasında bir hata oluştu.");
    }
  };

  /* =========================================================================
      💾 5. API: GERÇEK ZAMANLI KAYDETME VE SİLME SİSTEMİ (YENİLENDİ 🚀)
     ========================================================================= */
  const handleToggleSave = async (whisperId: number) => {
    const isCurrentlySaved = savedWhisperIds.includes(whisperId);
    
    try {
      if (isCurrentlySaved) {
        // Alper'in DELETE /posts/:id/save endpoint'i
        const response = await axios.delete(`${API_BASE_URL}/posts/${whisperId}/save`, axiosConfig);
        if (response.status === 200 || response.status === 204) {
          setSavedWhisperIds(savedWhisperIds.filter(id => id !== whisperId));
        }
      } else {
        // Alper'in POST /posts/:id/save endpoint'i
        const response = await axios.post(`${API_BASE_URL}/posts/${whisperId}/save`, {}, axiosConfig);
        if (response.status === 200 || response.status === 201) {
          setSavedWhisperIds([...savedWhisperIds, whisperId]);
        }
      }
    } catch (error) {
      console.error("Kaydetme işlemi backend tarafında başarısız oldu:", error);
      alert("İşlem gerçekleştirilemedi.");
    }
  };

  const formatWhisperTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "Az önce";
    }
  };

  return (
    <div style={{ backgroundColor: '#FDFBF7', minHeight: '100vh', width: '100vw', color: '#1E1B4B', display: 'flex', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      <Sidebar />

      <div style={{ flex: 1, marginLeft: '260px', padding: '40px 32px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '32px', boxSizing: 'border-box' }}>
        
        {/* SOL TARAF: ANA AKIŞ */}
        <div style={{ flex: 1, maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px 24px', borderRadius: '20px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', textAlign: 'center' }}>
            <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 'bold', color: 'black' }}>Ana Akış</h2>
          </div>

          {loading && (
            <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '15px' }}>Fısıltılar getiriliyor...</p>
          )}

          {!loading && whispers.map((whisper) => {
            const isReported = reportedWhisperIds.includes(whisper.id);
            const isSaved = savedWhisperIds.includes(whisper.id);
            const displayedUsername = whisper.user?.username || `kullanici_${whisper.userId}`;
            const avatarLetter = displayedUsername.charAt(0).toUpperCase();

            return (
              <div key={whisper.id} style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '24px', border: '1px solid #E5E7EB', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FDFBF7', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: '#4F46E5', fontSize: '15px' }}>
                      {avatarLetter}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontWeight: 'bold', color: 'black', fontSize: '15px' }}>Fısıldayan</span>
                      <span style={{ color: '#6B7280', fontSize: '13px' }}>@{displayedUsername}</span>
                      <span style={{ color: '#9CA3AF', fontSize: '12px' }}>•</span>
                      <span style={{ color: '#6B7280', fontSize: '13px' }}>{formatWhisperTime(whisper.createdAt)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleSave(whisper.id)}
                    style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: '6px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.2s', color: isSaved ? '#4F46E5' : '#9CA3AF' }}
                    title={isSaved ? "Kaydetmeyi İptal Et" : "Fısıltıyı Kaydet"}
                  >
                    <FiBookmark style={{ fontSize: '18px', fill: isSaved ? '#4F46E5' : 'transparent' }} />
                  </button>
                </div>

                <p style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1E1B4B', lineHeight: '1.6', paddingLeft: '52px', textAlign: 'left' }}>
                  {whisper.content}
                </p>

                <div style={{ display: 'flex', justifyContent: 'end' }}>
                  <button
                    onClick={() => handleReport(whisper.id)}
                    disabled={isReported}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', border: 'none', backgroundColor: 'transparent', fontSize: '13px', fontWeight: 'bold', cursor: isReported ? 'not-allowed' : 'pointer', color: isReported ? '#EF4444' : '#9CA3AF', transition: 'color 0.2s', padding: '6px 12px', borderRadius: '8px' }}
                  >
                    <FiAlertTriangle style={{ fontSize: '14px' }} />
                    <span>{isReported ? 'Rapor Edildi' : 'Rapor Et'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* SAĞ TARAF: ÖNERİLER */}
        <div style={{ width: '320px', position: 'sticky', top: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '24px', border: '1px solid #E5E7EB', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)', textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', color: 'black' }}>Kimi Takip Etmeli?</h3>

            {suggestionsLoading ? (
              <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>Öneriler yükleniyor...</p>
            ) : suggestions.length === 0 ? (
              <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>Takip edilebilecek kimse kalmadı! ✨</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {suggestions.map((user) => {
                  const initialLetter = user.username.charAt(0).toUpperCase();
                  return (
                    <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FDFBF7', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '12px', color: '#4F46E5' }}>
                          {initialLetter}
                        </div>
                        <span style={{ fontWeight: '600', color: '#1E1B4B', fontSize: '14px' }}>@{user.username}</span>
                      </div>
                      <button onClick={() => handleFollowUser(user.id, user.username)} style={{ backgroundColor: '#1E1B4B', color: '#FFFFFF', border: 'none', padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4F46E5'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1E1B4B'}>
                        <FiUserPlus /> Takip Et
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}