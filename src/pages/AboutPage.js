import React from "react";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();

  const teamMembers = [
    {
      id: 1,
      name: "مهندس عمر عزاوي",
      position: "المدير التنفيذي",
      image: "",
      bio: "خبير في إدارة المشاريع البرمجية بخبرة تزيد عن عامين في مجال البناء والتشييد"
    },
    {
      id: 2,
      name: " مهندس محمود العلي",
      position: "مدير العمليات",
      image: "",
      bio: "متخصص في إدارة مشاريع البناء وتطوير العمليات التشغيلية"
    },
    {
      id: 3,
      name: "مهندس محمد النعيمي",
      position: " مدير قسم الهندسة IT",
      image: "",
      bio: "خبير في تصميم مواقع الويب"
    },
 
  ];

  const milestones = [
    {
      year: "2025",
      title: "تأسيس الشركة",
      description: "بدأت الشركة كفريق صغير من المهندسين المتخصصين في مشاريع البناء السكنية"
    },
    {
      year: "2025/2",
      title: "التوسع في المحافظات",
      description: "بدأت الشركة بتوسيع خدماتها لتشمل جميع المحافظات السورية"
    },
    {
      year: "2025/7",
      title: "إطلاق المنصة الرقمية",
      description: "أطلقنا منصتنا الرقمية لربط المقاولين وأصحاب المشاريع"
    },
    {
      year: "2025/10",
      title: "التدريب والاستشارات",
      description: "أضفنا خدمات التدريب والاستشارات الهندسية إلى خدماتنا"
    },
    {
      year: "2025/12",
      title: "التطور المستمر",
      description: "واصلنا تطوير خدماتنا ومنصتنا لتلبية احتياجات السوق المتغيرة"
    }
  ];

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: 'Cairo, sans-serif',
        background: 'radial-gradient(circle at top, #020617 0%, #020617 40%, #0b1120 70%, #111827 100%)',
        color: '#f9fafb',
        minHeight: '100vh',
        paddingBottom: '40px'
      }}
    >
      {/* Header */}
      <header style={{
        background: 'rgba(15,23,42,0.92)',
        padding: '16px 0',
        boxShadow: '0 10px 30px rgba(15,23,42,0.7)',
        borderBottom: '1px solid rgba(148,163,184,0.35)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'blur(14px)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => navigate('/')}
              style={{
                background: 'linear-gradient(135deg, #c26b3a, #dba98b)',
                color: '#0b1120',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                boxShadow: '0 10px 25px rgba(15,23,42,0.7)'
              }}
            >
              ← العودة
            </button>
            <div style={{ color: '#e5e7eb', fontSize: '20px', fontWeight: 700 }}>من نحن</div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '70px 20px 50px',
        textAlign: 'center',
        background: 'radial-gradient(circle at top, rgba(15,23,42,0.4), transparent 60%)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '36px', color: '#f9fafb', marginBottom: '16px', fontWeight: 800 }}>
            قصة نجاحنا في عالم البناء والتشييد
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(226,232,240,0.85)', lineHeight: 1.8 }}>
            نحن "المستقبل لإدارة المقاولات"، منصة رائدة في مجال إدارة المشاريع والمقاولات في سوريا، نربط بين المقاولين وأصحاب المشاريع
          </p>
        </div>
      </section>

      {/* About Section */}
      <section style={{ padding: '60px 20px', background: 'linear-gradient(145deg, #020617 0%, #020617 40%, #0b1120 100%)' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '28px', color: '#fef3c7', marginBottom: '20px' }}>
              عن شركة المستقبل لإدارة المقاولات
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(226,232,240,0.85)', lineHeight: 1.9, marginBottom: '18px' }}>
              تأسست شركة المستقبل لإدارة المقاولات في عام 2025 بهدف توفير حلول متكاملة لقطاع البناء والتشييد في سوريا.
              نعمل على ربط المقاولين وأصحاب المشاريع وتوفير بيئة عمل احترافية تعزز التعاون والنمو في القطاع.
            </p>
            <p style={{ fontSize: '16px', color: 'rgba(226,232,240,0.78)', lineHeight: 1.9, marginBottom: '20px' }}>
              اليوم، أصبحت "المستقبل لإدارة المقاولات" واحدة من أكبر المنصات في سوريا، حيث تخدم أكثر من 3000 مقاول وأكثر من
              1500 مشروع منجز في جميع المحافظات السورية.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
              marginTop: '30px'
            }}>
              <div style={{
                background: 'rgba(15,23,42,0.9)',
                padding: '20px',
                borderRadius: '16px',
                textAlign: 'center',
                border: '1px solid rgba(250,250,250,0.1)',
                boxShadow: '0 18px 40px rgba(0,0,0,0.5)'
              }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#bef264', marginBottom: '4px' }}>
                  15+
                </div>
                <div style={{ color: 'rgba(226,232,240,0.9)' }}>سنة خبرة</div>
              </div>
              <div style={{
                background: 'rgba(15,23,42,0.9)',
                padding: '20px',
                borderRadius: '16px',
                textAlign: 'center',
                border: '1px solid rgba(250,250,250,0.1)',
                boxShadow: '0 18px 40px rgba(0,0,0,0.5)'
              }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#bef264', marginBottom: '4px' }}>
                  3000+
                </div>
                <div style={{ color: 'rgba(226,232,240,0.9)' }}>مقاول مسجل</div>
              </div>
              <div style={{
                background: 'rgba(15,23,42,0.9)',
                padding: '20px',
                borderRadius: '16px',
                textAlign: 'center',
                border: '1px solid rgba(250,250,250,0.1)',
                boxShadow: '0 18px 40px rgba(0,0,0,0.5)'
              }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#bef264', marginBottom: '4px' }}>
                  1500+
                </div>
                <div style={{ color: 'rgba(226,232,240,0.9)' }}>مشروع منجز</div>
              </div>
              <div style={{
                background: 'rgba(15,23,42,0.9)',
                padding: '20px',
                borderRadius: '16px',
                textAlign: 'center',
                border: '1px solid rgba(250,250,250,0.1)',
                boxShadow: '0 18px 40px rgba(0,0,0,0.5)'
              }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#bef264', marginBottom: '4px' }}>
                  14
                </div>
                <div style={{ color: 'rgba(226,232,240,0.9)' }}>محافظة سورية</div>
              </div>
            </div>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&h=600&fit=crop" 
              alt="فريق العمل" 
              style={{
                width: '100%',
                borderRadius: '20px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.75)',
                border: '1px solid rgba(248,250,252,0.12)'
              }} 
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: '60px 20px', background: 'linear-gradient(145deg, #020617 0%, #020617 30%, #020617 100%)' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px'
        }}>
          <div style={{
            backgroundColor: 'rgba(15,23,42,0.95)',
            padding: '30px',
            borderRadius: '20px',
            boxShadow: '0 24px 45px rgba(0,0,0,0.7)',
            border: '1px solid rgba(148,163,184,0.35)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #c26b3a, #dba98b)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              marginBottom: '20px'
            }}>🎯</div>
            <h3 style={{ fontSize: '24px', color: '#fef3c7', marginBottom: '15px' }}>
              رؤيتنا
            </h3>
            <p style={{ fontSize: '16px', color: 'rgba(226,232,240,0.85)', lineHeight: 1.9 }}>
              أن نكون المنصة الرائدة في قطاع البناء والتشييد في سوريا والمنطقة، من خلال توفير حلول مبتكرة
              تعزز التعاون بين المقاولين وأصحاب المشاريع وترفع من جودة القطاع.
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(15,23,42,0.95)',
            padding: '30px',
            borderRadius: '20px',
            boxShadow: '0 24px 45px rgba(0,0,0,0.7)',
            border: '1px solid rgba(148,163,184,0.35)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              marginBottom: '20px'
            }}>🏆</div>
            <h3 style={{ fontSize: '24px', color: '#fef3c7', marginBottom: '15px' }}>
              رسالتنا
            </h3>
            <p style={{ fontSize: '16px', color: 'rgba(226,232,240,0.85)', lineHeight: 1.9 }}>
              توفير منصة متكاملة تربط بين المقاولين وأصحاب المشاريع، وتوفر أدوات وخدمات تدعم نجاح
              المشاريع وتضمن جودة التنفيذ والالتزام بالمعايير والمواصفات السورية.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '60px 20px', background: '#020617' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{ fontSize: '32px', color: '#fef3c7', textAlign: 'center', marginBottom: '40px' }}>
            مسيرتنا عبر الزمن
          </h2>

          <div style={{
            position: 'relative',
            margin: '0 auto',
            maxWidth: '800px'
          }}>
            {/* Timeline Line */}
            <div style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: '50%',
              width: '3px',
              background: 'linear-gradient(to bottom, rgba(148,163,184,0.1), rgba(148,163,184,0.6), rgba(148,163,184,0.1))',
              transform: 'translateX(50%)'
            }}></div>

            {milestones.map((milestone, index) => (
              <div key={milestone.year} style={{
                display: 'flex',
                justifyContent: index % 2 === 0 ? 'flex-end' : 'flex-start',
                marginBottom: '40px',
                position: 'relative'
              }}>
                {/* Timeline Dot */}
                <div style={{
                  position: 'absolute',
                  top: '0',
                  right: '50%',
                  transform: 'translateX(50%)',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #facc15, #eab308)',
                  border: '4px solid #020617',
                  boxShadow: '0 0 0 4px rgba(148,163,184,0.7)',
                  zIndex: 1
                }}></div>

                {/* Timeline Content */}
                <div style={{
                  width: '45%',
                  background: 'rgba(15,23,42,0.95)',
                  padding: '20px',
                  borderRadius: '18px',
                  boxShadow: '0 22px 45px rgba(0,0,0,0.7)',
                  border: '1px solid rgba(148,163,184,0.35)'
                }}>
                  <div style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #c26b3a, #dba98b)',
                    color: '#0b1120',
                    padding: '5px 15px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '10px'
                  }}>
                    {milestone.year === "2008" ? "٢٠٠٨" : milestone.year}
                  </div>
                  <h3 style={{ fontSize: '20px', color: '#e5e7eb', marginBottom: '10px' }}>
                    {milestone.title}
                  </h3>
                  <p style={{ fontSize: '16px', color: 'rgba(226,232,240,0.85)', lineHeight: 1.7 }}>
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{ padding: '60px 20px', background: 'linear-gradient(145deg, #020617 0%, #020617 30%, #0b1120 100%)' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{ fontSize: '32px', color: '#2e7d32', textAlign: 'center', marginBottom: '40px' }}>
            فريق العمل
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            {teamMembers.map(member => (
              <div key={member.id} style={{
                backgroundColor: 'rgba(15,23,42,0.95)',
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: '0 22px 45px rgba(0,0,0,0.7)',
                textAlign: 'center',
                border: '1px solid rgba(148,163,184,0.35)'
              }}>
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img 
                    src={member.image} 
                    alt={member.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '20px', color: '#f9fafb', marginBottom: '5px' }}>
                    {member.name}
                  </h3>
                  <div style={{
                    color: '#bfdbfe',
                    fontWeight: 'bold',
                    marginBottom: '15px'
                  }}>
                    {member.position}
                  </div>
                  <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.6 }}>
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'radial-gradient(circle at top, rgba(15,23,42,0.95), rgba(15,23,42,0.98))',
        padding: '60px 20px',
        textAlign: 'center',
        color: '#e5e7eb'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '16px', fontWeight: 800, color: '#fef3c7' }}>
            انضم إلى مجتمعنا
          </h2>
          <p style={{ fontSize: '16px', marginBottom: '26px', color: 'rgba(226,232,240,0.85)' }}>
            سجل في منصتنا اليوم واستفد من جميع خدماتنا في إدارة المشاريع
          </p>
          <button onClick={() => navigate('/login')} style={{
            background: 'linear-gradient(135deg, #c26b3a, #dba98b)',
            color: '#0b1120',
            border: 'none',
            padding: '14px 30px',
            borderRadius: '999px',
            fontWeight: '700',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 16px 40px rgba(15,23,42,0.9)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 22px 50px rgba(15,23,42,0.95)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 16px 40px rgba(15,23,42,0.9)';
          }}>
            سجل الآن
          </button>
        </div>
      </section>
    </div>
  );
}
