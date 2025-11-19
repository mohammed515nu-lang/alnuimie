import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "./company-logo.jpeg";

const BRAND = {
  primary: '#e5e7eb',
  accent: '#C26B3A',
  secondary: '#9ca3af',
  gradient: 'linear-gradient(145deg, #060B1B 0%, #111827 45%, #1f2937 100%)',
  gradientLight: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(31,41,55,1) 100%)',
  light: '#111827',
  dark: '#020617',
  muted: '#6b7280',
};

const baseMenu = [
  { to: "/showcase", label: "الأعمال المنجزة", icon: "📋" },
  { to: "/login", label: "تسجيل الدخول", icon: "🔑" },
];

const contractorMenu = [
  { to: "/contractor", label: "الصفحة الرئيسية", icon: "🏠" },
  { to: "/contractor/projects/add", label: "إضافة مشروع + طلبات العملاء", icon: "➕" },
  { to: "/contractor/projects/list", label: "المشاريع", icon: "📋" },
  { to: "/contractor/inventory", label: "المخازن والمواد", icon: "📦" },
  { to: "/contractor/purchases-issue", label: "مشتريات وصرف المواد", icon: "🛒" },
  { to: "/contractor/clients-contractors", label: "العملاء والمتعاقدون", icon: "🤝" },
  { to: "/contractor/contracts-supplies", label: "التعاقدات والتوريدات", icon: "📝" },
  { to: "/contractor/suppliers-payments", label: "الموردون والسداد", icon: "💰" },
  { to: "/contractor/reports-invoices", label: "التقارير والفواتير", icon: "📊" },
  { to: "/contractor/profile", label: "الملف الشخصي", icon: "👤" },
];

const clientMenu = [
  { to: "/client/profile", label: "الملف الشخصي", icon: "👤" },
  { to: "/client/projects", label: "استعراض المشاريع", icon: "👀" },
  { to: "/client/projects/add", label: "إضافة مشروع", icon: "📝" },
  { to: "/client/requests", label: "طلباتي", icon: "✉️" },
];

export default function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const isContractor = location.pathname.startsWith('/contractor');
  const isClient = location.pathname.startsWith('/client');
  const menu = isClient ? clientMenu : isContractor ? contractorMenu : baseMenu;
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarContent = (
    <>
      <div style={{
        width: 80,
        height: 80,
        background: BRAND.gradientLight,
        borderRadius: 24,
        overflow: 'hidden',
        margin: '32px 0 16px',
        boxShadow: '0 14px 40px rgba(15,23,42,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid rgba(148,163,184,0.45)'
      }}>
        <img src={logo} alt="الشعار" style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
      </div>
      <div style={{
        fontWeight: 900,
        fontSize: 19,
        letterSpacing: '-0.5px',
        marginBottom: 32,
        color: '#fff',
        userSelect: 'none',
        textAlign: 'center'
      }}>
        شركة المقاولات
      </div>
      <nav style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '92%',
        alignItems: 'center',
        marginTop: 10
      }}>
        {menu.map((item) => {
          const isActive = location.pathname === item.to || 
            (item.to !== '/contractor' && item.to !== '/client/profile' && 
             item.to !== '/client/projects' && item.to !== '/showcase' && 
             location.pathname.startsWith(item.to + '/'));
          return (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setOpen(false)}
              style={{
                textDecoration: 'none',
                color: isActive ? '#f9fafb' : 'rgba(229,231,235,0.8)',
                padding: '14px 16px',
                borderRadius: 14,
                background: isActive
                  ? 'linear-gradient(135deg, rgba(148,163,184,0.18), rgba(15,23,42,0.95))'
                  : 'rgba(15,23,42,0.85)',
                fontWeight: 700,
                fontSize: 15,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isActive
                  ? '0 18px 40px rgba(0,0,0,0.7)'
                  : '0 8px 24px rgba(0,0,0,0.55)',
                position: 'relative',
                border: isActive ? '1px solid rgba(249,250,251,0.45)' : '1px solid rgba(15,23,42,0.9)'
              }}
              onMouseOver={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(15,23,42,0.98)';
                  e.currentTarget.style.transform = 'translateX(-4px)';
                  e.currentTarget.style.color = '#f9fafb';
                }
              }}
              onMouseOut={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(15,23,42,0.85)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.color = 'rgba(229,231,235,0.8)';
                }
              }}
            >
              <span style={{
                fontSize: 22,
                width: 28,
                textAlign: 'center',
                display: 'inline-block'
              }}>
                {item.icon}
              </span>
              <span style={{ flex: 1, lineHeight: 1.3 }}>{item.label}</span>
              {isActive && (
                <div style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 0 8px rgba(255,255,255,0.8)'
                }} />
              )}
            </Link>
          );
        })}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.15)',
          width: '100%',
          margin: '20px 0 12px'
        }} />
        <Link
          to="/"
          onClick={() => setOpen(false)}
          style={{
            textDecoration: 'none',
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 700,
            fontSize: 15,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 16px',
            borderRadius: 14,
            transition: 'all 0.3s ease',
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(220,38,38,0.1)'
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = 'rgba(220,38,38,0.2)';
            e.currentTarget.style.transform = 'translateX(-4px)';
            e.currentTarget.style.borderColor = 'rgba(220,38,38,0.4)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'rgba(220,38,38,0.1)';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          }}
        >
          <span style={{ fontSize: 20 }}>🚪</span>
          <span style={{ flex: 1 }}>تسجيل الخروج</span>
        </Link>
      </nav>
      <div style={{ flex: 1 }} />
      <div style={{
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 16,
        textAlign: 'center',
        padding: '0 12px'
      }}>
        &copy; {new Date().getFullYear()} جميع الحقوق محفوظة
      </div>
    </>
  );

  return (
    <>
      {/* زر فتح القائمة في حالة الإغلاق */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 21,
            background: 'rgba(6,11,27,0.96)',
            color: '#fff',
            border: 0,
            borderRadius: 14,
            fontSize: 24,
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 14px 40px rgba(15,23,42,0.75)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          aria-label="القائمة الجانبية"
        >
          ☰
        </button>
      )}

      {/* الـ Overlay واللوحة الجانبية */}
      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#2D374D',
            backdropFilter: 'blur(18px)',
            zIndex: 30,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              height: '100vh',
              width: isMobile ? '100%' : 280,
              background: '#2D374D',
              borderRadius: '0 24px 24px 0',
              boxShadow: '8px 0 40px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* عناصر زخرفية بسيطة */}
            <div
              style={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -100,
                left: -100,
                width: 300,
                height: 300,
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
              }}
            />

            {/* محتوى السايدبار القابل للتمرير */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                width: '100%',
                position: 'relative',
                zIndex: 1,
                paddingBottom: 24
              }}
            >
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}