import React, { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { stripeAPI } from '../utils/api';
import { useNotifications } from './NotificationSystem';
import BRAND from '../theme';

// Initialize Stripe - سيتم تهيئته عند استخدام المكون
let stripePromise = null;

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
    if (publishableKey) {
      stripePromise = loadStripe(publishableKey);
    }
  }
  return stripePromise;
};

function PaymentForm({ amount, supplier, project, purchase, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const notifications = useNotifications();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const isSubmittingRef = useRef(false); // Prevent double submission

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        setIsProcessing(true);
        const result = await stripeAPI.createPaymentIntent({
          amount: parseFloat(amount),
          supplier: supplier,
          project: project,
          purchase: purchase,
          currency: 'usd'
        });
        setClientSecret(result.clientSecret);
        setPaymentId(result.paymentId);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        notifications.error('خطأ', error.message || 'فشل إنشاء عملية الدفع');
        onCancel();
      } finally {
        setIsProcessing(false);
      }
    };

    if (amount > 0) {
      createPaymentIntent();
    }
  }, [amount, supplier, project, purchase]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Prevent multiple submissions - critical for Stripe
    if (!stripe || !elements || !clientSecret || isProcessing || isSubmittingRef.current) {
      return;
    }

    // Mark as submitting immediately
    isSubmittingRef.current = true;
    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (error) {
        notifications.error('فشل الدفع', error.message);
        setIsProcessing(false);
        isSubmittingRef.current = false;
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment in backend
        try {
          await stripeAPI.confirmPayment({
            paymentIntentId: paymentIntent.id,
            paymentId: paymentId
          });

          notifications.success('نجح الدفع', `تم الدفع بنجاح: $${amount.toLocaleString()}`);
          onSuccess(paymentIntent);
          // Don't reset isProcessing here - let onSuccess handle closing
        } catch (confirmError) {
          console.error('Confirm payment error:', confirmError);
          notifications.error('خطأ', 'تم الدفع لكن فشل تحديث الحالة');
          setIsProcessing(false);
          isSubmittingRef.current = false;
        }
      } else {
        setIsProcessing(false);
        isSubmittingRef.current = false;
      }
    } catch (error) {
      console.error('Payment error:', error);
      notifications.error('خطأ', error.message || 'حدث خطأ أثناء المعالجة');
      setIsProcessing(false);
      isSubmittingRef.current = false;
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: BRAND.text,
        '::placeholder': {
          color: BRAND.muted,
        },
        fontFamily: '"Cairo", "Outfit", sans-serif',
      },
      invalid: {
        color: BRAND.error,
        iconColor: BRAND.error,
      },
    },
    hidePostalCode: true,
  };

  if (!clientSecret) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: 40, marginBottom: 20 }}>⏳</div>
        <p style={{ color: BRAND.text }}>جاري إعداد عملية الدفع...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <form
        onSubmit={handleSubmit}
        style={{ padding: '20px' }}
        onKeyDown={(e) => {
          // Prevent Enter key from submitting multiple times
          if (e.key === 'Enter' && (isProcessing || isSubmittingRef.current)) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, color: BRAND.text }}>
            بيانات البطاقة الائتمانية
          </label>
          <div style={{
            padding: '15px',
            border: `2px solid ${BRAND.border || '#ddd'}`,
            borderRadius: '12px',
            background: BRAND.background
          }}>
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        <div style={{
          background: `linear-gradient(135deg, ${BRAND.primary}15 0%, ${BRAND.secondary}15 100%)`,
          padding: '20px',
          borderRadius: '16px',
          marginBottom: '20px',
          border: `2px solid ${BRAND.primary}30`,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 11, color: BRAND.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            المبلغ الإجمالي للدفع
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, color: BRAND.primary, marginBottom: 8 }}>
            ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: 11, color: BRAND.muted }}>
            💳 سيتم خصم المبلغ من بطاقتك الائتمانية
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            style={{
              flex: 1,
              padding: '12px',
              background: BRAND.background,
              color: BRAND.text,
              border: `2px solid ${BRAND.border || '#ddd'}`,
              borderRadius: '12px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              opacity: isProcessing ? 0.5 : 1
            }}
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={!stripe || !elements || !clientSecret || isProcessing}
            style={{
              flex: 1,
              padding: '12px',
              background: (!stripe || !elements || !clientSecret || isProcessing) ? BRAND.muted : BRAND.gradient,
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              cursor: (!stripe || !elements || !clientSecret || isProcessing) ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              opacity: (!stripe || !elements || !clientSecret || isProcessing) ? 0.6 : 1,
              transition: 'all 0.3s ease',
              pointerEvents: (!stripe || !elements || !clientSecret || isProcessing) ? 'none' : 'auto'
            }}
            onClick={(e) => {
              if (isProcessing) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            {isProcessing ? (
              <span>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', marginLeft: '8px' }}>⚙️</span>
                جاري المعالجة...
              </span>
            ) : (
              `دفع $${parseFloat(amount).toLocaleString()}`
            )}
          </button>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '12px',
          fontSize: 12,
          color: '#166534',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8
        }}>
          <span>🔒</span>
          <span>معالجة آمنة 100% عبر Stripe - بياناتك محمية</span>
        </div>

        <div style={{
          marginTop: '12px',
          padding: '10px',
          background: '#fef3c7',
          border: '1px solid #fde047',
          borderRadius: '8px',
          fontSize: 11,
          color: '#92400e',
          textAlign: 'center'
        }}>
          💡 استخدم بطاقة اختبار: 4242 4242 4242 4242
        </div>
      </form>
    </>
  );
}

export default function StripePaymentForm({ amount, supplier, project, purchase, onSuccess, onCancel }) {
  const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 20 }}>⚠️</div>
        <p style={{ color: BRAND.error }}>
          Stripe غير مُعد بشكل صحيح. يرجى إضافة REACT_APP_STRIPE_PUBLISHABLE_KEY في ملف .env
        </p>
        <p style={{ fontSize: 12, color: BRAND.muted, marginTop: 10 }}>
          يمكنك الحصول على المفتاح من: https://dashboard.stripe.com/apikeys
        </p>
      </div>
    );
  }

  return (
    <Elements stripe={getStripe()}>
      <PaymentForm
        amount={amount}
        supplier={supplier}
        project={project}
        purchase={purchase}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
}

