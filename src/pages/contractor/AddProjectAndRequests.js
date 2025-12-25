import React, { useState, useEffect, useRef } from "react";
import { projectsAPI, requestsAPI, usersAPI, materialsAPI, getUser } from "../../utils/api";
import { useNotifications } from "../../components/NotificationSystem";
<<<<<<< HEAD
import BRAND from '../../theme';

export default function AddProjectAndRequests() {
  const notifications = useNotifications();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [projectForm, setProjectForm] = useState({
    name: '',
    client: '',
    budget: '',
=======

const BRAND = {
  primary: '#1e3a5f',
  accent: '#2a9d8f',
  gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2a9d8f 50%, #264653 100%)',
  light: '#f8fafc',
  dark: '#0f172a',
  muted: '#64748b',
};

export default function AddProjectAndRequests(){
  const notifications = useNotifications();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [projectForm, setProjectForm] = useState({ 
    name: '', 
    client: '',
    budget: '', 
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    description: '',
    location: '',
    startDate: '',
    expectedEndDate: '',
    notes: ''
  });
<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState(1);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [completedTabs, setCompletedTabs] = useState(new Set());
=======
  const [activeTab, setActiveTab] = useState(1); // التبويبة النشطة
  const [showProjectForm, setShowProjectForm] = useState(false); // إظهار/إخفاء النموذج
  const [completedTabs, setCompletedTabs] = useState(new Set()); // التبويبات المكتملة
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
  const [clientRequests, setClientRequests] = useState([]);
  const [clients, setClients] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
<<<<<<< HEAD

=======
  
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
  // Materials state
  const [materials, setMaterials] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({ name: '', quantity: '', unit: 'وحدة', cost: '' });
<<<<<<< HEAD

  // Engineers state
  const [engineers, setEngineers] = useState([]);
  const [newEngineer, setNewEngineer] = useState({ name: '', specialty: 'مدني', salary: '', phone: '', email: '', notes: '' });

  // Crews state
  const [crews, setCrews] = useState([]);
  const [newCrew, setNewCrew] = useState('');

=======
  
  // Engineers state
  const [engineers, setEngineers] = useState([]);
  const [newEngineer, setNewEngineer] = useState({ name: '', specialty: 'مدني', salary: '', phone: '', email: '', notes: '' });
  
  // Crews state
  const [crews, setCrews] = useState([]);
  const [newCrew, setNewCrew] = useState('');
  
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
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
<<<<<<< HEAD

=======
        
        // جلب الطلبات المرسلة للمقاول الحالي أو المعلقة (بدون مقاول محدد)
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
        const [requestsData, clientsData] = await Promise.all([
          requestsAPI.getAll({ status: 'pending' }),
          usersAPI.getAll({ role: 'client' })
        ]);
<<<<<<< HEAD

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
=======
        
        // تصفية الطلبات: إما بدون مقاول محدد أو مرسلة للمقاول الحالي
        const filteredRequests = Array.isArray(requestsData) 
          ? requestsData.filter(req => 
              !req.contractor || 
              (req.contractor && (req.contractor._id || req.contractor) === contractorId) ||
              (typeof req.contractor === 'string' && req.contractor === contractorId)
            )
          : [];
        
        setClientRequests(filteredRequests);
        setClients(clientsData || []);
        
        // جلب المواد المتاحة
        try {
          const materialsData = await materialsAPI.getAll();
          setAvailableMaterials(materialsData || []);
      } catch (err) {
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
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

<<<<<<< HEAD
=======
  // دالة ضغط الصور
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
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
<<<<<<< HEAD

=======
  
  // إضافة مادة
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
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
<<<<<<< HEAD

  const handleRemoveMaterial = (id) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

=======
  
  const handleRemoveMaterial = (id) => {
    setMaterials(materials.filter(m => m.id !== id));
  };
  
  // إضافة مهندس
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
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
<<<<<<< HEAD

  const handleRemoveEngineer = (id) => {
    setEngineers(engineers.filter(e => e.id !== id));
  };

=======
  
  const handleRemoveEngineer = (id) => {
    setEngineers(engineers.filter(e => e.id !== id));
  };
  
  // إضافة فريق عمل
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
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
<<<<<<< HEAD

  const handleRemoveCrew = (index) => {
    setCrews(crews.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

=======
  
  const handleRemoveCrew = (index) => {
    setCrews(crews.filter((_, i) => i !== index));
  };
  
  // رفع الصور
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
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
<<<<<<< HEAD

=======
  
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleProjectInput = (e) => {
    setProjectForm({ ...projectForm, [e.target.name]: e.target.value });
  };
<<<<<<< HEAD

  const handleTabChange = (tabId) => {
    if (activeTab < tabId) {
=======
  
  // عند الانتقال بين التبويبات، نحدد التبويبة السابقة كمكتملة
  const handleTabChange = (tabId) => {
    if (activeTab < tabId) {
      // الانتقال للأمام - نحدد التبويبة الحالية كمكتملة
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
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
<<<<<<< HEAD

      const result = await projectsAPI.create(projectData);
      notifications.success('نجح', `تم حفظ المشروع "${projectForm.name}" بنجاح`);

      setProjectForm({
        name: '',
        client: '',
        budget: '',
=======
      
      console.log('📤 إرسال بيانات المشروع:', projectData);
      const result = await projectsAPI.create(projectData);
      console.log('✅ تم حفظ المشروع:', result);
      notifications.success('نجح', `تم حفظ المشروع "${projectForm.name}" بنجاح`);
      
      // إعادة تعيين جميع الحقول
      setProjectForm({ 
        name: '', 
        client: '',
        budget: '', 
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
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
<<<<<<< HEAD

    if (window.confirm(`هل أنت متأكد من قبول طلب "${request.title || request.name}"?`)) {
      try {
        const user = getUser();
        await requestsAPI.update(id, {
=======
    
    if (window.confirm(`هل أنت متأكد من قبول طلب "${request.title || request.name}"?`)) {
      try {
        const user = getUser();
        await requestsAPI.update(id, { 
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
          status: 'approved',
          contractor: user?.id || user?._id,
          responseDate: new Date()
        });
<<<<<<< HEAD

=======
        
        // Create project from approved request
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
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
<<<<<<< HEAD

        const updatedRequests = await requestsAPI.getAll({ status: 'pending' });
        setClientRequests(Array.isArray(updatedRequests) ? updatedRequests : []);

=======
        
        // Refresh requests list
        const updatedRequests = await requestsAPI.getAll({ status: 'pending' });
        setClientRequests(Array.isArray(updatedRequests) ? updatedRequests : []);
        
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
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
<<<<<<< HEAD

    if (window.confirm(`هل أنت متأكد من رفض طلب "${request.title || request.name}"?`)) {
      try {
        const user = getUser();
        await requestsAPI.update(id, {
=======
    
    if (window.confirm(`هل أنت متأكد من رفض طلب "${request.title || request.name}"?`)) {
      try {
        const user = getUser();
        await requestsAPI.update(id, { 
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
          status: 'rejected',
          contractor: user?.id || user?._id,
          responseDate: new Date()
        });
<<<<<<< HEAD

        const updatedRequests = await requestsAPI.getAll({ status: 'pending' });
        setClientRequests(Array.isArray(updatedRequests) ? updatedRequests : []);

=======
        
        // Refresh requests list
        const updatedRequests = await requestsAPI.getAll({ status: 'pending' });
        setClientRequests(Array.isArray(updatedRequests) ? updatedRequests : []);
        
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
        notifications.warning('تم', 'تم رفض الطلب');
      } catch (err) {
        notifications.error('خطأ', err.message || 'حدث خطأ أثناء رفض الطلب');
        console.error('Error rejecting request:', err);
      }
    }
  };

  return (
<<<<<<< HEAD
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

=======
    <div style={{ direction: 'rtl', fontFamily: 'Cairo, system-ui, Arial', padding: isMobile ? '16px 8px' : 0 }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: isMobile ? 20 : 30,
        padding: isMobile ? '0 8px' : 0
      }}>
        <div>
          <h2 style={{
            fontWeight: 900,
            color: BRAND.primary,
            fontSize: isMobile ? 24 : 32,
            margin: '0 0 8px 0',
            letterSpacing: '-1px'
          }}>
            إضافة مشروع + طلبات العملاء
          </h2>
          <p style={{ color: BRAND.muted, fontSize: isMobile ? 13 : 15, margin: 0 }}>
            إضافة مشروع جديد أو إدارة طلبات العملاء المعلقة
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: isMobile ? 16 : 24
      }}>
        {/* Add Project Form */}
        <div style={{
          background: '#fff',
          borderRadius: isMobile ? 16 : 20,
          boxShadow: '0 4px 20px rgba(30,58,95,0.08)',
          padding: isMobile ? 16 : 28,
          border: '1px solid rgba(30,58,95,0.05)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: isMobile ? 16 : 24,
            paddingBottom: 16,
            borderBottom: '2px solid ' + BRAND.light
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flex: 1,
              minWidth: isMobile ? '100%' : 'auto'
          }}>
            <div style={{
              width: isMobile ? 36 : 40,
              height: isMobile ? 36 : 40,
              borderRadius: 12,
              background: BRAND.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? 18 : 20,
              flexShrink: 0
            }}>
              ➕
            </div>
            <h3 style={{
              margin: 0,
              color: BRAND.primary,
              fontSize: isMobile ? 18 : 22,
              fontWeight: 800
            }}>
              إضافة مشروع جديد
            </h3>
            </div>
            {!showProjectForm && (
              <button
                onClick={() => setShowProjectForm(true)}
                style={{
                  padding: isMobile ? '10px 20px' : '12px 24px',
                  background: BRAND.gradient,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: isMobile ? 13 : 14,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(30,58,95,0.3)',
                  transition: 'all 0.3s ease',
                  width: isMobile ? '100%' : 'auto',
                  marginTop: isMobile ? 8 : 0
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(30,58,95,0.4)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(30,58,95,0.3)';
                }}
              >
                ➕ إضافة مشروع
              </button>
            )}
          </div>
          
          {showProjectForm && (
            <>
              {/* Progress Indicator - دوائر متسلسلة */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: isMobile ? 20 : 32,
                padding: isMobile ? '12px 8px' : '20px',
                background: BRAND.light,
                borderRadius: 16,
                position: 'relative',
                overflowX: isMobile ? 'auto' : 'visible',
                overflowY: 'hidden'
              }}>
                {[
                  { id: 1, label: 'معلومات أساسية', icon: '📋' },
                  { id: 2, label: 'المواد', icon: '🧱' },
                  { id: 3, label: 'المهندسين', icon: '👷' },
                  { id: 4, label: 'الصور', icon: '📷' },
                  { id: 5, label: 'إضافية', icon: '⚙️' }
                ].map((tab, index) => (
                  <React.Fragment key={tab.id}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: isMobile ? 4 : 8,
                      flex: 1,
                      position: 'relative',
                      zIndex: 2,
                      minWidth: isMobile ? 60 : 'auto'
                    }}>
                      <div
                        onClick={() => handleTabChange(tab.id)}
                        style={{
                          width: isMobile ? 40 : 50,
                          height: isMobile ? 40 : 50,
                          borderRadius: '50%',
                          background: completedTabs.has(tab.id) 
                            ? BRAND.accent 
                            : activeTab === tab.id 
                            ? BRAND.gradient 
                            : '#e5e7eb',
                          color: completedTabs.has(tab.id) || activeTab === tab.id ? '#fff' : BRAND.muted,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: completedTabs.has(tab.id) ? (isMobile ? 18 : 24) : (isMobile ? 16 : 20),
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          border: completedTabs.has(tab.id) || activeTab === tab.id ? (isMobile ? '2px solid #fff' : '3px solid #fff') : (isMobile ? '2px solid transparent' : '3px solid transparent'),
                          boxShadow: activeTab === tab.id ? '0 4px 12px rgba(42,157,143,0.4)' : 'none',
                          flexShrink: 0
                        }}
                        onMouseOver={e => {
                          if (activeTab !== tab.id) {
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }
                        }}
                        onMouseOut={e => {
                          if (activeTab !== tab.id) {
                            e.currentTarget.style.transform = 'scale(1)';
                          }
                        }}
                      >
                        {completedTabs.has(tab.id) ? '✓' : tab.icon}
                      </div>
                      <div style={{
                        fontSize: isMobile ? 9 : 11,
                        color: activeTab === tab.id ? BRAND.primary : BRAND.muted,
                        fontWeight: activeTab === tab.id ? 700 : 500,
                        textAlign: 'center',
                        maxWidth: isMobile ? 60 : 80,
                        lineHeight: 1.2
                      }}>
                        {tab.label}
                      </div>
                    </div>
                    {index < 4 && !isMobile && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: `calc(25px + ${(index + 1) * (100 / 5)}%)`,
                        width: `calc(${100 / 5}% - 50px)`,
                        height: 3,
                        background: completedTabs.has(tab.id) || activeTab > tab.id
                          ? BRAND.accent
                          : '#e5e7eb',
                        transform: 'translateY(-50%)',
                        zIndex: 1,
                        transition: 'all 0.3s ease'
                      }} />
                    )}
                  </React.Fragment>
                ))}
              </div>
              
              {/* Tabs */}
              <div style={{
                display: 'flex',
                gap: isMobile ? 4 : 8,
                marginBottom: isMobile ? 16 : 24,
                borderBottom: '2px solid ' + BRAND.light,
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
              >
                {[
                  { id: 1, label: 'معلومات أساسية', icon: '📋' },
                  { id: 2, label: 'المواد اللازمة', icon: '🧱' },
                  { id: 3, label: 'المهندسين والمتعاقدين', icon: '👷' },
                  { id: 4, label: 'صور المشروع', icon: '📷' },
                  { id: 5, label: 'معلومات إضافية', icon: '⚙️' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    style={{
                      padding: isMobile ? '10px 12px' : '12px 20px',
                      border: 'none',
                      background: 'transparent',
                      color: activeTab === tab.id ? BRAND.primary : BRAND.muted,
                      fontWeight: activeTab === tab.id ? 700 : 500,
                      fontSize: isMobile ? 12 : 14,
                      cursor: 'pointer',
                      borderBottom: activeTab === tab.id ? (isMobile ? `2px solid ${BRAND.accent}` : `3px solid ${BRAND.accent}`) : (isMobile ? '2px solid transparent' : '3px solid transparent'),
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: isMobile ? 4 : 6,
                      flexShrink: 0
                    }}
                    onMouseOver={e => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.color = BRAND.primary;
                      }
                    }}
                    onMouseOut={e => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.color = BRAND.muted;
                      }
                    }}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
              
              <form onSubmit={saveProject} style={{ display: 'none' }}>
                <button type="submit" />
              </form>
              
              {/* Tab 1: معلومات أساسية */}
              {activeTab === 1 && (
              <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: 8,
                color: BRAND.dark,
                fontWeight: 600,
                fontSize: 14
              }}>
                اسم المشروع *
              </label>
              <input
                name="name"
                value={projectForm.name}
                onChange={handleProjectInput}
                placeholder="أدخل اسم المشروع"
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
                    الموقع
                  </label>
                  <input
                    name="location"
                    value={projectForm.location}
                    onChange={handleProjectInput}
                    placeholder="موقع المشروع"
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
                    الميزانية البدائية ($) *
              </label>
              <input
                name="budget"
                type="number"
                value={projectForm.budget}
                onChange={handleProjectInput}
                placeholder="0"
                min="0"
                step="0.01"
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
                    العميل
                  </label>
                  <select
                    name="client"
                    value={projectForm.client}
                    onChange={handleProjectInput}
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
                  >
                    <option value="">اختر العميل</option>
                    {clients.length === 0 ? (
                      <option value="" disabled>لا توجد عملاء - أضف عميل أولاً من صفحة العملاء والمتعاقدين</option>
                    ) : (
                      clients.map(c => (
                        <option key={c._id || c.id} value={c._id || c.id}>
                          {c.name} {c.email ? `(${c.email})` : ''}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                
                {/* زر التالي */}
                <button
                  type="button"
                  onClick={() => handleTabChange(2)}
                  style={{
                    width: '100%',
                    background: BRAND.gradient,
                    color: '#fff',
                    border: 0,
                    borderRadius: 12,
                    padding: isMobile ? '12px 20px' : '14px 24px',
                    fontWeight: 700,
                    fontSize: isMobile ? 14 : 16,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(42,157,143,0.3)',
                    transition: 'all 0.3s ease',
                    marginTop: 8
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
                  التالي →
                </button>
              </div>
              )}
            
            {/* Tab 2: المواد اللازمة */}
            {activeTab === 2 && (
              <div style={{ display: 'grid', gap: 16 }}>
                <div style={{
                  padding: 16,
                  background: '#f0f9ff',
                  borderRadius: 12,
                  border: `2px solid ${BRAND.accent}`
                }}>
                  <h4 style={{ margin: '0 0 12px 0', color: BRAND.primary, fontSize: 16 }}>إضافة مادة جديدة</h4>
                  <form onSubmit={handleAddMaterial} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr auto', gap: 12 }}>
                    <input
                      type="text"
                      placeholder="اسم المادة"
                      value={newMaterial.name}
                      onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                      required
                      style={{
                        padding: 12,
                        border: '2px solid #e5e7eb',
                        borderRadius: 8,
                        fontSize: 14,
                        outline: 'none'
                      }}
                    />
                    <input
                      type="number"
                      placeholder="الكمية"
                      value={newMaterial.quantity}
                      onChange={(e) => setNewMaterial({ ...newMaterial, quantity: e.target.value })}
                      min="0"
                      step="0.01"
                      required
                      style={{
                        padding: 12,
                        border: '2px solid #e5e7eb',
                        borderRadius: 8,
                        fontSize: 14,
                        outline: 'none'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="الوحدة"
                      value={newMaterial.unit}
                      onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                      style={{
                        padding: 12,
                        border: '2px solid #e5e7eb',
                        borderRadius: 8,
                        fontSize: 14,
                        outline: 'none'
                      }}
                    />
                    <input
                      type="number"
                      placeholder="التكلفة"
                      value={newMaterial.cost}
                      onChange={(e) => setNewMaterial({ ...newMaterial, cost: e.target.value })}
                      min="0"
                      step="0.01"
                      required
                      style={{
                        padding: 12,
                        border: '2px solid #e5e7eb',
                        borderRadius: 8,
                        fontSize: 14,
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: '12px 20px',
                        background: BRAND.accent,
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      إضافة
                    </button>
                  </form>
                </div>
                
                {materials.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: BRAND.muted }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🧱</div>
                    <div style={{ fontSize: 16 }}>لا توجد مواد مضافة</div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 12 }}>
                    {materials.map(m => (
                      <div
                        key={m.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: 16,
                          background: BRAND.light,
                          borderRadius: 12,
                          border: '1px solid #e5e7eb'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, color: BRAND.dark, marginBottom: 4 }}>{m.name}</div>
                          <div style={{ fontSize: 13, color: BRAND.muted }}>
                            الكمية: {m.quantity} {m.unit} | التكلفة: ${m.cost.toLocaleString()}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveMaterial(m.id)}
                          style={{
                            padding: '8px 16px',
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontWeight: 600
                          }}
                        >
                          حذف
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* أزرار السابق والتالي */}
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => handleTabChange(1)}
                    style={{
                      flex: 1,
                      background: BRAND.light,
                      color: BRAND.primary,
                      border: `2px solid ${BRAND.primary}`,
                      borderRadius: 12,
                      padding: '14px 24px',
                      fontWeight: 700,
                      fontSize: 16,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = BRAND.primary;
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = BRAND.light;
                      e.currentTarget.style.color = BRAND.primary;
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    ← السابق
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange(3)}
                    style={{
                      flex: 1,
                      background: BRAND.gradient,
                      color: '#fff',
                      border: 0,
                      borderRadius: 12,
                      padding: isMobile ? '12px 16px' : '14px 24px',
                      fontWeight: 700,
                      fontSize: isMobile ? 14 : 16,
                      cursor: 'pointer',
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
                    التالي →
                  </button>
                </div>
              </div>
            )}
            
            {/* Tab 3: المهندسين والمتعاقدين */}
            {activeTab === 3 && (
              <div style={{ display: 'grid', gap: 16 }}>
                <div style={{
                  padding: 16,
                  background: '#f0f9ff',
                  borderRadius: 12,
                  border: `2px solid ${BRAND.accent}`
                }}>
                  <h4 style={{ margin: '0 0 12px 0', color: BRAND.primary, fontSize: 16 }}>إضافة مهندس</h4>
                  <form onSubmit={handleAddEngineer} style={{ display: 'grid', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 12 }}>
                      <input
                        type="text"
                        placeholder="اسم المهندس *"
                        value={newEngineer.name}
                        onChange={(e) => setNewEngineer({ ...newEngineer, name: e.target.value })}
                        required
                        style={{
                          padding: 12,
                          border: '2px solid #e5e7eb',
                          borderRadius: 8,
                          fontSize: 14,
                          outline: 'none'
                        }}
                      />
                      <select
                        value={newEngineer.specialty}
                        onChange={(e) => setNewEngineer({ ...newEngineer, specialty: e.target.value })}
                        style={{
                          padding: 12,
                          border: '2px solid #e5e7eb',
                          borderRadius: 8,
                          fontSize: 14,
                          outline: 'none'
                        }}
                      >
                        <option value="مدني">مدني</option>
                        <option value="عمارة">عمارة</option>
                        <option value="كهرباء">كهرباء</option>
                      </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 12 }}>
                      <input
                        type="number"
                        placeholder="الراتب *"
                        value={newEngineer.salary}
                        onChange={(e) => setNewEngineer({ ...newEngineer, salary: e.target.value })}
                        min="0"
                        required
                        style={{
                          padding: 12,
                          border: '2px solid #e5e7eb',
                          borderRadius: 8,
                          fontSize: 14,
                          outline: 'none'
                        }}
                      />
                      <input
                        type="tel"
                        placeholder="الهاتف"
                        value={newEngineer.phone}
                        onChange={(e) => setNewEngineer({ ...newEngineer, phone: e.target.value })}
                        style={{
                          padding: 12,
                          border: '2px solid #e5e7eb',
                          borderRadius: 8,
                          fontSize: 14,
                          outline: 'none'
                        }}
                      />
                      <input
                        type="email"
                        placeholder="البريد الإلكتروني"
                        value={newEngineer.email}
                        onChange={(e) => setNewEngineer({ ...newEngineer, email: e.target.value })}
                        style={{
                          padding: 12,
                          border: '2px solid #e5e7eb',
                          borderRadius: 8,
                          fontSize: 14,
                          outline: 'none'
                        }}
                      />
                    </div>
                    <textarea
                      placeholder="ملاحظات"
                      value={newEngineer.notes}
                      onChange={(e) => setNewEngineer({ ...newEngineer, notes: e.target.value })}
                      rows={2}
                      style={{
                        padding: 12,
                        border: '2px solid #e5e7eb',
                        borderRadius: 8,
                        fontSize: 14,
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: '12px 20px',
                        background: BRAND.accent,
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      إضافة مهندس
                    </button>
                  </form>
                </div>
                
                {engineers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: BRAND.muted }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>👷</div>
                    <div style={{ fontSize: 16 }}>لا توجد مهندسين مضافة</div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 12 }}>
                    {engineers.map(e => (
                      <div
                        key={e.id}
                        style={{
                          padding: 16,
                          background: BRAND.light,
                          borderRadius: 12,
                          border: '1px solid #e5e7eb'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontWeight: 700, color: BRAND.dark, marginBottom: 4 }}>
                              {e.name} - {e.specialty}
                            </div>
                            <div style={{ fontSize: 13, color: BRAND.muted }}>
                              الراتب: ${e.salary.toLocaleString()} | {e.phone && `الهاتف: ${e.phone}`} {e.email && `| ${e.email}`}
                            </div>
                            {e.notes && (
                              <div style={{ fontSize: 13, color: BRAND.muted, marginTop: 4 }}>{e.notes}</div>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveEngineer(e.id)}
                            style={{
                              padding: '8px 16px',
                              background: '#ef4444',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 8,
                              cursor: 'pointer',
                              fontWeight: 600
                            }}
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div style={{
                  marginTop: 24,
                  padding: 16,
                  background: '#f0f9ff',
                  borderRadius: 12,
                  border: `2px solid ${BRAND.accent}`
                }}>
                  <h4 style={{ margin: '0 0 12px 0', color: BRAND.primary, fontSize: 16 }}>إضافة فريق عمل</h4>
                  <form onSubmit={handleAddCrew} style={{ display: 'flex', gap: 12 }}>
                    <input
                      type="text"
                      placeholder="اسم الفريق"
                      value={newCrew}
                      onChange={(e) => setNewCrew(e.target.value)}
                      style={{
                        flex: 1,
                        padding: 12,
                        border: '2px solid #e5e7eb',
                        borderRadius: 8,
                        fontSize: 14,
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: '12px 20px',
                        background: BRAND.accent,
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      إضافة
                    </button>
                  </form>
                </div>
                
                {crews.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {crews.map((crew, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '8px 16px',
                          background: BRAND.light,
                          borderRadius: 20,
                          border: '1px solid #e5e7eb'
                        }}
                      >
                        <span>{crew}</span>
                        <button
                          onClick={() => handleRemoveCrew(index)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: 18,
                            padding: 0,
                            width: 20,
                            height: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* أزرار السابق والتالي */}
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => handleTabChange(2)}
                    style={{
                      flex: 1,
                      background: BRAND.light,
                      color: BRAND.primary,
                      border: `2px solid ${BRAND.primary}`,
                      borderRadius: 12,
                      padding: isMobile ? '12px 16px' : '14px 24px',
                      fontWeight: 700,
                      fontSize: isMobile ? 14 : 16,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = BRAND.primary;
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = BRAND.light;
                      e.currentTarget.style.color = BRAND.primary;
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    ← السابق
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange(4)}
                    style={{
                      flex: 1,
                      background: BRAND.gradient,
                      color: '#fff',
                      border: 0,
                      borderRadius: 12,
                      padding: isMobile ? '12px 16px' : '14px 24px',
                      fontWeight: 700,
                      fontSize: isMobile ? 14 : 16,
                      cursor: 'pointer',
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
                    التالي →
                  </button>
                </div>
              </div>
            )}
            
            {/* Tab 4: صور المشروع */}
            {activeTab === 4 && (
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: BRAND.gradient,
                      color: '#fff',
                      border: 'none',
                      borderRadius: 12,
                      fontWeight: 700,
                      fontSize: 16,
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      opacity: uploading ? 0.7 : 1
                    }}
                  >
                    {uploading ? '⏳ جاري الرفع...' : '📷 رفع صور المشروع'}
                  </button>
                </div>
                
                {images.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: BRAND.muted }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📷</div>
                    <div style={{ fontSize: 16 }}>لا توجد صور مرفوعة</div>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(100px, 1fr))' : 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: isMobile ? 8 : 12
                  }}>
                    {images.map((img, index) => (
                      <div
                        key={index}
                        style={{
                          position: 'relative',
                          paddingTop: '100%',
                          background: BRAND.light,
                          borderRadius: 12,
                          overflow: 'hidden',
                          border: '1px solid #e5e7eb'
                        }}
                      >
                        <img
                          src={img}
                          alt={`Project ${index + 1}`}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          style={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            background: 'rgba(239, 68, 68, 0.9)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 18,
                            fontWeight: 700
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* أزرار السابق والتالي */}
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => handleTabChange(3)}
                    style={{
                      flex: 1,
                      background: BRAND.light,
                      color: BRAND.primary,
                      border: `2px solid ${BRAND.primary}`,
                      borderRadius: 12,
                      padding: '14px 24px',
                      fontWeight: 700,
                      fontSize: 16,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = BRAND.primary;
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = BRAND.light;
                      e.currentTarget.style.color = BRAND.primary;
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    ← السابق
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange(5)}
                    style={{
                      flex: 1,
                      background: BRAND.gradient,
                      color: '#fff',
                      border: 0,
                      borderRadius: 12,
                      padding: isMobile ? '12px 16px' : '14px 24px',
                      fontWeight: 700,
                      fontSize: isMobile ? 14 : 16,
                      cursor: 'pointer',
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
                    التالي →
                  </button>
                </div>
              </div>
            )}
            
            {/* Tab 5: معلومات إضافية */}
            {activeTab === 5 && (
              <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: 8,
                color: BRAND.dark,
                fontWeight: 600,
                fontSize: 14
              }}>
                الوصف
              </label>
              <textarea
                name="description"
                value={projectForm.description}
                onChange={handleProjectInput}
                placeholder="وصف مختصر عن المشروع"
                rows={4}
                style={{
                  width: '100%',
                  padding: 14,
                  border: '2px solid #e5e7eb',
                  borderRadius: 12,
                  fontSize: 15,
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  background: BRAND.light,
                  fontFamily: 'inherit',
                  resize: 'vertical'
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
            
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: 8,
                      color: BRAND.dark,
                      fontWeight: 600,
                      fontSize: 14
                    }}>
                      تاريخ البدء
                    </label>
                    <input
                      name="startDate"
                      type="date"
                      value={projectForm.startDate}
                      onChange={handleProjectInput}
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
                      تاريخ الانتهاء المتوقع
                    </label>
                    <input
                      name="expectedEndDate"
                      type="date"
                      value={projectForm.expectedEndDate}
                      onChange={handleProjectInput}
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

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 8,
                    color: BRAND.dark,
                    fontWeight: 600,
                    fontSize: 14
                  }}>
                    ملاحظات
                  </label>
                  <textarea
                    name="notes"
                    value={projectForm.notes}
                    onChange={handleProjectInput}
                    placeholder="ملاحظات إضافية عن المشروع"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: 14,
                      border: '2px solid #e5e7eb',
                      borderRadius: 12,
                      fontSize: 15,
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      background: BRAND.light,
                      resize: 'vertical',
                      fontFamily: 'inherit'
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
                
                {/* أزرار السابق وحفظ المشروع */}
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button
                    type="button"
                    onClick={() => handleTabChange(4)}
                    style={{
                      flex: 1,
                      background: BRAND.light,
                      color: BRAND.primary,
                      border: `2px solid ${BRAND.primary}`,
                      borderRadius: 12,
                      padding: isMobile ? '12px 16px' : '14px 24px',
                      fontWeight: 700,
                      fontSize: isMobile ? 14 : 16,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = BRAND.primary;
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = BRAND.light;
                      e.currentTarget.style.color = BRAND.primary;
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    ← السابق
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      saveProject(e);
                    }}
              disabled={isSubmitting}
              style={{
                      flex: 1,
                background: BRAND.gradient,
                color: '#fff',
                border: 0,
                borderRadius: 12,
                padding: isMobile ? '12px 16px' : '14px 24px',
                fontWeight: 700,
                fontSize: isMobile ? 14 : 16,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(42,157,143,0.3)',
                transition: 'all 0.3s ease',
                opacity: isSubmitting ? 0.7 : 1
              }}
              onMouseOver={e => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(42,157,143,0.4)';
                }
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(42,157,143,0.3)';
              }}
            >
              {isSubmitting ? '⏳ جاري الحفظ...' : '✓ حفظ المشروع'}
            </button>
                </div>
              </div>
              )}
            </>
          )}
          
          {!showProjectForm && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: BRAND.muted
            }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>📋</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>ابدأ بإضافة مشروع جديد</div>
              <div style={{ fontSize: 14 }}>انقر على زر "إضافة مشروع" أعلاه للبدء</div>
            </div>
          )}
        </div>

        {/* Client Requests */}
        <div style={{
          background: '#fff',
          borderRadius: isMobile ? 16 : 20,
          boxShadow: '0 4px 20px rgba(30,58,95,0.08)',
          padding: isMobile ? 16 : 28,
          border: '1px solid rgba(30,58,95,0.05)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: '2px solid ' + BRAND.light
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20
            }}>
              📥
            </div>
            <h3 style={{
              margin: 0,
              color: BRAND.primary,
              fontSize: 22,
              fontWeight: 800
            }}>
              طلبات العملاء ({clientRequests.length})
            </h3>
          </div>
          
          {clientRequests.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: BRAND.muted
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <div style={{ fontSize: 16 }}>لا توجد طلبات جديدة</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 14 }}>
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: BRAND.muted }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
                  <div style={{ fontSize: 16 }}>جاري تحميل الطلبات...</div>
                </div>
              ) : error ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#ef4444' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>❌</div>
                  <div style={{ fontSize: 16 }}>{error}</div>
                </div>
              ) : (
                clientRequests.map(r => (
                  <div
                    key={r._id || r.id}
                    style={{
                      background: BRAND.light,
                      borderRadius: 16,
                      padding: 20,
                      border: '2px solid rgba(30,58,95,0.05)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.borderColor = BRAND.accent;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(42,157,143,0.15)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.borderColor = 'rgba(30,58,95,0.05)';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 12
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: 800,
                        fontSize: 18,
                        color: BRAND.dark,
                        marginBottom: 6
                      }}>
                        {r.title || r.name}
                      </div>
                      {r.description && (
                        <div style={{
                          color: BRAND.muted,
                          fontSize: 13,
                          marginBottom: 8,
                          lineHeight: 1.5
                        }}>
                          {r.description}
                        </div>
                      )}
                      <div style={{
                        color: BRAND.muted,
                        fontSize: 13,
                        marginBottom: 4
                      }}>
                        📋 رقم الطلب: {r.requestNumber || r._id || r.id}
                      </div>
                      <div style={{
                        color: BRAND.accent,
                        fontWeight: 700,
                        fontSize: 16,
                        marginTop: 4
                      }}>
                        💰 {r.budget ? `$${r.budget.toLocaleString()}` : 'غير محدد'}
                      </div>
                      <div style={{
                        color: BRAND.muted,
                        fontSize: 12,
                        marginTop: 6
                      }}>
                        📅 {r.createdAt ? new Date(r.createdAt).toLocaleDateString('ar-SA') : (r.date || '-')}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: 10,
                    marginTop: 16,
                    paddingTop: 16,
                    borderTop: '1px solid rgba(30,58,95,0.1)'
                  }}>
                    <button
                      onClick={() => accept(r._id || r.id)}
                      style={{
                        flex: 1,
                        background: '#22c55e',
                        color: '#fff',
                        border: 0,
                        borderRadius: 10,
                        padding: '12px',
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(34,197,94,0.3)'
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(34,197,94,0.4)';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(34,197,94,0.3)';
                      }}
                    >
                      ✓ قبول
                    </button>
                    <button
                      onClick={() => reject(r._id || r.id)}
                      style={{
                        flex: 1,
                        background: '#ef4444',
                        color: '#fff',
                        border: 0,
                        borderRadius: 10,
                        padding: '12px',
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(239,68,68,0.3)'
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(239,68,68,0.4)';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(239,68,68,0.3)';
                      }}
                    >
                      ✗ رفض
                    </button>
                  </div>
                </div>
                ))
              )}
            </div>
          )}
        </div>
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======


>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
