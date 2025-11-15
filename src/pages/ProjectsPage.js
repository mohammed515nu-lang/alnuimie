import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const projectCategories = [
    { id: "all", name: "كل المشاريع" },
    { id: "residential", name: "سكني" },
    { id: "commercial", name: "تجاري" },
    { id: "industrial", name: "صناعي" },
    { id: "infrastructure", name: "بنية تحتية" },
    { id: "tourism", name: "سياحي" }
  ];

  const projects = [
    {
      id: 1,
      title: "مجمع سكني الراقي",
      category: "residential",
      location: "دمشق، المزة",
      client: "شركة العقار الذهبي",
      contractor: "شركة البناء المتطور",
      area: "12,500 م²",
      duration: "24 شهر",
      status: "قيد التنفيذ",
      completion: 65,
      cost: "2.5 مليار ل.س",
      startDate: "يناير 2022",
      endDate: "يناير 2024",
      description: "مشروع مجمع سكني فاخر يتكون من 3 أبراج سكنية مع مرافق تجارية وخدمية",
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1600585154526-990dac4d53ef?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=500&fit=crop"
      ],
      features: ["3 أبراج سكنية", "مركز تسوق", "نادي صحي", "منطقة لعب أطفال", "مواقف سيارات"]
    },
    {
      id: 2,
      title: "مركز تجاري حديث",
      category: "commercial",
      location: "حلب، الجديدة",
      client: "مجموعة الأبراج التجارية",
      contractor: "مجموعة الأبنية الحديثة",
      area: "25,000 م²",
      duration: "18 شهر",
      status: "مكتمل",
      completion: 100,
      cost: "3.2 مليار ل.س",
      startDate: "مارس 2021",
      endDate: "أغسطس 2022",
      description: "مركز تجاري حديث على مساحة 25,000 متر مربع مع أكثر من 150 محل تجاري",
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=800&h=500&fit=crop"
      ],
      features: ["150 محل تجاري", "منطقة طعام", "سينما", "منطقة ألعاب", "مواقف سيارات متعددة الطوابق"]
    },
    {
      id: 3,
      title: "فندق الخمس نجوم",
      category: "tourism",
      location: "اللاذقية، الشاطئ",
      client: "شركة السياحة السورية",
      contractor: "مؤسسة الهندسة المتقدمة",
      area: "18,000 م²",
      duration: "30 شهر",
      status: "قيد التنفيذ",
      completion: 40,
      cost: "4.8 مليار ل.س",
      startDate: "يونيو 2022",
      endDate: "ديسمبر 2024",
      description: "فندق خمس نجوم على شاطئ البحر مع 250 غرفة ومرافق سياحية فاخرة",
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=500&fit=crop"
      ],
      features: ["250 غرفة", "مسبح أولمبي", "منتجع صحي", "6 مطاعم", "قاعة مؤتمرات"]
    },
    {
      id: 4,
      title: "مصنع معالجة المواد الغذائية",
      category: "industrial",
      location: "حماة، المنطقة الصناعية",
      client: "شركة الغذاء الصحي",
      contractor: "شركة الإنشاءات الصناعية",
      area: "30,000 م²",
      duration: "20 شهر",
      status: "مكتمل",
      completion: 100,
      cost: "5.5 مليار ل.س",
      startDate: "مايو 2021",
      endDate: "يناير 2023",
      description: "مصنع حديث لمعالجة وتعبئة المواد الغذائية بأحدث التقنيات العالمية",
      images: [
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=500&fit=crop"
      ],
      features: ["خطوط إنتاج متطورة", "مختبرات مراقبة جودة", "مستودعات تبريد", "وحدة تغليف", "محطة معالجة مياه"]
    },
    {
      id: 5,
      title: "مستشفى تخصصي",
      category: "infrastructure",
      location: "حمص، الحمراء",
      client: "وزارة الصحة",
      contractor: "شركة المباني الطبية",
      area: "22,000 م²",
      duration: "28 شهر",
      status: "قيد التنفيذ",
      completion: 55,
      cost: "6.2 مليار ل.س",
      startDate: "أكتوبر 2021",
      endDate: "فبراير 2024",
      description: "مستشفى تخصصي حديث بسعة 300 سرير مع أحدث المعدات الطبية",
      images: [
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=500&fit=crop"
      ],
      features: ["300 سرير", "15 غرفة عمليات", "قسائم طوارئ", "مختبرات متطورة", "مركز أبحاث"]
    },
    {
      id: 6,
      title: "مجمع فيلات فاخر",
      category: "residential",
      location: "ريف دمشق، عين ترما",
      client: "شركة الضاحية السكنية",
      contractor: "مجموعة العمارة المستقبلية",
      area: "45,000 م²",
      duration: "36 شهر",
      status: "قيد التنفيذ",
      completion: 30,
      cost: "7.8 مليار ل.س",
      startDate: "مارس 2022",
      endDate: "مارس 2025",
      description: "مجمع سكني فاخر يضم 80 فيلا تصميمات معمارية حديثة مع مساحات خضراء واسعة",
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1600585154526-990dac4d53ef?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=500&fit=crop"
      ],
      features: ["80 فيلا", "نادي رياضي", "منطقة لعب أطفال", "بحيرات صناعية", "أمن على مدار الساعة"]
    }
  ];

  const filteredProjects = activeCategory === "all" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  const getStatusColor = (status) => {
    switch(status) {
      case "مكتمل": return "#2e7d32";
      case "قيد التنفيذ": return "#f57c00";
      case "معلق": return "#d32f2f";
      default: return "#757575";
    }
  };

  const getStatusBgColor = (status) => {
    switch(status) {
      case "مكتمل": return "rgba(46, 125, 50, 0.1)";
      case "قيد التنفيذ": return "rgba(245, 124, 0, 0.1)";
      case "معلق": return "rgba(211, 47, 47, 0.1)";
      default: return "rgba(117, 117, 117, 0.1)";
    }
  };

  return (
    <div dir="rtl" style={{ fontFamily: 'Cairo, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#2e7d32',
        padding: '20px 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
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
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ← العودة
            </button>
            <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>المشاريع</div>
          </div>

          <div style={{ color: 'white', fontSize: '16px' }}>
            {filteredProjects.length} مشروع
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        backgroundColor: '#f0f8f0',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '32px', color: '#2e7d32', marginBottom: '20px' }}>
            معرض المشاريع المنجزة وقيد التنفيذ
          </h1>
          <p style={{ fontSize: '18px', color: '#555', lineHeight: 1.6 }}>
            استعرض أحدث مشاريعنا في مختلف المجالات العمرانية والإنشائية
          </p>
        </div>
      </section>

      {/* Filters */}
      <section style={{ padding: '20px 0', backgroundColor: 'white', borderBottom: '1px solid #eee' }}>
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
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {projectCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '30px',
                  border: 'none',
                  backgroundColor: activeCategory === category.id ? '#2e7d32' : '#f0f0f0',
                  color: activeCategory === category.id ? 'white' : '#333',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500'
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
                borderRadius: '5px',
                border: 'none',
                backgroundColor: viewMode === "grid" ? '#2e7d32' : '#f0f0f0',
                color: viewMode === "grid" ? 'white' : '#333',
                cursor: 'pointer'
              }}
            >
              ⚏ شبكة
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: '8px 12px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: viewMode === "list" ? '#2e7d32' : '#f0f0f0',
                color: viewMode === "list" ? 'white' : '#333',
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
          display: viewMode === "grid" ? 'grid' : 'block',
          gridTemplateColumns: viewMode === "grid" ? 'repeat(auto-fill, minmax(350px, 1fr))' : 'none',
          gap: viewMode === "grid" ? '30px' : '0',
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
          {filteredProjects.map(project => (
            viewMode === "grid" ? (
              // Grid View
              <div key={project.id} style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease'
              }}>
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img 
                    src={project.images[0]} 
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>{project.title}</h3>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      backgroundColor: getStatusBgColor(project.status),
                      padding: '5px 10px',
                      borderRadius: '20px',
                      color: getStatusColor(project.status),
                      fontSize: '14px'
                    }}>
                      {project.status}
                    </div>
                  </div>

                  <div style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
                    📍 {project.location}
                  </div>

                  <div style={{ color: '#666', marginBottom: '15px', fontSize: '14px', lineHeight: 1.5 }}>
                    {project.description}
                  </div>

                  {project.status === "قيد التنفيذ" && (
                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>نسبة الإنجاز</span>
                        <span style={{ fontSize: '14px', color: '#2e7d32', fontWeight: 'bold' }}>{project.completion}%</span>
                      </div>
                      <div style={{
                        height: '8px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${project.completion}%`,
                          backgroundColor: '#2e7d32',
                          borderRadius: '4px'
                        }}></div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <div style={{ color: '#666', fontSize: '14px' }}>
                      📐 {project.area}
                    </div>
                    <div style={{ color: '#666', fontSize: '14px' }}>
                      📅 {project.duration}
                    </div>
                  </div>

                  <button onClick={() => navigate('/login')} style={{
                    backgroundColor: '#2e7d32',
                    color: 'white',
                    border: 'none',
                    padding: '8px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    width: '100%'
                  }}>
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            ) : (
              // List View
              <div key={project.id} style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
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
                    src={project.images[0]} 
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                <div style={{ padding: '20px', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '20px', color: '#333' }}>{project.title}</h3>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      backgroundColor: getStatusBgColor(project.status),
                      padding: '5px 10px',
                      borderRadius: '20px',
                      color: getStatusColor(project.status),
                      fontSize: '14px'
                    }}>
                      {project.status}
                    </div>
                  </div>

                  <div style={{ color: '#666', marginBottom: '15px' }}>
                    📍 {project.location}
                  </div>

                  <div style={{ color: '#666', marginBottom: '15px', lineHeight: 1.5 }}>
                    {project.description}
                  </div>

                  {project.status === "قيد التنفيذ" && (
                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>نسبة الإنجاز</span>
                        <span style={{ fontSize: '14px', color: '#2e7d32', fontWeight: 'bold' }}>{project.completion}%</span>
                      </div>
                      <div style={{
                        height: '8px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${project.completion}%`,
                          backgroundColor: '#2e7d32',
                          borderRadius: '4px'
                        }}></div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ color: '#666', fontSize: '14px' }}>
                      📐 {project.area}
                    </div>
                    <div style={{ color: '#666', fontSize: '14px' }}>
                      📅 {project.duration}
                    </div>
                    <div style={{ color: '#666', fontSize: '14px' }}>
                      💰 {project.cost}
                    </div>
                    <div style={{ color: '#666', fontSize: '14px' }}>
                      🏢 {project.client}
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
            )
          ))}
        </div>
      </section>

      {/* Pagination */}
      <div style={{
        maxWidth: '1200px',
        margin: '30px auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'center',
        gap: '10px'
      }}>
        <button style={{
          padding: '8px 15px',
          borderRadius: '5px',
          border: '1px solid #ddd',
          backgroundColor: 'white',
          cursor: 'pointer'
        }}>السابق</button>

        <button style={{
          padding: '8px 15px',
          borderRadius: '5px',
          border: '1px solid #ddd',
          backgroundColor: '#2e7d32',
          color: 'white',
          cursor: 'pointer'
        }}>1</button>

        <button style={{
          padding: '8px 15px',
          borderRadius: '5px',
          border: '1px solid #ddd',
          backgroundColor: 'white',
          cursor: 'pointer'
        }}>2</button>

        <button style={{
          padding: '8px 15px',
          borderRadius: '5px',
          border: '1px solid #ddd',
          backgroundColor: 'white',
          cursor: 'pointer'
        }}>3</button>

        <button style={{
          padding: '8px 15px',
          borderRadius: '5px',
          border: '1px solid #ddd',
          backgroundColor: 'white',
          cursor: 'pointer'
        }}>التالي</button>
      </div>
    </div>
  );
}
