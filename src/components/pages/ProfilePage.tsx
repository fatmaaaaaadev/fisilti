import React, { useState } from 'react';
import { Sidebar } from '../Sidebar'; // Klasör yolunu projene göre kontrol etmeyi unutma
import { FiTrash2, FiPlus, FiX, FiSend, FiBookmark, FiUsers, FiLayers } from 'react-icons/fi';

interface Whisper {
  id: number;
  text: string;
  date: string;
}

export const ProfilePage: React.FC = () => {
  // 1. GÖNDERİLER: Başlangıç verileri
  const [whispers, setWhispers] = useState<Whisper[]>([
    { id: 1, text: "Yeni bir tasarım sistemi üzerinde çalışıyorum. Minimalizm, az ile çok şey anlatma sanatı.", date: "6 Mayıs 2026 14:10" },
    { id: 2, text: "Kitap önerisi: 'Sessizliğin Gücü'. Bir hafta sonu için biçilmiş kaftan.", date: "3 Mayıs 2026 20:48" },
    { id: 3, text: "Kahvenin yanına ne yakışır? Cevap: bir defter ve boş bir sayfa.", date: "29 Nisan 2026 09:15" }
  ]);

  // 2. SEKMELER: Profil içi alt sekmeler
  const [activeSubTab, setActiveSubTab] = useState<'posts' | 'following' | 'saved'>('posts');
  
  // 3. YENİ FISILTI MODALI: Durum kontrolleri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWhisperText, setNewWhisperText] = useState('');
  const maxCharacters = 240;

  // Yeni Fısıltı Ekleme
  const handleCreateWhisper = () => {
    if (newWhisperText.trim() === '') return;

    const now = new Date();
    const formattedDate = `${now.getDate()} Mayıs 2026 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newWhisper: Whisper = {
      id: Date.now(),
      text: newWhisperText,
      date: formattedDate
    };

    setWhispers([newWhisper, ...whispers]); 
    setNewWhisperText('');
    setIsModalOpen(false);
  };

  // Fısıltı Silme
  const handleDeleteWhisper = (id: number) => {
    setWhispers(whispers.filter(w => w.id !== id));
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#FDFBF7', minHeight: '100vh', 
      width: '100vw',  }}>
      
      {/* SOL TARAF: Sabit Sidebar
        TypeScript hatasını çözmek için beklediği propları gönderiyoruz.
        NOT: Eğer senin Sidebar dosyan "profile" yerine büyük harfle "Profilim" 
        veya başka bir string bekliyorsa, currentTab="profile" kısmını ona göre değiştirebilirsin.
      */}
      <Sidebar 
        currentTab="profile" 
        setCurrentTab={(tab: any) => console.log("Sekme değiştirildi:", tab)} 
      />

      {/* SAĞ TARAF: Profil İçeriği (Yenilenen Açık Tema) */}
      <div style={{
        flex: 1,
        marginLeft: '260px',
        color: '#1E1B4B', 
        padding: '40px',
        fontFamily: 'sans-serif',
        position: 'relative',
        boxSizing: 'border-box'
      }}>
        
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          {/* PROFİL ÜST BİLGİ ALANI */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
            {/* Profil Fotoğrafı */}
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#4F46E5',
              border: '3px solid #4F46E5',
              boxShadow: '0px 4px 12px rgba(91, 192, 190, 0.2)'
            }}>
              EY
            </div>
            
            {/* İsim ve Biyografi */}
            <div>
              <h2 style={{ fontSize: '26px', margin: 0, textAlign: "left", fontWeight: 'bold', color: '#1E1B4B' }}>Elif Yılmaz</h2>
              <p style={{ color: '#6B7280', margin: '4px 0 12px 0', textAlign: "left", fontWeight: '500' }}>@elifyilmaz</p>
              <p style={{ color: '#4B5563', fontSize: '15px', margin: 0, lineHeight: '1.5' }}>
                Tasarımcı, gezgin, kahve tutkunu. Düşüncelerimi buraya fısıldıyorum.
              </p>
            </div>
          </div>

          {/* İSTATİSTİKLER VE İNTERAKTİF SEKMELER */}
          <div style={{ 
            display: 'flex', 
            gap: '40px', 
            borderBottom: '2px solid #E5E7EB', 
            paddingBottom: '16px',
            marginBottom: '24px'
          }}>
            {/* Fısıltı Sayısı Sekmesi */}
            <div 
              onClick={() => setActiveSubTab('posts')}
              style={{ cursor: 'pointer', transition: '0.2s' }}
            >
              <span style={{ fontWeight: 'bold', fontSize: '15px', color: activeSubTab === 'posts' ? '#1E1B4B' : '#64748B' }}>{whispers.length} fısıltı</span>
            </div>

            {/* Takip Edilenler Sekmesi */}
            <div 
              onClick={() => setActiveSubTab('following')}
              style={{ cursor: 'pointer', transition: '0.2s' }}
            >
              <span style={{ fontWeight: 'bold', fontSize: '15px', color: activeSubTab === 'following' ? '#1E1B4B' : '#64748B' }}>312 takip edilen</span>
              
            </div>

            {/* Kaydedilenler Sekmesi */}
            <div 
              onClick={() => setActiveSubTab('saved')}
              style={{ cursor: 'pointer', transition: '0.2s' }}
            >
              <span style={{ fontWeight: 'bold', fontSize: '15px', color: activeSubTab === 'saved' ? '#1E1B4B' : '#64748B' }}>Kaydedilenler</span>
            </div>
          </div>

          {/* DİNAMİK BAŞLIK */}
          <h3 style={{ 
            fontSize: '13px', 
            color: '#6B7280', 
            letterSpacing: '1px', 
            textTransform: 'uppercase',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 'bold'
          }}>
            {activeSubTab === 'posts' && <><FiLayers style={{ color: '#5bc0be' }} /> Gönderiler</>}
            {activeSubTab === 'following' && <><FiUsers style={{ color: '#5bc0be' }} /> Takip Edilenler</>}
            {activeSubTab === 'saved' && <><FiBookmark style={{ color: '#5bc0be' }} /> Kaydedilenler</>}
          </h3>

          {/* İÇERİK LİSTESİ */}
          {activeSubTab === 'posts' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {whispers.map(whisper => (
                <div key={whisper.id} style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)'
                }}>
                  <p style={{ margin: '0 0 20px 0', fontSize: '16px', textAlign:"left", lineHeight: '1.6', color: '#1F2937' }}>
                    {whisper.text}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#9CA3AF', fontSize: '13px', fontWeight: '500' }}>{whisper.date}</span>
                    <button 
                      onClick={() => handleDeleteWhisper(whisper.id)}
                      style={{
                        background: 'none', border: 'none', color: '#EF4444',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px',
                        borderRadius: '50%', transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <FiTrash2 style={{ fontSize: '18px' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', border: '1px solid #E5E7EB', color: '#6B7280', textAlign: 'center', boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)' }}>
              Henüz burada bir fısıltı yok.
            </div>
          )}
        </div>

        {/* SAĞ ALT: CANLI TURKUAZ YÜZEN ARTI (+) BUTONU */}
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            position: 'fixed', bottom: '40px', right: '40px',
            width: '60px', height: '60px', borderRadius: '50%',
            backgroundImage: 'linear-gradient(to bottom right, #5bc0be, #4F46E5)',
            border: 'none', color: '#FFFFFF',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            cursor: 'pointer', boxShadow: '0px 6px 20px rgba(79, 70, 229, 0.3)',
            transition: 'transform 0.2s, boxShadow 0.2s', zIndex: 99
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = '0px 8px 24px rgba(79, 70, 229, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0px 6px 20px rgba(79, 70, 229, 0.3)';
          }}
        >
          <FiPlus style={{ fontSize: '28px' }} />
        </button>

        {/* MODAL PENCERESİ */}
        {isModalOpen && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.3)', 
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
            backdropFilter: 'blur(4px)' 
          }}>
            <div style={{
              backgroundColor: '#FFFFFF', width: '500px', borderRadius: '20px',
              padding: '24px', border: '1px solid #E5E7EB', position: 'relative',
              boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
              >
                <FiX style={{ fontSize: '20px' }} />
              </button>

              <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 'bold', color: '#1E1B4B' }}>Yeni Fısıltı</h3>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: '#4F46E5' }}>
                  S
                </div>
                <div style={{ flex: 1 }}>
                  <textarea
                    placeholder="Neler fısıldamak istersin?"
                    value={newWhisperText}
                    onChange={(e) => setNewWhisperText(e.target.value.slice(0, maxCharacters))}
                    style={{
                      width: '100%', height: '100px', backgroundColor: 'transparent', border: 'none',
                      outline: 'none', color: '#1F2937', fontSize: '16px', resize: 'none', fontFamily: 'sans-serif',
                      lineHeight: '1.5'
                    }}
                  />
                  <hr style={{ borderColor: '#F3F4F6', margin: '16px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#9CA3AF', fontSize: '14px', fontWeight: '500' }}>{maxCharacters - newWhisperText.length} karakter kaldı</span>
                    <button
                      onClick={handleCreateWhisper}
                      style={{ 
                        backgroundImage: 'linear-gradient(to right, #5bc0be, #4F46E5)', 
                        color: 'white', border: 'none', padding: '10px 24px', 
                        borderRadius: '30px', fontWeight: 'bold', display: 'flex', 
                        alignItems: 'center', gap: '8px', cursor: 'pointer',
                        boxShadow: '0px 4px 12px rgba(79, 70, 229, 0.2)'
                      }}
                    >
                      <FiSend /> Fısılda
                    </button>
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