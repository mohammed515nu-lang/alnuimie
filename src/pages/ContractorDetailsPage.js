import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usersAPI, projectsAPI } from "../utils/api";

export default function ContractorDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contractor, setContractor] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const allContractors = await usersAPI.getAll({ role: "contractor" });
        const found = Array.isArray(allContractors)
          ? allContractors.find((c) => (c.id || c._id || "") === id)
          : null;

        if (!found) {
          throw new Error("لم يتم العثور على هذا المقاول");
        }

        setContractor(found);

        const contractorIdForFilter = found._id || found.id;
        const allProjects = await projectsAPI.getAll(
          contractorIdForFilter ? { contractor: contractorIdForFilter } : {}
        );

        setProjects(Array.isArray(allProjects) ? allProjects : []);
      } catch (e) {
        console.error("Contractor details error:", e);
        setError(e.message || "حدث خطأ أثناء تحميل بيانات المقاول");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const normalizedProjects = (projects || []).map((p, idx) => ({
    id: p.id || p._id || `project-${idx}`,
    name: p.name || p.title || "مشروع بدون اسم",
    location: p.location || p.city || "غير محدد",
    status: p.status || "active",
    progress:
      typeof p.progress === "number"
        ? Math.round(p.progress)
        : p.status === "completed"
        ? 100
        : 60,
  }));

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "Cairo, sans-serif",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(15,23,42,0.7), rgba(2,6,23,0.95))",
        color: "#fdf7f2",
        paddingBottom: "60px",
      }}
    >
      <header
        style={{
          background: "rgba(15,23,42,0.9)",
          padding: "18px 0",
          boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 5,
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background:
                  "linear-gradient(135deg, rgba(194,107,58,0.85), rgba(164,88,43,0.9))",
                color: "#fff",
                border: "none",
                padding: "8px 18px",
                borderRadius: "999px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
                boxShadow: "0 10px 25px rgba(194,107,58,0.35)",
              }}
            >
              ← العودة
            </button>
            <div
              style={{
                color: "#fef3c7",
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              تفاصيل المقاول
            </div>
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: "1200px",
          margin: "30px auto",
          padding: "0 20px",
        }}
      >
        {loading && (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              background: "rgba(15,23,42,0.7)",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            جاري تحميل بيانات المقاول...
          </div>
        )}

        {error && !loading && (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              background: "rgba(239,68,68,0.15)",
              borderRadius: "20px",
              border: "1px solid rgba(248,113,113,0.4)",
              color: "#fee2e2",
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && contractor && (
          <>
            <section
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1.8fr",
                gap: "24px",
                marginBottom: "40px",
              }}
            >
              <div
                style={{
                  background: "rgba(15,23,42,0.85)",
                  borderRadius: "22px",
                  padding: "24px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 24px 50px rgba(0,0,0,0.5)",
                }}
              >
                <div
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "24px",
                    background:
                      "linear-gradient(135deg, #f7d4b8 0%, #dba98b 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    color: "#6b3012",
                    fontWeight: 700,
                    marginBottom: "16px",
                  }}
                >
                  {(contractor.companyName || contractor.name || "م").slice(0, 2)}
                </div>
                <h1
                  style={{
                    fontSize: "24px",
                    fontWeight: 800,
                    marginBottom: "6px",
                    color: "#fef3c7",
                  }}
                >
                  {contractor.companyName || contractor.name}
                </h1>
                <div
                  style={{
                    color: "rgba(248,250,252,0.8)",
                    marginBottom: "10px",
                  }}
                >
                  {contractor.specialization || contractor.specialty || "مقاولات عامة"}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginTop: "12px",
                    color: "rgba(248,250,252,0.85)",
                    fontSize: "14px",
                  }}
                >
                  {contractor.city && <span>📍 {contractor.city}</span>}
                  {contractor.phone && <span>📱 {contractor.phone}</span>}
                  {contractor.email && <span>📧 {contractor.email}</span>}
                </div>
              </div>

              <div
                style={{
                  background: "rgba(15,23,42,0.85)",
                  borderRadius: "22px",
                  padding: "24px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 24px 50px rgba(0,0,0,0.5)",
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    marginBottom: "18px",
                    color: "#e5e7eb",
                  }}
                >
                  ملخص المشاريع
                </h2>
                {normalizedProjects.length === 0 && (
                  <p
                    style={{
                      color: "rgba(248,250,252,0.75)",
                      margin: 0,
                    }}
                  >
                    لا توجد مشاريع مسجلة لهذا المقاول حالياً.
                  </p>
                )}
                {normalizedProjects.length > 0 && (
                  <div
                    style={{
                      display: "grid",
                      gap: "12px",
                    }}
                  >
                    {normalizedProjects.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "16px",
                          background: "rgba(15,23,42,0.9)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              color: "#f9fafb",
                              marginBottom: 4,
                            }}
                          >
                            {p.name}
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              color: "rgba(248,250,252,0.75)",
                            }}
                          >
                            📍 {p.location}
                          </div>
                        </div>
                        <div
                          style={{
                            minWidth: 110,
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                              height: 6,
                              borderRadius: 999,
                              background: "rgba(55,65,81,0.9)",
                              overflow: "hidden",
                              marginBottom: 4,
                            }}
                          >
                            <div
                              style={{
                                width: `${p.progress}%`,
                                height: "100%",
                                background:
                                  "linear-gradient(135deg, #10b981, #22c55e)",
                              }}
                            />
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "rgba(248,250,252,0.8)",
                              textAlign: "right",
                            }}
                          >
                            {p.progress}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <div
              style={{
                marginBottom: "32px",
                textAlign: isMobile ? "center" : "right",
              }}
            >
              <button
                onClick={() => {
                  const contractorIdForFilter = contractor._id || contractor.id || id;
                  const query = contractorIdForFilter
                    ? `?role=client&redirect=/client/projects/add&contractorId=${encodeURIComponent(
                        contractorIdForFilter
                      )}`
                    : `?role=client&redirect=/client/projects/add`;
                  navigate(`/login${query}`);
                }}
                style={{
                  padding: "14px 32px",
                  borderRadius: "999px",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #c26b3a 0%, #a4582b 40%, #dba98b 100%)",
                  color: "#0b1120",
                  fontWeight: 700,
                  fontSize: "16px",
                  cursor: "pointer",
                  boxShadow: "0 14px 32px rgba(194,107,58,0.45)",
                }}
              >
                طلب مشروع جديد مع هذا المقاول
              </button>
            </div>

            <section
              style={{
                background: "rgba(15,23,42,0.9)",
                borderRadius: "22px",
                padding: "24px",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 24px 50px rgba(0,0,0,0.5)",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  marginBottom: "16px",
                  color: "#e5e7eb",
                }}
              >
                كل المشاريع
              </h2>
              {normalizedProjects.length === 0 && (
                <p
                  style={{
                    color: "rgba(248,250,252,0.75)",
                    margin: 0,
                  }}
                >
                  لا توجد مشاريع مسجلة حتى الآن.
                </p>
              )}
              {normalizedProjects.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile
                      ? "1fr"
                      : "repeat(2, minmax(0, 1fr))",
                    gap: "16px",
                  }}
                >
                  {normalizedProjects.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        borderRadius: "18px",
                        padding: "16px",
                        background: "rgba(15,23,42,0.95)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#f9fafb",
                          }}
                        >
                          {p.name}
                        </div>
                        <span
                          style={{
                            fontSize: 12,
                            padding: "2px 10px",
                            borderRadius: 999,
                            background:
                              p.status === "completed"
                                ? "rgba(16,185,129,0.15)"
                                : "rgba(245,158,11,0.15)",
                            color:
                              p.status === "completed"
                                ? "#6ee7b7"
                                : "#facc15",
                          }}
                        >
                          {p.status === "completed" ? "مكتمل" : "قيد التنفيذ"}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "rgba(248,250,252,0.8)",
                          marginBottom: 8,
                        }}
                      >
                        📍 {p.location}
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: 6,
                          borderRadius: 999,
                          background: "rgba(55,65,81,0.9)",
                          overflow: "hidden",
                          marginBottom: 4,
                        }}
                      >
                        <div
                          style={{
                            width: `${p.progress}%`,
                            height: "100%",
                            background:
                              "linear-gradient(135deg, #10b981, #22c55e)",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "rgba(248,250,252,0.8)",
                          textAlign: "right",
                        }}
                      >
                        نسبة الإنجاز: {p.progress}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
