const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const PaymentCard = require('../models/PaymentCard');
const Transfer = require('../models/Transfer');
const { authenticate } = require('../middleware/auth');

let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn('⚠️ [wallet] STRIPE_SECRET_KEY is not set. Card save & transfers will not work.');
}

function requireStripe(res) {
  if (!stripe) {
    res.status(500).json({
      error: 'Stripe is not configured',
      message: 'STRIPE_SECRET_KEY missing on the server'
    });
    return false;
  }
  return true;
}

function cardDto(c) {
  if (!c) return null;
  return {
    id: c._id.toString(),
    ownerId: (c.owner?._id ?? c.owner).toString?.() ?? String(c.owner ?? ''),
    brand: c.brand,
    last4: c.last4,
    expMonth: c.expMonth,
    expYear: c.expYear,
    holderName: c.holderName,
    isDefault: !!c.isDefault,
    stripePaymentMethodId: c.stripePaymentMethodId,
    createdAt: c.createdAt,
  };
}

function transferDto(t) {
  if (!t) return null;
  const fromU = t.fromUser && typeof t.fromUser === 'object' ? t.fromUser : null;
  const toU = t.toUser && typeof t.toUser === 'object' ? t.toUser : null;
  return {
    id: t._id.toString(),
    type: t.type,
    amount: t.amount,
    currency: t.currency,
    status: t.status,
    fromUserId: (fromU?._id ?? t.fromUser)?.toString?.() ?? String(t.fromUser ?? ''),
    fromUserName: fromU?.name ?? '',
    toUserId: t.toUser ? ((toU?._id ?? t.toUser).toString?.() ?? String(t.toUser)) : undefined,
    toUserName: toU?.name ?? undefined,
    toSupplierName: t.toSupplierName,
    description: t.description,
    projectId: t.project ? t.project.toString() : undefined,
    projectName: t.projectName,
    stripePaymentIntentId: t.stripePaymentIntentId,
    stripeClientSecret: t.stripeClientSecret,
    cardLast4: t.cardLast4,
    cardBrand: t.cardBrand,
    createdAt: t.createdAt,
  };
}

function isMissingStripeCustomer(err) {
  return Boolean(
    err &&
      (err.code === 'resource_missing' ||
        (err.type === 'StripeInvalidRequestError' && err.param === 'customer'))
  );
}

/**
 * يعيد معرف عميل Stripe صالحاً. إذا كان المخزّن في Mongo قديماً (مفتاح test جديد، حذف من لوحة Stripe، إلخ)
 * يُزال ويُنشأ عميل جديد، ويُنظّف سجل البطاقات المرتبط بالعميل القديم.
 */
async function ensureCustomerId(user) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
  }

  if (user.stripeCustomerId) {
    try {
      await stripe.customers.retrieve(user.stripeCustomerId);
      return user.stripeCustomerId;
    } catch (e) {
      if (isMissingStripeCustomer(e)) {
        const stale = user.stripeCustomerId;
        console.warn(`[wallet] Stale stripeCustomerId ${stale} for user ${user._id}; recreating Stripe customer.`);
        await PaymentCard.deleteMany({ owner: user._id, stripeCustomerId: stale });
        user.stripeCustomerId = undefined;
        await user.save();
      } else {
        throw e;
      }
    }
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: { userId: user._id.toString(), role: user.role },
  });
  user.stripeCustomerId = customer.id;
  await user.save();
  return customer.id;
}

// === Cards ===

// GET /api/wallet/cards — my saved cards
router.get('/cards', authenticate, async (req, res) => {
  try {
    const cards = await PaymentCard.find({ owner: req.userId }).sort({ isDefault: -1, createdAt: -1 });
    res.json(cards.map(cardDto));
  } catch (error) {
    res.status(500).json({ error: 'Failed to list cards', message: error.message });
  }
});

// POST /api/wallet/setup-intent — creates SetupIntent + Customer so the client SDK can save a card
router.post('/setup-intent', authenticate, async (req, res) => {
  if (!requireStripe(res)) return;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const customerId = await ensureCustomerId(user);
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: '2024-06-20' }
    );
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      usage: 'off_session',
      payment_method_types: ['card'],
      metadata: { userId: user._id.toString() }
    });
    res.json({
      setupIntentClientSecret: setupIntent.client_secret,
      ephemeralKeySecret: ephemeralKey.secret,
      customerId,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || undefined
    });
  } catch (error) {
    console.error('SetupIntent error:', error);
    res.status(500).json({ error: 'Failed to create setup intent', message: error.message });
  }
});

// POST /api/wallet/sync-cards
// يُستدعى بعد نجاح Stripe PaymentSheet لمزامنة البطاقات الجديدة من Stripe إلى قاعدة البيانات
router.post('/sync-cards', authenticate, async (req, res) => {
  if (!requireStripe(res)) return;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const customerId = await ensureCustomerId(user);

    const pmList = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    let synced = 0;
    for (const pm of pmList.data) {
      if (!pm.card) continue;
      const exists = await PaymentCard.findOne({ stripePaymentMethodId: pm.id });
      if (exists) continue;

      const count = await PaymentCard.countDocuments({ owner: req.userId });
      await PaymentCard.create({
        owner: req.userId,
        stripeCustomerId: customerId,
        stripePaymentMethodId: pm.id,
        brand: (pm.card.brand || 'other').toLowerCase(),
        last4: pm.card.last4,
        expMonth: pm.card.exp_month,
        expYear: pm.card.exp_year,
        holderName: pm.billing_details?.name || undefined,
        isDefault: count === 0, // أول بطاقة تكون الافتراضية
      });
      synced++;
    }

    const cards = await PaymentCard.find({ owner: req.userId }).sort({ isDefault: -1, createdAt: -1 });
    res.json({ synced, cards: cards.map(cardDto) });
  } catch (error) {
    console.error('Sync cards error:', error);
    res.status(500).json({ error: 'Failed to sync cards', message: error.message });
  }
});


// POST /api/wallet/cards — { stripePaymentMethodId, makeDefault? }
router.post('/cards', authenticate, async (req, res) => {
  if (!requireStripe(res)) return;
  try {
    const { stripePaymentMethodId, makeDefault } = req.body || {};
    if (!stripePaymentMethodId) return res.status(400).json({ error: 'stripePaymentMethodId is required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const customerId = await ensureCustomerId(user);

    // Attach PM to customer if not already attached
    let pm;
    try {
      pm = await stripe.paymentMethods.retrieve(stripePaymentMethodId);
      if (!pm.customer) {
        pm = await stripe.paymentMethods.attach(stripePaymentMethodId, { customer: customerId });
      } else if (pm.customer !== customerId) {
        return res.status(400).json({ error: 'Payment method belongs to another customer' });
      }
    } catch (e) {
      return res.status(400).json({ error: 'Invalid payment method', message: e.message });
    }

    if (pm.type !== 'card' || !pm.card) {
      return res.status(400).json({ error: 'Only card payment methods are supported' });
    }

    const existing = await PaymentCard.findOne({ stripePaymentMethodId });
    if (existing && existing.owner.toString() === req.userId.toString()) {
      return res.json(cardDto(existing));
    }

    const count = await PaymentCard.countDocuments({ owner: req.userId });
    const isDefault = !!makeDefault || count === 0;

    if (isDefault) {
      await PaymentCard.updateMany({ owner: req.userId }, { $set: { isDefault: false } });
      try {
        await stripe.customers.update(customerId, { invoice_settings: { default_payment_method: stripePaymentMethodId } });
      } catch (e) { /* non-fatal */ }
    }

    const card = await PaymentCard.create({
      owner: req.userId,
      stripeCustomerId: customerId,
      stripePaymentMethodId,
      brand: (pm.card.brand || 'other').toLowerCase(),
      last4: pm.card.last4,
      expMonth: pm.card.exp_month,
      expYear: pm.card.exp_year,
      holderName: pm.billing_details?.name || undefined,
      isDefault
    });

    res.status(201).json(cardDto(card));
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: 'Card already saved' });
    console.error('Save card error:', error);
    res.status(500).json({ error: 'Failed to save card', message: error.message });
  }
});

// POST /api/wallet/cards/:id/default
router.post('/cards/:id/default', authenticate, async (req, res) => {
  if (!requireStripe(res)) return;
  try {
    const card = await PaymentCard.findOne({ _id: req.params.id, owner: req.userId });
    if (!card) return res.status(404).json({ error: 'Card not found' });
    await PaymentCard.updateMany({ owner: req.userId }, { $set: { isDefault: false } });
    card.isDefault = true;
    await card.save();
    try {
      await stripe.customers.update(card.stripeCustomerId, { invoice_settings: { default_payment_method: card.stripePaymentMethodId } });
    } catch (e) { /* non-fatal */ }
    res.json(cardDto(card));
  } catch (error) {
    res.status(500).json({ error: 'Failed to set default card', message: error.message });
  }
});

// DELETE /api/wallet/cards/:id
router.delete('/cards/:id', authenticate, async (req, res) => {
  if (!requireStripe(res)) return;
  try {
    const card = await PaymentCard.findOne({ _id: req.params.id, owner: req.userId });
    if (!card) return res.status(404).json({ error: 'Card not found' });
    try { await stripe.paymentMethods.detach(card.stripePaymentMethodId); } catch (e) { /* non-fatal */ }
    await card.deleteOne();
    if (card.isDefault) {
      const alt = await PaymentCard.findOne({ owner: req.userId }).sort({ createdAt: -1 });
      if (alt) {
        alt.isDefault = true;
        await alt.save();
        try { await stripe.customers.update(card.stripeCustomerId, { invoice_settings: { default_payment_method: alt.stripePaymentMethodId } }); } catch (e) { /* non-fatal */ }
      }
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete card', message: error.message });
  }
});

// === Transfers ===

// GET /api/wallet/transfers — my transfers (sent or received)
router.get('/transfers', authenticate, async (req, res) => {
  try {
    const items = await Transfer.find({
      $or: [{ fromUser: req.userId }, { toUser: req.userId }]
    }).populate('fromUser', 'name role').populate('toUser', 'name role').sort({ createdAt: -1 }).limit(200);
    res.json(items.map(transferDto));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load transfers', message: error.message });
  }
});

// GET /api/wallet/summary — aggregates
router.get('/summary', authenticate, async (req, res) => {
  try {
    const agg = await Transfer.aggregate([
      { $match: { status: 'completed', $or: [{ fromUser: new mongoose.Types.ObjectId(req.userId) }, { toUser: new mongoose.Types.ObjectId(req.userId) }] } },
      { $group: {
          _id: null,
          incoming: { $sum: { $cond: [{ $eq: ['$toUser', new mongoose.Types.ObjectId(req.userId)] }, '$amount', 0] } },
          outgoing: { $sum: { $cond: [{ $eq: ['$fromUser', new mongoose.Types.ObjectId(req.userId)] }, '$amount', 0] } }
        }
      }
    ]);
    const s = agg[0] || { incoming: 0, outgoing: 0 };
    res.json({ incoming: s.incoming || 0, outgoing: s.outgoing || 0, net: (s.incoming || 0) - (s.outgoing || 0) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load summary', message: error.message });
  }
});

async function createTransferIntent(req, res, type, extra) {
  if (!requireStripe(res)) return;
  try {
    const { amount, toUserId, toSupplierId, toSupplierName, description, projectId, projectName, currency = 'usd', cardId } = req.body || {};
    const amt = Number(amount);
    if (!(amt > 0)) return res.status(400).json({ error: 'Amount must be > 0' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const customerId = await ensureCustomerId(user);

    let toUser;
    if (type === 'client_to_contractor') {
      if (!toUserId || !mongoose.Types.ObjectId.isValid(toUserId)) return res.status(400).json({ error: 'toUserId is required' });
      toUser = await User.findById(toUserId);
      if (!toUser) return res.status(404).json({ error: 'Recipient not found' });
    }

    // Resolve the card to charge (default if not provided)
    let card = null;
    if (cardId) card = await PaymentCard.findOne({ _id: cardId, owner: req.userId });
    if (!card) card = await PaymentCard.findOne({ owner: req.userId, isDefault: true });
    if (!card) card = await PaymentCard.findOne({ owner: req.userId }).sort({ createdAt: -1 });

    const metadata = {
      userId: user._id.toString(),
      role: user.role,
      type,
      toUserId: toUser ? toUser._id.toString() : '',
      toSupplierName: toSupplierName || '',
      projectId: projectId || '',
      description: description || ''
    };

    const intentParams = {
      amount: Math.round(amt * 100),
      currency: String(currency).toLowerCase(),
      customer: customerId,
      metadata,
    };
    // لا يمكن الجمع بين automatic_payment_methods و payment_method
    if (card) {
      intentParams.payment_method = card.stripePaymentMethodId;
      intentParams.payment_method_types = ['card'];
    } else {
      intentParams.automatic_payment_methods = { enabled: true };
    }

    const intent = await stripe.paymentIntents.create(intentParams);

    const transfer = await Transfer.create({
      type,
      amount: amt,
      currency: String(currency).toLowerCase(),
      status: 'pending',
      fromUser: req.userId,
      toUser: toUser ? toUser._id : undefined,
      toSupplier: toSupplierId && mongoose.Types.ObjectId.isValid(toSupplierId) ? toSupplierId : undefined,
      toSupplierName: toSupplierName || undefined,
      description,
      project: projectId && mongoose.Types.ObjectId.isValid(projectId) ? projectId : undefined,
      projectName,
      stripePaymentIntentId: intent.id,
      stripeClientSecret: intent.client_secret,
      cardLast4: card?.last4,
      cardBrand: card?.brand,
      ...extra
    });

    res.json({
      transfer: transferDto(transfer),
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      customerId,
      ephemeralKeySecret: (await stripe.ephemeralKeys.create({ customer: customerId }, { apiVersion: '2024-06-20' })).secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || undefined
    });
  } catch (error) {
    console.error(`Create ${type} intent error:`, error);
    res.status(500).json({ error: `Failed to create ${type} intent`, message: error.message });
  }
}

// POST /api/wallet/transfers/client-to-contractor
router.post('/transfers/client-to-contractor', authenticate, async (req, res) => {
  if (req.userRole && req.userRole !== 'client') {
    return res.status(403).json({ error: 'Only clients can pay contractors' });
  }
  return createTransferIntent(req, res, 'client_to_contractor', {});
});

// POST /api/wallet/transfers/contractor-to-supplier
router.post('/transfers/contractor-to-supplier', authenticate, async (req, res) => {
  if (req.userRole && req.userRole !== 'contractor') {
    return res.status(403).json({ error: 'Only contractors can pay suppliers' });
  }
  return createTransferIntent(req, res, 'contractor_to_supplier', {});
});

// POST /api/wallet/transfers/:id/confirm — refresh status from Stripe
router.post('/transfers/:id/confirm', authenticate, async (req, res) => {
  if (!requireStripe(res)) return;
  try {
    const t = await Transfer.findOne({ _id: req.params.id, fromUser: req.userId });
    if (!t) return res.status(404).json({ error: 'Transfer not found' });
    if (!t.stripePaymentIntentId) return res.status(400).json({ error: 'No Stripe PaymentIntent attached' });
    const intent = await stripe.paymentIntents.retrieve(t.stripePaymentIntentId);
    t.status = mapIntentStatus(intent.status);
    await t.save();
    const populated = await t.populate([{ path: 'fromUser', select: 'name role' }, { path: 'toUser', select: 'name role' }]);
    res.json(transferDto(populated));
  } catch (error) {
    res.status(500).json({ error: 'Failed to confirm transfer', message: error.message });
  }
});

function mapIntentStatus(s) {
  switch (s) {
    case 'succeeded': return 'completed';
    case 'processing': return 'processing';
    case 'canceled': return 'cancelled';
    case 'requires_payment_method':
    case 'requires_confirmation':
    case 'requires_action':
      return 'pending';
    default: return 'pending';
  }
}

module.exports = router;
module.exports.mapIntentStatus = mapIntentStatus;
