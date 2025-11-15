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
import TrainingPage from "./pages/TrainingPage";
import ConsultingPage from "./pages/ConsultingPage";
import ProjectsPage from "./pages/ProjectsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import { NotificationProvider } from "./components/NotificationSystem";

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

import logo from "./company-logo.jpeg";
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

function ProfilePage() { return <div style={{padding:'20px'}}><h2>صفحتك الشخصية</h2><p>سيتم بناء هذه الصفحة لاحقًا.</p></div>; }

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
      background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 50%, #81c784 100%)'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 24,
        padding: 48,
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ fontSize: 48, marginBottom: 24 }}>⏳</div>
        <h2 style={{ color: '#4caf50', marginBottom: 16 }}>جاري تسجيل الدخول...</h2>
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
      background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 50%, #81c784 100%)'
    }}>
      {/* Unified Background Effects */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(102, 187, 106, 0.25) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 80% 80%, rgba(76, 175, 80, 0.2) 0%, transparent 50%)',
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
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/consulting" element={<ConsultingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* App layout */}
        <Route element={<MainLayout />}>
          {/* Public/Showcase */}
          <Route path="/showcase" element={<ShowcasePage />} />
          <Route path="/project/:id" element={<ProjectDetailsPage />} />
          
          {/* Contractor Routes */}
          <Route path="/contractor" element={<ContractorDashboard />} />
          <Route path="/contractor/projects/add" element={<AddProjectAndRequests />} />
          <Route path="/contractor/projects/list" element={<ProjectsList />} />
          <Route path="/contractor/inventory" element={<InventoryMaterials />} />
          <Route path="/contractor/purchases-issue" element={<PurchasesAndIssue />} />
          <Route path="/contractor/clients-contractors" element={<ClientsAndContractors />} />
          <Route path="/contractor/contracts-supplies" element={<ContractsAndSupplies />} />
          <Route path="/contractor/suppliers-payments" element={<SuppliersAndPayments />} />
          <Route path="/contractor/reports-invoices" element={<ReportsAndInvoices />} />
          <Route path="/contractor/profile" element={<ContractorProfile />} />
          
          {/* Client Routes */}
          <Route path="/client/profile" element={<ClientProfile />} />
          <Route path="/client/projects" element={<ClientProjects />} />
          <Route path="/client/projects/add" element={<ClientAddProject />} />
          <Route path="/client/requests" element={<ClientRequests />} />
          
          {/* Legacy/Deprecated */}
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </NotificationProvider>
  );
}