import React, { useState, useEffect } from "react";
import { usersAPI, getUser } from "../../utils/api";
import { useNotifications } from "../../components/NotificationSystem";
<<<<<<< HEAD
import BRAND from "../../theme";
=======

const BRAND = {
  primary: '#1e3a5f',
  accent: '#2a9d8f',
  secondary: '#264653',
  gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2a9d8f 50%, #264653 100%)',
  gradientLight: 'linear-gradient(135deg, #1e3a5f 0%, #2a9d8f 50%, #264653 100%)',
  light: '#f8fafc',
  dark: '#0f172a',
  muted: '#64748b',
};
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc

export default function ContractorProfile() {
  const notifications = useNotifications();
  const [form, setForm] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
<<<<<<< HEAD
    description: '',
    profilePicture: ''
  });

=======
    description: ''
  });
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [originalForm, setOriginalForm] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const user = getUser();
<<<<<<< HEAD
        if (!user || (!user.id && !user._id)) {
=======
        if (!user || !user.id) {
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
          notifications.error('خطأ', 'يرجى تسجيل الدخول أولاً');
          setIsLoading(false);
          return;
        }

        const userData = await usersAPI.getById(user.id || user._id);
        const profileData = {
          name: userData.name || '',
          companyName: userData.companyName || userData.company || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          website: userData.website || '',
<<<<<<< HEAD
          description: userData.description || userData.bio || '',
          profilePicture: userData.profilePicture || ''
        };


=======
          description: userData.description || userData.bio || ''
        };
        
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
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

<<<<<<< HEAD
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        notifications.error('خطأ', 'حجم الصورة كبير جداً (الحد الأقصى 2 ميجابايت)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {

=======
  const saveProfile = async () => {
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    if (!form.name || !form.email) {
      notifications.warning('تحذير', 'يرجى ملء الحقول المطلوبة (الاسم والبريد الإلكتروني)');
      return;
    }

    setIsSaving(true);
    try {
      const user = getUser();
      const updateData = {
        name: form.name,
        companyName: form.companyName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        website: form.website,
<<<<<<< HEAD
        description: form.description,
        profilePicture: form.profilePicture
      };

      await usersAPI.update(user.id || user._id, updateData);


      const updatedUser = { ...user, ...updateData };
      localStorage.setItem('user', JSON.stringify(updatedUser));

=======
        description: form.description
      };

      await usersAPI.update(user.id || user._id, updateData);
      
      // Update local storage
      const updatedUser = { ...user, ...updateData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
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
<<<<<<< HEAD
      <div style={{ textAlign: 'center', padding: '100px 20px', direction: 'rtl', fontFamily: '"Outfit", "Cairo", sans-serif' }}>
        <div style={{ fontSize: 60, animation: 'spin 2s linear infinite' }}>⏳</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginTop: 20, color: BRAND.primary }}>جاري مزامنة بيانات الملف الشخصي...</div>
=======
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
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div style={{
      direction: 'rtl',
      fontFamily: '"Outfit", "Cairo", sans-serif',
      minHeight: '100vh',
      paddingBottom: 60
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Cairo:wght@400;600;700;900&display=swap');
        
        .glass-panel {
          background: ${BRAND.glass.background};
          backdrop-filter: ${BRAND.glass.blur};
          border: ${BRAND.glass.border};
          box-shadow: ${BRAND.glass.shadow};
          border-radius: 30px;
        }


        .input-glass {
           background: ${BRAND.background};
           color: ${BRAND.text};
           border: 2px solid ${BRAND.border || 'rgba(226, 232, 240, 0.8)'};
           padding: 16px 20px;
           border-radius: 16px;
           outline: none;
           width: 100%;
           transition: all 0.3s;
           font-family: inherit;
           font-weight: 500;
        }
        .input-glass:focus {
           background: ${BRAND.card};
           border-color: ${BRAND.accent};
           transform: translateY(-2px);
           box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }


        .avatar-container {
           width: 120px;
           height: 120px;
           border-radius: 40px;
           background: ${BRAND.gradient};
           display: flex;
           align-items: center;
           justifyContent: center;
           font-size: 48px;
           color: #fff;
           box-shadow: 0 15px 35px rgba(30,58,95,0.2);
           border: 4px solid ${BRAND.card};
        }


        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

      {/* Background Decor */}
      <div style={{ position: 'fixed', inset: 0, background: BRAND.background, zIndex: -2 }} />
      <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(30, 58, 95, 0.03) 0%, transparent 60%)', filter: 'blur(50px)', zIndex: -1 }} />


      {/* Profile Header Card */}
      <div className="glass-panel" style={{
        margin: '24px',
        padding: '48px',
        display: 'flex',
        alignItems: 'center',
        gap: 40,
        flexWrap: 'wrap',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -20, left: -20, width: 150, height: 150, background: BRAND.gradient, opacity: 0.05, borderRadius: '50%', filter: 'blur(40px)' }} />

        <div className="avatar-container" style={{ animation: 'float 5s ease-in-out infinite' }}>
          {form.profilePicture ? (
            <img
              src={form.profilePicture}
              alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            form.name ? form.name.charAt(0).toUpperCase() : '👤'
          )}
          <label style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            background: BRAND.accent,
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '3px solid #fff',
            fontSize: 18,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}>
            📷
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ background: BRAND.accent, color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800 }}>حساب مقاول معتمد</span>
            <span style={{ fontSize: 16 }}>✨</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 36, fontWeight: 900, color: BRAND.primary }}>{form.companyName || form.name}</h1>
          <p style={{ margin: '8px 0 0', color: BRAND.muted, fontSize: 16 }}>{form.description || 'لم يتم تعيين وصف للشركة بعد...'}</p>
        </div>

        <div style={{ display: 'flex', gap: 14 }}>
          <button onClick={cancel} style={{ background: 'rgba(255,255,255,0.8)', color: BRAND.primary, border: '1px solid rgba(0,0,0,0.05)', padding: '14px 28px', borderRadius: 18, fontWeight: 700, cursor: 'pointer' }}>إلغاء</button>
          <button onClick={saveProfile} disabled={isSaving} style={{ background: BRAND.gradient, color: '#fff', border: 'none', padding: '14px 40px', borderRadius: 18, fontWeight: 900, cursor: 'pointer', boxShadow: BRAND.shadows.accent }}>
            {isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </button>
        </div>
      </div>

      {/* Profile Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, padding: '0 24px' }}>

        {/* Essential Identity */}
        <div className="glass-panel" style={{ padding: 40 }}>
          <h3 style={{ margin: '0 0 24px', color: BRAND.primary, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>👤</span> الهوية الرقمية
          </h3>
          <div style={{ display: 'grid', gap: 24 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, display: 'block' }}>الاسم الكامل للمسؤول</label>
              <input type="text" name="name" value={form.name} className="input-glass" onChange={handleChange} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, display: 'block' }}>البريد الإلكتروني الأساسي</label>
              <input type="email" name="email" value={form.email} className="input-glass" onChange={handleChange} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, display: 'block' }}>المسمى التجاري للشركة</label>
              <input type="text" name="companyName" value={form.companyName} className="input-glass" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Professional Presence */}
        <div className="glass-panel" style={{ padding: 40 }}>
          <h3 style={{ margin: '0 0 24px', color: BRAND.primary, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>🌐</span> التواصل والموقع
          </h3>
          <div style={{ display: 'grid', gap: 24 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, display: 'block' }}>رقم التواصل المعتمد</label>
              <input type="tel" name="phone" value={form.phone} className="input-glass" onChange={handleChange} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, display: 'block' }}>الموقع الجغرافي / المكتب</label>
              <input type="text" name="address" value={form.address} className="input-glass" onChange={handleChange} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, display: 'block' }}>الموقع الإلكتروني الرسمي</label>
              <input type="url" name="website" value={form.website} className="input-glass" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Bio / About */}
        <div className="glass-panel" style={{ padding: 40, gridColumn: '1 / -1' }}>
          <h3 style={{ margin: '0 0 24px', color: BRAND.primary, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>📝</span> نبذة عن النشاط التجاري
          </h3>
          <textarea name="description" value={form.description} className="input-glass" style={{ minHeight: 120 }} onChange={handleChange} placeholder="اكتب وصفاً موجزاً عن تخصصات الشركة وخدماتها..." />
        </div>

      </div>

    </div>
  );
}
=======
    <div style={{ 
      direction: 'rtl', 
      fontFamily: 'Cairo, system-ui, Arial',
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f3f4f6 0%, #e5e7eb 100%)',
      padding: '32px'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .profile-card {
          animation: fadeIn 0.6s ease-out;
        }
        .profile-header {
          animation: slideIn 0.8s ease-out;
        }
      `}</style>

      {/* Header with Profile Picture */}
      <div className="profile-header" style={{
        background: BRAND.gradientLight,
        borderRadius: 30,
        padding: '50px 40px',
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 15px 50px rgba(30, 64, 175, 0.25)'
      }}>
        {/* Decorative circles with animation */}
        <div style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '1s'
        }} />
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 32,
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Profile Picture with Glow */}
          <div style={{
            position: 'relative',
            flexShrink: 0
          }}>
            <div style={{
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 56,
              fontWeight: 900,
              color: BRAND.primary,
              border: '5px solid rgba(255, 255, 255, 0.6)',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2), 0 0 0 10px rgba(255, 255, 255, 0.1)',
              position: 'relative',
              zIndex: 2
            }}>
              {form.companyName ? form.companyName.charAt(0).toUpperCase() : (form.name ? form.name.charAt(0).toUpperCase() : '🏗️')}
            </div>
            {/* Glow ring */}
            <div style={{
              position: 'absolute',
              top: -10,
              left: -10,
              right: -10,
              bottom: -10,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1))',
              filter: 'blur(15px)',
              zIndex: 1,
              animation: 'float 4s ease-in-out infinite'
            }} />
          </div>
          
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(10px)',
              padding: '6px 16px',
              borderRadius: 20,
              fontSize: 13,
              color: '#fff',
              fontWeight: 700,
              marginBottom: 12,
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              🏗️ مقاول محترف
            </div>
            <h2 style={{
              fontWeight: 900,
              color: '#fff',
              fontSize: 42,
              margin: '0 0 12px 0',
              letterSpacing: '-1.5px',
              textShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
              lineHeight: 1.2
            }}>
              {form.companyName || form.name || 'الملف الشخصي'}
            </h2>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.95)', 
              fontSize: 17, 
              margin: '0 0 20px 0',
              fontWeight: 600
            }}>
              {form.email || 'لم يتم تحديد البريد الإلكتروني'}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {form.phone && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  padding: '10px 18px',
                  borderRadius: 14,
                  fontSize: 15,
                  color: '#fff',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}>
                  📱 {form.phone}
                </div>
              )}
              {form.website && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  padding: '10px 18px',
                  borderRadius: 14,
                  fontSize: 15,
                  color: '#fff',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}>
                  🌐 {form.website.replace(/^https?:\/\//, '')}
                </div>
              )}
              {form.address && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  padding: '10px 18px',
                  borderRadius: 14,
                  fontSize: 15,
                  color: '#fff',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}>
                  📍 {form.address}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button
              onClick={cancel}
              disabled={!originalForm}
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                borderRadius: 16,
                padding: '16px 32px',
                fontWeight: 800,
                fontSize: 16,
                cursor: originalForm ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                opacity: originalForm ? 1 : 0.5,
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
              }}
              onMouseOver={e => {
                if (originalForm) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                }
              }}
              onMouseOut={e => {
                if (originalForm) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
                }
              }}
            >
              ✕ إلغاء
            </button>
            <button
              onClick={saveProfile}
              disabled={isSaving}
              style={{
                background: '#fff',
                color: BRAND.primary,
                border: 'none',
                borderRadius: 16,
                padding: '16px 40px',
                fontWeight: 800,
                fontSize: 16,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                opacity: isSaving ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
              onMouseOver={e => {
                if (!isSaving) {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.25)';
                }
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2)';
              }}
            >
              {isSaving ? '⏳ جاري الحفظ...' : '✓ حفظ التغييرات'}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="profile-card" style={{
        background: '#ffffff',
        borderRadius: 30,
        boxShadow: '0 8px 35px rgba(30, 64, 175, 0.15)',
        padding: 50,
        border: '1px solid rgba(30, 64, 175, 0.08)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 36,
          paddingBottom: 24,
          borderBottom: '2px solid rgba(76, 175, 80, 0.1)'
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: BRAND.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)'
          }}>📝</div>
          <div>
            <h3 style={{
              fontSize: 26,
              fontWeight: 900,
              color: BRAND.primary,
              margin: 0,
              letterSpacing: '-0.5px'
            }}>
              معلومات الشركة والحساب
            </h3>
            <p style={{
              fontSize: 14,
              color: BRAND.muted,
              margin: '4px 0 0 0',
              fontWeight: 600
            }}>
              قم بتحديث معلومات ملفك الشخصي هنا
            </p>
          </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
          gap: 28
        }}>
          <div>
            <label style={{
              display: 'block',
              color: BRAND.dark,
              marginBottom: 10,
              fontWeight: 700,
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span>👤</span>
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
                padding: '16px 18px',
                border: '2px solid #e5e7eb',
                borderRadius: 16,
                background: BRAND.light,
                fontSize: 16,
                outline: 'none',
                transition: 'all 0.3s ease',
                fontWeight: 600
              }}
              onFocus={e => {
                e.target.style.borderColor = BRAND.accent;
                e.target.style.background = '#fff';
                e.target.style.boxShadow = '0 0 0 6px rgba(102, 187, 106, 0.12)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.background = BRAND.light;
                e.target.style.boxShadow = 'none';
                e.target.style.transform = 'none';
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
              اسم الشركة
            </label>
            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              placeholder="شركة المقاولات"
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
              placeholder="company@mail.com"
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
          <div>
            <label style={{
              display: 'block',
              color: BRAND.dark,
              marginBottom: 8,
              fontWeight: 600,
              fontSize: 14
            }}>
              الموقع الإلكتروني
            </label>
            <input
              type="url"
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://example.com"
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
        
        <div style={{ marginTop: 24 }}>
          <label style={{
            display: 'block',
            color: BRAND.dark,
            marginBottom: 8,
            fontWeight: 600,
            fontSize: 14
          }}>
            وصف الشركة
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="وصف مختصر عن الشركة..."
            rows={4}
            style={{
              width: '100%',
              padding: 14,
              border: '2px solid #e5e7eb',
              borderRadius: 12,
              background: BRAND.light,
              fontSize: 15,
              outline: 'none',
              transition: 'all 0.3s ease',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            onFocus={e => {
              e.target.style.borderColor = BRAND.accent;
              e.target.style.background = '#fff';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.background = BRAND.light;
            }}
          />
        </div>
      </div>
    </div>
  );
}


>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
