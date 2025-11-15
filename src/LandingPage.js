import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./assets/styles/landing.css";

const BRAND = {
  primary: '#6a11cb',
  accent: '#2575fc',
  secondary: '#6a11cb',
  gradient: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  gradientLight: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  dark: '#2c3e50',
  light: '#f8f9fa',
  muted: '#6c757d',
  success: '#2575fc',
  warning: '#ff9800',
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const statsRef = useRef(null);
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0]);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const stats = [
    { value: 14, suffix: '+', label: 'محافظة سورية', icon: '🗺️' },
    { value: 1500, suffix: '+', label: 'مشروع منجز', icon: '🏗️' },
    { value: 15, suffix: '+', label: 'سنة خبرة', icon: '🎯' },
    { value: 3000, suffix: '+', label: 'مقاول مسجل', icon: '👥' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stats.forEach((stat, index) => {
              let current = 0;
              const increment = stat.value / 60;
              const timer = setInterval(() => {
                current += increment;
                if (current >= stat.value) {
                  current = stat.value;
                  clearInterval(timer);
                }
                setAnimatedStats((prev) => {
                  const newStats = [...prev];
                  newStats[index] = Math.floor(current);
                  return newStats;
                });
              }, 16);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: '🗺️',
      title: 'تغطية جميع المحافظات',
      desc: 'نوفر خدماتنا في جميع المحافظات السورية مع فهم كامل للوائح المحلية',
      color: '#6a11cb'
    },
    {
      icon: '🏛️',
      title: 'مطابقة للمعايير السورية',
      desc: 'جميع مشاريعنا تتوافق مع المعايير واللوائح الحكومية السورية',
      color: '#2575fc'
    },
    {
      icon: '👷',
      title: 'كوادر محلية مدربة',
      desc: 'نعتمد على كوادر سورية متخصصة ومدربة على أحدث التقنيات',
      color: '#6a11cb'
    },
    {
      icon: '💰',
      title: 'أسعار تنافسية',
      desc: 'نقدم أسعاراً تنافسية تناسب السوق السوري مع الحفاظ على الجودة',
      color: '#ff9800'
    },
  ];

  const projects = [
    {
      id: 1,
      title: 'مجمع سكني في دمشق',
      category: 'مباني سكنية',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&h=900&fit=crop&q=85',
      stats: { area: '6500 م²', floors: '12 طابق', duration: '20 شهر' }
    },
    {
      id: 2,
      title: 'مركز تجاري في حلب',
      category: 'مراكز تجارية',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&h=900&fit=crop&q=85',
      stats: { area: '10000 م²', floors: '4 طابق', duration: '18 شهر' }
    },
    {
      id: 3,
      title: 'فندق في اللاذقية',
      category: 'فنادق ومنتجعات',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&h=900&fit=crop&q=85',
      stats: { area: '8500 م²', floors: '8 طابق', duration: '24 شهر' }
    },
  ];

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div dir="rtl" className="landing-page">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .btn-glow {
          position: relative;
          overflow: hidden;
        }
        .btn-glow::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .btn-glow:hover::before {
          width: 300px;
          height: 300px;
        }
        @media (max-width: 768px) {
          header nav a {
            display: none !important;
          }
          header nav button {
            padding: 8px 16px !important;
            font-size: 12px !important;
          }
        }
      `}</style>

      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: isScrolled ? 'rgba(30, 58, 95, 0.95)' : 'transparent',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.3s ease',
        borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.1)' : 'none'
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: isMobile ? '16px 20px' : '20px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            cursor: 'pointer'
          }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              background: BRAND.gradientLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              boxShadow: '0 8px 25px rgba(42, 157, 143, 0.4)'
            }}>🏗️</div>
            <div>
              <div style={{
                color: isScrolled ? '#fff' : BRAND.primary,
                fontWeight: 900,
                fontSize: 24,
                letterSpacing: '-0.5px',
                transition: 'color 0.3s ease'
              }}>مقاول سوريا</div>
              <div style={{
                color: isScrolled ? '#94a3b8' : BRAND.muted,
                fontSize: 14,
                fontWeight: 600,
                transition: 'color 0.3s ease'
              }}>منصة إدارة المشاريع السورية</div>
            </div>
          </div>
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? 12 : 24
          }}>
            {!isMobile && ['من نحن', 'خدماتنا', 'مشاريعنا', 'اتصل بنا'].map((item, idx) => (
              <a
                key={idx}
                href={`#section-${idx + 1}`}
                style={{
                  textDecoration: 'none',
                  color: isScrolled ? '#e2e8f0' : BRAND.primary,
                  fontWeight: 600,
                  fontSize: 15,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  padding: '8px 0'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = BRAND.accent;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = isScrolled ? '#e2e8f0' : BRAND.primary;
                }}
              >
                {item}
              </a>
            ))}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button
                onClick={() => navigate('/register')}
                style={{
                  background: 'transparent',
                  color: isScrolled ? '#e2e8f0' : BRAND.primary,
                  border: `2px solid ${isScrolled ? 'rgba(255,255,255,0.3)' : BRAND.accent}`,
                  padding: '10px 24px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 14,
                  transition: 'all 0.3s ease',
                  backdropFilter: isScrolled ? 'blur(10px)' : 'none'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = isScrolled ? 'rgba(255,255,255,0.1)' : BRAND.light;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                إنشاء حساب
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn-glow"
                style={{
                  background: BRAND.gradientLight,
                  color: '#fff',
                  border: 0,
                  padding: '12px 28px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 15,
                  boxShadow: '0 4px 20px rgba(42, 157, 143, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(42, 157, 143, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(42, 157, 143, 0.4)';
                }}
              >
                تسجيل الدخول
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(42, 157, 143, 0.3) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 80% 80%, rgba(30, 58, 95, 0.2) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: isMobile ? '100px 20px 60px' : '80px 32px',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
            gap: isMobile ? 40 : 60,
            alignItems: 'center'
          }}>
            <div style={{ animation: 'fadeInUp 0.8s ease' }}>
              <div style={{
                display: 'inline-block',
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '8px 20px',
                borderRadius: 50,
                fontSize: 14,
                fontWeight: 600,
                color: '#fff',
                marginBottom: 24,
                backdropFilter: 'blur(10px)'
              }}>
                🏗️ المنصة الأولى لإدارة المشاريع في سوريا
              </div>
              <h1 style={{
                fontSize: isMobile ? 36 : 64,
                fontWeight: 900,
                lineHeight: 1.2,
                color: '#fff',
                margin: '0 0 24px 0',
                letterSpacing: '-2px',
                textShadow: '0 4px 30px rgba(0,0,0,0.2)'
              }}>
                إدارة المشاريع<br />
                <span style={{
                  background: 'linear-gradient(135deg, #43a047 0%, #2e7d32 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>في سوريا</span>
              </h1>
              <p style={{
                fontSize: isMobile ? 16 : 20,
                lineHeight: 1.8,
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: 40,
                maxWidth: 600
              }}>
                المنصة الأولى من نوعها في سوريا لإدارة المشاريع والمقاولات، تدعم جميع المحافظات السورية 
                وتوفر حلولاً متخصصة للسوق المحلي مع فهم كامل للوائح والمعايير السورية.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-glow"
                  style={{
                    background: '#fff',
                    color: BRAND.primary,
                    border: 0,
                    padding: '18px 36px',
                    borderRadius: 14,
                    fontWeight: 700,
                    fontSize: 17,
                    cursor: 'pointer',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';
                  }}
                >
                  ابدأ الآن ✨
                </button>
                <button
                  onClick={() => document.getElementById('section-2')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    padding: '18px 36px',
                    borderRadius: 14,
                    fontWeight: 700,
                    fontSize: 17,
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  استكشف خدماتنا
                </button>
              </div>
            </div>

            <div style={{ position: 'relative', animation: 'float 6s ease-in-out infinite' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: 24,
                padding: 32,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
              }}>
                <div style={{
                  width: '100%',
                  height: 400,
                  borderRadius: 16,
                  overflow: 'hidden',
                  position: 'relative',
                  background: '#000'
                }}>
                  <img
                    src={projects[currentSlide].image}
                    alt={projects[currentSlide].title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'opacity 0.5s ease'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)',
                    padding: 24,
                    color: '#fff'
                  }}>
                    <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
                      {projects[currentSlide].title}
                    </div>
                    <div style={{ fontSize: 14, opacity: 0.9 }}>
                      {projects[currentSlide].category}
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  gap: 8,
                  justifyContent: 'center',
                  marginTop: 16
                }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      style={{
                        width: i === currentSlide ? 32 : 8,
                        height: 8,
                        borderRadius: 50,
                        background: i === currentSlide ? '#fff' : 'rgba(255,255,255,0.4)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
          </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} style={{
        background: BRAND.light,
        padding: '80px 32px',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 32
        }}>
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                background: '#fff',
                borderRadius: 20,
                padding: 40,
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{
                fontSize: 48,
                marginBottom: 16,
                animation: 'pulse 2s ease-in-out infinite'
              }}>
                {stat.icon}
          </div>
              <div style={{
                fontSize: 48,
                fontWeight: 900,
                background: BRAND.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: 12
              }}>
                {animatedStats[index]}{stat.suffix}
        </div>
              <div style={{
                fontSize: 16,
                color: BRAND.muted,
                fontWeight: 600
              }}>
                {stat.label}
          </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="section-2" className="features">
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          textAlign: 'center',
          marginBottom: 60
        }}>
          <h2 style={{
            fontSize: 48,
            fontWeight: 900,
            color: BRAND.primary,
            marginBottom: 16,
            letterSpacing: '-1px'
          }}>
            لماذا نحن؟
          </h2>
          <p style={{
            fontSize: 20,
            color: BRAND.muted,
            maxWidth: 700,
            margin: '0 auto',
            lineHeight: 1.8
          }}>
            نقدم حلول بناء متكاملة تجمع بين الجودة والسرعة والابتكار
          </p>
        </div>

        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: isMobile ? 24 : 32,
          padding: isMobile ? '0 20px' : '0'
        }}>
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                background: '#fff',
                borderRadius: 24,
                padding: 40,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '2px solid transparent',
                transition: 'all 0.4s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = feature.color;
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = `0 12px 40px ${feature.color}30`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{
                width: 70,
                height: 70,
                borderRadius: 18,
                background: `${feature.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
                marginBottom: 24
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: 24,
                fontWeight: 800,
                color: BRAND.primary,
                marginBottom: 12
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: 16,
                color: BRAND.muted,
                lineHeight: 1.7
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="section-title">
          <h2>آراء عملائنا</h2>
          <p>ماذا يقول عملاؤنا عن منصتنا</p>
        </div>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 30
        }}>
          {[
            {
              id: 1,
              name: "أحمد محمد",
              position: "مدير مشروع",
              company: "شركة البناء المتقدم",
              text: "منصة ممتازة ساعدتنا في إدارة مشاريعنا بكفاءة عالية. واجهة الاستخدام سهلة والميزات متكاملة.",
              avatar: "avatar1.jpg"
            },
            {
              id: 2,
              name: "فاطمة علي",
              position: "مهندسة معمارية",
              company: "مكتب التصميم الحديث",
              text: "أفضل منصة لإدارة المشاريع في سوريا. ساعدتنا في تتبع التقدم والتنسيق مع المقاولين بسهولة.",
              avatar: "avatar2.jpg"
            },
            {
              id: 3,
              name: "خالد سعيد",
              position: "مقاول",
              company: "شركة المقاولات المتحدة",
              text: "منصة رائعة سهلة الاستخدام وفعالة جداً في تنظيم العمل اليومي. أوصي بها بشدة لجميع المقاولين.",
              avatar: "avatar3.jpg"
            }
          ].map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-text">
                "{testimonial.text}"
              </div>
              <div className="testimonial-author">
                <img 
                  src={`./assets/images/${testimonial.avatar}`} 
                  alt={testimonial.name}
                  className="author-avatar"
                />
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: 5 }}>{testimonial.name}</div>
                  <div style={{ fontSize: 14, color: BRAND.muted }}>
                    {testimonial.position}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links Section */}
      <section style={{
        background: BRAND.light,
        padding: '100px 32px',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          textAlign: 'center',
          marginBottom: 60
        }}>
          <h2 style={{
            fontSize: 48,
            fontWeight: 900,
            color: BRAND.primary,
            marginBottom: 16,
            letterSpacing: '-1px'
          }}>
            استكشف المزيد
          </h2>
          <p style={{
            fontSize: 20,
            color: BRAND.muted,
            maxWidth: 700,
            margin: '0 auto',
            lineHeight: 1.8
          }}>
            اكتشف مشاريعنا، شهادات عملائنا، وكيف يعمل النظام
          </p>
        </div>

        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? 24 : 32,
          padding: isMobile ? '0 20px' : '0'
        }}>
          {[
            { icon: '🏗️', title: 'المشاريع', desc: 'استعرض مشاريعنا المميزة', link: '/projects', color: BRAND.primary },
            { icon: '⭐', title: 'الشهادات', desc: 'آراء عملائنا المميزين', link: '/testimonials', color: BRAND.accent },
            { icon: '❓', title: 'الأسئلة الشائعة', desc: 'إجابات على أسئلتك', link: '/faq', color: '#f59e0b' },
            { icon: '📖', title: 'كيف يعمل النظام', desc: 'خطوات بسيطة للبدء', link: '/how-it-works', color: '#10b981' },
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.link)}
              style={{
                background: '#fff',
                borderRadius: 24,
                padding: 40,
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '2px solid transparent',
                transition: 'all 0.4s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = item.color;
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = `0 12px 40px ${item.color}30`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `${item.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
                margin: '0 auto 24px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
              }}
              >
                {item.icon}
              </div>
              <h3 style={{
                fontSize: 22,
                fontWeight: 800,
                color: BRAND.primary,
                marginBottom: 12
              }}>
                {item.title}
              </h3>
              <p style={{
                fontSize: 16,
                color: BRAND.muted,
                lineHeight: 1.7,
                marginBottom: 20
              }}>
                {item.desc}
              </p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: item.color,
                fontWeight: 700,
                fontSize: 15
              }}>
                <span>اكتشف المزيد</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing">
        <div className="section-title">
          <h2>خططنا الأسعار</h2>
          <p>اختر الخطة التي تناسب احتياجاتك</p>
        </div>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 30
        }}>
          {[
            {
              id: 1,
              name: "أساسي",
              price: "مجاني",
              period: "",
              features: [
                "إدارة 3 مشاريع",
                "5 مستخدمين",
                "تخزين 2 جيجابايت",
                "دعم عبر البريد الإلكتروني"
              ],
              featured: false
            },
            {
              id: 2,
              name: "احترافي",
              price: "99",
              period: "شهرياً",
              features: [
                "إدارة مشاريع غير محدودة",
                "20 مستخدم",
                "تخزين 50 جيجابايت",
                "دعم فني على مدار الساعة",
                "تقارير متقدمة"
              ],
              featured: true
            },
            {
              id: 3,
              name: "مؤسسة",
              price: "299",
              period: "شهرياً",
              features: [
                "جميع ميزات الخطة الاحترافية",
                "مستخدمون غير محدودون",
                "تخزين غير محدود",
                "مدير حساب مخصص",
                "تدريب مخصص للفريق"
              ],
              featured: false
            }
          ].map(plan => (
            <div key={plan.id} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
              <h3>{plan.name}</h3>
              <div className="price">
                {plan.price}
                {plan.period && <span style={{ fontSize: 18, fontWeight: 'normal' }}>/{plan.period}</span>}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '30px 0' }}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: BRAND.success, marginLeft: 10 }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/login')}
                className={`btn ${plan.featured ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: plan.featured ? 'none' : `2px solid ${BRAND.primary}`,
                  background: plan.featured ? BRAND.gradient : 'transparent',
                  color: plan.featured ? 'white' : BRAND.primary,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {plan.featured ? 'ابدأ الآن' : 'اختر الخطة'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <div className="section-title">
          <h2>الأسئلة الشائعة</h2>
          <p>إجابات على الأسئلة الأكثر شيوعاً</p>
        </div>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {[
            {
              question: "كيف يمكنني البدء باستخدام المنصة؟",
              answer: "يمكنك البدء بإنشاء حساب مجاني عبر الضغط على زر 'إنشاء حساب' في أعلى الصفحة. بعد تسجيل الدخول، يمكنك البدء في إدارة مشاريعك فوراً."
            },
            {
              question: "هل المنصة متوافقة مع اللوائح السورية؟",
              answer: "نعم، تم تصميم المنصة بالكامل لتتوافق مع اللوائح والمعايير الحكومية السورية، وتدعم جميع المتطلبات المحلية لإدارة المشاريع."
            },
            {
              question: "هل يمكنني الوصول إلى بياناتي من خارج سوريا؟",
              answer: "نعم، يمكن الوصول إلى المنصة من أي مكان في العالم عبر الإنترنت، مما يتيح لك إدارة مشاريعك حتى أثناء السفر."
            },
            {
              question: "هل تقدمون تدريباً على استخدام المنصة؟",
              answer: "نعم، نقدم مواد تدريبية ودليل استخدام شامل، بالإضافة إلى جلسات تدريب مخصص للعملاء في الخطط المدفوعة."
            }
          ].map((faq, idx) => (
            <div key={idx} className="faq-item">
              <div className="faq-question" onClick={() => {
                const faqItems = document.querySelectorAll('.faq-item');
                faqItems.forEach(item => item.classList.remove('active'));
                document.querySelectorAll('.faq-item')[idx].classList.toggle('active');
              }}>
                {faq.question}
                <span className="faq-icon">▼</span>
              </div>
              <div className="faq-answer">{faq.answer}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: BRAND.gradient,
        padding: '100px 32px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          maxWidth: 800,
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          <h2 style={{
            fontSize: 48,
            fontWeight: 900,
            color: '#fff',
            marginBottom: 24,
            letterSpacing: '-1px'
          }}>
            جاهز لبدء مشروعك؟
          </h2>
          <p style={{
            fontSize: 20,
            color: 'rgba(255,255,255,0.9)',
            marginBottom: 40,
            lineHeight: 1.8
          }}>
            تواصل معنا اليوم واحصل على استشارة مجانية لمشروعك
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn-glow"
            style={{
              background: '#fff',
              color: BRAND.primary,
              border: 0,
              padding: '20px 48px',
              borderRadius: 14,
              fontWeight: 700,
              fontSize: 18,
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
            }}
          >
            ابدأ الآن مجاناً 🚀
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-title">
          <h2>كيف يعمل النظام؟</h2>
          <p>خطوات بسيطة للبدء في إدارة مشاريعك</p>
        </div>
        <div style={{
          maxWidth: 1000,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: 30
        }}>
          {[
            {
              number: 1,
              title: "إنشاء حساب",
              description: "سجل حسابك المجاني في أقل من دقيقة"
            },
            {
              number: 2,
              title: "إضافة مشروع",
              description: "أضف مشروعك الأول مع جميع التفاصيل"
            },
            {
              number: 3,
              title: "إدارة المهام",
              description: "وزع المهام على فريقك وتابع التقدم"
            },
            {
              number: 4,
              title: "متابعة التقارير",
              description: "احصل على تقارير دقيقة عن أداء المشروع"
            }
          ].map((step, idx) => (
            <div key={idx} className="step">
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="section-4" style={{
        background: '#fff',
        padding: '100px 32px'
      }}>
        <div style={{
          maxWidth: 900,
          margin: '0 auto',
          background: BRAND.light,
          borderRadius: 32,
          padding: 60,
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <h2 style={{
              fontSize: 42,
              fontWeight: 900,
              color: BRAND.primary,
              marginBottom: 16
            }}>
              تواصل معنا
            </h2>
            <p style={{
              fontSize: 18,
              color: BRAND.muted
            }}>
              نحن هنا للإجابة على جميع استفساراتك
            </p>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            alert('✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
          }} style={{
            display: 'grid',
            gap: 24
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 24
            }}>
              <input
                required
                placeholder="اسمك الكامل"
                style={{
                  padding: 18,
                  border: '2px solid #e5e7eb',
                  borderRadius: 14,
                  fontSize: 16,
                  outline: 'none',
                  background: '#fff',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = BRAND.accent;
                  e.target.style.boxShadow = `0 0 0 4px ${BRAND.accent}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <input
                required
                type="email"
                placeholder="بريدك الإلكتروني"
                style={{
                  padding: 18,
                  border: '2px solid #e5e7eb',
                  borderRadius: 14,
                  fontSize: 16,
                  outline: 'none',
                  background: '#fff',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = BRAND.accent;
                  e.target.style.boxShadow = `0 0 0 4px ${BRAND.accent}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <textarea
              required
              placeholder="رسالتك"
              rows={6}
              style={{
                padding: 18,
                border: '2px solid #e5e7eb',
                borderRadius: 14,
                fontSize: 16,
                outline: 'none',
                background: '#fff',
                resize: 'vertical',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = BRAND.accent;
                e.target.style.boxShadow = `0 0 0 4px ${BRAND.accent}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="submit"
              className="btn-glow"
              style={{
                background: BRAND.gradientLight,
                color: '#fff',
                border: 0,
                padding: '20px 48px',
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 18,
                cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(42, 157, 143, 0.4)',
                transition: 'all 0.3s ease',
                justifySelf: 'center',
                minWidth: 250
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(42, 157, 143, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(42, 157, 143, 0.4)';
              }}
            >
              إرسال الرسالة ✉️
            </button>
        </form>
        </div>
      </section>


      {/* Footer */}
      <footer className="footer">
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 24
          }}>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              background: BRAND.gradientLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24
            }}>🏗️</div>
            <div style={{
              fontSize: 24,
              fontWeight: 900,
              color: '#fff'
            }}>المستقبل لإدارة المقاولات</div>
          </div>
          <p style={{
            fontSize: 16,
            marginBottom: 32,
            color: 'rgba(255,255,255,0.6)'
          }}>
            بناء المستقبل بكل ثقة واحترافية
          </p>
          
          {/* Social Media Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            marginBottom: 32
          }}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                color: '#fff',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              📘
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                color: '#fff',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              📷
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                color: '#fff',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              💼
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                color: '#fff',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🐦
            </a>
          </div>

          <div style={{
            paddingTop: 32,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontSize: 14,
            color: 'rgba(255,255,255,0.5)'
          }}>
            <div style={{ marginBottom: 8 }}>
              🎓 مشروع تخرج أكاديمي - للأغراض التعليمية فقط
            </div>
            © {new Date().getFullYear()} جميع الحقوق محفوظة
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed',
            bottom: 30,
            left: 30,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: BRAND.gradientLight,
            color: '#fff',
            border: 0,
            fontSize: 24,
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(42, 157, 143, 0.4)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            animation: 'fadeInUp 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(42, 157, 143, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(42, 157, 143, 0.4)';
          }}
        >
          ↑
        </button>
      )}
    </div>
  );
}

