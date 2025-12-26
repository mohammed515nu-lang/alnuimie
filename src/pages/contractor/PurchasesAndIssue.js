import React, { useState, useEffect } from "react";
import { purchasesAPI, issuesAPI, projectsAPI, materialsAPI, suppliersAPI, getUser } from "../../utils/api";
import { useNotifications } from "../../components/NotificationSystem";
import BRAND from "../../theme";

export default function PurchasesAndIssue() {
  const notifications = useNotifications();
  const [purchaseForm, setPurchaseForm] = useState({ material: '', quantity: '', unitPrice: '', supplier: '' });
  const [issueForm, setIssueForm] = useState({ project: '', material: '', quantity: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // eslint-disable-line no-unused-vars

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [purchasesData, issuesData, projectsData, materialsData, suppliersData] = await Promise.all([
          purchasesAPI.getAll(),
          issuesAPI.getAll(),
          projectsAPI.getAll(),
          materialsAPI.getAll(),
          suppliersAPI.getAll()
        ]);

        // Sort and get recent purchases
        const sortedPurchases = (purchasesData || []).sort((a, b) =>
          new Date(b.purchaseDate || b.createdAt) - new Date(a.purchaseDate || a.createdAt)
        );
        setRecentPurchases(sortedPurchases.slice(0, 10));

        // Sort and get recent issues
        const sortedIssues = (issuesData || []).sort((a, b) =>
          new Date(b.issueDate || b.createdAt) - new Date(a.issueDate || a.createdAt)
        );
        setRecentIssues(sortedIssues.slice(0, 10));

        setProjects(projectsData || []);
        setMaterials(materialsData || []);
        setSuppliers(suppliersData || []);
      } catch (err) {
        setError(err.message || 'حدث خطأ أثناء جلب البيانات');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePurchaseInput = (e) => {
    setPurchaseForm({ ...purchaseForm, [e.target.name]: e.target.value });
  };

  const handleIssueInput = (e) => {
    setIssueForm({ ...issueForm, [e.target.name]: e.target.value });
  };

  const addPurchase = async (e) => {
    e.preventDefault();
    if (!purchaseForm.material || !purchaseForm.quantity || !purchaseForm.unitPrice || !purchaseForm.supplier) {
      notifications.warning('تحذير', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    const user = getUser();
    if (!user) {
      notifications.error('خطأ في الجلسة', 'يرجى تسجيل الدخول مرة أخرى');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedMaterial = materials.find(m => (m._id || m.id) === purchaseForm.material);
      const selectedSupplier = suppliers.find(s => (s._id || s.id) === purchaseForm.supplier);

      if (!selectedMaterial || !selectedSupplier) {
        notifications.warning('تحذير', 'يرجى اختيار مادة ومورد صحيحين');
        setIsSubmitting(false);
        return;
      }

      const quantity = parseFloat(purchaseForm.quantity);
      const unitPrice = parseFloat(purchaseForm.unitPrice);
      const itemTotal = quantity * unitPrice;

      const payload = {
        supplier: selectedSupplier._id || selectedSupplier.id,
        items: [{
          material: selectedMaterial._id || selectedMaterial.id,
          quantity: quantity,
          unit: selectedMaterial.unit || 'وحدة',
          unitPrice: unitPrice,
          total: itemTotal
        }],
        totalAmount: itemTotal,
        purchaseDate: new Date(),
        status: 'pending',
        createdBy: user.id || user._id
      };

      await purchasesAPI.create(payload);

      notifications.success('نجح', `تم تسجيل عملية شراء: ${selectedMaterial.name} - ${purchaseForm.quantity} ${selectedMaterial.unit || 'وحدة'}`);
      setPurchaseForm({ material: '', quantity: '', unitPrice: '', supplier: '' });

      // Refresh data
      const [purchasesData, materialsDataUpdated] = await Promise.all([
        purchasesAPI.getAll(),
        materialsAPI.getAll()
      ]);

      const sortedPurchases = (purchasesData || []).sort((a, b) =>
        new Date(b.purchaseDate || b.createdAt) - new Date(a.purchaseDate || a.createdAt)
      );
      setRecentPurchases(sortedPurchases.slice(0, 10));
      setMaterials(materialsDataUpdated || []);
    } catch (err) {
      notifications.error('خطأ', err.message || 'حدث خطأ أثناء تسجيل الشراء');
      console.error('Error adding purchase:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const issueMaterial = async (e) => {
    e.preventDefault();
    if (!issueForm.project || !issueForm.material || !issueForm.quantity) {
      notifications.warning('تحذير', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    const user = getUser();
    if (!user) {
      notifications.error('خطأ في الجلسة', 'يرجى تسجيل الدخول مرة أخرى');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedProject = projects.find(p => (p._id || p.id) === issueForm.project);
      const selectedMaterial = materials.find(m => (m._id || m.id) === issueForm.material);

      if (!selectedProject || !selectedMaterial) {
        notifications.warning('تحذير', 'يرجى اختيار مشروع ومادة صحيحين');
        setIsSubmitting(false);
        return;
      }

      const quantity = parseFloat(issueForm.quantity);
      if ((selectedMaterial.quantity || 0) < quantity) {
        notifications.warning('تحذير', `الكمية المتوفرة (${selectedMaterial.quantity || 0}) أقل من الكمية المطلوبة (${quantity})`);
        setIsSubmitting(false);
        return;
      }

      // Estimate price for issue record
      const unitPrice = selectedMaterial.pricePerUnit || 0;
      const itemTotal = quantity * unitPrice;

      const payload = {
        project: selectedProject._id || selectedProject.id,
        items: [{
          material: selectedMaterial._id || selectedMaterial.id,
          quantity: quantity,
          unit: selectedMaterial.unit || 'وحدة',
          unitPrice: unitPrice,
          total: itemTotal
        }],
        totalAmount: itemTotal,
        issueDate: new Date(),
        createdBy: user.id || user._id
      };

      await issuesAPI.create(payload);

      notifications.success('نجح', `تم صرف ${issueForm.quantity} ${selectedMaterial.unit || 'وحدة'} من ${selectedMaterial.name} لمشروع ${selectedProject.name}`);
      setIssueForm({ project: '', material: '', quantity: '' });

      // Refresh issues and materials
      const [issuesData, materialsDataFiltered] = await Promise.all([
        issuesAPI.getAll(),
        materialsAPI.getAll()
      ]);
      const sortedIssues = (issuesData || []).sort((a, b) =>
        new Date(b.issueDate || b.createdAt) - new Date(a.issueDate || a.createdAt)
      );
      setRecentIssues(sortedIssues.slice(0, 10));
      setMaterials(materialsDataFiltered || []);
    } catch (err) {
      notifications.error('خطأ', err.message || 'حدث خطأ أثناء صرف المواد');
      console.error('Error issuing material:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{
      direction: 'rtl',
      fontFamily: '"Outfit", "Cairo", sans-serif',
      minHeight: '100vh',
      paddingBottom: 40
    }}>
      {/* Dynamic Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Cairo:wght@400;600;700;900&display=swap');
        
        .glass-panel {
          background: ${BRAND.glass.background};
          backdrop-filter: ${BRAND.glass.blur};
          border: ${BRAND.glass.border};
          box-shadow: ${BRAND.glass.shadow};
          border-radius: 24px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }


        .input-glass {
          background: ${BRAND.background};
          color: ${BRAND.text};
          border: 2px solid ${BRAND.border || 'rgba(226, 232, 240, 0.8)'};
          padding: 14px 18px;
          border-radius: 14px;
          fontSize: 15px;
          outline: none;
          transition: all 0.2s ease;
          width: 100%;
          font-family: inherit;
        }
        .input-glass:focus {
          background: ${BRAND.card};
          border-color: ${BRAND.accent};
          box-shadow: 0 0 0 4px ${BRAND.accent}15;
        }


        .btn-gradient {
          background: ${BRAND.gradient};
          color: #fff;
          border: none;
          padding: 14px 28px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(42, 157, 143, 0.2);
        }
        .btn-gradient:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(42, 157, 143, 0.3);
        }
        .btn-gradient:active { transform: translateY(0); }

        .activity-card {
          background: ${BRAND.card};
          color: ${BRAND.text};
          border: 1px solid ${BRAND.border || 'rgba(255,255,255,0.4)'};
          border-radius: 16px;
          padding: 16px;
          transition: all 0.2s ease;
        }
        .activity-card:hover {
          background: ${BRAND.background};
          transform: translateX(-4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          border-color: ${BRAND.accent};
        }

      `}</style>

      {/* Background Decor */}
      <div style={{ position: 'fixed', inset: 0, background: BRAND.background, zIndex: -2 }} />
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(42, 157, 143, 0.08) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: -1 }} />


      {/* Header Section */}
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
          <div style={{ width: 48, height: 48, borderRadius: 14, background: BRAND.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff', boxShadow: '0 8px 16px rgba(42,157,143,0.3)' }}>
            🏗️
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: BRAND.primary }}>مشتريات وصرف المواد</h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: BRAND.muted, fontWeight: 500 }}>إدارة ومتابعة المخزون وعمليات التزويد للمشاريع</p>
          </div>
        </div>
      </div>

      {/* Forms Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: 24,
        padding: '0 24px 24px'
      }}>
        {/* Purchase Form Container */}
        <div className="glass-panel" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: 24 }}>🛒</span>
            <h3 style={{ margin: 0, color: BRAND.primary, fontWeight: 800 }}>تسجيل مشتريات</h3>
          </div>

          <form onSubmit={addPurchase} style={{ display: 'grid', gap: 20 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 700, color: BRAND.muted }}>المورد</label>
              <select name="supplier" value={purchaseForm.supplier} onChange={handlePurchaseInput} className="input-glass" required>
                <option value="">اختر المورد</option>
                {suppliers.map(s => (
                  <option key={s._id || s.id} value={s._id || s.id}>{s.name || s.companyName}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 700, color: BRAND.muted }}>المادة</label>
              <select name="material" value={purchaseForm.material} onChange={handlePurchaseInput} className="input-glass" required>
                <option value="">اختر المادة</option>
                {materials.map(m => (
                  <option key={m._id || m.id} value={m._id || m.id}>{m.name} ({m.unit || 'وحدة'})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 700, color: BRAND.muted }}>الكمية</label>
                <input name="quantity" type="number" step="0.01" value={purchaseForm.quantity} onChange={handlePurchaseInput} className="input-glass" placeholder="0" required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 700, color: BRAND.muted }}>سعر الوحدة ($)</label>
                <input name="unitPrice" type="number" step="0.01" value={purchaseForm.unitPrice} onChange={handlePurchaseInput} className="input-glass" placeholder="0" required />
              </div>
            </div>

            <button type="submit" className="btn-gradient" disabled={isSubmitting}>
              {isSubmitting ? '⏳ جاري الحفظ...' : '✓ تأكيد عملية الشراء'}
            </button>
          </form>
        </div>

        {/* Issue Form Container */}
        <div className="glass-panel" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: 24 }}>📤</span>
            <h3 style={{ margin: 0, color: BRAND.primary, fontWeight: 800 }}>صرف مواد لمشروع</h3>
          </div>

          <form onSubmit={issueMaterial} style={{ display: 'grid', gap: 20 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 700, color: BRAND.muted }}>اسم المشروع</label>
              <select name="project" value={issueForm.project} onChange={handleIssueInput} className="input-glass" required>
                <option value="">اختر المشروع</option>
                {projects.map(p => (
                  <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 700, color: BRAND.muted }}>المادة المطلوبة</label>
              <select name="material" value={issueForm.material} onChange={handleIssueInput} className="input-glass" required>
                <option value="">اختر المادة</option>
                {materials.map(m => (
                  <option key={m._id || m.id} value={m._id || m.id}>{m.name} ({m.quantity || 0} متوفر)</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 700, color: BRAND.muted }}>الكمية المراد صرفها</label>
              <input name="quantity" type="number" step="0.01" value={issueForm.quantity} onChange={handleIssueInput} className="input-glass" placeholder="0" required />
            </div>

            <button type="submit" className="btn-gradient" style={{ background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)', boxShadow: '0 4px 15px rgba(231,111,81,0.2)' }} disabled={isSubmitting}>
              {isSubmitting ? '⏳ جاري الصرف...' : '✓ تنفيذ عملية الصرف'}
            </button>
          </form>
        </div>
      </div>

      {/* Activity Logs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: 24,
        padding: '0 24px'
      }}>
        {/* Recent Purchases */}
        <div className="glass-panel" style={{ padding: 32 }}>
          <h3 style={{ margin: '0 0 24px', color: BRAND.primary, fontWeight: 800 }}>آخر المشتريات</h3>
          {recentPurchases.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: BRAND.muted }}>لا توجد بيانات</div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {recentPurchases.map(p => {
                const firstItem = p.items?.[0];
                const matName = firstItem?.material?.name || 'مادة';
                const suppName = p.supplier?.name || 'مورد';
                return (
                  <div key={p._id || p.id} className="activity-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: BRAND.primary }}>{matName}</div>
                        <div style={{ fontSize: 12, color: BRAND.muted, marginTop: 4 }}>
                          👤 {suppName} | 📅 {new Date(p.purchaseDate || p.createdAt).toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                      <div style={{ color: BRAND.accent, fontWeight: 800 }}>${(p.totalAmount || 0).toLocaleString()}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Issues */}
        <div className="glass-panel" style={{ padding: 32 }}>
          <h3 style={{ margin: '0 0 24px', color: BRAND.primary, fontWeight: 800 }}>آخر عمليات الصرف</h3>
          {recentIssues.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: BRAND.muted }}>لا توجد بيانات</div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {recentIssues.map(i => (
                <div key={i._id || i.id} className="activity-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: BRAND.primary }}>{i.project?.name || 'مشروع'}</div>
                      <div style={{ fontSize: 12, color: BRAND.muted, marginTop: 4 }}>
                        📦 {i.items?.[0]?.material?.name} × {i.items?.[0]?.quantity} | 📅 {new Date(i.issueDate || i.createdAt).toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                    <div style={{ fontSize: 18 }}>📤</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
