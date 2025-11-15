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
    <div dir="rtl" style={{ fontFamily: 'Cairo, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#2e7d32',
        padding: '20px 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={() => navigate('/')}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ← العودة
            </button>
            <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>اتصل بنا</div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        backgroundColor: '#f0f8f0',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '36px', color: '#2e7d32', marginBottom: '20px' }}>
            تواصل معنا
          </h1>
          <p style={{ fontSize: '18px', color: '#555', lineHeight: 1.6 }}>
            نحن هنا لمساعدتك والإجابة على جميع استفساراتك
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section style={{ padding: '60px 20px', backgroundColor: 'white' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '60px'
        }}>
          {/* Contact Form */}
          <div>
            <h2 style={{ fontSize: '28px', color: '#2e7d32', marginBottom: '20px' }}>
              أرسل لنا رسالة
            </h2>

            {formSubmitted && (
              <div style={{
                backgroundColor: '#e8f5e9',
                color: '#2e7d32',
                padding: '15px',
                borderRadius: '5px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                شكراً لتواصلك معنا! سنرد عليك في أقرب وقت ممكن.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>
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
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>
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
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>
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
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>
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
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>
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
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                ></textarea>
              </div>

              <button type="submit" style={{
                backgroundColor: '#2e7d32',
                color: 'white',
                border: 'none',
                padding: '12px 25px',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%'
              }}>
                إرسال الرسالة
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 style={{ fontSize: '28px', color: '#2e7d32', marginBottom: '20px' }}>
              معلومات التواصل
            </h2>

            <div style={{
              backgroundColor: '#f0f8f0',
              padding: '25px',
              borderRadius: '10px',
              marginBottom: '30px'
            }}>
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
                }}>📧</div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>البريد الإلكتروني</div>
                  <div style={{ color: '#555' }}>info@muqawil.org</div>
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
                  <div style={{ fontWeight: 'bold', color: '#333' }}>الهاتف</div>
                  <div style={{ color: '#555' }}>+963 11 111 2222</div>
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
                  <div style={{ fontWeight: 'bold', color: '#333' }}>العنوان الرئيسي</div>
                  <div style={{ color: '#555' }}>دمشق، شارع الجسر، مبنى المهندسين</div>
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
                  <div style={{ fontWeight: 'bold', color: '#333' }}>ساعات العمل</div>
                  <div style={{ color: '#555' }}>الأحد - الخميس: 9:00 ص - 5:00 م</div>
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '22px', color: '#2e7d32', marginBottom: '20px' }}>
              مكاتبنا في سوريا
            </h3>

            {offices.map((office, index) => (
              <div key={index} style={{
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '15px'
              }}>
                <h4 style={{ margin: '0 0 10px', color: '#2e7d32' }}>{office.city}</h4>
                <div style={{ color: '#555', marginBottom: '5px' }}>{office.address}</div>
                <div style={{ color: '#555', marginBottom: '5px' }}>{office.phone}</div>
                <div style={{ color: '#555', marginBottom: '5px' }}>{office.email}</div>
                <div style={{ color: '#555' }}>{office.hours}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '60px 20px', backgroundColor: '#f8f9fa' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{ fontSize: '32px', color: '#2e7d32', textAlign: 'center', marginBottom: '40px' }}>
            الأسئلة الشائعة
          </h2>

          <div style={{
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {faqs.map((faq, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '15px',
                boxShadow: '0 3px 10px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{
                  margin: '0 0 10px',
                  color: '#2e7d32',
                  fontSize: '18px'
                }}>
                  {faq.question}
                </h3>
                <p style={{
                  margin: 0,
                  color: '#555',
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
      <section style={{ padding: '0', height: '400px', position: 'relative' }}>
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#757575',
          fontSize: '18px'
        }}>
          خريطة جوجل ستظهر هنا
        </div>
      </section>
    </div>
  );
}
