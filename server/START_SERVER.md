# 🚀 كيفية تشغيل السيرفر

## 📍 موقع ملفات السيرفر

السيرفر موجود في مجلد `server/` في المشروع الرئيسي:
```
alnuimie-main/
└── server/
    ├── server.js          # الملف الرئيسي للسيرفر
    ├── package.json       # المكتبات المطلوبة
    ├── routes/            # مسارات API
    ├── models/            # نماذج قاعدة البيانات
    └── .env               # متغيرات البيئة (يجب إنشاؤه)
```

---

## ⚙️ الإعداد الأولي

### 1. الانتقال لمجلد السيرفر
```bash
cd server
```

### 2. تثبيت المكتبات (إذا لم تكن مثبتة)
```bash
npm install
```

### 3. إنشاء ملف `.env`
أنشئ ملف `.env` في مجلد `server/` وأضف:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/construction-management
# أو استخدم MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/construction-management

# JWT Secret
JWT_SECRET=your-secret-key-here

# Port
PORT=4000

# Frontend URL (للتطوير)
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

---

## 🚀 تشغيل السيرفر

### الطريقة 1: استخدام ملف .bat (Windows)
```bash
# من المجلد الرئيسي
شغل-السيرفر.bat

# أو من مجلد server
cd server
شغل-السيرفر.bat
```

### الطريقة 2: من Terminal
```bash
cd server
npm run dev    # للتطوير (مع nodemon)
# أو
npm start      # للإنتاج
```

---

## ✅ التحقق من أن السيرفر يعمل

افتح المتصفح واذهب إلى:
- `http://localhost:4000` - يجب أن ترى رسالة ترحيب
- `http://localhost:4000/api/health` - يجب أن ترى حالة السيرفر

---

## 📱 استخدام السيرفر مع تطبيق الموبايل

### الخيار 1: استخدام Backend على Render (موصى به) ✅

**لا حاجة لتشغيل السيرفر محلياً!**

التطبيق يستخدم Backend على Render تلقائياً:
- `https://construction-backend-nw0g.onrender.com/api`

**هذا هو الخيار الأسهل والأفضل!**

---

### الخيار 2: استخدام السيرفر المحلي

إذا أردت استخدام السيرفر المحلي على هاتفك:

1. **تأكد أن السيرفر يعمل:**
   ```bash
   cd server
   npm run dev
   ```

2. **اعرف IP جهازك:**
   - Windows: `ipconfig` (ابحث عن IPv4)
   - Mac/Linux: `ifconfig`

3. **غيّر API URL في تطبيق الموبايل:**
   
   في `alnuimie-mobile/src/api/index.js`:
   ```javascript
   const API_BASE_URL = 'http://YOUR_IP:4000/api';
   // مثال: http://192.168.1.100:4000/api
   ```

4. **تأكد أن الكمبيوتر والهاتف على نفس WiFi**

---

## 🔧 حل المشاكل

### المشكلة: السيرفر لا يعمل
```bash
# تحقق من أن MongoDB يعمل
# Windows: تحقق من Services
# Mac/Linux: sudo systemctl status mongod

# تحقق من المنفذ 4000
netstat -ano | findstr :4000
```

### المشكلة: خطأ في الاتصال بقاعدة البيانات
- تأكد من أن MongoDB يعمل
- تحقق من `MONGODB_URI` في ملف `.env`

### المشكلة: CORS Error
- السيرفر محدّث للسماح بالاتصال من أي مصدر
- إذا استمرت المشكلة، تأكد من إعدادات CORS في `server.js`

---

## 📝 ملاحظات مهمة

1. **للاستخدام العادي:** لا حاجة لتشغيل السيرفر محلياً - استخدم Render
2. **للتطوير:** يمكنك تشغيل السيرفر محلياً للاختبار
3. **للإنتاج:** استخدم Render أو أي خدمة استضافة أخرى

---

**السيرفر جاهز للاستخدام! 🎉**
