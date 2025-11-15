# 🚀 إعداد المشروع من الصفر

## 📋 الخطوات الكاملة لإعداد المشروع

---

## 1️⃣ تثبيت Node Modules

### Frontend:
```bash
npm install
```

### Backend:
```bash
cd server
npm install
```

---

## 2️⃣ إنشاء ملف .env

### Frontend (.env في المجلد الرئيسي):
```env
REACT_APP_API_URL=http://localhost:4000
```

### Backend (.env في مجلد server/):
```env
MONGODB_URI=mongodb://localhost:27017/construction-management
# أو
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/construction-management

PORT=4000
JWT_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:3000
```

---

## 3️⃣ عمل Build للـ Frontend

```bash
npm run build
```

هذا سينشئ مجلد `build/` يحتوي على الملفات الجاهزة للنشر.

---

## 4️⃣ إعداد Git (.git)

### إذا لم يكن Git موجوداً:

#### أ. تثبيت Git:
- تحميل من: https://git-scm.com/download/win
- تثبيت Git

#### ب. تهيئة Git في المشروع:
```bash
git init
```

#### ج. إضافة ملفات:
```bash
git add .
```

#### د. عمل Commit:
```bash
git commit -m "Initial commit"
```

#### هـ. ربط مع GitHub (اختياري):
```bash
git remote add origin https://github.com/username/repository-name.git
git push -u origin main
```

---

## 5️⃣ إنشاء .gitignore

أنشئ ملف `.gitignore` في المجلد الرئيسي:

```
# Dependencies
node_modules/
server/node_modules/

# Build
build/
dist/

# Environment
.env
server/.env

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Temporary
*.tmp
*.temp
```

---

## 📝 ملخص الأوامر الكاملة

### 1. تثبيت Dependencies:
```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 2. إنشاء ملفات .env:
- Frontend: `.env`
- Backend: `server/.env`

### 3. عمل Build:
```bash
npm run build
```

### 4. إعداد Git:
```bash
git init
git add .
git commit -m "Initial commit"
```

---

## ✅ التحقق من الإعداد

### Frontend:
```bash
npm start
```
يجب أن يعمل على: `http://localhost:3000`

### Backend:
```bash
cd server
npm run dev
```
يجب أن يعمل على: `http://localhost:4000`

---

## 🆘 حل المشاكل

### مشكلة: npm install فشل
```bash
# حذف node_modules و package-lock.json
rm -rf node_modules package-lock.json
rm -rf server/node_modules server/package-lock.json

# إعادة التثبيت
npm install
cd server && npm install
```

### مشكلة: Build فشل
- تحقق من الأخطاء في Terminal
- تأكد من تثبيت جميع Dependencies
- تحقق من ملف `.env`

### مشكلة: Git لا يعمل
- تأكد من تثبيت Git
- تحقق من الأمر: `git --version`

---

## 📚 مراجع إضافية

- [Node.js Documentation](https://nodejs.org/)
- [Git Documentation](https://git-scm.com/doc)
- [React Documentation](https://reactjs.org/)

























































