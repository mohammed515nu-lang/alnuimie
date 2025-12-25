import React, { useState, useEffect } from "react";
import Modal from "../../Modal";
import { materialsAPI } from "../../utils/api";
import { useNotifications } from "../../components/NotificationSystem";
<<<<<<< HEAD
import BRAND from "../../theme";

export default function InventoryMaterials() {
=======

const BRAND = {
  primary: '#1e3a5f',
  accent: '#2a9d8f',
  gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2a9d8f 50%, #264653 100%)',
  light: '#f8fafc',
  dark: '#0f172a',
  muted: '#64748b',
};

export default function InventoryMaterials(){
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
  const notifications = useNotifications();
  const [materials, setMaterials] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ name: '', unit: '', minStock: '', location: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // eslint-disable-line no-unused-vars

<<<<<<< HEAD
  const filteredMaterials = (materials || []).filter(m =>
=======
  const filteredMaterials = materials.filter(m => 
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

<<<<<<< HEAD
  const lowStockMaterials = (materials || []).filter(m => (m.quantity || m.stock || 0) < (m.minStock || 0));
=======
  const lowStockMaterials = materials.filter(m => (m.quantity || 0) < (m.minStock || 0));
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc

  const fetchMaterials = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await materialsAPI.getAll();
      setMaterials(data || []);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء جلب المواد');
      console.error('Error fetching materials:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    if (!newMaterial.name || !newMaterial.unit) {
      notifications.warning('تحذير', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    try {
      await materialsAPI.create({
        name: newMaterial.name,
        unit: newMaterial.unit,
        quantity: 0,
        minStock: parseFloat(newMaterial.minStock) || 0,
        location: newMaterial.location || 'المخزن الرئيسي'
      });
      setNewMaterial({ name: '', unit: '', minStock: '', location: '' });
      setModalOpen(false);
      notifications.success('نجح', 'تم إضافة المادة بنجاح');
      fetchMaterials();
    } catch (err) {
      notifications.error('خطأ', err.message || 'حدث خطأ أثناء إضافة المادة');
      console.error('Error adding material:', err);
    }
  };

  return (
<<<<<<< HEAD
    <div style={{
      direction: 'rtl',
      fontFamily: '"Outfit", "Cairo", sans-serif',
      minHeight: '100vh',
      paddingBottom: 40
    }}>
      {/* Dynamic Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Cairo:wght@400;600;700;900&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }

        .glass-panel {
          background: ${BRAND.glass.background};
          backdrop-filter: ${BRAND.glass.blur};
          border: ${BRAND.glass.border};
          box-shadow: ${BRAND.glass.shadow};
          border-radius: 24px;
        }


        .stat-card {
           padding: 24px;
           border-radius: 20px;
           background: ${BRAND.card};
           color: ${BRAND.text};
           border: 1px solid ${BRAND.border || 'rgba(148, 163, 184, 0.1)'};
           transition: all 0.3s ease;
        }
        .stat-card:hover {
           transform: translateY(-4px);
           background: ${BRAND.card};
           box-shadow: BRAND.shadows?.md || 0 10px 30px rgba(0,0,0,0.05);
        }


        .input-glass {
           background: ${BRAND.background};
           color: ${BRAND.text};
           border: 2px solid ${BRAND.border || 'rgba(226, 232, 240, 0.8)'};
           padding: 12px 18px;
           border-radius: 14px;
           outline: none;
           transition: all 0.2s;
           font-family: inherit;
           width: 100%;
        }
        .input-glass:focus {
           background: ${BRAND.card};
           border-color: ${BRAND.accent};
           box-shadow: 0 0 0 4px ${BRAND.accent}15;
        }


        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { padding: 16px; color: ${BRAND.muted}; font-size: 13px; text-align: right; border-bottom: 2px solid rgba(0,0,0,0.05); }
        .data-table td { padding: 18px 16px; border-bottom: 1px solid rgba(0,0,0,0.03); transition: all 0.2s; }
        .tr-hover:hover { background: rgba(255,255,255,0.7); }
      `}</style>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, background: BRAND.background, zIndex: -2 }} />
      <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(42, 157, 143, 0.08) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: -1 }} />


      {/* Header */}
      <div className="glass-panel" style={{
        margin: '20px 24px 32px',
        padding: '28px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20,
        animation: 'fadeIn 0.5s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: BRAND.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff', boxShadow: '0 8px 16px rgba(42,157,143,0.3)' }}>
            📦
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: BRAND.primary }}>المخازن والمواد</h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: BRAND.muted, fontWeight: 500 }}>متابعة المخزون، الكميات المتاحة ومواقع التخزين</p>
          </div>
        </div>
        <button onClick={() => setModalOpen(true)} style={{
          background: BRAND.gradient, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 700, cursor: 'pointer', boxShadow: BRAND.shadows.accent, display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.3s'
        }}>
          <span>➕</span> إضافة مادة جديدة
        </button>
      </div>

      {/* Stats & Search Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, padding: '0 24px 24px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="stat-card">
            <div style={{ fontSize: 12, fontWeight: 700, color: BRAND.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>إجمالي الأنواع</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: BRAND.primary }}>{materials.length}</div>
          </div>
          <div className="stat-card">
            <div style={{ fontSize: 12, fontWeight: 700, color: BRAND.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>تنبيه نقص المخزون</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#ef4444' }}>{lowStockMaterials.length}</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="glass-panel" style={{ padding: 20, display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
            <input
              type="text"
              className="input-glass"
              placeholder="ابحث عن مادة أو موقع تخزين..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingRight: 45 }}
            />
          </div>
        </div>
      </div>

      {/* Materials Table Container */}
      <div style={{ padding: '0 24px' }}>
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: 80 }}>
              <div style={{ fontSize: 40, animation: 'spin 2s linear infinite' }}>⏳</div>
              <p style={{ color: BRAND.muted, marginTop: 16 }}>جاري تحميل بيانات المستودع...</p>
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 80 }}>
              <div style={{ fontSize: 60, opacity: 0.5 }}>📦</div>
              <h3 style={{ color: BRAND.primary, marginTop: 20 }}>لا توجد مواد مخزنة</h3>
              <p style={{ color: BRAND.muted }}>ابدأ بإضافة مواد جديدة لإدارة مخزونك</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>اسم المادة</th>
                    <th>الموقع</th>
                    <th>الكمية المتوفرة</th>
                    <th>الحد الأدنى</th>
                    <th style={{ textAlign: 'center' }}>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map(mat => {
                    const currentStock = mat.quantity || mat.stock || 0;
                    const isLow = currentStock <= (mat.minStock || 0);
                    return (
                      <tr key={mat._id || mat.id} className="tr-hover">
                        <td>
                          <div style={{ fontWeight: 700, color: BRAND.primary }}>{mat.name}</div>
                          <div style={{ fontSize: 12, color: BRAND.muted }}>{mat.unit}</div>
                        </td>
                        <td style={{ color: BRAND.dark, fontSize: 14 }}>
                          <span style={{ opacity: 0.6, marginLeft: 6 }}>📍</span>
                          {mat.location || 'غير محدد'}
                        </td>
                        <td style={{ fontWeight: 800, fontSize: 16, color: isLow ? '#ef4444' : BRAND.accent }}>
                          {currentStock.toLocaleString()} {mat.unit}
                        </td>
                        <td style={{ color: BRAND.muted, fontWeight: 600 }}>{mat.minStock || 0}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{
=======
    <div style={{ direction: 'rtl', fontFamily: 'Cairo, system-ui, Arial' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 30
      }}>
        <div>
          <h2 style={{
            fontWeight: 900,
            color: BRAND.primary,
            fontSize: 32,
            margin: '0 0 8px 0',
            letterSpacing: '-1px'
          }}>
            المخازن والمواد
          </h2>
          <p style={{ color: BRAND.muted, fontSize: 15, margin: 0 }}>
            إدارة المواد والمخزون في جميع المواقع
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            background: BRAND.gradient,
            color: '#fff',
            border: 0,
            borderRadius: 12,
            padding: '12px 24px',
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(42,157,143,0.3)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(42,157,143,0.4)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(42,157,143,0.3)';
          }}
        >
          <span>➕</span>
          <span>إضافة مادة</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 20,
        marginBottom: 24
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 4px 20px rgba(30,58,95,0.08)',
          border: '1px solid rgba(30,58,95,0.05)'
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: BRAND.primary, marginBottom: 6 }}>
            {materials.length}
          </div>
          <div style={{ color: BRAND.muted, fontSize: 14, fontWeight: 600 }}>إجمالي المواد</div>
        </div>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 4px 20px rgba(30,58,95,0.08)',
          border: '1px solid rgba(30,58,95,0.05)'
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#f59e0b', marginBottom: 6 }}>
            {lowStockMaterials.length}
          </div>
          <div style={{ color: BRAND.muted, fontSize: 14, fontWeight: 600 }}>مواد منخفضة المخزون</div>
        </div>
      </div>

      {/* Search */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        boxShadow: '0 4px 20px rgba(30,58,95,0.08)',
        border: '1px solid rgba(30,58,95,0.05)'
      }}>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 18,
            color: BRAND.muted
          }}>🔍</span>
          <input
            placeholder="ابحث عن مادة أو موقع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 45px',
              border: '2px solid #e5e7eb',
              borderRadius: 12,
              fontSize: 15,
              outline: 'none',
              transition: 'all 0.3s ease',
              background: BRAND.light
            }}
            onFocus={e => {
              e.target.style.borderColor = BRAND.accent;
              e.target.style.background = '#fff';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.background = BRAND.light;
            }}
          />
        </div>
      </div>

      {/* Materials Table */}
      <div style={{
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 4px 20px rgba(30,58,95,0.08)',
        overflow: 'hidden',
        border: '1px solid rgba(30,58,95,0.05)'
      }}>
        {filteredMaterials.length === 0 ? (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: BRAND.muted
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📭</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>لا توجد مواد</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{
                  background: BRAND.gradient,
                  color: '#fff'
                }}>
                  <th style={{
                    textAlign: 'right',
                    padding: 16,
                    fontWeight: 700,
                    fontSize: 14
                  }}>#</th>
                  <th style={{
                    textAlign: 'right',
                    padding: 16,
                    fontWeight: 700,
                    fontSize: 14
                  }}>المادة</th>
                  <th style={{
                    textAlign: 'right',
                    padding: 16,
                    fontWeight: 700,
                    fontSize: 14
                  }}>الوحدة</th>
                  <th style={{
                    textAlign: 'right',
                    padding: 16,
                    fontWeight: 700,
                    fontSize: 14
                  }}>المتوفر</th>
                  <th style={{
                    textAlign: 'right',
                    padding: 16,
                    fontWeight: 700,
                    fontSize: 14
                  }}>الحد الأدنى</th>
                  <th style={{
                    textAlign: 'right',
                    padding: 16,
                    fontWeight: 700,
                    fontSize: 14
                  }}>الموقع</th>
                  <th style={{
                    textAlign: 'center',
                    padding: 16,
                    fontWeight: 700,
                    fontSize: 14
                  }}>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map((r, i) => {
                  const isLowStock = r.stock < r.minStock;
                  return (
                    <tr
                      key={r.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = BRAND.light}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: 16, color: BRAND.muted, fontWeight: 600 }}>
                        {i + 1}
                      </td>
                      <td style={{
                        padding: 16,
                        fontWeight: 700,
                        color: BRAND.dark
                      }}>
                        {r.name}
                      </td>
                      <td style={{ padding: 16, color: BRAND.muted, fontWeight: 600 }}>
                        {r.unit}
                      </td>
                      <td style={{
                        padding: 16,
                        fontWeight: 700,
                        color: isLowStock ? '#ef4444' : BRAND.accent
                      }}>
                        {r.stock}
                      </td>
                      <td style={{ padding: 16, color: BRAND.muted, fontWeight: 600 }}>
                        {r.minStock}
                      </td>
                      <td style={{ padding: 16, color: BRAND.muted, fontSize: 14 }}>
                        📍 {r.location}
                      </td>
                      <td style={{ padding: 16, textAlign: 'center' }}>
                        {isLowStock ? (
                          <span style={{
                            display: 'inline-block',
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
                            padding: '6px 14px',
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 700,
<<<<<<< HEAD
                            background: isLow ? '#fee2e2' : '#d1fae5',
                            color: isLow ? '#991b1b' : '#065f46'
                          }}>
                            {isLow ? '⚠️ تنبيه نقص' : '✓ متوفر'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Material Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="إضافة صنف جديد للمخازن">
        <form onSubmit={handleAddMaterial} style={{ display: 'grid', gap: 20 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 700, color: BRAND.muted }}>اسم المادة</label>
            <input type="text" className="input-glass" placeholder="مثال: حديد تسلح 12 ملم" value={newMaterial.name} onChange={e => setNewMaterial({ ...newMaterial, name: e.target.value })} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 700, color: BRAND.muted }}>وحدة القياس</label>
              <input type="text" className="input-glass" placeholder="طن، كيس، متر..." value={newMaterial.unit} onChange={e => setNewMaterial({ ...newMaterial, unit: e.target.value })} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 700, color: BRAND.muted }}>حد الطلب الأدنى</label>
              <input type="number" className="input-glass" placeholder="0" value={newMaterial.minStock} onChange={e => setNewMaterial({ ...newMaterial, minStock: e.target.value })} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 700, color: BRAND.muted }}>موقع التخزين</label>
            <input type="text" className="input-glass" placeholder="المستودع الرئيسي، موقع المشروع..." value={newMaterial.location} onChange={e => setNewMaterial({ ...newMaterial, location: e.target.value })} />
          </div>

          <div style={{ marginTop: 10 }}>
            <button type="submit" className="btn-gradient" style={{ width: '100%' }}>
              ✓ إضافة المادة للمخزون
=======
                            background: '#fee2e2',
                            color: '#991b1b'
                          }}>
                            ⚠️ منخفض
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-block',
                            padding: '6px 14px',
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 700,
                            background: '#d1fae5',
                            color: '#065f46'
                          }}>
                            ✓ كافٍ
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Material Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="إضافة مادة جديدة">
        <form onSubmit={handleAddMaterial}>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              marginBottom: 8,
              color: BRAND.dark,
              fontWeight: 600,
              fontSize: 14
            }}>
              اسم المادة *
            </label>
            <input
              type="text"
              value={newMaterial.name}
              onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
              placeholder="مثال: حديد تسليح"
              required
              style={{
                width: '100%',
                padding: 14,
                border: '2px solid #e5e7eb',
                borderRadius: 12,
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.3s ease',
                background: BRAND.light
              }}
              onFocus={e => {
                e.target.style.borderColor = BRAND.accent;
                e.target.style.background = '#fff';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.background = BRAND.light;
              }}
            />
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginBottom: 20
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: 8,
                color: BRAND.dark,
                fontWeight: 600,
                fontSize: 14
              }}>
                الوحدة *
              </label>
              <input
                type="text"
                value={newMaterial.unit}
                onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                placeholder="مثال: طن"
                required
                style={{
                  width: '100%',
                  padding: 14,
                  border: '2px solid #e5e7eb',
                  borderRadius: 12,
                  fontSize: 15,
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  background: BRAND.light
                }}
                onFocus={e => {
                  e.target.style.borderColor = BRAND.accent;
                  e.target.style.background = '#fff';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.background = BRAND.light;
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: 8,
                color: BRAND.dark,
                fontWeight: 600,
                fontSize: 14
              }}>
                الحد الأدنى
              </label>
              <input
                type="number"
                value={newMaterial.minStock}
                onChange={(e) => setNewMaterial({ ...newMaterial, minStock: e.target.value })}
                placeholder="0"
                min="0"
                style={{
                  width: '100%',
                  padding: 14,
                  border: '2px solid #e5e7eb',
                  borderRadius: 12,
                  fontSize: 15,
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  background: BRAND.light
                }}
                onFocus={e => {
                  e.target.style.borderColor = BRAND.accent;
                  e.target.style.background = '#fff';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.background = BRAND.light;
                }}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              marginBottom: 8,
              color: BRAND.dark,
              fontWeight: 600,
              fontSize: 14
            }}>
              الموقع
            </label>
            <input
              type="text"
              value={newMaterial.location}
              onChange={(e) => setNewMaterial({ ...newMaterial, location: e.target.value })}
              placeholder="المخزن الرئيسي"
              style={{
                width: '100%',
                padding: 14,
                border: '2px solid #e5e7eb',
                borderRadius: 12,
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.3s ease',
                background: BRAND.light
              }}
              onFocus={e => {
                e.target.style.borderColor = BRAND.accent;
                e.target.style.background = '#fff';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.background = BRAND.light;
              }}
            />
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
            paddingTop: 20,
            borderTop: '2px solid ' + BRAND.light,
            marginTop: 24
          }}>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              style={{
                background: '#f1f5f9',
                color: BRAND.dark,
                border: 0,
                padding: '12px 28px',
                borderRadius: 12,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 15,
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.transform = 'none';
              }}
            >
              إلغاء
            </button>
            <button
              type="submit"
              style={{
                background: BRAND.gradient,
                color: '#fff',
                border: 0,
                padding: '12px 28px',
                borderRadius: 12,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 15,
                boxShadow: '0 4px 15px rgba(42,157,143,0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(42,157,143,0.4)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(42,157,143,0.3)';
              }}
            >
              إضافة المادة ✓
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
            </button>
          </div>
        </form>
      </Modal>
<<<<<<< HEAD

    </div>
  );
}
=======
    </div>
  );
}


>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
