import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // هنا يمكنك إضافة منطق إرسال النموذج
    console.log('Form data submitted:', formData);
    setFormSubmitted(true);
    // إعادة تعيين النموذج بعد الإرسال
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    // إعادة تعيين رسالة النجاح بعد 5 ثوانٍ
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  const offices = [
    {
      city: "دمشق",
      address: "شارع الجسر، مبنى المهندسين، الطابق الخامس",
      phone: "+963 11 222 3334",
      email: "damascus@muqawil.org",
      hours: "الأحد - الخميس: 9:00 ص - 5:00 م"
    },
    {
      city: "حلب",
      address: "ساحة سعد الله الجابري، برج الأعمال، الطابق الثالث",
      phone: "+963 21 333 4445",
      email: "aleppo@muqawil.org",
      hours: "الأحد - الخميس: 9:00 ص - 5:00 م"
    },
    {
      city: "حمص",
      address: "شارع الدبلوماسيين، مجمع التجاري، الطابق الثاني",
      phone: "+963 31 444 5556",
      email: "homs@muqawil.org",
      hours: "الأحد - الخميس: 9:00 ص - 5:00 م"
    },
    {
      city: "اللاذقية",
      address: "شارع 8 آذار، مركز الأعمال، الطابق الرابع",
      phone: "+963 41 555 6667",
      email: "lattakia@muqawil.org",
      hours: "الأحد - الخميس: 9:00 ص - 5:00 م"
    }
  ];

  const faqs = [
    {
      question: "كيف يمكنني التسجيل كمقاول على المنصة؟",
      answer: "يمكنك التسجيل كمقاول عبر النقر على زر 'تسجيل الدخول' ثم اختيار 'حساب مقاول جديد' وملء البيانات المطلوبة. سيتم مراجعة طلبك خلال 24-48 ساعة."
    },
    {
      question: "ما هي الرسوم المترتبة على استخدام المنصة؟",
      answer: "تختلف الرسوم حسب نوع الخدمة. التسجيل كمقاول أو صاحب مشروع مجاني، بينما تترتب رسوم على بعض الخدمات المميزة مثل التدريب والاستشارات."
    },
    {
      question: "هل تقدمون دورات تدريبية للمقاولين؟",
      answer: "نعم، نقدم مجموعة واسعة من الدورات التدريبية في مجال البناء والتشييد وإدارة المشاريع. يمكنك الاطلاع على الدورات المتاحة في قسم 'التدريب'."
    },
    {
      question: "كيف يمكنني التواصل مع مقاول معين؟",
      answer: "بعد تسجيل الدخول، يمكنك تصفح المقاولين ومراجعة ملفاتهم الشخصية. يمكنك إرسال رسالة مباشرة لهم عبر المنصة لمناقشة مشروعك."
    }
  ];

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: 'Cairo, sans-serif',
        background: 'radial-gradient(circle at top, #020617 0%, #020617 40%, #0b1120 70%, #111827 100%)',
        color: '#f9fafb',
        minHeight: '100vh'
      }}
    >
      {/* Header */}
      <header style={{
        background: 'rgba(15,23,42,0.92)',
        padding: '16px 0',
        boxShadow: '0 10px 30px rgba(15,23,42,0.7)',
        borderBottom: '1px solid rgba(148,163,184,0.35)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'blur(14px)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => navigate('/')}
              style={{
                background: 'linear-gradient(135deg, #c26b3a, #dba98b)',
                color: '#0b1120',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                boxShadow: '0 10px 25px rgba(15,23,42,0.7)'
              }}
            >
              ← العودة
            </button>
            <div style={{ color: '#e5e7eb', fontSize: '20px', fontWeight: 700 }}>اتصل بنا</div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '70px 20px 40px',
        textAlign: 'center',
        background: 'radial-gradient(circle at top, rgba(15,23,42,0.4), transparent 60%)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '36px', color: '#f9fafb', marginBottom: '16px', fontWeight: 800 }}>
            تواصل معنا
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(226,232,240,0.88)', lineHeight: 1.8 }}>
            نحن هنا لمساعدتك والإجابة على جميع استفساراتك
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section style={{ padding: '60px 20px', background: 'linear-gradient(145deg, #020617 0%, #020617 40%, #0b1120 100%)' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '60px'
        }}>
          {/* Contact Form */}
          <div>
            <h2 style={{ fontSize: '28px', color: '#fef3c7', marginBottom: '20px' }}>
              أرسل لنا رسالة
            </h2>

            {formSubmitted && (
              <div style={{
                backgroundColor: 'rgba(22,163,74,0.15)',
                color: '#bbf7d0',
                padding: '15px',
                borderRadius: '12px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                شكراً لتواصلك معنا! سنرد عليك في أقرب وقت ممكن.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{
              background: 'rgba(15,23,42,0.96)',
              padding: '24px',
              borderRadius: '20px',
              boxShadow: '0 22px 45px rgba(0,0,0,0.7)',
              border: '1px solid rgba(148,163,184,0.35)'
            }}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e5e7eb', fontWeight: '500' }}>
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(148,163,184,0.6)',
                    fontSize: '16px',
                    backgroundColor: 'rgba(15,23,42,0.9)',
                    color: '#e5e7eb'
                  }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e5e7eb', fontWeight: '500' }}>
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(148,163,184,0.6)',
                    fontSize: '16px',
                    backgroundColor: 'rgba(15,23,42,0.9)',
                    color: '#e5e7eb'
                  }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e5e7eb', fontWeight: '500' }}>
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(148,163,184,0.6)',
                    fontSize: '16px',
                    backgroundColor: 'rgba(15,23,42,0.9)',
                    color: '#e5e7eb'
                  }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e5e7eb', fontWeight: '500' }}>
                  الموضوع *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(148,163,184,0.6)',
                    fontSize: '16px',
                    backgroundColor: 'rgba(15,23,42,0.9)',
                    color: '#e5e7eb'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#e5e7eb', fontWeight: '500' }}>
                  الرسالة *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(148,163,184,0.6)',
                    fontSize: '16px',
                    resize: 'vertical',
                    backgroundColor: 'rgba(15,23,42,0.9)',
                    color: '#e5e7eb'
                  }}
                ></textarea>
              </div>

              <button type="submit" style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: '#0b1120',
                border: 'none',
                padding: '12px 25px',
                borderRadius: '999px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%',
                boxShadow: '0 16px 40px rgba(22,163,74,0.55)'
              }}>
                إرسال الرسالة
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 style={{ fontSize: '28px', color: '#fef3c7', marginBottom: '20px' }}>
              معلومات التواصل
            </h2>

            <div style={{
              backgroundColor: 'rgba(15,23,42,0.95)',
              padding: '25px',
              borderRadius: '20px',
              marginBottom: '30px',
              border: '1px solid rgba(148,163,184,0.35)',
              boxShadow: '0 22px 45px rgba(0,0,0,0.7)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px',
                  marginLeft: '15px'
                }}>📧</div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#e5e7eb' }}>البريد الإلكتروني</div>
                  <div style={{ color: 'rgba(226,232,240,0.9)' }}>info@muqawil.org</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#2e7d32',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px',
                  marginLeft: '15px'
                }}>📞</div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#e5e7eb' }}>الهاتف</div>
                  <div style={{ color: 'rgba(226,232,240,0.9)' }}>+963 11 111 2222</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#2e7d32',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px',
                  marginLeft: '15px'
                }}>📍</div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#e5e7eb' }}>العنوان الرئيسي</div>
                  <div style={{ color: 'rgba(226,232,240,0.9)' }}>دمشق، شارع الجسر، مبنى المهندسين</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#2e7d32',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px',
                  marginLeft: '15px'
                }}>🕐</div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#e5e7eb' }}>ساعات العمل</div>
                  <div style={{ color: 'rgba(226,232,240,0.9)' }}>الأحد - الخميس: 9:00 ص - 5:00 م</div>
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '22px', color: '#fef3c7', marginBottom: '20px' }}>
              مكاتبنا في سوريا
            </h3>

            {offices.map((office, index) => (
              <div key={index} style={{
                backgroundColor: 'rgba(15,23,42,0.96)',
                padding: '20px',
                borderRadius: '16px',
                marginBottom: '15px',
                border: '1px solid rgba(148,163,184,0.35)'
              }}>
                <h4 style={{ margin: '0 0 10px', color: '#bfdbfe' }}>{office.city}</h4>
                <div style={{ color: 'rgba(226,232,240,0.9)', marginBottom: '5px' }}>{office.address}</div>
                <div style={{ color: 'rgba(226,232,240,0.9)', marginBottom: '5px' }}>{office.phone}</div>
                <div style={{ color: 'rgba(226,232,240,0.9)', marginBottom: '5px' }}>{office.email}</div>
                <div style={{ color: 'rgba(226,232,240,0.9)' }}>{office.hours}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '60px 20px', background: '#020617' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{ fontSize: '32px', color: '#fef3c7', textAlign: 'center', marginBottom: '40px' }}>
            الأسئلة الشائعة
          </h2>

          <div style={{
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {faqs.map((faq, index) => (
              <div key={index} style={{
                backgroundColor: 'rgba(15,23,42,0.96)',
                padding: '20px',
                borderRadius: '16px',
                marginBottom: '15px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
                border: '1px solid rgba(148,163,184,0.45)'
              }}>
                <h3 style={{
                  margin: '0 0 10px',
                  color: '#bfdbfe',
                  fontSize: '18px'
                }}>
                  {faq.question}
                </h3>
                <p style={{
                  margin: 0,
                  color: 'rgba(226,232,240,0.9)',
                  lineHeight: 1.6
                }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section style={{ padding: '0', height: '360px', position: 'relative' }}>
        <div style={{
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, rgba(15,23,42,0.9), #020617)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(148,163,184,0.9)',
          fontSize: '18px'
        }}>
          خريطة جوجل ستظهر هنا
        </div>
      </section>
    </div>
  );
}
