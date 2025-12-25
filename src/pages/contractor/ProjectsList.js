import React, { useState, useEffect, useRef } from "react";
<<<<<<< HEAD
import { projectsAPI, materialsAPI, usersAPI, getUser } from "../../utils/api";
import { useNotifications } from "../../components/NotificationSystem";
import BRAND from '../../theme';

// Local Component: ProgressBar (same as dashboard for consistency)
const ProgressBar = ({ progress, size = 'small' }) => {
  const height = size === 'large' ? 10 : 6;
  let color = '#10b981'; // Green (Success)
  if (progress < 30) color = '#ef4444'; // Red
  else if (progress < 70) color = '#f59e0b'; // Orange

  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.1)', borderRadius: 10, height, overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: color, borderRadius: 10, transition: 'width 0.5s ease' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: BRAND.primary }}>{progress}%</span>
    </div>
  );
};

// Local Component: Modal
const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  if (!isOpen) return null;
  const maxWidth = size === 'large' ? 800 : 500;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      opacity: isOpen ? 1 : 0,
      animation: 'fadeIn 0.2s ease-out forwards'
    }} onClick={onClose}>
      <div style={{
        background: BRAND.card,
        color: BRAND.text,

        width: '90%',
        maxWidth,
        borderRadius: 20,
        boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
        padding: 0,
        overflow: 'hidden',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        transform: 'scale(1)',
        animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${BRAND.border || '#eee'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: BRAND.background }}>
          <h3 style={{ margin: 0, fontSize: 18, color: BRAND.primary, fontWeight: 800 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: 24, color: BRAND.muted, cursor: 'pointer' }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: 24, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
=======
import { projectsAPI } from "../../utils/api";
import Modal from "../../Modal";
import { useNotifications } from "../../components/NotificationSystem";

const BRAND = {
  primary: '#1e3a5f',
  accent: '#2a9d8f',
  gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2a9d8f 50%, #264653 100%)',
  light: '#f8fafc',
  dark: '#0f172a',
  muted: '#64748b',
};

// مكون ProgressBar مميز
const ProgressBar = ({ progress, showLabel = true, size = 'medium' }) => {
  const progressValue = Math.min(Math.max(progress || 0, 0), 100);
  const isComplete = progressValue === 100;
  
  const getProgressColor = () => {
    if (isComplete) return '#10b981'; // أخضر
    if (progressValue >= 75) return '#2a9d8f'; // أخضر فاتح
    if (progressValue >= 50) return '#3b82f6'; // أزرق
    if (progressValue >= 25) return '#f59e0b'; // برتقالي
    return '#ef4444'; // أحمر
  };

  const heightMap = {
    small: 8,
    medium: 12,
    large: 16
  };

  const height = heightMap[size] || 12;

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        width: '100%',
        height: height,
        background: BRAND.light,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div
          style={{
            width: `${progressValue}%`,
            height: '100%',
            background: isComplete 
              ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
              : `linear-gradient(90deg, ${getProgressColor()} 0%, ${getProgressColor()}dd 100%)`,
            borderRadius: 20,
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: progressValue > 0 ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
          }}
        >
          {progressValue > 0 && progressValue < 100 && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              animation: 'shimmer 2s infinite'
            }} />
          )}
        </div>
      </div>
      {showLabel && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 6,
          fontSize: size === 'small' ? 11 : 13
        }}>
          <span style={{
            color: BRAND.dark,
            fontWeight: 700,
            fontSize: size === 'small' ? 12 : 14
          }}>
            {isComplete ? '✅' : '📊'} {progressValue}%
          </span>
          {isComplete && (
            <span style={{
              color: '#10b981',
              fontWeight: 700,
              fontSize: size === 'small' ? 11 : 12
            }}>
              مكتمل
            </span>
          )}
        </div>
      )}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    </div>
  );
};

export default function ProjectsList() {
  const notifications = useNotifications();
<<<<<<< HEAD
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter / Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Modal State
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit logic state
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [projectStatus, setProjectStatus] = useState('pending');
  const [projectProgress, setProjectProgress] = useState(0);
  const [engineers, setEngineers] = useState([]);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [newEngineer, setNewEngineer] = useState({ name: '', specialty: 'مدني', salary: '', phone: '', email: '', notes: '' });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [materials, setMaterials] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({ materialId: '', quantity: '', cost: '' });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const user = getUser();
      const contractorId = user?.id || user?._id;
      const data = await projectsAPI.getAll({ contractor: contractorId });
      setProjects(Array.isArray(data) ? data : []);

      const mats = await materialsAPI.getAll();
      setAvailableMaterials(mats || []);
    } catch (err) {
      setError(err.message || 'فشل في تحميل المشاريع');
=======
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projectStatus, setProjectStatus] = useState('pending');
  const [engineers, setEngineers] = useState([]);
  const [newEngineer, setNewEngineer] = useState({ 
    name: '', 
    specialty: 'مدني', 
    salary: '', 
    phone: '', 
    email: '', 
    notes: '' 
  });
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [projectProgress, setProjectProgress] = useState(0);
  const fileInputRef = useRef(null);
  
  const filteredProjects = projects.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectsAPI.getAll();
      setProjects(data || []);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء جلب المشاريع');
      console.error('Error fetching projects:', err);
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

<<<<<<< HEAD
  // Filter Logic
  const filteredProjects = projects.filter(p => {
    const matchesSearch = (p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'date-asc') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'budget-desc') return (b.budget || 0) - (a.budget || 0);
    return 0;
  });

  // --- ACTIONS ---

  const showProjectDetails = async (id) => {
    setIsDetailsLoading(id);
    try {
      const response = await projectsAPI.getById(id);
      console.log("DEBUG - Project Details Response:", response);
      // Robust extraction
      const data = response.project || response.data || response;
      setSelectedProject(data);
    } catch (err) {
      notifications.error('خطأ', err.message || 'فشل في تحميل تفاصيل المشروع');
    } finally {
      setIsDetailsLoading(false);
    }
  };


  const showEditModal = async (id) => {
    setIsDetailsLoading(id);
    try {
      const response = await projectsAPI.getById(id);
      // Defensive: handle both direct object and wrapped responses
      const data = response.project || response.data || response;

      setProjectToEdit(data);
      setProjectStatus(data.status || 'pending');
      setProjectProgress(data.progress || 0);
      setEngineers(Array.isArray(data.engineers) ? data.engineers : []);
      setImages(Array.isArray(data.images) ? data.images : []);
      setMaterials(Array.isArray(data.materials) ? data.materials : []);
      setIsEditModalOpen(true);
    } catch (err) {
      console.error("DEBUG - Edit Modal Load Failed:", err);
      notifications.error('خطأ', err.message || 'فشل في تحميل المشروع للتعديل');
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const saveProjectChanges = async () => {
    if (!projectToEdit) return;
    setIsSaving(true);
    try {
      const projectId = projectToEdit._id || projectToEdit.id;
      if (!projectId) {
        throw new Error('تعذر العثور على معرف المشروع - يرجى المحاولة لاحقاً');
      }

      const updateData = {
        // Include existing fields to satisfy PUT requirements
        name: projectToEdit.name,
        client: projectToEdit.client?._id || projectToEdit.client?.id || projectToEdit.client,
        budget: projectToEdit.budget,
        description: projectToEdit.description,
        location: projectToEdit.location,
        startDate: projectToEdit.startDate,
        expectedEndDate: projectToEdit.expectedEndDate,
        notes: projectToEdit.notes,
        contractor: projectToEdit.contractor?._id || projectToEdit.contractor?.id || projectToEdit.contractor,

        // Override updated fields
        status: projectStatus,
        progress: parseInt(projectProgress),
        engineers: engineers.map(e => ({
          name: e.name,
          specialty: e.specialty,
          salary: parseFloat(e.salary) || 0,
          phone: e.phone || '',
          email: e.email || '',
          notes: e.notes || ''
        })),
        materials: materials.map(m => ({
          name: m.name,
          quantity: parseFloat(m.quantity) || 0,
          unit: m.unit || 'وحدة',
          cost: parseFloat(m.cost) || 0
        })),
        images: images
      };

      console.log("DEBUG - Sending Update Data:", updateData);
      await projectsAPI.update(projectId, updateData);
      notifications.success('نجح', 'تم تحديث المشروع بنجاح');
      setIsEditModalOpen(false);
      fetchProjects(); // Refresh list
    } catch (err) {
      console.error("DEBUG - Project Save Failed:", err);
      notifications.error('خطأ', err.message || 'فشل تحديث المشروع');
=======
  const exportCsv = () => {
    try {
      if (filteredProjects.length === 0) {
        notifications.warning('تحذير', 'لا توجد مشاريع للتصدير');
        return;
      }

      // إنشاء CSV
      const headers = ['#', 'اسم المشروع', 'الحالة', 'الميزانية', 'التكلفة الإجمالية', 'التقدم', 'عدد الصور', 'عدد المهندسين', 'تاريخ الإنشاء', 'آخر تحديث'];
      const rows = filteredProjects.map((p, i) => [
        i + 1,
        p.name || '',
        p.status || '',
        p.budget || 0,
        p.totalCost || 0,
        `${p.progress || 0}%`,
        p.images?.length || 0,
        p.engineers?.length || 0,
        p.createdAt ? new Date(p.createdAt).toLocaleDateString('ar-SA') : '',
        p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('ar-SA') : ''
      ]);

      // تحويل إلى CSV format
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      // BOM للـ UTF-8 لدعم العربية
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `المشاريع_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      notifications.success('نجح', `تم تصدير ${filteredProjects.length} مشروع بنجاح`);
    } catch (err) {
      console.error('Error exporting CSV:', err);
      notifications.error('خطأ', `حدث خطأ أثناء تصدير CSV: ${err.message}`);
    }
  };
  
  function refresh() {
    fetchProjects();
  }

  const showProjectDetails = async (projectId) => {
    if (!projectId) {
      notifications.error('خطأ', 'معرف المشروع غير موجود');
      return;
    }
    
    setIsDetailsLoading(true);
    try {
      const projectData = await projectsAPI.getById(projectId);
      setSelectedProject(projectData);
    } catch (err) {
      console.error('Error fetching project details:', err);
      notifications.error('خطأ', err.message || 'حدث خطأ أثناء جلب تفاصيل المشروع');
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const showEditModal = async (projectId) => {
    if (!projectId) {
      notifications.error('خطأ', 'معرف المشروع غير موجود');
      return;
    }
    
    setIsDetailsLoading(true);
    try {
      const projectData = await projectsAPI.getById(projectId);
      setProjectToEdit(projectData);
      setProjectStatus(projectData.status || 'pending');
      // تحويل engineers إلى تنسيق محلي
      if (Array.isArray(projectData.engineers) && projectData.engineers.length > 0) {
        const engineersList = projectData.engineers.map((eng, idx) => {
          if (typeof eng === 'object' && eng !== null && eng.name) {
            return {
              id: eng._id || eng.id || `eng-${idx}`,
              name: eng.name || 'مهندس',
              specialty: eng.specialty || 'مدني',
              salary: eng.salary || 0,
              phone: eng.phone || '',
              email: eng.email || '',
              notes: eng.notes || ''
            };
          }
          return {
            id: `eng-${idx}`,
            name: 'مهندس',
            specialty: 'مدني',
            salary: 0,
            phone: '',
            email: '',
            notes: ''
          };
        });
        setEngineers(engineersList);
      } else {
        setEngineers([]);
      }
      setImages(projectData.images || []);
      setProjectProgress(projectData.progress || 0);
      setIsEditModalOpen(true);
    } catch (err) {
      console.error('Error fetching project for edit:', err);
      notifications.error('خطأ', err.message || 'حدث خطأ أثناء جلب بيانات المشروع');
    } finally {
      setIsDetailsLoading(false);
    }
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

  // دالة لضغط الصور
  const compressImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // حساب الأبعاد الجديدة مع الحفاظ على نسبة العرض إلى الارتفاع
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

          // تحويل إلى base64 مع ضغط الجودة
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

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) {
      notifications.warning('تحذير', 'يرجى اختيار صورة واحدة على الأقل');
      return;
    }
    
    if (!projectToEdit?._id && !projectToEdit?.id) {
      notifications.error('خطأ', 'معرف المشروع غير موجود');
      return;
    }

    // التحقق من حجم الملفات (حد أقصى 10MB لكل صورة قبل الضغط)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      notifications.error('خطأ', 'بعض الملفات كبيرة جداً (الحد الأقصى 10MB لكل صورة)');
      return;
    }

    setUploading(true);
    try {
      const newImageUrls = [];
      
      // ضغط وتحويل الملفات إلى base64
      for (const file of files) {
        // التحقق من نوع الملف
        if (!file.type.startsWith('image/')) {
          console.warn(`تخطي الملف ${file.name} - ليس صورة`);
          continue;
        }

        try {
          // ضغط الصورة قبل تحويلها
          const compressedBase64 = await compressImage(file);
          newImageUrls.push(compressedBase64);
        } catch (err) {
          console.error(`خطأ في ضغط الصورة ${file.name}:`, err);
          // في حالة الفشل، استخدم الصورة الأصلية
          const reader = new FileReader();
          const promise = new Promise((resolve, reject) => {
            reader.onload = (event) => {
              try {
                const base64Url = event.target.result;
                newImageUrls.push(base64Url);
                resolve();
              } catch (err) {
                reject(err);
              }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          await promise;
        }
      }

      if (newImageUrls.length === 0) {
        notifications.warning('تحذير', 'لم يتم رفع أي صورة صالحة');
        setUploading(false);
        return;
      }

      // Update images state immediately
      const updatedImages = [...images, ...newImageUrls];
      setImages(updatedImages);

      // Save to server
      const projectId = projectToEdit._id || projectToEdit.id;
      await projectsAPI.update(projectId, {
        images: updatedImages
      });

      notifications.success('نجح', `تم رفع ${newImageUrls.length} صورة بنجاح`);
    } catch (err) {
      console.error('Error uploading images:', err);
      const errorMessage = err.message || 'حدث خطأ أثناء رفع الصور';
      notifications.error('خطأ', errorMessage);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async (imageUrl, index) => {
    if (!projectToEdit?._id) return;
    
    try {
      const updatedImages = images.filter((_, i) => i !== index);
      setImages(updatedImages);
      
      // تحديث في السيرفر
      await projectsAPI.update(projectToEdit._id || projectToEdit.id, {
        images: updatedImages
      });
      notifications.success('نجح', 'تم حذف الصورة بنجاح');
    } catch (err) {
      console.error('Error removing image:', err);
      notifications.error('خطأ', 'حدث خطأ أثناء حذف الصورة');
    }
  };

  const handleSaveEdit = async () => {
    if (!projectToEdit) return;
    
    setIsSaving(true);
    try {
      const updateData = {
        status: projectStatus,
        engineers: engineers.map(eng => ({
          name: eng.name,
          specialty: eng.specialty,
          salary: eng.salary,
          phone: eng.phone || '',
          email: eng.email || '',
          notes: eng.notes || ''
        })),
        images: images,
        progress: projectProgress
      };

      // إذا تم تغيير الحالة إلى "مكتمل"، أضف actualEndDate
      if (projectStatus === 'completed' && projectToEdit.status !== 'completed') {
        updateData.actualEndDate = new Date();
      }
      
      await projectsAPI.update(projectToEdit._id || projectToEdit.id, updateData);
      notifications.success('نجح', 'تم حفظ التعديلات بنجاح');
      setIsEditModalOpen(false);
      setProjectToEdit(null);
      setEngineers([]);
      setImages([]);
      setProjectProgress(0);
      fetchProjects(); // تحديث القائمة
    } catch (err) {
      console.error('Error saving project:', err);
      notifications.error('خطأ', err.message || 'حدث خطأ أثناء حفظ التعديلات');
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    } finally {
      setIsSaving(false);
    }
  };

<<<<<<< HEAD
  // --- Sub-functions for Edit Modal (Engineers, Images) ---
  const handleAddEngineer = (e) => {
    e.preventDefault();
    if (!newEngineer.name) return;
    setEngineers([...engineers, { ...newEngineer, id: Date.now() }]);
    setNewEngineer({ name: '', specialty: 'مدني', salary: '', phone: '', email: '', notes: '' });
  };
  const handleRemoveEngineer = (id) => setEngineers(engineers.filter(e => e.id !== id));

  const handleImageUpload = (e) => {
    // Mock upload for UI demo (in real app, compress/upload logic exists)
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setImages(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };
  const handleRemoveImage = (idx) => setImages(images.filter((_, i) => i !== idx));


  return (
    <div style={{
      direction: 'rtl',
      fontFamily: '"Outfit", "Cairo", sans-serif',
      minHeight: '100vh',
      marginBottom: 40
    }}>
      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Cairo:wght@400;600;700;900&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        .glass-panel {
          background: ${BRAND.glass.background};
          backdrop-filter: ${BRAND.glass.blur};
          border: ${BRAND.glass.border};
          box-shadow: ${BRAND.glass.shadow};
          border-radius: 24px;
        }

        .glass-input {
           background: ${BRAND.background};
           color: ${BRAND.text};
           border: 2px solid ${BRAND.border || 'rgba(226, 232, 240, 0.8)'};
           padding: 12px 16px;
           border-radius: 12px;
           font-family: inherit;
           transition: all 0.2s;
           outline: none;
        }

        .glass-input:focus {
           background: #fff;
           border-color: ${BRAND.primary};
           box-shadow: 0 0 0 3px ${BRAND.accent}20;
        }

        .project-row {
           transition: all 0.2s ease;
           border-bottom: 1px solid rgba(0,0,0,0.03);
        }
        .project-row:hover {
           background: rgba(255,255,255,0.6);
           transform: scale(1.002);
           box-shadow: 0 4px 20px rgba(0,0,0,0.03);
           z-index: 1;
           position: relative;
        }
        
        .status-badge {
           padding: 6px 14px;
           border-radius: 20px;
           font-size: 12px;
           font-weight: 700;
           display: inline-block;
        }
        .status-badge.pending { background: #fee2e2; color: #991b1b; }
        .status-badge.in-progress { background: #fef3c7; color: #92400e; }
        .status-badge.completed { background: #d1fae5; color: #065f46; }
      `}</style>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, background: BRAND.background, zIndex: -2 }} />
      <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(42, 157, 143, 0.08) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: -1 }} />


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
          <div style={{ width: 48, height: 48, borderRadius: 14, background: BRAND.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff', boxShadow: '0 8px 16px rgba(42,157,143,0.3)' }}>
            📋
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: BRAND.primary }}>قائمة المشاريع</h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: BRAND.muted, fontWeight: 500 }}>إدارة ومتابعة جميع المشاريع الحالية والسابقة</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            className="glass-input"
            placeholder="🔍 بحث باسم المشروع..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ minWidth: 240 }}
          />
          <select
            className="glass-input"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">كل الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="in-progress">قيد التنفيذ</option>
            <option value="completed">مكتمل</option>
          </select>
        </div>
      </div>

      {/* Projects List - Modern Table for Desktop, Cards for Mobile */}
      <div style={{ margin: '0 24px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 20 }}>⏳</div>
            <h3 style={{ color: BRAND.muted }}>جاري تحميل المشاريع...</h3>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: 80 }}>
            <div style={{ fontSize: 60, marginBottom: 20, opacity: 0.5 }}>📭</div>
            <h3 style={{ color: BRAND.primary, marginBottom: 8 }}>لا توجد مشاريع</h3>
            <p style={{ color: BRAND.muted }}>لم يتم العثور على مشاريع تطابق بحثك</p>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Desktop Table Header */}
            <div style={{
              display: isMobile ? 'none' : 'grid',
              gridTemplateColumns: 'minmax(250px, 2fr) 1fr 1fr 1fr 1fr 140px',
              padding: '16px 24px',
              background: 'rgba(248, 250, 252, 0.8)',
              borderBottom: '1px solid #eee',
              fontWeight: 700,
              fontSize: 13,
              color: BRAND.muted,
              letterSpacing: '0.5px'
            }}>
              <div>اسم المشروع</div>
              <div>العميل</div>
              <div>الميزانية</div>
              <div>الحالة</div>
              <div>التقدم</div>
              <div style={{ textAlign: 'center' }}>إجراءات</div>
            </div>

            {/* List Items */}
            {filteredProjects.map(project => (
              <div key={project._id || project.id} className="project-row" style={{
                display: isMobile ? 'block' : 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'minmax(250px, 2fr) 1fr 1fr 1fr 1fr 140px',
                padding: '16px 24px',
                alignItems: 'center',
                gap: isMobile ? 12 : 0
              }}>
                {/* Name & Location */}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: BRAND.primary }}>{project.name}</div>
                  <div style={{ fontSize: 12, color: BRAND.muted, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <span>📍</span> {project.location || 'غير محدد'}
                  </div>
                </div>

                {/* Helper for Mobile Label */}
                {isMobile && <div style={{ height: 1, background: '#eee', margin: '8px 0' }} />}

                {/* Client */}
                <div style={{ fontSize: 14, color: BRAND.dark }}>
                  {isMobile && <span style={{ fontWeight: 700, color: BRAND.muted, fontSize: 12, marginLeft: 8 }}>العميل:</span>}
                  {project.client?.name || 'غير محدد'}
                </div>

                {/* Budget */}
                <div style={{ fontSize: 14, fontWeight: 600, color: BRAND.accent }}>
                  {isMobile && <span style={{ fontWeight: 700, color: BRAND.muted, fontSize: 12, marginLeft: 8 }}>الميزانية:</span>}
                  ${(project.budget || 0).toLocaleString()}
                </div>

                {/* Status */}
                <div>
                  <span className={`status-badge ${project.status}`}>
                    {project.status === 'pending' ? 'قيد الانتظار' :
                      project.status === 'in-progress' ? 'قيد التنفيذ' :
                        project.status === 'completed' ? 'مكتمل' : project.status}
                  </span>
                </div>

                {/* Progress */}
                <div style={{ width: isMobile ? '100%' : '90%' }}>
                  {isMobile && <div style={{ fontSize: 12, color: BRAND.muted, marginBottom: 4 }}>التقدم:</div>}
                  <ProgressBar progress={project.progress || 0} />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: isMobile ? 12 : 0 }}>
                  <button onClick={() => showProjectDetails(project._id || project.id)} style={{
                    width: 36, height: 36, borderRadius: 10, border: 'none', background: '#e0f2fe', color: '#0284c7', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
                  }} title="التفاصيل">👁️</button>

                  <button onClick={() => showEditModal(project._id || project.id)} style={{
                    width: 36, height: 36, borderRadius: 10, border: 'none', background: '#fff7ed', color: '#ea580c', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
                  }} title="تعديل">✏️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= MODALS ================= */}

      {/* DETAILS MODAL */}
      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title="تفاصيل المشروع"
      >
        {selectedProject && (
          <div style={{ display: 'grid', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#f0f9ff', padding: 16, borderRadius: 12 }}>
              <div>
                <h2 style={{ margin: 0, color: BRAND.primary }}>{selectedProject.name}</h2>
                <p style={{ margin: '4px 0 0', color: BRAND.muted }}>{selectedProject.location}</p>
              </div>
              <span className={`status-badge ${selectedProject.status}`}>
                {selectedProject.status === 'pending' ? 'قيد الانتظار' :
                  selectedProject.status === 'in-progress' ? 'قيد التنفيذ' : selectedProject.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12 }}>
                <div style={{ fontSize: 12, color: BRAND.muted }}>الميزانية</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: BRAND.accent }}>${selectedProject.budget?.toLocaleString()}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12 }}>
                <div style={{ fontSize: 12, color: BRAND.muted }}>العميل</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: BRAND.dark }}>{selectedProject.client?.name || 'غير محدد'}</div>
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 8px', color: BRAND.muted }}>التقدم</h4>
              <ProgressBar progress={selectedProject.progress || 0} size="large" />
            </div>

            {selectedProject.description && (
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12 }}>
                <h4 style={{ margin: '0 0 8px', color: BRAND.primary, fontSize: 14 }}>الوصف</h4>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: BRAND.dark }}>{selectedProject.description}</p>
              </div>
            )}

            <div>
              <h4 style={{ margin: '0 0 8px', color: BRAND.muted, fontSize: 13 }}>فريق العمل ({selectedProject.engineers?.length || 0})</h4>
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                {selectedProject.engineers?.map((eng, i) => (
                  <div key={i} style={{
                    background: '#fff',
                    border: '1px solid #eee',
                    padding: '8px 12px',
                    borderRadius: 10,
                    fontSize: 13,
                    whiteSpace: 'nowrap'
                  }}>
                    👷 {eng.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="تعديل المشروع"
        size="large"
      >
        {projectToEdit && (
          <div style={{ display: 'grid', gap: 24 }}>
            {/* Status & Progress */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, fontSize: 13, color: BRAND.muted }}>حالة المشروع</label>
                <select className="glass-input" style={{ width: '100%' }} value={projectStatus} onChange={e => setProjectStatus(e.target.value)}>
                  <option value="pending">قيد الانتظار</option>
                  <option value="in-progress">قيد التنفيذ</option>
                  <option value="completed">مكتمل</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, fontSize: 13, color: BRAND.muted }}>نسبة الإنجاز %</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input type="range" style={{ flex: 1 }} min="0" max="100" value={projectProgress} onChange={e => setProjectProgress(e.target.value)} />
                  <span style={{ fontWeight: 800, color: BRAND.primary, width: 40, textAlign: 'center' }}>{projectProgress}%</span>
                </div>
              </div>
            </div>

            {/* Engineers Management */}
            <div style={{ border: '1px solid #eee', borderRadius: 16, padding: 20 }}>
              <h4 style={{ margin: '0 0 16px', color: BRAND.primary }}>👷 المهندسين</h4>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr auto', gap: 10, marginBottom: 16 }}>
                <input className="glass-input" placeholder="اسم المهندس" value={newEngineer.name} onChange={e => setNewEngineer({ ...newEngineer, name: e.target.value })} />
                <input className="glass-input" placeholder="التخصص" value={newEngineer.specialty} onChange={e => setNewEngineer({ ...newEngineer, specialty: e.target.value })} />
                <button onClick={handleAddEngineer} style={{ background: BRAND.accent, color: '#fff', border: 'none', borderRadius: 12, padding: '0 20px', fontWeight: 700, cursor: 'pointer' }}>+</button>
              </div>

              <div style={{ maxHeight: 150, overflowY: 'auto' }}>
                {engineers.map(eng => (
                  <div key={eng.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: 8, marginBottom: 6 }}>
                    <span>{eng.name} <span style={{ fontSize: 12, color: BRAND.muted }}>({eng.specialty})</span></span>
                    <span onClick={() => handleRemoveEngineer(eng.id)} style={{ color: 'red', cursor: 'pointer', fontWeight: 700 }}>×</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Images Upload */}
            <div>
              <h4 style={{ margin: '0 0 16px', color: BRAND.primary }}>📷 صور المشروع</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 10 }}>
                <div onClick={() => fileInputRef.current?.click()} style={{
                  border: '2px dashed #cbd5e1', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: 80
                }}>
                  <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} onChange={handleImageUpload} />
                  <span style={{ fontSize: 24, color: BRAND.muted }}>+</span>
                </div>
                {images.map((img, i) => (
                  <div key={i} style={{ position: 'relative', paddingTop: '100%', borderRadius: 12, overflow: 'hidden' }}>
                    <img src={img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => handleRemoveImage(i)} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer' }}>×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
              <button onClick={saveProjectChanges} disabled={isSaving} style={{
                flex: 1, padding: 16, background: BRAND.gradient, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: BRAND.shadows.accent
              }}>
                {isSaving ? 'جار الحفظ...' : '✓ حفظ التغييرات'}
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
=======
  return (
    <div style={{ direction: 'rtl', fontFamily: 'Cairo, system-ui, Arial' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24
      }}>
        <div>
          <h2 style={{
            fontWeight: 900,
            color: BRAND.primary,
            fontSize: 32,
            margin: '0 0 8px 0',
            letterSpacing: '-1px'
          }}>
            المشاريع
          </h2>
          <p style={{ color: BRAND.muted, fontSize: 15, margin: 0 }}>
            عرض جميع المشاريع
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={refresh}
            style={{
              background: BRAND.light,
              color: BRAND.dark,
              border: 0,
              borderRadius: 12,
              padding: '12px 20px',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#e2e8f0';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = BRAND.light;
              e.currentTarget.style.transform = 'none';
            }}
          >
            <span>🔄</span>
            <span>تحديث</span>
          </button>
          <button
            onClick={exportCsv}
            style={{
              background: BRAND.gradient,
              color: '#fff',
              border: 0,
              borderRadius: 12,
              padding: '12px 20px',
              fontWeight: 700,
              fontSize: 14,
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
            <span>📊</span>
            <span>تصدير CSV</span>
          </button>
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
            placeholder="ابحث عن مشروع..."
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

      {/* Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: 20,
        boxShadow: '0 4px 20px rgba(30,58,95,0.08)',
        padding: 24,
        overflowX: 'auto',
        border: '1px solid rgba(30,58,95,0.05)'
      }}>
        {isLoading ? (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: BRAND.muted
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>⏳</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>جاري التحميل...</div>
          </div>
        ) : error ? (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: '#ef4444'
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>❌</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{error}</div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: BRAND.muted
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📭</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>لا توجد مشاريع</div>
          </div>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: 800
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
                }}>المشروع</th>
                <th style={{
                  textAlign: 'right',
                  padding: 16,
                  fontWeight: 700,
                  fontSize: 14
                }}>الحالة</th>
                <th style={{
                  textAlign: 'right',
                  padding: 16,
                  fontWeight: 700,
                  fontSize: 14
                }}>التقدم</th>
                <th style={{
                  textAlign: 'right',
                  padding: 16,
                  fontWeight: 700,
                  fontSize: 14
                }}>تكلفة المواد</th>
                <th style={{
                  textAlign: 'right',
                  padding: 16,
                  fontWeight: 700,
                  fontSize: 14
                }}>عدد الصور</th>
                <th style={{
                  textAlign: 'right',
                  padding: 16,
                  fontWeight: 700,
                  fontSize: 14
                }}>تاريخ الإنشاء</th>
                <th style={{
                  textAlign: 'right',
                  padding: 16,
                  fontWeight: 700,
                  fontSize: 14
                }}>آخر تحديث</th>
                <th style={{
                  textAlign: 'center',
                  padding: 16,
                  fontWeight: 700,
                  fontSize: 14
                }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((r, i) => (
                <tr
                  key={r._id || r.id}
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
                  <td style={{ padding: 16, fontWeight: 700, color: BRAND.dark }}>
                    {r.name}
                  </td>
                  <td style={{ padding: 16 }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '6px 14px',
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 700,
                      background: '#d1fae5',
                      color: '#065f46'
                    }}>
                      ✓ {r.status}
                    </span>
                  </td>
                  <td style={{ padding: 16, minWidth: 150 }}>
                    <ProgressBar progress={r.progress || 0} size="small" />
                  </td>
                  <td style={{ padding: 16, color: BRAND.accent, fontWeight: 700 }}>
                    ${(r.totalCost || r.budget || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: 16, color: BRAND.muted, fontWeight: 600 }}>
                    📷 {r.images?.length || 0}
                  </td>
                  <td style={{ padding: 16, color: BRAND.muted, fontSize: 14 }}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString('ar-SA') : '-'}
                  </td>
                  <td style={{ padding: 16, color: BRAND.muted, fontSize: 14 }}>
                    {r.updatedAt ? new Date(r.updatedAt).toLocaleDateString('ar-SA') : '-'}
                  </td>
                  <td style={{ padding: 16, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => showProjectDetails(r._id || r.id)}
                        disabled={isDetailsLoading}
                        style={{
                          background: isDetailsLoading ? BRAND.muted : BRAND.accent,
                          color: '#fff',
                          border: 0,
                          borderRadius: 10,
                          padding: '10px 18px',
                          fontWeight: 700,
                          cursor: isDetailsLoading ? 'not-allowed' : 'pointer',
                          fontSize: 13,
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 10px rgba(42,157,143,0.2)',
                          opacity: isDetailsLoading ? 0.6 : 1
                        }}
                        onMouseOver={e => {
                          if (!isDetailsLoading) {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(42,157,143,0.3)';
                          }
                        }}
                        onMouseOut={e => {
                          if (!isDetailsLoading) {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = '0 2px 10px rgba(42,157,143,0.2)';
                          }
                        }}
                      >
                        {isDetailsLoading ? '⏳ جاري التحميل...' : 'عرض التفاصيل'}
                      </button>
                      <button
                        onClick={() => showEditModal(r._id || r.id)}
                        disabled={isDetailsLoading || isSaving}
                        style={{
                          background: isDetailsLoading || isSaving ? BRAND.muted : '#f59e0b',
                          color: '#fff',
                          border: 0,
                          borderRadius: 10,
                          padding: '10px 18px',
                          fontWeight: 700,
                          cursor: (isDetailsLoading || isSaving) ? 'not-allowed' : 'pointer',
                          fontSize: 13,
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 10px rgba(245,158,11,0.2)',
                          opacity: (isDetailsLoading || isSaving) ? 0.6 : 1
                        }}
                        onMouseOver={e => {
                          if (!isDetailsLoading && !isSaving) {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(245,158,11,0.3)';
                          }
                        }}
                        onMouseOut={e => {
                          if (!isDetailsLoading && !isSaving) {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = '0 2px 10px rgba(245,158,11,0.2)';
                          }
                        }}
                      >
                        ✏️ تعديل
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={`تفاصيل المشروع: ${selectedProject.name || 'غير محدد'}`}
        >
          <div style={{ lineHeight: 1.8 }}>
            <div style={{
              marginBottom: 16,
              padding: 12,
              background: BRAND.light,
              borderRadius: 8
            }}>
              <strong style={{ color: BRAND.dark, display: 'block', marginBottom: 8 }}>الاسم:</strong>
              <span style={{ color: BRAND.muted }}>{selectedProject.name || 'غير محدد'}</span>
            </div>

            {selectedProject.description && (
              <div style={{
                marginBottom: 16,
                padding: 12,
                background: BRAND.light,
                borderRadius: 8
              }}>
                <strong style={{ color: BRAND.dark, display: 'block', marginBottom: 8 }}>الوصف:</strong>
                <span style={{ color: BRAND.muted }}>{selectedProject.description}</span>
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              marginBottom: 16
            }}>
              <div style={{
                padding: 12,
                background: BRAND.light,
                borderRadius: 8
              }}>
                <strong style={{ color: BRAND.dark, display: 'block', marginBottom: 8 }}>الحالة:</strong>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 700,
                  background: '#d1fae5',
                  color: '#065f46'
                }}>
                  {selectedProject.status || 'غير محدد'}
                </span>
              </div>

              <div style={{
                padding: 12,
                background: BRAND.light,
                borderRadius: 8
              }}>
                <strong style={{ color: BRAND.dark, display: 'block', marginBottom: 8 }}>الميزانية:</strong>
                <span style={{ color: BRAND.accent, fontWeight: 700 }}>
                  ${(selectedProject.budget || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              marginBottom: 16
            }}>
              <div style={{
                padding: 12,
                background: BRAND.light,
                borderRadius: 8
              }}>
                <strong style={{ color: BRAND.dark, display: 'block', marginBottom: 8 }}>التكلفة الإجمالية:</strong>
                <span style={{ color: BRAND.accent, fontWeight: 700 }}>
                  ${(selectedProject.totalCost || 0).toLocaleString()}
                </span>
              </div>

              <div style={{
                padding: 12,
                background: BRAND.light,
                borderRadius: 8
              }}>
                <strong style={{ color: BRAND.dark, display: 'block', marginBottom: 12 }}>التقدم:</strong>
                <ProgressBar progress={selectedProject.progress || 0} size="large" />
              </div>
            </div>

            {selectedProject.location && (
              <div style={{
                marginBottom: 16,
                padding: 12,
                background: BRAND.light,
                borderRadius: 8
              }}>
                <strong style={{ color: BRAND.dark, display: 'block', marginBottom: 8 }}>الموقع:</strong>
                <span style={{ color: BRAND.muted }}>{selectedProject.location}</span>
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              marginBottom: 16
            }}>
              {selectedProject.startDate && (
                <div style={{
                  padding: 12,
                  background: BRAND.light,
                  borderRadius: 8
                }}>
                  <strong style={{ color: BRAND.dark, display: 'block', marginBottom: 8 }}>تاريخ البدء:</strong>
                  <span style={{ color: BRAND.muted }}>
                    {new Date(selectedProject.startDate).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              )}

              {selectedProject.expectedEndDate && (
                <div style={{
                  padding: 12,
                  background: BRAND.light,
                  borderRadius: 8
                }}>
                  <strong style={{ color: BRAND.dark, display: 'block', marginBottom: 8 }}>تاريخ الانتهاء المتوقع:</strong>
                  <span style={{ color: BRAND.muted }}>
                    {new Date(selectedProject.expectedEndDate).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              marginBottom: 16
            }}>
              <div style={{
                padding: 12,
                background: BRAND.light,
                borderRadius: 8
              }}>
                <strong style={{ color: BRAND.dark, display: 'block', marginBottom: 8 }}>عدد الصور:</strong>
                <span style={{ color: BRAND.muted }}>
                  📷 {selectedProject.images?.length || 0}
                </span>
              </div>

              <div style={{
                padding: 12,
                background: BRAND.light,
                borderRadius: 8
              }}>
                <strong style={{ color: BRAND.dark, display: 'block', marginBottom: 8 }}>عدد المهندسين:</strong>
                <span style={{ color: BRAND.muted }}>
                  👷 {selectedProject.engineers?.length || 0}
                </span>
              </div>
            </div>

            {selectedProject.createdAt && (
              <div style={{
                marginBottom: 16,
                padding: 12,
                background: BRAND.light,
                borderRadius: 8
              }}>
                <strong style={{ color: BRAND.dark, display: 'block', marginBottom: 8 }}>تاريخ الإنشاء:</strong>
                <span style={{ color: BRAND.muted }}>
                  {new Date(selectedProject.createdAt).toLocaleDateString('ar-SA')}
                </span>
              </div>
            )}

            {selectedProject.notes && (
              <div style={{
                marginBottom: 16,
                padding: 12,
                background: BRAND.light,
                borderRadius: 8
              }}>
                <strong style={{ color: BRAND.dark, display: 'block', marginBottom: 8 }}>ملاحظات:</strong>
                <span style={{ color: BRAND.muted }}>{selectedProject.notes}</span>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Edit Project Modal */}
      {projectToEdit && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setProjectToEdit(null);
            setProjectStatus('pending');
            setEngineers([]);
            setImages([]);
            setProjectProgress(0);
          }}
          title={`تعديل المشروع: ${projectToEdit.name || 'غير محدد'}`}
          size="large"
        >
          <div style={{ maxHeight: '80vh', overflowY: 'auto', padding: '0 8px' }}>
            {/* Status Section */}
            <div style={{
              marginBottom: 24,
              padding: 16,
              background: BRAND.light,
              borderRadius: 12,
              border: `2px solid ${BRAND.accent}`
            }}>
              <h3 style={{
                marginTop: 0,
                marginBottom: 16,
                color: BRAND.primary,
                fontSize: 18,
                fontWeight: 800
              }}>
                📋 حالة المشروع
              </h3>
              <div style={{ marginBottom: 12 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 8,
                  color: BRAND.dark,
                  fontSize: 14,
                  fontWeight: 700
                }}>
                  اختر حالة المشروع:
                </label>
                <select
                  value={projectStatus}
                  onChange={(e) => setProjectStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600,
                    background: '#fff',
                    color: BRAND.dark,
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = BRAND.accent;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${BRAND.accent}33`;
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="pending">⏳ قيد الانتظار</option>
                  <option value="in-progress">🔄 قيد التنفيذ</option>
                  <option value="completed">✅ مكتمل</option>
                  <option value="cancelled">❌ ملغي</option>
                </select>
              </div>
              <div style={{
                padding: 12,
                background: '#fff',
                borderRadius: 8,
                fontSize: 13,
                color: BRAND.muted
              }}>
                الحالة الحالية: <strong style={{ color: BRAND.primary }}>{projectToEdit.status || 'غير محدد'}</strong>
              </div>
            </div>

            {/* Engineers Section */}
            <div style={{
              marginBottom: 24,
              padding: 16,
              background: BRAND.light,
              borderRadius: 12,
              border: `2px solid ${BRAND.accent}`
            }}>
              <h3 style={{
                marginTop: 0,
                marginBottom: 16,
                color: BRAND.primary,
                fontSize: 18,
                fontWeight: 800
              }}>
                👷 إدارة المهندسين
              </h3>

              {/* Engineers List */}
              <div style={{ marginBottom: 16 }}>
                {engineers.length === 0 ? (
                  <div style={{
                    padding: 16,
                    textAlign: 'center',
                    color: BRAND.muted,
                    background: '#fff',
                    borderRadius: 8
                  }}>
                    لا يوجد مهندسين مضافة
                  </div>
                ) : (
                  engineers.map((eng) => (
                    <div
                      key={eng.id}
                      style={{
                        padding: 12,
                        background: '#fff',
                        borderRadius: 8,
                        marginBottom: 8,
                        border: '1px solid #e5e7eb',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'none';
                      }}
                      onClick={() => setSelectedEngineer(eng)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: BRAND.dark, marginBottom: 6, fontSize: 15 }}>
                            {eng.name}
                          </div>
                          <div style={{ fontSize: 13, color: BRAND.muted, marginBottom: 4 }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '3px 10px',
                              background: BRAND.accent,
                              color: '#fff',
                              borderRadius: 4,
                              fontSize: 12,
                              marginLeft: 8,
                              fontWeight: 600
                            }}>
                              {eng.specialty}
                            </span>
                            <span style={{ marginLeft: 12, fontWeight: 600 }}>
                              💰 ${eng.salary?.toLocaleString() || 0}
                            </span>
                          </div>
                          {(eng.phone || eng.email) && (
                            <div style={{ fontSize: 12, color: BRAND.muted, marginTop: 4 }}>
                              {eng.phone && <span>📞 {eng.phone}</span>}
                              {eng.phone && eng.email && <span style={{ marginLeft: 12 }}>|</span>}
                              {eng.email && <span style={{ marginLeft: 12 }}>📧 {eng.email}</span>}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveEngineer(eng.id);
                          }}
                          style={{
                            background: '#ef4444',
                            color: '#fff',
                            border: 0,
                            padding: '6px 12px',
                            borderRadius: 6,
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 600,
                            marginLeft: 8
                          }}
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Engineer Form */}
              <form onSubmit={handleAddEngineer} style={{
                padding: 16,
                background: '#fff',
                borderRadius: 8,
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{
                  marginTop: 0,
                  marginBottom: 12,
                  color: BRAND.dark,
                  fontSize: 14,
                  fontWeight: 700
                }}>
                  ➕ إضافة مهندس جديد
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: 6,
                      fontSize: 13,
                      color: BRAND.dark,
                      fontWeight: 600
                    }}>
                      اسم المهندس *
                    </label>
                    <input
                      type="text"
                      value={newEngineer.name}
                      onChange={(e) => setNewEngineer({ ...newEngineer, name: e.target.value })}
                      placeholder="اسم المهندس"
                      required
                      style={{
                        width: '100%',
                        padding: 10,
                        borderRadius: 8,
                        border: '2px solid #e5e7eb',
                        fontSize: 14,
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: 6,
                      fontSize: 13,
                      color: BRAND.dark,
                      fontWeight: 600
                    }}>
                      التخصص *
                    </label>
                    <select
                      value={newEngineer.specialty}
                      onChange={(e) => setNewEngineer({ ...newEngineer, specialty: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: 10,
                        borderRadius: 8,
                        border: '2px solid #e5e7eb',
                        fontSize: 14,
                        outline: 'none',
                        background: '#fff'
                      }}
                    >
                      <option value="مدني">مهندس مدني</option>
                      <option value="عمارة">مهندس عمارة</option>
                      <option value="كهرباء">مهندس كهرباء</option>
                    </select>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: 6,
                      fontSize: 13,
                      color: BRAND.dark,
                      fontWeight: 600
                    }}>
                      الراتب ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newEngineer.salary}
                      onChange={(e) => setNewEngineer({ ...newEngineer, salary: e.target.value })}
                      placeholder="0"
                      required
                      min="0"
                      style={{
                        width: '100%',
                        padding: 10,
                        borderRadius: 8,
                        border: '2px solid #e5e7eb',
                        fontSize: 14,
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: 6,
                      fontSize: 13,
                      color: BRAND.dark,
                      fontWeight: 600
                    }}>
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={newEngineer.phone}
                      onChange={(e) => setNewEngineer({ ...newEngineer, phone: e.target.value })}
                      placeholder="رقم الهاتف"
                      style={{
                        width: '100%',
                        padding: 10,
                        borderRadius: 8,
                        border: '2px solid #e5e7eb',
                        fontSize: 14,
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: 6,
                      fontSize: 13,
                      color: BRAND.dark,
                      fontWeight: 600
                    }}>
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={newEngineer.email}
                      onChange={(e) => setNewEngineer({ ...newEngineer, email: e.target.value })}
                      placeholder="example@email.com"
                      style={{
                        width: '100%',
                        padding: 10,
                        borderRadius: 8,
                        border: '2px solid #e5e7eb',
                        fontSize: 14,
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: 6,
                    fontSize: 13,
                    color: BRAND.dark,
                    fontWeight: 600
                  }}>
                    ملاحظات
                  </label>
                  <textarea
                    value={newEngineer.notes}
                    onChange={(e) => setNewEngineer({ ...newEngineer, notes: e.target.value })}
                    placeholder="ملاحظات إضافية عن المهندس"
                    rows={2}
                    style={{
                      width: '100%',
                      padding: 10,
                      borderRadius: 8,
                      border: '2px solid #e5e7eb',
                      fontSize: 14,
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: BRAND.accent,
                    color: '#fff',
                    border: 0,
                    padding: '12px 24px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: 14,
                    width: '100%'
                  }}
                >
                  ➕ إضافة المهندس
                </button>
              </form>

              {/* Total Engineers Salary */}
              <div style={{
                marginTop: 12,
                padding: 12,
                background: BRAND.primary,
                color: '#fff',
                borderRadius: 8,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 12, opacity: 0.9 }}>إجمالي رواتب المهندسين</div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>
                  ${engineers.reduce((sum, eng) => sum + (parseFloat(eng.salary) || 0), 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div style={{
              marginBottom: 24,
              padding: 16,
              background: BRAND.light,
              borderRadius: 12,
              border: `2px solid ${BRAND.accent}`
            }}>
              <h3 style={{
                marginTop: 0,
                marginBottom: 16,
                color: BRAND.primary,
                fontSize: 18,
                fontWeight: 800
              }}>
                📊 تحديث التقدم
              </h3>
              
              <div style={{
                padding: 16,
                background: '#fff',
                borderRadius: 8,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: 8,
                    fontSize: 14,
                    color: BRAND.dark,
                    fontWeight: 600
                  }}>
                    نسبة التقدم (%)
                  </label>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={projectProgress}
                      onChange={(e) => setProjectProgress(parseInt(e.target.value))}
                      style={{
                        flex: 1,
                        height: 8,
                        borderRadius: 4,
                        background: BRAND.light,
                        outline: 'none'
                      }}
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={projectProgress}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setProjectProgress(Math.min(Math.max(value, 0), 100));
                      }}
                      style={{
                        width: 80,
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '2px solid #e5e7eb',
                        fontSize: 16,
                        fontWeight: 700,
                        textAlign: 'center',
                        outline: 'none'
                      }}
                    />
                    <span style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: BRAND.accent,
                      minWidth: 40
                    }}>
                      %
                    </span>
                  </div>
                </div>
                
                <div style={{ marginTop: 16 }}>
                  <div style={{ marginBottom: 8 }}>
                    <strong style={{ color: BRAND.dark, fontSize: 13 }}>معاينة التقدم:</strong>
                  </div>
                  <ProgressBar progress={projectProgress} size="large" />
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div style={{
              padding: 16,
              background: BRAND.light,
              borderRadius: 12,
              border: `2px solid ${BRAND.accent}`
            }}>
              <h3 style={{
                marginTop: 0,
                marginBottom: 16,
                color: BRAND.primary,
                fontSize: 18,
                fontWeight: 800
              }}>
                📷 صور المشروع {uploading && <span style={{ color: BRAND.accent, fontSize: 13 }}>— جاري الرفع...</span>}
              </h3>

              <div style={{ marginBottom: 16 }}>
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
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  disabled={uploading}
                  style={{
                    background: BRAND.accent,
                    color: '#fff',
                    border: 0,
                    padding: '12px 20px',
                    borderRadius: 8,
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    fontWeight: 700,
                    fontSize: 14,
                    opacity: uploading ? 0.6 : 1
                  }}
                >
                  📤 رفع صور من جهازي
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: 12
              }}>
                {images.length === 0 ? (
                  <div style={{
                    gridColumn: '1 / -1',
                    padding: 24,
                    textAlign: 'center',
                    color: BRAND.muted,
                    background: '#fff',
                    borderRadius: 8
                  }}>
                    لا توجد صور مرفوعة
                  </div>
                ) : (
                  images.map((img, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'relative',
                        borderRadius: 8,
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      <img
                        src={typeof img === 'string' ? img : img.url || img}
                        alt={`Project ${index + 1}`}
                        style={{
                          width: '100%',
                          height: 120,
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                      <button
                        onClick={() => handleRemoveImage(img, index)}
                        style={{
                          position: 'absolute',
                          top: 4,
                          left: 4,
                          background: '#ef4444',
                          color: '#fff',
                          border: 0,
                          padding: '4px 8px',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontSize: 11,
                          fontWeight: 600
                        }}
                      >
                        حذف
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: 12,
              marginTop: 24,
              paddingTop: 16,
              borderTop: '2px solid #e5e7eb'
            }}>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                style={{
                  flex: 1,
                  background: isSaving ? BRAND.muted : BRAND.accent,
                  color: '#fff',
                  border: 0,
                  padding: '14px 24px',
                  borderRadius: 10,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                  fontSize: 15,
                  opacity: isSaving ? 0.6 : 1
                }}
              >
                {isSaving ? '⏳ جاري الحفظ...' : '💾 حفظ التعديلات'}
              </button>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setProjectToEdit(null);
                  setEngineers([]);
                  setImages([]);
                }}
                disabled={isSaving}
                style={{
                  flex: 1,
                  background: BRAND.light,
                  color: BRAND.dark,
                  border: `2px solid ${BRAND.muted}`,
                  padding: '14px 24px',
                  borderRadius: 10,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                  fontSize: 15
                }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Engineer Details Modal */}
      {selectedEngineer && (
        <Modal
          isOpen={!!selectedEngineer}
          onClose={() => setSelectedEngineer(null)}
          title={`تفاصيل المهندس: ${selectedEngineer.name}`}
        >
          <div style={{ lineHeight: 1.8 }}>
            <div style={{
              marginBottom: 16,
              padding: 16,
              background: BRAND.light,
              borderRadius: 12
            }}>
              <div style={{ marginBottom: 12 }}>
                <strong style={{ color: BRAND.dark, display: 'block', marginBottom: 6 }}>الاسم الكامل:</strong>
                <span style={{ color: BRAND.muted, fontSize: 16, fontWeight: 600 }}>{selectedEngineer.name}</span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                marginBottom: 12
              }}>
                <div>
                  <strong style={{ color: BRAND.dark, display: 'block', marginBottom: 6 }}>التخصص:</strong>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    background: BRAND.accent,
                    color: '#fff',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600
                  }}>
                    {selectedEngineer.specialty}
                  </span>
                </div>
                <div>
                  <strong style={{ color: BRAND.dark, display: 'block', marginBottom: 6 }}>الراتب:</strong>
                  <span style={{ color: BRAND.accent, fontSize: 16, fontWeight: 700 }}>
                    ${selectedEngineer.salary?.toLocaleString() || 0}
                  </span>
                </div>
              </div>

              {selectedEngineer.phone && (
                <div style={{ marginBottom: 12 }}>
                  <strong style={{ color: BRAND.dark, display: 'block', marginBottom: 6 }}>📞 رقم الهاتف:</strong>
                  <span style={{ color: BRAND.muted }}>
                    <a href={`tel:${selectedEngineer.phone}`} style={{ color: BRAND.accent, textDecoration: 'none' }}>
                      {selectedEngineer.phone}
                    </a>
                  </span>
                </div>
              )}

              {selectedEngineer.email && (
                <div style={{ marginBottom: 12 }}>
                  <strong style={{ color: BRAND.dark, display: 'block', marginBottom: 6 }}>📧 البريد الإلكتروني:</strong>
                  <span style={{ color: BRAND.muted }}>
                    <a href={`mailto:${selectedEngineer.email}`} style={{ color: BRAND.accent, textDecoration: 'none' }}>
                      {selectedEngineer.email}
                    </a>
                  </span>
                </div>
              )}

              {selectedEngineer.notes && (
                <div>
                  <strong style={{ color: BRAND.dark, display: 'block', marginBottom: 6 }}>📝 ملاحظات:</strong>
                  <div style={{
                    padding: 12,
                    background: '#fff',
                    borderRadius: 8,
                    color: BRAND.muted,
                    border: '1px solid #e5e7eb',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {selectedEngineer.notes}
                  </div>
                </div>
              )}

              {!selectedEngineer.phone && !selectedEngineer.email && !selectedEngineer.notes && (
                <div style={{
                  padding: 16,
                  textAlign: 'center',
                  color: BRAND.muted,
                  fontSize: 14
                }}>
                  لا توجد معلومات إضافية متاحة
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}


>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
