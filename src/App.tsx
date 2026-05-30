import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage'; 
import EmailVerification from './components/EmailVerification';
import UserFeed from './components/pages/UserFeed';
import { ProfilePage } from './components/pages/ProfilePage'; 
import AdminDashboard from './components/pages/AdminDashboard'; 

/* =========================================================================
   🛡️ 1. KAPICI (KORUYUCU): Sadece Giriş Yapmış Normal Kullanıcılar İçin
   ========================================================================= */
function UserRoute({ children }: { children: React.JSX.Element }): React.JSX.Element {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Token yoksa veya giriş yapan kişi admin ise buraya girmesin (Admin kendi paneline gitmeli)
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  
  if (role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

/* =========================================================================
   👑 2. KAPICI (KORUYUCU): Sadece Giriş Yapmış Adminler İçin
   ========================================================================= */
function AdminRoute({ children }: { children: React.JSX.Element }): React.JSX.Element {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Giriş yapılmadıysa veya rolü admin değilse, kaçak giriş denemesini engelle ve auth'a şutla!
  if (!token || role !== 'ADMIN') {
    alert("Bu sayfaya erişim yetkiniz bulunmamaktadır!");
    return <Navigate to="/auth" replace />;
  }

  return children;
}

/* =========================================================================
   🚀 ANA UYGULAMA BİLEŞENİ (APP)
   ========================================================================= */
export default function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 HERKESE AÇIK ROTAlAR */}
        {/* Giriş ve Kayıt Sayfası */}
        <Route path="/auth" element={<AuthPage />} />

        {/* E-posta Doğrulama Sayfası */}
        <Route path="/verify" element={<EmailVerification />} />


        {/* 🔒 KORUMALI KULLANICI ROTALARI (Giriş yapmayan veya admin olan giremez) */}
        <Route 
          path="/home" 
          element={
            <UserRoute>
              <UserFeed />
            </UserRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <UserRoute>
              <ProfilePage />
            </UserRoute>
          } 
        />


        {/* 👑 KORUMALI ADMİN ROTASI (Sadece rolü 'admin' olanlar girebilir) */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />


        {/* 🔄 GEÇERSİZ URL KORUMASI */}
        {/* Kullanıcı tanımlanmamış bir adrese ya da direkt boş siteye girerse otomatik olarak /auth sayfasına yönlendir */}
        <Route path="*" element={<Navigate to="/auth" replace />} />

      </Routes>
    </BrowserRouter>
  );
}