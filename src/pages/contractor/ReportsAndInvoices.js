import React, { useState, useEffect, useCallback } from "react";
import { useNotifications } from "../../components/NotificationSystem";
import BRAND from "../../theme";
import { reportsAPI, getUser, materialsAPI, projectsAPI, purchasesAPI, paymentsAPI } from "../../utils/api";




const reportCards = [
  {
    id: 1,
    title: 'تقرير المواد',
    description: 'تقرير شامل عن المواد والمخزون المتاح والمستهلك',
    icon: '📦',
    color: BRAND.gradient,
    action: 'materials',
    type: 'inventory'
  },
  {
    id: 2,
    title: 'تقرير التكاليف',
    description: 'تحليل تفصيلي للمصروفات والتدفقات النقدية للمشاريع',
    icon: '💰',
    color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    action: 'costs',
    type: 'financial'
  },
  {
    id: 3,
    title: 'تقرير المشاريع',
    description: 'متابعة حالة وتقدم جميع المشاريع الحالية المفتوحة',
    icon: '📁',
    color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    action: 'projects',
    type: 'project'
  },
  {
    id: 4,
    title: 'إنشاء فاتورة',
    description: 'إصدار فواتير رسمية للعملاء بناءً على التقدم المحرز',
    icon: '🧾',
    color: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
    action: 'invoice',
    type: 'invoice'
  },
];

export default function ReportsAndInvoices() {
  const notifications = useNotifications();
  const [isGenerating, setIsGenerating] = useState(null);
  const [reports, setReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isLogOpen, setIsLogOpen] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);



  const fetchReports = useCallback(async () => {
    try {
      setIsLoadingReports(true);
      const data = await reportsAPI.getAll();
      setReports(Array.isArray(data) ? data : (data.reports || []));
    } catch (err) {
      notifications.error('خطأ', 'فشل في تحميل سجل التقارير');
    } finally {
      setIsLoadingReports(false);
    }
  }, [notifications]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  async function handleReport(card) {
    if (isGenerating) return;

    const user = getUser();
    if (!user) {
      notifications.error('خطأ في الجلسة', 'يرجى تسجيل الدخول مرة أخرى');
      return;
    }

    setIsGenerating(card.action);
    try {
      let documentContent = "";

      // Fetch Real Data based on type
      if (card.type === 'inventory') {
        const materialsData = await materialsAPI.getAll();
        const materials = Array.isArray(materialsData) ? materialsData : (materialsData.materials || []);
        documentContent = JSON.stringify({
          type: 'inventory',
          data: materials.map(m => ({
            "المادة": m.name,
            "الكمية": `${m.quantity} ${m.unit || 'وحدة'}`,
            "الحالة": m.quantity <= m.minStock ? "⚠️ منخفض" : "✅ كافٍ"
          }))
        });
      } else if (card.type === 'project') {
        const projectsData = await projectsAPI.getAll();
        const projects = Array.isArray(projectsData) ? projectsData : (projectsData.projects || []);
        documentContent = JSON.stringify({
          type: 'projects',
          data: projects.map(p => ({
            "المشروع": p.name,
            "الحالة": p.status === 'active' ? 'مستمر' : (p.status === 'completed' ? 'منتهي' : p.status),
            "الميزانية": `${p.budget?.toLocaleString() || 0} د.إ`
          }))
        });
      } else if (card.type === 'financial') {
        const [purchasesData, paymentsData] = await Promise.all([
          purchasesAPI.getAll(),
          paymentsAPI.getAll()
        ]);
        const purchases = Array.isArray(purchasesData) ? purchasesData : (purchasesData.purchases || []);
        const payments = Array.isArray(paymentsData) ? paymentsData : (paymentsData.payments || []);

        const totalPurchases = purchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
        const totalPayments = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

        documentContent = JSON.stringify({
          type: 'financial',
          summary: {
            "إجمالي المشتريات": `${totalPurchases.toLocaleString()} د.إ`,
            "إجمالي المدفوعات": `${totalPayments.toLocaleString()} د.إ`,
            "الرصيد المتبقي": `${(totalPurchases - totalPayments).toLocaleString()} د.إ`
          }
        });
      } else if (card.type === 'invoice') {
        const projectsData = await projectsAPI.getAll();
        const projects = Array.isArray(projectsData) ? projectsData : (projectsData.projects || []);
        documentContent = JSON.stringify({
          type: 'invoice',
          data: projects.filter(p => p.status === 'active').map(p => ({
            "البند": `خدمات مقاولات - مشروع: ${p.name}`,
            "القيمة": `${(p.budget * 0.1).toLocaleString()} د.إ`, // We keep 10% as a standard milestone for now, but label it properly
            "التوصيف": "دفعة إنجاز مرحلية معتمدة"
          }))
        });
      }

      const response = await reportsAPI.create({
        title: card.title,
        reportType: card.type,
        status: 'completed',
        content: documentContent,
        generatedBy: user.id || user._id
      });

      const newReport = response.report || response.data || response;
      notifications.success('نجح', `تم توليد ${card.title} الرسمي بنجاح. تم تحديث سجل التقارير.`);
      fetchReports();
      setSelectedReport(newReport);
    } catch (err) {
      console.error("Report Generation Failed:", err);
      notifications.error('خطأ', err.message || 'فشل في توليد التقرير');
    } finally {
      setIsGenerating(null);
    }
  }

  const deleteReport = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التقرير؟')) return;
    try {
      await reportsAPI.remove(id);
      notifications.success('نجح', 'تم حذف التقرير بنجاح');
      fetchReports();
    } catch (err) {
      notifications.error('خطأ', 'فشل في حذف التقرير');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`هل أنت متأكد من حذف ${selectedIds.length} تقرير/تقارير محددة؟`)) return;

    try {
      await reportsAPI.deleteBulk(selectedIds);
      notifications.success('نجح', 'تم حذف التقارير المحددة بنجاح');
      setSelectedIds([]);
      fetchReports();
    } catch (err) {
      notifications.error('خطأ', 'فشل في الحذف الجماعي');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === reports.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(reports.map(r => r._id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };


  const handlePrint = () => {
    window.print();
  };




  return (
    <div style={{
      direction: 'rtl',
      fontFamily: '"Outfit", "Cairo", sans-serif',
      minHeight: '100vh',
      paddingBottom: 40
    }}>
      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Cairo:wght@400;600;700;900&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Reem+Kufi:wght@400;700&display=swap');
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
           0% { transform: scale(1); }
           50% { transform: scale(1.02); }
           100% { transform: scale(1); }
        }

        .glass-panel {
          background: ${BRAND.glass.background};
          backdrop-filter: ${BRAND.glass.blur};
          border: ${BRAND.glass.border};
          box-shadow: ${BRAND.glass.shadow};
          border-radius: 24px;
        }

        .report-card {
           background: ${BRAND.card};
           backdrop-filter: blur(10px);
           border: 1px solid ${BRAND.border || 'rgba(255, 255, 255, 0.1)'};
           border-radius: 28px;
           padding: 32px;
           cursor: pointer;
           transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
           position: relative;
           overflow: hidden;
           display: flex;
           flex-direction: column;
           color: ${BRAND.text};
        }

           height: 100%;
        }
        .report-card:hover {
           transform: translateY(-8px);
           background: #fff;
           box-shadow: 0 20px 40px rgba(0,0,0,0.08);
           border-color: ${BRAND.accent};
        }
        .report-card:hover .icon-box {
           transform: scale(1.1) rotate(5deg);
        }
        .report-card::after {
           content: '';
           position: absolute;
           top: 0; left: -100%;
           width: 100%; height: 100%;
           background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
           transition: 0.5s;
        }
        .report-card:hover::after {
           left: 100%;
        }

        .icon-box {
           width: 70px;
           height: 70px;
           border-radius: 20px;
           display: flex;
           align-items: center;
           justify-content: center;
           font-size: 32px;
           margin-bottom: 24px;
           transition: all 0.3s ease;
           box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }

        .loading-overlay {
           position: absolute;
           inset: 0;
           background: rgba(255,255,255,0.8);
           display: flex;
           align-items: center;
           justify-content: center;
           z-index: 10;
           border-radius: 28px;
        }

        .log-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 8px;
        }
        .log-table th {
          padding: 16px;
          text-align: right;
          color: ${BRAND.muted};
          font-weight: 600;
          font-size: 14px;
        }
        .log-table td {
          padding: 16px;
          background: #fff;
          border-top: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
        }
        .log-table tr td:first-child {
          border-left: 1px solid #f1f5f9;
          border-radius: 0 16px 16px 0;
        }
        .log-table tr td:last-child {
          border-right: 1px solid #f1f5f9;
          border-radius: 16px 0 0 16px;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          #printable-area, #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #fff !important;
          }
          .no-print {
            display: none !important;
          }
        }

        .signature-fakhma {
          font-family: 'Amiri', serif;
          font-size: 42px;
          background: linear-gradient(135deg, #b8860b 0%, #daa520 50%, #b8860b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
          display: inline-block;
          margin-top: 10px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
          transform: rotate(-3deg);
          letter-spacing: 1px;
        }


        .preview-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .preview-modal-content {
          background: #fff;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          border-radius: 24px;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .report-document {
          padding: 60px;
          font-family: 'Cairo', sans-serif;
          color: #1e293b;
        }
        
        .report-header {
          border-bottom: 3px solid ${BRAND.primary};
          padding-bottom: 30px;
          margin-bottom: 40px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .seal-box {
          border: 2px solid #e2e8f0;
          padding: 15px;
          border-radius: 12px;
          text-align: center;
          width: 150px;
        }


      `}</style>

      {/* Background Decor */}
      <div style={{ position: 'fixed', inset: 0, background: BRAND.background, zIndex: -2 }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(42, 157, 143, 0.05) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: -1 }} />


      {/* Header */}
      <div className="glass-panel" style={{
        margin: '20px 24px 40px',
        padding: '32px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: BRAND.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#fff', boxShadow: '0 8px 16px rgba(42,157,143,0.3)' }}>
            📊
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: BRAND.primary, letterSpacing: '-0.5px' }}>التقارير والفواتير</h1>
            <p style={{ margin: '6px 0 0', fontSize: 14, color: BRAND.muted, fontWeight: 500 }}>تحويل البيانات إلى تقارير احترافية وفواتير عملاء</p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 28,
        padding: '0 24px 40px'
      }}>
        {reportCards.map(card => (
          <div key={card.id} className="report-card" onClick={() => handleReport(card)}>
            {isGenerating === card.action && (

              <div className="loading-overlay">
                <div style={{ fontSize: 40, animation: 'spin 1.5s linear infinite' }}>⏳</div>
              </div>
            )}

            <div className="icon-box" style={{ background: card.color }}>
              {card.icon}
            </div>

            <h3 style={{ margin: '0 0 12px', color: BRAND.primary, fontSize: 22, fontWeight: 800 }}>{card.title}</h3>
            <p style={{ margin: 0, color: BRAND.muted, fontSize: 15, lineHeight: 1.6, flexGrow: 1 }}>{card.description}</p>

            <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8, color: BRAND.accent, fontWeight: 800, fontSize: 15 }}>
              <span>إرسال طلب التوليد</span>
              <span style={{ fontSize: 18 }}>←</span>
            </div>
          </div>
        ))}
      </div>

      {/* Reports Log Section */}
      <div style={{ padding: '0 24px', marginTop: 40 }}>
        <div
          onClick={() => setIsLogOpen(!isLogOpen)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '10px 0',
            marginBottom: 10
          }}
        >
          <h2 style={{ margin: 0, color: BRAND.primary, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 12 }}>
            📜 سجل التقارير المنشأة
          </h2>
          <div style={{
            fontSize: 24,
            transition: 'transform 0.3s ease',
            transform: isLogOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: BRAND.primary
          }}>
            ▼
          </div>
        </div>

        {isLogOpen && (
          <div className="glass-panel" style={{ padding: '24px 32px' }}>
            {/* Bulk Actions Bar */}
            {reports.length > 0 && (
              <div style={{
                marginBottom: 20,
                padding: '16px 24px',
                background: '#f8fafc',
                borderRadius: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === reports.length && reports.length > 0}
                    onChange={toggleSelectAll}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: 700, color: BRAND.primary, fontSize: 14 }}>تحديد الكل ({reports.length})</span>
                </div>

                {selectedIds.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    style={{
                      padding: '8px 20px',
                      background: '#fee2e2',
                      color: '#ef4444',
                      border: '1px solid #fecaca',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: '0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#fecaca'}
                    onMouseOut={e => e.currentTarget.style.background = '#fee2e2'}
                  >
                    <span>🗑️ حذف المحدد ({selectedIds.length})</span>
                  </button>
                )}
              </div>
            )}

            {isLoadingReports ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: BRAND.muted }}>
                <div style={{ fontSize: 40, animation: 'spin 2s linear infinite', marginBottom: 16 }}>⏳</div>
                <p>جاري تحميل السجل...</p>
              </div>
            ) : reports.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: BRAND.muted }}>
                <p style={{ fontSize: 18 }}>لا توجد تقارير منشأة حالياً</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="log-table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}></th>
                      <th>رقم التقرير</th>

                      <th>العنوان</th>
                      <th>النوع</th>
                      <th>التاريخ</th>
                      <th>الحالة</th>
                      <th>إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report._id} style={{ background: selectedIds.includes(report._id) ? '#f0fdfa' : 'transparent' }}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(report._id)}
                            onChange={() => toggleSelectOne(report._id)}
                            style={{ width: 16, height: 16, cursor: 'pointer' }}
                          />
                        </td>
                        <td style={{ fontWeight: 600, color: BRAND.primary }}>{report.reportNumber}</td>

                        <td>{report.title}</td>
                        <td>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '8px',
                            background: '#f1f5f9',
                            fontSize: '13px',
                            color: BRAND.primary,
                            fontWeight: 600
                          }}>
                            {report.reportType === 'invoice' ? 'فاتورة' : 'تقرير'}
                          </span>
                        </td>
                        <td>{new Date(report.createdAt).toLocaleDateString('ar-SA')}</td>
                        <td>
                          <span style={{ color: '#10b981', fontWeight: 600 }}>● مكتمل</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => setSelectedReport(report)}
                              style={{ padding: '8px', border: 'none', background: '#ecfdf5', color: '#10b981', borderRadius: '10px', cursor: 'pointer' }}
                            >
                              👁️
                            </button>

                            <button
                              onClick={() => deleteReport(report._id)}
                              style={{ padding: '8px', border: 'none', background: '#fef2f2', color: '#ef4444', borderRadius: '10px', cursor: 'pointer' }}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>



      {/* Info Panel */}
      <div style={{ padding: '0 24px' }}>
        <div className="glass-panel" style={{
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          background: 'rgba(255, 255, 255, 0.4)',
          borderStyle: 'dashed'
        }}>
          <div style={{ fontSize: 32 }}>💡</div>
          <div>
            <h4 style={{ margin: '0 0 4px', color: BRAND.primary, fontWeight: 800 }}>نظام التقارير الذكي</h4>
            <p style={{ margin: 0, color: BRAND.muted, fontSize: 14, lineHeight: 1.6 }}>
              يتم العمل حالياً على أتمتة تصدير التقارير بصيغ PDF و Excel المعتمدة رسمياً. يمكنك مراجعة البيانات في لوحة المعلومات حتى يكتمل ربط المحرك الطباعي.
            </p>
          </div>
        </div>
      </div>

      {/* Report Preview Modal */}
      {selectedReport && (
        <div className="preview-modal-overlay no-print" onClick={() => setSelectedReport(null)}>
          <div className="preview-modal-content" onClick={e => e.stopPropagation()}>
            {/* Modal Actions */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f8fafc'
            }}>
              <h3 style={{ margin: 0, fontWeight: 800, color: BRAND.primary }}>معاينة المستند</h3>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={handlePrint}
                  style={{
                    padding: '10px 20px',
                    background: BRAND.gradient,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 4px 12px rgba(42,157,143,0.3)'
                  }}
                >
                  <span>🖨️ طباعة / حفظ PDF</span>
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  style={{
                    padding: '10px',
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    cursor: 'pointer'
                  }}
                >
                  ❌
                </button>
              </div>
            </div>

            {/* Document Proper */}
            <div id="printable-area" className="report-document">
              <div className="report-header">
                <div>
                  <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: BRAND.primary }}>شركة النعيمي للمقاولات</h1>
                  <p style={{ margin: '5px 0 0', color: BRAND.muted, fontWeight: 600 }}>إدارة المشاريع والتوريدات الذكية</p>
                  <div style={{ marginTop: 20, fontSize: 14 }}>
                    <p style={{ margin: '2px 0' }}>تاريخ الإصدار: {new Date(selectedReport.createdAt).toLocaleDateString('ar-SA')}</p>
                    <p style={{ margin: '2px 0' }}>رقم المستند: <span style={{ fontWeight: 800 }}>{selectedReport.reportNumber}</span></p>
                  </div>
                </div>
                <div className="seal-box">
                  <div style={{ fontSize: 24, marginBottom: 5 }}>🏗️</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: BRAND.primary }}>مستند معتمد</div>
                </div>
              </div>

              <div style={{ textAlign: 'center', margin: '40px 0' }}>
                <h2 style={{
                  display: 'inline-block',
                  borderBottom: `2px solid ${BRAND.accent}`,
                  paddingBottom: 8,
                  fontSize: 24,
                  fontWeight: 900
                }}>
                  {selectedReport.title}
                </h2>
              </div>

              <div style={{ minHeight: 400 }}>
                <p style={{ lineHeight: 1.8, fontSize: 17, marginBottom: 30 }}>
                  تحية طيبة وبعد،،<br /><br />
                  نهديكم أفضل التحايا، ونفيدكم بأنه بناءً على السجلات الرسمية والعمليات الموثقة بنظام المؤسسة، قمنا بإصدار **{selectedReport.title}** المتضمن للتفاصيل الموضحة أدناه:
                </p>

                <div style={{
                  margin: '30px 0',
                  padding: '30px',
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}>
                  {(() => {
                    try {
                      // Try to use content first (JSON string), then fallback to data object
                      let content;
                      if (selectedReport.content) {
                        content = JSON.parse(selectedReport.content);
                      } else if (selectedReport.data) {
                        // Data is already an object if it comes from the API and was stored as Mixed
                        content = selectedReport.data;
                      } else {
                        return <p style={{ fontSize: 16, lineHeight: 1.8 }}>لا توجد تفاصيل إضافية متاحة لهذا التقرير.</p>;
                      }

                      if (content.summary) {
                        return (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
                            {Object.entries(content.summary).map(([key, val]) => (
                              <div key={key} style={{ padding: 20, background: '#f8fafc', borderRadius: 16, border: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: 14, color: BRAND.muted, marginBottom: 8, fontWeight: 600 }}>{key}</div>
                                <div style={{ fontSize: 22, fontWeight: 900, color: BRAND.primary }}>{val}</div>
                              </div>
                            ))}
                          </div>
                        );
                      }

                      if (Array.isArray(content.data) || Array.isArray(content.materials)) {
                        const list = content.data || content.materials;
                        if (list.length === 0) return <p style={{ textAlign: 'center', padding: 20, color: BRAND.muted }}>لا توجد بيانات مسجلة حالياً لهذا التقرير.</p>;

                        const keys = Object.keys(list[0] || {});
                        return (
                          <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr>
                                  {keys.map(k => <th key={k} style={{ padding: 15, borderBottom: '3px solid #f1f5f9', textAlign: 'right', fontSize: 15, color: BRAND.primary, fontWeight: 800 }}>{k}</th>)}
                                </tr>
                              </thead>
                              <tbody>
                                {list.map((row, i) => (
                                  <tr key={i}>
                                    {keys.map(k => <td key={k} style={{ padding: 15, borderBottom: '1px solid #f1f5f9', fontSize: 15 }}>{row[k]}</td>)}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      }

                      return <p style={{ fontSize: 16, lineHeight: 1.8 }}>{typeof content === 'string' ? content : JSON.stringify(content, null, 2)}</p>;
                    } catch (e) {
                      return <p style={{ whiteSpace: 'pre-wrap', fontSize: 16, lineHeight: 1.8 }}>{selectedReport.content || selectedReport.data || 'لا توجد بيانات'}</p>;
                    }
                  })()}
                  <br /><br />
                  <p style={{ margin: 0, fontSize: 14, color: BRAND.muted, fontStyle: 'italic' }}>
                    تم استخراج هذا المستند آلياً بناءً على قواعد البيانات المفتوحة للمقاول المسؤول، ويتم تحديثه دورياً حسب العمليات والمشتريات والمدفوعات المسجلة.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 70 }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 800, marginBottom: 10, color: BRAND.primary, fontSize: 18 }}>توقيع المقاول المسؤول</p>
                    <div className="signature-fakhma">النعيمي</div>
                    <div style={{ width: 180, height: 1, background: 'linear-gradient(to left, transparent, #daa520, transparent)', margin: '15px auto 0' }}></div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 800, marginBottom: 20, color: BRAND.primary, fontSize: 18 }}>الختم الرسمي للمؤسسة</p>
                    <div style={{
                      width: 120,
                      height: 120,
                      border: '3px double #daa520',
                      borderRadius: '50%',
                      margin: '0 auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#daa520',
                      fontSize: 14,
                      fontWeight: 900,
                      opacity: 0.6,
                      transform: 'rotate(15deg)'
                    }}>
                      <div style={{ textAlign: 'center', border: '1px solid #daa520', borderRadius: '50%', width: '85%', height: '85%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        النعيمي<br />مـعتمد
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div style={{
                marginTop: 60,
                paddingTop: 20,
                borderTop: '1px solid #e2e8f0',
                textAlign: 'center',
                fontSize: 12,
                color: BRAND.muted
              }}>
                صدر هذا المستند إلكترونياً ولا يحتاج إلى توقيع خطي - منصة شركة النعيمي للمقاولات
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

