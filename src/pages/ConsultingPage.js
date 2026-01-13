import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ConsultingPage() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [activeService, setActiveService] = useState("all");

  const serviceCategories = [
    { id: "all", name: "كل الخدمات" },
    { id: "design", name: "التصميم والهندسة" },
    { id: "management", name: "إدارة المشاريع" },
    { id: "quality", name: "الجودة والسلامة" },
    { id: "legal", name: "الاستشارات القانونية" },
    { id: "financial", name: "الاستشارات المالية" }
  ];

  const services = [
    {
      id: 1,
      title: "استشارات هندسية للمشاريع السكنية",
      category: "design",
      description: "نقدم استشارات هندسية متخصصة في تصميم وتنفيذ المشاريع السكنية مع الالتزام بالمعايير السورية",
      price: "يبدأ من 500,000 ل.س",
      duration: "حسب حجم المشروع",
      consultant: "م. يوسف أحمد",
      rating: 4.9,
      projects: 45,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=250&fit=crop",
      features: ["تصميم معماري", "دراسات الجدوى", "رسومات تنفيذية", "إشراف على التنفيذ"]
    },
    {
      id: 2,
      title: "إدارة مشاريع البناء",
      category: "management",
      description: "خدمات إدارة متكاملة للمشاريع من التخطيط إلى التسليم مع ضمان الجودة والالتزام بالجدول الزمني",
      price: "يبدأ من 750,000 ل.س",
      duration: "حسب حجم المشروع",
      consultant: "د. رنا خالد",
      rating: 4.8,
      projects: 32,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=250&fit=crop",
      features: ["تخطيط المشروع", "إدارة الميزانية", "الجدولة الزمنية", "إدارة الفريق"]
    },
    {
      id: 3,
      title: "تقييم الجودة في المشاريع",
      category: "quality",
      description: "نقدم خدمات تقييم ومراقبة الجودة في جميع مراحل المشروع لضمان الالتزام بالمعايير المطلوبة",
      price: "يبدأ من 300,000 ل.س",
      duration: "حسب حجم المشروع",
      consultant: "م. حسن سعيد",
      rating: 4.7,
      projects: 58,
      image: "https://images.unsplash.com/photo-1600585154526-990dac4d53ef?w=400&h=250&fit=crop",
      features: ["فحص المواد", "مراقبة الجودة", "تقارير فنية", "شهادات مطابقة"]
    },
    {
      id: 4,
      title: "الاستشارات القانونية للعقارات",
      category: "legal",
      description: "نقدم استشارات قانونية متخصصة في قضايا البناء والعقارات والتصاريح اللازمة للمشاريع",
      price: "يبدأ من 200,000 ل.س",
      duration: "حسب القضية",
      consultant: "مح. سارة محمود",
      rating: 4.8,
      projects: 67,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop",
      features: ["تصاريح البناء", "تسجيل العقارات", "المنازعات", "العقود"]
    },
    {
      id: 5,
      title: "دراسات الجدوى المالية",
      category: "financial",
      description: "نقدم دراسات جدوى مالية مفصلة للمشاريع العقارية والإنشائية لاتخاذ قرارات استثمارية سليمة",
      price: "يبدأ من 400,000 ل.س",
      duration: "2-4 أسابيع",
      consultant: "م. أحمد خالد",
      rating: 4.9,
      projects: 41,
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=250&fit=crop",
      features: ["تحليل التكلفة", "العائد على الاستثمار", "تحليل المخاطر", "توصيات استثمارية"]
    },
    {
      id: 6,
      title: "استشارات السلامة المهنية",
      category: "quality",
      description: "نقدم استشارات متخصصة في تطبيق معايير السلامة المهنية في مواقع البناء لحماية العمال والممتلكات",
      price: "يبدأ من 350,000 ل.س",
      duration: "حسب حجم المشروع",
      consultant: "د. محمد علي",
      rating: 4.8,
      projects: 53,
      image: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=250&fit=crop",
      features: ["تقييم المخاطر", "خطط الطوارئ", "تدريب العمال", "معدات الحماية"]
    }
  ];

  const filteredServices = activeService === "all" 
    ? services 
    : services.filter(service => service.category === activeService);

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
                padding: '8px 15px',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                boxShadow: '0 10px 25px rgba(194,107,58,0.3)'
              }}
            >
              ← العودة
            </button>
            <div style={{ color: '#fef3c7', fontSize: '20px', fontWeight: 700 }}>الخدمات الاستشارية</div>
          </div>

          <div style={{ color: 'rgba(248,250,252,0.7)', fontSize: '14px' }}>
            {filteredServices.length} خدمة استشارية متاحة
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
          <h1 style={{ fontSize: '32px', color: '#fef3c7', marginBottom: '20px', fontWeight: 800 }}>
            خدمات استشارية متخصصة في البناء والتشييد
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(248,250,252,0.78)', lineHeight: 1.6 }}>
            نوفر استشارات احترافية في جميع جوانب البناء والتشييد بإشراف خبراء متخصصين
          </p>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '20px 0', backgroundColor: 'rgba(15,23,42,0.75)', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {serviceCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveService(category.id)}
              style={{
                padding: '10px 22px',
                borderRadius: '30px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: activeService === category.id
                  ? 'linear-gradient(135deg, #0ea5e9, #2563eb)'
                  : 'rgba(255,255,255,0.04)',
                color: activeService === category.id ? '#f0f9ff' : 'rgba(248,250,252,0.8)',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: activeService === category.id ? '0 12px 25px rgba(14,165,233,0.25)' : 'none'
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '40px 20px' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '30px'
        }}>
          {filteredServices.map(service => (
            <div key={service.id} style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 45px rgba(2,6,23,0.65)',
              border: '1px solid rgba(255,255,255,0.08)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ height: '200px', overflow: 'hidden' }}>
                <img 
                  src={service.image} 
                  alt={service.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '18px', color: '#fef3c7' }}>
                  {service.title}
                </h3>

                <p style={{ color: 'rgba(248,250,252,0.78)', marginBottom: '15px', fontSize: '14px', lineHeight: 1.5 }}>
                  {service.description}
                </p>

                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: '16px', color: '#4ade80' }}>
                    ما تشمل الخدمة:
                  </h4>
                  <ul style={{ margin: 0, paddingRight: '20px', color: 'rgba(226,232,240,0.9)', fontSize: '14px' }}>
                    {service.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div style={{ color: 'rgba(248,250,252,0.78)', fontSize: '14px' }}>
                    ⏱️ {service.duration}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      backgroundColor: 'rgba(14,165,233,0.12)',
                      padding: '5px 10px',
                      borderRadius: '20px',
                      color: '#7dd3fc',
                      fontSize: '14px',
                      marginLeft: '10px'
                    }}>
                      ⭐ {service.rating}
                    </div>
                    <div style={{ color: 'rgba(248,250,252,0.78)', fontSize: '14px' }}>
                      {service.projects} مشروع
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ color: 'rgba(248,250,252,0.78)', fontSize: '14px' }}>
                    👤 {service.consultant}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#34d399' }}>
                    {service.price}
                  </div>
                </div>

                <button onClick={() => navigate('/consulting/request')} style={{
                  background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                  color: '#f0f9ff',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  width: '100%',
                  boxShadow: '0 14px 30px rgba(37,99,235,0.45)'
                }}>
                  طلب استشارة
                </button>
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
        margin: '0 auto 40px',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 30px 60px rgba(2,6,23,0.5)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: 700, color: '#fef3c7' }}>
            هل تحتاج استشارة مخصصة؟
          </h2>
          <p style={{ fontSize: '16px', marginBottom: '28px', color: 'rgba(248,250,252,0.78)' }}>
            يمكننا تصميم خدمة استشارية خاصة تلبي احتياجات مشروعك
          </p>
          <button onClick={() => navigate('/contact')} style={{
            background: 'linear-gradient(135deg, #c26b3a, #a4582b)',
            color: '#fff7ed',
            border: 'none',
            padding: '12px 25px',
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
            طلب استشارة مخصصة
          </button>
        </div>
      </section>
    </div>
  );
}
