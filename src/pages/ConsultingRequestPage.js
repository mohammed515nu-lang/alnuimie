import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ConsultingRequestPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "",
    details: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Consulting request submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      navigate("/consulting");
    }, 3000);
  };

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "Cairo, sans-serif",
        background:
          "radial-gradient(circle at top, rgba(15,23,42,0.7), rgba(2,6,23,0.95))",
        color: "#fdf7f2",
        minHeight: "100vh",
        padding: "40px 20px"
      }}
    >
      <header
        style={{
          background: "rgba(15,23,42,0.85)",
          padding: "18px 0",
          boxShadow: "0 10px 30px rgba(2,6,23,0.4)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(10px)"
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => navigate("/consulting")}
              style={{
                background:
                  "linear-gradient(135deg, rgba(194,107,58,0.8), rgba(164,88,43,0.9))",
                color: "#fff",
                border: "none",
                padding: "8px 15px",
                borderRadius: "999px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
                boxShadow: "0 10px 25px rgba(194,107,58,0.3)"
              }}
            >
              ← العودة
            </button>
            <div
              style={{ color: "#fef3c7", fontSize: "20px", fontWeight: 700 }}
            >
              طلب استشارة
            </div>
          </div>
        </div>
      </header>

      <section
        style={{
          maxWidth: "800px",
          margin: "30px auto",
          backgroundColor: "rgba(15,23,42,0.96)",
          padding: "24px",
          borderRadius: "20px",
          boxShadow: "0 22px 45px rgba(0,0,0,0.7)",
          border: "1px solid rgba(148,163,184,0.35)"
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            marginBottom: "16px",
            fontWeight: 700,
            color: "#fef3c7",
            textAlign: "center"
          }}
        >
          نموذج طلب استشارة
        </h1>
        <p
          style={{
            fontSize: "14px",
            marginBottom: "24px",
            color: "rgba(226,232,240,0.9)",
            textAlign: "center"
          }}
        >
          يرجى تعبئة البيانات التالية ليتمكن فريق الاستشارات من التواصل معك
        </p>

        {submitted && (
          <div
            style={{
              backgroundColor: "rgba(22,163,74,0.15)",
              color: "#bbf7d0",
              padding: "12px",
              borderRadius: "12px",
              marginBottom: "20px",
              textAlign: "center"
            }}
          >
            تم إرسال طلبك بنجاح، سيتم التواصل معك قريباً.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#e5e7eb",
                fontWeight: 500
              }}
            >
              الاسم الكامل *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid rgba(148,163,184,0.6)",
                fontSize: "14px",
                backgroundColor: "rgba(15,23,42,0.9)",
                color: "#e5e7eb"
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#e5e7eb",
                fontWeight: 500
              }}
            >
              البريد الإلكتروني *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid rgba(148,163,184,0.6)",
                fontSize: "14px",
                backgroundColor: "rgba(15,23,42,0.9)",
                color: "#e5e7eb"
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#e5e7eb",
                fontWeight: 500
              }}
            >
              رقم الهاتف
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid rgba(148,163,184,0.6)",
                fontSize: "14px",
                backgroundColor: "rgba(15,23,42,0.9)",
                color: "#e5e7eb"
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#e5e7eb",
                fontWeight: 500
              }}
            >
              موضوع الاستشارة *
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid rgba(148,163,184,0.6)",
                fontSize: "14px",
                backgroundColor: "rgba(15,23,42,0.9)",
                color: "#e5e7eb"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#e5e7eb",
                fontWeight: 500
              }}
            >
              تفاصيل الطلب *
            </label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              required
              rows={4}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid rgba(148,163,184,0.6)",
                fontSize: "14px",
                backgroundColor: "rgba(15,23,42,0.9)",
                color: "#e5e7eb",
                resize: "vertical"
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              background:
                "linear-gradient(135deg, #2563eb, #0ea5e9)",
              color: "#f0f9ff",
              border: "none",
              padding: "12px 20px",
              borderRadius: "999px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              width: "100%",
              boxShadow: "0 18px 35px rgba(37,99,235,0.45)"
            }}
          >
            إرسال الطلب
          </button>
        </form>
      </section>
    </div>
  );
}
