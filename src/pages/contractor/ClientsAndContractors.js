import React, { useState, useEffect } from "react";
import Modal from "../../Modal";
import { usersAPI, projectsAPI } from "../../utils/api";
import { useNotifications } from "../../components/NotificationSystem";
import BRAND from "../../theme";

export default function ClientsAndContractors() {
  const notifications = useNotifications();
  const [clients, setClients] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [isClientModalOpen, setClientModalOpen] = useState(false);
  const [isContractorModalOpen, setContractorModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [clientForm, setClientForm] = useState({ name: '', phone: '', email: '' });
  const [contractorForm, setContractorForm] = useState({ name: '', phone: '', email: '', specialization: '' });
  const [editForm, setEditForm] = useState({ name: '', phone: '', email: '', specialization: '' });
  const [editingPerson, setEditingPerson] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [personType, setPersonType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [newClientPassword, setNewClientPassword] = useState(null);
  const [newClientEmail, setNewClientEmail] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [clientsData, contractorsData, projectsData] = await Promise.all([
          usersAPI.getAll({ role: 'client' }),
          usersAPI.getAll({ role: 'contractor' }),
          projectsAPI.getAll()
        ]);
        setClients(clientsData || []);
        setContractors(contractorsData || []);
        setProjects(projectsData || []);
      } catch (err) {
        setError(err.message || 'حدث خطأ أثناء جلب البيانات');
        console.error('Error fetching users:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleClientInput = (e) => {
    setClientForm({ ...clientForm, [e.target.name]: e.target.value });
  };

  const handleContractorInput = (e) => {
    setContractorForm({ ...contractorForm, [e.target.name]: e.target.value });
  };

  const generatePassword = () => {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const addClient = async (e) => {
    e.preventDefault();
    if (!clientForm.name || !clientForm.phone || !clientForm.email) {
      notifications.warning('تحذير', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    try {
      const tempPassword = generatePassword();
      await usersAPI.create({
        name: clientForm.name,
        email: clientForm.email,
        phone: clientForm.phone,
        role: 'client',
        password: tempPassword
      });
      setNewClientPassword(tempPassword);
      setNewClientEmail(clientForm.email);
      setShowPasswordModal(true);
      notifications.success('نجح', `تم إضافة العميل ${clientForm.name} بنجاح`);
      setClientForm({ name: '', phone: '', email: '' });
      setClientModalOpen(false);
      const clientsData = await usersAPI.getAll({ role: 'client' });
      setClients(clientsData || []);
    } catch (err) {
      notifications.error('خطأ', err.message || 'حدث خطأ أثناء إضافة العميل');
      console.error('Error adding client:', err);
    }
  };

  const addContractor = async (e) => {
    e.preventDefault();
    if (!contractorForm.name || !contractorForm.phone || !contractorForm.email) {
      notifications.warning('تحذير', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    try {
      await usersAPI.create({
        name: contractorForm.name,
        email: contractorForm.email,
        phone: contractorForm.phone,
        role: 'contractor',
        password: 'temp123'
      });
      notifications.success('نجح', `تم إضافة المتعاقد ${contractorForm.name} بنجاح`);
      setContractorForm({ name: '', phone: '', email: '', specialization: '' });
      setContractorModalOpen(false);
      const contractorsData = await usersAPI.getAll({ role: 'contractor' });
      setContractors(contractorsData || []);
    } catch (err) {
      notifications.error('خطأ', err.message || 'حدث خطأ أثناء إضافة المتعاقد');
      console.error('Error adding contractor:', err);
    }
  };

  const showDetails = async (person, type) => {
    setSelectedPerson(person);
    setPersonType(type);
    try {
      let filteredProjects = [];
      const personId = person._id || person.id;
      const personName = person.name;

      const allProjects = await projectsAPI.getAll();
      if (type === 'client') {
        filteredProjects = (allProjects || []).filter(p => {
          const clientId = p.client?._id || p.client?.id || p.client;
          return clientId === personId || clientId === personName || p.client === personId || p.client === personName || (typeof p.client === 'string' && p.client.toLowerCase() === personName?.toLowerCase());
        });
      } else {
        filteredProjects = (allProjects || []).filter(p => {
          const contractorId = p.contractor?._id || p.contractor?.id || p.contractor;
          return contractorId === personId;
        });
      }

      const projectsCount = filteredProjects?.length || 0;
      const totalValue = filteredProjects?.reduce((sum, p) => sum + (p.budget || p.totalCost || 0), 0) || 0;

      setSelectedPerson({
        ...person,
        projectsCount,
        totalValue
      });
    } catch (err) {
      console.error('Error fetching projects:', err);
      setSelectedPerson({ ...person, projectsCount: 0, totalValue: 0 });
    }
  };

  const showEditModal = (person, type) => {
    setEditingPerson(person);
    setEditingType(type);
    setEditForm({
      name: person.name || '',
      phone: person.phone || '',
      email: person.email || '',
      specialization: person.specialization || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditInput = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const updatePerson = async (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.phone) {
      notifications.warning('تحذير', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    try {
      const personId = editingPerson._id || editingPerson.id;
      await usersAPI.update(personId, {
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email,
        ...(editingType === 'contractor' && { specialization: editForm.specialization })
      });
      notifications.success('نجح', `تم تحديث ${editingType === 'client' ? 'العميل' : 'المتعاقد'} بنجاح`);
      setIsEditModalOpen(false);
      setEditingPerson(null);
      setEditingType(null);
      const [clientsData, contractorsData] = await Promise.all([
        usersAPI.getAll({ role: 'client' }),
        usersAPI.getAll({ role: 'contractor' })
      ]);
      setClients(clientsData || []);
      setContractors(contractorsData || []);
    } catch (err) {
      notifications.error('خطأ', err.message || 'حدث خطأ أثناء التحديث');
      console.error('Error updating person:', err);
    }
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
      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Cairo:wght@400;600;700;900&display=swap');
        
        .glass-panel {
          background: ${BRAND.glass.background};
          backdrop-filter: ${BRAND.glass.blur};
          border: ${BRAND.glass.border};
          box-shadow: ${BRAND.glass.shadow};
          border-radius: 24px;
        }

        .person-card {
           background: ${BRAND.card};
           border-radius: 20px;
           padding: 24px;
           border: 1px solid ${BRAND.border || 'rgba(0,0,0,0.05)'};
           transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
           position: relative;
           overflow: hidden;
           color: ${BRAND.text};
        }

        .person-card:hover {
           transform: translateY(-5px);
           background: #fff;
           box-shadow: 0 12px 24px rgba(0,0,0,0.05);
           border-color: ${BRAND.accent};
        }

        .stat-badge {
           padding: 6px 12px;
           background: ${BRAND.background};
           border-radius: 12px;
           font-size: 13px;
           color: ${BRAND.primary};
           font-weight: 700;
           border: 1px solid ${BRAND.border || 'rgba(0,0,0,0.05)'};
        }


        .btn-glass {
           background: ${BRAND.background};
           color: ${BRAND.text};
           border: 1px solid ${BRAND.border || 'rgba(0,0,0,0.05)'};
           padding: 10px 16px;
           border-radius: 12px;
           font-weight: 600;
           cursor: pointer;
           transition: all 0.2s;
        }
        .btn-glass:hover {
           background: ${BRAND.accent};
           color: #fff;
           border-color: transparent;
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
        }
        .input-glass:focus {
           background: ${BRAND.card};
           border-color: ${BRAND.accent};
           box-shadow: 0 0 0 4px ${BRAND.accent}15;
        }

      `}</style>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, background: BRAND.background, zIndex: -2 }} />
      <div style={{ position: 'fixed', top: '10%', left: '-5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(42, 157, 143, 0.05) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: -1 }} />


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
          <div style={{ width: 48, height: 48, borderRadius: 14, background: BRAND.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 8px 16px rgba(42,157,143,0.3)' }}>
            👥
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: BRAND.primary }}>العملاء والمتعاقدون</h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: BRAND.muted, fontWeight: 500 }}>إدارة علاقات العملاء وشبكة المتعاقدين في مكان واحد</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <button onClick={() => setClientModalOpen(true)} style={{ background: BRAND.gradient, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 700, cursor: 'pointer', boxShadow: BRAND.shadows.accent, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>👤</span> إضافة عميل
          </button>
          <button onClick={() => setContractorModalOpen(true)} style={{ background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 16px rgba(231,111,81,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>🔧</span> إضافة متعاقد
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, padding: '0 24px 24px' }}>
        <div className="glass-panel" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ color: BRAND.muted, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>إجمالي العملاء</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: BRAND.primary }}>{clients.length}</div>
        </div>
        <div className="glass-panel" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ color: BRAND.muted, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>المتعاقدون</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#f4a261' }}>{contractors.length}</div>
        </div>
        <div className="glass-panel" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ color: BRAND.muted, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>قيمة التعاقدات</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: BRAND.accent }}>${projects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: 24, padding: '0 24px' }}>

        {/* Clients List */}
        <div className="glass-panel" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 30, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: 24 }}>🏢</span>
            <h3 style={{ margin: 0, color: BRAND.primary, fontWeight: 800 }}>قائمة العملاء</h3>
          </div>
          {clients.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: BRAND.muted }}>لا توجد بيانات</div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {clients.map(c => {
                const clientProjects = projects.filter(p => (p.client?._id || p.client) === (c._id || c.id));
                return (
                  <div key={c._id || c.id} className="person-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ margin: '0 0 6px', color: BRAND.primary, fontSize: 18, fontWeight: 800 }}>{c.name}</h4>
                        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                          <span style={{ fontSize: 13, color: BRAND.muted }}>📞 {c.phone}</span>
                          {c.email && <span style={{ fontSize: 13, color: BRAND.muted }}>✉️ {c.email}</span>}
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <div className="stat-badge">📁 {clientProjects.length} مشاريع</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <button onClick={() => showDetails(c, 'client')} className="btn-glass">تفاصيل</button>
                        <button onClick={() => showEditModal(c, 'client')} className="btn-glass" style={{ color: '#d97706' }}>تعديل</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Contractors List */}
        <div className="glass-panel" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 30, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <span style={{ fontSize: 24 }}>👷</span>
            <h3 style={{ margin: 0, color: BRAND.primary, fontWeight: 800 }}>المتعاقدون المعتمدون</h3>
          </div>
          {contractors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: BRAND.muted }}>لا توجد بيانات</div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {contractors.map(c => (
                <div key={c._id || c.id} className="person-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px', color: BRAND.primary, fontSize: 18, fontWeight: 800 }}>{c.name}</h4>
                      <div style={{ color: BRAND.accent, fontSize: 13, fontWeight: 700, marginBottom: 12 }}>🏷️ {c.specialization || 'مقاول عام'}</div>
                      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                        <span style={{ fontSize: 13, color: BRAND.muted }}>📞 {c.phone}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <button onClick={() => showDetails(c, 'contractor')} className="btn-glass">تفاصيل</button>
                      <button onClick={() => showEditModal(c, 'contractor')} className="btn-glass" style={{ color: '#d97706' }}>تعديل</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals are handled via the existing Modal component, applying glass styles via children */}

      {/* Detail Modal Content Redesigned Below */}
      {selectedPerson && (
        <Modal isOpen={!!selectedPerson} onClose={() => setSelectedPerson(null)} title={`الملف المهني: ${selectedPerson.name}`}>
          <div style={{ direction: 'rtl', padding: 10 }}>
            <div className="glass-panel" style={{ padding: 24, marginBottom: 20, background: 'rgba(30, 58, 95, 0.03)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <p style={{ margin: '0 0 5px', fontSize: 12, color: BRAND.muted }}>الاسم الكامل</p>
                  <p style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{selectedPerson.name}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px', fontSize: 12, color: BRAND.muted }}>التواصل</p>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{selectedPerson.phone}</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div className="glass-panel" style={{ padding: 16, textAlign: 'center' }}>
                <p style={{ margin: '0 0 8px', fontSize: 12 }}>عدد المشاريع</p>
                <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: BRAND.primary }}>{selectedPerson.projectsCount || 0}</p>
              </div>
              <div className="glass-panel" style={{ padding: 16, textAlign: 'center' }}>
                <p style={{ margin: '0 0 8px', fontSize: 12 }}>إجمالي العمليات</p>
                <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: BRAND.accent }}>${(selectedPerson.totalValue || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Forms Modals Implementation */}
      <Modal isOpen={isClientModalOpen} onClose={() => setClientModalOpen(false)} title="إضافة ملف عميل جديد">
        <form onSubmit={addClient} style={{ display: 'grid', gap: 20 }}>
          <input type="text" name="name" className="input-glass" placeholder="اسم العميل الكامل" onChange={handleClientInput} required />
          <input type="tel" name="phone" className="input-glass" placeholder="رقم الجوال" onChange={handleClientInput} required />
          <input type="email" name="email" className="input-glass" placeholder="البريد الإلكتروني" onChange={handleClientInput} required />
          <button type="submit" style={{ background: BRAND.gradient, color: '#fff', border: 'none', padding: 14, borderRadius: 14, fontWeight: 800 }}>إنشاء الملف والتحقق</button>
        </form>
      </Modal>

      {/* Password Share Modal */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="🔐 بيانات تسجيل الدخول">
        <div style={{ textAlign: 'center', padding: 20 }}>
          <p style={{ color: BRAND.muted, marginBottom: 20 }}>يرجى تسليم البيانات التالية للعميل ليتمكن من الدخول للمنصة:</p>
          <div className="glass-panel" style={{ padding: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 12 }}>البريد:</span>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace' }}>{newClientEmail}</div>
            </div>
            <div>
              <span style={{ fontSize: 12 }}>كلمة السر:</span>
              <div style={{ fontSize: 28, fontWeight: 900, color: BRAND.primary, letterSpacing: 2 }}>{newClientPassword}</div>
            </div>
          </div>
          <button onClick={() => { navigator.clipboard.writeText(`Email: ${newClientEmail}\nPassword: ${newClientPassword}`); notifications.success('نسخ', 'تم النسخ'); }}
            style={{ marginTop: 24, background: BRAND.light, border: `2px solid ${BRAND.accent}`, padding: '10px 20px', borderRadius: 10, fontWeight: 700 }}>
            📋 نسخ البيانات
          </button>
        </div>
      </Modal>

      {/* Edit Modal Refactored */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="تحديث البيانات">
        <form onSubmit={updatePerson} style={{ display: 'grid', gap: 20 }}>
          <input type="text" name="name" value={editForm.name} onChange={handleEditInput} className="input-glass" placeholder="الاسم" required />
          <input type="tel" name="phone" value={editForm.phone} onChange={handleEditInput} className="input-glass" placeholder="الهاتف" required />
          {editingType === 'contractor' && (
            <input type="text" name="specialization" value={editForm.specialization} onChange={handleEditInput} className="input-glass" placeholder="التخصص" />
          )}
          <button type="submit" style={{ background: BRAND.gradient, color: '#fff', border: 'none', padding: 14, borderRadius: 14, fontWeight: 800 }}>حفظ التغييرات</button>
        </form>
      </Modal>

    </div>
  );
}
