import React, { useState, useEffect } from "react";
import { projectsAPI, suppliersAPI, paymentsAPI, getUser } from "./utils/api";
import { useNotifications } from "./components/NotificationSystem";
import { ProjectsPieChart, PaymentsBarChart, BudgetLineChart, ProgressChart } from "./components/Charts";
import ProjectCalendar from "./components/ProjectCalendar";

// مكون ProgressBar
const ProgressBar = ({ progress, showLabel = true, size = 'medium' }) => {
  const progressValue = Math.min(Math.max(progress || 0, 0), 100);
  const isComplete = progressValue === 100;
  
  const getProgressColor = () => {
    if (isComplete) return '#10b981';
    if (progressValue >= 75) return '#2a9d8f';
    if (progressValue >= 50) return '#3b82f6';
    if (progressValue >= 25) return '#f59e0b';
    return '#ef4444';
  };

  const height = size === 'small' ? 6 : size === 'large' ? 12 : 8;

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        width: '100%',
        height: height,
        background: '#f1f5f9',
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div
          style={{
            width: `${progressValue}%`,
            height: '100%',
            background: isComplete 
              ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
              : `linear-gradient(90deg, ${getProgressColor()} 0%, ${getProgressColor()}dd 100%)`,
            borderRadius: 20,
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </div>
      {showLabel && (
        <div style={{
          marginTop: 4,
          fontSize: 11,
          color: '#64748b',
          fontWeight: 600
        }}>
          {progressValue}%
        </div>
      )}
    </div>
  );
};

const BRAND = {
  primary: '#1f2933',          // نص داكن على خلفية فاتحة
  accent: '#C26B3A',           // لهجة دافئة ثانوية
  background: '#f3f4f6',       // خلفية عامة فاتحة ومحايدة
  card: '#ffffff',             // كروت بيضاء بسيطة
  muted: '#6b7280',
};

export default function ContractorDashboard() {
  const notifications = useNotifications();
  const [projects, setProjects] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, charts, calendar

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const user = getUser();
        const filters = {};
        if (user?.role === 'contractor') {
          filters.contractor = user.id;
        }
        
        // جلب جميع البيانات
        const [projectsData, suppliersData, paymentsData] = await Promise.all([
          projectsAPI.getAll(filters),
          suppliersAPI.getAll().catch(() => []),
          paymentsAPI.getAll().catch(() => [])
        ]);
        
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
    avgProgress: projects.length > 0 
      ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
      : 0,
    totalEngineers: projects.reduce((sum, p) => sum + (p.engineers?.length || 0), 0),
    totalImages: projects.reduce((sum, p) => sum + (p.images?.length || 0), 0),
    totalSuppliers: suppliers.length,
    totalPaid: suppliers.reduce((sum, s) => sum + (s.totalPaid || 0), 0),
    totalRemaining: suppliers.reduce((sum, s) => sum + (s.totalRemaining || (s.totalPurchases || 0) - (s.totalPaid || 0)), 0),
    recentPayments: payments.length,
  };

  return (
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
            }}>
              👋
            </div>
            <div>
              <h1 style={{
                fontSize: 28,
                fontWeight: 800,
                color: BRAND.primary,
                margin: 0,
                letterSpacing: '-0.5px'
              }}>
                أهلاً بك، المقاول
              </h1>
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
    </div>
  );
}
