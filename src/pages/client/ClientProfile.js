import React, { useState, useEffect } from "react";
import { usersAPI, getUser } from "../../utils/api";
import { useNotifications } from "../../components/NotificationSystem";

const BRAND = {
  primary: '#4caf50',
  accent: '#66bb6a',
  secondary: '#388e3c',
  gradient: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
  gradientLight: 'linear-gradient(135deg, #388e3c 0%, #4caf50 50%, #66bb6a 100%)',
  light: '#f8fafc',
  dark: '#2e7d32',
  muted: '#6c757d',
};

export default function ClientProfile() {
  const notifications = useNotifications();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [originalForm, setOriginalForm] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const user = getUser();
        if (!user || !user.id) {
          notifications.error('خطأ', 'يرجى تسجيل الدخول أولاً');
          setIsLoading(false);
          return;
        }

        const userData = await usersAPI.getById(user.id || user._id);
        const profileData = {
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || ''
        };
        
        setForm(profileData);
        setOriginalForm(profileData);
      } catch (err) {
        console.error('Error loading profile:', err);
        notifications.error('خطأ', 'فشل تحميل بيانات الملف الشخصي');
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [notifications]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    if (!form.name || !form.email) {
      notifications.warning('تحذير', 'يرجى ملء الحقول المطلوبة (الاسم والبريد الإلكتروني)');
      return;
    }

    setIsSaving(true);
    try {
      const user = getUser();
      const updateData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address
      };

      await usersAPI.update(user.id || user._id, updateData);
      
      // Update local storage
      const updatedUser = { ...user, ...updateData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setOriginalForm({ ...form });
      notifications.success('نجح', 'تم حفظ بيانات الملف الشخصي بنجاح');
    } catch (err) {
      console.error('Error saving profile:', err);
      notifications.error('خطأ', err.message || 'فشل حفظ بيانات الملف الشخصي');
    } finally {
      setIsSaving(false);
    }
  };

  const cancel = () => {
    if (originalForm) {
      setForm({ ...originalForm });
      notifications.info('معلومات', 'تم إلغاء التعديلات');
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        direction: 'rtl', 
        fontFamily: 'Cairo, system-ui, Arial',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>⏳</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: BRAND.muted }}>جاري تحميل البيانات...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Cairo, system-ui, Arial' }}>
      {/* Header with Profile Picture */}
      <div style={{
        background: BRAND.gradientLight,
        borderRadius: 24,
        padding: 40,
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(76, 175, 80, 0.2)'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(40px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          filter: 'blur(30px)'
        }} />
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Profile Picture */}
          <div style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fff 0%, #f1f5f9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            fontWeight: 700,
            color: BRAND.primary,
            border: '4px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
            flexShrink: 0
          }}>
            {form.name ? form.name.charAt(0).toUpperCase() : '👤'}
          </div>
          
          <div style={{ flex: 1, minWidth: 250 }}>
            <h2 style={{
              fontWeight: 900,
              color: '#fff',
              fontSize: 36,
              margin: '0 0 8px 0',
              letterSpacing: '-1px',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
            }}>
              {form.name || 'الملف الشخصي'}
            </h2>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              fontSize: 16, 
              margin: '0 0 12px 0',
              fontWeight: 600
            }}>
              عميل · {form.email || 'لم يتم تحديد البريد الإلكتروني'}
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {form.phone && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  padding: '8px 16px',
                  borderRadius: 12,
                  fontSize: 14,
                  color: '#fff',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  📱 {form.phone}
                </div>
              )}
              {form.address && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  padding: '8px 16px',
                  borderRadius: 12,
                  fontSize: 14,
                  color: '#fff',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  📍 {form.address}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={cancel}
              disabled={!originalForm}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 14,
                padding: '14px 28px',
                fontWeight: 700,
                fontSize: 15,
                cursor: originalForm ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                opacity: originalForm ? 1 : 0.5
              }}
              onMouseOver={e => {
                if (originalForm) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseOut={e => {
                if (originalForm) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              إلغاء
            </button>
            <button
              onClick={saveProfile}
              disabled={isSaving}
              style={{
                background: '#fff',
                color: BRAND.primary,
                border: 'none',
                borderRadius: 14,
                padding: '14px 32px',
                fontWeight: 700,
                fontSize: 15,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
                opacity: isSaving ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
              onMouseOver={e => {
                if (!isSaving) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2)';
                }
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.15)';
              }}
            >
              {isSaving ? '⏳ جاري الحفظ...' : '✓ حفظ التغييرات'}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div style={{
        background: '#ffffff',
        borderRadius: 24,
        boxShadow: '0 4px 20px rgba(76, 175, 80, 0.08)',
        padding: 40,
        border: '2px solid rgba(102, 187, 106, 0.1)'
      }}>
        <h3 style={{
          fontSize: 22,
          fontWeight: 800,
          color: BRAND.primary,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <span style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: BRAND.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20
          }}>📝</span>
          معلومات الحساب
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
          gap: 24
        }}>
          <div>
            <label style={{
              display: 'block',
              color: BRAND.dark,
              marginBottom: 8,
              fontWeight: 600,
              fontSize: 14
            }}>
              الاسم الكامل <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="اسمك الكامل"
              style={{
                width: '100%',
                padding: 14,
                border: '2px solid #e5e7eb',
                borderRadius: 12,
                background: BRAND.light,
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={e => {
                e.target.style.borderColor = BRAND.accent;
                e.target.style.background = '#fff';
                e.target.style.boxShadow = '0 0 0 4px rgba(102, 187, 106, 0.1)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.background = BRAND.light;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              color: BRAND.dark,
              marginBottom: 8,
              fontWeight: 600,
              fontSize: 14
            }}>
              البريد الإلكتروني <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="example@mail.com"
              style={{
                width: '100%',
                padding: 14,
                border: '2px solid #e5e7eb',
                borderRadius: 12,
                background: BRAND.light,
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={e => {
                e.target.style.borderColor = BRAND.accent;
                e.target.style.background = '#fff';
                e.target.style.boxShadow = '0 0 0 4px rgba(102, 187, 106, 0.1)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.background = BRAND.light;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              color: BRAND.dark,
              marginBottom: 8,
              fontWeight: 600,
              fontSize: 14
            }}>
              رقم الهاتف
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="05xxxxxxxx"
              style={{
                width: '100%',
                padding: 14,
                border: '2px solid #e5e7eb',
                borderRadius: 12,
                background: BRAND.light,
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={e => {
                e.target.style.borderColor = BRAND.accent;
                e.target.style.background = '#fff';
                e.target.style.boxShadow = '0 0 0 4px rgba(102, 187, 106, 0.1)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.background = BRAND.light;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              color: BRAND.dark,
              marginBottom: 8,
              fontWeight: 600,
              fontSize: 14
            }}>
              العنوان
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="العنوان الكامل"
              style={{
                width: '100%',
                padding: 14,
                border: '2px solid #e5e7eb',
                borderRadius: 12,
                background: BRAND.light,
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={e => {
                e.target.style.borderColor = BRAND.accent;
                e.target.style.background = '#fff';
                e.target.style.boxShadow = '0 0 0 4px rgba(102, 187, 106, 0.1)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.background = BRAND.light;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}





