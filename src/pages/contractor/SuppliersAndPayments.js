import React, { useState, useEffect, useCallback } from "react";
import Modal from "../../Modal";
import { suppliersAPI, paymentsAPI, purchasesAPI, getUser } from "../../utils/api";
import { useNotifications } from "../../components/NotificationSystem";
import StripePaymentForm from "../../components/StripePaymentForm";
import BRAND from "../../theme";

export default function SuppliersAndPayments() {
  const notifications = useNotifications();
  const currentUser = getUser();

  const [suppliers, setSuppliers] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [isSupplierModalOpen, setSupplierModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [paymentForm, setPaymentForm] = useState({ supplier: '', amount: '', date: new Date().toISOString().split('T')[0], method: 'cash' });
  const [supplierForm, setSupplierForm] = useState({ name: '', companyName: '', phone: '', email: '', address: '', totalPurchases: '' });
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [stripePaymentData, setStripePaymentData] = useState(null);
  
  // Calculate remaining balance for selected supplier
  const getSelectedSupplierRemaining = () => {
    if (!paymentForm.supplier) return 0;
    const supplier = suppliers.find(s => (s._id || s.id) === paymentForm.supplier);
    if (!supplier) return 0;
    return (supplier.totalPurchases || 0) - (supplier.totalPaid || 0);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching Suppliers and Payments...");
      const [suppliersRes, paymentsRes] = await Promise.all([
        suppliersAPI.getAll(),
        paymentsAPI.getAll()
      ]);

      const sData = Array.isArray(suppliersRes) ? suppliersRes : (suppliersRes?.data || []);
      const pData = Array.isArray(paymentsRes) ? paymentsRes : (paymentsRes?.data || []);

      setSuppliers(sData.filter(i => i && (i._id || i.id)));
      setRecentPayments(pData.filter(i => i && (i._id || i.id)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 15));

      console.log(`Loaded ${sData.length} suppliers and ${pData.length} payments.`);
    } catch (err) {
      setError(err.message || "فشل الاتصال بالسيرفر");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addSupplier = async (e) => {
    e.preventDefault();
    if (!supplierForm.name || !supplierForm.phone) {
      notifications.warning('بيانات ناقصة', 'الاسم والهاتف مطلوبان');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = getUser();
      if (!user) {
        notifications.error('خطأ في الجلسة', 'يرجى تسجيل الخروج والوصول مرة أخرى لضمان صحة البيانات');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        ...supplierForm,
        totalPurchases: parseFloat(supplierForm.totalPurchases) || 0,
        contractor: user.id || user._id // explicit assignment
      };

      console.log("Adding Supplier Payload:", payload);
      const res = await suppliersAPI.create(payload);
      console.log("Add Supplier Response:", res);

      notifications.success('نجاح', 'تمت إضافة المورد بنجاح');

      setSupplierForm({ name: '', companyName: '', phone: '', email: '', address: '', totalPurchases: '' });
      setSupplierModalOpen(false);

      // Refresh list
      await fetchData();
    } catch (err) {
      console.error("Add Supplier Error Details:", err);
      const errorMsg = err.details?.message || err.message || 'فشل حفظ المورد';
      const hint = err.hint ? `\nتلميح: ${err.hint}` : '';
      notifications.error('خطأ', errorMsg + hint);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitPayment = async (e) => {
    e.preventDefault();
    if (!paymentForm.supplier || !paymentForm.amount) {
      notifications.warning('بيانات ناقصة', 'يرجى اختيار المورد وإدخال المبلغ');
      return;
    }

    // Get selected supplier
    const selectedSupplier = suppliers.find(s => (s._id || s.id) === paymentForm.supplier);
    if (!selectedSupplier) {
      notifications.error('خطأ', 'المورد المحدد غير موجود');
      return;
    }

    // Calculate remaining balance
    const remainingBalance = (selectedSupplier.totalPurchases || 0) - (selectedSupplier.totalPaid || 0);
    const paymentAmount = parseFloat(paymentForm.amount);

    // Validate payment amount
    if (paymentAmount <= 0) {
      notifications.warning('مبلغ غير صالح', 'المبلغ يجب أن يكون أكبر من صفر');
      return;
    }

    if (remainingBalance <= 0) {
      notifications.info('معلومة', 'تم دفع كامل المبلغ لهذا المورد. لا يوجد رصيد متبقي');
      return;
    }

    if (paymentAmount > remainingBalance) {
      notifications.warning('مبلغ زائد', `المبلغ المدخل ($${paymentAmount.toLocaleString()}) أكبر من الرصيد المتبقي ($${remainingBalance.toLocaleString()})`);
      return;
    }

    // If Stripe payment, show Stripe form
    if (paymentForm.method === 'stripe') {
      setStripePaymentData({
        amount: paymentAmount,
        supplier: paymentForm.supplier,
        date: paymentForm.date
      });
      setShowStripePayment(true);
      return;
    }

    // Traditional payment methods (cash, bank-transfer, etc.)
    setIsSubmitting(true);
    try {
      await paymentsAPI.create({
        supplier: paymentForm.supplier,
        amount: parseFloat(paymentForm.amount),
        paymentDate: paymentForm.date,
        paymentMethod: paymentForm.method
      });
      const paidAmount = parseFloat(paymentForm.amount);
      notifications.success('تم السداد', `تم تسجيل الدفعة المالية: $${paidAmount.toLocaleString()}`);
      setPaymentForm({ supplier: '', amount: '', date: new Date().toISOString().split('T')[0], method: 'cash' });

      // Refresh data immediately to update balances
      await fetchData();
    } catch (err) {
      notifications.error('فشل', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStripePaymentSuccess = async (paymentIntent) => {
    setShowStripePayment(false);
    setStripePaymentData(null);
    const paidAmount = stripePaymentData?.amount || 0;
    setPaymentForm({ supplier: '', amount: '', date: new Date().toISOString().split('T')[0], method: 'cash' });
    notifications.success('نجح الدفع', `تم الدفع بنجاح: $${paidAmount.toLocaleString()} عبر Stripe`);
    // Refresh data immediately to update balances
    await fetchData();
  };

  const handleStripePaymentCancel = () => {
    setShowStripePayment(false);
    setStripePaymentData(null);
  };

  if (isLoading && suppliers.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', fontFamily: 'inherit' }}>
        <div style={{ fontSize: 40, animation: 'spin 1s linear infinite' }}>⚙️</div>
        <p style={{ marginTop: 20, fontWeight: 700, color: BRAND.primary }}>جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, direction: 'rtl', fontFamily: '"Outfit", "Cairo", sans-serif', maxWidth: 1400, margin: '0 auto' }}>
      <style>{`
        .glass-box { 
          background: ${BRAND.card}; 
          color: ${BRAND.text};
          border: 1px solid ${BRAND.border || '#eee'}; 
          border-radius: 20px; 
          padding: 25px; 
          box-shadow: 0 4px 6px rgba(0,0,0,0.02); 
        }
        .btn-main { background: ${BRAND.gradient}; color: #fff; border: none; padding: 12px 25px; border-radius: 12px; cursor: pointer; font-weight: 700; transition: 0.3s; }
        .btn-main:hover { opacity: 0.9; transform: scale(1.02); }
        .grid-main { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 25px; }
        @media (max-width: 900px) { .grid-main { grid-template-columns: 1fr; } }
        .input-fld { 
          width: 100%; 
          padding: 12px; 
          background: ${BRAND.background}; 
          color: ${BRAND.text};
          border: 1px solid ${BRAND.border || '#ddd'}; 
          border-radius: 10px; 
          margin-top: 5px; 
          outline: none; 
        }
        .input-fld:focus { border-color: ${BRAND.primary}; background: ${BRAND.card}; }
      `}</style>


      {/* Header */}
      <div className="glass-box" style={{ marginBottom: 25, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 15 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: BRAND.primary }}>💸 الموردون والسداد المالي</h1>
          <p style={{ margin: 0, color: BRAND.muted }}>إجمالي الموردين المسجلين: {suppliers.length}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setSupplierModalOpen(true)} className="btn-main">➕ إضافة مورد جديد</button>
          <button onClick={fetchData} style={{ background: BRAND.background, color: BRAND.text, border: `1px solid ${BRAND.border || '#ddd'}`, padding: '10px 15px', borderRadius: 12, cursor: 'pointer' }}>🔄 تحديث</button>
        </div>

      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: 15, borderRadius: 12, marginBottom: 25, fontWeight: 700 }}>⚠️ خطأ: {error}</div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 25 }}>
        <div className="glass-box" style={{ textAlign: 'center', borderBottom: `4px solid ${BRAND.primary}` }}>
          <div style={{ color: BRAND.muted, fontSize: 12 }}>إجمالي المديونية</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>${suppliers.reduce((s, i) => s + ((i.totalPurchases || 0) - (i.totalPaid || 0)), 0).toLocaleString()}</div>
        </div>
        <div className="glass-box" style={{ textAlign: 'center', borderBottom: `4px solid ${BRAND.success}` }}>
          <div style={{ color: BRAND.muted, fontSize: 12 }}>إجمالي المدفوعات</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: BRAND.success }}>${suppliers.reduce((s, i) => s + (i.totalPaid || 0), 0).toLocaleString()}</div>
        </div>
      </div>

      <div className="grid-main">
        {/* Suppliers List */}
        <div className="glass-box">
          <h2 style={{ fontSize: 20, marginBottom: 20 }}>🚛 قائمة الموردين</h2>
          {suppliers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 50, color: BRAND.muted }}>
              <div style={{ fontSize: 50 }}>🏜️</div>
              <p>لا يوجد موردون مسجلون حالياً. ابدأ بإضافة مورد جديد.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 15 }}>
              {suppliers.map(s => {
                const debt = (s.totalPurchases || 0) - (s.totalPaid || 0);
                return (
                  <div key={s._id || s.id} style={{ padding: 20, border: `1px solid ${BRAND.border || '#f1f5f9'}`, borderRadius: 15, background: BRAND.background, color: BRAND.text, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                    <div>
                      <div style={{ fontWeight: 900, fontSize: 17 }}>{s.name}</div>
                      <div style={{ color: BRAND.muted, fontSize: 13 }}>{s.companyName || '—'} | {s.phone}</div>
                      <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
                        <span style={{ fontSize: 11, background: '#eee', padding: '4px 8px', borderRadius: 5 }}>المشتريات: ${(s.totalPurchases || 0).toLocaleString()}</span>
                        <span style={{ fontSize: 11, background: debt > 0 ? '#fee2e2' : '#d1fae5', color: debt > 0 ? '#991b1b' : '#065f46', padding: '4px 8px', borderRadius: 5 }}>الدين: ${debt.toLocaleString()}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setPaymentForm({ ...paymentForm, supplier: s._id || s.id })} className="btn-main" style={{ padding: '8px 15px', fontSize: 13 }}>سداد</button>
                      <button onClick={() => setSelectedSupplier(s)} style={{ background: '#fff', border: '1px solid #ddd', padding: '8px 15px', borderRadius: 10, cursor: 'pointer', fontSize: 13 }}>تفاصيل</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
          <div className="glass-box">
            <h3 style={{ margin: '0 0 15px', fontSize: 18 }}>💰 تسجيل سداد مالي</h3>
            <form onSubmit={submitPayment}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600 }}>المورد</label>
                <select className="input-fld" value={paymentForm.supplier} onChange={e => setPaymentForm({ ...paymentForm, supplier: e.target.value, amount: '' })} required>
                  <option value="">-- اختر المورد --</option>
                  {suppliers.map(s => {
                    const debt = (s.totalPurchases || 0) - (s.totalPaid || 0);
                    return (
                      <option key={s._id || s.id} value={s._id || s.id}>
                        {s.name} {debt > 0 ? `(متبقي: $${debt.toLocaleString()})` : '(مسدد بالكامل)'}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Show remaining balance */}
              {paymentForm.supplier && (() => {
                const remaining = getSelectedSupplierRemaining();
                if (remaining <= 0) {
                  return (
                    <div style={{
                      marginTop: 15,
                      padding: '12px',
                      background: '#f0fdf4',
                      border: '2px solid #86efac',
                      borderRadius: 10,
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>✅ تم دفع كامل المبلغ</div>
                      <div style={{ fontSize: 11, color: '#16a34a', marginTop: 5 }}>لا يوجد رصيد متبقي</div>
                    </div>
                  );
                }
                return (
                  <div style={{
                    marginTop: 15,
                    padding: '12px',
                    background: remaining > 0 ? '#fff1f2' : '#f0fdf4',
                    border: `2px solid ${remaining > 0 ? '#fecdd3' : '#86efac'}`,
                    borderRadius: 10,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 11, color: BRAND.muted, marginBottom: 5 }}>الرصيد المتبقي</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: remaining > 0 ? '#be123c' : '#15803d' }}>
                      ${remaining.toLocaleString()}
                    </div>
                  </div>
                );
              })()}

              <div style={{ marginTop: 15 }}>
                <label style={{ fontSize: 12, fontWeight: 600 }}>المبلغ ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="input-fld" 
                  value={paymentForm.amount} 
                  onChange={e => {
                    const value = e.target.value;
                    const remaining = getSelectedSupplierRemaining();
                    if (value && parseFloat(value) > remaining) {
                      notifications.warning('تحذير', `المبلغ لا يمكن أن يتجاوز الرصيد المتبقي ($${remaining.toLocaleString()})`);
                    }
                    setPaymentForm({ ...paymentForm, amount: value });
                  }}
                  placeholder="0.00"
                  max={paymentForm.supplier ? getSelectedSupplierRemaining() : undefined}
                  required
                  disabled={paymentForm.supplier && getSelectedSupplierRemaining() <= 0}
                />
                {paymentForm.supplier && getSelectedSupplierRemaining() > 0 && (
                  <button
                    type="button"
                    onClick={() => setPaymentForm({ ...paymentForm, amount: getSelectedSupplierRemaining().toString() })}
                    style={{
                      marginTop: 8,
                      padding: '6px 12px',
                      background: BRAND.primary,
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 11,
                      cursor: 'pointer',
                      fontWeight: 600,
                      width: '100%'
                    }}
                  >
                    💰 دفع كامل الرصيد المتبقي
                  </button>
                )}
              </div>
              <div style={{ marginTop: 15 }}>
                <label style={{ fontSize: 12, fontWeight: 600 }}>طريقة الدفع</label>
                <select className="input-fld" value={paymentForm.method} onChange={e => setPaymentForm({ ...paymentForm, method: e.target.value })} required>
                  <option value="cash">نقدي</option>
                  <option value="bank-transfer">تحويل بنكي</option>
                  <option value="check">شيك</option>
                  <option value="stripe">💳 بطاقة ائتمانية (Stripe)</option>
                </select>
              </div>
              <div style={{ marginTop: 15 }}>
                <label style={{ fontSize: 12, fontWeight: 600 }}>التاريخ</label>
                <input type="date" className="input-fld" value={paymentForm.date} onChange={e => setPaymentForm({ ...paymentForm, date: e.target.value })} />
              </div>
              <button 
                type="submit" 
                disabled={
                  isSubmitting || 
                  !paymentForm.supplier || 
                  !paymentForm.amount || 
                  getSelectedSupplierRemaining() <= 0 ||
                  parseFloat(paymentForm.amount || 0) <= 0
                } 
                className="btn-main" 
                style={{ 
                  width: '100%', 
                  marginTop: 20,
                  opacity: (isSubmitting || !paymentForm.supplier || !paymentForm.amount || getSelectedSupplierRemaining() <= 0) ? 0.5 : 1,
                  cursor: (isSubmitting || !paymentForm.supplier || !paymentForm.amount || getSelectedSupplierRemaining() <= 0) ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'جاري الحفظ...' : 
                 getSelectedSupplierRemaining() <= 0 ? '✅ تم الدفع بالكامل' :
                 paymentForm.method === 'stripe' ? '💳 الدفع بالبطاقة' : 
                 '✅ تأكيد السداد'}
              </button>
            </form>
          </div>

          <div className="glass-box">
            <h3 style={{ margin: '0 0 15px', fontSize: 18 }}>📊 سجلات السداد الأخيرة</h3>
            {recentPayments.length === 0 ? <p style={{ textAlign: 'center', fontSize: 12, color: BRAND.muted }}>لا توجد سجلات</p> :
              recentPayments.map(p => {
                const s = suppliers.find(sup => (sup._id || sup.id) === (p.supplier?._id || p.supplier?._id || p.supplier));
                return (
                  <div key={p._id || p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f8fafc' }}>
                    <div style={{ fontSize: 13 }}>
                      <div style={{ fontWeight: 700 }}>{s?.name || 'مورد'}</div>
                      <div style={{ fontSize: 11, color: BRAND.muted }}>{new Date(p.paymentDate || p.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div style={{ fontWeight: 900, color: BRAND.success }}>+${p.amount.toLocaleString()}</div>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isSupplierModalOpen} onClose={() => setSupplierModalOpen(false)} title="إضافة مورد جديد">
        <form onSubmit={addSupplier} style={{ padding: 10 }}>
          <div style={{ display: 'grid', gap: 15 }}>
            <input type="text" className="input-fld" placeholder="اسم المورد" value={supplierForm.name} onChange={e => setSupplierForm({ ...supplierForm, name: e.target.value })} required />
            <input type="text" className="input-fld" placeholder="اسم الشركة" value={supplierForm.companyName} onChange={e => setSupplierForm({ ...supplierForm, companyName: e.target.value })} />
            <input type="tel" className="input-fld" placeholder="رقم الهاتف" value={supplierForm.phone} onChange={e => setSupplierForm({ ...supplierForm, phone: e.target.value })} required />
            <input type="email" className="input-fld" placeholder="البريد الإلكتروني" value={supplierForm.email} onChange={e => setSupplierForm({ ...supplierForm, email: e.target.value })} />
            <input type="number" className="input-fld" placeholder="الرصيد الافتتاحي (مشتريات سابقة) $" value={supplierForm.totalPurchases} onChange={e => setSupplierForm({ ...supplierForm, totalPurchases: e.target.value })} />
            <button type="submit" disabled={isSubmitting} className="btn-main" style={{ marginTop: 10 }}>{isSubmitting ? 'جاري الحفظ...' : 'حفظ المورد'}</button>
          </div>
        </form>
      </Modal>

      {selectedSupplier && (
        <Modal isOpen={!!selectedSupplier} onClose={() => setSelectedSupplier(null)} title="ملف المورد">
          <SupplierDetails supplier={selectedSupplier} onClose={() => setSelectedSupplier(null)} />
        </Modal>
      )}

      {showStripePayment && stripePaymentData && (
        <Modal isOpen={showStripePayment} onClose={handleStripePaymentCancel} title="💳 الدفع بالبطاقة الائتمانية" style={{ maxWidth: 500 }}>
          <StripePaymentForm
            amount={stripePaymentData.amount}
            supplier={stripePaymentData.supplier}
            onSuccess={handleStripePaymentSuccess}
            onCancel={handleStripePaymentCancel}
          />
        </Modal>
      )}
    </div>
  );
}

function SupplierDetails({ supplier, onClose }) {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSupplierHistory = async () => {
      try {
        const res = await purchasesAPI.getAll({ supplier: supplier._id || supplier.id });
        setPurchases(res || []);
      } catch (err) {
        console.error("Failed to fetch supplier history:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSupplierHistory();
  }, [supplier]);

  const debt = (supplier.totalPurchases || 0) - (supplier.totalPaid || 0);

  return (
    <div style={{ padding: 10 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40 }}>🏢</div>
        <h2 style={{ margin: '10px 0' }}>{supplier.name}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, margin: '20px 0' }}>
          <div style={{ background: BRAND.background, color: BRAND.text, padding: 12, borderRadius: 12, border: `1px solid ${BRAND.border || '#eee'}` }}>
            <div style={{ fontSize: 10, color: BRAND.muted }}>المشتريات</div>
            <div style={{ fontWeight: 900, fontSize: 14 }}>${(supplier.totalPurchases || 0).toLocaleString()}</div>
          </div>
          <div style={{ background: BRAND.background, color: BRAND.text, padding: 12, borderRadius: 12, border: `1px solid ${BRAND.border || '#eee'}` }}>
            <div style={{ fontSize: 10, color: BRAND.muted }}>المسدد</div>
            <div style={{ fontWeight: 900, fontSize: 14, color: BRAND.success }}>${(supplier.totalPaid || 0).toLocaleString()}</div>
          </div>
          <div style={{ background: debt > 0 ? (BRAND.isDarkMode ? '#4c1d1d' : '#fff1f2') : (BRAND.isDarkMode ? '#064e3b' : '#f0fdf4'), padding: 12, borderRadius: 12, border: `1px solid ${debt > 0 ? '#fecdd3' : '#bbf7d0'}` }}>

            <div style={{ fontSize: 10, color: debt > 0 ? '#e11d48' : '#16a34a' }}>المتبقي</div>
            <div style={{ fontWeight: 900, fontSize: 14, color: debt > 0 ? '#be123c' : '#15803d' }}>${debt.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3 style={{ fontSize: 15, borderBottom: '2px solid #eee', paddingBottom: 10, marginBottom: 15 }}>📋 سجل المشتريات الأخيرة</h3>
        {isLoading ? (
          <p style={{ textAlign: 'center', color: BRAND.muted, fontSize: 13 }}>جاري تحميل السجل...</p>
        ) : purchases.length === 0 ? (
          <p style={{ textAlign: 'center', color: BRAND.muted, fontSize: 13 }}>لا توجد مشتريات مسجلة لهذا المورد</p>
        ) : (
          <div style={{ maxHeight: 250, overflowY: 'auto', padding: 5 }}>
            {purchases.map(p => (
              <div key={p._id || p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: 12 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{p.items?.[0]?.material?.name || 'مادة'} ({p.items?.[0]?.quantity} {p.items?.[0]?.unit})</div>
                  <div style={{ fontSize: 10, color: BRAND.muted }}>{new Date(p.purchaseDate || p.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{ fontWeight: 800 }}>${(p.totalAmount || 0).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 20, fontSize: 13, color: BRAND.muted }}>
        <p>📍 العنوان: {supplier.address || '—'}</p>
        <p>📞 الهاتف: {supplier.phone || '—'}</p>
      </div>

      <button onClick={onClose} className="btn-main" style={{ width: '100%', marginTop: 25 }}>إغلاق</button>
    </div>
  );
}
