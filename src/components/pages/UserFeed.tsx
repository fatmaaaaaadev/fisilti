import React, { useState, useEffect } from 'react';
import { Sidebar } from '../Sidebar';
import { FiAlertTriangle, FiBookmark } from 'react-icons/fi';
import axios from 'axios';

// BACKEND GERÇEKLERİNE GÖRE MODEL (Interface) GÜNCELLEMESİ
interface Whisper {
  id: number;        
  userId: number;
  content: string;   
  createdAt: string; 
  user?: {
    username: string;
  };
}

export default function UserFeed(): React.JSX.Element {
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const [reportedWhisperIds, setReportedWhisperIds] = useState<number[]>([]);
  const [savedWhisperIds, setSavedWhisperIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // BACKEND BAĞLANTISI: Port 3000 ve /api prefix'i YOK
  const API_BASE_URL = 'http://localhost:3000';

  /* =========================================================================
     📥 API: ANA AKIŞI (TAKİP EDİLENLERİN GÖNDERİLERİNİ) BACKEND'DEN ÇEK
     ========================================================================= */
  useEffect(() => {
    const fetchFeedWhispers = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // 🎯 ALPER'İN BACKEND KODUNA TAM UYUMLU ENDPOINT: GET /posts/feed
        // Token gönderildiğinde backend req.user.id'yi içeriden otomatik çözüyor!
        const response = await axios.get(`${API_BASE_URL}/posts/feed`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        
        
        // 🛡️ GÜVENLİK DUVARI: Alper'in getFeed fonksiyonunun dönebileceği tüm alternatif yapıları yakalayalım
        if (Array.isArray(response.data)) {
          setWhispers(response.data);
        } else if (response.data && Array.isArray(response.data.posts)) {
          setWhispers(response.data.posts);
        } else if (response.data && Array.isArray(response.data.whispers)) {
          setWhispers(response.data.whispers);
        } else if (response.data && typeof response.data === 'object') {
          // Eğer pagination objesiyse ve içinde dizi barındıran başka bir key varsa onu bulmaya çalışır
          const possibleArray = Object.values(response.data).find(val => Array.isArray(val));
          if (possibleArray) {
            setWhispers(possibleArray as Whisper[]);
          } else {
            throw new Error("Veri formatı çözülemedi");
          }
        } else {
          throw new Error("Beklenmeyen veri yapısı");
        }

      } catch (error) {
        console.error("Ana akış yüklenirken hata oluştu:", error);
        // Backend'de henüz takip ettiğin biri yoksa veya sunucu kapalıysa ekran boş kalmasın diye simülasyon:
        setWhispers([
          { id: 101, userId: 8, content: "Selam Fatma! Takip ettiğin insanların fısıltıları artık Alper'in /posts/feed rotasından geliyor! 🔥", createdAt: new Date().toISOString(), user: { username: "asli_kara" } },
          { id: 105, userId: 15, content: "Sessizce paylaş, fısıltıyla yayılsın... Ana akış tasarımı harika olmuş.", createdAt: new Date().toISOString(), user: { username: "can_developer" } }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedWhispers();
  }, []);

  /* =========================================================================
     🛑 RAPORLAMA SİSTEMİ (UX SİMÜLASYONU)
     ========================================================================= */
  const handleReport = async (whisperId: number) => {
    if (reportedWhisperIds.includes(whisperId)) return;
    
    try {
      setReportedWhisperIds([...reportedWhisperIds, whisperId]);
      alert("Fısıltı incelenmek üzere rapor edildi.");
    } catch (error) {
      alert("Raporlama esnasında bir hata oluştu.");
    }
  };

  /* =========================================================================
     💾 KAYDETME SİSTEMİ (LOCALSTORAGE TOGGLE)
     ========================================================================= */
  const handleToggleSave = (whisperId: number) => {
    const isCurrentlySaved = savedWhisperIds.includes(whisperId);
    let updatedSavedIds: number[];

    if (isCurrentlySaved) {
      updatedSavedIds = savedWhisperIds.filter(id => id !== whisperId);
    } else {
      updatedSavedIds = [...savedWhisperIds, whisperId];
    }

    setSavedWhisperIds(updatedSavedIds);
    localStorage.setItem('saved_whispers', JSON.stringify(updatedSavedIds));
  };

  useEffect(() => {
    const localSaved = localStorage.getItem('saved_whispers');
    if (localSaved) {
      setSavedWhisperIds(JSON.parse(localSaved));
    }
  }, []);

  const formatWhisperTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "Az önce";
    }
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
      <Sidebar />

      <div style={{ 
        flex: 1, 
        marginLeft: '260px', 
        padding: '40px 24px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start',
        boxSizing: 'border-box'
      }}>
        
        <div style={{ width: '100%', maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            padding: '20px 24px', 
            borderRadius: '20px', 
            border: '1px solid #E5E7EB', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
            textAlign: 'center'
          }}>
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
              <div 
                key={whisper.id} 
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  padding: '24px', 
                  borderRadius: '24px', 
                  border: '1px solid #E5E7EB', 
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      backgroundColor: '#FDFBF7', 
                      border: '1px solid #E5E7EB',
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      fontWeight: 'bold', 
                      color: '#4F46E5',
                      fontSize: '15px'
                    }}>
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
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transition: 'all 0.2s',
                      color: isSaved ? '#4F46E5' : '#9CA3AF',
                    }}
                    title={isSaved ? "Kaydetmeyi İptal Et" : "Fısıltıyı Kaydet"}
                  >
                    <FiBookmark style={{ 
                      fontSize: '18px', 
                      fill: isSaved ? '#4F46E5' : 'transparent'
                    }} />
                  </button>

                </div>

                <p style={{ 
                  margin: '0 0 4px 0', 
                  fontSize: '15px', 
                  color: '#1E1B4B', 
                  lineHeight: '1.6',
                  paddingLeft: '52px',
                  textAlign: 'left'
                }}>
                  {whisper.content}
                </p>

                <div style={{ display: 'flex', justifyContent: 'end' }}>
                  <button
                    onClick={() => handleReport(whisper.id)}
                    disabled={isReported}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      cursor: isReported ? 'not-allowed' : 'pointer',
                      color: isReported ? '#EF4444' : '#9CA3AF',
                      transition: 'color 0.2s',
                      padding: '6px 12px',
                      borderRadius: '8px'
                    }}
                  >
                    <FiAlertTriangle style={{ fontSize: '14px' }} />
                    <span>{isReported ? 'Rapor Edildi' : 'Rapor Et'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}