
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import '../assets/styles/landing.css';

const BRAND = {
  primary: '#4caf50',
  accent: '#66bb6a',
  secondary: '#388e3c',
  gradient: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
  gradientLight: 'linear-gradient(135deg, #388e3c 0%, #4caf50 50%, #66bb6a 100%)',
  dark: '#2e7d32',
  light: '#f8f9fa',
  muted: '#6c757d',
  success: '#43a047',
  warning: '#ff9800',
};

export default function Login() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [userType, setUserType] = useState('contractor');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        // Navigate based on user type
        if (userType === 'contractor') {
          navigate('/contractor');
        } else {
          navigate('/client/projects');
        }
      }, 1500);
    }
  };

  const handleForgotPassword = () => {
    if (!forgotEmail) {
      alert('⚠️ الرجاء إدخال البريد الإلكتروني');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
      alert('⚠️ البريد الإلكتروني غير صالح');
      return;
    }
    
    // Simulate sending reset email
    alert(`✅ تم إرسال رابط إعادة تعيين كلمة المرور إلى ${forgotEmail}`);
    setShowForgotPassword(false);
    setForgotEmail('');
  };

  const handleRegister = () => {
    setIsRegistering(true);
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const response = await authAPI.getGoogleAuthUrl();
      window.location.href = response.authUrl;
    } catch (error) {
      alert(`❌ ${error.message || 'فشل الاتصال بخدمة Google'}`);
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl" className="landing-page">
      {/* Login Section */}
      <section className="hero" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        position: 'relative',
        overflow: 'hidden',
        padding: '40px 20px'
      }}>
        {/* Background Image - City Skyline at Night */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&h=1080&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4
        }} />

        {/* Dark overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.75) 0%, rgba(46, 125, 50, 0.35) 50%, rgba(0, 0, 0, 0.85) 100%)'
        }} />

        {/* Animated light particles */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(102, 187, 106, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite',
          filter: 'blur(60px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(76, 175, 80, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 10s ease-in-out infinite',
          animationDelay: '3s',
          filter: 'blur(50px)'
        }} />

        <div style={{
          maxWidth: 480,
          width: '100%',
          position: 'relative',
          zIndex: 10
        }}>
          {/* Animated Title */}
          <div style={{
            textAlign: 'center',
            marginBottom: 40
          }}>
            <h1 style={{
              fontSize: '42px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 50%, #81c784 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 10,
              textShadow: '0 0 30px rgba(102, 187, 106, 0.5)',
              letterSpacing: '-1px',
              animation: 'fadeInDown 1s ease-out'
            }}>
              المستقبل لإدارة المقاولات
            </h1>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '16px',
              animation: 'fadeInUp 1s ease-out',
              animationDelay: '0.2s',
              opacity: 0,
              animationFillMode: 'forwards'
            }}>
              نحو تحويل رقمي شامل في قطاع البناء
            </p>
          </div>

          <style>{`
            @keyframes fadeInDown {
              from {
                opacity: 0;
                transform: translateY(-30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            @keyframes float {
              0%, 100% {
                transform: translateY(0) translateX(0);
              }
              25% {
                transform: translateY(-20px) translateX(10px);
              }
              50% {
                transform: translateY(0) translateX(20px);
              }
              75% {
                transform: translateY(20px) translateX(10px);
              }
            }
            @keyframes shimmer {
              0% {
                background-position: -1000px 0;
              }
              100% {
                background-position: 1000px 0;
              }
            }
          `}</style>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(25px) saturate(180%)',
            WebkitBackdropFilter: 'blur(25px) saturate(180%)',
            borderRadius: 24,
            padding: 40,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Inner glow effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
            }} />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
            }} />
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#fff',
              marginBottom: 30,
              textAlign: 'center',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}>تسجيل الدخول</h2>

            {/* User Type Selector */}
            <div style={{
              display: 'flex',
              marginBottom: 30,
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 16,
              padding: 6,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <button
                type="button"
                onClick={() => setUserType('contractor')}
                style={{
                  flex: 1,
                  padding: '14px',
                  border: 'none',
                  borderRadius: 12,
                  background: userType === 'contractor' ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                  color: userType === 'contractor' ? BRAND.primary : '#fff',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: 16,
                  boxShadow: userType === 'contractor' ? '0 4px 15px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                مقاول
              </button>
              <button
                type="button"
                onClick={() => setUserType('client')}
                style={{
                  flex: 1,
                  padding: '14px',
                  border: 'none',
                  borderRadius: 12,
                  background: userType === 'client' ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                  color: userType === 'client' ? BRAND.primary : '#fff',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: 16,
                  boxShadow: userType === 'client' ? '0 4px 15px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                صاحب مشروع
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 8,
                  fontWeight: 600,
                  color: '#fff'
                }}>
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="أدخل بريدك الإلكتروني"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: errors.email ? '2px solid #ef5350' : '2px solid rgba(102, 187, 106, 0.3)',
                    borderRadius: 12,
                    fontSize: 16,
                    outline: 'none',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: '#fff',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(102, 187, 106, 0.8)';
                    e.target.style.boxShadow = `0 0 0 4px rgba(102, 187, 106, 0.15)`;
                    e.target.style.background = 'rgba(0, 0, 0, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email ? '#ef5350' : 'rgba(102, 187, 106, 0.3)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = 'rgba(0, 0, 0, 0.3)';
                  }}
                />
                {errors.email && (
                  <div style={{
                    color: '#e74c3c',
                    fontSize: 14,
                    marginTop: 8
                  }}>
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: 30 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 8,
                  fontWeight: 600,
                  color: '#fff'
                }}>
                  كلمة المرور
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="أدخل كلمة المرور"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: errors.password ? '2px solid #ef5350' : '2px solid rgba(102, 187, 106, 0.3)',
                      borderRadius: 12,
                      fontSize: 16,
                      outline: 'none',
                      background: 'rgba(0, 0, 0, 0.3)',
                      color: '#fff',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(102, 187, 106, 0.8)';
                      e.target.style.boxShadow = `0 0 0 4px rgba(102, 187, 106, 0.15)`;
                      e.target.style.background = 'rgba(0, 0, 0, 0.5)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.password ? '#ef5350' : 'rgba(102, 187, 106, 0.3)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.background = 'rgba(0, 0, 0, 0.3)';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      left: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: BRAND.muted,
                      fontSize: 18
                    }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && (
                  <div style={{
                    color: '#e74c3c',
                    fontSize: 14,
                    marginTop: 8
                  }}>
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: 'none',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 17,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(102, 187, 106, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  opacity: isLoading ? 0.7 : 1
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 35px rgba(102, 187, 106, 0.5)';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 187, 106, 0.4)';
                }}
              >
                {isLoading ? (
                  <span>جاري تسجيل الدخول...</span>
                ) : (
                  <span>تسجيل الدخول</span>
                )}
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                margin: '20px 0',
                position: 'relative'
              }}>
                <div style={{
                  flex: 1,
                  height: '1px',
                  background: 'rgba(255, 255, 255, 0.3)'
                }} />
                <span style={{
                  padding: '0 16px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: 14,
                  fontWeight: 600
                }}>أو</span>
                <div style={{
                  flex: 1,
                  height: '1px',
                  background: 'rgba(255, 255, 255, 0.3)'
                }} />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid rgba(102, 187, 106, 0.4)',
                  borderRadius: 12,
                  background: 'rgba(0, 0, 0, 0.3)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  backdropFilter: 'blur(10px)',
                  opacity: isLoading ? 0.6 : 1
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.target.style.background = 'rgba(102, 187, 106, 0.1)';
                    e.target.style.borderColor = 'rgba(102, 187, 106, 0.6)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 20px rgba(102, 187, 106, 0.3)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    e.target.style.background = 'rgba(0, 0, 0, 0.3)';
                    e.target.style.borderColor = 'rgba(102, 187, 106, 0.4)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isLoading ? 'جاري التحميل...' : 'تسجيل الدخول بحساب Google'}
              </button>
            </form>

            {/* Forgot Password */}
            <div style={{
              textAlign: 'center',
              marginTop: 24,
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              هل نسيت كلمة المرور؟{' '}
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#66bb6a',
                  textDecoration: 'none',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: 14,
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.color = '#81c784';
                  e.target.style.textDecoration = 'underline';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = '#66bb6a';
                  e.target.style.textDecoration = 'none';
                }}
              >
                إعادة تعيين كلمة المرور
              </button>
            </div>

            {/* Register Link */}
            <div style={{
              textAlign: 'center',
              marginTop: 16,
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              ليس لديك حساب؟{' '}
              <button
                type="button"
                onClick={() => navigate('/')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#66bb6a',
                  textDecoration: 'none',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: 14,
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.color = '#81c784';
                  e.target.style.textDecoration = 'underline';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = '#66bb6a';
                  e.target.style.textDecoration = 'none';
                }}
              >
                إنشاء حساب جديد
              </button>
            </div>

            {/* Back to Home */}
            <div style={{
              textAlign: 'center',
              marginTop: 20,
              paddingTop: 20,
              borderTop: '1px solid rgba(102, 187, 106, 0.1)'
            }}>
              <Link
                to="/"
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  textDecoration: 'none',
                  fontSize: 13,
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                onMouseOver={(e) => {
                  e.target.style.color = '#66bb6a';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = 'rgba(255, 255, 255, 0.5)';
                }}
              >
                ← العودة إلى الصفحة الرئيسية
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.3s'
        }}
        onClick={() => setShowForgotPassword(false)}
        >
          <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: 20,
            padding: 40,
            maxWidth: 450,
            width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            border: '2px solid rgba(102, 187, 106, 0.3)',
            animation: 'slideUp 0.3s'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              fontSize: 24,
              fontWeight: 700,
              color: BRAND.primary,
              marginBottom: 10,
              textAlign: 'center'
            }}>إعادة تعيين كلمة المرور</h3>
            
            <p style={{
              color: BRAND.muted,
              fontSize: 14,
              textAlign: 'center',
              marginBottom: 24
            }}>
              أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور
            </p>

            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              style={{
                width: '100%',
                padding: 14,
                border: '2px solid rgba(102, 187, 106, 0.3)',
                borderRadius: 12,
                fontSize: 15,
                outline: 'none',
                marginBottom: 20,
                background: '#fff',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(102, 187, 106, 0.7)';
                e.target.style.boxShadow = '0 0 0 4px rgba(102, 187, 106, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(102, 187, 106, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotEmail('');
                }}
                style={{
                  flex: 1,
                  padding: 14,
                  border: '2px solid #ddd',
                  borderRadius: 12,
                  background: '#fff',
                  color: BRAND.muted,
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#f5f5f5';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#fff';
                }}
              >
                إلغاء
              </button>
              
              <button
                onClick={handleForgotPassword}
                style={{
                  flex: 1,
                  padding: 14,
                  border: 'none',
                  borderRadius: 12,
                  background: BRAND.gradient,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(102, 187, 106, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 187, 106, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 187, 106, 0.3)';
                }}
              >
                إرسال
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
