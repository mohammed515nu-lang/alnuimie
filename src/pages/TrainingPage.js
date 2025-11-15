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
            <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>التدريب</div>
          </div>

          <div style={{ color: 'white', fontSize: '16px' }}>
            {filteredCourses.length} دورة تدريبية متاحة
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
            مركز التدريب المتخصص في البناء والتشييد
          </h1>
          <p style={{ fontSize: '18px', color: '#555', lineHeight: 1.6 }}>
            نوفر دورات تدريبية متخصصة في مجال البناء والتشييد بإشراف خبراء متخصصين
          </p>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '20px 0', backgroundColor: 'white', borderBottom: '1px solid #eee' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {trainingCategories.map(category => (
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
              backgroundColor: 'white',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ height: '200px', overflow: 'hidden' }}>
                <img 
                  src={course.image} 
                  alt={course.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              <div style={{ padding: '20px' }}>
                <div style={{ 
                  display: 'inline-block', 
                  backgroundColor: '#f0f8f0', 
                  color: '#2e7d32', 
                  padding: '5px 10px', 
                  borderRadius: '5px', 
                  fontSize: '14px',
                  marginBottom: '10px'
                }}>
                  {course.level}
                </div>

                <h3 style={{ margin: '0 0 10px', fontSize: '18px', color: '#333' }}>
                  {course.title}
                </h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#666' }}>
                    📅 {course.duration}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#666' }}>
                    👥 {course.students} طالب
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    backgroundColor: '#f0f8f0',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    color: '#2e7d32',
                    fontSize: '14px',
                    marginLeft: '10px'
                  }}>
                    ⭐ {course.rating}
                  </div>
                  <div style={{ color: '#666', fontSize: '14px' }}>
                    {course.instructor}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div style={{ color: '#666', fontSize: '14px' }}>
                    📍 {course.location}
                  </div>
                  <div style={{ color: '#666', fontSize: '14px' }}>
                    🗓️ {course.startDate}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2e7d32' }}>
                    {course.price}
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
        backgroundColor: '#2e7d32',
        padding: '40px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>
            هل تحتاج دورة تدريبية مخصصة؟
          </h2>
          <p style={{ fontSize: '18px', marginBottom: '30px' }}>
            يمكننا تصميم دورة تدريبية خاصة تلبي احتياجات شركتك أو فريقك
          </p>
          <button onClick={() => navigate('/contact')} style={{
            backgroundColor: 'white',
            color: '#2e7d32',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '30px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
            طلب دورة مخصصة
          </button>
        </div>
      </section>
    </div>
  );
}
