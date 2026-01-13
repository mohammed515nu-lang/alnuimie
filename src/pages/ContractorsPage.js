import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ContractorsPage() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [contractors, setContractors] = useState([

    { 
      id: 1, 
      name: "شركة البناء المتطور", 
      specialty: "بناء وتشييد", 
      rating: 4.8, 
      projects: 125,
      location: "دمشق",
      experience: "15 سنة",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop"
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
            <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>المقاولون</div>
          </div>

          <div style={{ color: 'white', fontSize: '16px' }}>
            {contractors.length} مقاول متاح
          </div>
        </div>
      </header>

      {/* Filters */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px 0',
        borderBottom: '1px solid #eee'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          <select style={{
            padding: '10px 15px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '16px',
            minWidth: '150px'
          }}>
            <option>كل التخصصات</option>
            <option>بناء وتشييد</option>
            <option>تصميم داخلي</option>
            <option>ديكور وترميم</option>
            <option>هندسة مدنية</option>
            <option>تصميم معماري</option>
          </select>

          <select style={{
            padding: '10px 15px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '16px',
            minWidth: '150px'
          }}>
            <option>كل المحافظات</option>
            <option>دمشق</option>
            <option>حلب</option>
            <option>حمص</option>
            <option>اللاذقية</option>
            <option>درعا</option>
            <option>ريف دمشق</option>
          </select>

          <select style={{
            padding: '10px 15px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '16px',
            minWidth: '150px'
          }}>
            <option>ترتيب حسب</option>
            <option>الأعلى تقييماً</option>
            <option>الأكثر مشاريع</option>
            <option>الأقدم خبرة</option>
          </select>
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
        {contractors.map(contractor => (
          <div key={contractor.id} style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
          }}>
            <div style={{ height: '200px', overflow: 'hidden' }}>
              <img 
                src={contractor.image} 
                alt={contractor.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease'
                }}
              />
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>{contractor.name}</h3>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  backgroundColor: '#f0f8f0',
                  padding: '5px 10px',
                  borderRadius: '20px',
                  color: '#2e7d32',
                  fontSize: '14px'
                }}>
                  ⭐ {contractor.rating}
                </div>
              </div>

              <div style={{ color: '#666', marginBottom: '15px' }}>{contractor.specialty}</div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#666' }}>
                  📍 {contractor.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#666' }}>
                  📅 {contractor.experience}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                  {contractor.projects} مشروع
                </div>
                <button style={{
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
