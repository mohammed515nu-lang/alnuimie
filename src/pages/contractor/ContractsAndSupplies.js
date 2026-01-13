import React, { useState, useEffect } from "react";
import Modal from "../../Modal";
import { contractsAPI, purchasesAPI, projectsAPI, usersAPI, suppliersAPI, materialsAPI, paymentsAPI, getUser } from "../../utils/api";
import { useNotifications } from "../../components/NotificationSystem";
import BRAND from "../../theme";

export default function ContractsAndSupplies() {
  const notifications = useNotifications();
  const [isContractModalOpen, setContractModalOpen] = useState(false);
  const [isSupplyModalOpen, setSupplyModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [contractForm, setContractForm] = useState({ client: '', project: '', value: '', date: '', startDate: '', endDate: '' });
  const [supplyForm, setSupplyForm] = useState({ supplier: '', material: '', qty: '', unitPrice: '', date: '' });
  const [clientContracts, setClientContracts] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [contractsData, purchasesData, projectsData, clientsData, suppliersData, materialsData] = await Promise.all([
        contractsAPI.getAll({ contractType: 'client' }),
        purchasesAPI.getAll(),
        projectsAPI.getAll(),
        usersAPI.getAll({ role: 'client' }),
        suppliersAPI.getAll(),
        materialsAPI.getAll()
      ]);
      setClientContracts(contractsData || []);
      setSupplies(purchasesData || []);
      setProjects(projectsData || []);
      setClients(clientsData || []);
      setSuppliers(suppliersData || []);
      setMaterials(materialsData || []);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء جلب البيانات');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const settleSupply = async (supply) => {
    if (isSubmitting) return;
    const amount = supply.totalAmount - (supply.paidAmount || 0);
    if (amount <= 0) {
      notifications.info('معلومة', 'هذا التوريد مسدد بالكامل');
      return;
    }

    const user = getUser();
    if (!user) {
      notifications.error('خطأ في الجلسة', 'يرجى تسجيل الدخول مرة أخرى');
      return;
    }

    setIsSubmitting(true);
    try {
      await paymentsAPI.create({
        supplier: supply.supplier?._id || supply.supplier,
        purchase: supply._id || supply.id,
        amount: amount,
        paymentDate: new Date(),
        notes: `سداد قيمة توريد: ${supply.purchaseNumber || '---'}`,
        createdBy: user.id || user._id
      });
      notifications.success('نجح', 'تم تسديد التوريد بنجاح');
      setSelectedSupply(null);
      fetchData();
    } catch (err) {
      notifications.error('خطأ', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleContractInput = (e) => {
    setContractForm({ ...contractForm, [e.target.name]: e.target.value });
  };

  const handleSupplyInput = (e) => {
    setSupplyForm({ ...supplyForm, [e.target.name]: e.target.value });
  };

  const addClientContract = async (e) => {
    e.preventDefault();
    if (!contractForm.client || !contractForm.project || !contractForm.value) {
      notifications.warning('تحذير', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    setIsSubmitting(true);
    try {
      getUser();
      const selectedClient = clients.find(c => (c._id || c.id) === contractForm.client || c.name === contractForm.client);
      const selectedProject = projects.find(p => (p._id || p.id) === contractForm.project || p.name === contractForm.project);

      if (!selectedClient || !selectedProject) {
        notifications.warning('تحذير', 'يرجى اختيار عميل ومشروع صحيحين');
        setIsSubmitting(false);
        return;
      }

      await contractsAPI.create({
        contractType: 'client',
        client: selectedClient._id || selectedClient.id,
        project: selectedProject._id || selectedProject.id,
        totalAmount: parseFloat(contractForm.value),
        startDate: contractForm.startDate ? new Date(contractForm.startDate) : new Date(),
        endDate: contractForm.endDate ? new Date(contractForm.endDate) : new Date(),
        status: 'active'
      });

      notifications.success('نجح', 'تم إضافة عقد العميل بنجاح');
      setContractForm({ client: '', project: '', value: '', date: '', startDate: '', endDate: '' });
      setContractModalOpen(false);
      const contractsData = await contractsAPI.getAll({ contractType: 'client' });
      setClientContracts(contractsData || []);
    } catch (err) {
      notifications.error('خطأ', err.message || 'حدث خطأ أثناء إضافة العقد');
      console.error('Error adding contract:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSupply = async (e) => {
    e.preventDefault();
    if (!supplyForm.supplier || !supplyForm.material || !supplyForm.qty || !supplyForm.unitPrice) {
      notifications.warning('تحذير', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    setIsSubmitting(true);
    try {
      const selectedSupplier = suppliers.find(s => (s._id || s.id) === supplyForm.supplier || s.name === supplyForm.supplier);
      const selectedMaterial = materials.find(m => (m._id || m.id) === supplyForm.material || m.name === supplyForm.material);

      if (!selectedSupplier || !selectedMaterial) {
        notifications.warning('تحذير', 'يرجى اختيار مورد ومادة صحيحين');
        setIsSubmitting(false);
        return;
      }

      await purchasesAPI.create({
        supplier: selectedSupplier._id || selectedSupplier.id,
        items: [{
          material: selectedMaterial._id || selectedMaterial.id,
          quantity: parseFloat(supplyForm.qty),
          unit: selectedMaterial.unit || 'وحدة',
          unitPrice: parseFloat(supplyForm.unitPrice)
        }],
        purchaseDate: supplyForm.date ? new Date(supplyForm.date) : new Date(),
        status: 'pending'
      });

      notifications.success('نجح', `تم إضافة توريد ${selectedMaterial.name} من ${selectedSupplier.name} بنجاح`);
      setSupplyForm({ supplier: '', material: '', qty: '', unitPrice: '', date: '' });
      setSupplyModalOpen(false);
      const purchasesData = await purchasesAPI.getAll();
      setSupplies(purchasesData || []);
    } catch (err) {
      notifications.error('خطأ', err.message || 'حدث خطأ أثناء إضافة التوريد');
      console.error('Error adding supply:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      active: { background: '#d1fae5', color: '#065f46', text: 'نشط' },
      pending: { background: '#fef3c7', color: '#92400e', text: 'قيد المعالجة' },
      delivered: { background: '#dbeafe', color: '#1e40af', text: 'تم التسليم' }
    };
    const style = styles[status] || styles.pending;
    return (
      <span style={{
        padding: '6px 14px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 700,
        background: style.background,
        color: style.color
      }}>
        {style.text}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', direction: 'rtl', fontFamily: '"Outfit", "Cairo", sans-serif' }}>
        <div style={{ fontSize: 60, animation: 'spin 2s linear infinite' }}>⏳</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginTop: 20, color: BRAND.primary }}>جاري تحميل البيانات...</div>
      </div>
    );
  }

  return (
    <div style={{
      direction: 'rtl',
      fontFamily: '"Outfit", "Cairo", sans-serif',
      minHeight: '100vh',
      paddingBottom: 40
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Cairo:wght@400;600;700;900&display=swap');
        
        .glass-panel {
          background: ${BRAND.glass.background};
          backdrop-filter: ${BRAND.glass.blur};
          border: ${BRAND.glass.border};
          box-shadow: ${BRAND.glass.shadow};
          border-radius: 24px;
        }


        .doc-card {
           background: ${BRAND.card};
           color: ${BRAND.text};
           border-radius: 20px;
           padding: 24px;
           border: 1px solid ${BRAND.border || 'rgba(0,0,0,0.05)'};
           transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
           position: relative;
           overflow: hidden;
        }
        .doc-card:hover {
           transform: translateY(-5px);
           background: ${BRAND.card};
           box-shadow: 0 12px 24px rgba(0,0,0,0.05);
           border-color: ${BRAND.accent};
        }


        .alert-glass {
           background: ${BRAND.background};
           color: ${BRAND.text};
           backdrop-filter: blur(8px);
           border-radius: 16px;
           padding: 16px 24px;
           margin-bottom: 24px;
           display: flex;
           align-items: center;
           gap: 16px;
           border-right: 6px solid;
           box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }


        .btn-glass {
           background: rgba(255,255,255,0.5);
           border: 1px solid rgba(0,0,0,0.05);
           padding: 10px 16px;
           border-radius: 12px;
           font-weight: 600;
           cursor: pointer;
           transition: all 0.2s;
        }
        .btn-glass:hover {
           background: ${BRAND.primary};
           color: #fff;
        }

        .input-glass {
           background: ${BRAND.background};
           color: ${BRAND.text};
           border: 2px solid ${BRAND.border || 'rgba(226, 232, 240, 0.8)'};
           padding: 14px 18px;
           border-radius: 14px;
           outline: none;
           width: 100%;
           transition: all 0.2s;
           font-family: inherit;
        }
        .input-glass:focus {
           background: ${BRAND.card};
           border-color: ${BRAND.accent};
        }

      `}</style>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, background: BRAND.background, zIndex: -2 }} />

      <div style={{ position: 'fixed', bottom: '-10%', right: '-5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(30, 58, 95, 0.05) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: -1 }} />

      {/* Header */}
      <div className="glass-panel" style={{
        margin: '20px 24px 32px',
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: BRAND.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
            📄
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: BRAND.primary }}>التعاقدات والتوريدات</h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: BRAND.muted, fontWeight: 500 }}>إدارة العقود القانونية وحركة التوريدات اللوجستية</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <button onClick={() => setContractModalOpen(true)} style={{ background: BRAND.gradient, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 700, cursor: 'pointer', boxShadow: BRAND.shadows.accent }}>
            ➕ عقد عميل جديد
          </button>
          <button onClick={() => setSupplyModalOpen(true)} style={{ background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 700, cursor: 'pointer' }}>
            📦 توريد جديد
          </button>
        </div>
      </div>

      {/* Notifications/Alerts */}
      <div style={{ padding: '0 24px' }}>
        {(() => {
          const now = new Date();
          const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          const expiringContracts = clientContracts.filter(c => c.endDate && new Date(c.endDate) <= thirtyDaysFromNow && new Date(c.endDate) >= now);
          const expiredContracts = clientContracts.filter(c => c.endDate && new Date(c.endDate) < now && (c.status === 'active' || c.status === 'draft'));

          return (
            <>
              {expiredContracts.length > 0 && (
                <div className="alert-glass" style={{ borderRightColor: '#ef4444' }}>
                  <div style={{ fontSize: 28 }}>⚠️</div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#991b1b' }}>عقود منتهية الصلاحية</div>
                    <div style={{ fontSize: 12, color: '#7f1d1d' }}>هناك {expiredContracts.length} عقد يتطلب تجديداً فورياً</div>
                  </div>
                </div>
              )}
              {expiringContracts.length > 0 && (
                <div className="alert-glass" style={{ borderRightColor: '#f59e0b' }}>
                  <div style={{ fontSize: 28 }}>⏰</div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#92400e' }}>عقود تقترب من الانتهاء</div>
                    <div style={{ fontSize: 12, color: '#78350f' }}>هناك {expiringContracts.length} عقد ينتهي خلال أقل من شهر</div>
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, padding: '0 24px 24px' }}>
        <div className="glass-panel" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ color: BRAND.muted, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>إجمالي قيمة العقود</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: BRAND.primary }}>${clientContracts.reduce((sum, c) => sum + (c.totalAmount || 0), 0).toLocaleString()}</div>
        </div>
        <div className="glass-panel" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ color: BRAND.muted, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>المبالغ المحصلة</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#10b981' }}>${clientContracts.reduce((sum, c) => sum + (c.paidAmount || 0), 0).toLocaleString()}</div>
        </div>
        <div className="glass-panel" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ color: BRAND.muted, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>قيمة التوريدات</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#f4a261' }}>${supplies.reduce((sum, s) => sum + (s.totalAmount || 0), 0).toLocaleString()}</div>
        </div>
        <div className="glass-panel" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ color: BRAND.muted, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>المبالغ المتبقية</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#ef4444' }}>${clientContracts.reduce((sum, c) => sum + ((c.totalAmount || 0) - (c.paidAmount || 0)), 0).toLocaleString()}</div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: 24, padding: '0 24px' }}>

        {/* Contracts Section */}
        <div className="glass-panel" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 30, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: 24 }}>📑</span>
            <h3 style={{ margin: 0, color: BRAND.primary, fontWeight: 800 }}>سجل عقود العمل</h3>
          </div>
          <div style={{ display: 'grid', gap: 16 }}>
            {clientContracts.map(c => (
              <div key={c._id || c.id} className="doc-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: BRAND.muted }}>#{c.contractNumber || c._id.slice(-6).toUpperCase()}</span>
                      {getStatusBadge(c.status)}
                    </div>
                    <h4 style={{ margin: '0 0 4px', color: BRAND.primary, fontSize: 18, fontWeight: 800 }}>{typeof c.client === 'object' ? c.client?.name : 'عميل غير معروف'}</h4>
                    <div style={{ color: BRAND.muted, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>📁 {typeof c.project === 'object' ? c.project?.name : 'مشروع غير محدد'}</div>
                    <div style={{ display: 'flex', gap: 20 }}>
                      <div>
                        <div style={{ fontSize: 11, color: BRAND.muted }}>قيمة العقد</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: BRAND.primary }}>${(c.totalAmount || 0).toLocaleString()}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: BRAND.muted }}>المتبقي</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#ef4444' }}>${((c.totalAmount || 0) - (c.paidAmount || 0)).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedContract(c)} className="btn-glass">عرض التقرير</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supplies Section */}
        <div className="glass-panel" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 30, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: 24 }}>🚚</span>
            <h3 style={{ margin: 0, color: BRAND.primary, fontWeight: 800 }}>كشوفات التوريد</h3>
          </div>
          <div style={{ display: 'grid', gap: 16 }}>
            {supplies.map(s => {
              const supplierName = typeof s.supplier === 'object' ? (s.supplier?.name || s.supplier?.companyName) : 'مورد';
              const firstItem = s.items?.[0];
              return (
                <div key={s._id || s.id} className="doc-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: BRAND.muted }}>{new Date(s.purchaseDate).toLocaleDateString('ar-SA')}</span>
                        {getStatusBadge(s.status)}
                      </div>
                      <h4 style={{ margin: '0 0 4px', color: BRAND.primary, fontSize: 18, fontWeight: 800 }}>{supplierName}</h4>
                      <div style={{ color: BRAND.accent, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>📦 {firstItem ? `${firstItem.quantity} ${firstItem.unit} - ${firstItem.material?.name || 'مواد'}` : 'لا توجد بيانات'}</div>
                      <div style={{ fontSize: 18, fontWeight: 900 }}>${(s.totalAmount || 0).toLocaleString()}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setSelectedSupply(s)} className="btn-glass">سند التوريد</button>
                      {(s.totalAmount - (s.paidAmount || 0)) > 0 && (
                        <button onClick={() => settleSupply(s)} className="btn-glass" style={{ background: BRAND.success, color: '#fff', borderColor: BRAND.success }}>سدد التوريد</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Modals Implementation with Glass Styling */}
      {selectedSupply && (
        <Modal isOpen={!!selectedSupply} onClose={() => setSelectedSupply(null)} title="سند توريد مواد">
          <div style={{ padding: 10 }}>
            <div className="glass-panel" style={{ padding: 24, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h4 style={{ margin: 0, color: BRAND.primary }}>مورد المواد</h4>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{typeof selectedSupply.supplier === 'object' ? (selectedSupply.supplier?.name || selectedSupply.supplier?.companyName) : 'مورد'}</div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 12, color: BRAND.muted }}>التاريخ</div>
                  <div style={{ fontWeight: 700 }}>{new Date(selectedSupply.purchaseDate).toLocaleDateString('ar-SA')}</div>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${BRAND.border || '#eee'}`, paddingTop: 16 }}>

                <h5 style={{ margin: '0 0 10px', color: BRAND.muted }}>المواد الموردة</h5>
                {selectedSupply.items?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: idx < selectedSupply.items.length - 1 ? '1px dashed #eee' : 'none' }}>
                    <div style={{ fontWeight: 600 }}>{item.material?.name || 'مادة'}</div>
                    <div>{item.quantity} {item.unit} × ${item.unitPrice}</div>
                    <div style={{ fontWeight: 700 }}>${item.total?.toLocaleString() || (item.quantity * item.unitPrice).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, paddingTop: 16, borderTop: `2px solid ${BRAND.border || '#eee'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <div style={{ fontSize: 14, fontWeight: 700 }}>الإجمالي المستحق:</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: BRAND.primary }}>${(selectedSupply.totalAmount || 0).toLocaleString()}</div>
              </div>

              {(selectedSupply.totalAmount - (selectedSupply.paidAmount || 0)) > 0 ? (
                <div style={{ marginTop: 20, padding: 15, background: BRAND.isDarkMode ? '#4c1d1d' : '#fff1f2', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: BRAND.isDarkMode ? '#fecdd3' : '#be123c', fontWeight: 700 }}>المتبقي للسداد: ${(selectedSupply.totalAmount - (selectedSupply.paidAmount || 0)).toLocaleString()}</div>

                  <button
                    onClick={() => settleSupply(selectedSupply)}
                    disabled={isSubmitting}
                    style={{ background: BRAND.success, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}
                  >
                    {isSubmitting ? 'جاري السداد...' : 'تسديد الآن'}
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: 20, padding: 15, background: '#f0fdf4', borderRadius: 12, textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>
                  ✅ تم سداد هذا التوريد بالكامل
                </div>
              )}
            </div>
            <button onClick={() => setSelectedSupply(null)} className="btn-main" style={{ width: '100%', padding: 14, borderRadius: 12, background: BRAND.primary, color: '#fff', border: 'none', fontWeight: 700 }}>إغلاق</button>
          </div>
        </Modal>
      )}

      {selectedContract && (
        <Modal size="large" isOpen={!!selectedContract} onClose={() => setSelectedContract(null)} title={`مراجعة العقد: ${selectedContract.contractNumber || '---'}`}>
          <div style={{ padding: 10 }}>
            <div className="glass-panel" style={{ padding: 24, marginBottom: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 40 }}>
                <div>
                  <h4 style={{ margin: '0 0 16px', color: BRAND.primary }}>تفاصيل الأطراف</h4>
                  <div style={{ display: 'grid', gap: 12 }}>
                    <div><span style={{ color: BRAND.muted, fontSize: 12 }}>الطرف الأول:</span> <strong style={{ display: 'block' }}>تكنولوجيا العمران للمقاولات</strong></div>
                    <div><span style={{ color: BRAND.muted, fontSize: 12 }}>الطرف الثاني:</span> <strong style={{ display: 'block' }}>{selectedContract.client?.name}</strong></div>
                    <div><span style={{ color: BRAND.muted, fontSize: 12 }}>المشروع المشمول:</span> <strong style={{ display: 'block' }}>{selectedContract.project?.name}</strong></div>
                  </div>
                </div>
                <div style={{ background: BRAND.background, borderRadius: 16, padding: 20 }}>
                  <h4 style={{ margin: '0 0 16px', color: BRAND.primary }}>البيانات الزمنية</h4>
                  <div style={{ display: 'grid', gap: 12 }}>
                    <div><span style={{ color: BRAND.muted, fontSize: 12 }}>تاريخ البدء:</span> <strong style={{ display: 'block' }}>{new Date(selectedContract.startDate).toLocaleDateString('ar-SA')}</strong></div>
                    <div><span style={{ color: BRAND.muted, fontSize: 12 }}>تاريخ الانتهاء:</span> <strong style={{ display: 'block' }}>{new Date(selectedContract.endDate).toLocaleDateString('ar-SA')}</strong></div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <div className="glass-panel" style={{ padding: 20, textAlign: 'center' }}>
                <p style={{ margin: '0 0 4px', fontSize: 12 }}>إجمالي التحاقد</p>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>${selectedContract.totalAmount?.toLocaleString()}</p>
              </div>
              <div className="glass-panel" style={{ padding: 20, textAlign: 'center', borderColor: '#10b981' }}>
                <p style={{ margin: '0 0 4px', fontSize: 12 }}>المحصل</p>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#10b981' }}>${selectedContract.paidAmount?.toLocaleString()}</p>
              </div>
              <div className="glass-panel" style={{ padding: 20, textAlign: 'center', borderColor: '#ef4444' }}>
                <p style={{ margin: '0 0 4px', fontSize: 12 }}>المتبقي التحصيله</p>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#ef4444' }}>${(selectedContract.totalAmount - selectedContract.paidAmount).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Contract Form Modal */}
      <Modal isOpen={isContractModalOpen} onClose={() => setContractModalOpen(false)} title="صياغة عقد مشروع جديد">
        <form onSubmit={addClientContract} style={{ display: 'grid', gap: 20 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700 }}>اختيار العميل</label>
            <select name="client" className="input-glass" onChange={handleContractInput} required>
              <option value="">اختر من القائمة...</option>
              {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700 }}>اختيار المشروع</label>
            <select name="project" className="input-glass" onChange={handleContractInput} required>
              <option value="">اختر المشروع المرتبط...</option>
              {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div style={{ display: 'grid', gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 700 }}>القيمة الإجمالية</label>
              <input type="number" name="value" className="input-glass" placeholder="0.00" onChange={handleContractInput} required />
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 700 }}>تاريخ البدء</label>
              <input type="date" name="startDate" className="input-glass" onChange={handleContractInput} required />
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 700 }}>تاريخ الانتهاء</label>
              <input type="date" name="endDate" className="input-glass" onChange={handleContractInput} required />
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} style={{ background: BRAND.gradient, color: '#fff', border: 'none', padding: 14, borderRadius: 14, fontWeight: 800 }}>
            {isSubmitting ? 'جاري الحفظ...' : 'اعتماد وحفظ العقد'}
          </button>
        </form>
      </Modal>

      {/* Supply Form Modal */}
      <Modal isOpen={isSupplyModalOpen} onClose={() => setSupplyModalOpen(false)} title="تسجيل توريد مواد">
        <form onSubmit={addSupply} style={{ display: 'grid', gap: 20 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700 }}>المورد</label>
            <select name="supplier" className="input-glass" onChange={handleSupplyInput} required>
              <option value="">اختر المورد...</option>
              {suppliers.map(s => <option key={s._id} value={s._id}>{s.name || s.companyName}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
            <div style={{ display: 'grid', gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 700 }}>المادة</label>
              <select name="material" className="input-glass" onChange={handleSupplyInput} required>
                <option value="">اختر المادة...</option>
                {materials.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 700 }}>الكمية</label>
              <input type="number" name="qty" className="input-glass" placeholder="0" onChange={handleSupplyInput} required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ display: 'grid', gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 700 }}>سعر الوحدة</label>
              <input type="number" name="unitPrice" className="input-glass" placeholder="0.00" onChange={handleSupplyInput} required />
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 700 }}>تاريخ التوريد</label>
              <input type="date" name="date" className="input-glass" onChange={handleSupplyInput} required />
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} style={{ background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)', color: '#fff', border: 'none', padding: 14, borderRadius: 14, fontWeight: 800 }}>
            {isSubmitting ? 'جاري الحفظ...' : 'تسجيل التوريد في المستودع'}
          </button>
        </form>
      </Modal>

    </div>
  );
}
