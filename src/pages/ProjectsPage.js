import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { projectsAPI } from "../utils/api";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contractorFilter, setContractorFilter] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('contractorId') || '';
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const projectCategories = [
    { id: "all", name: "كل المشاريع", aliases: null },
    { id: "residential", name: "سكني", aliases: ["residential", "سكني"] },
    { id: "commercial", name: "تجاري", aliases: ["commercial", "تجاري"] },
    { id: "industrial", name: "صناعي", aliases: ["industrial", "صناعي"] },
    { id: "infrastructure", name: "بنية تحتية", aliases: ["infrastructure", "بنية تحتية"] },
    { id: "tourism", name: "سياحي", aliases: ["tourism", "سياحي"] }
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setContractorFilter(params.get('contractorId') || '');
  }, [location.search]);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const filters = {};
        if (contractorFilter) {
          filters.contractor = contractorFilter;
        }
        const data = await projectsAPI.getAll(filters);
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message || 'حدث خطأ أثناء جلب المشاريع');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [contractorFilter]);

  const getStatusKey = (status) => {
    const value = (status || '').toString().toLowerCase();
    if (["completed", "مكتمل"].includes(value)) return 'completed';
    if (["in_progress", "قيد التنفيذ", "active"].includes(value)) return 'inProgress';
    if (["pending", "معلق", "on_hold"].includes(value)) return 'pending';
    return 'default';
  };

  const getStatusLabel = (status) => {
    const key = getStatusKey(status);
    switch (key) {
      case 'completed':
        return 'مكتمل';
      case 'inProgress':
        return 'قيد التنفيذ';
      case 'pending':
        return 'معلق';
      default:
        return status || 'غير محدد';
    }
  };

  const getStatusColor = (status) => {
    const key = getStatusKey(status);
    switch(key) {
      case 'completed': return "#2e7d32";
      case 'inProgress': return "#f57c00";
      case 'pending': return "#d32f2f";
      default: return "#757575";
    }
  };

  const getStatusBgColor = (status) => {
    const key = getStatusKey(status);
    switch(key) {
      case 'completed': return "rgba(46, 125, 50, 0.1)";
      case 'inProgress': return "rgba(245, 124, 0, 0.1)";
      case 'pending': return "rgba(211, 47, 47, 0.1)";
      default: return "rgba(117, 117, 117, 0.1)";
    }
  };

  const selectedCategory = projectCategories.find(cat => cat.id === activeCategory);
  const filteredProjects = projects.filter((project) => {
    if (!selectedCategory || !selectedCategory.aliases) return true;
    const categoryValue = (project.category || '').toString().toLowerCase();
    return selectedCategory.aliases.some(alias => alias.toLowerCase() === categoryValue);
  });

  const defaultImage = "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=500&fit=crop";

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: 'Cairo, sans-serif',
        background: 'radial-gradient(circle at top, rgba(15,23,42,0.65), rgba(2,6,23,0.95))',
        color: '#fdf7f2',
        minHeight: '100vh',
        paddingBottom: '80px'
      }}
    >
      {/* Header */}
      <header style={{
        background: 'rgba(15,23,42,0.85)',
        padding: '18px 0',
        boxShadow: '0 10px 30px rgba(2,6,23,0.4)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={() => navigate('/')}
              style={{
                background: 'linear-gradient(135deg, rgba(194,107,58,0.8), rgba(164,88,43,0.9))',
                color: '#fff',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                boxShadow: '0 10px 25px rgba(194,107,58,0.3)'
              }}
            >
              ← العودة
            </button>
            <div style={{ color: '#fef3c7', fontSize: '20px', fontWeight: 700 }}>المشاريع</div>
          </div>

          <div style={{ color: 'rgba(248,250,252,0.7)', fontSize: '14px' }}>
            {filteredProjects.length} مشروع
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(3,7,18,0.95) 60%)',
        padding: '60px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 20% 20%, rgba(14,165,233,0.25), transparent 45%)',
          pointerEvents: 'none'
        }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
          <h1 style={{ fontSize: '36px', color: '#fef3c7', marginBottom: '18px', fontWeight: 800 }}>
            معرض المشاريع المنجزة وقيد التنفيذ
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(248,250,252,0.78)', lineHeight: 1.8 }}>
            استعرض أحدث مشاريعنا في مختلف المجالات العمرانية والإنشائية
          </p>
          {contractorFilter && (
            <div style={{
              marginTop: '15px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(14,165,233,0.15)',
              color: '#7dd3fc',
              padding: '10px 18px',
              borderRadius: '999px',
              fontSize: '14px',
              border: '1px solid rgba(14,165,233,0.3)'
            }}>
              عرض مشاريع المقاول رقم: {contractorFilter}
              <button onClick={() => navigate('/projects')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#bae6fd',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}>
                إظهار الكل
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Filters */}
      <section style={{ padding: '28px 0', backgroundColor: 'rgba(15,23,42,0.75)', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {projectCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '30px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: activeCategory === category.id
                    ? 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)'
                    : 'rgba(255,255,255,0.04)',
                  color: activeCategory === category.id ? '#f0f9ff' : 'rgba(248,250,252,0.8)',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: activeCategory === category.id ? '0 12px 25px rgba(14,165,233,0.25)' : 'none'
                }}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: viewMode === "grid" ? 'linear-gradient(135deg, #c26b3a, #a4582b)' : 'transparent',
                color: viewMode === "grid" ? '#fff7ed' : 'rgba(248,250,252,0.7)',
                cursor: 'pointer'
              }}
            >
              ⚏ شبكة
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: viewMode === "list" ? 'linear-gradient(135deg, #0ea5e9, #2563eb)' : 'transparent',
                color: viewMode === "list" ? '#fff' : 'rgba(248,250,252,0.7)',
                cursor: 'pointer'
              }}
            >
              ☰ قائمة
            </button>
          </div>
        </div>
      </section>

      {/* Projects Grid/List */}
      <section style={{ padding: '40px 20px' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
        {isLoading && (
          <div style={{
            padding: '30px',
            textAlign: 'center',
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            جاري تحميل المشاريع...
          </div>
        )}
        {error && !isLoading && (
          <div style={{
            padding: '30px',
            textAlign: 'center',
            backgroundColor: 'rgba(239,68,68,0.12)',
            borderRadius: '16px',
            color: '#fecaca',
            border: '1px solid rgba(239,68,68,0.35)'
          }}>
            {error}
          </div>
        )}
        {!isLoading && !error && filteredProjects.length === 0 && (
          <div style={{
            padding: '30px',
            textAlign: 'center',
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            لا توجد مشاريع مطابقة للمعايير الحالية.
          </div>
        )}
        {!isLoading && !error && filteredProjects.length > 0 && (
          <div>
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            <div style={{
              display: viewMode === "grid" ? 'grid' : 'block',
              gridTemplateColumns: viewMode === "grid" ? 'repeat(auto-fill, minmax(350px, 1fr))' : 'none',
              gap: viewMode === "grid" ? '30px' : '0',
              animation: 'fadeIn 0.5s ease-in-out'
            }}>
              {filteredProjects.map((project) => {
                const coverImage = (project.images && project.images[0]) || project.coverImage || defaultImage;
                const completionValue = typeof project.progress === 'number' ? project.progress : (project.completion || 0);
                const statusLabel = getStatusLabel(project.status);
                const projectLocation = project.location || project.city || 'غير محدد';
                const projectArea = project.area || project.size || '—';
                const projectDuration = project.duration || project.timeline || '—';
                const projectCost = project.cost || project.budget ? `${project.budget || project.cost} ل.س` : '—';
                const projectClient = project.clientName || project.client || '—';
                const description = project.description || 'لا توجد تفاصيل إضافية متاحة لهذا المشروع حالياً.';

                if (viewMode === "grid") {
                  return (
                    <div key={project.id} style={{
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 25px 45px rgba(2,6,23,0.65)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      transition: 'transform 0.3s ease, border 0.3s ease'
                    }}>
                      <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(15,23,42,0.75) 100%)',
                          zIndex: 1
                        }} />
                        <img
                          src={coverImage}
                          alt={project.title || 'مشروع'}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '12px',
                          backgroundColor: 'rgba(15,23,42,0.65)',
                          borderRadius: '999px',
                          color: '#e0f2fe',
                          padding: '4px 12px',
                          fontSize: '12px',
                          zIndex: 2
                        }}>
                          {projectClient !== '—' ? projectClient : 'عميل خاص'}
                        </div>
                      </div>

                      <div style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>{project.title || 'مشروع بدون اسم'}</h3>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            backgroundColor: getStatusBgColor(project.status),
                            padding: '5px 10px',
                            borderRadius: '20px',
                            color: getStatusColor(project.status),
                            fontSize: '14px'
                          }}>
                            {statusLabel}
                          </div>
                        </div>

                        <div style={{ color: 'rgba(248,250,252,0.75)', marginBottom: '15px', fontSize: '14px' }}>
                          📍 {projectLocation}
                        </div>

                        <div style={{ color: 'rgba(248,250,252,0.75)', marginBottom: '15px', fontSize: '14px', lineHeight: 1.6 }}>
                          {description}
                        </div>

                        {getStatusKey(project.status) === 'inProgress' && (
                          <div style={{ marginBottom: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                              <span style={{ fontSize: '14px', color: 'rgba(248,250,252,0.75)' }}>نسبة الإنجاز</span>
                              <span style={{ fontSize: '14px', color: '#34d399', fontWeight: 'bold' }}>{completionValue}%</span>
                            </div>
                            <div style={{
                              height: '8px',
                              backgroundColor: 'rgba(255,255,255,0.1)',
                              borderRadius: '999px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                height: '100%',
                                width: `${completionValue}%`,
                                background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
                                borderRadius: '999px'
                              }}></div>
                            </div>
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                          <div style={{ color: 'rgba(248,250,252,0.75)', fontSize: '14px' }}>
                            📐 {projectArea}
                          </div>
                          <div style={{ color: 'rgba(248,250,252,0.75)', fontSize: '14px' }}>
                            📅 {projectDuration}
                          </div>
                          <div style={{ color: 'rgba(248,250,252,0.75)', fontSize: '14px' }}>
                            💰 {projectCost}
                          </div>
                          <div style={{ color: 'rgba(248,250,252,0.75)', fontSize: '14px' }}>
                            🏢 {projectClient}
                          </div>
                        </div>

                        <button onClick={() => navigate('/login')} style={{
                          background: 'linear-gradient(135deg, #c26b3a, #a4582b)',
                          color: '#fff7ed',
                          border: 'none',
                          padding: '10px 18px',
                          borderRadius: '25px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '700',
                          boxShadow: '0 14px 30px rgba(194,107,58,0.35)'
                        }}>
                          عرض التفاصيل
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={project.id} style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 45px rgba(2,6,23,0.65)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    marginBottom: '20px',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row'
                  }}>
                    <div style={{ 
                      width: isMobile ? '100%' : '300px', 
                      height: isMobile ? '200px' : 'auto',
                      overflow: 'hidden' 
                    }}>
                      <img 
                        src={coverImage}
                        alt={project.title || 'مشروع'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>

                    <div style={{ padding: '20px', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '20px', color: '#fef3c7' }}>{project.title || 'مشروع بدون اسم'}</h3>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          backgroundColor: getStatusBgColor(project.status),
                          padding: '5px 10px',
                          borderRadius: '20px',
                          color: getStatusColor(project.status),
                          fontSize: '14px'
                        }}>
                          {statusLabel}
                        </div>
                      </div>

                      <div style={{ color: 'rgba(248,250,252,0.75)', marginBottom: '15px' }}>
                        📍 {projectLocation}
                      </div>

                      <div style={{ color: 'rgba(248,250,252,0.75)', marginBottom: '15px', lineHeight: 1.6 }}>
                        {description}
                      </div>

                      {getStatusKey(project.status) === 'inProgress' && (
                        <div style={{ marginBottom: '15px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <span style={{ fontSize: '14px', color: '#666' }}>نسبة الإنجاز</span>
                            <span style={{ fontSize: '14px', color: '#2e7d32', fontWeight: 'bold' }}>{completionValue}%</span>
                          </div>
                          <div style={{
                            height: '8px',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              height: '100%',
                              width: `${completionValue}%`,
                              backgroundColor: '#2e7d32',
                              borderRadius: '4px'
                            }}></div>
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ color: '#666', fontSize: '14px' }}>
                          📐 {projectArea}
                        </div>
                        <div style={{ color: '#666', fontSize: '14px' }}>
                          📅 {projectDuration}
                        </div>
                        <div style={{ color: '#666', fontSize: '14px' }}>
                          💰 {projectCost}
                        </div>
                        <div style={{ color: '#666', fontSize: '14px' }}>
                          🏢 {projectClient}
                        </div>
                      </div>

                      <button onClick={() => navigate('/login')} style={{
                        backgroundColor: '#2e7d32',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}>
                        عرض التفاصيل
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </div>
      </section>

      {/* Pagination */}
      <div style={{
        maxWidth: '1200px',
        margin: '30px auto 0',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'center',
        gap: '10px'
      }}>
        <button style={{
          padding: '8px 16px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.15)',
          backgroundColor: 'transparent',
          color: 'rgba(248,250,252,0.8)',
          cursor: 'pointer'
        }}>السابق</button>

        <button style={{
          padding: '8px 16px',
          borderRadius: '10px',
          border: 'none',
          background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
          color: '#f0f9ff',
          cursor: 'pointer',
          boxShadow: '0 12px 25px rgba(14,165,233,0.25)'
        }}>1</button>

        <button style={{
          padding: '8px 16px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.15)',
          backgroundColor: 'transparent',
          color: 'rgba(248,250,252,0.8)',
          cursor: 'pointer'
        }}>2</button>

        <button style={{
          padding: '8px 16px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.15)',
          backgroundColor: 'transparent',
          color: 'rgba(248,250,252,0.8)',
          cursor: 'pointer'
        }}>3</button>

        <button style={{
          padding: '8px 16px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.15)',
          backgroundColor: 'transparent',
          color: 'rgba(248,250,252,0.8)',
          cursor: 'pointer'
        }}>التالي</button>
      </div>
    </div>
  );
}
