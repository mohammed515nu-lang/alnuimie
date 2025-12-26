import React, { useState, useEffect, useRef } from "react";
import { projectsAPI, requestsAPI, usersAPI, materialsAPI, getUser } from "../../utils/api";
import { useNotifications } from "../../components/NotificationSystem";
import BRAND from '../../theme';

export default function AddProjectAndRequests() {
  const notifications = useNotifications();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [projectForm, setProjectForm] = useState({
    name: '',
    client: '',
    budget: '',
    description: '',
    location: '',
    startDate: '',
    expectedEndDate: '',
    notes: ''
  });
  const [activeTab, setActiveTab] = useState(1);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [completedTabs, setCompletedTabs] = useState(new Set());
  const [clientRequests, setClientRequests] = useState([]);
  const [clients, setClients] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Materials state
  const [materials, setMaterials] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({ name: '', quantity: '', unit: 'وحدة', cost: '' });

  // Engineers state
  const [engineers, setEngineers] = useState([]);
  const [newEngineer, setNewEngineer] = useState({ name: '', specialty: 'مدني', salary: '', phone: '', email: '', notes: '' });

  // Crews state
  const [crews, setCrews] = useState([]);
  const [newCrew, setNewCrew] = useState('');

  // Images state
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const user = getUser();
        const contractorId = user?.id || user?._id;

        const [requestsData, clientsData] = await Promise.all([
          requestsAPI.getAll({ status: 'pending' }),
          usersAPI.getAll({ role: 'client' })
        ]);

        const filteredRequests = Array.isArray(requestsData)
          ? requestsData.filter(req =>
            !req.contractor ||
            (req.contractor && (req.contractor._id || req.contractor) === contractorId) ||
            (typeof req.contractor === 'string' && req.contractor === contractorId)
          )
          : [];

        setClientRequests(filteredRequests);
        setClients(clientsData || []);

        try {
          const materialsData = await materialsAPI.getAll();
          setAvailableMaterials(materialsData || []);
        } catch (err) {
          console.error('Error fetching materials:', err);
        }
      } catch (err) {
        setError(err.message || 'حدث خطأ أثناء جلب البيانات');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const compressImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAddMaterial = (e) => {
    e.preventDefault();
    if (!newMaterial.name || !newMaterial.quantity || !newMaterial.cost) {
      notifications.warning('تحذير', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    const material = {
      id: Date.now(),
      name: newMaterial.name,
      quantity: parseFloat(newMaterial.quantity) || 0,
      unit: newMaterial.unit || 'وحدة',
      cost: parseFloat(newMaterial.cost) || 0
    };
    setMaterials([...materials, material]);
    setNewMaterial({ name: '', quantity: '', unit: 'وحدة', cost: '' });
    notifications.success('نجح', `تم إضافة المادة ${material.name}`);
  };

  const handleRemoveMaterial = (id) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const handleAddEngineer = (e) => {
    e.preventDefault();
    if (!newEngineer.name || !newEngineer.salary) {
      notifications.warning('تحذير', 'يرجى ملء اسم المهندس والراتب');
      return;
    }
    const engineer = {
      id: Date.now(),
      name: newEngineer.name,
      specialty: newEngineer.specialty,
      salary: parseFloat(newEngineer.salary) || 0,
      phone: newEngineer.phone || '',
      email: newEngineer.email || '',
      notes: newEngineer.notes || ''
    };
    setEngineers([...engineers, engineer]);
    setNewEngineer({ name: '', specialty: 'مدني', salary: '', phone: '', email: '', notes: '' });
    notifications.success('نجح', `تم إضافة المهندس ${engineer.name}`);
  };

  const handleRemoveEngineer = (id) => {
    setEngineers(engineers.filter(e => e.id !== id));
  };

  const handleAddCrew = (e) => {
    e.preventDefault();
    if (!newCrew.trim()) {
      notifications.warning('تحذير', 'يرجى إدخال اسم الفريق');
      return;
    }
    const crewName = newCrew.trim();
    setCrews([...crews, crewName]);
    setNewCrew('');
    notifications.success('نجح', `تم إضافة فريق ${crewName}`);
  };

  const handleRemoveCrew = (index) => {
    setCrews(crews.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    try {
      const newImageUrls = [];
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        try {
          const compressedBase64 = await compressImage(file);
          newImageUrls.push(compressedBase64);
        } catch (err) {
          console.error(`خطأ في ضغط الصورة ${file.name}:`, err);
          const reader = new FileReader();
          const promise = new Promise((resolve, reject) => {
            reader.onload = (event) => {
              newImageUrls.push(event.target.result);
              resolve();
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          await promise;
        }
      }
      setImages([...images, ...newImageUrls]);
      notifications.success('نجح', `تم رفع ${newImageUrls.length} صورة`);
    } catch (err) {
      notifications.error('خطأ', 'حدث خطأ أثناء رفع الصور');
      console.error('Error uploading images:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleProjectInput = (e) => {
    setProjectForm({ ...projectForm, [e.target.name]: e.target.value });
  };

  const handleTabChange = (tabId) => {
    if (activeTab < tabId) {
      setCompletedTabs(prev => new Set([...prev, activeTab]));
    }
    setActiveTab(tabId);
  };

  const saveProject = async (e) => {
    e.preventDefault();
    if (!projectForm.name || !projectForm.budget) {
      notifications.warning('تحذير', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    setIsSubmitting(true);
    try {
      const user = getUser();
      const projectData = {
        name: projectForm.name,
        client: projectForm.client || undefined,
        budget: parseFloat(projectForm.budget),
        description: projectForm.description || '',
        location: projectForm.location || '',
        startDate: projectForm.startDate ? new Date(projectForm.startDate) : undefined,
        expectedEndDate: projectForm.expectedEndDate ? new Date(projectForm.expectedEndDate) : undefined,
        notes: projectForm.notes || '',
        status: 'pending',
        contractor: user?.id || user?._id,
        createdBy: user?.id || user?._id,
        engineers: engineers.map(e => ({
          name: e.name,
          specialty: e.specialty,
          salary: e.salary,
          phone: e.phone,
          email: e.email,
          notes: e.notes
        })),
        crews: crews,
        materials: materials.map(m => ({
          name: m.name,
          quantity: m.quantity,
          unit: m.unit,
          cost: m.cost
        })),
        images: images
      };

      const result = await projectsAPI.create(projectData);
      notifications.success('نجح', `تم حفظ المشروع "${projectForm.name}" بنجاح`);

      setProjectForm({
        name: '',
        client: '',
        budget: '',
        description: '',
        location: '',
        startDate: '',
        expectedEndDate: '',
        notes: ''
      });
      setMaterials([]);
      setEngineers([]);
      setCrews([]);
      setImages([]);
      setActiveTab(1);
      setCompletedTabs(new Set());
      setShowProjectForm(false);
    } catch (err) {
      notifications.error('خطأ', err.message || 'حدث خطأ أثناء حفظ المشروع');
      console.error('Error creating project:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const accept = async (id) => {
    const request = clientRequests.find(r => (r._id || r.id) === id);
    if (!request) return;

    if (window.confirm(`هل أنت متأكد من قبول طلب "${request.title || request.name}"?`)) {
      try {
        const user = getUser();
        await requestsAPI.update(id, {
          status: 'approved',
          contractor: user?.id || user?._id,
          responseDate: new Date()
        });

        const projectData = {
          name: request.title || request.name,
          budget: request.budget || 0,
          description: request.description || '',
          location: request.location || '',
          client: request.client || request.clientId || (typeof request.client === 'object' ? request.client._id || request.client.id : request.client),
          contractor: user?.id || user?._id,
          status: 'pending',
          engineers: [],
          crews: [],
          materials: [],
          images: []
        };
        await projectsAPI.create(projectData);

        const updatedRequests = await requestsAPI.getAll({ status: 'pending' });
        setClientRequests(Array.isArray(updatedRequests) ? updatedRequests : []);

        notifications.success('نجح', `تم قبول الطلب وإنشاء مشروع جديد بنجاح`);
      } catch (err) {
        notifications.error('خطأ', err.message || 'حدث خطأ أثناء قبول الطلب');
        console.error('Error accepting request:', err);
      }
    }
  };

  const reject = async (id) => {
    const request = clientRequests.find(r => (r._id || r.id) === id);
    if (!request) return;

    if (window.confirm(`هل أنت متأكد من رفض طلب "${request.title || request.name}"?`)) {
      try {
        const user = getUser();
        await requestsAPI.update(id, {
          status: 'rejected',
          contractor: user?.id || user?._id,
          responseDate: new Date()
        });

        const updatedRequests = await requestsAPI.getAll({ status: 'pending' });
        setClientRequests(Array.isArray(updatedRequests) ? updatedRequests : []);

        notifications.warning('تم', 'تم رفض الطلب');
      } catch (err) {
        notifications.error('خطأ', err.message || 'حدث خطأ أثناء رفض الطلب');
        console.error('Error rejecting request:', err);
      }
    }
  };

  return (
    <div style={{
      direction: 'rtl',
      fontFamily: '"Outfit", "Cairo", sans-serif',
      paddingBottom: 40,
      minHeight: '100vh',
      position: 'relative'
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Cairo:wght@400;600;700;900&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        
        .glass-panel {
          background: ${BRAND.glass.background};
          backdrop-filter: ${BRAND.glass.blur};
          -webkit-backdrop-filter: ${BRAND.glass.blur};
          border: ${BRAND.glass.border};
          box-shadow: ${BRAND.glass.shadow};
        }

        
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.6);
        }

        .hover-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: ${BRAND.card};
        }
        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.08) !important;
        }


        .input-glass {
          background: ${BRAND.background} !important;
          color: ${BRAND.text} !important;
          border: 2px solid ${BRAND.border || 'rgba(226, 232, 240, 0.8)'} !important;
          transition: all 0.2s ease !important;
        }
        .input-glass:focus {
          background: ${BRAND.card} !important;
          border-color: ${BRAND.primary} !important;
          box-shadow: 0 0 0 4px ${BRAND.accent}20 !important;
        }

      `}</style>

      {/* Header */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        borderRadius: 24,
        marginBottom: 32,
        marginTop: 20,
        margin: '20px 24px 32px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        animation: 'fadeIn 0.6s ease-out'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 54,
            height: 54,
            borderRadius: 18,
            background: 'linear-gradient(135deg, #3A424F 0%, #2D3748 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            color: '#fff',
            boxShadow: '0 8px 16px rgba(58, 66, 79, 0.2)'
          }}>
            ➕
          </div>
          <div>
            <h1 style={{
              fontSize: 28,
              fontWeight: 800,
              color: BRAND.primary,
              margin: 0,
              letterSpacing: '-0.5px'
            }}>
              إضافة مشروع والطلبات
            </h1>
            <p style={{
              color: BRAND.muted,
              fontSize: 14,
              margin: '4px 0 0 0',
              fontWeight: 500
            }}>
              إدارة طلبات العملاء وبدء مشاريع جديدة
            </p>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: 24,
        padding: '0 24px',
        maxWidth: 1600,
        margin: '0 auto'
      }}>

        {/* Add Project Section */}
        <div className="glass-panel" style={{
          borderRadius: 24,
          padding: 32,
          animation: 'fadeIn 0.6s ease-out',
          animationDelay: '0.1s'
        }}>
          {!showProjectForm ? (
            <div
              className="hover-card"
              onClick={() => setShowProjectForm(true)}
              style={{
                cursor: 'pointer',
                padding: 40,
                borderRadius: 20,
                border: `2px dashed ${BRAND.primary}40`,
                background: BRAND.background,

                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
                height: '100%',
                justifyContent: 'center',
                minHeight: 300
              }}
            >
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: BRAND.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                color: '#fff',
                boxShadow: BRAND.shadows.lg
              }}>
                ➕
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: BRAND.primary }}>إضافة مشروع جديد</h3>
                <p style={{ margin: '8px 0 0', color: BRAND.muted }}>اضغط هنا للبدء في خطوات إضافة مشروع جديد</p>
              </div>
            </div>
          ) : (
            <>
              {/* Wizard Steps */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 32,
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 24,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: '#e2e8f0',
                  zIndex: 0
                }} />

                {[
                  { id: 1, label: 'الأساسية', icon: '1' },
                  { id: 2, label: 'المواد', icon: '2' },
                  { id: 3, label: 'الفريق', icon: '3' },
                  { id: 4, label: 'الصور', icon: '4' },
                  { id: 5, label: 'تأكيد', icon: '5' }
                ].map((step, idx) => (
                  <div key={step.id} style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer'
                  }} onClick={() => handleTabChange(step.id)}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: activeTab >= step.id ? BRAND.gradient : '#fff',
                      border: activeTab >= step.id ? 'none' : '3px solid #e2e8f0',
                      color: activeTab >= step.id ? '#fff' : BRAND.muted,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 18,
                      boxShadow: activeTab === step.id ? `0 0 0 5px ${BRAND.primary}20` : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      {activeTab > step.id ? '✓' : step.icon}
                    </div>
                    <span style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: activeTab >= step.id ? BRAND.primary : BRAND.muted
                    }}>{step.label}</span>
                  </div>
                ))}
              </div>

              {/* Form Content */}
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>

                {/* Step 1 */}
                {activeTab === 1 && (
                  <div style={{ display: 'grid', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, color: BRAND.primary }}>اسم المشروع</label>
                      <input className="input-glass" name="name" value={projectForm.name} onChange={handleProjectInput} placeholder="مثال: فيلا سكنية - حي الملقا" style={{ width: '100%', padding: 16, borderRadius: 12 }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, color: BRAND.primary }}>الميزانية ($)</label>
                        <input className="input-glass" name="budget" type="number" value={projectForm.budget} onChange={handleProjectInput} placeholder="0.00" style={{ width: '100%', padding: 16, borderRadius: 12 }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, color: BRAND.primary }}>العميل</label>
                        <select className="input-glass" name="client" value={projectForm.client} onChange={handleProjectInput} style={{ width: '100%', padding: 16, borderRadius: 12 }}>
                          <option value="">اختر عميل...</option>
                          {clients.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, color: BRAND.primary }}>الموقع</label>
                      <input className="input-glass" name="location" value={projectForm.location} onChange={handleProjectInput} placeholder="الموقع الجغرافي للمشروع" style={{ width: '100%', padding: 16, borderRadius: 12 }} />
                    </div>
                    <button onClick={() => handleTabChange(2)} style={{
                      marginTop: 10,
                      width: '100%',
                      padding: 16,
                      background: BRAND.primary,
                      color: '#fff',
                      borderRadius: 14,
                      border: 'none',
                      fontWeight: 700,
                      fontSize: 16,
                      cursor: 'pointer'
                    }}>التالي &nbsp; ←</button>
                  </div>
                )}

                {/* Step 2: Materials */}
                {activeTab === 2 && (
                  <div style={{ display: 'grid', gap: 20 }}>
                    <div style={{ padding: 20, background: 'rgba(255,255,255,0.5)', borderRadius: 16, border: '1px solid rgba(0,0,0,0.05)' }}>
                      <h4 style={{ margin: '0 0 16px', color: BRAND.primary }}>إضافة مواد أولية</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 10 }}>
                        <input className="input-glass" placeholder="اسم المادة" value={newMaterial.name} onChange={e => setNewMaterial({ ...newMaterial, name: e.target.value })} style={{ padding: 12, borderRadius: 10 }} />
                        <input className="input-glass" placeholder="الكمية" type="number" value={newMaterial.quantity} onChange={e => setNewMaterial({ ...newMaterial, quantity: e.target.value })} style={{ padding: 12, borderRadius: 10 }} />
                        <input className="input-glass" placeholder="التكلفة" type="number" value={newMaterial.cost} onChange={e => setNewMaterial({ ...newMaterial, cost: e.target.value })} style={{ padding: 12, borderRadius: 10 }} />
                        <button onClick={handleAddMaterial} style={{ background: BRAND.accent, color: '#fff', border: 'none', borderRadius: 10, padding: '0 20px', fontWeight: 700, cursor: 'pointer' }}>+</button>
                      </div>
                    </div>

                    <div style={{ background: BRAND.card, color: BRAND.text, borderRadius: 16, padding: '16px', maxHeight: 300, overflowY: 'auto' }}>

                      {materials.length === 0 ? <p style={{ textAlign: 'center', color: BRAND.muted }}>لم يتم إضافة مواد بعد</p> :
                        materials.map(m => (
                          <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                            <span style={{ fontWeight: 600, color: BRAND.dark }}>{m.name} <span style={{ fontSize: 12, color: BRAND.muted }}>({m.quantity} {m.unit})</span></span>
                            <span onClick={() => handleRemoveMaterial(m.id)} style={{ color: '#ef4444', cursor: 'pointer', fontWeight: 700 }}>×</span>
                          </div>
                        ))
                      }
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <button onClick={() => handleTabChange(1)} style={{ padding: 16, background: 'transparent', border: `2px solid ${BRAND.primary}`, color: BRAND.primary, borderRadius: 14, fontWeight: 700, cursor: 'pointer' }}>رجوع</button>
                      <button onClick={() => handleTabChange(3)} style={{ padding: 16, background: BRAND.primary, color: '#fff', borderRadius: 14, border: 'none', fontWeight: 700, cursor: 'pointer' }}>التالي ←</button>
                    </div>
                  </div>
                )}

                {/* Step 3: Team */}
                {activeTab === 3 && (
                  <div style={{ display: 'grid', gap: 20 }}>
                    <div style={{ padding: 20, background: 'rgba(255,255,255,0.5)', borderRadius: 16 }}>
                      <h4 style={{ margin: '0 0 16px', color: BRAND.primary }}>إضافة مهندس</h4>
                      <div style={{ display: 'grid', gap: 12 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <input className="input-glass" placeholder="الاسم" value={newEngineer.name} onChange={e => setNewEngineer({ ...newEngineer, name: e.target.value })} style={{ padding: 12, borderRadius: 10 }} />
                          <input className="input-glass" placeholder="الراتب" type="number" value={newEngineer.salary} onChange={e => setNewEngineer({ ...newEngineer, salary: e.target.value })} style={{ padding: 12, borderRadius: 10 }} />
                        </div>
                        <button onClick={handleAddEngineer} style={{ background: BRAND.accent, color: '#fff', border: 'none', borderRadius: 10, padding: 12, fontWeight: 700, cursor: 'pointer' }}>إضافة مهندس</button>
                      </div>
                    </div>

                    {/* Similar listing for Engineers */}
                    <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                      {engineers.map(e => (
                        <div key={e.id} style={{ padding: 10, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                          <span>{e.name}</span>
                          <span onClick={() => handleRemoveEngineer(e.id)} style={{ color: 'red', cursor: 'pointer' }}>×</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <button onClick={() => handleTabChange(2)} style={{ padding: 16, background: 'transparent', border: `2px solid ${BRAND.primary}`, color: BRAND.primary, borderRadius: 14, fontWeight: 700, cursor: 'pointer' }}>رجوع</button>
                      <button onClick={() => handleTabChange(4)} style={{ padding: 16, background: BRAND.primary, color: '#fff', borderRadius: 14, border: 'none', fontWeight: 700, cursor: 'pointer' }}>التالي ←</button>
                    </div>
                  </div>
                )}

                {/* Step 4: Images */}
                {activeTab === 4 && (
                  <div style={{ display: 'grid', gap: 20 }}>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: `2px dashed ${BRAND.primary}40`,
                        borderRadius: 16,
                        padding: 40,
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: 'rgba(255,255,255,0.5)'
                      }}
                    >
                      <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                      <div style={{ fontSize: 40, marginBottom: 10 }}>📷</div>
                      <p style={{ margin: 0, fontWeight: 600, color: BRAND.primary }}>اضغط لرفع الصور</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 10 }}>
                      {images.map((img, i) => (
                        <div key={i} style={{ position: 'relative', paddingTop: '100%', borderRadius: 10, overflow: 'hidden' }}>
                          <img src={img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button onClick={() => handleRemoveImage(i)} style={{ position: 'absolute', top: 4, left: 4, width: 24, height: 24, borderRadius: '50%', background: 'red', color: '#fff', border: 'none', cursor: 'pointer' }}>×</button>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <button onClick={() => handleTabChange(3)} style={{ padding: 16, background: 'transparent', border: `2px solid ${BRAND.primary}`, color: BRAND.primary, borderRadius: 14, fontWeight: 700, cursor: 'pointer' }}>رجوع</button>
                      <button onClick={() => handleTabChange(5)} style={{ padding: 16, background: BRAND.primary, color: '#fff', borderRadius: 14, border: 'none', fontWeight: 700, cursor: 'pointer' }}>التالي ←</button>
                    </div>
                  </div>
                )}

                {/* Step 5: Final Review */}
                {activeTab === 5 && (
                  <div style={{ display: 'grid', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, color: BRAND.primary }}>وصف المشروع</label>
                      <textarea className="input-glass" name="description" value={projectForm.description} onChange={handleProjectInput} rows={4} style={{ width: '100%', padding: 16, borderRadius: 12 }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, color: BRAND.primary }}>ملاحظات</label>
                      <textarea className="input-glass" name="notes" value={projectForm.notes} onChange={handleProjectInput} rows={2} style={{ width: '100%', padding: 16, borderRadius: 12 }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
                      <button onClick={() => handleTabChange(4)} style={{ padding: 16, background: 'transparent', border: `2px solid ${BRAND.primary}`, color: BRAND.primary, borderRadius: 14, fontWeight: 700, cursor: 'pointer' }}>رجوع</button>
                      <button onClick={saveProject} disabled={isSubmitting} style={{ padding: 16, background: BRAND.gradient, color: '#fff', borderRadius: 14, border: 'none', fontWeight: 700, cursor: 'pointer', boxShadow: BRAND.shadows.accent }}>
                        {isSubmitting ? 'جاري الحفظ...' : '✓ حفظ المشروع'}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </>
          )}
        </div>

        {/* Client Requests Section */}
        <div className="glass-panel" style={{
          borderRadius: 24,
          padding: 32,
          animation: 'fadeIn 0.6s ease-out',
          animationDelay: '0.2s',
          height: 'fit-content' // Don't stretch if not needed
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📥</div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: BRAND.primary }}>طلبات العملاء ({clientRequests.length})</h3>
          </div>

          <div style={{ display: 'grid', gap: 16 }}>
            {isLoading ? <p>جاري التحميل...</p> :
              clientRequests.length === 0 ? <p style={{ textAlign: 'center', color: BRAND.muted, padding: 20 }}>لا توجد طلبات جديدة</p> :
                clientRequests.map(req => (
                  <div key={req._id || req.id} className="hover-card" style={{
                    padding: 20,
                    borderRadius: 16,
                    background: BRAND.card,
                    color: BRAND.text,
                    border: `1px solid ${BRAND.border || '#f1f5f9'}`,

                    position: 'relative'
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: BRAND.dark, marginBottom: 4 }}>{req.title || req.name}</div>
                    <p style={{ margin: '0 0 12px', fontSize: 13, color: BRAND.muted }}>{req.description}</p>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                      <button onClick={() => accept(req._id || req.id)} style={{
                        padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer'
                      }}>✓ قبول</button>
                      <button onClick={() => reject(req._id || req.id)} style={{
                        padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer'
                      }}>✗ رفض</button>
                    </div>
                  </div>
                ))
            }
          </div>
        </div>

      </div>
    </div>
  );
}
