import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usersAPI } from "../utils/api";

export default function ContractorsPage() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [activeCategory, setActiveCategory] = useState("all");

  const demoContractors = [
    { 
      id: 1, 
      name: "شركة البناء المتطور", 
      specialty: "بناء وتشييد", 
      rating: 4.8, 
      projects: 125,
      location: "دمشق",
      experience: "15 سنة",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"
    },
    { 
      id: 2, 
      name: "مجموعة الأبنية الحديثة", 
      specialty: "تصميم داخلي", 
      rating: 4.9, 
      projects: 87,
      location: "حلب",
      experience: "12 سنة",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop"
    },
    { 
      id: 3, 
      name: "شركة الديكور المتميز", 
      specialty: "ديكور وترميم", 
      rating: 4.7, 
      projects: 96,
      location: "حمص",
      experience: "10 سنوات",
      image: "https://images.unsplash.com/photo-1600585154526-990dac4d53ef?w=400&h=300&fit=crop"
    },
    { 
      id: 4, 
      name: "مؤسسة الهندسة المتقدمة", 
      specialty: "هندسة مدنية", 
      rating: 4.9, 
      projects: 142,
      location: "اللاذقية",
      experience: "18 سنة",
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=300&fit=crop"
    },
    { 
      id: 5, 
      name: "شركة الإنشاءات المتميزة", 
      specialty: "بناء وتشييد", 
      rating: 4.6, 
      projects: 98,
      location: "درعا",
      experience: "8 سنوات",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop"
    },
    { 
      id: 6, 
      name: "مجموعة العمارة المستقبلية", 
      specialty: "تصميم معماري", 
      rating: 4.8, 
      projects: 76,
      location: "ريف دمشق",
      experience: "11 سنة",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop"
    },
  ];

  const [contractorsData, setContractorsData] = useState([]);
  const [contractorsLoading, setContractorsLoading] = useState(false);
  const [contractorsError, setContractorsError] = useState(null);

  useEffect(() => {
    const fetchContractors = async () => {
      setContractorsLoading(true);
      setContractorsError(null);
      try {
        const response = await usersAPI.getAll({ role: 'contractor' });
        if (Array.isArray(response)) {
          const normalized = response.map((contractor, idx) => ({
            id: contractor.id || contractor._id || `contractor-${idx}`,
            name: contractor.name || contractor.companyName || 'مقاول بدون اسم',
            specialty: contractor.specialization || contractor.specialty || 'مقاولات عامة',
            rating: contractor.rating || 4.7,
            projects: Array.isArray(contractor.projects) ? contractor.projects.length : contractor.totalProjects || 0,
            location: contractor.city || contractor.location || 'غير محدد',
            experience: contractor.experience ? `${contractor.experience} سنة` : '10 سنوات',
            image: (Array.isArray(contractor.images) && contractor.images[0]) || contractor.avatar || 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=300&fit=crop'
          }));
          setContractorsData(normalized);
        } else {
          setContractorsData([]);
        }
      } catch (error) {
        console.error('Contractors fetch error:', error);
        setContractorsError(error.message || 'تعذر تحميل بيانات المقاولين في الوقت الحالي');
      } finally {
        setContractorsLoading(false);
      }
    };

    fetchContractors();
  }, []);

  const contractors = contractorsData.length ? contractorsData : demoContractors;

  const filteredContractors = activeCategory === "all" 
    ? contractors 
    : contractors.filter(contractor => contractor.specialty === activeCategory);

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: 'Cairo, sans-serif',
        background: 'radial-gradient(circle at top, rgba(15,23,42,0.7), rgba(2,6,23,0.95))',
        color: '#fdf7f2',
        minHeight: '100vh',
        paddingBottom: '60px'
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
        zIndex: 5,
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
                background: 'linear-gradient(135deg, rgba(194,107,58,0.85), rgba(164,88,43,0.9))',
                color: '#fff',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                boxShadow: '0 10px 25px rgba(194,107,58,0.35)'
              }}
            >
              ← العودة
            </button>
            <div style={{ color: '#fef3c7', fontSize: '20px', fontWeight: 700 }}>المقاولون</div>
          </div>

          <div style={{ color: 'rgba(248,250,252,0.7)', fontSize: '14px' }}>
            {filteredContractors.length} مقاول متاح
          </div>
        </div>
      </header>

      {/* Filters */}
      <div style={{
        background: 'rgba(15,23,42,0.65)',
        padding: '24px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          {[{label:'كل التخصصات'},{label:'بناء وتشييد'},{label:'تصميم داخلي'},{label:'ديكور وترميم'},{label:'هندسة مدنية'},{label:'تصميم معماري'}].map((option, idx) => (
            <select key={`filter-${idx}`} style={{
              padding: '12px 18px',
              borderRadius: '18px',
              border: '1px solid rgba(255,255,255,0.15)',
              fontSize: '15px',
              minWidth: '160px',
              background: 'rgba(255,255,255,0.05)',
              color: '#fef3c7'
            }}>
              <option>{option.label}</option>
            </select>
          ))}
        </div>
      </div>

      {/* Contractors Grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '30px auto',
        padding: '0 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '30px'
      }}>
        {filteredContractors.map(contractor => (
          <div key={contractor.id} style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 25px 45px rgba(2,6,23,0.6)',
            transition: 'transform 0.25s ease, boxShadow 0.25s ease',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{ height: '200px', overflow: 'hidden' }}>
              <img 
                src={contractor.image} 
                alt={contractor.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', color: '#fef3c7' }}>{contractor.name}</h3>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  backgroundColor: 'rgba(14,165,233,0.15)',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  color: '#7dd3fc',
                  fontSize: '13px'
                }}>
                  ⭐ {contractor.rating}
                </div>
              </div>

              <div style={{ color: 'rgba(248,250,252,0.75)', marginBottom: '15px' }}>{contractor.specialty}</div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: 'rgba(248,250,252,0.75)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  📍 {contractor.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  📅 {contractor.experience}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: '#34d399', fontWeight: 'bold' }}>
                  {contractor.projects} مشروع
                </div>
                <button onClick={() => navigate(`/contractors/${contractor.id || 'details'}`)} style={{
                  background: 'linear-gradient(135deg, #c26b3a, #a4582b)',
                  color: '#fff7ed',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 700,
                  boxShadow: '0 12px 24px rgba(194,107,58,0.3)'
                }}>
                  عرض التفاصيل
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{
        maxWidth: '1200px',
        margin: '30px auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'center',
        gap: '10px'
      }}>
        {['السابق','1','2','3','التالي'].map((label, idx) => (
          <button key={label} style={{
            padding: '10px 18px',
            borderRadius: '999px',
            border: idx === 1 ? 'none' : '1px solid rgba(255,255,255,0.2)',
            background: idx === 1 ? 'linear-gradient(135deg, #2563eb, #38bdf8)' : 'transparent',
            color: idx === 1 ? '#f0f9ff' : 'rgba(248,250,252,0.8)',
            cursor: 'pointer',
            boxShadow: idx === 1 ? '0 12px 24px rgba(37,99,235,0.35)' : 'none'
          }}>{label}</button>
        ))}
      </div>
    </div>
  );
}
