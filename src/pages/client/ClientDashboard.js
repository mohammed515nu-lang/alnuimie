import React, { useState, useEffect } from "react";
import { projectsAPI, requestsAPI, reportsAPI, getUser } from "../../utils/api";
import BRAND from "../../theme";
import { Link } from "react-router-dom";
import { useNotifications } from "../../components/NotificationSystem";

export default function ClientDashboard() {
    const notifications = useNotifications();
    const [stats, setStats] = useState({
        totalProjects: 0,
        activeProjects: 0,
        totalBudget: 0,
        paidAmount: 0,
        recentRequests: []
    });
    const [loading, setLoading] = useState(true);
    const user = getUser();

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const userId = user.id || user._id;
                const projects = await projectsAPI.getAll({ client: userId });
                const requests = await requestsAPI.getAll({ client: userId });

                const active = projects.filter(p => p.status === 'in-progress' || p.status === 'pending').length;
                const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
                // Assuming paidAmount is tracked, otherwise mock for UI
                const paid = projects.reduce((acc, p) => acc + (p.paidAmount || 0), 0);

                setStats({
                    totalProjects: projects.length,
                    activeProjects: active,
                    totalBudget: totalBudget,
                    paidAmount: paid,
                    recentRequests: requests.slice(0, 5)
                });
            } catch (err) {
                console.error("Dashboard Fetch Error:", err);
                notifications.error("خطأ", "فشل جلب بيانات لوحة التحكم");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user.id, user._id, notifications]);

    const StatCard = ({ title, value, icon, color, subValue }) => (
        <div style={{
            background: BRAND.card,
            padding: '24px',
            borderRadius: '24px',
            boxShadow: BRAND.shadows.lg,
            border: `1px solid ${BRAND.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            transition: 'transform 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
        }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'none'}
        >
            <div style={{
                position: 'absolute',
                top: -10,
                right: -10,
                fontSize: 80,
                opacity: 0.05,
                color: color
            }}>{icon}</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    color: color
                }}>{icon}</div>
                <span style={{ color: BRAND.muted, fontWeight: 700, fontSize: 14 }}>{title}</span>
            </div>

            <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: BRAND.text }}>{value}</div>
                {subValue && <div style={{ fontSize: 13, color: color, fontWeight: 600 }}>{subValue}</div>}
            </div>
        </div>
    );

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
                <div style={{ fontSize: 18, color: BRAND.muted }}>جاري تحميل لوحة التحكم...</div>
            </div>
        </div>
    );

    return (
        <div style={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
            {/* Welcome Section */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{
                    fontSize: 32,
                    fontWeight: 900,
                    background: BRAND.gradientHero,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: 8
                }}>
                    أهلاً بك مجدداً، {user?.name} 👋
                </h1>
                <p style={{ color: BRAND.muted, margin: 0 }}>هذا هو ملخص مشاريعك وأنشطتك الحالية.</p>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 24,
                marginBottom: 40
            }}>
                <StatCard
                    title="إجمالي المشاريع"
                    value={stats.totalProjects}
                    icon="🏗️"
                    color="#3b82f6"
                    subValue={`${stats.activeProjects} قيد التنفيذ`}
                />
                <StatCard
                    title="إجمالي الميزانية"
                    value={`$${stats.totalBudget.toLocaleString()}`}
                    icon="💰"
                    color="#10b981"
                />
                <StatCard
                    title="المبلغ المدفوع"
                    value={`$${stats.paidAmount.toLocaleString()}`}
                    icon="💳"
                    color="#f59e0b"
                    subValue={`المتبقي: $${(stats.totalBudget - stats.paidAmount).toLocaleString()}`}
                />
                <StatCard
                    title="طلبات معلقة"
                    value={stats.recentRequests.filter(r => r.status === 'pending').length}
                    icon="✉️"
                    color="#ef4444"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
                {/* Recent Requests Section */}
                <div style={{
                    background: BRAND.card,
                    borderRadius: 24,
                    padding: 24,
                    boxShadow: BRAND.shadows.lg,
                    border: `1px solid ${BRAND.border}`
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: BRAND.text }}>آخر الطلبات</h3>
                        <Link to="/client/requests" style={{ color: BRAND.accent, fontSize: 14, textDecoration: 'none', fontWeight: 700 }}>عرض الكل ←</Link>
                    </div>

                    {stats.recentRequests.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: BRAND.muted }}>لا توجد طلبات حديثة</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {stats.recentRequests.map(req => (
                                <div key={req._id} style={{
                                    padding: 16,
                                    borderRadius: 16,
                                    background: BRAND.background,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 15, color: BRAND.text }}>{req.title}</div>
                                        <div style={{ fontSize: 12, color: BRAND.muted }}>{new Date(req.createdAt).toLocaleDateString('ar-SA')}</div>
                                    </div>
                                    <div style={{
                                        padding: '4px 12px',
                                        borderRadius: 20,
                                        fontSize: 11,
                                        fontWeight: 700,
                                        background: req.status === 'pending' ? '#fef3c7' : '#d1fae5',
                                        color: req.status === 'pending' ? '#92400e' : '#065f46'
                                    }}>
                                        {req.status === 'pending' ? 'قيد المراجعة' : 'مقبول'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div style={{
                    background: BRAND.card,
                    borderRadius: 24,
                    padding: 24,
                    boxShadow: BRAND.shadows.lg,
                    border: `1px solid ${BRAND.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16
                }}>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: BRAND.text }}>إجراءات سريعة</h3>
                    <Link to="/client/projects/add" style={{
                        padding: '16px',
                        borderRadius: 16,
                        background: BRAND.gradient,
                        color: '#fff',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        fontWeight: 700,
                        boxShadow: BRAND.shadows.accent
                    }}>
                        <span style={{ fontSize: 20 }}>📝</span>
                        بدء مشروع جديد
                    </Link>
                    <Link to="/client/projects" style={{
                        padding: '16px',
                        borderRadius: 16,
                        background: BRAND.background,
                        color: BRAND.text,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        fontWeight: 700,
                        border: `1px solid ${BRAND.border}`
                    }}>
                        <span style={{ fontSize: 20 }}>🏗️</span>
                        إدارة مشاريعي
                    </Link>
                    <Link to="/client/profile" style={{
                        padding: '16px',
                        borderRadius: 16,
                        background: BRAND.background,
                        color: BRAND.text,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        fontWeight: 700,
                        border: `1px solid ${BRAND.border}`
                    }}>
                        <span style={{ fontSize: 20 }}>👤</span>
                        تعديل الملف الشخصي
                    </Link>
                </div>
            </div>
        </div>
    );
}
