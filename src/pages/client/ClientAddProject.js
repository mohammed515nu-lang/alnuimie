import React, { useState, useEffect } from "react";
import { requestsAPI, usersAPI, getUser } from "../../utils/api";
import { useNotifications } from "../../components/NotificationSystem";
<<<<<<< HEAD
import BRAND from "../../theme";

=======

const BRAND = {
  primary: '#1e3a5f',
  accent: '#2a9d8f',
  gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2a9d8f 50%, #264653 100%)',
  light: '#f8fafc',
  dark: '#0f172a',
  muted: '#64748b',
};
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc

export default function ClientAddProject() {
  const notifications = useNotifications();
  const [form, setForm] = useState({
    name: "",
    details: "",
    budget: "",
    location: "",
    expectedDate: "",
    contractor: ""
  });
  const [contractors, setContractors] = useState([]);
  const [isLoadingContractors, setIsLoadingContractors] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // ملء حقل المقاول تلقائياً من contractorId في URL أو localStorage
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const contractorIdFromUrl = params.get('contractorId');
      const contractorIdFromStorage = localStorage.getItem('postLoginContractorId');
      const chosen = contractorIdFromUrl || contractorIdFromStorage;
      if (chosen) {
        setForm(prev => ({ ...prev, contractor: chosen }));
      }
    } catch (e) {
      // تجاهل أي خطأ في قراءة URL
    }
  }, []);

  useEffect(() => {
    const fetchContractors = async () => {
      setIsLoadingContractors(true);
      try {
        const contractorsData = await usersAPI.getAll({ role: 'contractor' });
        setContractors(contractorsData || []);
      } catch (err) {
        console.error('Error fetching contractors:', err);
        notifications.error('خطأ', 'فشل في جلب قائمة المقاولين');
      } finally {
        setIsLoadingContractors(false);
      }
    };
    fetchContractors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'اسم المشروع مطلوب';
    if (!form.contractor) newErrors.contractor = 'يرجى اختيار المقاول';
    if (!form.budget || parseFloat(form.budget) <= 0) {
      newErrors.budget = 'الميزانية يجب أن تكون أكبر من صفر';
    }
    if (!form.details.trim()) newErrors.details = 'التفاصيل مطلوبة';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    if (!validate()) {
      notifications.warning('تحذير', 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح');
      return;
    }
<<<<<<< HEAD

=======
    
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
    setIsSubmitting(true);
    try {
      const user = getUser();
      if (!user || (!user.id && !user._id)) {
        notifications.error('خطأ', 'يرجى تسجيل الدخول أولاً');
        setIsSubmitting(false);
        return;
      }

      const requestData = {
        title: form.name,
        description: form.details,
        budget: form.budget ? parseFloat(form.budget) : undefined,
        location: form.location || undefined,
        expectedDate: form.expectedDate ? new Date(form.expectedDate) : undefined,
        client: user.id || user._id,
        contractor: form.contractor || undefined, // ObjectId للمقاول المختار
        priority: 'medium',
        status: 'pending'
      };

      console.log('📤 إرسال طلب مشروع:', requestData);
      const result = await requestsAPI.create(requestData);
      console.log('✅ تم إرسال الطلب:', result);
<<<<<<< HEAD

=======
      
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
      notifications.success('نجح', `تم إرسال طلب المشروع "${form.name}" بنجاح! سيتم مراجعته من قبل المتعاقد.`);
      setForm({ name: "", details: "", budget: "", location: "", expectedDate: "", contractor: "" });
    } catch (error) {
      notifications.error('خطأ', error.message || 'حدث خطأ أثناء إرسال الطلب');
      console.error('Error submitting request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Cairo, system-ui, Arial' }}>
      {/* Header */}
      <div style={{ marginBottom: 30 }}>
        <h2 style={{
          fontWeight: 900,
          color: BRAND.primary,
          fontSize: 32,
          margin: '0 0 8px 0',
          letterSpacing: '-1px'
        }}>
          إضافة مشروع (طلب للمتعاقد)
        </h2>
        <p style={{ color: BRAND.muted, fontSize: 15, margin: 0 }}>
          إرسال طلب مشروع جديد للمتعاقدين للمراجعة والموافقة
        </p>
      </div>

      {/* Form */}
      <div style={{
<<<<<<< HEAD
        background: BRAND.card,
        color: BRAND.text,
        borderRadius: 20,
        boxShadow: BRAND.shadows.lg,
        padding: 32,
        border: `1px solid ${BRAND.border || 'rgba(30,58,95,0.05)'}`
      }}>

=======
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 4px 20px rgba(30,58,95,0.08)',
        padding: 32,
        border: '1px solid rgba(30,58,95,0.05)'
      }}>
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 28,
          paddingBottom: 20,
          borderBottom: '2px solid ' + BRAND.light
        }}>
          <div style={{
            width: 50,
            height: 50,
            borderRadius: 14,
            background: BRAND.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24
          }}>
            ➕
          </div>
          <div>
            <h3 style={{
              margin: 0,
              color: BRAND.primary,
              fontSize: 22,
              fontWeight: 800
            }}>
              معلومات المشروع
            </h3>
            <p style={{
              margin: '4px 0 0 0',
              color: BRAND.muted,
              fontSize: 13
            }}>
              املأ جميع الحقول المطلوبة
            </p>
          </div>
        </div>

        <form onSubmit={submitRequest} style={{ display: 'grid', gap: 20 }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: 8,
              color: BRAND.dark,
              fontWeight: 600,
              fontSize: 14
            }}>
              اسم المشروع *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleInput}
              required
              placeholder="مثال: برج إداري"
              style={{
                width: '100%',
                padding: 14,
<<<<<<< HEAD
                border: `2px solid ${errors.name ? '#ef4444' : (BRAND.border || '#e5e7eb')}`,
=======
                border: `2px solid ${errors.name ? '#ef4444' : '#e5e7eb'}`,
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
                borderRadius: 12,
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.3s ease',
<<<<<<< HEAD
                background: BRAND.background,
                color: BRAND.text
              }}
              onFocus={e => {
                e.target.style.borderColor = BRAND.accent;
                e.target.style.background = BRAND.card;
              }}
              onBlur={e => {
                e.target.style.borderColor = errors.name ? '#ef4444' : (BRAND.border || '#e5e7eb');
                e.target.style.background = BRAND.background;
              }}
            />

=======
                background: BRAND.light
              }}
              onFocus={e => {
                e.target.style.borderColor = BRAND.accent;
                e.target.style.background = '#fff';
              }}
              onBlur={e => {
                e.target.style.borderColor = errors.name ? '#ef4444' : '#e5e7eb';
                e.target.style.background = BRAND.light;
              }}
            />
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
            {errors.name && (
              <div style={{ color: '#ef4444', fontSize: 12, marginTop: 6 }}>
                {errors.name}
              </div>
            )}
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: 8,
              color: BRAND.dark,
              fontWeight: 600,
              fontSize: 14
            }}>
              اختر المقاول *
            </label>
            <select
              name="contractor"
              value={form.contractor}
              onChange={handleInput}
              required
              style={{
                width: '100%',
                padding: 14,
<<<<<<< HEAD
                border: `2px solid ${errors.contractor ? '#ef4444' : (BRAND.border || '#e5e7eb')}`,
=======
                border: `2px solid ${errors.contractor ? '#ef4444' : '#e5e7eb'}`,
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
                borderRadius: 12,
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.3s ease',
<<<<<<< HEAD
                background: BRAND.background,
                color: BRAND.text
              }}
              onFocus={e => {
                e.target.style.borderColor = BRAND.accent;
                e.target.style.background = BRAND.card;
              }}
              onBlur={e => {
                e.target.style.borderColor = errors.contractor ? '#ef4444' : (BRAND.border || '#e5e7eb');
                e.target.style.background = BRAND.background;
              }}
            >

=======
                background: BRAND.light
              }}
              onFocus={e => {
                e.target.style.borderColor = BRAND.accent;
                e.target.style.background = '#fff';
              }}
              onBlur={e => {
                e.target.style.borderColor = errors.contractor ? '#ef4444' : '#e5e7eb';
                e.target.style.background = BRAND.light;
              }}
            >
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
              <option value="">اختر المقاول</option>
              {isLoadingContractors ? (
                <option value="" disabled>جاري تحميل المقاولين...</option>
              ) : contractors.length === 0 ? (
                <option value="" disabled>لا توجد مقاولين متاحين</option>
              ) : (
                contractors.map(c => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.name} {c.companyName ? `- ${c.companyName}` : ''} {c.email ? `(${c.email})` : ''}
                  </option>
                ))
              )}
            </select>
            {errors.contractor && (
              <div style={{ color: '#ef4444', fontSize: 12, marginTop: 6 }}>
                {errors.contractor}
              </div>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 20
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: 8,
                color: BRAND.dark,
                fontWeight: 600,
                fontSize: 14
              }}>
                الميزانية المتوقعة ($) *
              </label>
              <input
                name="budget"
                type="number"
                min="0"
                step="0.01"
                value={form.budget}
                onChange={handleInput}
                required
                placeholder="50000"
                style={{
                  width: '100%',
                  padding: 14,
<<<<<<< HEAD
                  border: `2px solid ${errors.budget ? '#ef4444' : (BRAND.border || '#e5e7eb')}`,
=======
                  border: `2px solid ${errors.budget ? '#ef4444' : '#e5e7eb'}`,
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
                  borderRadius: 12,
                  fontSize: 15,
                  outline: 'none',
                  transition: 'all 0.3s ease',
<<<<<<< HEAD
                  background: BRAND.background,
                  color: BRAND.text
                }}
                onFocus={e => {
                  e.target.style.borderColor = BRAND.accent;
                  e.target.style.background = BRAND.card;
                }}
                onBlur={e => {
                  e.target.style.borderColor = errors.budget ? '#ef4444' : (BRAND.border || '#e5e7eb');
                  e.target.style.background = BRAND.background;
                }}
              />

=======
                  background: BRAND.light
                }}
                onFocus={e => {
                  e.target.style.borderColor = BRAND.accent;
                  e.target.style.background = '#fff';
                }}
                onBlur={e => {
                  e.target.style.borderColor = errors.budget ? '#ef4444' : '#e5e7eb';
                  e.target.style.background = BRAND.light;
                }}
              />
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
              {errors.budget && (
                <div style={{ color: '#ef4444', fontSize: 12, marginTop: 6 }}>
                  {errors.budget}
                </div>
              )}
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: 8,
                color: BRAND.dark,
                fontWeight: 600,
                fontSize: 14
              }}>
                الموقع
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleInput}
                placeholder="موقع المشروع"
                style={{
                  width: '100%',
                  padding: 14,
<<<<<<< HEAD
                  border: `2px solid ${BRAND.border || '#e5e7eb'}`,
=======
                  border: '2px solid #e5e7eb',
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
                  borderRadius: 12,
                  fontSize: 15,
                  outline: 'none',
                  transition: 'all 0.3s ease',
<<<<<<< HEAD
                  background: BRAND.background,
                  color: BRAND.text
                }}
                onFocus={e => {
                  e.target.style.borderColor = BRAND.accent;
                  e.target.style.background = BRAND.card;
                }}
                onBlur={e => {
                  e.target.style.borderColor = BRAND.border || '#e5e7eb';
                  e.target.style.background = BRAND.background;
                }}
              />

=======
                  background: BRAND.light
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
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: 8,
              color: BRAND.dark,
              fontWeight: 600,
              fontSize: 14
            }}>
              التاريخ المتوقع للبدء
            </label>
            <input
              name="expectedDate"
              type="date"
              value={form.expectedDate}
              onChange={handleInput}
              style={{
                width: '100%',
                padding: 14,
<<<<<<< HEAD
                border: `2px solid ${BRAND.border || '#e5e7eb'}`,
=======
                border: '2px solid #e5e7eb',
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
                borderRadius: 12,
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.3s ease',
<<<<<<< HEAD
                background: BRAND.background,
                color: BRAND.text
              }}
              onFocus={e => {
                e.target.style.borderColor = BRAND.accent;
                e.target.style.background = BRAND.card;
              }}
              onBlur={e => {
                e.target.style.borderColor = BRAND.border || '#e5e7eb';
                e.target.style.background = BRAND.background;
              }}
            />

=======
                background: BRAND.light
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
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: 8,
              color: BRAND.dark,
              fontWeight: 600,
              fontSize: 14
            }}>
              التفاصيل *
            </label>
            <textarea
              name="details"
              value={form.details}
              onChange={handleInput}
              required
              rows={5}
              placeholder="وصف مختصر عن المشروع، المتطلبات، والمواصفات..."
              style={{
                width: '100%',
                padding: 14,
<<<<<<< HEAD
                border: `2px solid ${errors.details ? '#ef4444' : (BRAND.border || '#e5e7eb')}`,
=======
                border: `2px solid ${errors.details ? '#ef4444' : '#e5e7eb'}`,
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
                borderRadius: 12,
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.3s ease',
<<<<<<< HEAD
                background: BRAND.background,
                color: BRAND.text,
=======
                background: BRAND.light,
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              onFocus={e => {
                e.target.style.borderColor = BRAND.accent;
<<<<<<< HEAD
                e.target.style.background = BRAND.card;
              }}
              onBlur={e => {
                e.target.style.borderColor = errors.details ? '#ef4444' : (BRAND.border || '#e5e7eb');
                e.target.style.background = BRAND.background;
              }}
            />

=======
                e.target.style.background = '#fff';
              }}
              onBlur={e => {
                e.target.style.borderColor = errors.details ? '#ef4444' : '#e5e7eb';
                e.target.style.background = BRAND.light;
              }}
            />
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
            {errors.details && (
              <div style={{ color: '#ef4444', fontSize: 12, marginTop: 6 }}>
                {errors.details}
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
            paddingTop: 20,
            borderTop: '2px solid ' + BRAND.light,
            marginTop: 12
          }}>
            <button
              type="button"
              onClick={() => setForm({ name: "", details: "", budget: "", location: "", expectedDate: "", contractor: "" })}
              style={{
<<<<<<< HEAD
                background: BRAND.background,
                color: BRAND.text,
                border: `1px solid ${BRAND.border || '#e2e8f0'}`,
=======
                background: '#f1f5f9',
                color: BRAND.dark,
                border: 0,
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
                padding: '14px 28px',
                borderRadius: 12,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 15,
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e => {
<<<<<<< HEAD
                e.currentTarget.style.background = BRAND.card;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = BRAND.background;
=======
                e.currentTarget.style.background = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#f1f5f9';
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
                e.currentTarget.style.transform = 'none';
              }}
            >
              مسح النموذج
            </button>
<<<<<<< HEAD

=======
>>>>>>> b0b3e7e3988920175cf99ac38c343c8fdac3bdfc
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: BRAND.gradient,
                color: '#fff',
                border: 0,
                padding: '14px 28px',
                borderRadius: 12,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: 15,
                boxShadow: '0 4px 15px rgba(42,157,143,0.3)',
                transition: 'all 0.3s ease',
                opacity: isSubmitting ? 0.7 : 1
              }}
              onMouseOver={e => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(42,157,143,0.4)';
                }
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(42,157,143,0.3)';
              }}
            >
              {isSubmitting ? '⏳ جاري الإرسال...' : '✓ إرسال الطلب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}








