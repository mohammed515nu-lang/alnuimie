import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPageNew() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeTab, setActiveTab] = useState("contractors");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const sectionRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const testimonials = [
    {
      name: "أحمد محمد",
      role: "مقاول",
      content: "منصة ممتازة سهلة الاستخدام، ساعدتني في إدارة مشاريعي بكفاءة عالية",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      name: "فاطمة علي",
      role: "صاحبة مشروع",
      content: "وجدت أفضل المقاولين لمنزلي الجديد عبر المنصة، كان التعامل احترافياً",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      name: "خالد حسن",
      role: "مقاول",
      content: "منصة مقاول غيرت طريقة عملي completely، أوصي بها لكل المقاولين",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg"
    }
  ];

  const contractors = [
    { id: 1, name: "شركة البناء المتطور", specialty: "بناء وتشييد", rating: 4.8, projects: 125 },
    { id: 2, name: "مجموعة الأبنية الحديثة", specialty: "تصميم داخلي", rating: 4.9, projects: 87 },
    { id: 3, name: "شركة الديكور المتميز", specialty: "ديكور وترميم", rating: 4.7, projects: 96 },
    { id: 4, name: "مؤسسة الهندسة المتقدمة", specialty: "هندسة مدنية", rating: 4.9, projects: 142 },
  ];

  const projects = [
    { id: 1, title: "فيلا دمشق", category: "سكني", location: "دمشق", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop" },
    { id: 2, title: "مركز تجاري حلب", category: "تجاري", location: "حلب", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop" },
    { id: 3, title: "مجمع سكني حمص", category: "سكني", location: "حمص", image: "https://images.unsplash.com/photo-1600585154526-990dac4d53ef?w=400&h=300&fit=crop" },
    { id: 4, title: "فندق اللاذقية", category: "سياحي", location: "اللاذقية", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop" },
  ];

  const services = [
    { id: 1, title: "إدارة المشاريع", desc: "خطط ونفذ مشاريعك بكفاءة عالية", icon: "📊" },
    { id: 2, title: "توظيف عمال", desc: "اعثر على أفضل العمال لمشاريعك", icon: "👷" },
    { id: 3, title: "توريد مواد", desc: "احصل على مواد بناء بجودة عالية", icon: "🏗️" },
    { id: 4, title: "استشارات هندسية", desc: "خبراء لمساعدتك في مشاريعك", icon: "🔧" },
    { id: 5, title: "تصاريح بناء", desc: "سهولة الحصول على التصاريح اللازمة", icon: "📋" },
    { id: 6, title: "مراقبة جودة", desc: "ضمان أعلى معايير الجودة", icon: "✅" },
  ];

  return (
    <div dir="rtl" style={{ fontFamily: 'Cairo, sans-serif', backgroundColor: '#f8f9fa' }}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out forwards;
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out forwards;
        }

        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(46, 125, 50, 0.2);
        }

        .contractor-card:hover {
          transform: translateX(-5px);
          box-shadow: 0 15px 35px rgba(46, 125, 50, 0.15);
        }

        .project-card:hover {
          transform: scale(1.05);
          box-shadow: 0 20px 50px rgba(46, 125, 50, 0.25);
        }

        .stat-number {
          animation: float 3s ease-in-out infinite;
        }

        [data-animate] {
          opacity: 0;
        }

        [data-animate].visible {
          opacity: 1;
        }
      `}</style>
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: isScrolled ? 'white' : 'transparent',
        boxShadow: isScrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#2e7d32',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px'
            }}>م</div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '18px', color: isScrolled ? '#2e7d32' : 'white' }}>مقاول</div>
              <div style={{ fontSize: '12px', color: isScrolled ? '#666' : 'rgba(255,255,255,0.8)' }}>منصة إدارة المشاريع</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav style={{ display: isMobile ? 'none' : 'flex', gap: '30px', alignItems: 'center' }}>

            <a href="/contractors" style={{ 
              color: isScrolled ? '#333' : 'white', 
              textDecoration: 'none', 
              fontWeight: '600',
              fontSize: '15px',
              transition: 'all 0.3s ease',
              position: 'relative',
              padding: '8px 0'
            }}
            onMouseOver={(e) => {
              e.target.style.color = '#43a047';
            }}
            onMouseOut={(e) => {
              e.target.style.color = isScrolled ? '#333' : 'white';
            }}>المقاولون</a>
            <a href="/training" style={{ 
              color: isScrolled ? '#333' : 'white', 
              textDecoration: 'none', 
              fontWeight: '600',
              fontSize: '15px',
              transition: 'all 0.3s ease',
              position: 'relative',
              padding: '8px 0'
            }}
            onMouseOver={(e) => {
              e.target.style.color = '#43a047';
            }}
            onMouseOut={(e) => {
              e.target.style.color = isScrolled ? '#333' : 'white';
            }}>التدريب</a>
            <a href="/consulting" style={{ 
              color: isScrolled ? '#333' : 'white', 
              textDecoration: 'none', 
              fontWeight: '600',
              fontSize: '15px',
              transition: 'all 0.3s ease',
              position: 'relative',
              padding: '8px 0'
            }}
            onMouseOver={(e) => {
              e.target.style.color = '#43a047';
            }}
            onMouseOut={(e) => {
              e.target.style.color = isScrolled ? '#333' : 'white';
            }}>الخدمات الاستشارية</a>
            <a href="/projects" style={{ 
              color: isScrolled ? '#333' : 'white', 
              textDecoration: 'none', 
              fontWeight: '600',
              fontSize: '15px',
              transition: 'all 0.3s ease',
              position: 'relative',
              padding: '8px 0'
            }}
            onMouseOver={(e) => {
              e.target.style.color = '#43a047';
            }}
            onMouseOut={(e) => {
              e.target.style.color = isScrolled ? '#333' : 'white';
            }}>المشاريع</a>
            <a href="/about" style={{ 
              color: isScrolled ? '#333' : 'white', 
              textDecoration: 'none', 
              fontWeight: '600',
              fontSize: '15px',
              transition: 'all 0.3s ease',
              position: 'relative',
              padding: '8px 0'
            }}
            onMouseOver={(e) => {
              e.target.style.color = '#43a047';
            }}
            onMouseOut={(e) => {
              e.target.style.color = isScrolled ? '#333' : 'white';
            }}>من نحن</a>
            <a href="/contact" style={{ 
              color: isScrolled ? '#333' : 'white', 
              textDecoration: 'none', 
              fontWeight: '600',
              fontSize: '15px',
              transition: 'all 0.3s ease',
              position: 'relative',
              padding: '8px 0'
            }}
            onMouseOver={(e) => {
              e.target.style.color = '#43a047';
            }}
            onMouseOut={(e) => {
              e.target.style.color = isScrolled ? '#333' : 'white';
            }}>اتصل بنا</a>
            <button onClick={() => navigate('/login')} style={{
              background: 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '25px',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '15px',
              boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(46, 125, 50, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(46, 125, 50, 0.3)';
            }}>تسجيل الدخول</button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: isMobile ? 'block' : 'none',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: isScrolled ? '#333' : 'white'
            }}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }}>
            <a href="#home" style={{ display: 'block', padding: '10px 0', color: '#333', textDecoration: 'none' }}>الرئيسية</a>
            <a href="/contractors" style={{ display: 'block', padding: '10px 0', color: '#333', textDecoration: 'none' }}>المقاولون</a>
            <a href="/training" style={{ display: 'block', padding: '10px 0', color: '#333', textDecoration: 'none' }}>التدريب</a>
            <a href="/consulting" style={{ display: 'block', padding: '10px 0', color: '#333', textDecoration: 'none' }}>الخدمات الاستشارية</a>
            <a href="/projects" style={{ display: 'block', padding: '10px 0', color: '#333', textDecoration: 'none' }}>المشاريع</a>
            <a href="/about" style={{ display: 'block', padding: '10px 0', color: '#333', textDecoration: 'none' }}>من نحن</a>
            <a href="/contact" style={{ display: 'block', padding: '10px 0', color: '#333', textDecoration: 'none' }}>اتصل بنا</a>
            <button onClick={() => navigate('/login')} style={{
              background: 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '25px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
              marginTop: '10px',
              fontSize: '15px',
              boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(46, 125, 50, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(46, 125, 50, 0.3)';
            }}>تسجيل الدخول</button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        paddingTop: '70px',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&h=900&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}></div>

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '60px 20px',
          position: 'relative',
          zIndex: 1,
          width: '100%'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            alignItems: 'center',
            gap: '60px'
          }}>
            <div style={{ color: 'white' }}>
              <h1 className="animate-fadeInLeft" style={{
                fontSize: isMobile ? '36px' : '56px',
                fontWeight: 'bold',
                marginBottom: '25px',
                lineHeight: 1.2,
                textShadow: '0 4px 10px rgba(0,0,0,0.3)'
              }}>
                منصة متكاملة لإدارة المشاريع والمقاولات
              </h1>
              <p className="animate-fadeInLeft" style={{
                fontSize: '20px',
                marginBottom: '35px',
                lineHeight: 1.8,
                opacity: 0.95,
                animationDelay: '0.2s',
                textShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}>
                نوفر حلولاً شاملة للمقاولين وأصحاب المشاريع، من إدارة المشاريع إلى توظيف العمالة وتوريد المواد
              </p>
              <div className="animate-fadeInLeft" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', animationDelay: '0.4s' }}>
                <button onClick={() => navigate('/login')} style={{
                  background: 'white',
                  color: '#2e7d32',
                  border: 'none',
                  padding: '16px 40px',
                  borderRadius: '30px',
                  fontWeight: '700',
                  fontSize: '17px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.25)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                }}>
                  ابدأ الآن
                  <span style={{ fontSize: '20px' }}>→</span>
                </button>
                <button onClick={() => navigate('/about')} style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.5)',
                  padding: '16px 40px',
                  borderRadius: '30px',
                  fontWeight: '700',
                  fontSize: '17px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.25)';
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.15)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}>
                  اعرف المزيد
                </button>
              </div>
            </div>

            <div className="animate-fadeInRight" style={{ position: 'relative' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px'
              }}>
                <div style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                  transform: 'translateY(-20px)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-30px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(-20px) scale(1)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop" 
                    alt="مشروع 1" 
                    style={{
                      width: '100%',
                      height: '250px',
                      objectFit: 'cover',
                      display: 'block'
                    }} 
                  />
                </div>

                <div style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                  transform: 'translateY(20px)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(10px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(20px) scale(1)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop" 
                    alt="مشروع 2" 
                    style={{
                      width: '100%',
                      height: '250px',
                      objectFit: 'cover',
                      display: 'block'
                    }} 
                  />
                </div>

                <div style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                  transform: 'translateY(10px)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(10px) scale(1)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop" 
                    alt="مشروع 3" 
                    style={{
                      width: '100%',
                      height: '250px',
                      objectFit: 'cover',
                      display: 'block'
                    }} 
                  />
                </div>

                <div style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                  transform: 'translateY(-10px)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-20px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop" 
                    alt="مشروع 4" 
                    style={{
                      width: '100%',
                      height: '250px',
                      objectFit: 'cover',
                      display: 'block'
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section data-animate id="stats" className={isVisible.stats ? 'visible' : ''} style={{
        padding: '60px 20px',
        backgroundColor: 'white',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: '30px'
        }}>
          <div className={isVisible.stats ? 'animate-scaleIn' : ''} style={{ animationDelay: '0s' }}>
            <div className="stat-number" style={{ fontSize: '36px', fontWeight: 'bold', color: '#2e7d32', marginBottom: '5px' }}>14+</div>
            <div style={{ color: '#666' }}>محافظة سورية</div>
          </div>
          <div className={isVisible.stats ? 'animate-scaleIn' : ''} style={{ animationDelay: '0.1s' }}>
            <div className="stat-number" style={{ fontSize: '36px', fontWeight: 'bold', color: '#2e7d32', marginBottom: '5px', animationDelay: '0.5s' }}>1500+</div>
            <div style={{ color: '#666' }}>مشروع منجز</div>
          </div>
          <div className={isVisible.stats ? 'animate-scaleIn' : ''} style={{ animationDelay: '0.2s' }}>
            <div className="stat-number" style={{ fontSize: '36px', fontWeight: 'bold', color: '#2e7d32', marginBottom: '5px', animationDelay: '1s' }}>3000+</div>
            <div style={{ color: '#666' }}>مقاول مسجل</div>
          </div>
          <div className={isVisible.stats ? 'animate-scaleIn' : ''} style={{ animationDelay: '0.3s' }}>
            <div className="stat-number" style={{ fontSize: '36px', fontWeight: 'bold', color: '#2e7d32', marginBottom: '5px', animationDelay: '1.5s' }}>15+</div>
            <div style={{ color: '#666' }}>سنة خبرة</div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section data-animate id="services" className={isVisible.services ? 'visible' : ''} style={{
        padding: '80px 20px',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          marginBottom: '50px'
        }}>
          <h2 className={isVisible.services ? 'animate-fadeInUp' : ''} style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '15px'
          }}>خدماتنا</h2>
          <p className={isVisible.services ? 'animate-fadeInUp' : ''} style={{ fontSize: '18px', color: '#666', maxWidth: '700px', margin: '0 auto', animationDelay: '0.2s' }}>
            نقدم مجموعة متكاملة من الخدمات للمقاولين وأصحاب المشاريع
          </p>
        </div>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: '30px'
        }}>
          {services.map((service, index) => (
            <div key={service.id} className={`service-card ${isVisible.services ? 'animate-scaleIn' : ''}`} style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(46, 125, 50, 0.08)',
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              animationDelay: `${index * 0.1}s`,
              border: '1px solid rgba(46, 125, 50, 0.08)'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '20px',
                filter: 'drop-shadow(0 4px 8px rgba(46, 125, 50, 0.15))'
              }}>{service.icon}</div>
              <h3 style={{
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#2e7d32',
                marginBottom: '12px'
              }}>{service.title}</h3>
              <p style={{ color: '#666', lineHeight: 1.6, fontSize: '15px' }}>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contractors and Projects Tabs */}
      <section data-animate id="explore" className={isVisible.explore ? 'visible' : ''} style={{
        padding: '80px 20px',
        backgroundColor: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <h2 className={isVisible.explore ? 'animate-fadeInUp' : ''} style={{
              fontSize: isMobile ? '28px' : '36px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '15px'
            }}>استكشف</h2>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '30px',
              background: '#f0f0f0',
              borderRadius: '50px',
              padding: '6px',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <button
                onClick={() => handleTabChange("contractors")}
                style={{
                  padding: '14px 35px',
                  border: 'none',
                  background: activeTab === "contractors" ? 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)' : 'transparent',
                  color: activeTab === "contractors" ? 'white' : '#666',
                  fontWeight: '700',
                  cursor: 'pointer',
                  borderRadius: '50px',
                  transition: 'all 0.3s ease',
                  fontSize: '16px',
                  boxShadow: activeTab === "contractors" ? '0 4px 15px rgba(46, 125, 50, 0.4)' : 'none',
                  transform: activeTab === "contractors" ? 'scale(1.02)' : 'scale(1)'
                }}
                onMouseOver={(e) => {
                  if (activeTab !== "contractors") {
                    e.target.style.color = '#2e7d32';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== "contractors") {
                    e.target.style.color = '#666';
                  }
                }}
              >
                المقاولون
              </button>
              <button
                onClick={() => handleTabChange("projects")}
                style={{
                  padding: '14px 35px',
                  border: 'none',
                  background: activeTab === "projects" ? 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)' : 'transparent',
                  color: activeTab === "projects" ? 'white' : '#666',
                  fontWeight: '700',
                  cursor: 'pointer',
                  borderRadius: '50px',
                  transition: 'all 0.3s ease',
                  fontSize: '16px',
                  boxShadow: activeTab === "projects" ? '0 4px 15px rgba(46, 125, 50, 0.4)' : 'none',
                  transform: activeTab === "projects" ? 'scale(1.02)' : 'scale(1)'
                }}
                onMouseOver={(e) => {
                  if (activeTab !== "projects") {
                    e.target.style.color = '#2e7d32';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== "projects") {
                    e.target.style.color = '#666';
                  }
                }}
              >
                المشاريع
              </button>
            </div>
          </div>

          {activeTab === "contractors" && (
            <div id="contractors" style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '30px'
            }}>
              {contractors.map((contractor, index) => (
                <div key={contractor.id} className={`contractor-card animate-fadeInUp`} style={{
                  backgroundColor: '#f8f9fa',
                  padding: '25px',
                  borderRadius: '16px',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  animationDelay: `${index * 0.1}s`,
                  boxShadow: '0 8px 25px rgba(46, 125, 50, 0.08)',
                  border: '1px solid rgba(46, 125, 50, 0.05)'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '30px',
                    color: '#999'
                  }}>
                    👤
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#333',
                      marginBottom: '5px'
                    }}>{contractor.name}</h3>
                    <p style={{ color: '#666', marginBottom: '10px' }}>{contractor.specialty}</p>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>⭐</span>
                        <span>{contractor.rating}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>📁</span>
                        <span>{contractor.projects} مشروع</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => navigate('/contractors')} style={{
                    background: 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '25px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '14px',
                    boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)',
                    transition: 'all 0.3s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(46, 125, 50, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(46, 125, 50, 0.3)';
                  }}>
                    عرض التفاصيل
                    <span style={{ fontSize: '16px' }}>←</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "projects" && (
            <div id="projects" style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '30px'
            }}>
              {projects.map((project, index) => (
                <div key={project.id} className={`project-card animate-fadeInUp`} style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(46, 125, 50, 0.1)',
                  transition: 'all 0.3s ease',
                  animationDelay: `${index * 0.1}s`,
                  border: '1px solid rgba(46, 125, 50, 0.08)'
                }}>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover'
                    }} 
                  />
                  <div style={{ padding: '20px' }}>
                    <div style={{
                      display: 'inline-block',
                      backgroundColor: '#2e7d32',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '15px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginBottom: '10px'
                    }}>
                      {project.category}
                    </div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#333',
                      marginBottom: '5px'
                    }}>{project.title}</h3>
                    <p style={{ color: '#666', marginBottom: '15px' }}>
                      📍 {project.location}
                    </p>
                    <button onClick={() => navigate('/projects')} style={{
                      background: 'white',
                      color: '#2e7d32',
                      border: '2px solid #2e7d32',
                      padding: '12px 24px',
                      borderRadius: '25px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)';
                      e.target.style.color = 'white';
                      e.target.style.borderColor = 'transparent';
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(46, 125, 50, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'white';
                      e.target.style.color = '#2e7d32';
                      e.target.style.borderColor = '#2e7d32';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}>
                      عرض التفاصيل
                      <span style={{ fontSize: '16px' }}>←</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section data-animate id="testimonials" className={isVisible.testimonials ? 'visible' : ''} style={{
        padding: '80px 20px',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          marginBottom: '50px'
        }}>
          <h2 className={isVisible.testimonials ? 'animate-fadeInUp' : ''} style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '15px'
          }}>آراء عملائنا</h2>
          <p className={isVisible.testimonials ? 'animate-fadeInUp' : ''} style={{ fontSize: '18px', color: '#666', maxWidth: '700px', margin: '0 auto', animationDelay: '0.2s' }}>
            ماذا يقول عملاؤنا عن منصتنا
          </p>
        </div>

        <div className={isVisible.testimonials ? 'animate-scaleIn' : ''} style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
          textAlign: 'center',
          position: 'relative',
          animationDelay: '0.3s'
        }}>
          <div style={{
            fontSize: '60px',
            color: '#f0f0f0',
            position: 'absolute',
            top: '20px',
            left: '20px'
          }}>❝</div>

          <p style={{
            fontSize: '18px',
            lineHeight: 1.6,
            color: '#666',
            marginBottom: '30px',
            fontStyle: 'italic'
          }}>
            {testimonials[currentTestimonial].content}
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px'
          }}>
            <img 
              src={testimonials[currentTestimonial].avatar} 
              alt={testimonials[currentTestimonial].name} 
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                objectFit: 'cover'
              }} 
            />
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#333'
              }}>
                {testimonials[currentTestimonial].name}
              </div>
              <div style={{ color: '#666' }}>
                {testimonials[currentTestimonial].role}
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '20px'
          }}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: index === currentTestimonial ? '#2e7d32' : '#ddd',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section data-animate id="cta" className={isVisible.cta ? 'visible' : ''} style={{
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          <h2 className={isVisible.cta ? 'animate-fadeInUp' : ''} style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: 'bold',
            marginBottom: '15px'
          }}>
            انضم إلى منصتنا اليوم
          </h2>
          <p className={isVisible.cta ? 'animate-fadeInUp' : ''} style={{
            fontSize: '18px',
            marginBottom: '30px',
            lineHeight: 1.6,
            animationDelay: '0.2s'
          }}>
            سجل الآن وابدأ في إدارة مشاريعك بكفاءة عالية
          </p>
          <button onClick={() => navigate('/login')} className={isVisible.cta ? 'animate-scaleIn' : ''} style={{
            background: 'white',
            color: '#2e7d32',
            border: 'none',
            padding: '18px 50px',
            borderRadius: '30px',
            fontWeight: '700',
            fontSize: '18px',
            cursor: 'pointer',
            animationDelay: '0.4s',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-5px) scale(1.05)';
            e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';
          }}>
            سجل الآن
            <span style={{ fontSize: '22px' }}>→</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#333',
        color: 'white',
        padding: '60px 20px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: '40px',
          marginBottom: '40px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#2e7d32',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>م</div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>مقاول</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>منصة إدارة المشاريع</div>
              </div>
            </div>
            <p style={{ lineHeight: 1.6, opacity: 0.8 }}>
              منصة متكاملة لإدارة المشاريع والمقاولات في سوريا
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>روابط سريعة</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>الرئيسية</a></li>
              <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>الخدمات</a></li>
              <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>المقاولون</a></li>
              <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>المشاريع</a></li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>الخدمات</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>إدارة المشاريع</a></li>
              <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>توظيف عمال</a></li>
              <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>توريد مواد</a></li>
              <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>استشارات هندسية</a></li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>تواصل معنا</h3>
            <p style={{ marginBottom: '10px', opacity: 0.8 }}>📧 info@muqawil.sy</p>
            <p style={{ marginBottom: '10px', opacity: 0.8 }}>📱 +963 11 123 4567</p>
            <p style={{ marginBottom: '20px', opacity: 0.8 }}>📍 دمشق، سوريا</p>

            <div style={{ display: 'flex', gap: '15px' }}>
              <a href="#" style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textDecoration: 'none'
              }}>f</a>
              <a href="#" style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textDecoration: 'none'
              }}>t</a>
              <a href="#" style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textDecoration: 'none'
              }}>in</a>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '20px',
          textAlign: 'center',
          opacity: 0.8
        }}>
          <p>© {new Date().getFullYear()} مقاول. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
