import React, { useState, useEffect, useRef } from "react";
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
    </div>
  );
};

export default function ProjectsList() {
  const notifications = useNotifications();
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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
    } finally {
      setIsSaving(false);
    }
  };

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
