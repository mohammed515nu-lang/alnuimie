import React, { useState, useEffect } from "react";
import { usersAPI, getUser } from "../../utils/api";
import { useNotifications } from "../../components/NotificationSystem";
import BRAND from "../../theme";

export default function ContractorProfile() {
  const notifications = useNotifications();
  const [form, setForm] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    profilePicture: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [originalForm, setOriginalForm] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const user = getUser();
        if (!user || (!user.id && !user._id)) {
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
          description: userData.description || userData.bio || '',
          profilePicture: userData.profilePicture || ''
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
        description: form.description,
        profilePicture: form.profilePicture
      };

      await usersAPI.update(user.id || user._id, updateData);


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
      <div style={{ textAlign: 'center', padding: '100px 20px', direction: 'rtl', fontFamily: '"Outfit", "Cairo", sans-serif' }}>
        <div style={{ fontSize: 60, animation: 'spin 2s linear infinite' }}>⏳</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginTop: 20, color: BRAND.primary }}>جاري مزامنة بيانات الملف الشخصي...</div>
      </div>
    );
  }

  return (
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
