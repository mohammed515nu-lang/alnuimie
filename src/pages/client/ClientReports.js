import React, { useState, useEffect } from "react";
import { reportsAPI, projectsAPI, getUser } from "../../utils/api";
import BRAND from "../../theme";
import { useNotifications } from "../../components/NotificationSystem";

export default function ClientReports() {
    const notifications = useNotifications();
    const [reports, setReports] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState('all');
    const user = getUser();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const userId = user.id || user._id;
                // Fetch projects to filter reports
                const projectsData = await projectsAPI.getAll({ client: userId });
                setProjects(projectsData || []);

                // Fetch reports for these projects
                const reportsData = await reportsAPI.getAll();
                // Filter reports locally to ensure they belong to the client's projects
                const projectIds = projectsData.map(p => (p._id || p.id).toString());
                const clientReports = reportsData.filter(r =>
                    r.project && (typeof r.project === 'object'
                        ? projectIds.includes((r.project._id || r.project.id).toString())
                        : projectIds.includes(r.project.toString()))
                );

                setReports(clientReports);
            } catch (err) {
                console.error("Reports Fetch Error:", err);
                notifications.error("خطأ", "فشل جلب التقارير");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.id, user._id, notifications]);

    const filteredReports = selectedProject === 'all'
        ? reports
        : reports.filter(r => {
            const pid = typeof r.project === 'object' ? (r.project._id || r.project.id) : r.project;
            return pid.toString() === selectedProject;
        });

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return { bg: '#d1fae5', text: '#065f46', label: 'مكتمل' };
            case 'pending': return { bg: '#fef3c7', text: '#92400e', label: 'قيد المراجعة' };
            default: return { bg: '#f1f5f9', text: '#475569', label: status };
        }
    };

    return (
        <div style={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{
                    fontSize: 32,
                    fontWeight: 900,
                    background: BRAND.gradientHero,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: 8
                }}>
                    تقارير المشاريع 📊
                </h1>
                <p style={{ color: BRAND.muted, margin: 0 }}>تابع آخر التقارير والمستجدات الخاصة بمشاريعك.</p>
            </div>

            {/* Filter Bar */}
            <div style={{
                background: BRAND.card,
                padding: '20px',
                borderRadius: '20px',
                boxShadow: BRAND.shadows.md,
                border: `1px solid ${BRAND.border}`,
                marginBottom: 32,
                display: 'flex',
                alignItems: 'center',
                gap: 16
            }}>
                <label style={{ fontWeight: 700, color: BRAND.text }}>تصفية حسب المشروع:</label>
                <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    style={{
                        padding: '10px 16px',
                        borderRadius: 12,
                        border: `2px solid ${BRAND.border}`,
                        background: BRAND.background,
                        color: BRAND.text,
                        outline: 'none',
                        minWidth: 200
                    }}
                >
                    <option value="all">جميع المشاريع</option>
                    {projects.map(p => (
                        <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ fontSize: 40 }}>⏳</div>
                    <p style={{ color: BRAND.muted }}>جاري تحميل التقارير...</p>
                </div>
            ) : filteredReports.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '80px',
                    background: BRAND.card,
                    borderRadius: 24,
                    border: `2px dashed ${BRAND.border}`
                }}>
                    <div style={{ fontSize: 60, marginBottom: 16 }}>📂</div>
                    <h3 style={{ color: BRAND.text, margin: 0 }}>لا توجد تقارير متاحة حالياً</h3>
                    <p style={{ color: BRAND.muted }}>سيظهر هنا أي تقرير يتم إنشاؤه من قبل المقاول لمشاريعك.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: 20 }}>
                    {filteredReports.map(report => {
                        const status = getStatusColor(report.status);
                        return (
                            <div key={report._id} style={{
                                background: BRAND.card,
                                borderRadius: 24,
                                padding: '24px',
                                boxShadow: BRAND.shadows.lg,
                                border: `1px solid ${BRAND.border}`,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                transition: 'transform 0.3s ease'
                            }}
                                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'none'}
                            >
                                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                                    <div style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 16,
                                        background: BRAND.gradient,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 28,
                                        color: '#fff'
                                    }}>
                                        {report.reportType === 'invoice' ? '📄' : '📊'}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: '0 0 4px 0', fontSize: 18, fontWeight: 800, color: BRAND.text }}>{report.title}</h3>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                            <span style={{ fontSize: 13, color: BRAND.muted }}>
                                                📅 {new Date(report.generatedAt).toLocaleDateString('ar-SA')}
                                            </span>
                                            <span style={{
                                                fontSize: 12,
                                                fontWeight: 700,
                                                background: status.bg,
                                                color: status.text,
                                                padding: '2px 10px',
                                                borderRadius: 20
                                            }}>
                                                {status.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 12 }}>
                                    {/* In a real app, this would trigger a PDF download or view */}
                                    <button
                                        onClick={() => notifications.info("معلومة", "سيتم تفعيل تحميل بي دي اف قريباً")}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: 12,
                                            border: `1px solid ${BRAND.border}`,
                                            background: BRAND.background,
                                            color: BRAND.text,
                                            fontWeight: 700,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        عرض التفاصيل
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
