# 🔧 إصلاح مشكلة Build في Render

## ❌ المشكلة
```
Unknown command: "build"
--> Build failed 😞
```

## ✅ الحل

### المشكلة:
Render يحاول تشغيل `npm build` لكن Backend لا يحتاج build command، فقط `npm install`.

### الحل السريع:

#### 1️⃣ اذهب إلى Render Dashboard
افتح: https://dashboard.render.com

#### 2️⃣ افتح Backend Service
- ابحث عن Service: `alnuimie` أو `construction-backend`
- اضغط عليه

#### 3️⃣ افتح Settings
- اضغط على تبويب **"Settings"** من القائمة الجانبية

#### 4️⃣ تصحيح Build Command
في قسم **"Build Command"**:
- **غير من**: `npm build` أو أي شيء آخر
- **إلى**: `npm install`
- أو اتركه **فارغاً** (Render سيستخدم `npm install` تلقائياً)

#### 5️⃣ تصحيح Start Command
في قسم **"Start Command"**:
- تأكد أنه: `npm start`

#### 6️⃣ تصحيح Root Directory
في قسم **"Root Directory"**:
- تأكد أنه: `server`

#### 7️⃣ حفظ التغييرات
- اضغط **"Save Changes"** في الأسفل
- Render سيعيد النشر تلقائياً

---

## 📋 الإعدادات الصحيحة

### Build Command:
```
npm install
```
أو اتركه **فارغاً**

### Start Command:
```
npm start
```

### Root Directory:
```
server
```

### Environment:
```
Node
```

---

## ✅ بعد التصحيح

1. Render سيعيد النشر تلقائياً
2. انتظر 2-5 دقائق
3. تحقق من Logs - يجب أن ترى:
   ```
   --> Running build command 'npm install'
   --> Build succeeded ✅
   --> Starting service...
   Server running on port 10000
   ```

---

## 🔍 إذا استمرت المشكلة

### تحقق من:
1. **Root Directory** = `server` (مهم جداً!)
2. **Build Command** = `npm install` أو فارغ
3. **Start Command** = `npm start`
4. **Environment** = `Node`

### راجع Logs:
- اذهب إلى تبويب **"Logs"**
- ابحث عن أخطاء أخرى

---

**⏱️ الوقت المتوقع: 5 دقائق**
