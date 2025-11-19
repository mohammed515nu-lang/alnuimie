import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TrainersPage() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const trainerCategories = [
    { id: 'all', name: 'كل المدربين' },
    { id: 'project', name: 'إدارة المشاريع' },
    { id: 'engineering', name: 'الهندسة والتصميم' },
    { id: 'software', name: 'البرمجيات الهندسية' },
    { id: 'safety', name: 'السلامة والجودة' }
  ];

  const trainers = [
    {
      id: 1,
      name: 'م. أحمد خالد',
      specialty: 'إدارة مشاريع كبرى',
      category: 'project',
      experience: 14,
      rating: 4.9,
      trainees: 320,
      focus: ['PMP', 'MS Project', 'قيادة الفرق'],
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=500&fit=crop',
      bio: 'مدرب معتمد PMP قاد أكثر من 60 مشروعًا في قطاعي السكن والبنية التحتية.'
    },
    {
      id: 2,
      name: 'د. سارة محمود',
      specialty: 'السلامة المهنية',
      category: 'safety',
      experience: 12,
      rating: 4.8,
      trainees: 410,
      focus: ['ISO 45001', 'تحليل المخاطر', 'خطط الطوارئ'],
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=500&fit=crop&sat=-20',
      bio: 'استشارية سلامة عملت مع شركات مقاولات في سوريا والخليج.'
    },
    {
      id: 3,
      name: 'م. رنا خالد',
      specialty: 'تصميم وبرمجيات هندسية',
      category: 'software',
      experience: 10,
      rating: 4.9,
      trainees: 530,
      focus: ['AutoCAD', 'Revit', 'BIM'],
      image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=500&h=500&fit=crop',
      bio: 'خبيرة BIM ساعدت في رقمنة عشرات المشاريع الحكومية.'
    },
    {
      id: 4,
      name: 'م. حسام فياض',
      specialty: 'الهندسة الإنشائية',
      category: 'engineering',
      experience: 16,
      rating: 4.7,
      trainees: 280,
      focus: ['الخرسانة المسلحة', 'SAP2000', 'تحليل الأحمال'],
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=500&fit=crop&sat=-40',
      bio: 'مهندس إنشائي وعضو هيئة تدريس، ساعد في تصميم مشاريع سكنية ضخمة.'
    },
    {
      id: 5,
      name: 'د. ليلى دياب',
      specialty: 'إدارة الجودة',
      category: 'safety',
      experience: 11,
      rating: 4.8,
      trainees: 260,
      focus: ['TQM', 'Six Sigma', 'تقارير الجودة'],
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop',
      bio: 'متخصصة في ضبط الجودة للمشاريع الصناعية والمستشفيات.'
    },
    {
      id: 6,
      name: 'م. سامر الزعبي',
      specialty: 'إدارة التوريد والتكلفة',
      category: 'project',
      experience: 13,
      rating: 4.7,
      trainees: 190,
      focus: ['التعاقدات', 'رصد الميزانية', 'إدارة المخاطر'],
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=500&fit=crop&sat=-10',
      bio: 'أدار سلاسل التوريد لعدة مشاريع في الخليج والسوق المحلي.'
    }
  ];

  const filteredTrainers = activeCategory === 'all'
    ? trainers
    : trainers.filter((trainer) => trainer.category === activeCategory);

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
            <div style={{ color: '#fef3c7', fontSize: '20px', fontWeight: 700 }}>مدربو المستقبل لإدارة المقاولات</div>
          </div>

          <div style={{ color: 'rgba(248,250,252,0.7)', fontSize: '14px' }}>
            {filteredTrainers.length} مدرب متاح
          </div>
        </div>
      </header>

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
          background: 'radial-gradient(circle at 80% 20%, rgba(14,165,233,0.25), transparent 45%)',
          pointerEvents: 'none'
        }} />
        <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative' }}>
          <h1 style={{ fontSize: '36px', color: '#fef3c7', marginBottom: '18px', fontWeight: 800 }}>
            اختر المدرب المناسب لفريقك
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(248,250,252,0.78)', lineHeight: 1.8 }}>
            نخبة من المدربين المعتمدين في البناء، السلامة، البرمجيات الهندسية، وإدارة المشاريع.
          </p>
          <div style={{
            marginTop: '20px',
            display: 'inline-flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={statBadgeStyle}>
              <span>⭐</span>
              <strong>4.8</strong>
              <span>متوسط تقييم</span>
            </div>
            <div style={statBadgeStyle}>
              <span>👥</span>
              <strong>+1,900</strong>
              <span>متدرب سنوياً</span>
            </div>
            <div style={statBadgeStyle}>
              <span>🎓</span>
              <strong>45</strong>
              <span>دورة متخصصة</span>
            </div>
          </div>
        </div>
      </section>

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
          {trainerCategories.map(category => (
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
                fontSize: '15px',
                fontWeight: '600',
                boxShadow: activeCategory === category.id ? '0 12px 25px rgba(14,165,233,0.25)' : 'none'
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      <section style={{ padding: '40px 20px' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '30px'
        }}>
          {filteredTrainers.map(trainer => (
            <div key={trainer.id} style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 45px rgba(2,6,23,0.6)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(15,23,42,0.75) 100%)',
                  zIndex: 1
                }} />
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                  خبرة {trainer.experience}+ سنة
                </div>
              </div>

              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 6px', fontSize: '20px', color: '#fef3c7' }}>{trainer.name}</h3>
                    <p style={{ margin: 0, color: 'rgba(248,250,252,0.75)', fontSize: '14px' }}>{trainer.specialty}</p>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(14,165,233,0.12)',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    color: '#7dd3fc',
                    fontSize: '13px'
                  }}>
                    ⭐ {trainer.rating}
                  </div>
                </div>

                <p style={{ color: 'rgba(248,250,252,0.78)', lineHeight: 1.6 }}>
                  {trainer.bio}
                </p>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '12px 0' }}>
                  {trainer.focus.map((item, index) => (
                    <span key={index} style={{
                      fontSize: '12px',
                      color: '#fdf7f2',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      borderRadius: '999px',
                      padding: '5px 12px'
                    }}>
                      {item}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span style={{ color: 'rgba(248,250,252,0.75)', fontSize: '14px' }}>👥 {trainer.trainees} متدرب</span>
                  <button
                    onClick={() => navigate(`/training/register?trainerId=${trainer.id}`)}
                    style={{
                      background: 'transparent',
                      border: '1px dashed rgba(255,255,255,0.35)',
                      padding: '8px 16px',
                      borderRadius: '999px',
                      color: '#fdf7f2',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    طلب جلسة تعريفية
                  </button>
                </div>

                <button
                  onClick={() => navigate(`/training/register?trainerId=${trainer.id}&courseId=trainer-${trainer.id}`)}
                  style={{
                    background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                    color: '#f0f9ff',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '700',
                    width: '100%',
                    boxShadow: '0 14px 30px rgba(14,165,233,0.35)'
                  }}
                >
                  احجز دورة مع هذا المدرب
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

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
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '18px', fontWeight: 700, color: '#fef3c7' }}>
            تحتاج توصية أو مدرب خاص؟
          </h2>
          <p style={{ fontSize: '16px', marginBottom: '25px', color: 'rgba(248,250,252,0.78)' }}>
            شاركنا احتياجات فريقك وسنرشح لك أفضل مدرب وخطة تدريبية متكاملة.
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
            boxShadow: '0 18px 35px rgba(194,107,58,0.35)'
          }}>
            طلب توصية تدريبية
          </button>
        </div>
      </section>
    </div>
  );
}

const statBadgeStyle = {
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '999px',
  padding: '8px 18px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  color: '#fdf7f2',
  fontSize: '13px'
};
