import React from "react";
import BRAND from "./theme";


export default function Modal({ isOpen, onClose, title, children, size = 'medium' }) {
  if (!isOpen) return null;

  const maxWidthMap = {
    small: 400,
    medium: 540,
    large: 900,
    xlarge: 1200
  };

  const maxWidth = maxWidthMap[size] || maxWidthMap.medium;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(30, 58, 95, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: BRAND.card,
          color: BRAND.text,
          padding: '32px',
          borderRadius: 24,
          width: '95%',
          maxWidth: maxWidth,
          boxShadow: BRAND.shadows?.xl || '0 20px 60px rgba(0,0,0,0.3)',
          animation: 'modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          border: BRAND.glass.border,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}

      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            background: BRAND.light,
            border: 'none',
            width: 36,
            height: 36,
            borderRadius: '50%',
            fontSize: 22,
            cursor: 'pointer',
            color: BRAND.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            fontWeight: 700,
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#fee2e2';
            e.currentTarget.style.color = '#dc2626';
            e.currentTarget.style.transform = 'rotate(90deg)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = BRAND.light;
            e.currentTarget.style.color = BRAND.primary;
            e.currentTarget.style.transform = 'rotate(0deg)';
          }}
          aria-label="إغلاق"
        >
          &times;
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: `2px solid ${BRAND.background}`
        }}>

          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: BRAND.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20
          }}>
            📝
          </div>
          <h2 style={{
            margin: 0,
            color: BRAND.primary,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: '-0.5px'
          }}>
            {title}
          </h2>
        </div>

        <div style={{ direction: 'rtl' }}>
          {children}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}