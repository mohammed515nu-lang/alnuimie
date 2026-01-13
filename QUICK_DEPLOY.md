# ⚡ دليل النشر السريع

## ✅ الخطوات السريعة

### 1️⃣ رفع المشروع إلى GitHub
```bash
git add .
git commit -m "تحديثات المشروع"
git push origin main
```

### 2️⃣ نشر Backend على Render

1. اذهب إلى [render.com](https://render.com)
2. **New +** → **Web Service**
3. اربط GitHub Repository: `mohammed515nu-lang/alnuimie`
4. الإعدادات:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your-mongodb-uri
   JWT_SECRET=your-secret-key
   ```
6. انسخ رابط Backend (مثل: `https://construction-backend-xxxx.onrender.com`)

### 3️⃣ نشر Frontend على Vercel

1. اذهب إلى [vercel.com](https://vercel.com)
2. **Add New...** → **Project**
3. اربط GitHub Repository: `mohammed515nu-lang/alnuimie`
4. Environment Variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```
5. انسخ رابط Frontend (مثل: `https://alnuimie.vercel.app`)

### 4️⃣ تحديث Backend

في Render Dashboard:
- أضف `FRONTEND_URL` برابط Vercel
- احفظ التغييرات (سيتم إعادة التشغيل تلقائياً)

---

## 📚 للمزيد من التفاصيل

راجع: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 🔗 الروابط

- **GitHub**: https://github.com/mohammed515nu-lang/alnuimie
- **Vercel**: https://vercel.com
- **Render**: https://render.com
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
