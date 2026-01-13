import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function TrainingRegistrationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const selectedCourseId = query.get('courseId') || '';
  const isCustomRequest = query.get('custom') === 'true';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: 'beginner',
    company: '',
    preferredCourse: selectedCourseId,
    preferredStart: '',
    participants: '1-5',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('✅ تم استلام طلب التسجيل وسيتم التواصل معك خلال 24 ساعة.');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        experience: 'beginner',
        company: '',
        preferredCourse: selectedCourseId,
        preferredStart: '',
        participants: '1-5',
        notes: ''
      });
    }, 1200);
  };

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
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => navigate('/training')}
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
              ← العودة إلى الدورات
            </button>
            <div style={{ color: '#fef3c7', fontSize: '20px', fontWeight: 700 }}>
              نموذج التسجيل التدريبي
            </div>
          </div>
          <div style={{ color: 'rgba(248,250,252,0.7)', fontSize: '14px' }}>
            {isCustomRequest ? 'طلب برنامج تدريبي مخصّص' : 'الرجاء تعبئة بياناتك للانضمام للدورة المختارة'}
          </div>
        </div>
      </header>

      <section style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(3,7,18,0.95) 60%)',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '34px', color: '#fef3c7', marginBottom: '18px', fontWeight: 800 }}>
            {isCustomRequest ? 'اطلب برنامجك التدريبي الخاص' : 'أكمل بيانات التسجيل للدورة'}
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(248,250,252,0.78)', lineHeight: 1.8 }}>
            {isCustomRequest
              ? 'سنقوم بتصميم محتوى تدريبي يتناسب مع احتياجات فريقك وعدد المشاركين والمدة المناسبة لكم.'
              : 'أدخل بياناتك الشخصية وسيتواصل فريقنا معك لتأكيد التفاصيل والدفع خلال 24 ساعة.'}
          </p>
        </div>
      </section>

      <section style={{ padding: '50px 20px' }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '35px'
        }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderRadius: '24px',
            padding: '30px',
            boxShadow: '0 25px 45px rgba(2,6,23,0.6)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <h2 style={{ fontSize: '22px', marginBottom: '20px', color: '#fef3c7' }}>
              بيانات المتدرب
            </h2>

            {successMessage && (
              <div style={{
                backgroundColor: 'rgba(34,197,94,0.15)',
                border: '1px solid rgba(34,197,94,0.3)',
                color: '#bbf7d0',
                padding: '14px',
                borderRadius: '12px',
                marginBottom: '18px',
                textAlign: 'center'
              }}>
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e2e8f0', fontWeight: 500 }}>
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e2e8f0', fontWeight: 500 }}>
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e2e8f0', fontWeight: 500 }}>
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '18px' }}>
                <div>
                  <label style={labelStyle}>مستوى الخبرة</label>
                  <select name="experience" value={formData.experience} onChange={handleInputChange} style={inputStyle}>
                    <option value="beginner">مبتدئ</option>
                    <option value="intermediate">متوسط</option>
                    <option value="advanced">متقدم</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>عدد المشاركين</label>
                  <select name="participants" value={formData.participants} onChange={handleInputChange} style={inputStyle}>
                    <option value="1-5">1-5</option>
                    <option value="6-15">6-15</option>
                    <option value="16-30">16-30</option>
                    <option value=">30">أكثر من 30</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>الشركة / الجهة</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="اختياري"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>رقم الدورة أو اسمها</label>
                <input
                  type="text"
                  name="preferredCourse"
                  value={formData.preferredCourse}
                  onChange={handleInputChange}
                  placeholder={isCustomRequest ? 'اكتب تفاصيل الدورة المطلوبة' : 'مثال: دورة إدارة المشاريع 1'}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>تاريخ البدء المفضل</label>
                <input
                  type="date"
                  name="preferredStart"
                  value={formData.preferredStart}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>ملاحظات إضافية</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="اذكر أهدافك التدريبية أو أي متطلبات خاصة"
                />
              </div>

              <button type="submit" disabled={isSubmitting} style={{
                background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                color: '#f0f9ff',
                border: 'none',
                padding: '12px 25px',
                borderRadius: '999px',
                fontWeight: '700',
                fontSize: '16px',
                cursor: 'pointer',
                width: '100%',
                boxShadow: '0 18px 35px rgba(14,165,233,0.35)',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'opacity 0.3s ease'
              }}>
                {isSubmitting ? '...جاري إرسال الطلب' : 'تأكيد التسجيل'}
              </button>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 25px 45px rgba(2,6,23,0.6)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <h3 style={{ color: '#fef3c7', marginBottom: '15px' }}>ماذا يشمل التسجيل؟</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'rgba(248,250,252,0.8)', lineHeight: 1.8 }}>
                <li>✔️ متابعة شخصية من منسق التدريب</li>
                <li>✔️ جدول زمني مفصل وجلسات مباشرة</li>
                <li>✔️ شهادة حضور معتمدة من المستقبل لإدارة المقاولات</li>
                <li>✔️ مواد تدريبية رقمية وتسجيلات الجلسات</li>
              </ul>
            </div>

            <div style={{
              backgroundColor: 'rgba(15,23,42,0.8)',
              borderRadius: '24px',
              padding: '28px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <h3 style={{ color: '#7dd3fc', marginBottom: '14px' }}>تحتاج مساعدة؟</h3>
              <p style={{ color: 'rgba(248,250,252,0.78)', marginBottom: '12px' }}>
                راسل فريق التدريب عبر البريد: <strong>training@muqawil.org</strong>
              </p>
              <p style={{ color: 'rgba(248,250,252,0.78)', marginBottom: '12px' }}>
                أو تحدث مع منسق التدريب على الرقم: <strong>+963 11 555 6667</strong>
              </p>
              <button onClick={() => navigate('/training')} style={{
                background: 'transparent',
                border: '1px dashed rgba(255,255,255,0.3)',
                padding: '10px 18px',
                borderRadius: '20px',
                color: '#fdf7f2',
                cursor: 'pointer'
              }}>
                العودة إلى قائمة الدورات
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.15)',
  backgroundColor: 'rgba(15,23,42,0.65)',
  color: '#f8fafc',
  fontSize: '15px'
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  color: '#e2e8f0',
  fontWeight: 500
};
