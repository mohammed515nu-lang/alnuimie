import React from "react";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();

  const teamMembers = [
    {
      id: 1,
      name: "مهندس أحمد خالد",
      position: "المدير التنفيذي",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      bio: "خبير في إدارة المشاريع الهندسية بخبرة تزيد عن 20 عاماً في مجال البناء والتشييد"
    },
    {
      id: 2,
      name: "م. رنا محمود",
      position: "مديرة العمليات",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      bio: "متخصصة في إدارة مشاريع البناء وتطوير العمليات التشغيلية بخبرة 15 عاماً"
    },
    {
      id: 3,
      name: "د. يوسف أحمد",
      position: "مدير قسم الهندسة",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      bio: "خبير في الهندسة المدنية والهياكل الإنشائية حاصل على درجة الدكتوراه من جامعة دمشق"
    },
    {
      id: 4,
      name: "م. سارة حسن",
      position: "مديرة قسم الجودة",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      bio: "متخصصة في أنظمة إدارة الجودة في المشاريع الإنشائية وحاصلة على شهادات عالمية"
    }
  ];

  const milestones = [
    {
      year: "2008",
      title: "تأسيس الشركة",
      description: "بدأت الشركة كفريق صغير من المهندسين المتخصصين في مشاريع البناء السكنية"
    },
    {
      year: "2012",
      title: "التوسع في المحافظات",
      description: "بدأت الشركة بتوسيع خدماتها لتشمل جميع المحافظات السورية"
    },
    {
      year: "2015",
      title: "إطلاق المنصة الرقمية",
      description: "أطلقنا منصتنا الرقمية لربط المقاولين وأصحاب المشاريع"
    },
    {
      year: "2018",
      title: "التدريب والاستشارات",
      description: "أضفنا خدمات التدريب والاستشارات الهندسية إلى خدماتنا"
    },
    {
      year: "2023",
      title: "التطور المستمر",
      description: "واصلنا تطوير خدماتنا ومنصتنا لتلبية احتياجات السوق المتغيرة"
    }
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
            <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>من نحن</div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        backgroundColor: '#f0f8f0',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '36px', color: '#2e7d32', marginBottom: '20px' }}>
            قصة نجاحنا في عالم البناء والتشييد
          </h1>
          <p style={{ fontSize: '18px', color: '#555', lineHeight: 1.6 }}>
            نحن منصة رائدة في مجال إدارة المشاريع والمقاولات في سوريا، نربط بين المقاولين وأصحاب المشاريع
          </p>
        </div>
      </section>

      {/* About Section */}
      <section style={{ padding: '60px 20px', backgroundColor: 'white' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '28px', color: '#2e7d32', marginBottom: '20px' }}>
              عن منصة مقاول
            </h2>
            <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.7, marginBottom: '20px' }}>
              تأسست منصة مقاول في عام 2008 بهدف توفير حلول متكاملة لقطاع البناء والتشييد في سوريا.
              نعمل على ربط المقاولين وأصحاب المشاريع وتوفير بيئة عمل احترافية تعزز التعاون والنمو في القطاع.
            </p>
            <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.7, marginBottom: '20px' }}>
              اليوم، أصبحت منصة مقاول واحدة من أكبر المنصات في سوريا، حيث تخدم أكثر من 3000 مقاول وأكثر من
              1500 مشروع منجز في جميع المحافظات السورية.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
              marginTop: '30px'
            }}>
              <div style={{
                backgroundColor: '#f0f8f0',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2e7d32', marginBottom: '5px' }}>
                  15+
                </div>
                <div style={{ color: '#555' }}>سنة خبرة</div>
              </div>
              <div style={{
                backgroundColor: '#f0f8f0',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2e7d32', marginBottom: '5px' }}>
                  3000+
                </div>
                <div style={{ color: '#555' }}>مقاول مسجل</div>
              </div>
              <div style={{
                backgroundColor: '#f0f8f0',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2e7d32', marginBottom: '5px' }}>
                  1500+
                </div>
                <div style={{ color: '#555' }}>مشروع منجز</div>
              </div>
              <div style={{
                backgroundColor: '#f0f8f0',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2e7d32', marginBottom: '5px' }}>
                  14
                </div>
                <div style={{ color: '#555' }}>محافظة سورية</div>
              </div>
            </div>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop" 
              alt="فريق العمل" 
              style={{
                width: '100%',
                borderRadius: '10px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }} 
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: '60px 20px', backgroundColor: '#f8f9fa' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#2e7d32',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              marginBottom: '20px'
            }}>🎯</div>
            <h3 style={{ fontSize: '24px', color: '#2e7d32', marginBottom: '15px' }}>
              رؤيتنا
            </h3>
            <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.7 }}>
              أن نكون المنصة الرائدة في قطاع البناء والتشييد في سوريا والمنطقة، من خلال توفير حلول مبتكرة
              تعزز التعاون بين المقاولين وأصحاب المشاريع وترفع من جودة القطاع.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#2e7d32',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              marginBottom: '20px'
            }}>🏆</div>
            <h3 style={{ fontSize: '24px', color: '#2e7d32', marginBottom: '15px' }}>
              رسالتنا
            </h3>
            <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.7 }}>
              توفير منصة متكاملة تربط بين المقاولين وأصحاب المشاريع، وتوفر أدوات وخدمات تدعم نجاح
              المشاريع وتضمن جودة التنفيذ والالتزام بالمعايير والمواصفات السورية.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '60px 20px', backgroundColor: 'white' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{ fontSize: '32px', color: '#2e7d32', textAlign: 'center', marginBottom: '40px' }}>
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
              width: '4px',
              backgroundColor: '#e0e0e0',
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
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#2e7d32',
                  border: '4px solid white',
                  boxShadow: '0 0 0 4px #e0e0e0',
                  zIndex: 1
                }}></div>

                {/* Timeline Content */}
                <div style={{
                  width: '45%',
                  backgroundColor: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                }}>
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: '#2e7d32',
                    color: 'white',
                    padding: '5px 15px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '10px'
                  }}>
                    {milestone.year === "2008" ? "٢٠٠٨" : milestone.year}
                  </div>
                  <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '10px' }}>
                    {milestone.title}
                  </h3>
                  <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.6 }}>
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{ padding: '60px 20px', backgroundColor: '#f8f9fa' }}>
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
                backgroundColor: 'white',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                textAlign: 'center'
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
                  <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '5px' }}>
                    {member.name}
                  </h3>
                  <div style={{
                    color: '#2e7d32',
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
        backgroundColor: '#2e7d32',
        padding: '60px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>
            انضم إلى مجتمعنا
          </h2>
          <p style={{ fontSize: '18px', marginBottom: '30px' }}>
            سجل في منصتنا اليوم واستفد من جميع خدماتنا في إدارة المشاريع
          </p>
          <button onClick={() => navigate('/login')} style={{
            backgroundColor: 'white',
            color: '#2e7d32',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '30px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
            سجل الآن
          </button>
        </div>
      </section>
    </div>
  );
}
