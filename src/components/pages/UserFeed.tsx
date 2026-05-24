import { useState } from 'react';
import { Sidebar } from '../Sidebar';
import { FiAlertTriangle, FiBookmark } from 'react-icons/fi';

interface Whispers {
  id: number;
  name: string;
  username: string;
  avatarLetter: string;
  time: string;
  content: string;
}

export default function UserFeed(): React.JSX.Element {
  // Gereksiz olan currentTab state'ini buradan tamamen kaldırdık!
  const [reportedWhisperIds, setReportedWhisperIds] = useState<number[]>([]);
  
  // Kaydedilen fısıltıların ID'lerini tutan state dizisi
  const [savedWhisperIds, setSavedWhisperIds] = useState<number[]>([]);

  const whispers: Whispers[] = [
    {
      id: 1,
      name: "Ela Yıldız",
      username: "@elayildiz",
      avatarLetter: "E",
      time: "2 dk önce",
      content: "Sabahın ilk kahvesi her şeye değer. ☕ Bugün küçük şeylerin tadını çıkaralım."
    },
    {
      id: 2,
      name: "Mert Kaya",
      username: "@mertk",
      avatarLetter: "M",
      time: "18 dk önce",
      content: "Yeni bir şey öğrenmenin en güzel yanı, dünyaya bambaşka bir gözle bakmaya başlamak."
    },
    {
      id: 3,
      name: "Zeynep Demir",
      username: "@zeyn",
      avatarLetter: "Z",
      time: "1 sa önce",
      content: "Fısıltı'yı yeni keşfettim ve buradaki sakinlik çok hoşuma gitti. 🌙"
    }
  ];

  // Raporlama Sistemi (Tek tık kuralı)
  const handleReport = (whisperId: number) => {
    if (reportedWhisperIds.includes(whisperId)) return;
    setReportedWhisperIds([...reportedWhisperIds, whisperId]);
  };

  // Kaydetme Sistemi (Aç / Kapat - Toggle mantığı)
  const handleToggleSave = (whisperId: number) => {
    if (savedWhisperIds.includes(whisperId)) {
      setSavedWhisperIds(savedWhisperIds.filter(id => id !== whisperId));
    } else {
      setSavedWhisperIds([...savedWhisperIds, whisperId]);
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
      {/* Sol Menü: Artık proplardan bağımsız, URL'e göre çalışan akıllı Sidebar */}
      <Sidebar />

      {/* Sağ Ana İçerik Alanı */}
      <div style={{ 
        flex: 1, 
        marginLeft: '260px', 
        padding: '40px 24px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start',
        boxSizing: 'border-box'
      }}>
        
        {/* Koşullu kontrolü kaldırıp doğrudan Ana Akış arayüzünü yerleştirdik */}
        <div style={{ width: '100%', maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Üst Başlık Kartı */}
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

          {/* Fısıltı Kartları */}
          {whispers.map((whisper) => {
            const isReported = reportedWhisperIds.includes(whisper.id);
            const isSaved = savedWhisperIds.includes(whisper.id);

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
                {/* Üst Kısım: Profil ve Sağ Üst Kaydet Butonu */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  
                  {/* Sol taraf: Profil Resmi ve İsimler */}
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
                      {whisper.avatarLetter}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontWeight: 'bold', color: 'black', fontSize: '15px' }}>{whisper.name}</span>
                      <span style={{ color: '#6B7280', fontSize: '13px' }}>{whisper.username}</span>
                      <span style={{ color: '#9CA3AF', fontSize: '12px' }}>•</span>
                      <span style={{ color: '#6B7280', fontSize: '13px' }}>{whisper.time}</span>
                    </div>
                  </div>

                  {/* Sağ Taraf: SAĞ ÜST KAYDETME BUTONU */}
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

                {/* Fısıltı İçeriği */}
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

                {/* Sağ Alt Köşe: Rapor Et Butonu */}
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