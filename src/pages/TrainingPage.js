import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TrainingPage() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [activeCategory, setActiveCategory] = useState("all");

  const trainingCategories = [
    { id: "all", name: "كل الدورات" },
    { id: "construction", name: "البناء والتشييد" },
    { id: "project-management", name: "إدارة المشاريع" },
    { id: "safety", name: "السلامة المهنية" },
    { id: "technical", name: "المهارات الفنية" },
    { id: "software", name: "البرمجيات الهندسية" }
  ];

  const courses = [
    {
      id: 1,
      title: "أساسيات إدارة المشاريع في البناء",
      category: "project-management",
      duration: "4 أسابيع",
      level: "مبتدئ",
      price: "150,000 ل.س",
      rating: 4.8,
      students: 124,
      instructor: "مهندس أحمد خالد",
      image: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=250&fit=crop",
      startDate: "15 مايو 2023",
      location: "دمشق"
    },
    {
      id: 2,
      title: "تقنيات البناء الحديث",
      category: "construction",
      duration: "6 أسابيع",
      level: "متوسط",
      price: "200,000 ل.س",
      rating: 4.9,
      students: 87,
      instructor: "م. محمد علي",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=250&fit=crop",
      startDate: "1 يونيو 2023",
      location: "حلب"
    },
    {
      id: 3,
      title: "السلامة في مواقع البناء",
      category: "safety",
      duration: "3 أسابيع",
      level: "مبتدئ",
      price: "100,000 ل.س",
      rating: 4.7,
      students: 156,
      instructor: "د. حسن سعيد",
      image: "https://images.unsplash.com/photo-1600585154526-990dac4d53ef?w=400&h=250&fit=crop",
      startDate: "20 مايو 2023",
      location: "اللاذقية"
    },
    {
      id: 4,
      title: "التصميم باستخدام AutoCAD",
      category: "software",
      duration: "5 أسابيع",
      level: "مبتدئ",
      price: "175,000 ل.س",
      rating: 4.8,
      students: 203,
      instructor: "م. رنا خالد",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop",
      startDate: "10 يونيو 2023",
      location: "حمص"
    },
    {
      id: 5,
      title: "الخرسانة المسلحة المتقدمة",
      category: "technical",
      duration: "8 أسابيع",
      level: "متقدم",
      price: "250,000 ل.س",
      rating: 4.9,
      students: 64,
      instructor: "د. يوسف أحمد",
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=250&fit=crop",
      startDate: "25 مايو 2023",
      location: "دمشق"
    },
    {
      id: 6,
      title: "إدارة الجودة في المشاريع",
      category: "project-management",
      duration: "4 أسابيع",
      level: "متوسط",
      price: "180,000 ل.س",
      rating: 4.7,
      students: 92,
      instructor: "م. سارة محمود",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop",
      startDate: "5 يونيو 2023",
      location: "حماة"
    }
  ];

  const filteredCourses = activeCategory === "all" 
    ? courses 
    : courses.filter(course => course.category === activeCategory);

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: 'Cairo, sans-serif',
        background: 'radial-gradient(circle at top, rgba(15,23,42,0.7), rgba(2,6,23,0.95))',
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
            <div style={{ color: '#fef3c7', fontSize: '20px', fontWeight: 700 }}>التدريب</div>
          </div>

          <div style={{ color: 'rgba(248,250,252,0.7)', fontSize: '14px' }}>
            {filteredCourses.length} دورة تدريبية متاحة
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
            مركز التدريب المتخصص في البناء والتشييد
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(248,250,252,0.78)', lineHeight: 1.8 }}>
            نوفر دورات تدريبية متخصصة في مجال البناء والتشييد بإشراف خبراء متخصصين
          </p>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '28px 0', backgroundColor: 'rgba(15,23,42,0.75)', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {trainingCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              style={{
                padding: '10px 22px',
                borderRadius: '30px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: activeCategory === category.id
                  ? 'linear-gradient(135deg, #0ea5e9, #2563eb)'
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
      </section>

      {/* Courses Grid */}
      <section style={{ padding: '40px 20px' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '30px'
        }}>
          {filteredCourses.map(course => (
            <div key={course.id} style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 45px rgba(2,6,23,0.65)',
              border: '1px solid rgba(255,255,255,0.08)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(15,23,42,0.75) 100%)',
                  zIndex: 1
                }} />
                <img 
                  src={course.image} 
                  alt={course.title}
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
                  {course.location}
                </div>
              </div>

              <div style={{ padding: '20px' }}>
                <div style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(194,107,58,0.15)', 
                  color: '#f4c9aa', 
                  padding: '6px 14px', 
                  borderRadius: '999px', 
                  fontSize: '13px',
                  marginBottom: '12px'
                }}>
                  مستوى {course.level}
                </div>

                <h3 style={{ margin: '0 0 10px', fontSize: '19px', color: '#fef3c7' }}>
                  {course.title}
                </h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(248,250,252,0.75)' }}>
                    📅 {course.duration}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(248,250,252,0.75)' }}>
                    👥 {course.students} طالب
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    backgroundColor: 'rgba(14,165,233,0.12)',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    color: '#7dd3fc',
                    fontSize: '13px',
                    marginLeft: '10px'
                  }}>
                    ⭐ {course.rating}
                  </div>
                  <div style={{ color: 'rgba(248,250,252,0.75)', fontSize: '14px' }}>
                    {course.instructor}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div style={{ color: 'rgba(248,250,252,0.75)', fontSize: '14px' }}>
                    🗓️ {course.startDate}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#34d399' }}>
                    {course.price}
                  </div>
                  <button onClick={() => navigate(`/training/register?courseId=${course.id}`)} style={{
                    background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                    color: '#f0f9ff',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '700',
                    boxShadow: '0 14px 30px rgba(14,165,233,0.35)'
                  }}>
                    التسجيل الآن
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(194,107,58,0.15))',
        padding: '50px 20px',
        textAlign: 'center',
        color: '#fdf7f2',
        borderRadius: '30px',
        width: '90%',
        maxWidth: '900px',
        margin: '0 auto',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 30px 60px rgba(2,6,23,0.5)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: 700, color: '#fef3c7' }}>
            هل تحتاج دورة تدريبية مخصصة؟
          </h2>
          <p style={{ fontSize: '16px', marginBottom: '28px', color: 'rgba(248,250,252,0.78)' }}>
            يمكننا تصميم دورة تدريبية خاصة تلبي احتياجات شركتك أو فريقك
          </p>
          <button onClick={() => navigate('/training/register?custom=true')} style={{
            background: 'linear-gradient(135deg, #c26b3a, #a4582b)',
            color: '#fff7ed',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '30px',
            fontWeight: '700',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 18px 35px rgba(194,107,58,0.35)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 22px 45px rgba(194,107,58,0.45)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 18px 35px rgba(194,107,58,0.35)';
          }}>
            طلب دورة مخصصة
          </button>
        </div>
      </section>
    </div>
  );
}
