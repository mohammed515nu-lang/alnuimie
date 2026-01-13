import React from 'react';
import BRAND from '../theme';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: BRAND.background || '#0f172a',
          color: BRAND.text || '#fff',
          padding: '20px',
          direction: 'rtl'
        }}>
          <div style={{
            maxWidth: 600,
            width: '100%',
            background: BRAND.card || '#1e293b',
            borderRadius: 20,
            padding: '40px',
            boxShadow: BRAND.shadows?.lg || '0 20px 60px rgba(0, 0, 0, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>⚠️</div>
            <h1 style={{
              color: BRAND.primary || '#3b82f6',
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 16
            }}>
              حدث خطأ غير متوقع
            </h1>
            <p style={{
              color: BRAND.muted || '#94a3b8',
              fontSize: 16,
              lineHeight: 1.8,
              marginBottom: 30
            }}>
              نعتذر، حدث خطأ أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                marginTop: 20,
                padding: '15px',
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: 8,
                textAlign: 'right',
                direction: 'ltr'
              }}>
                <summary style={{
                  cursor: 'pointer',
                  color: '#ef4444',
                  fontWeight: 600,
                  marginBottom: 10
                }}>
                  تفاصيل الخطأ (للمطورين)
                </summary>
                <pre style={{
                  color: '#fca5a5',
                  fontSize: 12,
                  overflow: 'auto',
                  maxHeight: 200,
                  textAlign: 'left'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <button
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
                window.location.reload();
              }}
              style={{
                background: BRAND.gradient || 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '14px 28px',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: 20,
                transition: 'transform 0.2s',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

