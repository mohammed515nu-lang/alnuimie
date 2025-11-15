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
            <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>الخدمات الاستشارية</div>
          </div>

          <div style={{ color: 'white', fontSize: '16px' }}>
            {filteredServices.length} خدمة استشارية متاحة
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
            خدمات استشارية متخصصة في البناء والتشييد
          </h1>
          <p style={{ fontSize: '18px', color: '#555', lineHeight: 1.6 }}>
            نوفر استشارات احترافية في جميع جوانب البناء والتشييد بإشراف خبراء متخصصين
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
          {serviceCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveService(category.id)}
              style={{
                padding: '10px 20px',
                borderRadius: '30px',
                border: 'none',
                backgroundColor: activeService === category.id ? '#2e7d32' : '#f0f0f0',
                color: activeService === category.id ? 'white' : '#333',
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
              backgroundColor: 'white',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
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
                <h3 style={{ margin: '0 0 10px', fontSize: '18px', color: '#333' }}>
                  {service.title}
                </h3>

                <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px', lineHeight: 1.5 }}>
                  {service.description}
                </p>

                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: '16px', color: '#2e7d32' }}>
                    ما تشمل الخدمة:
                  </h4>
                  <ul style={{ margin: 0, paddingRight: '20px', color: '#555', fontSize: '14px' }}>
                    {service.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div style={{ color: '#666', fontSize: '14px' }}>
                    ⏱️ {service.duration}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
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
                      ⭐ {service.rating}
                    </div>
                    <div style={{ color: '#666', fontSize: '14px' }}>
                      {service.projects} مشروع
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ color: '#666', fontSize: '14px' }}>
                    👤 {service.consultant}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2e7d32' }}>
                    {service.price}
                  </div>
                </div>

                <button onClick={() => navigate('/login')} style={{
                  backgroundColor: '#2e7d32',
                  color: 'white',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  width: '100%'
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
        backgroundColor: '#2e7d32',
        padding: '40px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>
            هل تحتاج استشارة مخصصة؟
          </h2>
          <p style={{ fontSize: '18px', marginBottom: '30px' }}>
            يمكننا تصميم خدمة استشارية خاصة تلبي احتياجات مشروعك
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
            طلب استشارة مخصصة
          </button>
        </div>
      </section>
    </div>
  );
}
