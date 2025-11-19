import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Outlet } from "react-router-dom";
import SplashScreen from "./SplashScreen";
import RoleLogin from "./RoleLogin";
import LoginPage from "./pages/Login";
import Sidebar from "./Sidebar";
import ContractorDashboard from "./ContractorDashboard";
import ProjectCard from "./ProjectCard";
import LandingPage from "./LandingPageNew";
import ProjectDetailsPage from "./ProjectDetailsPage";
import ContractorsPage from "./pages/ContractorsNew";
import ContractorDetailsPage from "./pages/ContractorDetailsPage";
import TrainingPage from "./pages/TrainingPage";
import TrainingRegistrationPage from "./pages/TrainingRegistrationPage";
import TrainersPage from "./pages/TrainersPage";
import ConsultingPage from "./pages/ConsultingPage";
import ConsultingRequestPage from "./pages/ConsultingRequestPage";
import ProjectsPage from "./pages/ProjectsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import { NotificationProvider } from "./components/NotificationSystem";
import ProtectedRoute from "./components/ProtectedRoute";

// Contractor Pages
import AddProjectAndRequests from "./pages/contractor/AddProjectAndRequests";
import ProjectsList from "./pages/contractor/ProjectsList";
import InventoryMaterials from "./pages/contractor/InventoryMaterials";
import PurchasesAndIssue from "./pages/contractor/PurchasesAndIssue";
import ClientsAndContractors from "./pages/contractor/ClientsAndContractors";
import ContractsAndSupplies from "./pages/contractor/ContractsAndSupplies";
import SuppliersAndPayments from "./pages/contractor/SuppliersAndPayments";
import ReportsAndInvoices from "./pages/contractor/ReportsAndInvoices";
import ContractorProfile from "./pages/contractor/ContractorProfile";

// Client Pages
import ClientProfile from "./pages/client/ClientProfile";
import ClientProjects from "./pages/client/ClientProjects";
import ClientAddProject from "./pages/client/ClientAddProject";
import ClientRequests from "./pages/client/ClientRequests";

// Public Pages
import PublicProjectsPage from "./pages/public/ProjectsPage";
import TestimonialsPage from "./pages/public/TestimonialsPage";
import FAQPage from "./pages/public/FAQPage";
import HowItWorksPage from "./pages/public/HowItWorksPage";

// Auth Pages
import ResetPassword from "./pages/auth/ResetPassword";

import logo from "./assets/images/logo-future.jpeg";
import splashBg from "./55.jpeg";

const demoProjects = [
  { id: 1, name: 'فيلا حديثة في الرياض', description: 'تم إنجاز فيلا بتصميم عصري مع مسبح وحدائق خارجية.', imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80', category: 'سكني' },
  { id: 2, name: 'تطوير واجهة برج تجاري', description: 'تجديد كامل لواجهة برج مكتبي باستخدام أحدث المواد المقاومة للعوامل الجوية.', imageUrl: 'https://images.unsplash.com/photo-1599493345499-52d3a37210e3?auto=format&fit=crop&w=400&q=80', category: 'تجاري' },
  { id: 3, name: 'مجمع فلل سكنية', description: 'بناء مجمع سكني متكامل يضم 12 فيلا مع مرافق مشتركة.', imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80', category: 'سكني' }
];

function ShowcasePage() {
  const BRAND = {
    primary: '#4caf50',
    accent: '#66bb6a',
    gradient: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
    light: '#f8fafc',
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
        .project-card-wrapper {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
      
      <div style={{ textAlign: 'center', marginBottom: 50 }}>
        <div style={{ width: 80, height: 5, background: BRAND.gradient, margin: '0 auto 20px', borderRadius: 3 }} />
        <h2 style={{ fontWeight: 900, color: BRAND.primary, fontSize: 38, marginBottom: 12, letterSpacing: '-1px' }}>
          معرض أعمالنا المنجزة
        </h2>
        <p style={{ color: '#64748b', fontSize: 17, maxWidth: 600, margin: '0 auto' }}>
          استعرض مجموعة مختارة من مشاريعنا الناجحة والمكتملة بجودة عالية
        </p>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '28px',
        padding: '20px 0'
      }}>
        {demoProjects.map((project, index) => (
          <div key={project.id} className="project-card-wrapper" style={{ animationDelay: `${index * 0.1}s` }}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
      
      {demoProjects.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: BRAND.light,
          borderRadius: 16,
          marginTop: 40
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <p style={{ color: '#64748b', fontSize: 16 }}>لا توجد مشاريع لعرضها حالياً</p>
        </div>
      )}
    </div>
  );
}

function ProfilePage() {
  const BRAND = {
    primary: '#4caf50',
    accent: '#66bb6a',
    secondary: '#388e3c',
    gradient: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
    gradientLight: 'linear-gradient(135deg, #388e3c 0%, #4caf50 50%, #66bb6a 100%)',
    light: '#f8fafc',
    dark: '#2e7d32',
    muted: '#6c757d',
    white: '#ffffff',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e8f5e9 100%)',
      padding: '40px 20px',
      direction: 'rtl'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        background: BRAND.white,
        borderRadius: 20,
        boxShadow: '0 8px 30px rgba(76, 175, 80, 0.15)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: BRAND.gradient,
          padding: '40px',
          textAlign: 'center',
          color: BRAND.white
        }}>
          <div style={{
            width: 120,
            height: 120,
            margin: '0 auto 20px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            border: '4px solid rgba(255, 255, 255, 0.3)'
          }}>
            👤
          </div>
          <h1 style={{
            fontSize: 32,
            fontWeight: 700,
            margin: 0,
            marginBottom: 10,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
          }}>
            صفحتك الشخصية
          </h1>
          <p style={{
            fontSize: 16,
            opacity: 0.9,
            margin: 0
          }}>
            إدارة معلوماتك الشخصية وإعدادات الحساب
          </p>
        </div>

        {/* Content */}
        <div style={{
          padding: '40px'
        }}>
          <div style={{
            background: BRAND.light,
            borderRadius: 16,
            padding: '30px',
            marginBottom: 20,
            border: `2px solid ${BRAND.primary}20`
          }}>
            <h2 style={{
              color: BRAND.primary,
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <span>ℹ️</span> معلومات الحساب
            </h2>
            <p style={{
              color: BRAND.muted,
              fontSize: 16,
              lineHeight: 1.8,
              margin: 0
            }}>
              يمكنك الوصول إلى صفحة الملف الشخصي الكاملة من القائمة الجانبية.
              <br />
              <strong style={{ color: BRAND.primary }}>
                للعملاء: </strong>انتقل إلى <strong style={{ color: BRAND.secondary }}>/client/profile</strong>
              <br />
              <strong style={{ color: BRAND.primary }}>
                للمقاولين: </strong>انتقل إلى <strong style={{ color: BRAND.secondary }}>/contractor/profile</strong>
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 20,
            marginTop: 30
          }}>
            <div style={{
              background: BRAND.gradientLight,
              borderRadius: 12,
              padding: '20px',
              textAlign: 'center',
              color: BRAND.white
            }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📊</div>
              <h3 style={{ margin: 0, marginBottom: 8, fontSize: 18 }}>المشاريع</h3>
              <p style={{ margin: 0, opacity: 0.9, fontSize: 14 }}>إدارة مشاريعك</p>
            </div>

            <div style={{
              background: BRAND.gradient,
              borderRadius: 12,
              padding: '20px',
              textAlign: 'center',
              color: BRAND.white
            }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>⚙️</div>
              <h3 style={{ margin: 0, marginBottom: 8, fontSize: 18 }}>الإعدادات</h3>
              <p style={{ margin: 0, opacity: 0.9, fontSize: 14 }}>تخصيص حسابك</p>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${BRAND.secondary} 0%, ${BRAND.primary} 100%)`,
              borderRadius: 12,
              padding: '20px',
              textAlign: 'center',
              color: BRAND.white
            }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🔒</div>
              <h3 style={{ margin: 0, marginBottom: 8, fontSize: 18 }}>الأمان</h3>
              <p style={{ margin: 0, opacity: 0.9, fontSize: 14 }}>حماية حسابك</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleCallbackHandler() {
  const navigate = useNavigate();
  const [searchParams] = React.useState(() => new URLSearchParams(window.location.search));
  
  React.useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const role = localStorage.getItem('selectedRole') || 'client';
    
    if (error) {
      alert(`❌ فشل تسجيل الدخول عبر Google: ${error}`);
      navigate('/login');
      return;
    }
    
    if (code) {
      // Exchange code for token
      const handleGoogleCallback = async () => {
        try {
          const { authAPI, setToken, setUser } = await import('./utils/api');
          const response = await authAPI.googleCallback(code, role === 'مقاول' ? 'contractor' : 'client');
          
          setToken(response.token);
          setUser(response.user);
          
          // Navigate based on role
          if (response.user.role === 'contractor') {
            navigate('/contractor');
          } else {
            navigate('/client/profile');
          }
        } catch (error) {
          console.error('Google callback error:', error);
          console.error('Error details:', error.details);
          console.error('Error hint:', error.hint);
          
          let errorMessage = error.message || 'فشل تسجيل الدخول عبر Google';
          
          // Show more detailed error if available
          if (error.hint) {
            errorMessage = error.hint;
          } else if (error.details) {
            if (error.details.error === 'redirect_uri_mismatch') {
              errorMessage = `خطأ: Redirect URI غير متطابق.\n\nالمتوقع: ${error.redirectUri || 'http://localhost:3000/auth/google/callback'}\n\nيرجى التأكد من إضافة هذا الرابط بالضبط في Google Cloud Console → Authorized redirect URIs`;
            } else if (error.details.error === 'invalid_client') {
              errorMessage = 'خطأ: Client ID أو Client Secret غير صحيح.\n\nيرجى التحقق من ملف .env في مجلد server/';
            } else if (error.details.error === 'invalid_grant') {
              errorMessage = 'انتهت صلاحية رمز المصادقة.\n\nيرجى المحاولة مرة أخرى.';
            } else if (error.details.error_description) {
              errorMessage = `خطأ: ${error.details.error_description}`;
            } else if (error.details.error) {
              errorMessage = `خطأ: ${error.details.error}`;
            }
          }
          
          alert(`❌ ${errorMessage}`);
          navigate('/login');
        }
      };
      
      handleGoogleCallback();
    } else {
      navigate('/login');
    }
  }, [navigate, searchParams]);
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 40%, #0ea5e9 100%)'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 24,
        padding: 48,
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ fontSize: 48, marginBottom: 24 }}>⏳</div>
        <h2 style={{ color: '#1d4ed8', marginBottom: 16 }}>جاري تسجيل الدخول...</h2>
        <p style={{ color: '#64748b' }}>يرجى الانتظار</p>
      </div>
    </div>
  );
}

function AuthRouter() {
  const [showSplash, setShowSplash] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return showSplash ? (
    <SplashScreen logo={logo} splashBg={splashBg} onFinish={() => setShowSplash(false)} />
  ) : (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 40%, #0ea5e9 100%)'
    }}>
      {/* Unified Background Effects */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(37, 99, 235, 0.28) 0%, transparent 55%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 80% 80%, rgba(14, 165, 233, 0.26) 0%, transparent 55%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Main Container - Centered */}
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '40px 20px' : '60px 40px',
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh'
      }}>
        {/* Login Form - Centered */}
        <div style={{
          width: '100%',
          maxWidth: 500,
          position: 'relative',
          zIndex: 1
        }}>
          <RoleLogin 
            onLogin={(role, email, password)=>{ 
              if(role==="مقاول") {
                navigate("/contractor");
              } else if(role==="عميل") {
                navigate("/client/profile");
              } else {
                alert(`تم تسجيل الدخول (${role})!`);
              }
            }} 
            onGuest={()=>navigate("/showcase")} 
          />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'fixed',
        bottom: 16,
        width: '100%',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 13,
        fontWeight: 500,
        zIndex: 10,
        pointerEvents: 'none',
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
      }}>
        كل الحقوق محفوظة © {new Date().getFullYear()} – إدارة المقاولات
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}

function MainLayout() {
  return (
    <div style={{ background: "#f8fafc", direction: 'rtl' }}>
      <style>{`
        @media (max-width: 768px) {
          main {
            padding: 12px !important;
            padding-top: 70px !important;
          }
        }
      `}</style>
      <Sidebar />
      <main style={{ padding: '20px', paddingTop: '80px', minHeight: '100vh', width: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
        {/* Landing */}
        <Route path="/" element={<LandingPage />} />
        {/* Login */}
        <Route path="/login" element={<LoginPage />} />
        {/* Reset Password */}
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Google OAuth Callback */}
        <Route path="/auth/google/callback" element={<GoogleCallbackHandler />} />
        {/* Public Pages */}
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/contractors" element={<ContractorsPage />} />
        <Route path="/contractors/:id" element={<ContractorDetailsPage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/training/register" element={<TrainingRegistrationPage />} />
        <Route path="/trainers" element={<TrainersPage />} />
        <Route path="/consulting" element={<ConsultingPage />} />
        <Route path="/consulting/request" element={<ConsultingRequestPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* App layout */}
        <Route element={<MainLayout />}>
          {/* Public/Showcase */}
          <Route path="/showcase" element={<ShowcasePage />} />
          <Route path="/project/:id" element={<ProjectDetailsPage />} />
          
          {/* Contractor Routes - Protected */}
          <Route path="/contractor" element={
            <ProtectedRoute allowedRoles="contractor">
              <ContractorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/contractor/projects/add" element={
            <ProtectedRoute allowedRoles="contractor">
              <AddProjectAndRequests />
            </ProtectedRoute>
          } />
          <Route path="/contractor/projects/list" element={
            <ProtectedRoute allowedRoles="contractor">
              <ProjectsList />
            </ProtectedRoute>
          } />
          <Route path="/contractor/inventory" element={
            <ProtectedRoute allowedRoles="contractor">
              <InventoryMaterials />
            </ProtectedRoute>
          } />
          <Route path="/contractor/purchases-issue" element={
            <ProtectedRoute allowedRoles="contractor">
              <PurchasesAndIssue />
            </ProtectedRoute>
          } />
          <Route path="/contractor/clients-contractors" element={
            <ProtectedRoute allowedRoles="contractor">
              <ClientsAndContractors />
            </ProtectedRoute>
          } />
          <Route path="/contractor/contracts-supplies" element={
            <ProtectedRoute allowedRoles="contractor">
              <ContractsAndSupplies />
            </ProtectedRoute>
          } />
          <Route path="/contractor/suppliers-payments" element={
            <ProtectedRoute allowedRoles="contractor">
              <SuppliersAndPayments />
            </ProtectedRoute>
          } />
          <Route path="/contractor/reports-invoices" element={
            <ProtectedRoute allowedRoles="contractor">
              <ReportsAndInvoices />
            </ProtectedRoute>
          } />
          <Route path="/contractor/profile" element={
            <ProtectedRoute allowedRoles="contractor">
              <ContractorProfile />
            </ProtectedRoute>
          } />
          
          {/* Client Routes - Protected */}
          <Route path="/client/profile" element={
            <ProtectedRoute allowedRoles="client">
              <ClientProfile />
            </ProtectedRoute>
          } />
          <Route path="/client/projects" element={
            <ProtectedRoute allowedRoles="client">
              <ClientProjects />
            </ProtectedRoute>
          } />
          <Route path="/client/projects/add" element={
            <ProtectedRoute allowedRoles="client">
              <ClientAddProject />
            </ProtectedRoute>
          } />
          <Route path="/client/requests" element={
            <ProtectedRoute allowedRoles="client">
              <ClientRequests />
            </ProtectedRoute>
          } />
          
          {/* Legacy/Deprecated - Protected for authenticated users */}
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['client', 'contractor']}>
              <ProfilePage />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
    </NotificationProvider>
  );
}