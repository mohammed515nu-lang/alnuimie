const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load .env file explicitly from server directory
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Debug: Log environment variables (only first few chars for security)
console.log('Environment check:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...' : 'MISSING');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'SET (' + process.env.GOOGLE_CLIENT_SECRET.length + ' chars)' : 'MISSING');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'NOT SET');

const app = express();
const PORT = process.env.PORT || 4000;

// CORS Configuration - أمان محسّن
// Production: يجب تحديد origins المسموح بها صراحةً
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : [
      'http://localhost:3000',
      'http://localhost:8081', // Expo web (dev)
      'http://localhost:19006', // Expo web
      'https://alnuimie.onrender.com', // Legacy API host
      'https://construction-backend-2xi2.onrender.com',
      'https://alnuimie515.vercel.app', // Production frontend
    ];

const corsOptions = {
  origin: function (origin, callback) {
    // السماح للـ requests بدون origin (مثل mobile apps أو curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Idempotency-Key']
};
app.use(cors(corsOptions));

// Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // للسماح بالـ API من مصادر مختلفة
}));

// Rate Limiting - حماية من هجمات Brute Force
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // 100 طلب لكل IP
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/api/health', // استثناء health check
});
app.use('/api/', apiLimiter);

// Rate Limiting خاص بالـ auth - أكثر صرامة
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // ساعة واحدة
  max: 10, // 10 محاولات فقط
  message: { error: 'Too many login attempts, please try again after an hour.' },
  skipSuccessfulRequests: true, // لا تحسب الطلبات الناجحة
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Stripe webhook يجب تسجيله قبل express.json() (يحتاج raw body)
const stripeModule = require('./routes/stripe');
app.use('/api/stripe/webhook', stripeModule.webhookRouter);

// زيادة حد حجم الطلب لدعم الصور الكبيرة (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/construction-management';

mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false, // تعطيل Buffering لأخطاء أسرع
})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // توقف السيرفر إذا لم يتصل بقاعدة البيانات
  });

app.get('/', (req, res) => {
  res.json({ 
    message: 'Construction Management API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint - متاح فقط في Development
app.get('/api/debug/env', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Debug endpoint is disabled in production' });
  }
  res.json({
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    googleClientIdPrefix: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...' : 'MISSING',
    googleClientIdLength: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.length : 0,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    frontendUrl: process.env.FRONTEND_URL || 'NOT SET',
    nodeEnv: process.env.NODE_ENV || 'NOT SET',
    port: process.env.PORT || 'NOT SET',
    mongodbConnected: mongoose.connection.readyState === 1
  });
});

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/users');
const materialRoutes = require('./routes/materials');
const supplierRoutes = require('./routes/suppliers');
const purchaseRoutes = require('./routes/purchases');
const paymentRoutes = require('./routes/payments');
const issueRoutes = require('./routes/issues');
const contractRoutes = require('./routes/contracts');
const requestRoutes = require('./routes/requests');
const reportRoutes = require('./routes/reports');
// stripeModule مُعرَّف سابقاً — لا نعيد require لتجنب التسجيل المزدوج للـ Webhook
const stripeRoutes = stripeModule;
const portfolioRoutes = require('./routes/portfolio');
const connectionRoutes = require('./routes/connections');
const ratingRoutes = require('./routes/ratings');
const chatRoutes = require('./routes/chats');
const walletRoutes = require('./routes/wallet');
const aiRoutes = require('./routes/ai');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler - يجب أن يكون بعد جميع routes
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: 'Request not found',
    url: req.originalUrl,
    method: req.method,
    data: {}
  });
});

// Error handler - يجب أن يكون بعد 404 handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Server error',
    message: err.message 
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

