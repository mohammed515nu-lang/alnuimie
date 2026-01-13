import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { projectsAPI, usersAPI, getUser } from "./utils/api";
import logoFuture from "./assets/images/logo-future.jpeg";

const STATS_DATA = [
  { label: 'التغطية الجغرافية', target: 14, caption: 'محافظة سورية' },
  { label: 'المشاريع المكتملة', target: 1500, caption: 'مشروع منجز' },
  { label: 'الشركاء المعتمدون', target: 3000, caption: 'مقاول مسجل' },
  { label: 'خبرة تشغيلية', target: 15, caption: 'سنة خبرة' }
];

const PROJECT_FILTERS = [
  { id: 'all', label: 'الكل' },
  { id: 'residential', label: 'سكني' },
  { id: 'commercial', label: 'تجاري' },
  { id: 'other', label: 'سياحي/متنوع' }
];

export default function LandingPageNew() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeTab, setActiveTab] = useState("contractors");
  const [heroTab, setHeroTab] = useState("overview");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [statValues, setStatValues] = useState(STATS_DATA.map(() => 0));
  const [projectFilter, setProjectFilter] = useState('all');
  const [projectsData, setProjectsData] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState(null);
  const [contractorsData, setContractorsData] = useState([]);
  const [contractorsLoading, setContractorsLoading] = useState(false);
  const [contractorsError, setContractorsError] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';


  const sectionRef = useRef(null);
  const statsIntervalRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isVisible.stats && !statsIntervalRef.current) {
      statsIntervalRef.current = setInterval(() => {
        setStatValues((prev) => {
          let completed = true;
          const next = prev.map((value, idx) => {
            const target = STATS_DATA[idx].target;
            if (value < target) {
              completed = false;
              const increment = Math.ceil(target / 40);
              return Math.min(value + increment, target);
            }
            return value;
          });

          if (completed && statsIntervalRef.current) {
            clearInterval(statsIntervalRef.current);
            statsIntervalRef.current = null;
          }

          return next;
        });
      }, 40);
    }

    if (!isVisible.stats && statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
      statsIntervalRef.current = null;
      setStatValues(STATS_DATA.map(() => 0));
    }

    return () => {
      if (statsIntervalRef.current && !isVisible.stats) {
        clearInterval(statsIntervalRef.current);
        statsIntervalRef.current = null;
      }
    };
  }, [isVisible.stats]);

  useEffect(() => {
    const fetchLandingProjects = async () => {
      setProjectsLoading(true);
      setProjectsError(null);
      try {
        const result = await projectsAPI.getAll();
        if (Array.isArray(result)) {
          const normalized = result.map((project, idx) => ({
            id: project.id || project._id || `project-${idx}`,
            title: project.name || project.title || 'مشروع بدون اسم',
            category: project.category || project.type || 'متنوع',
            location: project.location || project.city || 'غير محدد',
            image: (Array.isArray(project.images) && project.images[0]) || project.coverImage || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop',
            progress: typeof project.progress === 'number'
              ? Math.round(project.progress)
              : project.status === 'completed'
                ? 100
                : 60,
            status: project.status || 'active'
          }));
          setProjectsData(normalized);
        } else {
          setProjectsData([]);
        }
      } catch (error) {
        console.error('Landing projects fetch error:', error);
        setProjectsError(error.message || 'تعذر تحميل المشاريع حالياً');
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchLandingProjects();
  }, []);

  useEffect(() => {
    const fetchLandingContractors = async () => {
      setContractorsLoading(true);
      setContractorsError(null);
      try {
        const result = await usersAPI.getAll({ role: 'contractor' });
        if (Array.isArray(result)) {
          const normalized = result.map((contractor, idx) => ({
            id: contractor.id || contractor._id || `contractor-${idx}`,
            name: contractor.name || contractor.companyName || 'مقاول بدون اسم',
            specialty: contractor.specialization || contractor.specialty || 'مقاولات عامة',
            rating: contractor.rating || 4.7,
            projects: Array.isArray(contractor.projects) ? contractor.projects.length : contractor.totalProjects || 0,
            phone: contractor.phone || '',
            email: contractor.email || ''
          }));
          setContractorsData(normalized);
        } else {
          setContractorsData([]);
        }
      } catch (error) {
        console.error('Landing contractors fetch error:', error);
        setContractorsError(error.message || 'تعذر تحميل المقاولين حالياً');
      } finally {
        setContractorsLoading(false);
      }
    };

    fetchLandingContractors();
  }, []);

  useEffect(() => {
    const user = getUser();
    if (user && user.name) {
      setCurrentUser(user);
      // Show welcome if it's the first time visiting in this session
      const welcomed = sessionStorage.getItem('welcomed');
      if (!welcomed) {
        setShowWelcome(true);
        sessionStorage.setItem('welcomed', 'true');
        setTimeout(() => setShowWelcome(false), 5000);
      }
    }
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

  // تدوير تلقائي لتبويبات الـ Hero
  useEffect(() => {
    const tabs = ['overview', 'offers', 'featured', 'how'];
    const interval = setInterval(() => {
      setHeroTab((prev) => {
        const currentIndex = tabs.indexOf(prev);
        const nextIndex = (currentIndex + 1) % tabs.length;
        return tabs[nextIndex];
      });
    }, 5000);

    return () => clearInterval(interval);
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
      name: "أحمد المحمد",
      role: "مقاول",
      content: "منصة ممتازة سهلة الاستخدام، ساعدتني في إدارة مشاريعي بكفاءة عالية",
      avatar: ""
    },
    {
      name: "ثامر المحمد",
      role: "صاحب مشروع",
      content: "وجدت أفضل المقاولين لمنزلي الجديد عبر المنصة، كان التعامل احترافياً",
      avatar: ""
    },
    {
      name: "خالد حسن",
      role: "مقاول",
      content: "منصة مقاول غيرت طريقة عملي completely، أوصي بها لكل المقاولين",
      avatar: ""
    }
  ];

  const demoContractors = [
    { id: 1, name: "شركة البناء المتطور", specialty: "بناء وتشييد", rating: 4.8, projects: 125 },
    { id: 2, name: "مجموعة الأبنية الحديثة", specialty: "تصميم داخلي", rating: 4.9, projects: 87 },
    { id: 3, name: "شركة الديكور المتميز", specialty: "ديكور وترميم", rating: 4.7, projects: 96 },
    { id: 4, name: "مؤسسة الهندسة المتقدمة", specialty: "هندسة مدنية", rating: 4.9, projects: 142 },
  ];

  const contractorsList = contractorsData.length ? contractorsData : demoContractors;
  const filteredProjects = (projectsData || []).filter((project) => {
    if (projectFilter === 'all') return true;
    if (projectFilter === 'residential') return project.category === 'سكني';
    if (projectFilter === 'commercial') return project.category === 'تجاري';
    return project.category !== 'سكني' && project.category !== 'تجاري';
  });

  const services = [
    { id: 1, title: "إدارة المشاريع", desc: "خطط ونفذ مشاريعك بكفاءة عالية", icon: "📊" },
    { id: 2, title: "توظيف عمال", desc: "اعثر على أفضل العمال لمشاريعك", icon: "👷" },
    { id: 3, title: "توريد مواد", desc: "احصل على مواد بناء بجودة عالية", icon: "🏗️" },
    { id: 4, title: "استشارات هندسية", desc: "خبراء لمساعدتك في مشاريعك", icon: "🔧" },
    { id: 5, title: "تصاريح بناء", desc: "سهولة الحصول على التصاريح اللازمة", icon: "📋" },
    { id: 6, title: "مراقبة جودة", desc: "ضمان أعلى معايير الجودة", icon: "✅" },
  ];

  const footerLinkStyle = {
    color: 'rgba(226,232,240,0.8)',
    textDecoration: 'none',
    transition: 'color 0.3s ease'
  };

  const heroImages = {
    overview: [
      {
        src: 'https://images.unsplash.com/photo-1505739717325-23c3c5b93bee?w=400&h=300&fit=crop',
        alt: 'أبراج قيد الإنشاء مع رافعات في موقع بناء'
      },
      {
        src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
        alt: 'أبراج عالية في أفق مدينة حديثة'
      },
      {
        src: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=400&h=300&fit=crop',
        alt: 'برج مكتبي زجاجي حديث'
      },
      {
        src: 'https://images.unsplash.com/photo-1505731132164-cca68a3a0182?w=400&h=300&fit=crop',
        alt: 'مشروع أبراج سكنية قيد التنفيذ'
      }
    ],
    offers: [
      {
        src: 'https://images.unsplash.com/photo-1523287562758-66c7fc58967a?w=400&h=300&fit=crop',
        alt: 'اتفاقية بين مقاول وعميل على طاولة اجتماعات'
      },
      {
        src: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=400&h=300&fit=crop',
        alt: 'مصافحة بعد إتمام عقد مشروع مقاولات'
      },
      {
        src: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=300&fit=crop',
        alt: 'شاشة تعرض رسوم بيانية وعروض أسعار للمشاريع'
      },
      {
        src: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=400&h=300&fit=crop',
        alt: 'فريق يراجع عروض مقاولات على اللابتوب'
      }
    ],
    featured: [
      {
        src: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=400&h=300&fit=crop',
        alt: 'أبراج شاهقة مضاءة ليلاً'
      },
      {
        src: 'https://images.unsplash.com/photo-1465804575741-338df8554e02?w=400&h=300&fit=crop',
        alt: 'رافعة تعمل بجانب برج قيد الإنشاء'
      },
      {
        src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop',
        alt: 'واجهة برج تجاري حديث من الزجاج'
      },
      {
        src: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=400&h=300&fit=crop',
        alt: 'برج مكتبي في منطقة تجارية'
      }
    ],
    how: [
      {
        src: 'https://images.unsplash.com/photo-1522202195461-41a8a53fb3ff?w=400&h=300&fit=crop',
        alt: 'إنشاء حساب ومتابعة النظام عبر الحاسوب'
      },
      {
        src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
        alt: 'نقاش حول خطوات العمل وآلية استخدام المنصة'
      },
      {
        src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop',
        alt: 'فريق يتابع سير العمل باستخدام أدوات رقمية'
      },
      {
        src: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=400&h=300&fit=crop',
        alt: 'تعاون بين المقاول والعميل عبر المنصة'
      }
    ]
  };

  const heroGallery = [
    {
      src: '/hero-construction-1.jpeg',
      alt: 'مهندس يشرف على موقع بناء وأبراج ورافعات'
    },
    {
      src: '/hero-construction-2.jpeg',
      alt: 'مهندسان يتابعان مخططات أمام مبنى قيد الإنشاء'
    }
  ];
  return (
    <div
      dir="rtl"
      style={{
        fontFamily: 'Cairo, sans-serif',
        backgroundColor: '#f5f0e6',
        color: '#1f2933'
      }}
    >
      {/* Welcome Message Overlay */}
      {showWelcome && currentUser && (
        <div style={{
          position: 'fixed',
          top: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '20px 40px',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          border: '2px solid #c26b3a',
          display: 'flex',
          alignItems: 'center',
          gap: 15,
          animation: 'fadeInUp 0.6s ease-out'
        }}>
          <div style={{ fontSize: 32 }}>✨</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: '#0f172a' }}>أهلاً بك مجدداً، {currentUser.name}!</div>
            <div style={{ fontSize: 14, color: '#64748b' }}>سعداء برؤيتك مرة أخرى في المستقبل لإدارة المقاولات</div>
          </div>
          <button
            onClick={() => setShowWelcome(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#94a3b8', marginRight: 15 }}
          >✕</button>
        </div>
      )}

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
          transform: translateY(-6px);
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.10);
        }

        .contractor-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.10);
        }

        .project-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
        }

        .stat-number {
          animation: float 5s ease-in-out infinite;
        }

        [data-animate] {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        [data-animate].visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: '#faf5ef',
        boxShadow: isScrolled
          ? '0 2px 10px rgba(15, 23, 42, 0.08)'
          : '0 1px 4px rgba(15, 23, 42, 0.04)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '10px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '999px',
          background: 'rgba(250,245,239,0.82)',
          boxShadow: isScrolled
            ? '0 10px 30px rgba(15,23,42,0.12)'
            : '0 6px 16px rgba(15,23,42,0.06)',
          border: '1px solid rgba(148,163,184,0.25)',
          backdropFilter: 'blur(14px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={logoFuture}
                alt="شعار المستقبل لإدارة المقاولات"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '18px', color: '#0f172a' }}>المستقبل لإدارة المقاولات</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>منصة متخصصة لإدارة مشاريع المقاولات</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav style={{ display: isMobile ? 'none' : 'flex', gap: '14px', alignItems: 'center' }}>

            {[
              { href: '/contractors', label: 'المقاولون' },
              { href: '/training', label: 'التدريب' },
              { href: '/trainers', label: 'المدربون' },
              { href: '/consulting', label: 'الخدمات الاستشارية' },
              { href: '/projects', label: 'المشاريع' },
              { href: '/about', label: 'من نحن' },
              { href: '/contact', label: 'اتصل بنا' },
            ].map((item) => {
              const isActive = item.href === '/'
                ? currentPath === '/'
                : currentPath.startsWith(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    color: isActive ? '#0f172a' : '#111827',
                    textDecoration: 'none',
                    fontWeight: isActive ? 700 : 600,
                    letterSpacing: isActive ? '0.03em' : '0.01em',
                    fontSize: '14px',
                    position: 'relative',
                    padding: '9px 16px',
                    borderRadius: '999px',
                    transition: 'all 0.25s ease',
                    border: isActive
                      ? '1px solid rgba(15,23,42,0.38)'
                      : '1px solid transparent',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(15,23,42,0.08), rgba(15,23,42,0.03))'
                      : 'transparent',
                    boxShadow: isActive
                      ? '0 10px 22px rgba(15,23,42,0.18)'
                      : 'none'
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.target.style.color = '#0f172a';
                      e.target.style.background = 'rgba(15,23,42,0.06)';
                      e.target.style.borderColor = 'rgba(15,23,42,0.18)';
                      e.target.style.boxShadow = '0 6px 14px rgba(15,23,42,0.12)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.target.style.color = '#111827';
                      e.target.style.background = 'transparent';
                      e.target.style.borderColor = 'transparent';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {item.label}
                </a>
              );
            })}
            <button onClick={() => navigate('/login')} style={{
              background: '#c26b3a',
              color: '#ffffff',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '25px',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '15px',
              boxShadow: '0 10px 24px rgba(194, 107, 58, 0.35)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 14px 32px rgba(194, 107, 58, 0.45)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 24px rgba(194, 107, 58, 0.35)';
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
              color: '#111827'
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
            <a href="/trainers" style={{ display: 'block', padding: '10px 0', color: '#333', textDecoration: 'none' }}>المدربون</a>
            <a href="/consulting" style={{ display: 'block', padding: '10px 0', color: '#333', textDecoration: 'none' }}>الخدمات الاستشارية</a>
            <a href="/projects" style={{ display: 'block', padding: '10px 0', color: '#333', textDecoration: 'none' }}>المشاريع</a>
            <a href="/about" style={{ display: 'block', padding: '10px 0', color: '#333', textDecoration: 'none' }}>من نحن</a>
            <a href="/contact" style={{ display: 'block', padding: '10px 0', color: '#333', textDecoration: 'none' }}>اتصل بنا</a>
            <button onClick={() => navigate('/login')} style={{
              background: '#c26b3a',
              color: '#ffffff',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '25px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
              marginTop: '10px',
              fontSize: '15px',
              boxShadow: '0 10px 24px rgba(194, 107, 58, 0.35)',
              transition: 'all 0.3s ease'
            }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 14px 32px rgba(194, 107, 58, 0.45)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 24px rgba(194, 107, 58, 0.35)';
              }}>تسجيل الدخول</button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0b1120 0%, #0f1f2f 40%, #124161 70%, #bfa094 100%)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        paddingTop: '90px',
        overflow: 'hidden',
        color: '#f8fafc'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 50%)'
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.15,
          backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&h=900&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />

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
            gridTemplateColumns: '1fr',
            alignItems: 'center',
            gap: '40px'
          }}>
            <div style={{ color: '#f8fafc' }}>
              <span className="animate-fadeInLeft" style={{
                display: 'inline-flex',
                padding: '8px 16px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.08)',
                marginBottom: '18px',
                fontWeight: 600,
                letterSpacing: '1px'
              }}>
                حلول مستقبلية لإدارة مشاريع المقاولات
              </span>
              <h1 className="animate-fadeInLeft" style={{
                fontSize: isMobile ? '32px' : '46px',
                fontWeight: 700,
                marginBottom: '20px',
                lineHeight: 1.3
              }}>
                منصة ذكية لإدارة مشاريع المقاولات
                <br />
                <span style={{ color: '#bfe6ff' }}>بأسلوب حديث وتفاعلي</span>
              </h1>
              <p className="animate-fadeInLeft" style={{
                fontSize: isMobile ? '16px' : '18px',
                marginBottom: '30px',
                lineHeight: 1.9,
                color: '#fdf7f2',
                opacity: 0.95,
                animationDelay: '0.15s',
                background: 'rgba(5, 12, 22, 0.55)',
                padding: isMobile ? '14px' : '18px 22px',
                borderRadius: '16px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.25)',
                textShadow: '0 1px 3px rgba(0,0,0,0.45)'
              }}>
                جميع الأطراف في مكان واحد: فريقك يدير الفرق، المواد، والفواتير، والعميل يتابع التقدم ويعتمد الدفعات خطوة بخطوة.
                واجهة عربية بالكامل مع تقارير فورية، إشعارات ذكية، وتجربة بصرية حديثة تحت هوية المستقبل لإدارة المقاولات.
              </p>
              <div style={{ height: '12px' }} />

              <div className="animate-fadeInLeft" style={{
                marginTop: '26px',
                animationDelay: '0.45s'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
                  gap: '18px'
                }}>
                  {heroGallery.map((frame, index) => (
                    <div
                      key={frame?.src || index}
                      style={{
                        position: 'relative',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        minHeight: isMobile ? '180px' : '220px',
                        boxShadow: '0 20px 35px rgba(0,0,0,0.35)',
                        backgroundImage: `url(${frame?.src})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: index === 0
                          ? 'linear-gradient(135deg, rgba(11,17,32,0.8), rgba(18,65,97,0.35))'
                          : 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(191,160,148,0.25))'
                      }} />
                      <div style={{
                        position: 'relative',
                        height: '100%',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        color: '#f8fafc'
                      }}>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Cards Section */}
      <section
        data-animate
        id="roles"
        className={isVisible.roles ? 'visible' : ''}
        style={{
          padding: '70px 20px',
          background: '#0f1f2f'
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '24px'
          }}
        >
          <div
            className={isVisible.roles ? 'animate-fadeInLeft' : ''}
            style={{
              background: 'linear-gradient(145deg, rgba(191,160,148,0.18), rgba(191,160,148,0.05))',
              border: '1px solid rgba(191,160,148,0.35)',
              borderRadius: '22px',
              padding: '32px',
              color: '#f8f5ef',
              boxShadow: '0 25px 45px rgba(0,0,0,0.25)'
            }}
          >
            <div style={{ fontSize: '14px', letterSpacing: '1px', color: '#f1d9c3', marginBottom: '10px' }}>
              للمقاولين
            </div>
            <h3 style={{ fontSize: '26px', margin: '0 0 16px' }}>
              سيطر على كل تفاصيل مشروعك
            </h3>
            <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '22px' }}>
              خطط الموارد، راقب التكاليف، وأدر فرق العمل والمواد من لوحة مركزية واحدة مع تقارير لحظية.
            </p>
            <div style={{ display: 'grid', gap: '10px', marginBottom: '26px' }}>
              <div>• لوحة تحكم للمشتريات، المخزون والفواتير</div>
              <div>• نماذج عقود ومرفقات رقمية مؤمنة</div>
              <div>• مؤشرات أداء وتنبيهات ذكية</div>
            </div>
            <button
              onClick={() => navigate('/login?role=contractor')}
              style={{
                background: '#bfa094',
                color: '#0f1f2f',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '28px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 18px 32px rgba(191,160,148,0.35)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              دخول المقاول
            </button>
          </div>

          <div
            className={isVisible.roles ? 'animate-fadeInRight' : ''}
            style={{
              background: 'linear-gradient(145deg, rgba(14,165,233,0.2), rgba(10,132,178,0.08))',
              border: '1px solid rgba(14,165,233,0.35)',
              borderRadius: '22px',
              padding: '32px',
              color: '#e7f6ff',
              boxShadow: '0 25px 45px rgba(0,0,0,0.25)'
            }}
          >
            <div style={{ fontSize: '14px', letterSpacing: '1px', color: '#bfe6ff', marginBottom: '10px' }}>
              للعملاء
            </div>
            <h3 style={{ fontSize: '26px', margin: '0 0 16px' }}>
              تابع مشروعك بثقة ووضوح
            </h3>
            <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '22px' }}>
              شاهد التقدم الفعلي، اعتمد الدفعات، وشارك المستندات مع فريق التنفيذ بواجهة سلسة من أي جهاز.
            </p>
            <div style={{ display: 'grid', gap: '10px', marginBottom: '26px' }}>
              <div>• لوحة نسب إنجاز وجدول زمني تفاعلي</div>
              <div>• دردشة وتنبيهات فورية للقرارات الحساسة</div>
              <div>• أرشفة صور وتقارير مرحلة بمرحلة</div>
            </div>
            <button
              onClick={() => navigate('/login?role=client')}
              style={{
                background: '#0ea5e9',
                color: '#f8fafc',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '28px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 18px 32px rgba(14,165,233,0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              دخول العميل
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section data-animate id="stats" className={isVisible.stats ? 'visible' : ''} style={{
        padding: '90px 20px',
        textAlign: 'center',
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(145deg, rgba(5,12,22,0.95), rgba(9,32,52,0.85)), url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: 0
        }} />
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto 50px',
          opacity: 0.9,
          position: 'relative',
          zIndex: 1
        }}>
          <span style={{
            display: 'inline-flex',
            padding: '6px 16px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.06)',
            fontSize: '14px',
            letterSpacing: '1px'
          }}>
            مؤشرات الأداء الرئيسية
          </span>
          <h2 style={{ fontSize: isMobile ? '30px' : '38px', margin: '16px 0 10px' }}>
            ثقة مدعومة بالأرقام
          </h2>
          <p style={{ maxWidth: '640px', margin: '0 auto', lineHeight: 1.7, color: 'rgba(248,250,252,0.75)' }}>
            نمو مستمر في تغطية المشاريع، عدد المقاولين المعتمدين، والخبرة المتراكمة على مدار السنوات الماضية.
          </p>
        </div>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: '24px',
          position: 'relative',
          zIndex: 1
        }}>
          {STATS_DATA.map((stat, index) => (
            <div
              key={stat.label}
              className={isVisible.stats ? 'animate-scaleIn' : ''}
              style={{
                animationDelay: `${index * 0.15}s`,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '28px 22px',
                boxShadow: '0 25px 45px rgba(0,0,0,0.35)',
                backdropFilter: 'blur(6px)'
              }}
            >
              <div style={{ fontSize: '13px', letterSpacing: '1px', color: 'rgba(248,250,252,0.7)', marginBottom: '10px' }}>
                {stat.label}
              </div>
              <div className="stat-number" style={{
                fontSize: '42px',
                fontWeight: 800,
                color: '#bfe6ff',
                marginBottom: '6px'
              }}>
                {statValues[index].toLocaleString('en-US')}
              </div>
              <div style={{ color: 'rgba(248,250,252,0.8)', fontSize: '15px' }}>
                {stat.caption}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section data-animate id="services" className={isVisible.services ? 'visible' : ''} style={{
        padding: '90px 20px',
        background: 'linear-gradient(145deg, #0a1220 0%, #13233b 60%, #1f354d 100%)',
        color: '#f8fafc'
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
            color: '#fdf7f2',
            marginBottom: '15px'
          }}>خدماتنا</h2>
          <p className={isVisible.services ? 'animate-fadeInUp' : ''} style={{ fontSize: '18px', color: 'rgba(248,250,252,0.75)', maxWidth: '700px', margin: '0 auto', animationDelay: '0.2s' }}>
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
              background: 'rgba(255,255,255,0.04)',
              padding: '32px',
              borderRadius: '18px',
              boxShadow: '0 20px 45px rgba(5,12,22,0.4)',
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              animationDelay: `${index * 0.1}s`,
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(6px)'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '20px',
                filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.25))'
              }}>{service.icon}</div>
              <h3 style={{
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#f6c7a2',
                marginBottom: '12px'
              }}>{service.title}</h3>
              <p style={{ color: 'rgba(248,250,252,0.8)', lineHeight: 1.8, fontSize: '15px' }}>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Section - Simple CTAs */}
      <section
        data-animate
        id="explore"
        className={isVisible.explore ? 'visible' : ''}
        style={{
          padding: '90px 20px',
          background: 'linear-gradient(145deg, #0a1220 0%, #13233b 60%, #1f354d 100%)',
          color: '#f8fafc'
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            textAlign: 'center'
          }}
        >
          <h2
            className={isVisible.explore ? 'animate-fadeInUp' : ''}
            style={{
              fontSize: isMobile ? '28px' : '36px',
              fontWeight: 'bold',
              color: '#fdf7f2',
              marginBottom: '15px'
            }}
          >
            استكشف
          </h2>
          <p
            className={isVisible.explore ? 'animate-fadeInUp' : ''}
            style={{
              fontSize: '16px',
              color: 'rgba(248,250,252,0.8)',
              marginBottom: '32px'
            }}
          >
            اختر ما تريد تصفحه الآن:
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '20px'
            }}
          >
            <button
              onClick={() => navigate('/contractors')}
              style={{
                padding: '16px 36px',
                borderRadius: '999px',
                border: 'none',
                background: 'linear-gradient(135deg, #c26b3a, #dba98b)',
                color: '#0b1120',
                fontWeight: 700,
                fontSize: '16px',
                cursor: 'pointer',
                boxShadow: '0 12px 30px rgba(194,107,58,0.4)'
              }}
            >
              استكشف المقاولين
            </button>
            <button
              onClick={() => navigate('/projects')}
              style={{
                padding: '16px 36px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.4)',
                background: 'transparent',
                color: '#fdf7f2',
                fontWeight: 700,
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              استعرض المشاريع والمنجزات
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section data-animate id="testimonials" className={isVisible.testimonials ? 'visible' : ''} style={{
        padding: '90px 20px',
        background: 'linear-gradient(135deg, #061224 0%, #0f1f2f 60%, #142740 100%)',
        color: '#fdf7f2'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          marginBottom: '50px'
        }}>
          <span style={{
            display: 'inline-flex',
            padding: '6px 18px',
            borderRadius: '999px',
            background: 'rgba(125,211,252,0.15)',
            color: '#bae6fd',
            fontWeight: 600,
            letterSpacing: '1px',
            marginBottom: '14px'
          }}>موثوق من شركائنا</span>
          <h2 className={isVisible.testimonials ? 'animate-fadeInUp' : ''} style={{
            fontSize: isMobile ? '30px' : '38px',
            fontWeight: '800',
            color: '#fef3c7',
            marginBottom: '12px'
          }}>آراء عملائنا</h2>
          <p className={isVisible.testimonials ? 'animate-fadeInUp' : ''} style={{ fontSize: '17px', color: 'rgba(248,250,252,0.75)', maxWidth: '700px', margin: '0 auto', animationDelay: '0.2s' }}>
            تجربة متكاملة لمديري المشاريع والملاك، بشهادة من استخدموا المنصة فعلياً.
          </p>
        </div>

        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '24px'
        }}>
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.name + index} style={{
              background: index === currentTestimonial ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
              borderRadius: '24px',
              padding: '28px',
              border: index === currentTestimonial ? '1px solid rgba(125,211,252,0.4)' : '1px solid rgba(255,255,255,0.05)',
              boxShadow: index === currentTestimonial ? '0 25px 45px rgba(6,18,36,0.55)' : '0 12px 28px rgba(6,18,36,0.35)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
              onClick={() => setCurrentTestimonial(index)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)' }}
                />
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#fef3c7' }}>{testimonial.name}</div>
                  <div style={{ fontSize: '14px', color: 'rgba(248,250,252,0.75)' }}>{testimonial.role}</div>
                </div>
              </div>
              <p style={{ color: 'rgba(248,250,252,0.85)', lineHeight: 1.7, fontSize: '15px' }}>
                “{testimonial.content}”
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'radial-gradient(circle at top, rgba(11,17,32,0.95), rgba(3,7,18,0.95))',
        color: '#e2e8f0',
        padding: '70px 20px 30px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr',
          gap: '40px',
          marginBottom: '40px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, #c26b3a, #a4582b)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '20px'
              }}>م</div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '18px', color: '#fef3c7' }}>المستقبل لإدارة المقاولات</div>
                <div style={{ fontSize: '13px', color: 'rgba(226,232,240,0.8)' }}>منصة إدارة المشاريع</div>
              </div>
            </div>
            <p style={{ lineHeight: 1.8, color: 'rgba(226,232,240,0.75)' }}>
              منصة سورية تجمع المقاولين والمالكين في تجربة رقمية واحدة لإدارة المشاريع، التدريب، والخدمات المساندة.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fef3c7', marginBottom: '18px' }}>روابط</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 2 }}>
              <li><a href="/" style={footerLinkStyle}>الرئيسية</a></li>
              <li><a href="/projects" style={footerLinkStyle}>المشاريع</a></li>
              <li><a href="/training" style={footerLinkStyle}>التدريب</a></li>
              <li><a href="/trainers" style={footerLinkStyle}>المدربون</a></li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fef3c7', marginBottom: '18px' }}>الخدمات</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 2 }}>
              <li><a href="/consulting" style={footerLinkStyle}>استشارات هندسية</a></li>
              <li><a href="/contractors" style={footerLinkStyle}>المقاولون</a></li>
              <li><a href="/projects" style={footerLinkStyle}>إدارة المشاريع</a></li>
              <li><a href="/contact" style={footerLinkStyle}>تواصل معنا</a></li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fef3c7', marginBottom: '18px' }}>تواصل</h3>
            <p style={{ marginBottom: '8px', color: 'rgba(226,232,240,0.85)' }}>📧 info@muqawil.sy</p>
            <p style={{ marginBottom: '8px', color: 'rgba(226,232,240,0.85)' }}>📱 +963 11 123 4567</p>
            <p style={{ marginBottom: '16px', color: 'rgba(226,232,240,0.85)' }}>📍 دمشق، سوريا</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['facebook', 'twitter', 'linkedin'].map((network) => (
                <a key={network} href="#" style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textDecoration: 'none',
                  textTransform: 'capitalize'
                }}>
                  {network[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '20px',
          textAlign: 'center',
          color: 'rgba(226,232,240,0.75)'
        }}>
          <p>© {new Date().getFullYear()} مقاول – منصة المقاولات السورية.</p>
        </div>
      </footer>
    </div>
  );
}
