import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage'; // Dosya yollarını projene göre ayarla
import  EmailVerification  from './components/EmailVerification';
import UserFeed from './components/pages/UserFeed';
import { ProfilePage } from './components/pages/ProfilePage'; // Yeni ekledik
import AdminDashboard from './components/pages/AdminDashboard'; // Yeni eklediğimiz admin sayfasını import ettik

export default function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        {/* Giriş ve Kayıt Sayfası -> fısıltı.com/auth adresinde çalışacak */}
        <Route path="/auth" element={<AuthPage />} />

        {/* E-posta Doğrulama Sayfası -> fısıltı.com/verify adresinde çalışacak */}
        <Route path="/verify" element={<EmailVerification />} />

        {/* Kullanıcı direkt boş siteye girerse (fısıltı.com) otomatik olarak /auth sayfasına yönlendir */}
        <Route path="*" element={<Navigate to="/auth" replace />} />

        <Route path="/home" element={<UserFeed />} />

        {/* YENİ: Profil Sayfası (Bu da kendi içinde sidebar'ı çağıracak) */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* 🛠️ YENİ EKLEDİĞİMİZ ADMİN ROTASI */}
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}