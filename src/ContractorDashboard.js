import React, { useState, useEffect } from "react";
import { projectsAPI, suppliersAPI, paymentsAPI, getUser } from "./utils/api";
import { useNotifications } from "./components/NotificationSystem";
import { ProjectsPieChart, PaymentsBarChart, BudgetLineChart, ProgressChart } from "./components/Charts";
<<<<<<< HEAD
import BRAND from './theme';

// مكون ProgressBar المحسن
const ProgressBar = ({ progress, showLabel = true, size = 'medium' }) => {
  const progressValue = Math.min(Math.max(progress || 0, 0), 100);
  const isComplete = progressValue === 100;

=======
import ProjectCalendar from "./components/ProjectCalendar";

// مكون ProgressBar
const ProgressBar = ({ progress, showLabel = true, size = 'medium' }) => {
  const progressValue = Math.min(Math.max(progress || 0, 0), 100);
  const isComplete = progressValue === 100;
  
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
  const getProgressColor = () => {
    if (isComplete) return '#10b981';
    if (progressValue >= 75) return '#2a9d8f';
    if (progressValue >= 50) return '#3b82f6';
    if (progressValue >= 25) return '#f59e0b';
    return '#ef4444';
  };

<<<<<<< HEAD
  const height = size === 'small' ? 6 : size === 'large' ? 10 : 8;
=======
  const height = size === 'small' ? 6 : size === 'large' ? 12 : 8;
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        width: '100%',
        height: height,
<<<<<<< HEAD
        background: 'rgba(148, 163, 184, 0.2)',
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
=======
        background: '#f1f5f9',
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative'
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
      }}>
        <div
          style={{
            width: `${progressValue}%`,
            height: '100%',
<<<<<<< HEAD
            background: isComplete
              ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
              : `linear-gradient(90deg, ${getProgressColor()} 0%, ${getProgressColor()}dd 100%)`,
            borderRadius: 20,
            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `0 0 10px ${getProgressColor()}66`
=======
            background: isComplete 
              ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
              : `linear-gradient(90deg, ${getProgressColor()} 0%, ${getProgressColor()}dd 100%)`,
            borderRadius: 20,
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
          }}
        />
      </div>
      {showLabel && (
        <div style={{
<<<<<<< HEAD
          marginTop: 6,
          fontSize: 12,
          color: BRAND.text,
          fontWeight: 600,
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>التقدم</span>
          <span>{progressValue}%</span>
=======
          marginTop: 4,
          fontSize: 11,
          color: '#64748b',
          fontWeight: 600
        }}>
          {progressValue}%
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
        </div>
      )}
    </div>
  );
};

<<<<<<< HEAD
=======
const BRAND = {
  primary: '#1f2933',          // نص داكن على خلفية فاتحة
  accent: '#C26B3A',           // لهجة دافئة ثانوية
  background: '#f3f4f6',       // خلفية عامة فاتحة ومحايدة
  card: '#ffffff',             // كروت بيضاء بسيطة
  muted: '#6b7280',
};

>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
export default function ContractorDashboard() {
  const notifications = useNotifications();
  const [projects, setProjects] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState('overview');
=======
  const [activeTab, setActiveTab] = useState('overview'); // overview, charts, calendar
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const user = getUser();
        const filters = {};
        if (user?.role === 'contractor') {
          filters.contractor = user.id;
        }
<<<<<<< HEAD

=======
        
        // جلب جميع البيانات
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
        const [projectsData, suppliersData, paymentsData] = await Promise.all([
          projectsAPI.getAll(filters),
          suppliersAPI.getAll().catch(() => []),
          paymentsAPI.getAll().catch(() => [])
        ]);
<<<<<<< HEAD

=======
        
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      } catch (e) {
        console.error('Failed to load data', e);
        setProjects([]);
        setSuppliers([]);
        setPayments([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Statistics calculation
  const stats = {
    total: projects.length,
    pending: projects.filter(p => p.status === 'pending' || p.status === 'جديد').length,
    inProgress: projects.filter(p => p.status === 'in-progress' || p.status === 'جاري').length,
    completed: projects.filter(p => p.status === 'completed' || p.status === 'مكتمل').length,
    totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
    totalCost: projects.reduce((sum, p) => sum + (p.totalCost || 0), 0),
<<<<<<< HEAD
    avgProgress: projects.length > 0
      ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
      : 0,
    totalEngineers: projects.reduce((sum, p) => sum + (p.engineers?.length || 0), 0),
=======
    avgProgress: projects.length > 0 
      ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
      : 0,
    totalEngineers: projects.reduce((sum, p) => sum + (p.engineers?.length || 0), 0),
    totalImages: projects.reduce((sum, p) => sum + (p.images?.length || 0), 0),
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    totalSuppliers: suppliers.length,
    totalPaid: suppliers.reduce((sum, s) => sum + (s.totalPaid || 0), 0),
    totalRemaining: suppliers.reduce((sum, s) => sum + (s.totalRemaining || (s.totalPurchases || 0) - (s.totalPaid || 0)), 0),
    recentPayments: payments.length,
  };

  return (
<<<<<<< HEAD
    <div style={{
      direction: 'rtl',
      fontFamily: '"Outfit", "Cairo", sans-serif',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'visible', // Changed to visible so shadows aren't cut off
      paddingBottom: 40
    }}>
      {/* Premium Ambient Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: BRAND.background,
        zIndex: -2
      }} />

      <div style={{
        position: 'fixed',
        top: '-10%',
        left: '-10%',
        width: '50%',
        height: '50%',
        background: 'radial-gradient(circle, rgba(58, 66, 79, 0.05) 0%, transparent 70%)',
        filter: 'blur(60px)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-10%',
        right: '-10%',
        width: '50%',
        height: '50%',
        background: 'radial-gradient(circle, rgba(74, 85, 104, 0.05) 0%, transparent 70%)',
        filter: 'blur(60px)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      {/* Global Styles for Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Cairo:wght@400;600;700;900&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .hover-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.08) !important;
        }
        
        .stat-icon-wrapper {
          transition: all 0.3s ease;
        }
        .hover-card:hover .stat-icon-wrapper {
          transform: scale(1.1) rotate(5deg);
        }

        /* Glassmorphism Utilities */
        .glass-panel {
          background: ${BRAND.glass.background};
          backdrop-filter: ${BRAND.glass.blur};
          -webkit-backdrop-filter: ${BRAND.glass.blur};
          border: ${BRAND.glass.border};
        }
        
        .glass-card {
          background: ${BRAND.card};
          backdrop-filter: blur(8px);
          border: 1px solid ${BRAND.border || 'rgba(148, 163, 184, 0.1)'};
          color: ${BRAND.text};
        }

      `}</style>

      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 1600,
        margin: '0 auto',
        padding: '0 24px'
      }}>

        {/* Header Section */}
        <div className="glass-panel" style={{
          padding: '24px 32px',
          borderRadius: 24,
          marginBottom: 32,
          marginTop: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          animation: 'fadeIn 0.6s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 54,
              height: 54,
              borderRadius: 18,
              background: BRAND.primary, // Using primary color (Copper in dark mode)
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              color: '#fff',
              boxShadow: BRAND.shadows?.md || '0 8px 16px rgba(0,0,0,0.2)'

=======
    <div style={{ 
      direction: 'rtl', 
      fontFamily: 'Cairo, system-ui, Arial',
      minHeight: '100vh',
      backgroundColor: BRAND.background,
      color: BRAND.primary
    }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(194, 107, 58, 0.24); }
          50% { box-shadow: 0 0 40px rgba(245, 158, 11, 0.32); }
        }
        .stat-card {
          animation: fadeInUp 0.6s ease-out;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: #060B1B !important;
          border-radius: 18px;
          border: 1px solid rgba(148, 163, 184, 0.35);
        }
        .stat-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 22px 45px rgba(15, 23, 42, 0.65);
        }
        .glow-effect {
          position: relative;
          overflow: hidden;
        }
        .glow-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        .glow-effect:hover::before {
          left: 100%;
        }
      `}</style>

      {/* Header - simple flat card */}
      <div style={{
        position: 'relative',
        backgroundColor: '#ffffff',
        padding: '24px 32px',
        marginBottom: 24,
        borderRadius: '0 0 24px 24px',
        boxShadow: '0 8px 20px rgba(15,23,42,0.08)',
        borderBottom: '1px solid rgba(148,163,184,0.35)'
      }}>
        <div style={{
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 12
          }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: 20,
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              border: '2px solid rgba(255, 255, 255, 0.3)'
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
            }}>
              👋
            </div>
            <div>
              <h1 style={{
                fontSize: 28,
                fontWeight: 800,
<<<<<<< HEAD
                color: BRAND.primary, // Using primary color
=======
                color: BRAND.primary,
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
                margin: 0,
                letterSpacing: '-0.5px'
              }}>
                أهلاً بك، المقاول
              </h1>
<<<<<<< HEAD
              <p style={{
                color: BRAND.muted,
                fontSize: 14,
                margin: '4px 0 0 0',
                fontWeight: 500
              }}>
                نظرة شاملة على أداء ومشاريع شركتك
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: 12,
            background: 'rgba(58, 66, 79, 0.05)',
            padding: 6,
            borderRadius: 16
          }}>
            {[
              { id: 'overview', label: 'الرئيسية', icon: '📊' },
              { id: 'charts', label: 'التحليلات', icon: '📈' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 12,
                  border: 'none',
                  background: activeTab === tab.id ? BRAND.card : 'transparent',
                  color: activeTab === tab.id ? BRAND.primary : BRAND.muted,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  boxShadow: activeTab === tab.id ? BRAND.shadows?.sm : 'none',

                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'overview' && (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>

            {/* Quick Stats Row - Smaller Cards */}
            <h3 style={{
              fontSize: 18,
              fontWeight: 700,
              color: BRAND.primary,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span style={{ width: 4, height: 24, background: BRAND.accent, borderRadius: 2 }}></span>
              ملخص سريع
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 16,
              marginBottom: 32
            }}>
              {[
                { title: 'إجمالي المشاريع', value: stats.total, icon: '🏗️', color: BRAND.primary, sub: 'مشروع مسجل' },
                { title: 'قيد التنفيذ', value: stats.inProgress, icon: '⚡', color: '#3b82f6', sub: 'مشروع حالي' },
                { title: 'مكتملة', value: stats.completed, icon: '✅', color: '#10b981', sub: 'تم تسليمها' },
                { title: 'نسبة الإنجاز', value: `${stats.avgProgress}%`, icon: '📈', color: '#8b5cf6', sub: 'متوسط عام' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="glass-card hover-card"
                  style={{
                    padding: '16px', // Reduced padding
                    borderRadius: 16,
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 110
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div className="stat-icon-wrapper" style={{
                      width: 36, // Smaller icon wrapper
                      height: 36,
                      borderRadius: 10,
                      background: `${stat.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      color: stat.color
                    }}>
                      {stat.icon}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: 26, // Smaller font
                      fontWeight: 800,
                      color: BRAND.text,
                      lineHeight: 1,
                      marginBottom: 4
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      fontSize: 13, // Smaller label
                      fontWeight: 600,
                      color: BRAND.muted
                    }}>
                      {stat.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Stats - Compact */}
            <h3 style={{
              fontSize: 18,
              fontWeight: 700,
              color: BRAND.primary,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span style={{ width: 4, height: 24, background: BRAND.warning, borderRadius: 2 }}></span>
              نظرة مالية
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 16,
              marginBottom: 32
            }}>
              {[
                { title: 'إجمالي الميزانية', value: stats.totalBudget, icon: '💰', bg: BRAND.gradientDark, text: '#fff' },
                { title: 'التكلفة الفعلية', value: stats.totalCost, icon: '💸', bg: BRAND.card, text: BRAND.text, border: true },
                { title: 'المدفوعات للموردين', value: stats.totalPaid, icon: '💳', bg: BRAND.card, text: BRAND.text, border: true },

              ].map((stat, i) => (
                <div
                  key={i}
                  className={stat.border ? "glass-card hover-card" : "hover-card"}
                  style={{
                    padding: '20px',
                    borderRadius: 18,
                    background: stat.bg,
                    boxShadow: stat.border ? 'none' : '0 10px 30px rgba(30, 41, 59, 0.15)',
                    color: stat.text,
                    position: 'relative'
                  }}
                >
                  <div style={{
                    fontSize: 13,
                    opacity: 0.8,
                    fontWeight: 600,
                    marginBottom: 8
                  }}>
                    {stat.title}
                  </div>
                  <div style={{
                    fontSize: 28,
                    fontWeight: 800,
                    letterSpacing: '-0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <span>${stat.value.toLocaleString()}</span>
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    fontSize: 24,
                    opacity: 0.2
                  }}>
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions & Recent */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: 24
            }}>
              <div className="glass-panel" style={{ padding: '24px', borderRadius: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: BRAND.primary }}>📊 توزيع المشاريع</h4>
                </div>
                <div style={{ height: 250 }}>
                  <ProjectsPieChart data={{
                    pending: stats.pending,
                    inProgress: stats.inProgress,
                    completed: stats.completed,
                    cancelled: projects.filter(p => p.status === 'cancelled' || p.status === 'معلق').length
                  }} />
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '24px', borderRadius: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: BRAND.primary }}>🚧 حالة التقدم</h4>
                </div>
                {projects.slice(0, 4).map((p, i) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6, fontWeight: 600 }}>
                      <span style={{ color: BRAND.text }}>{p.name}</span>
                      <span style={{ color: BRAND.muted }}>{p.progress}%</span>
                    </div>
                    <ProgressBar progress={p.progress} size="small" showLabel={false} />
                  </div>
                ))}
                {projects.length === 0 && <div style={{ textAlign: 'center', color: BRAND.muted, padding: 20 }}>لا توجد مشاريع نشطة</div>}
              </div>
            </div>

          </div>
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: 24
            }}>
              <div className="glass-panel" style={{ padding: 24, borderRadius: 20 }}>
                <h4 style={{ margin: '0 0 20px 0', color: BRAND.primary }}>الميزانية مقابل التكلفة</h4>
                {projects.length > 0 ? <BudgetLineChart projects={projects} /> : <div style={{ textAlign: 'center', padding: 40, color: BRAND.muted }}>لا توجد بيانات</div>}
              </div>
              <div className="glass-panel" style={{ padding: 24, borderRadius: 20 }}>
                <h4 style={{ margin: '0 0 20px 0', color: BRAND.primary }}>المدفوعات الشهرية</h4>
                {payments.length > 0 ? <PaymentsBarChart data={payments} /> : <div style={{ textAlign: 'center', padding: 40, color: BRAND.muted }}>لا توجد بيانات</div>}
              </div>
            </div>
          </div>
        )}
      </div>
=======
              <p style={{ 
                color: BRAND.muted, 
                fontSize: 14, 
                margin: '6px 0 0 0',
                fontWeight: 400
              }}>
                إدارة مشاريعك ومراقبة التقدم من مكان واحد
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: 32,
        padding: '0 32px'
      }}>
        {[
          { id: 'overview', label: 'نظرة عامة', icon: '📊' },
          { id: 'charts', label: 'الرسوم البيانية', icon: '📈' },
          { id: 'calendar', label: 'التقويم', icon: '📅' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '10px 20px',
              borderRadius: 999,
              border: activeTab === tab.id
                ? '1px solid rgba(37,99,235,0.6)'
                : '1px solid rgba(148,163,184,0.7)',
              backgroundColor: activeTab === tab.id ? '#e0f2fe' : '#ffffff',
              color: activeTab === tab.id ? '#1d4ed8' : '#4b5563',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              boxShadow: activeTab === tab.id
                ? '0 6px 16px rgba(15,23,42,0.12)'
                : '0 2px 6px rgba(15,23,42,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
            }}
          >
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <>
      {/* Statistics Cards - Row 1 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 24,
        marginBottom: 24,
        padding: '0 32px'
      }}>
        {[ 
          { label: 'إجمالي المشاريع', value: stats.total, icon: '📊', color: BRAND.accent, gradient: 'linear-gradient(135deg, #C26B3A 0%, #f97316 100%)' },
          { label: 'قيد الانتظار', value: stats.pending, icon: '⏳', color: '#eab308', gradient: 'linear-gradient(135deg, #facc15 0%, #f97316 100%)' },
        ].map((stat, i) => (
          <div
            key={stat.label}
            style={{
              background: BRAND.card,
              borderRadius: 20,
              padding: 24,
              boxShadow: '0 4px 10px rgba(15,23,42,0.04)',
              border: '1px solid rgba(148,163,184,0.25)',
              position: 'relative',
              overflow: 'hidden',
              animationDelay: `${i * 0.1}s`
            }}
          >
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 120,
              height: 120,
              background: stat.gradient,
              opacity: 0.25,
              borderRadius: '0 20px 0 100%'
            }} />
            
            <div style={{ 
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: stat.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  boxShadow: `0 10px 26px ${stat.color}55`
                }}>
                  {stat.icon}
                </div>
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: stat.color,
                  boxShadow: `0 0 22px ${stat.color}aa`,
                  animation: 'glow 2s infinite'
                }} />
              </div>
              <div style={{
                fontSize: 38,
                fontWeight: 900,
                color: '#f9fafb',
                marginBottom: 8,
                letterSpacing: '-1px'
              }}>
                {stat.value}
              </div>
              <div style={{ 
                color: BRAND.muted, 
                fontSize: 14, 
                fontWeight: 600,
                letterSpacing: '0.3px'
              }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Statistics Cards - Row 2 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 24,
        marginBottom: 24,
        padding: '0 32px'
      }}>
        {[
          { label: 'إجمالي الميزانية', value: `$${stats.totalBudget.toLocaleString()}`, icon: '💰', color: '#facc15', gradient: 'linear-gradient(135deg, #1f2937 0%, #0f172a 100%)' },
          { label: 'التكلفة الفعلية', value: `$${stats.totalCost.toLocaleString()}`, icon: '💵', color: '#38bdf8', gradient: 'linear-gradient(135deg, #111827 0%, #020617 100%)' },
          { label: 'متوسط التقدم', value: `${stats.avgProgress}%`, icon: '📈', color: '#4ade80', gradient: 'linear-gradient(135deg, #052e16 0%, #0f172a 100%)' },
          { label: 'إجمالي المهندسين', value: stats.totalEngineers, icon: '👷', color: '#fb923c', gradient: 'linear-gradient(135deg, #7c2d12 0%, #0f172a 100%)' },
        ].map((stat, i) => (
          <div
            key={stat.label}
            style={{
              background: BRAND.card,
              borderRadius: 20,
              padding: 24,
              boxShadow: '0 4px 10px rgba(15,23,42,0.04)',
              border: '1px solid rgba(148,163,184,0.25)',
              position: 'relative',
              overflow: 'hidden',
              animationDelay: `${(i + 4) * 0.1}s`
            }}
          >
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 120,
              height: 120,
              background: stat.gradient,
              opacity: 0.1,
              borderRadius: '0 20px 0 100%'
            }} />

            <div style={{
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: stat.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  boxShadow: `0 8px 20px ${stat.color}30`
                }}>
                  {stat.icon}
                </div>
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: stat.color,
                  boxShadow: `0 0 20px ${stat.color}80`,
                  animation: 'glow 2s infinite'
                }} />
              </div>
              <div style={{
                fontSize: stat.label.includes('الميزانية') || stat.label.includes('التكلفة') ? 28 : 38,
                fontWeight: 900,
                color: '#111827',
                marginBottom: 8,
                letterSpacing: '-1px'
              }}>
                {stat.value}
              </div>
              <div style={{
                color: BRAND.muted,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '0.3px'
              }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Statistics Cards - Row 3 (Suppliers & Payments) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 24,
        marginBottom: 30,
        padding: '0 32px'
      }}>
        {[ 
          { label: 'الموردين', value: stats.totalSuppliers, icon: '🏢', color: '#38bdf8', gradient: 'linear-gradient(135deg, #1f2937 0%, #0f172a 100%)' },
          { label: 'إجمالي المدفوع', value: `$${stats.totalPaid.toLocaleString()}`, icon: '💳', color: '#22c55e', gradient: 'linear-gradient(135deg, #052e16 0%, #0f172a 100%)' },
          { label: 'المتبقي للموردين', value: `$${stats.totalRemaining.toLocaleString()}`, icon: '📊', color: '#f97316', gradient: 'linear-gradient(135deg, #7c2d12 0%, #0f172a 100%)' },
          { label: 'عمليات السداد', value: stats.recentPayments, icon: '💰', color: '#facc15', gradient: 'linear-gradient(135deg, #1f2937 0%, #020617 100%)' },
        ].map((stat, i) => (
          <div
            key={stat.label}
            style={{
              background: BRAND.card,
              borderRadius: 20,
              padding: 24,
              boxShadow: '0 4px 10px rgba(15,23,42,0.04)',
              border: '1px solid rgba(148,163,184,0.25)',
              position: 'relative',
              overflow: 'hidden',
              animationDelay: `${(i + 8) * 0.1}s`
            }}
          >
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 120,
              height: 120,
              background: stat.gradient,
              opacity: 0.1,
              borderRadius: '0 20px 0 100%'
            }} />
            
            <div style={{ 
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: stat.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  boxShadow: `0 8px 20px ${stat.color}30`
                }}>
                  {stat.icon}
                </div>
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: stat.color,
                  boxShadow: `0 0 20px ${stat.color}80`,
                  animation: 'glow 2s infinite'
                }} />
              </div>
              <div style={{
                fontSize: stat.label.includes('المدفوع') || stat.label.includes('المتبقي') ? 26 : 38,
                fontWeight: 900,
                color: '#111827',
                marginBottom: 8,
                letterSpacing: '-1px'
              }}>
                {stat.value}
              </div>
              <div style={{ 
                color: BRAND.muted, 
                fontSize: 14, 
                fontWeight: 600,
                letterSpacing: '0.3px'
              }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

        </>
      )}

      {/* Charts Tab Content */}
      {activeTab === 'charts' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: 24,
          marginBottom: 24,
          padding: '0 32px'
        }}>
          {/* Projects Status Pie Chart */}
          <div style={{
            background: '#fff',
            borderRadius: 24,
            padding: 32,
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(76, 175, 80, 0.15)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: BRAND.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24
              }}>📊</div>
              <h3 style={{
                fontSize: 20,
                fontWeight: 800,
                color: BRAND.primary,
                margin: 0
              }}>
                توزيع حالة المشاريع
              </h3>
            </div>
            <ProjectsPieChart data={{
              pending: stats.pending,
              inProgress: stats.inProgress,
              completed: stats.completed,
              cancelled: projects.filter(p => p.status === 'cancelled' || p.status === 'معلق').length
            }} />
          </div>

          {/* Payments Bar Chart */}
          <div style={{
            background: '#fff',
            borderRadius: 24,
            padding: 32,
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 187, 106, 0.15)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: BRAND.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24
              }}>💳</div>
              <h3 style={{
                fontSize: 20,
                fontWeight: 800,
                color: BRAND.primary,
                margin: 0
              }}>
                المدفوعات الشهرية
              </h3>
            </div>
            {payments.length > 0 ? (
              <PaymentsBarChart data={payments} />
            ) : (
              <div style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: BRAND.muted,
                background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.03) 0%, rgba(102, 187, 106, 0.03) 100%)',
                borderRadius: 16
              }}>
                <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }}>📊</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>لا توجد بيانات للعرض</div>
              </div>
            )}
          </div>

          {/* Budget vs Cost Line Chart */}
          <div style={{
            background: '#fff',
            borderRadius: 24,
            padding: 32,
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)',
            gridColumn: '1 / -1',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(76, 175, 80, 0.15)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: BRAND.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24
              }}>💰</div>
              <h3 style={{
                fontSize: 20,
                fontWeight: 800,
                color: BRAND.primary,
                margin: 0
              }}>
                الميزانية مقابل التكلفة الفعلية
              </h3>
            </div>
            {projects.filter(p => p.budget && p.totalCost).length > 0 ? (
              <BudgetLineChart projects={projects} />
            ) : (
              <div style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: BRAND.muted,
                background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.03) 0%, rgba(102, 187, 106, 0.03) 100%)',
                borderRadius: 16
              }}>
                <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }}>📊</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>لا توجد بيانات للعرض</div>
              </div>
            )}
          </div>

          {/* Progress Chart */}
          <div style={{
            background: '#fff',
            borderRadius: 24,
            padding: 32,
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)',
            gridColumn: '1 / -1',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 187, 106, 0.15)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: BRAND.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24
              }}>📈</div>
              <h3 style={{
                fontSize: 20,
                fontWeight: 800,
                color: BRAND.primary,
                margin: 0
              }}>
                تقدم المشاريع
              </h3>
            </div>
            {projects.filter(p => p.progress !== undefined).length > 0 ? (
              <ProgressChart projects={projects} />
            ) : (
              <div style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: BRAND.muted,
                background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.03) 0%, rgba(102, 187, 106, 0.03) 100%)',
                borderRadius: 16
              }}>
                <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }}>📊</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>لا توجد بيانات للعرض</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Calendar Tab Content */}
      {activeTab === 'calendar' && (
        <ProjectCalendar projects={projects} />
      )}
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    </div>
  );
}
