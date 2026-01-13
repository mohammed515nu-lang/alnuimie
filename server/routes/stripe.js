const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { optionalAuth } = require('../middleware/auth');

// Initialize Stripe only if secret key is available
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn('⚠️ STRIPE_SECRET_KEY is not set. Stripe payments will not work.');
}

router.use(optionalAuth);

// Create Payment Intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      console.error('❌ Stripe is not configured. STRIPE_SECRET_KEY is missing.');
      return res.status(500).json({ 
        error: 'Stripe payment service is not configured',
        message: 'Please contact the administrator. STRIPE_SECRET_KEY is missing in server environment variables.'
      });
    }

    const { amount, supplier, project, purchase, currency = 'usd' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount is required and must be greater than 0' });
    }

    if (!req.user || req.userRole !== 'contractor') {
      return res.status(403).json({ error: 'Only contractors can create payments' });
    }

    // Create payment intent in Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        supplier: supplier || '',
        project: project || '',
        purchase: purchase || '',
        userId: req.userId.toString(),
        userEmail: req.user?.email || ''
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Create payment record in database
    const payment = new Payment({
      supplier,
      project,
      purchase,
      amount,
      paymentMethod: 'stripe',
      paymentStatus: 'pending',
      stripePaymentIntentId: paymentIntent.id,
      stripeClientSecret: paymentIntent.client_secret,
      createdBy: req.userId
    });

    await payment.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('❌ Stripe payment intent error:', error);
    
    // Provide more detailed error messages
    let errorMessage = error.message || 'Failed to create payment intent';
    let errorDetails = {};
    
    // Handle specific Stripe errors
    if (error.type === 'StripeInvalidRequestError') {
      errorMessage = `Stripe API error: ${error.message}`;
      errorDetails = {
        type: error.type,
        code: error.code,
        param: error.param
      };
    } else if (error.type === 'StripeAPIError') {
      errorMessage = 'Stripe API is currently unavailable. Please try again later.';
      errorDetails = { type: error.type };
    } else if (error.message && error.message.includes('No such')) {
      errorMessage = 'Invalid request to Stripe API. Please check your configuration.';
    }
    
    res.status(500).json({ 
      error: 'Failed to create payment intent', 
      message: errorMessage,
      details: errorDetails,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Confirm Payment
router.post('/confirm-payment', async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return res.status(500).json({ 
        error: 'Stripe payment service is not configured',
        message: 'STRIPE_SECRET_KEY is missing in server environment variables.'
      });
    }

    const { paymentIntentId, paymentId } = req.body;

    if (!paymentIntentId || !paymentId) {
      return res.status(400).json({ error: 'Payment intent ID and payment ID are required' });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Update payment in database
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Check if user owns this payment
    if (req.user && req.userRole === 'contractor') {
      if (payment.createdBy?.toString() !== req.userId.toString()) {
        return res.status(403).json({ error: 'You do not have permission to confirm this payment' });
      }
    }

    // Update payment status based on Stripe status
    if (paymentIntent.status === 'succeeded') {
      payment.paymentStatus = 'completed';
      payment.transactionId = paymentIntent.id;
      payment.paymentDate = new Date();
    } else if (paymentIntent.status === 'processing') {
      payment.paymentStatus = 'processing';
    } else if (paymentIntent.status === 'requires_payment_method' || 
               paymentIntent.status === 'canceled') {
      payment.paymentStatus = 'failed';
    }

    await payment.save();

    res.json({
      success: true,
      payment: payment,
      status: paymentIntent.status
    });
  } catch (error) {
    console.error('❌ Confirm payment error:', error);
    res.status(500).json({ 
      error: 'Failed to confirm payment', 
      message: error.message || 'An error occurred while confirming the payment',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Webhook endpoint for Stripe events
// Note: This route must be registered BEFORE express.json() middleware in server.js
// For now, we'll handle it with a special route that bypasses JSON parsing
const webhookRouter = express.Router();
webhookRouter.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  // Check if Stripe is configured
  if (!stripe) {
    console.error('❌ Stripe webhook called but Stripe is not configured');
    return res.status(500).json({ error: 'Stripe is not configured' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET is missing');
    return res.status(500).json({ error: 'Webhook secret is not configured' });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handlePaymentSuccess(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handlePaymentFailure(failedPayment);
      break;
    case 'payment_intent.canceled':
      const canceledPayment = event.data.object;
      await handlePaymentCanceled(canceledPayment);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Export both regular router and webhook router
module.exports = router;
module.exports.webhookRouter = webhookRouter;

async function handlePaymentSuccess(paymentIntent) {
  try {
    const payment = await Payment.findOne({ 
      stripePaymentIntentId: paymentIntent.id 
    });

    if (payment) {
      payment.paymentStatus = 'completed';
      payment.transactionId = paymentIntent.id;
      payment.paymentDate = new Date(paymentIntent.created * 1000);
      await payment.save();
      console.log(`✅ Payment ${payment._id} marked as completed`);
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailure(paymentIntent) {
  try {
    const payment = await Payment.findOne({ 
      stripePaymentIntentId: paymentIntent.id 
    });

    if (payment) {
      payment.paymentStatus = 'failed';
      await payment.save();
      console.log(`❌ Payment ${payment._id} marked as failed`);
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handlePaymentCanceled(paymentIntent) {
  try {
    const payment = await Payment.findOne({ 
      stripePaymentIntentId: paymentIntent.id 
    });

    if (payment) {
      payment.paymentStatus = 'cancelled';
      await payment.save();
      console.log(`⚠️ Payment ${payment._id} marked as cancelled`);
    }
  } catch (error) {
    console.error('Error handling payment cancellation:', error);
  }
}

// Get payment status
router.get('/payment-status/:paymentId', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate('supplier', 'name companyName')
      .populate('project', 'name')
      .populate('purchase');

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Check if user owns this payment
    if (req.user && req.userRole === 'contractor') {
      if (payment.createdBy?.toString() !== req.userId.toString()) {
        return res.status(403).json({ error: 'You do not have permission to view this payment' });
      }
    }

      // If it's a Stripe payment, get latest status from Stripe
      if (payment.stripePaymentIntentId && stripe) {
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(payment.stripePaymentIntentId);
        
        // Update status if changed
        if (paymentIntent.status === 'succeeded' && payment.paymentStatus !== 'completed') {
          payment.paymentStatus = 'completed';
          payment.transactionId = paymentIntent.id;
          await payment.save();
        } else if (paymentIntent.status === 'requires_payment_method' && payment.paymentStatus !== 'failed') {
          payment.paymentStatus = 'failed';
          await payment.save();
        }

        res.json({
          payment: payment,
          stripeStatus: paymentIntent.status,
          lastPaymentError: paymentIntent.last_payment_error
        });
      } catch (stripeError) {
        console.error('Stripe retrieve error:', stripeError);
        res.json({ payment: payment });
      }
    } else {
      res.json({ payment: payment });
    }
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ 
      error: 'Failed to get payment status', 
      message: error.message 
    });
  }
});

module.exports = router;

